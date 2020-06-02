import React from 'react';
import { UnlogMap, MapRenderer } from './components';




class Map extends React.Component {

    render() {
        return (
            <>
            {this.props.is_logged ? <MapRenderer {...this.props} /> : <UnlogMap {...this.props} />}
            
            
            </>
        );
    }
}




export default Map;