


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
				
					
					var result=pousheng.jsonEval(response);
					
					if(result.statusCode && result.message && result.message != ""){
						pousheng.tipAlert(result.statusCode,result.message);
					}
					if($.isEmptyObject(result)){
						that.fadeOut(0).html(response).show("blind");
						that.triggerHandler("_ready",[that]);
						readyMap.fireWith(that).empty();
					}
					 callback&&callback.call(that,response);
			
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

	 Pousheng.prototype.getNextId=function(prev){
		 
		 return (prev||"pousheng_")+this.uniqueId++;
	 }
	 Pousheng.prototype.getZIndex=function(){
		 return this.zIndex++;
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
	Pousheng.prototype.errorMsg=function(msg,second){
    	this.tip(msg,"出错啦! ",second,"alert-error");
	};
	
    Pousheng.prototype.warnMsg=function(msg,second){
    	this.tip(msg,"警告信息!",second,"alert-info");
	};
	
	Pousheng.prototype.successMsg=function(msg,second){
         	this.tip(msg,"成功提示!",second,"alert-success");
	};
	Pousheng.prototype.tip=function(content,title,second,cls){
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
	
	Pousheng.prototype.alert=function(msg){
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
	Pousheng.prototype.tipAlert=function(statusCode,msg){
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
	
	Pousheng.prototype.confirm = function(msg,callback,cancel) {
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
					if(result.statusCode && result.message && result.message != ""){
						pousheng.tipAlert(result.statusCode,result.message);
					}
					callback&&callback(response);
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
	
	Pousheng.prototype.getUrlParams= function(url) {
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
	Pousheng.prototype.getUrlParam=function(name,url){
		return this.getUrlParams()[name];
		
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





    

; (function ($) {
    $.widget("ui.panel", {
         options: {
            title: null,
            iconCls: null,
            width: 'auto',
            height: 'auto',
            left: null,
            top: null,
            cls: null,
            headerCls: null,
            bodyCls: null,
            style: {},
            fit: false,
            border: true,
            doSize: true, // true to set size and do layout


            resizable:false,
			draggable:false,
            collapsible: false,
            minimizable: false,
            maximizable: false,
            closable: false,
            collapsed: false,
            minimized: false,
            maximized: false,
            closed: false,

            // custom tools, every tool can contain two properties: iconCls and handler
            // iconCls is a icon CSS class
            // handler is a function, which will be run when tool button is clicked
            tools: [],

            href: null,
            loadingMessage: 'Loading...',
            onLoad: function () { },
            onBeforeOpen: function () { },
            onOpen: function () { },
            onBeforeClose: function () { },
            onClose: function () { },
            onBeforeDestroy: function () { },
            onDestroy: function () { },
            onResize: function (width, height) { },
            onMove: function (left, top) { },
            onMaximize: function () { },
            onRestore: function () { },
            onMinimize: function () { },
            onBeforeCollapse: function () { },
            onBeforeExpand: function () { },
            onCollapse: function () { },
            onExpand: function () { }
        },
        _create: function () {
            var t = this.element;
            this.opts = this.options;
            var state;
            $.extend(this.opts, {
                width: (parseInt(t.css('width')) || this.opts.width),
                height: (parseInt(t.css('height')) || this.opts.height),
                left: (parseInt(t.css('left')) || this.opts.left),
                top: (parseInt(t.css('top')) || this.opts.top),
                title: (t.attr('title') || this.opts.title),
                iconCls: t.attr('icon') || this.opts.icon,
                href: t.attr('href') || this.opts.href,
                style: t.attr('style') || this.opts.style,
                fit: t.attr('fit') || this.opts.fit,
                border: (t.attr('border') || this.opts.border),
				headerCls:(t.attr('headerCls') || this.opts.headerCls),
                collapsible: (t.attr('collapsible') || this.opts.collapsible),
                minimizable: (t.attr('minimizable') || this.opts.minimizable),
                maximizable: (t.attr('maximizable') || this.opts.maximizable),
                closable: (t.attr('closable') || this.opts.closable),
                collapsed: (t.attr('collapsed') || this.opts.collapsed),
                minimized: (t.attr('minimized') || this.opts.minimized),
                maximized: (t.attr('maximized') || this.opts.maximized),
                closed: t.attr('closed') || this.opts.closed
            });

          this.wrapPanel=this._wrapPanel(this.element);
           state = $.data(this.element, 'panel', {
                options: this.opts,
                panel: this.wrapPanel,
                isLoaded: false
            });
           
          

            this._addHeader(this.element);
            this._setBorder(this.element);
            this._loadData(this.element);

            if (this.opts.doSize == true) {
                this._setSize(this.element);
            }
       
            if (this.opts.closed == true||this.opts.closed =="true") {
                state.panel.hide();
            } else {
                this._openPanel(this.element);
                if (this.opts.maximized == true) this._maximizePanel(this.element);
                if (this.opts.minimized == true) this._minimizePanel(this.element);
                if (this.opts.collapsed == true) this._collapsePanel(this.element);
            }

            this._setProperties();

        },
        _setSize: function (target, param) {
            var opts = $.data(target, 'panel').options;
            var panel = $.data(target, 'panel').panel;
            var pheader = panel.find('>div.panel-header');
            var pbody = panel.find('>div.panel-body');

             panel.attr("style",opts.style);
            if (param) {
                if (param.width) opts.width = param.width;
                if (param.height) opts.height = param.height;
                if (param.left != null) opts.left = param.left;
                if (param.top != null) opts.top = param.top;
            }

            if (opts.fit == true) {
                var p = panel.parent();
                opts.width = p.innerWidth();
                opts.height = p.innerHeight();
            }
            panel.css({
                left: opts.left,
                top: opts.top
            });
            
       
            //panel.css(opts.style);
            panel.addClass(opts.cls);
            pheader.addClass(opts.headerCls);
            pbody.addClass(opts.bodyCls);

            if (!isNaN(opts.width)) {
                if ($.boxModel == true) {
                    panel.width(opts.width - (panel.outerWidth() - panel.width()));
                    pheader.width(panel.width() - (pheader.outerWidth() - pheader.width()));
                    pbody.width(panel.width() - (pbody.outerWidth() - pbody.width()));
                   // panel.animate({width:(opts.width - (panel.outerWidth() - panel.width()))});
                   // pheader.animate({width:(panel.width() - (pheader.outerWidth() - pheader.width()))})
                   // pheader.animate({width:(panel.width() - (pbody.outerWidth() - pbody.width()))});

                } else {
                   // panel.animate({width:opts.width});
                    // pheader.animate({width:panel.width()})
                   // pbody.animate({width:panel.width()});
 
                  // panel.width(opts.width);
                 // pheader.width(panel.width());
                   //pbody.width(panel.width());

                    panel.width(opts.width - (panel.outerWidth() - panel.width()));
                    pheader.width(panel.width() - (pheader.outerWidth() - pheader.width()));
                    pbody.width(panel.width() - (pbody.outerWidth() - pbody.width()));
               
                }
            } else {
                panel.width('auto');
                pbody.width('auto');
            }
            if (!isNaN(opts.height)) {
                //			var height = opts.height - (panel.outerHeight()-panel.height()) - pheader.outerHeight();
                //			if ($.boxModel == true){
                //				height -= pbody.outerHeight() - pbody.height();
                //			}
                //			pbody.height(height);

                if ($.boxModel == true) {
                  //  panel.height(opts.height - (panel.outerHeight() - panel.height()));
                    pbody.height(opts.height - pheader.outerHeight() - (pbody.outerHeight() - pbody.height()));
                } else {
                   // panel.height(opts.height);
                   // pbody.height(panel.height() - pheader.outerHeight());

                   // panel.height(opts.height - (panel.outerHeight() - panel.height()));
                    pbody.height(opts.height  - pheader.outerHeight() - (pbody.outerHeight() - pbody.height()));
                }
            } else {
                pbody.height('auto');
            }
            panel.css('height', 'auto');

            opts.onResize.apply(target, [opts.width, opts.height]);

            panel.find('>div.panel-body>div').triggerHandler('_resize');
        },
        _addHeader: function (target) {
            var opts = $.data(target, 'panel').options;
            var panel = $.data(target, 'panel').panel;
            var that = this;
            panel.find('>div.panel-header').remove();
            if (opts.title) {
                var header = $('<div class="panel-header"><div class="panel-title">' + opts.title + '</div></div>').prependTo(panel);
                if (opts.iconCls) {
                    header.find('.panel-title').addClass('panel-with-icon');
                    $('<div class="panel-icon"></div>').addClass(opts.iconCls).appendTo(header);
                }
                var tool = $('<div class="panel-tool"></div>').appendTo(header);
                if (opts.closable) {
                    $('<i class="panel-tool-close"></i>').appendTo(tool).bind('click', onClose);
                }
                if (opts.maximizable) {
                    $('<i class="panel-tool-max"></i>').appendTo(tool).bind('click', onMax);
                }
                if (opts.minimizable) {
                    $('<i class="panel-tool-min"></i>').appendTo(tool).bind('click', onMin);
                }
                if (opts.collapsible) {
                    $('<i class="panel-tool-collapse"></i>').appendTo(tool).bind('click', onToggle);
                }
                if (opts.tools) {
                    for (var i = opts.tools.length - 1; i >= 0; i--) {
                        var t = $('<a></a>').addClass(opts.tools[i].iconCls).appendTo(tool);
                        if (opts.tools[i].handler) {
                            t.bind('click', eval(opts.tools[i].handler));
                        }
                    }
                }
                tool.find('div').hover(
				function () { $(this).addClass('panel-tool-over'); },
				function () { $(this).removeClass('panel-tool-over'); }
			);
                panel.find('>div.panel-body').removeClass('panel-body-noheader');
            } else {
                panel.find('>div.panel-body').addClass('panel-body-noheader');
            }

            function onToggle() {
                if ($(this).hasClass('panel-tool-expand')) {
                    that._expandPanel(target, true);
                } else {
                    that._collapsePanel(target, true);
                }
                return false;
            }

            function onMin() {
                that._minimizePanel(target);
                return false;
            }

            function onMax() {
                if ($(this).hasClass('panel-tool-restore')) {
                    that._restorePanel(target);
                } else {
                    that._maximizePanel(target);
                }
                return false;
            }

            function onClose() {
                that._closePanel(target);
                return false;
            }

        },

        /**
        * load content from remote site if the href attribute is defined
        */
        _loadData: function (target) {
            var state = $.data(target, 'panel');
            if (state.options.href && !state.isLoaded) {
                state.isLoaded = false;
                var pbody = state.panel.find('>.panel-body');
                pbody.html($('<div class="panel-loading"></div>').html(state.options.loadingMessage));
                pbody.load(state.options.href, null, function () {
                    if ($.parser) {
                        $.parser.parse(pbody);
                    }
                    state.options.onLoad.apply(target, arguments);
                    state.isLoaded = true;
                });
            }
        },

        _openPanel: function (target, forceOpen) {
            var opts = $.data(target, 'panel').options;
            var panel = $.data(target, 'panel').panel;

            if (forceOpen != true) {
                if (opts.onBeforeOpen.call(target) == false) return;
            }
            panel.show();
            opts.closed = false;
            opts.onOpen.call(target);
        },

        _closePanel: function (target, forceClose) {
            var opts = $.data(target, 'panel').options;
            var panel = $.data(target, 'panel').panel;

            if (forceClose != true) {
                if (opts.onBeforeClose.call(target) == false) return;
            }
            panel.hide();
            opts.closed = true;
            opts.onClose.call(target);
        },

        _destroyPanel: function (target, forceDestroy) {
            var opts = $.data(target, 'panel').options;
            var panel = $.data(target, 'panel').panel;

            if (forceDestroy != true) {
                if (opts.onBeforeDestroy.call(target) == false) return;
            }
            panel.remove();
            opts.onDestroy.call(target);
        },

        _collapsePanel: function (target, animate) {
            var opts = $.data(target, 'panel').options;
            var panel = $.data(target, 'panel').panel;
            if (opts.onBeforeCollapse.call(target) == false) return;

            panel.find('>div.panel-header .panel-tool-collapse').addClass('panel-tool-expand');
            if (animate == true) {
                panel.find('>div.panel-body').slideUp('normal', function () {
                    opts.collapsed = true;
                    opts.onCollapse.call(target);
                });
            } else {
                panel.find('>div.panel-body').hide();
                opts.collapsed = true;
                opts.onCollapse.call(target);
            }
        },

        _expandPanel: function (target, animate) {
            var opts = $.data(target, 'panel').options;
            var panel = $.data(target, 'panel').panel;
            if (opts.onBeforeExpand.call(target) == false) return;

            panel.find('>div.panel-header .panel-tool-collapse').removeClass('panel-tool-expand');
            if (animate == true) {
                panel.find('>div.panel-body').slideDown('normal', function () {
                    opts.collapsed = false;
                    opts.onExpand.call(target);
                });
            } else {
                panel.find('>div.panel-body').show();
                opts.collapsed = false;
                opts.onExpand.call(target);
            }
        },

        _maximizePanel: function (target) {
            var opts = $.data(target, 'panel').options;
            var panel = $.data(target, 'panel').panel;
            panel.find('>div.panel-header .panel-tool-max').addClass('panel-tool-restore');
            $.data(target, 'panel').original = {
                width: opts.width,
                height: opts.height,
                left: opts.left,
                top: opts.top,
                fit: opts.fit
            };
            opts.left = 0;
            opts.top = 0;
            opts.fit = true;
            setSize(target);
            opts.minimized = false;
            opts.maximized = true;
            opts.onMaximize.call(target);
        },

        _minimizePanel: function (target) {
            var opts = $.data(target, 'panel').options;
            var panel = $.data(target, 'panel').panel;
            panel.hide();
            opts.minimized = true;
            opts.maximized = false;
            opts.onMinimize.call(target);
        },

        _restorePanel: function (target) {
            var opts = $.data(target, 'panel').options;
            var panel = $.data(target, 'panel').panel;
            panel.show();
            panel.find('>div.panel-header .panel-tool-max').removeClass('panel-tool-restore');
            var original = $.data(target, 'panel').original;
            opts.width = original.width;
            opts.height = original.height;
            opts.left = original.left;
            opts.top = original.top;
            opts.fit = original.fit;
            setSize(target);
            opts.minimized = false;
            opts.maximized = false;
            opts.onRestore.call(target);
        },
        _setBorder: function (target) {
            var opts = $.data(target, 'panel').options;
            var panel = $.data(target, 'panel').panel;
            if (opts.border == true) {
                panel.find('>div.panel-header').removeClass('panel-header-noborder');
                panel.find('>div.panel-body').removeClass('panel-body-noborder');
            } else {
                panel.find('>div.panel-header').addClass('panel-header-noborder');
                panel.find('>div.panel-body').addClass('panel-body-noborder');
            }
        },
        _wrapPanel: function (target) {
            var panel = target.addClass('panel-body').wrap('<div class="panel"></div>').parent();
			var that=this;
            panel.bind('_resize', function () {
                var opts = $.data(target, 'panel');
                if (opts.fit == true) {
                    that._setSize(target);
                }
                return false;
            });
            if(this.opts.style){
                panel.attr("style",this.opts.style);
                this.element.removeAttr("style");
            }
            return panel;
        },
        _closePanel:function (target, forceClose){
		    var opts = $.data(target, 'panel').options;
		    var panel = $.data(target, 'panel').panel;
		
		    if (forceClose != true){
			    if (opts.onBeforeClose.call(target) == false) return;
		    }
		    panel.hide();
		    opts.closed = true;
		    opts.onClose.call(target);
	    },
        _openPanel:function(target, forceOpen){
            var opts = $.data(target, 'panel').options;
		    var panel = $.data(target, 'panel').panel;
		
		    if (forceOpen != true){
			    if (opts.onBeforeOpen.call(target) == false) return;
		    }
		    panel.show();
		    opts.closed = false;
		    opts.onOpen.call(target);
        },
        _destroyPanel:function (target, forceDestroy){
		    var opts = $.data(target, 'panel').options;
		    var panel = $.data(target, 'panel').panel;
		
		    if (forceDestroy != true){
			    if (opts.onBeforeDestroy.call(target) == false) return;
		    }
		    panel.remove();
		    opts.onDestroy.call(target);
	   },
        _setProperties:function(){
           var that=this;
			if(this.opts.resizable){
                var opts = $.extend(true,{
                stop:function(event,ui){
                  that._setSize(that.element,ui.size);
                }},
                this.opts.resizable);

				this.wrapPanel.resizable(opts);
			}
            if(this.opts.draggable){
                var opts = $.extend({handle:this.header()},this.opts.draggable);
				this.wrapPanel.draggable(opts);
			}
		},

        panel: function () {
            return this.wrapPanel;
        },
        open: function (param) {
            this._openPanel(this.element, param);
        },
        close:function(param){
           this._closePanel(this.element, param);
        },
        resize:function(param){
           this._setSize(this.element, param);
        },
        header:function(){
            return this.wrapPanel.find('>div.panel-header');
        },
        getOptions:function(){
            return this.opts;
        },
        collapse:function(){
        
        },
        destroy: function () {
          // this._destroyPanel(this.element, param);
        }
    });
}(jQuery));
(function ($) {
    $.widget("ui.layout", {
        options: {
        	fit:true
    },
    _create: function () {
        $.data(this.element, 'layout', {
            options: this.options,
            panels: this._inits(this.element)
        });
        this._bindEvents(this.element);
        this._setSize(this.element);
    },
    _setSize: function (container) {
        var that = this;
        var opts = $.data(container, 'layout').options;
        var panels = $.data(container, 'layout').panels;

        var cc = $(container);

        if (opts.fit == true) {
            var p = cc.parent();
            cc.width(p.width()).height(p.height());
        }

        var cpos = {
            top: 0,
            left: 0,
            width: cc.width(),
            height: cc.height()
        };

        // set north panel size
        function setNorthSize(pp) {
            if (pp.length == 0) return;
            pp.panel('resize', {
                width: cc.width(),
                height: pp.panel('getOptions').height,
                left: 0,
                top: 0
            });
            cpos.top += pp.panel('getOptions').height;
            cpos.height -= pp.panel('getOptions').height;
        }
        if (that._isVisible(panels.expandNorth)) {
            setNorthSize(panels.expandNorth);
        } else {
            setNorthSize(panels.north);
        }

        // set south panel size
        function setSouthSize(pp) {
            if (pp.length == 0) return;
            pp.panel('resize', {
                width: cc.width(),
                height: pp.panel('getOptions').height,
                left: 0,
                top: cc.height() - pp.panel('getOptions').height
            });
            cpos.height -= pp.panel('getOptions').height;
        }
        if (that._isVisible(panels.expandSouth)) {
            setSouthSize(panels.expandSouth);
        } else {
            setSouthSize(panels.south);
        }

        // set east panel size
        function setEastSize(pp) {
            if (pp.length == 0) return;
            pp.panel('resize', {
                width: pp.panel('getOptions').width,
                height: cpos.height,
                left: cc.width() - pp.panel('getOptions').width,
                top: cpos.top
            });
            cpos.width -= pp.panel('getOptions').width;
        }
        if (that._isVisible(panels.expandEast)) {
            setEastSize(panels.expandEast);
        } else {
            setEastSize(panels.east);
        }

        // set west panel size
        function setWestSize(pp) {
            if (pp.length == 0) return;
            pp.panel('resize', {
                width: pp.panel('getOptions').width,
                height: cpos.height,
                left: 0,
                top: cpos.top
            });
            cpos.left += pp.panel('getOptions').width;
            cpos.width -= pp.panel('getOptions').width;
        }
        if (that._isVisible(panels.expandWest)) {
            setWestSize(panels.expandWest);
        } else {
            setWestSize(panels.west);
        }

        panels.center.panel('resize', cpos);

    },
    _inits: function (container) {
        var cc = $(container);
        var that = this;
        if (cc[0].tagName == 'BODY') {
            $('html').css({
                height: '100%',
                overflow: 'hidden'
            });
            $('body').css({
                height: '100%',
                overflow: 'hidden',
                border: 'none'
            });
        }
        cc.addClass('layout');
        cc.css({
            margin: 0,
            padding: 0
        });


        function createPanel(dir) {
            var pp = $('>div[region=' + dir + ']', container).addClass('layout-body');

            var toolCls = null;
            if (dir == 'north') {
                toolCls = 'icon-arrow-up';
            } else if (dir == 'south') {
                toolCls = 'icon-arrow-down';
            } else if (dir == 'east') {
                toolCls = 'icon-arrow-right';
            } else if (dir == 'west') {
                toolCls = 'icon-arrow-left';
            }

            var cls = 'layout-panel layout-panel-' + dir;
            if (pp.attr('split') == 'true') {
                cls += ' layout-split-' + dir;
            }
            pp.panel({
                cls: cls,
                doSize: false,
                border: (pp.attr('border') == 'false' ? false : true),
                tools: [{
                    iconCls: toolCls
                }]
            });

            if (pp.attr('split') == 'true') {
                var panel = pp.panel('panel');

                var handles = '';
                if (dir == 'north') handles = 's';
                if (dir == 'south') handles = 'n';
                if (dir == 'east') handles = 'w';
                if (dir == 'west') handles = 'e';

                panel.resizable({
                    handles: handles,
                    helper: "resizable-helper",
                    stop: function (event, ui) {
                        var opts = pp.panel('getOptions');
                        opts.width = ui.helper.outerWidth();
                        opts.height = ui.helper.outerHeight();
                        opts.left = panel.css('left');
                        opts.top = panel.css('top');
                        pp.panel('resize', opts);
                        that._setSize(container);

                    }
                });
            }
            return pp;
        }


        var panels = {
            center: createPanel('center')
        };

        panels.north = createPanel('north');
        panels.south = createPanel('south');
        panels.east = createPanel('east');
        panels.west = createPanel('west');

        $(container).bind('_resize', function () {
        	
            var opts = $.data(container, 'layout').options;
            if (opts.fit == true) {
               that._setSize(container);
            }
            return false;
        });
        $(window).resize(function () {
            //that._setSize(container);
        });

        return panels;
    },
    _bindEvents: function (container) {
        var panels = $.data(container, 'layout').panels;
        var that = this;
        var cc = $(container);

        function createExpandPanel(dir) {
            var icon;
            if (dir == 'east') icon = 'icon-arrow-left'
            else if (dir == 'west') icon = 'icon-arrow-right'
            else if (dir == 'north') icon = 'icon-arrow-down'
            else if (dir == 'south') icon = 'icon-arrow-up';

            return $('<div></div>').appendTo(cc).panel({
                cls: 'layout-expand',
                title: '&nbsp;',
                closed: true,
                doSize: false,
                tools: [{ iconCls: icon}]
            });
        }

        // bind east panel events
        if (panels.east.length) {
            panels.east.panel('panel').bind('mouseover', 'east', collapsePanel);
            panels.east.panel('header').find('.icon-arrow-right').click(function () {
                panels.center.panel('resize', {
                    width: panels.center.panel('getOptions').width + panels.east.panel('getOptions').width - 28
                });
                panels.east.panel('panel').animate({ left: cc.width() }, function () {
                    panels.east.panel('close');
                    panels.expandEast.panel('open').panel('resize', {
                        top: panels.east.panel('getOptions').top,
                        left: cc.width() - 28,
                        width: 28,
                        height: panels.east.panel('getOptions').height
                    });
                });
                if (!panels.expandEast) {
                    panels.expandEast = createExpandPanel('east');
                    panels.expandEast.panel('panel').click(function () {
                        panels.east.panel('open').panel('resize', { left: cc.width() });
                        panels.east.panel('panel').animate({
                            left: cc.width() - panels.east.panel('getOptions').width
                        });
                        return false;
                    }).hover(
						function () { $(this).addClass('layout-expand-over'); },
						function () { $(this).removeClass('layout-expand-over'); }
					);
                    panels.expandEast.panel('header').find('.icon-arrow-left').click(function () {
                        panels.expandEast.panel('close');
                        panels.east.panel('panel').stop(true, true);
                        panels.east.panel('open').panel('resize', { left: cc.width() });
                        panels.east.panel('panel').animate({
                            left: cc.width() - panels.east.panel('getOptions').width
                        }, function () {
                            that._setSize(container);
                        });
                        return false;
                    });
                }
                return false;
            });
        }

        // bind west panel events
        if (panels.west.length) {
            panels.west.panel('panel').bind('mouseover', 'west', collapsePanel);
            panels.west.panel('header').find('.icon-arrow-left').click(function () {
                panels.center.panel('resize', {
                    width: panels.center.panel('getOptions').width + panels.west.panel('getOptions').width - 28,
                    left: 28
                });
                panels.west.panel('panel').animate({ left: -panels.west.panel('getOptions').width }, function () {
                    panels.west.panel('close');
                    panels.expandWest.panel('open').panel('resize', {
                        top: panels.west.panel('getOptions').top,
                        left: 0,
                        width: 28,
                        height: panels.west.panel('getOptions').height
                    });
                });
                if (!panels.expandWest) {
                    panels.expandWest = createExpandPanel('west');
                    panels.expandWest.panel('panel').click(function () {
                        panels.west.panel('open').panel('resize', { left: -panels.west.panel('getOptions').width });
                        panels.west.panel('panel').animate({
                            left: 0
                        });
                        return false;
                    }).hover(
						function () { $(this).addClass('layout-expand-over'); },
						function () { $(this).removeClass('layout-expand-over'); }
					);
                    panels.expandWest.panel('header').find('.icon-arrow-right').click(function () {
                        panels.expandWest.panel('close');
                        panels.west.panel('panel').stop(true, true);
                        panels.west.panel('open').panel('resize', { left: -panels.west.panel('getOptions').width });
                        panels.west.panel('panel').animate({
                            left: 0
                        }, function () {
                            that._setSize(container);
                        });
                        return false;
                    });
                }
                return false;
            });
        }

        // bind north panel events
        if (panels.north.length) {
            panels.north.panel('panel').bind('mouseover', 'north', collapsePanel);
            panels.north.panel('header').find('.icon-arrow-up').click(function () {
                var hh = cc.height() - 28;
                if (that._isVisible(panels.expandSouth)) {
                    hh -= panels.expandSouth.panel('getOptions').height;
                } else if (that._isVisible(panels.south)) {
                    hh -= panels.south.panel('getOptions').height;
                }
                panels.center.panel('resize', { top: 28, height: hh });
                panels.east.panel('resize', { top: 28, height: hh });
                panels.west.panel('resize', { top: 28, height: hh });
                if (that._isVisible(panels.expandEast)) panels.expandEast.panel('resize', { top: 28, height: hh });
                if (that._isVisible(panels.expandWest)) panels.expandWest.panel('resize', { top: 28, height: hh });

                panels.north.panel('panel').animate({ top: -panels.north.panel('getOptions').height }, function () {
                    panels.north.panel('close');
                    panels.expandNorth.panel('open').panel('resize', {
                        top: 0,
                        left: 0,
                        width: cc.width(),
                        height: 28
                    });
                });
                if (!panels.expandNorth) {
                    panels.expandNorth = createExpandPanel('north');
                    panels.expandNorth.panel('panel').click(function () {
                        panels.north.panel('open').panel('resize', { top: -panels.north.panel('getOptions').height });
                        panels.north.panel('panel').animate({ top: 0 });
                        return false;
                    }).hover(
						function () { $(this).addClass('layout-expand-over'); },
						function () { $(this).removeClass('layout-expand-over'); }
					);
                    panels.expandNorth.panel('header').find('.icon-arrow-down').click(function () {
                        panels.expandNorth.panel('close');
                        panels.north.panel('panel').stop(true, true);
                        panels.north.panel('open').panel('resize', { top: -panels.north.panel('getOptions').height });
                        panels.north.panel('panel').animate({ top: 0 }, function () {
                            that._setSize(container);
                        });
                        return false;
                    });
                }
                return false;
            });
        }

        // bind south panel events
        if (panels.south.length) {
            panels.south.panel('panel').bind('mouseover', 'south', collapsePanel);
            panels.south.panel('header').find('.icon-arrow-down').click(function () {
                var hh = cc.height() - 28;
                if (that._isVisible(panels.expandNorth)) {
                    hh -= panels.expandNorth.panel('getOptions').height;
                } else if (that._isVisible(panels.north)) {
                    hh -= panels.north.panel('getOptions').height;
                }
                panels.center.panel('resize', { height: hh });
                panels.east.panel('resize', { height: hh });
                panels.west.panel('resize', { height: hh });
                if (that._isVisible(panels.expandEast)) panels.expandEast.panel('resize', { height: hh });
                if (that._isVisible(panels.expandWest)) panels.expandWest.panel('resize', { height: hh });

                panels.south.panel('panel').animate({ top: cc.height() }, function () {
                    panels.south.panel('close');
                    panels.expandSouth.panel('open').panel('resize', {
                        top: cc.height() - 28,
                        left: 0,
                        width: cc.width(),
                        height: 28
                    });
                });
                if (!panels.expandSouth) {
                    panels.expandSouth = createExpandPanel('south');
                    panels.expandSouth.panel('panel').click(function () {
                        panels.south.panel('open').panel('resize', { top: cc.height() });
                        panels.south.panel('panel').animate({ top: cc.height() - panels.south.panel('getOptions').height });
                        return false;
                    }).hover(
						function () { $(this).addClass('layout-expand-over'); },
						function () { $(this).removeClass('layout-expand-over'); }
					);
                    panels.expandSouth.panel('header').find('.icon-arrow-up').click(function () {
                        panels.expandSouth.panel('close');
                        panels.south.panel('panel').stop(true, true);
                        panels.south.panel('open').panel('resize', { top: cc.height() });
                        panels.south.panel('panel').animate({ top: cc.height() - panels.south.panel('getOptions').height }, function () {
                            that._setSize(container);
                        });
                        return false;
                    });
                }
                return false;
            });
        }

        panels.center.panel('panel').bind('mouseover', 'center', collapsePanel);

        function collapsePanel(e) {

            if (e.data != 'east' && that._isVisible(panels.east) && that._isVisible(panels.expandEast)) {
                panels.east.panel('panel').animate({ left: cc.width() }, function () {
                    panels.east.panel('close');
                });
            }
            if (e.data != 'west' && that._isVisible(panels.west) && that._isVisible(panels.expandWest)) {
                panels.west.panel('panel').animate({ left: -panels.west.panel('getOptions').width }, function () {
                    panels.west.panel('close');
                });
            }
            if (e.data != 'north' && that._isVisible(panels.north) && that._isVisible(panels.expandNorth)) {
                panels.north.panel('panel').animate({ top: -panels.north.panel('getOptions').height }, function () {
                    panels.north.panel('close');
                });
            }
            if (e.data != 'south' && that._isVisible(panels.south) && that._isVisible(panels.expandSouth)) {
                panels.south.panel('panel').animate({ top: cc.height() }, function () {
                    panels.south.panel('close');
                });
            }
            return false;
        }

    },
    _isVisible: function (pp) {
        if (!pp) return false;
        if (pp.length) {
            return pp.panel('panel').is(':visible');
        } else {
            return false;
        }

    },
    collapse: function () {
    },
    destory: function () {

    }
});

} (jQuery));
; (function ($, window, undefined){
	
	$.widget("ui.contextmenu",{
		options:{
			open:false,
			
			beforeShow:$.noop
		},
		_create:function(){
              if (this.element.is('.disabled, :disabled')) return;
              this.opts=this.options;
              this.contextmenus=$("<div></div").append($("<ul class='dropdown-menu'></ul>")).appendTo("body");
              this.element.on("contextmenu.context",this,this._toggle);
              
      
		},
		_toggle:function(e){
			  var tp = e.data._getPostion(e, e.data.contextmenus);
			   e.data.contextEle=$(e.target||e.srcElement);
			  e.data.opts.beforeShow.call(this);
		      e.data.contextmenus.attr('style', '').css(tp).toggleClass("open");
		     
		       e.preventDefault();
		      $('html').on('click.context', function () {
                e.data.contextmenus.removeClass('open');
             });
		},
		_getPostion:function(e,menu){
							var mouseX = e.pageX, mouseY = e.pageY, boundsX = $(
									window).width(), boundsY = $(window)
									.height(), menuWidth = menu.find(
									'.dropdown-menu').outerWidth(), menuHeight = menu
									.find('.dropdown-menu').outerHeight(), tp = {
								"position" : "absolute"
							}, Y, X;

							if (mouseY + menuHeight > boundsY) {
								Y = {
									"top" : mouseY - menuHeight
								};
							} else {
								Y = {
									"top" : mouseY
								};
							}

							if (mouseX + menuWidth > boundsX) {
								X = {
									"left" : mouseX - menuWidth
								};
							} else {
								X = {
									"left" : mouseX
								};
							}

							return $.extend(tp, Y, X);
		},
		addMenu:function(title,opts,callback){
			if($.isFunction(opts)){
				callback=opts;
				opts={};
			}
			var that =this;
			$("<a></a>").attr("title",title).append(opts.icon!=undefined?$("<i></i>").addClass(opts.icon):"").append($("<span/>").html(title))
			.unbind("click.context").bind("click.context",function(event){
				if($.isFunction(callback))callback.call(that,event,title);
			}).wrap("<li></li>").parent().appendTo(this.contextmenus.find("ul"));
		},
		
		remove:function(title){
			this.contextmenus.find("a[title='"+title+"']").parent("li").remove();
		},
		destory:function(){
			
		}
		
		
		
		
		
	});
	
})(jQuery,window,undefined);
; (function ($) {
	
    $.widget("pousheng.tabs", {
        options: {
            width: 'auto',
            height: 'auto',
            idSeed: 0,
            plain: false,
            fit: true,
            border: true,
            headerCls:null,
            scrollIncrement: 100,
            scrollDuration: 400,
            contextmenu:false,
            onLoad: function(){
            },
            onSelect: function(title){
            },
            onClose: function(title){
            }  
        },
        _create: function(){
            var t = this.element;
            var opts = this.opts = $.extend(this.options, {
                width: (parseInt(t.css('width')) || undefined),
                height: (parseInt(t.css('height')) || undefined),
                border: (t.attr('border') ? t.attr('border') == 'true' : undefined),
                plain: (t.attr('plain') ? t.attr('plain') == 'true' : undefined)
            });
            

            this._wrapTabs();
            
            $.data(t[0], 'tabs', {
                options: opts
            });
            this._setProperties();
             this._setSize();
            
             if($('>div.tabs-header ul.tabs li.tabs-selected', this.element)){
            	 this._selectTab();
             };
           
        },
        
        _wrapTabs: function(){
            var container = this.element;
            var that = this;
            container.addClass('tabs-container');
            container.wrapInner('<div class="tabs-panels"/>');
            $('<div class="tabs-header">' +
            '<div class="tabs-scroller-left"></div>' +
            '<div class="tabs-scroller-right"></div>' +
            '<div class="tabs-wrap">' +
            '<ul class="tabs"></ul>' +
            '</div>' +
            '</div>').prependTo(container);
            
            var header = $('>div.tabs-header', container).addClass(that.options.headerCls);
            
            $('>div.tabs-panels>div', container).each(function(){
            	var $this=$(this);
            	$this.attr('id')||$this.attr('id',pousheng.getNextId("tab_panel_"))
                var opts = {
                    id: $this.attr('id'),
                    title: $this.attr('title'),
                    content: null,
                    href: $this.attr('href'),
                    closable: $this.attr('closable') == 'true',
                    icon: $this.attr('icon'),
                    selected: $this.attr('selected') == 'true',
                    cache: $this.attr('cache') == 'false' ? false : true,
                    loaded:false
                };
                that._createTab(opts);
            });
            
            $('.tabs-scroller-left, .tabs-scroller-right', header).hover(function(){
                $(this).addClass('tabs-scroller-over');
            }, function(){
                $(this).removeClass('tabs-scroller-over');
            });
            $(container).bind('_resize', function(){
                var opts = that.opts;
                if (opts.fit == true) {
                    that._setSize();
                    that._fitContent();
                }
                return false;
            });
        },
        
        _setSize: function(){
            var container = this.element;
            var opts = this.opts;
            var cc = $(this.element);
            if (opts.fit == true) {
                var p = cc.parent();
                opts.width = p.innerWidth();
                opts.height = p.innerHeight();
            }
            cc.width(opts.width).height(opts.height);
            
            var header = $('>div.tabs-header', container);
            if ($.boxModel == true) {
                var delta = header.outerWidth() - header.width();
                header.width(cc.width() - delta);
            }
            else {
                header.width(cc.width());
            }
            
            this._setScrollers(container);
            
            var panels = $('>div.tabs-panels', container);
            var height = opts.height;
            if (!isNaN(height)) {
                if ($.boxModel == true) {
                    var delta = panels.outerHeight() - panels.height();
                    panels.css('height', (height - header.outerHeight() - delta) || 'auto');
                }
                else {
                    panels.css('height', height - header.outerHeight());
                }
            }
            else {
                panels.height('auto');
            }
            var width = opts.width;
            if (!isNaN(width)) {
                if ($.boxModel == true) {
                    var delta = panels.outerWidth() - panels.width();
                    panels.width(width - delta);
                }
                else {
                    panels.width(width);
                }
            }
            else {
                panels.width('auto');
            }
            
          
        },
        _fitContent: function(){
            var container = this.element;
            var tab = $('>div.tabs-header ul.tabs li.tabs-selected', container);
            if (tab.length) {
                var panelId = $.data(tab[0], 'tabs.tab').id;
                var panel = $('#' + panelId);
                var panels = $('>div.tabs-panels', container);
                if (panels.css('height').toLowerCase() != 'auto') {
                    if ($.boxModel == true) {
                        panel.height(panels.height() - (panel.outerHeight() - panel.height()));
                        panel.width(panels.width() - (panel.outerWidth() - panel.width()));
                    }
                    else {
                        panel.height(panels.height());
                        panel.width(panels.width());
                    }
                }
                $('>div', panel).triggerHandler('_resize');
            }
            
        },
        _setScrollers: function(){
            var container = this.element;
            var header = $('>div.tabs-header', container);
            var tabsWidth = 0;
            $('ul.tabs li', header).each(function(){
                tabsWidth += $(this).outerWidth(true);
            });
            
            if (tabsWidth > header.width()) {
                $('.tabs-scroller-left', header).css('display', 'block');
                $('.tabs-scroller-right', header).css('display', 'block');
                $('.tabs-wrap', header).addClass('tabs-scrolling');
                
                if ($.boxModel == true) {
                    $('.tabs-wrap', header).css('left', 2);
                }
                else {
                    $('.tabs-wrap', header).css('left', 0);
                }
                var width = header.width() -
                $('.tabs-scroller-left', header).outerWidth() -
                $('.tabs-scroller-right', header).outerWidth();
                $('.tabs-wrap', header).width(width);
                
            }
            else {
                $('.tabs-scroller-left', header).css('display', 'none');
                $('.tabs-scroller-right', header).css('display', 'none');
                $('.tabs-wrap', header).removeClass('tabs-scrolling').scrollLeft(0);
                $('.tabs-wrap', header).width(header.width());
                $('.tabs-wrap', header).css('left', 0);
                
            }
        },
        
        // get the left position of the tab element
        _getTabLeftPosition: function(container, tab){
            var w = 0;
            var b = true;
            $('>div.tabs-header ul.tabs li', container).each(function(){
                if (this == tab) {
                    b = false;
                }
                if (b == true) {
                    w += $(this).outerWidth(true);
                }
            });
            return w;
        },
        
        // get the max tabs scroll width(scope)
        _getMaxScrollWidth: function(container){
            var header = $('>div.tabs-header', container);
            var tabsWidth = 0; // all tabs width
            $('ul.tabs li', header).each(function(){
                tabsWidth += $(this).outerWidth(true);
            });
            var wrapWidth = $('.tabs-wrap', header).width();
            var padding = parseInt($('.tabs', header).css('padding-left'));
            
            return tabsWidth - wrapWidth + padding;
        },
        _setProperties: function(){
            var container = this.element;
            var opts = this.opts;
            var header = $('>div.tabs-header', container);
            var panels = $('>div.tabs-panels', container);
            var tabs = $('ul.tabs', header);
            var that = this;
            
            if (opts.plain == true) {
                header.addClass('tabs-header-plain');
            }
            else {
                header.removeClass('tabs-header-plain');
            }
            if (opts.border == true) {
                header.removeClass('tabs-header-noborder');
                panels.removeClass('tabs-panels-noborder');
            }
            else {
                header.addClass('tabs-header-noborder');
                panels.addClass('tabs-panels-noborder');
            }
            
            tabs.on('click.tabs',"li", function(event){
            	var $this=$(this);
                $('>.tabs-selected', tabs).removeClass('tabs-selected');
                $this.addClass('tabs-selected').blur();
                
                $('>div.tabs-panels>div', container).css('display', 'none').removeAttr("aria-expanded");
                
                var wrap = $('.tabs-wrap', header);
                var leftPos = that._getTabLeftPosition(container, this);
                var left = leftPos - wrap.scrollLeft();
                var right = left + $(this).outerWidth();
                if (left < 0 || right > wrap.innerWidth()) {
                    var pos = Math.min(leftPos - (wrap.width() - $(this).width()) / 2, that._getMaxScrollWidth(container));
                    wrap.animate({
                        scrollLeft: pos
                    }, opts.scrollDuration);
                }
                
                var tabAttr = $.data($(this)[0], 'tabs.tab');
                var panel = $('#' + tabAttr.id,container).show().attr("aria-expanded", true);
                if (tabAttr.href && (!tabAttr.loaded)) {
                	 that._trigger("beforeLoad",event,tabAttr);
                    panel.ajaxLoad(tabAttr.href,function(){
                    	that._trigger("onLoad",event,tabAttr); 
                	tabAttr.loaded = true;
                    });
                }
                
                if(!tabAttr.loaded){
                	that._trigger("onLoad",event,tabAttr); 
                	tabAttr.loaded = true;
                }
              
                that._trigger("onSelect",event,tabAttr);
              
                that._fitContent(container);
                that._setScrollers();
            });
            
            tabs.on('click.tabs','a.tabs-close', function(event){
                var tabAttr = $.data($(this).parent()[0], 'tabs.tab');
                that._closeTab(tabAttr.title);
                return false;
            });
            
            $('.tabs-scroller-left', header).unbind('.tabs').bind('click.tabs', function(){
                var wrap = $('.tabs-wrap', header);
                var pos = wrap.scrollLeft() - opts.scrollIncrement;
                wrap.animate({
                    scrollLeft: pos
                }, opts.scrollDuration);
            });
            
            $('.tabs-scroller-right', header).unbind('.tabs').bind('click.tabs', function(){
                var wrap = $('.tabs-wrap', header);
                var pos = Math.min(wrap.scrollLeft() + opts.scrollIncrement,  that._getMaxScrollWidth(container));
                wrap.animate({
                    scrollLeft: pos
                }, opts.scrollDuration);
            });
        },
        
        _createTab: function(opts){
        
            var container = this.element;
            var header = $('>div.tabs-header', container);
            var tabs = $('ul.tabs', header);
			var tab_panel;
            
            var tab = $('<li></li>').attr("url",opts.href).attr("title",opts.title);
            var tab_span = $('<span class="title"></span>').html(opts.title).attr("title",opts.title);
            var tab_a = $('<a class="tabs-inner"></a>').attr('href', 'javascript:void(0)').append(tab_span);
            tab.append(tab_a).appendTo(tabs);
            
            if (opts.closable) {
                tab_span.addClass('tabs-closable');
                tab_a.after('<a href="javascript:void(0)" class="tabs-close"></a>');
            }
            if (opts.icon) {
                tab_span.addClass('tabs-with-icon');
                tab_span.after($('<span/>').addClass('tabs-icon').addClass(options.icon));
            }
        
		    tab_panel =	$('#' + opts.id,container).addClass("ui-tabs-panel");
            if (opts.content) {
                tab_panel.html(opts.content);
            }
            
            
            opts.panel = tab_panel;
            
                
            $.data(tab[0], 'tabs.tab',opts);
            if (opts.selected) {
                this._selectTab(opts.title);
            }
            if(this.opts.contextmenu)this._creatMenu(tab);
        
        },
        
        // active the selected tab item, if no selected item then active the first item
        _selectTab: function(title){
            var container = this.element;
            if (title) {
                var elem = $('>div.tabs-header li[title="' + title + '"]', container)[0];
                if (elem) {
                    $(elem).trigger('click');
                }
            }
            else {
            
                var tabs = $('>div.tabs-header ul.tabs', container);
                if ($('.tabs-selected', tabs).length == 0) {
                    $('li:first', tabs).trigger('click');
                }
                else {
                    $('.tabs-selected', tabs).trigger('click');
                }
            }
        },
        
        
        // close a tab with specified title
        _closeTab: function(title){
            var container = this.element;
            var opts = this.opts;
            var elem = $('>div.tabs-header li:has(a span:contains("' + title + '"))', container)[0];
            if (!elem) 
                return;
            
            var tabAttr = $.data(elem, 'tabs.tab');
            var panel = $('#' + tabAttr.id);
            
            if (opts.onClose.call(panel, tabAttr.title) == false) 
                return;
            
            var selected = $(elem).hasClass('tabs-selected');
            $.removeData(elem, 'tabs.tab');
            $(elem).remove();
            panel.remove();
            
            this._setSize();
            if (selected) {
                this._selectTab();
            }
            else {
          
                var wrap = $('>div.tabs-header .tabs-wrap', container);
                var pos = Math.min(wrap.scrollLeft(), this._getMaxScrollWidth(container));
                wrap.animate({
                    scrollLeft: pos
                }, opts.scrollDuration);
            }
        },
        addTab: function(opts){
        	if(this._exists(opts.title)){
        		 this._selectTab(opts.title) 
        	}else{
        		opts = $.extend({
                id:pousheng.getNextId("tab_panel_"),
                title: '',
                closable: true,
                selected: true
            }, opts || {});
            
             var panels = $('>div.tabs-panels', this.element);
              $('<div></div>').attr('id', opts.id).attr('title', opts.title).appendTo(panels);
            
              this._createTab(opts);
        	}
        },
        _creatMenu:function(tab){
          
            var that =this;
          var opts=tab.data("tabs.tab");
           var menu =tab.contextmenu();
           if(opts.href&&tab.hasClass("tabs-selected")){
        	  menu.contextmenu("addMenu","刷新",{icon:"icon-refresh"},function(e,t){
        		 opts.loaded=false;
                that.refresh(opts);
                that._selectTab(opts.title);
            },"icon-refresh"); 
           }
         
           if(opts.closable){
        	  menu.contextmenu("addMenu","关闭当前页",{icon:"icon-off"},function(e,t){
                that._closeTab(opts.title);
            }); 
           }
            
           
            menu.contextmenu("addMenu","关闭所有",{icon:"icon-off"},function(){
            	tab.parent().find(">li").each(function(i){
                    var  _opts=$(this).data("tabs.tab");
                    if(_opts.closable){
                    	that._closeTab(_opts.title);
                    }
            		
            	});
            },"icon-refresh");
             menu.contextmenu("addMenu","关闭其他",{icon:"icon-off"},function(){
            	tab.siblings().each(function(){
            	   var  _opts=$(this).data("tabs.tab");
                    if(_opts.closable){
                    	that._closeTab(_opts.title);
                    }
            	})
            });
        },
        _exists: function(title){
            return $('>div.tabs-header li:has(a span[title="' + title + '"])', this.element).length > 0;
        },
        exists: function(title){
           return  this._exists(title);
        },
        selectTab:function(title){
           this._selectTab(title);	
        },
        getSelected: function(){
            var elem = $(">div.tabs-header li.tabs-selected", this.element);
            return elem.length > 0 ? $.data(elem[0], 'tabs.tab') : null;
        },
        getTab:function(title){
         var elem = $('>div.tabs-header li:has(a span[title="' + title + '"])', this.element);
            return elem.length > 0 ? $.data(elem[0], 'tabs.tab') : null;
        },
        refresh: function(tabAttr){
			var that=this;
            if (tabAttr) {
				if(tabAttr.content){
					tabAttr.panel.html(tabAttr.content);
					that.opts.onLoad.apply(this, arguments);
				    tabAttr.loaded = true;
				} else if (tabAttr.href && (!tabAttr.loaded || !tabAttr.cache)) {
                    tabAttr.panel.load(tabAttr.href, null, function(){
						that.opts.onLoad.apply(this, arguments);
                        tabAttr.loaded = true;
                    });
                }
            }else{
            	var opts=this.getSelected();
            	if(opts){
            		opts.loaded=false;
            		this.refresh(opts);
            	}
            	
            }
       
        },
		setOption:function(key,value){
			this.opts[key]=value;
		},
		getOptions:function(key,value){
		   return this.opts;
		},
        destory: function(){
        
        
        }
    });
})(jQuery);




; (function ($, window, undefined){
	
	$.widget("pousheng.navTab",$.pousheng.tabs,{
		options:{
			 unescape: false,
			 callback: undefined,
             type: undefined, 
             check: function() {},
             load:  function(hash) {}
		},
		_create:function(){
			var that =this;
			this.hashMap=[];
			this._super();
			
             $(window).bind('hashchange', function(){
            	 that.check.call(that);
             });
             
             
		},
		_init:function(){
			this.hashMap=[];
			
		},
		_locationWrapperPut:function(hash, win){
			(win || window).location.hash = this._encoder(hash);
		},
		_locationWrapperGet:function(win){
			  var hash = ((win || window).location.hash).replace(/^#/, '');
            try {
                return $.browser.mozilla ? hash : decodeURIComponent(hash);
            }
            catch (error) {
                return hash;
            }
		},
		_encoder: function(hash) {
            if(this.options.unescape === true) {
                return function(hash){ return hash; };
            }
            if(typeof this.options.unescape == "string" &&
               (this.options.unescape = this.partialDecoder(this.options.unescape.split("")))
               || typeof this.options.unescape == "function") {
                return function(hash) { return this.options.unescape(encodeURIComponent(hash)); };
            }
            return hash;
        },
		partialDecoder:function(chars) {
            var re = new RegExp($.map(chars, encodeURIComponent).join("|"), "ig");
            return function(enc) { return enc.replace(re, decodeURIComponent); };
        },
        forward:function(){
        	
        },
        check:function(){
            var hash = this._locationWrapperGet();
           hash!="" && this.element.find("div.tabs-header ul.tabs li[url='"+hash+"']").not(".tabs-selected").trigger("click");
        },
        load:function(href,param,callback){
        	var opts = this.options;
        	var panel =this.getSelected().panel.ajaxLoad(href,{data:param},callback);
        },
        newTab:function(href,title){
        	this.addTab({"title":title,"href":href});
        	this._locationWrapperPut(href);
        }
        
        
	});
})(jQuery,window,undefined);
; (function ($, window, undefined){

    $.widget("pousheng.modal",{
    	options:{
           backdrop: true,
           keyboard: true, 
           show: true,
    	   remote:null,
           title:null,
           modalCls:null,
           buttons:[],
           width:750,
           height:550,
           draggable:true,
           resizable: true,
           maxHeight: $(window).height(),
		  maxWidth: $(window).width(),
		  minHeight: 150,
		  minWidth: 150,
		  newwinBtn:true,
		  minBtn:false,
		  closeBtn:true,
		  requestParam:{},
		  context:$("window"),
		  singleSelect:true,
          position: {
			my: "center",
			at: "center",
			of: window,
			collision: "fit",// ensure that the titlebar is never outside the document
			using: function( pos ) {
				var topOffset = $( this ).css( pos ).offset().top;
				if ( topOffset < 0 ) {
					$( this ).css( "top", pos.top - topOffset );
				}
			}
			
		}
    	},
        _create:function(){
          var opts =this.options;
           this._wrapModal();
           
          if ( opts.draggable && $.fn.draggable ) {
			this._makeDraggable();
		}
		if ( opts.resizable && $.fn.resizable ) {
			this._makeResizable();
      
		}
        
		   
             this._size();
          
            if(opts.remote){
			   this.loadRemote(opts.remote);
		    }
            
            
            this.open();
        },
        _wrapModal:function(){
           var opts = this.options,
               that = this;
     
           this.uiModal=$("<div/>").addClass("modal").addClass(opts.modalCls).appendTo("body").hide();
           var mheader=$("<div/>").addClass("modal-header").appendTo(this.uiModal),
               mtitle= $("<h3/>").appendTo($("<div class='float_left title'>").appendTo(mheader)).text(opts.title||this.element.attr("title")),
               mbody =$("<div/>").addClass("modal-body").appendTo(this.uiModal).append(this.element),
               mfoot = $("<div>").addClass("modal-footer").appendTo(this.uiModal)
               mfoot= opts.buttons.length ?mfoot.show():mfoot.hide() ;
               
               $.each(opts.buttons||[],function(i,e){
            	   that.addButton(e.text,e.click,e.cls);
               });
            
            var btns =  $("<span class='float_right buttons'></span>").appendTo(mheader);
            
            
             opts.minBtn && $('<a class="modal_min button"></a>').click(function(event){
            	  that.min(event);
            }).appendTo(btns);
            
            opts.newwinBtn&&$("<a class='modal_resize button'></a>").click(function(event){
            	that.newwin(event)
            }).appendTo(btns);
            
           
            
            opts.closeBtn && $("<a class='modal_close button'>").click(function(event){
            	that.close(event);
            }).appendTo(btns);
           // mheader.prepend('<button type="button" class="titleBar close">&times;</button>');
           // mheader.prepend('<button type="button" class="titleBar close">&times;</button>');
           return this.uiModal;
        },
           


        _wrap:function(){
          this.viewModal = $("<div/>").addClass("modal").appendTo(modalArea.content);
          var mheader = $("<div/>").addClass("modal-header"),
              mtitle =$("<h3/>").text(this.options.title||this.element.attr("title"));
              mbody  =$("<div/>").addClass("modal-body").append(this.element); 
              mfooter =$("<div/>").addClass("modal-footer");
           this.viewModal.append(header.append(title)).append(mbody).append(mfooter)
              
             
           this._position(this.options.position);
        },
        _setSize:function(){
        	var opts = this.options;
            if (opts.fit == true) {
                var p = this.uiDialog.parent();
                opts.width = p.innerWidth();
                opts.height = p.innerHeight();
            }
            this._size();
          
        },
        _minHeight: function() {
		var options = this.options;

		if ( options.height === "auto" ) {
			return options.minHeight;
		} else {
			return Math.min( options.minHeight, options.height );
		}
	  },
      _size: function() {
		var nonContentHeight, minContentHeight, maxContentHeight,
			options = this.options;

		// Reset content sizing
		this.element.show().css({
			width: "auto",
			minHeight: 0,
			maxHeight: "none",
			height: 0
		});

		if ( options.minWidth > options.width ) {
			options.width = options.minWidth;
		}

		// reset wrapper sizing
		// determine the height of all the non-content elements
		nonContentHeight = this.uiModal.css({
				height: "auto",
				width: options.width
			})
			.outerHeight();
		
		minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );
		maxContentHeight = typeof options.maxHeight === "number" ?
			Math.max( 0, options.maxHeight - nonContentHeight ) :
			"none";
			
			
       
		if ( options.height === "auto" ) {
			this.element.css({
				minHeight: minContentHeight,
				maxHeight: maxContentHeight,
				height: "auto"
			});
		} else {
			this.element.height( Math.max( 0, Math.min(options.height,$(window).height()) - nonContentHeight ) );
		}
          this._position(this.options.position);
	},
	
	_position: function( position ) {
		var myAt = [],
			offset = [ 0, 0 ],
			isVisible;

		if ( position ) {
     
			if ( typeof position === "string" || (typeof position === "object" && "0" in position ) ) {
				myAt = position.split ? position.split( " " ) : [ position[ 0 ], position[ 1 ] ];
				if ( myAt.length === 1 ) {
					myAt[ 1 ] = myAt[ 0 ];
				}

				$.each( [ "left", "top" ], function( i, offsetPosition ) {
					if ( +myAt[ i ] === myAt[ i ] ) {
						offset[ i ] = myAt[ i ];
						myAt[ i ] = offsetPosition;
					}
				});

				position = {
					my: myAt[0] + (offset[0] < 0 ? offset[0] : "+" + offset[0]) + " " +
						myAt[1] + (offset[1] < 0 ? offset[1] : "+" + offset[1]),
					at: myAt.join( " " )
				};
			}

			position = $.extend( {}, $.pousheng.modal.prototype.options.position, position );
		} else {
			position = $.pousheng.modal.prototype.options.position;
		}

		// need to show the dialog to get the actual offset in the position plugin

		
		this.uiModal.position( position );
	
	},
     _makeDraggable: function() {
		var that = this,
			opts = this.options;
      
		function filteredUi( ui ) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}

		this.uiModal.draggable({
			cancel: ".modal-body, .modal-footer,.titleBar,buttons,button",
			handle: ".modal-header",
			containment: "document",
			start: function( event, ui ) {
				$( this )
					.addClass( "ui-modal-dragging" );
				that._trigger( "dragStart", event, filteredUi( ui ) );
				      that.moveToTop();
			},
			drag: function( event, ui ) {
				that._trigger( "drag", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				opts.position = [
					ui.offset.left,
					ui.offset.top
				];
		    
			   $( this ).removeClass( "ui-modal-dragging" );
				that._trigger( "dragStop", event, filteredUi( ui ) );
				
			}
		});
	},

    _makeResizable: function( handles ) {
    	
		handles = (handles === undefined ? this.options.resizable : handles);
		var that = this,
			opts = this.options,
			// .ui-resizable has position: relative defined in the stylesheet
			// but dialogs have to use absolute or fixed positioning
			position = this.uiModal.css( "position" ),
			resizeHandles = typeof handles === 'string' ?
				handles	:
				"n,e,s,w,se,sw,ne,nw";

		function filteredUi( ui ) {
			return {
				originalPosition: ui.originalPosition,
				originalSize: ui.originalSize,
				position: ui.position,
				size: ui.size
			};
		}

		this.uiModal.resizable({
			cancel:  that.uiModal.find(".modal-body"),
			containment:"document",
			alsoResize: that.uiModal.find(".modal-body"),
			maxWidth: opts.maxWidth,
			maxHeight: opts.maxHeight,
			minWidth: opts.minWidth,
			minHeight: this._minHeight(),
			handles: resizeHandles,
			start: function( event, ui ) {
				$( this ).addClass( "ui-modal-resizing" );
				that._trigger( "resizeStart", event, filteredUi( ui ) );
				    that.moveToTop();
			},
			resize: function( event, ui ) {
				//that._trigger( "resize", event, filteredUi( ui ) );
				that.element.find(">div").triggerHandler('_resize');
			},
			stop: function( event, ui ) {
				opts.height = $( this ).height();
				opts.width = $( this ).width();
				that._trigger( "resizeStop", event, filteredUi( ui ) );
				$( this ).removeClass( "ui-modal-resizing" ).find(".modal-body").width("auto").height("auto");
			}
		})
		.css( "position", position )
		.find( ".ui-resizable-se" )
			.addClass( "ui-icon ui-icon-grip-diagonal-se" );
	},
	
	   open:function(){ 
		  var opts =this.options;
		   if(opts.singleSelect){
			  opts.bgdesk = $('<div class="modal-backdrop fade in"></div>').appendTo("body");
		   }
		   
		   
		/* this.uiModal.animate({
			 width:this.options.width,
			 height:this.options.height
			 }).fadeIn().position(this.options.position);   */
		   
		   this.uiModal.show("clip","slow");
		   this.moveToTop()
		   
	   },
	    content:function(htmls){
	    	var opts = this.options;
            this.element.html(htmls||opts.content);
            opts.content=htmls;
        },
        loadRemote:function(url){
        	var opts =this.options,
        	     that =this ;
        	this.element.ajaxLoad(url,{data:opts.requestParam},function(response){
        		that._trigger( "ready",null, that.element[0]);
        	});
        },
        title: function( title ) {
        	this.options.title = title ||this.element.attr("title")
		    this.uiModal.find(".title h3").html(title ||this.element.attr("title"));
      	},
        min:function(event){
        	var that =this;
        	this.options.bgdesk&&this.options.bgdesk.remove();
        },
        newwin:function(event){
             var win = this.uiModal;
             var that =this; 
	        if (win.hasClass('window_full')) {
	        	this._size();
	        	this.moveToTop();
	        	win.removeClass("window_full").draggable("enable"); 
				this.element.find(">div").triggerHandler("_resize");
	        }
	        else {
	          this.element.height($(window).height() - (win.height()-this.element.height()));
	          win.width($(window).width()).addClass('window_full').position({my: "center",
			               at: "center",
			                of:window}).draggable("disable").removeClass("ui-state-disabled");
	          this.element.find(">div").triggerHandler("_resize");
	          
	        }
        },
        addButton:function(name,prop,cls){
        	var opts =this.options,
        	    that =this,
        	    btn,
        	    mfoot =this.uiModal.find(".modal-footer").show();
        	  btn = $( "<button>").addClass("btn").text(name).addClass(cls).appendTo(mfoot).click(function(){
        		  $.isFunction( prop )?prop.apply( that.element[0], arguments ):$.noop;
        	  });
        	  opts.buttons.push(btn);
        	  
        },
        close:function(event){
        	this._trigger("beforeClose",null,this.element);
        	this.options.bgdesk && this.options.bgdesk.remove();
        	this.uiModal.effect("clip",function(){$(this).remove()});
        	this._trigger("afterClose",event);
       
        },
        moveToTop:function(event){
        		var opts = this.options;
          
		if ( opts.zIndex > $.pousheng.modal.maxZ ) {
			$.pousheng.modal.maxZ = opts.zIndex;
		}
		
		$.pousheng.modal.maxZ += 1;
		this.uiModal.css( "z-index", $.pousheng.modal.maxZ );
		
		this._trigger( "focus", event );
		return this;
        },
        destroy:function(){
        	this._destroy();
        }
    });
 

    
$.extend($.pousheng.modal, {
	uuid: 0,
	maxZ: 10000,
});
    




     //添加全局对话框函数
     $.modal=function(options){
        return $("<div/>").modal(options);
     }



	
})(jQuery,window,undefined);
; (function ($) {
    $.widget("ui.pagination", {
        options: {
        	totals: 10,
		    pageSize: 1,
		    pageNumber: 1,
		    pageList: [10,20,30,50],
		    loading: false,
            first        : false,
            previous     : "上一页",
            next         : "下一页",
            last         : false,
            startRange   : 1,
			midRange     : 3,
            endRange     : 1,
		    buttons: null,
		    showPageList: true,
		    showRefresh: true,
		
		    onSelectPage: function(pageNumber, pageSize){},
		    onBeforeRefresh: function(pageNumber, pageSize){},
		    onRefresh: function(pageNumber, pageSize){},
		    onChangePageSize: function(pageSize){},
		
		    beforePageText: 'Page',
		    afterPageText: 'of {pages}',
		    displayMsg: 'Displaying {from} to {to} of {totals} items'
    },
    _create: function () {
         this.opts=this.options;
         this.opts.selectlist=$("<span class='input-append'>");
         this.opts.holder =  $("<ul></ul>");
         this.opts.pagesShowing =$([]);
         
         $.data(this.element, 'pagination', {
					options: this.opts
		 });
        
	     this._buildToolbar(this.element);

         this._selectPage(this.element,this.opts.pageNumber);


    },

    _buildToolbar: function (target){
        target.addClass('pagination').empty();
        //设置每页显示条数
        var that=this;
        var opts=this.opts;

        
        if (opts.showPageList) {
            var selectedItem = $('<input  style="width:20px;height:18px; margin-top:-0.3em"/>').val(opts.pageList[0]);
			selectedItem.appendTo(this.element).spinner({
									step : 10,
									max : 50,
									min : 10,
									spin : function(event, ui) {
									opts.pageSize=ui.value
									that._selectPage(target, opts.pageNumber);
									}
								});
            
          /*  var up = $(' <i class="icon-chevron-up perPage"></i>');
            var down = $(' <i class="icon-chevron-down perPage"></i>');
            opts.selectlist.append(selectedItem).appendTo(target);
            opts.selectlist.append($('<span class="add-on spinner"/>').append(up).append(down));
            
            //绑定切换事件
            up.click(function(){
                var index = $.inArray(parseInt(selectedItem.val()), opts.pageList);
                index = index >= 0 && opts.pageList.length - 1 <= index ? 0 : index + 1;
                opts.pageSize = opts.pageList[index];
                selectedItem.val(opts.pageList[index]);
                that._selectPage(target, opts.pageNumber);
            });
            down.click(function(){
                var index = $.inArray(parseInt(selectedItem.val()), opts.pageList);
                index = index <= 0 ? opts.pageList.length - 1 : index - 1;
                opts.pageSize = opts.pageList[index];
                selectedItem.val(opts.pageList[index]);
                that._selectPage(target, opts.pageNumber);
            });*/
        }

       this.opts.holder.appendTo(target);
       that._setNav(target);
       if(opts.showPageList){
	   	   var  Go =$("<span class='input-append go'></span>"),
		   goInput=$("<input  type='text' class='input-mini'>"),
		   goBtn=$("<span class='add-on'>Go</span>");
		   Go.append(goInput).append(goBtn).appendTo(target);
		   goBtn.click(function(){
		   	    var page =  parseInt(goInput.val())||opts.pageNumber;
				 var pageCount= Math.ceil(opts.totals / opts.pageSize);
		   	    page = page>pageCount?pageCount:page<0?0:page;
		   	    goInput.val(page);
				if( opts.pageNumber !=page){
					 opts.pageNumber=page;
					that._selectPage(target, opts.pageNumber);
				}
		   });  
	   }
    
	},
    _setNav:function(target){
      var opts =this.opts;
      var pageCount= Math.ceil(opts.totals / opts.pageSize);
      function writeBtn(which){
             return  opts[which] && opts[which] != false  ? 
            "<li><a class='jp-" + which + "'>" + opts[which] + "</a></li>" : "";
      }
       var i = 1, navhtml;
        navhtml = writeBtn( "first" ) + writeBtn( "previous" );
        for ( ; i <= pageCount; i++ ) {
            if ( i === 1 && opts.startRange === 0 ) {
                navhtml += "<li><span class='first'>...</span></li>";
            }
            if ( i > opts.startRange && i <= pageCount - opts.endRange ) {
                navhtml += "<li><a href='#'  pageIndex="+i+"  class='jp-hidden'>";
            } else {
                navhtml += "<li><a pageIndex="+i+">";
            }
			 navhtml += i;
            navhtml += "</a></li>";
            if ( i === opts.startRange || i === pageCount - opts.endRange ) {
                navhtml += "<li><span class='last'>...</span></li>";
            }
        }

        navhtml += writeBtn( "next" ) + writeBtn( "last" ) + "</div>";

        opts.holder.html(navhtml);

        this._bindNavHandlers(target);

    },

   _bindNavHandlers:function(target){
      var that=this;
      var opts = this.opts;

      target.find("a.jp-first").unbind('.pagination').bind('click.pagination', function(){
			if (opts.pageNumber > 1) that._selectPage(target, 1);
	  });

       target.find("a.jp-previous").unbind('.pagination').bind('click.pagination', function(){
			if (opts.pageNumber > 1) that._selectPage(target, opts.pageNumber - 1);
	  });

       target.find("a.jp-next").unbind('.pagination').bind('click.pagination', function(){
			var pageCount = Math.ceil(opts.totals/opts.pageSize);
			if (opts.pageNumber < pageCount) that._selectPage(target, opts.pageNumber + 1);
	  });

       target.find("a.jp-last").unbind('.pagination').bind('click.pagination', function(){
			var pageCount = Math.ceil(opts.totals/opts.pageSize);
			if (opts.pageNumber < pageCount) that._selectPage(target, pageCount);
	  });

       target.find("li>a").not(".jp-first, .jp-previous, .jp-next, .jp-last,.jp-current").unbind('.pagination').bind('click.pagination',function(evt){
             that._selectPage(target, parseInt($(this).attr("pageIndex")));
       });
   },

	_selectPage:function (target, page){
		var opts = this.opts;
		var pageCount = Math.ceil(opts.totals/opts.pageSize);
		var pageNumber = page;
		if (page < 1) pageNumber = 1;
		if (page > pageCount) pageNumber = pageCount;
		opts.onSelectPage.call(target, pageNumber, opts.pageSize);
		opts.pageNumber = pageNumber;
        this._updatePages(target, page);
	},
    _updatePages:function(target,page){
        var opts = this.opts;
       var pageCount= Math.ceil(opts.totals / opts.pageSize);
       var neHalf, upperLimit, start, end,interval;
        
        neHalf = Math.ceil( opts.midRange / 2 );
        upperLimit = pageCount - opts.midRange;
        start = page > neHalf ? Math.max( Math.min( page - neHalf, upperLimit ), 0 ) : 0;
        end = page > neHalf ? Math.min( page + neHalf - ( opts.midRange % 2 > 0 ? 1 : 0 ), pageCount ) : Math.min( opts.midRange, pageCount );
        interval = { start: start, end: end };

         if ( page === 1) {
            target.find("a.jp-first").addClass("jp-disabled");
            target.find("a.jp-previous").addClass("jp-disabled");
        } else if(opts.pageNumber !== 1 && page > 1){
             target.find("a.jp-first").removeClass("jp-disabled");
            target.find("a.jp-previous").removeClass("jp-disabled");
        }
        if ( page === pageCount ) {
            target.find("a.jp-next").addClass("jp-disabled");
            target.find("a.jp-last").addClass("jp-disabled");
        }else if(opts.pageNumber !== pageCount && page < pageCount){
            target.find("a.jp-next").removeClass("jp-disabled");
            target.find("a.jp-last").removeClass("jp-disabled");
        }

        target.find("a.jp-current").removeClass("jp-current");
        target.find("a[pageindex='"+page+"']").addClass("jp-current");

       var hold = target.find("ul a").not(".jp-first, .jp-previous, .jp-next, .jp-last");
   
       hold.addClass("jp-hidden").slice( interval.start, interval.end ).removeClass("jp-hidden");
       hold.slice(0,opts.startRange).removeClass("jp-hidden");
       hold.slice(pageCount-opts.endRange).removeClass("jp-hidden");

        if ( interval.start > opts.startRange || ( opts.startRange === 0 && interval.start > 0 ) ) { 
            target.find("li>span:first").removeClass("jp-hidden");
        } else { 
            target.find("li>span:first").addClass("jp-hidden");
        }
        
        if ( interval.end < pageCount - opts.endRange ) {
            target.find("li>span:last").removeClass("jp-hidden");
        } else { 
            target.find("li>span:last").addClass("jp-hidden");
        }
  
    },

    pageSize:function(total){
       var opts = this.opts;
       opts.totals=total;
       this._setNav(this.element);
       this._updatePages(this.element, this.opts.pageNumber);
 
    },

    getOption:function(param){
       return this.opts[param];
    },
    destory: function () {


    }

});

})(jQuery)

;(function ($) {
    $.widget("pousheng.datagrid", {
        options: {
            title: null,
            iconCls: null,
            border: true,
            width: 'auto',
            height: 'auto',
            frozenColumns: null,
            columns: null,
            striped: false,
            method: 'post',
            template: null,
            nowrap: true,
            idField: null,
            url: null,
            loadMsg: 'Processing, please wait ...',
            pagination: true,
            rownumbers: false,
            singleSelect: true,
			showPageList:true,
            fit: true,
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 20, 30, 40, 50],
            queryParams: {},
            sortName: null,
            sortOrder: 'asc',
			data:{dataList:[],recordCount:0},
            
			actions : {},
            onLoadSuccess: function () { },
            onLoadError: function () { },
            onClickRow: function (rowIndex, rowData) { },
            onDblClickRow: function (rowIndex, rowData) { },
            onSortColumn: function (sort, order) { },
            onSelect: function (rowIndex, rowData) { },
            onUnselect: function (rowIndex, rowData) { },
			onSelected:function(rowIndex, rowData){},
			trContextMenu:function(rowIndex,rowData){}

        },
        _create: function () {
         
            var that=this;
			var target = this.element;
            this.opts = $.extend(this.options, {
                width: (parseInt(this.element.css('width')) || 'auto'),
                height: (parseInt(this.element.css('height')) || 'auto'),
				template:$("tbody",this.element).clone().find("tr").attr("datagrid-row-index","{{:#index}}").end(),
				url:this.element.attr("url")||this.options
            });

            var wrapResult = this._wrapGrid(this.element);
			
			 
            this.opts.bodytmpl =$.templates(this.opts.template.html().toString().replace(/&gt;/ig,">"));
			
            $.data(this.element, 'datagrid', {
                options: this.opts,
                grid: wrapResult,
                selectedRows: []
            });
           
            var grid =this.grid = wrapResult;
           
            if (this.opts.border == true) {
                grid.removeClass('datagrid-noborder');
            } else {
                grid.addClass('datagrid-noborder');
            }

          
            $('.datagrid-title', grid).remove();
            if (this.opts.title) {
                var title = $('<div class="datagrid-title"><span class="datagrid-title-text"></span></div>');
                $('.datagrid-title-text', title).html(this.opts.title);
                title.prependTo(grid);
                if (opts.iconCls) {
                    $('.datagrid-title-text', title).addClass('datagrid-title-with-icon');
                    $('<div class="datagrid-title-icon"></div>').addClass(this.opts.iconCls).appendTo(title);
                }
            }
          
            
            this.opts.search=$('.datagrid-search',grid).prependTo($('.datagrid-wrap', grid));
		    this.opts.toolbar=$('.datagrid-toolbar',grid).prependTo($('.datagrid-wrap', grid));
	        this.opts.pager =  $('<div class="datagrid-pager"></div>').addClass("pagination-small");
            if (this.opts.pagination) {
                var pager = this.opts.pager.appendTo($('.datagrid-wrap', grid));
                
              
                pager.pagination({
                    pageNumber: this.opts.pageNumber,
                    pageSize: this.opts.pageSize,
                    pageList: this.opts.pageList,
				    showPageList:this.opts.showPageList,
                    onSelectPage: function (pageNum, pageSize) {
                        // save the page state
                        that.opts.pageNumber = pageNum;
                        that.opts.pageSize = pageSize;
                        that._request(target); // request new page data
                    }
                });
				this.opts.pager=pager;
                // this.opts.pageSize = pager.pagination('getOption', "pageSize"); // repare the pageSize value
            }else{
				this.opts.url ? that._request(target):this._loadData();
			}
            
              this._setSize(target);
            
               


            this._setProperties(target);
            

        },
        _setSize: function (target) {

            var grid = this.grid.show();
            var opts = this.opts;
            if (opts.fit == true) {
                var p = grid.parent();
                opts.width = p.innerWidth();
                opts.height = p.innerHeight();
            }

            if (opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length > 0)) {
                $('.datagrid-body .datagrid-cell,.datagrid-body .datagrid-cell-rownumber', grid).addClass('datagrid-cell-height');
            }

            var gridWidth = opts.width;
            if (gridWidth == 'auto') {
                if ($.boxModel == true) {
                    gridWidth = grid.width();
                } else {
                    gridWidth = grid.outerWidth();
                }
            } else {
                if ($.boxModel == true) {
                    gridWidth -= grid.outerWidth() - grid.width();
                }
            }
            grid.width(gridWidth);


            var innerWidth = gridWidth;
            if ($.boxModel == false) {
                innerWidth = gridWidth - grid.outerWidth() + grid.width();
            }

            $('.datagrid-wrap', grid).width(innerWidth);
            $('.datagrid-view', grid).width(innerWidth);
            $('.datagrid-view1', grid).width($('.datagrid-view1 table', grid).width());
            $('.datagrid-view2', grid).width(innerWidth - $('.datagrid-view1', grid).outerWidth());
            $('.datagrid-view1 .datagrid-header', grid).width($('.datagrid-view1', grid).width());
            $('.datagrid-view1 .datagrid-body', grid).width($('.datagrid-view1', grid).width());
            $('.datagrid-view2 .datagrid-header', grid).width($('.datagrid-view2', grid).width());
            $('.datagrid-view2 .datagrid-body', grid).width($('.datagrid-view2', grid).width());

          
            


          	var hh;
		var header1 = $('.datagrid-view1 .datagrid-header',grid);
		var header2 = $('.datagrid-view2 .datagrid-header',grid);
		header1.css('height', null);
		header2.css('height', null);
		if ($.boxModel == true){
			hh = Math.max(header1.height(), header2.height());
		} else {
			hh = Math.max(header1.outerHeight(), header2.outerHeight());
		}
		
		$('.datagrid-view1 .datagrid-header table',grid).height(hh);
		$('.datagrid-view2 .datagrid-header table',grid).height(hh);
		header1.height(hh);
		header2.height(hh);
		
		if (opts.height == 'auto') {
			$('.datagrid-body', grid).height($('.datagrid-view2 .datagrid-body table', grid).height());
		} else {
			$('.datagrid-body', grid).height(
					opts.height
					- (grid.outerHeight() - grid.height())
					- $('.datagrid-header', grid).outerHeight(true)
					- $('.datagrid-title', grid).outerHeight(true)
					- $('.datagrid-toolbar', grid).outerHeight(true)
					- $('.datagrid-search', grid).outerHeight(true)
					- $('.datagrid-pager', grid).outerHeight(true)
			);
		}
		
		$('.datagrid-view',grid).height($('.datagrid-view2',grid).height());
		$('.datagrid-view1',grid).height($('.datagrid-view2',grid).height());
		$('.datagrid-view2',grid).css('left', $('.datagrid-view1',grid).outerWidth());
            
            
         
        },
        _wrapGrid: function (target) {
            var that = this;
            var p = this.element.parent();
            var  thead =target.find("thead");
     
            var grid = $('<div class="datagrid"></div>').append(target).appendTo(p); 
            grid.append(
				'<div class="datagrid-wrap">' +
					'<div class="datagrid-view">' +
						'<div class="datagrid-view1">' +
							'<div class="datagrid-header">' +
								'<div class="datagrid-header-inner"><table border="0" cellspacing="0" cellpadding="0"><thead></thead></table></div>' +
							'</div>' +
							'<div class="datagrid-body">' +
								'<div class="datagrid-body-inner">' +
									'<table border="0" cellspacing="0" cellpadding="0"></table>' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<div class="datagrid-view2">' +
							'<div class="datagrid-header">' +
								'<div class="datagrid-header-inner"><table border="0" cellspacing="0" cellpadding="0"><thead></thead></table></div>' +
							'</div>' +
							'<div class="datagrid-body"></div>' +
						'</div>' +
					'</div>' +
				'</div>'
		);

           this.element.attr({
                cellspacing: 0,
                cellpadding: 0,
                border: 0
            }).removeAttr('width').removeAttr('height').appendTo($('.datagrid-view2 .datagrid-body', grid));
             
           
            thead.find("tr").each(function(){
                    var $tr =$("<tr>");
                    $(this).find("th").each(function(i, e){
                    	$(this).wrapInner($('<div class="datagrid-cell"><span></span></div>').width(e.width));

                    	$(this).hasClass("frozen") && $(this).appendTo($tr);
                    	$(this).hasClass("sort-header") && $(this).find(".datagrid-cell").append("<i class='datagrid-sort-icon'>");
                    });
                    $tr.appendTo($(".datagrid-view1 .datagrid-header thead",grid));
            });
            thead.find("tr").appendTo($(".datagrid-view2 .datagrid-header thead",grid))
            this.opts.template.find("td").each(function(i,e){
            	$(e).wrapInner($('<div class="datagrid-cell"></div>').width($(".datagrid-view2 .datagrid-header thead tr:last .datagrid-cell",grid).eq(i).width()))
            });
            grid.bind('_resize', function () {
                var opts = $.data(target, 'datagrid').options;
                if (opts.fit == true) {
                    that._setSize(target);
                    that._fixColumnSize(target);
                }
                return false;
            });

            return   grid
           
        },
      
        /**
        * set the common properties
        */
        _setProperties: function (target) {
            var grid = $.data(target, 'datagrid').grid;
            var opts = this.opts;
            var data = this.opts.data;
            var that = this;

            if (opts.striped) {
                $('.datagrid-view1 .datagrid-body tr:odd', grid).addClass('datagrid-row-alt');
                $('.datagrid-view2 .datagrid-body tr:odd', grid).addClass('datagrid-row-alt');
            }
            if (opts.nowrap == false) {
                $('.datagrid-body .datagrid-cell', grid).css('white-space', 'normal');
            }

            $('.datagrid-header th:has(.datagrid-cell)', grid).hover(
			function () { $(this).addClass('datagrid-header-over'); },
			function () { $(this).removeClass('datagrid-header-over'); }
		);

            $('.datagrid-body tr', grid).mouseover(function () {
                var index = $(this).attr('datagrid-row-index');
                $('.datagrid-body tr[datagrid-row-index=' + index + ']', grid).addClass('datagrid-row-over');
            }).mouseout(function () {
                var index = $(this).attr('datagrid-row-index');
                $('.datagrid-body tr[datagrid-row-index=' + index + ']', grid).removeClass('datagrid-row-over');
            }).click(function () {
                var index = $(this).attr('datagrid-row-index');
                if ($(this).hasClass('datagrid-row-selected')) {
                    that.unselectRow(target, this);
                } else {
                    that.selectRow(target, this);
					opts.onSelected.call(that,index, data.dataList[index]);
                }
                if (opts.onClickRow) {
                    opts.onClickRow.call(that, index, data.dataList[index]);
                }
            }).dblclick(function () {
                var index = $(this).attr('datagrid-row-index');
                $(this).hasClass('datagrid-row-selected');
                if (opts.onDblClickRow) {
                    opts.onDblClickRow.call(that, index, data.dataList[index]);
                }
            });

            function onHeaderCellClick() {
                var th = $(this).parent();
                if (th.hasClass("sort-header")) {
                    opts.sortName = th.attr('data-code');
                    opts.sortOrder = 'asc';
                    
                    var c = 'datagrid-sort-asc';
                    if ($(this).hasClass('datagrid-sort-asc')) {
                        c = 'datagrid-sort-desc';
                        opts.sortOrder = 'desc';
                    }
                    $('.datagrid-header .datagrid-cell', grid).removeClass('datagrid-sort-asc').removeClass('datagrid-sort-desc');
                    $(this).addClass(c);
                    
                    if (opts.onSortColumn) {
                        opts.onSortColumn.call(this, opts.sortName, opts.sortOrder);
                    }
                    that._request(target);
                }
               
            }

            function onHeaderCheckboxClick() {
                if ($(this).attr('checked')) {
                    $('.datagrid-view2 .datagrid-body tr', grid).each(function () {
                        if (!$(this).hasClass('datagrid-row-selected')) {
                            $(this).trigger('click');
                        }
                    });
                } else {
                    $('.datagrid-view2 .datagrid-body tr', grid).each(function () {
                        if ($(this).hasClass('datagrid-row-selected')) {
                            $(this).trigger('click');
                        }
                    });
                }
            }

            $('.datagrid-header .datagrid-cell', grid).unbind('.datagrid');
            $('.datagrid-header .datagrid-cell', grid).bind('click.datagrid', onHeaderCellClick);

        
            $('.datagrid-header .datagrid-header-check', grid).bind('click', onHeaderCheckboxClick);

     

            var body1 = $('.datagrid-view1 .datagrid-body', grid);
            var body2 = $('.datagrid-view2 .datagrid-body', grid);
            var header2 = $('.datagrid-view2 .datagrid-header', grid);
            body2.scroll(function () {
                header2.scrollLeft(body2.scrollLeft());
                body1.scrollTop(body2.scrollTop());
            });
            
            
            
            
            
			
			opts.toolbar.find("a[data-rel='btn']").unbind("click").click(function(event){
				event.preventDefault();
				!$(this).hasClass("disabled")&&that.execute($(this).attr("name"),this);
			});
			opts.search.find("a[data-rel='btn']").unbind("click").click(function(event){
				event.preventDefault();
				!$(this).hasClass("disabled")&&that.execute($(this).attr("name"),this);
			});
			
			grid.find('.datagrid-body').on("change","input.datagrid-cell-edit",function(){
				var $tr =$(this).closest("tr"),
				    $this =$(this);
				that.options.data.dataList[$tr.attr("datagrid-row-index")][$this.attr("field")]=$this.val();
			});
			
			
        },
        /**
        * fix column size with the special cell element
        */
        _fixColumnSize: function (target, cell) {
            var grid = $.data(target, 'datagrid').grid;
            var opts = $.data(target, 'datagrid').options;
            var that = this;
            if (cell) {
                fix(cell);
            } else {
                $('.datagrid-header .datagrid-cell', grid).each(function () {
                    fix(this);
                });
            }

            function fix(cell) {
                var headerCell = $(cell);
                if (headerCell.width() == 0) return;
                var fieldName = headerCell.parent().attr('field');
                if (fieldName) {
                    $('.datagrid-body td[column-field="' + fieldName + '"]', grid).each(function () {
                        var bodyCell = $(".datagrid-cell", this);
                        if ($.boxModel == true) {
                            bodyCell.width(headerCell.outerWidth() - bodyCell.outerWidth() + bodyCell.width());
                        } else {
                            bodyCell.width(headerCell.outerWidth());
                        }

                    });

                    var col = that._getColumnOption(target, fieldName);
                    col.width = $.boxModel == true ? headerCell.width() : headerCell.outerWidth();
                }


            }
        },

   
        /**
        * load data to the grid
        */
        _loadData: function () {
            var grid = this.grid;
            var opts = this.opts;
            var that = this;
            var target =this.element;
                
            
            var getWidthDelta = function () {
                if ($.boxModel == false) return 0;

                var headerCell = $('.datagrid-header .datagrid-cell:first');
                var headerDelta = headerCell.outerWidth() - headerCell.width();

                var t = $('.datagrid-body table', grid);
                t.append($('<tr><td><div class="datagrid-cell"></div></td></tr>'));
                var bodyCell = $('.datagrid-cell', t);

                var bodyDelta = bodyCell.outerWidth() - bodyCell.width();

                return headerDelta - bodyDelta;
            };

            var widthDelta = getWidthDelta();
            var frozen = opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length > 0);

            $('.datagrid-body, .datagrid-header', grid).scrollLeft(0).scrollTop(0);
            
           
		    $('.datagrid-view2 .datagrid-body table', grid).html(opts.bodytmpl.render(this.opts.data.dataList||[]));
            
			



 
            this._setProperties(target);
        },
     
        /**
        * request remote data
        */
        _request: function (target) {
            var grid = $.data(target, 'datagrid').grid;
            var opts = $.data(target, 'datagrid').options;
            var that = this;

            if (!opts.url) {
            	this.opts.data.dataList=[];
            	return;
            }

            var param = $.extend({}, opts.queryParams);
            if (opts.pagination) {
                $.extend(param, {
                    currentPage: opts.pageNumber,
                    perNum: opts.pageSize
                });
            }
            if (opts.sortName) {
                $.extend(param, {
                    sortName: opts.sortName,
                    sortBy: opts.sortOrder
                });
            }


            var wrap = $('.datagrid-wrap', grid);
            $('<div class="datagrid-mask"></div>').css({
                display: 'block',
                width: wrap.width(),
                height: wrap.height()
            }).appendTo(wrap);
            $('<div class="datagrid-mask-msg"></div>')
				.html(opts.loadMsg)
				.appendTo(wrap)
				.css({
				    display: 'block',
				    left: (wrap.width() - $('.datagrid-mask-msg', grid).outerWidth()) / 2,
				    top: (wrap.height() - $('.datagrid-mask-msg', grid).outerHeight()) / 2
				});


            $.ajax({
                type: opts.method,
                url: opts.url,
                data: param,
                dataType: 'json',
                success: function (data) {
                    $('.datagrid-pager', grid).pagination({ loading: false });
                    $('.datagrid-mask', grid).remove();
                    $('.datagrid-mask-msg', grid).remove();
					that.opts.data=data.pageInfo;
					   


					
                    that._loadData(target, data.pageInfo);
                    
 
					
			        if(that.opts.pagination){
						that.opts.pager.pagination("pageSize",data.pageInfo.recordCount);
					}
			
                    if (opts.onLoadSuccess) {
                        opts.onLoadSuccess.apply(this, arguments);
                    }
                },
                error: function () {
                    $('.datagrid-pager', grid).pagination({ loading: false });
                    $('.datagrid-mask', grid).remove();
                    $('.datagrid-mask-msg', grid).remove();
                    if (opts.onLoadError) {
                        opts.onLoadError.apply(this, arguments);
                    }
                }
            });
       
        },
		

		/**
        * unselect a row.
        */
        unselectRow: function (target, tr) {
            var opts = $.data(target, 'datagrid').options;
            var grid = $.data(target, 'datagrid').grid;
            var selectedRows = $.data(target, 'datagrid').selectedRows;


            $(tr).removeClass('datagrid-row-selected');
            $(tr).find("input[type=checkbox].datagrid-cell-check").attr('checked', false);

            opts.onUnselect.call(target, tr);
        },
        selectRow:function (target, tr) {
            var opts = this.opts;
            var grid = this.grid;
            var data = this.opts.data;
            if (opts.singleSelect == true) {
                $(tr).siblings().removeClass("datagrid-row-selected").find("input[type=checkbox].datagrid-cell-check:checked").removeAttr("checked");
            }
            $(tr).addClass('datagrid-row-selected');
            $(tr).find("input[type=checkbox].datagrid-cell-check").attr('checked', true);
            opts.onSelect.call(target, tr);
        },
        getSelectedRows: function (target, idkey) {
            target = target || this.element;
			var that=this;
            var opts = this.opts;
            var rows = [];
            if (target.find("input[type=checkbox].datagrid-cell-check").length > 0 && idkey) {
                if (opts.singleSelect == true) {
                    rows = target.find("input[type=checkbox].datagrid-cell-check:checked:first").val();
                } else {
                    target.find("input[type=checkbox].datagrid-cell-check:checked").each(function () {
                        rows.push($(this).val());
                    });
                }
            } else {
            	target.find('tr.datagrid-row-selected').each(function () {
                    rows.push(that.opts.data.dataList[$(this).attr("datagrid-row-index")]);
                });
            }
            return rows;
        },
		insertRow:function(index,data){
			 var rows=this.opts.data.dataList;
			 index? rows.splice(index,data) : rows.push(data);
			 this._loadData();
		},
		removeRow:function(index,data){
			var rows=this.opts.data.dataList;
			if(index!=null&&index>=0){
				rows.splice(index,1);
			}else if(data&&$.inArray(data,rows)>-1){
				 rows.splice($.inArray(data,rows),1);
			}else{
				rows.pop();
			}
			this._loadData();
		},
		updateRow:function(index,data){
		  	if(index!=null&&index>=0&&data){
				this.opts.data.dataList[index]=data;
			}else if(data){
			  var oldData =	this.getSelect();
			   index = $.inArray(oldData,this.opts.data.dataList);
			   index>-1?this.opts.data.dataList[index]=data:"";
			}
		  	this._loadData();
		},
		getSelect:function(){
			return this.getSelectedRows()[0]||{};
		},
		
		selectAll:function(target){
			var target =  this.element;
			var grid = $.data(target, 'datagrid').grid;
			var that=this;
			grid.find(".datagrid-body tr:not(.datagrid-row-selected)").each(function(){
				that.selectRow(target,this);
			});
		},
		unselectAll:function(){
			var	target =  this.element;
			var grid = $.data(target, 'datagrid').grid;
			var that=this;
			grid.find(".datagrid-body tr.datagrid-row-selected ").each(function(){
				that.unselectRow(target,this);
			});
		},
		register:function(b, c){
            this.opts.actions[b] = c;

		},
		execute:function(a,b){
			 this.opts.actions[a].apply(this,[b]);

		},
		remove:function(a){
			this.opts.actions[a]=$.noop;
		},
		reLoadData:function(data){
		       this.opts.data={dataList:data,recordCount:0};
			this._loadData();
		},
		
		clearAllData:function(){
			this.opts.data={dataList:[],recordCount:0};
			this._loadData();
		},
		getAllData:function(){
			return this.opts.data.dataList;
		},
		refresh:function(url,queryParams){
		    this.opts.url=url||this.opts.url;
			$.extend(this.opts.queryParams,queryParams||{}); 
            this._request(this.element);
		},
		setOption:function(key,value){
			this.opts[key]=value;
		},
		show:function(){
			this.grid.show();
		},
		hide:function(){
			this.grid.hide();
		},
		
        _destroy: function () {

        }
    });
})(jQuery);
/**
 * 
 */

;(function($){
	
	var tabId = 0;

   function getNextTabId() {
	  return ++tabId;
    }
	
	$.widget("ui.comboxTree",{
		options:{
			width:'auto',
			treeWidth:null,
			treeHeight:200,
			prev:"combox_",
			sitting:null,
			url:null,
			onSelect:function(node){},
			onChange:function(newValue,oldValue){}
		},
		_create:function(options){
			this._opts=this.options;
			this._tagert = $(this.element).hide();
			this._combox = $('<div class="combox-tree"></div>').insertAfter(this._tagert).width(this._tagert.innerWidth()+"px");
			this._a = $('<a class="cbx-single" href="javascript:void(0)" tabindex="0"><div><b></b></div></a>').appendTo(this._combox);
			this._value=$("<span></span>").prependTo(this._a);
			this._dropList=$("<div class='cbx-drop'></div>").appendTo(this._combox).width(this._tagert.innerWidth()+"px").hide();;
			this._tree=$("<ul class='ztree' id='"+this._opts.prev+getNextTabId()+"'></ul>").appendTo(this._dropList);
			this._initData();
	
		
		},
		_initTree:function(){
			       var that=this;
				    if(that._opts.sitting){
			    	  $.extend(true,that._opts.sitting,{callback:{
							onClick : function(event, treeId, treeNode, clickFlag){
								that._tagert.attr("value",treeNode[that._opts.sitting.data.simpleData.idKey]);
								that._value.html(treeNode[that._opts.sitting.data.key.name]);
								that._a.trigger("click");
								that._opts.onSelect.apply(that,[treeNode]);
							}
						}			   
					    });
			    	  
						pousheng.ajaxData(that._opts.sitting.async.url).done(function(data){
							if(that._opts.sitting.async.dataFilter){
								that._opts.sitting.async.dataFilter.apply(that,[null, null,data]);
							}
							$.fn.zTree.init(that._tree, that._opts.sitting, data);
						});
			    }
			    that._a.toggle(function(){
					that._combox.addClass("combox-tree-active");
					that._a.addClass("cbx-single-with-drop");
					that._dropList.slideDown();
				},function(){				
					that._dropList.slideUp(function(){
						that._a.removeClass("cbx-single-with-drop");
						that._combox.removeClass("combox-tree-active");
					});
				});
			    that._a.trigger("click");
			    
				
		},
		_initData:function(){
			  var that=this;
			    if(that._tagert.val()!=""){
			    	var v={};
			    	v[that._opts.sitting.data.simpleData.idKey]=that._tagert.val();
			    	pousheng.ajaxData(that._opts.url,{data:v}).done(function(data){
			    		if(data.length>0){
			    			that._value.text(data) ;
				    		that._a.click(function(){
				    			that._a.unbind("click");
				    			that._initTree();	
				    		});
			    		}
			    	});
			    }
		},
		refresh:function(url){
			this._opts.url=url||this._opts.url;
			this._initData();
			return this;
		},
		destory:function(){
			
		}
	    
		
	});
	
})(jQuery);
;(function($,window, undefined){
  $.widget("pousheng.dropdown",{
	 options:{
		 click:$.noop
	 },
	 _create:function(){
		 var that =this;
		 var opts = this.options;
		 var $el = this.element.bind('click.dropdown', function(){
			 that._toggle.call(that);
			 return false;
		 });
		 
		 
        $('html').bind('click.dropdown', function () {
           $el.parent().find(".dropdown-menu").slideUp();
        });
        
        $el.parent().find(".dropdown-menu>li").bind("click.dropdown",function(event){
        	that._trigger("click",event,this);  
        })
        
        that._trigger("ready",null,this.element[0]);
		 
	 },
	 _toggle:function(){
      if (this.element.is('.disabled, :disabled')) return
         this.element.parent().find(".dropdown-menu").slideToggle()
       
	 },
	 open:function(){
		 this.element.parent().find(".dropdown-menu").slideUp();
	 },
	 close:function(){
		 this.element.parent().find(".dropdown-menu").slideDown();
	 },
	 
	 destory:function(){
		 
	 }
	  
	  
	  
  });
})(jQuery,window, undefined);
/*!
 * BPMS 业务流程管理系统
 * @VERSION
 * 创建人 liezun.xiao
 * 创建时间 2013-5-13
 *
 * Depends:
 *	jquery.js
 */

//---------------------------------------------------  
// 判断闰年  
//---------------------------------------------------  
Date.prototype.isLeapYear = function()   
{   
    return (0==this.getYear()%4&&((this.getYear()%100!=0)||(this.getYear()%400==0)));   
}   
  
//---------------------------------------------------  
// 日期格式化  
// 格式 YYYY/yyyy/YY/yy 表示年份  
// MM/M 月份  
// W/w 星期  
// dd/DD/d/D 日期  
// hh/HH/h/H 时间  
// mm/m 分钟  
// ss/SS/s/S 秒  
//---------------------------------------------------  
Date.prototype.format = function(formatStr)   
{   
    var str = formatStr;   
    var Week = ['日','一','二','三','四','五','六'];  
  
    str=str.replace(/yyyy|YYYY/,this.getFullYear());   
    str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));   
  
    str=str.replace(/MM/,this.getMonth()>9?this.getMonth().toString():'0' + this.getMonth());   
    str=str.replace(/M/g,this.getMonth());   
  
    str=str.replace(/w|W/g,Week[this.getDay()]);   
  
    str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());   
    str=str.replace(/d|D/g,this.getDate());   
  
    str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());   
    str=str.replace(/h|H/g,this.getHours());   
    str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());   
    str=str.replace(/m/g,this.getMinutes());   
  
    str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());   
    str=str.replace(/s|S/g,this.getSeconds());   
  
    return str;   
}   
  
