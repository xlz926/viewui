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
		},
		imgClick:function(id, icon){
			return '<img src="'+icon+'" onClick="clickImg('+id+')"/>';			
		}
	});
	
    Date.prototype.format = function(format){
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        };
        if (/(y+)/.test(format)) 
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) 
            if (new RegExp("(" + k + ")").test(format)) 
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    };
	
})();
