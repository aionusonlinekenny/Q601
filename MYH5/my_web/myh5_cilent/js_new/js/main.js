var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var shell;
(function (shell) {
    var LoginBaseView = (function (_super) {
        __extends(LoginBaseView, _super);
        function LoginBaseView() {
            return _super.call(this) || this;
        }
        LoginBaseView.prototype.enter = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
        };
        LoginBaseView.prototype.exit = function () { };
        LoginBaseView.prototype.destory = function () {
            this.skinName = null;
            _super.prototype.removeChildren.call(this);
        };
        return LoginBaseView;
    }(eui.Component));
    shell.LoginBaseView = LoginBaseView;
    __reflect(LoginBaseView.prototype, "shell.LoginBaseView");
})(shell || (shell = {}));
var shell;
(function (shell) {
    var LoginServerView = (function (_super) {
        __extends(LoginServerView, _super);
        function LoginServerView() {
            var _this = _super.call(this) || this;
            _this.skinName = "skin.LoginServerViewSkin";
            _this.initialize();
            return _this;
        }
        LoginServerView.prototype.destory = function () {
            this.labBanSu.text = "";
            RES.destroyRes('img_loding_jpg');
            RES.destroyRes('img_selet_sever_back_png');
            RES.destroyRes('btn_login_enter_png');
            RES.destroyRes('btn_gonggao_png');
            _super.prototype.destory.call(this);
        };
        LoginServerView.prototype.initialize = function () {
            this.bntEnter.enabled = false;
            this.labBanSu.textAlign = "center";
            var notice = 'Please play responsibly. Enjoy games in moderation for a healthy lifestyle.';
            this.labBanSu.y = 960;
            if (platform.sdk && this.isBanshu(platform.sdk.type)) {
                notice = 'Please play responsibly. Enjoy games in moderation for a healthy lifestyle.';
                this.labBanSu.y = 930;
            }
            else if (platform.sdk && platform.sdk.type == platform.KY) {
                notice = 'Please play responsibly. Enjoy games in moderation for a healthy lifestyle.';
                this.labBanSu.y = 930;
            }
            else if (platform.sdk && (platform.sdk.type == platform.NN_H5 || platform.sdk.type == platform.NN_IOS || platform.sdk.type == platform.NN_ANDROID || platform.sdk.type == platform.NN_ZF || platform.sdk.type == platform.NN_ZF_H5)) {
                notice = 'Please play responsibly. Enjoy games in moderation for a healthy lifestyle.';
                this.labBanSu.y = 930;
            }
            this.labBanSu.text = notice;
        };
        LoginServerView.prototype.isBanshu = function (type) {
            switch (type) {
                case platform.KY:
                case platform.AWY:
                case platform.DJSHP:
                case platform.DJSHPS:
                case platform.FKYLC:
                case platform.WB:
                    return true;
                default:
                    return false;
            }
        };
        LoginServerView.prototype.enter = function () {
            this.btnNotice.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickNotice, this);
            this.bntEnter.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickHandler, this);
            this.labChange.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openChangeSeverView, this);
            this.bntEnter.enabled = true;
            this.update();
            shell.LoginData.instance.serverList.onSelectedChange(this, this.update);
        };
        LoginServerView.prototype.exit = function () {
            this.bntEnter.enabled = false;
            this.btnNotice.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickNotice, this);
            this.bntEnter.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickHandler, this);
            this.labChange.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openChangeSeverView, this);
        };
        LoginServerView.prototype.clickNotice = function (e) {
            shell.viewManager.openView(shell.NoticeView);
        };
        LoginServerView.prototype.openChangeSeverView = function (e) {
            shell.viewManager.openView(shell.ServerListView);
        };
        LoginServerView.prototype.listCllickHandler = function (e) {
        };
        LoginServerView.prototype.clickHandler = function (e) {
            if (shell.LoginData.instance.serverList.selected.status == 2) {
                shell.tipManager.show("Server under maintenance! Please try again later...", 0xFF3300, 2000);
                return;
            }
            this.bntEnter.enabled = false;
            shell.LoginData.instance.serverList.saveLocalServer();
            shell.viewManager.closeView(shell.LoginServerView);
        };
        LoginServerView.prototype.update = function () {
            var status = Number(shell.LoginData.instance.serverList.selected.status);
            switch (status) {
                case shell.ServerItem.MAINTEN:
                    this.labSeverName.text = shell.LoginData.instance.serverList.selected.name + " (Maintenance)";
                    break;
                case shell.ServerItem.STAYOPEN:
                    this.labSeverName.text = shell.LoginData.instance.serverList.selected.name;
                    break;
                case shell.ServerItem.CLOSE:
                    this.labSeverName.text = shell.LoginData.instance.serverList.selected.name + " (Closed)";
                    break;
                default:
                    this.labSeverName.text = shell.LoginData.instance.serverList.selected.name;
                    break;
            }
            shell.LoginData.instance.reportSelectServer();
        };
        return LoginServerView;
    }(shell.LoginBaseView));
    shell.LoginServerView = LoginServerView;
    __reflect(LoginServerView.prototype, "shell.LoginServerView");
})(shell || (shell = {}));
var shell;
(function (shell) {
    var LayerManager = (function () {
        function LayerManager() {
        }
        Object.defineProperty(LayerManager, "instance", {
            get: function () {
                if (!LayerManager._instance) {
                    LayerManager._instance = new LayerManager();
                }
                return LayerManager._instance;
            },
            enumerable: true,
            configurable: true
        });
        LayerManager.prototype.initialize = function (stage) {
            this._stage = stage;
            this._root = new egret.DisplayObjectContainer();
            stage.addChild(this._root);
            this._sdk = new egret.DisplayObjectContainer();
            stage.addChild(this._sdk);
        };
        Object.defineProperty(LayerManager.prototype, "root", {
            get: function () {
                return this._root;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LayerManager.prototype, "sdk", {
            get: function () {
                return this._sdk;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LayerManager.prototype, "stage", {
            get: function () {
                return this._stage;
            },
            enumerable: true,
            configurable: true
        });
        return LayerManager;
    }());
    shell.LayerManager = LayerManager;
    __reflect(LayerManager.prototype, "shell.LayerManager");
    shell.layerManager = new LayerManager();
    var ViewManager = (function () {
        function ViewManager() {
        }
        ViewManager.prototype.initialize = function (stage) {
            this._stage = stage;
            this._back = new egret.Shape();
            this._back.touchEnabled = true;
            this._views = {};
            this._openList = [];
        };
        ViewManager.prototype.openView = function (viewClazz) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!this._views)
                return;
            var name = egret.getQualifiedClassName(viewClazz);
            if (!this._views[name])
                this._views[name] = new viewClazz();
            var view = this._views[name];
            if (this._openList.indexOf(view) >= 0)
                return;
            if (this._openList.length > 0) {
                shell.layerManager.root.addChild(this._back);
                this.reDrawBack();
            }
            shell.layerManager.root.addChild(view);
            this._openList.push(view);
            (_a = view.enter).call.apply(_a, [view].concat(args));
            this._stage.addEventListener(egret.Event.RESIZE, this.resizeHandler, this);
            this.resizeHandler(null);
            var _a;
        };
        ViewManager.prototype.closeView = function (viewClazz) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var name = egret.getQualifiedClassName(viewClazz);
            if (this._views && this._views[name]) {
                var view = this._views[name];
                var index = this._openList.indexOf(view);
                if (index >= 0)
                    this._openList.splice(index, 1);
                view.exit();
                if (view.parent) {
                    view.parent.removeChild(view);
                }
                if (this._openList.length <= 1) {
                    if (this._back.parent) {
                        this._back.parent.removeChild(this._back);
                    }
                }
                if (!this._openList.length) {
                    this._stage.removeEventListener(egret.Event.RESIZE, this.resizeHandler, this);
                }
                if (this._closeHandlers && this._closeHandlers.length) {
                    for (var i = 0; i < this._closeHandlers.length; i++) {
                        var obj = this._closeHandlers[i];
                        if (obj.name == name) {
                            (_a = obj.method).call.apply(_a, [obj.caller].concat(args));
                            this._closeHandlers.splice(i, 1);
                            return;
                        }
                    }
                }
            }
            var _a;
        };
        ViewManager.prototype.getView = function (viewClazz) {
            var name = egret.getQualifiedClassName(viewClazz);
            if (this._views && this._views[name]) {
                return this._views[name];
            }
            return null;
        };
        ViewManager.prototype.onViewCloseOnce = function (viewClazz, caller, method) {
            if (!this._closeHandlers) {
                this._closeHandlers = [];
            }
            var name = egret.getQualifiedClassName(viewClazz);
            this._closeHandlers.push({ name: name, caller: caller, method: method });
        };
        ViewManager.prototype.reDrawBack = function () {
            this._back.graphics.clear();
            this._back.graphics.beginFill(0x0, 0.8);
            this._back.graphics.drawRect(0, 0, this._stage.stageWidth, this._stage.stageHeight);
        };
        ViewManager.prototype.resizeHandler = function (e) {
            for (var _i = 0, _a = this._openList; _i < _a.length; _i++) {
                var view = _a[_i];
                view.x = this._stage.stageWidth / 2 - view.width / 2;
                view.y = this._stage.stageHeight / 2 - view.height / 2;
            }
            if (this._back.parent) {
                this.reDrawBack();
            }
        };
        ViewManager.prototype.destory = function () {
            this._openList.length = 0;
            this._openList = null;
            for (var key in this._views) {
                var view = this._views[key];
                if (view.parent) {
                    view.parent.removeChild(view);
                }
                view.destory();
            }
            if (this._back.parent) {
                this._back.parent.removeChild(this._back);
            }
            this._stage.removeEventListener(egret.Event.RESIZE, this.resizeHandler, this);
            this._views = null;
        };
        Object.defineProperty(ViewManager.prototype, "stage", {
            get: function () {
                return this._stage;
            },
            enumerable: true,
            configurable: true
        });
        return ViewManager;
    }());
    shell.ViewManager = ViewManager;
    __reflect(ViewManager.prototype, "shell.ViewManager");
    shell.viewManager = new ViewManager();
    var TipManager = (function (_super) {
        __extends(TipManager, _super);
        function TipManager() {
            var _this = _super.call(this) || this;
            _this._back = new egret.Shape();
            _this.addChild(_this._back);
            _this._label = new eui.Label();
            _this._label.size = 20;
            _this.addChild(_this._label);
            return _this;
        }
        // private static _instance: TipManager;
        // public static get instance(): TipManager {
        // 	if (!TipManager._instance) {
        // 		TipManager._instance = new TipManager();
        // 	}
        // 	return TipManager._instance;
        // }
        /**
         * 加载基本资源配置
         */
        TipManager.prototype.initialize = function (stage) {
            this._stage = stage;
        };
        TipManager.prototype.show = function (text, color, time, caller, method) {
            if (time === void 0) { time = 0; }
            if (caller === void 0) { caller = null; }
            if (method === void 0) { method = null; }
            this._label.text = text;
            this._label.textColor = color;
            this._label.validateNow();
            this._label.x = this._label.y = 10;
            this._back.graphics.clear();
            this._back.graphics.beginFill(0, 0.8);
            this._back.graphics.drawRect(0, 0, this._label.width + 20, this._label.height + 20);
            this._back.graphics.endFill();
            shell.layerManager.root.addChild(this);
            this.x = this._stage.stageWidth / 2 - this._back.width / 2;
            this.y = this._stage.stageHeight - 300;
            if (this._timeId) {
                egret.clearTimeout(this._timeId);
                this._timeId = 0;
            }
            if (time) {
                this.tweenIn();
                this._timeId = egret.setTimeout(function () {
                    this.remove();
                    if (method)
                        method.call(caller);
                }, this, time);
            }
        };
        TipManager.prototype.tweenIn = function () {
            this.alpha = 0;
            this._targetY = this.y;
            this.y += 30;
            this._stage.addEventListener(egret.Event.ENTER_FRAME, this.renderHandler, this);
        };
        TipManager.prototype.renderHandler = function (e) {
            this.y += (this._targetY - this.y) / 10;
            this.alpha += (1 - this.alpha) / 10;
            if (Math.abs(this.y - this._targetY) < 1) {
                this._stage.removeEventListener(egret.Event.ENTER_FRAME, this.renderHandler, this);
                this.alpha = 1;
                this.y = this._targetY;
            }
        };
        TipManager.prototype.remove = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
            this._stage.removeEventListener(egret.Event.ENTER_FRAME, this.renderHandler, this);
        };
        return TipManager;
    }(eui.Component));
    shell.TipManager = TipManager;
    __reflect(TipManager.prototype, "shell.TipManager");
    shell.tipManager = new TipManager();
})(shell || (shell = {}));
var shell;
(function (shell) {
    var BaseLoader = (function (_super) {
        __extends(BaseLoader, _super);
        function BaseLoader() {
            var _this = _super.call(this) || this;
            _this._retryCount = 2;
            return _this;
        }
        BaseLoader.prototype.reset = function () {
            this._cururl = '';
            this.removeEventListener(egret.Event.COMPLETE, this.completeHandler, this);
            this.removeEventListener(egret.ProgressEvent.PROGRESS, this.progressHandler, this);
            this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this);
            this._caller = null;
            this._complete = null;
            this._progress = null;
            this.response = null;
            this._retryCount = 2;
            this._times = 0;
        };
        BaseLoader.prototype.start = function (url, caller, complete, progress) {
            if (caller === void 0) { caller = null; }
            if (complete === void 0) { complete = null; }
            if (progress === void 0) { progress = null; }
            var args = [];
            for (var _i = 4; _i < arguments.length; _i++) {
                args[_i - 4] = arguments[_i];
            }
            this._caller = caller;
            this._complete = complete;
            this._progress = progress;
            this._cururl = url;
            this.responseType = egret.HttpResponseType.TEXT;
            this._times = 0;
            this.starLoad();
            return this;
        };
        BaseLoader.prototype.starLoad = function () {
            this.open(this._cururl, egret.HttpMethod.GET);
            this.setRequestHeader("Content-Type", "text/plain");
            this.addEventListener(egret.Event.COMPLETE, this.completeHandler, this);
            if (this._progress)
                this.addEventListener(egret.ProgressEvent.PROGRESS, this.progressHandler, this);
            this.addEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this);
            this.send();
        };
        BaseLoader.prototype.progressHandler = function (e) {
            this._progress.call(this._caller, e.bytesLoaded / e.bytesTotal);
        };
        BaseLoader.prototype.completeHandler = function (e) {
            this.removeEventListener(egret.Event.COMPLETE, this.completeHandler, this);
            this.removeEventListener(egret.ProgressEvent.PROGRESS, this.progressHandler, this);
            this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this);
            this.dataHandler(this.response);
        };
        BaseLoader.prototype.dataHandler = function (response) {
            this._complete.call(this._caller, response);
        };
        BaseLoader.prototype.errorHandler = function (e) {
            console.log('加载失败:', this._cururl);
            if (this._times >= this._retryCount) {
                this.removeEventListener(egret.Event.COMPLETE, this.completeHandler, this);
                this.removeEventListener(egret.ProgressEvent.PROGRESS, this.progressHandler, this);
                this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this);
                this._complete.call(this._caller, false);
                return;
            }
            this._times++;
            console.log('正在重试:', this._cururl);
            this.starLoad();
        };
        return BaseLoader;
    }(egret.HttpRequest));
    __reflect(BaseLoader.prototype, "BaseLoader");
    var JSONLoader = (function (_super) {
        __extends(JSONLoader, _super);
        function JSONLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        JSONLoader.prototype.dataHandler = function (response) {
            this._complete.call(this._caller, JSON.parse(response));
        };
        return JSONLoader;
    }(BaseLoader));
    __reflect(JSONLoader.prototype, "JSONLoader");
    var ScriptLoader = (function () {
        function ScriptLoader() {
        }
        ScriptLoader.prototype.start = function (url, caller, complete) {
            if (caller === void 0) { caller = null; }
            if (complete === void 0) { complete = null; }
            var s = document.createElement('script');
            s.async = false;
            s.src = url;
            s.addEventListener('load', function () {
                s.parentNode.removeChild(s);
                s.removeEventListener('load', arguments.callee, false);
                if (complete)
                    complete.call(caller);
            }, false);
            document.body.appendChild(s);
            return this;
        };
        return ScriptLoader;
    }());
    __reflect(ScriptLoader.prototype, "ScriptLoader");
    shell.textLoader = new BaseLoader();
    shell.jsonLoader = new JSONLoader();
    shell.scriptLoader = new ScriptLoader();
    var ScriptLoaderQueue = (function () {
        function ScriptLoaderQueue() {
        }
        ScriptLoaderQueue.prototype.start = function (list, caller, complete, progress) {
            if (progress === void 0) { progress = null; }
            this._total = list.length;
            this._caller = caller;
            this._complete = complete;
            this._progress = progress;
            this.loadHandler(list);
        };
        ScriptLoaderQueue.prototype.loadHandler = function (list) {
            if (!list.length) {
                var method = this._complete;
                var caller = this._caller;
                this._complete = this._caller = null;
                method.call(caller, true);
                return;
            }
            if (this._progress) {
                this._progress.call(this._caller, (this._total - list.length + 1) / this._total, list.length % 2 ? 0 : 1);
            }
            shell.scriptLoader.start(list.shift(), this, function (status) {
                this.loadHandler(list);
            });
        };
        return ScriptLoaderQueue;
    }());
    __reflect(ScriptLoaderQueue.prototype, "ScriptLoaderQueue");
    var ScriptLoaderGroup = (function () {
        function ScriptLoaderGroup() {
        }
        ScriptLoaderGroup.prototype.start = function (list, thread, caller, complete, progress) {
            if (thread === void 0) { thread = 0; }
            if (progress === void 0) { progress = null; }
            this._list = list;
            this._threadTotal = thread ? thread : list.length;
            this._total = list.length;
            this._cur = 0;
            this._caller = caller;
            this._complete = complete;
            this._progress = progress;
            this._threadCur = 0;
            while (this._threadCur < this._threadTotal) {
                if (!this._list.length)
                    break;
                this.addThread();
                this._threadCur++;
            }
        };
        ScriptLoaderGroup.prototype.addThread = function () {
            new ScriptLoader().start(this._list.shift(), this, this.loadHandler);
        };
        ScriptLoaderGroup.prototype.loadHandler = function () {
            this._cur++;
            this._threadCur--;
            if (this._cur >= this._total) {
                var method = this._complete;
                var caller = this._caller;
                this._complete = this._caller = null;
                method.call(caller, true);
            }
            else {
                this._progress.call(this._caller, this._cur / this._total, this._cur % 2 ? 0 : 1);
                if (this._list.length) {
                    while (this._threadCur < this._threadTotal) {
                        if (!this._list.length)
                            break;
                        this.addThread();
                        this._threadCur++;
                    }
                }
            }
        };
        return ScriptLoaderGroup;
    }());
    __reflect(ScriptLoaderGroup.prototype, "ScriptLoaderGroup");
    shell.scriptLoaderQueue = new ScriptLoaderQueue();
    shell.scriptLoaderGroup = new ScriptLoaderGroup();
})(shell || (shell = {}));
var shell;
(function (shell) {
    var LoginData = (function () {
        function LoginData() {
        }
        Object.defineProperty(LoginData, "instance", {
            get: function () {
                if (!LoginData._instance) {
                    LoginData._instance = new LoginData();
                }
                return LoginData._instance;
            },
            enumerable: true,
            configurable: true
        });
        LoginData.prototype.getAuthURL = function () {
            return (window.config.ssl ? 'http' : 'http') + "://" + window.config.ip + "/" + window.config.platform + "/" + (window.config.superstart ? 'superauth' : 'auth') + ".php";
        };
        LoginData.prototype.getURLParam = function (repType, type, userId) {
            if (type) {
                var token_temp = encodeURIComponent(platform.sdk.token);
                return "channel=" + platform.sdk.channleId + "&appId=" + platform.sdk.appId + "&userId=" + userId + "&time=" + platform.sdk.time + "&token=" + token_temp + "&sign=" + platform.sdk.sign + "&ext=" + platform.sdk.ext + "&r=1";
            }
            return "channel=0&appId=0&userId=" + userId + "&time=0&token=&sign=&ext=&r=1";
        };
        /**用户登录**/
        LoginData.prototype.userLogin = function (roleId, caller, method) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (reslove, reject) {
                            _this._account = roleId;
                            (new HttpRequest()).request(_this.getAuthURL() + "?" + _this.getURLParam('login', platform.sdk ? platform.sdk.type : "", roleId), _this, function (data) {
                                this._authData = data;
                                this._serverList = new ServerList(this._account.toString());
                                if (method)
                                    method.call(caller, data);
                                reslove(data);
                            });
                        })];
                });
            });
        };
        /**获取服务器列表**/
        LoginData.prototype.requestServerList = function (roleId, caller, method) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (reslove, reject) {
                            (new HttpRequest()).request((window.config.ssl ? 'http' : 'http') + "://" + window.config.ip + "/" + window.config.platform + "/getServerInfo.php?roleId=" + roleId + "&platform_type=" + (platform.sdk ? platform.sdk.type : "") + "&channel=" + (platform.sdk ? platform.sdk.channleId : '') + "&r=" + egret.getTimer(), _this, function (data) {
                                if (!window.config.debug && !window.config.superstart && data.newRole == 1) {
                                    this._serverList.selected = new ServerItem(data.serversList[0]);
                                    if (method)
                                        method.call(caller, true);
                                    reslove(true);
                                    return;
                                }
                                var items = [];
                                for (var _i = 0, _a = data.serversList; _i < _a.length; _i++) {
                                    var serverData = _a[_i];
                                    items.push(new ServerItem(serverData));
                                }
                                items.sort(function (a, b) {
                                    return a.lastDate > b.lastDate ? -1 : 1;
                                });
                                var historyGroup = new ServerGroup();
                                historyGroup.name = 'Recent';
                                historyGroup.list = items;
                                this._serverList.addGroup(historyGroup);
                                var testCount = 0;
                                if (data.total_test_count) {
                                    testCount = data.total_test_count;
                                }
                                var groups = [];
                                var n = Math.ceil(data.total_server_count / 50);
                                for (var i = 0; i < n; i++) {
                                    var start = i * 50 + 1;
                                    var end = (i + 1) * 50;
                                    if (end > data.total_server_count)
                                        end = data.total_server_count;
                                    var name = "";
                                    if (testCount > 0) {
                                        if (testCount < end) {
                                            name = data.pre_normal_title + (start - testCount) + "-" + (end - testCount) ;
                                        }
                                        else {
                                            name = data.pre_test_title + start + "-" + end ;
                                        }
                                    }
                                    else {
                                        name = start + "-" + end ;
                                    }
                                    groups.push(new ServerGroup(start, end, name));
                                }
                                groups.reverse();
                                if (groups.length) {
                                    groups[0].isLast = true;
                                }
                                for (var _b = 0, groups_1 = groups; _b < groups_1.length; _b++) {
                                    var group = groups_1[_b];
                                    this._serverList.addGroup(group);
                                }
                                this._serverList.selected = historyGroup.list[0];
                                this._isRequestServerList = true;
                                if (method)
                                    method.call(caller, false);
                                reslove(false);
                            }, egret.URLRequestMethod.GET);
                        })];
                });
            });
        };
        Object.defineProperty(LoginData.prototype, "isRequestServerList", {
            /**是否请求过服务器列表 */
            get: function () {
                return this._isRequestServerList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoginData.prototype, "serverList", {
            get: function () {
                return this._serverList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LoginData.prototype, "authData", {
            get: function () {
                return this._authData;
            },
            enumerable: true,
            configurable: true
        });
        LoginData.prototype.destory = function () {
            this._authData = null;
            this._serverList.destory();
            this._serverList = null;
        };
        LoginData.prototype.reportSelectServer = function () {
            if (!platform.sdk)
                return;
            var dataType = platform.sdk.getDataType(platform.DATA_SELECT_SERVER);
            if (!dataType || !shell.LoginData.instance.serverList.selected)
                return;
            platform.sdk.submitExtraData(dataType, platform.sdk.appId, parseInt(shell.LoginData.instance.serverList.selected.sid), shell.LoginData.instance.serverList.selected.name, "", "", 0, 0, parseInt(((new Date()).getTime() / 1000).toFixed(0)), "", "", -1, -1, 0);
        };
        return LoginData;
    }());
    shell.LoginData = LoginData;
    __reflect(LoginData.prototype, "shell.LoginData");
    var HttpRequest = (function (_super) {
        __extends(HttpRequest, _super);
        function HttpRequest() {
            return _super.call(this) || this;
        }
        HttpRequest.prototype.request = function (url, caller, method, requestMethod, data) {
            if (requestMethod === void 0) { requestMethod = egret.URLRequestMethod.POST; }
            if (data === void 0) { data = null; }
            this._url = url;
            this._completeCaller = caller;
            this._completeMethod = method;
            this.dataFormat = egret.URLLoaderDataFormat.TEXT;
            var urlRequest = new egret.URLRequest(url);
            urlRequest.method = requestMethod;
            if (data) {
                var str = "";
                for (var key in data) {
                    str += (key + '=' + data[key] + '&');
                }
                var variables = new egret.URLVariables(str);
                urlRequest.data = variables;
            }
            this.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
            this.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this);
            this.load(urlRequest);
        };
        HttpRequest.prototype.onLoadComplete = function (e) {
            this.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
            this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this);
            if (!this._completeMethod)
                return;
            this._completeMethod.call(this._completeCaller, JSON.parse(this.data));
            this._completeMethod = this._completeCaller = null;
        };
        HttpRequest.prototype.onLoadError = function (e) {
            this.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
            this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this);
            egret.error("Http错误:", this._url);
        };
        return HttpRequest;
    }(egret.URLLoader));
    shell.HttpRequest = HttpRequest;
    __reflect(HttpRequest.prototype, "shell.HttpRequest");
    var ServerList = (function () {
        function ServerList(acount) {
            this._acount = acount;
            this.readLocalServer();
        }
        ServerList.prototype.readLocalServer = function () {
            var historyCahce;
            try {
                historyCahce = egret.localStorage.getItem(this._acount + '_serverInfo');
            }
            catch (e) {
                historyCahce = "";
            }
            var historyData = historyCahce ? JSON.parse(historyCahce) : null;
            if (historyData) {
                this._cache = new ServerItem(historyData);
            }
        };
        ServerList.prototype.saveLocalServer = function () {
            try {
                egret.localStorage.setItem(this._acount + '_serverInfo', JSON.stringify(this._selected.data));
            }
            catch (e) { }
            ;
            ;
        };
        Object.defineProperty(ServerList.prototype, "names", {
            get: function () {
                var names = [];
                if (this._serverGroupList) {
                    for (var _i = 0, _a = this._serverGroupList; _i < _a.length; _i++) {
                        var group = _a[_i];
                        names.push(group.name);
                    }
                }
                return names;
            },
            enumerable: true,
            configurable: true
        });
        ServerList.prototype.addGroup = function (group) {
            if (!this._serverGroupList)
                this._serverGroupList = [];
            this._serverGroupList.push(group);
        };
        ServerList.prototype.getGroup = function (index) {
            if (this._serverGroupList) {
                if (index < this._serverGroupList.length) {
                    return this._serverGroupList[index];
                }
            }
            return null;
        };
        Object.defineProperty(ServerList.prototype, "selected", {
            get: function () {
                return this._selected;
            },
            set: function (v) {
                if (this._selected != v) {
                    this._selected = v;
                    if (this._selectedChangeMethod) {
                        this._selectedChangeMethod.call(this._selectedChangeCaller, this._selected);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerList.prototype, "cache", {
            get: function () {
                return this._cache;
            },
            enumerable: true,
            configurable: true
        });
        ServerList.prototype.onSelectedChange = function (caller, method) {
            this.offSelectedChange();
            this._selectedChangeCaller = caller;
            this._selectedChangeMethod = method;
        };
        ServerList.prototype.offSelectedChange = function () {
            this._selectedChangeMethod = this._selectedChangeCaller = null;
        };
        ServerList.prototype.destory = function () {
            this.offSelectedChange();
            this._selected = null;
            for (var _i = 0, _a = this._serverGroupList; _i < _a.length; _i++) {
                var group = _a[_i];
                group.destory();
            }
            this._serverGroupList.length = 0;
            this._serverGroupList = null;
        };
        ServerList.prototype.getLoginDataById = function (sid) {
            if (this._selected && this._selected.sid == sid)
                return this._selected;
            for (var _i = 0, _a = this._serverGroupList; _i < _a.length; _i++) {
                var group = _a[_i];
                if (!group.list)
                    continue;
                for (var _b = 0, _c = group.list; _b < _c.length; _b++) {
                    var data = _c[_b];
                    if (data.sid == sid) {
                        return data;
                    }
                }
            }
            return null;
        };
        return ServerList;
    }());
    shell.ServerList = ServerList;
    __reflect(ServerList.prototype, "shell.ServerList");
    var ServerGroup = (function () {
        function ServerGroup(start, end, name) {
            if (start === void 0) { start = 0; }
            if (end === void 0) { end = 0; }
            if (name === void 0) { name = ""; }
            if (name != "") {
                this._name = name;
            }
            else {
                this._name = start + "-" + end ;
            }
            this._start = start;
            this._end = end;
        }
        ServerGroup.prototype.requestList = function (caller, method) {
            (new HttpRequest()).request((window.config.ssl ? 'http' : 'http') + "://" + window.config.ip + "/" + window.config.platform + "/getServerPage.php?start_index=" + this._start + "&end_index=" + this._end + "&roleId=" + (platform.sdk ? platform.sdk.roleId : shell.LoginData.instance.authData.identityId) + "&platform_type=" + (platform.sdk ? platform.sdk.type : "") + "&channel=" + (platform.sdk ? platform.sdk.channleId : '') + "&r=" + egret.getTimer(), this, function (data) {
                this._list = [];
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var serverData = data_1[_i];
                    var item = new ServerItem(serverData);
                    this._list.push(item);
                }
                this._list.reverse();
                if (this._isLast && this._list.length) {
                    this._list[0].isNew = true;
                }
                method.call(caller);
            }, egret.URLRequestMethod.GET);
        };
        Object.defineProperty(ServerGroup.prototype, "isLast", {
            get: function () {
                return this._isLast;
            },
            set: function (v) {
                this._isLast = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerGroup.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (v) {
                this._name = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerGroup.prototype, "list", {
            get: function () {
                return this._list;
            },
            set: function (value) {
                this._list = value;
            },
            enumerable: true,
            configurable: true
        });
        ServerGroup.prototype.getDataById = function (sid) {
            for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                var data = _a[_i];
                if (data.sid == sid) {
                    return data;
                }
            }
            return null;
        };
        ServerGroup.prototype.destory = function () {
            if (this._list) {
                this._list.length = 0;
                this._list = null;
            }
            this._name = null;
        };
        return ServerGroup;
    }());
    shell.ServerGroup = ServerGroup;
    __reflect(ServerGroup.prototype, "shell.ServerGroup");
    var ServerItem = (function () {
        function ServerItem(data) {
            this._data = data;
            this._openDate = new Date(data.openTime);
            if (data.lastLoginTime)
                this._lastDate = new Date(data.lastLoginTime);
            if (data.loginDays)
                this._loginDays = parseInt(data.loginDays);
            if (window.config.superstart) {
                this._data.status = ServerItem.OPEN;
            }
        }
        Object.defineProperty(ServerItem.prototype, "name", {
            /**服务器名称 */
            get: function () {
                return this._data.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerItem.prototype, "openDate", {
            /**开服日期 */
            get: function () {
                return this._openDate;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerItem.prototype, "isNew", {
            get: function () {
                return this._isNew;
            },
            set: function (v) {
                this._isNew = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerItem.prototype, "cdn_url", {
            get: function () {
                return this._data.cdn_url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerItem.prototype, "http_port", {
            get: function () {
                return this._data.http_port;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerItem.prototype, "sid", {
            get: function () {
                return this._data.id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerItem.prototype, "ip", {
            get: function () {
                return this._data.ip;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerItem.prototype, "port", {
            get: function () {
                return this._data.port;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerItem.prototype, "status", {
            get: function () {
                return this._data.status;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerItem.prototype, "version", {
            get: function () {
                return this._data.version;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerItem.prototype, "lastDate", {
            /**最后一次登录的日期 */
            get: function () {
                return this._lastDate;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerItem.prototype, "loginDays", {
            /**累计登录的天数 */
            get: function () {
                return this._loginDays;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerItem.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        /**关闭 */
        ServerItem.CLOSE = 0;
        /**开启 */
        ServerItem.OPEN = 1;
        /**维护中 */
        ServerItem.MAINTEN = 2;
        /**待开 */
        ServerItem.STAYOPEN = 3;
        return ServerItem;
    }());
    shell.ServerItem = ServerItem;
    __reflect(ServerItem.prototype, "shell.ServerItem");
})(shell || (shell = {}));
var shell;
(function (shell) {
    var SelectServerListCell = (function (_super) {
        __extends(SelectServerListCell, _super);
        function SelectServerListCell() {
            var _this = _super.call(this) || this;
            _this.grayFilters = [new egret.ColorMatrixFilter([0.3, 0.6, 0, 0, 0, 0.3, 0.6, 0, 0, 0, 0.3, 0.6, 0, 0, 0, 0, 0, 0, 1, 0])];
            _this.skinName = "skin.SelectServerListCellSkin";
            return _this;
        }
        SelectServerListCell.prototype.getReferenceTexture = function () {
            return [];
        };
        SelectServerListCell.prototype.dataChanged = function () {
            //super.dataChanged();
            if (this.data) {
                var serverData = this.data;
                this.visible = true;
                var status = Number(serverData.status);
                switch (status) {
                    case shell.ServerItem.MAINTEN:
                        this.imgLay.source = "img_login_lay_png";
                        this.btnStatus.filters = this.grayFilters;
                        this.labelName.text = "" + serverData.name + " (Maintenance)";
                        break;
                    case shell.ServerItem.STAYOPEN:
                        this.imgLay.source = "img_login_stayopen_png";
                        this.btnStatus.filters = this.grayFilters;
                        this.labelName.text = "" + serverData.name;
                        break;
                    case shell.ServerItem.CLOSE:
                        this.imgLay.source = null;
                        this.btnStatus.filters = this.grayFilters;
                        this.labelName.text = "" + serverData.name + " (Closed)";
                        break;
                    default:
                        this.imgLay.source = null;
                        this.btnStatus.filters = null;
                        this.labelName.text = "" + serverData.name;
                        break;
                }
                this.imgState.source = serverData.isNew ? "img_login_new_png" : "img_login_hot_png";
            }
            else {
                this.visible = false;
            }
        };
        return SelectServerListCell;
    }(eui.ItemRenderer));
    shell.SelectServerListCell = SelectServerListCell;
    __reflect(SelectServerListCell.prototype, "shell.SelectServerListCell");
})(shell || (shell = {}));
var shell;
(function (shell) {
    var ResourceConfig = (function () {
        function ResourceConfig() {
        }
        ResourceConfig.prototype.initialize = function (version, method, caller) {
            return __awaiter(this, void 0, void 0, function () {
                var manifestName, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            manifestName = version + "/manifest.json";
                            //if((window as any).config.incrementalupdate) manifestName=manifestName+(version?('_'+version):'');
                            _a = this;
                            return [4 /*yield*/, this.loadConfig(manifestName + "?" + window.config.version_assets + window.config.version_assetscript)];
                        case 1:
                            //if((window as any).config.incrementalupdate) manifestName=manifestName+(version?('_'+version):'');
                            _a._manifest = (_b.sent());
                            //if((window as any).config.incrementalupdate) this._resource = await this.loadConfig(`resource${(version?('_'+version):'')}.json?${(window as any).config.version_assets}${(window as any).config.version_resource}`) as string;
                            if (method) {
                                method.call(caller);
                            }
                            return [2 /*return*/, Promise.resolve()];
                    }
                });
            });
        };
        ResourceConfig.prototype.loadConfig = function (name) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (r1, r2) {
                            var xhr = new XMLHttpRequest();
                            xhr.open('GET', "./" + name, true);
                            xhr.addEventListener("load", function () {
                                xhr.removeEventListener('load', arguments.callee, false);
                                r1(JSON.parse(xhr.response.toString()));
                            });
                            xhr.send(null);
                        })];
                });
            });
        };
        Object.defineProperty(ResourceConfig.prototype, "manifest", {
            get: function () {
                return this._manifest;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResourceConfig.prototype, "resource", {
            get: function () {
                return this._resource;
            },
            enumerable: true,
            configurable: true
        });
        return ResourceConfig;
    }());
    shell.ResourceConfig = ResourceConfig;
    __reflect(ResourceConfig.prototype, "shell.ResourceConfig");
    shell.resourceConfig = new ResourceConfig();
})(shell || (shell = {}));
var shell;
(function (shell) {
    var LoginView = (function (_super) {
        __extends(LoginView, _super);
        function LoginView() {
            var _this = _super.call(this) || this;
            _this.skinName = "skin.LoginViewSkin";
            _this.initialize();
            return _this;
        }
        LoginView.prototype.destory = function () {
            RES.destroyRes('create_btn_red_up_png');
            RES.destroyRes('btn_red_png');
            _super.prototype.destory.call(this);
        };
        LoginView.prototype.initialize = function () {
            this.btnLogin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.cllickHandler, this);
        };
        LoginView.prototype.enter = function (id) {
            if (id === void 0) { id = undefined; }
            try {
                this.input.text = id ? id : egret.localStorage.getItem('username');
            }
            catch (e) {
                this.input.text = '';
            }
            // if(!this.input.text){
            // 	var date:Date=new Date()
            // 	this.input.text ='t'+date.getMinutes()+""+date.getSeconds()+""+date.getMilliseconds();
            // }
            // this.cllickHandler(null);
        };
        LoginView.prototype.exit = function () {
        };
        LoginView.prototype.cllickHandler = function (e) {
            if (this.input.text) {
                try {
                    platform.sdk['_roleId'] = this.input.text;
                }
                catch (e) { }
                egret.localStorage.setItem('username', this.input.text);
                shell.viewManager.closeView(shell.LoginView, this.input.text);
            }
        };
        return LoginView;
    }(shell.LoginBaseView));
    shell.LoginView = LoginView;
    __reflect(LoginView.prototype, "shell.LoginView");
})(shell || (shell = {}));
var shell;
(function (shell) {
    var NoticeView = (function (_super) {
        __extends(NoticeView, _super);
        function NoticeView() {
            var _this = _super.call(this) || this;
            _this.skinName = "skin.NoticeViewSkin";
            _this.initialize();
            return _this;
        }
        NoticeView.prototype.initialize = function () {
            this.loadNotice(this, function (content) {
                this.labContent.textFlow = TextFlowMaker.generateTextFlow(content);
            });
        };
        NoticeView.prototype.destory = function () {
            this.labContent.textFlow = null;
            RES.destroyRes('img_offlin_bg_png');
            RES.destroyRes('btn_red_png');
            _super.prototype.destory.call(this);
        };
        NoticeView.prototype.enter = function (data, tab) {
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onClose, this);
        };
        NoticeView.prototype.loadNotice = function (caller, method) {
            if (this.labContent.textFlow && this.labContent.textFlow.length) {
                return;
            }
            var xhr = new XMLHttpRequest();
            var version = window.config.debug ? window.config.version : shell.LoginData.instance.serverList.selected.version;
            xhr.open('GET', version + "/resource/notice/" + (platform.sdk ? platform.sdk.type : 'tw') + ".txt?" + window.config.version_notice, true);
            xhr.addEventListener("load", function () {
                xhr.removeEventListener('load', arguments.callee, false);
                method.call(caller, (xhr.response).toString());
            });
            xhr.send(null);
        };
        NoticeView.prototype.exit = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClose, this);
        };
        NoticeView.prototype.onClose = function (e) {
            shell.viewManager.closeView(NoticeView);
        };
        return NoticeView;
    }(shell.LoginBaseView));
    shell.NoticeView = NoticeView;
    __reflect(NoticeView.prototype, "shell.NoticeView");
    /**
    * Created by Saco on 2015/10/26.
    */
    var TextFlowMaker = (function () {
        function TextFlowMaker() {
        }
        /**
         * "你好|S:18&C:0xffff00&T:带颜色字号|S:50&T:大号字体|C:0x0000ff&T:带色字体";
         * @param sourceText
         * @returns {Array}
         */
        TextFlowMaker.generateTextFlow = function (sourceText) {
            var textArr = sourceText.split("|");
            var result = [];
            for (var i = 0, len = textArr.length; i < len; i++) {
                result.push(this.getSingleTextFlow(textArr[i]));
            }
            return result;
        };
        // %1$s成功锻造出了魔龙装备%2$s，离魔域王者又进了一步！|C:0x34e22c&U:&H:7007&T:我也要
        // this.labContent.textFlow = new Array<egret.ITextElement>({ text: "京东方卡萨丁发了多少" }, {
        // 				text: "这段文字有链接",
        // 				style: { textColor: 0x2B8C25, underline: true, "href": "event:text event triggered" }
        // 			});
        TextFlowMaker.getSingleTextFlow = function (text) {
            var textArr = text.split("&");
            var tempArr;
            var textFlow = { "style": {} };
            for (var i = 0, len = textArr.length; i < len; i++) {
                tempArr = textArr[i].split(":");
                switch (tempArr[0]) {
                    case TextFlowMaker.PROP_TEXT:
                        textFlow.text = tempArr[1];
                        break;
                    case TextFlowMaker.STYLE_SIZE:
                        textFlow.style.size = parseInt(tempArr[1]);
                        break;
                    case TextFlowMaker.STYLE_COLOR:
                        textFlow.style.textColor = parseInt(tempArr[1]);
                        break;
                    case TextFlowMaker.NEW_LINE:
                        textFlow.text = "\n";
                        break;
                    case TextFlowMaker.STYLE_UNDERLINE:
                        textFlow.style.underline = true;
                        break;
                    case TextFlowMaker.STYLE_HREF:
                        textFlow.style.href = "event:" + tempArr[1];
                        break;
                    default:
                        textFlow.text = tempArr[0];
                        break;
                }
            }
            return textFlow;
        };
        TextFlowMaker.htmlParser = function (htmlStr) {
            return this._htmlParserinstance.parser(htmlStr);
        };
        TextFlowMaker.STYLE_COLOR = "C";
        TextFlowMaker.STYLE_SIZE = "S";
        TextFlowMaker.PROP_TEXT = "T";
        TextFlowMaker.NEW_LINE = "N";
        TextFlowMaker.STYLE_UNDERLINE = "U";
        TextFlowMaker.STYLE_HREF = "H";
        TextFlowMaker._htmlParserinstance = new egret.HtmlTextParser();
        return TextFlowMaker;
    }());
    __reflect(TextFlowMaker.prototype, "TextFlowMaker");
})(shell || (shell = {}));
var shell;
(function (shell) {
    var ServerListView = (function (_super) {
        __extends(ServerListView, _super);
        function ServerListView() {
            var _this = _super.call(this) || this;
            _this.skinName = "skin.ServerListViewSkin";
            _this.initialize();
            return _this;
        }
        ServerListView.prototype.destory = function () {
            RES.destroyRes('create_btn_yellow_png');
            RES.destroyRes('img_login_hot_png');
            RES.destroyRes('img_login_lay_png');
            RES.destroyRes('img_login_new_png');
            RES.destroyRes('create_img_title_png');
            RES.destroyRes('img_create_list_back_png');
            RES.destroyRes('create_btn_red_up_png');
            RES.destroyRes('create_btn_red_down_png');
            RES.destroyRes('closetip_png');
            _super.prototype.destory.call(this);
        };
        ServerListView.prototype.initialize = function () {
            this._lastTab = 0;
            this.listSever.itemRenderer = shell.SelectServerListCell;
        };
        ServerListView.prototype.enter = function (data) {
            if (shell.LoginData.instance.isRequestServerList) {
                this.enterHandler();
            }
            else {
                shell.LoginData.instance.requestServerList(platform.sdk ? platform.sdk.roleId : shell.LoginData.instance.authData.identityId, this, function (first) {
                    this.enterHandler();
                });
            }
        };
        ServerListView.prototype.enterHandler = function () {
            this.listSection.dataProvider = new eui.ArrayCollection(shell.LoginData.instance.serverList.names);
            this.listSection.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.listCllickHandler, this);
            this.listSever.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.changServer, this);
            shell.viewManager.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.tapStageHandler, this);
            this.selectedTab(0);
        };
        ServerListView.prototype.exit = function () {
            this.listSection.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.listCllickHandler, this);
            this.listSever.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.changServer, this);
            shell.viewManager.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.tapStageHandler, this);
        };
        ServerListView.prototype.tapStageHandler = function (e) {
            if (this.hitTestPoint(e.stageX, e.stageY)) {
                return;
            }
            shell.viewManager.closeView(shell.ServerListView);
        };
        ServerListView.prototype.selectedTab = function (index) {
            if (index > -1) {
                this.listSection.selectedIndex = index;
                var group = shell.LoginData.instance.serverList.getGroup(index);
                if (group) {
                    if (group.list) {
                        this.listSever.dataProvider = new eui.ArrayCollection(group.list);
                        return;
                    }
                    group.requestList(this, function () {
                        this.listSever.dataProvider = new eui.ArrayCollection(group.list);
                    });
                }
            }
        };
        ServerListView.prototype.listCllickHandler = function (e) {
            //切换选区
            this.selectedTab(this.listSection.selectedIndex);
        };
        ServerListView.prototype.changServer = function (e) {
            shell.LoginData.instance.serverList.selected = this.listSever.selectedItem;
            shell.viewManager.closeView(shell.ServerListView);
        };
        return ServerListView;
    }(shell.LoginBaseView));
    shell.ServerListView = ServerListView;
    __reflect(ServerListView.prototype, "shell.ServerListView");
})(shell || (shell = {}));
var shell;
(function (shell) {
    var ShellLoading = (function (_super) {
        __extends(ShellLoading, _super);
        function ShellLoading() {
            var _this = _super.call(this) || this;
            _this.skinName = "skin.ShellLoadingSkin";
            return _this;
            //this.createChildren();
        }
        ShellLoading.prototype.initialize = function () { };
        ShellLoading.prototype.createChildren = function () {
            this._progressWidth = this.progress.width;
            try {
                this.logo.source = window.config.logourl.replace('shell/', "");
            }
            catch (e) { }
            ;
        };
        Object.defineProperty(ShellLoading, "instance", {
            get: function () {
                if (!ShellLoading._instance) {
                    ShellLoading._instance = new ShellLoading();
                }
                return ShellLoading._instance;
            },
            enumerable: true,
            configurable: true
        });
        ShellLoading.prototype.destory = function () {
            RES.destroyRes('logo.png', true);
            RES.destroyRes('img_lodingProgressSmallBg.png', true);
            RES.destroyRes('img_lodingSmallProgress.png', true);
        };
        /**显示加载页面 */
        ShellLoading.prototype.show = function (title) {
            this.tip.text = title;
            this._progress = 0;
            shell.viewManager.stage.addChild(this);
            shell.viewManager.stage.addEventListener(egret.Event.RESIZE, this.resizeHandler, this);
            this.updateHandler();
            this.resizeHandler(null);
        };
        ShellLoading.prototype.hide = function () {
            shell.viewManager.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.refeshHandler, this);
            shell.viewManager.stage.removeEventListener(egret.Event.RESIZE, this.resizeHandler, this);
            if (this.parent) {
                this.parent.removeChild(this);
            }
        };
        /**更新进度显示 */
        ShellLoading.prototype.updateProgress = function (value) {
            this._progress = value;
            this.updateHandler();
        };
        ShellLoading.prototype.showTip = function (content) {
            this.tip.text = content;
        };
        ShellLoading.prototype.showRefeshState = function () {
            this.tip.text = "Loading failed... Click to refresh and retry...";
            shell.viewManager.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.refeshHandler, this);
        };
        ShellLoading.prototype.updateHandler = function () {
            this.progress.width = (this._progress * this._progressWidth) >> 0;
        };
        ShellLoading.prototype.refeshHandler = function () {
            window.location.reload();
        };
        ShellLoading.prototype.resizeHandler = function (e) {
            var w = shell.viewManager.stage.stageWidth;
            var h = shell.viewManager.stage.stageHeight;
            this.width = w;
            this.height = h;
            this.bar.x = w / 2 - this.bar.width / 2;
            this.progress.x = w / 2 - this._progressWidth / 2;
        };
        return ShellLoading;
    }(shell.LoginBaseView));
    shell.ShellLoading = ShellLoading;
    __reflect(ShellLoading.prototype, "shell.ShellLoading");
})(shell || (shell = {}));
var shell;
(function (shell) {
    var ShellVersionControl = (function () {
        function ShellVersionControl() {
        }
        ShellVersionControl.getInstance = function () {
            if (!this._instance)
                this._instance = new ShellVersionControl();
            return this._instance;
        };
        Object.defineProperty(ShellVersionControl.prototype, "shellPath", {
            get: function () {
                return this._shellPath;
            },
            enumerable: true,
            configurable: true
        });
        ShellVersionControl.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._shellPath = window.config.resource_shell;
                    if (this._shellPath) {
                        this._shellPath += '/';
                    }
                    else {
                        this._shellPath = 'shell/';
                    }
                    if (!!window.config.debug_shell) {
                        this._shellPath = 'shell/';
                    }
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        ShellVersionControl.prototype.getVirtualUrl = function (url, versionControl) {
            if (!url)
                return url;
            if (this._shellPath) {
                if (url.indexOf(this._shellPath) != 0) {
                    url = this._shellPath + url;
                }
            }
            if (url.indexOf('?') == -1)
                url += ("?" + (versionControl ? versionControl : window.config.vershell));
            return url;
        };
        ShellVersionControl.prototype.getGameVirtualUrl = function (url, versionControl) {
            if (window.config.incrementalupdate) {
                if (shell.resourceConfig.resource[url]) {
                    url = shell.resourceConfig.resource[url];
                }
                return "" + url;
            }
            if (!url)
                return url;
            var versionMain = window.config.version + '/';
            if (versionMain) {
                if (url.indexOf(versionMain) != 0) {
                    url = versionMain + url;
                }
            }
            if (url.indexOf('?') == -1)
                url += ("?" + (versionControl ? versionControl : window.config.version_assets));
            return url;
        };
        return ShellVersionControl;
    }());
    shell.ShellVersionControl = ShellVersionControl;
    __reflect(ShellVersionControl.prototype, "shell.ShellVersionControl", ["RES.VersionController", "RES.IVersionController"]);
    var AssetAdapter = (function () {
        function AssetAdapter() {
            this._uiResLib = {};
        }
        /**
         * @language zh_CN
         * 解析素材
         * @param source 待解析的新素材标识符
         * @param compFunc 解析完成回调函数，示例:callBack(content:any,source:string):void;
         * @param thisObject callBack的 this 引用
         */
        AssetAdapter.prototype.getAsset = function (source, compFunc, thisObject) {
            function onGetRes(data) {
                compFunc.call(thisObject, data, source);
            }
            if (RES.hasRes(source)) {
                var data = RES.getRes(source);
                if (data) {
                    onGetRes(data);
                }
                else {
                    RES.getResAsync(source, onGetRes, this);
                }
            }
            else {
                RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
            }
        };
        return AssetAdapter;
    }());
    shell.AssetAdapter = AssetAdapter;
    __reflect(AssetAdapter.prototype, "shell.AssetAdapter", ["eui.IAssetAdapter"]);
    var ThemeAdapter = (function () {
        function ThemeAdapter() {
        }
        /**
         * 解析主题
         * @param url 待解析的主题url
         * @param compFunc 解析完成回调函数，示例:compFunc(e:egret.Event):void;
         * @param errorFunc 解析失败回调函数，示例:errorFunc():void;
         * @param thisObject 回调的this引用
         */
        ThemeAdapter.prototype.getTheme = function (url, compFunc, errorFunc, thisObject) {
            function onGetRes(e) {
                compFunc.call(thisObject, e);
            }
            function onError(e) {
                if (e.resItem.url == url) {
                    RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
                    errorFunc.call(thisObject);
                }
            }
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null);
            RES.getResByUrl(url, onGetRes, this, RES.ResourceItem.TYPE_TEXT);
        };
        return ThemeAdapter;
    }());
    shell.ThemeAdapter = ThemeAdapter;
    __reflect(ThemeAdapter.prototype, "shell.ThemeAdapter", ["eui.IThemeAdapter"]);
})(shell || (shell = {}));
var Shell = (function (_super) {
    __extends(Shell, _super);
    function Shell() {
        var _this = _super.call(this) || this;
        console.log(egret.Capabilities.engineVersion);
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Shell.prototype.onAddToStage = function (event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.initialize();
    };
    Shell.prototype.wait = function (time) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (r1, r2) {
                        egret.setTimeout(function () {
                            r1();
                        }, _this, time);
                    })];
            });
        });
    };
    Shell.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shell.layerManager.initialize(this.stage);
                        return [4 /*yield*/, platform.enable(window.config.sdk)];
                    case 1:
                        _a.sent();
                        egret.ImageLoader.crossOrigin = "anonymous";
                        shell.viewManager.initialize(this.stage);
                        shell.tipManager.initialize(this.stage);
                        egret.registerImplementation("eui.IAssetAdapter", new shell.AssetAdapter());
                        egret.registerImplementation("eui.IThemeAdapter", new shell.ThemeAdapter());
                        RES.registerVersionController(shell.ShellVersionControl.getInstance());
                        return [4 /*yield*/, shell.ShellVersionControl.getInstance().init()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.loadResConfig()];
                    case 3:
                        _a.sent();
                        if (!window.config.debug_shell) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.loadTheme()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        shell.ShellLoading.instance.initialize();
                        egret.log('初始化登录相关...');
                        if (!platform.sdk || !platform.sdk.start()) {
                            params = platform.getUrlParams();
                            if (params.sdk && params.platform) {
                                platform.sdk = new platform.SdkBase(params.sdk);
                                window.config.platform = params.platform;
                                window.config.ssl = params.ssl == 'true';
                                window.config.superstart = true;
                            }
                            shell.viewManager.onViewCloseOnce(shell.LoginView, this, this.showLoginServer);
                            shell.viewManager.openView(shell.LoginView, params.id);
                            try {
                                window.removeLogo();
                            }
                            catch (e) { }
                        }
                        else {
                            if (platform.sdk.type == platform.P9377) {
                                if (!platform.sdk.verifyResult) {
                                    shell.tipManager.show('Verification failed, please refresh the page!', 0xFF0000, 2000, this, function () { });
                                    return [2 /*return*/];
                                }
                            }
                            platform.sdk.once(egret.Event.COMPLETE, function (data) {
                                this.showLoginServer(platform.sdk.roleId);
                            }, this);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Shell.prototype.loadResConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, function () {
                            resolve();
                        }, this);
                        RES.loadConfig("resource/default.res.json?shell" + window.config.vershell, 'resource/');
                    })];
            });
        });
    };
    Shell.prototype.loadTheme = function () {
        return __awaiter(this, void 0, void 0, function () {
            var that;
            return __generator(this, function (_a) {
                that = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var theme = new eui.Theme("resource/default.thm.json?shell" + window.config.vershell, that.stage);
                        theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                            resolve();
                        }, that);
                    })];
            });
        });
    };
    Shell.prototype.showLoginServer = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var authData, first;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        egret.log('用户信息登录...');
                        return [4 /*yield*/, shell.LoginData.instance.userLogin(id)];
                    case 1:
                        authData = _a.sent();
                        if (authData.code != 0) {
                            alert('Verification error: ' + JSON.stringify(authData));
                            egret.error('Verification error:', authData);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, shell.LoginData.instance.requestServerList(platform.sdk ? platform.sdk.roleId : shell.LoginData.instance.authData.identityId)];
                    case 2:
                        first = _a.sent();
                        if (first) {
                            if (shell.LoginData.instance.serverList.selected.status != shell.ServerItem.OPEN) {
                                shell.tipManager.show("Server under maintenance! Please try again later...", 0xFF3300, 2000);
                                this.showLoginServerView();
                                return [2 /*return*/];
                            }
                            shell.LoginData.instance.reportSelectServer();
                            this.enterGame();
                            return [2 /*return*/];
                        }
                        this.showLoginServerView();
                        try {
                            window.removeLogo();
                        }
                        catch (e) { }
                        return [2 /*return*/];
                }
            });
        });
    };
    Shell.prototype.showLoginServerView = function () {
        if (platform.sdk && platform.sdk.type == platform.JLJHIOS) {
            platform.sdk.mixLoadEnd();
        }
        shell.viewManager.openView(shell.LoginServerView, shell.LoginData.instance.authData);
        if (window.config.noticepop)
            shell.viewManager.openView(shell.NoticeView);
        shell.viewManager.onViewCloseOnce(shell.LoginServerView, this, this.enterGame);
    };
    Shell.prototype.enterGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stage, manifest, key, key, MainClass, main;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        egret.log('进入游戏...');
                        shell.viewManager.destory();
                        stage = this.stage;
                        if (this.parent) {
                            this.parent.removeChild(this);
                        }
                        return [4 /*yield*/, this.wait(1000 / 30)];
                    case 1:
                        _a.sent();
                        egret.log('加载游戏基本配置....');
                        window.config.version = window.config.debug ? window.config.version : shell.LoginData.instance.serverList.selected.version;
                        //兼容老版本
                        window.config.ver = window.config.version;
                        return [4 /*yield*/, shell.resourceConfig.initialize(window.config.version)];
                    case 2:
                        _a.sent();
                        manifest = { initial: null, game: null };
                        if (window.config.debug) {
                            manifest.initial = this.filterGameJsFile(shell.resourceConfig.manifest.initial);
                        }
                        else {
                            manifest.initial = shell.resourceConfig.manifest.initial.concat();
                        }
                        manifest.game = shell.resourceConfig.manifest.game.concat();
                        for (key in manifest.initial) {
                            manifest.initial[key] = shell.ShellVersionControl.getInstance().getGameVirtualUrl(manifest.initial[key], window.config.version_assets + "_" + window.config.version_assetscript);
                        }
                        for (key in manifest.game) {
                            manifest.game[key] = shell.ShellVersionControl.getInstance().getGameVirtualUrl(manifest.game[key], window.config.version_assets + "_" + window.config.version_assetscript);
                        }
                        shell.ShellLoading.instance.show('Loading game logic...');
                        return [4 /*yield*/, this.loadGameScript(manifest)];
                    case 3:
                        _a.sent();
                        window.config.logindata = shell.LoginData.instance;
                        window.config.resourceConfig = shell.resourceConfig;
                        window.config.stage = stage;
                        try {
                            shell.ShellLoading.instance.showTip('Initializing game...');
                            MainClass = egret.getDefinitionByName('game.Main');
                            main = new MainClass();
                            //shell.Loading.instance.hide();
                            egret.log('初始化游戏完成....');
                        }
                        catch (e) {
                            egret.log('游戏主逻辑初始化失败,点击刷新页面!');
                            //window.location.reload();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Shell.prototype.loadGameScript = function (manifest, caller, method) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        shell.scriptLoaderGroup.start(manifest.initial, 0, _this, function (status) {
                            function completeHandler(status) {
                                if (!status) {
                                    shell.ShellLoading.instance.showRefeshState();
                                    return;
                                }
                                if (method)
                                    method.call(caller);
                                resolve();
                            }
                            function progressHandler(progressValue) {
                                shell.ShellLoading.instance.updateProgress(0.5 + progressValue * 0.5);
                            }
                            if (manifest.game.length > 1) {
                                shell.scriptLoaderGroup.start(manifest.game, 10, this, completeHandler, progressHandler);
                            }
                            else {
                                shell.scriptLoaderQueue.start(manifest.game, this, completeHandler, progressHandler);
                            }
                        }, function (progressValue, v) {
                            shell.ShellLoading.instance.updateProgress(progressValue * 0.5);
                        });
                    })];
            });
        });
    };
    /**获取js形式的游戏逻辑文件列表 */
    Shell.prototype.getGameScripts = function (caller, method) {
        var version = '';
        if (window.config.version) {
            version = window.config.version + '/';
        }
        var that = this;
        var xhr = new XMLHttpRequest();
        var p = version + 'manifest.json?' + window.config.version_assets + "" + window.config.version_assetscript;
        xhr.open('GET', p, true);
        xhr.addEventListener("load", function () {
            var manifest = JSON.parse(xhr.response);
            xhr.removeEventListener('load', arguments.callee, false);
            if (window.config.debug) {
                manifest.initial = that.filterGameJsFile(manifest.initial);
            }
            for (var key in manifest.initial) {
                manifest.initial[key] = version + '/' + manifest.initial[key] + '?' + window.config.version_assets + "" + window.config.version_assetscript;
            }
            for (var key in manifest.game) {
                manifest.game[key] = version + '/' + manifest.game[key] + '?' + window.config.version_assets + "" + window.config.version_assetscript;
            }
            method.call(caller, manifest);
        });
        xhr.send(null);
    };
    /**检查并过滤不需要加载的JS文件 */
    Shell.prototype.filterGameJsFile = function (files) {
        var names = ["egret", "egret.web", "res", "assetsmanager", "eui", "game", "decoder", "sdk"];
        var filterlist = [];
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var libScriptPath = files_1[_i];
            var libScriptName = libScriptPath.substring(libScriptPath.lastIndexOf('/') + 1, libScriptPath.length);
            libScriptName = libScriptName.replace(".min.js", "");
            libScriptName = libScriptName.replace(".js", "");
            var has = false;
            for (var _a = 0, names_1 = names; _a < names_1.length; _a++) {
                var name = names_1[_a];
                if (name == libScriptName) {
                    has = true;
                    break;
                }
            }
            if (!has) {
                filterlist.push(libScriptPath);
            }
        }
        return filterlist;
    };
    return Shell;
}(egret.DisplayObjectContainer));
__reflect(Shell.prototype, "Shell");
