// Core
import React, { Component } from 'react';

//Components
import Catcher from '../../components/Catcher';
import Feed from '../../components/Feed';
import { Provider } from '../../components/HOC/withProfile';

//Instruments
import avatar from '../../theme/assets/lisa.png';

const options = {
    avatar,
    currentUserFirstName: 'Олег',
    currentUserLastName: 'Загребельный',
};

export default class App extends Component {
    render() {
        return (
            <Catcher>
                <Provider value = { options }>
                    <Feed />
                </Provider>
            </Catcher>
        );
    }
}
