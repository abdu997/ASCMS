import React from 'react';
import { Link } from 'react-router-dom';

import { WithContext } from './../utilities/context';

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    var accountType;
    if(!this.props.context.session.session_exists){
      accountType = null;
    } else {
      accountType = this.props.context.session.account_type;
    }
    return (
      <div className="container">
        <center>
          <img src={window.location.origin + "/img/logo.png"} className="img-fluid logo" alt="logo" />
          <p>
            <strong>Welcome to ASCMS Intra!</strong>
          </p>
          <p>What type of account do you have?</p>
        </center>
        <div className="row login-form">
          <div className="col-sm-6">
            <Link to={(accountType === "hq" ? "/admin" : "/admin/login")}>
              <button className="form-control">
                Admin
              </button>
            </Link>
          </div>
          <div className="col-sm-6">
            <Link to={(accountType === "partner" ? "/partner" : "/partner/login")}>
              <button className="form-control">
                Partner
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
export default WithContext(LandingPage);
