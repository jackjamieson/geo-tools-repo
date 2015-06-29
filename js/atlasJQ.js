//Controls the interactions with the site.
//Requires njgsConversionUtil.js and NAD27.js

//When a user clicks calculate on atlas -> lat
$('#go').click(function () {



	var divErr = document.getElementById('error');
	var divDMS = document.getElementById('outputDMS');
	var divDeg = document.getElementById('outputDeg');
	var divQuad = document.getElementById('outputQuad');

	divErr.innerHTML = "";//Clear the errors when the button is clicked again
	divDMS.innerHTML = "<strong>ddmmss.ss (NAD27):</strong>";//Clear the errors when the button is clicked again
	divDeg.innerHTML = "<strong>Decimal Degrees (NAD27): </strong>";//Clear the errors when the button is clicked again
	divQuad.innerHTML = "<strong>USGS Quadrangle: </strong>";//Clear the errors when the button is clicked again


	//Grab the values from the text boxes
    var first = $('#firstBlock').val();
	var second = $('#secondBlock').val();
	var third = $('#thirdBlock').val();

	//Get the digits from the second box
	var secondFirstDigit = second.substring(0,1);
	var secondSecondDigit = second.substring(1,2);

	//Get the digits from the third box
	var thirdFirstDigit = third.substring(0,1);
	var thirdSecondDigit = third.substring(1,2);
	var thirdThirdDigit = third.substring(2,3);

	if(checkAtlasCoordinate(first, second, third, secondFirstDigit, secondSecondDigit, thirdFirstDigit, thirdSecondDigit, thirdThirdDigit))
	{
		if(atlasConversion(first, secondFirstDigit, secondSecondDigit, thirdFirstDigit, thirdSecondDigit, thirdThirdDigit)){
			divDeg.innerHTML = "<strong>Decimal Degrees (NAD27): </strong>" + "Latitude: " + latDeg + " " + "Longitude: -" + lonDeg;
			divDMS.innerHTML = "<strong>ddmmss.ss (NAD27):</strong>" + "Latitude: " + latDMS + " Longitude: -" + lonDMS;

			var quadResult = findQuad(Number(latDMS), Number(lonDMS));
			divQuad.innerHTML = "<strong>USGS Quadrangle: </strong>" + quadResult;


		}
		else{
			divErr.innerHTML = "<strong>Error: </strong>" + errOutput + "<p>";//Display an appropriate error message;
			divDeg.innerHTML = "<strong>Decimal Degrees (NAD27): </strong>";
			divDMS.innerHTML = "<strong>ddmmss.ss (NAD27):</strong>";

		}

	}
	else divErr.innerHTML = "<strong>Error: </strong>" + errOutput + "<p>";//Display an appropriate error message;

});

//When a user clicks Calculate on DMS lat -> atlas
$('#goDMS').click(function () {


	var divErr = document.getElementById('errorDMS');
	var divSh = document.getElementById('outputSheet');
	var divQuad = document.getElementById('outputQuadDMS');

	divErr.innerHTML = "";//Clear the errors when the button is clicked again
	divSh.innerHTML = "<strong>Atlas Sheet Coordinates: </strong>";//Clear the errors when the button is clicked again
	divQuad.innerHTML = "<strong>USGS Quadrangle: </strong>";//Clear the errors when the button is clicked again


	//Grab the values from the text boxes
    var lat = $('#dmsLat').val();
	var lon = $('#dmsLon').val();

	lat = Math.abs(Number(lat));
	lon = Math.abs(Number(lon));
	lat = "" + lat;
	lon = "" + lon;

	//Break down the dms for lat and long
	var latD = lat.substring(0,2);
	var latM = lat.substring(2,4);
	var latS = lat.substring(4,6);

	var lonD = lon.substring(0,2);
	var lonM = lon.substring(2,4);
	var lonS = lon.substring(4,6);



	if(checkDMS(lat, lon))
	{
		if(latConversion(Number(latD), Number(latM), Number(latS), Number(lonD), Number(lonM), Number(lonS))){
			divSh.innerHTML = "<strong>Atlas Sheet Coordinates: </strong>" + atlasSh + " : " + atlasBl + " : " + atlasSq;

			var quadResult = findQuad(Number(lat), Number(lon));
			divQuad.innerHTML = "<strong>USGS Quadrangle: </strong>" + quadResult;
		}
		else{
			divErr.innerHTML = "<strong>Error: </strong>" + errOutput + "<p>";//Display an appropriate error message;
			divDeg.innerHTML = "<strong>Decimal Degrees (NAD27): </strong>";
			divDMS.innerHTML = "<strong>ddmmss.ss (NAD27):</strong>";

		}

	}
	else divErr.innerHTML = "<strong>Error: </strong>" + errOutput + "<p>";//Display an appropriate error message;

});

