<?php

/**
 * Includes all session operations.
 *
 */
class Session
{
  /**
   * Creates an admin session. Checks if there are empty post
   * values. Fetches admin_id and password using admin email.
   * If a single row is returned, verifies password input with stored password hash. If password is correct, current session values are unset and sets the admin_id as a session value. Admin entry is logged.
   *
   * @return array callback result
   */
  public static function adminLogin()
  {
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $email = $_POST['email'];
    $sql = "SELECT admin_id, password FROM admin_accounts WHERE email = '$email' AND deleted = false";
    $result = mysqli_query(DB::connect(), $sql);
    $count = mysqli_num_rows($result);
    if($count !== 1){
      return trigger_error('Login credentials are not valid');
    }
    $row = mysqli_fetch_assoc($result);
    if(password_verify($_POST['password'], $row['password'])){
      self::unsetSessionId();
      $_SESSION['admin_id'] = $row['admin_id'];
      self::logAdminEntry($row['admin_id']);
      return null;
    } else {
      return trigger_error('Login credentials are not valid');
    }
  }

  /**
   * Creates a partner session. Checks if there are empty post
   * values. Fetches password using partner_id.
   * If a single row is returned, verifies password input with stored password hash. If password is correct, current session values are unset and sets the partner_id as a session value. Partner entry is logged.
   *
   * @return array callback result
   */
  public static function partnerLogin()
  {
    if(Data::arrayHasEmptyValue($_POST)){
      return trigger_error(Data::arrayHasEmptyValue($_POST));
    }
    $partner_id = $_POST['partner_id'];
    $sql = "SELECT partner_id, password FROM partner_accounts WHERE partner_id = '$partner_id' AND status = 'active' AND deleted = false";
    $result = mysqli_query(DB::connect(), $sql);
    $count = mysqli_num_rows($result);
    $error = trigger_error('Login credentials are not valid');
    if($count !== 1){
      return $error;
    }
    $row = mysqli_fetch_assoc($result);
    if(password_verify($_POST['password'], $row['password'])) {
      self::unsetSessionId();
      $_SESSION['partner_id'] = $partner_id;
      self::logPartnerEntry($partner_id);
      return null;
    } else {
      return $error;
    }
  }

  /**
   * Logs partner entry in partner_session_log.
   *
   * @param  int $partner_id
   */
  private static function logPartnerEntry($partner_id)
  {
    $timestamp = DB::timestamp();
    $sql = "INSERT INTO partner_session_logs(partner_id, timestamp) VALUES('$partner_id', '$timestamp')";
    mysqli_query(DB::connect(), $sql);
  }

  /**
   * Logs admin entry in admin_session_log.
   *
   * @param  int $partner_id
   */
  private static function logAdminEntry($admin_id)
  {
    $timestamp = DB::timestamp();
    $sql = "INSERT INTO admin_session_logs(admin_id, timestamp) VALUES('$admin_id', '$timestamp')";
    mysqli_query(DB::connect(), $sql);
  }

  /**
   * Retrieves current session admin's data. If ranking includes "hq" assigns account type as "hq". If ranking includes "local" assigns account type as "local".
   *
   * @return array admin data
   */
  public static function getAdminInfo()
  {
    if(!isset($_SESSION['admin_id'])){
      return false;
    }
    $admin_id = $_SESSION['admin_id'];
    $sql = "SELECT * FROM admin_accounts WHERE admin_id = '$admin_id'";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    if(strpos($row['account_rank'], "hq") !== false){
      $row['account_type'] = "hq";
    } elseif(strpos($row['account_rank'], "local") !== false){
      $row['account_type'] = "local";
    }
    return $row;
  }

  /**
   * Retrieves current session partner's data.
   *
   * @return array partner data
   */
  public static function getPartnerInfo()
  {
    $partner_id = $_SESSION['partner_id'];
    $sql = "SELECT * FROM partner_accounts WHERE partner_id = '$partner_id'";
    $result = mysqli_query(DB::connect(), $sql);
    $row = mysqli_fetch_assoc($result);
    return $row;
  }

