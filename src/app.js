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
            dlgOpen: false
        };

        // Needed for onTouchTap
        // Can go away when react 1.0 release
        injectTapEventPlugin();

        // Initialize socket
        this.initSocket();
    }

    initSocket() {
        this.socket = io('http://localhost:3000');
        this.socket.on('connect', this.connect.bind(this));
        this.socket.on('disconnect', this.disconnect.bind(this));
        this.socket.on('throw', this.onError.bind(this));
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

    handleDlgClose() {
        this.setState({ dlgOpen: false });
    }

    render() {
        const { children } = this.props;
        const { title } = this.state;

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
                socket: this.socket
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