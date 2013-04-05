; (function ($) {
	
    var tabId = 0;
    function getNextTabId(){
        return tabId++;
    }
	
    $.widget("ui.tabs", {
        options: {
            width: 'auto',
            height: 'auto',
            idSeed: 0,
            plain: false,
            fit: true,
            border: true,
            scrollIncrement: 100,
            scrollDuration: 400,
            contextmenu:false,
            onLoad: function(){
            },
            onSelect: function(title){
            },
            onClose: function(title){
            }  
        },
        _create: function(){
        
            var t = $(this.element);
            var opts = this.opts = $.extend(this.options, {
                width: (parseInt(t.css('width')) || undefined),
                height: (parseInt(t.css('height')) || undefined),
                border: (t.attr('border') ? t.attr('border') == 'true' : undefined),
                plain: (t.attr('plain') ? t.attr('plain') == 'true' : undefined)
            });
            
            
            this._wrapTabs();
            
            $.data(t, 'tabs', {
                options: opts
            });
            this._setProperties();
            this._setSize();
            this._selectTab();
            
           
        },
        
        _wrapTabs: function(){
            var container = this.element;
            var that = this;
            container.addClass('tabs-container');
            container.wrapInner('<div class="tabs-panels"/>');
            $('<div class="tabs-header">' +
            '<div class="tabs-scroller-left"></div>' +
            '<div class="tabs-scroller-right"></div>' +
            '<div class="tabs-wrap">' +
            '<ul class="tabs"></ul>' +
            '</div>' +
            '</div>').prependTo(container);
            
            var header = $('>div.tabs-header', container);
            
            $('>div.tabs-panels>div', container).each(function(){
            	var $this=$(this);
                if (!$this.attr('id')) {
                    $this.attr('id', 'gen-tabs-panel' + getNextTabId());
                }
                
                var options = {
                    id: $this.attr('id'),
                    title: $this.attr('title'),
                    content: null,
                    href: $this.attr('href'),
                    closable: $this.attr('closable') == 'true',
                    icon: $this.attr('icon'),
                    selected: $this.attr('selected') == 'true',
                    cache: $this.attr('cache') == 'false' ? false : true,
                    url:$this.attr('cache')
                };
                $(this).attr('title', '');
                that._createTab(options);
            });
            
            $('.tabs-scroller-left, .tabs-scroller-right', header).hover(function(){
                $(this).addClass('tabs-scroller-over');
            }, function(){
                $(this).removeClass('tabs-scroller-over');
            });
            $(container).bind('_resize', function(){
                var opts = that.opts;
                if (opts.fit == true) {
                    that._setSize();
                    that._fitContent();
                }
                return false;
            });
        },
        
        _setSize: function(){
            var container = this.element;
            var opts = this.opts;
            var cc = $(this.element);
            if (opts.fit == true) {
                var p = cc.parent();
                opts.width = p.innerWidth();
                opts.height = p.innerHeight();
            }
            cc.width(opts.width).height(opts.height);
            
            var header = $('>div.tabs-header', container);
            if ($.boxModel == true) {
                var delta = header.outerWidth() - header.width();
                header.width(cc.width() - delta);
            }
            else {
                header.width(cc.width());
            }
            
            this._setScrollers(container);
            
            var panels = $('>div.tabs-panels', container);
            var height = opts.height;
            if (!isNaN(height)) {
                if ($.boxModel == true) {
                    var delta = panels.outerHeight() - panels.height();
                    panels.css('height', (height - header.outerHeight() - delta) || 'auto');
                }
                else {
                    panels.css('height', height - header.outerHeight());
                }
            }
            else {
                panels.height('auto');
            }
            var width = opts.width;
            if (!isNaN(width)) {
                if ($.boxModel == true) {
                    var delta = panels.outerWidth() - panels.width();
                    panels.width(width - delta);
                }
                else {
                    panels.width(width);
                }
            }
            else {
                panels.width('auto');
            }
            
            if ($.parser) {
                $.parser.parse(container);
            }
            
        },
        _fitContent: function(){
            var container = this.element;
            var tab = $('>div.tabs-header ul.tabs li.tabs-selected', container);
            if (tab.length) {
                var panelId = $.data(tab[0], 'tabs.tab').id;
                var panel = $('#' + panelId);
                var panels = $('>div.tabs-panels', container);
                if (panels.css('height').toLowerCase() != 'auto') {
                    if ($.boxModel == true) {
                        panel.height(panels.height() - (panel.outerHeight() - panel.height()));
                        panel.width(panels.width() - (panel.outerWidth() - panel.width()));
                    }
                    else {
                        panel.height(panels.height());
                        panel.width(panels.width());
                    }
                }
                $('>div', panel).triggerHandler('_resize');
            }
            
        },
        _setScrollers: function(){
            var container = this.element;
            var header = $('>div.tabs-header', container);
            var tabsWidth = 0;
            $('ul.tabs li', header).each(function(){
                tabsWidth += $(this).outerWidth(true);
            });
            
            if (tabsWidth > header.width()) {
                $('.tabs-scroller-left', header).css('display', 'block');
                $('.tabs-scroller-right', header).css('display', 'block');
                $('.tabs-wrap', header).addClass('tabs-scrolling');
                
                if ($.boxModel == true) {
                    $('.tabs-wrap', header).css('left', 2);
                }
                else {
                    $('.tabs-wrap', header).css('left', 0);
                }
                var width = header.width() -
                $('.tabs-scroller-left', header).outerWidth() -
                $('.tabs-scroller-right', header).outerWidth();
                $('.tabs-wrap', header).width(width);
                
            }
            else {
                $('.tabs-scroller-left', header).css('display', 'none');
                $('.tabs-scroller-right', header).css('display', 'none');
                $('.tabs-wrap', header).removeClass('tabs-scrolling').scrollLeft(0);
                $('.tabs-wrap', header).width(header.width());
                $('.tabs-wrap', header).css('left', 0);
                
            }
        },
        
        // get the left position of the tab element
        _getTabLeftPosition: function(container, tab){
            var w = 0;
            var b = true;
            $('>div.tabs-header ul.tabs li', container).each(function(){
                if (this == tab) {
                    b = false;
                }
                if (b == true) {
                    w += $(this).outerWidth(true);
                }
            });
            return w;
        },
        
        // get the max tabs scroll width(scope)
        _getMaxScrollWidth: function(container){
            var header = $('>div.tabs-header', container);
            var tabsWidth = 0; // all tabs width
            $('ul.tabs li', header).each(function(){
                tabsWidth += $(this).outerWidth(true);
            });
            var wrapWidth = $('.tabs-wrap', header).width();
            var padding = parseInt($('.tabs', header).css('padding-left'));
            
            return tabsWidth - wrapWidth + padding;
        },
        _setProperties: function(){
            var container = this.element;
            var opts = this.opts;
            var header = $('>div.tabs-header', container);
            var panels = $('>div.tabs-panels', container);
            var tabs = $('ul.tabs', header);
            var that = this;
            
            if (opts.plain == true) {
                header.addClass('tabs-header-plain');
            }
            else {
                header.removeClass('tabs-header-plain');
            }
            if (opts.border == true) {
                header.removeClass('tabs-header-noborder');
                panels.removeClass('tabs-panels-noborder');
            }
            else {
                header.addClass('tabs-header-noborder');
                panels.addClass('tabs-panels-noborder');
            }
            
            $('li', tabs).live('click.tabs', function(){
                $('>.tabs-selected', tabs).removeClass('tabs-selected');
                $(this).addClass('tabs-selected');
                $(this).blur();
                
               
                
                $('>div.tabs-panels>div', container).css('display', 'none').removeAttr("aria-expanded");
                
                var wrap = $('.tabs-wrap', header);
                var leftPos = that._getTabLeftPosition(container, this);
                var left = leftPos - wrap.scrollLeft();
                var right = left + $(this).outerWidth();
                if (left < 0 || right > wrap.innerWidth()) {
                    var pos = Math.min(leftPos - (wrap.width() - $(this).width()) / 2, that._getMaxScrollWidth(container));
                    wrap.animate({
                        scrollLeft: pos
                    }, opts.scrollDuration);
                }
                
                var tabAttr = $.data($(this)[0], 'tabs.tab');
                var panel = $('#' + tabAttr.id);
                panel.css('display', 'block').attr("aria-expanded", true);
                
                if (tabAttr.href && (!tabAttr.loaded || !tabAttr.cache)) {
                    panel.ajaxLoad(tabAttr.href, null, function(){
                        if ($.parser) {
                            $.parser.parse(panel);
                        }
                       
                    });
                }
                
                that._fitContent(container);
                
                opts.onSelect.call(panel, tabAttr);
                if(!tabAttr.loaded){
                	 opts.onLoad.call(this, tabAttr);
                     tabAttr.loaded = true;
                }
               
            });
            
            $('a.tabs-close', tabs).live('click.tabs', function(event){
                var elem = $(this).parent()[0];
                var tabAttr = $.data(elem, 'tabs.tab');
                that._closeTab(tabAttr.title);
                return false;
            });
            
            $('.tabs-scroller-left', header).unbind('.tabs').bind('click.tabs', function(){
                var wrap = $('.tabs-wrap', header);
                var pos = wrap.scrollLeft() - opts.scrollIncrement;
                wrap.animate({
                    scrollLeft: pos
                }, opts.scrollDuration);
            });
            
            $('.tabs-scroller-right', header).unbind('.tabs').bind('click.tabs', function(){
                var wrap = $('.tabs-wrap', header);
                var pos = Math.min(wrap.scrollLeft() + opts.scrollIncrement,  that._getMaxScrollWidth(container));
                wrap.animate({
                    scrollLeft: pos
                }, opts.scrollDuration);
            });
        },
        
        _createTab: function(options){
        
            var container = $(this.element);
            var header = $('>div.tabs-header', container);
            var tabs = $('ul.tabs', header);
			var tab_panel;
            
            var tab = $('<li></li>');
            var tab_span = $('<span></span>').html(options.title).attr("title",options.title);
            var tab_a = $('<a class="tabs-inner"></a>').attr('href', 'javascript:void(0)').append(tab_span);
            tab.append(tab_a).appendTo(tabs);
            
            if (options.closable) {
                tab_span.addClass('tabs-closable');
                tab_a.after('<a href="javascript:void(0)" class="tabs-close"></a>');
            }
            if (options.icon) {
                tab_span.addClass('tabs-with-icon');
                tab_span.after($('<span/>').addClass('tabs-icon').addClass(options.icon));
            }
			
		    tab_panel =	$('#' + options.id).removeAttr('title').addClass("ui-tabs-panel");
            if (options.content) {
                tab_panel.html(options.content);
            }
            
            $('#' + options.id).removeAttr('title').addClass("ui-tabs-panel");
            $.data(tab[0], 'tabs.tab', {
                id: options.id,
                title: options.title,
                href: options.href,
                loaded: false,
                cache: options.cache,
				panel:tab_panel,
				closable:options.closable,
				url:options.url
            });
            if (options.selected) {
                this._selectTab(options.title);
            }
            if(this.opts.contextmenu)this._creatMenu(tab);
        },
        
        // active the selected tab item, if no selected item then active the first item
        _selectTab: function(title){
            var container = this.element;
            if (title) {
                var elem = $('>div.tabs-header li:has(a span:contains("' + title + '"))', container)[0];
                if (elem) {
                    $(elem).trigger('click');
                }
            }
            else {
            
                var tabs = $('>div.tabs-header ul.tabs', container);
                if ($('.tabs-selected', tabs).length == 0) {
                    $('li:first', tabs).trigger('click');
                }
                else {
                    $('.tabs-selected', tabs).trigger('click');
                }
            }
        },
        
        
        // close a tab with specified title
        _closeTab: function(title){
            var container = this.element;
            var opts = this.opts;
            var elem = $('>div.tabs-header li:has(a span:contains("' + title + '"))', container)[0];
            if (!elem) 
                return;
            
            var tabAttr = $.data(elem, 'tabs.tab');
            var panel = $('#' + tabAttr.id);
            
            if (opts.onClose.call(panel, tabAttr.title) == false) 
                return;
            
            var selected = $(elem).hasClass('tabs-selected');
            $.removeData(elem, 'tabs.tab');
            $(elem).remove();
            panel.remove();
            
            this._setSize();
            if (selected) {
                this._selectTab();
            }
            else {
                var wrap = $('>div.tabs-header .tabs-wrap', container);
                var pos = Math.min(wrap.scrollLeft(), this._getMaxScrollWidth(container));
                wrap.animate({
                    scrollLeft: pos
                }, opts.scrollDuration);
            }
        },
        addTab: function(options){
            options = $.extend({
                id: this.element.attr("id")+getNextTabId(),
                title: '',
                content: '',
                href: null,
                cache: true,
                icon: null,
                closable: true,
                selected: true,
                height: null,
                width: null
            }, options || {});
            
            
            var panels = $('>div.tabs-panels', this.element);
            
            $('<div></div>').attr('id', options.id).attr('title', options.title).height(options.height || panels.innerHeight()).width(options.width || panels.innerWidth()).appendTo(panels);
            
            
            this._exists(options.title) ? this._selectTab(options.title) : this._createTab(options);
        },
        _creatMenu:function(tab){
          
            var that =this;
          var opts=tab.data("tabs.tab");
           var menu =tab.contextmenu();
           if(opts.href&&tab.hasClass("tabs-selected")){
        	  menu.contextmenu("addMenu","刷新",{icon:"icon-refresh"},function(e,t){
        		 opts.loaded=false;
                that.refresh(opts);
                that._selectTab(opts.title);
            },"icon-refresh"); 
           }
         
           if(opts.closable){
        	  menu.contextmenu("addMenu","关闭当前页",{icon:"icon-off"},function(e,t){
                that._closeTab(opts.title);
            }); 
           }
            
           
            menu.contextmenu("addMenu","关闭所有",{icon:"icon-off"},function(){
            	tab.parent().find(">li").each(function(i){
                    var  _opts=$(this).data("tabs.tab");
                    if(_opts.closable){
                    	that._closeTab(_opts.title);
                    }
            		
            	});
            },"icon-refresh");
             menu.contextmenu("addMenu","关闭其他",{icon:"icon-off"},function(){
            	tab.siblings().each(function(){
            	   var  _opts=$(this).data("tabs.tab");
                    if(_opts.closable){
                    	that._closeTab(_opts.title);
                    }
            	})
            });
        },
        _exists: function(title){
            return $('>div.tabs-header li:has(a span:contains("' + title + '"))', this.element).length > 0;
        },
        exists: function(title){
           return  this._exists(title);
        },
        selectTab:function(title){
           this._selectTab(title);	
        },
        getSelected: function(){
            var container = this.element;
            var elem = $(">div.tabs-header li.tabs-selected", container);
            return elem.length > 0 ? $.data(elem[0], 'tabs.tab') : null;
        },
        refresh: function(tabAttr){
			var that=this;
            if (tabAttr) {
				if(tabAttr.content){
					tabAttr.panel.html(tabAttr.content);
					that.opts.onLoad.apply(this, arguments);
				    tabAttr.loaded = true;
				} else if (tabAttr.href && (!tabAttr.loaded || !tabAttr.cache)) {
                    tabAttr.panel.load(tabAttr.href, null, function(){
						that.opts.onLoad.apply(this, arguments);
                        tabAttr.loaded = true;
                    });
                }
            }else{
            	var opts=this.getSelected();
            	if(opts){
            		opts.loaded=false;
            		this.refresh(opts);
            	}
            	
            }
       
        },
		setOption:function(key,value){
			this.opts[key]=value;
		},
		getOptions:function(key,value){
		   return this.opts;
		},
        destory: function(){
        
        
        }
    });
})(jQuery);



