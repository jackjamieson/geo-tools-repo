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
var station, inplat, inplon, note;

var kmlDoc = '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">'
+ '<Document>';

var kmlEndDoc = '</Folder></Document></kml>';

var kmlPlacemarkStart = '<Folder><name>' + $('#name').val() + ' Placemarks </name>';
var kmlPlacemark = '';


// conversion from rad to deg
if (typeof Number.prototype.toRadians == 'undefined') {
    Number.prototype.toRadians = function() { return this * Math.PI / 180; }
}

if (typeof Number.prototype.toDegrees == 'undefined') {
    Number.prototype.toDegrees = function() { return this * 180 / Math.PI; }
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

            generateKMLPlacemarks(lineArr);

        }
    }

    console.log(lineArr);
    return kmlDoc + kmlPlacemarkStart + kmlPlacemark + kmlEndDoc;

}


function generateKMLPlacemarks(lineArray)
{

    kmlPlacemark += ''
    + '<Placemark>'
    + '<name>' + lineArray[0] + '</name>'
    + '<description>' + lineArray[3] + '</description>'
    + '<Point>'
    + '<altitudeMode>relativeToGround</altitudeMode>'
    + '<coordinates>' + lineArray[1] + "," + lineArray[2] + "," + '0' + '</coordinates></Point>'
    + '</Placemark>';


}

//click the generate button
$('#generate').click(function() {


    if($('#name').val().length < 1)
    {
        $('#name').val('fractures');
        kmlPlacemark = "";

    }

    kmlPlacemarkStart = '<Folder><name>' + $('#name').val() + ' Placemarks </name>';

    var kmlString = readInput();

    console.log(kmlString);
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
