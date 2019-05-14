import React from 'react';
import axios from 'axios';
import qs from 'qs';

import Nav from './../../utilities/Nav';
import NoticeBox from './../../utilities/NoticeBox';
import { apiRoute } from './../../utilities/api-route';
import countries from './../../utilities/countries.json';

class AdminOffices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      officeDisplay: '',
      offices: [],
      officeDisplayNoticeMessage: '',
      addOfficeNoticeMessage: '',
    }
    this.updateOfficeInfo = this.updateOfficeInfo.bind(this);
    this.addOfficeRequest = this.addOfficeRequest.bind(this);
    this.deleteOffice = this.deleteOffice.bind(this);
  }

  componentWillMount(){
    this.getOffices();
  }

  officeDisplayNotice(message) {
    this.setState({officeDisplayNoticeMessage: message});
  }

  getOffices(){
    axios.get(apiRoute("public", "getOffices")).then(
      response => {
        if(response.data.status === "success"){
          this.setState({offices: response.data.result});
        } else {
          alert(response.data.result.message);
        }
      }
    ).catch(
      error => {
        alert("Get offices: " + error.message);
      }
    );
  }

  addOfficeNotice(message){
    this.setState({addOfficeNoticeMessage: message});
  }

  addOfficeRequest(e){
    e.preventDefault();
    const params = {
      office_city: this.addOffice_office_city.value,
      office_country: this.addOffice_office_country.value,
      office_address: this.addOffice_office_address.value,
    };
    axios.post(apiRoute("admin", "addOfficeRequest"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.addOfficeNotice(response.data);
          this.refs.addOfficeForm.reset();
          this.getOffices();
        } else {
          this.addOfficeNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.addOfficeNotice({status: "error", message: error.message});
      }
    );
  }

  addOfficeModal(){
    return (
      <div className="modal" id="addOfficeModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <form ref="addOfficeForm" className="login-form" onSubmit={this.addOfficeRequest}>
                <h5>Create Office</h5>
                <NoticeBox Message={this.state.addOfficeNoticeMessage} />
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Address<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <input ref={(input) => this.addOffice_office_address = input} type="text" className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">City<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <input ref={(input) => this.addOffice_office_city = input} type="text" className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Country<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <select ref={(input) => this.addOffice_office_country = input} className="form-control">
                      <option></option>
                      {this.countriesOptions()}
                    </select>
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

  officesTable(){
    return (
      <div className="table-responsive">
        {this.addOfficeModal()}
        <table className="table">
          <thead>
            <tr>
              <th>Office ID</th>
              <th>Address</th>
              <th>City</th>
              <th>Country</th>
              <th>
                <span className="table-link" data-toggle="modal" data-target="#addOfficeModal">
                  Add Office
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.offices.map(
                (office, index) => {
                  return (
                    <tr key={index} className={(this.state.officeDisplay.office_id === office.office_id ? "active" : "")}>
                      <td>{office.office_id}</td>
                      <td>{office.address}</td>
                      <td>{office.city}</td>
                      <td>{office.country}</td>
                      <td
                        onClick={this.officeDisplayInfo.bind(this, office)}
                        className="table-link"
                        >view
                      </td>
                    </tr>
                  )
                }
              )
            }
          </tbody>
        </table>
      </div>
    );
  }

  officeDisplayInfo(office){
    this.setState({officeDisplay: office, officeDisplayNoticeMessage: ''});
    this.office_id.value = office.office_id;
    this.office_address.value = office.address;
    this.office_city.value = office.city;
    this.office_country.value = office.country;
  }

  countriesOptions() {
    return countries.map(
      country => <option key={country.code} value={country.name}>{country.name}</option>
    );
  }

  officeDisplay(){
    return (
      <div className={"box" + (this.state.officeDisplay ? "" : " hidden")}>
        <div className="box-header">
          <button className="mini-button delete" onClick={this.deleteOffice}>Delete Office</button>
          <h5 className="box-title">Office Information</h5>
        </div>
        <form onSubmit={this.updateOfficeInfo}>
          <NoticeBox Message={this.state.officeDisplayNoticeMessage} />
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Office ID
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.office_id = input} type="text" className="form-control" disabled />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Address<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.office_address = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">City<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.office_city = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Country<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <select ref={(input) => this.office_country = input} className="form-control">
                {this.countriesOptions()}
              </select>
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

  deleteOffice(){
    if(!window.confirm("Are you sure you would like to delete the office located at " + this.state.officeDisplay.address + " email?")){
      return;
    }
    const params = {
      office_id: this.state.officeDisplay.office_id,
    };
    axios.post(apiRoute("admin", "deleteOffice"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.getOffices();
          this.setState({officeDisplay: ''});
        } else {
          this.officeDisplayNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.officeDisplayNotice({status: "error", message: error.message});
      }
    );
  }

  updateOfficeInfo(e){
    e.preventDefault();
    const params = {
      office_id: this.state.officeDisplay.office_id,
      office_city: this.office_city.value,
      office_country: this.office_country.value,
      office_address: this.office_address.value,
    };
    axios.post(apiRoute("admin", "updateOfficeDetails"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.officeDisplayNotice({status: "success", message: "Office Info Updated!"});
          this.getOffices();
        } else {
          this.officeDisplayNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.officeDisplayNotice({status: "error", message: error.message});
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
                {this.officesTable()}
              </div>
              <div className="col-md-6">
                <div className="info-box">
                  {this.officeDisplay()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AdminOffices;
