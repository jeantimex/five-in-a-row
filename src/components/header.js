import React, { Component, PropTypes } from  'react';

class Header extends Component {

    render() {
        return (
            <header>
                <h1>{this.props.title}</h1>
            </header>
        );
    }

}

Header.propTypes = {
    title: PropTypes.string.isRequired
};

export default Header;