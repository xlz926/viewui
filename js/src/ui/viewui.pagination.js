; (function ($) {
    $.widget("ui.pagination", {
        options: {
        	totals: 10,
		    pageSize: 1,
		    pageNumber: 1,
		    pageList: [10,20,30,50],
		    loading: false,
            first        : false,
            previous     : "上一页",
            next         : "下一页",
            last         : false,
            startRange   : 1,
			midRange     : 3,
            endRange     : 1,
		    buttons: null,
		    showPageList: true,
		    showRefresh: true,
		
		    onSelectPage: function(pageNumber, pageSize){},
		    onBeforeRefresh: function(pageNumber, pageSize){},
		    onRefresh: function(pageNumber, pageSize){},
		    onChangePageSize: function(pageSize){},
		
		    beforePageText: 'Page',
		    afterPageText: 'of {pages}',
		    displayMsg: 'Displaying {from} to {to} of {totals} items'
    },
    _create: function () {
         this.opts=this.options;
         this.opts.selectlist=$("<span class='input-append'>");
         this.opts.holder =  $("<ul></ul>");
         this.opts.pagesShowing =$([]);
         
         $.data(this.element, 'pagination', {
					options: this.opts
		 });
        
	     this._buildToolbar(this.element);

         this._selectPage(this.element,this.opts.pageNumber);


    },

    _buildToolbar: function (target){
        target.addClass('pagination').empty();
        //设置每页显示条数
        var that=this;
        var opts=this.opts;

        
        if (opts.showPageList) {
            var selectedItem = $('<input  style="width:20px;height:18px; margin-top:-0.3em"/>').val(opts.pageList[0]);
			selectedItem.appendTo(this.element).spinner({
									step : 10,
									max : 50,
									min : 10,
									spin : function(event, ui) {
									opts.pageSize=ui.value
									that._selectPage(target, opts.pageNumber);
									}
								});
            
          /*  var up = $(' <i class="icon-chevron-up perPage"></i>');
            var down = $(' <i class="icon-chevron-down perPage"></i>');
            opts.selectlist.append(selectedItem).appendTo(target);
            opts.selectlist.append($('<span class="add-on spinner"/>').append(up).append(down));
            
            //绑定切换事件
            up.click(function(){
                var index = $.inArray(parseInt(selectedItem.val()), opts.pageList);
                index = index >= 0 && opts.pageList.length - 1 <= index ? 0 : index + 1;
                opts.pageSize = opts.pageList[index];
                selectedItem.val(opts.pageList[index]);
                that._selectPage(target, opts.pageNumber);
            });
            down.click(function(){
                var index = $.inArray(parseInt(selectedItem.val()), opts.pageList);
                index = index <= 0 ? opts.pageList.length - 1 : index - 1;
                opts.pageSize = opts.pageList[index];
                selectedItem.val(opts.pageList[index]);
                that._selectPage(target, opts.pageNumber);
            });*/
        }

       this.opts.holder.appendTo(target);
       that._setNav(target);
       if(opts.showPageList){
	   	   var  Go =$("<span class='input-append go'></span>"),
		   goInput=$("<input  type='text' class='input-mini'>"),
		   goBtn=$("<span class='add-on'>Go</span>");
		   Go.append(goInput).append(goBtn).appendTo(target);
		   goBtn.click(function(){
		   	    var page =  parseInt(goInput.val())||opts.pageNumber;
				 var pageCount= Math.ceil(opts.totals / opts.pageSize);
		   	    page = page>pageCount?pageCount:page<0?0:page;
		   	    goInput.val(page);
				if( opts.pageNumber !=page){
					 opts.pageNumber=page;
					that._selectPage(target, opts.pageNumber);
				}
		   });  
	   }
    
	},
    _setNav:function(target){
      var opts =this.opts;
      var pageCount= Math.ceil(opts.totals / opts.pageSize);
      function writeBtn(which){
             return  opts[which] && opts[which] != false  ? 
            "<li><a class='jp-" + which + "'>" + opts[which] + "</a></li>" : "";
      }
       var i = 1, navhtml;
        navhtml = writeBtn( "first" ) + writeBtn( "previous" );
        for ( ; i <= pageCount; i++ ) {
            if ( i === 1 && opts.startRange === 0 ) {
                navhtml += "<li><span class='first'>...</span></li>";
            }
            if ( i > opts.startRange && i <= pageCount - opts.endRange ) {
                navhtml += "<li><a href='#'  pageIndex="+i+"  class='jp-hidden'>";
            } else {
                navhtml += "<li><a pageIndex="+i+">";
            }
			 navhtml += i;
            navhtml += "</a></li>";
            if ( i === opts.startRange || i === pageCount - opts.endRange ) {
                navhtml += "<li><span class='last'>...</span></li>";
            }
        }

        navhtml += writeBtn( "next" ) + writeBtn( "last" ) + "</div>";

        opts.holder.html(navhtml);

        this._bindNavHandlers(target);

    },

   _bindNavHandlers:function(target){
      var that=this;
      var opts = this.opts;

      target.find("a.jp-first").unbind('.pagination').bind('click.pagination', function(){
			if (opts.pageNumber > 1) that._selectPage(target, 1);
	  });

       target.find("a.jp-previous").unbind('.pagination').bind('click.pagination', function(){
			if (opts.pageNumber > 1) that._selectPage(target, opts.pageNumber - 1);
	  });

       target.find("a.jp-next").unbind('.pagination').bind('click.pagination', function(){
			var pageCount = Math.ceil(opts.totals/opts.pageSize);
			if (opts.pageNumber < pageCount) that._selectPage(target, opts.pageNumber + 1);
	  });

       target.find("a.jp-last").unbind('.pagination').bind('click.pagination', function(){
			var pageCount = Math.ceil(opts.totals/opts.pageSize);
			if (opts.pageNumber < pageCount) that._selectPage(target, pageCount);
	  });

       target.find("li>a").not(".jp-first, .jp-previous, .jp-next, .jp-last,.jp-current").unbind('.pagination').bind('click.pagination',function(evt){
             that._selectPage(target, parseInt($(this).attr("pageIndex")));
       });
   },

	_selectPage:function (target, page){
		var opts = this.opts;
		var pageCount = Math.ceil(opts.totals/opts.pageSize);
		var pageNumber = page;
		if (page < 1) pageNumber = 1;
		if (page > pageCount) pageNumber = pageCount;
		opts.onSelectPage.call(target, pageNumber, opts.pageSize);
		opts.pageNumber = pageNumber;
        this._updatePages(target, page);
	},
    _updatePages:function(target,page){
        var opts = this.opts;
       var pageCount= Math.ceil(opts.totals / opts.pageSize);
       var neHalf, upperLimit, start, end,interval;
        
        neHalf = Math.ceil( opts.midRange / 2 );
        upperLimit = pageCount - opts.midRange;
        start = page > neHalf ? Math.max( Math.min( page - neHalf, upperLimit ), 0 ) : 0;
        end = page > neHalf ? Math.min( page + neHalf - ( opts.midRange % 2 > 0 ? 1 : 0 ), pageCount ) : Math.min( opts.midRange, pageCount );
        interval = { start: start, end: end };

         if ( page === 1) {
            target.find("a.jp-first").addClass("jp-disabled");
            target.find("a.jp-previous").addClass("jp-disabled");
        } else if(opts.pageNumber !== 1 && page > 1){
             target.find("a.jp-first").removeClass("jp-disabled");
            target.find("a.jp-previous").removeClass("jp-disabled");
        }
        if ( page === pageCount ) {
            target.find("a.jp-next").addClass("jp-disabled");
            target.find("a.jp-last").addClass("jp-disabled");
        }else if(opts.pageNumber !== pageCount && page < pageCount){
            target.find("a.jp-next").removeClass("jp-disabled");
            target.find("a.jp-last").removeClass("jp-disabled");
        }

        target.find("a.jp-current").removeClass("jp-current");
        target.find("a[pageindex='"+page+"']").addClass("jp-current");

       var hold = target.find("ul a").not(".jp-first, .jp-previous, .jp-next, .jp-last");
   
       hold.addClass("jp-hidden").slice( interval.start, interval.end ).removeClass("jp-hidden");
       hold.slice(0,opts.startRange).removeClass("jp-hidden");
       hold.slice(pageCount-opts.endRange).removeClass("jp-hidden");

        if ( interval.start > opts.startRange || ( opts.startRange === 0 && interval.start > 0 ) ) { 
            target.find("li>span:first").removeClass("jp-hidden");
        } else { 
            target.find("li>span:first").addClass("jp-hidden");
        }
        
        if ( interval.end < pageCount - opts.endRange ) {
            target.find("li>span:last").removeClass("jp-hidden");
        } else { 
            target.find("li>span:last").addClass("jp-hidden");
        }
  
    },

    pageSize:function(total){
       var opts = this.opts;
       opts.totals=total;
       this._setNav(this.element);
       this._updatePages(this.element, this.opts.pageNumber);
 
    },

    getOption:function(param){
       return this.opts[param];
    },
    destory: function () {


    }

});

})(jQuery)