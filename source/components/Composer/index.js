//Core
import React, { Component } from 'react';
import { Consumer } from "../HOC/withProfile";

//Instruments
import Styles from './styles.m.css';

export default class Composer extends Component{
    render() {

        return (
            <Consumer>
                {(context) => (
                    <section className = { Styles.composer }>
                        <img src = { context.avatar } />
                        <form>
                            <textarea placeholder={`Wat's on your mind, ${ context.currentUserFirstName }?`} />
                            <input type='submit' value='post'/>
                        </form>
                    </section>
                )}
            </Consumer>
        );
    }
}