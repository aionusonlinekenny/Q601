<?php

namespace kingnetdc;

/**
 * Kingnet kdc PHP sdk v2.0
 */


class DanaData {

    const DANA_API_VERSION = "2";

    const DANA_SDK_TYPE = "php";

    const DANA_SDK_VERSION = "2.0";

    const NAME_PATTERN = "/(^[a-zA-Z_][a-zA-Z\\d_]{0,63}$)/i";

    private $_consumer;

    public function __construct(Consumer $consumer) {
        $this->_consumer = $consumer;
    }

    public function send($message) {
        if (!$message instanceof DanaMessage) {
            throw new DanaDataException("message is not invalid.");
        }
        return $this->_consumer->send($message);
    }

    public function flush() {
        return $this->_consumer->flush();
    }

    public function close() {
        $this->_consumer->close();
    }

}


/**
 * Class DanaMessage
 * @package kingnetdc
 * 数据SDK数据定义
 */
class DanaMessage implements Message {

    /**
     * @var
     * 项目名称, 字符串, 255个字符
     */
    private $project;

    /**
     * @var
     * 设备ID，唯一区分设备的编号
     */
    private $did;

    /**
     * @var
     * 用户ID，唯一区分用户的编号
     */
    private $ouid;

    /**
     * @var
     * 时间的发生的时间戳，默认是当前时间
     */
    private $timestamp;

    /**
     * @var
     * 事件名称, 根据文档需求发送指定的事件名称
     */
    private $event;

    /**
     * @var
     * 事件属性，根据事件的需求发送需要的属性
     */
    private $properties = array();

    /**
     * DanaMessage constructor.
     * @param $project              项目代号
     * @param $event                事件名称
     * @param string $did           唯一去重设备编号
     * @param string $ouid          唯一去重用户编号
     * @param int $timestamp        事件触发时间，默认当前系统时间
     * @throws DanaDataException
     * 初始化事件基本属性
     */
    public function __construct($project, $event, $did = "", $ouid = "", $timestamp = 0) {
        $this->project = $project;
        $this->event = $event;
        $this->did = $did;
        $this->ouid = $ouid;
        if ($timestamp) {
            $this->timestamp = (int) $timestamp;
        } else {
            $this->timestamp = $this->getMicroTime();
        }
        $this->_checkInitFormat($project, $event, $did, $ouid);
        $this->setProperty("_sdk", DanaData::DANA_SDK_TYPE);
        $this->setProperty("_sdkver", DanaData::DANA_SDK_VERSION);
    }

    public function getMicroTime() {
        return ceil(microtime(true) * 1000);
    }

    /**
     * 一次发送多个值
     * @param $arr
     * @throws DanaDataException
     */
    public function setProperties($arr) {
        if (is_array($arr)) {
            foreach($arr as $key => $value) {
                $this->setProperty($key, $value);
            }
        }
    }

    /**
     * @param $key
     * @param $value
     * @throws DanaDataException
     * 设置事件的属性Key, Value
     */
    public function setProperty($key, $value) {
        $this->_checkPropertyFormat($key, $value);
        $this->properties[$key] = $value;
    }

    public function toJson() {
        return json_encode(get_object_vars($this));
    }

    private function _checkInitFormat($project, $event, $did, $ouid) {
        $this->_checkValueFormat(array($project, $event, $did, $ouid));
        if (!$did && !$ouid) {
            throw new DanaDataException("did(设备唯一区分) 或 ouid(用户唯一区分) 不能同时为空");
        }
    }

    private function _checkValueFormat($values) {
        foreach ($values as $value) {
            if (!is_scalar($value) || strlen($value) > 255) {
                throw new DanaDataException("数值不符合规范，数值是简单类型，string, int, float，且长度不能大于255个字符.");
            }
        }
    }

    private function _checkPropertyFormat($key, $value) {
        if (!is_string($key) || !preg_match(DanaData::NAME_PATTERN, $key)) {
            throw new DanaDataException("属性key不符合规范，必须为字符串，且已'a-zA-Z_'开头，最长为64个字符.");
        }
        $this->_checkValueFormat(array($value));
    }
}


/**
 * Class FileConsumer
 * @package kingnetdc
 * 文件写入到每次磁盘
 */
class FileConsumer extends Consumer {


    private $_filePath;
    private $_fileNamePre;

    /**
     * 根据初始化地址, 获取保存的路径和文件名前缀
     * FileConsumer constructor.
     * @param $filePath
     * @param string $fileNamePre
     * @throws DanaDataException
     */
    public function __construct($filePath, $fileNamePre = 'dana') {
        $this->_filePath = $filePath;
        if ($fileNamePre) {
            $this->_fileNamePre = $fileNamePre;
        }
        $this->_init();
    }

