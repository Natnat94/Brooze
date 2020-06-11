import React from 'react';
import { postData } from '../../map/ApiDataFunc'



let mainurl
mainurl = 'https://nathan-mimoun.live/api'
// if (process.env.NODE_ENV === 'production') {
//     mainurl = 'https://nathan-mimoun.live/api'
// } else {
//     mainurl = 'http://localhost:8000'
// }




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
        if (nam === "new_password2") {
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
            alert("You are submitting " + this.state.password1);
            let data = {
                old_password: this.state.password,
                new_password1: this.state.password1,
                new_password2: this.state.password2,
            }
            this.sendLogin(data, this.props.token);
        }
    }

    // this function send the new password data to the backend
    // and return the response.
    sendLogin(data, token) {
        postData(mainurl + '/auth/password/', data, token)
            .then(data => {
                console.log(data)
                this.props.handler('token', 'Token ' + data.token);
                this.props.handler('mode', null);
                return data; // JSON data parsed by `response.json()` call
            })
            .then(console.log("le mot de passe est a jour"));
    }
    //Required method to render React elements 
    render() {
        return (
            <>
                <div className="wrapper fadeInDown">
                    <div id="formContent">
                        <div className="fadeIn first">
                            <img src={require('./icon3.png')} id="icon" alt="User Icon" />
                        </div>
                        <form onSubmit={this.mySubmitHandler}>

                            <p>You can change your password here</p>
                            <input type="password" id="old_password" className="fadeIn second" onChange={this.myChangeHandler} name="password" placeholder="Old Password" required />
                            <input type="password" id="new_password1" className="fadeIn third" onChange={this.myChangeHandler} name="password1" placeholder="New Password" required />
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