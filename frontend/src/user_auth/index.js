
import React from 'react';
import './login.css';
import LogIn from './components/login'
import PasswordChange from './components/password';
import SignUp from './components/sign_up';


class Auth extends React.Component {
    render() {
        return (
            <>
            {this.props.mode === "password" ? 
            <PasswordChange {...this.props}/>
            :
            (this.props.mode === 'login' ?  <LogIn {...this.props} /> : <SignUp {...this.props}/>)}
            
            
            
            </>
        );
    }
}

export default Auth;