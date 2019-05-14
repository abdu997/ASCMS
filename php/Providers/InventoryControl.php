<?php
/**
 * This class involves all inventory operations.
 *
 */
class InventoryControl
{
  /**
   * Creates a new inventory in record using product_id, quantity and
   * partner_order_id.
   *
   * @param  int $product_id
   * @param  int $quantity
   * @param  int $partner_order_id
   */
  public static function createInventoryInRecord($product_id, $quantity, $partner_order_id)
  {
    $sql = "INSERT INTO inventory_in(product_id, quantity_in, partner_order_id) VALUES('$product_id', '$quantity', '$partner_order_id')";
    $result = mysqli_query(DB::connect(), $sql);
  }

  private static function fetchInventoryOut($record_id_in)
  {
    $sql = "SELECT * FROM inventory_out WHERE record_id_in = '$record_id_in'";
    $result = mysqli_query(DB::connect(), $sql);
    $output = [];
    $row = mysqli_fetch_assoc($result);
    return $output;
  }

  /**
   * Outputs the in and out inventory records for a product. Including info
   * about the partner producer's info, when the order was closed and quantity
   * was accounted into the inventory and the total on hand inventory of a
   * product.
   *
   * @param  int $product_id
   * @return array
   */
  public static function fetchProductInventoryRows($product_id)
  {
    $sql = "SELECT record_id_in, partner_order_id, quantity_in AS order_quantity_in FROM inventory_in WHERE product_id = '$product_id'";
    $result = mysqli_query(DB::connect(), $sql);
    $output = [];
    while($row = mysqli_fetch_assoc($result)){
      $row['partner'] = Partners::fetchPartner(PartnerOrders::fetchOrder($row['partner_order_id'])['partner_id']);
      $row['closed_timestamp'] = PartnerOrders::fetchOrder($row['partner_order_id'])['closed_timestamp'];
      $row['order_quantity_out'] = self::fetchOrderQuantityOut($row['record_id_in']);
      if(is_null($row['order_quantity_out'])){
        $row['order_quantity_out'] = "0";
      }
      $row['on_hand'] = $row['order_quantity_in'] - $row['order_quantity_out'];
      $output[] = $row;
    }
    return $output;
  }

  /**
   * Fetches all quantity out records for an inventory in record.
   *
   * @param  int  $record_id_in   inventory in record reference
   * @return int                  aggregate quantity out
   */
  private static function fetchOrderQuantityOut($record_id_in)
  {
    $sql = "SELECT SUM(quantity_out) AS quantity_out FROM inventory_out WHERE record_id_in = '$record_id_in'";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    return $row['quantity_out'];
  }

  /**
   * Fetches inventory in record data using the partner_order_id
   *
   * @param  int $partner_order_id
   * @return array                   inventory in record
   */
  public static function fetchOrderInventoryIn($partner_order_id)
  {
    $sql = "SELECT * FROM inventory_in WHERE partner_order_id = '$partner_order_id'";
    $result = mysqli_query(DB::connect(), $sql);
    return mysqli_fetch_assoc($result);
  }

  /**
   * Retrieves the aggregate in-inventory and subtracts it by the the aggregate
   * out-inventory quantity to outpu the quantity on hand of a product.
   *
   * @param  int $product_id
   * @return int             Quantity on hand
   */
  public static function currentProductInventory($product_id){
    $sql = "SELECT (SELECT SUM(quantity_in) FROM inventory_in WHERE product_id = '$product_id') AS quantity_in, (SELECT SUM(quantity_out) FROM inventory_out WHERE product_id = '$product_id') AS quantity_out";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    if(is_null($row['quantity_out'])){
      $row['quantity_out'] = 0;
    }
    $quantity_on_hand = $row['quantity_in'] - $row['quantity_out'];
    return $quantity_on_hand;
  }

  /**
   * Removes an amount from the in-inventory. Checks if the user has HQ ranking.
   * Checks if post array has empty values. Checks if partner_order_id exists or is closed.
   * Validates whether quantity to be removed value is a positive whole number.
   * Fetches the inventory-in record data and checks if quantity to be removed
   * does not excede the quantity on hand. If all conditions are met, and
   * inventory_out record is then created in the database that also records
   * the admin_id of the admin that removed the inventory. The updated product
   * array is also returned in the callback
   *
   * @return array callback result
   */
  public static function removeInventory()
  {
    if(!Session::assertHQ()){
      return trigger_error('Access Denied');
    }
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $partner_order_id = $_POST['partner_order_id'];
    if(!PartnerOrders::fetchOrder($partner_order_id) || PartnerOrders::fetchOrder($partner_order_id)['status'] !== "closed"){
      return trigger_error('order does not exist or has not been closed');
    }
    $quantity = $_POST['quantity'];
    if(is_float($quantity) || $quantity < 1){
      return trigger_error('Quantity must be a positive whole number');
    }
    $order_in = self::fetchOrderInventoryIn($partner_order_id);
    $record_id_in = $order_in['record_id_in'];
    $order_quantity_out = self::fetchOrderQuantityOut($record_id_in);
    $available_quantity = $order_in['quantity_in'] - $order_quantity_out;
    $final_quantity = $available_quantity - $quantity;
    if($final_quantity < 0){
      return trigger_error('There are only '.$available_quantity.' units available from this order');
    }
    $product_id = $order_in['product_id'];
    $destination = $_POST['destination'];
    $note = $_POST['note'];
    $admin_id = $_SESSION['admin_id'];
    $sql = "INSERT INTO inventory_out(record_id_in, product_id, admin_id, quantity_out, destination, note) VALUES('$record_id_in', '$product_id', '$admin_id', '$quantity', '$destination', '$note')";
    if(mysqli_query(DB::connect(), $sql)){
      return Products::fetchProductWithInventory($product_id);
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }
}
