import React from 'react';
import NavBar from './navbar';
import Auth from './user_auth';
import Map from './map';

let mainurl

if (process.env.NODE_ENV === 'production') {mainurl =  'https://nathan-mimoun.live/api'
} else {mainurl =  'http://localhost:8000'
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_logged: false,
            token: null,
            mode: null,          
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
                <div id="containeres">
                    <Map {...this.state} mainurl={mainurl}/>
                    {this.state.mode !== null ? <Auth handler={this.handler} mode={this.state.mode} mainurl={mainurl} /> : null}
                </div>
            </>
        );
    }
}

export default App;