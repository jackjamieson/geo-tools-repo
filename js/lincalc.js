
var output = "";
var outputTrend = "";

Math.degrees = function(rad)
{
     return rad*(180/Math.PI);
}

Math.radians = function(deg)
{
     return deg * (Math.PI/180);
}

function readInput(){

    var lines = $('#excel').val();
    var lineArr = [];

    lines = lines.split('\n');
    for(var i = 0;i < lines.length;i++){
        lineArr.length = 0;

        if(lines[i].indexOf(",") > -1){

            var singleLineComma = lines[i].split(',');

            for(var m = 0; m < singleLineComma.length; m++)
            {
                lineArr.push(singleLineComma[m]);

            }

            if(lineArr.length > 1)
            {

                calculateRakePlunge(lineArr[0], lineArr[1], lineArr[2], lineArr[3]);

            }

        }
        else {

            var singleLine = lines[i].split('\t');
            for(var m = 0; m < singleLine.length; m++)
            {
                lineArr.push(singleLine[m]);

            }

            if(lineArr.length > 1)
            {

                calculateRakePlunge(lineArr[0], lineArr[1], lineArr[2], lineArr[3]);

            }
        }
    }

}


function calculateRakePlunge(strike, dip, rake, rhrrake){

    var tanR, cosD, sinD, sinR, tanMinusR, beta, minusBeta, traw;

    tanR = Math.tan(Math.radians(rhrrake));
    cosD = Math.cos(Math.radians(dip));
    sinD = Math.sin(Math.radians(dip));
    sinR = Math.sin(Math.radians(rhrrake));
    tanMinusR = Math.tan(Math.radians(180-rake));
    beta = Math.abs(Math.degrees(Math.atan(tanR * cosD)));
    minusBeta = 180 - beta;

    if(rhrrake > 90){
        traw = Number(strike) + minusBeta;
    }
    else{
        traw = Number(strike) + beta;
    }

    var plunge = Math.round(Math.degrees(Math.asin(sinD * sinR)));

    var result = Math.round(traw);

    output += result + "\n";
    outputTrend += plunge + "\n";

}

//click the calc button
$('#calc').click(function() {

    output = "";
    outputTrend = "";

    readInput();

    $("#out").val(output);
    $("#outT").val(outputTrend);


});
