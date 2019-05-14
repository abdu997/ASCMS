<?php
/**
 * Invloves all product operations.
 *
 */
class Products
{
  /**
   * Retrieves all undeleted products with their quantity on hand amount and orders.
   *
   * @return array           json array of the call status and result
   */
  public static function readProducts()
  {
    $sql = "SELECT product_id FROM products WHERE deleted = false";
    $result = mysqli_query(DB::connect(), $sql);
    $output = [];
    while($row = mysqli_fetch_assoc($result)){
      $row = self::fetchProductWithInventory($row['product_id']);
      $output[] = $row;
    }
    return $output;
  }

  /**
   * Updates a products data. Checks if the user has HQ ranking. Checks if there are empty post
   * values. Updates product in the database.
   *
   * @return array           json array of the call status and result
   */
  public static function updateProduct()
  {
    if(!Session::assertHQ()){
      return trigger_error('Access Denied');
    }
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $product_id = $_POST['product_id'];
    $product_name = $_POST['product_name'];
    $product_colour = $_POST['product_colour'];
    $product_category = $_POST['product_category'];
    $sql = "UPDATE products SET product_name = '$product_name', product_colour = '$product_colour', product_category = '$product_category' WHERE product_id = '$product_id'";
    if(mysqli_query(DB::connect(), $sql)){
      return null;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Deletes product. Checks if the user has HQ ranking. Checks if there are empty post
   * values. Checks if product still has inventory, inventory amount is returned. Checks if product is apart of a current order. Message is returned. Product  is marked as deleted in the database.
   *
   * @return array           json array of the call status and result
   */
  public static function deleteProduct()
  {
    if(!Session::assertHQ()){
      return trigger_error('Access Denied');
    }
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $product_id = $_POST['product_id'];
    if(InventoryControl::currentProductInventory($product_id) !== 0){
      return trigger_error(InventoryControl::currentProductInventory($product_id).' units are still in inventory');
    }
    if(PartnerOrders::productIsInProgress($product_id)){
      return trigger_error(PartnerOrders::productIsInProgress($product_id));
    }
    $sql = "UPDATE products SET deleted = true WHERE product_id = '$product_id'";
    if(mysqli_query(DB::connect(), $sql)){
      return null;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Creates product. Checks if the user has HQ ranking. Checks if there are empty post
   * values. Checks if sku is unique. Inserts product into database.
   *
   * @return array callback result
   */
  public static function createProduct()
  {
    if(!Session::assertHQ()){
      return trigger_error('Access Denied');
    }
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $sku = $_POST['sku'];
    if(!self::skuIsUnique($sku)){
      return trigger_error('SKU is already being used by another product');
    }
    $product_name = $_POST['product_name'];
    $product_colour = $_POST['product_colour'];
    $product_category = $_POST['product_category'];
    $sql = "INSERT INTO products(sku, product_name, product_colour, product_category) VALUES('$sku', '$product_name', '$product_colour', '$product_category')";
    if(mysqli_query(DB::connect(), $sql)){
      return 'Product created!';
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Checks if product exists and returns a boolean.
   *
   * @param  int $product_id
   * @return bool
   */
  public static function productExists($product_id)
  {
    $sql = "SELECT * FROM products WHERE product_id = '$product_id'";
    $result = mysqli_query(DB::connect(), $sql);
    $count = mysqli_num_rows($result);
    if($count === 1){
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if sku is unique to products and returns a boolean.
   *
   * @param  string $sku
   * @return bool
   */
  private static function skuIsUnique($sku)
  {
    $sql = "SELECT * FROM products WHERE sku = '$sku'";
    $result = mysqli_query(DB::connect(), $sql);
    $count = mysqli_num_rows($result);
    if($count === 0){
      return true;
    } else {
      return false;
    }
  }

  /**
   * Retrieves a product with its quantity_on_hand amount.
   *
   * @param  int $product_id
   * @return array             product data
   */
  public static function fetchProduct($product_id)
  {
    $sql = "SELECT * FROM products WHERE product_id = '$product_id'";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    $row['quantity_on_hand'] = InventoryControl::currentProductInventory($product_id);
    return $row;
  }

  /**
   * Fetches product from fetchProduct and adds orders to the array.
   *
   * @param  int $product_id
   * @return array             product
   */
  public static function fetchProductWithInventory($product_id)
  {
    $row = self::fetchProduct($product_id);
    $row['orders'] = InventoryControl::fetchProductInventoryRows($row['product_id']);
    return $row;
  }
}
