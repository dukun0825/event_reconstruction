<?php
error_reporting(E_ALL | E_STRICT);




$clientLibraryPath = '/home/aphid/ZendGdata-1.12.0/library';
$oldPath = set_include_path(get_include_path() . PATH_SEPARATOR . $clientLibraryPath);
require_once $clientLibraryPath .'/Zend/Loader.php';

  Zend_Loader::loadClass('Zend_Gdata_YouTube');
  Zend_Loader::loadClass('Zend_Gdata_AuthSub');

  Zend_Loader::loadClass('Zend_Gdata_ClientLogin'); 
$authenticationURL= 'https://www.google.com/accounts/ClientLogin';
$httpClient = Zend_Gdata_ClientLogin::getHttpClient(
              $username = $yt_user,
              $password = $yt_pw,
              $service = 'youtube',
              $client = null,
              $source = $yt_source, // a short string identifying your application
              $loginToken = null,
              $loginCaptcha = null,
              $authenticationURL);




$yt = new Zend_Gdata_YouTube($httpClient, $yt_source, NULL, $developerKey);
//$yt = new Zend_Gdata_YouTube($httpClient);

$myVideoEntry = new Zend_Gdata_YouTube_VideoEntry();

// create a new Zend_Gdata_App_MediaFileSource object
$filesource = $yt->newMediaFileSource($redactedfile);
$filesource->setContentType($data['MIMEType']);
// set slug header
$filesource->setSlug($randomName .$ext);

// add the filesource to the video entry
$myVideoEntry->setMediaSource($filesource);

$myVideoEntry->setVideoTitle($randomName);
$myVideoEntry->setVideoDescription('test_video');
$myVideoEntry->setVideoCategory('Nonprofit');

// Set keywords. Please note that this must be a comma-separated string
// and that individual keywords cannot contain whitespace
$myVideoEntry->SetVideoTags('activism, temporary');

// The category must be a valid YouTube category!
 $myVideoEntry->setVideoPrivate(); 

// upload URI for the currently authenticated user
$uploadUrl = "http://uploads.gdata.youtube.com/feeds/api/users/default/uploads";

// try to upload the video, catching a Zend_Gdata_App_HttpException, 
// if available, or just a regular Zend_Gdata_App_Exception otherwise
try {
  $newEntry = $yt->insertEntry($myVideoEntry, $uploadUrl, 'Zend_Gdata_YouTube_VideoEntry');
} catch (Zend_Gdata_App_HttpException $httpException) {
    echo $httpException->getRawResponseBody();
} catch (Zend_Gdata_App_Exception $e) {
    echo $e->getMessage();
}


?>
