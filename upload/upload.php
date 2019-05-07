<?php
//error_reporting(E_ALL); ini_set('display_errors', '1');
require("config.php");


$randomName = substr_replace(sha1(microtime(true)), '', 12);


if (isset($_FILES['file'])) {
    //Someone is uploading files from their computer
    
    /* 
    //check assertion, mozilla persona
    $assert = checkAssertion($_POST['assertion']);
    if ($assert->status != "okay"){
    $response['warning'] .= "You are not properly logged in.";
    }
    */
    
    $getExt = explode('.', $_FILES['file']['name']);
    $type   = $_FILES['file']['type'];
    
    if (!isset($type)) {
        die();
    } //!isset($type)
    /*
    $email = $_POST['email'];
    $sanitized_b = filter_var($email, FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Nope.");
    }
    */
    
    $ext = end($getExt);
    
    if (!testExt($ext, $whitelist)) {
        header("HTTP/1.1 415 Unsupported Media Type");
        die();
    } //!testExt($ext, $whitelist)
    
    
    
    
    
    $file     = $uploaddir . $randomName . "." . $ext;
    $origname = $_FILES['file']['name'];
    $email    = $_POST['email'];
    
    if (move_uploaded_file($_FILES['file']['tmp_name'], $file)) {
        $response['response'] = "success";
        
    } //move_uploaded_file($_FILES['file']['tmp_name'], $file)
    else {
        echo "File Error! Could not copy";
        exit;
    }
} //$_FILES['file']
else if ($_POST['method'] == "dropbox") {
    
    $path_parts = pathinfo($_POST['name']);
    
    $extension = $path_parts['extension'];
    $origname  = $path_parts['filename'];
    
    $url = $_POST['link'];
    if (!filter_var($url, FILTER_VALIDATE_URL)) {
        die("Bad url!");
    } //!filter_var($url, FILTER_VALIDATE_URL)
    $file = $uploaddir . $randomName . "." . $extension;
    $fp   = fopen($file, 'w+');
    $ch   = curl_init($url);
    
    curl_setopt_array($ch, array(
        CURLOPT_URL => $url,
        CURLOPT_BINARYTRANSFER => 1,
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_FILE => $fp,
        CURLOPT_TIMEOUT => 50,
        CURLOPT_USERAGENT => 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)'
    ));
    $results = curl_exec($ch);
    if (curl_exec($ch) === false) {
        echo 'Curl error: ' . curl_error($ch);
        exit;
    } //curl_exec($ch) === false
    
    
} //$_POST['method'] == "dropbox"



$m          = new MongoClient("$monguri");
$db         = $m->$db_name;
$collection = $db->media;
$obj        = array(
    "name" => $randomName,
    "origname" => $origname,
    "ext" => $ext,
    "email" => $email,
    "type" => $type,
    "uploadDate" => new MongoDate()
);
$collection->insert($obj);



include("metadata.php");

function checkAssertion($assertion)
{
    $url = "http://rashomonproject.org/uploadtest/signin.php";
    
    $body = "assertion=$assertion";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);
    
    
    $json = json_decode($result);
    if ($json->status == 'okay') {
        return $json;
        
    } //$json->status == 'okay'
    else {
        return $result;
    }
    
}


function testExt($ext, $whitelist)
{
    foreach ($whitelist as $item) {
        if (strtolower($ext) == $item) {
            return 1;
        } //strtolower($ext) == $item
    } //$whitelist as $item
    
    if (!$extOkay) {
        return 0;
    } //!$extOkay
    
}

?>