//+---------------------------------------------------  
//| 求两个时间的天数差 日期格式为 YYYY-MM-dd   
//+---------------------------------------------------  
function daysBetween(DateOne,DateTwo)  
{   
    var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('-'));  
    var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('-')+1);  
    var OneYear = DateOne.substring(0,DateOne.indexOf ('-'));  
  
    var TwoMonth = DateTwo.substring(5,DateTwo.lastIndexOf ('-'));  
    var TwoDay = DateTwo.substring(DateTwo.length,DateTwo.lastIndexOf ('-')+1);  
    var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-'));  
  
    var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);   
    return Math.abs(cha);  
}  
  
  
//+---------------------------------------------------  
//| 日期计算  
//+---------------------------------------------------  
Date.prototype.dateAdd = function(strInterval, Number) {   
    var dtTmp = this;  
    switch (strInterval) {   
        case 's' :return new Date(Date.parse(dtTmp) + (1000 * Number));  
        case 'n' :return new Date(Date.parse(dtTmp) + (60000 * Number));  
        case 'h' :return new Date(Date.parse(dtTmp) + (3600000 * Number));  
        case 'd' :return new Date(Date.parse(dtTmp) + (86400000 * Number));  
        case 'w' :return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));  
        case 'q' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number*3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
        case 'm' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
        case 'y' :return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
    }  
}  
  
