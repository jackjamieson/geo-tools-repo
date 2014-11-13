//TODO: Remove error output here.  Just make it return the actual number
//Global variables = bad, return 0 if it doesn't work out.

var errOutput; //Will hold text info about the current error.

//Hold the values created from atlasConversion()
var latDeg;
var lonDeg;
var latDMS;
var lonDMS;

//Hold the converted deg to dms
var degDMSLat;
var degDMSLon;

//Hold the converted dms to deg
var dmsDegLat;
var dmsDegLon;

//Hold the Atlas Sheet generated from latConversion()
var atlasSh;
var atlasBl;
var atlasSq;

var NUM_DECIMALS_LENGTH = 6;
var NUM_TO_FIXED = 7;

//Find the USGS Quadrangle associated with a ddmmss.  Searches the NAD27.js array.
function findQuad(latDD, lonDD)
{
	for(i = 0; i < dat.data.length; i++)
	{
		if(latDD <= dat.data[i][1] && latDD >= dat.data[i][3] && lonDD <= dat.data[i][2] && lonDD >= dat.data[i][4])
		{
			return dat.data[i][0];
		}
	}
	
	return "Location outside the defined area.";

}

function checkAtlasCoordinate(first, second, third, secondFirstDigit, secondSecondDigit, thirdFirstDigit, thirdSecondDigit, thirdThirdDigit)
{
	//Check for general input errors
    if (first === "" || secondFirstDigit === "" || secondSecondDigit === "" || thirdFirstDigit === "" || thirdSecondDigit === "" || thirdThirdDigit === "") //If the name is empty tell the user
    {

		errOutput = "All fields must be filled in.";
		return false;
    }
	else if(isNaN(first) || isNaN(second) || isNaN(third))//If the user tries to enter something other than a number
	{

		errOutput = "Only numbers allowed.";
		return false;
	}
	else{
	
		//Check for valid block
		if(secondFirstDigit > 4)
		{
	
			errOutput = "Location not on an Atlas Sheet!";
			return false;
		}
		
		if(first == 36)
		{
			if(secondSecondDigit > 6)
			{

				errOutput = "Location not on an Atlas Sheet!";
				return false;

			}
		}
		else if(secondSecondDigit > 5)
		{

			errOutput = "Location not on an Atlas Sheet!";
			return false;

		}
		
		//Check for valid rectangle number
		if(thirdSecondDigit == 0)
		{
			errOutput = "Location not on an Atlas Sheet!";
			return false;
		}
		
		if(thirdThirdDigit == 0)
		{
			errOutput = "Location not on an Atlas Sheet!";
			return false;
		}
	}
	
	return true;
}

