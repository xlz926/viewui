/**
 * 众所周知页面上的字符内容通常都需要进行HTML转义才能正确显示，尤其对于Input，Textarea提交的内容，更是要进行转义以防止javascript注入攻击。
 	通常的HTML转义主要是针对内容中的"<"，">"，"&"，以及空格、单双引号等。但其实还有很多字符也需要进行转义
 */
//$package("js.lang"); // 没有包管理时，也可简单写成 js = {lang:{}};   
  js = {lang:{}};
  
  js.lang.String = function(){  
  
    this.REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;  
  
   this.REGX_HTML_DECODE = /&\w+;|&#(\d+);/g;  
  
    this.REGX_TRIM = /(^\s*)|(\s*$)/g;  
  
    this.HTML_DECODE = {  
        "&lt;" : "<",   
        "&gt;" : ">",   
        "&amp;" : "&",   
        "&nbsp;": " ",   
        "&quot;": "\"",   
        "&copy;": ""  
  
        // Add more  
    };  
  
    this.encodeHtml = function(s){  
        s = (s != undefined) ? s : this.toString();  
        return (typeof s != "string") ? s :  
            s.replace(this.REGX_HTML_ENCODE,   
                      function($0){  
                          var c = $0.charCodeAt(0), r = ["&#"];  
                          c = (c == 0x20) ? 0xA0 : c;  
                         r.push(c); r.push(";");  
                          return r.join("");  
                      });  
    };  
  
   this.decodeHtml = function(s){  
        var HTML_DECODE = this.HTML_DECODE;  
  
       s = (s != undefined) ? s : this.toString();  
       return (typeof s != "string") ? s :  
            s.replace(this.REGX_HTML_DECODE,  
                      function($0,$1){  
                          var c = HTML_DECODE[$0];  
                          if(c == undefined){  
                              // Maybe is Entity Number  
                              if(!isNaN($1)){  
                                  c = String.fromCharCode(($1==160)?32:$1);  
                              }else{  
                                  c = $0;  
                              }  
                          }  
                          return c;  
                      });  
    };  
  
    this.trim = function(s){  
        s = (s != undefined) ? s : this.toString();  
        return (typeof s != "string") ? s :  
            s.replace(this.REGX_TRIM, "");  
    };  
  
  
    this.hashCode = function(){  
        var hash = this.__hash__, _char;  
       if(hash == undefined || hash == 0){  
            hash = 0;  
            for (var i = 0, len=this.length; i < len; i++) {  
                _char = this.charCodeAt(i);  
                hash = 31*hash + _char;  
                hash = hash & hash; // Convert to 32bit integer  
           }  
            hash = hash & 0x7fffffff;  
        }  
        this.__hash__ = hash;  
  
        return this.__hash__;   
    };  
  
};  
  
//js.lang.String.call(js.lang.String);

//使用js.lang.String.encodeHtml(s)和js.lang.String.decodeHtml(s)。
//还可以直接扩展String的prototype

  js.lang.String.call(String.prototype);
