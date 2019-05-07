<?

$url = 'https://verifier.login.persona.org/verify';
$assertion = $_POST['assertion'];

$body = "assertion=$assertion&audience=rashomonproject.org";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);


$json = json_decode($result);

if ($json->status == 'okay') {
   setcookie("rashomon_email", $json->email);
   $response['status'] = "okay";
   $response['expires'] = $json->expires;
   $response['email'] = $json->email;
   echo json_encode($response);
   exit;

} else {
     $response['status'] = $json->status;
     echo json_encode($response);
}

//echo $result;
?>
