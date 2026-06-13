
var checknum = '';
var uid = '';
var qu = $('#qu').val();
$('#checknum').change(function() {
    checknum = $(this).val();
});
  $('#uid').change(function(){
	  uid=$.trim($(this).val());
  });
  $('#qu').change(function(){
	  qu=$.trim($(this).val());
  });
$(".selectpicker").selectpicker({
    header:'请选择',
    showIcon:true,
    multipleSeparator:'#',
    maxOptions:4,
    maxOptionsText:'最多选4个',
});

/**
角色充值
*/
function chargebtn() {
	if (checknum == '') {
        layer.msg('请输入GM校验码');
        return false;
    }
	  if(uid==''){
		  layer.msg('角色ID不能为空');
		  return false;
	  }
	  var chargenum=$('#chargenum').val();
	  if(chargenum==''){
		  layer.msg('充值数量不能为空');
		  return false;
	  }	 
	$.ajaxSetup({
		contentType: "application/x-www-form-urlencoded; charset=utf-8"
	});
	$.post("user/gmquery.php", {
		type:'charge',uid:uid,num:chargenum,qu:qu,checknum:checknum		
	},
	function(data) {
		//console.log('data',data);
		layer.msg(data);
		
	});
}
/**
发道具邮件
*/
function send_mail() {
	if (checknum == '') {
        layer.msg('请输入GM校验码');
        return false;
    }
	  if(uid==''){
		  layer.msg('角色ID不能为空');
		  return false;
	  }
	  var mailid=$('#mailid').val();
	  if(mailid==''){
		  layer.msg('请选择物品');
		  return false;
	  }
	  var mailnum=$('#mailnum').val();
	  if(mailnum=='' || isNaN(mailnum)){
		  layer.msg('数量不能为空');
		  return false;
	  }
	  if(mailnum<1 || mailnum>2000000000){
		  layer.msg('道具数量范围:1-20亿');
		  return false;
	  }
	$.ajaxSetup({
		contentType: "application/x-www-form-urlencoded; charset=utf-8"
	});
	$.post("user/gmquery.php", {
		type:'daoju',uid:uid,item:mailid,num:mailnum,qu:qu,checknum:checknum		
	},
	function(data) {
		layer.msg(data);
		
	});
	
}
function shuoming() {
    layer.open({
    content: '后台说明：</br>1.后台充值比列是1:100 </br> 2.邮件数量不宜过多，请注意 </br> 3.金币数量可以多发一些没问题的，最高2亿一次'
    ,btn: '我知道了'
  });
}