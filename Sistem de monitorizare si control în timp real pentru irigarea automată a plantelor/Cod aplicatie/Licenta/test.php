  <?php
   $servername = "localhost";
   $username = "root";
   $password = "";
   $db="licenta";
   // creare conexiune
   $conn = new mysqli($servername, $username,$password,$db);
   
   // verificare conexiune
   if ($conn->connect_error) {
     die("Connection failed: " . $conn->connect_error);
   }
  
   
   $sql = "SELECT *from sensordate ";
   $result = $conn->query($sql);
   $data = array();
   if ($result->num_rows > 0) {
     // output data of each row
     while($row = $result->fetch_assoc()) {
       array_push($data, $row);
   }
   } else {
     echo "0 results";
   }
   
   $conn->close();
   $data=array_reverse($data);
   echo json_encode($data);
   ?>