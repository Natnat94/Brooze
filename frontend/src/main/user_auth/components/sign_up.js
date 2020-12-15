import React from 'react';
import { postData } from '../../map/ApiDataFunc'


class SignUp extends React.Component {
    /* this component manage the Sign Up part, it display 
    a form that is sent by an AJAX POST call, which
    on succeed, send back the 'token' that is set on state */
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password1: '',
            password2: '',
            errormessage: '',
            position: {
                long: 48.864,
                lat: 2.349,
            }
        };
    }


    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        let err = "";
        if (nam === "password2") {
            if (val !== this.state.password1) {
                err = <p>
                    <span id="isa_error">
                        Both passwords need to be identical !</span></p>;
            }
        }
        this.setState({ errormessage: err });
        this.setState({ [nam]: val });
    }

    mySubmitHandler = (event) => {
        event.preventDefault();
        this.findCoordinates();
        if (this.state.password1 !== this.state.password2) { }
        else {
            this.sendLogin(this.state, "");
        }
    }

    handleClick(e, data) {
        e.preventDefault();
        this.props.handler('mode', data)
    }

    findCoordinates() {
        // this function determine the location of
        // the user and set it to the state.
        navigator.geolocation.getCurrentPosition(
            position => {
                this.setState({
                    position:
                    {
                        'long': position.coords.longitude,
                        'lat': position.coords.latitude,
                        'timestamp': position.timestamp
                    }
                });
            },
            error => console.log(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

    valideResponse = (json) => {
        // Do stuff with the JSON
        this.props.handler('is_logged', true);
        this.props.handler('token', 'Token ' + json.token);
        localStorage.setItem("token", json.token)
        this.props.handler('mode', null);
        this.props.handler('snackbar_text', json.message);
        this.props.handler('snackbar', true);
    }

    logError = (error) => {
        // Do stuff with the error
        this.setState({ errors: error })
        let x
        for (x in error) {
            let i
            for (i in error[x]) {
                const rsp = error[x][i];
                console.error(rsp.code + ': \n' + rsp.message)
            }
        }
    }

    sendLogin(data, token) {
        // this function send the login data to the backend
        // and return the response.
        postData(this.props.mainurl + '/auth/register/', data, token)
            .then(this.valideResponse)
            .catch(this.logError);
    }


    //Required method to render React elements 
    render() {
        // const ErrorValidationLabel = ({ txtLbl }) => (
        //     <label htmlFor="" style={{ color: "red" }}>
        //         {txtLbl}
        //     </label>
        // );
        const renderPasswordValidationError = this.state.errors ? (this.state.errors.password2 ? this.state.errors.password2.map((d, index) => <label key={index} htmlFor="" style={{ color: "red" }}>{d.message}</label>) : null) : null;
        const renderUsernameValidationError = this.state.errors ? (this.state.errors.username ? this.state.errors.username.map((d, index) => <label key={index} htmlFor="" style={{ color: "red" }}>{d.message}</label>) : null) : null;

        return (
            <>
                <div className="wrapper fadeInDown">
                    <div id="formContent">
                        <div id='formHeader'>
                            <span className="closebtn" onClick={() => this.props.handler('mode', "home")}>&times;</span>
                        </div>
                        <div className="fadeIn first">
                            <img src={require('./icon3.png')} id="icon" alt="User Icon" />
                        </div>
                        <form onSubmit={this.mySubmitHandler}>
                            <h1>Hello you !</h1>
                            <p>Please Sign up</p>
                            <input type="email" id="login" className="fadeIn second" name="username" onChange={this.myChangeHandler} placeholder="Username" required />
                            {renderUsernameValidationError}
                            <input type="password" id="password" className="fadeIn third" name="password1" onChange={this.myChangeHandler} placeholder="Password" required />
                            {renderPasswordValidationError}
                            <input type="password" id="password2" className="fadeIn third" name="password2" onChange={this.myChangeHandler} placeholder="Confirm password" required />
                            {this.state.errormessage}
                            <input type="submit" className="fadeIn fourth" value="Sign Up" />
                        </form>
                        <div id="formFooter">
                            <a className="underlineHover" href="/" onClick={event => this.handleClick(event, 'login')} >Already registered ?</a>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default SignUp;