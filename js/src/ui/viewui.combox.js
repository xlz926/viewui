/**
*  @author liezun.xiao
* @author liezun.xiao@pousheng.com
* Depends:
*  
*/

;(function($){
	$.widget("ui.combox",{
		options:{
		width: 'auto',
		listWidth: null,
		listHeight: null,
		valueField: 'value',
		textField: 'text',
		editable: true,
		url: null,
		
		onLoadSuccess: function(){},
		onLoadError: function(){},
		onSelect: function(record){},
		onChange: function(newValue, oldValue){}
		}
		
	});
	
})(jQuery);