  /**
   * Responds with the current session user's info and session data. If session does not exist, a false callback is returned.
   *
   * @return array callback result
   */
  public static function sessionExists()
  {
    if(isset($_SESSION['admin_id'])){
      return [
        'session_exists' => true,
        'admin_id' => $_SESSION['admin_id'],
        'first_name' => self::getAdminInfo()['first_name'],
        'last_name' => self::getAdminInfo()['last_name'],
        'office_id' => self::getAdminInfo()['office_id'],
        'account_type' => self::getAdminInfo()['account_type'],
        'rank' => self::getAdminInfo()['account_rank'],
      ];
    } elseif(isset($_SESSION['partner_id'])){
      return [
        'session_exists' => true,
        'partner_id' => $_SESSION['partner_id'],
        'first_name' => self::getPartnerInfo()['first_name'],
        'last_name' => self::getPartnerInfo()['last_name'],
        'office_id' => self::getPartnerInfo()['office_id'],
        'account_type' => 'partner',
      ];
    } else {
      return ['session_exists' => false];
    }
  }

  /**
   * Confirms whether the current session user has an hq account type.
   *
   * @return bool
   */
  public static function assertHQ()
  {
    if(self::getAdminInfo()['account_type'] === "hq"){
      return true;
    } else {
      return false;
    }
  }

  /**
   * Destroys session and responds to request.
   *
   * @return array callback result
   */
  public static function logout()
  {
    if(session_destroy()){
      return ['session_flush' => true];
    }
  }


  /**
   * Creates a partner easy entry token. Generates random token, sets expiry the following midnight. Returns the token if successful.
   *
   * @param  int $partner_id
   * @param  int $partner_order_id
   * @return array                   action result
   */
  public static function createPartnerToken($partner_id, $partner_order_id)
  {
    $timestamp = DB::timestamp();
    $token = bin2hex(random_bytes(20));
    $token_expiry = date("Y-m-d H:i:s", strtotime('+1 day midnight')).'-04:00';
    $sql = "INSERT INTO partner_entry_tokens(partner_id, partner_order_id, token, timestamp, token_expiry) VALUES('$partner_id', '$partner_order_id', '$token', '$timestamp', '$token_expiry')";
    if(mysqli_query(DB::connect(), $sql)){
      return $token;
    } else {
      return trigger_error(mysqli_error(DB::connect()));
    }
  }

  /**
   * Unsets both admin_id and partner_id session values.
   *
   */
  private static function unsetSessionId()
  {
    unset($_SESSION['admin_id']);
    unset($_SESSION['partner_id']);
  }

  /**
   * Creates a partner session using the easy partner entry token. Checks if token was sent. Queries token active in partner_entry_tokens. If a single row is returned, checks if token has been expired, if so, token is deactivated. Else, current session values are unset. Sets partner_id as a session value and logs the partner's entry.
   *
   * @return array callback result
   */
  public static function partnerTokenEntry()
  {
    $timestamp = DB::timestamp();
    if(!isset($_POST['token'])){
      return trigger_error('token invalid');;
    }
    $token = $_POST['token'];
    $sql = "SELECT * FROM partner_entry_tokens WHERE token = '$token'";
    $result = mysqli_query(DB::connect(), $sql);
    if(mysqli_num_rows($result) === 1){
      $row = mysqli_fetch_assoc($result);
      if($row['token_expiry'] < $timestamp){
        self::deactivateToken($token);
        return trigger_error('Token has expired');
      }
      self::unsetSessionId();
      $_SESSION['partner_id'] = $row['partner_id'];
      self::logPartnerEntry($_SESSION['partner_id']);
      return null;
    } else {
      return trigger_error('token invalid');;
    }
  }
}
