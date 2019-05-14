import React from 'react';
import axios from 'axios';
import Barcode from 'react-barcode';
import qs from 'qs';
import Timestamp from 'react-timestamp';
import ReactToPrint from 'react-to-print';

import Nav from './../../utilities/Nav';
import NoticeBox from './../../utilities/NoticeBox';
import { apiRoute } from './../../utilities/api-route';

class AdminPartnerOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      partnerOrderDisplay: '',
      partnerOrdersTableSearch: '',
      partnerOrders: [],
      admins: [],
      partners: [],
      products: [],
      partnerDemerits: [],
      partnerOrderDisplayNoticeMessage: '',
      addPartnerOrderNoticeMessage: '',
      orderDemeritNoticeMessage: '',
    }
    this.updatePartnerOrderInfo = this.updatePartnerOrderInfo.bind(this);
    this.addPartnerOrderRequest = this.addPartnerOrderRequest.bind(this);
    this.partnerOptions = this.partnerOptions.bind(this);
  }

  componentWillMount(){
    this.getPartnerOrders();
    this.getPartners();
    this.getProducts();
    this.getAdmins();
    console.log(this.state.partnerOrderDisplay)
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

  getProducts(){
    axios.get(apiRoute("admin", "getProducts")).then(
      response => {
        if(response.data.status === "success"){
          this.setState({products: response.data.result});
        } else {
          alert(response.data.result.message);
        }
      }
    ).catch(
      error => {
        alert("Get products: " + error.message);
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

  partnerOrderDisplayNotice(message) {
    this.setState({partnerOrderDisplayNoticeMessage: message});
  }

  getPartnerOrders(){
    axios.get(apiRoute("admin", "getPartnerOrders")).then(
      response => {
        if(response.data.status === "success"){
          this.setState({partnerOrders: response.data.result});
        } else {
          alert("Get Partners Orders: " + response.data.result.message);
        }
      }
    ).catch(
      error => {
        alert("Get partnerOrders: " + error.message);
      }
    );
  }

  addPartnerOrderNotice(message){
    this.setState({addPartnerOrderNoticeMessage: message});
  }

  addPartnerOrderRequest(e){
    e.preventDefault();
    const params = {
      partner_id: this.addPartnerOrder_partner_id.value,
      product_id: this.addPartnerOrder_product_id.value,
      quantity: this.addPartnerOrder_quantity.value
    };
    axios.post(apiRoute("admin", "addPartnerOrder"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.refs.addPartnerOrderForm.reset();
          this.getPartnerOrders();
        } else {
          this.addPartnerOrderNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.addPartnerOrderNotice({status: "error", message: error.message});
      }
    );
  }

  partnerOptions(){
    return(
      this.state.partners.filter(partner => partner.status === 'active').map(
        (partner, index) => {
          return (
            <option key={index} value={partner.partner_id}>
              {partner.first_name + " " + partner.last_name + " [ID#: " + partner.partner_id + "]"}
            </option>
          )
        }
      )
    );
  }

  addPartnerOrderModal(){
    return (
      <div className="modal" id="addPartnerOrderModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <form ref="addPartnerOrderForm" className="login-form" onSubmit={this.addPartnerOrderRequest}>
                <h5>Create Partner Order</h5>
                <NoticeBox Message={this.state.addPartnerOrderNoticeMessage} />
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Active Partners<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <select ref={(input) => this.addPartnerOrder_partner_id = input} className="form-control">
                      <option></option>
                      {this.partnerOptions()}
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Product<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <select ref={(input) => this.addPartnerOrder_product_id = input} className="form-control">
                      <option></option>
                      {
                        this.state.products.map(
                          (product, index) => {
                            return (
                              <option key={product.product_id} value={product.product_id}>
                                [SKU: {product.sku}] {product.product_name} {product.product_colour}
                              </option>
                            )
                          }
                        ).reverse()
                      }
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Quantity<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <input ref={(input) => this.addPartnerOrder_quantity = input} type="number" min="1" className="form-control" />
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

  partnerOrdersTable(){
    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th colSpan="6">
                Search: &nbsp;
                <input className="table-search" type="text" value={this.state.partnerOrdersTableSearch} onChange={(e) => this.setState({partnerOrdersTableSearch: e.target.value})} />
              </th>
            </tr>
            <tr>
              <th>Partner Order ID</th>
              <th>Partner</th>
              <th>Quantity</th>
              <th>Product</th>
              <th>Status</th>
              <th>
                <span className="table-link" data-toggle="modal" data-target="#addPartnerOrderModal">
                  Create Order
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.partnerOrders.filter(
                row => JSON.stringify(row).toLowerCase().includes(this.state.partnerOrdersTableSearch.toLowerCase())
              ).map(
                (partnerOrder, index) => {
                  return (
                    <tr key={partnerOrder.partner_order_id} className={(this.state.partnerOrderDisplay.partner_order_id === partnerOrder.partner_order_id ? "active" : "")}>
                      <td>{partnerOrder.partner_order_id}</td>
                      <td>{partnerOrder.partner.first_name} {partnerOrder.partner.last_name} [ID#: {partnerOrder.partner.partner_id}]</td>
                      <td>{partnerOrder.quantity}</td>
                      <td>{partnerOrder.product.product_name} {partnerOrder.product.product_colour} [SKU: {partnerOrder.product.sku}]</td>
                      <td>{partnerOrder.status}</td>
                      <td onClick={this.partnerOrderDisplayInfo.bind(this, partnerOrder)}>
                          <span
                          className="table-link">View </span>/
                          <span data-toggle="modal" data-target="#orderPrintModal"
                          className="table-link"> Print</span>
                      </td>
                    </tr>
                  )
                }
              ).reverse()
            }
          </tbody>
        </table>
      </div>
    );
  }

  orderPrintModal(){
    if(this.state.partnerOrderDisplay){
      return (
        <div className="modal" id="orderPrintModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <ReactToPrint
                  trigger={() => <button className="mini-button"><i className="fa fa-print"></i> Print</button>}
                  content={() => this.refs.orderPrint}
                />
              </div>
              <div className="modal-body" ref="orderPrint">
                <table className="table">
                  <thead>
                    <tr>
                      <td colSpan="2">
                        <center>
                          <img alt="Logo" src={window.location.origin + "/img/logo.png"} />
                        </center>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr align="center">
                      <td>
                        <label>Partner Order #:</label>
                        <br />
                        <Barcode
                          value={this.state.partnerOrderDisplay.partner_order_id}
                        />
                        <br />
                        <label>Product SKU:</label>
                        <br />
                        <Barcode
                          value={this.state.partnerOrderDisplay.product.sku}
                        />
                      </td>
                      <td>
                        <table>
                          <thead></thead>
                          <tbody>
                            <tr>
                              <td>
                                <label>Order Created On: </label>
                              </td>
                              <td>
                                <Timestamp time={this.state.partnerOrderDisplay.closed_timestamp} utc={false} format='full' includeDay />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <label>Admin: </label>
                              </td>
                              <td>
                                {this.state.partnerOrderDisplay.admin.first_name} {this.state.partnerOrderDisplay.admin.last_name}
                                [ID#: {this.state.partnerOrderDisplay.admin.admin_id}]
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <label>Quantity: </label>
                              </td>
                              <td>
                                {this.state.partnerOrderDisplay.quantity}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  partnerOrderDisplayInfo(partnerOrder){
    this.setState(
      {
        partnerOrderDisplay: partnerOrder, partnerOrderDisplayNoticeMessage: '', orderDemeritNoticeMessage: ''
      }
    );
    this.partner_order_id.value = partnerOrder.partner_order_id;
    this.partner_order_admin.value = partnerOrder.admin.first_name + " " + partnerOrder.admin.last_name + " [ID#: " + partnerOrder.admin.admin_id + "]";
    this.partner_order_partner.value = partnerOrder.partner.first_name + " " + partnerOrder.partner.last_name + " [ID#: " + partnerOrder.partner.partner_id + "]";
    this.partner_order_product_id.value = partnerOrder.product_id;
    this.partner_order_quantity.value = partnerOrder.quantity;
    this.partner_order_status.value = partnerOrder.status;
  }


  partnerOrderDisplay(){
    const closedTimestamp = () => {
      if(this.state.partnerOrderDisplay.status === "closed"){
        return (
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Closed On
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <Timestamp time={this.state.partnerOrderDisplay.closed_timestamp} utc={false} format='full' includeDay />
            </div>
          </div>
        );
      } else {
        return null;
      }
    }
    return (
      <div className={"box" + (this.state.partnerOrderDisplay ? "" : " hidden")}>
        <form onSubmit={this.updatePartnerOrderInfo}>
          <h5>PartnerOrder Information</h5>
          <NoticeBox Message={this.state.partnerOrderDisplayNoticeMessage} />
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Partner Order ID
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.partner_order_id = input} type="text" className="form-control" disabled />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Admin Creator
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.partner_order_admin = input} type="text" className="form-control" disabled />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Created On
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <Timestamp time={this.state.partnerOrderDisplay.created_timestamp} utc={false} format='full' includeDay />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Partner
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.partner_order_partner = input} type="text" className="form-control" disabled />

            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Product<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <select ref={(input) => this.partner_order_product_id = input} className="form-control" disabled={(this.state.partnerOrderDisplay.status === "accepted" || this.state.partnerOrderDisplay.status === "closed")}>
                <option></option>
                {
                  this.state.products.map(
                    (product, index) => {
                      return (
                        <option key={index} value={product.product_id}>
                          [SKU: {product.sku}] {product.product_name} {product.product_colour}
                        </option>
                      )
                    }
                  )
                }
              </select>
            </div>
          </div>
          {closedTimestamp()}
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Status<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <select ref={(input) => this.partner_order_status = input} className="form-control" disabled={(this.state.partnerOrderDisplay.status === "closed")}>
                <option value="sent">sent (not accepted yet)</option>
                <option value="accepted">accepted (being processed)</option>
                <option value="completed">completed (partner done processing)</option>
                <option value="closed">closed (inspected, added to inventory &amp; demerits calculated)</option>
                <option value="discarded">discarded</option>
              </select>
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Quantity<span className="required">*</span>
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.partner_order_quantity = input} type="number" min="1" className="form-control" disabled={(this.state.partnerOrderDisplay.status === "accepted" || this.state.partnerOrderDisplay.status === "closed")} />
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

  updatePartnerOrderInfo(e){
    e.preventDefault();
    const params = {
      partner_order_id: this.state.partnerOrderDisplay.partner_order_id,
      product_id: this.partner_order_product_id.value,
      status: this.partner_order_status.value,
      quantity: this.partner_order_quantity.value
    };
    axios.post(apiRoute("admin", "updatePartnerOrderDetails"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.partnerOrderDisplayNotice({status: "success", message: "Partner Order Info Updated!"});
          this.setState({partnerOrderDisplay: response.data.result})
          this.getPartnerOrders();
        } else {
          this.partnerOrderDisplayNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.partnerOrderDisplayNotice({status: "error", message: error.message});
      }
    );
  }

  orderDemeritNotice(message) {
    this.setState({orderDemeritNoticeMessage: message});
  }

  orderDemerit(){
    if(this.state.partnerOrderDisplay.demerits){
      return(
        <div className="box">
          <div className="box-header">
            <button className="mini-button" onClick={this.addDemerit.bind(this)}>Add Demerit</button>
            <h5 className="box-title">Order Demerits</h5>
          </div>
          <div className="table-responsive">
            <NoticeBox Message={this.state.orderDemeritNoticeMessage} />
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Admin</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.partnerOrderDisplay.demerits.map(
                    (demerit, index) => {
                      return (
                        <tr key={demerit.record_id}>
                          <td>
                            <Timestamp time={demerit.timestamp} utc={false} format='full' includeDay />
                          </td>
                          <td>
                            {demerit.admin.first_name} {demerit.admin.last_name} [ID: {demerit.admin.admin_id}]
                          </td>
                        </tr>
                      )
                    }
                  ).reverse()
                }
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }

  addDemerit(){
    if(!window.confirm("Are you sure would like to give this partner a demerit? This cannot be reversed at this point.")){
      return;
    }
    const params = {
      partner_order_id: this.state.partnerOrderDisplay.partner_order_id
    };
    axios.post(apiRoute("admin", "addDemerit"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.setState({partnerOrderDisplay: response.data.result})
        } else {
          this.orderDemeritNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.orderDemeritNotice({status: "error", message: error.message});
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
                {this.orderPrintModal()}
                {this.addPartnerOrderModal()}
                {this.partnerOrdersTable()}
              </div>
              <div className="col-md-6">
                <div className="info-box">
                  {this.partnerOrderDisplay()}
                  {this.orderDemerit()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AdminPartnerOrders;