//+---------------------------------------------------  
//| 比较日期差 dtEnd 格式为日期型或者有效日期格式字符串  
//+---------------------------------------------------  
Date.prototype.dateDiff = function(strInterval, dtEnd) {   
    var dtStart = this;  
    if (typeof dtEnd == 'string' )//如果是字符串转换为日期型  
    {   
        dtEnd = StringToDate(dtEnd);  
    }  
    switch (strInterval) {   
        case 's' :return parseInt((dtEnd - dtStart) / 1000);  
        case 'n' :return parseInt((dtEnd - dtStart) / 60000);  
        case 'h' :return parseInt((dtEnd - dtStart) / 3600000);  
        case 'd' :return parseInt((dtEnd - dtStart) / 86400000);  
        case 'w' :return parseInt((dtEnd - dtStart) / (86400000 * 7));  
        case 'm' :return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);  
        case 'y' :return dtEnd.getFullYear() - dtStart.getFullYear();  
    }  
}  
  
//+---------------------------------------------------  
//| 日期输出字符串，重载了系统的toString方法  
//+---------------------------------------------------  
Date.prototype.toString = function(showWeek)  
{   
    var myDate= this;  
    var str = myDate.toLocaleDateString();  
    if (showWeek)  
    {   
        var Week = ['日','一','二','三','四','五','六'];  
        str += ' 星期' + Week[myDate.getDay()];  
    }  
    return str;  
}  
  
