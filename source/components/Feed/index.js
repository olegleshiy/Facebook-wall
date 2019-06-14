//Core
import React, { Component } from 'react';
import moment from 'moment';

//Components
import { withProfile } from '../HOC/withProfile';
import StatusBar from '../StatusBar';
import Composer from '../Composer';
import Post from '../Post';
import Spinner from '../Spinner';

//Instruments
import Styles from './styles.m.css';
import { getUniqueID, delay } from '../../instruments';

@withProfile
export default class Feed extends Component{
    state = {
        posts: [
            {
                id: '123',
                comment: 'Hi there!',
                created: 1559952000,
                likes: []
            },
            {
                id: '345',
                comment: 'Hello!',
                created: 1559952000,
                likes: []
            }
        ],
        isDownloadDOM: false,
    };

    _setDownloadDOMState = (state) => {
        this.setState({
            isDownloadDOM: state,
        })
    };

    _createPost = async (comment) => {
        this._setDownloadDOMState(true);

        const post = {
            id:       getUniqueID(),
            created:  moment.utc(),
            comment,
            likes: [],
        };

        await delay(1200);

        this.setState(({ posts }) => ({
            posts: [post, ...posts],
            isDownloadDOM: false,
        }));
    };

    _likePost = async (id) => {
        const { currentUserFirstName, currentUserLastName } = this.props;
        this._setDownloadDOMState(true);

        await delay(1200);

        const newPost = this.state.posts.map(post => {
            if (post.id === id) {
                return {
                    ...post,
                    likes: [
                        {
                            id:        getUniqueID(),
                            firstName: currentUserFirstName,
                            lastName:  currentUserLastName,
                        }
                    ]
                }
            }
            return post;
        });

        this.setState({
            posts:         newPost,
            isDownloadDOM: false,
        });
    };

    _removePost = async (id) => {
        this._setDownloadDOMState(true);

        await delay(1200);

        this.setState(({posts}) => ({
            posts:         posts.filter((post) => post.id !== id),
            isDownloadDOM: false,
        }));
    };

    render() {
        const { posts, isDownloadDOM } = this.state;

        const postsJSX = posts.map((post) => {
            return <Post
                key = { post.id }
                { ...post }
                _likePost = { this._likePost }
                _removePost = { this._removePost }
            />
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