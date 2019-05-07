<?

//google zend directory
$clientLibraryPath = '/home/aphid/ZendGdata-1.12.0/library';
$oldPath = set_include_path(get_include_path() . PATH_SEPARATOR . $clientLibraryPath);
//where uploaded content goes, THIS SHOULD NOT BE WEB READABLE
$uploaddir = '/home/aphid/incomingMedia/';
//this can be web readable
$redacteddir = '/home/aphid/domains/rashomonproject.org/public_html/redacted/';
//extension whitelist
$whitelist = array("mkv", "mp4", "mov", "gif", "png", "jpg", "jpeg", "3gp", "mv4", "mp3", "ogv", "ogg", "webm");

//mongodb data
$db_user = 'rashomon';
$db_pass = 'yourPassword';
$db_server = 'yourPassword';
$monguri = "mongodb://" .$db_user .":" .$db_pass ."@" .$db_server;

//youtube api data
$yt_user = "YourYouTubeName";
$yt_pw = "YouTubePassowrd";
$yt_source = 'google youtube api app name';
$developerKey = 'dev key'
$applicationId = $yt_source; //should be the same
$clientId = 'yt client id';

//persona data
$persona_audience = "rashomonproject.org"; //probably your domain

//admin emails
$admin_email = array("admin1@example.com", "admin2@example.com");

?>
