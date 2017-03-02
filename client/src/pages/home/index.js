import React, { Component, PropTypes } from 'react';

import './index.less';

class Home extends Component {
    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    onClick() {
    	console.log('limit');
    }

    render() {
        return (
            <div>
            	<button type="button" onClick={ this.onClick.bind(this) }>testOnClick</button>
            </div>
        );
    }
}

export default Home;
