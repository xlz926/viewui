/**
*  @author liezun.xiao
* @author liezun.xiao@pousheng.com
* Depends:
*  
*/

; (function ($, window, undefined) {
    $.widget("ui.combo", {
        options: {
            width: 'auto',
		    panelWidth: null,
		    panelHeight: 200,
		    multiple: false,
		    separator: ',',
		    editable: true,
		    disabled: false,
		    required: false,
		    missingMessage: 'This field is required.'
        },
        _create: function () {
           this.element.data(this.widgetName,this._wrapCombo());
           this._setSize(); 
           this._bindEvents();

        },
        _wrapCombo:function(){
            this.element.hide();
            var span = $('<span class="combo"></span>').insertAfter(this.element);
		    var input = $('<input type="text" class="combo-text">').appendTo(span);

		    $('<span><span class="combo-arrow"></span></span>').appendTo(span);
		    $('<input type="hidden" class="combo-value">').appendTo(span);
		    var panel = $('<div class="combo-panel"></div>').appendTo('body');

            panel.panel({
			    doSize:false,
			    closed:true,
			    style:{
				    position:'absolute'
			    },
			    onOpen:function(){
				    $(this).panel('resize');
			    }
		    });
		
		    var name = this.element.attr('name');
		    if (name){
			    span.find('input.combo-value').attr('name', name);
			    this.element.removeAttr('name').attr('comboName', name);
		    }
		    return {
			    combo: span,
			    panel: panel
		    };
        },
        _setSize:function(width){
       
       	    var opts = this.options,
		        combo = this.element.data(this.widgetName).combo,
		        panel = this.element.data(this.widgetName).panel;
		
		    if (width) opts.width = width;
		
		    if (isNaN(opts.width)){
			    opts.width = combo.find('input.combo-text').outerWidth();
		    }
		    var arrowWidth = combo.find('.combo-arrow').outerWidth();
		    var width = opts.width - arrowWidth;
		    combo.find('input.combo-text').width(width);
		
		    panel.panel('resize', {
			    width: (opts.panelWidth ? opts.panelWidth : combo.outerWidth()),
			    height: opts.panelHeight
		    });
       
        },
        _parseOptions:function(){
        
        },
        _bindEvents:function(){
        	var opts = this.options;
                that =this,
		        combo = this.element.data(this.widgetName).combo,
		        panel = this.element.data(this.widgetName).panel,
		        input = combo.find('.combo-text'),
		        arrow = combo.find('.combo-arrow'),
                keyCode = $.ui.keyCode;
      
		    $(document).unbind('.'+this.widgetName);
		    combo.unbind('.'+this.widgetName);
		    panel.unbind('.'+this.widgetName);
		    input.unbind('.'+this.widgetName);
		    arrow.unbind('.'+this.widgetName);

            if (!opts.disabled){
			    panel.bind('mousedown.'+this.widgetName, function(e){
				    return false;
			    });
			
			    input.bind('focus.'+this.widgetName, function(e){
                   e.stopPropagation();   
				   that.showPanel();
                   console.log(312);
			    }).bind('mousedown.'+this.widgetName, function(e){
				    e.stopPropagation();
			    }).bind('keyup.'+this.widgetName, function(e){
				    switch(e.keyCode){
					    case keyCode.LEFT:	// left
					    case keyCode.UP:	// up
						    that._trigger("selectPrev",e,that.element[0]);
						    break;
					    case keyCode.RIGHT:	// right
					    case keyCode.DOWN:	// down
						   that._trigger("selectNext",e,that.element[0]);
						    break;
					    case keyCode.ENTER:	// enter
						   that._trigger("selectCurr",e,that.element[0]);
						    break;
					    case keyCode.ESCAPE:	// esc
						    that.hidePanel();
						    break;
					    default:
						    if (opts.editable){
							    opts.filter.call(target, $(this).val());
						    }
				    }
				    return false;
			    }).bind('blur',function(e){
                  e.stopPropagation(); 
                  panel.panel('close');
                  
                });
			
			    arrow.bind('click.'+this.widgetName, function(e){
                   e.stopPropagation(); 
				    input.triggerHandler('focus');
			    }).bind('mouseenter.'+this.widgetName, function(){
				    $(this).addClass('combo-arrow-hover');
			    }).bind('mouseleave.'+this.widgetName, function(){
				    $(this).removeClass('combo-arrow-hover');
			    });
		    }

        },
        getText:function(){
           return this.element.data(this.widgetName).combo.find('input.combo-text').val();
        },
        setText:function(text){
             this.element.data(this.widgetName).combo.find('input.combo-text').val(text);
        },
        showPanel:function(){
        
            var combo = this.element.data(this.widgetName).combo,
		        panel = this.element.data(this.widgetName).panel;
		
		    if ($.viewui){
			    panel.panel('panel').css('z-index', $.viewui.zIndex++);
		    }
			
           panel.panel('open');
    
		    (function(){
			    if (panel.is(':visible')){
				    var top = combo.offset().top + combo.outerHeight();
				    if (top + panel.outerHeight() > $(window).height() + $(document).scrollTop()){
					    top = combo.offset().top - panel.outerHeight();
				    }
				    if (top < $(document).scrollTop()){
					    top = combo.offset().top + combo.outerHeight();
				    }
				    panel.panel('move', {
					    left:combo.offset().left,
					    top:top
				    });
				  //  setTimeout(arguments.callee, 200);
			    }
		    })();


        },
        hidePanel:function(){
            this.element.data(this.widgetName).panel.panel('close');
		
        },
        clear:function(){
       	    var combo =this.element.data(this.widgetName).combo;
		    combo.find('input.combo-value:gt(0)').remove();
		    combo.find('input.combo-value').val('');
		    combo.find('input.combo-text').val('');
       
        },
        getValues:function(){
        
            var values = [];
		    var combo = this.element.data(this.widgetName).combo;
		    combo.find('input.combo-value').each(function(){
			    values.push($(this).val());
		    });
		    return values;

        },
        setValues:function(values){
          
            var opts = this.options;
		    var oldValues = this.getValues();
		
		    var combo = this.element.data(this.widgetName).combo;
		    combo.find('input.combo-value').remove();
		    var name = this.element.attr('comboName');
		    for(var i=0; i<values.length; i++){
			    var input = $('<input type="hidden" class="combo-value">').appendTo(combo);
			    if (name) input.attr('name', name);
			    input.val(values[i]);
		    }

        },
        panel:function(){
          return this.element.data(this.widgetName).panel;
        },
        destroy: function () {
           this.element.data('combo').panel.panel('destroy');
		   this.element.data('combo').combo.remove();

        }
    });

})(jQuery, window, undefined);