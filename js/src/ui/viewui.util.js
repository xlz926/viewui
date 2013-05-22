


/**
* @author liezun.xiao
*/
 (function($) {
     var readyMap = $.Callbacks();
     
	$.fn.extend({
		readyfn:function(fn){
			readyMap.add( fn );
		    return this;
		},
		//获取此对象下的所有输入内容的值
		getFieldValues:function(successful){
			successful=successful||true;
			var field=this.find("input[type!=submit][type!=button][type!=image],textarea,select");
			 for (var val={}, i=0, max=field.length; i < max; i++) {
			        var el = field[i];
			       	 if($(el).attr("name")||$(el).attr("id")){
			    	    val[$(el).attr("name")||$(el).attr("id")] = $(el).val();
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
					/*	that.html($("<div class='loading-ajax-mask'>").append($("<div class='loading-ajax-msg'>loading</div>")).position({
							my: "center",
			                at: "center",
			                of:that
						}));*/
				},
				success: function(response){
				
					
					var result=viewui.jsonEval(response);
					
					if(result.statusCode && result.message && result.message != ""){
						viewui.tipAlert(result.statusCode,result.message);
					}
					if($.isEmptyObject(result)){
						that.fadeOut(0).html(response).show();
						readyMap.fireWith(that).empty();
					}
					 callback&&callback.call(that,response);
			
				},
				error:function(xhr, ajaxOptions, thrownError){
					viewui.errorMsg(thrownError);
				},
				statusCode: {
					404: function(xhr, ajaxOptions, thrownError) {
						viewui.errorMsg(404 || thrownError);
					},
				    400:function(xhr, ajaxOptions, thrownError){
				    	viewui.errorMsg(400 || thrownError);
				    }
				}
			});
			return load;
		}
	
	});


})(jQuery);
 
 
 
 ;(function ($, window, undefined){
	 //常用字符串函数扩展
	 $.extend(String.prototype,{
	        format:function(b){
	        	 var a = this,
                    i = 0,
                len = arguments.length;

                for(;i < len; i++) {
                    a = a.replace(RegExp("\\{" + i + "\\}", "g"), arguments[i]);
                };
                return a;
	        },
	        append:function(){
	            return 	this+str;
	        }
      });
  
 })(jQuery,window,undefined);
 
 
 
 
 
 
 /**
  * 单例模式实现全局公共方法
 * @author liezun.xiao
 */
 ;(function ($, window, undefined) {

	 
	 
	 
	 //公用函数
		function Viewui() {      
			// 缓存实例     
			var instance;     
			 Viewui = function Viewui() {  
			     return instance;   
			 };   
			// 后期处理原型属性
			 Viewui.prototype = this;   
			  // 重设构造函数指针
			 instance = new Viewui();   

			 instance.constructor = Viewui;   
			 instance.statusCode ={};
		     instance.statusCode.ok=2000;//请求成功
		     instance.statusCode.error=4000;//请求失败
		     instance.statusCode.timeout=202;//请求超时
			 instance.statusCode.warn=3000;//请求超时
			 instance.statusCode.prompt=5000;
		     instance.actions={};
		     instance.uniqueId=0;
		     instance.Nav={};      //系统导航
		     instance.zIndex=1000;
			 
			 instance.tipHeight=0; //系统提示
			 return instance; 
		}

	 Viewui.prototype.getNextId=function(prev){
		 
		 return (prev||"viewui_")+this.uniqueId++;
	 }
	 Viewui.prototype.getZIndex=function(){
		 return this.zIndex++;
	 }
	 /**
	  * 列表(数组)转换成树结构
	 * @author liezun.xiao
	 */
	  Viewui.prototype.transformTozTreeFormat=function(sNodes,setting) {
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
	 Viewui.prototype.jsonEval=function(data) {
			try{
				if ($.type(data) == 'string')
					return eval('(' + data + ')');
				else return data;
			} catch (e){
				return {};
			}
		};
	Viewui.prototype.errorMsg=function(msg,second){
    	this.tip(msg,"出错啦! ",second,"alert-error");
	};
	
    Viewui.prototype.warnMsg=function(msg,second){
    	this.tip(msg,"警告信息!",second,"alert-info");
	};
	
	Viewui.prototype.successMsg=function(msg,second){
         	this.tip(msg,"成功提示!",second,"alert-success");
	};
	Viewui.prototype.tip=function(content,title,second,cls){
        var that =this;
        var timeout;
	    var  tip =	$('<div class="alert alert-block">').addClass(cls).css({
	    	position:"fixed",
	    	bottom:this.tipHeight,
	    	 right:0,
	    	 width:200,
	    	 "margin-bottom":0,
	    	 "z-index":1000000
	    	}).appendTo("body");
	    $(' <button type="button" class="close">&times;</button>').click(function(){
	    	that.tipHeight-=tip.outerHeight(true);
	    	 tip.slideUp(function(){
	                    	tip.remove();
	                    });
	    }).appendTo(tip);
	    tip.append($("<h4>").text(title)).append(content).slideDown();
	    this.tipHeight+=tip.outerHeight(true);
	    
		timeout = setTimeout(tipHide, 1000 * (second||5));
		
		tip.mouseenter(function(){
			timeout&& clearTimeout(timeout);
		}).mouseleave(function(){
			timeout = setTimeout(tipHide, 1000 * (second||5));
		});
		function tipHide(){   
			  that.tipHeight = that.tipHeight-tip.outerHeight(true)<0?0:that.tipHeight-tip.outerHeight(true);
	          tip.slideUp(function(){tip.remove();});
	      }
		
	};
	
	Viewui.prototype.alert=function(msg){
         	$("<div>").modal({
         		singleSelect:true,
				newwinBtn:false,
				minBtn:false,
				width:250,
				height:150,
				title:"消息提示",
				resizable:false,
				buttons : [ {
				text : btn.ok,
				cls:"btn-success",
				click : function() {
					$( this ).modal( "close" );
				}
			}]
         		
         	}).html(msg);
	};
	
	///服务端系统提示
	Viewui.prototype.tipAlert=function(statusCode,msg){
			if(statusCode&&msg&&msg!=""){
				   switch(statusCode){
							case this.statusCode.error:
								 this.errorMsg(msg);
								break;
							case this.statusCode.warn:
								 this.warnMsg(msg);
								break;
							case this.statusCode.ok:
								 this.successMsg(msg);
								break;
				}
			}
		
	}
	
	Viewui.prototype.confirm = function(msg,callback,cancel) {
		msg=  msg || tipMsg.success;
		$("<div>" + msg + "</div>").modal({
			singleSelect:true,
				newwinBtn:false,
				minBtn:false,
				width:250,
				height:150,
				title:"消息提示",
				resizable:false,
			buttons : [ {
				text : btn.ok,
				cls:"btn-success",
				click : function() {
					if($.isFunction(callback))callback.call(this,true);
					$( this ).modal( "close" );
					return false;
				}
			},{
				text : btn.cancel,
				click : function() {
					if($.isFunction(cancel)) cancel.call(this,false);
					$( this ).modal( "close" ); 
					return false;
				}	
			} ]
		});
	};
	
	//动态加载数据
	Viewui.prototype.ajaxData = function(url, settings,callback) {
		if(!url) return false;
		if($.isFunction(settings)){
			callback=settings;
			settings={};
		}
		settings=settings||{};
		var load = $.ajax({
			type : settings.type || 'POST',
			dataType:settings.dataType ||"json",
			url : url,
			data : settings.data||{},
			async:settings.async==undefined?true:false,
			contentType:settings.contentType||"application/x-www-form-urlencoded",
			cache : settings.cache||false,
			success : function(response) {
                var result = viewui.jsonEval(response);
					if(result.statusCode && result.message && result.message != ""){
						viewui.tipAlert(result.statusCode,result.message);
					}
					callback&&callback(response);
			},
			error : function(xhr, ajaxOptions, thrownError) {
				viewui.errorMsg(thrownError);
			},
			statusCode : {
				404 : function(xhr, ajaxOptions, thrownError) {
					viewui.errorMsg(404 || thrownError);
				}
			}
		});
		return load;
	};
	//全选方法
	Viewui.prototype.ckeckAll=function(event,obj,name){
		obj=$(event.target||event.srcElement).closest(obj);
	     
		if($(event.target||event.srcElement).is(":checked")){
			$("input[name='"+name+"']:not(:checked)",obj).attr("checked", true);
		}else{
			$("input:checked[name='"+name+"']",obj).removeAttr("checked");
		}	
	};

	Viewui.prototype.ckeckCancel=function(event,obj,name){
		obj=$(event.target||event.srcElement).closest(obj);
		$("input:checked[name='"+name+"']",obj).removeAttr("checked");
	};
	Viewui.prototype.HasSelected=function(event,obj,name){
		var result=[];
		obj=$(event.target||event.srcElement).closest(obj);
		$("input:checkbox:checked[name='"+name+"']",obj).each(function(){
			result.push($(this).val());
		});
		return result.toString();
	};
	
	Viewui.prototype.getUrlParams= function(url) {
		var vars = [], hash;
		var geturl = url||window.location.href;
		var hashes = geturl.substring(geturl.indexOf('?') + 1, geturl.length)
				.split('&');
		for ( var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
    }; 
	Viewui.prototype.getUrlParam=function(name,url){
		return this.getUrlParams()[name];
		
	};
	
	Viewui.prototype.addMethod=function(name,func){
		if(!Viewui.prototype[name]){
			Viewui.prototype[name]=func;
		}
		
	}
	
	
	 window.viewui = $.viewui =new Viewui();
	 
 })(jQuery,window,undefined);




    
