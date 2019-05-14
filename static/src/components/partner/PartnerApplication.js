import React from 'react';
import axios from 'axios';
import qs from 'qs';

import NoticeBox from './../../utilities/NoticeBox';
import countries from './../../utilities/countries.json';
import { apiRoute } from './../../utilities/api-route';

class PartnerApplicaton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workplacePreference: '',
      sewingExperience: '',
      officeId: '',
      partnerFormNoticeMessage: '',
      offices: [],
    }
    this.workplacePreference = this.workplacePreference.bind(this);
    this.sewingExperience = this.sewingExperience.bind(this);
    this.officeIdChange = this.officeIdChange.bind(this);
    this.partnerAppRequest = this.partnerAppRequest.bind(this);
    this.getOffices = this.getOffices.bind(this);
  }

  componentWillMount(){
    this.getOffices();
  }

  getOffices(){
    axios.get(apiRoute("public", "getOffices")).then(
      response => {
        this.setState({offices: response.data.result});
      }
    ).catch(
      error => {
        alert("Get offices: " + error.message);
      }
    );
  }

  countriesOptions() {
    return countries.map(
      country => <option key={country.code} value={country.name}>{country.name}</option>
    );
  }

  workplacePreference(e){
    this.setState({workplacePreference: e.target.value});
  }

  sewingExperience(e){
    this.setState({sewingExperience: e.target.value});
  }

  partnerFormNotice(message){
    this.setState({partnerFormNoticeMessage: message});
  }

  partnerForm(){
    return(
      <div className={(this.state.officeId === "" ? "hidden" : "")}>
        <form onSubmit={this.partnerAppRequest} ref="partnerApplication">
          <h5>Partner Approval Application</h5>
          <NoticeBox Message={this.state.partnerFormNoticeMessage} />
          <div className="form-element">
            <label>First Name</label>
            <div className="input-group">
              <input ref={(input) => this.firstName = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-element">
            <label>Last Name</label>
            <div className="input-group">
              <input ref={(input) => this.lastName = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-element">
            <label>Address</label>
            <div className="input-group">
              <input ref={(input) => this.address = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-element">
            <label>Phone Number</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">+1</span>
              </div>
              <input ref={(input) => this.phoneNumber = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-element">
            <label>Do you have WhatsApp for the number have you given?</label>
            <select ref={(input) => this.whatsapp = input} className="form-control">
              <option></option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </div>
          <div className="form-element">
            <label>Email (optional)</label>
            <div className="input-group">
              <input ref={(input) => this.email = input} type="email" className="form-control" />
            </div>
          </div>
          <h5>Questionaire</h5>
          <div className="form-element">
            <label>Do you have your own cell phone</label>
            <select ref={(input) => this.personalCellConfirm = input} className="form-control">
              <option></option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-element">
            <label>Birthday</label>
            <div className="input-group">
              <input ref={(input) => this.birthday = input} type="date" className="form-control" />
            </div>
          </div>
          <div className="form-element">
            <label>How many years have you been in Canada?</label>
            <div className="input-group">
              <input ref={(input) => this.yearsInCanada = input} min="0" type="number" className="form-control" />
            </div>
          </div>
          <div className="form-element">
            <label>What is your country of origin?</label>
            <select ref={(input) => this.country = input} className="form-control">
              {this.countriesOptions()}
            </select>
          </div>
          <div className="form-element">
            <label>Preferred Language</label>
            <div className="input-group">
              <input ref={(input) => this.preferredLanguage = input} type="text" className="form-control" />
            </div>
          </div>
          <div className="form-element">
            <label>Do you have experience sewing or designing?</label>
            <select value={this.state.sewingExperience} onChange={this.sewingExperience} className="form-control">
              <option></option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className={"form-element" + (this.state.sewingExperience === "yes" ? "" : " hidden")}>
            <label>How many years of experience do you have in sewing or designing?</label>
            <div className="input-group">
              <input ref={(input) => this.yearsSewingExperience = input} min="0" type="number" className="form-control" />
            </div>
          </div>
          <div className="form-element">
            <label>Do you have experience using a serger?</label>
            <select ref={(input) => this.sergerExperience = input} className="form-control">
              <option></option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-element">
            <label>Do you have experience using a coverstitch machine?</label>
            <div className="input-group">
              <select ref={(input) => this.coverstitchExperience = input} className="form-control">
                <option></option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          <div className="form-element">
            <label>Do you have your own sewing machine?</label>
            <select ref={(input) => this.ownMachine = input} className="form-control">
              <option></option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-element">
            <label>Do you prefer working from home or an office?</label>
            <select value={this.state.workplacePreference} onChange={this.workplacePreference} className="form-control">
              <option></option>
              <option value="home">Home</option>
              <option value="office">Office</option>
            </select>
          </div>
          <div className={"form-element" + (this.state.workplacePreference === "home" ? "" : " hidden")}>
            <label>If you chose home, do you have enough space in your living situation to hold a sewing machine and a few meters of material?</label>
            <select ref={(input) => this.enoughHomeWorkspace = input} className="form-control">
              <option></option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-element">
            <label>How many hours a week can you allocate to working?</label>
            <div className="input-group">
              <input ref={(input) => this.workHours = input} min="0" type="number" className="form-control" />
            </div>
          </div>
          <div className="form-element row">
            <div className="col-sm-12">
              <input value="Apply" type="submit" className="form-control" />
            </div>
          </div>
        </form>
      </div>
    );
  }

  partnerAppRequest(e){
    e.preventDefault();
    const params = {
      office_id: this.state.officeId,
      first_name: this.firstName.value,
      last_name: this.lastName.value,
      address: this.address.value,
      phone_number: this.phoneNumber.value,
      email: this.email.value,
      whatsapp: this.whatsapp.value,
      questionaire: {
        birthday: this.birthday.value,
        years_in_canada: this.yearsInCanada.value,
        origin_country: this.country.value,
        preferred_language: this.preferredLanguage.value,
        has_personal_cell: this.personalCellConfirm.value,
        sewing_experience: this.state.sewingExperience,
        years_sewing_experience: this.yearsSewingExperience.value,
        serger_experience: this.sergerExperience.value,
        coverstitch_experience: this.coverstitchExperience.value,
        owns_machine: this.ownMachine.value,
        workplace_preference: this.state.workplacePreference,
        home_work_space: this.enoughHomeWorkspace.value,
        work_hours: this.workHours.value,
      }
    };
    axios.post(apiRoute("admin", "partnerApply"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.refs.partnerApplication.reset();
          window.location.reload();
        }
        alert(response.data.result.message);
      }
    ).catch(
      error => {
        alert("Partner app request: " + error.message);
      }
    );
  }

  preAppForm(){
    return(
      <div className={(this.state.officeId === "" ? "" : "hidden")}>
        <h5>Pick Your City</h5>
        <select value={this.state.officeId} onChange={this.officeIdChange} className="form-control">
          <option></option>
          {this.state.offices.map(
            office => {
              return (
                <option key={office.office_id} value={office.office_id} className="capitalize">
                  {office.city} [{office.address}]
                </option>
              );
            }
          )}
        </select>
      </div>
    );
  }

  officeIdChange(e){
    this.setState({officeId: e.target.value});
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {this.preAppForm()}
            {this.partnerForm()}
          </div>
        </div>
      </div>
    );
  }
}
export default PartnerApplicaton;
