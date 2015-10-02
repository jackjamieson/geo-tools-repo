//input vars for stations
var topleftlat, topleftlon, botrightlat, botrightlon;
var inputText;
var finalPlacemarks = [];

init();


//Read the file from the user
function readSingleFile(evt) {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {


        //Retrieve the first (and only!) File from the FileList object
        var f = evt.target.files[0];

        if (f) {
            var r = new FileReader();
            r.onload = function (e) {
                reset();
                inputText = e.target.result; //copy the file into a local var
                //console.log(e.target.result);
                //parseFile(inputText);
                //writeFile();
                //console.log(outputText);

            }
            r.readAsText(f);
        } else {
            alert("Failed to load file");
        }


    } else {
        alert('The File APIs are not fully supported by your browser.');
    }

}

//set up the page
function init() {

    //watch the file selector for changes
    document.getElementById("fileinput").addEventListener("change", readSingleFile, false);


}

//reset the input and output before a new file is read in
function reset() {

    inputText = "";

}




function parseFile(inputText) {

    var placemarkArray = inputText.match(/<Placemark>([\s\S]*?)<\/Placemark>/gm);

    topleftlat = $("#topleftlat").val();
    topleftlon = $("#topleftlon").val();
    botrightlat = $("#botrightlat").val();
    botrightlon = $("#botrightlon").val();

    var passedLong = false, passedLat = false;
    //console.log(botright);

    for(var i = 0; i < placemarkArray.length; i++){


        //if there is a model associated
        if(placemarkArray[i].indexOf("<coordinates>") < 0){

            lon = placemarkArray[i].substring(placemarkArray[i].indexOf("<longitude>")+11, placemarkArray[i].indexOf("</longitude>"));
            lat = placemarkArray[i].substring(placemarkArray[i].indexOf("<latitude>")+10, placemarkArray[i].indexOf("</latitude>"));

        }
        else {
            var lon = placemarkArray[i].substring(placemarkArray[i].indexOf("<coordinates>")+13, placemarkArray[i].indexOf(","));
            var lat = placemarkArray[i].substring(placemarkArray[i].indexOf(",")+1, placemarkArray[i].lastIndexOf(","));
        }

            passedLat = false;
            passedLong = false;


            if(Number(lon) > Number(topleftlon) && Number(lon) < Number(botrightlon))
            {
                passedLong = true;
            }
            if(Number(lat) < Number(topleftlat) && Number(lat) > Number(botrightlat))
            {
                passedLat = true;

            }

            if(passedLat && passedLong){
                finalPlacemarks.push(placemarkArray[i]);
            }

    }
}



function writeFile(placemarks) {

    var kmlDoc = '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">'
    + '<Document><Style id="sn_noicon4"><IconStyle><Icon></Icon></IconStyle></Style><Style id="sn_noicon3"><IconStyle><Icon></Icon></IconStyle></Style>';

    var kmlEndDoc = '</Folder></Document></kml>';

    var kmlPlacemarkStart = '<Folder><name>Extracted Placemarks</name>';

    var kmlPlacemark = '';

    for(var i = 0; i < placemarks.length;  i++){
        kmlPlacemark += placemarks[i];
    }

    return kmlDoc + kmlPlacemarkStart + kmlPlacemark + kmlEndDoc;


}


//click the generate button
$('#convert').click(function () {


    parseFile(inputText);
    ///console.log(writeFile(finalPlacemarks));

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


    this.href = makeTextFile(writeFile(finalPlacemarks));


});

//on enter, click the generate button
$('#convert').keypress(function (e) {
    if (e.which == 13) {
        $("#convert").trigger("click");
    }
});
