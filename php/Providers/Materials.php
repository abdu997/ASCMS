<?php

/**
 * This class involves all material related operations.
 *
 */
class Materials
{
  /**
   * Create a partner order material request record using the partner_order_id
   * and the current user partner_id. Contact admin when request after request is recorded.
   *
   * @return string json array of the call status.
   */
  public static function requestPartnerOrderMaterials()
  {
    $timestamp = DB::timestamp();
    $partner_order_id = $_POST['partner_order_id'];
    $partner_id = $_SESSION['partner_id'];
    $order = PartnerOrders::fetchOrder($partner_order_id);
    $partner_name = $order['partner']['first_name']." ".$order['partner']['last_name'];
    $product_name = $order['product']['product_name'];
    $product_colour = $order['product']['product_colour'];
    $order_quantity = $order['quantity'];
    $admin_id = $order['admin_id'];
    $sql = "INSERT INTO material_requests(partner_order_id, partner_id, timestamp) VALUES('$partner_order_id', '$partner_id', '$timestamp')";
    if(mysqli_query(DB::connect(), $sql)){
      Admins::contactAdmin($admin_id, "Material Request", "Partner ".$partner_name." has issued a material request for partner order #".$partner_order_id.", Product name: ".$product_name.", Colour: ".$product_colour.", Qty: ".$order_quantity);
      return null;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Checks if are any unresolved materials requests connected to the partner
   * order. Returns a false if condition is not met.
   *
   * @param  int $partner_order_id
   * @return bool
   */
  public static function noOpenRequests($partner_order_id)
  {
    $sql = "SELECT * FROM material_requests WHERE partner_order_id = '$partner_order_id' AND status = 'open'";
    $result = mysqli_query(DB::connect(), $sql);
    $count = mysqli_num_rows($result);
    if($count > 0){
      return false;
    } else {
      return true;
    }
  }

  /**
   * Fetches all material requests with order info, the partners info and
   * product info.
   *
   * @return array callback result
   */
  public static function readMaterialRequests()
  {
    $sql = "SELECT * FROM material_requests";
    $result = mysqli_query(DB::connect(), $sql);
    $output = [];
    while($row = mysqli_fetch_assoc($result)){
      $row['order'] = PartnerOrders::fetchOrder($row['partner_order_id']);
      $row['partner'] = Partners::fetchPartner($row['partner_id']);
      $row['product'] = Products::fetchProduct($row['order']['product_id']);
      $output[] = $row;
    }
    return $output;
  }

  /**
   * Marks a material requests as resolved and record the admin_id of the admin
   * who resolved the request.
   *
   * @return string json array of the call status.
   */
  public static function resolveMaterialRequest()
  {
    $admin_id = $_SESSION['admin_id'];
    $record_id = $_POST['record_id'];
    $sql = "UPDATE material_requests SET admin_id = '$admin_id', status = 'resolved' WHERE record_id = '$record_id'";
    if(mysqli_query(DB::connect(), $sql)){
      return null;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }
}