//+---------------------------------------------------  
//| 日期合法性验证  方法未验证正确性
//| 格式为：YYYY-MM-DD或YYYY/MM/DD  
//+---------------------------------------------------  
function IsValidDate(DateStr)   
{   
    var sDate=DateStr.replace(/(^\s+|\s+$)/g,''); //去两边空格;   
    if(sDate=='') return true;   
    //如果格式满足YYYY-(/)MM-(/)DD或YYYY-(/)M-(/)DD或YYYY-(/)M-(/)D或YYYY-(/)MM-(/)D就替换为''   
    //数据库中，合法日期可以是:YYYY-MM/DD(2003-3/21),数据库会自动转换为YYYY-MM-DD格式   
    var s = sDate.replace(/[\d]{ 4,4 }[\-]{ 1 }[\d]{ 1,2 }[\-]{ 1 }[\d]{ 1,2 }/g,'');   
    if (s=='') //说明格式满足YYYY-MM-DD或YYYY-M-DD或YYYY-M-D或YYYY-MM-D   
    {   
        var t=new Date(sDate.replace(/\-/g,'/'));   
        var ar = sDate.split(/[-\:]/);   
        if(ar[0] != t.getYear() || ar[1] != t.getMonth()+1 || ar[2] != t.getDate())   
        {   
            //alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。');   
            return false;   
        }   
    }   
    else   
    {   
        //alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。');   
        return false;   
    }   
    return true;   
}   
  
