import React from 'react';
import axios from 'axios';
import qs from 'qs';
import Timestamp from 'react-timestamp';

import Nav from './../../utilities/Nav';
import { apiRoute } from './../../utilities/api-route';

class PartnerOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      partnerOrders: [],
    }
  }

  componentWillMount(){
    this.getPartnerOrders();
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

  changeStatus(partnerOrderId, newStatus){
    const params = {
      partner_order_id: partnerOrderId,
      new_status: newStatus
    };
    axios.post(apiRoute("partner", "updatePartnerOrderStatus"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.getPartnerOrders();
        } else {
          alert(response.data.result.message);
        }
      }
    ).catch(
      error => {
        alert(error.message);
      }
    );
  }

  sentOrders(){
    return (
      <div>
        {
          this.state.partnerOrders.filter(row => row.status === "sent").map(
            (partnerOrder, index) => {
              return (
                <div key={partnerOrder.partner_order_id} className="box order sent">
                  <div className="box-header">
                    <button className="mini-button" onClick={this.requestMaterials.bind(this, partnerOrder.partner_order_id)} disabled={!partnerOrder.materials_requested}>
                      Request Materials
                    </button>
                    <p className="box-title">
                      {partnerOrder.product.product_name}
                    </p>
                  </div>
                  <div className="row box-body">
                    <div className="col-md-6">
                      <label>SKU: </label>
                      <span className="order-data">{partnerOrder.product.sku}</span>
                    </div>
                    <div className="col-md-6">
                      <label>Colour: </label>
                      <span className="order-data">{partnerOrder.product.product_colour}</span>
                    </div>
                    <div className="col-md-6">
                      <label>Order #: </label>
                      <span className="order-data">{partnerOrder.partner_order_id}</span>
                    </div>
                    <div className="col-md-6">
                      <label>Quantity: </label>
                      <span className="order-data">{partnerOrder.quantity}</span>
                    </div>
                  </div>
                  <div>
                    <small>
                      <Timestamp time={partnerOrder.created_timestamp} utc={false} format='full' includeDay />
                    </small>
                    <button className="mini-button" onClick={this.changeStatus.bind(this, partnerOrder.partner_order_id, "accepted")}>
                      Accept
                    </button>
                  </div>
                </div>
              )
            }
          ).reverse()
        }
      </div>
    );
  }

  requestMaterials(partnerOrderId){
    const params = {
      partner_order_id: partnerOrderId
    };
    axios.post(apiRoute("partner", "requestPartnerOrderMaterials"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.getPartnerOrders();
        } else {
          alert(response.data.result.message);
        }
      }
    ).catch(
      error => {
        alert(error.message);
      }
    );
  }

  acceptedOrders(){
    return (
      <div>
        {
          this.state.partnerOrders.filter(row => row.status === "accepted").map(
            (partnerOrder, index) => {
              return (
                <div key={partnerOrder.partner_order_id} className="box order accepted">
                  <div className="box-header">
                    <button className="mini-button" onClick={this.requestMaterials.bind(this, partnerOrder.partner_order_id)} disabled={!partnerOrder.materials_requested}>
                      Request Materials
                    </button>
                    <p className="box-title">
                      {partnerOrder.product.product_name}
                    </p>
                  </div>
                  <div className="row box-body">
                    <div className="col-md-6">
                      <label>SKU: </label>
                      <span className="order-data">{partnerOrder.product.sku}</span>
                    </div>
                    <div className="col-md-6">
                      <label>Colour: </label>
                      <span className="order-data">{partnerOrder.product.product_colour}</span>
                    </div>
                    <div className="col-md-6">
                      <label>Order #: </label>
                      <span className="order-data">{partnerOrder.partner_order_id}</span>
                    </div>
                    <div className="col-md-6">
                      <label>Quantity: </label>
                      <span className="order-data">{partnerOrder.quantity}</span>
                    </div>
                  </div>
                  <div>
                    <small>
                      <Timestamp time={partnerOrder.created_timestamp} utc={false} format='full' includeDay />
                    </small>
                    <button className="mini-button" onClick={this.changeStatus.bind(this, partnerOrder.partner_order_id, "completed")}>
                      Complete
                    </button>
                  </div>
                </div>
              )
            }
          ).reverse()
        }
      </div>
    );
  }

  completedOrders(){
    return (
      <div>
        {
          this.state.partnerOrders.filter(row => row.status === "completed").map(
            (partnerOrder, index) => {
              return (
                <div key={partnerOrder.partner_order_id} className="box order completed">
                  <div className="box-header">
                    <p className="box-title">
                      {partnerOrder.product.product_name}
                    </p>
                  </div>
                  <div className="row box-body">
                    <div className="col-md-6">
                      <label>SKU: </label>
                      <span className="order-data">{partnerOrder.product.sku}</span>
                    </div>
                    <div className="col-md-6">
                      <label>Colour: </label>
                      <span className="order-data">{partnerOrder.product.product_colour}</span>
                    </div>
                    <div className="col-md-6">
                      <label>Order #: </label>
                      <span className="order-data">{partnerOrder.partner_order_id}</span>
                    </div>
                    <div className="col-md-6">
                      <label>Quantity: </label>
                      <span className="order-data">{partnerOrder.quantity}</span>
                    </div>
                  </div>
                  <div>
                    <small>
                      <Timestamp time={partnerOrder.created_timestamp} utc={false} format='full' includeDay />
                    </small>
                  </div>
                </div>
              )
            }
          ).reverse()
        }
      </div>
    );
  }

  closedOrders(){
    return (
      <div>
        {
          this.state.partnerOrders.filter(row => row.status === "closed").map(
            (partnerOrder, index) => {
              return (
                <div key={partnerOrder.partner_order_id} className="box order closed">
                  <div className="box-header">
                    <p className="box-title">
                      {partnerOrder.product.product_name}
                    </p>
                  </div>
                  <div className="row box-body">
                    <div className="col-md-6">
                      <label>SKU: </label>
                      <span className="order-data">{partnerOrder.product.sku}</span>
                    </div>
                    <div className="col-md-6">
                      <label>Colour: </label>
                      <span className="order-data">{partnerOrder.product.product_colour}</span>
                    </div>
                    <div className="col-md-6">
                      <label>Order #: </label>
                      <span className="order-data">{partnerOrder.partner_order_id}</span>
                    </div>
                    <div className="col-md-6">
                      <label>Quantity: </label>
                      <span className="order-data">{partnerOrder.quantity}</span>
                    </div>
                    <div className="col-md-6">
                      <label>Demerits: </label>
                      <span className="order-data">{partnerOrder.demerit_count}</span>
                    </div>
                  </div>
                  <div>
                    <small>
                      <Timestamp time={partnerOrder.created_timestamp} utc={false} format='full' includeDay />
                    </small>
                  </div>
                </div>
              )
            }
          ).reverse()
        }
      </div>
    );
  }

  render() {
    return (
      <div>
        <Nav />
        <div className="page-content">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <div className="header box sent">
                  <h5><i className="fa fa-arrow-circle-down"></i> Sent Orders</h5>
                </div>
                {this.sentOrders()}
              </div>
              <div className="col-md-3">
                <div className="header box accepted">
                  <h5><i className="fa fa-inbox"></i> Accepted Orders</h5>
                </div>
                {this.acceptedOrders()}
              </div>
              <div className="col-md-3">
                <div className="header box completed">
                  <h5><i className="fa fa-check-circle"></i> Completed Orders</h5>
                </div>
                {this.completedOrders()}
              </div>
              <div className="col-md-3">
                <div className="header box closed">
                  <h5><i className="fa fa-thumbs-up"></i> Closed Orders</h5>
                </div>
                {this.closedOrders()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default PartnerOrders;
