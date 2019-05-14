import React from 'react';
import axios from 'axios';
import qs from 'qs';
import renderHTML from 'react-render-html';
import Timestamp from 'react-timestamp';

import Nav from './../../utilities/Nav';
import NoticeBox from './../../utilities/NoticeBox';
import { apiRoute } from './../../utilities/api-route';
import PartnerApplication from './../partner/PartnerApplication';

class AdminPartners extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      partners: [],
      partnerDisplay: '',
      partnersTableSearch: '',
      offices: [],
      partnerDisplayNoticeMessage: '',
    }
    this.updatePartnerDisplay = this.updatePartnerDisplay.bind(this);
    this.getOffices = this.getOffices.bind(this);
    this.getPartners = this.getPartners.bind(this);
    this.updatePartnerInfo = this.updatePartnerInfo.bind(this);
    this.deletePartner = this.deletePartner.bind(this);
    this.resetPartnerPassword = this.resetPartnerPassword.bind(this);
  }

  componentWillMount(){
    this.getOffices();
    this.getPartners();
  }

  partnerDisplayNotice(message) {
    this.setState({partnerDisplayNoticeMessage: message});
  }

  getOffices(){
    axios.get(apiRoute("public", "getOffices")).then(
      response => {
        if(response.data.status === "success"){
          this.setState({offices: response.data.result});
        } else {
          alert("Get offices: " + response.data.result.message);
        }      }
    ).catch(
      error => {
        alert("Get offices: " + error.message);
      }
    );
  }

  getPartners(){
    axios.get(apiRoute("admin", "getPartners")).then(
      response => {
        if(response.data.status === "success"){
          this.setState({partners: response.data.result});
        } else {
          alert("Get Partners: " + response.data.result.message);
        }
      }
    ).catch(
      error => {
        alert("Get Partners: " + error.message);
      }
    );
  }

  addPartnerModal(){
    return (
      <div className="modal" id="addPartner">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <h5>Add Partner</h5>
              <PartnerApplication />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  partnersTable(){
    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th colSpan="4">
                Search: &nbsp;
                <input className="table-search" type="text" value={this.state.partnersTableSearch} onChange={(e) => this.setState({partnersTableSearch: e.target.value})} />
              </th>
            </tr>
            <tr>
              <th>Partner ID</th>
              <th>Partner Name</th>
              <th>Status</th>
              <th>
                <span className="table-link" data-toggle="modal" data-target="#addPartner">
                  Add Partner
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.partners.filter(
                row => JSON.stringify(row).toLowerCase().includes(this.state.partnersTableSearch.toLowerCase())
              ).map((partner, index) => {
                return (
                  <tr key={partner.partner_id} className={(this.state.partnerDisplay.partner_id === partner.partner_id ? "active" : "")}>
                    <td>{partner.partner_id}</td>
                    <td>{partner.first_name} {partner.last_name}</td>
                    <td>{partner.status}</td>
                    <td onClick={this.updatePartnerDisplay.bind(this, partner)}>
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
    );
  }

  updatePartnerDisplay(partner){
    this.setState({partnerDisplay: partner});
    this.partner_id.value = partner.partner_id;
    this.products_processed.value = partner.products_processed;
    this.demerit_count.value = partner.demerit_count;
    this.first_name.value = partner.first_name;
    this.last_name.value = partner.last_name;
    this.status.value = partner.status;
    this.office_id.value = partner.office_id;
    this.address.value = partner.address;
    this.phone_number.value = partner.phone_number;
    this.whatsapp.value = partner.whatsapp;
    this.email.value = partner.email;
    this.questionaire = partner.questionaire;
  }

  partnerDisplay(){
    return (
      <div className={"box" + (this.state.partnerDisplay ? "" : " hidden")}>
        <div className="box-header">
          <button className="mini-button delete" onClick={this.deletePartner}>Delete Partner</button>
          <h5 className="box-title">Partner Information</h5>
        </div>
        <form onSubmit={this.updatePartnerInfo}>
          <NoticeBox Message={this.state.partnerDisplayNoticeMessage} />
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Partner ID
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.partner_id = input} type="text" className="form-control" disabled />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Products Processed
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.products_processed = input} type="text" className="form-control" disabled />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Demerits
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.demerit_count = input} type="text" className="form-control" disabled />
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
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Status<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <select ref={(input) => this.status = input} className="form-control">
                <option value="pending">pending</option>
                <option value="rejected">rejected</option>
                <option value="verified">verified</option>
                <option value="waitlisted">waitlisted</option>
                <option value="active">active</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Office<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <select ref={(input) => this.office_id = input} className="form-control">
                {this.state.offices.map(
                  office => {
                    return (
                      <option key={office.office_id} value={office.office_id}>
                        {office.address}, {office.city}
                      </option>
                    );
                  }
                )}
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Address<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.address = input} type="text" className="form-control" />
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
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Whatsapp<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <div className="input-group">
                <select ref={(input) => this.whatsapp = input} className="form-control">
                  <option value="1">yes</option>
                  <option value="0">no</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Email
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.email = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Last Login
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <Timestamp time={this.state.partnerDisplay.last_login} utc={false} format='full' includeDay />
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
              onClick={this.resetPartnerPassword}>
              Reset password
            </button>
          </div>
        </div>
      </div>
    );
  }

  deletePartner(){
    if(!window.confirm("Are you sure you would like to delete " + this.state.partnerDisplay.first_name + " " + this.state.partnerDisplay.last_name + "?")){
      return;
    }
    const params = {
      partner_id: this.state.partnerDisplay.partner_id,
    }
    axios.post(apiRoute("admin", "deletePartner"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.getPartners();
          this.setState({partnerDisplay: ''});
        } else {
          this.partnerDisplayNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.partnerDisplayNotice({status: "error", message: error.message});
      }
    );
  }

  resetPartnerPassword(){
    const params = {
      partner_id: this.state.partnerDisplay.partner_id,
    }
    axios.post(apiRoute("admin", "resetPartnerPassword"), qs.stringify(params)).then(
      response => {
        this.partnerDisplayNotice(response.data);
      }
    ).catch(
      error => {
        this.partnerDisplayNotice({status: "error", message: error.message});
      }
    );
  }

  updatePartnerInfo(e){
    e.preventDefault();
    const params = {
      partner_id: this.partner_id.value,
      first_name: this.first_name.value,
      last_name: this.last_name.value,
      status: this.status.value,
      office_id: this.office_id.value,
      address: this.address.value,
      phone_number: this.phone_number.value,
      whatsapp: this.whatsapp.value,
      email: this.email.value,
    };
    axios.post(apiRoute("admin", "updatePartnerInfo"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.getPartners();
          this.partnerDisplayNotice({status: "success", message: "Partner info updated!"});
        } else {
          this.partnerDisplayNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.partnerDisplayNotice({
          status: "error",
          message: error.message
        });
      }
    );
  }

  partnerQuestionaire(){
    if(this.state.partnerDisplay){
      return (
        <div className="box">
          <h5>Application Questionaire</h5>
          {renderHTML(this.applicationQuestionaire())}
        </div>
      );
    }
  }

  applicationQuestionaire(){
    var answers = "";
    for(var x in this.questionaire){
      answers += '<div className="form-group row"><label className="control-label col-md-6 col-sm-6 col-xs-12"><strong>' + x.replace(/_/g, " ") + ':</strong></label><label className="control-label col-md-6 col-sm-6 col-xs-12">' + this.questionaire[x] + '</label></div>';
    }
    return answers;
  }

  render() {
    return (
      <div>
        <Nav />
        <div className="page-content">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                {this.addPartnerModal()}
                {this.partnersTable()}
              </div>
              <div className="col-md-6">
                <div className="info-box">
                  {this.partnerDisplay()}
                  {this.partnerQuestionaire()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AdminPartners;