function atlasConversion(first, secondFirstDigit, secondSecondDigit, thirdFirstDigit, thirdSecondDigit, thirdThirdDigit)
{
/*
		Latitude and longitude calculation:
		sngSouth = southerning in minutes and sngEast = easting in minutes
		The southerning and easting are determined by successive additions
		of increments as indicated by the given digit of the atlas sheet.
		All increments are measured in minutes of arc. The increment size
		is determined by the given digit. All sngSouth and sngEast increments
		are negative or zero because the reference corner location is the
		northwest corner of the atlas sheet and hence the locations referenced
		to this point are in directions of decreasing latitude and longitude.
		*/
		
		//Calculate southerning and easting of the block coordinate
		var sngSouth = (secondFirstDigit) * (-6);
		var sngEast = (secondSecondDigit - 1) * (-6);
		
		//calculate southerning and easting addition using 1st digit, 3x3 rectangle.
		//increment is 2 minutes
		
		switch(parseInt(thirdFirstDigit)) {
			case 1:
				sngSouth = sngSouth - (0 * 2);
				sngEast = sngEast - (0 * 2);
				break;
			case 2:
				sngSouth = sngSouth - (0 * 2);
				sngEast = sngEast - (1 * 2);
				break;
			case 3:
				sngSouth = sngSouth - (0 * 2);
				sngEast = sngEast - (2 * 2);
				break;
			case 4:
				sngSouth = sngSouth - (1 * 2);
				sngEast = sngEast - (0 * 2);
				break;
			case 5:
				sngSouth = sngSouth - (1 * 2);
				sngEast = sngEast - (1 * 2);
				break;
			case 6:
				sngSouth = sngSouth - (1 * 2);
				sngEast = sngEast - (2 * 2);
				break;
			case 7:
				sngSouth = sngSouth - (2 * 2);
				sngEast = sngEast - (0 * 2);
				break;
			case 8:
				sngSouth = sngSouth - (2 * 2);
				sngEast = sngEast - (1 * 2);
				break;
			case 9:
				sngSouth = sngSouth - (2 * 2);
				sngEast = sngEast - (2 * 2);
				break;
			default:
				errOutput = "Location not on an Atlas Sheet!";
				return false;

		}
		
		//calculate southerning and easting addition using 2nd digit, 3x3 rectangle.
		//increment is 2/3 minutes
		switch(parseInt(thirdSecondDigit)) {
			case 1:
				sngSouth = sngSouth - (0 * 2 / 3);
				sngEast = sngEast - (0 * 2 / 3);
				break;
			case 2:
				sngSouth = sngSouth - (0 * 2 / 3);
				sngEast = sngEast - (1 * 2 / 3);
				break;
			case 3:
				sngSouth = sngSouth - (0 * 2 / 3);
				sngEast = sngEast - (2 * 2 / 3);
				break;
			case 4:
				sngSouth = sngSouth - (1 * 2 / 3);
				sngEast = sngEast - (0 * 2 / 3);
				break;
			case 5:
				sngSouth = sngSouth - (1 * 2 / 3);
				sngEast = sngEast - (1 * 2 / 3);
				break;
			case 6:
				sngSouth = sngSouth - (1 * 2 / 3);
				sngEast = sngEast - (2 * 2 / 3);
				break;
			case 7:
				sngSouth = sngSouth - (2 * 2 / 3);
				sngEast = sngEast - (0 * 2 / 3);
				break;
			case 8:
				sngSouth = sngSouth - (2 * 2 / 3);
				sngEast = sngEast - (1 * 2 / 3);
				break;
			case 9:
				sngSouth = sngSouth - (2 * 2 / 3);
				sngEast = sngEast - (2 * 2 / 3);
				break;
			default:
				errOutput = "Location not on an Atlas Sheet!";
				return false;
		}
		
		//calculate southerning and easting addition using 3rd digit, 3x3 rectangle.
		//increment is 2/9 minutes
		switch (parseInt(thirdThirdDigit)) {
			case 1:
				sngSouth = sngSouth - (0 * 2 / 9) - (1 / 9);
				sngEast = sngEast - (0 * 2 / 9) - (1 / 9);
				break;
			case 2:
				sngSouth = sngSouth - (0 * 2 / 9) - (1 / 9);
				sngEast = sngEast - (1 * 2 / 9) - (1 / 9);
				break;
			case 3:
				sngSouth = sngSouth - (0 * 2 / 9) - (1 / 9);
				sngEast = sngEast - (2 * 2 / 9) - (1 / 9);
				break;
			case 4:
				sngSouth = sngSouth - (1 * 2 / 9) - (1 / 9);
				sngEast = sngEast - (0 * 2 / 9) - (1 / 9);
				break;
			case 5:
				sngSouth = sngSouth - (1 * 2 / 9) - (1 / 9);
				sngEast = sngEast - (1 * 2 / 9) - (1 / 9);
				break;
			case 6:
				sngSouth = sngSouth - (1 * 2 / 9) - (1 / 9);
				sngEast = sngEast - (2 * 2 / 9) - (1 / 9);
				break;
			case 7:
				sngSouth = sngSouth - (2 * 2 / 9) - (1 / 9);
				sngEast = sngEast - (0 * 2 / 9) - (1 / 9);
				break;
			case 8:
				sngSouth = sngSouth - (2 * 2 / 9) - (1 / 9);
				sngEast = sngEast - (1 * 2 / 9) - (1 / 9);
				break;
			case 9:
				sngSouth = sngSouth - (2 * 2 / 9) - (1 / 9);
				sngEast = sngEast - (2 * 2 / 9) - (1 / 9);
				break;
			default:
				errOutput = "Location not on an Atlas Sheet!";
				return false;
		}
		
			
		//Add easting and southerning to the northwest corner of the appropriate
		//atlas sheet. The northwest corner latitude and longitude is in minutes.
		switch(parseInt(first)) {
			case 21:
				sngSouth = sngSouth + 2484;
				sngEast = sngEast + 4512;
				break;
			case 22:
				sngSouth = sngSouth + 2484;
				sngEast = sngEast + 4486;
				break;
			case 23:
				sngSouth = sngSouth + 2484;
				sngEast = sngEast + 4460;
				break;
			case 24:
				sngSouth = sngSouth + 2456;
				sngEast = sngEast + 4512;
				break;
			case 25:
				sngSouth = sngSouth + 2456;
				sngEast = sngEast + 4486;
				break;
			case 26:
				sngSouth = sngSouth + 2456;
				sngEast = sngEast + 4460;
				break;
			case 27:
				sngSouth = sngSouth + 2428;
				sngEast = sngEast + 4512;
				break;
			case 28:
				sngSouth = sngSouth + 2428;
				sngEast = sngEast + 4486;
				break;
			case 29:
				sngSouth = sngSouth + 2428;
				sngEast = sngEast + 4460;
				break;
			case 30:
				sngSouth = sngSouth + 2400;
				sngEast = sngEast + 4538;
				break;
			case 31:
				sngSouth = sngSouth + 2400;
				sngEast = sngEast + 4512;
				break;
			case 32:
				sngSouth = sngSouth + 2400;
				sngEast = sngEast + 4486;
				break;
			case 33:
				sngSouth = sngSouth + 2400;
				sngEast = sngEast + 4460;
				break;
			case 34:
				sngSouth = sngSouth + 2372;
				sngEast = sngEast + 4538;
				break;
			case 35:
				sngSouth = sngSouth + 2372;
				sngEast = sngEast + 4512;
				break;
			case 36:
				sngSouth = sngSouth + 2372;
				sngEast = sngEast + 4486;
				break;
			case 37:
				sngSouth = sngSouth + 2344;
				sngEast = sngEast + 4500;
				break;
			default:
				errOutput = "Location not on an Atlas Sheet!";
				return false;
				
		}
		
		
		//Convert to decimal degrees
		var decLat = Number(sngSouth / 60).toFixed(NUM_TO_FIXED);
		var decLong = Number(sngEast / 60).toFixed(NUM_TO_FIXED);
		
		latDeg = decLat;
		lonDeg = decLong;
		
		/*
		if(causedErr == false)
			divDeg.innerHTML = "<strong>Decimal Degrees (NAD27): </strong>" + "Latitude: " + decLat + " " + "Longitude: -" + decLong;
		else 
			divDeg.innerHTML = "<strong>Decimal Degrees (NAD27): </strong>";
		*/
		
		//Convert to ddmmss.ss
		var degLatD = ~~(decLat);

		var degLatM = ~~((decLat - (~~(decLat))) * 60);//bitwise calc to get the whole number
		var degLatS = (((decLat - (~~(decLat))) * 60) - degLatM) * 60;//bitwise calc to get the whole number
		
		var degLonD = ~~(decLong);
		var degLonM = ~~((decLong - (~~(decLong))) * 60);//bitwise calc to get the whole number
		var degLonS = (((decLong - (~~(decLong))) * 60) - degLonM) * 60;//bitwise calc to get the whole number
		
		degLatS = Number(degLatS).toFixed(2);
		degLonS = Number(degLonS).toFixed(2);

		//Fix numbers under 10 without leading 0
		if(degLatM < 10)
		{
			degLatM = "" + degLatM;
			degLatM = "0" + degLatM;
		}
		if(degLatS < 10)
		{
			degLatS = "" + degLatS;
			degLatS = "0" + degLatS;
		}
		if(degLonM < 10)
		{
			degLonM = "" + degLonM;
			degLonM = "0" + degLonM;
		}
		if(degLonS < 10)
		{
			degLonS = "" + degLonS;
			degLonS = "0" + degLonS;
		}	
	
		latDMS = degLatD + "" + degLatM + "" + degLatS + "";
		lonDMS = degLonD + "" + degLonM + "" + degLonS + "";
		/*
		if(causedErr == false)
			divDMS.innerHTML = "<strong>ddmmss.ss (NAD27):</strong>" + "Latitude: " + degLatD + "" + degLatM + "" + degLatS + " Longitude: -" + degLonD + "" + degLonM + "" + degLonS + "";
		else 
			divDMS.innerHTML = "<strong>ddmmss.ss (NAD27):</strong>";
	
		*/
		/*
		var quad = (findQuad(Number("" + degLatD + degLatM + degLatS), Number("" + degLonD + degLonM + degLonS)));
		//console.log(findQuad(Number("" + degLatD + degLatM + degLatS), Number("" + degLonD + degLonM + degLonS)));
		//var quad = (findQuad(400353, 743953));

		if(causedErr == false)
			divQuad.innerHTML = "<strong>USGS Quadrangle: </strong>" + quad;
		*/
		
		return true;
} 

