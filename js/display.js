function display(diff) {
	$('.result').append(generateDifferenceElement(diff, "root",0));
	init();
};

var generateDifferenceElement = function(diff, root, level) {

	var imageElement = ("<i class='expand_collapse icon-angle-circled-down'>"+root+"</i>");

	var classes = 'child level-'+level
	var el = $("<div class='"+classes+"'></div>");
	el.append(imageElement);
	
	var diffObject = diff.getValue();
	var keys = getKeys(diffObject);

	keys.forEach(function(key){

		if( diffObject[key] instanceof Difference) {
			appendContentForNonObject(diffObject, key,el);
		}else if( diffObject[key].getAction() != COMPARISON.SAME ){
			el.append(generateDifferenceElement(diffObject[key], key, level+1));
		}

	});

	return el;
}

var appendContentForNonObject = function(diff,key,el) {
	value = diff[key];
	if( value.getAction() == COMPARISON.ADD) {
		el.append('<ul class="add">'+ key + " : " + getStringValue(value.getValue2()) + ' </ul>')
	} else if (value.getAction() == COMPARISON.REMOVE) {
		el.append('<ul class="remove">'+ key + " : " + getStringValue(value.getValue1()) + ' </ul>')
	} else if (value.getAction() == COMPARISON.CHANGE) { 
		el.append('<ul class="change strike"> '+ key + " : " + getStringValue(value.getValue1()) + ' </ul>')
		el.append('<ul class="change"> '+ key + " : " + getStringValue(value.getValue2()) + ' </ul>') 
	}
}

var getStringValue =  function(object) {
	if( _.isString(object) )
		return '\"' + object + '\"'; 
	return object;
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