//+---------------------------------------------------  
//| 日期时间检查  
//| 格式为：YYYY-MM-DD HH:MM:SS  
//+---------------------------------------------------  
function checkDateTime(str)  
{   
    var reg = /^(\d+)-(\d{ 1,2 })-(\d{ 1,2 }) (\d{ 1,2 }):(\d{ 1,2 }):(\d{ 1,2 })$/;   
    var r = str.match(reg);   
    if(r==null)return false;   
    r[2]=r[2]-1;   
    var d= new Date(r[1],r[2],r[3],r[4],r[5],r[6]);   
    if(d.getFullYear()!=r[1])return false;   
    if(d.getMonth()!=r[2])return false;   
    if(d.getDate()!=r[3])return false;   
    if(d.getHours()!=r[4])return false;   
    if(d.getMinutes()!=r[5])return false;   
    if(d.getSeconds()!=r[6])return false;   
    return true;   
}   
  
//+---------------------------------------------------  
//| 把日期分割成数组  
//+---------------------------------------------------  
Date.prototype.toArray = function()  
{   
    var myDate = this;  
    var myArray = Array();  
    myArray[0] = myDate.getFullYear();  
    myArray[1] = myDate.getMonth();  
    myArray[2] = myDate.getDate();  
    myArray[3] = myDate.getHours();  
    myArray[4] = myDate.getMinutes();  
    myArray[5] = myDate.getSeconds();  
    return myArray;  
}  
  
