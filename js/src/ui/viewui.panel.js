; (function ($) {
    $.widget("ui.panel", {
         options: {
            title: null,
            iconCls: null,
            width: 'auto',
            height: 'auto',
            left: null,
            top: null,
            cls: null,
            headerCls: null,
            bodyCls: null,
            style: {},
            fit: false,
            border: true,
            doSize: true, // true to set size and do layout


            resizable:false,
			draggable:false,
            collapsible: false,
            minimizable: false,
            maximizable: false,
            closable: false,
            collapsed: false,
            minimized: false,
            maximized: false,
            closed: false,

            // custom tools, every tool can contain two properties: iconCls and handler
            // iconCls is a icon CSS class
            // handler is a function, which will be run when tool button is clicked
            tools: [],

            href: null,
            loadingMessage: 'Loading...',
            onLoad: function () { },
            onBeforeOpen: function () { },
            onOpen: function () { },
            onBeforeClose: function () { },
            onClose: function () { },
            onBeforeDestroy: function () { },
            onDestroy: function () { },
            onResize: function (width, height) { },
            onMove: function (left, top) { },
            onMaximize: function () { },
            onRestore: function () { },
            onMinimize: function () { },
            onBeforeCollapse: function () { },
            onBeforeExpand: function () { },
            onCollapse: function () { },
            onExpand: function () { }
        },
        _create: function () {
            var t = this.element,
              opts = this.options;
  
            $.extend(this.options, {
                width: (parseInt(t.css('width')) || opts.width),
                height: (parseInt(t.css('height')) || opts.height),
                left: (parseInt(t.css('left')) ||opts.left),
                top: (parseInt(t.css('top')) || opts.top),
                title: (t.attr('title') || opts.title),
                iconCls: t.attr('icon') || opts.icon,
                href: t.attr('href') || opts.href,
                style: t.attr('style') || opts.style,
                fit: t.attr('fit') || opts.fit,
                border: (t.attr('border') || opts.border),
				headerCls:(t.attr('headerCls') || opts.headerCls),
                collapsible: (t.attr('collapsible') || opts.collapsible),
                minimizable: (t.attr('minimizable') || opts.minimizable),
                maximizable: (t.attr('maximizable') || opts.maximizable),
                closable: (t.attr('closable') || opts.closable),
                collapsed: (t.attr('collapsed') || opts.collapsed),
                minimized: (t.attr('minimized') || opts.minimized),
                maximized: (t.attr('maximized') || opts.maximized),
                closed: t.attr('closed') || opts.closed
            });

        	this.element.data(this.widgetName, {
                options: this.opts,
                panel: this._wrapPanel(),
                isLoaded: false
            });
           
          
          console.log(this.element.data(this.widgetName))

            this._addHeader(this.element);
            this._setBorder(this.element);
            this._loadData(this.element);

            if (opts.doSize == true) {
                this._setSize(this.element);
            }
       
            if (opts.closed == true||opts.closed =="true") {
                this.element.data(this.widgetName).panel.hide();
            } else {
                this._openPanel(this.element);
                if (opts.maximized == true) this._maximizePanel(this.element);
                if (opts.minimized == true) this._minimizePanel(this.element);
                if (opts.collapsed == true) this._collapsePanel(this.element);
            }

            this._setProperties();

        },
        _setSize: function (target, param) {
            var opts = this.options;
            var panel = this.element.data(this.widgetName).panel;
            var pheader = panel.find('>div.panel-header');
            var pbody = panel.find('>div.panel-body');

             panel.attr("style",opts.style);
            if (param) {
                if (param.width) opts.width = param.width;
                if (param.height) opts.height = param.height;
                if (param.left != null) opts.left = param.left;
                if (param.top != null) opts.top = param.top;
            }

            if (opts.fit == true) {
                var p = panel.parent();
                opts.width = p.innerWidth();
                opts.height = p.innerHeight();
            }
            panel.css({
                left: opts.left,
                top: opts.top
            });
            
       
            //panel.css(opts.style);
            panel.addClass(opts.cls);
            pheader.addClass(opts.headerCls);
            pbody.addClass(opts.bodyCls);

            if (!isNaN(opts.width)) {
                if ($.boxModel == true) {
                    panel.width(opts.width - (panel.outerWidth() - panel.width()));
                    pheader.width(panel.width() - (pheader.outerWidth() - pheader.width()));
                    pbody.width(panel.width() - (pbody.outerWidth() - pbody.width()));
                   // panel.animate({width:(opts.width - (panel.outerWidth() - panel.width()))});
                   // pheader.animate({width:(panel.width() - (pheader.outerWidth() - pheader.width()))})
                   // pheader.animate({width:(panel.width() - (pbody.outerWidth() - pbody.width()))});

                } else {
                   // panel.animate({width:opts.width});
                    // pheader.animate({width:panel.width()})
                   // pbody.animate({width:panel.width()});
 
                  // panel.width(opts.width);
                 // pheader.width(panel.width());
                   //pbody.width(panel.width());

                    panel.width(opts.width - (panel.outerWidth() - panel.width()));
                    pheader.width(panel.width() - (pheader.outerWidth() - pheader.width()));
                    pbody.width(panel.width() - (pbody.outerWidth() - pbody.width()));
               
                }
            } else {
                panel.width('auto');
                pbody.width('auto');
            }
            if (!isNaN(opts.height)) {
                //			var height = opts.height - (panel.outerHeight()-panel.height()) - pheader.outerHeight();
                //			if ($.boxModel == true){
                //				height -= pbody.outerHeight() - pbody.height();
                //			}
                //			pbody.height(height);

                if ($.boxModel == true) {
                  //  panel.height(opts.height - (panel.outerHeight() - panel.height()));
                    pbody.height(opts.height - pheader.outerHeight() - (pbody.outerHeight() - pbody.height()));
                } else {
                   // panel.height(opts.height);
                   // pbody.height(panel.height() - pheader.outerHeight());

                   // panel.height(opts.height - (panel.outerHeight() - panel.height()));
                    pbody.height(opts.height  - pheader.outerHeight() - (pbody.outerHeight() - pbody.height()));
                }
            } else {
                pbody.height('auto');
            }
            panel.css('height', 'auto');

            opts.onResize.apply(target, [opts.width, opts.height]);

            panel.find('>div.panel-body>div').triggerHandler('_resize');
        },
        _addHeader: function (target) {
            var opts = this.options;
            var panel = this.element.data(this.widgetName).panel;
            var that = this;
            panel.find('>div.panel-header').remove();
            if (opts.title) {
                var header = $('<div class="panel-header"><div class="panel-title">' + opts.title + '</div></div>').prependTo(panel);
                if (opts.iconCls) {
                    header.find('.panel-title').addClass('panel-with-icon');
                    $('<div class="panel-icon"></div>').addClass(opts.iconCls).appendTo(header);
                }
                var tool = $('<div class="panel-tool"></div>').appendTo(header);
                if (opts.closable) {
                    $('<i class="panel-tool-close"></i>').appendTo(tool).bind('click', onClose);
                }
                if (opts.maximizable) {
                    $('<i class="panel-tool-max"></i>').appendTo(tool).bind('click', onMax);
                }
                if (opts.minimizable) {
                    $('<i class="panel-tool-min"></i>').appendTo(tool).bind('click', onMin);
                }
                if (opts.collapsible) {
                    $('<i class="panel-tool-collapse"></i>').appendTo(tool).bind('click', onToggle);
                }
                if (opts.tools) {
                    for (var i = opts.tools.length - 1; i >= 0; i--) {
                        var t = $('<a></a>').addClass(opts.tools[i].iconCls).appendTo(tool);
                        if (opts.tools[i].handler) {
                            t.bind('click', eval(opts.tools[i].handler));
                        }
                    }
                }
                tool.find('div').hover(
				function () { $(this).addClass('panel-tool-over'); },
				function () { $(this).removeClass('panel-tool-over'); }
			);
                panel.find('>div.panel-body').removeClass('panel-body-noheader');
            } else {
                panel.find('>div.panel-body').addClass('panel-body-noheader');
            }

            function onToggle() {
                if ($(this).hasClass('panel-tool-expand')) {
                    that._expandPanel(target, true);
                } else {
                    that._collapsePanel(target, true);
                }
                return false;
            }

            function onMin() {
                that._minimizePanel(target);
                return false;
            }

            function onMax() {
                if ($(this).hasClass('panel-tool-restore')) {
                    that._restorePanel(target);
                } else {
                    that._maximizePanel(target);
                }
                return false;
            }

            function onClose() {
                that._closePanel(target);
                return false;
            }

        },

        /**
        * load content from remote site if the href attribute is defined
        */
        _loadData: function (target) {
            var opts = this.options;
            var panel = this.element.data(this.widgetName).panel;
            if (opts.href && !this.element.data(this.widgetName).isLoaded) {
                state.isLoaded = false;
                var pbody = state.panel.find('>.panel-body');
                pbody.html($('<div class="panel-loading"></div>').html(state.options.loadingMessage));
                pbody.load(state.options.href, null, function () {
                    if ($.parser) {
                        $.parser.parse(pbody);
                    }
                    state.options.onLoad.apply(target, arguments);
                    state.isLoaded = true;
                });
            }
        },

        _openPanel: function (target, forceOpen) {
            var opts = this.options;
            var panel = this.element.data(this.widgetName).panel;

            if (forceOpen != true) {
              this._trigger("onBeforeOpen",null,panel[0]);
            }
             panel.show();
            opts.closed = false;
            this._trigger("onOpen",null,panel[0])
 
        },

        _closePanel: function (target, forceClose) {
                 var opts = this.options;
            var panel = this.element.data(this.widgetName).panel;

            if (forceClose != true) {
                if (opts.onBeforeClose.call(target) == false) return;
            }
            panel.hide();
            opts.closed = true;
            opts.onClose.call(target);
        },

        _destroyPanel: function (target, forceDestroy) {
               var opts = this.options;
            var panel = this.element.data(this.widgetName).panel;

            if (forceDestroy != true) {
                if (opts.onBeforeDestroy.call(target) == false) return;
            }
            panel.remove();
            opts.onDestroy.call(target);
        },

        _collapsePanel: function (target, animate) {
                var opts = this.options;
            var panel = this.element.data(this.widgetName).panel;
            if (opts.onBeforeCollapse.call(target) == false) return;

            panel.find('>div.panel-header .panel-tool-collapse').addClass('panel-tool-expand');
            if (animate == true) {
                panel.find('>div.panel-body').slideUp('normal', function () {
                    opts.collapsed = true;
                    opts.onCollapse.call(target);
                });
            } else {
                panel.find('>div.panel-body').hide();
                opts.collapsed = true;
                opts.onCollapse.call(target);
            }
        },

        _expandPanel: function (target, animate) {
                var opts = this.options;
            var panel = this.element.data(this.widgetName).panel;
            if (opts.onBeforeExpand.call(target) == false) return;

            panel.find('>div.panel-header .panel-tool-collapse').removeClass('panel-tool-expand');
            if (animate == true) {
                panel.find('>div.panel-body').slideDown('normal', function () {
                    opts.collapsed = false;
                    opts.onExpand.call(target);
                });
            } else {
                panel.find('>div.panel-body').show();
                opts.collapsed = false;
                opts.onExpand.call(target);
            }
        },

        _maximizePanel: function (target) {
                 var opts = this.options;
            var panel = this.element.data(this.widgetName).panel;
            panel.find('>div.panel-header .panel-tool-max').addClass('panel-tool-restore');
            $.data(target, 'panel').original = {
                width: opts.width,
                height: opts.height,
                left: opts.left,
                top: opts.top,
                fit: opts.fit
            };
            opts.left = 0;
            opts.top = 0;
            opts.fit = true;
            setSize(target);
            opts.minimized = false;
            opts.maximized = true;
            opts.onMaximize.call(target);
        },

        _minimizePanel: function (target) {
                 var opts = this.options;
            var panel = this.element.data(this.widgetName).panel;
            panel.hide();
            opts.minimized = true;
            opts.maximized = false;
            opts.onMinimize.call(target);
        },

        _restorePanel: function (target) {
                var opts = this.options;
            var panel = this.element.data(this.widgetName).panel;
            panel.show();
            panel.find('>div.panel-header .panel-tool-max').removeClass('panel-tool-restore');
            var original = $.data(target, 'panel').original;
            opts.width = original.width;
            opts.height = original.height;
            opts.left = original.left;
            opts.top = original.top;
            opts.fit = original.fit;
            setSize(target);
            opts.minimized = false;
            opts.maximized = false;
            opts.onRestore.call(target);
        },
        _setBorder: function (target) {
                var opts = this.options;
            var panel = this.element.data(this.widgetName).panel;
            if (opts.border == true) {
                panel.find('>div.panel-header').removeClass('panel-header-noborder');
                panel.find('>div.panel-body').removeClass('panel-body-noborder');
            } else {
                panel.find('>div.panel-header').addClass('panel-header-noborder');
                panel.find('>div.panel-body').addClass('panel-body-noborder');
            }
        },
        _wrapPanel: function () {
           var opts =this.options;
            var panel = this.element.addClass('panel-body').wrap('<div class="panel"></div>').parent();
			var that=this;
            panel.bind('_resize', function () {
                var opts = $.data(target, 'panel');
                if (opts.fit == true) {
                    that._setSize(target);
                }
                return false;
            });
            if(opts.style){
                panel.attr("style",opts.style);
                this.element.removeAttr("style");
            }
            return panel;
        },
        _closePanel:function (target, forceClose){
		        var opts = this.options;
            var panel = this.element.data(this.widgetName).panel;
		
		    if (forceClose != true){
			    if (opts.onBeforeClose.call(target) == false) return;
		    }
		    panel.hide();
		    opts.closed = true;
		    opts.onClose.call(target);
	    },
        _openPanel:function(target, forceOpen){
                 var opts = this.options;
            var panel = this.element.data(this.widgetName).panel;
		
		    if (forceOpen != true){
			    if (opts.onBeforeOpen.call(target) == false) return;
		    }
		    panel.show();
		    opts.closed = false;
		    opts.onOpen.call(target);
        },
        _destroyPanel:function (target, forceDestroy){
		        var opts = this.options;
            var panel = this.element.data(this.widgetName).panel;
		
		    if (forceDestroy != true){
			    if (opts.onBeforeDestroy.call(target) == false) return;
		    }
		    panel.remove();
		    opts.onDestroy.call(target);
	   },
        _setProperties:function(){
           var that=this;
			if(this.options.resizable){
                var opts = $.extend(true,{
                stop:function(event,ui){
                  that._setSize(that.element,ui.size);
                }},
                this.options.resizable);

				this.element.data(this.widgetName).panel.resizable(opts);
			}
            if(this.options.draggable){
                var opts = $.extend({handle:this.header()},this.options.draggable);
				this.element.data(this.widgetName).panel.draggable(opts);
			}
		},
        _movePanel:function(param){
        
        	var opts = this.options,
		        panel = this.element.data('panel').panel;

                console.log(this.element.data(this.widgetName))
		    if (param){
			    if (param.left != null) opts.left = param.left;
			    if (param.top != null) opts.top = param.top;
		    }
		    panel.css({
			    left: opts.left,
			    top: opts.top
		    });
            this._trigger("onMove",null,[opts.left, opts.top]);

        },

        panel: function () {
            return 	this.element.data(this.widgetName).panel;
        },
        open: function (param) {
            this._openPanel(this.element, param);
        },
        close:function(param){
           this._closePanel(this.element, param);
        },
        move:function(param){
          this._movePanel(param);
        },
        resize:function(param){
           this._setSize(this.element, param);
        },
        header:function(){
            return 	this.element.data(this.widgetName).panel.find('>div.panel-header');
        },
        getOptions:function(){
            return this.opts;
        },
        collapse:function(){
        
        },
        destroy: function () {
          // this._destroyPanel(this.element, param);
        }
    });
}(jQuery));