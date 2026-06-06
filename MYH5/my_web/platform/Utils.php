<?php
require_once 'config.php';
require_once 'lwdb.php';
require_once 'channel.php';
require_once 'DanaData.php';

Class Utils
{
    //漫灵验证签名
    public static function RsaVerify($data, $pKey, $sign)  {
        $pKey='-----BEGIN PUBLIC KEY-----'.PHP_EOL
        .chunk_split($pKey, 64, PHP_EOL)
        .'-----END PUBLIC KEY-----'.PHP_EOL;
        
        $res = openssl_get_publickey($pKey);
        $result = (bool)openssl_verify($data, base64_decode($sign), $res,OPENSSL_ALGO_SHA1);
        openssl_free_key($res);
        return $result;
    }
    
    /**
     * https 请求
     * @return mixed
     */
    public static function HttpsPost($url, $data){ // 模拟提交数据函数
        $curl = curl_init(); // 启动一个CURL会话
        curl_setopt($curl, CURLOPT_URL, $url); // 要访问的地址
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0); // 对认证证书来源的检查
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2); // 从证书中检查SSL加密算法是否存在
        curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']); // 模拟用户使用的浏览器
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1); // 使用自动跳转
        curl_setopt($curl, CURLOPT_AUTOREFERER, 1); // 自动设置Referer
        curl_setopt($curl, CURLOPT_POST, 1); // 发送一个常规的Post请求
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data); // Post提交的数据包
        curl_setopt($curl, CURLOPT_TIMEOUT, 3); // 设置超时限制防止死循环
        curl_setopt($curl, CURLOPT_HEADER, 0); // 显示返回的Header区域内容
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1); // 获取的信息以文件流的形式返回
        $tmpInfo = curl_exec($curl); // 执行操作
        if (curl_errno($curl)) {
            echo 'Errno'.curl_error($curl);//捕抓异常
        }
        curl_close($curl); // 关闭CURL会话
        return $tmpInfo; // 返回数据，json格式
    }
    
    //请求HTTP
    public static function Post($url, $data)
    {
        $data = http_build_query($data);
        $opts = array (
            'http' => array(
                'method' => 'POST',
                'header'=> "Content-type: application/x-www-form-urlencoded\r\n"."Content-Length: " .strlen($data),
                'content'=>$data)
        );
        $context = stream_context_create($opts);
        $html = file_get_contents($url, false, $context);
        return $html;
    }
    
    /**
     * 生成服务器充值参数
     * @param String $orderId   订单号
     * @param int $channelId    平台号
     * @param String $serverId  服务器id
     * @param String $productId 产品id
     * @param String $roleId    角色id
     * @param String $roleName  角色名
     * @param int $amount       充值金额，单位：分
     * @param int $gameGold     元宝数量
     * @return array    返回值
     */
    public static function GetPayParam( $orderId, 
                                        $channelId, 
                                        $serverId, 
                                        $productId, 
                                        $roleId, 
                                        $roleName, 
                                        $amount, 
                                        $gameGold,
                                        $doFilter=0)
    {
        $pay_info = array (
            'orderId' => $orderId,
            'channelId'=>$channelId,
            'serverId'=>$serverId,
            'productId'=>$productId,
            'roleId'=>$roleId,
            'roleName'=>$roleName,
            'amount'=>$amount,
            'gameGold'=>$gameGold,
            'doFilter'=>$doFilter
        ); 
        return $pay_info;
    }
    
    /**
     * 生成服务器充值参数
     * @param String $orderId   订单号
     * @param int $channelId    平台号
     * @param String $serverId  服务器id
     * @param String $productId 产品id
     * @param String $roleId    角色id
     * @param String $roleName  角色名
     * @param int $amount       充值金额，单位：分
     * @param int $gameGold     元宝数量
     * @param int $doFilter     是否过滤
     * @return array    返回值
     */
    public static function GetPayParamForGet( $orderId,
        $channelId,
        $serverId,
        $productId,
        $roleId,
        $roleName,
        $amount,
        $gameGold,
        $doFilter=0)
    {
        $pay_info =
            'orderId='.$orderId.
            '&channelId='.$channelId.
            '&serverId='.$serverId.
            '&productId='.$productId.
            '&roleId='.$roleId.
            '&roleName='.$roleName.
            '&amount='.$amount.
            '&gameGold='.$gameGold.
            '&doFilter='.$doFilter;
        return $pay_info;
    }
    
    /**
     * 检测是否为白账号
     * @param $roleId
     * @param $whiteList
     * @return boolean
     */
    public static function CheckWhileAccount($roleId, $whiteList)
    {
        $arr = explode(",", $whiteList);
        foreach($arr as $name)
        {
            if($name == $roleId) return true;
        }
        return false;
    }
    
    public static function getRoleDataDBName($roleId)
    {
        return "role_data".self::getIdx($roleId);
    }
    
    /**
     * 获取一个字符串最后一个字符的ascii码的个位数
     * 用于记录玩家登录信息分表
     * @param $str
     * @return string
     */
    public static function getIdx($str)
    {
        $last = substr($str, -1);
        $var=ord($last);
        return substr($var, -1);
    }
    
    /**
     * 充值上报
     * @param $OrderNumber
     * @param $ServerID
     * @param $ProductID
     * @param $UserID
     * @param $Amount
     * @param $IP
     * @param $ChargeChannel 平台名
     * @param $ChannelName 子渠道
     */
    public static function SendRecharge( $OrderNumber, $ServerID, $ProductID,
                                        $UserID, $Amount, $IP, $ChargeChannel, $ChannelName=null)
   
    {
        self::SendRechargeForWL($OrderNumber, $ServerID, $ProductID, $UserID, $Amount, $IP, $ChargeChannel);
        self::SendRechargeForXY($OrderNumber, $ServerID, $ProductID, $UserID, $Amount, $IP, $ChargeChannel, $ChannelName);
    }
    
    /**
     * 网龙充值上报
     * @param $OrderNumber
     * @param $ServerID
     * @param $ProductID
     * @param $UserID
     * @param $Amount
     * @param $IP
     * @param $ChargeChannel
     */
    public static function SendRechargeForWL( $OrderNumber, $ServerID, $ProductID,
        $UserID, $Amount, $IP, $ChargeChannel)
    {
        $params = array();
        $params[] = "pay";
        $params[] = $OrderNumber;
        $params[] = $ServerID;
        $params[] = $ProductID;
        $params[] = $UserID;
        $params[] = $Amount;
        $params[] = $IP;
        $params[] = $ChargeChannel;
        $params = implode(",", $params);
        
        exec("/usr/bin/php WLApi.php ".$params." > /dev/null 2>&1 &");
    }
    
    /**
     * XY充值上报
     * @param $OrderNumber
     * @param $ServerID
     * @param $ProductID
     * @param $UserID
     * @param $Amount
     * @param $IP
     * @param $ChargeChannel
     */
    public static function SendRechargeForXY( $OrderNumber, $ServerID, $ProductID,
        $UserID, $Amount, $IP, $ChargeChannel, $ChannelName=null)
    {
        $params = array();
        $params[] = "pay";
        $params[] = $OrderNumber;
        $params[] = $ServerID;
        $params[] = $ProductID;
        $params[] = $UserID;
        $params[] = $Amount;
        $params[] = $IP;
        $params[] = $ChargeChannel;
        if(!empty($ChannelName))$params[] = $ChannelName;
        $params = implode(",", $params);
        
        exec("/usr/bin/php XYApi.php ".$params." > /dev/null 2>&1 &");
    }
    
    public static function msectime() {
        list($msec, $sec) = explode(' ', microtime());
        $msectime = (float)sprintf('%.0f', (floatval($msec) + floatval($sec)) * 1000);
    }
}