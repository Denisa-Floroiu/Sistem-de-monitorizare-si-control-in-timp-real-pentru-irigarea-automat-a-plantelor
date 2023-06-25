<?php
$servername = "localhost";
$username = "root";
$password = "";
$db = "licenta";
$interval = $_GET["interval"]; //intervalul pe care generam graficele
$unitate = $_GET["unit"];

// selectam  datele din ultimele  n ore (acest n este dat de "interval" ).și din acestea alegem doar datele din 10 in 10 minute sa le afisam.
if ($unitate === "ore") {
    $sql = "SELECT * FROM sensordate WHERE date >= NOW() - INTERVAL $interval HOUR AND MINUTE(date) % 10 = 0 ORDER BY date ";
} else {
}

// Crearea conexiunii
$conn = new mysqli($servername, $username, $password, $db);

// Verificarea conexiunii
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Interogarea SQL pentru a obține ultimele înregistrări din interval
$result = $conn->query($sql);

$data = []; // Array pentru stocarea datelor

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            "Timp" => $row["date"],
            "Temperatura" => $row["Temperatura"],
            "UmiditateSol" => $row["UmiditateSol"],
            "UmiditateAer" => $row["UmiditateAer"],
            "NivelApa" => $row["NivelApa"],
        ];
    }
}

// Returnează datele ca JSON
echo json_encode($data);

// Închideți conexiunea cu baza de date
$conn->close();
?>
