/** login-v1.5.1 HTML5登录注册页  By 孤单博客-www.gudanba.com */
function funcChina(str) {
    if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
      return false;
    }
    return true;
  }

/** 判断数字和字母 */
function checkUserName(str) {
  if (/^[A-Za-z0-9]+$/.test(str)) {
    return false;
  }
  return true;
}

var mvIsMobile = false;
$(document).ready(function () {

/** 红字提示 */
  if ($(".tishi span").text() == "") $(".tishi").hide();
  else $(".tishi").show();

/** 进入注册页面 */
  $("#btnreg1").click(function () {
    $("#type").val("2");
    $("#forget_pwd").hide();
    $("#username").attr("placeholder", "游戏账号");
    $('#ismobileregister2').show();
    $("#p_login").hide();
    if ($(".p_login_2").length > 0) {
      $(".p_login_2").hide();
    }
    $("#p_reg").show();
  });

/** 返回登录页面 */
  $("#btnback").click(function () {
    mvIsMobile = false;
    $("#username").attr("placeholder", "游戏账号");
    $("#p_login").show();
    if ($(".p_login_2").length > 0) {
      $(".p_login_2").show();
    }
    $("#p_reg").hide();
    $(".tishi").hide();
  });
  var lvTMP = '';
  if (lvTMP == "reg") {
    $("#btnreg1").trigger('click');
  }
  var pt = new RegExp("suid");
  if (pt.test(document.referrer)) {
    $("#btnonekey").hide();
    $("#btnreg1,#btnlogin").css('width', "49%");
  } 
});

/** 获取url参数 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
  
/** 登录请求 */
$("#btnlogin").click(function () {
  //验证表单
  if (checkLoginForm() == false) {
    return false;
  }
  var lvUsername = $("#username").val();
  var lvPWD = $("#passwd").val();
  $.post("api/api.php", {
    "act": "login",
    "username": lvUsername,
    "passwd": lvPWD
  }, function (data) {
    data = JSON.parse(data);
    if (data.code == 0) {
	  $(".tishi").show();
      $(".tishi span").text(data.msg);
    } else {
      window.location.href = "server.php?username=" + data.user + "&token=" + data.token;
    }
  });
});

/** 注册并登录请求 */
$("#btnreg").click(function () {
  //验证表单
  if (checkLoginForm() == false) {
    return false;
  } 
  var lvUsername = $("#username").val();
  var lvPWD = $("#passwd").val();
  $.post("api/api.php", {
    "act": "reg",
    "username": lvUsername,
    "passwd": lvPWD
  }, function (data) {
    //console.log(data);
    data = JSON.parse(data);
    if (data.code == 0) {
	  $(".tishi").show();
      $(".tishi span").text(data.msg);
    } else {
      window.location.href = "server.php?username=" + data.user + "&token=" + data.token;
    }
  });
});

/** 注册表单 */
function checkRegForm() {
    $(".tishi").hide();
    var lvUsername = $("#username").val();
    var lvPWD = $("#passwd").val();
    if (lvUsername == "") {
      $(".tishi").show();
      $(".tishi span").text("没输入名字！");
      return;
    } else if (lvUsername.length < 6) {
      $(".tishi").show();
      $(".tishi span").text("用户名没到6位！");
      return;
    } else if (!funcChina(lvUsername)) {
      $(".tishi").show();
      $(".tishi span").text("用户名不能有汉字！");
      return;
    } else if (checkUserName(lvUsername)) {
      $(".tishi").show();
      $(".tishi span").text("用户名只能字母和数字！");
      return;
    } else if (lvPWD == "" || lvPWD == "输入密码") {
      $(".tishi").show();
      $(".tishi span").text("输入密码！");
      return;
    } else if (lvPWD.length < 6) {
      $(".tishi").show();
      $(".tishi span").text("密码不得小于6位！");
      return;
    }
    $("#frmLogin").submit();
  }

/** 登录表单 */
function checkLoginForm() {
    $(".tishi").hide();
    var lvUsername = $("#username").val();
    var lvPWD = $("#passwd").val();
    SetCookie('cookie_username', lvUsername);
    SetCookie('cookie_password', lvPWD);
    if (lvUsername == "") {
      $(".tishi").show();
      $(".tishi span").text("没输入名字！");
      return false;
    } else if (lvUsername.length < 6) {
      $(".tishi").show();
      $(".tishi span").text("用户名没到6位！");
      return false;
    } else if (!funcChina(lvUsername)) {
      $(".tishi").show();
      $(".tishi span").text("用户名不能有汉字！");
      return false;
    } else if (checkUserName(lvUsername)) {
      $(".tishi").show();
      $(".tishi span").text("用户名只能字母和数字！");
      return false;
    } else if (lvPWD == "" || lvPWD == "输入密码！") {
      $(".tishi").show();
      $(".tishi span").text("输入密码！");
      return false;
    } else if (lvPWD.length < 6) {
      $(".tishi").show();
      $(".tishi span").text("密码不得小于6位！");
      return false;
    } else {
      return true;
    }
  }

/** cookie 设置 */
function SetCookie(name, value) {
    var key = '';
    var Days = 30;
    var exp = new Date();
    var domain = "";
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    if (key == null || key == "") {
      document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ";path=/;domain=" + domain + ";";
    } else {
      var nameValue = GetCookie(name);
      if (nameValue == "") {
        document.cookie = name + "=" + key + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ";path=/;domain=" + domain + ";";
      } else {
        var keyValue = getCookie(name, key);
        if (keyValue != "") {
          nameValue = nameValue.replace(key + "=" + keyValue, key + "=" + encodeURI(value));
          document.cookie = name + "=" + nameValue + ";expires=" + exp.toGMTString() + ";path=/;domain=" + domain + ";";
        } else {
          document.cookie = name + "=" + nameValue + "&" + key + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ";path=/;" + domain + ";";
        }
      }
    }
  }
  
/** cookie 获取 */
function GetCookie(name) {
  var nameValue = "";
  var key = "";
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    nameValue = decodeURI(arr[2]);
  }
  if (key != null && key != "") {
    reg = new RegExp("(^| |&)" + key + "=([^(;|&|=)]*)(&|$)");
    if (arr = nameValue.match(reg)) {
      return decodeURI(arr[2]);
    } else return "";
  } else {
    return nameValue;
  }
}
var cookie_username = GetCookie('cookie_username');
var cookie_password = GetCookie('cookie_password');
if (cookie_username != '') {
  $("#username").val(cookie_username);
}
if (cookie_password != '') {
  $("#passwd").val(cookie_password);
}