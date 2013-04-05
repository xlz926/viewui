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