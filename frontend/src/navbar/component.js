import React from 'react'

import './navbar.css'
import { bubble as Menu } from 'react-burger-menu'


export class NavBar extends React.Component {
  constructor(props) {

    super(props);
    this.handleClick = this.handleClick.bind(this);
}

  handleClick(e, data) {
    e.preventDefault();
    this.props.handler('mode', data)
  }

  render() {
    // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
    return (
      <Menu>
        {this.props.is_logged ?
          (<>
            <a id="logout" className="menu-item" href="/" onClick={event => this.handleClick(event, null)}><i className="fa fa-fw fa-sign-out" /><span>Logout</span></a>
            <a id="profil" className="menu-item" href="/"onClick={event => this.handleClick(event, 'password')}><i className="fa fa-fw fa-user" /><span>Profil</span></a>
            <a id="friends" className="menu-item" href="/"onClick={event => this.handleClick(event, null)}><i className="fa fa-fw fa-address-book-o" /><span>Friends</span></a>
            {/* <a className="menu-item--small" href="/">Settings</a> */}
          </>) :
          (<>
            <a id="home" className="menu-item" href="/" onClick={event => this.handleClick(event, null)}><i className="fa fa-fw fa-star-o" /><span>Home</span></a>
            <a id="login" className="menu-item" href="/"  onClick={event => this.handleClick(event, 'login')}><i className="fa fa-fw fa-sign-in" /><span>Login</span></a>
            <a id="register" className="menu-item" href="/" onClick={event => this.handleClick(event, 'register')}><i className="fa fa-fw fa-smile-o" /><span>Register</span></a>
          </>)
        }

      </Menu>
    );
  }
}