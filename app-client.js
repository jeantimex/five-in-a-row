import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import App from './src/app';
import Join from './src/modules/join';

ReactDOM.render((
    <Router history={ hashHistory }>
        <Route path="/" component={ App }>
            <Route path="/join" component={ Join } />
        </Route>
    </Router>
), document.getElementById('react-container'));
