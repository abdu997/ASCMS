import React from 'react';
import axios from 'axios';
import qs from 'qs';

import NoticeBox from './../../utilities/NoticeBox';
import { apiRoute } from './../../utilities/api-route';

class PartnerLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginNoticeMessage: '',
      passwordResetToken: '',
      view: 'login',
    }
    this.loginRequest = this.loginRequest.bind(this);
    this.forgotPasswordRequest = this.forgotPasswordRequest.bind(this);
    this.passwordResetRequest = this.passwordResetRequest.bind(this);
  }

  componentWillMount(){
    this.getPartnerToken();
    this.getPasswordToken();
  }

  getPartnerToken(){
    const urlParams = new URLSearchParams(this.props.location.search);
    if(!urlParams.get('token')){
      return;
    }
    const params = {
      token: urlParams.get('token')
    };
    axios.post(apiRoute("public", "validatePartnerToken"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          window.location.href = "/partner/orders";
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

  getPasswordToken(){
    const urlParams = new URLSearchParams(this.props.location.search);
    const token = urlParams.get('passwordToken');
    if(!token){
      return;
    }
    const params = {
      token: token
    };
    axios.post(apiRoute("public", "validatePartnerPasswordToken"), qs.stringify(params)).then(
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
          <NoticeBox Message={this.state.loginNoticeMessage} />
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Partner # <span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.partnerId = input} type="text" className="form-control" required />
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

  forgotPasswordForm(){
    return (
      <div>
        <form onSubmit={this.forgotPasswordRequest} ref="forgotPasswordForm">
          <center>
            <h6>Partner Forgot Password</h6>
          </center>
          <NoticeBox Message={this.state.loginNoticeMessage} />
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Partner ID # <span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.partnerId = input} type="text" className="form-control" autoComplete="off" required />
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
      partner_id: this.partnerId.value
    };
    axios.post(apiRoute("public", "partnerForgotPasswordRequest"), qs.stringify(params)).then(
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

  loginNotice(message) {
    this.setState({loginNoticeMessage: message});
  }

  loginRequest(e){
    e.preventDefault();
    const params = {
      partner_id: this.partnerId.value,
      password: this.password.value,
    };
    axios.post(apiRoute("public", "partnerLogin"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          window.location.href = window.location.origin + "/partner/orders";
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

  passwordResetForm(){
    return (
      <div>
        <form onSubmit={this.passwordResetRequest} ref="passwordResetFrom">
          <center>
            <h6>Partner Password Reset</h6>
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
    axios.post(apiRoute("public", "partnerPasswordReset"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          window.location.href = "/partner/login";
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
export default PartnerLogin;
