import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { apiRoute } from './../../utilities/api-route';
import Nav from './../../utilities/Nav';
import NoticeBox from './../../utilities/NoticeBox';

class AdminDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      dashboardNotice: '',
      inventoryTableSearch: ''
    }
  }

  componentWillMount(){
    this.getDashData();
  }

  dashboardNotice(message){
    this.setState({dashboardNotice: message});
  }

  getDashData(){
    axios.get(apiRoute("admin", "getDashData")).then(
      response => {
        if(response.data.status === "success"){
          this.setState({data: response.data.result});
        } else {
          this.dashboardNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.dashboardNotice({status: "error", message: error.message});
      }
    );
  }

  inventoryTable(){
    if(this.state.data.inventory){
      return (
        <div className="table-responsive">
          <div className="tab">
            <div className="tab-box">
              <p className="title capitalize">Inventory</p>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th colSpan="3">
                  Search: &nbsp;
                  <input className="table-search" type="text" value={this.state.inventoryTableSearch} onChange={(e) => this.setState({inventoryTableSearch: e.target.value})} />
                </th>
                <th colSpan="1">
                  <Link to="/admin/products">
                    <button className="mini-button">
                      Products
                    </button>
                  </Link>
                </th>
              </tr>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Colour</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.data.inventory.filter(
                  row => JSON.stringify(row).toLowerCase().includes(this.state.inventoryTableSearch.toLowerCase())
                ).map((product, index) => {
                  return (
                    <tr key={product.product_id}>
                      <td>{product.sku}</td>
                      <td>{product.product_name}</td>
                      <td>{product.product_colour}</td>
                      <td>{product.quantity_on_hand}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      );
    }
  }

  render(){
    return (
      <div>
        <Nav />
        <div className="page-content">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <NoticeBox Message={this.state.dashboardNotice} />
              </div>
              <div className="col-md-3">
                <div className="box">
                  <div className="box-header">
                    <Link to="/admin/orders">
                      <button className="mini-button">
                        Partner Orders
                      </button>
                    </Link>
                    <p className="box-title">
                      Active Partner Orders
                    </p>
                  </div>
                  <div className="box-body">
                    <h2>{this.state.data.active_partner_orders}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="box">
                  <div className="box-header">
                    <Link to="/admin/material-requests">
                      <button className="mini-button">
                        Material Requests
                      </button>
                    </Link>
                    <p className="box-title">
                      Unresolved Material Requests
                    </p>
                  </div>
                  <div className="box-body">
                    <h2>{this.state.data.unresolved_material_requests}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="box">
                  <div className="box-header">
                    <Link to="/admin/partners">
                      <button className="mini-button">
                        Partners
                      </button>
                    </Link>
                    <p className="box-title">
                      Partners Logged In Today
                    </p>
                  </div>
                  <div className="box-body">
                    <h2>{this.state.data.partners_logged_in}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="box">
                  <div className="box-header">
                    <Link to="/admin/account-manager">
                      <button className="mini-button">
                        Admins
                      </button>
                    </Link>
                    <p className="box-title">
                      Admins Logged In Today
                    </p>
                  </div>
                  <div className="box-body">
                    <h2>{this.state.data.admins_logged_in}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                {this.inventoryTable()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AdminDashboard;
