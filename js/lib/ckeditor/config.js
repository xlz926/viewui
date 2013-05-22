/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights
 *          reserved. For licensing, see LICENSE.html or
 *          http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.toolbar = 'Full';
	config.toolbar_Full = [

	[ 'Source', '-', 'NewPage', 'Preview', '-', 'Templates' ],

	[ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Print', 'SpellChecker', 'Scayt' ],

	[ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ],

	[ 'Link', 'Unlink', 'Anchor' ],

	[ 'Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar' ],

	'/',

	[ 'Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript' ],

	[ 'Styles', 'Format', 'Font', 'FontSize' ],

	[ 'TextColor', 'BGColor' ]

	];
	// 工具栏是否可以被收缩
	config.toolbarCanCollapse = true;
	config.templates = 'cl,zc,jk,ea,jj,rs';
	config.templates_files = [ 
           CKEDITOR.getUrl('plugins/templates/templates/cl/cl.js'), 
           CKEDITOR.getUrl('plugins/templates/templates/zc/zc.js'), 
           CKEDITOR.getUrl('plugins/templates/templates/jk/jk.js'), 
           CKEDITOR.getUrl('plugins/templates/templates/ea/ea.js'),
		   CKEDITOR.getUrl('plugins/templates/templates/jj/jj.js'), 
		   CKEDITOR.getUrl('plugins/templates/templates/rs/rs.js') 
	];
	config.templates_replaceContent = true;

	config.height = 300;
	config.entities_greek = false;
	config.entities = true;

};
