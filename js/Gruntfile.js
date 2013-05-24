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
		return "src/themes/default/" + component + ".css";
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
		return "src/ui/viewui." + file + ".js";
	});
   

  
  
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat:{
        	css:{
        		src: cssFiles,
			    dest: "src/themes/default/pousheng.css"
        	},
        	ui:{
        		src:poushengFile,
        		dest: "src/view.ui.js"
        	}
        },
        uglify:{
        	options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/jQuery.view.ui.js',
                dest: 'dist/jQuery.view.ui.min.js'
            }
        },
        copy: {
			  main: {
			    files: [{
			    	  expand: true,cwd: 'src/',
			    	  src: ["jQuery.view.ui.min.js", "themes/**"],
			    	  dest: 'dist/view'
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