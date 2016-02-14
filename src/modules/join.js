import React, { Component, PropTypes } from  'react';
import { RaisedButton } from 'material-ui';

class Join extends Component {

    constructor(props) {
        super(props);
    }

    onClick() {
        console.log('click!');
        const { emit } = this.props;

        if (emit) {
            emit('join', { name: 'Su' });
        }
    }

    render() {
        return (
            <RaisedButton 
                label="Join"
                onMouseDown={ this.onClick.bind(this) }
            />
        );
    }

}

Join.propTypes = {
    emit: PropTypes.func
};

export default Join;