import React from 'react';
import axios from 'axios';
import qs from 'qs';

import NoticeBox from './../../utilities/NoticeBox';
import { apiRoute } from './../../utilities/api-route';

class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'login',
      loginNoticeMessage: '',
      passwordResetToken: '',
    }
    this.loginRequest = this.loginRequest.bind(this);
    this.forgotPasswordRequest = this.forgotPasswordRequest.bind(this);
    this.passwordResetRequest = this.passwordResetRequest.bind(this);
  }

  componentWillMount(){
    this.getPasswordToken();
  }

  getPasswordToken(){
    const urlParams = new URLSearchParams(this.props.location.search);
    const token = urlParams.get('passwordToken');
    if(!token){
      return;
    }
    const params = {
      token: token
    };
    axios.post(apiRoute("public", "validateAdminPasswordToken"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.setState({view: "passwordReset", passwordResetToken: token});
        } else {
          this.loginNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.loginNotice({status: "error", message: error.message});
      }
    );
  }

  loginForm(){
    return(
      <div>
        <form onSubmit={this.loginRequest}>
          <center>
            <h6>Admin Login</h6>
          </center>
          <NoticeBox Message={this.state.loginNoticeMessage} />
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Email <span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.email = input} type="text" className="form-control" required />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Password <span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.password = input} type="password" className="form-control" required />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <span className="link" onClick={() => this.changeView("forgotPassword")}>Forgot Password?</span>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <input value="Login" type="submit" className="form-control" />
            </div>
          </div>
        </form>
      </div>
    );
  }

  changeView(view){
    this.setState(
      {
        view: view,
        loginNoticeMessage: ''
      }
    );
  }

  loginNotice(message) {
    this.setState({loginNoticeMessage: message});
  }

  loginRequest(e){
    e.preventDefault();
    const params = {
      email: this.email.value,
      password: this.password.value,
    };
    axios.post(apiRoute("public", "adminLogin"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          window.location.href = window.location.origin + "/admin";
        } else {
          this.loginNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.loginNotice({status: "error", message: error.message});
      }
    );
  }

  passwordResetForm(){
    return (
      <div>
        <form onSubmit={this.passwordResetRequest} ref="passwordResetFrom">
          <center>
            <h6>Admin Password Reset</h6>
          </center>
          <NoticeBox Message={this.state.loginNoticeMessage} />
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">New Password <span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.newPassword = input} type="password" className="form-control" required />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Confirm Password <span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.confirmNewPassword = input} type="password" className="form-control" required />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <input value="Reset" type="submit" className="form-control" />
            </div>
          </div>
        </form>
      </div>
    );
  }

  passwordResetRequest(e){
    e.preventDefault();
    if(this.newPassword.value.length < 8 || this.newPassword.value.length > 16){
      return this.loginNotice({status: "error", message: "Password must be between 8 and 16 characters long"});
    }
    if(this.newPassword.value !== this.confirmNewPassword.value){
      return this.loginNotice({status: "error", message: "Confirm password does not match New password"});
    }
    const params = {
      token: this.state.passwordResetToken,
      new_password: this.confirmNewPassword.value
    };
    axios.post(apiRoute("public", "adminPasswordReset"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          window.location.href = "/admin/login";
        } else {
          this.loginNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.loginNotice({status: "error", message: error.message});
      }
    );
  }

  forgotPasswordForm(){
    return (
      <div>
        <form onSubmit={this.forgotPasswordRequest} ref="forgotPasswordForm">
          <center>
            <h6>Admin Forgot Password</h6>
          </center>
          <NoticeBox Message={this.state.loginNoticeMessage} />
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Email <span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.email = input} type="text" className="form-control" required />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <input value="Reset" type="submit" className="form-control" />
            </div>
          </div>
        </form>
      </div>
    );
  }

  forgotPasswordRequest(e){
    e.preventDefault();
    const params = {
      email: this.email.value
    };
    axios.post(apiRoute("public", "adminForgotPasswordRequest"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.refs.forgotPasswordForm.reset();
        }
        this.loginNotice(response.data);
      }
    ).catch(
      error => {
        this.loginNotice({status: "error", message: error.message});
      }
    );
  }

  view(){
    const view = this.state.view;
    if(view === "login"){
      return this.loginForm();
    }
    if(view === "forgotPassword"){
      return this.forgotPasswordForm();
    }
    if(view === "passwordReset"){
      return this.passwordResetForm();
    }
  }

  render() {
    return (
      <div className="container">
        <center>
          <img src={window.location.origin + "/img/logo.png"} className="img-fluid logo" alt="logo" />
        </center>
        <div className="login-form">
          {this.view()}
        </div>
      </div>
    );
  }
}
export default AdminLogin;