function checkDMS(latDD, lonDD)
{
	if(latDD.length != NUM_DECIMALS_LENGTH || lonDD.length != NUM_DECIMALS_LENGTH)
	{
		errOutput = "Those coordinates are invalid.";
		return false;
	}
	
	else if(isNaN(latDD) || isNaN(lonDD))
	{
		errOutput = "Only numbers allowed.";
		return false;
	}
	
	return true;

}

function checkDeg(lat, lon)
{
	lat = "" + lat;
	lon = "" + lon;
	if(lat == "" || lon == "")
	{
		return false;
	}

	if(isNaN(lat) || isNaN(lon))
	{
		errOutput = "Only numbers allowed.";
		return false;
	}
	
	return true;

}

function latConversion(latDeg, latMin, latSec, lonDeg, lonMin, lonSec)
{
	
	//Calculate the southerning and easting in minutes
    var sngSouth = (latDeg * 60) + latMin + (latSec / 60)
    var sngEast = (lonDeg * 60) + lonMin + (lonSec / 60)

	var strSheet;
	var block;
	var square;
	
	//The southerning and easting are compared to the range of latitude and
	//longitude covered by each of the atlas sheets. For the appropriate atlas
	//sheet, the southerning and easting are subtracted from the latitude and
	//longitude of the northwest corner of the atlas sheet. The new values of
	//southerning and easting are the number of minutes south and east of the
	//northwest corner of the atlas sheet.
	if (sngSouth <= 2484 && sngSouth > 2456 && sngEast <= 4512 && sngEast > 4486 ) {
		strSheet = 21;
		sngSouth = 2484 - sngSouth;
		sngEast = 4512 - sngEast;
	}
	if (sngSouth <= 2484 && sngSouth > 2456 && sngEast <= 4486 && sngEast > 4460 ) {
		strSheet = 22;
		sngSouth = 2484 - sngSouth;
		sngEast = 4486 - sngEast;
	}
	if  (sngSouth <= 2484 && sngSouth > 2456 && sngEast <= 4460 && sngEast > 4434 ) {
		strSheet = 23;
		sngSouth = 2484 - sngSouth;
		sngEast = 4460 - sngEast;
	}
	if  (sngSouth <= 2456 && sngSouth > 2428 && sngEast <= 4512.3 && sngEast > 4486 ) {
		strSheet = 24;
		sngSouth = 2456 - sngSouth;
		sngEast = 4512 - sngEast;
			if (sngEast < 0 ) {
				sngEast = 0;
			}
	}
	if( sngSouth <= 2456 && sngSouth > 2428 && sngEast <= 4486 && sngEast > 4460 ) {
		strSheet = 25;
		sngSouth = 2456 - sngSouth;
		sngEast = 4486 - sngEast;
	}
	if( sngSouth <= 2456 && sngSouth > 2428 && sngEast <= 4460 && sngEast > 4434 ) {
		strSheet = 26;
		sngSouth = 2456 - sngSouth;
		sngEast = 4460 - sngEast;
	}
	if( sngSouth <= 2428 && sngSouth > 2400 && sngEast <= 4512 && sngEast > 4486 ) {
		strSheet = 27;
		sngSouth = 2428 - sngSouth;
		sngEast = 4512 - sngEast;
	}
	if( sngSouth <= 2428 && sngSouth > 2400 && sngEast <= 4486 && sngEast > 4460 ) {
		strSheet = 28;
		sngSouth = 2428 - sngSouth;
		sngEast = 4486 - sngEast;
	}
	if( sngSouth <= 2428 && sngSouth > 2400 && sngEast <= 4460 && sngEast > 4434 ) {
		strSheet = 29;
		sngSouth = 2428 - sngSouth;
		sngEast = 4460 - sngEast;
	}
	if( sngSouth <= 2400 && sngSouth > 2372 && sngEast <= 4538 && sngEast > 4512 ) {
		strSheet = 30;
		sngSouth = 2400 - sngSouth;
		sngEast = 4538 - sngEast;
	}
	if( sngSouth <= 2400 && sngSouth > 2372 && sngEast <= 4512 && sngEast > 4486 ) {
		strSheet = 31;
		sngSouth = 2400 - sngSouth;
		sngEast = 4512 - sngEast;
	}
	if( sngSouth <= 2400 && sngSouth > 2372 && sngEast <= 4486 && sngEast > 4460 ) {
		strSheet = 32;
		sngSouth = 2400 - sngSouth;
		sngEast = 4486 - sngEast;
	}
	if( sngSouth <= 2400 && sngSouth > 2372 && sngEast <= 4460 && sngEast > 4434 ) {
		strSheet = 33;
		sngSouth = 2400 - sngSouth;
		sngEast = 4460 - sngEast;
	}
	if( sngSouth <= 2372 && sngSouth > 2344 && sngEast <= 4538 && sngEast > 4512 ) {
		strSheet = 34;
		sngSouth = 2372 - sngSouth;
		sngEast = 4538 - sngEast;
	}
	if( sngSouth <= 2372 && sngSouth > 2344 && sngEast <= 4512 && sngEast > 4486 ) {
		strSheet = 35;
		sngSouth = 2372 - sngSouth;
		sngEast = 4512 - sngEast;
	}
	if( sngSouth <= 2372 && sngSouth > 2344 && sngEast <= 4486 && sngEast > 4452 ) {
		strSheet = 36;
		sngSouth = 2372 - sngSouth;
		sngEast = 4486 - sngEast;
	}
	if( sngSouth <= 2344 && sngSouth > 2332 && sngEast <= 4500 && sngEast > 4474 ) {
		strSheet = 37;
		sngSouth = 2344 - sngSouth;
		sngEast = 4500 - sngEast;
	}
	if( strSheet === "" ) {
		errOutput = "Coordinate entered is not valid.";
		return false;
		//console.log("None");//TODO: make this do someting with err
	}

	atlasSh = strSheet;
	//Block coordinates are found by dividing the southerning and easting by
	//6-minutes (size of blocks) and recording integer value of the quotient.
	//The decimal portion of the quotient is the new southerning and easting.
	//These are the number of minutes south and east of the northwest corner
	//of the block.

	//block coordinate calculation
	var secondFirstDigit = ~~(sngSouth / 6);
	var secondSecondDigit = ~~(sngEast / 6) + 1;
	atlasBl = "" + secondFirstDigit + "" + secondSecondDigit;

	//minutes south of the block's NW corner
	sngSouth = ((sngSouth / 6) - ~~(sngSouth / 6)) * 6;
	//minutes east of the block's NW corner
	sngEast = ((sngEast / 6) - ~~(sngEast / 6)) * 6;
	
	var intR1, intR2, intR3;

	//The first 3x3 rectangle coordinate is found by determining what
	//2-minute by 2-minute interval the southerning and easting lie.

	if( sngSouth < 2 && sngSouth >= 0 && sngEast < 2 && sngEast >= 0 ) {
		intR1 = 1;
	}
	if( sngSouth < 2 && sngSouth >= 0 && sngEast < 4 && sngEast >= 2 ) {
		intR1 = 2;
	}
	if( sngSouth < 2 && sngSouth >= 0 && sngEast < 6 && sngEast >= 4 ) {
		intR1 = 3;
	}
	if( sngSouth < 4 && sngSouth >= 2 && sngEast < 2 && sngEast >= 0 ) {
		intR1 = 4;
	}
	if( sngSouth < 4 && sngSouth >= 2 && sngEast < 4 && sngEast >= 2 ) {
		intR1 = 5;
	}
	if( sngSouth < 4 && sngSouth >= 2 && sngEast < 6 && sngEast >= 4 ) {
		intR1 = 6;
	}
	if( sngSouth < 6 && sngSouth >= 4 && sngEast < 2 && sngEast >= 0 ) {
		intR1 = 7;
	}
	if( sngSouth < 6 && sngSouth >= 4 && sngEast < 4 && sngEast >= 2 ) {
		intR1 = 8;
	}
	if( sngSouth < 6 && sngSouth >= 4 && sngEast < 6 && sngEast >= 4 ) {
		intR1 = 9;
	}
			
	//The southerning and easting are divided by 2 minutes and the decimal
	//portion of the quotient is used to calculate a new southerning and
	//easting. These are now the number of minutes from the northwest corner
	//of the given 2-minute by 2-minute rectangle.

	//minutes south of rectangle NW corner
	sngSouth = ((sngSouth / 2) - ~~(sngSouth / 2)) * 2;
	//minutes east of rectangle NW corner
	sngEast = ((sngEast / 2) - ~~(sngEast / 2)) * 2;

	//the second 3x3 rectangle coordinate is found by determining what
	//two-thirds minute by two-thirds minute interval the southerning
	//and easting lie

	if( sngSouth < 2 / 3 && sngSouth >= 0 && sngEast < 2 / 3 && sngEast >= 0 ) {
		intR2 = 1;
	}
	if( sngSouth < 2 / 3 && sngSouth >= 0 && sngEast < 4 / 3 && sngEast >= 2 / 3 ) {
		intR2 = 2;
	}
	if( sngSouth < 2 / 3 && sngSouth >= 0 && sngEast < 6 / 3 && sngEast >= 4 / 3 ) {
		intR2 = 3;
	}
	if( sngSouth < 4 / 3 && sngSouth >= 2 / 3 && sngEast < 2 / 3 && sngEast >= 0 ) {
		intR2 = 4;
	}
	if( sngSouth < 4 / 3 && sngSouth >= 2 / 3 && sngEast < 4 / 3 && sngEast >= 2 / 3 ) {
		intR2 = 5;
	}
	if( sngSouth < 4 / 3 && sngSouth >= 2 / 3 && sngEast < 6 / 3 && sngEast >= 4 / 3 ) {
		intR2 = 6;
	}
	if( sngSouth < 6 / 3 && sngSouth >= 4 / 3 && sngEast < 2 / 3 && sngEast >= 0 ) {
		intR2 = 7;
	}
	if( sngSouth < 6 / 3 && sngSouth >= 4 / 3 && sngEast < 4 / 3 && sngEast >= 2 / 3 ) {
		intR2 = 8;
	}
	if( sngSouth < 6 / 3 && sngSouth >= 4 / 3 && sngEast < 6 / 3 && sngEast >= 4 / 3 ) {
		intR2 = 9;
	}

	//The southerning and easting are divided by two-thirds and the decimal
	//portion of the quotient is used to calculate a new southerning and
	//easting. These are now the number of minutes from the northwest corner
	//of the given two-thirds minute by two-thirds minute rectangle.

	sngSouth = ((sngSouth / (2 / 3)) - ~~(sngSouth / (2 / 3))) * (2 / 3);
	sngEast = ((sngEast / (2 / 3)) - ~~(sngEast / (2 / 3))) * (2 / 3);

	//The third 3x3 rectangle coordinate is found by determining what
	//two-ninths minute by two-ninths minute interval the southerning
	//and easting lie.

	if( sngSouth < 2 / 9 && sngSouth >= 0 && sngEast < 2 / 9 && sngEast >= 0 ) {
		intR3 = 1;
	}
	if( sngSouth < 2 / 9 && sngSouth >= 0 && sngEast < 4 / 9 && sngEast >= 2 / 9 ) {
		intR3 = 2;
	}
	if( sngSouth < 2 / 9 && sngSouth >= 0 && sngEast < 6 / 9 && sngEast >= 4 / 9 ) {
		intR3 = 3;
	}
	if( sngSouth < 4 / 9 && sngSouth >= 2 / 9 && sngEast < 2 / 9 && sngEast >= 0 ) {
		intR3 = 4;
	}
	if( sngSouth < 4 / 9 && sngSouth >= 2 / 9 && sngEast < 4 / 9 && sngEast >= 2 / 9 ) {
		intR3 = 5;
	}
	if( sngSouth < 4 / 9 && sngSouth >= 2 / 9 && sngEast < 6 / 9 && sngEast >= 4 / 9 ) {
		intR3 = 6;
	}
	if( sngSouth < 6 / 9 && sngSouth >= 4 / 9 && sngEast < 2 / 9 && sngEast >= 0 ) {
		intR3 = 7;
	}
	if( sngSouth < 6 / 9 && sngSouth >= 4 / 9 && sngEast < 4 / 9 && sngEast >= 2 / 9 ) {
		intR3 = 8;
	}
	if( sngSouth < 6 / 9 && sngSouth >= 4 / 9 && sngEast < 6 / 9 && sngEast >= 4 / 9 ) {
		intR3 = 9;
	}

	atlasSq = "" + intR1 + "" + intR2  + "" + intR3;
	
	return true;
}