//for batch files to be imported to NADCON
$('#download').click(function () {

	if($('#chx').is(':checked') == true)
	{
	  var textFile = null,
	  makeTextFile = function (text) {
		var data = new Blob([text], {type: 'text/plain'});

		// If we are replacing a previously generated file we need to
		// manually revoke the object URL to avoid memory leaks.
		if (textFile !== null) {
		  window.URL.revokeObjectURL(textFile);
		}

		textFile = window.URL.createObjectURL(data);

		return textFile;
	  };


		var textbox = document.getElementById('batchAreaOut');

		this.href = makeTextFile(textbox.value);
	}

});

$('#goDeg').click(function () {


	var divErr = document.getElementById('errorDMS');
	var divSh = document.getElementById('outputSheet');
	var divQuad = document.getElementById('outputQuadDMS');

	divErr.innerHTML = "";//Clear the errors when the button is clicked again
	divSh.innerHTML = "<strong>Atlas Sheet Coordinates: </strong>";//Clear the errors when the button is clicked again
	divQuad.innerHTML = "<strong>USGS Quadrangle: </strong>";//Clear the errors when the button is clicked again


	//Grab the values from the text boxes
    var lat = $('#dmsDLat').val();
	var lon = $('#dmsDLon').val();

	lat = Math.abs(Number(lat));
	lon = Math.abs(Number(lon));

	if(degToDMS(lat, lon))
	{
		lat = "" + degDMSLat;
		lon = "" + degDMSLon;

		//Break down the dms for lat and long
		var latD = lat.substring(0,2);
		var latM = lat.substring(2,4);
		var latS = lat.substring(4,6);

		var lonD = lon.substring(0,2);
		var lonM = lon.substring(2,4);
		var lonS = lon.substring(4,6);



		if(checkDMS(lat, lon))
		{
			if(latConversion(Number(latD), Number(latM), Number(latS), Number(lonD), Number(lonM), Number(lonS))){
				divSh.innerHTML = "<strong>Atlas Sheet Coordinates: </strong>" + atlasSh + " : " + atlasBl + " : " + atlasSq;

				var quadResult = findQuad(Number(lat), Number(lon));
				divQuad.innerHTML = "<strong>USGS Quadrangle: </strong>" + quadResult;
			}
			else{
				divErr.innerHTML = "<strong>Error: </strong>" + errOutput + "<p>";//Display an appropriate error message;
				divDeg.innerHTML = "<strong>Decimal Degrees (NAD27): </strong>";
				divDMS.innerHTML = "<strong>ddmmss.ss (NAD27):</strong>";

			}

		}
		else divErr.innerHTML = "<strong>Error: </strong>" + errOutput + "<p>";//Display an appropriate error message;
	}
	else divErr.innerHTML = "<strong>Error: </strong>" + errOutput + "<p>";//Display an appropriate error message;
});


