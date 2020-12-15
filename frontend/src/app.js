/* eslint-disable */
import React from 'react';
import { NavBar } from './navbar';
import MobileNav from './navbar';
import SnackBar from './notification_toast/snackbar';
import Main from './main'
import { postData } from './main/map/ApiDataFunc'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_logged: false,
            token: null,
            mode: "home",
            mainurl: process.env.REACT_APP_BASE_URL,
            snackbar: false,
            snackbar_text: null,
            error_access: false
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
        if ((!this.state.is_logged) && (localStorage.getItem('refresh_token'))) {
            this.setState({ refresh_token: localStorage.getItem('refresh_token'), is_logged: true })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.error_access !== prevState.error_access) {
            if (this.state.error_access) {
                console.log("Invalid access token")
                let token = { refresh: this.state.refresh_token }
                postData(this.state.mainurl + '/auth/token/refresh/', token, '')
                    .then(result => this.setState({ token: "Bearer " + result.access }))
                    .catch(error => { localStorage.removeItem('refresh_token'); this.setState({ is_logged: false })})
                this.setState({error_access: false})
            }
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