; (function ($, window, undefined){

	var taskBar = $("<div></div>").attr("id","taskbar").taskbar().appendTo("body");
	
	
    $.widget("pousheng.modal",$.ui.dialog,{
    	options:{
    		width:$(window).width(),
			height:$(window).height()-taskBar.height(),
			resizable:false,
			headerCls:"",
			bodyCls:"",
			fit:true,
			position:{ my: "center", at: "center top-30px", of: window },
			maxHeight:$(window).height()-taskBar.height(),
			oldSize:{width:$(window).width()/2,height:$(window).height()/2},
			open:function(){
				taskBar.taskbar("show");
			   
			}
    	},
        _create:function(){
        	this._super();
        	var that =this;
        	var opts =this.options;
        	this.oldOffset={widht:opts.width,height:opts.height};
        	
        	var uiDialogTitlebar =  this.uiDialog.find(".ui-dialog-titlebar").addClass(opts.headerCls),
        	     titlebarbuttons =$("<div></div>").addClass("ui-dialog-titlebar-buttons"),
        	    titlebarClose,
        	    titlebarMin,
        	    titleBarNewMax,
        	    titlebarNewwin;
        	uiDialogTitlebar.find("a[role='button']").remove();
        	
        	
        	titlebarMin =$( "<a href='#'></a>" )
				.addClass( "ui-corner-all" )
				.attr( "role", "button" )
				.click(function( event ) {
					event.preventDefault();
					that.min( event );
				}).append("<span class='ui-icon ui-icon-minusthick'></span>")
				.appendTo( titlebarbuttons );
        	
        	
        	
        	titleBarNewMax =$( "<a href='#'></a>" )
				.addClass( "ui-corner-all" )
				.attr( "role", "button" )
				.append("<span class='ui-icon ui-icon-newwin'></span>")
				.appendTo( titlebarbuttons ).click(function( event ) {
					that.newwin( event,opts.oldSize );
				});
            titlebarClose =$( "<a href='#'></a>" )
				.addClass( " ui-corner-all" )
				.attr( "role", "button" )
				.click(function( event ) {
					event.preventDefault();
					that.closethick( event );
				}).append("<span class='ui-icon ui-icon-closethick'></span>")
				.appendTo( titlebarbuttons );
        		
        		
        		titlebarbuttons.appendTo(uiDialogTitlebar);
        		
        		this.element.addClass(opts.bodyCls);
        	 
        		
        		$(window).bind("resize",function(){
        			that._setSize();
        			that.element.children().triggerHandler('_resize');
        		});
        		taskBar.taskbar("addDialog",opts.title).data("modal",this);;
        		opts.autoOpen?taskBar.taskbar("show"):taskBar.taskbar("hide");
        		
        	//this._setSize();
        },
        _setSize:function(){
        	var opts = this.options;
            if (opts.fit == true) {
                var p = this.uiDialog.parent();
                opts.width = p.innerWidth();
                opts.height = p.innerHeight()-taskBar.outerHeight();
            }
            this._size();
          
        },
        min:function(event){
        	this.close();
        
        },
        
        closethick:function(event){
        	//
        	taskBar.taskbar("close",this.options.title);
        	this.close();
        	this.destroy();
        },
        newwin:function(event,param){
            this.options.width= param.width;
            this.options.height=param.height;
            this._size();
        },
        
        
        
        
        destroy:function(){
        	this._destroy();
        }
    })
	

	
})(jQuery,window,undefined);