// Core
import React, { Component } from 'react';

//Components
import Catcher from '../../components/Catcher';
import StatusBar from '../../components/StatusBar';
import Feed from '../../components/Feed';
import Profile from '../../components/Profile';
import Login from '../../components/Login';
import { Provider } from '../../components/HOC/withProfile';
import { Switch, Route, Redirect } from 'react-router-dom';

//Instruments
import avatar from '../../theme/assets/oleg.png';

export default class App extends Component {
    constructor () {
        super();

        this.state = {
            avatar,
            currentUserFirstName: 'Олег',
            currentUserLastName: 'Загребельный',
            isLogin: this.getItemLocalStorage(),
        };
    }

    _setLoginStateTrue = () => {
        this.setState({
            isLogin: true,
        }, () => localStorage.setItem('isLogin', this.state.isLogin));
    };

    _setLoginStateFalse = () => {
        this.setState({
            isLogin: false,
        }, () => localStorage.setItem('isLogin', this.state.isLogin));
    };

    getItemLocalStorage = () => {
        const valueStorage = localStorage.getItem('isLogin');
        console.log('valueStorage', JSON.parse(valueStorage));
        return JSON.parse(valueStorage);
    };

    render() {
        const { isLogin } = this.state;

        return (
            <Catcher>
                <Provider value = { this.state }>
                    <StatusBar _setLoginStateFalse = { this._setLoginStateFalse } />
                    <Switch>
                        <Route
                            path = '/login'
                            render = { (props) => (
                                <Login _setLoginStateTrue = { this._setLoginStateTrue } { ...props } />
                            ) }
                        />
                        { !isLogin && <Redirect to = '/login' /> }
                        <Route component = { Feed } path = '/feed' />
                        <Route component = { Profile } path = '/profile' />
                        <Route component = { Login } path = '/login' />
                        <Redirect to = '/feed' />
                    </Switch>
                </Provider>
            </Catcher>
        );
    }
}
