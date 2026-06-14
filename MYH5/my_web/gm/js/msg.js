
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
    header:'Please select',
    showIcon:true,
    multipleSeparator:'#',
    maxOptions:4,
    maxOptionsText:'Max 4 selections',
});

/**
Character Recharge
*/
function chargebtn() {
	if (checknum == '') {
        layer.msg('Please enter GM verification code');
        return false;
    }
	  if(uid==''){
		  layer.msg('Character ID cannot be empty');
		  return false;
	  }
	  var chargenum=$('#chargenum').val();
	  if(chargenum==''){
		  layer.msg('Recharge amount cannot be empty');
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
Send Item Mail
*/
function send_mail() {
	if (checknum == '') {
        layer.msg('Please enter GM verification code');
        return false;
    }
	  if(uid==''){
		  layer.msg('Character ID cannot be empty');
		  return false;
	  }
	  var mailid=$('#mailid').val();
	  if(mailid==''){
		  layer.msg('Please select an item');
		  return false;
	  }
	  var mailnum=$('#mailnum').val();
	  if(mailnum=='' || isNaN(mailnum)){
		  layer.msg('Quantity cannot be empty');
		  return false;
	  }
	  if(mailnum<1 || mailnum>2000000000){
		  layer.msg('Item quantity range: 1 - 2,000,000,000');
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
    content: 'GM Panel Notes:</br>1. Recharge ratio is 1:100 </br> 2. Do not send too many mail items at once </br> 3. Gold coins can be sent in larger amounts — max 200,000,000 per send'
    ,btn: 'Got it'
  });
}