//+---------------------------------------------------  
//| 取得日期数据信息  
//| 参数 interval 表示数据类型  
//| y 年 m月 d日 w星期 ww周 h时 n分 s秒  
//+---------------------------------------------------  
Date.prototype.datePart = function(interval)  
{   
    var myDate = this;  
    var partStr='';  
    var Week = ['日','一','二','三','四','五','六'];  
    switch (interval)  
    {   
        case 'y' :partStr = myDate.getFullYear();break;  
        case 'm' :partStr = myDate.getMonth()+1;break;  
        case 'd' :partStr = myDate.getDate();break;  
        case 'w' :partStr = Week[myDate.getDay()];break;  
        case 'ww' :partStr = myDate.WeekNumOfYear();break;  
        case 'h' :partStr = myDate.getHours();break;  
        case 'n' :partStr = myDate.getMinutes();break;  
        case 's' :partStr = myDate.getSeconds();break;  
    }  
    return partStr;  
}  
  
//+---------------------------------------------------  
//| 取得当前日期所在月的最大天数  
//+---------------------------------------------------  
Date.prototype.maxDayOfDate = function()  
{   
    var myDate = this;  
    var ary = myDate.toArray();  
    var date1 = (new Date(ary[0],ary[1]+1,1));  
    var date2 = date1.dateAdd(1,'m',1);  
    var result = dateDiff(date1.Format('yyyy-MM-dd'),date2.Format('yyyy-MM-dd'));  
    return result;  
}  
  
