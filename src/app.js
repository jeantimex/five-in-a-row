import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'
import io from 'socket.io-client';
import Header from './components/header';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            status: 'disconnected',
            title: ''
        };

        // Bind functions to correct scope
        this.emit = this.emit.bind(this);
        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.welcome = this.welcome.bind(this);

        // Initialize socket
        this.initSocket();
    }

    initSocket() {
        this.socket = io('http://localhost:3000');
        this.socket.on('connect', this.connect);
        this.socket.on('disconnect', this.disconnect);
        this.socket.on('welcome', this.welcome);
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

    welcome(serverState) {
        this.setState({ title: serverState.title });
    }

    // -------------------------------
    //  Emit Socket Event to Server
    // -------------------------------

    emit(eventName, payload) {
        this.socket.emit(eventName, payload);
    }

    render() {
        const { children } = this.props;
        const { title } = this.state;

        var childrenWithProps = React.Children.map(children, (child) => {
            return React.cloneElement(child, { emit: this.emit });
        });

        return (
            <div>
                <Header title={ title } />

                <ul role="nav">
                    <li><Link to="/join">Join</Link></li>
                </ul>

                <div>
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