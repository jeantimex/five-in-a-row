import React, { Component, PropTypes } from  'react';
import { browserHistory } from 'react-router';

import cx from 'classnames';

class Game extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentWillMount() {
        this.checkConnection(this.props);
    }

    componentWillReceiveProps(props) {
        this.checkConnection(props);
    }

    checkConnection(props) {
        const { players, isPlayer, isWatcher } = props;

        if (players.length < 2) {
            browserHistory.push('/');
        }
    }

    render() {
        return (
            <div>
                Game
            </div>
        );
    }

}

export default Game;