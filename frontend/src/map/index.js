import React from 'react';
import { UnlogMap } from './components';




class Map extends React.Component {
    /* this component gather the Map display components (will be removed) */

    render() {
        return (
           <UnlogMap {...this.props} />
        );
    }
}




export default Map;