    /**
     * 对 FileConsumer 进行初始化检查, 主要检查保存路径
     */
    private function _init() {
        if (!is_dir($this->_filePath) || !is_writable($this->_filePath)) {
            throw new DanaDataException("文件保存路径不可写");
        }
    }

    /**
     * 写入消息到文本消息地址
     * @param $message
     * @return mixed
     * 文件写入到本地磁盘
     */
    public function send($message) {
        $json = $message->toJson();
        $fileName = $this->_filePath . "/" . $this->_fileNamePre . "_" . date("Y-m-d-H") . ".txt";
        file_put_contents($fileName, $json . "\r\n", FILE_APPEND);
    }

}



class BatchConsumer extends Consumer {

    private $_buffers;
    private $_maxBufferSize = 10;
    private $_url;
    private $_requestTimeout = 10;
    private $_isGzip = TRUE;

    private $_topic = "";
    private $_key = "";
    private $_token = "";

    private $_debug = FALSE;

    public function __construct($url, $param = array()) {
        $this->_buffers = array();
        $this->_url = $url;
        $this->_init($param);
    }

    private function _init($param) {
        if (empty($param["topic"]) || empty($param["token"])) {
            throw new DanaDataException("必须要带上参数 topic, token");
        }
        $this->_topic = $param['topic'];
        $this->_token = $param["token"];

        if (isset($param["key"])) {
            $this->_key = $param["key"];
        }
        if (isset($param["isGzip"])) {
            $this->_isGzip = (boolean) $param["isGzip"];
        }
        if (isset($param["requestTimeout"])) {
            $this->_requestTimeout = (int) $param["requestTimeout"];
        }
        if (isset($param["maxBufferSize"])) {
            $this->_maxBufferSize = (int) $param["maxBufferSize"];
        }
        if (isset($param["debug"])) {
            $this->_debug = (boolean) $param["debug"];
        }
    }

    public function send($message) {
        $this->_buffers[] = $message->toJson();
        if (count($this->_buffers) > $this->_maxBufferSize) {
            return $this->flush();
        }
        return TRUE;
    }

    public function flush() {
        $ret = $this->_doPost();
        if ($ret) {
            $this->_buffers = array();
        }
        return $ret;
    }

    public function close() {
        return $this->flush();
    }

    private function _doPost() {
        if (empty($this->_buffers)) {
            return TRUE;
        }
        $headArr = array(
            "Version:".DanaData::DANA_API_VERSION,
            "Topic:".$this->_topic,
            "Key:".$this->_key,
        );
        $postString = "[".implode(",", $this->_buffers)."]";

        $handle = curl_init();
        curl_setopt($handle, CURLOPT_URL, $this->_url);
        curl_setopt($handle, CURLOPT_HEADER, FALSE);
        curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, $this->_requestTimeout);
        curl_setopt($handle, CURLOPT_TIMEOUT, $this->_requestTimeout);
        curl_setopt($handle, CURLOPT_POST, TRUE);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, TRUE);


        if ($this->_isGzip) {
            $postString = base64_encode(gzencode($postString));
            $headArr[] = "Content-Type:application/x-gzip; charset=UTF-8";
        } else {
            $headArr[] = "Content-Type:application/json; charset=UTF-8";
        }

        // 发送的校验是已压缩后的数据作为数据校验
        $headArr[] = "Authorization:".$this->_getAuthorizationString($postString);

        curl_setopt($handle, CURLOPT_HTTPHEADER, $headArr);
        curl_setopt($handle, CURLOPT_POSTFIELDS, $postString);
        $ret = curl_exec($handle);
        if ($this->_debug) {
            var_dump("curl_info", curl_getinfo($handle), "curl_error", curl_error($handle));
            var_dump("head params", $headArr, "postString", $postString, "exec ret", $ret);
        }
        curl_close($handle);
        return ($ret === "0");
    }

    private function _getAuthorizationString($body) {
        return md5($this->_token.$this->_topic.DanaData::DANA_API_VERSION.$this->_token.$body);
    }
}


/**
 * Class DebugConsumer
 * @package kingnetdc
 * 调试模式，直接输出到客户端
 */
class DebugConsumer extends Consumer {

    public function send($message) {
        printf("send message is : %s\n", $message->toJson());
        return TRUE;
    }

}


abstract class Consumer {

    /**
     * @param $message
     * @return mixed
     * 具体的根据需求发送消息
     */
    public abstract function send($message);

    /**
     * @return mixed
     * 发送所有没有发送的消息
     */
    public function flush() {}

    /**
     * @return mixed
     * 关闭 consumer 并释放资源
     */
    public function close() {}

}


/**
 * Class Message
 * @package kingnetdc
 * 定义数据转换方法
 */
interface Message {

    public function toJson();

}


/**
 * Class DanaDataException
 * @package kingnetdc
 * 数据异常
 */
class DanaDataException extends \Exception {}