<?php

include_once "db_conn.php";

// TODO implement dashboard


$model = new Db();
$playerName = "keFa";
$playerScore = 500;
$statement = $model->isPlayerExistAndScoreIsHigh($playerName, $playerScore);
$highesScores = $model->highesPlayerScores();

var_dump($highesScores);
var_dump($statement);