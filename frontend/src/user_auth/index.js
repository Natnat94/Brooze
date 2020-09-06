import React from 'react';
import './login.css';
import LogIn from './components/login'
import PasswordChange from './components/password';
import SignUp from './components/sign_up';
import Friends from './components/friends';
import Profile from './components/profile';


class Auth extends React.Component {
    /* This component gather all the Authentification
    related components that is displayed above the map
    and the friend list manager */

    rendercomponent(param){
        switch(param){
            case 'password': return <PasswordChange {...this.props} />;
            case 'login': return <LogIn {...this.props} />;
            case 'friends': return <Friends {...this.props} /> ;
            case 'register': return <SignUp {...this.props} />;
            case 'profile': return <Profile {...this.props} />; 
            default: return null;
        }
    }

    render() {
        return (
            this.rendercomponent(this.props.mode)
        );
    }
}

export default Auth;