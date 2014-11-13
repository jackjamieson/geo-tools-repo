//Controls the interactions with the site.


$('#goDMS').click(function () {
	

	
	var divErr = document.getElementById('error');
	var divDeg = document.getElementById('outputDeg');

	divErr.innerHTML = "";//Clear the errors when the button is clicked again
	divDeg.innerHTML = "<strong>Decimal Degrees(NAD 27): </strong>";//Clear the errors when the button is clicked again

	//Grab the values from the text boxes
    var lat = $('#dmsLat').val();
	var lon = $('#dmsLon').val();
	
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
		var degLat =  Number(dmsToDegLat(latD, latM, latS)).toFixed(3);
		var degLon = Number(dmsToDegLon(lonD, lonM, lonS)).toFixed(3);
		divDeg.innerHTML = "<strong>Decimal Degrees: </strong>" + "Latitude: " + degLat + " Longitude: -" + degLon;//Clear the errors when the button is clicked again


	}
	else divErr.innerHTML = "<strong>Error: </strong>" + "There was an input error." + "<p>";//Display an appropriate error message;

});

$('#goDeg').click(function () {
	
	
	var divErr = document.getElementById('errorDMS');
	var divDMS = document.getElementById('outputDMS');

	divErr.innerHTML = "";//Clear the errors when the button is clicked again
	divDMS.innerHTML = "<strong>DDMMSS(NAD 27): </strong>";//Clear the errors when the button is clicked again


	//Grab the values from the text boxes
    var lat = $('#degLat').val();
	var lon = $('#degLon').val();

	lat = Math.abs(Number(lat));
	lon = Math.abs(Number(lon));
	
	if(checkDeg(lat, lon))
	{
		var dmsLat = degToDMSLat(lat);
		var dmsLon = degToDMSLon(lon);
		//Break down the dms for lat and long
		
		divDMS.innerHTML = "<strong>DDMMSS: </strong>" + "Latitude: " + dmsLat + " Longitude: -" + dmsLon;//Clear the errors when the button is clicked again

		
	}
	else divErr.innerHTML = "<strong>Error: </strong>" + errOutput + "<p>";//Display an appropriate error message;
});




//Controls the display switching when clicking radio buttons
$("#radios input[name='type']").click(function(){
    if($('input:radio[name=type]:checked').val() == "dmsToDegRd"){
		var dmsDiv = document.getElementById('dmsToDeg');
		var displaySetting = dmsDiv.style.display;
		dmsDiv.style.display = 'block';
		
		degDiv = document.getElementById('degToDMS');
		var displaySetting = degDiv.style.display;
		degDiv.style.display = 'none';
	}
	else {
		var dmsDiv = document.getElementById('dmsToDeg');
		var displaySetting = dmsDiv.style.display;
		dmsDiv.style.display = 'none';
		
		degDiv = document.getElementById('degToDMS');
		var displaySetting = degDiv.style.display;
		degDiv.style.display = 'block';
	
	}

});