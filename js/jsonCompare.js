var compare = function (json1, json2) {
	var diff1 = {}, diff2 = {};

	var keys = _.union(_.keys(json1), _.keys(json2)) ;
	keys.forEach(function(key){
			
		if( _.isObject(json1[key]) && _.isObject(json2[key]) ) {
			var deepObjectDiffs = compare(json1[key], json2[key]);
			if(! _.isEmpty(deepObjectDiffs[0])) {
			diff1[key] = deepObjectDiffs[0];
			diff2[key] = deepObjectDiffs[1]; 
			}
		}else if ( _.isObject(json1[key]) || _.isObject(json2[key]) || json1[key] != json2[key] ) {
			if(_.has(json1, key)) {
				diff1[key] = json1[key]; 
			}
			if(_.has(json2, key)) {
				diff2[key] = json2[key]; 
			}
		}

	});
	return [diff1, diff2] ;
}
