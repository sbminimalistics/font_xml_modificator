var ModificatorTable = (
	function(){
		const propertiesAllowedForModification = ["x", "y", "width", "height", "xoffset", "yoffset", "xadvance"];
		var data = null;
		var chars = [];
		var output = document.querySelector("#output");
		var propertiesAvailable = [];
		
		function extractAvailableProperties(){
			propertiesAvailable = [];
			for (var property in chars[0].$){
				propertiesAvailable.push(property);
			}
		}
		
		function renderTable(){
			console.log(">renderTable");
			if(chars && chars.length > 0){
				var tableContent = '<table><tr class="row_header">';
				for (var property in chars[0].$){
					tableContent += '<td class="column_header">';
					if(propertiesAllowedForModification.indexOf(property) > -1){
						tableContent += '<nobr>' + property + '<button class="modify_button up" onclick="upHandler(\''+property+'\')"></button><button class="modify_button down" onclick="downHandler(\''+property+'\')"></button></nobr>';
					}else{
						tableContent += property;
					}
					tableContent += "</td>";
				}
				tableContent += "</tr>";
				for (var i=0; i<chars.length; i++){
					tableContent += '<tr class="row_value">';
					for (var j=0; j<propertiesAvailable.length; j++){
						if(propertiesAllowedForModification.indexOf(propertiesAvailable[j]) > -1){
							tableContent += '<td class="column_value_modifieble">';
						}else{
							tableContent += '<td class="column_value">';
						}
						//String.fromCharCode(48);
						tableContent += decodeURI(chars[i].$[propertiesAvailable[j]]);
						tableContent += "</td>";
					}
					tableContent += "</tr>";
				}
				tableContent += "</table>";
				output.innerHTML = tableContent;
			}else{
				output.innerHTML = "No characters were found inside the document.";
			}
		}
		
		return {
			setData: function(target){
				console.log(">setData");
				data = target;
				chars = target.font.chars[0].char;
				extractAvailableProperties();
				renderTable();
			},
			getData: function(){
				return data;
			},
			getModifiedChars: function(){
				return chars;
			},
			changeProperty: function(targetPropertyName, step){
				for(var i=0; i<chars.length; i++){
					chars[i].$[targetPropertyName] = parseInt(chars[i].$[targetPropertyName])+step;
				}
				renderTable();
			},
			getPropertiesAllowedForModification: function(){
				return propertiesAllowedForModification;
			}
		}
	}
);

var modificatorTable = new ModificatorTable();
console.log(chars);
console.log("**********");
//console.log(JSON.parse(chars));
//modificatorTable.setData(JSON.parse(chars));
modificatorTable.setData(chars);

function upHandler(target){
	modificatorTable.changeProperty(target, 1);
}

function downHandler(target){
	modificatorTable.changeProperty(target, -1);
}

document.getElementById("save").addEventListener('click', saveModifiedValuesHandler);

function saveModifiedValuesHandler(e){
	console.log("saveModifiedValuesHandler e:"+e.value);
	document.getElementById("modifiedChars").setAttribute("value", JSON.stringify(modificatorTable.getModifiedChars()));
	document.getElementById("propertiesAllowedForModification").setAttribute("value", JSON.stringify(modificatorTable.getPropertiesAllowedForModification()));
	document.getElementById("saveModifiedValuesForm").submit();
	e.preventDefault();
}