//+---------------------------------------------------  
//| 取得当前日期所在周是一年中的第几周  
//+---------------------------------------------------  
Date.prototype.weekNumOfYear = function()  
{   
    var myDate = this;  
    var ary = myDate.toArray();  
    var year = ary[0];  
    var month = ary[1]+1;  
    var day = ary[2];  
    document.write('< script language=VBScript\> \n');  
    document.write('myDate = Datue(""+month+"-"+day+"-"+year+"") \n');  
    document.write('result = DatePart("ww", myDate) \n');  
    document.write(' \n');  
    return result;  
}  
  
//+---------------------------------------------------  
//| 字符串转成日期类型   
//| 格式 MM/dd/YYYY MM-dd-YYYY YYYY/MM/dd YYYY-MM-dd  
//+---------------------------------------------------  
function stringToDate(DateStr)  
{   
  
    var converted = Date.parse(DateStr);  
    var myDate = new Date(converted);  
    if (isNaN(myDate))  
    {   
        //var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';  
        var arys= DateStr.split('-');  
        myDate = new Date(arys[0],--arys[1],arys[2]);  
    }  
    return myDate;  
}  

function curentTime()
    { 
        var now = new Date();
       
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
       
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
       
        var clock = year + "-";
       
        if(month < 10)
            clock += "0";
       
        clock += month + "-";
       
        if(day < 10)
            clock += "0";
           
        clock += day + " ";
       
        if(hh < 10)
            clock += "0";
           
        clock += hh + ":";
        if (mm < 10) clock += '0'; 
        clock += mm; 
        return(clock); 
    } 

