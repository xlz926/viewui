; (function ($, window, undefined){

     var sizeRelatedOptions = {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},
	resizableRelatedOptions = {
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	},
    modalArea = $('<div class="modal-area"></div>').css({
        position:"fixed",
        height:"100%",
        height:"100%"
    });

   modalArea.content=$("<div/>").addClass("modal-content").appendTo(modalArea);
   modalArea.taskbar ={element: $("<div/>").attr("id","taskbar").appendTo(modalArea)};
   modalArea.taskbar.element.append('<div class="taskbarContent"><ul class="taskList"></ul></div><div  class="taskbarLeft"></div><div class="taskbarRight"></div></div>');


    $(function(){
         modalArea.appendTo("body")
    });
	         
    $.widget("view.modal",{
    	options:{
    		width:600,
			resizable:false,
			headerCls:"",
			bodyCls:"",
			fit:true,
            autoShow:true,
            draggable:true,
            height:200,
            effect:"fade",
			position:{ my: "center", at: "center", of: window },
			oldSize:{width:$(window).width()/2,height:$(window).height()/2},
			open:function(){
				//taskBar.taskbar("show");
			   
			}
    	},
        _create:function(){
        	this._super();
        	var that =this;
        	var opts =this.options;
        
        	
         
        	this._wrap();

           if ( opts.draggable && $.fn.draggable ) {
			    this._makeDraggable();
		    }

            if(opts.autoShow){
                 this.show();
            }


            modalArea.taskbar.addDialog(opts.title);

        },
        _wrap:function(){
          this.viewModal = $("<div/>").addClass("modal").appendTo(modalArea.content);
          var header = $("<div/>").addClass("modal-header"),
              title =$("<h3/>").text(this.options.title||this.element.attr("title"));
              body  =$("<div/>").addClass("modal-body").append(this.element); 
              footer =$("<div/>").addClass("modal-footer");
           this.viewModal.append(header.append(title)).append(body).append(footer)
              .position(this.options.position);
             
        
        },
        _setSize:function(){
       



//        	var opts = this.options;
//            if (opts.fit == true) {
//                var p = this.uiDialog.parent();
//                opts.width = p.innerWidth();
//                opts.height = p.innerHeight()-taskBar.outerHeight();
//            }
//            this._size();
              this.viewModal.css({width:this.options.width,height:this.options.height});
              this.viewModal.find(".modal-body").css({
              width:this.viewModal.innerWidth(),
              height:(this.viewModal.innerHeight()-this.viewModal.find(".modal-footer").outerHeight()-this.viewModal.find(".modal-header").outerHeight())
              });

          
        },
        min:function(event){
        	this.close();
        
        },


      _makeDraggable: function() {
		var that = this,
			options = this.options;

		function filteredUi( ui ) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}

		this.viewModal.draggable({
			cancel: ".modal-footer, .modal-body",
			handle: ".modal-header",
			containment: "document",
			start: function( event, ui ) {
				$( this )
					.addClass( "ui-dialog-dragging" );
				that._trigger( "dragStart", event, filteredUi( ui ) );
			},
			drag: function( event, ui ) {
				that._trigger( "drag", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				options.position = [
					ui.position.left - that.document.scrollLeft(),
					ui.position.top - that.document.scrollTop()
				];
				$( this )
					.removeClass( "ui-dialog-dragging" );
				that._trigger( "dragStop", event, filteredUi( ui ) );
				$.ui.dialog.overlay.resize();
			}
		});
	},

	_makeResizable: function( handles ) {
		handles = (handles === undefined ? this.options.resizable : handles);
		var that = this,
			options = this.options,
			// .ui-resizable has position: relative defined in the stylesheet
			// but dialogs have to use absolute or fixed positioning
			position = this.uiDialog.css( "position" ),
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

		this.uiDialog.resizable({
			cancel: ".ui-dialog-content",
			containment: "document",
			alsoResize: this.element,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			minWidth: options.minWidth,
			minHeight: this._minHeight(),
			handles: resizeHandles,
			start: function( event, ui ) {
				$( this ).addClass( "ui-dialog-resizing" );
				that._trigger( "resizeStart", event, filteredUi( ui ) );
			},
			resize: function( event, ui ) {
				that._trigger( "resize", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				$( this ).removeClass( "ui-dialog-resizing" );
				options.height = $( this ).height();
				options.width = $( this ).width();
				that._trigger( "resizeStop", event, filteredUi( ui ) );
				$.ui.dialog.overlay.resize();
			}
		})
		.css( "position", position )
		.find( ".ui-resizable-se" )
			.addClass( "ui-icon ui-icon-grip-diagonal-se" );
	},
        
        closethick:function(event){
        	//
//        	taskBar.taskbar("close",this.options.title);
//        	this.close();
//        	this.destroy();
        },
        newwin:function(event,param){
            this.options.width= param.width;
            this.options.height=param.height;
            this._size();
        },
        
        show:function(){
           // modal_backdrop.appendTo("body");
            this.viewModal.show(this.options.effect);
            
        },
        
        
        
        destroy:function(){
        	this._destroy();
        }
    })
	
    $.extend(modalArea.taskbar,{
	    init:function(){
               this.tasks=[];
			   this.element.append('<div class="taskbarContent"><ul class="taskList"></ul></div><div  class="taskbarLeft"></div><div class="taskbarRight"></div></div>');
		},
		
		getCurrent:function(){
			return this.element.find("li.selected");
		},
		addDialog:function(title){
			var that  =this;
				this.show();
				var taskSelected=this.element.find("li[title='"+title+"']") ;
				if(!taskSelected.length){
					var taskFrag = '<li  title="#title#"><a class="taskbutton" ><i class="icon-th-list icon-white"></i><span>#title#</span></a><div class="close"></div></li>';
				    taskSelected =  $(taskFrag.replace(/#title#/ig,title)).appendTo(this.element.find(".taskList"));
				    
				taskSelected.click(function(){
					 var $this =$(this), modal = $this.data("modal");
					 console.log(modal.isOpen());
					  modal.isOpen()?modal.close(): modal.open();
				});
				
				taskSelected.find(".close").bind("click.taskbar",function(){
					that.close(title);
				})
				
			
				    
				}
			
				
				
				this.switchTask(title);
				this.show();
			   return taskSelected;
		},
		removeDialog:function(title){
			this.element.find("li[title='"+title+"']").remove();
		},
		switchTask:function(title){
			this.getTask(title).addClass("selected");
		},
		close:function(title){
		
			var li = this.element.find("li[title='"+title+"']");
					li.data("modal")&&li.data("modal")._destroy();
					li.remove();

			if(this.element.find(".taskList li").length==0){
				this.hide();
			
			};
		},
		getTask:function(title){
			return this.element.find("li[title='"+title+"']");
		},
		show:function(opts){
			this.element.find(".taskList").children("li").length?this.element.slideDown(opts||{}):"";
			//this.element.slideDown(opts||{});
		},
		hide:function(opts){
			this.element.slideUp(opts||{});
		},
		destroy:function(){
			//this._destroy();
		}
		
	
	});
	
})(jQuery,window,undefined);