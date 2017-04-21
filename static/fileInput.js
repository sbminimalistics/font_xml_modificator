document.getElementById("upload-input").addEventListener('change', fileSelectionChangedHandler);

function fileSelectionChangedHandler(e){
	console.log("fileSelectionChangedHandler e:"+e.value);
	var files = document.getElementById("upload-input").files;
	document.getElementById("fileSelectionForm").submit();
	e.preventDefault();
}