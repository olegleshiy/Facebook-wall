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

    state = {
        options: {
            avatar,
            currentUserFirstName: 'Олег',
            currentUserLastName: 'Загребельный',
            isLogin: false,
        },
    };

    _setLoginState = (state) => {

        this.setState({options:{
                avatar,
                currentUserFirstName: 'Олег',
                currentUserLastName: 'Загребельный',
                isLogin: state,
            }
        });
    };

    render() {
        const { isLogin } = this.state.options;

        return (
            <Catcher>
                <Provider value = { this.state.options } >
                    <StatusBar />
                        <Switch>
                            <Route path='/login'
                                   render = {() =>
                                       <Login _setLoginState = { this._setLoginState } />
                                   }
                            />
                            { !isLogin && <Redirect to = '/login' /> }
                            <Route component = { Feed } path = '/feed' />
                            <Route component = { Profile } path='/profile'/>
                            <Redirect to = '/feed' />
                        </Switch>
                </Provider>
            </Catcher>
        );
    }
}
