<!DOCTYPE html>
<html>
<body>

<h2>Iframe - Target for a Link</h2>

<iframe src="page1.html" name="iframe_a" height="600px" width="100%" title="Iframe Example"></iframe>

<p><a href="http://vps470554.ovh.net/web/page1.html" target="iframe_a">Logrhythm</a></p>
<p><a href="http://vps470554.ovh.net/web/page2.html" target="iframe_a">Trend</a></p>
<p><a href="http://vps470554.ovh.net/web/page3.html" target="iframe_a">Syslog</a></p>

 
 <?php
$x = 1;

while($x <= 5) {
  //echo "The number is: $x <br>";
  <iframe src="page1.html" name="iframe_a" height="600px" width="100%" title="Iframe Example"></iframe>
  $x=$x+1;
  sleep(1);
}

?>


</body>
</html>