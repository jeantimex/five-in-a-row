import React, { Component, PropTypes } from  'react';
import { browserHistory } from 'react-router';

import cx from 'classnames';

import TextField from 'material-ui/lib/text-field';
import IconButton from 'material-ui/lib/icon-button';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import RaisedButton from 'material-ui/lib/raised-button';
import CircularProgress from 'material-ui/lib/circular-progress';

import './styles/home.css';

const buttonStyle = {
    margin: 20
};

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errorText: '',
            nameFieldValue: '',
            isWaiting: false,
            players: [],
            watchers: []
        };
    }

    componentWillMount() {
        // Initialize socket
        this.initSocket();
    }

    componentWillUnmount() {
        this.socket.off('updateConnection');
    }

    initSocket() {
        this.socket = this.props.socket;
        this.socket.on('updateConnection', this.updateConnection.bind(this));
    }

    // -------------------------------
    //  Server Socket Event Handlers
    // -------------------------------

    updateConnection(connections) {
        console.log('update connections');
        console.log(connections);
        const { players, watchers } = connections;

        this.setState({
            players,
            watchers
        });

        if (players.length >= 2 && (this.isPlayer() || this.isWatcher())) {
            browserHistory.push('/game');
        }
    }

    onNameFieldChange(e) {
        this.setState({
            nameFieldValue: e.target.value
        });
    }

    join(color) {
        const { nameFieldValue } = this.state;

        if (nameFieldValue.length === 0) {
            this.setState({
                errorText: 'This field is required'
            });
            return;
        }
        
        this.socket.emit('join', {
            color,
            name: nameFieldValue
        });

        this.setState({
            isWaiting: true
        });
    }

    isPlayer() {
        const { players } = this.state;
        const sid = this.socket.id;
        return players.findIndex(function (player) { return player.id === sid }) >= 0;
    }

    isWatcher() {
        const { watchers } = this.state;
        const sid = this.socket.id;
        return watchers.findIndex(function (watcher) { return watcher.id === sid }) >= 0;
    }

    isPicked(color) {
        return this.state.players.findIndex(function (player) { return player.color === color }) >= 0;
    }

    render() {
        const { errorText, isWaiting, players, watchers } = this.state;

        const chessOptionClassName = cx('options', {
            hidden: players.length >= 2 || this.isPlayer()
        });

        const watchOptionClassName = cx('options', {
            hidden: players.length < 2 || this.isPlayer()
        });

        const isBlackPicked = this.isPicked(0);
        const isWhitePicked = this.isPicked(1);

        return (
            <div className='home-container'>
                {/* Name field */}
                <TextField
                    hintText='Enter your name'
                    errorText={ errorText }
                    onChange={ this.onNameFieldChange.bind(this) }
                />

                { isWaiting && <CircularProgress /> }

                {/* Select chess piece color */}
                <div className={ chessOptionClassName }>
                    <p>Pick your chess piece color:</p>
                    <FloatingActionButton
                        backgroundColor='black'
                        style={ buttonStyle }
                        onMouseDown={ this.join.bind(this, 0) }
                        disabled={ isBlackPicked }
                    />
                    <FloatingActionButton
                        backgroundColor='white'
                        style={ buttonStyle }
                        onMouseDown={ this.join.bind(this, 1) }
                        disabled={ isWhitePicked }
                    />
                </div>
                
                {/* Game has started */}
                <div className={ watchOptionClassName }>
                    <p>Game has started</p>
                    <RaisedButton
                        label='Watch'
                        secondary={true}
                        style={ buttonStyle }
                        onMouseDown={ this.join.bind(this, -1) }
                    />
                </div>
            </div>
        );
    }

}

Home.propTypes = {
    socket: PropTypes.object
};

export default Home;