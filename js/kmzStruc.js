
//import kml files by clicking the import button
$(function(){
	$("#choose").on('click', function(e){
		e.preventDefault();
		$("#upload:hidden").trigger('click');
	});
});

//Handles file "uploads" for importing KML.  Imagery must be web accessible.
window.onload = function() {
	var fileInput = document.getElementById('upload');
	//var fileDisplayArea = document.getElementById('strike');

	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		var textType = /\.kml/i;

		if (file.type.match(textType)) {
			var reader = new FileReader();
			reader.readAsBinaryString(file);		
			reader.onload = function(e) {


				parseKML(reader.result);
			}


		} else {
			alert("File not supported!");
		}
	});
}

function parseKML(kml)
{

	var str = kml;

	var parser = new marknote.Parser();
	var doc = parser.parse(str);

	var output = doc.getRootElement().getChildElementAt(0).getName();
	console.log(output);


	/*$(kml).find("PolyStyle").each(function()
								  {
		console.log($(kml).find("Color").text());
		//$("#output").append($(this).attr("author") + "<br />");
	});
*/
	//console.log(kml);
}
