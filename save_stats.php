<?php

/**
 * Validate and save data to database
 */

require_once "db_conn.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	header("Location: http://localhost/workspace/Pacman-Game-JS/");
	die();
}

$name = htmlspecialchars($_POST['playerName']);
$score = (int)$_POST['score'];

$playerName = trim($name);
$playerScore = trim($score);

$data = [
	'err' => false,
	'msg' => "You need to write your nickname if you want to play for our dashboard",
	'score' => $score,
];

if (!empty($playerName)) {
	
	$db = new Db();
	$con = $db->getCon();

	$stmt = $data = $db->isPlayerExistAndScoreIsHigh($playerName, $playerScore);

	$sql = "";
	$msg = "";
	switch ($stmt) {
		case 'create':
				$sql = "INSERT INTO dashboard (username,score) VALUES('".$playerName."', '".$playerScore."')";
				$msg = "Data saved succesfully";
			break;
		
		case 'update':
				$sql = "UPDATE dashboard SET score=$playerScore WHERE username='$playerName'";
				$msg = "Congratulations, $playerName! You have made new highes $playerScore score!";
			break;

		case 'skip':
				$msg = "This time you fail, but hey don't give up! Keep playing!";
			break;

		default:
				$msg = "Sorry buddy we have service problems... And your score won't be saved";
			break;
	}

	$err = $db->save($sql);

	if ($err) {
		$data = array(
			'err' => false,
			'msg' => $msg ? $msg : "Data save",
		);
	}
	else{
		$data = array(
			'err' => true,
			'msg' => $msg ? $msg : "Data save failed!",
		);
	}
}

echo json_encode($data);