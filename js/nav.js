
var curPage = (window.location.href.substring(window.location.href.lastIndexOf("/")+1, window.location.href.length));

var isActive,isActive2,isActive3,isActive4,isActive5,isActive6;

if(curPage === 'index.html')
{
	isActive = "active";
}
if(curPage === 'conversion.html' || curPage === 'fdmconvert.html' || curPage === 'atlas.html' || curPage === 'dmsdeg.html' || curPage === 'help.html'){
	isActive2 = "active";
}
if(curPage === '3ppops.html' || curPage === 'ww3pp.html'){
	isActive3 = "active";
}
if(curPage === 'exceltoKML.html'){
	isActive4 = "active";
}
if(curPage === 'xmlgen.html'){
	isActive5 = "active";
}
if(curPage === 'kmlfmt.html'){
	isActive6 = "active";
}

var divNav = document.getElementById('leftcolumn');
divNav.innerHTML =
'<ul class="nav nav-pills nav-stacked">' +
	'<li class="' + isActive + '"><a href="index.html">Home</a></li>' +
	'<li class="' + isActive2 + '"><a href="conversion.html">Conversion Tools</a></li>' +
	'<li class="' + isActive3 + '"><a href="3ppops.html">Dynamic 3-Point Geological-Plane Solver</a></li>' +
	'<li class="' + isActive4 + '"><a href="exceltoKML.html">Excel to KML Formatter</a></li>' +
	'<li class="' + isActive5 + '"><a href="xmlgen.html">XML Metadata Generator</a></li>' +
	'<li class="' + isActive6 + '"><a href="kmlfmt.html">USGS KML Formatter</a></li>'
'</ul>';

var header = document.getElementById('header');
header.innerHTML = 	'<p>Geologic Web Utilities</p>';

 var footer = document.getElementById('footer');
 footer.innerHTML = 	'<p>Developed by Jack Jamieson and Greg Herman.  No rights reserved.</p>';// +

//   (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
//   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
//   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
//   })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
//
//   ga('create', 'UA-40920141-1', 'auto');
//   ga('send', 'pageview');
//


//'<br><br>' +
//'<img src="img/DEPLOGOsm2.jpg"/>' +
//'<img src="img/njlogsm.png"/>';
