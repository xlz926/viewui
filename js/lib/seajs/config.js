seajs.config({
  // Enable plugins
  plugins: ['shim'],

  // Configure alias
  alias: {
    'jQuery': {
      src: 'lib/jquery/jquery.min.js',
      exports: 'jQuery'
    },
    'jQuery.ui':{
    	src:'lib/jui/jquery-ui-1.9.2.custom.js',
    	deps:['jQuery']
    },
    'ckeditor':{
    	src:'lib/ckeditor/ckeditor.js'
    } ,
    'jQuery.metadata':{
    	src:'lib/validate/jquery.matadata.min.js',
    	deps:['jQuery.metadata']
    },
    'jQuery.validate':{
    	src:'lib/validate/jquery.validate.min.js',
    	deps:['jQuery.metadata']
    },
    'jQuery.ztree':{
    	src:'lib/tree/jquery.ztree.all-3.5.min.js',
    	exports:'ztree'
    },
    'pousheng.ui':{
    	src:'pousheng/pousheng.ui.js',
    	deps:['jQuery.ui']
    }
  },
  charset:'utf-8',
  base:jsPath,
});