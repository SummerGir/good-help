<%@ page contentType="text/html; charset=utf-8"%>
<div id="actionmessage" style="display:none">
<s:actionmessage/>
</div>
<script language="javascript">
var alertMsg = $("#actionmessage").text().trim();
if (alertMsg!=""){
	top.msgShow('系统提示', alertMsg, 'info');
}
</script>
