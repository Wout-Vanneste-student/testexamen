<?php

require_once(__DIR__ . '/DAO.php');

class ScoreDAO extends DAO{

  public function selectTop5(){
    $sql = "SELECT * FROM `scores` ORDER BY `score` DESC LIMIT 5";
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }
  public function selectById($id){
    $sql = "SELECT * FROM `scores` WHERE `id` = :id";
    $stmt = $this->pdo->prepare($sql);
    $stmt->bindValue(':id', $id);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function insert($data){
    $errors = $this->validate($data);
    if(empty($errors)){
      $sql = "INSERT INTO `scores` (`score`) VALUES (:score)";
      $stmt = $this->pdo->prepare($sql);
      $stmt->bindValue(':score', $data['score']);
      if($stmt->execute()){
        return $this->selectById($this->pdo->lastInsertId());
      }
    }
    return false;
  }
  public function validate($data){
    $errors = [];
    if(!isset($data['score'])){
      $errors['score'] = 'Gelieve een score door te sturen';
    }

    return $errors;
  }

}


?>
