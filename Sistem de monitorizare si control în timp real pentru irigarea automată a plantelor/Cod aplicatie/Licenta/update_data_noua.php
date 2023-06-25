<?php
$servername = "localhost";
$username = "root";
$password = "";
$db="licenta";
$id=$_GET['IdSensor'];
$state=intval($_GET['state']);
$timmer=$_GET['timmer'];
$data=$_GET['data'];

// Crează conexiunea
$conn = new mysqli($servername, $username,$password,$db);

// Verifică conexiunea
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "UPDATE starepompa SET  state='$state' , timmer='$timmer',dataSelectata='$data'  where id=1 ";

$result = $conn->query($sql);

$conn->close();
?>