$('#goBatchAt').click(function () {

	var outArea = document.getElementById('batchAreaOut');
	outArea.innerHTML = "";

	var count = 0;
	var textArea = document.getElementById('batchArea');
	var lines = $("#batchArea").val().split("\n");
	for(i = 0; i < lines.length; i++)
	{
		if(lines[i] == "")
		{
			//skip these ones(sometimes the last element
		}
		else count++;
	}
	//console.log(count);

	if($('#chx').is(':checked') == true)
	{
		for(z = 0; z < count; z++)
		{
		//console.log(lines[z]);
			var outString = "";
			var first = lines[z].substring(0,2);
			var second = lines[z].substring(3,5);
			var third = lines[z].substring(6,9);

			//Get the digits from the second box
			var secondFirstDigit = second.substring(0,1);
			var secondSecondDigit = second.substring(1,2);

			//Get the digits from the third box
			var thirdFirstDigit = third.substring(0,1);
			var thirdSecondDigit = third.substring(1,2);
			var thirdThirdDigit = third.substring(2,3);

			//console.log("" + first + ":" + second + ":" + third);

			if(checkAtlasCoordinate(first, second, third, secondFirstDigit, secondSecondDigit, thirdFirstDigit, thirdSecondDigit, thirdThirdDigit))
			{
				if(atlasConversion(first, secondFirstDigit, secondSecondDigit, thirdFirstDigit, thirdSecondDigit, thirdThirdDigit)){
					//outString = "" + first + ":" + second + ":" + third + "\n=========\n"
					outString = latDeg + " " + lonDeg;
					var length = outString.length;
					//console.log(length);

					if(length <= 40)
					{
						for(v = 0; v < 40 - length; v++)
						{
							outString += " ";
						}

					}
					//console.log(outString);


					//outString = outString + "(DDMMSS NAD27) Latitude: " + latDMS + " Longitude: -" + lonDMS + "\n";

					//divDeg.innerHTML = "<strong>Decimal Degrees (NAD27): </strong>" + "Latitude: " + latDeg + " " + "Longitude: -" + lonDeg;
					//divDMS.innerHTML = "<strong>ddmmss.ss (NAD27):</strong>" + "Latitude: " + latDMS + " Longitude: -" + lonDMS;
					//console.log("Latitude: " + latDeg + " " + "Longitude: -" + lonDeg);
					var quadResult = findQuad(Number(latDMS), Number(lonDMS));
					outString += quadResult + "\n";
				}
				else{
					outString = "" + first + ":" + second + ":" + third + "\n=========\n"
					outString += "Error: " + errOutput + "\n";
					//divErr.innerHTML = "<strong>Error: </strong>" + errOutput + "<p>";//Display an appropriate error message;
					//divDeg.innerHTML = "<strong>Decimal Degrees (NAD27): </strong>";
					//divDMS.innerHTML = "<strong>ddmmss.ss (NAD27):</strong>";

				}

			} else
			{
				outString = "" + first + ":" + second + ":" + third + "\n=========\n"
				outString += "Error: " + errOutput + "\n";
			}
			outArea.innerHTML += outString;

		}
	}
	else{
		for(z = 0; z < count; z++)
		{
		//console.log(lines[z]);
			var outString = "";
			var first = lines[z].substring(0,2);
			var second = lines[z].substring(3,5);
			var third = lines[z].substring(6,9);

			//Get the digits from the second box
			var secondFirstDigit = second.substring(0,1);
			var secondSecondDigit = second.substring(1,2);

			//Get the digits from the third box
			var thirdFirstDigit = third.substring(0,1);
			var thirdSecondDigit = third.substring(1,2);
			var thirdThirdDigit = third.substring(2,3);

			//console.log("" + first + ":" + second + ":" + third);

			if(checkAtlasCoordinate(first, second, third, secondFirstDigit, secondSecondDigit, thirdFirstDigit, thirdSecondDigit, thirdThirdDigit))
			{
				if(atlasConversion(first, secondFirstDigit, secondSecondDigit, thirdFirstDigit, thirdSecondDigit, thirdThirdDigit)){
					outString = "" + first + ":" + second + ":" + third + "\n=========\n"
					outString = outString + "(Decimal NAD27) Latitude: " + latDeg + " " + "Longitude: -" + lonDeg + "\n";
					outString = outString + "(DDMMSS NAD27) Latitude: " + latDMS + " Longitude: -" + lonDMS + "\n";

					//divDeg.innerHTML = "<strong>Decimal Degrees (NAD27): </strong>" + "Latitude: " + latDeg + " " + "Longitude: -" + lonDeg;
					//divDMS.innerHTML = "<strong>ddmmss.ss (NAD27):</strong>" + "Latitude: " + latDMS + " Longitude: -" + lonDMS;
					//console.log("Latitude: " + latDeg + " " + "Longitude: -" + lonDeg);
					var quadResult = findQuad(Number(latDMS), Number(lonDMS));
					outString += "USGS Quadrangle: " + quadResult + "\n";
				}
				else{
					outString = "" + first + ":" + second + ":" + third + "\n=========\n"
					outString += "Error: " + errOutput + "\n";
					//divErr.innerHTML = "<strong>Error: </strong>" + errOutput + "<p>";//Display an appropriate error message;
					//divDeg.innerHTML = "<strong>Decimal Degrees (NAD27): </strong>";
					//divDMS.innerHTML = "<strong>ddmmss.ss (NAD27):</strong>";

				}

			} else
			{
				outString = "" + first + ":" + second + ":" + third + "\n=========\n"
				outString += "Error: " + errOutput + "\n";
			}
			outArea.innerHTML += outString;

		}
	}

});

