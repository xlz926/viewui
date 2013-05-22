; (function ($, window, undefined){

    $.widget("viewui.modal",{
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

			position = $.extend( {}, $.viewui.modal.prototype.options.position, position );
		} else {
			position = $.viewui.modal.prototype.options.position;
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
          
		if ( opts.zIndex > $.viewui.modal.maxZ ) {
			$.viewui.modal.maxZ = opts.zIndex;
		}
		
		$.viewui.modal.maxZ += 1;
		this.uiModal.css( "z-index", $.viewui.modal.maxZ );
		
		this._trigger( "focus", event );
		return this;
        },
        destroy:function(){
        	this._destroy();
        }
    });
 

    
$.extend($.viewui.modal, {
	uuid: 0,
	maxZ: 10000,
});
    




     //添加全局对话框函数
     $.modal=function(options){
        return $("<div/>").modal(options);
     }



	
})(jQuery,window,undefined);