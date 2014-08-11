function display(diff) {
	if(_.isEmpty(diff[0])) {
		$('.result').text("No difference");
		return;
	}

	$('.result').append(generateDifferenceElement(diff[0], diff[1], "root",0));
	init();

};

var generateDifferenceElement = function(diff1, diff2, root, level) {

	var imageElement = ("<i class='expand_collapse icon-angle-circled-down'>"+root+"</i>");

	var classes = 'child level-'+level
	var el = $("<div class='"+classes+"'></div>");
	el.append(imageElement);
	
	
	var keys = getUniqueKeys(diff1, diff2); 
	keys.forEach(function(key){

		if( ( _.has(diff1, key) && _.isObject(diff1[key]) ) || ( _.has(diff1, key) && _.isObject(diff1[key]) ) ) {
			el.append(generateDifferenceElement(diff1[key], diff2[key], key, level+1));
		} else {
			appendContentForNonObject(diff1, diff2, key,el);
		}

	});
	return el;
}

var appendContentForNonObject = function(diff1, diff2, key,el) {
	if(_.has(diff1,key) && _.has(diff2,key) ) {
		el.append('<ul class="change strike"> '+ key + " : " + getStringValue(diff1[key])+ ' </ul>')
		el.append('<ul class="change"> '+ key + " : " + getStringValue(diff2[key])+ ' </ul>') 
	}else if(_.has(diff1,key)) {
		el.append('<ul class="remove">'+ key + " : " + getStringValue(diff1[key])+ ' </ul>')
	}else {
		el.append('<ul class="add">'+ key + " : " + getStringValue(diff2[key])+ ' </ul>')
	}
}

var getUniqueKeys = function() {
	var keys = [];
	for (var i = 0; i < arguments.length - 1; i++) {
		keys = _.union(keys, getKeys(arguments[i]));
	};
	return keys;
}

var getKeys = function(object) {
	var keys = [];
	if(_.isObject(object)) {
		keys =  _.keys(object);
	}
	return keys;
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

var getStringValue =  function(object) {
	if( _.isString(object) )
		return '\"' + object + '\"'; 
	return object;
}


var getTabString = function(n) {
	var string="";
	for(var i=0; i<n; i++)
		string +="\t";
	return string;
}

var init = function() {
	$(".expand_collapse").click(function(el){
		$(el.currentTarget).toggleClass("icon-angle-circled-down");
		$(el.currentTarget).toggleClass("icon-angle-circled-right");
		$(el.currentTarget).siblings().slideToggle(100);		
	});
};

var arrayToString = function(array) {
	return "[" + array.toString() + "]";
} 

