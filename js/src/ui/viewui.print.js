(function($,window, undefined){
	$.widget("pousheng.print",{
		options:{
			width:600
		},
		_create:function(){
			
			
			this.contentBox = this.element.clone();
	
			
		},
		_repalceInput:function(){
			
			//$("[data-buttonset]").buttonset("destroy");
			
			
			var item = "input:text,input:password";
			
			this.contentBox.css("height","100%");
			
			this.contentBox.find(item).each(function(i,elem){
				$(elem).replaceWith($("<label/>").addClass("printField").text($(elem).val()).width($(elem).width()).height($(elem).height()));
			});
			
			
		},
		done:function(){
			
		
			//console.log(this.contentBox.html());
			var printBox=$("#printBox");
			if(printBox.length==0){
			
				printBox = $("<div></div>").attr("id","printBox").appendTo("body").width("620");
			}
			printBox.html(this.contentBox);
			
			this._repalceInput();
			
			//$("body").html(printBox);
			window.print(); 
		},
		preview:function(){
			this._repalceInput();
			console.log(this.contentBox);
		},
		destory:function(){
			
		}

		
	})
	
})(jQuery,window, undefined)