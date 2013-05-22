/**
 * @author liezun.xiao
 * @author liezun.xiao@pousheng.com
 */

;(function(){
	jQuery.validator.addMethod("notspecificsymbol", function(value, element) {
		return value ? /^\w+$/.test(value) : true;
	});
	
	jQuery.validator.addMethod("phone", function(value, element) {
		return value ? /^(\+\d+)?(\d{3,4}\-?)?\d{7,8}$/.test(value) || /^\d+$/.test(value) : true;
	});
	
	jQuery.validator.addMethod("mobile", function(value, element) {
		return value ?  /^(\+\d+)?1[3458]\d{9}$/.test(value) || /^\d+$/.test(value) : true;
	});
	jQuery.validator.addMethod("datetime", function(value, element) {
		return value ?  /^(\d{1,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})$/.test(value) : true;
	});
	
})();

