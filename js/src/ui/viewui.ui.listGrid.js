/*!
 *  @author liezun.xiao
 * @author liezun.xiao@pousheng.com
 * Depends:
 *	jquery.ui.widget.js
 *  jquery.ui.core.js
 *  pousheng.pagination.js
 *
 */
;(function($) {

    /*!
     *	jquery.ui.widget.js
     *tabs("addTab",url,label,index);
     */
    $.widget("ui.listGrid", {
        options : {
            show : "fadeIn",
            dataSource : null,
            url : null,
            template : null,
            pagination : ".pagination",
            search : ".form-search",
            buttons : ".toolButton",
            selectedItem : null,
            table : ".table",
            target : "",
            isSerial : true,
            multiple : false,
            queryString : null,
            template : null,
            startPage : 1,
            permPages : [5, 10, 20, 30, 40, 50],
            perIndex : 0,
            count : 0,

            onClick : null,
            dbClick : null
        },
        _create : function() {

            $(this).data("listGrid", this.options);
            this._template = this.options.template || $.templates($(this.element.attr("template"), this.element).html());
            this._url = this.options.url || this.element.attr("url");
            this._pagination = $(this.options.pagination, this.element);
            this._search = $(this.options.search, this.element);
            this._buttons = this.options.buttons;
            this._selectedItem = this.options.selectedItem || {};
            this._selectedItem.data = [];
            this._table = $(this.options.table, this.element);
            this._target = this.options._target || $(this.element.attr("target"), this.element);
            this._isSerial = this.options.isSerial;
            this._multiple = this.options.multiple || this.element.attr("multiple");
            this._queryString = this.options.queryString || {};
            this._permPages = this.options.permPages;
            this._permPage = this.options.permPage || this._permPages[this.options.perIndex];
            this._currentPageNum = this.options.startPage;
            this._count = this.options.count;
            this._inits();

        },
        _inits : function() {
            //初始化分页
            this._pagination = this._initPagination();

            this._initTable();
            //按钮初始化
            this._initButton();
        },
        _initPagination : function() {
            var that = this;
            if (that._target && that._target.length > 0 && that._url) {
                return that._pagination.pagination({
                    perIndex : 0,
                    startRange : 2,
                    endRange : 2,
                    onSelectPage : function(page, permPage) {
                        // save the page state
                        that._currentPageNum = page;
                        that._permPage = permPage;
                        that._request();
                        // request new page data
                    }
                });
            }
        },
        _initTable : function() {
            var that = this;
            that._target.on("click", "tr", function(e) {
                var $this = $(this);
                var tempData = $.view(this).data;
                var tempArray = [];
                if ($this.hasClass("selected")) {
                	 $("input[data-checked]:checked",this).removeAttr("checked");
                    $this.removeClass("selected");
                    $.inArray(tempData, that._selectedItem.data) != -1 ?
                    delete that._selectedItem.data[$.inArray(tempData, that._selectedItem.data)] : "";
                } else {
                	 $("input[data-checked]:not(:checked)",this).attr("checked", true);
                    if (!that._multiple) {
                    	$(this).siblings().find("input[data-checked]:checked").removeAttr("checked");
                        that._selectedItem.data = [];
                        that._selectedItem.data[0] = tempData;
                        $this.addClass("selected").siblings("tr").removeClass("selected");
                    } else {
                        that._selectedItem.data.push(tempData);
                        $this.addClass("selected");
                    }
                    if ($.isFunction(that.options.onClick)) {
                        that.options.onClick(e, {
                            data : that._selectedItem.data[0]
                        });
                    }
                }
                $.each(that._selectedItem.data || [], function(i, v) {
                    if (v)
                        tempArray.push(v);
                });
                that._selectedItem.data = tempArray;

            });

            //初始化表格样式
            that._grid = $("<div class='grid'></div>");
            var gridThead = $("<div class='gridThead'></div>");
            var tableHead = $("<table class='table'></table>");
            var gridScroll = $("<div class='gridScroller'></div>");
            var gridTbody = $("<div class='gridTbody'></div>");
            var ths = $("thead th", that._table);
            var title = "";
            ths.wrapInner("<div class='gridCol' ></div>");
            that._grid = that._table.wrap(that._grid).parent();
            // tableHead =tableHead.append($("thead", that._table));
            // grid.append(gridThead.append(tableHead));
            // grid.append(gridScroll.append(gridTbody.append(that._table)));

            $(".gridCol").resizable({
                handles : "e",
                maxWidth : 350,
                minWidth : 20,
                resize : function(event, ui) {
                    var th = $(this).width("100%").parent("th").width(ui.size.width);
                    // $("tr:first td",gridTbody).eq(th.index()).width(ui.size.width);
                    // $(this).width("100%");
                }
            });

            this._grid.bind("_resize", this._setSize);

            //绑定排序
            $("thead th.sort-header", that._grid).toggle(function() {
                $(this).removeClass("sort-down").addClass("sort-up");
                $.extend(that._queryString, {
                    sortName : $(this).attr("data-code"),
                    sortBy : "asc"
                });
                that._request();
            }, function() {
                $(this).removeClass("sort-up").addClass("sort-down");
                $.extend(that._queryString, {
                    sortName : $(this).attr("data-code"),
                    sortBy : "desc"
                });
                that._request();
            });

        },
        _initButton : function() {
            var that = this;
            $("a[data-rel='btn']", that.element).click(function(event) {
                event.preventDefault();

                var $this = $(this);

                var name = $this.attr("name"), href = $this.attr("href"), title = $this.attr("title"), tag = $this.attr("target"), LoadPage = null;

                //验证是否选中记录
                //数组转换算法待改善
                if (name && that._selectedItem.data.length == 0) {
                    pousheng.warnMsg("请选择一条记录");
                    return false;
                }
                /*		if(name=="delete" && that._multiple){
                pousheng.comfirm("确认删除",function(v){
                if(v){
                if($.isArray(that._selectedItem.data) && that._selectedItem.data.length >0){
                $.each(that._selectedItem.data,function(i,e){
                $.map(e||{},function(f,v){
                if(!value[v])value[v]=[];
                value[v].push(f);
                });
                i++;
                });
                $.map(value||{},function(f,v){
                value[v]=f.toString();
                });
                }
                that._selectedItem.data=value;

                }else{
                return false;
                }
                });
                }else{
                value=that._selectedItem.data=that._selectedItem.data[0];
                }
                */

                //选择跳转方式
                if (tag && tag == "dialog") {
                    tag = $("<div></div>");
                    tag.dialog({
                        "title" : title
                    });
                } else {
                    tag = $(tag, ".ui-tabs-panel[aria-expanded='true']").length > 0 ? $(tag[0]) : $this.closest(".box").length > 0 ? $this.closest(".box") : $this.closest(".ui-tabs-panel");
                }
                LoadPage = tag.ajaxLoad(href, {
                	data:that._selectedItem.data[0]
                });

                if (LoadPage && name == "delete") {
                    LoadPage.done(function() {
                        that._request();
                    });
                } else if (LoadPage && name == "view") {
                    LoadPage.done(function() {
                        that._ReplaceInput(tag);
                    });
                }
            });

            //搜索按钮
            $("a[data-rel='search']").click(function() {
                if (that._search.length > 0 && that._search.validate().form()) {
                    $.extend(that._queryString, that._search.getFieldValues());
                    that._request();
                }
            });
        },

        _request : function() {
            var that = this;
            $.extend(true, that._queryString, {
                currentPage : that._currentPageNum,
                perNum : that._permPage
            });
            var loadData = pousheng.ajaxData(that._url, {
                data : that._queryString
            });
            loadData.done(function(data) {
                that._template.link(that._target, data.pageInfo.dataList).slideDown();
                that._target.initUI();
                that._pagination.pagination("pageSize", data.pageInfo.recordCount);
                that._selectedItem.data = [];
                //清空已选项
                that._grid.trigger("_resize");
            });

        },
        _DrawTable : function() {
        },
        _setSize : function() {
            var that = $(this);
            parent = that.offsetParent();
            that.height((parent.innerHeight() - that.position().top - that.next().height()) + "px");

        },
        _ReplaceInput : function(html) {

            $("input:text", html).each(function(i) {
                var temp = $("<span class='showLable'>" + $(this).val() + "</span>").width($(this).width() + "px").css("left", $(this).position().left);
                $(this).replaceWith(temp);
                temp.resizable();
            });
            $("input:submit").hide();
        },
        refresh : function(url, queryString) {
            this._url = url;
            $.extend(true, this._queryString, queryString);
            this._request();

        },
        getSelect : function() {
            this._selectedItem.data = $.isArray(this._selectedItem.data) ? this._selectedItem.data[0] : this._selectedItem.data;
            return this._selectedItem;
        },
        destroy : function() {

        }
    });

})(jQuery); 