<!DOCTYPE html>
<html>
<body>

<h1>PHP page</h1>



<?php
echo date('h:i:s') . "<br>";

//sleep for 3 seconds
sleep(3);
$x = 1;
while($x <= 5) {
  echo "The number is: $x <br>";
  $x=$x+1;
  sleep(1);
}

/*
for ($x = 0; $x <= 10; $x++) {
    echo "The number is: $x <br>";
} 
*/
?>
 

</body>
</html>