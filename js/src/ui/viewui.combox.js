/**
*  @author liezun.xiao
* @author liezun.xiao@pousheng.com
* Depends:
*  
*/

;(function($, window, undefined){
	$.widget("ui.combox",{
		options:{
		valueField: 'value',
		textField: 'text',
		url: null,
		data: null
		},
        _create:function(){
          
            var  opts = $.extend({
            selectPrev:this.selectPrev,
            selectNext:this.selectNext,
            selectCurr:this.selectCurr,
            filter:this.filter
            },this.options);
             
            this.element.combo(opts);

            if(this.element.is("select")){
                this.element.data(this.widgetName,this.transformData());
            }
            this.loadData(this.transformData());

        },
         /**
	     * 选择前一项
	     */
        selectPrev:function(){
           var panel = this.element.combo('panel'),
		       values = this.element.combo('getValues');
		    var item = panel.find('div.combobox-item[value=' + values.pop() + ']');
		    if (item.length){
			    var prev = item.prev(':visible');
			    if (prev.length){
				    item = prev;
			    }
		    } else {
			    item = panel.find('div.combobox-item:visible:last');
		    }
		    var value = item.attr('value');
		    this.setValues( [value]);
		
		    if (item.position().top <= 0){
			    var h = panel.scrollTop() + item.position().top;
			    panel.scrollTop(h);
		    } else if (item.position().top + item.outerHeight() > panel.height()){
			    var h = panel.scrollTop() + item.position().top + item.outerHeight() - panel.height();
			    panel.scrollTop(h);
		    }
        },
         /**
	     * 选择后一项
	     */
        selectNext:function(){
       	    var panel = this.element.combo('panel');
		    var values = this.element.combo('getValues');
		    var item = panel.find('div.combobox-item[value=' + values.pop() + ']');
		    if (item.length){
			    var next = item.next(':visible');
			    if (next.length){
				    item = next;
			    }
		    } else {
			    item = panel.find('div.combobox-item:visible:first');
		    }
		    var value = item.attr('value');
		    this.setValues([value]);
		
		    if (item.position().top <= 0){
			    var h = panel.scrollTop() + item.position().top;
			    panel.scrollTop(h);
		    } else if (item.position().top + item.outerHeight() > panel.height()){
			    var h = panel.scrollTop() + item.position().top + item.outerHeight() - panel.height();
			    panel.scrollTop(h);
		    }
       
        },
          /**
	     * 选择当前项
	     */
        selectCurr:function(){
            var panel = this.element.combo('panel');
		    var item = panel.find('div.combobox-item-selected');
		    this.setValues([item.attr('value')]);
		    this.element.combo('hidePanel');
        },
        /**
	     * 选择事件
	     */
        select:function(value){
            var opts = this.options,
                that = this;
		        data = this.element.data(this.widgetName);
		
		    if (opts.multiple){
			    var values = this.element.combo('getValues');
			    for(var i=0; i<values.length; i++){
				    if (values[i] == value) return;
			    }
			    values.push(value);
			    that.setValues( values);
		    } else {
			    that.setValues([value]);
			    this.element.combo('hidePanel');
		    }
		
		    for(var i=0; i<data.length; i++){
			    if (data[i][opts.valueField] == value){
                    that._trigger("onSelect",null,data[i]);
				    return;
			    }
		    }
        },
         /**
	     * 撤销选择
	     */
        unselect:function(value){
        	var opts = this.options;
		    var data = this.element.data(this.widgetName).data;
		    var values = this.element.combo('getValues');
		    for(var i=0; i<values.length; i++){
			    if (values[i] == value){
				    values.splice(i, 1);
				    this.setValues(values);
				    break;
			    }
		    }
		    for(var i=0; i<data.length; i++){
			    if (data[i][opts.valueField] == value){
                    that._trigger("onUnselect",null,data[i]);
				    return;
			    }
		    }
        },
          /**
	     *设置值
	     */
        setValues:function(values, remainText){
            var opts =this.options,
                data = this.element.data(this.widgetName),
                target =this.element;

            var panel = this.element.combo('panel');
		    panel.find('div.combobox-item-selected').removeClass('combobox-item-selected');
		    var vv = [], ss = [];
		    for(var i=0; i<values.length; i++){
			    var v = values[i];
			    var s = v;
			    for(var j=0; j<data.length; j++){
				    if (data[j][opts.valueField] == v){
					    s = data[j][opts.textField];
					    break;
				    }
			    }
			    vv.push(v);
			    ss.push(s);
			    panel.find('div.combobox-item[value=' + v + ']').addClass('combobox-item-selected');
		    }
		
		     target.combo('setValues', vv);
		    if (!remainText){
			    target.combo('setText', ss.join(opts.separator));
		    }


        },
         /**
	     *获取值
	     */
        getValues:function(){

        
        },
        setValue:function(){


        },
        getValue:function(){
        

        
        },
        /**
	     *过滤数据源
	     */
        filter:function(){
        

        },
        transformData:function(){
        	var opts = this.options;
		    var data = [];
		    $('>option', this.element).each(function(){
			    var item = {};
			    item[opts.valueField] = $(this).attr('value') || $(this).html();
			    item[opts.textField] = $(this).html();
			    item['selected'] = $(this).attr('selected');
			    data.push(item);
		    });
		    return data;
        },
        /**
	     *加载数据项
	     */
        loadData:function(data){
            var opts =this.options,
                target =this.element,
                that =this,
		        panel = this.element.combo('panel');
		
		    target.data(this.widgetName,data);
		    var selected = [];
		    panel.empty();	// clear old data
		    for(var i=0; i<data.length; i++){
			    var item = $('<div class="combobox-item"></div>').appendTo(panel);
			    item.attr('value', data[i][opts.valueField]);
			    item.html(data[i][opts.textField]);
			    if (data[i]['selected']){
				    selected.push(data[i][opts.valueField]);
			    }
		    }
		    if (opts.multiple){
			    this.setValues(selected);
		    } else {
			    if (selected.length){
				    this.setValues( [selected[0]]);
			    } else {
				    this.setValues([]);
			    }
		    }
		
            that._trigger("onLoadSuccess",null,data);
		
		    $('.combobox-item', panel).hover(
			    function(){$(this).addClass('combobox-item-hover');},
			    function(){$(this).removeClass('combobox-item-hover');}
		    ).click(function(){
			    var item = $(this);
			    if (opts.multiple){
				    if (item.hasClass('combobox-item-selected')){
					    that.unselect(item.attr('value'));
				    } else {
					    that.select(item.attr('value'));
				    }
			    } else {
				    that.select( item.attr('value'));
			    }
		    });
        },
        /**
	     *获取远程数据请求
	     */
        request:function(url){
            var opts = this.options,
                that =this;
		    if (url){
			    opts.url = url;
		    }
		    if (!opts.url) return;

		    $.ajax({
			    url:opts.url,
			    dataType:'json',
			    success:function(data){
				    that.loadData(data);
			    },
			    error:function(){ 
                    that._trigger("onLoadError",null,arguments)
			    }
		    })
        },
		destroy:function(){
        
        
        }
	});
	
})(jQuery, window, undefined);