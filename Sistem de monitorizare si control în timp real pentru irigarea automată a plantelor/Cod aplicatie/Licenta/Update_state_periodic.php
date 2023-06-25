<?php
$servername = "localhost";
$username = "root";
$password = "";
$db = "licenta";

// Crearea conexiunii la baza de date
$conn = new mysqli($servername, $username, $password, $db);

// Verificarea conexiunii
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Obținerea valorilor IdSensor, intervalUdare și dataSelectata
$id = $_GET['IdSensor'];
$intervalUdare = $_GET['intervalUdare'];
$dataSelectata = $_GET['dataSelectata'];
$state = $_GET['state'];
$timer = $_GET['timer'];

if ($intervalUdare === "1day") {
    // Udare la interval de 1 zi
    $timer = 1;
    $state = 1;
} elseif ($intervalUdare === "3day") {
    // Udare la interval de 3 zile
    $timer = 3;
    $state = 1;
}else if ($intervalUdare === "7day") {
    // Udare la interval de 7  zile
    $timer = 7;
    $state = 1;
} else {

}

$sql = "UPDATE starepompa SET state='$state', timmer='$timer', dataSelectata='$dataSelectata' WHERE id=1";

$result = $conn->query($sql);

$conn->close();
?>
