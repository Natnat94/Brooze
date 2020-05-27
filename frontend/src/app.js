import React from 'react';
import NavBar from './navbar';
import MapRenderer from './map';
import Auth from './user_auth';

const token = "Token 8d3082a2926981efba07836f7c96ac3008d4ea58"

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_logged: false,
            token: token,
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
                    <MapRenderer {...this.state} />
                    {this.state.mode !== null ? <Auth handler={this.handler} mode={this.state.mode} /> : null}
                </div>
            </>
        );
    }
}

export default App;