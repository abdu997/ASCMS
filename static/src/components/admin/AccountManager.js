import React from 'react';
import axios from 'axios';
import qs from 'qs';
import Timestamp from 'react-timestamp';

import { WithContext } from './../../utilities/context';
import NoticeBox from './../../utilities/NoticeBox';
import Nav from './../../utilities/Nav';
import { apiRoute } from './../../utilities/api-route';

class AdminAccountManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admins: [],
      adminDisplay: '',
      offices: [],
      adminDisplayNoticeMessage: '',
      addAdminNoticeMessage: '',
      accountOptions: [
        'hq1'
      ],
    }
    this.updateAdminDisplay = this.updateAdminDisplay.bind(this);
    this.getOffices = this.getOffices.bind(this);
    this.getAdmins = this.getAdmins.bind(this);
    this.adminsTable = this.adminsTable.bind(this);
    this.updateAdminInfo = this.updateAdminInfo.bind(this);
    this.printAccountOptions = this.printAccountOptions.bind(this);
    this.printOffices = this.printOffices.bind(this);
    this.addAdminRequest =this.addAdminRequest.bind(this);
    this.deleteAdmin = this.deleteAdmin.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  componentWillMount(){
    this.getOffices();
  }

  componentDidMount(){
    this.getAdmins();
  }

  getOffices(){
    axios.get(apiRoute("public", "getOffices")).then(
      response => {
        this.setState({offices: response.data.result});
        if(response.data.status === "success"){
          this.setState({offices: response.data.result});
        } else {
          alert(response.data.result.message);
        }
      }
    ).catch(
      error => {
        alert("Get Offices: " + error.message);
      }
    );
  }

  getAdmins(){
    axios.get(apiRoute("admin", "getAdmins")).then(
      response => {
        if(response.data.status === "success"){
          this.setState({admins: response.data.result});
        } else {
          alert(response.data.result.message);
        }
      }
    ).catch(
      error => {
        alert("Get admins: " + error.message);
      }
    );
  }

  adminDisplayNotice(message) {
    this.setState({adminDisplayNoticeMessage: message});
  }

  addAdminNotice(message) {
    this.setState({addAdminNoticeMessage: message});
  }

  printAccountOptions(){
    return (
      this.state.accountOptions.map(
        (account, index) => {
          return (
            <option key={index} value={account}>{account}</option>
          );
        }
      )
    );
  }

  printOffices(){
    return (
      this.state.offices.map(
        (office, index) => {
          return (
            <option key={index} value={office.office_id}>{office.address}, {office.city}</option>
          );
        }
      )
    );
  }

  addAdminRequest(e){
    e.preventDefault();
    const params = {
      first_name: this.addAdmin_first_name.value,
      last_name: this.addAdmin_last_name.value,
      rank: this.addAdmin_rank.value,
      office_id: this.addAdmin_office_id.value,
      home_address: this.addAdmin_home_address.value,
      phone_number: this.addAdmin_phone_number.value,
      email: this.addAdmin_email.value,
    };
    axios.post(apiRoute("admin", "addAdmin"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.getAdmins();
          this.addAdminNotice({
            status: "success",
            message: "Admin created!"
          });
          document.getElementById("addAdminForm").reset()
        } else {
          this.addAdminNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.addAdminNotice({
          status: "error",
          message: error.message
        });
      }
    )
  }

  deleteAdmin(){
    if(!window.confirm("Are you sure you would like to delete " + this.first_name.value + " " + this.last_name.value + "'s admin access?")){
      return;
    }
    const params = {
      admin_id: this.admin_id.value
    };
    axios.post(apiRoute("admin", "deleteAdmin"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.setState({adminDisplay: ''});
          this.getAdmins();
        } else {
          this.adminDisplayNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.adminDisplayNotice({
          status: "error",
          message: error.message
        });
      }
    );
  }

  addAdminModal(){
    return (
      <div className="modal" id="addAdminModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <form id="addAdminForm" className="login-form" onSubmit={this.addAdminRequest}>
                <h5>Create Admin</h5>
                <NoticeBox Message={this.state.addAdminNoticeMessage} />
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">First Name<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <input ref={(input) => this.addAdmin_first_name = input} type="text" className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Last Name<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <input ref={(input) => this.addAdmin_last_name = input} type="text" className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Rank<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <select ref={(input) => this.addAdmin_rank = input} className="form-control">
                      <option></option>
                      {this.printAccountOptions()}
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Office<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <select ref={(input) => this.addAdmin_office_id = input} className="form-control">
                      <option></option>
                      {this.printOffices()}
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Home Address<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <input ref={(input) => this.addAdmin_home_address = input} type="text" className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Phone Number<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text">+1</span>
                      </div>
                      <input ref={(input) => this.addAdmin_phone_number = input} type="text" className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Email<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <input ref={(input) => this.addAdmin_email = input} type="text" className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-sm-12">
                    <input value="Add" type="submit" className="form-control" />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  adminsTable(){
    return (
      <div>
        {this.addAdminModal()}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Admin ID</th>
                <th>Admin Name</th>
                <th>Office</th>
                <th><span className="table-link" data-toggle="modal" data-target="#addAdminModal">Add Admin</span></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.admins.map((admin, index) => {
                  return (
                    <tr key={index} className={(this.state.adminDisplay.admin_id === admin.admin_id ? "active" : "")}>
                      <td>{admin.admin_id}</td>
                      <td>{admin.first_name} {admin.last_name}</td>
                      <td className="capitalize">
                        {admin.office.address}, {admin.office.city}
                      </td>
                      <td onClick={this.updateAdminDisplay.bind(this, admin)}>
                          <span
                          className="table-link">View</span>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  updateAdminDisplay(admin){
    this.setState({adminDisplay: admin, adminDisplayNoticeMessage: ''});
    this.admin_id.value = admin.admin_id;
    this.first_name.value = admin.first_name;
    this.last_name.value = admin.last_name;
    this.rank.value = admin.account_rank;
    this.office_id.value = admin.office_id;
    this.home_address.value = admin.home_address;
    this.phone_number.value = admin.phone_number;
    this.email.value = admin.email;
    this.questionaire = admin.questionaire;
  }

  adminDisplay(){
    return (
      <div className={"box" + (this.state.adminDisplay ? "" : " hidden")}>
        <div className="box-header">
          <button className="mini-button delete" onClick={this.deleteAdmin}>Delete Admin</button>
          <h5 className="box-title">Admin Information</h5>
        </div>
        <form onSubmit={this.updateAdminInfo}>
          <NoticeBox Message={this.state.adminDisplayNoticeMessage} />
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Admin ID
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.admin_id = input} type="text" className="form-control" disabled />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">First Name<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.first_name = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Last Name<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.last_name = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Rank<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <select ref={(input) => this.rank = input} className="form-control">
                <option></option>
                {this.printAccountOptions()}
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Office<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <select ref={(input) => this.office_id = input} className="form-control">
                <option></option>
                {this.printOffices()}
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Home Address<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.home_address = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Phone Number<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">+1</span>
                </div>
                <input ref={(input) => this.phone_number = input} type="text" className="form-control" />
              </div>
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Email<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.email = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Last Login
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <Timestamp time={this.state.adminDisplay.last_login} utc={false} format='full' includeDay />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-12">
              <input value="Update" type="submit" className="form-control" />
            </div>
          </div>
        </form>
        <div className="form-group row">
          <div className="col-sm-12">
            <button className="form-control"
              onClick={this.resetPassword}>
              Reset password
            </button>
          </div>
        </div>
      </div>
    );
  }

  resetPassword(){
    if(!window.confirm("Are you sure you would like to reset " + this.first_name.value + " " + this.last_name.value + "'s email?")){
      return;
    }
    const params = {
      admin_id: this.admin_id.value
    };
    axios.post(apiRoute("admin", "resetAdminPassword"), qs.stringify(params)).then(
      response => {
        this.adminDisplayNotice(response.data);
      }
    ).catch(
      error => {
        this.adminDisplayNotice({status: "error", message: error.message});
      }
    );
  }

  updateAdminInfo(e){
    e.preventDefault();
    const params = {
      admin_id: this.admin_id.value,
      first_name: this.first_name.value,
      last_name: this.last_name.value,
      account_rank: this.rank.value,
      office_id: this.office_id.value,
      home_address: this.home_address.value,
      phone_number: this.phone_number.value,
      email: this.email.value,
    };
    axios.post(apiRoute("admin", "updateAdminInfo"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.getAdmins();
          this.adminDisplayNotice({
            status: "success",
            message: "Account info updated"
          });
        } else {
          this.adminDisplayNotice(response.data);
        }
      }
    ).catch(
      error => {
        alert("Update admin info: " + error.message);
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
                {this.adminsTable()}
              </div>
              <div className="col-md-6">
                <div className="info-box">
                  {this.adminDisplay()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default WithContext(AdminAccountManager);
