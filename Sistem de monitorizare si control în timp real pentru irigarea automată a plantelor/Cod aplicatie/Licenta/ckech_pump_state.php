<?php
$servername = "localhost";
$username = "root";
$password = "";
$db = "licenta";

// Creare conexiune
$conn = new mysqli($servername, $username, $password, $db);

// verificare conexiune
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT state, timmer,dataSelectata FROM starepompa";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  $status = $row["state"];
  $timer = $row["timmer"];
  $dataSelectata =$row["dataSelectata"];
  echo $status . "," . $timer . "," . $dataSelectata; // Returnează starea  timer-ul și data selectată  separate prin virgulă
} else {
  echo "0 results";
}

$conn->close();
?>
