/**
* datagrid - jQuery EasyUI
* 
* Licensed under the GPL:
*   http://www.gnu.org/licenses/gpl.txt
*
* Copyright 2010 stworthy [ stworthy@gmail.com ] 
* 
* Dependencies:
* 	resizable
* 	linkbutton
* 	pagination
* 
*/
(function ($) {
    $.widget("ui.datagrid", {
        options: {
            title: null,
            iconCls: null,
            border: true,
            width: 'auto',
            height: 'auto',
            frozenColumns: null,
            columns: null,
            striped: false,
            method: 'post',
            template: null,
            nowrap: true,
            idField: null,
            url: null,
            loadMsg: 'Processing, please wait ...',
            pagination: true,
            rownumbers: false,
            singleSelect: true,
			showPageList:true,
            fit: true,
            pageNumber: 1,
            pageSize: 10,
            pageList: [10, 20, 30, 40, 50],
            queryParams: {},
            sortName: null,
            sortOrder: 'asc',
			data:{},
            
			actions : {},
            onLoadSuccess: function () { },
            onLoadError: function () { },
            onClickRow: function (rowIndex, rowData) { },
            onDblClickRow: function (rowIndex, rowData) { },
            onSortColumn: function (sort, order) { },
            onSelect: function (rowIndex, rowData) { },
            onUnselect: function (rowIndex, rowData) { },
			onSelected:function(rowIndex, rowData){},
			trContextMenu:function(rowIndex,rowData){}

        },
        _create: function () {
         
            var that=this;
			var target = this.element;
            this.opts = $.extend(this.options, {
                width: (parseInt(this.element.css('width')) || 'auto'),
                height: (parseInt(this.element.css('height')) || 'auto'),
				template:$("tbody",this.element).clone().find("tr").attr("datagrid-row-index","{{:#index}}").end(),
				url:this.element.attr("url")||this.options
            });

            var wrapResult = this._wrapGrid(this.element);
			
			 
            this.opts.bodytmpl =$.templates(this.opts.template.html().toString().replace(/&gt;/ig,">"));
			
            if (!this.opts.columns) this.opts.columns = wrapResult.columns;
            if (!this.opts.frozenColumns) this.opts.frozenColumns = wrapResult.frozenColumns;
            $.data(this.element, 'datagrid', {
                options: this.opts,
                grid: wrapResult.grid,
                selectedRows: []
            });
           
            var grid =this.grid = wrapResult.grid;
           
            if (this.opts.border == true) {
                grid.removeClass('datagrid-noborder');
            } else {
                grid.addClass('datagrid-noborder');
            }

            if (this.opts.frozenColumns) {
                var t = this._createColumnHeader(this.opts.frozenColumns);
                if (this.opts.rownumbers) {
                    var th = $('<th rowspan="' + opts.frozenColumns.length + '"><div class="datagrid-header-rownumber"></div></th>');
                    if ($('tr', t).length == 0) {
                        th.wrap('<tr></tr>').parent().appendTo($('thead', t));
                    } else {
                        th.prependTo($('tr:first', t));
                    }
                }
                $('.datagrid-view1 .datagrid-header-inner', grid).html(t);
            }
            if (this.opts.columns) {
                var t = this._createColumnHeader(this.opts.columns);
                $('.datagrid-view2 .datagrid-header-inner', grid).html(t);
            }

            $('.datagrid-title', grid).remove();
            if (this.opts.title) {
                var title = $('<div class="datagrid-title"><span class="datagrid-title-text"></span></div>');
                $('.datagrid-title-text', title).html(this.opts.title);
                title.prependTo(grid);
                if (opts.iconCls) {
                    $('.datagrid-title-text', title).addClass('datagrid-title-with-icon');
                    $('<div class="datagrid-title-icon"></div>').addClass(this.opts.iconCls).appendTo(title);
                }
            }
            this.opts.search=$('.datagrid-search',grid).prependTo($('.datagrid-wrap', grid));
			
		    this.opts.toolbar=$('.datagrid-toolbar',grid).prependTo($('.datagrid-wrap', grid));
	
	
            $('.datagrid-pager', grid).remove();
            if (this.opts.pagination) {
                var pager = $('<div class="datagrid-pager"></div>').addClass("pagination-small").appendTo($('.datagrid-wrap', grid));
                pager.pagination({
                    pageNumber: this.opts.pageNumber,
                    pageSize: this.opts.pageSize,
                    pageList: this.opts.pageList,
				    showPageList:this.opts.showPageList,
                    onSelectPage: function (pageNum, pageSize) {
                        // save the page state
                        that.opts.pageNumber = pageNum;
                        that.opts.pageSize = pageSize;
                        that._request(target); // request new page data
                    }
                });
				this.opts.pager=pager;
                // this.opts.pageSize = pager.pagination('getOption', "pageSize"); // repare the pageSize value
            }else{
				that._request(target);
			}

            if (!this.opts) {
                this._fixColumnSize(target);
            }
            this._setSize(target);

            this._setProperties(target);

        },
        _setSize: function (target) {

            var grid = this.grid;
            var opts = this.opts;
            if (opts.fit == true) {
                var p = grid.parent();
                opts.width = p.innerWidth();
                opts.height = p.innerHeight();
            }

            if (opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length > 0)) {
                $('.datagrid-body .datagrid-cell,.datagrid-body .datagrid-cell-rownumber', grid).addClass('datagrid-cell-height');
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

          
            
            grid.height(opts.height);


            var hh;
            var header1 = $('.datagrid-view1 .datagrid-header', grid);
            var header2 = $('.datagrid-view2 .datagrid-header', grid);
           // header1.css('height', null);
            //header2.css('height', null);
            if ($.boxModel == true) {
                hh = Math.max(header1.height(), header2.height());
            
            } else {
                hh = Math.max(header1.outerHeight(), header2.outerHeight());
            }
            $('.datagrid-view1 .datagrid-header table', grid).height(hh);
            $('.datagrid-view2 .datagrid-header table', grid).height(hh);
          

            if (opts.height == 'auto') {
                $('.datagrid-body', grid).height($('.datagrid-view2 .datagrid-body table', grid).height());
            } else {
                $('.datagrid-body', grid).height(
					opts.height
					- (grid.outerHeight() - grid.height())
					- $('.datagrid-header', grid).outerHeight(true)
					- $('.datagrid-title', grid).outerHeight(true)
					- $('.datagrid-toolbar', grid).outerHeight(true)
					- $('.datagrid-pager', grid).outerHeight(true)
					-$('.datagrid-search',grid).outerHeight(true)
			);
            }

     

            $('.datagrid-view', grid).height($('.datagrid-view2', grid).height());
            $('.datagrid-view1', grid).height($('.datagrid-view2', grid).height());
            $('.datagrid-view2', grid).css('left', $('.datagrid-view1', grid).outerWidth());
        },
        _wrapGrid: function (target) {
            var that = this;
            var grid = $(target).wrap('<div class="datagrid"></div>').parent(); 
            grid.append(
				'<div class="datagrid-wrap">' +
					'<div class="datagrid-view">' +
						'<div class="datagrid-view1">' +
							'<div class="datagrid-header">' +
								'<div class="datagrid-header-inner"></div>' +
							'</div>' +
							'<div class="datagrid-body">' +
								'<div class="datagrid-body-inner">' +
									'<table border="0" cellspacing="0" cellpadding="0"></table>' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<div class="datagrid-view2">' +
							'<div class="datagrid-header">' +
								'<div class="datagrid-header-inner"></div>' +
							'</div>' +
							'<div class="datagrid-body"></div>' +
						'</div>' +
					'</div>' +
				'</div>'
		);

            var frozenColumns = getColumns($('thead[frozen=true]', target));
            $('thead[frozen=true]', target).remove();
            var columns = getColumns($('thead', target));
            $('thead', target).remove();

            $(target).attr({
                cellspacing: 0,
                cellpadding: 0,
                border: 0
            }).removeAttr('width').removeAttr('height').appendTo($('.datagrid-view2 .datagrid-body', grid));


            function getColumns(thead) {
                var columns = [];
                $('tr', thead).each(function () {
                    var cols = [];
                    $('th', this).each(function () {
                        var th = $(this);
                        var col = {
                            title: th.html(),
                            align: th.attr('align') || 'left',
                            sortable: th.attr('sortable') == 'true' || false,
                            checkbox: th.attr('checkbox') == 'true' || false
                        };
                        col.field = th.attr('field') ? th.attr('field') : th.index();
                        if(th.attr('formatter')) {
                            col.formatter = eval(th.attr('formatter'));
                        }
                        if (th.attr('rowspan')) col.rowspan = parseInt(th.attr('rowspan'));
                        if (th.attr('colspan')) col.colspan = parseInt(th.attr('colspan'));
                        col.width = th.attr('width') ? parseInt(th.attr('width')) : th.width();

                        cols.push(col);
                    });
                    columns.push(cols);
                });

                return columns;
            }
			
	
            if(columns.length>0){
                $.each(columns[columns.length-1] || [], function(i, e){
                    that.opts.template.find("td").eq(i).data("index", i).wrapInner($('<div class="datagrid-cell"></div>').width(e.width));
                });
			}
       
            grid.bind('_resize', function () {
                var opts = $.data(target, 'datagrid').options;
                if (opts.fit == true) {
                    that._setSize(target);
                    that._fixColumnSize(target);
                }
                return false;
            });

            return {
                grid: grid,
                frozenColumns: frozenColumns,
                columns: columns
            };
        },
        /**
        * get column fields which will be show in row
        */
        _getColumnFields: function (columns) {
            if (columns.length == 0) return [];

            function getFields(ridx, cidx, count) {
                var fields = [];
                while (fields.length < count) {
                    var col = columns[ridx][cidx];
                    if (col.colspan && parseInt(col.colspan) > 1) {
                        var ff = getFields(ridx + 1, getSubColIndex(ridx, cidx), parseInt(col.colspan));
                        fields = fields.concat(ff);
                    } else if (col.field) {
                        fields.push(col.field);
                    }
                    cidx++;
                }

                return fields;
            }

            function getSubColIndex(ridx, cidx) {
                var index = 0;
                for (var i = 0; i < cidx; i++) {
                    var colspan = parseInt(columns[ridx][i].colspan || '1');
                    if (colspan > 1) {
                        index += colspan;
                    }
                }
                return index;
            }

            var fields = [];
            for (var i = 0; i < columns[0].length; i++) {
                var col = columns[0][i];
                if (col.colspan && parseInt(col.colspan) > 1) {
                    var ff = getFields(1, getSubColIndex(0, i), parseInt(col.colspan));
                    fields = fields.concat(ff);
                } else if (col.field) {
                    fields.push(col.field);
                }
            }

            return fields;
        },
        _createColumnHeader: function (columns) {
            var t = $('<table border="0" cellspacing="0" cellpadding="0"><thead></thead></table>');
            for (var i = 0; i < columns.length; i++) {
                var tr = $('<tr></tr>').appendTo($('thead', t));
                var cols = columns[i];
                for (var j = 0; j < cols.length; j++) {
                    var col = cols[j];

                    var attr = '';
                    if (col.rowspan) attr += 'rowspan="' + col.rowspan + '" ';
                    if (col.colspan) attr += 'colspan="' + col.colspan + '" ';
                    var th = $('<th ' + attr + '></th>').appendTo(tr);

                    if (col.checkbox) {
                        th.attr('field', col.field);
                        $('<div class="datagrid-header-check"></div>')
							.html('<input type="checkbox"/>')
							.appendTo(th);
                    } else if (col.field == "datagrid-cell-group") {
                        th.append('<div class="datagrid-cell-group"></div>');
                        $('.datagrid-cell-group', th).html(col.title);
                    } else {
                        th.append('<div class="datagrid-cell"><span></span><span class="datagrid-sort-icon"></span></div>');
                        th.attr('field', col.field);
                        $('.datagrid-cell', th).outerWidth(col.width);
                        $('span', th).html(col.title);
                        $('span.datagrid-sort-icon', th).html('&nbsp;');
                    }
                }

            }
            return t;
        },
        /**
        * set the common properties
        */
        _setProperties: function (target) {
            var grid = $.data(target, 'datagrid').grid;
            var opts = this.opts;
            var data = this.opts.data;
            var that = this;

            if (opts.striped) {
                $('.datagrid-view1 .datagrid-body tr:odd', grid).addClass('datagrid-row-alt');
                $('.datagrid-view2 .datagrid-body tr:odd', grid).addClass('datagrid-row-alt');
            }
            if (opts.nowrap == false) {
                $('.datagrid-body .datagrid-cell', grid).css('white-space', 'normal');
            }

            $('.datagrid-header th:has(.datagrid-cell)', grid).hover(
			function () { $(this).addClass('datagrid-header-over'); },
			function () { $(this).removeClass('datagrid-header-over'); }
		);

            $('.datagrid-body tr', grid).mouseover(function () {
                var index = $(this).attr('datagrid-row-index');
                $('.datagrid-body tr[datagrid-row-index=' + index + ']', grid).addClass('datagrid-row-over');
            }).mouseout(function () {
                var index = $(this).attr('datagrid-row-index');
                $('.datagrid-body tr[datagrid-row-index=' + index + ']', grid).removeClass('datagrid-row-over');
            }).click(function () {
                var index = $(this).attr('datagrid-row-index');
                if ($(this).hasClass('datagrid-row-selected')) {
                    that.unselectRow(target, this);
                } else {
                    that.selectRow(target, this);
					opts.onSelected.call(that,index, data.dataList[index]);
                }
                if (opts.onClickRow) {
                    opts.onClickRow.call(that, index, data.dataList[index]);
                }
            }).dblclick(function () {
                var index = $(this).attr('datagrid-row-index');
                if (opts.onDblClickRow) {
                    opts.onDblClickRow.call(that, index, data.dataList[index]);
                }
            });

            function onHeaderCellClick() {
                var th = $(this).parent();
                if (th.hasClass("sort-header")) {
                    opts.sortName = th.attr('data-code');
                    opts.sortOrder = 'asc';
                    
                    var c = 'datagrid-sort-asc';
                    if ($(this).hasClass('datagrid-sort-asc')) {
                        c = 'datagrid-sort-desc';
                        opts.sortOrder = 'desc';
                    }
                    $('.datagrid-header .datagrid-cell', grid).removeClass('datagrid-sort-asc').removeClass('datagrid-sort-desc');
                    $(this).addClass(c);
                    
                    if (opts.onSortColumn) {
                        opts.onSortColumn.call(this, opts.sortName, opts.sortOrder);
                    }
                    that._request(target);
                }
               
            }

            function onHeaderCheckboxClick() {
                if ($(this).attr('checked')) {
                    $('.datagrid-view2 .datagrid-body tr', grid).each(function () {
                        if (!$(this).hasClass('datagrid-row-selected')) {
                            $(this).trigger('click');
                        }
                    });
                } else {
                    $('.datagrid-view2 .datagrid-body tr', grid).each(function () {
                        if ($(this).hasClass('datagrid-row-selected')) {
                            $(this).trigger('click');
                        }
                    });
                }
            }

            $('.datagrid-header .datagrid-cell', grid).unbind('.datagrid');
            $('.datagrid-header .datagrid-cell', grid).bind('click.datagrid', onHeaderCellClick);

        
            $('.datagrid-header .datagrid-header-check', grid).bind('click', onHeaderCheckboxClick);

     

            var body1 = $('.datagrid-view1 .datagrid-body', grid);
            var body2 = $('.datagrid-view2 .datagrid-body', grid);
            var header2 = $('.datagrid-view2 .datagrid-header', grid);
            body2.scroll(function () {
                header2.scrollLeft(body2.scrollLeft());
                body1.scrollTop(body2.scrollTop());
            });
            
            
            
            
            
			
			opts.toolbar.find("a[data-rel='btn']").unbind("click").click(function(event){
				event.preventDefault();
				that.execute($(this).attr("name"),this);
			});
			opts.search.find("a[data-rel='btn']").unbind("click").click(function(event){
				event.preventDefault();
				that.execute($(this).attr("name"),this);
			});
			
			
        },
        /**
        * fix column size with the special cell element
        */
        _fixColumnSize: function (target, cell) {
            var grid = $.data(target, 'datagrid').grid;
            var opts = $.data(target, 'datagrid').options;
            var that = this;
            if (cell) {
                fix(cell);
            } else {
                $('.datagrid-header .datagrid-cell', grid).each(function () {
                    fix(this);
                });
            }

            function fix(cell) {
                var headerCell = $(cell);
                if (headerCell.width() == 0) return;
                var fieldName = headerCell.parent().attr('field');
                if (fieldName) {
                    $('.datagrid-body td[column-field="' + fieldName + '"]', grid).each(function () {
                        var bodyCell = $(".datagrid-cell", this);
                        if ($.boxModel == true) {
                            bodyCell.width(headerCell.outerWidth() - bodyCell.outerWidth() + bodyCell.width());
                        } else {
                            bodyCell.width(headerCell.outerWidth());
                        }

                    });

                    var col = that._getColumnOption(target, fieldName);
                    col.width = $.boxModel == true ? headerCell.width() : headerCell.outerWidth();
                }


            }
        },

        _getColumnOption: function (target, field) {
            var opts = $.data(target, 'datagrid').options;
            if (opts.columns) {
                for (var i = 0; i < opts.columns.length; i++) {
                    var cols = opts.columns[i];
                    for (var j = 0; j < cols.length; j++) {
                        var col = cols[j];
                        if (col.field == field) {
                            return col;
                        }
                    }
                }
            }
            if (opts.frozenColumns) {
                for (var i = 0; i < opts.frozenColumns.length; i++) {
                    var cols = opts.frozenColumns[i];
                    for (var j = 0; j < cols.length; j++) {
                        var col = cols[j];
                        if (col.field == field) {
                            return col;
                        }
                    }
                }
            }
            return null;
        },
        /**
        * get column fields which will be show in row
        */
        _getColumnFields: function (columns) {
            if (columns.length == 0) return [];

            function getFields(ridx, cidx, count) {
                var fields = [];
                while (fields.length < count) {
                    var col = columns[ridx][cidx];
                    if (col.colspan && parseInt(col.colspan) > 1) {
                        var ff = getFields(ridx + 1, getSubColIndex(ridx, cidx), parseInt(col.colspan));
                        fields = fields.concat(ff);
                    } else if (col.field) {
                        fields.push(col.field);
                    }
                    cidx++;
                }

                return fields;
            }

            function getSubColIndex(ridx, cidx) {
                var index = 0;
                for (var i = 0; i < cidx; i++) {
                    var colspan = parseInt(columns[ridx][i].colspan || '1');
                    if (colspan > 1) {
                        index += colspan;
                    }
                }
                return index;
            }

            var fields = [];
            for (var i = 0; i < columns[0].length; i++) {
                var col = columns[0][i];
                if (col.colspan && parseInt(col.colspan) > 1) {
                    var ff = getFields(1, getSubColIndex(0, i), parseInt(col.colspan));
                    fields = fields.concat(ff);
                } else if (col.field) {
                    fields.push(col.field);
                }
            }

            return fields;
        },
        /**
        * load data to the grid
        */
        _loadData: function () {
            var grid = this.grid;
            var opts = this.opts;
            var that = this;
            var target =this.element;
            var getWidthDelta = function () {
                if ($.boxModel == false) return 0;

                var headerCell = $('.datagrid-header .datagrid-cell:first');
                var headerDelta = headerCell.outerWidth() - headerCell.width();

                var t = $('.datagrid-body table', grid);
                t.append($('<tr><td><div class="datagrid-cell"></div></td></tr>'));
                var bodyCell = $('.datagrid-cell', t);

                var bodyDelta = bodyCell.outerWidth() - bodyCell.width();

                return headerDelta - bodyDelta;
            };

            var widthDelta = getWidthDelta();
            var frozen = opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length > 0);

            $('.datagrid-body, .datagrid-header', grid).scrollLeft(0).scrollTop(0);
            var fields = this._getColumnFields(opts.columns);
			
			$('.datagrid-view2 .datagrid-body table', grid).html(opts.bodytmpl.render(this.opts.data.dataList));
        


            if (opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length > 0)) {
                var frozenFields = this._getColumnFields(opts.frozenColumns);
                $('.datagrid-view1 .datagrid-body table', grid).html(getTBody(frozenFields, opts.rownumbers));
            }
 
            this._setSize(target);
            this._setProperties(target);
        },
     
        /**
        * request remote data
        */
        _request: function (target) {
            var grid = $.data(target, 'datagrid').grid;
            var opts = $.data(target, 'datagrid').options;
            var that = this;

            if (!opts.url) {
            	this.opts.data.dataList=[];
            	return;
            }

            var param = $.extend({}, opts.queryParams);
            if (opts.pagination) {
                $.extend(param, {
                    currentPage: opts.pageNumber,
                    perNum: opts.pageSize
                });
            }
            if (opts.sortName) {
                $.extend(param, {
                    sortName: opts.sortName,
                    sortBy: opts.sortOrder
                });
            }

     

            var wrap = $('.datagrid-wrap', grid);
            $('<div class="datagrid-mask"></div>').css({
                display: 'block',
                width: wrap.width(),
                height: wrap.height()
            }).appendTo(wrap);
            $('<div class="datagrid-mask-msg"></div>')
				.html(opts.loadMsg)
				.appendTo(wrap)
				.css({
				    display: 'block',
				    left: (wrap.width() - $('.datagrid-mask-msg', grid).outerWidth()) / 2,
				    top: (wrap.height() - $('.datagrid-mask-msg', grid).outerHeight()) / 2
				});

            $.ajax({
                type: opts.method,
                url: opts.url,
                data: param,
                dataType: 'json',
                success: function (data) {
                    $('.datagrid-pager', grid).pagination({ loading: false });
                    $('.datagrid-mask', grid).remove();
                    $('.datagrid-mask-msg', grid).remove();
					that.opts.data=data.pageInfo;
                    that._loadData(target, data.pageInfo);
					
			        if(that.opts.pager){
						that.opts.pager.pagination("pageSize",data.pageInfo.recordCount);
					}
			
                    if (opts.onLoadSuccess) {
                        opts.onLoadSuccess.apply(this, arguments);
                    }
                },
                error: function () {
                    $('.datagrid-pager', grid).pagination({ loading: false });
                    $('.datagrid-mask', grid).remove();
                    $('.datagrid-mask-msg', grid).remove();
                    if (opts.onLoadError) {
                        opts.onLoadError.apply(this, arguments);
                    }
                }
            });
        },
		

		/**
        * unselect a row.
        */
        unselectRow: function (target, tr) {
            var opts = $.data(target, 'datagrid').options;
            var grid = $.data(target, 'datagrid').grid;
            var selectedRows = $.data(target, 'datagrid').selectedRows;


            $(tr).removeClass('datagrid-row-selected');
            $(tr).find("input[type=checkbox].datagrid-cell-check").attr('checked', false);

            opts.onUnselect.call(target, tr);
        },
        selectRow:function (target, tr) {
            var opts = this.opts;
            var grid = this.grid;
            var data = this.opts.data;
            if (opts.singleSelect == true) {
                $(tr).siblings().removeClass("datagrid-row-selected").find("input[type=checkbox].datagrid-cell-check:checked").removeAttr("checked");
            }
            $(tr).addClass('datagrid-row-selected');
            $(tr).find("input[type=checkbox].datagrid-cell-check").attr('checked', true);
            opts.onSelect.call(target, tr);
        },
        getSelectedRows: function (target, idkey) {
            target = target || this.element;
			var that=this;
            var opts = this.opts;
            var rows = [];
            if (target.find("input[type=checkbox].datagrid-cell-check").length > 0 && idkey) {
                if (opts.singleSelect == true) {
                    rows = target.find("input[type=checkbox].datagrid-cell-check:checked:first").val();
                } else {
                    target.find("input[type=checkbox].datagrid-cell-check:checked").each(function () {
                        rows.push($(this).val());
                    });
                }
            } else {
            	target.find('tr.datagrid-row-selected').each(function () {
                    rows.push(that.opts.data.dataList[$(this).attr("datagrid-row-index")]);
                });
            }
            return rows;
        },
		insertRow:function(index,data){
			 var rows=this.opts.data.dataList;
			 index? rows.splice(index,data) : rows.push(data);
			 this._loadData();
		},
		removeRow:function(index,data){
			var rows=this.opts.data.dataList;
			if(index!=null&&index>=0){
				rows.splice(index,1);
			}else if(data&&$.inArray(data,rows)>-1){
				 rows.splice($.inArray(data,rows),1);
			}else{
				rows.pop();
			}
			this._loadData();
		},
		updateRow:function(index,data){
		  	if(index!=null&&index>=0&&data){
				this.opts.data.dataList[index]=data;
			}else if(data){
			  var oldData =	this.getSelect();
			   index = $.inArray(oldData,this.opts.data.dataList);
			   index>-1?this.opts.data.dataList[index]=data:"";
			}
		  	this._loadData();
		},
		getSelect:function(){
			return this.getSelectedRows()[0]||{};
		},
		
		selectAll:function(target){
			var target =  this.element;
			var grid = $.data(target, 'datagrid').grid;
			var that=this;
			grid.find(".datagrid-body tr:not(.datagrid-row-selected)").each(function(){
				that.selectRow(target,this);
			});
		},
		unselectAll:function(){
			var	target =  this.element;
			var grid = $.data(target, 'datagrid').grid;
			var that=this;
			grid.find(".datagrid-body tr.datagrid-row-selected ").each(function(){
				that.unselectRow(target,this);
			});
		},
		register:function(b, c){
            this.opts.actions[b] = c;

		},
		execute:function(a,b){
			 this.opts.actions[a].apply(this,[b]);

		},
		remove:function(a){
			this.opts.actions[a]=$.noop;
		},
		
		clearAllData:function(){
			this.opts.data={dataList:[],recordCount:0};
			this._loadData();
		},
		getAllData:function(){
			return this.opts.data.dataList;
		},
		refresh:function(url,queryParams){
		    this.opts.url=url||this.opts.url;
			$.extend(this.opts.queryParams,queryParams||{}); 
            this._request(this.element);
		},
		setOption:function(key,value){
			this.opts[key]=value;
		},
		show:function(){
			this.grid.show();
		},
		hide:function(){
			this.grid.hide();
		},
		
        _destroy: function () {

        }
    });

})(jQuery);