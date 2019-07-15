//Core
import React, { Component } from 'react';

//Components
import { withProfile } from '../HOC/withProfile';

//Instruments
import Styles from './styles.m.css';

class Login extends Component {

    state = {
        login: '',
    };

    _updateLogin = (event) => {
        this.setState({
            login: event.target.value,
        });
    };

    _handleFormSubmit = (event) => {
        event.preventDefault();

        const { login } = this.state;

        const value = event.target.elements[0].value;

        if(login){
            localStorage.setItem('isLogin', value);
            this.setState( {
                login: '',
            });
            this.props._setLoginState(true);
        }
        return null;
    };

    render() {
        const { login } = this.state;
        return (
            <section className = { Styles.login }>
                <form onSubmit = { this._handleFormSubmit }>
                    <input
                        type = 'text'
                        placeholder = 'login'
                        value = { login }
                        onChange = { this._updateLogin }
                    />
                    <input type = 'submit' value = 'Sign in' />
                </form>
            </section>
        );
    }
}

export default withProfile(Login);