//Legacy function, should use the individual ones.
function degToDMS(latDeg, lonDeg)
{
	//latitude
	var ddLat = ~~(latDeg);
	var mmLat = ~~((latDeg - ddLat) * 60);
	var ssLat = ~~((((latDeg - ddLat) * 60) - mmLat) * 60);
	
	
	//formatting
	if(ssLat <= -0.01)
	{
		mmlat = mmLat - 1;
		ssLat = ssLat + 60;
	}
	if( ssLat >= 60 )
	{
        mmLat = mmLat + 1;
        ssLat = ssLat - 60;
    }
    
    if( mmLat >= 60 )
	{
        ddLat = ddLat + 1;
        mmLat = mmLat - 60;
    }
	
	//Format minutes and seconds to display properly when < 10
    if( mmLat < 10 )
	{
		mmLat = "" + mmLat;
        mmLat = "0" + mmLat;
	}
    else
	{
        mmLat = "" + mmLat;
    }

    if( ssLat < 10 )
	{
		ssLat = "" + ssLat;
        ssLat = "0" + ssLat;
    }
	else
	{
        ssLat = "" + ssLat;
	}	
	
	//Longitude
    var ddLon = ~~(lonDeg);
    var mmLon = ~~((lonDeg - ddLon) * 60);
    var ssLon = ~~((((lonDeg - ddLon) * 60) - mmLon) * 60);
      
    if(ssLon <= -0.01)
	{
        mmLon = mmLon - 1;
        ssLon = ssLon + 60;
    }
    
    if( ssLon >= 60 )
	{
        mmLon = mmLon + 1;
        ssLon = ssLon - 60;
    }
    
    if( mmLon >= 60 )
	{
        ddLon = ddLon + 1;
        mmLon = mmLon - 60;
	}
    
	//Format minutes and seconds to display properly when < 10
    if( mmLon < 10 )
	{
		mmLon = "" + mmLon;
        mmLon = "0" + mmLon;
    }
	else
	{
        mmLon = "" + mmLon;
    }

    if( ssLon < 10 )
	{
		ssLon = "" + ssLon;
        ssLon = "0" + ssLon;
    }
	else
	{
        ssLon = "" + ssLon;
    }
        
	//copy values to output vars
	degDMSLat = "" + ddLat + mmLat + ssLat;
	degDMSLon = "" + ddLon + mmLon + ssLon;
	
	if(degDMSLat != null && degDMSLon != null)
	{
		return true;
	}
	else 
	{
		errOutput = "There was an input error.";
		return false;
	}
	

}

