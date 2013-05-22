module.exports = function (grunt) {

	
  var libFiles=['html5/html5.js',
                'jsview/jsrender.min.js',
                'draw2D/html5img.js',
                'extend/jquery.form.min.js',
                'extend/jquery.livequery.min.js',
                'jui/jquery-ui.min.js',
                'tree/jquery.ztree.all-3.5.min.js',
                'tree/zTreeStyle/**',
                'less/less.min.js',
                'validate/jquery.matadata.min.js',
                'validate/jquery.validate.min.js',
                'date-time/timepicker.min.js',
                'draw2D/html5img.js',
                'jquery/*',
                'ckeditor/**'
                ];
  
   var	cssFiles = [
      	'panel',
		"datagrid",
		"layout",
		"pagination",
		"tabs",
		"validatebox"
	].map(function( component ) {
		return "pousheng/themes/default/" + component + ".css";
	});
   
   var poushengFile =['util',
                      'panel',
                      'layout',
                      'contextmenu',
                      'tabs',
                      'navTab',
                      'modal',
                      'pagination',
                      'datagrid',
                      'comboxTree',
                      'dropdown',
                       'date',
                       'scrollspy'
                      ].map(function( file ) {
		return "pousheng/ui/pousheng." + file + ".js";
	});
   

  
  
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat:{
        	css:{
        		src: cssFiles,
			    dest: "pousheng/themes/default/pousheng.css"
        	},
        	ui:{
        		src:poushengFile,
        		dest:"pousheng/pousheng.ui.js"
        	}
        },
        uglify:{
        	options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'pousheng/pousheng.ui.js',
                dest: 'dist/pousheng/pousheng.ui.min.js'
            }
        },
        copy: {
			  main: {
			    files: [{
			    	  expand: true,cwd: 'viewui/lib/',
			    	  src: libFiles, 
			    	  dest: 'release/lib',
			    	  filter: 'isFile'},{
			    	  expand: true,cwd: 'pousheng/',
			    	   src: ["pousheng.ui.js","themes/**"],
			    	   dest: 'dist/release/pousheng'
			    	  }
			    ]
			  }
			}
    });

    grunt.loadNpmTasks( "grunt-contrib-concat" );
    grunt.loadNpmTasks( "grunt-contrib-qunit" );
    grunt.loadNpmTasks( "grunt-contrib-csslint" );
    grunt.loadNpmTasks( "grunt-contrib-cssmin" );
    grunt.loadNpmTasks('grunt-contrib-copy');
 


    // Default task(s).
    grunt.registerTask('default', ['copy']);
    grunt.registerTask('build', ['concat','copy']);

};