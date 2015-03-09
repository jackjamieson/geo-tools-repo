//common
var opencdata = "<![CDATA[ ";
var closecdata = " ]]>";


function element(name, content, inner){

    var xml;

    if (!content){
        xml='\t<' + name + '/>\n';
    }
    else if(content && !inner){
        xml='\t<'+ name + '>' + content + '</' + name + '>\n';
    }
    else {
        xml='\t<'+ name + '>\n\t\t<' + inner + '>' + content + '</' + inner + '>\n' + '\t</' + name + '>\n';

    }

    return xml;
}

$('#xml').click(function() {

    //reset the link so it doesn't bypass the required check
    this.href = "#";

    // check for the required fields
    var title = $('#title').val();
    var abstract = $('#abstract').val();
    var boxes = $('input[name=chk]:checked');
    var supp = $('#supplementalInformation').val();
    var long = $('#longitude').val();
    var lat = $('#latitude').val();
    var date = $('#date').val();

    if(title.length == 0 || abstract.length == 0 || boxes.length == 0 || supp.length == 0 || long.length == 0 || lat.length == 0 || date.length == 0)
    {
        alert("All required fields must be filled in.  Bolded items are required.");


    }
    else {
        // collect the information from the form inputs
        var header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        header += "\n<sample>\n";
        header += element("collectionID", $('#collectionid').val());
        header += element("title", $('#title').val());

        // alternate title
        if($('#alttitle').val().length != 0){
            header += element("alternateTitle", $('#alttitle').val(), "title");
        }



        header += element("abstract",  $('#abstract').val());

        // loop through the checked boxes and add them to xml
        $(boxes).each(function ()
        {
            if($(this).val() == "Other")
            {
                header += element("dataType", $('#otherBox').val());
            }
            else header += element("dataType", $(this).val());

        });

        //header += element("dataType", $( "#sel option:selected" ).text());
        header += element("supplementalInformation", $('#supplementalInformation').val() , "info");
        header += element("coordinates", $('#longitude').val() + ", " + $('#latitude').val());

        // alternate geometry
        if($('#altgeometry').val().length != 0){
            header += element("alternateGeometry", $('#altgeometry').val());
        }

        // online resource
        if($('#onlineresource').val().length != 0){
            header += element("onlineResource", $('#onlineresource').val(), "resourceURL");
        }

        // browse graphic
        if($('#browsegraphic').val().length != 0){
            header += element("browseGraphic", $('#browsegraphic').val(), "resourceURL");
        }

        // collection date
        if($('#altdate').val().length != 0){
            header += element("dates", $('#altdate').val(), "date");
        }

        // vertical extent
        if($('#vertical').val().length != 0){
            header += element("verticalExtent", $('#vertical').val());
        }

        header += element("datasetReferenceDate", $('#date').val());
        header += "</sample>";

        var textFile = null,
            makeTextFile = function (text) {
                var data = new Blob([text], {type: 'text/xml'});

                // If we are replacing a previously generated file we need to
                // manually revoke the object URL to avoid memory leaks.
                if (textFile !== null) {
                    window.URL.revokeObjectURL(textFile);
                }

                textFile = window.URL.createObjectURL(data);

                return textFile;
            };


        this.href = makeTextFile(header);
    }









});
