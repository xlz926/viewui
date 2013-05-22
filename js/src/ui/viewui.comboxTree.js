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
			    	  
						viewui.ajaxData(that._opts.sitting.async.url).done(function(data){
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
			    	viewui.ajaxData(that._opts.url,{data:v}).done(function(data){
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