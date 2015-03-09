//symbol key
var BEDDING = 0;
var CLEAVAGE = 1;
var LAYERING = 2;
var JOINT = 3;
var ARROW = 4;
var LINEATION = 5;
var CIRCLE = 6;

//circle colors
var WHITE = 0;
var BLACK = 1;
var RED = 2;
var GREEN = 3;
var BLUE = 4;
var LBLUE = 5;
var PINK = 6;
var NOCOLOR = 7;

//anno spacing factor
var twoDbl = 3;//2d for bed and layer
var twoDjasc = 9;//2d for joint, arrow, slip, circle



var LAT = 0.0000090;
var LON = 0.0000147;

//input vars
var station, inplat, inplon, alt, azi, dip, xscale, yscale, zscale, symbol, note, color;

var kmlDoc = '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">'
+ '<Document>'
+ '<Style id="sn_noicon"><IconStyle><Icon></Icon></IconStyle><ListStyle></ListStyle></Style>';

var kmlEndDoc = '</Folder></Document></kml>';

var kmlModelStart = '<Folder><name>' + $('#name').val() + 'structures </name>';
var kmlModel = '';
var kmlModelEnd = '</Folder>';

var kmlPlacemarkStart = '<Folder><name>' + $('#name').val() + 'annos </name>';
var kmlPlacemark = '';


// conversion from rad to deg
if (typeof Number.prototype.toRadians == 'undefined') {
    Number.prototype.toRadians = function() { return this * Math.PI / 180; }
}

if (typeof Number.prototype.toDegrees == 'undefined') {
    Number.prototype.toDegrees = function() { return this * 180 / Math.PI; }
}

//calculate the dae file to use
function findColor(colorNum)
{

    //var notACircle = findSymbol(
    switch(colorNum)
    {
        case 0:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/5-m-Wcircle.dae";
        case 1:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/5-m-BLcircle.dae";
        case 2:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/5-m-Rcircle.dae";
        case 3:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/5-m-Gcircle.dae";
        case 4:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/5-m-Bcircle.dae";
        case 5:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/5-m-LBcircle.dae";
        case 6:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/5-m-Pcircle.dae";
        default:
            return "";

    }

}

//calculate the dae file to use
function findSymbol(symbolNum)
{
    //This was for the previous version, keeping it just in case.
    /*
    switch(symbolNum)
    {
        case 0:
            return "bed.dae";
        case 1:
            return "cleavage.dae";
        case 2:
            return "layer.dae";
        case 3:
            return "joint.dae";
        case 4:
            return "arrow.dae";
        case 5:
            return "slip.dae";
        case 6:
            return "circle";
        case 10:
            return "bed.dae";
        case 11:
            return "cleavage.dae";
        case 12:
            return "layer.dae";
        case 13:
            return "joint.dae";
        case 14:
            return "arrow.dae";
        case 15:
            return "slip.dae";
        default:
            return "";

    }
    */



}

function findNotCircleSymbol(symbolNum)
{

    switch(symbolNum)
    {
        case 0:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/bed.dae";
        case 1:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/cleavage.dae";
        case 2:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/layer.dae";
        case 3:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/joint.dae";
        case 4:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/arrow.dae";
        case 5:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/slip.dae";
        case 10:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/bed-white.dae";
        case 11:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/cleavage-white.dae";
        case 12:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/layer-white.dae";
        case 13:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/joint-white.dae";
        case 14:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/arrow-white.dae";
        case 15:
            return "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/slip-white.dae";
        default:
            return "";

    }

}

//calculate delta x
function findDelX(lineArray)
{
    var azimuth = lineArray[4];
    azimuth = Number(azimuth);

    if(Number(lineArray[9]) < 3)
    {
        return twoDbl * lineArray[6] * Math.sin(azimuth.toRadians());
    }
    else if(Number(lineArray[9]) == 3)
    {
        return twoDjasc * lineArray[6] * Math.sin((azimuth + 90).toRadians());
    }
    else{
        return (twoDjasc * lineArray[6] * Math.sin(azimuth.toRadians()));
    }
}

//calculate delta y
function findDelY(lineArray)
{
    var azimuth = lineArray[4];
    azimuth = Number(azimuth);

    if(Number(lineArray[9]) < 3)
    {
        return twoDbl * lineArray[6] * Math.cos(azimuth.toRadians());
    }
    else if(Number(lineArray[9]) == 3)
    {
        return twoDjasc * lineArray[6] * Math.cos((azimuth + 90).toRadians());
    }
    else{
        return (twoDjasc * lineArray[6] * Math.cos(azimuth.toRadians()));
    }
}

//calculate delta long
function findDelLong(deltax)
{
    return LON * deltax;
}

//calculate delta lat
function findDelLat(deltay)
{
    return LAT * deltay;
}

//calculate label lat
function findLabelLat(deltaLat, lineArray)
{
    return Number(lineArray[2]) + deltaLat;
}

//calculate label long
function findLabelLong(deltaLong, lineArray)
{
    return Number(lineArray[1]) + deltaLong;
}

//read the input from the box
function readInput()
{
    var lines = $('#excel').val();
    var lineArr = [];

    lines = lines.split('\n');
    for(var i = 0;i < lines.length;i++){
        lineArr.length = 0;

        var singleLine = lines[i].split('\t');
        for(var m = 0; m < singleLine.length; m++)
        {

            lineArr.push(singleLine[m]);
        }

        if(lineArr.length > 1)
        {

            var calc = calcInput(lineArr);
            generateKMLModel(lineArr, calc);
            generateKMLPlacemarks(lineArr, calc);

        }
        //console.log(lineArr);
    }

    return kmlDoc + kmlModelStart + kmlModel + kmlModelEnd + kmlPlacemarkStart + kmlPlacemark + kmlEndDoc;

}

