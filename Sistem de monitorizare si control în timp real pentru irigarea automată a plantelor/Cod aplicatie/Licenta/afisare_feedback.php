<?php
$servername = "localhost";
$username = "root";
$password = "";
$db = "licenta";

$conn = new mysqli($servername, $username, $password, $db);

// Verificați conexiunea la baza de date
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Obțineți comentariile din baza de date
$sql = "SELECT * FROM feedback";
$result = $conn->query($sql);
$data = [];
if ($result->num_rows > 0) {
    // output data of each row
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    echo "0 results";
}

echo json_encode($data);
$conn->close();
?>
