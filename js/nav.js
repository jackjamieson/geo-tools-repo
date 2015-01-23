
var divNav = document.getElementById('topNav');
divNav.innerHTML = 	'<nav>' +
	//'<img style="float:right;" src="img/njgwslogsm2.jpg"/>' +
	'<span class="top">Geologic Web Utilities</span><br>' +
	'<ul>' +
	'<li><a href="index.html">Home</a></li>' +
	'<li>'+
	'<a href="#">Coordinate Conversion Tools</a>'+
	'<ul>'+
    '<li><a href="fdmconvert.html">Field Data Management to CSV</a></li>'+
	'<li><a href="atlas.html">NJ Atlas Sheet Coordinates to NAD27</a></li>'+
	'<li><a href="dmsdeg.html">NAD27 Decimal Degree to DDMMSS</a></li>'+
	'<li><a href="http://www.ngs.noaa.gov/cgi-bin/nadcon.prl" target="_blank" >NADCON NAD27 Decimal Degree to NAD83 DDMMSS (external)</a></li>'+
	'<li><a href="http://www.earthpoint.us/convert.aspx" target="_blank" >State Plane Feet and Other Coordinate Conversions (external)</a></li>'+

	'<li><a href="help.html">Conversion Tools Help</a></li>'+
	'</ul>'+
	'</li>'+
	'<li><a href="3ppfull.html">Dynamic 3-Point Geological-Plane Solver</a></li>' +
	'<li><a href="exceltoKML.html">Excel to KML Formatter</a></li>'
'</ul>'+

	'</nav><hr></hr>';

var footer = document.getElementById('foot');
footer.innerHTML = 	'<hr><br>Developed by Jack Jamieson and Greg Herman.  No rights reserved.';// +

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-40920141-1', 'auto');
  ga('send', 'pageview');



//'<br><br>' +
//'<img src="img/DEPLOGOsm2.jpg"/>' +
//'<img src="img/njlogsm.png"/>';

