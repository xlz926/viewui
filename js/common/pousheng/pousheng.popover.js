; (function ($, window, undefined){
	
	$.widget("ui.popover",$.ui.tooltip,{
		options:{
			  placement: 'right', 
			  trigger: 'click', 
			  content: '', 
			  template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
		},
		_create:function(){
			 this._super();
			 this.opts=this.options;
			 $tip = $(this.opts.template);
			 $tip.find('.popover-content').html(this._getContent());
			 $tip.find('.popover-title').html(this._getContent());
		},
		_getContent:function(){
			
        return this.element.attr('data-content') || 
        (typeof this.opts.content == 'function' ? this.opts.content.call(this) :  this.opts.content);

		},
		_getTitle:function(){
       return this.element.attr('data-original-title')
        || (typeof this.opts.title == 'function' ? this.opts.title.call($e[0]) :  this.opts.title);

		},
		destory:function(){
			
			
			
		}
		
		
	});
	
})(jQuery,window,undefined);