import React from 'react'
import { postData } from '../../map/ApiDataFunc'


class LogIn extends React.Component {
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

    async sendLogin(data, token) {
        await postData('http://127.0.0.1:8000/auth/login/', data, token)
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