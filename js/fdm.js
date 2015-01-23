//input vars for stations
var inputText = "";
var outputText = "STATION,DOMAIN,UNIT,TYPE,KIND,BRG,INC,DD";
var station, domain, unit, type, kind, brg, inc, dd; //vars for each station
var strike, dip, direction;

var stationLine = {
    station: "",
    domain: "",
    unit: "",
    type: "",
    kind: "",
    strike: "",
    dip: "",
    direction: ""
}; //station object
var stationArray = new Array();


init();


// conversion from rad to deg
if (typeof Number.prototype.toRadians == 'undefined') {
    Number.prototype.toRadians = function () {
        return this * Math.PI / 180;
    }
}

if (typeof Number.prototype.toDegrees == 'undefined') {
    Number.prototype.toDegrees = function () {
        return this * 180 / Math.PI;
    }
}

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
                var inputText = e.target.result; //copy the file into a local var
                //console.log(e.target.result);
                parseFile(inputText);

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
    outputText = "STATION,DOMAIN,UNIT,TYPE,KIND,BRG,INC,DD";
}




function parseFile(inputText) {
    var lines = inputText.split('\n');
    var line;
    var stationIndex;
    var sdd;

    for (line = 1; line < lines.length - 1; line++) {
        lines[line] = lines[line].replace(" ", "");
        //lines[line] = lines[line].replace(/(\r\n|\n|\r)/gm,"");

        stationLine = {};
        stationIndex = line;

        while (lines[stationIndex].indexOf("STATION") == -1) {
            stationIndex++;
        }

        for (var p = line; p < stationIndex; p++) {

            stationLine = {}; //reset the object

            stationLine.station = lines[stationIndex - 1];
            stationLine.domain = lines[stationIndex - 2];
            stationLine.unit = lines[stationIndex - 3];

            if (lines[p].indexOf("B") != -1 || lines[p].indexOf("BDZ") != -1 || lines[p].indexOf("DDZ") != -1) {

                sdd = lines[p + 1].split(","); //split the strike, dip, etc

                addFeatures(lines[p],"", sdd);
                
            } 
            else if (lines[p].indexOf("J") != -1 || lines[p].indexOf("KB") != -1 || lines[p].indexOf("KBB") != -1) {

                sdd = lines[p + 1].split(","); //split the strike, dip, etc

                addFeatures(lines[p],"", sdd);

            }
            else if (lines[p].indexOf("TG") != -1 || lines[p].indexOf("TGA") != -1) {

                sdd = lines[p + 1].split(","); //split the strike, dip, etc

                addFeatures(lines[p],"", sdd);

            }
            else if (lines[p].indexOf("C") != -1 || lines[p].indexOf("F") != -1 || || lines[p].indexOf("F") != -1) {

                sdd = lines[p + 1].split(","); //split the strike, dip, etc

                addFeatures(lines[p],"", sdd);

            }


        }

        line = stationIndex;
        /*do {

            if (lines[line].indexOf("STATION") != -1) {
                stationLine.station = lines[line - 1];
                stationLine.domain = lines[line - 2];
                stationLine.unit = lines[line - 3];
            }



            line++;
        } while (lines[line].indexOf("STATION") == -1);*/
    }
    console.log(stationArray);


}

function addFeatures(type, kind, sdd) {

    for (var i = 0; i < sdd.length; i++) {
        sdd[i] = sdd[i].replace(/\s/g, "");
    }

    stationLine.type = type;
    stationLine.kind = kind;

    stationLine.strike = sdd[0];
    stationLine.dip = sdd[1];
    stationLine.direction = sdd[2];

    stationArray.push(stationLine);

}

//click the generate button
$('#convert').click(function () {


});

//on enter, click the generate button
$('#convert').keypress(function (e) {
    if (e.which == 13) {
        $("#convert").trigger("click");
    }
});