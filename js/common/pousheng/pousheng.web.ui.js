
$(function() {
   
     //申明样式为盒子模型
     $.boxModel = true;
	
 
    //初始化首页标签页	
    var indexTabs=$("#indexTab").tabs({contextmenu:true});
	
	
	 $.metadata.setType("attr", "validate");
	
	
       
	//设置错误显示样式
    jQuery.validator.setDefaults({
        wrapper: "div",
        errorElement: "span",
        errorClass: "va_sp_txt",
        errorPlacement: function(error, element){
            var pos = element.position();
            actualWidth = element[0].offsetWidth, actualHeight = element[0].offsetHeight;
            error.prepend('<span class="va_tips_warn"></span>').append('<span class="arr"></span><a class="tips_close"></a>').css({
                top: pos.top - 30,
                left: pos.left
            }).addClass("validatebox").appendTo(element.parent());
          /*  setTimeout(function(){
            	error.hide();
            },3000);*/
        }
    });
    
    $(".tips_close").live("click",function(){
    	$(this).closest(".validatebox").hide();
    });

	


	
	//a 标签ajax 提交方法
	$("a[data-rel='ajax']").live("click",function(event) {
		event.preventDefault();
		 var tab=indexTabs.tabs("getSelected");
		 tab.href=$(this).attr("href");
		 tab.loaded=false;
		 tab.content=null;
         indexTabs.tabs("refresh", tab);
	});
	

		
		//初始化form   ajax提交
	$("body").delegate("form:not(.ignore)", "submit", function(event,sittings) {
			var options = {
				beforeSubmit : function(formData, jqForm, options) {
					if(sittings && $.isFunction(sittings.beforeSubmit))sittings.beforeSubmit.call(jqForm);
				},
				success : function(response, statusText, xhr, jqForm) {
					var result = pousheng.jsonEval(response);
					if(sittings && $.isFunction(sittings.success))
						sittings.success.call(jqForm,result);
					if (result.statusCode == pousheng.statusCode.error) {
						pousheng.errorMsg(result.message);
					} else if (result.statusCode == pousheng.statusCode.ok) {
						if (result.message != "")
							pousheng.successMsg(result.message);
						if (result.forwardUrl && result.forwardUrl != "") {
							var tag = $(jqForm).attr("target") || $(jqForm).closest(".box");
							tag = tag.length > 0 ? tag : $(jqForm).closest(".ui-tabs-panel");
							tag.ajaxLoad(result.forwardUrl);
						}
					}else{
						var tab=indexTabs.tabs("getSelected");
						 tab.loaded=false;
						 tab.content=response;
				         indexTabs.tabs("refresh", tab);
					}	
				}
			};
			$(this).ajaxSubmit(options);
			return false;
		}); 
		
		
		/*
		 * 动态绑定对象
        */		
		$("form").livequery(function(){ 
            $(this).validate();
			if($(this).hasClass("pageForm")){
				$(".page-content",this).height($(this).parent().innerHeight()-$(".formBar",this).outerHeight());
			}
		}); 
		
		$("[data-layout]").livequery(function(){ 
			$(this).layout();
		}); 
		
		$("[data-tabs]").livequery(function(){ 
			$(this).tabs();
		}); 
		
		$("[data-panel]").livequery(function(){ 
			$(this).panel();
		}); 
		
		
		
		$("[data-chosen]").livequery(function(){ 
			$(this).chosen();
		}); 
		
			///$("#select211").select2();
		
		
        $("[data-datagrid]").livequery(function(){
            var target = $(this).datagrid(pousheng.jsonEval($(this).attr("data-datagrid")));
        
			var that = this;
			var edialog=$("<div></div>").dialog({
				 modal:true,
				 autoOpen:false,
				 buttons:[{text:btn.ok,click:function(){
				 	$("form",this).trigger("submit",{success:function(){
						target.datagrid("refresh");
						edialog.dialog("close");
					}});
				 }},{
				 	text: btn.cancel,
				 	click: function(){
				 		$(this).dialog("close");
				 	}
				 }]
			}).dialog("setSize","large");
			
			var tab=indexTabs.tabs("getSelected");
            target.datagrid("register", "edit", function(element){
				var type=$(element).attr("type");
				tab=indexTabs.tabs("getSelected");
                var param = this.getSelect();
                if ($.isEmptyObject(param)) {
                    pousheng.warnMsg("请选择一条记录");
                    return;
                }
                pousheng.ajaxLoad($(element).attr("href"),{data:param}, function(result){
                    if (type && type == "dialog") {
                        edialog.html(result).dialog("open");
                    }
                    else {
                        tab.loaded = false;
                        tab.content = result;
                        indexTabs.tabs("refresh", tab);
                    }
                });
            });
            
            target.datagrid("register", "add", function(element){
				var type=$(element).attr("type");
				tab=indexTabs.tabs("getSelected");
                pousheng.ajaxLoad($(element).attr("href"), function(result){
                    if (type && type == "dialog") {
                        edialog.html(result).dialog("open");
                    }
                    else {
                        tab.loaded = false;
                        tab.content = result;
                        indexTabs.tabs("refresh", tab);
                    }
                });
            });
            
            target.datagrid("register", "view", function(element){
				var type=$(element).attr("type");
				tab=indexTabs.tabs("getSelected");
                var param = target.datagrid("getSelect");
                if ($.isEmptyObject(param)) {
                    pousheng.warnMsg("请选择一条记录");
                    return;
                }
                pousheng.ajaxLoad($(element).attr("href"), {
                    data: param
                },function(result){
                    $(result).find("input:text").each(function(i){
                        var temp = $("<span class='showLable'>" + $(this).val() + "</span>").width($(this).width() + "px").css("left", $(this).position().left);
                        $(this).replaceWith(temp);
                        temp.resizable();
                    }).end().find("input:submit").hide();
				    if (type && type == "dialog") {
                        edialog.html(result).dialog("open");
                    }
                    else {
                        tab.loaded = false;
                        tab.content = result;
                        indexTabs.tabs("refresh", tab);
                    }
                });
            });
            
            
            target.datagrid("register", "delete", function(element){
				tab=this.getSelect();;
                var param = this.getSelectedRows();
				var that=this;
                if (!param.length > 0) {
                    pousheng.warnMsg("请选择一条记录");
                    return;
                }
                pousheng.confirm("你确定要删除所选记录，删除后将不可恢复", function(r){
                    if (r) {
                        if (that.opts.singleSelect == true) {
                            param = param[0];
                        }
                        else {
                            param = JSON.stringify(param);
                        }
                        pousheng.ajaxLoad($(element).attr("href"), {
                            data: param,
                            contentType:that.opts.singleSelect?null:"application/json"
                        }).done(function(){
                            that.refresh();
                        });
                    }
                });
            });
            
            target.datagrid("register", "search", function(element){
                $.extend(this.opts.queryParams, this.opts.search.getFieldValues() || {});
                this.refresh(null,this.opts.queryParams);
            });
			
			
        });
		
	
		 $("input.date").livequery(function(){
			$(this).datepicker({dateFormat:$(this).attr("dateFormat")||"yy-mm-dd"});
		 });
        $("input.time").livequery(function(){
            $(this).datetimepicker({
                timeFormat: $(this).attr("timeFormat") || "HH:mm",
                dateFormat: $(this).attr("dateFormat") || "yy-mm-dd"
            });
        });
		
	    $("[data-buttonset]").livequery(function(){
			$(this).buttonset();
		});
	    
	    $("[data-dropdown]").livequery(function(){ 
			$(this).dropdown();
		}); 
	  
	    
	  
	  
});
  







