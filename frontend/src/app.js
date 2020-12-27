/* eslint-disable */
import React from 'react';
import MobileNav,{ NavBar } from './navbar';
import Main from './main'
import { postData } from './main/map/ApiDataFunc'
import SnackBar from '@material-ui/core/Snackbar';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_logged: false,
            token: null,
            mode: "home",
            mainurl: process.env.REACT_APP_BASE_URL,
            snackbar_text: null,
            error_access: false,
            snackbar_is_open: false
        };
        this.handleModeChange = this.handleModeChange.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSnackbar = this.handleSnackbar.bind(this);
        this.handleErrorAccess = this.handleErrorAccess.bind(this);
    }

    handleSnackbar(message) {
        this.setState({ snackbar_is_open: true, snackbar_text: message });
    };

    handleModeChange(newMode) {
        this.setState({ mode: newMode });
    }

    handleLogout() {
        localStorage.removeItem('refresh_token');
        this.setState({ is_logged: false, refresh_token: null })
    }

    handleErrorAccess() {
        this.setState({
            error_access: true
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
                    .catch(error => { localStorage.removeItem('refresh_token'); this.setState({ is_logged: false }) })
                this.setState({ error_access: false })
            }
        }
    }

    render() {
        // definition of the max width for a mobile
        const is_mobile = window.innerWidth < 780

        // check if its a mobile screen or not and render the adequate nav. menu
        const navigation = is_mobile ? <MobileNav is_logged={this.state.is_logged} token={this.state.token} mainurl={this.state.mainurl} onModeChange={this.handleModeChange} snackBar={this.handleSnackbar} logOut={this.handleLogout} /> : <NavBar {...this.state} onModeChange={this.handleModeChange} snackBar={this.handleSnackbar} />;

        // check if this is a mobile viewport (screen width) else return an error message
        if (!is_mobile) { return (<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>This app is meant to be rendered on a mobile screen only</div>) }

        // check if the device have a geolocation capability else return an error message 
        if (!navigator.geolocation) { return (<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>This app need a geolocation capability on your device</div>) }

        return (
            <>
                <Main {...this.state} handleErrorAccess={this.handleErrorAccess} onModeChange={this.handleModeChange} snackBar={this.handleSnackbar}/>
                {navigation}
                <div>
                    <SnackBar
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={this.state.snackbar_is_open}
                        autoHideDuration={4000}
                        onClose={() => this.setState({ snackbar_is_open: false, snackbar_text: null })}
                        message= {this.state.snackbar_text}
                    />
                </div>
            </>
        );
    }
}

export default App;