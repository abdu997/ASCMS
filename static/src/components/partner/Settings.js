import React from 'react';
import axios from 'axios';
import qs from 'qs';

import NoticeBox from './../../utilities/NoticeBox';
import Nav from './../../utilities/Nav';
import { apiRoute } from './../../utilities/api-route';

class PartnerSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountDetails: '',
      accountDetailsNoticeMessage: '',
      passwordResetNoticeMessage: '',
    }
    this.getAccountDetails = this.getAccountDetails.bind(this);
    this.displayAccountDetails = this.displayAccountDetails.bind(this);
    this.updateAccount = this.updateAccount.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  componentDidMount(){
    this.getAccountDetails();
  }

  getAccountDetails(){
    axios.get(apiRoute("partner", "getAccountDetails")).then(
      response => {
        if(response.data.status === "success"){
          this.setState({accountDetails: response.data.result});
          this.displayAccountDetails();
        } else {
          this.accountDetailsNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.accountDetailsNotice({status: "error", message: error.message});
      }
    );
  }

  displayAccountDetails(){
    if(this.state.accountDetails){
      this.partner_id.value = this.state.accountDetails.partner_id;
      this.first_name.value = this.state.accountDetails.first_name;
      this.last_name.value = this.state.accountDetails.last_name;

      this.address.value = this.state.accountDetails.address;
      this.phone_number.value = this.state.accountDetails.phone_number;
      this.email.value = this.state.accountDetails.email;
    }
  }

  accountDetailsNotice(message) {
    this.setState({accountDetailsNoticeMessage: message});
  }

  accountDetailsForm(){
    return (
      <div className="box">
        <form onSubmit={this.updateAccount}>
          <h5>Account Details</h5>
          <NoticeBox Message={this.state.accountDetailsNoticeMessage} />
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Partner ID
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.partner_id = input} type="text" className="form-control" disabled />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">
              First Name<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.first_name = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">
              Last Name<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.last_name = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">
              Address<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.address = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">
              Phone Number<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.phone_number = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">
              Email
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.email = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <input value="Update" type="submit" className="form-control" />
            </div>
          </div>
        </form>
      </div>
    );
  }

  updateAccount(e){
    e.preventDefault();
    const params = {
      first_name: this.first_name.value,
      last_name: this.last_name.value,
      address: this.address.value,
      phone_number: this.phone_number.value,
      email: this.email.value
    };
    axios.post(apiRoute("partner", "updateAccountDetails"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          window.location.reload();
        } else {
          this.accountDetailsNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.accountDetailsNotice({status: "error", message: error.message});
      }
    );
  }

  passwordResetNotice(message) {
    this.setState({passwordResetNoticeMessage: message});
  }

  passwordResetForm(){
    return (
      <div className="box">
        <form onSubmit={this.updatePassword}>
          <h5>Password Reset</h5>
          <NoticeBox Message={this.state.passwordResetNoticeMessage} />
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Old Password<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.old_password = input} type="password" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">New Password<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.new_password = input} type="password" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Confirm New Password<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.confirm_password = input} type="password" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <input value="Update Password" type="submit" className="form-control" />
            </div>
          </div>
        </form>
      </div>
    );
  }

  updatePassword(e){
    e.preventDefault();
    if(this.new_password.value.length < 8 || this.new_password.value.length > 16){
      return this.passwordResetNotice({status: "error", message: "Password must be between 8 and 16 characters long"});
    }
    if(this.new_password.value !== this.confirm_password.value){
      return this.passwordResetNotice({status: "error", message: "Confirm password does not match New password"});
    }
    const params = {
      old_password: this.old_password.value,
      new_password: this.new_password.value
    };
    axios.post(apiRoute("partner", "updatePassword"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.passwordResetNotice({status: "success", message: "Password successfully changed"});
        } else {
          this.passwordResetNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.passwordResetNotice({status: "error", message: error.message});
      }
    );
  }

  render() {
    return (
      <div>
        <Nav />
        <div className="page-content">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                {this.accountDetailsForm()}
              </div>
              <div className="col-md-6">
                <div className="info-box">
                  {this.passwordResetForm()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default PartnerSettings;
