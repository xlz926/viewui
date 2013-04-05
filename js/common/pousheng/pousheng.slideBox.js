; (function ($, undefined) {
    $.widget("pousheng.slideBox", {
        options: {
            fit: true,
            count: 4,
            pageUpBtn: null,
            pageDownBtn: null,
            active: 0,
            width: 800,
            height: 600,
            cancel: "",
            speed: "normal",
            obstacle: 100,
            control: null,
            screen:[],
            obstacle: 100,
            
            beforeLoad:$.noop,
            afterScroll: $.noop,
            beforeScroll: $.noop
        },
        _create: function () {
        var that =this;
        this.opts=this.options;
        this.cursor = 0;
        this._wrapContent();
         for (var i = 0; i < this.opts.count; i++) {
            this.addScreenDom(i);
        }

        this._setSize();
        this._addEvent();
        this.scroll(0);
       
        },
        _init:function(){
        	
        },
        _addEvent:function(){
        	
        	var that =this;
        	$(document).bind("mouseup", function(){
        		
        	    that.slide();
            });
        	this.element.bind("mousedown",function(e){
        		 if (typeof that.opts.cancel == "string" ? $(e.target).parents().add(e.target).filter(that.opts.cancel).length : false) {
                return;
            }
            var s = e.clientX;
            that.element.bind("mousemove", function (evt) {
                var clientX = evt.clientX;
                if (clientX % 5) {
                    return;
                }
                var left = clientX - s;
                $(this).css({
                    'margin-left': left
                });
                return false;
            });
            return false;
        		
        		
        	});
           
            this.contain.bind("_resize",function(){
        	       that._setSize();
         });
        },
        
        _wrapContent:function(){
          this.contain =	this.element.addClass("desk-screen").wrap($("<div></div>").addClass("desktop")).parent();
          this.opts.control = $("<div></div>").addClass("btn-group") 
                               .prependTo(this.contain).wrap($("<div>").addClass("header").addClass("control"));
          
          this.opts.background=$("<div>").addClass("desk-bg").appendTo(this.contain);
        },
        addScreenDom:function(index, id){
          var that =this;
           var a = $("<a class=\"btn\" hidefocus=\"hidefocus\" href=\"javascript:void(0)\"></a>");
            if (index == this.opts.active) {
                a.addClass("active");
            }
            this.opts.control.append(a);
            a.click(function () {
                //动态获取index,处理删除屏幕时的情况
                that.scroll(a.prevAll(".btn").length);
            });
            var div = $("<div class=\"screen\"></div>");
            div.attr("id", id);
            this.element.append(div);
           
        },
         
        slide:function () {
            var left = parseInt(this.element.css("margin-left"));
            var obstacle;
            if (typeof this.element.obstacle === "string" && /^[0-9]{1,2}%$/.test(this.element.obstacle)) {
                obstacle = parseInt(this.opts.obstacle) * this.element.width / 100;
            }
            else {
                obstacle = this.opts.obstacle;
            }
            if (left < -obstacle) {
                this.scroll(this.cursor + 1);
                
            }
            else if (left > obstacle) {
                this.scroll(this.cursor - 1);
              
            }
            else {
                this.element.animate({
                    "margin-left": "0"
                }, "fast");
            
            }
           this.element.unbind("mousemove");
            this.element.unbind("mouseup");
            return false;
        },
           scroll: function scroll(index, callback) {
            var that =this;
            
            if (index > this.opts.count - 1 || index < 0) {
                this.element.animate({
                    marginLeft: 0
                }, this.opts.speed, function () {
                    callback && callback();
                });
                return;
            }
             if(!that.opts.screen[index]){
                  that.opts.beforeLoad.call(this,index,this.contain.find(".screen").eq(index));
                   that.opts.screen[index]=true;
               }
            
            /* if(this.cursor>index){
            	 this.opts.background.animate({left:'+=5'});
             }else if(this.cursor<index){
            	 
             }else{
            	  this.opts.background.animate({left:'0'});
             }*/
               this.opts.background.animate({left:'+='+(this.cursor-index)*15});
            
            this.cursor = index;
            this.opts.beforeScroll(this.cursor);
            var left = -index * this.opts.width;
            this.opts.control && $(this.opts.control).find(".active").removeClass("active");
            this.opts.control && $(this.opts.control).find(".btn").eq(this.cursor).addClass("active");
            this.element.stop().animate({
                left: left,
                marginLeft: 0
            }, that.opts.speed, function () {
                callback && callback();
                that.opts.afterScroll(that.cursor);
               
          
            });
        },
         _setSize: function() {
        	 var that =this;
        	 if(this.opts.fit==true){
        		var p =this.contain.parent();
        		this.opts.height =p.innerHeight();
        		this.opts.width =p.innerWidth();
        	 }
        	
            this.contain.css({
                height: this.opts.height,
                width: this.opts.width,
                position: "relative",
                 overflow:"hidden"
            });
            this.element.css("position", "relative");
            var that=this;
            this.element.children(".screen").each(function (i, e) {
                $(e).css({
                    left:that.opts.width * i,
                    top:0,
                    position: "absolute",
                    width: that.opts.width,
                    height: that.opts.height-that.contain.find(".header").height()
                });
            });
            this.element.css({
                left: -this.cursor * that.opts.width
            });
        }
       

    });

})(jQuery);