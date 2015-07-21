
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

                calculateTrendPlunge(lineArr[0], lineArr[1]);

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

                calculateTrendPlunge(lineArr[0], lineArr[1]);

            }
        }
    }

}


function calculateTrendPlunge(pitch, dip){

    pitch = Math.radians(pitch);
    dip = Math.radians(dip);

    var trend = Math.atan(Math.tan(pitch) * Math.cos(dip));
    var plunge = Math.atan(Math.tan(pitch) * Math.sin(dip));

    if(trend < 0) {
        trend = trend * -1;
    }

    if(plunge < 0){
        plunge = plunge * -1;
    }

    trend = Math.degrees(trend);
    plunge = Math.degrees(plunge);

    trend = Math.round(trend);
    plunge = Math.round(plunge);


    output += trend + "\n";
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
