
var output = "";

function readInput(){

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

            calculateAppDip(lineArr[0], lineArr[1], lineArr[2]);

        }
    }

}


function calculateAppDip(trueDip, crossSec, planeDipAz){


    var result = Math.atan(Math.tan(Number(trueDip * Math.PI/180)) * Math.cos(Number(crossSec* Math.PI/180) - Number(planeDipAz* Math.PI/180)));

    if(result < 0){
        result = result * -1;
    }

    result = result * (180/Math.PI);

    output += result + "\n";

}

//click the calc button
$('#calc').click(function() {

    output = "";

    readInput();

    $("#out").val(output);

});
