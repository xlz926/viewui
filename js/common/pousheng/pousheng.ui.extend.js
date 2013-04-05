/*!
 *	jquery.ui.widget.js
 */
;(function($){
	
	/*!
	 *	jquery.ui.widget.js
	 *tabs("addTab",url,label,index);
	 */
	$.widget( "ui.tabs", $.ui.tabs, {
		options: {
			idPrefix: "ui-tabs-",
			show:"fadeIn",
			callBack:null
		},
		addTab: function( url, label, index ,ids) {
			var that=this;
			var tabLi=$("<li></li>"),tabA=$("<a></a>"),tabClose=$("<span class='ui-icon ui-icon-close'>\xd7</span>");
			if ( !index ) {
				index = this.anchors.length;
			}
			var doInsertAfter,id;
			id=this.options.idPrefix+ids||index;
			if(this.tablist.find("a[href='#"+id+"']").length>0){
			 	this.option("active",$("a[href='#"+id+"']").closest("li").index());
			}else{
				
				tabA.attr("href","#"+id).text(label).append(tabClose).appendTo(tabLi);
				tabLi.addClass( "ui-state-default ui-corner-top" ).data( "ui-tabs-destroy", true );
				tabLi.attr( "aria-controls", id );

				doInsertAfter = index >= this.tabs.length;
				// try to find an existing element before creating a new one
				panel = this.element.find(id);
				if ( !panel.length ) {
					panel = this._createPanel( id );
					panel.load(url,function(responseText, textStatus, XMLHttpRequest){
						if($.isFunction(that.options.callBack)&&textStatus=="success"){
							that.options.callBack(panel);
						}else{
							 return false;
						}
					});
					if ( doInsertAfter ) {
						if ( index > 0 ) {
							panel.insertAfter( this.panels.eq( -1 ) );
						} else {
							panel.appendTo( this.element );
						}
					} else {
						panel.insertBefore( this.panels[ index ] );
					}
				}
				panel.addClass( "ui-tabs-panel ui-widget-content ui-corner-bottom" ).show();

				if ( doInsertAfter ) {
					tabLi.appendTo( this.tablist );
				} else {
					tabLi.insertBefore( this.tabs[ index ] );
				}

				this.options.disabled = $.map( this.options.disabled, function( n ) {
					return n >= index ? ++n : n;
				});

				this.refresh();
				if ( this.tabs.length === 1 && this.options.active === false ) {
					this.option( "active", 0 );
				}else{
					this.option("active",index);
				}
				
				tabClose.click(function(){
					var index = $(this).closest("li").index();
					that.remove(index );
				});
				
			}
		
			return this;
		}
	});
	
	
	
	  /*!
	   *添加对话框自动关闭方法
	   *dialog(time,second);
	   */
	    $.widget( "ui.dialog", $.ui.dialog, {
	    	  options:{
	    		  seconds:false,
	    		  size:null
	    	  },
	    	  _create:function(){
	    		  this._super();
	    		  var that =this;
	    		  if(this.options.seconds){
	    			  setTimeout(function(event){
	                    that.close(event);
	                }, 1000 * seconds);
	    		  }
	    		  if(this.options.size){
	    			  this.setSize(this.options.size);
	    		  }
	    	  },
	            time:function (second) {
	            var that = this,
	                timer = that.options.timer;
	                
	            timer && clearTimeout(timer);
	            
	            if (second) {
	                that.options.timer = setTimeout(function(event){
	                    that.close( event );
	                }, 1000 * second);
	            };
	            return that;
	        },
	        setSize: function(size){
                size = size || "normal";
                var w = $(window);
                switch (size) {
                    case 'normal':
                    	this.option({
                            width: w.width() / 2,
                            height: w.height() / 2
                        });
                        break;
                    case 'small':
                       this.option({
                            width: w.width() / 4,
                            height: w.height() / 4
                        });
                        break;
                    case 'large':
                       this.option({
                            width: w.width()*3 / 4,
                            height: w.height()*3 / 4
                        });
                        break;
                    case 'full':
                        this.option({
                            width: w.width(),
                            height: w.height()
                        });
                        break;
                }
				this.option({"position":{ my: "center", at: "center", of: window }});
				return this;
            }
	    });
	    
	 
	

})(jQuery);