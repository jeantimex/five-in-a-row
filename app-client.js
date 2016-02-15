import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './src/app';
import Home from './src/home';
import About from './src/game';

ReactDOM.render((
    <Router history={ browserHistory }>
        <Route path="/" component={ App }>
            <IndexRoute component={ Home } />
            <Route path="/game" component={ Game } />
        </Route>
    </Router>
), document.getElementById('react-container'));
