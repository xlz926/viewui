(function($,window, undefined){

	$.widget("ui.taskbar",{
		options:{
			width:400,
			height:300,
			autoshow:false
		},
		_create:function(){
               this.tasks=[];
			   this.element.append('<div class="taskbarContent"><ul class="taskList"></ul></div><div  class="taskbarLeft"></div><div class="taskbarRight"></div></div>');
					
			   this.element.on("click.taskbar",".close",function(){
				    
				   
			   });
			   
			   if(!this.options.autoshow){
				   this.hide();
			   }
			   
			
		},
		
		_getCurrent:function(){
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
			
			this._getCurrent().removeClass("selected");
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
	
	
	
})(jQuery,window, undefined)