<?php
/**
* @date: 2019年6月22日 下午6:14:23
* @author: 作者QQ：1242821087
* @作者: 欢乐逗
* @说明: 删除以及更改版权者死全家
*/

include "config/config.php";
$paydata = explode("_",getstr('paydata'));
$roleId = $paydata[1]; //账号ID
$serverId = $paydata[2]; //区
$pname = $paydata[5]; //平台ID
$goodsId = $paydata[0]; //物品id
$username = $paydata[3]; //角色ID
$money = $paydata[4]; //金额
?>
<!DOCTYPE html>
<html lang="en">
<head>
<!--QQ:1242821087-->
	<meta charset="UTF-8">
	<title>Payment Page - MoYu H5</title>
	<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta content="black" name="apple-mobile-web-app-status-bar-style">
    <meta content="telephone=no" name="format-detection">
	<link rel="stylesheet" href="css/weui.css">
	<link rel="stylesheet" href="css/weuix.css">
</head>
<style type="text/css">
.page-bg{max-width:480px;}
.hongse{color:#F00}    
.lanse{color:#0000FF}
</style>
<body ontouchstart class="page-bg center">

    <form action="payto.php" method="post">
    <div class="weui-cells weui-cells_form">
  		<div class="weui-cell">
		    <div class="weui-cell__hd"><label class="weui-label">Account ID:</label></div>
		    <div class="weui-cell__bd">
		      <strong class="lanse"><?php echo $roleId;?></strong>
		  	</div>
	    </div>
	  <div class="weui-cell">
		    <div class="weui-cell__hd"><label class="weui-label">Character Name:</label></div>
		    <div class="weui-cell__bd">
		      <strong class="lanse"><?php echo $username;?></strong>
		  	</div>
	    </div>
      <div class="weui-cell weui-cells_form">
        <div class="weui-cell__hd"><label class="weui-label">Game Zone:</label></div>
        <div class="weui-cell__bd">
        <strong class="lanse">MoYu Zone <?php echo $serverId;?></strong>  
        </div>
      </div>
	  <div class="weui-cell weui-cells_form">
        <div class="weui-cell__hd"><label class="weui-label">Product Name:</label></div>
        <div class="weui-cell__bd">
        <strong class="lanse"><?php echo $pname;?></strong>  
        </div>
      </div>
      <div class="weui-cell weui-cells_form">
        <div class="weui-cell__hd"><label class="weui-label">Recharge Amount:</label></div>
        <div class="weui-cell__bd">
        <strong class="hongse"><?php echo $money;?>.00</strong>  
        </div>
      </div>
      
      <div class="weui-cell weui-cell_select weui-cell_select-after">
        <div class="weui-cell__hd"><label class="weui-label">Payment Method:</label></div>
        <div class="weui-cell__bd">
          <select class="weui-select" name="paytype">
            <option selected="" value="2">Alipay</option>
            <option value="4">WeChat Pay</option>
          </select>
        </div>
      </div>
		<input type="hidden" value="<?php echo $roleId;?>" name="roleId" />
		<input type="hidden" value="<?php echo $serverId;?>" name="serverId" />
		<input type="hidden" value="<?php echo $goodsId;?>" name="goodsId" />
		<input type="hidden" value="<?php echo $money;?>" name="money" />
        <button type="submit" class="weui-btn weui-btn_primary">Pay Now</button>
	  
    </form>
</body>
<!--QQ:48196584-->
</html>