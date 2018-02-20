import React, { Component } from 'react';

const styles = {
    map: {
        background: 'black',
        color: 'white',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        minWidth: '70%',
        minHeight: '90%',
        margin: '20px'
    }
}

class Map extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div style={styles.map}>
                <h3> Here be the Map </h3>
            </div>
        );
    }
};

export default Map;
