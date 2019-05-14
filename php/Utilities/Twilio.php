<?php
// Twilio library
require_once("vendor/twilio-php-master/Twilio/autoload.php");

use Twilio\Rest\Client;

class Twilio
{
  /**
   * Sends whatsapp mesage using ascms's twilio number to a number concatenated with the area code. Message is also concatenated with a signature.
   *
   * @param  string $phone_number
   * @param  string $message
   */
  public static function sendWhatsapp($phone_number, $message)
  {
    $client = new Client($GLOBALS['sid'], $GLOBALS['token']);
    $client->messages->create(
      "whatsapp:+1".$phone_number,
      [
        "from" => "whatsapp:+14155238886",
        "body" => $message." - ASCMS",
      ]
    );
  }

  /**
   * Sends sms mesage using ascms's twilio number to a number concatenated with the area code. Message is also concatenated with a signature.
   *
   * @param  string $phone_number
   * @param  string $message
   */
  public static function sendSMS($phone_number, $message, $first_name, $last_name)
  {
    $client = new Client($GLOBALS['sid'], $GLOBALS['token']);
    $client->messages->create(
      "+1".$phone_number,
      [
        'from' => $GLOBALS['system_phone_number'],
        'body' => "Hello ".$first_name." ".$last_name.", ".$message." - ASCMS",
      ]
    );
  }
}
