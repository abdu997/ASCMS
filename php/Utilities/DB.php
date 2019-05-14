<?php

/**
 * Invloves all Database assets.
 *
 */
class DB
{
  private static $db;
  private $connection;

  /**
   * Adjusts the value of $connection based on the environment, as different environments have their own database credentials.
   *
   */
  private function __construct()
  {
    switch($_SERVER['SERVER_NAME']){
      case "localhost":
        $this->connection = new MySQLi("localhost", "root", "", "thawrih_intra_local");
        break;
      case "ascms.adaptco.ca":
        $this->connection = new MySQLi("localhost", "adaptco_dashboard_user", "sWTIDZkv2P-p", "adaptco_ascms");
        break;
      case "sandbox.intra.thawrih.ca":
        $this->connection = new MySQLi("localhost", "thawrih_dashboard_user", "sWTIDZkv2P-p", "thawrih_intra_sandbox");
        break;
    }
  }

  /**
   * Insantiates the databse function.
   *
   */
  public static function connect()
  {
    if(self::$db == null){
      self::$db = new DB();
    }
    return self::$db->connection;
  }

  /**
   * Sanitizes first and second dimension values of the post array.
   *
   */
  public static function sanitize()
  {
    foreach($_POST as $key => $value){
      if(is_array($value)){
        foreach($value as $sub_key => $sub_value){
          $value[$sub_key] = mysqli_real_escape_string(self::connect(), $value[$sub_key]);
        }
      } else {
        $_POST[$key] = mysqli_real_escape_string(self::connect(), $_POST[$key]);
      }
    }
  }

  public static function timestamp()
  {
    return date("Y-m-d H:i:s", strtotime('now')).'-04:00';
  }
}
