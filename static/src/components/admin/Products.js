import React from 'react';
import axios from 'axios';
import qs from 'qs';
import Timestamp from 'react-timestamp';
import { Link } from 'react-router-dom';

import Nav from './../../utilities/Nav';
import NoticeBox from './../../utilities/NoticeBox';
import { apiRoute } from './../../utilities/api-route';

class AdminProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productDisplay: '',
      productsTableSearch: '',
      products: [],
      productDisplayNoticeMessage: '',
      addProductNoticeMessage: '',
      removeInventoryNoticeMessage: '',
    }
    this.deleteProduct = this.deleteProduct.bind(this);
    this.removeInventoryRequest = this.removeInventoryRequest.bind(this);
    this.addProductRequest = this.addProductRequest.bind(this);
  }

  componentWillMount(){
    this.getProducts();
  }

  productDisplayNotice(message) {
    this.setState({productDisplayNoticeMessage: message});
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

  addProductNotice(message){
    this.setState({addProductNoticeMessage: message});
  }

  addProductRequest(e){
    e.preventDefault();
    const params = {
      sku: this.addProduct_sku.value,
      product_name: this.addProduct_product_name.value,
      product_colour: this.addProduct_product_colour.value,
      product_category: this.addProduct_product_category.value,
    };
    axios.post(apiRoute("admin", "addProductRequest"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.refs.addProductForm.reset();
          this.addProductNotice(response.data);
          this.getProducts();
        } else {
          this.addProductNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.addProductNotice({status: "error", message: error.message});
      }
    );
  }

  addProductModal(){
    return (
      <div className="modal" id="addProductModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <form ref="addProductForm" className="login-form" onSubmit={this.addProductRequest}>
                <h5>Create Product</h5>
                <NoticeBox Message={this.state.addProductNoticeMessage} />
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">SKU
                  <span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <input ref={(input) => this.addProduct_sku = input} type="text" className="form-control"  />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Name<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <input ref={(input) => this.addProduct_product_name = input} type="text" className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Colour<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <input ref={(input) => this.addProduct_product_colour = input} type="text" className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Category<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <input ref={(input) => this.addProduct_product_category = input} type="text" className="form-control" />
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

  productsTable(){
    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th colSpan="5">
                Search: &nbsp;
                <input className="table-search" type="text" value={this.state.productsTableSearch} onChange={(e) => this.setState({productsTableSearch: e.target.value})} />
              </th>
            </tr>
            <tr>
              <th>SKU</th>
              <th>Inventory</th>
              <th>Name</th>
              <th>Colour</th>
              <th>
                <span className="table-link" data-toggle="modal" data-target="#addProductModal">
                  Add Product
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.products.filter(
                row => JSON.stringify(row).toLowerCase().includes(this.state.productsTableSearch.toLowerCase())
              ).map(
                (product, index) => {
                  return (
                    <tr key={product.product_id} className={(this.state.productDisplay.product_id === product.product_id ? "active" : "")}>
                      <td>{product.sku}</td>
                      <td>{product.quantity_on_hand}</td>
                      <td>{product.product_name}</td>
                      <td>{product.product_colour}</td>
                      <td
                        onClick={this.productDisplayInfo.bind(this, product)}
                        className="table-link"
                        >
                          <a href="#partnerDisplay">
                            view
                          </a>
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

  productDisplayInfo(product){
    this.setState({productDisplay: product, productDisplayNoticeMessage: ''});
    this.product_id.value = product.product_id;
    this.sku.value = product.sku;
    this.product_name.value = product.product_name;
    this.product_colour.value = product.product_colour;
    this.product_category.value = product.product_category;
  }

  productDisplay(){
    return (
      <div className={"box" + (this.state.productDisplay ? "" : " hidden")} id="partnerDisplay">
        <form>
          <div className="box-header">
            <button className="mini-button delete" onClick={this.deleteProduct}>Delete Product</button>
            <h5 className="box-title">Product Information</h5>
          </div>
          <NoticeBox Message={this.state.productDisplayNoticeMessage} />
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Product ID
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.product_id = input} type="text" className="form-control" disabled />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">SKU
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.sku = input} type="text" className="form-control" disabled />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Name
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.product_name = input} type="text" className="form-control" disabled />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Colour
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.product_colour = input} type="text" className="form-control" disabled />
            </div>
          </div>
          <div className="form-group row">
            <label className="control-label col-md-3 col-sm-3 col-xs-12">Category
            </label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <input ref={(input) => this.product_category = input} type="text" className="form-control" disabled />
            </div>
          </div>
        </form>
      </div>
    );
  }

  deleteProduct(e){
    e.preventDefault();
    if(!window.confirm("Are you sure you would like to delete the product SKU: " + this.state.productDisplay.sku + " ?")){
      return;
    }
    const params = {
      product_id: this.state.productDisplay.product_id,
    };
    axios.post(apiRoute("admin", "deleteProduct"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.getProducts();
          this.setState({productDisplay: ''});
        } else {
          this.productDisplayNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.productDisplayNotice({status: "error", message: error.message});
      }
    );
  }

  removeInventoryModal(){
    return (
      <div className="modal" id="removeInventoryModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <form ref="removeInventoryForm" className="login-form" onSubmit={this.removeInventoryRequest}>
                <h5>Remove Inventory</h5>
                <NoticeBox Message={this.state.removeInventoryNoticeMessage} />
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Partner Order #<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <input ref={(input) => this.partnerOrderId = input} type="number" min="0" className="form-control"  />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Quantity<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <input ref={(input) => this.quantityToRemove = input} type="number" min="1" className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Destination<span className="required">*</span>
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <select ref={(input) => this.inventoryDestination = input} type="text" className="form-control">
                      <option></option>
                      <option value="shopify">shopify</option>
                      <option value="amazon">amazon</option>
                      <option value="ambassadors">ambassadors</option>
                      <option value="retailer">retailer</option>
                      <option value="discarded">discarded</option>
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12">Note
                  </label>
                  <div className="col-md-9 col-sm-9 col-xs-12">
                    <input ref={(input) => this.recordNote = input} type="textarea" className="form-control" />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-sm-12">
                    <input value="Remove" type="submit" className="form-control" />
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

  removeInventoryRequest(e){
    e.preventDefault();
    if(!this.recordNote.value){
      this.recordNote.value = "-";
    }
    const params = {
      partner_order_id: this.partnerOrderId.value,
      quantity: this.quantityToRemove.value,
      destination: this.inventoryDestination.value,
      note: this.recordNote.value
    };
    axios.post(apiRoute("admin", "removeInventory"), qs.stringify(params)).then(
      response => {
        if(response.data.status === "success"){
          this.removeInventoryNotice({status: "success", message: "Inventory removed!"});
          this.setState({productDisplay: response.data.result});
          this.refs.removeInventoryForm.reset();
          this.getProducts();
        } else {
          this.removeInventoryNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.removeInventoryNotice({status: "error", message: error.message});
      }
    );
  }

  removeInventoryNotice(message){
    this.setState({removeInventoryNoticeMessage: message});
  }

  productInventory(){
    return (
      <div className={"box" + (this.state.productDisplay ? "" : " hidden")}>
        <div className="box-header">
          <Link to={"/admin/orders"}>
            <button className="mini-button">Add</button>
          </Link>
          <button className="mini-button" data-toggle="modal" data-target="#removeInventoryModal">Remove</button>
          <h5 className="box-title">Product Inventory</h5>
        </div>
        <div className="row">
          <label className="col-md-6 col-sm-6 col-xs-12">
            <strong>Inventory on hand :</strong>
          </label>
          <label className="col-md-6 col-sm-6 col-xs-12">
            {this.state.productDisplay.quantity_on_hand}
          </label>
          <br/>
        </div>
        {this.productInventoryOrdersTable()}
      </div>
    );
  }

  productInventoryOrdersTable(){
    if(this.state.productDisplay.orders){
      return (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>In</th>
                <th>Out</th>
                <th>Partner</th>
                <th>Closed</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.productDisplay.orders.map(
                  (order, index) => {
                    return (
                      <tr key={order.partner_order_id}>
                        <td>{order.partner_order_id}</td>
                        <td>{order.order_quantity_in}</td>
                        <td>{order.order_quantity_out}</td>
                        <td>{order.partner.first_name} {order.partner.last_name} [ID# {order.partner.partner_id}]</td>
                        <td>
                          <Timestamp time={order.closed_timestamp} utc={false} format='full' />
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
  }

  render() {
    return (
      <div>
        <Nav />
        <div className="page-content">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                {this.removeInventoryModal()}
                {this.addProductModal()}
                {this.productsTable()}
              </div>
              <div className="col-md-6">
                <div className="info-box">
                  {this.productDisplay()}
                  {this.productInventory()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AdminProducts;
