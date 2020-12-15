import React from 'react';

import Auth from './user_auth';
import Map from './map';
import './index.css'



class Main extends React.Component {
    render() {
        return (
        <div className="main-container">
        {this.props.mode !=="home" ? <Auth {...this.props} /> : <Map {...this.props} />}
        </div>
        );
    }
}

export default Main;


// ////////////////////////
//  this is a dev class  //
// ////////////////////////




// class Main extends React.Component {
//     render() {
//         return (
//         <div className="main-container">
//         
//         </div>
//         );
//     }
// }

// export default Main;