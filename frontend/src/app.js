import React from 'react';
import NavBar from './navbar';
import Auth from './user_auth';
import Map from './map';

let mainurl
let temptoken
temptoken = null
mainurl =  'https://nathan-mimoun.live/api'
// if (process.env.NODE_ENV === 'production') {mainurl =  'https://nathan-mimoun.live/api'
// temptoken = null
// } else {mainurl =  'http://localhost:8000'
// temptoken = "Token 825e04c5a051b03a208ea6baec3b3478ad348067"
// }

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_logged: false,
            token: temptoken,
            mode: null,
            mainurl: mainurl,         
        };
        this.handler = this.handler.bind(this)
    }

    handler(name, value) {
        this.setState({
            [name]: value,
        })
    }

    render() {
        return (
            <>
                <NavBar is_logged={this.state.is_logged} handler={this.handler} />
                <div id="main-container">
                    <Map {...this.state} mainurl={mainurl}/>
                    {this.state.mode !== null ? <Auth handler={this.handler} {...this.state} /> : null}
                </div>
            </>
        );
    }
}

export default App;