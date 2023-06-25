<?php
$servername = "localhost";
$username = "root";
$password = "";
$db="licenta";
$name = $_GET["name"];
$comment = $_GET["comment"];

$conn = new mysqli($servername, $username,$password,$db);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

 // Salvare comentariu în baza de date
  $sql = "INSERT INTO feedback  VALUES ('$name', '$comment',NOW())";
  if ($conn->query($sql) === TRUE) {
    echo "Comentariu adăugat cu succes!";
  } else {
    echo "Eroare la adăugarea comentariului: " . $conn->error;
  }

$conn->close();
?>