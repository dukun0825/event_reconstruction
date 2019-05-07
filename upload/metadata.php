<?
if (!is_file($file)){
   $response['meta_error'] = "$file Not a file!";
   echo json_encode($response);
   exit;
} 
exec("exiftool -j $file", $out);
foreach ($out as $line){
   $json .= $line;
}


$meta = json_decode($json, TRUE);
$meta = $meta[0];





$fields = array();
$time = array();
$time[]= 'TrackCreateDate';
$time[]= 'TrackModifyDate';
$time[]= 'FileModifyDate';
$time[]= 'MediaCreateDate';
$time[]= 'MediaModifyDate';
$time[]= 'DateTimeOriginal';
$fields[]= 'MediaDuration';
$fields[]= 'Duration';
$fields[]= 'MIMEType';

foreach($time as $tim){
	if (isset($meta[$tim])){
		$times[$tim] = $meta[$tim];
	}
}

foreach($fields as $field){
	if (isset($meta[$field])){
		$data[$field]= $meta[$field];
	}

}

$poststrfields = array('description', 'location', 'date', 'tags');

foreach ($poststrfields as $postfield){
	if ($_POST[$postfield]){
		//echo "setting " .$postfield ." as " .$_POST[$postfield];
		$data[$postfield] = filter_var($_POST[$postfield], FILTER_SANITIZE_STRING); 
	}
}

if ($_POST['email']){
	$data[$postfield] = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL); 
}

if ($_POST['blur'] == "true"){
	$data['blur'] = true;

} else {
	$data['blur'] = false;
}


$data['times'] = $times;

$newdata = array('$set' => $data);
$collection->update(array("name" => $randomName), $newdata);
$item = $collection->findOne(array('name' => $randomName));
$res['meta'] = $item;

$redactedfile = $redacteddir .$randomName ."." .$ext;
$wave = $redacteddir .$randomName .".wav";
$image = $redacteddir .$randomName ."_wave.png";
$type = explode('/', $data['MIMEType']);
$type = $type[0];
trigger_error($type + "\r\n");
if ($type == "video"){
	exec("ffmpeg -i $file -vcodec copy -acodec copy $redactedfile");
	exec("ffmpeg -i $redactedfile -vn $wave");
	exec("wav2png --foreground-color=000000ff --background-color=00000000 -o $image $wave");
	if ($data['blur'] == true){
		include("youtubes.php");
	}
} else {
	//it's an image.
	copy($file, $redactedfile);
	exec("exiv2 -d a $redactedfile");
}
?>

