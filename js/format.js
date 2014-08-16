var test = function() {
	var el = $("<div>{</div>");
	el.append('<ul> </ul>');
	el.append('}');
	$('.result').append(el);
}

var formateJson = function(object, level) {
	if(!level) level = 0;
 	var outputString = "{ \n";
 	var tabString = getTabString(level);

	_.keys(object).forEach(function(key){
		outputString += tabString + '\t\"' + key + '\" : ' + getValue(object, key, level+1) + ',\n';
	});
	outputString = outputString.substring(0, outputString.length-2);
	return outputString + "\n" + tabString + "}";
}	


var getTabString = function(n) {
	var string="";
	for(var i=0; i<n; i++)
		string +="\t";
	return string;
}

var getValue = function(object, key, level) {
	var value = object[key];
	if( _.isArray(object[key]) )
		value = formatArray(object[key], level)
	else if( _.isString(object[key]) )
		value = '\"' + value + '\"'; 
	else if( _.isObject(object[key]) )
		value = formateJson(object[key], level);

	return value;
}

var formatArray = function(array, level) {
	if(!level) level = 0;
	var outputString = "[ \n";
	var tabString = getTabString(level);

	for(var idx=0; idx < array.length; idx++) {
		outputString += tabString + "\t" + getValue(array, idx, level+1) + ",\n"; 			
	}
	outputString = outputString.substring(0, outputString.length-2);

	return outputString + "\n" + tabString + "]";
}


