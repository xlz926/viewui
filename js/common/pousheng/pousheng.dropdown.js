;(function($,window, undefined){
  $.widget("pousheng.dropdown",{
	 options:{
		 
	 },
	 _create:function(){
		 var that =this;
		 var $el = this.element.bind('click.dropdown', function(){
			 that._toggle.call(that);
			 return false;
		 });
        $('html').bind('click.dropdown', function () {
           $el.parent().find(".dropdown-menu").slideUp();
        });
		 
	 },
	 _toggle:function(){
      if (this.element.is('.disabled, :disabled')) return
         this.element.parent().find(".dropdown-menu").slideToggle()
       
	 },
	 
	 destory:function(){
		 
	 }
	  
	  
	  
  });
})(jQuery,window, undefined);