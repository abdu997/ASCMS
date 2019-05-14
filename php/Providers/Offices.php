<?php
/**
 * This class includes all local office operations.
 *
 */
class Offices
{
  /**
   * Retrieves all undeleted offices.
   *
   * @return array           json array of the call status and result
   */
  public static function readOffices()
  {
    $sql = "SELECT * FROM local_offices WHERE deleted = false";
    $result = mysqli_query(DB::connect(), $sql);
    $output = [];
    while($row = mysqli_fetch_assoc($result)){
      $output[] = $row;
    }
    return $output;
  }

  /**
   * Creates a new office. Checks if user has HQ ranking. Checks if there
   * aren't any post values. Inserts office into database.
   *
   * @return array           json array of the call status and result
   */
  public static function createOffice()
  {
    if(!Session::assertHQ()){
      return trigger_error('Access Denied');
    }
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $city = $_POST['office_city'];
    $address = $_POST['office_address'];
    $country = $_POST['office_country'];
    $sql = "INSERT INTO local_offices(city, address, country) VALUES('$city', '$address', '$country')";
    if(mysqli_query(DB::connect(), $sql)){
      return 'Office created!';
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Deletes an office. Checks if user has HQ ranking.
   * Checks if there aren't any post values. Checks if office is still connected
   * to partners or admins. Then marks an office as deleted.
   *
   * @return array           json array of the call status and result
   */
  public static function deleteOffice()
  {
    if(!Session::assertHQ()){
      return trigger_error('Access Denied');
    }
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $office_id = $_POST['office_id'];
    if(self::officeHasDependants($office_id)){
      return trigger_error(self::officeHasDependants($office_id));
    }
    $sql = "UPDATE local_offices SET deleted = true WHERE office_id = '$office_id'";
    if(mysqli_query(DB::connect(), $sql)){
      return null;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Checks if admins or partners are still connected to an office. If office
   * has dependants, a message is returned describing the partner/admin that is
   * still connected to the office. Returns false if office has no dependants.
   *
   * @param  int $office_id
   * @return mixed           boolean or message string
   */
  public static function officeHasDependants($office_id)
  {
    if(self::officeHasAdmins($office_id)){
      $admin = self::officeHasAdmins($office_id);
      $message = "Admin ".$admin['first_name']." ".$admin['last_name']." [ID# ".$admin['admin_id']."] is still assigned to this office.";
    } elseif(self::officeHasPartners($office_id)){
      $partner = self::officeHasPartners($office_id);
      $message = "Partner ".$partner['first_name']." ".$partner['last_name']." [ID# ".$partner['partner_id']."] is still assigned to this office.";
    } else {
      return false;
    }
    return $message;
  }

  /**
   * Checks office has partners. Searches through the partner_accounts table
   * using the office_id, and returns the partner's row.
   *
   * @param  int $office_id
   * @return array            Partner info
   */
  public static function officeHasPartners($office_id)
  {
    $sql = "SELECT partner_id, first_name, last_name FROM partner_accounts WHERE office_id = '$office_id' AND deleted = false";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    return $row;
  }

  /**
  * Checks office has admin. Searches through the admin_accounts table
  * using the office_id, and returns the admin's row.
  *
  * @param  int $office_id
  * @return array            Admin info
   */
  public static function officeHasAdmins($office_id)
  {
    $sql = "SELECT admin_id, first_name, last_name FROM admin_accounts WHERE office_id = '$office_id' AND deleted = false";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    return $row;
  }

  /**
   * Updates an office's details. Checks if user has HQ ranking. Checks if there
   * aren't any post values. Updates office record in the database.
   *
   * @return array           json array of the call status and result
   */
  public static function updateOfficeDetails()
  {
    if(!Session::assertHQ()){
      return trigger_error('Access Denied');
    }
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $office_id = $_POST['office_id'];
    $office_address = $_POST['office_address'];
    $office_city = $_POST['office_city'];
    $office_country = $_POST['office_country'];
    $sql = "UPDATE local_offices SET city ='$office_city', country = '$office_country', address = '$office_address' WHERE office_id = '$office_id'";
    if(mysqli_query(DB::connect(), $sql)){
      return null;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Fetches office row from local offices table using the office_id.
   *
   * @param  int $office_id
   * @return array            An office's data
   */
  public static function fetchOffice($office_id)
  {
    $sql = "SELECT * FROM local_offices WHERE office_id = '$office_id'";
    $result = mysqli_query(DB::connect(), $sql);
    return mysqli_fetch_assoc($result);
  }
}
