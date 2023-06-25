<?php
$servername = "localhost";
$username = "root";
$password = "";
$db = "licenta";
$umiditateSol = $_GET["Umiditate_sol"];
$umiditateAer = $_GET["Umiditate_aer"];
$temperatura = $_GET["Temperatura"];
$nivelApa = $_GET["NivelApa"];
$idSensor = $_GET["IdSensor"];

// Crează conexiunea
$conn = new mysqli($servername, $username, $password, $db);

// Verifică conexiunea
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

$sql = "INSERT INTO sensordate   values ('$umiditateAer', '$temperatura' , '$nivelApa' , '$umiditateSol' , '$idSensor', NOW() )";
$result = $conn->query($sql);
// Șterge înregistrările mai vechi de 10 zile
$10ZileInUrma = date("Y-m-d", strtotime("-10 days"));
$deleteSql = "DELETE FROM sensordate WHERE date < '$10ZileInUrma'";
$deleteResult = $conn->query($deleteSql);

if (!$deleteResult) {
    echo "Error deleting records: " . $conn->error;
}

$conn->close();
?>
