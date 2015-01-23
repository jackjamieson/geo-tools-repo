//input vars for stations
var inputText = "";
var outputText = "STATION,DOMAIN,UNIT,TYPE,KIND,DIP,DIPAZIMUTH";
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
                writeFile();
                console.log(outputText);

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
    outputText = "STATION,DOMAIN,UNIT,TYPE,KIND,DIP,DIPAZIMUTH";
    stationArray.length = 0;
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

                addFeatures(lines[p], "", sdd);

            } else if (lines[p].indexOf("J") != -1 || lines[p].indexOf("KB") != -1 || lines[p].indexOf("KBB") != -1) {

                sdd = lines[p + 1].split(","); //split the strike, dip, etc

                addFeatures(lines[p], "", sdd);

            } else if (lines[p].indexOf("TG") != -1 || lines[p].indexOf("TGA") != -1) {

                sdd = lines[p + 1].split(","); //split the strike, dip, etc

                addFeatures(lines[p], "", sdd);

            } else if (lines[p].indexOf("C") != -1 || lines[p].indexOf("F") != -1 || lines[p].indexOf("FO") != -1) {

                sdd = lines[p + 2].split(","); //split the strike, dip, etc

                addFeatures(lines[p], lines[p + 1], sdd);

            } else if (lines[p].indexOf("FR") != -1 || lines[p].indexOf("LAY") != -1 || lines[p].indexOf("SZ") != -1) {

                sdd = lines[p + 2].split(","); //split the strike, dip, etc

                addFeatures(lines[p], lines[p + 1], sdd);

            } else if (lines[p].indexOf("ST") != -1 || lines[p].indexOf("V") != -1 || lines[p].indexOf("SP") != -1) {

                sdd = lines[p + 2].split(","); //split the strike, dip, etc

                addFeatures(lines[p], lines[p + 1], sdd);

            } else if (lines[p].indexOf("P") != -1 || lines[p].indexOf("SS") != -1) {

                sdd = lines[p + 2].split(","); //split the strike, dip, etc

                addFeatures(lines[p], lines[p + 1], sdd);

            } else if (lines[p].indexOf("L") != -1 || lines[p].indexOf("FI") != -1 || lines[p].indexOf("SL") != -1) {

                sdd = lines[p + 2].split(","); //split the strike, dip, etc

                addFeatures(lines[p], lines[p + 1], sdd);

            }


        }

        line = stationIndex;
    }
}

function addFeatures(type, kind, sdd) {

    for (var i = 0; i < sdd.length; i++) {
        sdd[i] = sdd[i].replace(/\s/g, "");
    }

    sdd = convertSDD(sdd);
    
    stationLine.type = type;
    stationLine.kind = kind;

    stationLine.strike = sdd[0];
    stationLine.dip = sdd[1];
    if (sdd.length > 2)
        stationLine.direction = sdd[2];
    else stationLine.direction = "";

    
    stationArray.push(stationLine);

}

function writeFile() {


    outputText += '\n';
    stationArray.forEach(function (entry) {
        outputText += entry.station + ',' + entry.domain + ',' + entry.unit +
            ',' + entry.type + ',' + entry.kind + ',' + entry.dip + ',' +
            entry.strike + '\n';
    });

    outputText = outputText.replace(/\r?|\r/g, ''); //remove carriage returns(from old .fd files)



}

function convertSDD(sdd) {
    
    var strike = sdd[0];
    var dip = sdd[1];
    strike = parseInt(strike)

    //only perform conversions for items with a direction
    if (sdd.length > 2) {
        
        var direction = sdd[2];

        if (strike <= 90 && (direction.indexOf("S") != -1 || direction.indexOf("E") != -1)) {
                
            strike += 90;
            sdd[0] = strike;
        }
        else if(strike <= 90 && (direction.indexOf("N") != -1 || direction.indexOf("W") != -1)) {
            
            strike += 270;
            sdd[0] = strike;
        }
        else if(strike > 90 && (direction.indexOf("N") != -1 || direction.indexOf("E") != -1)) {
            
            strike -= 90;
            sdd[0] = strike;
        }
        else if(strike > 90 && (direction.indexOf("S") != -1 || direction.indexOf("W") != -1)) {
            
            strike += 90;
            sdd[0] = strike;
        }
    }

    return sdd;


}

//click the generate button
$('#convert').click(function () {

    var textFile = null,
        makeTextFile = function (text) {
            var data = new Blob([text], {
                type: 'csv'
            });

            // If we are replacing a previously generated file we need to
            // manually revoke the object URL to avoid memory leaks.
            if (textFile !== null) {
                window.URL.revokeObjectURL(textFile);
            }

            textFile = window.URL.createObjectURL(data);

            return textFile;
        };


    this.href = makeTextFile(outputText);

});

//on enter, click the generate button
$('#convert').keypress(function (e) {
    if (e.which == 13) {
        $("#convert").trigger("click");
    }
});