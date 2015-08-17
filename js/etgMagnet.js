
//input vars
var station, inplat, inplon, note;

var kmlDoc = '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">'
+ '<Document>';

var kmlEndDoc = '</Folder></Document></kml>';

var kmlPlacemarkStart = '<Folder><name>' + $('#name').val() + ' Placemarks </name>';
var kmlPlacemark = '';

var pointCount = 0;

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
    pointCount = 0;
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
            pointCount++;
            generateKMLPlacemarks(lineArr);

        }
    }

    console.log(lineArr);
    return kmlDoc + kmlPlacemarkStart + kmlPlacemark + kmlEndDoc;

}


function generateKMLPlacemarks(lineArr)
{
    var color = "ff00aa00";
    if(lineArr[8].indexOf("GR") > 0){
        color = "ff00aa00";
    }
    if(lineArr[8].indexOf("LY") > 0){
        color = "ff7fffff";
    }
    if(lineArr[8].indexOf("DY") > 0){
        color = "ff00d5d5";
    }
    if(lineArr[8].indexOf("LO") > 0){
        color = "ff00aaff";
    }
    if(lineArr[8].indexOf("DO") > 0){
        color = "ff0055ff";
    }
    if(lineArr[8].indexOf("RE") > 0){
        color = "ff0000ff";
    }
    if(lineArr[8].indexOf("VI") > 0){
        color = "ff000055";
    }

    kmlPlacemark += ''
    + '<Placemark>'
    + '<name>' + pointCount + '</name>'
    + '<description>' + 'Horizontal: ' + lineArr[3] + '\nTotal Field: ' + lineArr[4] + '\nAverage: ' + lineArr[5] + '\nThreshold: ' + lineArr[6] + '\nTime: ' + lineArr[7] +'</description>'
    + '<Point>'
    + '<altitudeMode>relativeToGround</altitudeMode>'
    + '<coordinates>' + lineArr[10] + "," + lineArr[9] + "," + '0' + '</coordinates></Point>'
    + '<Style><IconStyle><color>' + color + '</color><scale>1.1</scale><Icon><href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href></Icon></IconStyle></Style>'
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
