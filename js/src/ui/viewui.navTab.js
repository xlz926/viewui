; (function ($, window, undefined){
	
	$.widget("viewui.navTab",$.viewui.tabs,{
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
        	var tabAttr =this.getSelected();
        	var panel =tabAttr.panel.ajaxLoad(href,{data:param},callback);
        	return tabAttr;
        },
        newTab:function(href,title){
        	this.addTab({"title":title,"href":href});
        	this._locationWrapperPut(href);
        }
        
        
	});
})(jQuery,window,undefined);