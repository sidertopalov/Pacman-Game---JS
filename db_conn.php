<?php

class Db
{
	private $servername = "localhost";
	private $username = "root";
	private $pass = "";
	private $database = "pacman";
	public $con = null;

	public function __construct()
	{
		$this->con = mysqli_connect($this->servername, $this->username,$this->pass,$this->database);

		if ($this->con->connect_error) {
			die("Connection failed: " . $this->con->connect_error);
		}
	}

	public function getCon()
	{
		return $this->con;
	}

	public function isPlayerExistAndScoreIsHigh($playerName, $curScore)
	{
		$con = $this->con;
		$sql = "SELECT * FROM dashboard WHERE username='$playerName'";
		$data = $con->query($sql);
		$user = $data->fetch_row();
		
		if (!is_null($user)) {
			$oldScore = $user[1];
			if ($curScore > $oldScore) {
				return "update";
			}
			else return "skip";
		}
		return "create";
	}

	public function highesPlayerScores(int $limit = 10)
	{
		$sql = "SELECT * FROM dashboard ORDER BY score DESC LIMIT $limit";
		$data = $this->con->query($sql);
		$result = [];
		
		while($row = $data->fetch_row()) {
		  	$result[]=$row;
		}

		return $result;
	}

	public function getAllPlayers()
	{
		$sql = "SELECT * FROM dashboard";
		$data = $this->con->query($sql);
		$result = [];
		
		while($row = $data->fetch_row()) {
		  	$result[]=$row;
		}

		return $result;
	}

	public function save($sql)
	{
		if (!empty($sql)) {

			$con = $this->con;
			if ($con->query($sql))
			{
				return true;
			}
		}
		return false;
	}
}