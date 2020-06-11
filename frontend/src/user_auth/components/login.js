import React from 'react'
import { postData } from '../../map/ApiDataFunc'


let mainurl
mainurl = 'https://nathan-mimoun.live/api'

// if (process.env.NODE_ENV === 'production') {mainurl =  'https://nathan-mimoun.live/api'
// } else {mainurl =  'http://localhost:8000'
// }




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
    // this function send the login data to the backend
    // and return the response.
    async sendLogin(data, token) {
        await postData(mainurl + '/auth/login/', data, token)
            .then(data => {
                console.log(data);
                this.props.handler('is_logged', true);
                this.props.handler('token', 'Token ' + data.token);
                this.props.handler('mode', null);
                return data
            })
            .catch(e => {
                console.log(e)
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
                            <p>Please Login</p>
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