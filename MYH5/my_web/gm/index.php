<?php
$t=time();
?>
<!DOCTYPE html>
<html>   
<head>
 <meta charset="utf-8">
 <meta http-equiv="X-UA-Compatible" content="IE=edge">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <title>魔域H5后台</title>
 <link rel="stylesheet" href="css/bootstrap.min.css">
 <link rel="stylesheet" href="layui/css/layui.css" media="all">
 <script src="js/jquery-1.11.0.min.js?v=<?php echo $t;?>" type="text/javascript"></script>
 <script type="text/javascript" src="layer/layer.js"></script>
 <script src="js/bootstrap.min.js" type="text/javascript"></script>
 <link rel="stylesheet" href="css/bootstrap-select.min.css">
 <script src="js/bootstrap-select.min.js"></script>
</head>    
<body>
 <div class="container">
   <br>
   <div class="row">
     <div class="container-fluid">
  <div class="modal-dialog">
    <div class="modal-content">
      <ul class="breadcrumb">
				<li>
					 <b>魔域H5后台</b>
				</li>				
			</ul>
      <div class="modal-body">
   <div class="form-horizontal" role="form">
                <div class="form-group">
                    <div class="col-sm-10">
                        <input type="password" id="checknum" name="checknum" class="form-control" maxlength="16" value="" placeholder="输入GM校验码" required>
                    </div>
                </div>
				<div class="form-group">
                    <div class="col-sm-10">
                        <select id="qu" name="qu" class="form-control selectpicker" data-size="5" title="请选择区服" required>
                            <option value="1">魔域1区</option>
                            <option value="2">魔域2区</option>
                            <option value="3">魔域3区</option>
                        </select>
                    </div>
                </div>
				<div class="form-group">
                    <div class="col-sm-10">
                        <input type="text" id="uid" name="uid" class="form-control" value="" placeholder="请输入游戏账号" required>
                    </div>
                </div>				
				<div class="form-group">
                    <div class="col-sm-10">					
                   	<select id="chargenum" name="chargenum" class="form-control selectpicker" data-size="5" title="请选择金额" required>
                            <option value="301_10">1000魔石</option>
                            <option value="302_20">2000魔石</option>
                           	<option value="303_50">5000魔石</option>
                            <option value="304_100">10000魔石</option>
                            <option value="305_200">20000魔石</option>
                      		<option value="306_500">50000魔石</option>
                      		<option value="307_1000">100000魔石</option>
                      		<option value="308_2000">200000魔石</option>
                      		<option value="309_3000">300000魔石</option>
                      		<option value="310_5000">500000魔石</option>
							<option value="321_38">38元双倍返利</option>
							<option value="322_68">68元双倍返利</option>
							<option value="323_168">168元双倍返利</option>
							<option value="324_368">368元双倍返利</option>
							<option value="401_10">10元首充</option>
							<option value="402_50">50元首充</option>
							<option value="403_200">200元首充</option>
							<option value="404_500">500元首充</option>
							<option value="201_30">超值月卡</option>
                            <option value="202_100">神之特权</option>
                            <option value="203_100">超值月卡+神之特权</option>
                            <option value="204_100">月卡+特权续费1月</option>
                            <option value="205_150">月卡+特权续费1季</option>
                            <option value="206_580">月卡+特权续费1年</option>
							<option value="101_10">10元特惠首充</option>							
                            <option value="102_20">20元特惠首充</option>							
                            <option value="103_50">50元特惠首充</option>							
                            <option value="104_100">100元特惠首充</option>    
							<option value="1001_50">50命魂限时充值</option>
							<option value="1002_80">80命魂限时充值</option>
							<option value="1003_180">180命魂限时充值</option>
							<option value="1011_50">50星辰限时充值</option>
							<option value="1012_80">80星辰限时充值</option>
							<option value="1013_180">180星辰限时充值</option>
                        </select>				
                    </div>
                </div>
                <div class="form-group">
                    <div class=" col-sm-10">						
						<button type="submit" class="btn btn-danger btn-block" onclick="chargebtn()">角色充值</button>					
                    </div>					
                </div>				
                <div class="form-group">
                    <div class="col-sm-10">
                        <select id="mailid" name="mailid" class="selectpicker show-tick form-control" data-live-search="true" data-size="5" title="选物品">
                        <?php
						    include 'user/itemgoods.php';
    						foreach($items as $key => $item){
								echo '<option value="'.$key.'">'.$item[1].'</option>';
							}
  						?>						
                        </select>
                    </div>
                </div>
				<div class="form-group">
                    <div class="col-sm-10">					    
                        <input type="text" id="mailnum" name="mailnum" class="form-control" min="0" max="9999" value="" placeholder="数量" required>
                    </div>
                </div>				
                <div class="form-group">
                    <div class="col-sm-10">						
						<button type="submit" class="btn btn-primary" onclick="send_mail()">邮件发送</button> 						
                    </div>					
                </div>				
            </div>
      </div>
    </div>
  </div>
     </div>
   </div>
 </div>
 <script src="js/msg.js?v=<?php echo $t;?>"></script>
</body>
<!--QQ:48196584-->
</html>