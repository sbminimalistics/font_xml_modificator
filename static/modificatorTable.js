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
		
		function renderTable(isUpdate){
			//console.log(">renderTable");
			if(chars && chars.length > 0){
				var tableContent = '<table id="modificatorTable"><tr class="row_header"><td id="filename" class="column_header" colspan="'+propertiesAvailable.length+'">'+fileName+'</td></tr><tr class="row_header">';
				var selectAllTablePart = "";
				for (var property in chars[0].$){
					tableContent += '<td class="column_header">';
					if(propertiesAllowedForModification.indexOf(property) > -1){
						//tableContent += '<nobr>' + property + '<button class="modify_button up" onclick="upHandler(\''+property+'\')"></button><button class="modify_button down" onclick="downHandler(\''+property+'\')"></button></nobr>';
						tableContent += property + '<br><button class="modify_button up" onclick="upHandler(\''+property+'\')"></button><button class="modify_button down" onclick="downHandler(\''+property+'\')"></button>';
						selectAllTablePart += '<td><button name="all" value="'+property+'" onclick="selectAllHandler(\''+property+'\')">all</button>';
						selectAllTablePart += '<button name="none" value="'+property+'" onclick="selectNoneHandler(\''+property+'\')">none</button></td>';
					}else{
						tableContent += property;
						selectAllTablePart += "<td></td>";
					}
					tableContent += "</td>";
				}
				tableContent += '</tr><tr class="row_select_all_none">';
				tableContent += selectAllTablePart;
				tableContent += "</tr>"
				for (var i=0; i<chars.length; i++){
					tableContent += '<tr class="row_value">';
					for (var j=0; j<propertiesAvailable.length; j++){
						if(propertiesAllowedForModification.indexOf(propertiesAvailable[j]) > -1){
							var cellId = chars[i].$["id"]+"_"+propertiesAvailable[j];
							var cbId = "cb_"+cellId;
							if((!isUpdate && parseInt(chars[i].$["id"]) > 47 && parseInt(chars[i].$["id"]) < 58) || (isUpdate && document.getElementById(cbId).checked)){
								tableContent += '<td id="'+cellId+'" class="column_value_modifieble"><input type="checkbox" id="'+cbId+'" checked="true">';
							}else{
								tableContent += '<td id="'+cellId+'" class="column_value_modifieble"><input type="checkbox" id="'+cbId+'">';
							}
						}else{
							tableContent += '<td class="column_value">';
						}
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
				//console.log(">setData");
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
					//console.log(">>>"+("cb_"+chars[i].$['id']+"_"+chars[i].$[targetPropertyName]));
					var cbChecked = document.getElementById("cb_"+chars[i].$['id']+"_"+targetPropertyName).checked;
					//console.log("is checked:"+cbChecked);
					if(cbChecked){
						chars[i].$[targetPropertyName] = parseInt(chars[i].$[targetPropertyName])+step;
					}
				}
				renderTable(true);
			},
			getPropertiesAllowedForModification: function(){
				return propertiesAllowedForModification;
			},
			getChars: function(){
				return chars;
			}
		}
	}
);

var modificatorTable = new ModificatorTable();
//console.log(chars);
//console.log(JSON.parse(chars));
//modificatorTable.setData(JSON.parse(chars));
modificatorTable.setData(chars);
//document.getElementById("modificatorTable").addEventListener("click", tableClickHandler, false);
document.addEventListener("click", tableClickHandler, false);

function tableClickHandler(e){
	console.log(e.target);
	var cb = document.getElementById("cb_"+e.target.id);
	if(!cb){return;}
	if(cb.checked){
		cb.removeAttribute("checked");
	}else{
		cb.setAttribute("checked", true);
	}
	e.preventDefault();
}

function upHandler(target){
	modificatorTable.changeProperty(target, 1);
}

function downHandler(target){
	modificatorTable.changeProperty(target, -1);
}

function selectAllHandler(target){
	//console.log(">selectAllHandler target:"+target);
	var chars = modificatorTable.getChars();
	for(var i=0; i<chars.length; i++){
		console.log("cb_"+chars[i].$['id']+"_"+target);
		document.getElementById("cb_"+chars[i].$['id']+"_"+target).setAttribute("checked", true);
	}
}

function selectNoneHandler(target){
	console.log(">selectNoneHandler target:"+target);
	var chars = modificatorTable.getChars();
	for(var i=0; i<chars.length; i++){
		console.log("cb_"+chars[i].$['id']+"_"+target);
		document.getElementById("cb_"+chars[i].$['id']+"_"+target).removeAttribute('checked');
	}
}

document.getElementById("save").addEventListener('click', saveModifiedValuesHandler);

function saveModifiedValuesHandler(e){
	//console.log("saveModifiedValuesHandler e:"+e.value);
	document.getElementById("modifiedChars").setAttribute("value", JSON.stringify(modificatorTable.getModifiedChars()));
	document.getElementById("propertiesAllowedForModification").setAttribute("value", JSON.stringify(modificatorTable.getPropertiesAllowedForModification()));
	document.getElementById("saveModifiedValuesForm").submit();
	e.preventDefault();
}

