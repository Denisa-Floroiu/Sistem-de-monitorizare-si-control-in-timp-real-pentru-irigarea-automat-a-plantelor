<?php
$servername = "localhost";
$username = "root";
$password = "";
$db="licenta";
$email=$_GET['email'];
$parola=$_GET['parola'];
$username=$_GET['username'];

// Crează conexiunea
$conn = new mysqli($servername, $username,$password,$db);

// Verifică conexiunea
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO logare (nume_utilizator,email,parola)   values ('".$username."', '".$email."', '".md5($parola)."')";
$result = $conn->query($sql);

$conn->close();
?>