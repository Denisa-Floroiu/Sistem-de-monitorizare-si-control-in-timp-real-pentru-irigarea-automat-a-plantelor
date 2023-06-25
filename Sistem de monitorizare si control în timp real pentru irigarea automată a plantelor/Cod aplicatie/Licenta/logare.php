<?php
$servername = "localhost";
$username = "root";
$password = "";
$db="licenta";
$email=$_GET['email'];
$parola=$_GET['parola'];
// Create connection
$conn = new mysqli($servername, $username,$password,$db);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
$sql = "SELECT *from  logare WHERE email = '$email' AND parola = '".md5($parola)."'";

$result = $conn->query($sql);


if ($result->num_rows > 0) {
 echo json_encode(array("result"=>1));

} else {
echo json_encode( array("result"=>0));
}

$conn->close();
?>
