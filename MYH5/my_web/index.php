<?php 
$t = time();
?>
<!doctype html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Demon Realm H5</title>
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
<a class="btn btn-primary btn-large theme-login" href="javascript:;">Demon Realm H5</a>
<br>
<br>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">1. Added Mythic Equipment (unlocked at Divine Lv.15).</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">2. Added Cross-Server Eden Divine Realm and Mythic Equipment drops.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">3. Removed the [Settings] button from the chat bar and moved it to the avatar menu.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">4. Legion chat now retains 15 messages.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">5. Reduced HP scaling for Cross-Server Bosses.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">6. Infinity Gauntlet now grants attributes from each gem after Lv.2.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">7. Optimized the Gods & Demons Battlefield mini-map. Click it to view the Boss list.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">8. Optimized gathering nodes in the Gods & Demons Battlefield. Resources now respawn on the hour, and collected rewards are displayed in a popup.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">9. Infinity Gauntlet skills can now be used in the Gods & Demons Battlefield.</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">10. Optimized Boss respawn display. Tombstones will refresh into Bosses immediately after respawn.</a>
<br>
<br>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">Mobile Game Source Network - www.syymw.com</a>
<br>
<br>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">→→→→→→→→→→ Click here to begin your Demon Realm adventure! ←←←←←←←←←←</a>
</div>
<div class="theme-popover">
     <div class="theme-poptit">
          <a href="javascript:;" title="Close" class="close">×</a>
          <h3>Demon Realm H5 - www.syymw.com</h3>
     </div>
     <div class="theme-popbod dform">
           <form class="theme-signin" name="loginform" action="" method="post">
                <ol>
                     <li><h4>Please log in first!</h4></li>
                     <li><input autofocus="true" class="ipt" id="username" name="username" placeholder="Game Account" required="" type="text" /></li>
                     <li><input autocomplete="off" class="ipt" id="passwd" name="passwd" placeholder="Game Password" required="" type="password" /></li>
					 <p class="tishi"><span></span></p>
						<p class="button" id="p_login">
						<a href="javascript:;" id="btnlogin" class="btn btn-primary" >Login</a>
						<a href="javascript:;" id="btnreg1" class="btn btn-primary">Register</a>
						</p>
						<p class="button" id="p_reg" style="display: none;"> 
	                    <a href="javascript:;" class="btn btn-primary" id="btnback" style="display: inline-block;">Back to Login</a>
                        <a href="javascript:;" class="btn btn-primary" id="btnreg" >Register & Login</a>
                        </p>
                </ol>
           </form>
     </div>
</div>
<script src="js/app.js?v=<?php echo $t;?>"></script>
<div class="theme-popover-mask"></div>
</body>
</html>