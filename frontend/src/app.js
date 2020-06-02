import React from 'react';
import NavBar from './navbar';
import Auth from './user_auth';
import Map from './map';


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
                    <Map {...this.state} />
                    {this.state.mode !== null ? <Auth handler={this.handler} mode={this.state.mode} /> : null}
                </div>
            </>
        );
    }
}

export default App;