//put the calculations together
function calcInput(lineArray)
{

    var file = lineArray[9];
    //var symbol = findSymbol((lineArray[9]));

    //if the symbol is not a circle check to see which 2d symbol it should be
    /*if(symbol != "circle")
    {
        file = findNotCircleSymbol(Number(lineArray[9]));
    }
    else{

        file = findColor(Number(lineArray[11]));

    }*/

    var del_x = findDelX(lineArray);
    var del_y = findDelY(lineArray);
    var del_lon = findDelLong(del_x);
    var del_lat = findDelLat(del_y);
    var label_lat = findLabelLat(del_lat, lineArray);
    var label_lon = findLabelLong(del_lon, lineArray);

    //console.log(file + " " + del_x);
    //return object containing calculations
    var calculated = {
        file:  file,
        del_x: del_x,
        del_y: del_y,
        del_lon: del_lon,
        del_lat: del_lat,
        label_lat: label_lat,
        label_lon: label_lon,
        symbol: symbol
    };

    //console.log(calculated.symbol);

    return calculated;
}

function generateKMLModel(lineArray, calculated)
{
    //formatting for dip/dipazimuth
    var dipF = Math.floor(lineArray[5]);
    var dipAzF = Math.floor(lineArray[4]);
    if(dipF.length == 1)
    {
        dipF = "0" + dipF.toString();
    }
    if(dipAzF.length == 2)
    {
        dipF = "0" + dipF.toString();
    }
    if(dipAzF.length == 1)
    {
        dipF = "00" + dipF.toString();
    }

    var orient;
    if(Number(lineArray[9] < 6))
        orient = 0;
    else orient = dipF;

    kmlModel += ''
    + '\n<Placemark>'
    + '\n<name>' +	lineArray[10] + " " + dipF + "/" + dipAzF +	'</name>'
    + '\n<LookAt>'
    + '\n<longitude>'	+ lineArray[1] + '</longitude>'
    + '\n<latitude>'	+ lineArray[2] + '</latitude>'
    + '\n<altitude>0</altitude>'
    + '\n<heading>0</heading>'
    + '\n<tilt>0</tilt>'
    + '\n<range>7</range></LookAt>'
    + '\n<Model id="	model_1	">'
    + '\n<altitudeMode>relativeToGround</altitudeMode>'
    + '\n<Location>'
    + '\n<longitude>' + lineArray[1] + '</longitude>'
    + '\n<latitude>'	+ lineArray[2]+	'</latitude>'
    + '\n<altitude>' + lineArray[3]+	'</altitude></Location>'
    + '\n<Orientation>'
    + '\n<heading>' +	dipAzF	+'</heading>'
    + '\n<tilt>' +	orient	+'</tilt>'
    + '\n<roll>0</roll></Orientation>'
    + '\n<Scale>'
    + '\n<x>' +lineArray[6] + '</x>'
    + '\n<y>'	+ lineArray[7] +	'</y>'
    + '\n<z>'	+ lineArray[8] +	'</z></Scale>'
    + '\n<Link>'
    + '\n<href>' + calculated.file + '</href>'
    + '\n</Link>'
    + '</Model></Placemark>';


}

function generateKMLPlacemarks(lineArray, calculated)
{

    var dipF = Math.floor(lineArray[5]);
    var dipAzF = Math.floor(lineArray[4]);
    if(dipF.length == 1)
    {
        dipF = "0" + dipF.toString();
    }
    if(dipAzF.length == 2)
    {
        dipF = "0" + dipF.toString();
    }
    if(dipAzF.length == 1)
    {
        dipF = "00" + dipF.toString();
    }

    kmlPlacemark += ''
    + '<Placemark>'
    + '<name>' + dipF + "/" + dipAzF + '</name>'
    + '<styleUrl>#sn_noicon</styleUrl>'
    + '<Point>'
    + '<altitudeMode>relativeToGround</altitudeMode>'
    + '<coordinates>' + calculated.label_lon + "," + calculated.label_lat + "," + lineArray[3] + '</coordinates></Point>'
    + '</Placemark>';


}

//click the generate button
$('#generate').click(function() {


    if($('#td1').val().length >= 1)
    {
        twoDbl = $('#td1').val();
        kmlPlacemark = "";
    }

    if($('#td2').val().length >= 1)
    {
        twoDjasc = $('#td2').val();
        kmlPlacemark = "";

    }

    if($('#name').val().length < 1)
    {
        $('#name').val('fractures');
        kmlPlacemark = "";

    }

    kmlModelStart = '<Folder><name>' + $('#name').val() + ' structures </name>';
    kmlPlacemarkStart = '<Folder><name>' + $('#name').val() + ' annos </name>';

    var kmlString = readInput();
    //console.log(kmlString);
    var outputName = $('#name').val() + ".kml";
    document.getElementById('generate').download = outputName.toString();

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


    this.href = makeTextFile(kmlString);

    //rese the placemark and model so we don't duplicate on extra runs
    kmlPlacemark = '';
    kmlModel = '';

});

//on enter, click the generate button
$('#excel').keypress(function (e) {
    if (e.which == 13) {
        $( "#generate" ).trigger( "click" );
    }
});
