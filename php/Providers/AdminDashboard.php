<?php

/**
 * Retreives all data needed for the admin dashboard page.
 *
 */
class AdminDashboard
{
  /**
   * Fetches partner orders, constructs an array of orders that are neither closed nor discarded, returns the amount of undiscarded/unlcosed partner orders. Fetches material requests, constructs an array of requests that are unresolved, returns the amount of unresolved material requests. Fetches all products that have valid inventories, returns them without their order data and status.
   *
   * @return array Dashboard Data
   */
  public static function readDashboardData()
  {
    $partner_orders = PartnerOrders::readPartnerOrders();
    $orders = [];
    foreach($partner_orders as $value){
      if($value['status'] !== "closed"){
        if($value['status'] !== "discarded"){
          $orders[] = $value;
        }
      }
    }
    $material_requests = Materials::readMaterialRequests();
    $requests = [];
    foreach($material_requests as $value){
      if($value['status'] !== "resolved"){
        $requests[] = $value;
      }
    }
    $products = Products::readProducts();
    $inventory = [];
    foreach($products as $value){
      if($value['quantity_on_hand'] > 0){
        unset($value['orders']);
        unset($value['deleted']);
        $inventory[] = $value;
      }
    }
    return [
      'active_partner_orders' => sizeof($orders),
      'unresolved_material_requests' => sizeof($requests),
      'partners_logged_in' => self::partnersLoggedInToday(),
      'admins_logged_in' => self::adminsLoggedInToday(),
      'inventory' => $inventory,
    ];
  }

  /**
   * Fetches amount of partners logged in in the past day.
   *
   * @return int amount of partners logged in in the past day.
   */
  private static function partnersLoggedInToday()
  {
    $time = date("Y-m-d H:i:s", strtotime('- 1 day')).'-04:00';
    $sql = "SELECT DISTINCT partner_id FROM partner_session_logs WHERE timestamp > '$time'";
    $result = mysqli_query(DB::connect(), $sql);
    return mysqli_num_rows($result);
  }

  /**
   * Fetches amount of admins logged in in the past day.
   *
   * @return int amount of admins logged in in the past day.
   */
  private static function adminsLoggedInToday()
  {
    $time = date("Y-m-d H:i:s", strtotime('- 1 day')).'-04:00';
    $sql = "SELECT DISTINCT admin_id FROM admin_session_logs WHERE timestamp > '$time'";
    $result = mysqli_query(DB::connect(), $sql);
    return mysqli_num_rows($result);
  }
}
