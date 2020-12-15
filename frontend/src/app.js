/* eslint-disable */
import React from 'react';
import { NavBar } from './navbar';
import MobileNav from './navbar';
import SnackBar from './notification_toast/snackbar';
import Main from './main'


let temptoken
temptoken = "Token ea6bab4b6f7225985f239e7f665a6a752609e14a"

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_logged: false,
            token: temptoken,
            mode: "home",
            mainurl: process.env.REACT_APP_BASE_URL,
            snackbar: false,
            snackbar_text: null
        };

        this.handler = this.handler.bind(this)
    }

    handler(name, value) {
        this.setState({
            [name]: value,
        })
    }

    componentDidMount() {

        // check if the token is already saved into the local storage if the user is not logged
        if ((!this.state.is_logged) && (localStorage.getItem('token'))) {
            this.setState({ token: localStorage.getItem('token'), is_logged: true })
        }
    }

    render() {
        // definition of the max width for a mobile
        const is_mobile = window.innerWidth < 780

        // check if its a mobile screen or not and render the adequate nav. menu
        const navigation = is_mobile ? <MobileNav {...this.state} handler={this.handler} /> : <NavBar {...this.state} handler={this.handler} />;

        // check if this is a mobile viewport (screen width) else return an error message
        if (!is_mobile) { return (<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>This app is meant to be rendered on a mobile screen only</div>) }

        // check if the device have a geolocation capability else return an error message 
        if (!navigator.geolocation) { return (<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>This app need a geolocation capability on your device</div>) }

        return (
            <>
                <SnackBar snackbar={this.state.snackbar} text={this.state.snackbar_text} handler={this.handler} />
                <Main {...this.state} handler={this.handler} />
                {navigation}
            </>
        );
    }
}

export default App;