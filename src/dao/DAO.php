<?php

class DAO {

  // Properties
  // settings online
  private static $dbHost = "ID276027_highscores.db.webhosting.be";
	private static $dbName = "ID276027_highscores";
	private static $dbUser = "ID276027_highscores";
  private static $dbPass = "CODHighScoresWVJDG09";
  // settings local
  // private static $dbHost = "localhost";
	// private static $dbName = "highScores";
	// private static $dbUser = "score";
	// private static $dbPass = "score";
	private static $sharedPDO;
	protected $pdo;

  // Constructor
	function __construct() {

		if(empty(self::$sharedPDO)) {
			self::$sharedPDO = new PDO("mysql:host=" . self::$dbHost . ";dbname=" . self::$dbName, self::$dbUser, self::$dbPass);
			self::$sharedPDO->exec("SET CHARACTER SET utf8");
			self::$sharedPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			self::$sharedPDO->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
		}

		$this->pdo =& self::$sharedPDO;

	}

  // Methods

}

 ?>
