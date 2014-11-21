var clearText = function() {
	$('.input').val('');
	clearNonInputValues();
};

var diff = function() {
	var input1 = getInput("json1");
	var input2 = getInput("json2");

	clearNonInputValues();			

	if( !input1 || !input2 ) {
		setError("Please enter two jsons to compare");
		return;
	}

	var result1 = convertToJson(input1);
	var result2 = convertToJson(input2);

	if( result1["error"] || result2["error"]) {
		setError(result1["error"],  result2["error"]);
		return;
	}

	var diff = findDifference(result1["json"], result2["json"])

	if(diff.getAction() == COMPARISON.SAME) {
		$('.error1').text("No difference");
	} else {
        $('.result').show();
		$('.output1').append( formateJson1(diff, "value1" ));
		$('.output2').append( formateJson1(diff, "value2" ));
	}
}

var beautify = function() {
	clearNonInputValues();

	var isElementOneProcessed = processElement("json1", "Left");
	var isElementTwoProcessed = processElement("json2", "Right");
	
	if ( ! (isElementOneProcessed || isElementTwoProcessed) ) {
		setError("Give json to format");
	}
}

var processElement = function(elementId, position) {
	var input = getInput(elementId);
	if(input) {
		format(input, elementId, position);
		return true;
	}
	return false;
}

var format = function(object, elementId, position) {
	var result = convertToJson(object);

	if(result["error"]) {
		setError(position + result["error"]);
	}else {
		$('#' + elementId).val(formateJson(result["json"]));
	}

}

var clearNonInputValues = function() {
	clearError();
	clearResult();
}

var setError = function(msg1, msg2) {
	$('.error1').text(msg1);
	$('.error2').text(msg2);
}

var clearError = function() {
	setError("", "");
}

var clearResult = function() {
    $('.result').hide();
	$('.output1').text("");
	$('.output2').text("");
}

var getInput = function(elementId) {
	return $("#"+elementId).val().trim();
}

var convertToJson = function(object) {
	var json; 
	var error  ="";

	try {
		json = JSON.parse(object) ;
	}catch(ex) {
		error =" Json is invalid. Reason: "+ ex +". ";
	}

	return {
		"json"  : json,
		"error" : error
	};	
}
