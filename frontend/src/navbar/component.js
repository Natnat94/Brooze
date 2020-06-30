import React from 'react'

import './navbar.css'
import { bubble as Menu } from 'react-burger-menu'
import { postData } from '../map/ApiDataFunc'


export class NavBar extends React.Component {
  /* this component manage the navigation bar 
  that is updated according to the 'is_logged' props
  value. */
  constructor(props) {

    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e, data) {
    e.preventDefault();
    this.props.handler('mode', data)
  }


  valideResponse = (json) => {
    // Do stuff with the JSON
    localStorage.removeItem('token');
    this.props.handler('is_logged', false);
    this.props.handler('token', null);
    this.props.handler('mode', null);
    this.props.handler('snackbar_text', json.message);
    this.props.handler('snackbar', true);
    
  }
  logError = (error) => {
    // Do stuff with the error
    this.setState({ errors: error })
    console.error('Error: \n' + error.error)
  }

  logout = (event) => {
    event.preventDefault();
    // eslint-disable-next-line
    let token = localStorage.getItem('token')
    console.log(this.props.token)
    postData(this.props.mainurl + '/auth/logout/', '', this.props.token)
      .then(this.valideResponse)
      .catch(this.logError)
  }

  //Required method to render React elements 
  render() {
    // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
    return (
      <Menu>
        {this.props.is_logged ?
          (<>
            <a id="home" className="menu-item" href="/" onClick={event => this.handleClick(event, null)}><i className="fa fa-fw fa-star-o" /><span>Home</span></a>
            <a id="logout" className="menu-item" href="/" onClick={event => this.logout((event))}> <i className="fa fa-fw fa-sign-out" /><span>Logout</span></a>
            <a id="profil" className="menu-item" href="/" onClick={event => this.handleClick(event, 'password')}><i className="fa fa-fw fa-user" /><span>Profil</span></a>
            <a id="friends" className="menu-item" href="/" onClick={event => this.handleClick(event, 'friends')}><i className="fa fa-fw fa-address-book-o" /><span>Friends</span></a>
          </>) :
          (<>
            <a id="home" className="menu-item" href="/" onClick={event => this.handleClick(event, null)}><i className="fa fa-fw fa-star-o" /><span>Home</span></a>
            <a id="login" className="menu-item" href="/" onClick={event => this.handleClick(event, 'login')}><i className="fa fa-fw fa-sign-in" /><span>Login</span></a>
            <a id="register" className="menu-item" href="/" onClick={event => this.handleClick(event, 'register')}><i className="fa fa-fw fa-smile-o" /><span>Register</span></a>
          </>)
        }

      </Menu>
    );
  }
}