function degToDMSLat(latDeg)
{
	//latitude
	var ddLat = ~~(latDeg);
	var mmLat = ~~((latDeg - ddLat) * 60);
	var ssLat = ~~((((latDeg - ddLat) * 60) - mmLat) * 60);
	
	
	//formatting
	if(ssLat <= -0.01)
	{
		mmlat = mmLat - 1;
		ssLat = ssLat + 60;
	}
	if( ssLat >= 60 )
	{
        mmLat = mmLat + 1;
        ssLat = ssLat - 60;
    }
    
    if( mmLat >= 60 )
	{
        ddLat = ddLat + 1;
        mmLat = mmLat - 60;
    }
	
	//Format minutes and seconds to display properly when < 10
    if( mmLat < 10 )
	{
		mmLat = "" + mmLat;
        mmLat = "0" + mmLat;
	}
    else
	{
        mmLat = "" + mmLat;
    }

    if( ssLat < 10 )
	{
		ssLat = "" + ssLat;
        ssLat = "0" + ssLat;
    }
	else
	{
        ssLat = "" + ssLat;
	}	
	
	return "" + ddLat + mmLat + ssLat;
}

function degToDMSLon(lonDeg)
{
	//Longitude
    var ddLon = ~~(lonDeg);
    var mmLon = ~~((lonDeg - ddLon) * 60);
    var ssLon = ~~((((lonDeg - ddLon) * 60) - mmLon) * 60);
      
    if(ssLon <= -0.01)
	{
        mmLon = mmLon - 1;
        ssLon = ssLon + 60;
    }
    
    if( ssLon >= 60 )
	{
        mmLon = mmLon + 1;
        ssLon = ssLon - 60;
    }
    
    if( mmLon >= 60 )
	{
        ddLon = ddLon + 1;
        mmLon = mmLon - 60;
	}
    
	//Format minutes and seconds to display properly when < 10
    if( mmLon < 10 )
	{
		mmLon = "" + mmLon;
        mmLon = "0" + mmLon;
    }
	else
	{
        mmLon = "" + mmLon;
    }

    if( ssLon < 10 )
	{
		ssLon = "" + ssLon;
        ssLon = "0" + ssLon;
    }
	else
	{
        ssLon = "" + ssLon;
    }
	
	return "" + ddLon + mmLon + ssLon;

}


//This is how functions should be.
function dmsToDegLat(dd, mm, ss)
{
	
	dd = Number(dd);
	mmLat = Number(mm) / 60;
	ssLat = Number(ss) / 3600;
	
	dmsDegLat = dd + mmLat + ssLat;
	
	return dmsDegLat;
}

function dmsToDegLon(dd, mm, ss)
{

	dd = Number(dd);
	mmLon = Number(mm) / 60;
	ssLon = Number(ss) / 3600;
	
	dmsDegLon = dd + mmLon + ssLon;
	
	return dmsDegLon;

}
