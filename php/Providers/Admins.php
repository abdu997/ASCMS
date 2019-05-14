<?php
/**
 * This class involves all operations of the admin account group
 *
 */
class Admins
{
  /**
   * Retrieves the user admin's account details info by calling fetchAdmin using
   * the admin_id session variable.
   *
   * @return array callback result
   */
  public static function getAccountDetails()
  {
    return self::fetchAdmin($_SESSION['admin_id']);
  }

  /**
   * Updates the current session admin's account details. Checks if array
   * doesn't have empty values. Defines the essential values as variables. Checks if the phone number is valid. Then
   * checks if admin's email is valid and unique to the admin group. Following,
   * the function updates the database using the admin's admin_id session value.
   *
   * @return array callback result
   */
  public static function updateAccountDetails()
  {
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $admin_id = $_SESSION['admin_id'];
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $email = $_POST['email'];
    $phone_number = $_POST['phone_number'];
    if(Data::phoneNumberIsValid($phone_number)){
      return Data::phoneNumberIsValid($phone_number);
    }
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      return trigger_error('Email is invalid');
    }
    if(!self::emailIsUnique($email, $admin_id)){
      return trigger_error('email is already being used');
    }
    $sql = "UPDATE admin_accounts SET first_name = '$first_name', last_name = '$last_name', email = '$email', phone_number = '$phone_number' WHERE admin_id = '$admin_id'";
    if(mysqli_query(DB::connect(), $sql)){
      return null;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Updates an admin accounts information. Checks if there are empty post
   * values. Defines essential values into variables. Then checks if the phone
   * number and email values are valid. Checks if the user has HQ ranking, then the
   * admin's rank and office can be changed, if not, and error will be returned.
   * The admin's are then changed in the database.
   *
   * @return array callback result
   */
  public static function updateAdminInfo()
  {
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $admin_id = $_POST['admin_id'];
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $email = $_POST['email'];
    $home_address = $_POST['home_address'];
    $phone_number = $_POST['phone_number'];
    if(Data::phoneNumberIsValid($phone_number)){
      return Data::phoneNumberIsValid($phone_number);
    }
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      return trigger_error('Email is invalid');
    }
    if(!self::emailIsUnique($email, $admin_id)){
      return trigger_error('email is already being used');
    }
    if(Session::assertHQ()){
      $rank = $_POST['account_rank'];
      $office_id = $_POST['office_id'];
      $sql = "UPDATE admin_accounts SET first_name = '$first_name', last_name = '$last_name', email = '$email', home_address = '$home_address', phone_number = '$phone_number', account_rank = '$rank', office_id = '$office_id' WHERE admin_id = '$admin_id' ";
    } else {
      return trigger_error('You do not have the appropriate rank');
    }
    if(mysqli_query(DB::connect(), $sql)){
      return null;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Updates the current users password. Checks if there are empty post values.
   * Defines essential values into variables. checks if the old password is
   * correct, the new password is hashed and updated in the database.
   *
   * @return array callback result
   */
  public static function updateAdminPassword()
  {
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $admin_id = $_SESSION['admin_id'];
    $old_password = $_POST['old_password'];
    $new_password = $_POST['new_password'];
    if(!self::oldPasswordMatch($old_password)){
      return trigger_error('Old password is incorrect');
    }
    $new_password = password_hash($new_password, PASSWORD_DEFAULT);
    $sql = "UPDATE admin_accounts SET password = '$new_password' WHERE admin_id = '$admin_id'";
    if(mysqli_query(DB::connect(), $sql)){
      return null;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Fetches all active and undeleted admin accounts and their data. Checks if
   * user has HQ ranking. Loops results into the result array.
   *
   * @return array callback result
   */
  public static function readAdmins()
  {
    if(!Session::assertHQ()){
      return trigger_error('Access Denied: Rank incompatible');
    }
    $sql = "SELECT admin_id FROM admin_accounts WHERE deleted = false";
    $result = mysqli_query(DB::connect(), $sql);
    $output = [];
    while($row = mysqli_fetch_assoc($result)){
      $output[] = self::fetchAdmin($row['admin_id']);
    }
    return $output;
  }

  /**
   * Inserts a new admin into the database. Checks if there are empty post
   * values. Confirms phone number and email values are valid. Checks if email
   * is unique to the admin group. Creates a random password and hashes it.
   * Checks if the user has HQ ranking. Inserts the new admin into the database
   * and sends the random password via email to the new admin. Sends a password reset link to their email.
   *
   * @return array callback result
   */
  public static function addAdmin()
  {
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $email = $_POST['email'];
    $rank = $_POST['rank'];
    $office_id = $_POST['office_id'];
    $home_address = $_POST['home_address'];
    $phone_number = $_POST['phone_number'];
    $meta = serialize(
      [
        'contact_method' => 'email'
      ]
    );
    if(Data::phoneNumberIsValid($phone_number)){
      return Data::phoneNumberIsValid($phone_number);
    }
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      return trigger_error('Email is invalid');
    }
    if(!self::emailIsUnique($email)){
      return trigger_error('email is already being used');
    }
    $password = bin2hex(random_bytes(6));
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    if(Session::assertHQ()){
      $sql = "INSERT INTO admin_accounts(first_name, last_name, email, password, account_rank, office_id, home_address, phone_number, meta) VALUES('$first_name', '$last_name', '$email', '$password_hash', '$rank', '$office_id', '$home_address', '$phone_number', '$meta')";
    } else {
      return trigger_error('Access Denied: Rank incompatible');
    }
    if(mysqli_query(DB::connect(), $sql)){
      Mail::enable($email, "Your ASCMS dashboard password", "Here is your temp password: ".$password, $first_name, $last_name);
      $admin_id = mysqli_insert_id(DB::connect());
      self::forgotPassword($admin_id);
      return null;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Fetches the admin email by using the fetchAdmin function.
   *
   * @param  int $admin_id
   * @return string the admin's email
   */
  private static function getAdminEmail($admin_id)
  {
    return self::fetchAdmin($admin_id)['email'];
  }

  /**
   * Sends a password reset link to admins by request from another admin.
   * Checks if the user has HQ ranking. Checks if there are empty post
   * values. Calls forgotPassword, and returns the new password  from forgotPassword.
   *
   * @return array callback result
   */
  public static function resetAdminPassword()
  {
    if(!Session::assertHQ()){
      return trigger_error('Access Denied: Rank incompatible');
    }
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    return self::forgotPassword($_POST['admin_id']);
  }

  /**
   * Marks an admin account as deleted. Checks if session account is the same as potentially deleted account. Checks if there are empty post
   * values. Checks if the admin is not still connected to an order. Excutes the
   * the query to mark the admin as deleted.
   *
   * @return array callback result
   */
  public static function deleteAdmin()
  {
    $admin_id = $_POST['admin_id'];
    if($admin_id === $_SESSION['admin_id']){
      return trigger_error('An admin cannot delete themself');
    }
    if(!Session::assertHQ()){
      return trigger_error('Access Denied');
    }
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    if(PartnerOrders::adminIsInOrder($admin_id)){
      return trigger_error(PartnerOrders::adminIsInOrder($admin_id));
    }
    $sql = "UPDATE admin_accounts SET deleted = true WHERE admin_id = '$admin_id'";
    if(mysqli_query(DB::connect(), $sql)){
      return null;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Checks if old password matches with the hash in the database.
   *
   * @param  string $password old password
   * @return bool  true if old password is a match
   */
  private static function oldPasswordMatch($password)
  {
    $admin_id = $_SESSION['admin_id'];
    $sql = "SELECT password FROM admin_accounts WHERE admin_id = '$admin_id'";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    return password_verify($password, $row['password']);
  }

  /**
   * Checks if email is unique to admin group. If admin_id is null that means
   * a new admin is being created, if it is not, then an admin's info is being
   * updated.
   *
   * @param  string $email admin's email
   * @param  int $admin_id
   * @return bool
   */
  private static function emailIsUnique($email, $admin_id = null)
  {
    if(is_null($admin_id)){
      $sql = "SELECT * FROM admin_accounts WHERE email = '$email'";
    } else {
      $sql = "SELECT * FROM admin_accounts WHERE email = '$email' AND admin_id <> '$admin_id'";
    }
    $result = mysqli_query(DB::connect(), $sql);
    $count = mysqli_num_rows($result);
    if($count === 0){
      return true;
    } else {
      return false;
    }
  }

  /**
   * Retreives the last time the admin logged in.
   *
   * @param  int $admin_id
   * @return string       timestamp
   */
  private static function getAdminLastLogin($admin_id)
  {
    $sql = "SELECT MAX(timestamp) AS timestamp FROM admin_session_logs WHERE admin_id = '$admin_id'";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    return $row['timestamp'];
  }

  /**
   * Fetches all information about the admin, including info about the office
   * they are tied to and the last time they logged in.
   *
   * @param  string $admin_id
   * @return array
   */
  public static function fetchAdmin($admin_id)
  {
    $sql = "SELECT admin_id, first_name, last_name, email, account_rank, office_id, home_address, phone_number, meta FROM admin_accounts WHERE admin_id = '$admin_id'";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    $row['office'] = Offices::fetchOffice($row['office_id']);
    $row['last_login'] = self::getAdminLastLogin($row['admin_id']);
    $row['meta'] = unserialize($row['meta']);
    return $row;
  }

  /**
   * Retreives all of an admins data based on their email. If email does not
   * exist in the admin_accounts table, a false boolean is returned.
   *
   * @param  string $email admin's email
   * @return mixed         boolean or array
   */
  private static function getAdminFromEmail($email)
  {
    $sql = "SELECT admin_id FROM admin_accounts WHERE email = '$email' AND deleted = false";
    $result = mysqli_query(DB::connect(), $sql);
    if(mysqli_num_rows($result) === 0){
      return false;
    }
    return self::fetchAdmin(mysqli_fetch_assoc($result)['admin_id']);
  }

  /**
   * Creates and sends a password reset link to an admin. Generates a random
   * token, checks if admin_id is null, if so, that means the admin has
   * forgotten their password. It checks if their email exists in the admin
   * group, it fetches the admin_id using the email. then sets the token expiry
   * time at an hour in the future. If admin_id is defined. The token expiry is
   * set for the next day. The password reset link is then set to the admin via
   * email.
   *
   * @param  string $admin_id
   * @return array           json array of the call status and result
   */
  public static function forgotPassword($admin_id = null)
  {
    $timestamp = DB::timestamp();
    $token = bin2hex(random_bytes(20));
    if(is_null($admin_id)){
      $email = $_POST['email'];
      if(!self::getAdminFromEmail($email)['admin_id']){
        return trigger_error('Email does not exist in our records');
      }
      $admin_id = self::getAdminFromEmail($email)['admin_id'];
      $expiry = date("Y-m-d H:i:s", strtotime('+1 hour')).'-04:00';
      $message = "To reset your password, follow the link. The link expires in an hour: ".apache_request_headers()['Origin']."/admin/login?passwordToken=".$token;
      $success = "A reset link has been sent, the link expires in one hour";
    } else {
      $expiry = date("Y-m-d H:i:s", strtotime('+1 day')).'-04:00';
      $message = "To reset your password, follow the link. The link expires in a day: ".apache_request_headers()['Origin']."/admin/login?passwordToken=".$token;
      $success = "A reset link has been sent to the admin, the link expires in one day";
    }
    $sql = "INSERT INTO admin_password_tokens(admin_id, token, created_timestamp, expiry) VALUES('$admin_id', '$token', '$timestamp', '$expiry')";
    if(mysqli_query(DB::connect(), $sql)){
      self::contactAdmin($admin_id, "Password Reset", $message);
      return $success;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Checks admin's contact method, and uses it to call the appropriate callback
   * to contact the admin with the new message.
   *
   * @param  int $admin_id
   * @param  string $subject
   * @param  string $message
   */
  public static function contactAdmin($admin_id, $subject, $message)
  {
    $admin = self::fetchAdmin($admin_id);
    $contact_method = $admin['meta']['contact_method'];
    $first_name = $admin['first_name'];
    $last_name = $admin['last_name'];
    switch($contact_method){
      case "text":
        Twilio::sendSMS($admin['phone_number'], $message, $first_name, $last_name);
        break;
      default:
        Mail::enable($admin['email'], $subject, $message, $first_name, $last_name);
    }
  }

  /**
   * Checks if the token exists and is active. If it does exist and the token is marked active yet it has been expired, it gets deactivated.
   *
   * @return array           json array of the call status and result
   */
  public static function validatePasswordToken()
  {
    $token = $_POST['token'];
    $sql = "SELECT * FROM admin_password_tokens WHERE token = '$token' AND active = true";
    $result = mysqli_query(DB::connect(), $sql);
    if(mysqli_num_rows($result) === 0){
      return trigger_error('Token is invalid');
    }
    $row = mysqli_fetch_assoc($result);
    $timestamp = DB::timestamp();
    if($row['expiry'] < $timestamp){
      self::deactivateToken($token);
      return trigger_error('This token has expired');
    } else {
      return null;
    }
  }

  /**
   * Fetch all token information using the token and validates if its active, if
   * its not, it gets deactivated.
   *
   * @param  string $token password token
   * @return array        token info
   */
  public static function fetchToken($token)
  {
    $sql = "SELECT * FROM admin_password_tokens WHERE token = '$token' AND active = true";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    $timestamp = DB::timestamp();
    if(count($row) === 0 || $row['expiry'] < $timestamp){
      self::deactivateToken($token);
      $row['active'] = false;
    }
    return $row;
  }

  /**
   * Resets forgotten password using a password token. Fetch the token data, if
   * the token is active the new password is hashed and entered into the
   * database.
   *
   * @return array           json array of the call status and result
   */
  public static function passwordReset()
  {
    $token = $_POST['token'];
    $token_row = self::fetchToken($token);
    if(!$token_row['active']){
      return trigger_error('This token is invalid');
    }
    $password = password_hash($_POST['new_password'], PASSWORD_DEFAULT);
    $admin_id = $token_row['admin_id'];
    $sql = "UPDATE admin_accounts SET password = '$password' WHERE admin_id = '$admin_id'";
    if(mysqli_query(DB::connect(), $sql)){
      self::deactivateToken($token);
      return null;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Marks the token as inactive.
   *
   * @param  string $token password token
   */
  private static function deactivateToken($token)
  {
    $sql = "UPDATE admin_password_tokens SET active = false WHERE token = '$token'";
    mysqli_query(DB::connect(), $sql);
  }

  /**
   * Updates the session admin's meta data. Checks for empty values in the post
   * array. Serializes meta array and inserts it into the database.
   *
   * @return array           json array of the call status and result
   */
  public static function updateSettings()
  {
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $meta = serialize($_POST);
    $admin_id = $_SESSION['admin_id'];
    $sql = "UPDATE admin_accounts SET meta = '$meta' WHERE admin_id = '$admin_id'";
    if(mysqli_query(DB::connect(), $sql)){
      return 'Settings updated';
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }
}
