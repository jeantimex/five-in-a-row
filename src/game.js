import React, { Component, PropTypes } from  'react';
import { browserHistory } from 'react-router';
import TargetIcon from 'material-ui/lib/svg-icons/image/crop-free';

import cx from 'classnames';

import './styles/game.css';

const BOARD_SIZE = 15;
const CELL_SIZE = 29;
const ICON_SIZE = 24;
const CHESS_SIZE = 28;

class Game extends Component {

    constructor(props) {
        super(props);

        this.state = {
            targetX: 0,
            targetY: 0
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

    getTargetPosition(e) {
        const rect = e.target.getBoundingClientRect();
        
        let targetX = e.clientX - rect.left;
        let targetY = e.clientY - rect.top;

        // Snapping
        targetX = Math.round(targetX / CELL_SIZE) * CELL_SIZE;
        targetY = Math.round(targetY / CELL_SIZE) * CELL_SIZE;

        return { targetX, targetY };
    }

    onMouseMove(e) {
        let { targetX, targetY } = this.getTargetPosition(e);

        targetX -= ICON_SIZE / 2;
        targetY -= ICON_SIZE / 2;

        this.setState({ targetX, targetY });
    }

    onClick(e) {
        const { emit, user, board } = this.props;
        const { targetX, targetY } = this.getTargetPosition(e);

        const row = targetY / CELL_SIZE;
        const col = targetX / CELL_SIZE;

        if (board[row][col] === -1) {
            if (emit) {
                emit('move', {
                    row,
                    col,
                    color: user.color
                });
            }
        }
    }

    render() {
        const { user, board } = this.props;
        const { targetX, targetY, isTargetHidden } = this.state;
        const targetStyle = { left: targetX, top: targetY };

        let chesses = [];
        
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] > -1) {
                    let chessClassName = 'chess chess-' + (board[i][j] === 0 ? 'black' : 'white');
                    let chessStyle = { left: j * CELL_SIZE - CHESS_SIZE / 2, top: i * CELL_SIZE - CHESS_SIZE / 2, width: CHESS_SIZE, height: CHESS_SIZE };
                    let key = i * BOARD_SIZE + j;

                    chesses.push(
                        <div className={ chessClassName } style={ chessStyle } key={ key }></div>
                    );
                }
            }
        }

        return (
            <div className='game-container'>
                <div className='game-board'>
                    <div className='grid'>
                        { user.canMove && 
                        <div className='target' style={ targetStyle }>
                            <TargetIcon />
                        </div>
                        }
                    </div>
                    <div className='point-container'>
                        <div className='p0'></div>
                        <div className='p1'></div>
                        <div className='p2'></div>
                        <div className='p3'></div>
                        <div className='p4'></div>
                    </div>
                    <div className='chess-container'>
                        { chesses }
                    </div>
                    { user.canMove &&
                    <div
                        className='grid-overlay'
                        onMouseMove={ this.onMouseMove.bind(this) }
                        onClick={ this.onClick.bind(this) }
                    >
                    </div>
                    }
                </div>
            </div>
        );
    }

}

Game.propTypes = {
    emit: PropTypes.func,
    players: PropTypes.array,
    watchers: PropTypes.array,
    user: PropTypes.object,
    board: PropTypes.array,
    currentColor: PropTypes.number
};

Game.defaultProps = {
    socketId: '',
    players: [],
    watchers: [],
    board: [],
    currentColor: 0
};

export default Game;