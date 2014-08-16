var COMPARISON = {
	SAME : "same",
	CHANGE : "change",
	ADD : "add",
	REMOVE : "remove",
	MIXED : "mixed"
}

var Difference = function(value1, value2, key, action) {
	this.value1 = value1,
	this.value2 = value2,
	this.key = key ;
	this.action = action,

	this.getValue1 = function() {
		return this.value1;
	},

	this.getValue2 = function() {
		return this.value2;
	},

	this.getKey = function() {
		return this.key;
	},

	this.getAction = function() {
		return this.action;
	}
}

var ObjectDifference = function(value, key, action, isArray) {
	this.value 	= value;
	this.action = action;
	this.key = key;
	this.isArray = isArray;

	this.getValue = function() {
		return this.value;
	},

	this.getAction = function() {
		return this.action;
	},
	
	this.getKey = function() {
		return this.key;
	},

	this.isAddOrRemove = function() {
		return _.isEqual( this.action, COMPARISON.ADD) || _.isEqual( this.action, COMPARISON.REMOVE) ;
	},

	this.isRemoved = function(field) {
		return (_.isEqual( this.action, COMPARISON.ADD) && field == 'value1')
		 || (_.isEqual( this.action, COMPARISON.REMOVE) && field == 'value2')
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
var findDifference = function(json1, json2, key) {
	var result = [];
	var isArray = isArrays(json1, json2);

	if(this.isEmpty(json1) && this.isEmpty(json2)) {
		return new ObjectDifference(result,key, COMPARISON.SAME, isArray);
	}
	
	var keys = _.union( getKeys(json1), getKeys(json2) );

	keys.forEach(function(key){
		var value1 = getValues(json1, key);
		var value2 = getValues(json2, key);
		if(isArray) key = undefined;

		if( _.isObject(value1) || _.isObject(value2) ) 
			result.push( findDifference(value1, value2, key) );
		else if( _.isEqual(value1, value2) )  
			result.push( new Difference(value1, value2, key, COMPARISON.SAME) ); 
		else if( _.isUndefined(value1) ) 
			result.push( new Difference(value1, value2, key, COMPARISON.ADD) ); 
		else if( _.isUndefined(value2) ) 
			result.push( new Difference(value1, value2, key, COMPARISON.REMOVE) ); 
		else 
			result.push( new Difference(value1, value2, key, COMPARISON.CHANGE) ); 
				
	});

	var action = this.getAction(result, json1, json2);
	return new ObjectDifference(result,key, action, isArray);
}

var isArrays = function(object1, object2) {
	if(!_.isUndefined(object1))
		return _.isArray(object1);
	return _.isArray(object2);
}

var isEmpty = function(object) {
	if(_.isUndefined(object))
		return false;
	return _.isEmpty(object);
}

var getAction = function(differences, object1, object2) {
	var actions = _.pluck(differences, "action");
	var uniqueActions = _.uniq(actions);
	var action = uniqueActions.length > 1 ? COMPARISON.MIXED : uniqueActions[0];
	if( _.isUndefined(object1))
		action = COMPARISON.ADD;
	if( _.isUndefined(object2))
		action = COMPARISON.REMOVE;

	return action;
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
