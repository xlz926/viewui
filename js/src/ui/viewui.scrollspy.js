(function($,window, undefined){

	$.widget("ui.scrollspy",{
		options:{
			 offset: 36,
			 contain:null,
			 target:null,
			 header:null,
			 headCls:null,
			 selector:null,
			 width:"auto",
			 height:"auto",
			 fit:true
		},
		_create:function(){
		    var that=this;
		    this.opts =this.options;
			this.element = this.element.is('body') ? $(window) : this.element;
			
			this.opts.contain = this.opts.contain||this.element.addClass("content").wrap("<div></div>").parent().addClass("scrollspy");
			this.opts.header= this.opts.header||$("<div></div>").addClass("header").prependTo(this.opts.contain);
			
		
			this.scrollElement = this.element.bind("scroll.scrollspy",function(){
				that._process.call(that); 
			} );
			
           
            this.refresh();
           
		},
		_setSize:function(){
			var that =this;
			if (this.opts.fit == true) {
                var p = this.opts.contain.parent();
                this.opts.width = p.innerWidth();
                this.opts.height = p.innerHeight();
            }
			
			
			this.opts.contain.css({
				width:this.opts.width,
				height:this.opts.height
			});
			this.element.css({
				 "margin-top": that.opts.header.height(),
				 height:this.opts.height-that.opts.header.height()
			});
			
		},
		_process:function(){
				
	        var scrollTop = this.scrollElement.scrollTop() + this.opts.header.height()
	          , scrollHeight = this.scrollElement[0].scrollHeight || this.body[0].scrollHeight
	          , maxScroll = scrollHeight - this.scrollElement.height()
	          , offsets = this.offsets
	          , targets = this.targets
	          , activeTarget = this.activeTarget
	          , i
	
	        if (scrollTop >= maxScroll) {
	          return activeTarget != (i = targets.last()[0])
	            && this.activate ( i )
	        }
	
	        for (i = offsets.length; i--;) {
	          activeTarget != targets[i]
	            && scrollTop >= offsets[i]
	            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
	            && this.activate( targets[i] )
	        }
           
		},
		
		refresh:function(){
			
			var that =this;
			that.offsets = $([]);
            that.targets = $([]);
            var   $ul =$("<ul></ul>").addClass("nav nav-pills");
          
             this.opts.header.html($ul);
  
             this.element.find(this.opts.selector||">div,>section").each(function () {
             	var  $this =$(this),$li =$("<li></li>");
            that.offsets.push($(this).position().top);
            $li.html($("<a/>").attr("href","javascript:void(0)").html($this.attr("title"))).data("offsets",$(this).position()).appendTo($ul);
            that.targets.push($li);
            $li.bind("click.scrollspy",function(){
            	that.element.scrollTop(that.offsets[$.inArray($li,that.targets)]);
            	that.activate($li);
            });
        
          });
            $ul.find("li:first").trigger("click");
            this._setSize();
		},
		activate:function(target){
			var that =this;
		    target.addClass("active").siblings().removeClass("active");
		
		},
		
		resize:function(){
			
		},
		destory:function(){
			
		},
		
		
		
	});
	
	
	
})(jQuery,window, undefined)