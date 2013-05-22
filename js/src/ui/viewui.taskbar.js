(function($,window, undefined){

	$.widget("ui.taskbar",{
		options:{
			width:400,
			height:300,
			autoshow:false
		},
		_create:function(){
               this.tasks=[];
			   this.element.addClass("taskbar").append('<div class="taskbarContent"><ul class="taskList"></ul></div><div  class="taskbarLeft"></div><div class="taskbarRight"></div></div>');
               
		},
		
		_getCurrent:function(){
			return this.element.find("li.selected");
			
		},
		addtask:function(page){
			var that  =this;
			var taskFrag = '<li  title="#title#"><a class="taskbutton" ><i class="icon-th-list icon-white"></i><span>#title#</span></a><div class="close"></div></li>';
		    taskSelected =  $(taskFrag.replace(/#title#/ig,page.modal("option","title"))).appendTo(this.element.find(".taskList"));

   
			taskSelected.click(function(){
				      var  page = $(this).data("modal");
					  page.is(":visible")?page.modal("min"): page.modal("open");
				});
			taskSelected.data("modal",page);
			
			taskSelected.find(".close").click(function(event){
				event.preventDefault();
				taskSelected.data("modal")&&taskSelected.data("modal").modal("close");
				that.close(taskSelected);
			});
	
			this.show();
		
			return taskSelected;
		},
		removeDialog:function(title){
			this.element.find("li[title='"+title+"']").remove();
		},
		switchTask:function(task){
			
		},
		close:function(task){
		      task.remove();
		      !this.element.find(".taskList").children("li").length&&this.hide();
			
		},
		getTask:function(title){
			return this.element.find("li[title='"+title+"']");
		},
		show:function(opts){
			this.element.slideDown(opts||{});
			
		},
		hide:function(opts){
			this.element.slideUp(opts||{});
		},
		destroy:function(){
			//this._destroy();
		}
		
	
	});
	
	
	
})(jQuery,window, undefined)