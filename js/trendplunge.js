
Math.degrees = function(rad)
{
     return rad*(180/Math.PI);
}

Math.radians = function(deg)
{
     return deg * (Math.PI/180);
}


var output = "";
var outputTrend = "";


// finds plunge from pitch and dip, params must be in radians
function findPlunge(pitch, dip){
    pitch = Math.radians(pitch);
    dip = Math.radians(dip);

    var re = Math.sin(pitch) * Math.sin(dip);
    var re2 = Math.degrees(fnis(re));

    return re2 + .5;
}

function findTrend(strike, dipdir, pitchdir, pitch, dip){

    strike = Math.radians(strike);
    pitch = Math.radians(pitch);
    dip = Math.radians(dip);

    var bb = Math.tan(pitch) * Math.cos(dip);
    bb = Math.atan(bb);

    //replace and spaces found in the dip direction or pitch direction
    dipdir = dipdir.replace(/ +/g,"");
    pitchdir = pitchdir.replace(/ +/g,"");

    var isSouth = /^S$/i;
    var isNorth = /^N$/i;
    var isEast = /^E$/i;
    var isWest = /^W$/i;

    var isSouthEast = /^SE$/i;
    var isSouthWest = /^SW$/i;
    var isNorthWest = /^NW$/i;
    var isNorthEast = /^NE$/i;


    if(strike > 1.570796 && isSouth.test(dipdir) && isSouthEast.test(pitchdir)){
        return postTrend(strike+bb);
    }
    if(strike < 1.570796 && isNorth.test(dipdir) && isSouthWest.test(pitchdir)){
        return postTrend(strike+bb+3.141593);
    }
    if(strike < 1.570796 && isNorth.test(dipdir) && isNorthEast.test(pitchdir)){
        return postTrend(strike-bb);
    }
    if(strike > 1.570796 && isNorth.test(dipdir) && isSouthEast.test(pitchdir)){
        return postTrend(strike-bb);
    }
    if(strike < 1.570796 && isSouth.test(dipdir) && isNorthEast.test(pitchdir)){
        return postTrend(strike+bb);
    }
    if(strike > 1.570796 && isSouth.test(dipdir) && isNorthWest.test(pitchdir)){
        return postTrend(strike+bb+3.141593+3.141593);
    }
    if(strike > 1.570796 && isNorth.test(dipdir) && isNorthWest.test(pitchdir)){
        return postTrend(strike+bb+3.141593);
    }
    if(strike < 1.570796 && isSouth.test(dipdir) && isSouthWest.test(pitchdir)){
        return postTrend(strike-bb+3.141593);
    }
    else{
        return "Error";
    }

}

function postTrend(trend){
    if(trend > 6.283186)
    {
        trend = trend - 6.283186;
    }
    if(trend < 0){
        trend = trend + 6.283186;
    }

    trend = Math.degrees(trend);
    trend = Math.round(trend);

    return trend;
}

function fnis(plunge){

    return Math.atan(plunge/Math.sqrt(1 - plunge * plunge));

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

                calculateTrendPlunge(Number(lineArr[0]), Number(lineArr[1]), lineArr[2], Number(lineArr[3]), lineArr[4]);

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

                calculateTrendPlunge(Number(lineArr[0]), Number(lineArr[1]), lineArr[2], Number(lineArr[3]), lineArr[4]);

            }
        }
    }

}


function calculateTrendPlunge(strike, dip, dipdir, pitch, pitchdir){

    var plunge = findPlunge(Number(pitch), Number(dip));

    var trend = findTrend(Number(strike), dipdir, pitchdir, Number(pitch), Number(dip));

    if(trend === "Error"){
        output += "Error" + "\n";
    }
    else output += Math.round(trend) + "\n";
    outputTrend += Math.round(plunge) + "\n";

}

//click the calc button
$('#calc').click(function() {

    output = "";
    outputTrend = "";

    readInput();

    $("#out").val(output);
    $("#outT").val(outputTrend);


});
