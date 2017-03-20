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

// Remove spaces
$playerName = trim($name);
$playerScore = trim($score);

// regex pattern only numbers, letters, "-" and "_"
$reg = '/^[a-zA-Z0-9_-]+$/';
preg_match_all($reg, $playerName, $matches, PREG_PATTERN_ORDER);

$result = isset($matches[0][0]) ? $matches[0][0] : "";

$data = [
	'err' => false,
	'msg' => "You need to write your nickname and collect more that 0 score if you want to play for our dashboard",
	'score' => $playerScore,
];

if (!empty($playerName) && $result === $playerName && $playerScore > 0 ) {
	
	$db = new Db();
	$con = $db->getCon();

	$stmt = $data = $db->isPlayerExistAndScoreIsHigh($playerName, $playerScore);

	$sql = "";
	$msg = "";
	switch ($stmt) {
		case 'create':
				$sql = "INSERT INTO dashboard (username,score) VALUES('$playerName', $playerScore)";
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