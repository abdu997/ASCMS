import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import isExternal from 'is-url-external';

import { apiRoute } from './api-route';
import { WithContext } from './context';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile_side_nav: '',
      fullName: this.props.context.session.first_name + ' ' + this.props.context.session.last_name,
      adminNav: [
        {
          name: 'Dashboard',
          route: '/admin',
          icon: 'fa-home',
        },
        {
          name: 'Order Control',
          route: '/admin/orders',
          icon: 'fa-list',
        },
        {
          name: 'Material Requests',
          route: '/admin/material-requests',
          icon: 'fa-inbox',
        },
        {
          name: 'Product Control',
          route: '/admin/products',
          icon: 'fa-cart-plus',
        },
        {
          name: 'Partners',
          route: '/admin/partners',
          icon: 'fa-address-book',
        },
        {
          name: 'Admin Accounts',
          route: '/admin/account-manager',
          icon: 'fa-address-card',
        },
        {
          name: 'Office Control',
          route: '/admin/offices',
          icon: 'fa-building',
        },
        {
          name: 'Settings',
          route: '/admin/settings',
          icon: 'fa-cog',
        },
        {
          name: 'Sandbox Site',
          route: (window.location.hostname === "sandbox.ascms.adaptco.ca" ? window.location.pathname : 'https://sandbox.ascms.adaptco.ca' + window.location.pathname),
          icon: 'fa-server',
        },
      ],
      partnerNav: [
        {
          name: 'Orders',
          route: '/partner/orders',
          icon: 'fa-cubes'
        },
        {
          name: 'Settings',
          route: '/partner/settings',
          icon: 'fa-cog'
        },
      ],
    }
    this.closeSideNav = this.closeSideNav.bind(this);
    this.openSideNav = this.openSideNav.bind(this);
    this.logoutRequest = this.logoutRequest.bind(this);
  }

  /**
   * Removes the active value of the mobile_side_nav state, to remove the active
   * class from the side nav to close the side nav when the screen width is
   * smaller than 992px.
   *
   */
  closeSideNav() {
    this.setState({mobile_side_nav: ''});
  }

  /**
   * Adds the active value in the mobile_side_nav state, to add the active
   * class from the side nav to open the side nav when the screen width is
   * smaller than 992px.
   *
   */
  openSideNav() {
    this.setState({mobile_side_nav: 'active'});
  }

  navPages(){
    var nav;
    if(this.props.context.session.account_type === "hq"){
      nav = this.state.adminNav;
    }
    if(this.props.context.session.account_type === "partner"){
      nav = this.state.partnerNav;
    }
    return(
      nav.map( page => {
        return (
          <div key={page.name}>
            <Link to={page.route} target={isExternal(page.route) ? "_SELF" : null}>
              <li className={"side-nav-item" + (window.location.pathname === page.route ? " active" : "")}>
                <i className={"fa fw nav-icon " + page.icon}></i>{page.name}
              </li>
            </Link>
          </div>
        )
      })
    )
  }

  sideNav(){
    return(
      <div>
        <div className={"side-nav " + this.state.mobile_side_nav}>
        <center>
          <img className="logo" alt="ASCMS white logo" src={window.location.origin + "/img/logo-white.png"} />
        </center>
          <nav>
            <ul className="side-nav-list">
              <li className="side-nav-item close-nav" onClick={this.closeSideNav}><i className="fa fa-times nav-icon"></i>Close Navigation</li>
              {this.navPages()}
              <li className="side-nav-item logout" onClick={this.logoutRequest}><i className="fa fw fa-sign-out nav-icon"></i>Log Out</li>
              {this.envLinks()}
            </ul>
          </nav>
        </div>
      </div>
    );
  }

  envLinks(){
    const pathname = window.location.pathname;
    const hostname = window.location.hostname;
    const sandbox = (
      <Link to={"https://sandbox.ascms.adaptco.ca" + pathname} target="_BLANK">
        <li className="side-nav-item env-link">
          <i className="fa fw fa-server nav-icon"></i>Sandbox
        </li>
      </Link>
    );
    const prod = (
      <Link to={"https://ascms.adaptco.ca" + pathname} target="_BLANK">
        <li className="side-nav-item env-link">
          <i className="fa fw fa-server nav-icon"></i>Prod
        </li>
      </Link>
    );
    if(hostname === "localhost"){
      return (
        <div>
          {sandbox}
          {prod}
        </div>
      );
    }
    if(hostname === "sandbox.ascms.adaptco.ca"){
      return (
        <div>
          {prod}
        </div>
      );
    }
  }

  logoutRequest(){
    axios.get(apiRoute("public", "logout")).then(
      response => {
        if(response.data.result.session_flush){
          if(this.props.context.session.account_type === "hq"){
            window.location.href = window.location.origin + "/admin/login";
          }
          if(this.props.context.session.account_type === "partner"){
            window.location.href = window.location.origin + "/partner/login";
          }
        }
      }
    )
  }

  topNav(){
    return(
      <div className="page-content">
        <div className="top-nav">
          <span onClick={this.openSideNav} className="open-nav">
            <i className="fa fa-bars fw"></i>
          </span>
          <p className="user-name">
            {this.state.fullName}
          </p>
        </div>
        <div className="container">
          <div id="google_translate_element"></div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.sideNav()}
        {this.topNav()}
      </div>
    );
  }
}
export default WithContext(Nav);