(function($,window, undefined){

	$.widget("ui.scrollspy",{
		options:{
			 offset: 36,
			 contain:null,
			 target:null,
			 header:null,
			 headCls:null,
			 selector:null,
			 width:"auto",
			 height:"auto",
			 fit:true
		},
		_create:function(){
		    var that=this;
		    this.opts =this.options;
			this.element = this.element.is('body') ? $(window) : this.element;
			
			this.opts.contain = this.opts.contain||this.element.addClass("content").wrap("<div></div>").parent().addClass("scrollspy");
			this.opts.header= this.opts.header||$("<div></div>").addClass("header").prependTo(this.opts.contain);
			
		
			this.scrollElement = this.element.bind("scroll.scrollspy",function(){
				that._process.call(that); 
			} );
			
           
            this.refresh();
           
		},
		_setSize:function(){
			var that =this;
			if (this.opts.fit == true) {
                var p = this.opts.contain.parent();
                this.opts.width = p.innerWidth();
                this.opts.height = p.innerHeight();
            }
			
			
			this.opts.contain.css({
				width:this.opts.width,
				height:this.opts.height
			});
			this.element.css({
				 "margin-top": that.opts.header.height(),
				 height:this.opts.height-that.opts.header.height()
			});
			
		},
		_process:function(){
				
	        var scrollTop = this.scrollElement.scrollTop() + this.opts.header.height()
	          , scrollHeight = this.scrollElement[0].scrollHeight || this.body[0].scrollHeight
	          , maxScroll = scrollHeight - this.scrollElement.height()
	          , offsets = this.offsets
	          , targets = this.targets
	          , activeTarget = this.activeTarget
	          , i
	
	        if (scrollTop >= maxScroll) {
	          return activeTarget != (i = targets.last()[0])
	            && this.activate ( i )
	        }
	
	        for (i = offsets.length; i--;) {
	          activeTarget != targets[i]
	            && scrollTop >= offsets[i]
	            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
	            && this.activate( targets[i] )
	        }
           
		},
		
		refresh:function(){
			
			var that =this;
			that.offsets = $([]);
            that.targets = $([]);
            var   $ul =$("<ul></ul>").addClass("nav nav-pills");
          
             this.opts.header.html($ul);
  
             this.element.find(this.opts.selector||">div,>section").each(function () {
             	var  $this =$(this),$li =$("<li></li>");
            that.offsets.push($(this).position().top);
            $li.html($("<a/>").attr("href","javascript:void(0)").html($this.attr("title"))).data("offsets",$(this).position()).appendTo($ul);
            that.targets.push($li);
            $li.bind("click.scrollspy",function(){
            	that.element.scrollTop(that.offsets[$.inArray($li,that.targets)]);
            	that.activate($li);
            });
        
          });
            $ul.find("li:first").trigger("click");
            this._setSize();
		},
		activate:function(target){
			var that =this;
		    target.addClass("active").siblings().removeClass("active");
		
		},
		
		resize:function(){
			
		},
		destory:function(){
			
		},
		
		
		
	});
	
	
	
})(jQuery,window, undefined)