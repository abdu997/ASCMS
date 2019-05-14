import React from 'react';
import axios from 'axios';
import qs from 'qs';
import Timestamp from 'react-timestamp';

import Nav from './../../utilities/Nav';
import { apiRoute } from './../../utilities/api-route';

class AdminMaterialRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      materialRequests: [],
    }
  }

  componentWillMount(){
    this.getMaterialRequests();
  }

  getMaterialRequests(){
    axios.get(apiRoute("admin", "getMaterialRequests")).then(
      response => {
        if(response.data.status === "success"){
          this.setState({materialRequests: response.data.result});
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

  materialRequestsTable(){
    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Request #</th>
              <th>Request Time</th>
              <th>Order #</th>
              <th>Quantity</th>
              <th>Partner</th>
              <th>Partner ID</th>
              <th>Contact</th>
              <th>SKU</th>
              <th>Product</th>
              <th>Colour</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.materialRequests.map(
                (request, index) => {
                  return (
                    <tr key={request.record_id}>
                      <td>{request.record_id}</td>
                      <td><Timestamp time={request.timestamp} utc={false} format='full' /></td>
                      <td>{request.partner_order_id}</td>
                      <td>{request.order.quantity}</td>
                      <td>{request.partner.first_name} {request.partner.last_name}</td>
                      <td>{request.partner.partner_id}</td>
                      <td>{request.partner.phone_number}</td>
                      <td>{request.product.sku}</td>
                      <td>{request.product.product_name}</td>
                      <td>{request.product.product_colour}</td>
                      <td
                        onClick={this.resolveMaterialRequest.bind(this, request.record_id, request.status)}
                        className={"table-link" + (request.status === "resolved" ? " disabled" : "")}
                        >
                          {(request.status === "resolved" ? "Resolved" : "Resolve")}
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

  resolveMaterialRequest(recordId, status){
    if(status === "resolved"){
      return;
    }
    const params = {
      record_id: recordId
    };
    axios.post(apiRoute("admin", "resolveMaterialRequest"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.getMaterialRequests();
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

  render() {
    return (
      <div>
        <Nav />
        <div className="page-content">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                {this.materialRequestsTable()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AdminMaterialRequests;
