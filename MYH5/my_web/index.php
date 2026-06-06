<?php 
$t = time();
?>
<!doctype html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>MoYu H5</title>
	<link rel="stylesheet" href="css/theme.css" media="all">
	<script src="js/jquery.min.js"></script>
	<script src="js/layer.js"></script>
	<script>
	jQuery(document).ready(function($) {
		$('.theme-login').click(function(){
			$('.theme-popover-mask').fadeIn(100);
			$('.theme-popover').slideDown(200);
		})
		$('.theme-poptit .close').click(function(){
			$('.theme-popover-mask').fadeOut(100);
			$('.theme-popover').slideUp(200);
		})

	})
	</script>
</head>
<body>
<div class="theme-buy">
<a class="btn btn-primary btn-large theme-login" href="javascript:;">MoYu H5</a>
<br>
<br>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">1. Added Mythic equipment (unlocks at God Level 15).</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">2. Added Cross-Server Eden Divine Kingdom with corresponding Mythic equipment drops.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">3. Removed [Settings] button from chat bar, moved to avatar area.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">4. Guild chat now retains the last 15 messages.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">5. Reduced HP scaling for Cross-Server BOSSes.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">6. Infinity Gauntlet now grants gem stat bonuses starting from level 2.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">7. Divine War minimap improved — click the minimap to view the BOSS info list.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">8. Divine War resource nodes improved — now respawn on the hour; a reward popup appears after gathering.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">9. Infinity Gauntlet skills can now be used during combat in the Divine War zone.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">10. Divine War BOSS respawn display improved — gravestones refresh to BOSSes immediately upon respawn.</a>
<br>
<br>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">MoYu H5 Game Server</a>
<br>
<br>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">→→→→→→→→→→ Click here to begin your MoYu adventure! ←←←←←←←←←←</a>
</div>
<div class="theme-popover">
     <div class="theme-poptit">
          <a href="javascript:;" title="关闭" class="close">×</a>
          <h3>MoYu H5</h3>
     </div>
     <div class="theme-popbod dform">
           <form class="theme-signin" name="loginform" action="" method="post">
                <ol>
                     <li><h4>Please log in!</h4></li>
                     <li><input autofocus="true" class="ipt" id="username" name="username" placeholder="Game Account" required="" type="text" /></li>
                     <li><input autocomplete="off" class="ipt" id="passwd" name="passwd" placeholder="Password" required="" type="password" /></li>
					 <p class="tishi"><span></span></p>
						<p class="button" id="p_login">
						<a href="javascript:;" id="btnlogin" class="btn btn-primary" >Login</a>
						<a href="javascript:;" id="btnreg1" class="btn btn-primary">Register</a>
						</p>
						<p class="button" id="p_reg" style="display: none;">
	                    <a href="javascript:;" class="btn btn-primary" id="btnback" style="display: inline-block;">Back to Login</a>
                        <a href="javascript:;" class="btn btn-primary" id="btnreg" >Register &amp; Login</a>
                        </p>
                </ol>
           </form>
     </div>
</div>
<script src="js/app.js?v=<?php echo $t;?>"></script>
<div class="theme-popover-mask"></div>
</body>
</html>