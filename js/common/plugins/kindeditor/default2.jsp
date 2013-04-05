<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<html>
<head>
		<meta charset="utf-8" />
		<title>Default Examples</title>
		<style>
			form {
				margin: 0;
			}
			textarea {
				display: block;
			}
		</style>
		
		<form>
		<textarea name="content" style="width:800px;height:400px;"></textarea>
			
		</form>

		<script charset="utf-8" src="kindeditor-min.js" ></script>
		<script charset="utf-8" src="lang/zh_CN.js"></script>
		
		<script charset="utf-8" src="../../codeHtml.js" ></script>
		
		<script>
		
			
			var editor;
			var K = KindEditor;
		
		///	KindEditor.ready(function(K) {
				K.options.filterMode = false;

				editor = K.create('textarea[name="content"]', {
					allowFileManager : true
				});
				K('input[name=getHtml]').click(function(e) {
					alert(editor.html());
				});
				K('input[name=isEmpty]').click(function(e) {
					alert(editor.isEmpty());
				});
				K('input[name=getText]').click(function(e) {
					alert(editor.text());
				});
				K('input[name=selectedHtml]').click(function(e) {
					alert(editor.selectedHtml());
				});
				K('input[name=setHtml]').click(function(e) {
					editor.html('<h3>Hello KindEditor</h3>');
				});
				K('input[name=setText]').click(function(e) {
					editor.text('<h3>Hello KindEditor</h3>');
				});
				K('input[name=insertHtml]').click(function(e) {
					editor.insertHtml('<strong>插入HTML</strong>');
				});
				K('input[name=appendHtml]').click(function(e) {
					editor.appendHtml('<strong>添加HTML</strong>');
				});
				K('input[name=clear]').click(function(e) {
					editor.html('');
				});
		//	});

				editor.appendHtml(top.parentInput.value.decodeHtml());
				var tempValue = editor.text();
				function putHTML()
				{
					if(tempValue != editor.text())
					{
						top.parentInput.value = editor.html().decodeHtml();
						//tempValue = editor.text();
					}
					
				}
				setInterval("putHTML()",100);	

		</script>
	</head>
<body>

<script type="text/javascript">
$(document).ready(function(){
	$(".ke-content").html();
});

</script>
	


</body>
</html>