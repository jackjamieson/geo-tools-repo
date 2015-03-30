//common
var opencdata = "<![CDATA[ ";
var closecdata = " ]]>";

var fileList = [];
var zipFile;

var isUsingZip = false;

// reading the zip data
(function () {
    if (!window.FileReader || !window.ArrayBuffer) {
        $("#error_block").removeClass("hidden").addClass("show");
        return;
    }


    var $result = $("#result");
    $("#file").on("change", function(evt) {
        isUsingZip = true;
        fileList.length = 0;
        // remove content
        $result.html("");
        // be sure to show the results
        $("#result_block").removeClass("hidden").addClass("show");

        // see http://www.html5rocks.com/en/tutorials/file/dndfiles/

        var files = evt.target.files;
        for (var i = 0, f; f = files[i]; i++) {

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    var $title = $("<h4>", {
                        text : theFile.name
                    });
                    zipFile = theFile.name.substring(0, theFile.name.indexOf('.zip'));
                    $result.append($title);
                    var $fileContent = $("<ul>");
                    try {

                        var dateBefore = new Date();
                        // read the content of the file with JSZip
                        var zip = new JSZip(e.target.result);
                        var dateAfter = new Date();

                        $title.append($("<span>", {
                            text:" Contents: "
                        }));

                        // that, or a good ol' for(var entryName in zip.files)
                        $.each(zip.files, function (index, zipEntry) {

                            var fileName = zipEntry.name.substring(zipEntry.name.indexOf('/')+1, zipEntry.name.length);
                            if(fileName != 'Thumbs.db'){
                                $fileContent.append($("<li>", {
                                    text : zipEntry.name
                                }));
                                fileList.push(fileName); // add the filename to the array so we can count them later and use name
                            }
                            // the content is here : zipEntry.asText()
                        });

                        addTitleFields(fileList.length, fileList);
                        // end of the magic !

                    } catch(e) {
                        $fileContent = $("<div>", {
                            "class" : "alert alert-danger",
                            text : "Error reading " + theFile.name + " : " + e.message
                        });
                    }
                    $result.append($fileContent);
                }
            })(f);

            // read the file !
            // readAsArrayBuffer and readAsBinaryString both produce valid content for JSZip.
            reader.readAsArrayBuffer(f);
            // reader.readAsBinaryString(f);
        }
    });
})();

function addTitleFields(count, fileList){

    var titles = document.getElementById("titles");
    var titleBlock = document.getElementById("titleBox");
    var newTitles = document.getElementById("new_titles");

    titleBlock.innerHTML = "";

    titles.innerHTML = "";


    for(var i = 0; i < count; i++){

        newTitles.innerHTML += "<div style='margin-left:15px'><p><tr><td><b>Title (" + fileList[i] + "): </b></td><td><input type='text' id=" + "\"" + fileList[i] + "\"" + "size='20'></td></tr></p></div>";

    }



}


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

    //var zip = new JSZip();
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

    //when we are not using a zip file
    if(!isUsingZip)
    {
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


            //needed to generate a single file.  may still be necesary
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
    }
    else{
        //when we are using a zip file
        var zip = new JSZip();
        //reset the link so it doesn't bypass the required check
        this.href = "#";

        // check for the required fields
        var abstract = $('#abstract').val();
        var boxes = $('input[name=chk]:checked');
        var supp = $('#supplementalInformation').val();
        var long = $('#longitude').val();
        var lat = $('#latitude').val();
        var date = $('#date').val();


        // loop through and check the titles of the zip files
        var isEmpty = true;
        for(var z = 0; z < fileList.length; z++)
        {
            if(document.getElementById(fileList[z]).value.length == 0)
            {
                isEmpty = true;
                z = fileList.length;
            }
            else isEmpty = false;// The titles have all been filled out

        }


        if(isEmpty == true || abstract.length == 0 || boxes.length == 0 || supp.length == 0 || long.length == 0 || lat.length == 0 || date.length == 0)
        {
            alert("All required fields must be filled in.  Bolded items are required.");


        }
        else {
            // collect the information from the form inputs
            for(var f = 0; f < fileList.length; f++){
                var header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
                header += "\n<sample>\n";
                header += element("collectionID", $('#collectionid').val());
                header += element("title", document.getElementById(fileList[f]).value);

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

                zip.file(fileList[f].substring(0, fileList[f].indexOf('.')) + "-xml.xml", header);//add the file to the zip in-memory

            }

            //generate the zip file
            var content = zip.generate({type:"blob"});
            saveAs(content, zipFile + "-xml.zip");




        }

    }










});
