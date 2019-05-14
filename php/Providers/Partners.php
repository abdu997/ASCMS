<?php

/**
 * Includes all partner operations.
 *
 */
class Partners
{
  /**
   * Creates a new partner. Constructs the questionaire array. If the workplace_preference is home, it inserts the home_work_space value. Checks if the partner info is valid. If the email value is defined, checks if the email is valid. If the sewing_experience value is yes, years_sewing_experience is inserted into the questionaire array. Checks if phone number is valid. Inserts partner into partner_accounts table.
   *
   * @return array callback result
   */
  public static function insertPartner()
  {
    $timestamp = DB::timestamp();
    $questionaire = $_POST['questionaire'];
    if($questionaire['workplace_preference'] !== "home"){
      $questionaire['home_work_space'] = "no";
    } else {
      unset($questionaire['home_work_space']);
    }
    if($questionaire['sewing_experience'] === "no"){
      $questionaire['years_sewing_experience'] = 0;
    } else {
      unset($questionaire['years_sewing_experience']);
    }
    if(self::partnerInfoInvalid()){
      return self::partnerInfoInvalid();
    }
    if(Data::arrayHasEmptyValue($questionaire)){
      return trigger_error(Data::arrayHasEmptyValue($questionaire));
    }
    $questionaire = serialize($questionaire);
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $phone_number = $_POST['phone_number'];
    $whatsapp = $_POST['whatsapp'];
    $email = $_POST['email'];
    $address = $_POST['address'];
    $office_id = $_POST['office_id'];
    if(Data::phoneNumberIsValid($phone_number)){
      return Data::phoneNumberIsValid($phone_number);
    }
    $sql = "INSERT INTO partner_accounts(first_name, last_name, phone_number, whatsapp, email, address, office_id, submit_timestamp, questionaire) VALUES('$first_name', '$last_name', '$phone_number', '$whatsapp', '$email', '$address', '$office_id', '$timestamp', '$questionaire')";

    if(mysqli_query(DB::connect(), $sql)){
      return 'Application complete!';
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Marks a partner account as deleted. Checks if there are empty post
   * values. Checks if the partner is not still connected to an order. Excutes the
   * the query to mark the admin as deleted.
   *
   * @return array callback result
   */
  public static function deletePartner()
  {
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $partner_id = $_POST["partner_id"];
    if(PartnerOrders::partnerIsInOrder($partner_id)){
      return trigger_error(PartnerOrders::partnerIsInOrder($partner_id));
    }
    $sql = "UPDATE partner_accounts SET deleted = true WHERE partner_id = '$partner_id'";
    if(mysqli_query(DB::connect(), $sql)){
      return null;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Sends a password reset link to partners by request from an admin.
   * Checks if there are empty post
   * values. Calls forgotPassword, and returns the new password  from forgotPassword.
   *
   * @return array callback result
   */
  public static function resetPartnerPassword()
  {
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    if(!self::activePartnerExists($_POST['partner_id'])){
      return trigger_error('Partner does not exist or is not active');
    }
    return self::forgotPassword($_POST['partner_id']);
  }

  /**
   * Retreives the last time the partner logged in.
   *
   * @param  int $partner_id
   * @return string             timestamp
   */
  private static function getPartnerLastLogin($partner_id)
  {
    $sql = "SELECT MAX(timestamp) AS timestamp FROM partner_session_logs WHERE partner_id = '$partner_id'";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    return $row['timestamp'];
  }

  /**
   * Updates a partner's info. Checks if partner info is valid. Checks phone number is valid. If the partner's status was not active but is being changed to active now, activatePartner is called. The partner account is then updated.
   *
   * @return array callback result
   */
  public static function updatePartner()
  {
    if(self::partnerInfoInvalid()){
      return self::partnerInfoInvalid();
    }
    $partner_id = $_POST['partner_id'];
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $phone_number = $_POST['phone_number'];
    $whatsapp = $_POST['whatsapp'];
    $email = $_POST['email'];
    $address = $_POST['address'];
    $office_id = $_POST['office_id'];
    $status = $_POST['status'];
    if(Data::phoneNumberIsValid($phone_number)){
      return Data::phoneNumberIsValid($phone_number);
    }
    if(self::fetchPartner($partner_id)['status'] !== "active" && $status === "active" && self::partnerPassIsEmpty($partner_id)){
      self::activatePartner($partner_id);
    }
    $sql = "UPDATE partner_accounts SET first_name = '$first_name', last_name = '$last_name', status = '$status', office_id = '$office_id', address = '$address', phone_number = '$phone_number', whatsapp = ".$whatsapp.", email = '$email' WHERE partner_id = '$partner_id'";
    if(mysqli_query(DB::connect(), $sql)){
      return null;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Sends access credentials to newly active partners. Constructs a message with login credentials and link. Sends the message via email if partner email is defined. And SMS message is sent.
   *
   * @param  int $partner_id
   */
  private static function activatePartner($partner_id)
  {
    $link = apache_request_headers()['Origin']."/partner";
    $password = self::setPartnerPassword($partner_id);
    $partner = self::fetchPartner($partner_id);
    $message = "Your ASCMS account is ready! Your ID: ".$partner_id." Your password: ".$password." You can access your account here: ".$link;
    if(!empty($partner['email'])){
      Mail::enable($partner['email'], 'New Password', $message, $partner['first_name'], $partner['last_name']);
    }
    $phone_number = $partner['phone_number'];
    Twilio::sendSMS($phone_number, $message, $partner['first_name'], $partner['last_name']);
  }

  /**
   * Updates a partners password with a random password.
   *
   * @param int $partner_id
   * @return string        random password
   */
  private static function setPartnerPassword($partner_id)
  {
    $partner_id = $_POST["partner_id"];
    $password = bin2hex(random_bytes(3));
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    $sql = "UPDATE partner_accounts SET password = '$password_hash' WHERE partner_id = '$partner_id'";
    mysqli_query(DB::connect(), $sql);
    return $password;
  }

  /**
   * Fetches a partner's password to check if the value is empty. If it is, the function returns a false.
   *
   * @param  int $partner_id
   * @return bool
   */
  private static function partnerPassIsEmpty($partner_id)
  {
    $sql = "SELECT password FROM partner_accounts WHERE partner_id = '$partner_id'";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    if(empty($row['password'])){
      return true;
    } else {
      return false;
    }
  }

  /**
   * Fetches all undeleted partner accounts and their data.
   * Loops results into the result array.
   *
   * @return array callback result
   */
  public static function readPartners()
  {
    $sql = "SELECT partner_id FROM partner_accounts WHERE deleted = false";
    $result = mysqli_query(DB::connect(), $sql);
    $output = [];
    while($row = mysqli_fetch_assoc($result)){
      $output[] = self::fetchPartner($row['partner_id']);
    }
    return $output;
  }

  /**
   * Checks if the partner exists and status is active. If so, returns true, if not false.
   *
   * @param  int $partner_id
   * @return bool
   */
  public static function activePartnerExists($partner_id)
  {
    $sql = "SELECT status FROM partner_accounts WHERE partner_id = '$partner_id'";
    $result = mysqli_query(DB::connect(), $sql);
    if(mysqli_num_rows($result) !== 1){
      return false;
    }
    $row = mysqli_fetch_assoc($result);
    if(self::fetchPartner($partner_id)['status'] === "active"){
      return true;
    } else {
      return false;
    }
  }

  /**
   * Fetches all information about the partner, including info about the office
   * they are tied to and the last time they logged in, demerit count, products processed and unserialize questionaire object.
   *
   * @param  string $partner_id
   * @return array
   */
  public static function fetchPartner($partner_id)
  {
    $sql = "SELECT partner_id, first_name, last_name, status, phone_number, whatsapp, email, address, office_id, questionaire, meta FROM partner_accounts WHERE partner_id = '$partner_id'";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    $row['office'] = Offices::fetchOffice($row['office_id']);
    $row['questionaire'] = unserialize($row['questionaire']);
    $row['last_login'] = self::getPartnerLastLogin($partner_id);
    $row['demerit_count'] = PartnerDemerits::fetchDemeritCount($partner_id);
    $row['products_processed'] = self::productsProcessed($partner_id);
    $row['meta'] = unserialize($row['meta']);
    return $row;
  }

  /**
   * Fetches the sum of all quantities of partner closed orders.
   *
   * @param  int $partner_id
   * @return int             amount of products
   */
  public static function productsProcessed($partner_id)
  {
    $sql = "SELECT SUM(quantity) AS quantity FROM partner_orders WHERE partner_id = '$partner_id' AND status = 'closed'";
    $result = mysqli_query(DB::connect(), $sql);
    $quantity = mysqli_fetch_assoc($result)['quantity'];
    if(is_null($quantity)){
      return 0;
    }
    return $quantity;
  }

  /**
   * Retrieves the user partner's account details info by calling fetchPartner using
   * the partner_id session variable.
   *
   * @return array callback result
   */
  public static function getAccountDetails()
  {
    return self::fetchPartner($_SESSION['partner_id']);
  }

  /**
   * Validates the post values of a partner request. Loops through
   * post array values, if it's the email key, and the value is defined yet not a valid email an error is not returned. If the value of the key is zero, the key gets skiped. But if the does not meet previous conditions and the value is empty, and error is returned with a message where the key's underscores are replaced with spaces.
   *
   * @return mixed
   */
  private static function partnerInfoInvalid()
  {
    foreach($_POST as $key => $value){
      if($key === "email"){
        if($value && !filter_var($value, FILTER_VALIDATE_EMAIL)){
          return trigger_error('Email must be valid, emails can be empty');
        }
        continue;
      }
      if($value === "0"){
        continue;
      }
      if(empty($value)){
        return trigger_error(str_replace("_", " ", $key).' cannot be empty');
      }
    }
    return false;
  }

  /**
   * Updates the current session partner's account details. Checks if array
   * doesn't have empty values. Defines the essential values as variables. Then
   * checks if partner's email is valid and unique to the partner group. Following,
   * the function updates the database using the partner's partner_id session value.
   *
   * @return array callback result
   */
  public static function updateAccountDetails()
  {
    if(self::partnerInfoInvalid()){
      return self::partnerInfoInvalid();
    }
    $partner_id = $_SESSION['partner_id'];
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $phone_number = $_POST['phone_number'];
    $address = $_POST['address'];
    $email = $_POST['email'];
    if(Data::phoneNumberIsValid($phone_number)){
      return Data::phoneNumberIsValid($phone_number);
    }
    $sql = "UPDATE partner_accounts SET first_name = '$first_name', last_name = '$last_name', address = '$address', phone_number = '$phone_number', email = '$email' WHERE partner_id = '$partner_id'";
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
  public static function updatePassword()
  {
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $partner_id = $_SESSION['partner_id'];
    $old_password = $_POST['old_password'];
    $new_password = $_POST['new_password'];
    if(!self::oldPasswordMatch($old_password)){
      return trigger_error('Old password is incorrect');
    }
    $new_password = password_hash($new_password, PASSWORD_DEFAULT);
    $sql = "UPDATE partner_accounts SET password = '$new_password' WHERE partner_id = '$partner_id'";
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
    $partner_id = $_SESSION['partner_id'];
    $sql = "SELECT password FROM partner_accounts WHERE partner_id = '$partner_id'";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    return password_verify($password, $row['password']);
  }

  /**
   * Creates and sends a password reset link to a partner. Generates a random
   * token, checks if partner_id is null, if so, that means the partner has
   * forgotten their password. It checks if their phone number exists in the partner
   * group. then sets the token expiry
   * time at an hour in the future. If partner_id is defined. The token expiry is
   * set for the next day. The password reset link is then set to the partner via
   * sms.
   *
   * @param  string $partner_id
   * @return array           json array of the call status and result
   */
  public static function forgotPassword($partner_id = null)
  {
    $timestamp = DB::timestamp();
    $token = bin2hex(random_bytes(20));
    if(is_null($partner_id)){
      $partner_id = $_POST['partner_id'];
      if(!self::activePartnerExists($partner_id)){
        return trigger_error('Partner does not exist in our records');
      }
      $partner = self::fetchPartner($partner_id);
      $expiry = date("Y-m-d H:i:s", strtotime('+1 hour')).'-04:00';
      $message = "To create a new password, follow this link: ".apache_request_headers()['Origin']."/partner/login?passwordToken=".$token;
      $success = "A reset link has been sent to your phone, the link expires in one hour";
    } else {
      $partner = self::fetchPartner($partner_id);
      $expiry = date("Y-m-d H:i:s", strtotime('+1 day')).'-04:00';
      $message = "To create a new password, follow this link: ".apache_request_headers()['Origin']."/partner/login?passwordToken=".$token;
      $success = "A reset link has been sent to your phone, the link expires in one day";
    }
    $sql = "INSERT INTO partner_password_tokens(partner_id, token, created_timestamp, expiry) VALUES('$partner_id', '$token', '$timestamp', '$expiry')";
    if(mysqli_query(DB::connect(), $sql)){
      Twilio::sendSMS($partner['phone_number'], $message, $partner['first_name'], $partner['last_name']);
      return $success;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
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
    $sql = "SELECT * FROM partner_password_tokens WHERE token = '$token' AND active = true";
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
    $sql = "SELECT * FROM partner_password_tokens WHERE token = '$token' AND active = true";
    $result = mysqli_query(DB::connect(), $sql);
    return mysqli_fetch_assoc($result);
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
    if(count($token_row) === 0){
      return trigger_error('Token is invalid');
    }
    $timestamp = DB::timestamp();
    if($token_row['expiry'] < $timestamp){
      self::deactivateToken($token);
      return trigger_error('This token has expired');
    }
    $password = password_hash($_POST['new_password'], PASSWORD_DEFAULT);
    $partner_id = $token_row['partner_id'];
    $sql = "UPDATE partner_accounts SET password = '$password' WHERE partner_id = '$partner_id'";
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
    $sql = "UPDATE partner_password_tokens SET active = false WHERE token = '$token'";
    mysqli_query(DB::connect(), $sql);
  }
}
