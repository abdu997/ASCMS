<?php
// Twilio library
require_once("vendor/twilio-php-master/Twilio/autoload.php");

use Twilio\Rest\Client;

class Twilio
{
  static $sid = "AC9f8df6139ad54e070d5f604bd6bafddc";

  static $token = "0eb1c0860de24a761fafbe347ee19f5a";

  static $thawrih_number = "+16479578419";

  /**
   * Sends whatsapp mesage using thawrih's twilio number to a number concatenated with the area code. Message is also concatenated with a signature.
   *
   * @param  string $phone_number
   * @param  string $message
   */
  public static function sendWhatsapp($phone_number, $message)
  {
    $client = new Client(self::$sid, self::$token);
    $client->messages->create(
      "whatsapp:+1".$phone_number,
      [
        "from" => "whatsapp:+14155238886",
        "body" => $message." - ASCMS",
      ]
    );
  }

  /**
   * Sends sms mesage using thawrih's twilio number to a number concatenated with the area code. Message is also concatenated with a signature.
   *
   * @param  string $phone_number
   * @param  string $message
   */
  public static function sendSMS($phone_number, $message, $first_name, $last_name)
  {
    $client = new Client(self::$sid, self::$token);
    $client->messages->create(
      "+1".$phone_number,
      [
        'from' => self::$thawrih_number,
        'body' => "Hello ".$first_name." ".$last_name.", ".$message." - ASCMS",
      ]
    );
  }
}