$('#export').click(function() {

	if($('#chx').is(':checked') == true)
	{
		var textFile = null,
		makeTextFile = function (text) {
		var data = new Blob([text], {type: 'text/kml'});

		// If we are replacing a previously generated file we need to
		// manually revoke the object URL to avoid memory leaks.
		if (textFile !== null) {
		  window.URL.revokeObjectURL(textFile);
		}

		textFile = window.URL.createObjectURL(data);

		return textFile;
		};

		var count = 0;
		var inparea = document.getElementById('batchArea');
		var asc = $("#batchArea").val().split("\n");


		var raw = document.getElementById('batchAreaOut');
		var count = 0;
		var lines = $("#batchAreaOut").val().split("\n");

		var textbox = '<?xml version="1.0" encoding="UTF-8"?>\n' +
		'<kml xmlns="http://www.opengis.net/kml/2.2">\n' +
		'<Document>\n' +
		'\t<name>batchGEPoints.kml</name>\n' +
		'\t<Folder>\n' +
		'\t\t<name>Points</name>\n';

		for(i = 0; i < lines.length; i++)
		{
			lines[i] = lines[i].replace(/ {2,}/g, ", ");
			lines[i] = lines[i].replace(" ", ", ");
			if(lines[i] == "")
			{
				//skip these ones(sometimes the last element)
			}
			else {

				var sp = lines[i].split(", ");
				textbox += '\t\t<Placemark>\n' +
				'\t\t\t<name>' + sp[2] +'</name>\n' +
				'\t\t\t<description>' + asc[i] + '</description>\n' +
				'\t\t\t<Point>\n' +
					'\t\t\t<coordinates>-' + sp[1] + "," + sp[0] + ",0" + '</coordinates>\n' +
				'\t\t\t</Point>\n' +
				'\t\t</Placemark>\n';
			}

			//console.log(lines[i]);
		}

		// +
		//lines = $("#batchAreaOut").val().split(/\s/);
		textbox += '\t</Folder>\n' +
		'</Document>\n' +
		'</kml>';
		//console.log(textbox);
		/*
		  <Placemark>
			<name>Simple placemark</name>
			<description>Attached to the ground. Intelligently places itself
			   at the height of the underlying terrain.</description>
			<Point>
			  <coordinates>-122.0822035425683,37.42228990140251,0</coordinates>
			</Point>
		  </Placemark>
		'</kml>';
		*/
		this.href = makeTextFile(textbox);
	}


});

//Controls the display switching when clicking radio buttons
$("#radios input[name='type']").click(function(){
    if($('input:radio[name=type]:checked').val() == "latToAtr"){
		var atToLatDiv = document.getElementById('atToLat');
		var displaySetting = atToLatDiv.style.display;
		atToLatDiv.style.display = 'none';

		var batchDiv = document.getElementById('batch');
		displaySetting = batchDiv.style.display;
		batchDiv.style.display = 'none';

		atToLatDiv = document.getElementById('latToAt');
		var displaySetting = atToLatDiv.style.display;
		atToLatDiv.style.display = 'block';
	}
	else if($('input:radio[name=type]:checked').val() == "atToLatr"){
		var atToLatDiv = document.getElementById('atToLat');
		var displaySetting = atToLatDiv.style.display;
		atToLatDiv.style.display = 'block';

		var batchDiv = document.getElementById('batch');
		displaySetting = batchDiv.style.display;
		batchDiv.style.display = 'none';

		atToLatDiv = document.getElementById('latToAt');
		var displaySetting = atToLatDiv.style.display;
		atToLatDiv.style.display = 'none';

	}
	else if($('input:radio[name=type]:checked').val() == "batchAt"){

		var batchDiv = document.getElementById('batch');
		displaySetting = batchDiv.style.display;
		batchDiv.style.display = 'block';

		var atToLatDiv = document.getElementById('latToAt');
		displaySetting = atToLatDiv.style.display;
		atToLatDiv.style.display = 'none';

		var latToDiv = document.getElementById('atToLat');
		displaySetting = latToDiv.style.display;
		latToDiv.style.display = 'none';

	}
});

function initRadio(){
	var atToLatDiv = document.getElementById('atToLat');
	var displaySetting = atToLatDiv.style.display;
	atToLatDiv.style.display = 'block';

	var batchDiv = document.getElementById('batch');
	displaySetting = batchDiv.style.display;
	batchDiv.style.display = 'none';

	atToLatDiv = document.getElementById('latToAt');
	var displaySetting = atToLatDiv.style.display;
	atToLatDiv.style.display = 'none';
}
initRadio();
