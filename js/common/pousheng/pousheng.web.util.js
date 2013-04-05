


/**
* @author liezun.xiao
*/
 (function($) {

	$.fn.extend({
		//界面初始化
		initUI:function(){
		},
		//判断标签名称
		isTag:function(tn) {
			if(!tn) return false;
			return $(this)[0].tagName.toLowerCase() == tn?true:false;
		},
		//获取此对象下的所有输入内容的值
		getFieldValues:function(successful){
			successful=successful||true;
			var field=this.find("input[type!=submit][type!=button][type!=image],textarea,select");
			 for (var val={}, i=0, max=field.length; i < max; i++) {
			        var el = field[i];
			       	 if($(el).attr("name")){
			    	    val[$(el).attr("name")] = $(el).val();
			       }
			    }
			    return val;
		},
		
		
		/* 异步加载页面
		 * 
		 */
		ajaxLoad:function(url,settings,callback){
			if($.isFunction(settings)){
				callback=settings;
				settings={};
			}
			var that=this;
			var setting=$.extend(true,{type:"POST",cache:false,data:{}},settings||{});
			var load = $.ajax({
				type: setting.type || 'POST',
				url: url,
				data: setting.data,
				cache: setting.cache,
				beforeSend:function(jqXHR, settings){
					that.html($("<div class='loading-mask'>").css({
						width:that.width(),
						heigth:that.height(),
					    display:"block"
					}).append("<div class='loading-mask-msg'>loading</div>"));
					
				},
				success: function(response){
					var result=pousheng.jsonEval(response);
					if (result.statusCode==pousheng.statusCode.error){
						  pousheng.errorMsg(result.message);
					}else if(result.statusCode==pousheng.statusCode.ok&&result.message!=""){
						 pousheng.successMsg(result.message);
					}else{
						that.html(response);
					}
					callback&&callback.call(this);
				},
				error:function(xhr, ajaxOptions, thrownError){
					pousheng.errorMsg(thrownError);
				},
				statusCode: {
					404: function(xhr, ajaxOptions, thrownError) {
						pousheng.errorMsg(404 || thrownError);
					},
				    400:function(xhr, ajaxOptions, thrownError){
				    	pousheng.errorMsg(400 || thrownError);
				    }
				}
			});
			return load;
		},
		ajaxSave:function(){
			
		}
	
	});
	
	$.extend(String.prototype, {
		isPositiveInteger:function(){
			return (new RegExp(/^[1-9]\d*$/).test(this));
		},
		isInteger:function(){
			return (new RegExp(/^\d+$/).test(this));
		},
		isNumber: function(value, element) {
			return (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(this));
		},
		trim:function(){
			return this.replace(/(^\s*)|(\s*$)|\r|\n/g, "");
		},
		startsWith:function (pattern){
			return this.indexOf(pattern) === 0;
		},
		endsWith:function(pattern) {
			var d = this.length - pattern.length;
			return d >= 0 && this.lastIndexOf(pattern) === d;
		},
		replaceSuffix:function(index){
			return this.replace(/\[[0-9]+\]/,'['+index+']').replace('#index#',index);
		},
		trans:function(){
			return this.replace(/&lt;/g, '<').replace(/&gt;/g,'>').replace(/&quot;/g, '"');
		},
		encodeTXT: function(){
			return (this).replaceAll('&', '&amp;').replaceAll("<","&lt;").replaceAll(">", "&gt;").replaceAll(" ", "&nbsp;");
		},
		replaceAll:function(os, ns){
			return this.replace(new RegExp(os,"gm"),ns);
		},
		replaceTm:function($data){
			if (!$data) return this;
			return this.replace(RegExp("({[A-Za-z_]+[A-Za-z0-9_]*})","g"), function($1){
				return $data[$1.replace(/[{}]+/g, "")];
			});
		},
		replaceTmById:function(_box){
			var $parent = _box || $(document);
			return this.replace(RegExp("({[A-Za-z_]+[A-Za-z0-9_]*})","g"), function($1){
				var $input = $parent.find("#"+$1.replace(/[{}]+/g, ""));
				return $input.val() ? $input.val() : $1;
			});
		},
		isFinishedTm:function(){
			return !(new RegExp("{[A-Za-z_]+[A-Za-z0-9_]*}").test(this)); 
		},
		skipChar:function(ch) {
			if (!this || this.length===0) {return '';}
			if (this.charAt(0)===ch) {return this.substring(1).skipChar(ch);}
			return this;
		},
		isValidPwd:function() {
			return (new RegExp(/^([_]|[a-zA-Z0-9]){6,32}$/).test(this)); 
		},
		isValidMail:function(){
			return(new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(this.trim()));
		},
		isSpaces:function() {
			for(var i=0; i<this.length; i+=1) {
				var ch = this.charAt(i);
				if (ch!=' '&& ch!="\n" && ch!="\t" && ch!="\r") {return false;}
			}
			return true;
		},
		isPhone:function() {
			return (new RegExp(/(^([0-9]{3,4}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0-9]{3,4}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{3,8}$)/).test(this));
		},
		isUrl:function(){
			return (new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(this));
		},
		isExternalUrl:function(){
			return this.isUrl() && this.indexOf("://"+document.domain) == -1;
		}
	});
	
	
	

})(jQuery);
 
 
 
 
 
 
 
 /**
  * 单例模式实现全局公共方法
 * @author liezun.xiao
 */
 ;(function ($, window, undefined) {

		function Pousheng() {      
			// 缓存实例     
			var instance;     
			 Pousheng = function Pousheng() {  
			     return instance;   
			 };   
			// 后期处理原型属性
			 Pousheng.prototype = this;   
			  // 重设构造函数指针
			 instance = new Pousheng();   

			 instance.constructor = Pousheng;   
			 instance.statusCode ={};
		     instance.statusCode.ok=200;
		     instance.statusCode.error=400;
		     instance.statusCode.timeout=301;
			 instance.actions={};
			 return instance; 
		}

	 
	 /**
	  * 列表(数组)转换成树结构
	 * @author liezun.xiao
	 */
	  Pousheng.prototype.transformTozTreeFormat=function(sNodes,setting) {
	     var i,l,
	     key =setting? setting.id||"id":"id",
	     parentKey =setting? setting.pId||"pId":"pId",
	     childKey = setting?setting.children||"children":"children";
	     if (!key || key=="" || !sNodes) return [];

	     if ($.isArray(sNodes)) {
	         var r = [];
	         var tmpMap = [];
	         for (i=0, l=sNodes.length; i<l; i++) {
	             tmpMap[sNodes[i][key]] = sNodes[i];
	         }
	         for (i=0, l=sNodes.length; i<l; i++) {
	             if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
	                 if (!tmpMap[sNodes[i][parentKey]][childKey])
	                     tmpMap[sNodes[i][parentKey]][childKey] = [];
	                 tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
	             } else {
	                 r.push(sNodes[i]);
	             }
	         }
	         return r;
	     }else {
	         return [sNodes];
	     }
	 };
	
	 //json格式转换
	 Pousheng.prototype.jsonEval=function(data) {
			try{
				if ($.type(data) == 'string')
					return eval('(' + data + ')');
				else return data;
			} catch (e){
				return {};
			}
		};
	Pousheng.prototype.errorMsg=function(msg,seconds){
		msg=  msg || tipMsg.success;
    	$("<div class='ui_error'>" + msg + "</div>").dialog({"title":tipMsg.title, show: "slow",position:{my: "right", at: "right bottom", of: window}}).dialog("time",seconds||3);
	};
	
    Pousheng.prototype.warnMsg=function(msg,seconds){
    	msg=  msg || tipMsg.success;
    	$("<div>" + msg + "</div>").dialog({"title":tipMsg.title, show: "slow",position:{my: "right", at: "right bottom", of: window}}).dialog("time",seconds||3);
	};
	
	Pousheng.prototype.successMsg=function(msg,seconds){
		msg=  msg || tipMsg.success;
		$("<div class='ui_success'>" +   msg  + "</div>").dialog({"title":tipMsg.title, show: "slow",position:{my: "right", at: "right bottom", of: window}}).dialog("time",seconds||3);
		
	};
	Pousheng.prototype.confirm = function(msg,callback,cancel) {
		msg=  msg || tipMsg.success;
		$("<div>" + msg + "</div>").dialog({modal:true,
			buttons : [ {
				text : btn.ok,
				click : function() {
					if($.isFunction(callback))callback.call(this,true);
					$( this ).dialog( "close" );
					return false;
				}
			},{
				text : btn.cancel,
				click : function() {
					if($.isFunction(cancel)) cancel.call(this,false);
					$( this ).dialog( "close" ); 
					return false;
				}	
			} ]
		});
	};
	
	//动态加载数据
	Pousheng.prototype.ajaxData = function(url, settings,callback) {
		if(!url) return false;
		if($.isFunction(settings)){
			callback=settings;
			settings={};
		}
		
		var setting = $.extend(true, {
			type : "POST",
			cache : false,
			data : {}
		}, settings);
		var load = $.ajax({
			type : setting.type || 'POST',
			dataType:setting.dataType ||"json",
			url : url,
			data : setting.data,
			contentType:setting.contentType||"application/x-www-form-urlencoded",
			cache : setting.cache,
			success : function(response) {
                var result = pousheng.jsonEval(response);
                callback ? callback.call(this,result):"";
                if (result.statusCode == pousheng.statusCode.error) {
                    pousheng.errorMsg(result.message);
                }
                else if (result.statusCode == pousheng.statusCode.ok) {
                        if (result.message != "") {
                            pousheng.successMsg(result.message);
                        }
                    
                    }
			},
			error : function(xhr, ajaxOptions, thrownError) {
				pousheng.errorMsg(thrownError);
			},
			statusCode : {
				404 : function(xhr, ajaxOptions, thrownError) {
					pousheng.errorMsg(404 || thrownError);
				}
			}
		});
		return load;
	};
	//全选方法
	Pousheng.prototype.ckeckAll=function(event,obj,name){
		obj=$(event.target||event.srcElement).closest(obj);
	     
		if($(event.target||event.srcElement).is(":checked")){
			$("input[name='"+name+"']:not(:checked)",obj).attr("checked", true);
		}else{
			$("input:checked[name='"+name+"']",obj).removeAttr("checked");
		}	
	};
	
	
	Pousheng.prototype.ajaxLoad=function(url,settings,callback){
			if($.isFunction(settings)){
				callback=settings;
				settings={};
			}
			setting=$.extend(true,{type:"POST",cache:false,data:{}},settings||{});
            return $.ajax({
                type: setting.type || 'POST',
                url: url,
                data: setting.data,
                cache: setting.cache,
                contentType:setting.contentType||"application/x-www-form-urlencoded",
                success: function(response){
                    var result = pousheng.jsonEval(response);
                    if (result.statusCode == pousheng.statusCode.error) {
                        pousheng.errorMsg(result.message);
                    }
                    else  if (result.statusCode == pousheng.statusCode.ok&&result.message != "") {
                             pousheng.successMsg(result.message);
                        }
				     $.isFunction(callback) ? callback.call(this,response):"";
                },
                error: function(xhr, ajaxOptions, thrownError){
                    pousheng.errorMsg(thrownError);
                },
                statusCode: {
                    404: function(xhr, ajaxOptions, thrownError){
                        pousheng.errorMsg(404 || thrownError);
                    },
                    400: function(xhr, ajaxOptions, thrownError){
                        pousheng.errorMsg(400 || thrownError);
                    }
                }
            });
	};
	Pousheng.prototype.ckeckCancel=function(event,obj,name){
		obj=$(event.target||event.srcElement).closest(obj);
		$("input:checked[name='"+name+"']",obj).removeAttr("checked");
	};
	Pousheng.prototype.HasSelected=function(event,obj,name){
		var result=[];
		obj=$(event.target||event.srcElement).closest(obj);
		$("input:checkbox:checked[name='"+name+"']",obj).each(function(){
			result.push($(this).val());
		});
		return result.toString();
	};
	 Pousheng.prototype.register = function(b, c,d) {
        this.actions[b] = c;
    };
	Pousheng.prototype.execute = function(a, b) {
       return this.actions[a](b);
    };
	Pousheng.prototype.remove=function(a){
		this.actions[a]=null;
	};
	 window.pousheng = $.pousheng =new Pousheng();
	 
 })(jQuery,window);


function StringBuffer(str){
	this._str=[];
	this._str.push(str||[]);
}

StringBuffer.prototype.append=function(str){
	this._str.push(str||[]);
};

StringBuffer.prototype.toString=function(str){
	return  this._str.join("");
};





    
