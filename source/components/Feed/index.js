//Core
import React, { Component } from 'react';

//Instruments
import StatusBar from '../StatusBar';
import Composer from '../Composer';
import Post from '../Post';
import Spinner from '../Spinner';

//Instruments
import Styles from './styles.m.css';

export default class Feed extends Component{
    state = {
        posts: [
            { id: '123', comment: 'Hi there!', created: 1559952000 },
            { id: '345', comment: 'Hello!', created: 1559952000 }
        ],
        isDownloadDOM: true,
    };

    render() {
        const { posts, isDownloadDOM } = this.state;

        setTimeout(()=>{
            this.setState({ isDownloadDOM: false });
        }, 1000);

        const postsJSX = posts.map((post) => {
            return <Post key = { post.id } { ...post } />
        });

        return (
            <section className = { Styles.feed }>
                <Spinner isSpinning = { isDownloadDOM } />
                <StatusBar />
                <Composer />
                { postsJSX }
            </section>
        );
    }
}