; (function ($, window, undefined) {
    
    $.widget("pousheng.basegrid",  {
      options:{
            title: null,
            iconCls: null,
            border: true,
            width: 'auto',
            height: 'auto',
            striped: false,
            loadMsg: 'Processing, please wait ...',
            fit: true,
            pagination:false
      },
      _create:function(){
              this._wrapGrid();

              this._setSize();
              this._loadData([{id:"213",value:"值"},{id:"213213213",value:"值"}]);

      },
      _wrapGrid:function(){
         var grid = this.element,
             table =  grid.find("table").addClass("template"),
             opts =this.element;
          grid.addClass("datagrid").append(
				'<div class="datagrid-wrap">' +
					'<div class="datagrid-view">' +
						'<div class="datagrid-view1">' +
							'<div class="datagrid-header">' +
								'<div class="datagrid-header-inner"><table border="0" cellspacing="0" cellpadding="0"><thead></thead></table></div>' +
							'</div>' +
							'<div class="datagrid-body">' +
								'<div class="datagrid-body-inner">' +
									'<table border="0" cellspacing="0" cellpadding="0"></table>' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<div class="datagrid-view2">' +
							'<div class="datagrid-header">' +
								'<div class="datagrid-header-inner"><table border="0" cellspacing="0" cellpadding="0"><thead></thead></table></div>' +
							'</div>' +
							'<div class="datagrid-body"><table border="0" cellspacing="0" cellpadding="0"></table></div>' +
						'</div>' +
					'</div>' +
				'</div>'
		 );


        table.clone().find("thead>tr").each(function(){
             var head1 = $("<tr/>").appendTo(grid.find(".datagrid-view1 .datagrid-header thead"));
             var head2 = $("<tr/>").appendTo(grid.find(".datagrid-view2 .datagrid-header thead"))
            $(this).find("th").each(function(){
                     $(this).hasClass("frozen")?$(this).appendTo(head1):$(this).appendTo(head2);
                    $(this).wrapInner($('<div class="datagrid-cell"></div>').width($(this).width()));
                    
            });
         });
         table.hide();
        
                
         $('.datagrid-title', grid).remove();
            if (opts.title) {
                var title = $('<div class="datagrid-title"><span class="datagrid-title-text"></span></div>');
                $('.datagrid-title-text', title).html(this.opts.title);
                title.prependTo(grid);
                if (opts.iconCls) {
                    $('.datagrid-title-text', title).addClass('datagrid-title-with-icon');
                    $('<div class="datagrid-title-icon"></div>').addClass(this.opts.iconCls).appendTo(title);
                }
            }
          
             $('.datagrid-search',grid).prependTo(grid.find('.datagrid-wrap'));
             $('.datagrid-toolbar',grid).prependTo(grid.find('.datagrid-wrap'));



      },
      _setSize:function(){
           
            var grid = this.element,
                opts = this.options;
            if (opts.fit == true) {
                var p = grid.parent();
                opts.width = p.innerWidth();
                opts.height = p.innerHeight();
            }


            var gridWidth = opts.width;
            if (gridWidth == 'auto') {
                if ($.boxModel == true) {
                    gridWidth = grid.width();
                } else {
                    gridWidth = grid.outerWidth();
                }
            } else {
                if ($.boxModel == true) {
                    gridWidth -= grid.outerWidth() - grid.width();
                }
            }
            grid.width(gridWidth);


            var innerWidth = gridWidth;
            if ($.boxModel == false) {
                innerWidth = gridWidth - grid.outerWidth() + grid.width();
            }

            $('.datagrid-wrap', grid).width(innerWidth);
            $('.datagrid-view', grid).width(innerWidth);
            $('.datagrid-view1', grid).width($('.datagrid-view1 table', grid).width());
            $('.datagrid-view2', grid).width(innerWidth - $('.datagrid-view1', grid).outerWidth());
            $('.datagrid-view1 .datagrid-header', grid).width($('.datagrid-view1', grid).width());
            $('.datagrid-view1 .datagrid-body', grid).width($('.datagrid-view1', grid).width());
            $('.datagrid-view2 .datagrid-header', grid).width($('.datagrid-view2', grid).width());
            $('.datagrid-view2 .datagrid-body', grid).width($('.datagrid-view2', grid).width());

          
            


          	var hh;
		var header1 = $('.datagrid-view1 .datagrid-header',grid);
		var header2 = $('.datagrid-view2 .datagrid-header',grid);
		header1.css('height', null);
		header2.css('height', null);
		
		if ($.boxModel == true){
			hh = Math.max(header1.height(), header2.height());
		} else {
			hh = Math.max(header1.outerHeight(), header2.outerHeight());
		}
		
		$('.datagrid-view1 .datagrid-header table',grid).height(hh);
		$('.datagrid-view2 .datagrid-header table',grid).height(hh);
		header1.height(hh);
		header2.height(hh);
		
		if (opts.height == 'auto') {
			$('.datagrid-body', grid).height($('.datagrid-view2 .datagrid-body table', grid).height());
		} else {
			$('.datagrid-body', grid).height(
					opts.height
					- (grid.outerHeight() - grid.height())
					- $('.datagrid-header', grid).outerHeight(true)
					- $('.datagrid-title', grid).outerHeight(true)
					- $('.datagrid-toolbar', grid).outerHeight(true)
					- $('.datagrid-search', grid).outerHeight(true)
					- $('.datagrid-pager', grid).outerHeight(true)
			);
		}
		
		$('.datagrid-view',grid).height($('.datagrid-view2',grid).height());
		$('.datagrid-view1',grid).height($('.datagrid-view2',grid).height());
		$('.datagrid-view2',grid).css('left', $('.datagrid-view1',grid).outerWidth());

      },
      _loadData:function(dataList){
           var grid = this.element,
               tmpl = grid.find("table.template").find("tbody").clone();

               tmpl.find("td").each(function(i){
               
               $(this).wrapInner($('<div class="datagrid-cell"></div>').width($(".datagrid-view2 .datagrid-header thead tr:last .datagrid-cell",grid).eq(i).width()));
               
               });
               console.log($.templates(tmpl.html()).render(dataList||[]));

               grid.find('.datagrid-view2 .datagrid-body table').html($.templates(tmpl.html()).render(dataList||[]));
      }  
    });


})(jQuery, window, undefined);