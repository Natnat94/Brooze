import React from 'react';
import { postData } from '../../map/ApiDataFunc'

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password1: '',
            password2: '',
            errormessage: '',
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
                        This is a warning alert—check it out!</span></p>;
            }
        }
        this.setState({ errormessage: err });
        this.setState({ [nam]: val });
    }
    mySubmitHandler = (event) => {
        event.preventDefault();
        if (this.state.password1 !== this.state.password2) { }
        else {
            this.sendLogin(this.state, "");
        }
    }

    handleClick(e, data) {
        e.preventDefault();
        this.props.handler('mode', data)
      }


    async sendLogin(data, token) {
        await postData(this.props.mainurl + '/auth/register/', data, token)
            .then(data => {
                console.log(data)
                this.props.handler('is_logged', true);
                this.props.handler('token', 'Token ' + data.token);
                this.props.handler('mode', null);
                return data;
            })
    }


    render() {
        return (
            <>
                <div className="wrapper fadeInDown">
                    <div id="formContent">
                        <div className="fadeIn first">
                            <img src={require('./icon3.png')} id="icon" alt="User Icon" />
                        </div>
                        <form onSubmit={this.mySubmitHandler}>
                            <h1>Hello you !</h1>
                            <p>Please Sign up</p>
                            <input type="email" id="login" className="fadeIn second" name="username" onChange={this.myChangeHandler} placeholder="Username" required />
                            <input type="password" id="password" className="fadeIn third" name="password1" onChange={this.myChangeHandler} placeholder="Password" required />
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