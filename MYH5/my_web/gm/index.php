<?php
$t=time();
?>
<!DOCTYPE html>
<html>   
<head>
 <meta charset="utf-8">
 <meta http-equiv="X-UA-Compatible" content="IE=edge">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <title>MoYu H5 GM Panel</title>
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
					 <b>MoYu H5 GM Panel</b>
				</li>				
			</ul>
      <div class="modal-body">
   <div class="form-horizontal" role="form">
                <div class="form-group">
                    <div class="col-sm-10">
                        <input type="password" id="checknum" name="checknum" class="form-control" maxlength="16" value="" placeholder="Enter GM verification code" required>
                    </div>
                </div>
				<div class="form-group">
                    <div class="col-sm-10">
                        <select id="qu" name="qu" class="form-control selectpicker" data-size="5" title="Select Server Zone" required>
                            <option value="1">MoYu Zone 1</option>
                            <option value="2">MoYu Zone 2</option>
                            <option value="3">MoYu Zone 3</option>
                        </select>
                    </div>
                </div>
				<div class="form-group">
                    <div class="col-sm-10">
                        <input type="text" id="uid" name="uid" class="form-control" value="" placeholder="Enter game account" required>
                    </div>
                </div>				
				<div class="form-group">
                    <div class="col-sm-10">					
                   	<select id="chargenum" name="chargenum" class="form-control selectpicker" data-size="5" title="Select Amount" required>
                            <option value="301_10">1,000 Magic Stones</option>
                            <option value="302_20">2,000 Magic Stones</option>
                           	<option value="303_50">5,000 Magic Stones</option>
                            <option value="304_100">10,000 Magic Stones</option>
                            <option value="305_200">20,000 Magic Stones</option>
                      		<option value="306_500">50,000 Magic Stones</option>
                      		<option value="307_1000">100,000 Magic Stones</option>
                      		<option value="308_2000">200,000 Magic Stones</option>
                      		<option value="309_3000">300,000 Magic Stones</option>
                      		<option value="310_5000">500,000 Magic Stones</option>
							<option value="321_38">$38 Double Rebate</option>
							<option value="322_68">$68 Double Rebate</option>
							<option value="323_168">$168 Double Rebate</option>
							<option value="324_368">$368 Double Rebate</option>
							<option value="401_10">$10 First Recharge</option>
							<option value="402_50">$50 First Recharge</option>
							<option value="403_200">$200 First Recharge</option>
							<option value="404_500">$500 First Recharge</option>
							<option value="201_30">Value Monthly Pass</option>
                            <option value="202_100">Divine Privilege</option>
                            <option value="203_100">Monthly Pass + Divine Privilege</option>
                            <option value="204_100">Pass + Privilege Renewal 1 Month</option>
                            <option value="205_150">Pass + Privilege Renewal 1 Season</option>
                            <option value="206_580">Pass + Privilege Renewal 1 Year</option>
							<option value="101_10">$10 Special First Recharge</option>
                            <option value="102_20">$20 Special First Recharge</option>
                            <option value="103_50">$50 Special First Recharge</option>
                            <option value="104_100">$100 Special First Recharge</option>
							<option value="1001_50">50 Soul Limited Recharge</option>
							<option value="1002_80">80 Soul Limited Recharge</option>
							<option value="1003_180">180 Soul Limited Recharge</option>
							<option value="1011_50">50 Star Limited Recharge</option>
							<option value="1012_80">80 Star Limited Recharge</option>
							<option value="1013_180">180 Star Limited Recharge</option>
                        </select>				
                    </div>
                </div>
                <div class="form-group">
                    <div class=" col-sm-10">						
						<button type="submit" class="btn btn-danger btn-block" onclick="chargebtn()">Recharge Character</button>					
                    </div>					
                </div>				
                <div class="form-group">
                    <div class="col-sm-10">
                        <select id="mailid" name="mailid" class="selectpicker show-tick form-control" data-live-search="true" data-size="5" title="Select Item">
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
                        <input type="text" id="mailnum" name="mailnum" class="form-control" min="0" max="9999" value="" placeholder="Quantity" required>
                    </div>
                </div>				
                <div class="form-group">
                    <div class="col-sm-10">						
						<button type="submit" class="btn btn-primary" onclick="send_mail()">Send Mail</button> 						
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