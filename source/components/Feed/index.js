//Core
import React, { Component } from 'react';
import { Transition, CSSTransition, TransitionGroup } from 'react-transition-group';
import { fromTo } from 'gsap';

//Components
import { withProfile } from '../HOC/withProfile';
import Catcher from '../../components/Catcher';
import StatusBar from '../StatusBar';
import Composer from '../Composer';
import Post from '../Post';
import Spinner from '../Spinner';
import Postman from '../Postman';
import Counter from '../Counter';

//Instruments
import Styles from './styles.m.css';
import { api, TOKEN, GROUP_ID } from '../../config/api';
import { socket } from '../../socket/init';


class Feed extends Component{
    state = {
        posts: [],
        isDownloadDOM: false,
    };

    componentDidMount () {
        const { currentUserFirstName, currentUserLastName } = this.props;
        this._fetchPosts();

        socket.emit('join', GROUP_ID);

        socket.on('create', (postJSON) => {
            const { data: createdPost, meta } = JSON.parse(postJSON);

            if (`${currentUserFirstName} ${currentUserLastName}` !== `${meta.authorFirstName} ${meta.authorLastName}`) {
                this.setState(({posts}) => ({
                    posts: [createdPost, ...posts]
                }));
            }
        });

        socket.on('remove', (postJSON) => {
            const { data: removedPost, meta } = JSON.parse(postJSON);

            if (`${currentUserFirstName} ${currentUserLastName}` !== `${meta.authorFirstName} ${meta.authorLastName}`) {
                this.setState(({posts}) => ({
                    posts: posts.filter((post) => post.id !== removedPost.id),
                }));
            }
        });

        socket.on('like', (postJSON) => {
            const { data: likedPost, meta } = JSON.parse(postJSON);

            if (`${currentUserFirstName} ${currentUserLastName}` !== `${meta.authorFirstName} ${meta.authorLastName}`) {
                this.setState(({ posts }) => ({
                    posts: posts.map(
                        (post) => post.id === likedPost.id ? likedPost : post,
                    ),
                }));
            }

        });
    }

    componentWillUnmount () {
        socket.removeListener('create');
        socket.removeListener('remove');
        socket.removeListener('like');
    }

    _setDownloadDOMState = (state) => {
        this.setState({
            isDownloadDOM: state,
        })
    };

    _fetchPosts = async () => {
        this._setDownloadDOMState(true);

        const response = await fetch(api, {
            method: 'GET',
        });

        const { data: posts } = await response.json();

        this.setState({
            posts,
            isDownloadDOM: false,
        });
    };

    _createPost = async (comment) => {
        this._setDownloadDOMState(true);

        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: TOKEN,
            },
            body: JSON.stringify({ comment }),
        });

        const { data: post } = await response.json();

        this.setState(({ posts }) => ({
            posts: [post, ...posts],
            isDownloadDOM: false,
        }));
    };

    _likePost = async (id) => {
        this._setDownloadDOMState(true);

        const response = await fetch(`${api}/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: TOKEN,
            },
        });

        const { data: likedPost } = await response.json();

        this.setState(({ posts }) => ({
            posts: posts.map(
                (post) => post.id === likedPost.id ? likedPost : post,
            ),
            isDownloadDOM: false,
        }));
    };

    _removePost = async (id) => {
        this._setDownloadDOMState(true);

        await fetch(`${api}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });

        this.setState(({posts}) => ({
            posts:         posts.filter((post) => post.id !== id),
            isDownloadDOM: false,
        }));
    };

    _animateComposerEnter = (composer) => {
        fromTo(composer, 1, { opacity: 0 }, { opacity: 1 });
    };

    _animatePostmanEntering = (postman) => {
        fromTo(postman, 1, { opacity: 0, right: -200 }, { opacity: 1, right: 30});
    };

    _animatePostmanEntered = (postman) => {
        fromTo(postman, 1, { opacity: 1, right: 30 }, { opacity: 0, left: -3000});
    };


    render() {
        const { posts, isDownloadDOM } = this.state;

        const postsJSX = posts.map((post) => {
            return (
                <CSSTransition
                    classNames = {{
                        enter: Styles.postInStart,
                        enterActive: Styles.postInEnd,
                        exit: Styles.postOutStart,
                        exitActive: Styles.postOutEnd,
                    }}
                    key = { post.id }
                    timeout = { {
                        enter: 500,
                        exit: 400,
                    } }>
                    <Catcher>
                        <Post
                            { ...post }
                            _likePost = { this._likePost }
                            _removePost = { this._removePost }
                        />
                    </Catcher>
                </CSSTransition>
            )
        });

        return (
            <section className = { Styles.feed }>
                <Spinner isSpinning = { isDownloadDOM } />
                <StatusBar />
                <Transition
                    in
                    appear
                    timeout = { 1000 }
                    onEnter = { this._animateComposerEnter }>
                    <Composer _createPost = { this._createPost } />
                </Transition>
                <Counter count = { postsJSX.length } />
                <Transition
                    in
                    appear
                    timeout = { 4000 }
                    onEntering = { this._animatePostmanEntering }
                    onEntered = { this._animatePostmanEntered }>
                    <Postman />
                </Transition>
                <TransitionGroup>{ postsJSX }</TransitionGroup>
            </section>
        );
    }
}

export default withProfile(Feed);