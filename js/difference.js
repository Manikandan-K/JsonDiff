var COMPARISON = {
	SAME : 0,
	CHANGE : 1,
	ADD : 2,
	REMOVE : 3,
	MIXED : 4
}

var Difference = function(value1, value2, action) {
	this.value1 = value1,
	this.value2 = value2,
	this.action = action,

	this.getValue1 = function() {
		return this.value1;
	},

	this.getValue2 = function() {
		return this.value2;
	},

	this.getAction = function() {
		return this.action;
	}
}

var ObjectDifference = function(value, action) {
	this.value 	= value;
	this.action = action;

	this.getValue = function() {
		return this.value;
	},

	this.getAction = function() {
		return this.action;
	}
}

var isSame = function(object) {
	var keys = getKeys(object);

	for (var key in object) {
		value = object[key];

		if(value instanceof Difference) {
			if(value.getAction() != COMPARISON.SAME)
				return false;
		}else if(! isSame(value)) {
			return false;
		}
	};

	return true;
}

var findDifference = function(json1, json2) {
	var result = {};
	var actions = [];

	if(_.isEmpty(json1) && _.isEmpty(json2)) {
		return new ObjectDifference(result,COMPARISON.SAME);
	}

	
	var keys = _.union( getKeys(json1), getKeys(json2) );

	keys.forEach(function(key){
		var value1 = getValues(json1, key);
		var value2 = getValues(json2, key);
		var action;

		if( _.isObject(value1) || _.isObject(value2) ) 
			result[key] = findDifference(value1, value2);
		else if( _.isEqual(value1, value2) )  
			result[key] = new Difference(value1, value2, COMPARISON.SAME); 
		else if( _.isUndefined(value1) ) 
			result[key] = new Difference(value1, value2, COMPARISON.ADD); 
		else if( _.isUndefined(value2) ) 
			result[key] = new Difference(value1, value2, COMPARISON.REMOVE); 
		else 
			result[key] = new Difference(value1, value2, COMPARISON.CHANGE); 
				
		actions.push(result[key].getAction());		
	});

	var uniqueActions = _.uniq(actions);
	var action = uniqueActions.length > 1 ? COMPARISON.MIXED : uniqueActions[0];

	return new ObjectDifference(result,action);
}



var getValues = function(object, key) {
	if( _.isUndefined(object) )
		return undefined;
	else 
		return object[key];
}

var getKeys = function(object) {
	var keys = [];
	if(_.isObject(object)) {
		keys =  _.keys(object);
	}
	return keys;
}
