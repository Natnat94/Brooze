import React from 'react'
import { postData } from '../../map/ApiDataFunc'



class LogIn extends React.Component {
    /* this component manage the Login part, it display 
    a form that is sent by an AJAX POST call, which
    on succeed, send back the 'token' that is set on state */
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }


    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }
    mySubmitHandler = (event) => {
        event.preventDefault();
        this.sendLogin(this.state, "")
    }

    valideResponse = (json) => {
        // Do stuff with the JSON
        this.props.handler('is_logged', true);
        this.props.handler('token', 'Token ' + json.token);
        this.props.handler('mode', null);
        this.props.handler('snackbar_text', json.message);
        this.props.handler('snackbar', true);
    }

    logError = (error) => {
        // Do stuff with the error
        this.setState({ errors: error })
        console.error('Error: \n' + error.error)
    }

    sendLogin(data, token) {
        // this function send the login data to the backend
        // and return the response.
        postData(this.props.mainurl + '/auth/login/', data, token)
            .then(this.valideResponse)
            .catch(this.logError);

    }
    //Required method to render React elements 
    render() {
        const renderLoginValidationError = this.state.errors ? <label htmlFor="" style={{ color: "red" }}>{this.state.errors.error}</label> : null;
        return (
            <>
                <div className="wrapper fadeInDown">
                    <div id="formContent">
                        <div id='formHeader'>
                            <span className="closebtn" onClick={() => this.props.handler('mode', null)}>&times;</span>
                        </div>
                        <div className="fadeIn first">
                            <img src={require('./icon3.png')} id="icon" alt="User Icon" />
                        </div>
                        <form onSubmit={this.mySubmitHandler}>
                            <h1>Hello you !</h1>
                            <p>Please Login</p>
                            {renderLoginValidationError}
                            <input type="email" id="login" className="fadeIn second" name='username' autoComplete="username" onChange={this.myChangeHandler} placeholder="Username" required />
                            <input type="password" id="password" className="fadeIn third" name='password' autoComplete="current-password" onChange={this.myChangeHandler} placeholder="Password" required />
                            <input type="submit" className="fadeIn fourth" value="Log In" />
                        </form>
                        <div id="formFooter">
                            <a className="underlineHover" href="/" onClick={event => event.preventDefault()}>Forgot Password?</a>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default LogIn;