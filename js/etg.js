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
function findSymbol(symbolNum)
{



}

//The new file finding function, previous three were for a different version
function findPremadeSymbol(name) {

    if(name === 'bed.dae' || name === 'bed-white.dae')
        return true;
    if(name === 'layer.dae' || name === 'layer-white.dae')
        return true;
    if(name === 'cleavage.dae' || name === 'cleavage-white.dae')
        return true;
    if(name === 'cleavage2.dae' || name === 'cleavage2-white.dae')
        return true;
    if(name === 'joint.dae' || name === 'joint-white.dae')
        return true;
    if(name === 'fault.dae' || name === 'fault-white.dae')
        return true;
    if(name === 'arrow.dae' || name === 'arrow-white.dae')
        return true;
    if(name === 'slip.dae' || name === 'slip-white.dae')
        return true;
    if(name === '30m-rocket.dae' || name === '60m-P-axis.dae')
        return true;
    if(name === '5-m-Wcircle.dae' || name === '5-m-Ocircle.dae')
        return true;
    if(name === '5-m-Bcircle.dae' || name === '5-m-Pcircle.dae')
        return true;
    if(name === '5-m-LBcircle.dae' || name === '5-m-Rcircle.dae')
        return true;
    if(name === '5-m-Gcircle.dae' || name === '5-m-BLcircle.dae')
        return true;

    return false;

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
    var file;

    if(findPremadeSymbol(lineArray[9]))
        file = "https://dl.dropboxusercontent.com/u/89445333/GEsymbols/" + lineArray[9];
    else file = lineArray[9];

    var del_x = findDelX(lineArray);
    var del_y = findDelY(lineArray);
    var del_lon = findDelLong(del_x);
    var del_lat = findDelLat(del_y);
    var label_lat = findLabelLat(del_lat, lineArray);
    var label_lon = findLabelLong(del_lon, lineArray);

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

    // if the symbol is 2d make the tilt 0
    var orient;
    var text = lineArray[11].toUpperCase();

    if(text === "2D")
        orient = 0;
    else orient = dipF;

    var atLeastOneIsChecked = $('input[name="time"]:checked').length > 0;
    if(atLeastOneIsChecked){
        kmlModel += ''
        + '\n<Placemark>'
        + '\n<gx:TimeStamp><when>' + lineArray[12] + 'T' + lineArray[13] + 'Z</when></gx:TimeStamp>'
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
    else {
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

    var atLeastOneIsChecked = $('input[name="time"]:checked').length > 0;

    if(atLeastOneIsChecked){
        kmlPlacemark += ''
        + '<Placemark>'
        + '<gx:TimeStamp><when>' + lineArray[12] + 'T' + lineArray[13] + 'Z</when></gx:TimeStamp>'
        + '<name>' + dipF + "/" + dipAzF + '</name>'
        + '<styleUrl>#sn_noicon</styleUrl>'
        + '<Point>'
        + '<altitudeMode>relativeToGround</altitudeMode>'
        + '<coordinates>' + calculated.label_lon + "," + calculated.label_lat + "," + lineArray[3] + '</coordinates></Point>'
        + '</Placemark>';
    }
    else {
        kmlPlacemark += ''
        + '<Placemark>'
        + '<name>' + dipF + "/" + dipAzF + '</name>'
        + '<styleUrl>#sn_noicon</styleUrl>'
        + '<Point>'
        + '<altitudeMode>relativeToGround</altitudeMode>'
        + '<coordinates>' + calculated.label_lon + "," + calculated.label_lat + "," + lineArray[3] + '</coordinates></Point>'
        + '</Placemark>';
    }



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
