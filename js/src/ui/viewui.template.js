/**
 * @author liezun.xiao
 * @author liezun.xiao@pousheng.com
 */

;(function(){
	jQuery.views.helpers({
		formatDate : function(value, fmt) {
			if(!value||value=="")return "";
			var date = new Date(value);
			return fmt ? date.format(fmt) : date.format("yyyy-MM-dd hh:mm:ss");
		},
		formatEnum:function(value,test){
			if(arguments[value]){
				return arguments[value];
			}else{
				"";
			}
		},
		formatEnable:function(value){
			if(value==true) {
				return '<span class="badge badge-success">启用</span>';
			} else if(value==false) {
				return '<span class="badge badge-important">停用</span>';
			} else {
				return "";
			}
		},
		stringStartSub:function(start, value){
    		value = value.substring(start, value.length);
			return value;
    	},
		stringSub:function(start, end, value){
    		value = value.substring(start, end, value.length);
			return value;
    	},
    	formatImg:function(value){
			return '<img src="' + value + '" width="40" height="40"/>';
		}/*,
		imgClick:function(id, icon){
			return '<img src="'+icon+'" onClick="clickImg('+id+')"/>';			
		}*/
	});
	
	
})();


