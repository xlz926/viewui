/*!
 * jQuery UI Accordion @VERSION
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/accordion/
 *
 */
(function($,window, undefined){
	
	$.widget("pousheng.viewform",{
		options:{
			all:true
		},
		_create:function(){
			$(".form-area li>label.red").removeClass("red");
			
			if(this.options.all){
				this.repalcePend();
				//this.repalcecombox();
				this.repalceInput();
				this.repalceButtonset();
			}
		},
		repalceInput:function(){
           this.element.find("input:text,input:password").filter(':visible').each(function(){
                $(this).replaceWith($("<label class='showLable'/>").width($(this).width()).html($(this).val()));
           });
           this.element.find("select").filter(':visible').each(function(){
        	   $(this).replaceWith($("<label class='showLable'/>").width($(this).width()).html($(this).find("option:checked").text()));
           });
		},
		repalcecombox:function(){
			this.element.find(".combox-tree").each(function(){
				var label = $("<label class='showLable'/>").width($(this).width()).html($(this).find(".cbx-single").text());
				$(this).replaceWith(label);
			});
		},
		repalcePend:function(){
			 this.element.find(".input-append").each(function(){
                		$(this).replaceWith($("<label class='showLable'/>").width($(this).width()).html($(this).find("input:text").val()))
               });
		},
		repalceButtonset:function(){
			this.element.find(".ui-buttonset").each(function(){
				$(this).replaceWith($("<label class='showLable'/>").html($(this).find(".ui-state-active>span").text()))
			});
		}
	});
	
})(jQuery,window, undefined);