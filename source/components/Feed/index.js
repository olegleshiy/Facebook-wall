//Core
import React, { Component } from 'react';

//Components
import { withProfile } from '../HOC/withProfile';
import Catcher from '../../components/Catcher';
import StatusBar from '../StatusBar';
import Composer from '../Composer';
import Post from '../Post';
import Spinner from '../Spinner';

//Instruments
import Styles from './styles.m.css';
import { api, TOKEN, GROUP_ID } from '../../config/api';
import { socket } from "../../socket/init";


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

        {/*posts:     posts.filter((post) => post.id !== id)*/}

        this.setState(({posts}) => ({
            posts:         ((id)=>{posts.splice(id, 1); return posts})(),
            isDownloadDOM: false,
        }));
    };

    render() {
        const { posts, isDownloadDOM } = this.state;

        const postsJSX = posts.map((post) => {
            return (
                <Catcher key = { post.id }>
                    <Post
                        { ...post }
                        _likePost = { this._likePost }
                        _removePost = { this._removePost }
                    />
                </Catcher>
            )
        });

        return (
            <section className = { Styles.feed }>
                <Spinner isSpinning = { isDownloadDOM } />
                <StatusBar />
                <Composer _createPost = { this._createPost } />
                { postsJSX }
            </section>
        );
    }
}

export default withProfile(Feed);