import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import io from 'socket.io-client';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { AppBar } from 'material-ui/lib';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import AppIcon from 'material-ui/lib/svg-icons/av/fiber-smart-record';
import MenuIcon from 'material-ui/lib/svg-icons/navigation/menu';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';

import './styles/app.css';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            status: 'disconnected',
            dlgTitle: '',
            dlgContent: '',
            dlgOpen: false,
            players: [],
            watchers: []
        };

        // Needed for onTouchTap
        // Can go away when react 1.0 release
        injectTapEventPlugin();
    }

    componentWillMount() {
        // Initialize socket
        this.initSocket();
    }

    componentWillUnmount() {
        this.socket.off('connect');
        this.socket.off('disconnect');
        this.socket.off('throw');
        this.socket.off('updateConnection');
    }

    initSocket() {
        this.socket = io('http://localhost:3000');
        this.socket.on('connect', this.connect.bind(this));
        this.socket.on('disconnect', this.disconnect.bind(this));
        this.socket.on('throw', this.onError.bind(this));
        this.socket.on('updateConnection', this.updateConnection.bind(this));
    }

    // -------------------------------
    //  Server Socket Event Handlers
    // -------------------------------

    connect() {
        console.log('Connected: %s', this.socket.id);
        this.setState({ status: 'connected' });
    }

    disconnect() {
        console.log('Disconnected: %s', this.socket.id);
        this.setState({ status: 'disconnected' });
    }

    onError(err) {
        this.setState({
            dlgTitle: 'Error',
            dlgContent: err.message,
            dlgOpen: true
        });
    }

    updateConnection(connections) {
        console.log('update connections');
        console.log(connections);
        const { players, watchers } = connections;

        this.setState({
            players,
            watchers
        });
    }

    handleDlgClose() {
        this.setState({ dlgOpen: false });
    }

    getCurrentUser() {
        const { players, watchers } = this.state;
        const socketId = this.socket.id;
        const playerIndex = players.findIndex(function (player) { return player.id === socketId });
        const watcherIndex = watchers.findIndex(function (watcher) { return watcher.id === socketId });
        
        if (playerIndex < 0 && watcherIndex < 0) {
            return {
                color: -1,
                name: '',
                isPlayer: false,
                isWatcher: false,
                isWaiting: false
            };
        }

        if (playerIndex >= 0) {
            const player = players[playerIndex];

            return {
                color: player.color,
                name: player.name,
                isPlayer: true,
                isWatcher: false,
                isWaiting: players.length === 1
            };
        } else {
            const watcher = watchers[watcherIndex];

            return {
                color: watcher.color,
                name: watcher.name,
                isPlayer: false,
                isWatcher: true,
                isWaiting: false
            };
        }
    }

    emit(eventName, payload) {
        this.socket.emit(eventName, payload);
    }

    render() {
        const { children } = this.props;
        const { title, players, watchers } = this.state;

        const actions = [
            <FlatButton
                label='OK'
                primary={ true }
                keyboardFocused={ true }
                onTouchTap={ this.handleDlgClose.bind(this) }
            />
        ];

        var childrenWithProps = React.Children.map(children, (child) => {
            return React.cloneElement(child, {
                emit: this.emit.bind(this),
                players,
                watchers,
                user: this.getCurrentUser()
            });
        });

        return (
            <div>
                <AppBar
                    title='Five in a Row'
                    iconElementLeft={ <IconButton><AppIcon /></IconButton> }
                    iconElementRight={
                        <IconMenu
                            iconButtonElement={
                                <IconButton><MenuIcon /></IconButton>
                            }
                            targetOrigin={ { horizontal: 'right', vertical: 'top' } }
                            anchorOrigin={ { horizontal: 'right', vertical: 'top' } }
                        >
                            <MenuItem
                                linkButton
                                containerElement={ <Link to="/" /> }
                                primaryText='Home' />
                            <MenuItem
                                linkButton
                                containerElement={ <Link to="/about" /> }
                                primaryText='About' />
                      </IconMenu>
                    }
                />

                <Dialog
                    title={ this.state.dlgTitle }
                    actions={ actions }
                    modal={ true }
                    open={ this.state.dlgOpen }
                    onRequestClose={ this.handleDlgClose.bind(this) }
                >
                  { this.state.dlgContent }
                </Dialog>
                
                <div className='app-container'>
                    {/* Here holds the child Route component of the App Route */}
                    { childrenWithProps }
                </div>
            </div>
        );
    }

}

App.propTypes = {
    children: PropTypes.node
}

export default App;