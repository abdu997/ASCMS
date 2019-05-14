import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';

import '../node_modules/bootstrap/scss/bootstrap.scss';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import './scss/style.scss';

import { apiRoute } from './utilities/api-route';
import UserContext from './utilities/context';

import LandingPage from './components/LandingPage';

import AdminLogin from './components/admin/Login';
import AdminDashboard from './components/admin/Dashboard';
import AdminPartners from './components/admin/Partners';
import AdminSettings from './components/admin/Settings';
import AdminAccountManager from './components/admin/AccountManager';
import AdminOffices from './components/admin/Offices';
import AdminProducts from './components/admin/Products';
import AdminPartnerOrders from './components/admin/PartnerOrders';
import AdminMaterialRequests from './components/admin/MaterialRequests';

import PartnerLogin from './components/partner/Login';
import PartnerOrders from './components/partner/Orders';
import PartnerSettings from './components/partner/Settings';

axios.defaults.withCredentials = true;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: {
        session_loaded: false,
      },
      env: '',
    }
    this.getSession = this.getSession.bind(this);
    this.defineEnv = this.defineEnv.bind(this);
  }

  componentWillMount(){
    this.getSession();
    this.defineEnv();
    setInterval(this.getSession, 15 * 60 * 1000);
  }

  defineEnv(){
    const hostname = window.location.hostname;
    var env;
    if(hostname === "localhost"){
      env = "localhost";
    } else if(hostname === "sandbox.ascms.adaptco.ca"){
      env = "sandbox";
    } else if(hostname === "ascms.adaptco.ca"){
      env = "prod";
    }
    this.setState({env: env});
  }

  getSession(){
    axios.get(apiRoute("public", "sessionExists")).then(
      response => {
        if(response.data.result.session_exists){
          this.setState({
            session: {
              session_loaded: true,
              session_exists: true,
              account_type: response.data.result.account_type,
              first_name: response.data.result.first_name,
              last_name: response.data.result.last_name,
              admin_id: response.data.result.admin_id,
              office_id: response.data.result.office_id,
              rank: response.data.result.rank,
            }
          });
        } else {
          this.setState({
            session: {
              session_loaded: true,
              session_exists: false,
            }
          });
        }
      }
    ).catch(
      error => {
        alert("hqSession: " + error.message);
        this.setState({
          session: {
            session_loaded: true,
            session_exists: false,
          }
        });
      }
    );
  }

  render() {
    const pathname = window.location.pathname;
    if(/\/$/.test(pathname) && pathname !== "/"){
      window.location.pathname = pathname.replace(/\/$/, "");
      return (
        <div>

        </div>
      );
    }
    const Component = () => (
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />

          <Route exact path="/admin" component={(this.state.session.account_type === "hq" ? AdminDashboard : AccessDenied)} />
          <Route exact path="/admin/partners" component={(this.state.session.account_type === "hq" ? AdminPartners : AccessDenied)} />
          <Route exact path="/admin/account-manager" component={(this.state.session.account_type === "hq" ? AdminAccountManager : AccessDenied)} />
          <Route exact path="/admin/settings" component={(this.state.session.account_type === "hq" ? AdminSettings : AccessDenied)} />
          <Route exact path="/admin/offices" component={(this.state.session.account_type === "hq" ? AdminOffices : AccessDenied)} />
          <Route exact path="/admin/products" component={(this.state.session.account_type === "hq" ? AdminProducts : AccessDenied)} />
          <Route exact path="/admin/orders" component={(this.state.session.account_type === "hq" ? AdminPartnerOrders : AccessDenied)} />
          <Route exact path="/admin/login" component={AdminLogin} />
          <Route exact path="/admin/material-requests" component={(this.state.session.account_type === "hq" ? AdminMaterialRequests : AccessDenied)} />
          <Route exact path="/admin/login" component={AdminLogin} />

          <Route
            exact path="/partner/"
            render={() => (
              <Redirect to="/partner/orders"/>
            )}
          />
          <Route exact path="/partner/login" component={PartnerLogin} />
          <Route exact path="/partner/orders" component={(this.state.session.account_type === "partner" ? PartnerOrders : AccessDenied)} />
          <Route exact path="/partner/settings" component={(this.state.session.account_type === "partner" ? PartnerSettings : AccessDenied)} />

          <Route component={Error404} />
        </Switch>
      </Router>
    );

    const Error404 = ({location}) => (
      <div>
        <ErrorObject message={"404 " + location.pathname + " does not exist"} />
      </div>
    );

    const AccessDenied = () => {
      setTimeout(ReturnToLogin, 2000);
      return (
        <div>
          <ErrorObject message="Access Denied: Incompatible account type or logged off." />
        </div>
      );
    }

    const ErrorObject = (props) => (
      <div className="container">
        <center>
          <Link to="/">
            <img src={window.location.origin + "/img/logo.png"} className="img-fluid logo" alt="logo" />
          </Link>
          <h5>
            {props.message}
          </h5>
          <Link to="/">
            <button className="mini-button">
              Back to Login
            </button>
          </Link>
        </center>
      </div>
    );

    const ReturnToLogin = () => {
      if(
        !this.state.session.session_exists
        && pathname !== "/admin/login"
        && window.location.href.includes("/admin/")
      ){
        window.location.href = "/admin/login";
      }
      if(
        !this.state.session.session_exists
        && pathname !== "/partner/login"
        && window.location.href.includes("/partner/")
      ){
        window.location.href = "/partner/login";
      }
    };

    const EnvTape = (props) => {
      return (
        <div className={"env-tape " + props.env}>
          <center>
            You are on <strong>{props.env}</strong>
            <a href={apiRoute("public", "testplan")} target="_BLANK">
              See Testplans
            </a>
          </center>
        </div>
      );
    }

    const Env = () => {
      if(this.state.env !== "prod"){
        return <EnvTape env={this.state.env} />;
      } else {
        return (
          <div></div>
        );
      }
    }

    if(this.state.session.session_loaded){
      AccessDenied();
      return (
        <div>
          <title className="page-title">
            {
              this.state.env !== "prod" ? this.state.env + " | " : ""
            }
            ASCMS
          </title>
          <UserContext.Provider value={{session: this.state.session}}>
            <Env />
            <Component />
          </UserContext.Provider>
        </div>
      );
    } else {
      return (
        <div>

        </div>
      );
    }
  }
}
export default App;
