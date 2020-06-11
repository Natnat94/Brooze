import React from 'react';
import { postData } from '../../map/ApiDataFunc'


let mainurl
mainurl = 'https://nathan-mimoun.live/api'

// if (process.env.NODE_ENV === 'production') {
//     mainurl = 'https://nathan-mimoun.live/api'
// } else {
//     mainurl = 'http://localhost:8000'
// }




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

    // this function determine the location of
    // the user and set it to the state.
    findCoordinates() {
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


    // this function send the login  data to the backend
    // and return the response.
    async sendLogin(data, token) {
        await postData(mainurl + '/auth/register/', data, token)
            .then(data => {
                console.log(data)
                this.props.handler('is_logged', true);
                this.props.handler('token', 'Token ' + data.token);
                this.props.handler('mode', null);
                return data;
            })
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