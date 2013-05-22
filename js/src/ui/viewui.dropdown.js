;(function($,window, undefined){
  $.widget("viewui.dropdown",{
	 options:{
		 click:$.noop
	 },
	 _create:function(){
		 var that =this;
		 var opts = this.options;
		 var $el = this.element.bind('click.dropdown', function(){
			 that._toggle.call(that);
			 return false;
		 });
		 
		 
        $('html').bind('click.dropdown', function () {
           $el.parent().find(".dropdown-menu").slideUp();
        });
        
        $el.parent().find(".dropdown-menu>li").bind("click.dropdown",function(event){
        	that._trigger("click",event,this);  
        })
        
        that._trigger("ready",null,this.element[0]);
		 
	 },
	 _toggle:function(){
      if (this.element.is('.disabled, :disabled')) return
         this.element.parent().find(".dropdown-menu").slideToggle()
       
	 },
	 open:function(){
		 this.element.parent().find(".dropdown-menu").slideUp();
	 },
	 close:function(){
		 this.element.parent().find(".dropdown-menu").slideDown();
	 },
	 
	 destory:function(){
		 
	 }
	  
	  
	  
  });
})(jQuery,window, undefined);