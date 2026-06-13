<?php 
$t = time();
?>
<!doctype html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>魔域H5</title>
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
<a class="btn btn-primary btn-large theme-login" href="javascript:;">魔域H5</a>
<br>
<br>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">1、增加神话装备（神15开启）。</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">2、增加跨服伊甸神国、对应神话装备产出。</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">3、聊天栏【设置】按钮删除，移至头像处。</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">4、军团聊天保留15条。</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">5、对跨服BOSS血量成长进行削减。</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">6、修改无限手套在2级之后，每颗宝石也能加成属性。</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">7、神魔战场小地图优化，点击小地图可查看BOSS信息列表。</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">8、神魔战场采集物优化，刷新改成整点刷新，采集后弹出展示获得道具的界面。</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">9、神魔战场内战斗可使用无限手套技能。</a>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">10、神魔战场内BOSS复活显示优化，BOSS复活后场景内的墓碑会及时刷新成BOSS。</a>
<br>
<br>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">手游源码网-www.syymw.com</a>
<br>
<br>
<br>
<a class="btn btn-primary btn-large theme-login" href="javascript:;">→→→→→→→→→→点击这里开始你的魔域旅行吧←←←←←←←←←←</a>
</div>
<div class="theme-popover">
     <div class="theme-poptit">
          <a href="javascript:;" title="关闭" class="close">×</a>
          <h3>魔域H5-www.syymw.com</h3>
     </div>
     <div class="theme-popbod dform">
           <form class="theme-signin" name="loginform" action="" method="post">
                <ol>
                     <li><h4>请先登陆！</h4></li>
                     <li><input autofocus="true" class="ipt" id="username" name="username" placeholder="游戏账号" required="" type="text" /></li>
                     <li><input autocomplete="off" class="ipt" id="passwd" name="passwd" placeholder="游戏密码" required="" type="password" /></li>
					 <p class="tishi"><span></span></p>
						<p class="button" id="p_login">
						<a href="javascript:;" id="btnlogin" class="btn btn-primary" >登录</a>
						<a href="javascript:;" id="btnreg1" class="btn btn-primary">注册</a>
						</p>
						<p class="button" id="p_reg" style="display: none;"> 
	                    <a href="javascript:;" class="btn btn-primary" id="btnback" style="display: inline-block;">返回登录</a>
                        <a href="javascript:;" class="btn btn-primary" id="btnreg" >注册并登录</a>
                        </p>
                </ol>
           </form>
     </div>
</div>
<script src="js/app.js?v=<?php echo $t;?>"></script>
<div class="theme-popover-mask"></div>
</body>
</html>