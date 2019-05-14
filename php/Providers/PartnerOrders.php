<?php

/**
 * This class involves all Partner Order operations.
 *
 */
class PartnerOrders
{
  /**
   * Fetches all relevant partner orders. Checks if user has HQ ranking, if so,
   * fetches all partner_order_ids, if the user is a partner, fetches all
   * partner_order_ids using the user's partner_id. Uses the partner_order_ids
   * the fetch the partner_order. We do this so that we don't have to place all
   * fetch operations here that already exist in fetchOrder.
   *
   * @return array           json array of the call status and result
   */
  public static function readPartnerOrders()
  {
    if(Session::assertHQ()){
      $sql = "SELECT partner_order_id FROM partner_orders";
    } elseif(isset($_SESSION['partner_id'])){
      $partner_id = $_SESSION['partner_id'];
      $sql = "SELECT partner_order_id FROM partner_orders WHERE partner_id = '$partner_id'";
    } else {
      return trigger_error('Access Denied');
    }
    $result = mysqli_query(DB::connect(), $sql);
    $output = [];
    while($row = mysqli_fetch_assoc($result)){
      $output[] = self::fetchOrder($row['partner_order_id']);
    }
    return $output;
  }

  /**
   * Creates a partner order. Checks if user has HQ ranking. Checks
   * if there are empty post values. Checks if quantity is a whole number greater than 1. Checks if the product exists using the
   * product_id. Checks if partner infact exists and is active. Inserts the new
   * partner order in the database. Generates a token for a partner entry link.
   * Sends the partner entry link along with a message as an sms to the partner.
   * If createPartnerToken returns an error, it's response is returned.
   *
   * @return array           json array of the call status and result
   */
  public static function createPartnerOrder()
  {
    $timestamp = DB::timestamp();
    if(!Session::assertHQ()){
      return trigger_error('Access Denied');
    }
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $partner_id = $_POST['partner_id'];
    $admin_id = $_SESSION['admin_id'];
    $status = "sent";
    $quantity = $_POST['quantity'];
    if(is_float($quantity) || $quantity < 1){
      return trigger_error('Quantity must be a positive whole number');
    }
    $product_id = $_POST['product_id'];
    if(!Products::productExists($product_id)){
      return trigger_error('Product does not exist');
    }
    if(!Partners::activePartnerExists($partner_id)){
      return trigger_error('Partner does not exist');
    }
    $sql = "INSERT INTO partner_orders(partner_id, admin_id, status, quantity, product_id, created_timestamp) VALUES('$partner_id', '$admin_id', '$status', '$quantity', '$product_id', '$timestamp')";
    if(mysqli_query(DB::connect(), $sql)){
      $partner_order_id = mysqli_insert_id(DB::connect());
      $token = Session::createPartnerToken($partner_id, $partner_order_id);
      if($token){
        $partner = Partners::fetchPartner($partner_id);
        $phone_number = $partner['phone_number'];
        $message = "you have a new order! Order link: ".apache_request_headers()['Origin']."/partner/login?token=".$token;
        Twilio::sendSMS($partner['phone_number'], $message, $partner['first_name'], $partner['last_name']);
        return null;
      } else {
        return Session::createPartnerToken($partner_id, $partner_order_id);
      }
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Updates a partner order. Checks if user has HQ ranking. Checks if there are
   * empty post values. Checks if quantity is a whole number greater than 1. Checks if the order was not accepted or if order status
   * is being updated to acepted. Checks if order is not closed. Partner order
   * is then updated in the database.
   *
   * @return array           json array of the call status and result
   */
  public static function updatePartnerOrder()
  {
    if(!Session::assertHQ()){
      return trigger_error('Access Denied');
    }
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $partner_order_id = $_POST['partner_order_id'];
    $status = $_POST['status'];
    $old_order_data = self::fetchOrder($partner_order_id);
    $old_status = $old_order_data['status'];
    if($old_status === "accepted" && $status === "accepted"){
      return trigger_error('This order has been accepted by the partner, therefore you may not edit this order.');
    }
    if($old_status === "closed"){
      return trigger_error('This order has been closed');
    }

    $quantity = $_POST['quantity'];
    if(is_float($quantity) || $quantity < 1){
      return trigger_error('Quantity must be a positive whole number');
    }
    if($status === "closed"){
      $timestamp = DB::timestamp();
    } else {
      $timestamp = null;
    }
    $sql = "UPDATE partner_orders SET status = '$status', quantity = '$quantity', closed_timestamp = '$timestamp' WHERE partner_order_id = '$partner_order_id' AND status <> 'closed'";
    if(mysqli_query(DB::connect(), $sql)){
      if($status === "closed"){
        InventoryControl::createInventoryInRecord(
          $old_order_data['product_id'],
          $quantity,
          $partner_order_id
        );
      }
      return $old_order_data;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Fetches order data along with the partner, admin and product data array.
   * Also retrieves if an unresolved materials request for the order exists.
   *
   * @param  int $partner_order_id
   * @return array                   order data array
   */
  public static function fetchOrder($partner_order_id)
  {
    $sql = "SELECT * FROM partner_orders WHERE partner_order_id = '$partner_order_id'";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    if(mysqli_num_rows($result) === 0){
      return false;
    }
    $row['partner'] = Partners::fetchPartner($row['partner_id']);
    $row['admin'] = Admins::fetchAdmin($row['admin_id']);
    $row['product'] = Products::fetchProduct($row['product_id']);
    $row['materials_requested'] =  Materials::noOpenRequests($row['partner_order_id']);
    $row['demerits'] = PartnerDemerits::readPartnerDemerits($row['partner_order_id']);
    if($row['status'] !== "closed"){
      unset($row['closed_timestamp']);
    } else {
      $row['demerit_count'] = self::orderDemerits($partner_order_id);
    }
    return $row;
  }

  /**
   * Fethces the amount of demerits a partner order has accumulated.
   *
   * @param  int $partner_id
   * @return int             demerit count
   */
  private static function orderDemerits($partner_order_id)
  {
    $sql = "SELECT COUNT(record_id) AS count FROM partner_demerits WHERE partner_order_id = '$partner_order_id'";
    $result = mysqli_query(DB::connect(), $sql);
    return mysqli_fetch_assoc($result)['count'];
  }

  /**
   * Checks if a product is in an unclosed or undiscarded order. Returns a
   * message describing the partner order if row exists. Returns false if not.
   *
   * @param  int $product_id
   * @return mixed             Message or false
   */
  public static function productIsInProgress($product_id)
  {
    $sql = "SELECT * FROM partner_orders WHERE product_id = '$product_id' AND status <> 'closed' AND status <> 'discarded'";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    $count = mysqli_num_rows($result);
    if($count > 0){
      return "Product is currently associated with partner order id: ".$row['partner_order_id']." status: ".$row['status'];
    } else {
      return false;
    }
  }

  /**
   * Checks if an admin is in an unclosed or undiscarded order. Returns a
   * message describing the partner order if row exists. Returns false if not.
   *
   * @param  int $admin_id
   * @return mixed             Message or false
   */
  public static function adminIsInOrder($admin_id)
  {
    $sql = "SELECT * FROM partner_orders WHERE admin_id = '$admin_id' AND status <> 'closed' AND status <> 'discarded'";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    $count = mysqli_num_rows($result);
    if($count > 0){
      return "Admin is currently associated with partner order id: ".$row['partner_order_id']." status: ".$row['status'];
    } else {
      return false;
    }
  }

  /**
   * Checks if a partner is in an unclosed or undiscarded order. Returns a
   * message describing the partner order if row exists. Returns false if not.
   *
   * @param  int $partner_id
   * @return mixed             Message or false
   */
  public static function partnerIsInOrder($partner_id)
  {
    $sql = "SELECT * FROM partner_orders WHERE partner_id = '$partner_id' AND status <> 'closed' AND status <> 'discarded'";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    $count = mysqli_num_rows($result);
    if($count > 0){
      return "Partner is currently associated with partner order id: ".$row['partner_order_id']." status: ".$row['status'];
    } else {
      return false;
    }
  }

  /**
   * Gives a partner the power to update a partner order status. Checks if user
   * has HQ ranking. Checks if there are empty post values. Updated the status
   * in the partner_orders table.
   *
   * @return array           json array of the call status and result
   */
  public static function updatePartnerOrderStatus()
  {
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $partner_order_id = $_POST['partner_order_id'];
    $admin_id = self::fetchOrder($partner_order_id)['admin_id'];
    $new_status = $_POST['new_status'];
    $partner = Partners::fetchPartner($_SESSION['partner_id']);
    $partner_name = $partner['first_name']." ".$partner['last_name'];
    $sql = "UPDATE partner_orders SET status = '$new_status' WHERE partner_order_id = '$partner_order_id'";
    if(mysqli_query(DB::connect(), $sql)){
      Admins::contactAdmin($admin_id, "Partner Order #".$partner_order_id." ".$new_status, "Partner Order #".$partner_order_id." status changed to : ".$new_status.". By: ".$partner_name);
      return null;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }
}
