<?php
$servername = "localhost";
$username = "root";
$password = "";
$db="licenta";

// Crează conexiunea
$conn = new mysqli($servername, $username,$password,$db);

// Verifică conexiunea
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
$sql = "SELECT *from  logare ";
$result = $conn->query($sql);
$data = array();
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
      $data[] = $row;
  }
} else {
  echo "0 results";
}

echo json_encode($data);
$conn->close();
?>
