<?php
/**
 * This class handles all partner demerit related operations.
 */
class PartnerDemerits
{
  /**
   * Retrieves all partner demerits with the demerit receiving partner's data
   * and demerit issuing admin's data. Checks if user has HQ ranking, then
   * returns a response to the call.
   *
   * @return array callback result
   */
  public static function readPartnerDemerits($partner_order_id)
  {
    $sql = "SELECT * FROM partner_demerits WHERE partner_order_id = '$partner_order_id'";
    $result = mysqli_query(DB::connect(), $sql);
    $output = [];
    while($row = mysqli_fetch_assoc($result)){
      $row['admin'] = Admins::fetchAdmin($row['admin_id']);
      $row['partner'] = Partners::fetchPartner($row['partner_id']);
      $output[] = $row;
    }
    return $output;
  }

  /**
   * Creates a demerit connected to a partner, partner order and admin. checks
   * if user has HQ ranking. Ckecks if empty post values exist. Retrieves
   * partner_id using the partner_order_id and admin_id from the session values.
   * Demerit record is then inserted into the database.
   *
   * @return array callback result
   */
  public static function createPartnerDemerits()
  {
    $timestamp = DB::timestamp();
    if(!Session::assertHQ()){
      return trigger_error('Access Denied');
    }
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $partner_order_id = $_POST['partner_order_id'];
    if(PartnerOrders::fetchOrder($partner_order_id)['status'] === "closed"){
      return trigger_error('This order has been closed');
    }
    $partner_id = PartnerOrders::fetchOrder($partner_order_id)['partner_id'];
    $admin_id = $_SESSION['admin_id'];
    $sql = "INSERT INTO partner_demerits(partner_order_id, partner_id, admin_id, timestamp) VALUES('$partner_order_id', '$partner_id', '$admin_id', '$timestamp')";
    if(mysqli_query(DB::connect(), $sql)){
      return PartnerOrders::fetchOrder($partner_order_id);
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Fethces the amount of demerits a partner has accumulated.
   *
   * @param  int $partner_id
   * @return int             demerit count
   */
  public static function fetchDemeritCount($partner_id)
  {
    $sql = "SELECT COUNT(record_id) AS count FROM partner_demerits WHERE partner_id = '$partner_id'";
    $result = mysqli_query(DB::connect(), $sql);
    return mysqli_fetch_assoc($result)['count'];
  }
}
