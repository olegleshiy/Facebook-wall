//Core
import React, { Component } from 'react';
import { string, func, arrayOf, shape } from 'prop-types';
import cx from 'classnames';

//Components
import { withProfile } from '../HOC/withProfile';

//Instruments
import Styles from './styles.m.css';

@withProfile
export default class Like extends Component {
    static propTypes = {
        _likePost: func.isRequired,
        id: string.isRequired,
        likes: arrayOf(
            shape({
                id:        string.isRequired,
                firstName: string.isRequired,
                lastName:  string.isRequired,
            })
        ).isRequired,
    };

    state = {
        showLikes: false
    };



    _showLikes = () => {
        this.setState({
            showLikes: true,
        });
    };

    _hideLikes = () => {
        this.setState({
            showLikes: false,
        });
    };

    _likePost = () => {
        const { _likePost, id } = this.props;

        _likePost(id);
    };

    _getLikedByMe = () => {
        const { currentUserFirstName, currentUserLastName, likes } = this.props;

        return likes.some(({ firstName, lastName }) => {
            return `${firstName} ${lastName}` ===  `${currentUserFirstName} ${currentUserLastName}`;
        })
    };

    _getLikeStyles = () => {
        const likedByMe = this._getLikedByMe();

        return cx(Styles.icon, {
            [Styles.liked]: likedByMe,
        });
    };

    _getLikesList = () => {
        const { showLikes } = this.state;
        const { likes } = this.props;

        const likesJSX = likes.map(({ firstName, lastName, id }) => (
            <li key = { id }>{`${firstName} ${lastName}`}</li>
        ));

        return likes.length && showLikes ? <ul>{ likesJSX }</ul> : null;
    };

    _getLikesDescription = () => {
        const { likes, currentUserFirstName, currentUserLastName } = this.props;
        const likedByMe = this._getLikedByMe();

        if (likes.length === 1 && likedByMe) {
            return `${currentUserFirstName} ${currentUserLastName}`;
        } else if (likes.length === 2 && likedByMe) {
            return `You and ${likes.length - 1} other`;
        } else if (likedByMe) {
            return `You and ${likes.length - 1} others`;
        } else {
            return likes.length;
        }
    };


    render() {
        const likeStyles = this._getLikeStyles();
        const likesList = this._getLikesList();
        const likesDescription = this._getLikesDescription();

        return (
            <section className = { Styles.like }>
                <span className = { likeStyles } onClick = { this._likePost }>Like</span>
                <div>
                    {likesList}
                    <span
                        onMouseEnter = { this._showLikes }
                        onMouseLeave = { this._hideLikes }
                    >{likesDescription}</span>
                </div>
            </section>
        )
    }
}