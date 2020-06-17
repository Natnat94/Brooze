import React from 'react';
import { postData } from '../../map/ApiDataFunc'


class PasswordChange extends React.Component {
    /* this component manage the Password Change part, it display 
    a form that is sent by an AJAX POST call, which
    on succeed, send back the new 'token' that is set on state */
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            password1: '',
            password2: '',
            errormessage: '',
        };
    }


    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        let err = '';
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
        if (this.state.password1 !== this.state.password2) { }
        else {
            let data = {
                old_password: this.state.password,
                new_password1: this.state.password1,
                new_password2: this.state.password2,
            }
            this.sendLogin(data, this.props.token);
        }
    }

    valideResponse = (json) => {
        // Do stuff with the JSON
        this.props.handler('token', 'Token ' + json.token);
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

    // this function send the new password data to the backend
    // and return the response.
    sendLogin(data, token) {
        postData(this.props.mainurl + '/auth/password/', data, token)
            .then(this.valideResponse)
            .catch(this.logError);
    }
    //Required method to render React elements 
    render() {
        const renderNewPasswordValidationError = this.state.errors ? (this.state.errors.new_password2 ? this.state.errors.new_password2.map((d, index) => <label key={index} htmlFor="" style={{ color: "red" }}>{d.message}</label>) : null) : null;
        const renderOldPasswordValidationError = this.state.errors ? (this.state.errors.old_password ? this.state.errors.old_password.map((d, index) => <label key={index} htmlFor="" style={{ color: "red" }}>{d.message}</label>) : null) : null;
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

                            <p>You can change your password here</p>
                            <input type="password" id="old_password" className="fadeIn second" onChange={this.myChangeHandler} name="password" placeholder="Old Password" required />
                            {renderOldPasswordValidationError}
                            <input type="password" id="new_password1" className="fadeIn third" onChange={this.myChangeHandler} name="password1" placeholder="New Password" required />
                            {renderNewPasswordValidationError}
                            <input type="password" id="new_password2" className="fadeIn third" onChange={this.myChangeHandler} name="password2" placeholder="New Password" required />
                            {this.state.errormessage}
                            <input type="submit" className="fadeIn fourth" value="Submit" />

                        </form>
                        <div id="formFooter">

                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default PasswordChange;