var formateJson1 = function(diffObject, field, level) {
	if(_.isUndefined(level) ) {
		level = 0; 
	}

	var el = getElement(level, diffObject, field)
	var isArray = diffObject['isArray'];
	var value =diffObject.getValue();

	value = _.sortBy(value, "action");
	
	for(var idx = 0; idx < value.length; idx++ ) {
		if( value[idx] instanceof Difference) {
			el.append( getUlElemenet( value[idx], field, isArray ) );
		}else {
			el.append( formateJson1( value[idx], field, level+1 ) );
		}
	}
	var closeTag = diffObject.isRemoved(field) ? "-" : getCloseTag(diffObject) ;
	el.append(closeTag);
	return el;
}	

var getElement = function(level, diffObject, field) {
	var key = diffObject.getKey();
	var content = _.isUndefined(key) ? "" : key + " : ";
	content = diffObject.isRemoved(field) ? "-" : content + getOpenTag(diffObject) ;

	var classes = 'child level-'+level + " " + diffObject.getAction();
	var el = $("<div class='"+classes+"'>"+ content + "</div>");

	return el;
}

var getOpenTag = function(diffObject) {
	return diffObject["isArray"] ? "[" : "{" ;
}

var getCloseTag = function(diffObject) {
	return diffObject["isArray"] ? "]" : "}" ;
}

var getUlElemenet = function(value, field, isArray) {
	var className = value.getAction();
	
	if(_.isUndefined(value[field])) {
		return '<ul class="'+ className +'"> - </ul>'
	}
	if(isArray) {
		return '<ul class="'+ className +'">'+ getStringValue( value[field] ) + ' </ul>'; 
	}
	return '<ul class="'+ className +'">'+ value.getKey() + ' : ' + getStringValue( value[field] ) + ' </ul>'; 
}

var getStringValue =  function(object) {
	if( _.isString(object) )
		return '\"' + object + '\"'; 
	return object;
}



