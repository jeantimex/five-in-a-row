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
            nameFieldValue: ''
        };
    }

    componentWillMount() {
        this.checkProps(this.props);
    }

    componentWillReceiveProps(props) {
        this.checkProps(props);
    }

    checkProps(props) {
        const { players, user } = props;

        if (players.length >= 2 && (user.isPlayer || user.isWatcher)) {
            browserHistory.push('/game');
        }
    }

    onNameFieldChange(e) {
        this.setState({
            nameFieldValue: e.target.value
        });
    }

    join(color) {
        const { emit } = this.props;
        const { nameFieldValue } = this.state;

        if (nameFieldValue.length === 0) {
            this.setState({
                errorText: 'This field is required'
            });
            return;
        }
        
        if (emit) {
            emit('join', {
                color,
                name: nameFieldValue
            });
        }
    }

    isPicked(color) {
        const { players } = this.props;
        return players.findIndex(function (player) { return player.color === color }) >= 0;
    }

    render() {
        const { players, user } = this.props;
        const { errorText } = this.state;

        const chessOptionClassName = cx('options', {
            hidden: players.length >= 2 || user.isPlayer
        });

        const watchOptionClassName = cx('options', {
            hidden: players.length < 2 || user.isPlayer
        });

        const isBlackPicked = this.isPicked(0);
        const isWhitePicked = this.isPicked(1);

        return (
            <div className='home-container'>
                {/* Name field */}
                { !user.isWaiting &&
                <TextField
                    hintText='Enter your name'
                    errorText={ errorText }
                    onChange={ this.onNameFieldChange.bind(this) }
                />
                }

                { user.isWaiting && 
                <div className='loading-info'>
                    <CircularProgress />
                    <p>Waiting for a challenger...</p>
                </div>
                }

                {/* Select chess piece color */}
                <div className={ chessOptionClassName }>
                    <p className='chess-option-tip'>Pick your chess piece color:</p>
                    <button 
                        className='black-chess-btn'
                        disabled={ isBlackPicked } 
                        onClick={ this.join.bind(this, 0) }
                    />
                    <button 
                        className='white-chess-btn'
                        disabled={ isWhitePicked } 
                        onClick={ this.join.bind(this, 1) }
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
    emit: PropTypes.func,
    players: PropTypes.array,
    watchers: PropTypes.array,
    user: PropTypes.object
};

Home.defaultProps = {
    socketId: '',
    players: [],
    watchers: []
};

export default Home;