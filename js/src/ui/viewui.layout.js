(function ($) {
    $.widget("ui.layout", {
        options: {
        	fit:false
    },
    _create: function () {
        $.data(this.element, 'layout', {
            options: this.options,
            panels: this._inits(this.element)
        });
        this._bindEvents(this.element);
        this._setSize(this.element);
    },
    _setSize: function (container) {
        var that = this;
        var opts = this.options;
        var panels = $.data(container, 'layout').panels;

        var cc = $(container);

        if (opts.fit == true) {
            var p = cc.parent();
            cc.width(p.innerWidth()).height(p.innerHeight());
        }

        var cpos = {
            top: 0,
            left: 0,
            width: cc.width(),
            height: cc.height()
        };

        // set north panel size
        function setNorthSize(pp) {
            if (pp.length == 0) return;
            pp.panel('resize', {
                width: cc.innerWidth(),
                height: pp.panel('option','height'),
                left: 0,
                top: 0
            });
            cpos.top += pp.panel('option', 'height');
            cpos.height -= pp.panel('option', 'height');
        }
        if (that._isVisible(panels.expandNorth)) {
            setNorthSize(panels.expandNorth);
        } else {
            setNorthSize(panels.north);
        }

        // set south panel size
        function setSouthSize(pp) {
            if (pp.length == 0) return;
            pp.panel('resize', {
                width: cc.width(),
                height: pp.panel('option', 'height'),
                left: 0,
                top: cc.height() - pp.panel('option', 'height')
            });
            cpos.height -= pp.panel('option', 'height');
        }
        if (that._isVisible(panels.expandSouth)) {
            setSouthSize(panels.expandSouth);
        } else {
            setSouthSize(panels.south);
        }

        // set east panel size
        function setEastSize(pp) {
            if (pp.length == 0) return;
            pp.panel('resize', {
                width: pp.panel('option', 'width'),
                height: cpos.height,
                left: cc.width() - pp.panel('option', 'width'),
                top: cpos.top
            });
            cpos.width -= pp.panel('option', 'width');
        }
        if (that._isVisible(panels.expandEast)) {
            setEastSize(panels.expandEast);
        } else {
            setEastSize(panels.east);
        }

        // set west panel size
        function setWestSize(pp) {
            if (pp.length == 0) return;
            pp.panel('resize', {
                width: pp.panel('option', 'width'),
                height: cpos.height,
                left: 0,
                top: cpos.top
            });
            cpos.left += pp.panel('option', 'width');
            cpos.width -= pp.panel('option', 'width');
        }
        if (that._isVisible(panels.expandWest)) {
            setWestSize(panels.expandWest);
        } else {
            setWestSize(panels.west);
        }

        panels.center.panel('resize', cpos);

    },
    _inits: function (container) {
        var cc = $(container);
        var that = this;
        if (cc[0].tagName == 'BODY') {
            $('html').css({
                height: '100%',
                overflow: 'hidden'
            });
            $('body').css({
                height: '100%',
                overflow: 'hidden',
                border: 'none'
            });
        }
        cc.addClass('layout');
        cc.css({
            margin: 0,
            padding: 0
        });


        function createPanel(dir) {
            var pp = $('>div[region=' + dir + ']', container).addClass('layout-body');

            var toolCls = null;
            if (dir == 'north') {
                toolCls = 'layout-button-up';
            } else if (dir == 'south') {
                toolCls = 'layout-button-down';
            } else if (dir == 'east') {
                toolCls = 'layout-button-right';
            } else if (dir == 'west') {
                toolCls = 'layout-button-left';
            }

            var cls = 'layout-panel layout-panel-' + dir;
            if (pp.attr('split') == 'true') {
                cls += ' layout-split-' + dir;
            }
            pp.panel({
                cls: cls,
                doSize: false,
                border: (pp.attr('border') == 'false' ? false : true),
                tools: [{
                    iconCls: toolCls
                }]
            });

            if (pp.attr('split') == 'true') {
                var panel = pp.panel('panel');

                var handles = '';
                if (dir == 'north') handles = 's';
                if (dir == 'south') handles = 'n';
                if (dir == 'east') handles = 'w';
                if (dir == 'west') handles = 'e';

                panel.resizable({
                    handles: handles,
                    helper: "resizable-helper",
                    stop: function (event, ui) {
                        var opts = pp.panel('getOptions');
                        opts.width = ui.helper.outerWidth();
                        opts.height = ui.helper.outerHeight();
                        opts.left = panel.css('left');
                        opts.top = panel.css('top');
                        pp.panel('resize', opts);
                        that._setSize(container);

                    }
                });
            }
            return pp;
        }


        var panels = {
            center: createPanel('center')
        };

        panels.north = createPanel('north');
        panels.south = createPanel('south');
        panels.east = createPanel('east');
        panels.west = createPanel('west');

        $(container).bind('_resize', function () {
        	
            var opts = $.data(container, 'layout').options;
            if (opts.fit == true) {
               that._setSize(container);
            }
            return false;
        });
        $(window).resize(function () {
            //that._setSize(container);
        });

        return panels;
    },
    _bindEvents: function (container) {
        var panels = $.data(container, 'layout').panels;
        var that = this;
        var cc = $(container);

        function createExpandPanel(dir) {
            var icon;
            if (dir == 'east') icon = 'layout-button-left'
            else if (dir == 'west') icon = 'layout-button-right'
            else if (dir == 'north') icon = 'layout-button-down'
            else if (dir == 'south') icon = 'layout-button-up';

            return $('<div></div>').appendTo(cc).panel({
                cls: 'layout-expand',
                title: '&nbsp;',
                closed: true,
                doSize: false,
                tools: [{ iconCls: icon}]
            });
        }

        // bind east panel events
        if (panels.east.length) {
            panels.east.panel('panel').bind('mouseover', 'east', collapsePanel);
            panels.east.panel('header').find('.layout-button-right').click(function () {
                panels.center.panel('resize', {
                    width: panels.center.panel('getOptions').width + panels.east.panel('getOptions').width - 28
                });
                panels.east.panel('panel').animate({ left: cc.width() }, function () {
                    panels.east.panel('close');
                    panels.expandEast.panel('open').panel('resize', {
                        top: panels.east.panel('getOptions').top,
                        left: cc.width() - 28,
                        width: 28,
                        height: panels.east.panel('getOptions').height
                    });
                });
                if (!panels.expandEast) {
                    panels.expandEast = createExpandPanel('east');
                    panels.expandEast.panel('panel').click(function () {
                        panels.east.panel('open').panel('resize', { left: cc.width() });
                        panels.east.panel('panel').animate({
                            left: cc.width() - panels.east.panel('getOptions').width
                        });
                        return false;
                    }).hover(
						function () { $(this).addClass('layout-expand-over'); },
						function () { $(this).removeClass('layout-expand-over'); }
					);
                    panels.expandEast.panel('header').find('.layout-button-left').click(function () {
                        panels.expandEast.panel('close');
                        panels.east.panel('panel').stop(true, true);
                        panels.east.panel('open').panel('resize', { left: cc.width() });
                        panels.east.panel('panel').animate({
                            left: cc.width() - panels.east.panel('getOptions').width
                        }, function () {
                            that._setSize(container);
                        });
                        return false;
                    });
                }
                return false;
            });
        }

        // bind west panel events
        if (panels.west.length) {
            panels.west.panel('panel').bind('mouseover', 'west', collapsePanel);
            panels.west.panel('header').find('.layout-button-left').click(function () {
                panels.center.panel('resize', {
                    width: panels.center.panel('getOptions').width + panels.west.panel('getOptions').width - 28,
                    left: 28
                });
                panels.west.panel('panel').animate({ left: -panels.west.panel('getOptions').width }, function () {
                    panels.west.panel('close');
                    panels.expandWest.panel('open').panel('resize', {
                        top: panels.west.panel('getOptions').top,
                        left: 0,
                        width: 28,
                        height: panels.west.panel('getOptions').height
                    });
                });
                if (!panels.expandWest) {
                    panels.expandWest = createExpandPanel('west');
                    panels.expandWest.panel('panel').click(function () {
                        panels.west.panel('open').panel('resize', { left: -panels.west.panel('getOptions').width });
                        panels.west.panel('panel').animate({
                            left: 0
                        });
                        return false;
                    }).hover(
						function () { $(this).addClass('layout-expand-over'); },
						function () { $(this).removeClass('layout-expand-over'); }
					);
                    panels.expandWest.panel('header').find('.layout-button-right').click(function () {
                        panels.expandWest.panel('close');
                        panels.west.panel('panel').stop(true, true);
                        panels.west.panel('open').panel('resize', { left: -panels.west.panel('getOptions').width });
                        panels.west.panel('panel').animate({
                            left: 0
                        }, function () {
                            that._setSize(container);
                        });
                        return false;
                    });
                }
                return false;
            });
        }

        // bind north panel events
        if (panels.north.length) {
            panels.north.panel('panel').bind('mouseover', 'north', collapsePanel);
            panels.north.panel('header').find('.layout-button-up').click(function () {
                var hh = cc.height() - 28;
                if (that._isVisible(panels.expandSouth)) {
                    hh -= panels.expandSouth.panel('getOptions').height;
                } else if (that._isVisible(panels.south)) {
                    hh -= panels.south.panel('getOptions').height;
                }
                panels.center.panel('resize', { top: 28, height: hh });
                panels.east.panel('resize', { top: 28, height: hh });
                panels.west.panel('resize', { top: 28, height: hh });
                if (that._isVisible(panels.expandEast)) panels.expandEast.panel('resize', { top: 28, height: hh });
                if (that._isVisible(panels.expandWest)) panels.expandWest.panel('resize', { top: 28, height: hh });

                panels.north.panel('panel').animate({ top: -panels.north.panel('getOptions').height }, function () {
                    panels.north.panel('close');
                    panels.expandNorth.panel('open').panel('resize', {
                        top: 0,
                        left: 0,
                        width: cc.width(),
                        height: 28
                    });
                });
                if (!panels.expandNorth) {
                    panels.expandNorth = createExpandPanel('north');
                    panels.expandNorth.panel('panel').click(function () {
                        panels.north.panel('open').panel('resize', { top: -panels.north.panel('getOptions').height });
                        panels.north.panel('panel').animate({ top: 0 });
                        return false;
                    }).hover(
						function () { $(this).addClass('layout-expand-over'); },
						function () { $(this).removeClass('layout-expand-over'); }
					);
                    panels.expandNorth.panel('header').find('.icon-arrow-down').click(function () {
                        panels.expandNorth.panel('close');
                        panels.north.panel('panel').stop(true, true);
                        panels.north.panel('open').panel('resize', { top: -panels.north.panel('getOptions').height });
                        panels.north.panel('panel').animate({ top: 0 }, function () {
                            that._setSize(container);
                        });
                        return false;
                    });
                }
                return false;
            });
        }

        // bind south panel events
        if (panels.south.length) {
            panels.south.panel('panel').bind('mouseover', 'south', collapsePanel);
            panels.south.panel('header').find('.layout-button-down').click(function () {
                var hh = cc.height() - 28;
                if (that._isVisible(panels.expandNorth)) {
                    hh -= panels.expandNorth.panel('getOptions').height;
                } else if (that._isVisible(panels.north)) {
                    hh -= panels.north.panel('getOptions').height;
                }
                panels.center.panel('resize', { height: hh });
                panels.east.panel('resize', { height: hh });
                panels.west.panel('resize', { height: hh });
                if (that._isVisible(panels.expandEast)) panels.expandEast.panel('resize', { height: hh });
                if (that._isVisible(panels.expandWest)) panels.expandWest.panel('resize', { height: hh });

                panels.south.panel('panel').animate({ top: cc.height() }, function () {
                    panels.south.panel('close');
                    panels.expandSouth.panel('open').panel('resize', {
                        top: cc.height() - 28,
                        left: 0,
                        width: cc.width(),
                        height: 28
                    });
                });
                if (!panels.expandSouth) {
                    panels.expandSouth = createExpandPanel('south');
                    panels.expandSouth.panel('panel').click(function () {
                        panels.south.panel('open').panel('resize', { top: cc.height() });
                        panels.south.panel('panel').animate({ top: cc.height() - panels.south.panel('getOptions').height });
                        return false;
                    }).hover(
						function () { $(this).addClass('layout-expand-over'); },
						function () { $(this).removeClass('layout-expand-over'); }
					);
                    panels.expandSouth.panel('header').find('.icon-arrow-up').click(function () {
                        panels.expandSouth.panel('close');
                        panels.south.panel('panel').stop(true, true);
                        panels.south.panel('open').panel('resize', { top: cc.height() });
                        panels.south.panel('panel').animate({ top: cc.height() - panels.south.panel('getOptions').height }, function () {
                            that._setSize(container);
                        });
                        return false;
                    });
                }
                return false;
            });
        }

        panels.center.panel('panel').bind('mouseover', 'center', collapsePanel);

        function collapsePanel(e) {

            if (e.data != 'east' && that._isVisible(panels.east) && that._isVisible(panels.expandEast)) {
                panels.east.panel('panel').animate({ left: cc.width() }, function () {
                    panels.east.panel('close');
                });
            }
            if (e.data != 'west' && that._isVisible(panels.west) && that._isVisible(panels.expandWest)) {
                panels.west.panel('panel').animate({ left: -panels.west.panel('getOptions').width }, function () {
                    panels.west.panel('close');
                });
            }
            if (e.data != 'north' && that._isVisible(panels.north) && that._isVisible(panels.expandNorth)) {
                panels.north.panel('panel').animate({ top: -panels.north.panel('getOptions').height }, function () {
                    panels.north.panel('close');
                });
            }
            if (e.data != 'south' && that._isVisible(panels.south) && that._isVisible(panels.expandSouth)) {
                panels.south.panel('panel').animate({ top: cc.height() }, function () {
                    panels.south.panel('close');
                });
            }
            return false;
        }

    },
    _isVisible: function (pp) {
        if (!pp) return false;
        if (pp.length) {
            return pp.panel('panel').is(':visible');
        } else {
            return false;
        }

    },
    collapse: function () {
    },
    destory: function () {

    }
});

} (jQuery));