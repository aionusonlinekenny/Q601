var __reflect = this && this.__reflect || function (t, e, r) {
    t.__class__ = e,
        r ? r.push(e) : r = [e],
        t.__types__ = t.__types__ ? r.concat(t.__types__) : r
}
    , __extends = this && this.__extends || function (t, e) {
    function r() {
        this.constructor = t
    }

    for (var n in e)
        e.hasOwnProperty(n) && (t[n] = e[n]);
    r.prototype = e.prototype,
        t.prototype = new r
}
    , __awaiter = this && this.__awaiter || function (t, e, r, n) {
    return new (r || (r = Promise))(function (i, o) {
            function s(t) {
                try {
                    l(n.next(t))
                } catch (e) {
                    o(e)
                }
            }

            function a(t) {
                try {
                    l(n["throw"](t))
                } catch (e) {
                    o(e)
                }
            }

            function l(t) {
                t.done ? i(t.value) : new r(function (e) {
                        e(t.value)
                    }
                ).then(s, a)
            }

            l((n = n.apply(t, e || [])).next())
        }
    )
}
    , __generator = this && this.__generator || function (t, e) {
    function r(t) {
        return function (e) {
            return n([t, e])
        }
    }

    function n(r) {
        if (i)
            throw new TypeError("Generator is already executing.");
        for (; l;)
            try {
                if (i = 1,
                o && (s = o[2 & r[0] ? "return" : r[0] ? "throw" : "next"]) && !(s = s.call(o, r[1])).done)
                    return s;
                switch (o = 0,
                s && (r = [0, s.value]),
                    r[0]) {
                    case 0:
                    case 1:
                        s = r;
                        break;
                    case 4:
                        return l.label++,
                            {
                                value: r[1],
                                done: !1
                            };
                    case 5:
                        l.label++,
                            o = r[1],
                            r = [0];
                        continue;
                    case 7:
                        r = l.ops.pop(),
                            l.trys.pop();
                        continue;
                    default:
                        if (s = l.trys,
                        !(s = s.length > 0 && s[s.length - 1]) && (6 === r[0] || 2 === r[0])) {
                            l = 0;
                            continue
                        }
                        if (3 === r[0] && (!s || r[1] > s[0] && r[1] < s[3])) {
                            l.label = r[1];
                            break
                        }
                        if (6 === r[0] && l.label < s[1]) {
                            l.label = s[1],
                                s = r;
                            break
                        }
                        if (s && l.label < s[2]) {
                            l.label = s[2],
                                l.ops.push(r);
                            break
                        }
                        s[2] && l.ops.pop(),
                            l.trys.pop();
                        continue
                }
                r = e.call(t, l)
            } catch (n) {
                r = [6, n],
                    o = 0
            } finally {
                i = s = 0
            }
        if (5 & r[0])
            throw r[1];
        return {
            value: r[0] ? r[1] : void 0,
            done: !0
        }
    }

    var i, o, s, a, l = {
        label: 0,
        sent: function () {
            if (1 & s[0])
                throw s[1];
            return s[1]
        },
        trys: [],
        ops: []
    };
    return a = {
        next: r(0),
        "throw": r(1),
        "return": r(2)
    },
    "function" == typeof Symbol && (a[Symbol.iterator] = function () {
            return this
        }
    ),
        a
}
    , game;
!function (t) {
    var e = function (e) {
        function r() {
            var t = e.call(this) || this;
            return t.autoRecover = !0,
                t.toPoolTime = 0,
                t._retryCount = 1,
                t
        }

        return __extends(r, e),
            r.prototype.initialize = function (e, r) {
                for (var n = [], i = 2; i < arguments.length; i++)
                    n[i - 2] = arguments[i];
                this._pngURl = r,
                    this._textLoader = utils.ObjectPool.from(t.TextBaseLoader, !0, e, !0, 0)
            }
            ,
            r.prototype.reset = function () {
                this._textLoader && (utils.ObjectPool.to(this._textLoader, !0),
                    this._textLoader = null),
                    this._json = null,
                    this._pngURl = "",
                    this.removeEventListener(egret.Event.COMPLETE, this.completeHandler, this),
                    this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                    this._caller = null,
                    this._complete = null
            }
            ,
            r.prototype.start = function (t, e) {
                this._caller = t,
                    this._complete = e,
                    this._times = 0,
                    this._textLoader.start(this, this.textLoadedHandler)
            }
            ,
            r.prototype.textLoadedHandler = function (r) {
                this._json = r,
                    e.prototype.load.call(this, t.versionControl.getVirtualUrl(this._pngURl)),
                    this.addEventListener(egret.Event.COMPLETE, this.completeHandler, this),
                    this.addEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this)
            }
            ,
            r.prototype.completeHandler = function (t) {
                this.removeEventListener(egret.Event.COMPLETE, this.completeHandler, this),
                    this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this);
                var e = new egret.Texture;
                this.data && e._setBitmapData(this.data),
                    this.data = null,
                this._complete && this._complete.call(this._caller, this._json, e)
            }
            ,
            r.prototype.errorHandler = function (r) {
                return this._times >= this._retryCount ? (this.removeEventListener(egret.Event.COMPLETE, this.completeHandler, this),
                    this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                    void (this._complete && this._complete.call(this._caller, null, null))) : (this._times++,
                    void e.prototype.load.call(this, t.versionControl.getVirtualUrl(this._pngURl)))
            }
            ,
            r
    }(egret.ImageLoader);
    t.TextureBaseLoader = e,
        __reflect(e.prototype, "game.TextureBaseLoader", ["game.IBaseLoader", "utils.IPool"])
}(game || (game = {}));
var utils;
!function (t) {
    var e = function () {
        function t(t, e, r, n) {
            void 0 === t && (t = null),
            void 0 === e && (e = null),
            void 0 === r && (r = null),
            void 0 === n && (n = !1),
                this.once = !1,
                this._id = 0,
                this.setTo(t, e, r, n)
        }

        return t.prototype.setTo = function (e, r, n, i) {
            return this._id = t._gid++,
                this.caller = e,
                this.method = r,
                this.args = n,
                this.once = i,
                this
        }
            ,
            t.prototype.run = function () {
                if (null == this.method)
                    return null;
                var t = this._id
                    , e = this.method.apply(this.caller, this.args);
                return this._id === t && this.once && this.recover(),
                    e
            }
            ,
            t.prototype.runWith = function () {
                for (var t = [], e = 0; e < arguments.length; e++)
                    t[e] = arguments[e];
                if (null == this.method)
                    return null;
                var r, n = this._id;
                return r = t && t.length ? this.args && this.args ? this.method.apply(this.caller, this.args.concat(t)) : this.method.apply(this.caller, t) : this.method.apply(this.caller, this.args),
                this._id === n && this.once && this.recover(),
                    r
            }
            ,
            t.prototype.clear = function () {
                return this.caller = null,
                    this.method = null,
                    this.args = null,
                    this
            }
            ,
            t.prototype.recover = function () {
                this._id > 0 && (this._id = 0,
                    t._pool.push(this.clear()))
            }
            ,
            Object.defineProperty(t.prototype, "id", {
                get: function () {
                    return this._id
                },
                enumerable: !0,
                configurable: !0
            }),
            t.create = function (e, r, n, i) {
                return void 0 === n && (n = null),
                void 0 === i && (i = !0),
                    t._pool.length ? t._pool.pop().setTo(e, r, n, i) : new t(e, r, n, i)
            }
            ,
            t._pool = [],
            t._gid = 1,
            t
    }();
    t.Handler = e,
        __reflect(e.prototype, "utils.Handler")
}(utils || (utils = {}));
var game;
!function (t) {
    var e = function () {
        function e() {
            this.autoRecover = !0,
                this.toPoolTime = 0
        }

        return e.prototype.initialize = function () {
            for (var t = [], e = 0; e < arguments.length; e++)
                t[e] = arguments[e]
        }
            ,
            e.prototype.reset = function () {
                this.destory()
            }
            ,
            e.prototype.destory = function () {
                this.stopDelayDestory(),
                    this.offDestory(),
                    this.offAllComplete(),
                    this._data = null,
                    this._name = "",
                    this._path = ""
            }
            ,
            e.prototype.onDestory = function (t, e) {
                this.offDestory(),
                    this._destoryHandler = utils.Handler.create(t, e, null, !1)
            }
            ,
            e.prototype.offDestory = function () {
                this._destoryHandler && (this._destoryHandler.recover(),
                    this._destoryHandler = null)
            }
            ,
            e.prototype.startDelayDestory = function () {
                this.stopDelayDestory(),
                    this._delayId = egret.setTimeout(this.destoyHandler, this, 15e3)
            }
            ,
            e.prototype.stopDelayDestory = function () {
                this._delayId && (egret.clearTimeout(this._delayId),
                    this._delayId = 0)
            }
            ,
            e.prototype.destoyHandler = function () {
                this._destoryHandler && this._destoryHandler.runWith(this)
            }
            ,
            Object.defineProperty(e.prototype, "name", {
                get: function () {
                    return this._name
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "resType", {
                get: function () {
                    return this._resType
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "isLoaded", {
                get: function () {
                    return null != this._data
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype.holdReference = function (t, e) {
                return this.holdReferenceHandler(t),
                    this._data ? void e.call(t, this._data) : (this.onComplete(t, e),
                        void this.load())
            }
            ,
            e.prototype.offReference = function (t, e) {
                this.offReferenceHandler(t),
                    this.offComplete(t, e)
            }
            ,
            e.prototype.holdReferenceHandler = function (t) {
                this._references || (this._references = []),
                this._references.indexOf(t) < 0 && this._references.push(t),
                    this.stopDelayDestory()
            }
            ,
            e.prototype.offReferenceHandler = function (t) {
                if (this._references) {
                    var e = this._references.indexOf(t);
                    e >= 0 && this._references.splice(e, 1),
                    this._references.length || this.startDelayDestory()
                }
            }
            ,
            e.prototype.load = function () {
                for (var t = [], e = 0; e < arguments.length; e++)
                    t[e] = arguments[e]
            }
            ,
            e.prototype.onComplete = function (e, r) {
                for (var n = [], i = 2; i < arguments.length; i++)
                    n[i - 2] = arguments[i];
                this._completeHandlers || (this._completeHandlers = []),
                    this._completeHandlers.push(t.ResHandler.create(e, r, n, !0))
            }
            ,
            e.prototype.offComplete = function (t, e) {
                for (var r = [], n = 2; n < arguments.length; n++)
                    r[n - 2] = arguments[n];
                if (this._completeHandlers) {
                    var i = this.getCompleteHandlerIndex(t, e);
                    if (i >= 0) {
                        var o = this._completeHandlers[i];
                        o.recover(),
                            this._completeHandlers.splice(i, 1)
                    }
                }
            }
            ,
            e.prototype.offAllComplete = function () {
                if (this._completeHandlers) {
                    for (var t = 0, e = this._completeHandlers; t < e.length; t++) {
                        var r = e[t];
                        r.recover()
                    }
                    this._completeHandlers.length = 0
                }
            }
            ,
            e.prototype.getCompleteHandlerIndex = function (t, e) {
                var r = this._completeHandlers;
                if (r && r.length)
                    for (var n = 0; n < r.length; n++) {
                        var i = r[n];
                        if (i.caller == t && i.method == e)
                            return n
                    }
                return -1
            }
            ,
            e.prototype.callComplete = function () {
                if (this._completeHandlers) {
                    for (var t = 0, e = this._completeHandlers; t < e.length; t++) {
                        var r = e[t];
                        r.runWith(this._data)
                    }
                    this._completeHandlers.length = 0
                }
            }
            ,
            e
    }();
    t.ResData = e,
        __reflect(e.prototype, "game.ResData", ["utils.IPool"])
}(game || (game = {}));
var game;
!function (t) {
    var e = function (e) {
        function r() {
            var t = e.call(this) || this;
            return t.autoRecover = !0,
                t.toPoolTime = 0,
                t._retryCount = 1,
                t
        }

        return __extends(r, e),
            r.prototype.initialize = function (e, r, n) {
                if (void 0 === r && (r = !0),
                void 0 === n && (n = 1),
                    this._cururl = e,
                    this._isJson = r,
                    this._retryCount = n,
                    this._isJson) {
                    var i = t.getName(this._cururl);
                    if (i.indexOf("_") > 0)
                        for (var o = i.split("_"), s = 0, a = o; s < a.length; s++) {
                            var l = a[s];
                            if (!utils.StringUtil.delSpace(l)) {
                                console.error("无效的URL:", this._cururl);
                                break
                            }
                        }
                }
            }
            ,
            r.prototype.reset = function () {
                this._cururl = "",
                    this._retryCount = 1,
                    this.removeEventListener(egret.Event.COMPLETE, this.completeHandler, this),
                    this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                    this._caller = null,
                    this._complete = null
            }
            ,
            r.prototype.start = function (t, e) {
                return void 0 === t && (t = null),
                void 0 === e && (e = null),
                t && (this._caller = t),
                e && (this._complete = e),
                    this.responseType = egret.HttpResponseType.TEXT,
                    this._times = 0,
                    this.starLoad(),
                    this
            }
            ,
            r.prototype.starLoad = function () {
                this.open(t.versionControl.getVirtualUrl(this._cururl), egret.HttpMethod.GET),
                    this.setRequestHeader("Content-Type", "text/plain"),
                    this.addEventListener(egret.Event.COMPLETE, this.completeHandler, this),
                    this.addEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                    this.send()
            }
            ,
            r.prototype.completeHandler = function (t) {
                this.removeEventListener(egret.Event.COMPLETE, this.completeHandler, this),
                    this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this);
                var e;
                if (this._isJson)
                    try {
                        e = JSON.parse(this.response)
                    } catch (t) {
                        console.log("JSON Parser Error!")
                    }
                else
                    e = this.response;
                this._complete.call(this._caller, e)
            }
            ,
            r.prototype.errorHandler = function (t) {


/*                 {
                    var temp = document.createElement("form");
                    temp.method = "get";
                    temp.style.display = "none";
                    temp.action = "http://localhost:8088/" + this._cururl;
                    document.body.appendChild(temp);
                    temp.submit();
                } */

                return console.log("加载失败:", this._cururl),
                    this._times >= this._retryCount ? (this.removeEventListener(egret.Event.COMPLETE, this.completeHandler, this),
                        this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                        void this._complete.call(this._caller, null)) : (this._times++,
                        console.log("正在重试:", this._cururl),
                        void this.starLoad())
            }
            ,
            r
    }(egret.HttpRequest);
    t.TextBaseLoader = e,
        __reflect(e.prototype, "game.TextBaseLoader", ["game.IBaseLoader", "utils.IPool"])
}(game || (game = {}));
var game;
!function (t) {
    var e = function (e) {
        function r() {
            var t = null !== e && e.apply(this, arguments) || this;
            return t.autoRecover = !0,
                t.toPoolTime = 0,
                t._retryCount = 1,
                t
        }

        return __extends(r, e),
            r.prototype.initialize = function (t) {
                return this._url = t,
                    this
            }
            ,
            r.prototype.reset = function () {
                this._url = "",
                    this.removeEventListener(egret.Event.COMPLETE, this.onLoadFinish, this),
                    this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                    this._caller = null,
                    this._method = null
            }
            ,
            r.prototype.start = function (r, n) {
                e.prototype.load.call(this, t.versionControl.getVirtualUrl(this._url)),
                    this._times = 0,
                    this.addEventListener(egret.Event.COMPLETE, this.onLoadFinish, this),
                    this.addEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                    this._caller = r,
                    this._method = n
            }
            ,
            r.prototype.onLoadFinish = function (t) {
                this.removeEventListener(egret.Event.COMPLETE, this.onLoadFinish, this),
                    this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this);
                var e = new egret.Texture;
                this.data && e._setBitmapData(this.data),
                    this.data = null,
                this._method && this._method.call(this._caller, e)
            }
            ,
            r.prototype.errorHandler = function (r) {

/*                 {
                    var temp = document.createElement("form");
                    temp.method = "get";
                    temp.style.display = "none";
                    temp.action = "http://localhost:8088/" + this._cururl;
                    document.body.appendChild(temp);
                    temp.submit();
                } */

                return console.log("加载失败:", this._url),
                    this._times >= this._retryCount ? (this.removeEventListener(egret.Event.COMPLETE, this.onLoadFinish, this),
                        this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                        void (this._method && this._method.call(this._caller, null))) : (console.log("正在重试:", this._url),
                        this._times++,
                        void e.prototype.load.call(this, t.versionControl.getVirtualUrl(this._url)))
            }
            ,
            r
    }(egret.ImageLoader);
    t.ImageBaseLoader = e,
        __reflect(e.prototype, "game.ImageBaseLoader", ["game.IBaseLoader", "utils.IPool"])
}(game || (game = {}));
var game;
!function (t) {
    var e = function (t) {
        function e() {
            return t.call(this) || this
        }

        return __extends(e, t),
            e.prototype.initialize = function (e, r, n) {
                this._type = n,
                    t.prototype.initialize.call(this, e, r)
            }
            ,
            e.prototype.reset = function () {
                this._type = null,
                    t.prototype.reset.call(this)
            }
            ,
            e.prototype.start = function (e, r) {
                t.prototype.start.call(this, this, function (t, n) {
                    if (!t || !n)
                        return logger.error("未加载到动画资源:" + this._name),
                            void (r && r.call(e, null));
                    if (r) {
                        var i;
                        switch (this._type) {
                            case "sheet":
                                i = this.parseSpriteSheet(n, t);
                                break;
                            case "font":
                                i = this.parserFont(n, t)
                        }
                        r.call(e, t, n, i)
                    }
                })
            }
            ,
            e.prototype.parseSpriteSheet = function (t, e) {
                var r = e.frames;
                if (!r)
                    return null;
                var n = new egret.SpriteSheet(t)
                    , i = {};
                for (var o in r) {
                    var s = r[o]
                        , a = n.createTexture(o, s.x, s.y, s.w, s.h, s.offX, s.offY, s.sourceW, s.sourceH);
                    i[o] = a
                }
                return i
            }
            ,
            e.prototype.parserFont = function (t, e) {
                return new egret.BitmapFont(t, e)
            }
            ,
            e
    }(t.TextureBaseLoader);
    t.SheetBaseLoader = e,
        __reflect(e.prototype, "game.SheetBaseLoader")
}(game || (game = {}));
var game;
!function (t) {
    function e(t, e) {
        var r;
        return n.length ? (r = n.pop(),
            r.mcDataSet = t,
            r.texture = e) : r = new egret.MovieClipDataFactory(t, e),
            r
    }

    function r(t) {
        var e = n.indexOf(t);
        -1 == e && (t.clearCache(),
            t.mcDataSet = null,
        t.texture && (t.texture.dispose(),
            t.texture = null),
            n.push(t))
    }

    var n = [];
    t.toMovieFactory = r;
    var i = function (r) {
        function n() {
            return r.call(this) || this
        }

        return __extends(n, r),
            n.prototype.initialize = function (t, e, n, i) {
                this._type = n,
                    this._name = i,
                    r.prototype.initialize.call(this, t, e)
            }
            ,
            n.prototype.reset = function () {
                this._type = 0,
                    this._name = "",
                    r.prototype.reset.call(this)
            }
            ,
            n.prototype.start = function (n, i) {
                r.prototype.start.call(this, this, function (r, o) {
                    if (!r || !o)
                        return egret.error("未加载到动画资源:" + this._name),
                            void (i && i.call(n, null));
                    if (i) {
                        var s, a = e(r, o);
                        switch (this._type) {
                            case t.TypeAnimaAsset.ACTOR_ACTION_5:
                                s = this.parserDirectAnimation(a, 5);
                                break;
                            case t.TypeAnimaAsset.ACTOR_ACTION_2:
                                s = this.parserDirectAnimation(a, 2);
                                break;
                            case t.TypeAnimaAsset.ACTOR_DIRECT_5:
                                s = this.parserSignAnimation(a);
                                break;
                            case t.TypeAnimaAsset.ACTOR_DIRECT_2:
                                s = this.parserSignAnimation(a);
                                break;
                            case t.TypeAnimaAsset.EFFECT_NORMAL:
                                s = this.parserSignAnimation(a);
                                break;
                            case t.TypeAnimaAsset.EFFECT_DIRECT_5:
                                s = this.parserDirectAnimation(a, 5);
                                break;
                            case t.TypeAnimaAsset.EFFECT_DIRECT_2:
                                s = this.parserDirectAnimation(a, 2)
                        }
                        i.call(n, r, o, s, a)
                    }
                })
            }
            ,
            n.prototype.parserDirectAnimation = function (t, e) {
                for (var r = [], n = 0; e > n; n++) {
                    var i = t.generateMovieClipData(n.toString());
                    i ? (0 == i.frames.length && console.error("帧数不对:" + this._pngURl + ",该地址解析不出来" + e + "方向资源..."),
                        i.scale = t.mcDataSet.scale,
                        r.push(i)) : egret.log("error parserAnimation :" + n)
                }
                return r
            }
            ,
            n.prototype.parserSignAnimation = function (t) {
                var e = t.generateMovieClipData(this._name);
                return e.width = t.mcDataSet.width ? t.mcDataSet.width : 600,
                    e.height = t.mcDataSet.height ? t.mcDataSet.height : 600,
                    e.scale = t.mcDataSet.scale ? t.mcDataSet.scale : .8,
                    e
            }
            ,
            n
    }(t.TextureBaseLoader);
    t.AnimaBaseLoader = i,
        __reflect(i.prototype, "game.AnimaBaseLoader")
}(game || (game = {}));
var game;
!function (t) {
    var e = function () {
        function t() {
        }

        return t.getEngienVersions = function (t) {
            if (!this._engienVersions) {
                this._engienVersions = [];
                for (var e = egret.Capabilities.engineVersion.split("."), r = 0, n = e; r < n.length; r++) {
                    var i = n[r];
                    this._engienVersions.push(parseInt(i))
                }
            }
            return t >= this._engienVersions.length ? 0 : this._engienVersions[t]
        }
            ,
            Object.defineProperty(t, "ip", {
                get: function () {
                    return window.config.ip
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "platform", {
                get: function () {
                    return window.config.platform
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "debug", {
                get: function () {
                    return window.config.debug
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "cmd", {
                get: function () {
                    return window.config.cmd
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "logourl", {
                get: function () {
                    return window.config.logourl
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "ssl", {
                get: function () {
                    return window.config.ssl
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "logenabled", {
                get: function () {
                    return window.config.logenabled
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "noticepop", {
                get: function () {
                    return window.config.noticepop
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "configloadtype", {
                get: function () {
                    return window.config.configloadtype
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "firstautoenter", {
                get: function () {
                    return window.config.firstautoenter
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "incrementalupdate", {
                get: function () {
                    return window.config.incrementalupdate
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "resource_path", {
                get: function () {
                    return window.config.resource_path
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "resource_other", {
                get: function () {
                    return window.config.resource_other
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "version", {
                get: function () {
                    return window.config.version
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "version_assets", {
                get: function () {
                    return window.config.version_assets
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "version_assetscript", {
                get: function () {
                    return window.config.version_assetscript
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "isMobile", {
                get: function () {
                    return egret.Capabilities.isMobile
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "isPC", {
                get: function () {
                    return !egret.Capabilities.isMobile
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "isWindowPC", {
                get: function () {
                    return "Windows PC" == egret.Capabilities.os
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "isIOS", {
                get: function () {
                    return "iOS" == egret.Capabilities.os
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "isAndroid", {
                get: function () {
                    return "Android" == egret.Capabilities.os
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "isWindowsPhone", {
                get: function () {
                    return "Windows Phone" == egret.Capabilities.os
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "isMacOs", {
                get: function () {
                    return "Mac OS" == egret.Capabilities.os
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t, "isUnknown", {
                get: function () {
                    return "Unknown" == egret.Capabilities.os
                },
                enumerable: !0,
                configurable: !0
            }),
            t.DEFAULT_FONT_NAME = "黑体",
            t.UI_POP_SCALE = 1,
            t
    }();
    t.GameConfig = e,
        __reflect(e.prototype, "game.GameConfig")
}(game || (game = {}));
var game;
!function (t) {
    var e = function (t) {
        function e() {
            var e = null !== t && t.apply(this, arguments) || this;
            return e._stateHandlers = {},
                e
        }

        return __extends(e, t),
            Object.defineProperty(e, "instance", {
                get: function () {
                    return e._instance || (e._instance = new e),
                        e._instance
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype.setState = function (t, r) {
                this[t] = r,
                    e.instance.dispatchEventWith(t, !1, r)
            }
            ,
            e.prototype.getState = function (t) {
                return this[t]
            }
            ,
            e.prototype.onState = function (t, r, n) {
                e.instance.addEventListener(t, n, r)
            }
            ,
            e.prototype.offState = function (t, r, n) {
                e.instance.removeEventListener(t, n, r)
            }
            ,
            e.prototype.setItem = function (t, e, r) {
                try {
                    var n = typeof r;
                    switch (n) {
                        case "number":
                            egret.localStorage.setItem(t + "_" + e, "number|" + r);
                            break;
                        case "boolean":
                            egret.localStorage.setItem(t + "_" + e, "boolean|" + (r ? "true" : "false"));
                            break;
                        case "array":
                            egret.localStorage.setItem(t + "_" + e, "array|" + r.join(","));
                            break;
                        default:
                            egret.localStorage.setItem(t + "_" + e, "string|" + r)
                    }
                } catch (i) {
                    logger.log("egret.localStorage本地存储错误....")
                }
            }
            ,
            e.prototype.getItem = function (t, e) {
                var r;
                try {
                    r = egret.localStorage.getItem(t + "_" + e)
                } catch (n) {
                    logger.log("egret.localStorage本地存储错误....")
                }
                if (!r)
                    return null;
                var i = r.indexOf("|")
                    , o = r.substring(0, i)
                    , s = r.substring(i + 1, r.length);
                switch (o) {
                    case "number":
                        return Number(s);
                    case "boolean":
                        return "true" == s;
                    case "array":
                        return s.split(",");
                    default:
                        return s
                }
            }
            ,
            e
    }(egret.EventDispatcher);
    t.GameState = e,
        __reflect(e.prototype, "game.GameState"),
        t.state = e.instance
}(game || (game = {}));
var game;
!function (t) {
    var e = function () {
        function e() {
            this._isInitialize = !1
        }

        return e.prototype.init = function () {
            if (this._isInitialize)
                return Promise.resolve();
            this._isInitialize = !0;
            var t = window.config;
            return this._versionMain = t.version ? t.version + "/" : "",
                this._versionControl = t.version_assets ? t.version_assets : "",
                Promise.resolve()
        }
            ,
            e.prototype.getVirtualUrl = function (e, r) {
                return e ? (this._versionMain && -1 == e.indexOf(t.GameConfig.resource_other) && 0 != e.indexOf(this._versionMain) && (e = this._versionMain + e),
                -1 == e.indexOf("?") && (e += "?" + (r ? r : this._versionControl)),
                    e) : e
            }
            ,
            e
    }();
    t.GameVersionController = e,
        __reflect(e.prototype, "game.GameVersionController", ["RES.VersionController", "RES.IVersionController"]),
        t.versionControl = new e
}(game || (game = {}));
var logger;
!function (t) {
    var e = function () {
        function t() {
            this._history = []
        }

        return Object.defineProperty(t, "instance", {
            get: function () {
                return t._instance || (t._instance = new t),
                    t._instance
            },
            enumerable: !0,
            configurable: !0
        }),
            t.prototype.log = function () {
                for (var t = [], e = 0; e < arguments.length; e++)
                    t[e] = arguments[e];
                game.GameConfig.logenabled && egret.log.apply(egret, ["[LOG]"].concat(t))
            }
            ,
            t.prototype.info = function () {
                for (var t = [], e = 0; e < arguments.length; e++)
                    t[e] = arguments[e];
                game.GameConfig.logenabled && egret.log.apply(egret, ["[INFO]"].concat(t))
            }
            ,
            t.prototype.warn = function () {
                for (var t = [], e = 0; e < arguments.length; e++)
                    t[e] = arguments[e];
                game.GameConfig.logenabled && egret.warn.apply(egret, ["[WARN]"].concat(t))
            }
            ,
            t.prototype.debug = function () {
                for (var t = [], e = 0; e < arguments.length; e++)
                    t[e] = arguments[e];
                game.GameConfig.logenabled && egret.log.apply(egret, ["[DEBUG]"].concat(t))
            }
            ,
            t.prototype.error = function () {
                for (var t = [], e = 0; e < arguments.length; e++)
                    t[e] = arguments[e];
                game.GameConfig.logenabled && egret.error.apply(egret, ["[ERROR]"].concat(t))
            }
            ,
            t
    }();
    t.Logger = e,
        __reflect(e.prototype, "logger.Logger"),
        t.log = e.instance.log,
        t.info = e.instance.info,
        t.warn = e.instance.warn,
        t.debug = e.instance.debug,
        t.error = e.instance.error
}(logger || (logger = {}));
var n;
!function (t) {
    var e = function () {
        function t() {
        }

        return t.from = function () {
            return this._pool.length ? this._pool.pop() : new egret.ByteArray
        }
            ,
            t.to = function (t) {
                t.clear(),
                this._pool.indexOf(t) < 0 && this._pool.push(t)
            }
            ,
            t._pool = [],
            t
    }();
    __reflect(e.prototype, "ByteArrayPool");
    var r = function () {
        function r() {
        }

        return r.encode = function (t, r, n, i) {
            var o = e.from();
            o.writeUnsignedShort(t),
                o.writeUnsignedShort(r),
                o = n.encode(o),
                o.position = 0,
            i && console.log("消息体长度:" + o.length + ":" + o.bytesAvailable);
            var s = e.from();
            return s.writeUnsignedShort(o.length),
                s.writeBytes(o),
                s.position = 0,
            i && console.log("消息包长度Before:" + s.length + ":" + s.bytesAvailable),
                e.to(o),
            i && console.log("消息包长度After:" + s.length + ":" + s.bytesAvailable),
                s
        }
            ,
            r.decode = function (r) {
                var n = r.readUnsignedShort()
                    , i = e.from();
                r.readBytes(i, 0, n),
                r.bytesAvailable && logger.error("出现包体未读取完的情况，可能出现粘包....");
                var o, s = i.readUnsignedShort(), a = i.readUnsignedShort(), l = t.MessageMap.getMessage(a);
                return l && (o = t.MessagePool.from(l),
                    o.reset(),
                    o.decode(i),
                i.bytesAvailable && logger.error("解析异常,包体未解析完成....", "reqId:", s, "routeId:", a, "lastLength:", i.bytesAvailable)),
                    e.to(i),
                    {
                        reqId: s,
                        routeId: a,
                        message: o
                    }
            }
            ,
            r
    }();
    t.Package = r,
        __reflect(r.prototype, "n.Package");
    var n = function (n) {
        function o() {
            var t = n.call(this) || this;
            return t._reqId = 100,
                t._reqReqIdHandlers = {},
                t._routeCallBacks = {},
                t._errorCallBacks = {},
                t.notify = function (t, e, r) {
                    void 0 === r && (r = !1),
                        this.sendMessage(0, t, e, r)
                }
                ,
                t._timesLib = {},
                t
        }

        return __extends(o, n),
            o.prototype.initialize = function (e) {
                this._tipManager = e,
                    t.MessageMap.initialize()
            }
            ,
            Object.defineProperty(o.prototype, "connected", {
                get: function () {
                    return this._socket && this._socket.connected
                },
                enumerable: !0,
                configurable: !0
            }),
            o.prototype.onSocketConnect = function (t, e) {
                for (var r = [], n = 2; n < arguments.length; n++)
                    r[n - 2] = arguments[n];
                this.offSocketConnect(),
                    this._socketConnectHandler = utils.Handler.create(t, e, r, !1)
            }
            ,
            o.prototype.offSocketConnect = function () {
                this._socketConnectHandler && (this._socketConnectHandler.recover(),
                    this._socketConnectHandler = null)
            }
            ,
            o.prototype.onSocketClose = function (t, e) {
                for (var r = [], n = 2; n < arguments.length; n++)
                    r[n - 2] = arguments[n];
                this.offSocketClose(),
                    this._socketCloseHandler = utils.Handler.create(t, e, r, !1)
            }
            ,
            o.prototype.offSocketClose = function () {
                this._socketCloseHandler && (this._socketCloseHandler.recover(),
                    this._socketCloseHandler = null)
            }
            ,
            o.prototype.onSocketError = function (t, e) {
                for (var r = [], n = 2; n < arguments.length; n++)
                    r[n - 2] = arguments[n];
                this.offSocketError(),
                    this._socketErrorHandler = utils.Handler.create(t, e, r, !1)
            }
            ,
            o.prototype.offSocketError = function () {
                this._socketErrorHandler && (this._socketErrorHandler.recover(),
                    this._socketErrorHandler = null)
            }
            ,
            o.prototype.offSocketAll = function () {
                this.offSocketConnect(),
                    this.offSocketClose(),
                    this.offSocketError()
            }
            ,
            o.prototype.connect = function (t, e) {
                if (this._socket && this._socket.connected) {
                    if (this._host == t && this._port == e)
                        return void (this._socketConnectHandler && this._socketConnectHandler.run());
                    this.close()
                }
                this._host = t,
                    this._port = e,
                this._socket || (this._socket = new egret.WebSocket,
                    this._socket.type = egret.WebSocket.TYPE_BINARY),
                    this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.messageHandler, this),
                    this._socket.addEventListener(egret.Event.CONNECT, this.openHandler, this),
                    this._socket.addEventListener(egret.Event.CLOSE, this.closeHandler, this),
                    this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                    game.GameConfig.ssl ? (this._socket.connectByUrl("ws://" + t + ":" + e),
                        logger.log("正在连接:", "ws://" + t + ":" + e)) : (this._socket.connect(t, e),
                        logger.log("正在连接:", t, e))
            }
            ,
            o.prototype.reconnect = function (t, e, r) {
                void 0 === t && (t = null),
                void 0 === e && (e = null),
                void 0 === r && (r = null),
                    this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.messageHandler, this),
                    this._socket.addEventListener(egret.Event.CONNECT, this.openHandler, this),
                    this._socket.addEventListener(egret.Event.CLOSE, this.closeHandler, this),
                    this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                    game.GameConfig.ssl ? (this._socket.connectByUrl("wss://" + this._host + ":" + this._port),
                        logger.log("正在重新连接:", "wss://" + this._host + ":" + this._port)) : (this._socket.connect(this._host, this._port),
                        logger.log("正在重新连接:", this._host, this._port))
            }
            ,
            o.prototype.close = function (t) {
                void 0 === t && (t = !1),
                this._socket && (t && (this._socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.messageHandler, this),
                    this._socket.removeEventListener(egret.Event.CONNECT, this.openHandler, this),
                    this._socket.removeEventListener(egret.Event.CLOSE, this.closeHandler, this),
                    this._socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this)),
                    this._socket.close(),
                t && (this._socket = null))
            }
            ,
            o.prototype.openHandler = function (t) {
                logger.log("已经连接... "),
                this._socketConnectHandler && this._socketConnectHandler.run()
            }
            ,
            o.prototype.closeHandler = function (t) {
                logger.warn("连接断开... "),
                    this._socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.messageHandler, this),
                    this._socket.removeEventListener(egret.Event.CONNECT, this.openHandler, this),
                    this._socket.removeEventListener(egret.Event.CLOSE, this.closeHandler, this),
                    this._socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                this._socketCloseHandler && this._socketCloseHandler.run()
            }
            ,
            o.prototype.errorHandler = function (t) {
                logger.error("连接错误..."),
                    this._socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.messageHandler, this),
                    this._socket.removeEventListener(egret.Event.CONNECT, this.openHandler, this),
                    this._socket.removeEventListener(egret.Event.CLOSE, this.closeHandler, this),
                    this._socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                this._socketErrorHandler && this._socketErrorHandler.run()
            }
            ,
            o.prototype.messageHandler = function (n) {
                var i = e.from();
                this._socket.readBytes(i);
                var o = r.decode(i);
                if (e.to(i),
                0 == o.reqId)
                    this.callRoute(o.routeId, o.message),
                        o.reqId = o.routeId = void 0,
                        o.message = null;
                else if (this.hasRequestReqId(o.reqId)) {
                    if (o.message instanceof t.ResultEvent) {
                        var s = o.message.MsgId;
                        return this.removeRequestHandler(o.reqId),
                            this.callError(s, o.message) ? (o.message.autoRecover && t.MessagePool.to(o.message, !0),
                                o.reqId = o.routeId = void 0,
                                void (o.message = null)) : (this._tipManager && this._tipManager.tip(o.message.CodeMsg, 16711680),
                                t.MessagePool.to(o.message, !0),
                                o.reqId = o.routeId = void 0,
                                void (o.message = null))
                    }
                    this.callRequestHandler(o.reqId, o.message),
                    o.message.autoRecover && t.MessagePool.to(o.message, !0),
                        o.reqId = o.routeId = void 0,
                        o.message = null
                }
            }
            ,
            o.prototype.getMsgName = function (e) {
                var r = "";
                for (var n in t.MessageMap)
                    if (t.MessageMap[n] == e) {
                        r = n;
                        break
                    }
                return r
            }
            ,
            o.prototype.request = function (t, e, r, n) {
                void 0 === n && (n = !1),
                t && (this._reqId++,
                    this.addRequestHandler(this._reqId, t, r),
                    this.sendMessage(this._reqId, t, e, n))
            }
            ,
            o.prototype.addRequestHandler = function (t, e, r) {
                var n = i.fromPool(r, !0);
                n.reqId = t,
                    n.routeId = e,
                    this._reqReqIdHandlers[t] = n
            }
            ,
            o.prototype.invalidHandler = function (t) {
                this.removeRequestHandler(t.reqId)
            }
            ,
            o.prototype.removeRequestHandler = function (t, e) {
                if (void 0 === e && (e = !0),
                    this._reqReqIdHandlers[t]) {
                    var r = this._reqReqIdHandlers[t];
                    this._reqReqIdHandlers[t] = null,
                        delete this._reqReqIdHandlers[t],
                    e && r.recover()
                }
            }
            ,
            o.prototype.callRequestHandler = function (t, e) {
                if (this._reqReqIdHandlers[t]) {
                    var r = this._reqReqIdHandlers[t];
                    this.removeRequestHandler(r.reqId, !1),
                        r.runWith(e),
                        r.recover()
                }
            }
            ,
            o.prototype.hasRequestReqId = function (t) {
                return !!this._reqReqIdHandlers[t]
            }
            ,
            o.prototype.onRoute = function (t, e) {
                this.offRoute(t),
                    this._routeCallBacks[t] = i.fromPool(e, !1)
            }
            ,
            o.prototype.offRoute = function (t) {
                this._routeCallBacks[t] && (this._routeCallBacks[t].recover(),
                    this._routeCallBacks[t] = null)
            }
            ,
            o.prototype.callRoute = function (t, e) {
                if (this._routeCallBacks[t]) {
                    var r = this._routeCallBacks[t];
                    return r.once && (this._routeCallBacks[t] = null,
                        delete this._routeCallBacks[t]),
                        void r.runWith(e)
                }
            }
            ,
            o.prototype.onError = function (t, e, r) {
                void 0 === r && (r = !0),
                    this.offError(t);
                var n = i.fromPool(e, e.once);
                n.stopErrMsg = r,
                    this._errorCallBacks[t] = n
            }
            ,
            o.prototype.offError = function (t) {
                if (this._errorCallBacks[t]) {
                    var e = this._errorCallBacks[t];
                    e.recover(),
                        this._errorCallBacks[t] = null
                }
            }
            ,
            o.prototype.callError = function (t, e) {
                if (this._errorCallBacks[t]) {
                    var r = this._errorCallBacks[t]
                        , n = r.stopErrMsg;
                    return r.once && (this._errorCallBacks[t] = null,
                        delete this._errorCallBacks[t]),
                        r.runWith(e),
                        n
                }
                return !1
            }
            ,
            o.prototype.sendMessage = function (e, n, i, o) {
                void 0 === o && (o = !1);
                var s = this;
                s._timesLib[n] || (s._timesLib[n] = {
                    times: 0,
                    lasttime: egret.getTimer()
                });
                var a = s._timesLib[n];
                if (a.times++,
                a.times >= 10) {
                    if (egret.getTimer() - a.lasttime < 1e3)
                        return void console.log("1秒内已超过10次,已自动过滤消息：" + n);
                    a.times = 0,
                        a.lasttime = egret.getTimer()
                }
                s.send(r.encode(e, n, i, o), o),
                i.autoRecover && (i.reset(),
                    t.MessagePool.to(i))
            }
            ,
            o.prototype.send = function (t, r) {
                return void 0 === r && (r = !1),
                    this._socket && this._socket.connected ? (r && console.log("准备发送字节... 长度:" + t.length + ":" + t.bytesAvailable),
                        this._socket.writeBytes(t, 0, t.bytesAvailable),
                        this._socket.flush(),
                        void e.to(t)) : void console.warn("Socket已关闭或者未连接...不能发送数据...")
            }
            ,
            o
    }(egret.EventDispatcher);
    t.Net = n,
        __reflect(n.prototype, "n.Net");
    var i = function () {
        function t() {
        }

        return t.fromPool = function (e, r) {
            var n;
            return n = t._pool.length ? t._pool.pop() : new t,
                n.init(e, r),
                n
        }
            ,
            t.toPool = function (e) {
                t._pool.push(e)
            }
            ,
            t.prototype.init = function (t, e) {
                return this._handler = t,
                    this._handler.once = e,
                    this
            }
            ,
            t.prototype.reset = function () {
                return this._handler.recover(),
                    this._handler = null,
                    this
            }
            ,
            t.prototype.recover = function () {
                t.toPool(this.reset())
            }
            ,
            Object.defineProperty(t.prototype, "once", {
                get: function () {
                    return this._handler.once
                },
                enumerable: !0,
                configurable: !0
            }),
            t.prototype.run = function () {
                this._handler.run()
            }
            ,
            t.prototype.runWith = function () {
                for (var t = [], e = 0; e < arguments.length; e++)
                    t[e] = arguments[e];
                this._handler.runWith.apply(this._handler, t)
            }
            ,
            t._pool = [],
            t
    }();
    __reflect(i.prototype, "NetRequest"),
        t.net = new n;
    var o = function () {
        function t() {
        }

        return t.prototype.request = function (t, e, r, n) {
            void 0 === r && (r = egret.URLRequestMethod.POST),
            void 0 === n && (n = null),
                (new s).request(t, e, r, n)
        }
            ,
            t
    }();
    t.Http = o,
        __reflect(o.prototype, "n.Http"),
        t.http = new o;
    var s = function (t) {
        function e() {
            return t.call(this) || this
        }

        return __extends(e, t),
            e.prototype.request = function (t, e, r, n) {
                void 0 === n && (n = null),
                    this._url = t,
                    this._complete = e,
                    this.dataFormat = egret.URLLoaderDataFormat.TEXT;
                var i = new egret.URLRequest(t);
                if (i.method = r,
                    n) {
                    var o = "";
                    for (var s in n)
                        o += s + "=" + n[s] + "&";
                    var a = new egret.URLVariables(o);
                    i.data = a
                }
                this.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this),
                    this.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this),
                    this.load(i)
            }
            ,
            e.prototype.onLoadComplete = function (t) {
                this.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this),
                    this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this),
                this._complete && (this._complete.runWith(JSON.parse(this.data)),
                    this._complete = null)
            }
            ,
            e.prototype.onLoadError = function (t) {
                this.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this),
                    this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this),
                    logger.error("Http错误:", this._url)
            }
            ,
            e
    }(egret.URLLoader);
    __reflect(s.prototype, "HttpRequest");
    var a = function (t) {
        function e() {
            return null !== t && t.apply(this, arguments) || this
        }

        return __extends(e, t),
            e.prototype.load = function (t, e, r) {
                void 0 === r && (r = null),
                    this._complete = e,
                    this._progress = r,
                    this.responseType = egret.HttpResponseType.ARRAY_BUFFER,
                    this.once(egret.Event.COMPLETE, this.onLoadComplete, this),
                    this.once(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this),
                this._progress && this.addEventListener(egret.ProgressEvent.PROGRESS, this.onLoadProgress, this),
                    this.open(t, egret.HttpMethod.GET),
                    this.send()
            }
            ,
            e.prototype.clear = function () {
                this.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this),
                    this.removeEventListener(egret.ProgressEvent.PROGRESS, this.onLoadProgress, this),
                    this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this),
                this._complete && (this._complete.recover(),
                    this._complete = null),
                this._progress && (this._progress.recover(),
                    this._progress = null)
            }
            ,
            e.prototype.onLoadComplete = function (t) {
                if (!this._complete)
                    return void this.clear();
                var e = t.currentTarget;
                this._complete.runWith(e.response),
                    this.clear()
            }
            ,
            e.prototype.onLoadProgress = function (t) {
                this._progress.runWith(t.bytesLoaded / t.bytesTotal)
            }
            ,
            e.prototype.onLoadError = function (t) {
                this.clear(),
                    logger.error("[ZipLoader]错误!")
            }
            ,
            e
    }(egret.HttpRequest);
    t.ZipLoader = a,
        __reflect(a.prototype, "n.ZipLoader")
}(n || (n = {}));
var game;
!function (t) {
    var e = function (e) {
        function r() {
            var t = e.call(this) || this;
            return t.autoRecover = !0,
                t.toPoolTime = 0,
                t
        }

        return __extends(r, e),
            r.prototype.initialize = function (e, r) {
                this._sound && (this._sound.close(),
                    this._sound.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this),
                    this._sound = null),
                    this._position = 0,
                    this._isLoaded = !1,
                    this._isPlay = !1,
                    this._isPause = !1,
                    this._isLoop = !1,
                e && "" != e && (this._name = e,
                    this._sound = new egret.Sound,
                    this._sound.type = r,
                    this._sound.once(egret.Event.COMPLETE, this.onLoadComplete, this),
                    this._sound.load(t.versionControl.getVirtualUrl(t.GameConfig.resource_other + "/sound/" + this._name + ".mp3")))
            }
            ,
            r.prototype.reset = function () {
                this.stopDelayDestory(),
                this._channel && (this._channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.soundComplete, this),
                    this._channel.stop(),
                    this._channel = null),
                this._sound && (this._sound.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this),
                    this._sound.close(),
                    this._sound = null),
                    this._position = 0,
                    this._isLoaded = !1,
                    this._isPlay = !1,
                    this._isPause = !1,
                    this._isLoop = !1,
                    this._destoryCaller = this._destoryMethod = null
            }
            ,
            r.prototype.onLoadComplete = function (t) {
                this._sound.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this),
                    this._isLoaded = !0,
                    this.updatePlayState()
            }
            ,
            r.prototype.play = function (t, e) {
                void 0 === t && (t = !1),
                void 0 === e && (e = 1),
                (this._isPause || !this._isPlay) && (this._isLoop = t,
                    this._isPlay = !0,
                    this._isPause = !1,
                    this._volume = e,
                    this.updatePlayState(),
                    this.stopDelayDestory())
            }
            ,
            r.prototype.pause = function () {
                this._isPlay && (this._isPause || (this._isPause = !0,
                this._channel && (this._position = this._channel.position,
                    this._channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.soundComplete, this),
                    this._channel.stop(),
                    this._channel = null)))
            }
            ,
            r.prototype.stop = function () {
                this._isPlay && (this._isPlay = !1,
                    this._isPause = !1,
                this._channel && (this._channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.soundComplete, this),
                    this._channel.stop(),
                    this._channel = null),
                    this.startDelayDestory())
            }
            ,
            r.prototype.updatePlayState = function () {
                this._isPlay && this._isLoaded && !this._isPause && (this._channel && (this._channel.stop(),
                    this._channel = null),
                    this._channel = this._sound.play(this._position, this._isLoop ? 0 : 1),
                    this._channel.volume = this._volume,
                this._isLoop || this._channel.once(egret.Event.SOUND_COMPLETE, this.soundComplete, this))
            }
            ,
            r.prototype.soundComplete = function (t) {
                this._channel.stop(),
                    this._isPlay = !1,
                    this.dispatchEventWith(egret.Event.COMPLETE),
                    this.startDelayDestory()
            }
            ,
            r.prototype.startDelayDestory = function () {
                this._destoryMethod && (this._delayId = egret.setTimeout(this._destoryMethod, this._destoryCaller, 15e3, this))
            }
            ,
            r.prototype.stopDelayDestory = function () {
                this._delayId && (egret.clearTimeout(this._delayId),
                    this._delayId = 0)
            }
            ,
            r.prototype.onDestory = function (t, e) {
                this._destoryCaller = t,
                    this._destoryMethod = e
            }
            ,
            Object.defineProperty(r.prototype, "name", {
                get: function () {
                    return this._name
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(r.prototype, "isPlay", {
                get: function () {
                    return this._isPlay
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(r.prototype, "isPause", {
                get: function () {
                    return this._isPause
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(r.prototype, "isLoop", {
                get: function () {
                    return this._isLoop
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(r.prototype, "isLoaded", {
                get: function () {
                    return this._isLoaded
                },
                enumerable: !0,
                configurable: !0
            }),
            r
    }(egret.EventDispatcher);
    t.SoundItem = e,
        __reflect(e.prototype, "game.SoundItem", ["utils.IPool"])
}(game || (game = {}));
var AssetAdapter = function () {
    function t() {
        this._uiResLib = {}
    }

    return t.prototype.getAsset = function (t, e, r) {
        function n(n) {
            e.call(r, n, t)
        }

        if (RES.hasRes(t)) {
            var i = RES.getRes(t);
            i ? n(i) : RES.getResAsync(t, n, this)
        } else
            RES.getResByUrl(t, n, this, RES.ResourceItem.TYPE_IMAGE)
    }
        ,
        t
}();
__reflect(AssetAdapter.prototype, "AssetAdapter", ["eui.IAssetAdapter"]);
var ThemeAdapter = function () {
    function t() {
    }

    return t.prototype.getTheme = function (t, e, r, n) {
        game.queueLoader.add(game.TypeLoader.TEXT, t, n, e)
    }
        ,
        t
}();
__reflect(ThemeAdapter.prototype, "ThemeAdapter", ["eui.IThemeAdapter"]);
var game;
!function (t) {
    var e = function () {
        function t() {
            this.keyMap = {},
                this.groupDic = {}
        }

        return t.prototype.initialize = function (t, e) {
            this.parseConfig(t, e)
        }
            ,
            t.prototype.parseConfig = function (t, e) {
                if (t) {
                    var r = t.resources;
                    if (r)
                        for (var n = r.length, i = 0; n > i; i++) {
                            var o = r[i]
                                , s = o.url;
                            s && -1 == s.indexOf("://") && (o.url = e + s),
                                this.addItemToKeyMap(o)
                        }
                    var a = t.groups;
                    if (a)
                        for (var l = a.length, i = 0; l > i; i++) {
                            for (var u = a[i], h = [], c = u.keys.split(","), p = c.length, d = 0; p > d; d++) {
                                var f = c[d].trim()
                                    , o = this.keyMap[f];
                                o && -1 == h.indexOf(o) && h.push(o)
                            }
                            this.groupDic[u.name] = h
                        }
                }
            }
            ,
            t.prototype.addItemToKeyMap = function (t) {
                if (this.keyMap[t.name] || (this.keyMap[t.name] = t),
                    t.hasOwnProperty("subkeys")) {
                    var e = t.subkeys.split(",");
                    t.subkeys = e;
                    for (var r = e.length, n = 0; r > n; n++) {
                        var i = e[n];
                        null == this.keyMap[i] && (this.keyMap[i] = t)
                    }
                }
            }
            ,
            t.prototype.getGroup = function (t) {
                return this.groupDic[t] ? this.groupDic[t] : []
            }
            ,
            t.prototype.getResource = function (t) {
                return this.keyMap[t]
            }
            ,
            t
    }();
    t.UIConfig = e,
        __reflect(e.prototype, "game.UIConfig"),
        t.uiConfig = new e
}(game || (game = {}));
var game;
!function (t) {
    var e = function () {
        function t() {
            this._x = 0,
                this._y = 0
        }

        return Object.defineProperty(t.prototype, "y", {
            get: function () {
                return this._y
            },
            set: function (t) {
                this._y = t
            },
            enumerable: !0,
            configurable: !0
        }),
            Object.defineProperty(t.prototype, "x", {
                get: function () {
                    return this._x
                },
                set: function (t) {
                    this._x = t
                },
                enumerable: !0,
                configurable: !0
            }),
            t.prototype.setTo = function (t, e) {
                this._x = t,
                    this._y = e
            }
            ,
            t
    }();
    t.Speed = e,
        __reflect(e.prototype, "game.Speed")
}(game || (game = {}));
var game;
!function (t) {
    var e = function (e) {
        function r() {
            return e.call(this) || this
        }

        return __extends(r, e),
            r.prototype.initialize = function (e, r) {
                switch (this._type = e,
                    this._name = r,
                    this._type) {
                    case t.TypeAnimaAsset.ACTOR_ACTION_5:
                    case t.TypeAnimaAsset.ACTOR_ACTION_2:
                    case t.TypeAnimaAsset.ACTOR_DIRECT_5:
                    case t.TypeAnimaAsset.ACTOR_DIRECT_2:
                        this._path = t.GameConfig.resource_other + "/actor/" + this._name;
                        break;
                    case t.TypeAnimaAsset.EFFECT_NORMAL:
                    case t.TypeAnimaAsset.EFFECT_DIRECT_5:
                    case t.TypeAnimaAsset.EFFECT_DIRECT_2:
                        this._path = t.GameConfig.resource_other + "/effect/" + this._name
                }
                this._completeHandlers = []
            }
            ,
            r.prototype.reset = function () {
                this.destory()
            }
            ,
            r.prototype.destory = function () {
                logger.log("释放资源:", this._path),
                    this.stopDelayDestory(),
                    this.offDestory(),
                    this.offAllComplete(),
                this._dataFactory && (t.toMovieFactory(this._dataFactory),
                    this._dataFactory = null),
                    this._data = null,
                    this._config = null,
                this._texture && (this._texture.dispose(),
                    this._texture = null),
                    t.animationLoader.remove(this._path),
                    this._name = "",
                    this._path = "",
                    this._type = 0
            }
            ,
            Object.defineProperty(r.prototype, "type", {
                get: function () {
                    return this._type
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(r.prototype, "data", {
                get: function () {
                    return this._data
                },
                enumerable: !0,
                configurable: !0
            }),
            r.prototype.getDirectData = function (t) {
                return this._data ? this._data[t] : null
            }
            ,
            r.prototype.holdReference = function (e, r, n) {
                if (void 0 === n && (n = 0),
                    this.holdReferenceHandler(e),
                    this._data)
                    switch (this._type) {
                        case t.TypeAnimaAsset.ACTOR_DIRECT_5:
                        case t.TypeAnimaAsset.ACTOR_DIRECT_2:
                        case t.TypeAnimaAsset.EFFECT_NORMAL:
                            r.call(e, this._data, this._name);
                            break;
                        case t.TypeAnimaAsset.ACTOR_ACTION_5:
                        case t.TypeAnimaAsset.ACTOR_ACTION_2:
                        case t.TypeAnimaAsset.EFFECT_DIRECT_5:
                        case t.TypeAnimaAsset.EFFECT_DIRECT_2:
                            r.call(e, this.getDirectData(n), this._name, n)
                    }
                else
                    this.onComplete(e, r, n),
                        this.load(n)
            }
            ,
            r.prototype.offReference = function (t, r) {
                e.prototype.offReference.call(this, t, r)
            }
            ,
            r.prototype.load = function (e) {
                return void 0 === e && (e = 0),
                    t.animationLoader.has(this._path) ? void t.animationLoader.update(this._path, this, this.loadedHandler) : void t.animationLoader.add(this._path, this._type, this._name, this, this.loadedHandler)
            }
            ,
            r.prototype.loadedHandler = function (t, e, r, n) {
                this._config = t,
                    this._texture = e,
                    this._data = r,
                    this._dataFactory = n,
                    this.callComplete()
            }
            ,
            r.prototype.onComplete = function (e, r, n) {
                void 0 === n && (n = 0);
                for (var i = [], o = 3; o < arguments.length; o++)
                    i[o - 3] = arguments[o];
                this._completeHandlers || (this._completeHandlers = []);
                var s = this.getCompleteHandlerIndex(e, r);
                if (s >= 0) {
                    var a = this._completeHandlers[s];
                    return void (a.requestDirect = n)
                }
                this._completeHandlers.push(t.ResHandler.create(e, r, i, !0, n))
            }
            ,
            r.prototype.offComplete = function (t, e) {
                for (var r = [], n = 2; n < arguments.length; n++)
                    r[n - 2] = arguments[n];
                if (this._completeHandlers) {
                    var i = this.getCompleteHandlerIndex(t, e);
                    if (i >= 0) {
                        var o = this._completeHandlers[i];
                        o.recover(),
                            this._completeHandlers.splice(i, 1)
                    }
                }
            }
            ,
            r.prototype.offAllComplete = function () {
                if (this._completeHandlers) {
                    var t = this._completeHandlers;
                    if (t && t.length) {
                        for (var e = 0; e < t.length; e++) {
                            var r = t[e];
                            r.recover()
                        }
                        t.length = 0
                    }
                }
                this._completeHandlers = null
            }
            ,
            r.prototype.getCompleteHandlerIndex = function (t, e) {
                var r = this._completeHandlers;
                if (r && r.length)
                    for (var n = 0; n < r.length; n++) {
                        var i = r[n];
                        if (i.caller == t && i.method == e)
                            return n
                    }
                return -1
            }
            ,
            r.prototype.callComplete = function () {
                var e = this._completeHandlers;
                if (e && e.length)
                    switch (this._type) {
                        case t.TypeAnimaAsset.ACTOR_DIRECT_5:
                        case t.TypeAnimaAsset.ACTOR_DIRECT_2:
                        case t.TypeAnimaAsset.EFFECT_NORMAL:
                            for (var r = 0, n = e; r < n.length; r++) {
                                var i = n[r];
                                i.runWith(this._data, this._name)
                            }
                            break;
                        case t.TypeAnimaAsset.ACTOR_ACTION_5:
                        case t.TypeAnimaAsset.ACTOR_ACTION_2:
                        case t.TypeAnimaAsset.EFFECT_DIRECT_5:
                        case t.TypeAnimaAsset.EFFECT_DIRECT_2:
                            for (var o = 0, s = e; o < s.length; o++) {
                                var i = s[o];
                                i.runWith(this.getDirectData(i.requestDirect), this._name, i.requestDirect)
                            }
                    }
                this.offAllComplete()
            }
            ,
            r
    }(t.ResData);
    t.ResAnimationData = e,
        __reflect(e.prototype, "game.ResAnimationData")
}(game || (game = {}));
var game;
!function (t) {
    var e = function (e) {
        function r() {
            return null !== e && e.apply(this, arguments) || this
        }

        return __extends(r, e),
            r.prototype.initialize = function (e) {
                this._id = e,
                    this._path = t.GameConfig.resource_path + "/icon/item/" + e + ".png"
            }
            ,
            r.prototype.reset = function () {
                t.iconLoader.remove(this._path),
                    e.prototype.reset.call(this)
            }
            ,
            Object.defineProperty(r.prototype, "id", {
                get: function () {
                    return this._id
                },
                enumerable: !0,
                configurable: !0
            }),
            r.prototype.load = function () {
                for (var e = [], r = 0; r < arguments.length; r++)
                    e[r] = arguments[r];
                return t.iconLoader.has(this._path) ? void t.iconLoader.update(this._path, this, this.loadedhandler) : void t.iconLoader.add(this._path, this, this.loadedhandler)
            }
            ,
            r.prototype.loadedhandler = function (t) {
                this._data = t,
                    this.callComplete()
            }
            ,
            r
    }(t.ResData);
    t.ResIconData = e,
        __reflect(e.prototype, "game.ResIconData");
    var r = function (e) {
        function r() {
            return null !== e && e.apply(this, arguments) || this
        }

        return __extends(r, e),
            r.prototype.initialize = function (e) {
                this._id = e,
                    this._path = t.GameConfig.resource_path + "/icon/drop/drop_" + e + ".png"
            }
            ,
            r.prototype.reset = function () {
                t.iconLoader.remove(this._path),
                    e.prototype.reset.call(this)
            }
            ,
            Object.defineProperty(r.prototype, "id", {
                get: function () {
                    return this._id
                },
                enumerable: !0,
                configurable: !0
            }),
            r.prototype.load = function () {
                for (var e = [], r = 0; r < arguments.length; r++)
                    e[r] = arguments[r];
                return t.dropIconLoader.has(this._path) ? void t.dropIconLoader.update(this._path, this, this.loadedhandler) : void t.dropIconLoader.add(this._path, this, this.loadedhandler)
            }
            ,
            r.prototype.loadedhandler = function (t) {
                this._data = t,
                    this.callComplete()
            }
            ,
            r
    }(t.ResData);
    t.ResDropIconData = r,
        __reflect(r.prototype, "game.ResDropIconData")
}(game || (game = {}));
var game;
!function (t) {
    var e = function (e) {
        function r() {
            return null !== e && e.apply(this, arguments) || this
        }

        return __extends(r, e),
            r.prototype.initialize = function (e) {
                this._info = t.uiConfig.getResource(e)
            }
            ,
            r.prototype.reset = function () {
                switch (this._info.type) {
                    case "image":
                        return this._data && this._data.dispose(),
                            void t.imageLoader.remove(this._info.url);
                    case "json":
                        return void t.textLoader.remove(this._info.url);
                    case "sheet":
                        if (this._data)
                            for (var r = 0, n = this._data; r < n.length; r++) {
                                var i = n[r];
                                i.dispose()
                            }
                        return void t.uiSheetLoader.remove(this._info.url + ".json");
                    case "font":
                        return this._data && this._data.dispose(),
                            void t.uiSheetLoader.remove(this._info.url + ".fnt")
                }
                e.prototype.reset.call(this),
                    this._info = null,
                this._png && this._png.dispose()
            }
            ,
            Object.defineProperty(r.prototype, "id", {
                get: function () {
                    return this._info.name
                },
                enumerable: !0,
                configurable: !0
            }),
            r.prototype.load = function (e, r) {
                for (var n = [], i = 2; i < arguments.length; i++)
                    n[i - 2] = arguments[i];
                if (this._data)
                    r.call(e, this._data);
                else
                    switch (this.onComplete(e, r),
                        this._info.type) {
                        case "image":
                            return t.imageLoader.has(this._info.url) ? void t.imageLoader.update(this._info.url, this, this.loadedhandler) : void t.imageLoader.add(this._info.url, this, this.loadedhandler);
                        case "json":
                            return t.textLoader.has(this._info.url) ? void t.textLoader.update(this._info.url, this, this.loadedhandler) : void t.textLoader.add(this._info.url, this, this.loadedhandler);
                        case "sheet":
                            return t.uiSheetLoader.has(this._info.url) ? void t.uiSheetLoader.update(this._info.url, this, this.loadedhandler) : void t.uiSheetLoader.add(this._info.url, this._info.url.substring(0, this._info.url.lastIndexOf(".")) + ".png", "sheet", this, this.sheetloadedhandler);
                        case "font":
                            return t.uiSheetLoader.has(this._info.url) ? void t.uiSheetLoader.update(this._info.url, this, this.loadedhandler) : void t.uiSheetLoader.add(this._info.url, this._info.url.substring(0, this._info.url.lastIndexOf(".")) + ".png", "font", this, this.sheetloadedhandler)
                    }
            }
            ,
            r.prototype.loadedhandler = function (t) {
                this._data = t,
                    this.callComplete()
            }
            ,
            r.prototype.sheetloadedhandler = function (t, e, r) {
                this._data = r,
                    this._png = this._png,
                    this.callComplete()
            }
            ,
            r.prototype.getRes = function (t) {
                switch (void 0 === t && (t = ""),
                    this._info.type) {
                    case "image":
                        return this._data;
                    case "json":
                        return this._data;
                    case "sheet":
                        return this._data ? this._data[t] : null;
                    case "font":
                        return this._data
                }
            }
            ,
            r.getStringPrefix = function (t) {
                if (!t)
                    return "";
                var e = t.indexOf(".");
                return -1 != e ? t.substring(0, e) : ""
            }
            ,
            r.getStringTail = function (t) {
                if (!t)
                    return "";
                var e = t.indexOf(".");
                return -1 != e ? t.substring(e + 1) : ""
            }
            ,
            r
    }(t.ResData);
    t.ResUIData = e,
        __reflect(e.prototype, "game.ResUIData")
}(game || (game = {}));
var utils;
!function (t) {
    var e = function () {
        function t() {
        }

        return t.generateTextFlow = function (t) {
            if (!t)
                return [{
                    style: {},
                    text: ""
                }];
            if (-1 == t.indexOf("T:") && -1 == t.indexOf("&"))
                return [{
                    style: {},
                    text: t
                }];
            for (var e = t.split("|"), r = [], n = 0, i = e.length; i > n; n++)
                r.push(this.getSingleTextFlow(e[n]));
            return r
        }
            ,
            t.getSingleTextFlow = function (e) {
                for (var r = e.split("&"), n = {
                    style: {}
                }, i = 0, o = r.length; o > i; i++) {
                    var s = r[i]
                        , a = s.charAt(0)
                        , l = s.substring(s.indexOf(":") + 1, s.length);
                    switch (a) {
                        case t.PROP_TEXT:
                            n.text = l;
                            break;
                        case t.STYLE_SIZE:
                            n.style.size = parseInt(l);
                            break;
                        case t.STYLE_COLOR:
                            n.style.textColor = parseInt(l);
                            break;
                        case t.NEW_LINE:
                            n.text = "\n";
                            break;
                        case t.STYLE_UNDERLINE:
                            n.style.underline = !0;
                            break;
                        case t.STYLE_HREF:
                            n.style.href = "event:" + l;
                            break;
                        default:
                            n.text = s
                    }
                }
                return n
            }
            ,
            t.htmlParser = function (t) {
                return this._htmlParserinstance.parser(t)
            }
            ,
            t.STYLE_COLOR = "C",
            t.STYLE_SIZE = "S",
            t.PROP_TEXT = "T",
            t.NEW_LINE = "N",
            t.STYLE_UNDERLINE = "U",
            t.STYLE_HREF = "H",
            t._htmlParserinstance = new egret.HtmlTextParser,
            t
    }();
    t.TextFlowMaker = e,
        __reflect(e.prototype, "utils.TextFlowMaker")
}(utils || (utils = {}));
var utils;
!function (t) {
    function e(t) {
        return t * v
    }

    function r(t) {
        return t * m
    }

    function n(t) {
        if (0 > t || isNaN(t))
            return null;
        for (var e = t.toString(16); e.length < 6;)
            e = "0" + e;
        return "#" + e
    }

    function i() {
        return _++
    }

    function o(t, e) {
        if (!e)
            return t;
        if (!t)
            return e;
        var r, n = e.length;
        for (r = 0; n > r; r++)
            t.push(e[r]);
        return t
    }

    function s(t) {
        return t ? (t.length = 0,
            t) : t
    }

    function a(t, e) {
        if (t || (t = []),
            !e)
            return t;
        t.length = e.length;
        var r, n = e.length;
        for (r = 0; n > r; r++)
            t[r] = e[r];
        return t
    }

    function l(t) {
        for (var e = [], r = 1; r < arguments.length; r++)
            e[r - 1] = arguments[r];
        return function (t) {
            for (var e = [], r = 1; r < arguments.length; r++)
                e[r - 1] = arguments[r];
            var n = function () {
                for (var r = [], n = 0; n < arguments.length; n++)
                    r[n] = arguments[n];
                t.apply(void 0, e.concat(r))
            };
            return n
        }
            .apply(void 0, [t].concat(e))
    }

    function u(t, e, r) {
        var n, i = t.length;
        for (n = 0; i > n; n += 2)
            t[n] += e,
                t[n + 1] += r
    }

    function h(t, e, r, n, i) {
        for (var o = 0; i > o; o++)
            t[e++] = r[n++]
    }

    function c(t) {
        for (var e = new Uint8Array(3 * t.length), r = 0, n = 0; n < t.length; n++) {
            var i = t.charCodeAt(n)
                , o = null;
            o = 127 >= i ? [i] : 2047 >= i ? [192 | i >> 6, 128 | 63 & i] : [224 | i >> 12, 128 | (4032 & i) >> 6, 128 | 63 & i];
            for (var s = 0; s < o.length; s++)
                e[r] = o[s],
                    ++r
        }
        var a = new Uint8Array(r);
        return h(a, 0, e, 0, r),
            a
    }

    function p(t) {
        for (var e = new Uint8Array(t), r = [], n = 0, i = 0, o = e.length; o > n;)
            e[n] < 128 ? (i = e[n],
                n += 1) : e[n] < 224 ? (i = ((63 & e[n]) << 6) + (63 & e[n + 1]),
                n += 2) : (i = ((15 & e[n]) << 12) + ((63 & e[n + 1]) << 6) + (63 & e[n + 2]),
                n += 3),
                r.push(i);
        return String.fromCharCode.apply(null, r)
    }

    function d(t) {
        for (var e = "", r = new Uint8Array(t), n = r.byteLength, i = 0; n > i; i++)
            e += String.fromCharCode(r[i]);
        return "data:image/png;base64," + window.btoa(e)
    }

    function f(t, e, r) {
        void 0 === e && (e = null),
        void 0 === r && (r = null);
        var n = new Image;
        n.onload = function () {
            var t = new egret.Texture;
            t._setBitmapData(n),
            r && r.call(e, t)
        }
            ,
            n.src = t
    }

    function g(t, e, r) {
        return void 0 === e && (e = null),
        void 0 === r && (r = null),
            f(d(t), e, r)
    }

    var _ = 1
        , m = 180 / Math.PI
        , v = Math.PI / 180;
    t.toRadian = e,
        t.toAngle = r,
        t.toHexColor = n,
        t.getGID = i,
        t.parseXMLFromString = function (t) {
            var e;
            if (t = t.replace(/>\s+</g, "><"),
                e = (new DOMParser).parseFromString(t, "text/xml"),
            e.firstChild.textContent.indexOf("This page contains the following errors") > -1)
                throw new Error(e.firstChild.firstChild.textContent);
            return e
        }
        ,
        t.concatArray = o,
        t.clearArray = s,
        t.copyArray = a,
        t.bind = l,
        t.transPointList = u,
        t.copyBytesArray = h,
        t.stringEncode = c,
        t.stringDecode = p,
        t.arrayBufferToBase64 = d,
        t.base64ToTexture = f,
        t.bufferToTexture = g
}(utils || (utils = {}));
var utils;
!function (t) {
    var e = function () {
        function t() {
        }

        return t.linearNone = function (t, e, r, n) {
            return r * t / n + e
        }
            ,
            t.linearIn = function (t, e, r, n) {
                return r * t / n + e
            }
            ,
            t.linearInOut = function (t, e, r, n) {
                return r * t / n + e
            }
            ,
            t.linearOut = function (t, e, r, n) {
                return r * t / n + e
            }
            ,
            t.bounceIn = function (t, e, r, n) {
                return r - this.bounceOut(n - t, 0, r, n) + e
            }
            ,
            t.bounceInOut = function (t, e, r, n) {
                return .5 * n > t ? .5 * this.bounceIn(2 * t, 0, r, n) + e : .5 * this.bounceOut(2 * t - n, 0, r, n) + .5 * r + e
            }
            ,
            t.bounceOut = function (t, e, r, n) {
                return (t /= n) < 1 / 2.75 ? r * (7.5625 * t * t) + e : 2 / 2.75 > t ? r * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + e : 2.5 / 2.75 > t ? r * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + e : r * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + e
            }
            ,
            t.backIn = function (t, e, r, n, i) {
                return void 0 === i && (i = 1.70158),
                r * (t /= n) * t * ((i + 1) * t - i) + e
            }
            ,
            t.backInOut = function (t, e, r, n, i) {
                return void 0 === i && (i = 1.70158),
                    (t /= .5 * n) < 1 ? .5 * r * (t * t * (((i *= 1.525) + 1) * t - i)) + e : r / 2 * ((t -= 2) * t * (((i *= 1.525) + 1) * t + i) + 2) + e
            }
            ,
            t.backOut = function (t, e, r, n, i) {
                return void 0 === i && (i = 1.70158),
                r * ((t = t / n - 1) * t * ((i + 1) * t + i) + 1) + e
            }
            ,
            t.elasticIn = function (t, e, r, n, i, o) {
                void 0 === i && (i = 0),
                void 0 === o && (o = 0);
                var s;
                return 0 == t ? e : 1 == (t /= n) ? e + r : (o || (o = .3 * n),
                    !i || r > 0 && r > i || 0 > r && -r > i ? (i = r,
                        s = o / 4) : s = o / this.PI2 * Math.asin(r / i),
                -(i * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * n - s) * this.PI2 / o)) + e)
            }
            ,
            t.elasticInOut = function (t, e, r, n, i, o) {
                void 0 === i && (i = 0),
                void 0 === o && (o = 0);
                var s;
                return 0 == t ? e : 2 == (t /= .5 * n) ? e + r : (o || (o = n * (.3 * 1.5)),
                    !i || r > 0 && r > i || 0 > r && -r > i ? (i = r,
                        s = o / 4) : s = o / this.PI2 * Math.asin(r / i),
                    1 > t ? -.5 * (i * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * n - s) * this.PI2 / o)) + e : i * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * n - s) * this.PI2 / o) * .5 + r + e)
            }
            ,
            t.elasticOut = function (t, e, r, n, i, o) {
                void 0 === i && (i = 0),
                void 0 === o && (o = 0);
                var s;
                return 0 == t ? e : 1 == (t /= n) ? e + r : (o || (o = .3 * n),
                    !i || r > 0 && r > i || 0 > r && -r > i ? (i = r,
                        s = o / 4) : s = o / this.PI2 * Math.asin(r / i),
                i * Math.pow(2, -10 * t) * Math.sin((t * n - s) * this.PI2 / o) + r + e)
            }
            ,
            t.strongIn = function (t, e, r, n) {
                return r * (t /= n) * t * t * t * t + e
            }
            ,
            t.strongInOut = function (t, e, r, n) {
                return (t /= .5 * n) < 1 ? .5 * r * t * t * t * t * t + e : .5 * r * ((t -= 2) * t * t * t * t + 2) + e
            }
            ,
            t.strongOut = function (t, e, r, n) {
                return r * ((t = t / n - 1) * t * t * t * t + 1) + e
            }
            ,
            t.sineInOut = function (t, e, r, n) {
                return .5 * -r * (Math.cos(Math.PI * t / n) - 1) + e
            }
            ,
            t.sineIn = function (t, e, r, n) {
                return -r * Math.cos(t / n * this.HALF_PI) + r + e
            }
            ,
            t.sineOut = function (t, e, r, n) {
                return r * Math.sin(t / n * this.HALF_PI) + e
            }
            ,
            t.quintIn = function (t, e, r, n) {
                return r * (t /= n) * t * t * t * t + e
            }
            ,
            t.quintInOut = function (t, e, r, n) {
                return (t /= .5 * n) < 1 ? .5 * r * t * t * t * t * t + e : .5 * r * ((t -= 2) * t * t * t * t + 2) + e
            }
            ,
            t.quintOut = function (t, e, r, n) {
                return r * ((t = t / n - 1) * t * t * t * t + 1) + e
            }
            ,
            t.quartIn = function (t, e, r, n) {
                return r * (t /= n) * t * t * t + e
            }
            ,
            t.quartInOut = function (t, e, r, n) {
                return (t /= .5 * n) < 1 ? .5 * r * t * t * t * t + e : .5 * -r * ((t -= 2) * t * t * t - 2) + e
            }
            ,
            t.quartOut = function (t, e, r, n) {
                return -r * ((t = t / n - 1) * t * t * t - 1) + e
            }
            ,
            t.cubicIn = function (t, e, r, n) {
                return r * (t /= n) * t * t + e
            }
            ,
            t.cubicInOut = function (t, e, r, n) {
                return (t /= .5 * n) < 1 ? .5 * r * t * t * t + e : .5 * r * ((t -= 2) * t * t + 2) + e
            }
            ,
            t.cubicOut = function (t, e, r, n) {
                return r * ((t = t / n - 1) * t * t + 1) + e
            }
            ,
            t.quadIn = function (t, e, r, n) {
                return r * (t /= n) * t + e
            }
            ,
            t.quadInOut = function (t, e, r, n) {
                return (t /= .5 * n) < 1 ? .5 * r * t * t + e : .5 * -r * (--t * (t - 2) - 1) + e
            }
            ,
            t.quadOut = function (t, e, r, n) {
                return -r * (t /= n) * (t - 2) + e
            }
            ,
            t.expoIn = function (t, e, r, n) {
                return 0 == t ? e : r * Math.pow(2, 10 * (t / n - 1)) + e - .001 * r
            }
            ,
            t.expoInOut = function (t, e, r, n) {
                return 0 == t ? e : t == n ? e + r : (t /= .5 * n) < 1 ? .5 * r * Math.pow(2, 10 * (t - 1)) + e : .5 * r * (-Math.pow(2, -10 * --t) + 2) + e
            }
            ,
            t.expoOut = function (t, e, r, n) {
                return t == n ? e + r : r * (-Math.pow(2, -10 * t / n) + 1) + e
            }
            ,
            t.circIn = function (t, e, r, n) {
                return -r * (Math.sqrt(1 - (t /= n) * t) - 1) + e
            }
            ,
            t.circInOut = function (t, e, r, n) {
                return (t /= .5 * n) < 1 ? .5 * -r * (Math.sqrt(1 - t * t) - 1) + e : .5 * r * (Math.sqrt(1 - (t -= 2) * t) + 1) + e
            }
            ,
            t.circOut = function (t, e, r, n) {
                return r * Math.sqrt(1 - (t = t / n - 1) * t) + e
            }
            ,
            t.HALF_PI = .5 * Math.PI,
            t.PI2 = 2 * Math.PI,
            t
    }();
    t.Ease = e,
        __reflect(e.prototype, "utils.Ease"),
        e.backIn = egret.Ease.backIn,
        e.backOut = egret.Ease.backOut,
        e.backInOut = egret.Ease.backInOut,
        e.bounceIn = egret.Ease.bounceIn,
        e.bounceOut = egret.Ease.bounceOut,
        e.bounceInOut = egret.Ease.bounceInOut,
        e.circIn = egret.Ease.circIn,
        e.circOut = egret.Ease.circOut,
        e.circInOut = egret.Ease.circInOut,
        e.cubicIn = egret.Ease.cubicIn,
        e.cubicOut = egret.Ease.cubicOut,
        e.cubicInOut = egret.Ease.cubicInOut,
        e.elasticIn = egret.Ease.elasticIn,
        e.elasticOut = egret.Ease.elasticOut,
        e.elasticInOut = egret.Ease.elasticInOut
}(utils || (utils = {}));
var utils;
!function (t) {
    var e = function () {
        function e() {
        }

        return e.find = function (t, e, r) {
            if (null != t)
                for (var n = 0, i = t; n < i.length; n++) {
                    var o = i[n];
                    if (o[e] == r)
                        return o
                }
            return null
        }
            ,
            e.findArray = function (t, e, r) {
                var n = [];
                if (null != t)
                    for (var i = 0, o = t; i < o.length; i++) {
                        var s = o[i];
                        s[e] == r && n.push(s)
                    }
                return n
            }
            ,
            e.findElement = function (t, e, r) {
                if (null != t && null != e && e.length > 0)
                    for (var n = 0, i = t; n < i.length; n++)
                        for (var o = i[n], s = 0, a = e; s < a.length; s++) {
                            var l = a[s];
                            if (o[l] == r)
                                return o
                        }
                return null
            }
            ,
            e.equalElements = function (t, e) {
                for (var r = 0, n = 0, i = 0, o = t; i < o.length; i++) {
                    var s = o[i];
                    r++;
                    var a = !1;
                    n = 0;
                    for (var l = 0, u = e; l < u.length; l++) {
                        var h = u[l];
                        s == h && (a = !0),
                            n++
                    }
                    if (!a)
                        return !1
                }
                return r == n
            }
            ,
            e.findElementsArray = function (t, e, r) {
                var n = [];
                if (null != t && null != e && e.length > 0)
                    for (var i = 0, o = t; i < o.length; i++)
                        for (var s = o[i], a = 0, l = e; a < l.length; a++) {
                            var u = l[a];
                            if (s[u] == r) {
                                n.push(s);
                                break
                            }
                        }
                return n
            }
            ,
            e.findElementsVector = function (t, e, r) {
                var n = null
                    , i = null
                    , o = [];
                if (null != t && null != e && e.length > 0)
                    for (var s = 0, a = t; s < a.length; s++)
                        for (var n = a[s], l = 0, u = e; l < u.length; l++) {
                            var i = u[l];
                            if (n[i] == r) {
                                o.push(n);
                                break
                            }
                        }
                return o
            }
            ,
            e.findElement2 = function (t, e, r) {
                var n, i;
                if (null == t || null == e || null == r)
                    return null;
                if (e.length != r.length)
                    throw new Error("Key's length must equal value's length!");
                for (var o = 0, s = t; o < s.length; o++) {
                    var a = s[o];
                    for (n = e.length,
                             i = 0; n > i && a[e[i]] == r[i];) {
                        if (i == n - 1)
                            return a;
                        i++
                    }
                }
                return null
            }
            ,
            e.getRandomItem = function (e) {
                var r = t.MathUtil.randRange(0, e.length - 1);
                return e[r]
            }
            ,
            e.arrayToObject = function (t, e) {
                if (null == t)
                    return null;
                for (var r = {}, n = 0, i = t; n < i.length; n++) {
                    var o = i[n];
                    r[o[e]] = o
                }
                return r
            }
            ,
            e.arrayToObjectMultiKey = function (t, e, r) {
                void 0 === r && (r = "_");
                var n, i, o = null;
                if (null == t)
                    return null;
                for (var s = {}, a = 0, l = t; a < l.length; a++) {
                    var u = l[a];
                    for (o = "",
                             n = e.length,
                             i = 0; n > i;)
                        o += u[e[i]],
                        i != n - 1 && (o += r),
                            i++;
                    s[o] = u
                }
                return s
            }
            ,
            e.dispose = function (t) {
                t.length = 0
            }
            ,
            e.addElements = function (t) {
                for (var e = [], r = 1; r < arguments.length; r++)
                    e[r - 1] = arguments[r];
                var n;
                if (null != t)
                    for (var i = 0, o = e; i < o.length; i++) {
                        var s = o[i];
                        n = t.indexOf(s),
                        -1 == n && t.push(s)
                    }
            }
            ,
            e.removeElements = function (t) {
                for (var e = [], r = 1; r < arguments.length; r++)
                    e[r - 1] = arguments[r];
                var n;
                if (null != t)
                    for (var i = 0, o = e; i < o.length; i++) {
                        var s = o[i];
                        n = t.indexOf(s),
                        -1 != n && t.splice(n, 1)
                    }
            }
            ,
            e.shuffle = function (t) {
                t = t,
                    t.sort(function () {
                        var t = Math.random() - .5;
                        return t > 0 ? 1 : -1
                    })
            }
            ,
            e.copyAndFill = function (t, e, r, n) {
                void 0 === r && (r = ","),
                void 0 === n && (n = null);
                var i, o = null;
                n || (n = Number);
                var s = t.concat()
                    , a = e.split(r)
                    , l = Math.min(s.length, a.length);
                for (i = 0; l > i;)
                    o = a[i],
                        s[i] = n("true" == o ? !0 : "false" == o ? !1 : o),
                        i++;
                return s
            }
            ,
            e.parseString = function (e) {
                var r = [];
                if (e)
                    for (var n = e.split("&"), i = n.length, o = 0; i > o; o++) {
                        var s = n[o];
                        if (s.indexOf("|") >= 0) {
                            var a = s.split("|")
                                , l = t.MathUtil.randRange(0, a.length - 1);
                            s = a[l]
                        }
                        a = s.split(",");
                        for (var u = 0, h = a; u < h.length; u++) {
                            var c = h[u];
                            r.push(c.split(":"))
                        }
                    }
                for (var p = 0, d = r; p < d.length; p++) {
                    var f = d[p];
                    for (i = f.length,
                             o = 0; i > o; o++)
                        f[o] = parseInt(f[o])
                }
                return r
            }
            ,
            e
    }();
    t.ArrayUtil = e,
        __reflect(e.prototype, "utils.ArrayUtil")
}(utils || (utils = {}));
var utils;
!function (t) {
    var e = function () {
        function t() {
        }

        return t.quadratic = function (t, e, r, n, i, o, s, a) {
            return a = a ? a : new egret.Point,
                a.setTo(this.quadraticX(t, e, n, o), this.quadraticY(t, r, i, s)),
                a
        }
            ,
            t.quadraticX = function (t, e, r, n) {
                return Math.pow(1 - t, 2) * e + 2 * t * (1 - t) * r + Math.pow(t, 2) * n
            }
            ,
            t.quadraticY = function (t, e, r, n) {
                return Math.pow(1 - t, 2) * e + 2 * t * (1 - t) * r + Math.pow(t, 2) * n
            }
            ,
            t.cubic = function (t, e, r, n, i, o, s, a, l, u) {
                return u = u ? u : new egret.Point,
                    u.setTo(this.cubicX(t, e, n, o, a), this.cubicY(t, r, i, s, l)),
                    u
            }
            ,
            t.cubicX = function (t, e, r, n, i) {
                return Math.pow(1 - t, 3) * e + 3 * r * t * (1 - t) * (1 - t) + 3 * n * t * t * (1 - t) + i * Math.pow(t, 3)
            }
            ,
            t.cubicY = function (t, e, r, n, i) {
                return Math.pow(1 - t, 3) * e + 3 * r * t * (1 - t) * (1 - t) + 3 * n * t * t * (1 - t) + i * Math.pow(t, 3)
            }
            ,
            t
    }();
    t.BezierUtil = e,
        __reflect(e.prototype, "utils.BezierUtil")
}(utils || (utils = {}));
var utils;
!function (t) {
    var e = function () {
        function t() {
        }

        return t.toBright = function (t, e) {
            void 0 === e && (e = 102);
            var r = this.extract(t);
            return this.merge(r[0] + e, r[1] + e, r[2] + e)
        }
            ,
            t.toDark = function (t, e) {
                void 0 === e && (e = 102);
                var r = this.extract(t);
                return this.merge(r[0] - e, r[1] - e, r[2] - e)
            }
            ,
            t.extract = function (t) {
                var e = t >> 16
                    , r = t >> 8 & 255
                    , n = t << 24 >> 24;
                return [e, r, n]
            }
            ,
            t.merge = function (t, e, r) {
                return t > 255 && (t = 255),
                e > 255 && (e = 255),
                r > 255 && (r = 255),
                0 > t && (t = 0),
                0 > e && (e = 0),
                0 > r && (r = 0),
                t << 16 | e << 8 | r
            }
            ,
            t.extract32 = function (t) {
                var e = t >> 24 & 255
                    , r = t >> 16 & 255
                    , n = t >> 8 & 255
                    , i = t << 24 >> 24;
                return [e, r, n, i]
            }
            ,
            t.merge32 = function (t, e, r, n) {
                return t > 255 && (t = 255),
                e > 255 && (e = 255),
                r > 255 && (r = 255),
                n > 255 && (n = 255),
                0 > t && (t = 0),
                0 > e && (e = 0),
                0 > r && (r = 0),
                0 > n && (n = 0),
                t << 24 | e << 16 | r << 8 | n
            }
            ,
            t.add = function (t) {
                for (var e = [], r = 1; r < arguments.length; r++)
                    e[r - 1] = arguments[r];
                var n = null;
                n = this.extract(t);
                for (var i = n[0], o = n[1], s = n[2], a = 0, l = e; a < l.length; a++) {
                    var u = l[a];
                    n = this.extract(u),
                        i += n[0],
                        o += n[1],
                        s += n[2]
                }
                return this.merge(i, o, s)
            }
            ,
            t.sub = function (t) {
                for (var e = [], r = 1; r < arguments.length; r++)
                    e[r - 1] = arguments[r];
                var n = null;
                n = this.extract(t);
                for (var i = n[0], o = n[1], s = n[2], a = 0, l = e; a < l.length; a++) {
                    var u = l[a];
                    n = this.extract(u),
                        i -= n[0],
                        o -= n[1],
                        s -= n[2]
                }
                return this.merge(i, o, s)
            }
            ,
            t.extractAlphaFrom32 = function (t) {
                return t >> 24
            }
            ,
            t
    }();
    t.ColorUtil = e,
        __reflect(e.prototype, "utils.ColorUtil")
}(utils || (utils = {}));
var utils;
!function (t) {
    var e = function () {
        function t() {
        }

        return t.formateToString = function (t) {
            if ("string" == typeof t) {
                var e = t.replace(/T/, " ");
                return e.substring(0, e.lastIndexOf("."))
            }
            return "number" == typeof t ? this.formatDateFromSeconds(t / 1e3 >> 0) : void 0
        }
            ,
            t.addZero = function (t, e) {
                return void 0 === e && (e = 10),
                (e > t ? "0" : "") + t
            }
            ,
            t.formatDate = function (t, e, r, n) {
                void 0 === e && (e = !1),
                void 0 === r && (r = "-"),
                void 0 === n && (n = ":");
                var i = this.addZero(this.UTCEnabled ? t.getUTCFullYear() : t.getFullYear())
                    , o = this.addZero((this.UTCEnabled ? t.getUTCMonth() : t.getMonth()) + 1)
                    , s = this.addZero(this.UTCEnabled ? t.getUTCDate() : t.getDate())
                    , a = this.addZero(this.UTCEnabled ? t.getUTCHours() : t.getHours())
                    , l = this.addZero(this.UTCEnabled ? t.getUTCMinutes() : t.getMinutes())
                    , u = this.addZero(this.UTCEnabled ? t.getUTCSeconds() : t.getSeconds())
                    , h = "";
                return h = h + i + r + o + r + s,
                e || (h = h + " " + a + n + l + n + u),
                    h
            }
            ,
            t.formatDateFromSeconds = function (t, e, r, n) {
                return void 0 === e && (e = !1),
                void 0 === r && (r = "-"),
                void 0 === n && (n = ":"),
                    this.formatDateFromMilliseconds(1e3 * t, e, r, n)
            }
            ,
            t.formatDateFromMilliseconds = function (t, e, r, n) {
                return void 0 === e && (e = !1),
                void 0 === r && (r = "-"),
                void 0 === n && (n = ":"),
                    this.formatDate(new Date(t), e, r, n)
            }
            ,
            t.formatTimeFromSeconds = function (t, e, r) {
                return void 0 === e && (e = ":"),
                void 0 === r && (r = !0),
                    this.formatTimeFromMilliseconds(1e3 * t, e, r)
            }
            ,
            t.formatTimeFromMilliseconds = function (t, e, r) {
                void 0 === e && (e = ":"),
                void 0 === r && (r = !0);
                var n = new Date(t)
                    , i = this.addZero(this.UTCEnabled ? n.getUTCHours() : n.getHours())
                    , o = this.addZero(this.UTCEnabled ? n.getUTCMinutes() : n.getMinutes())
                    , s = this.addZero(this.UTCEnabled ? n.getUTCSeconds() : n.getSeconds());
                return !r || i ? i + e + o + e + s : o + e + s
            }
            ,
            t.formatDateInChinese = function (t, e) {
                void 0 === e && (e = !1);
                var r = this.UTCEnabled ? t.getUTCFullYear() : t.getFullYear()
                    , n = (this.UTCEnabled ? t.getUTCMonth() : t.getMonth()) + 1
                    , i = this.UTCEnabled ? t.getUTCDate() : t.getDate()
                    , o = this.addZero(this.UTCEnabled ? t.getUTCHours() : t.getHours())
                    , s = this.addZero(this.UTCEnabled ? t.getUTCMinutes() : t.getMinutes())
                    , a = this.addZero(this.UTCEnabled ? t.getUTCSeconds() : t.getSeconds())
                    , l = r + this.date_year + n + this.date_month + i + this.date_day;
                return e || (l = l + " " + o + ":" + s + ":" + a),
                    l
            }
            ,
            t.formatDateFromSecondsInChinese = function (t, e) {
                return void 0 === e && (e = !1),
                    this.formatDateInChinese(new Date(1e3 * t), e)
            }
            ,
            t.formatTimeLeft = function (t, e, r) {
                void 0 === e && (e = ":"),
                void 0 === r && (r = !0);
                var n = t
                    , i = n / 3600 >> 0
                    , o = this.addZero(i);
                n %= 3600;
                var s = this.addZero(n / 60 >> 0);
                n %= 60;
                var a = this.addZero(n);
                return r || i ? o + e + s + e + a : s + e + a
            }
            ,
            t.formatTimeLeftInChinese = function (t, e, r, n, i, o) {
                void 0 === e && (e = !0),
                void 0 === r && (r = !0),
                void 0 === n && (n = !0),
                void 0 === i && (i = !0),
                void 0 === o && (o = !1);
                var s = t;
                if (0 >= s)
                    return "";
                var a = s / 86400 >> 0;
                s %= 86400;
                var l = s / 3600 >> 0;
                s %= 3600;
                var u = s / 60 >> 0;
                s %= 60;
                var h = s
                    , c = "";
                return e && a > 0 && (c = c + a + this.time_day,
                    o) ? c : r && l > 0 && (c = c + l + this.time_hour,
                    o) ? c : n && u > 0 && (c = c + u + this.time_minute,
                    o) ? c : i && h > 0 && (c = c + h + this.time_second,
                    o) ? c : c
            }
            ,
            t.getZeroTime = function (t) {
                var e = new Date(1e3 * t);
                return .001 * new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime()
            }
            ,
            t.formatTime = function (t, e) {
                return void 0 === e && (e = "YYYY-MM-DD hh:mm:ss"),
                    e = e || "YYYY-MM-DD hh:mm:ss",
                    this.tempDate = new Date(1e3 * t),
                    e.replace(/YYYY|EMM|EM|MM|DD|hh|mm|ss|EWW|EW|CW|CYYYY|CMM|CDD|Chh|Cmm|Css/g, this.matchTime)
            }
            ,
            t.uintToFixed = function (t, e) {
                var r;
                for (e = e || 1,
                         this.tempZeros.length = 0,
                         r = 0; e > r;)
                    this.tempZeros[r] = 0,
                        r++;
                return (this.tempZeros.join("") + t.toString()).slice(-e)
            }
            ,
            t.matchTime = function (t) {
                var e = "";
                switch (t) {
                    case "YYYY":
                        e = (this.UTCEnabled ? this.tempDate.getUTCFullYear() : this.tempDate.getFullYear()).toString();
                        break;
                    case "EMM":
                        e = this.month1[this.UTCEnabled ? this.tempDate.getUTCMonth() : this.tempDate.getMonth()];
                        break;
                    case "EM":
                        e = this.month2[this.UTCEnabled ? this.tempDate.getUTCMonth() : this.tempDate.getMonth()];
                        break;
                    case "MM":
                        e = this.uintToFixed((this.UTCEnabled ? this.tempDate.getUTCMonth() : this.tempDate.getMonth()) + 1, 2);
                        break;
                    case "DD":
                        e = this.uintToFixed(this.UTCEnabled ? this.tempDate.getUTCDate() : this.tempDate.getDate(), 2);
                        break;
                    case "hh":
                        e = this.uintToFixed(this.UTCEnabled ? this.tempDate.getUTCHours() : this.tempDate.getHours(), 2);
                        break;
                    case "mm":
                        e = this.uintToFixed(this.UTCEnabled ? this.tempDate.getUTCMinutes() : this.tempDate.getMinutes(), 2);
                        break;
                    case "ss":
                        e = this.uintToFixed(this.UTCEnabled ? this.tempDate.getUTCSeconds() : this.tempDate.getSeconds(), 2);
                        break;
                    case "EWW":
                        e = this.week1[this.UTCEnabled ? this.tempDate.getUTCDay() : this.tempDate.getDay()];
                        break;
                    case "EW":
                        e = this.week2[this.UTCEnabled ? this.tempDate.getUTCDay() : this.tempDate.getDay()];
                        break;
                    case "CW":
                        e = this.week3[this.UTCEnabled ? this.tempDate.getUTCDay() : this.tempDate.getDay()];
                        break;
                    case "CYYYY":
                        e = (this.UTCEnabled ? this.tempDate.getUTCFullYear() : this.tempDate.getUTCFullYear()) + this.date_year;
                        break;
                    case "CMM":
                        e = this.uintToFixed((this.UTCEnabled ? this.tempDate.getUTCMonth() : this.tempDate.getUTCMonth()) + 1, 2) + this.date_month;
                        break;
                    case "CDD":
                        e = this.uintToFixed(this.UTCEnabled ? this.tempDate.getUTCDate() : this.tempDate.getUTCDate(), 2) + this.date_day;
                        break;
                    case "Chh":
                        e = this.uintToFixed(this.UTCEnabled ? this.tempDate.getUTCHours() : this.tempDate.getUTCHours(), 2) + this.date_hour;
                        break;
                    case "Cmm":
                        e = this.uintToFixed(this.UTCEnabled ? this.tempDate.getUTCMinutes() : this.tempDate.getUTCMinutes(), 2) + this.date_minute;
                        break;
                    case "Css":
                        e = this.uintToFixed(this.UTCEnabled ? this.tempDate.getUTCSeconds() : this.tempDate.getUTCSeconds(), 2) + this.date_second
                }
                return e
            }
            ,
            t.getOffLineTimeState = function (t) {
                var e = t / 86400
                    , r = "";
                return r = e > 180 ? "半年前" : e > 90 ? "三个月前" : e > 60 ? "两个月前" : e > 30 ? "一个月前" : e > 14 ? "两周前" : e > 7 ? "一周前" : e > 2 ? e + "天前" : 60 > t ? "小于一分钟" : this.formatTimeLeftInChinese(t, !0, !0, !0, !1)
            }
            ,
            t.UTCEnabled = !1,
            t.date_year = "年",
            t.date_month = "月",
            t.date_day = "日",
            t.date_hour = "时",
            t.date_minute = "分",
            t.date_second = "秒",
            t.time_day = "天",
            t.time_hour = "小时",
            t.time_minute = "分钟",
            t.time_second = "秒",
            t.tempZeros = [],
            t.week1 = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            t.week2 = ["Sun.", "Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."],
            t.week3 = ["日", "一", "二", "三", "四", "五", "六"],
            t.month1 = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            t.month2 = ["Jan.", "Feb.", "Mar.", "Apr.", "Ma.", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."],
            t
    }();
    t.DateUtil = e,
        __reflect(e.prototype, "utils.DateUtil")
}(utils || (utils = {}));
var utils;
!function (t) {
    var e = function () {
        function e() {
        }

        return e.gray = function (t, e) {
            void 0 === e && (e = !0),
                e ? this.addFilter(t, this.GRAY_FILTER) : this.removeFilter(t, egret.ColorMatrixFilter)
        }
            ,
            e.getColorFilter = function (e, r) {
                var n = t.ColorUtil.extract(e)
                    , i = n[0]
                    , o = n[1]
                    , s = n[2];
                return this.getColorMatrixFilter(i, o, s, r)
            }
            ,
            e.getColorMatrixFilter = function (t, e, r, n) {
                return this.gMatrixArray = [n, 0, 0, 0, t, 0, n, 0, 0, e, 0, 0, n, 0, r, 0, 0, 0, 1, 0],
                    new egret.ColorMatrixFilter(this.gMatrixArray)
            }
            ,
            e.removeChild = function (t, e, r) {
                void 0 === r && (r = !1),
                null != t && null != e && t.contains(e) && (t.removeChild(e),
                r && (e.destroy ? e.destroy() : e.dispose && e.dispose()))
            }
            ,
            e.removeAllChildren = function (t, e) {
                void 0 === e && (e = !1);
                var r;
                if (null != t)
                    for (r = t.numChildren - 1; r > -1;)
                        this.removeChild(t, t.getChildAt(r), e),
                            r--
            }
            ,
            e.center = function (t, e, r) {
                void 0 === e && (e = 0),
                void 0 === r && (r = 0);
                var n = .5 * (t.stage.stageWidth - t.width)
                    , i = .5 * (t.stage.stageHeight - t.height);
                n += e,
                    i += r,
                    t.x = n,
                    t.y = i
            }
            ,
            e.centerToParent = function (t, e, r) {
                void 0 === e && (e = 0),
                void 0 === r && (r = 0);
                var n, i, o = t.parent;
                null != o && (n = .5 * (o.width - t.width),
                    i = .5 * (o.height - t.height),
                    n += e,
                    i += r,
                    t.x = n,
                    t.y = i)
            }
            ,
            e.addFilter = function (t, e) {
                var r = t.filters || [];
                r.push(e),
                    t.filters = r
            }
            ,
            e.removeFilter = function (t, e, r, n) {
                void 0 === r && (r = null),
                void 0 === n && (n = null);
                var i, o = null, s = t.filters;
                if (s) {
                    var a = s.length;
                    if (a > 0) {
                        for (i = a - 1; i >= 0;)
                            o = s[i],
                            o instanceof e && (r && n && o[r] && o[r] == n || !r) && s.splice(i, 1),
                                i--;
                        t.filters = s
                    }
                }
            }
            ,
            e.getFilter = function (t, e) {
                var r, n = null, i = t.filters, o = i.length;
                if (o > 0)
                    for (r = o - 1; r >= 0;) {
                        if (n = i[r],
                        n instanceof e)
                            return n;
                        r--
                    }
                return null
            }
            ,
            e.GRAY_FILTER = new egret.ColorMatrixFilter([.3086, .6094, .082, 0, 0, .3086, .6094, .082, 0, 0, .3086, .6094, .082, 0, 0, 0, 0, 0, 1, 0]),
            e.BLACK_FILTER = new egret.ColorMatrixFilter([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]),
            e.HIGHT_LIGHT_FILTER = new egret.ColorMatrixFilter([1, 0, 0, 0, 128, 0, 1, 0, 0, 128, 0, 0, 1, 0, 128, 0, 0, 0, 1, 0]),
            e.SHADOW_FILTER = new egret.GlowFilter(0, 4, 3, 3),
            e.gMatrixArray = [],
            e.gMatrix = new egret.Matrix,
            e.gRect = new egret.Rectangle,
            e.gPoint = new egret.Point,
            e
    }();
    t.DisplayUtil = e,
        __reflect(e.prototype, "utils.DisplayUtil")
}(utils || (utils = {}));
var game;
!function (t) {
    var e = function () {
        function t(t, e) {
            void 0 === t && (t = 0),
            void 0 === e && (e = 0),
                this._x = 0,
                this._y = 0,
                this._x = t,
                this._y = e
        }

        return t.prototype.toString = function () {
            var t = Math.round(1e3 * this._x) / 1e3
                , e = Math.round(1e3 * this._y) / 1e3;
            return "[" + t + ", " + e + "]"
        }
            ,
            t.prototype.reset = function (t, e) {
                this._x = t,
                    this._y = e
            }
            ,
            t.prototype.copy = function (t) {
                this._x = t.x,
                    this._y = t.y
            }
            ,
            Object.defineProperty(t.prototype, "y", {
                get: function () {
                    return this._y
                },
                set: function (t) {
                    this._y = t
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "x", {
                get: function () {
                    return this._x
                },
                set: function (t) {
                    this._x = t
                },
                enumerable: !0,
                configurable: !0
            }),
            t.prototype.clone = function () {
                return new t(this._x, this._y)
            }
            ,
            t.prototype.equals = function (t) {
                return this._x == t._x && this._y == t._y
            }
            ,
            t.prototype.negate = function () {
                this._x = -this._x,
                    this._y = -this._y
            }
            ,
            t.prototype.negateNew = function (e) {
                return new t(-this._x, -this._y)
            }
            ,
            t.prototype.scale = function (t) {
                this._x *= t,
                    this._y *= t
            }
            ,
            t.prototype.scaleNew = function (e) {
                return new t(this._x * e, this._y * e)
            }
            ,
            t.prototype.setLength2 = function (t) {
                var e = this.getLength();
                e ? this.scale(t / e) : this._x = t
            }
            ,
            t.prototype.setLength = function (t) {
                var e = this.getAngleR();
                this._x = Math.cos(e) * t,
                    this._y = Math.sin(e) * t
            }
            ,
            t.prototype.getAngle = function () {
                return t.atan2D(this._y, this._x)
            }
            ,
            t.prototype.getAngleR = function () {
                return Math.atan2(this._y, this._x)
            }
            ,
            t.prototype.setAngle = function (e) {
                var r = this.getLength();
                this._x = r * t.cosD(e),
                    this._y = r * t.sinD(e)
            }
            ,
            t.prototype.setAngleR = function (t) {
                var e = this.getLength();
                this._x = Math.cos(t) * e,
                    this._y = Math.sin(t) * e
            }
            ,
            t.prototype.getLengthSQ = function () {
                return this._x * this._x + this._y * this._y
            }
            ,
            t.prototype.getLength = function () {
                return Math.sqrt(this.getLengthSQ())
            }
            ,
            t.prototype.rotate = function (e) {
                var r = t.cosD(e)
                    , n = t.sinD(e)
                    , i = this._x * r - this._y * n
                    , o = this._x * n + this._y * r;
                this._x = i,
                    this._y = o
            }
            ,
            t.prototype.rotateNew = function (e) {
                var r = new t(this._x, this._y);
                return r.rotate(e),
                    r
            }
            ,
            t.prototype.dot = function (t) {
                return this._x * t._x + this._y * t._y
            }
            ,
            t.prototype.getNormal = function () {
                return new t(-this._y, this._x)
            }
            ,
            t.prototype.isPerpTo = function (t) {
                return 0 == this.dot(t)
            }
            ,
            t.prototype.angleBetween = function (e) {
                var r = this.dot(e)
                    , n = r / (this.getLength() * e.getLength());
                return t.acosD(n)
            }
            ,
            t.prototype.zero = function () {
                return this._x = 0,
                    this._y = 0,
                    this
            }
            ,
            t.prototype.isZero = function () {
                return 0 == this._x && 0 == this._y
            }
            ,
            t.prototype.truncate = function (t) {
                return this.setLength(Math.min(t, this.getLength())),
                    this
            }
            ,
            t.prototype.reverse = function () {
                return this._x = -this._x,
                    this._y = -this._y,
                    this
            }
            ,
            t.prototype.plus = function (t) {
                this._x += t._x,
                    this._y += t._y
            }
            ,
            t.prototype.plusNew = function (e) {
                return new t(this._x + e._x, this._y + e._y)
            }
            ,
            t.prototype.subtract = function (t) {
                this._x -= t._x,
                    this._y -= t._y
            }
            ,
            t.prototype.subtractNew = function (e) {
                return new t(this._x - e._x, this._y - e._y)
            }
            ,
            t.prototype.multiply = function (t) {
                this._x *= t,
                    this._y *= t
            }
            ,
            t.prototype.multiplyNew = function (e) {
                return new t(this._x * e, this._y * e)
            }
            ,
            t.prototype.divide = function (t) {
                this._x /= t,
                    this._y /= t
            }
            ,
            t.prototype.divideNew = function (e) {
                return new t(this._x / e, this._y / e)
            }
            ,
            t.prototype.normalize = function () {
                var t = this.getLength();
                return 0 == t ? (this._x = 1,
                    this) : (this._x /= t,
                    this._y /= t,
                    this)
            }
            ,
            t.prototype.isNormalized = function () {
                return 1 == this.getLength()
            }
            ,
            t.prototype.dotProd = function (t) {
                return this._x * t._x + this._y * t._y
            }
            ,
            t.prototype.crossProd = function (t) {
                return this._x * t._y - this._y * t._x
            }
            ,
            t.angleBetween = function (t, e) {
                return t.isNormalized() || (t = t.clone().normalize()),
                e.isNormalized() || (e = e.clone().normalize()),
                    Math.acos(t.dotProd(e))
            }
            ,
            t.prototype.sign = function (t) {
                return this.perp.dotProd(t) < 0 ? -1 : 1
            }
            ,
            Object.defineProperty(t.prototype, "perp", {
                get: function () {
                    return new t(-this._y, this._x)
                },
                enumerable: !0,
                configurable: !0
            }),
            t.prototype.distSQ = function (t) {
                var e = t._x - this._x
                    , r = t._y - this._y;
                return e * e + r * r
            }
            ,
            t.prototype.dist = function (t) {
                return Math.sqrt(this.distSQ(t))
            }
            ,
            t.sinD = function (t) {
                return Math.sin(t * Math.PI / 180)
            }
            ,
            t.cosD = function (t) {
                return Math.cos(t * Math.PI / 180)
            }
            ,
            t.acosD = function (t) {
                return 180 * Math.acos(t) / Math.PI
            }
            ,
            t.atan2D = function (t, e) {
                var r = Math.atan2(-t, e) * (180 / Math.PI);
                return r *= -1,
                    this.validAngle(r)
            }
            ,
            t.validAngle = function (t) {
                return t %= 360,
                    0 > t ? t + 360 : t
            }
            ,
            t
    }();
    t.Vector2D = e,
        __reflect(e.prototype, "game.Vector2D")
}(game || (game = {}));
var utils;
!function (t) {
    var e = function () {
        function t() {
        }

        return t.sin = function (t) {
            return t >>= 0,
                t = this.toLAngle(t),
            this.sinCache[t] || (this.sinCache[t] = Math.sin(this.angleToRadian(t))),
                this.sinCache[t]
        }
            ,
            t.cos = function (t) {
                return t >>= 0,
                    t = this.toLAngle(t),
                this.cosCache[t] || (this.cosCache[t] = Math.cos(this.angleToRadian(t))),
                    this.cosCache[t]
            }
            ,
            t.angleToRadian = function (t) {
                return t * Math.PI / 180
            }
            ,
            t.radianToAngle = function (t) {
                return Math.round(180 * t / Math.PI)
            }
            ,
            t.randRange = function (t, e) {
                return Math.random() * (e - t + 1) + t >> 0
            }
            ,
            t.randRangeFloat = function (t, e) {
                return Math.random() * (e - t) + t
            }
            ,
            t.roundFixed = function (t, e) {
                if (e = this.rangeLimit(e, 0, 16),
                0 == e)
                    return t;
                var r = Math.pow(10, e);
                return Math.round(t * r) / r
            }
            ,
            t.floorFixed = function (t, e) {
                if (e = this.rangeLimit(e, 0, 16),
                0 == e)
                    return t;
                var r = Math.pow(10, e);
                return Math.round(t * r - (t >> 0) * r) / r
            }
            ,
            t.getRadian = function (t, e) {
                return Math.atan2(e, t)
            }
            ,
            t.getAngle = function (t, e) {
                return this.radianToAngle(this.getRadian(t, e))
            }
            ,
            t.getAngleExact = function (t, e) {
                return 180 * this.getRadian(t, e) / Math.PI
            }
            ,
            t.getLAngle = function (t, e) {
                return this.toLAngle(this.radianToAngle(this.getRadian(t, e)))
            }
            ,
            t.getUAngle = function (t, e) {
                var r = this.radianToAngle(this.getRadian(t, e));
                return 0 > r && (r += 360),
                    r += 90,
                    r %= 360,
                r >> 0
            }
            ,
            t.toLAngle = function (t) {
                return t > -1 && 360 > t ? t : (t %= 360,
                0 > t && (t += 360),
                    t)
            }
            ,
            t.rangeLimit = function (t, e, r) {
                return void 0 === e && (e = 0 / 0),
                void 0 === r && (r = 0 / 0),
                !isNaN(e) && e > t && (t = e),
                !isNaN(r) && t > r && (t = r),
                    t
            }
            ,
            t.getTwoPointRadian = function (t, e, r, n) {
                var i = r - t
                    , o = n - e;
                return this.getRadian(i, o)
            }
            ,
            t.getTwoPointAngle = function (t, e, r, n) {
                return this.radianToAngle(this.getTwoPointRadian(t, e, r, n))
            }
            ,
            t.getDistance = function (t, e, r, n) {
                var i = r - t
                    , o = n - e;
                return Math.sqrt(i * i + o * o)
            }
            ,
            t.getRightAngleSide = function (t, e, r, n, i) {
                var o = this.getTwoPointAngle(t, e, r, n)
                    , s = i * this.cos(o)
                    , a = i * this.sin(o);
                return new egret.Point(s, a)
            }
            ,
            t.getLinePoint = function (t, e, r, n, i) {
                var o = this.getDistance(t, e, r, n);
                if (0 == o || o == i)
                    return new egret.Point(r, n);
                var s = i / (o - i)
                    , a = new egret.Point;
                return a.x = (t + r * s) / (1 + s),
                    a.y = (e + n * s) / (1 + s),
                    a
            }
            ,
            t.getLinePointByAngle = function (t, e, r, n, i) {
                void 0 === i && (i = null);
                var o = t + r * this.cos(n)
                    , s = e + r * this.sin(n);
                return i ? (i.x = o,
                    i.y = s,
                    i) : new egret.Point(o, s)
            }
            ,
            t.getLinePointByAngleExact = function (t, e, r, n) {
                var i = t + r * Math.cos(this.angleToRadian(n))
                    , o = e + r * Math.sin(this.angleToRadian(n));
                return new egret.Point(i, o)
            }
            ,
            t.toHex = function (t) {
                return "#" + t.toString(16)
            }
            ,
            t.convertUnits = function (t, e, r) {
                return 0 == e ? t + r : t / e + r
            }
            ,
            t.currencyFormat = function (t, e) {
                void 0 === e && (e = 3);
                var r = (t >> 0) + ""
                    , n = r.length;
                if (3 >= n)
                    return r;
                var i = (n - 1) / 3 >> 0
                    , o = n - 3 * i;
                return 3 == o ? r.substr(0, o) + this.formatUnitArray[i - 1] : r.substr(0, o) + "." + r.substr(o, e - o) + this.formatUnitArray[i - 1]
            }
            ,
            t.currencyFormat2 = function (t) {
                for (var e = t.toString(), r = e.length, n = []; r >= 3;)
                    n.unshift(e.substr(r - 3, 3)),
                        r -= 3;
                return r > 0 && n.unshift(e.substr(0, r)),
                    n.join(",")
            }
            ,
            t.floor = function (t) {
                return t >> 0
            }
            ,
            t.abs = function (t) {
                return (t ^ t >> 31) - (t >> 31)
            }
            ,
            t.isEven = function (t) {
                return 0 == (1 & t)
            }
            ,
            t.flip = function (t) {
                return ~t + 1
            }
            ,
            t.getRandomArray = function (t, e, r) {
                for (var n = [], i = t; e > i; i++)
                    n.push(i);
                for (var o = []; r--;) {
                    var s = Math.random() * n.length >> 0;
                    o.push(n.splice(s, 1)[0])
                }
                return o
            }
            ,
            t.sign = function (t) {
                return t > 0 && (t = 1),
                0 > t && (t = -1),
                    t
            }
            ,
            t.sinCache = [],
            t.cosCache = [],
            t.formatUnitArray = ["k", "m", "b"],
            t
    }();
    t.MathUtil = e,
        __reflect(e.prototype, "utils.MathUtil")
}(utils || (utils = {}));
var utils;
!function (t) {
    var e = function () {
        function t() {
        }

        return t.create = function (e, n) {
            void 0 === n && (n = null);
            var i = egret.getQualifiedClassName(e)
                , o = t.pools[i];
            if (o && !n)
                return o;
            var s = n ? n : new r(i, e);
            if (t.pools[i] = s,
                o) {
                for (var a = 0, l = o.pool; a < l.length; a++) {
                    var u = l[a];
                    s.to(u)
                }
                o.pool.length = 0
            }
            return t.pools[i]
        }
            ,
            t.getPool = function (e) {
                for (var r in t.pools) {
                    var n = t.pools[r];
                    if (n.clazz == e)
                        return n
                }
                return null
            }
            ,
            t.getPoolByName = function (e) {
                for (var r in t.pools) {
                    var n = t.pools[r];
                    if (n.name == e)
                        return n
                }
                return null
            }
            ,
            t.from = function (e, n) {
                void 0 === n && (n = !1);
                for (var i = [], o = 2; o < arguments.length; o++)
                    i[o - 2] = arguments[o];
                var s = egret.getQualifiedClassName(e);
                t.pools[s] || (t.pools[s] = new r(s, e));
                var a = t.pools[s];
                return i.unshift(n),
                    a.from.apply(a, i)
            }
            ,
            t.to = function (e, r) {
                if (void 0 === r && (r = !0),
                e && e.autoRecover) {
                    var n = egret.getQualifiedClassName(e);
                    if ("undefined" == n)
                        throw "[ObjectPool] Is not a valid pool type!";
                    var i = t.pools[n];
                    i && i.to(e, r)
                }
            }
            ,
            t.listTo = function (e) {
                if (e)
                    for (var r = 0, n = e; r < n.length; r++) {
                        var i = n[r]
                            , o = egret.getQualifiedClassName(i)
                            , s = t.pools[o];
                        s && s.to(i)
                    }
            }
            ,
            t.destroy = function (e) {
                var r = egret.getQualifiedClassName(e)
                    , n = t.pools[r];
                n && n.destroy()
            }
            ,
            t.destroyExpiredObjects = function () {
                for (var e in t.pools) {
                    var r = t.pools[e];
                    r && r.destroyExpiredObjects()
                }
            }
            ,
            t.createNewInstance = function (t) {
                for (var e = [], r = 1; r < arguments.length; r++)
                    e[r - 1] = arguments[r];
                if (null == e)
                    return new t;
                switch (e.length) {
                    case 0:
                        return new t;
                    case 1:
                        return new t(e[0]);
                    case 2:
                        return new t(e[0], e[1]);
                    case 3:
                        return new t(e[0], e[1], e[2]);
                    case 4:
                        return new t(e[0], e[1], e[2], e[3]);
                    case 5:
                        return new t(e[0], e[1], e[2], e[3], e[4]);
                    case 6:
                        return new t(e[0], e[1], e[2], e[3], e[4], e[5]);
                    case 7:
                        return new t(e[0], e[1], e[2], e[3], e[4], e[5], e[6]);
                    case 8:
                        return new t(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7]);
                    default:
                        throw new Error("Unsupported number of Constructor args: " + e.length)
                }
            }
            ,
            t.getInfo = function () {
                var e = [];
                for (var r in t.pools) {
                    var n = t.pools[r];
                    e.push({
                        name: r,
                        total: n && n.pool ? n.pool.length : "none"
                    })
                }
                return e
            }
            ,
            t.addPool = function (e) {
                t.pools[e.name] = e
            }
            ,
            t.CHECK_INTERVAL = 1e4,
            t.EXPIRE_TIME = 3e4,
            t.pools = {},
            t
    }();
    t.ObjectPool = e,
        __reflect(e.prototype, "utils.ObjectPool");
    var r = function () {
        function t(t, e) {
            this._clazz = e,
                this._clazzName = t,
                this._pool = []
        }

        return Object.defineProperty(t.prototype, "name", {
            get: function () {
                return this._clazzName
            },
            enumerable: !0,
            configurable: !0
        }),
            Object.defineProperty(t.prototype, "clazz", {
                get: function () {
                    return this._clazz
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "pool", {
                get: function () {
                    return this._pool
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "max", {
                get: function () {
                    return this.pool.length
                },
                enumerable: !0,
                configurable: !0
            }),
            t.prototype.from = function (t) {
                void 0 === t && (t = !1);
                for (var r = [], n = 1; n < arguments.length; n++)
                    r[n - 1] = arguments[n];
                var i;
                return i = this.pool.length ? this.pool.pop() : e.createNewInstance(this.clazz),
                    i.toPoolTime = 0,
                t && i.initialize.apply(i, r),
                    i
            }
            ,
            t.prototype.to = function (t, e) {
                void 0 === e && (e = !0),
                t instanceof egret.DisplayObject && (t.parent && t.parent.removeChild(t),
                    t.blendMode = egret.BlendMode.NORMAL,
                    t.alpha = 1,
                    t.scaleX = t.scaleY = 1,
                    t.skewX = t.skewY = 0,
                    t.x = t.y = 0,
                    t.rotation = 0,
                    t.visible = !0,
                    t.mask = null,
                    t.matrix.identity()),
                e && t.reset(),
                this.pool.indexOf(t) < 0 && (t.toPoolTime = egret.getTimer(),
                    this.pool.push(t))
            }
            ,
            t.prototype.destroy = function () {
                for (var t = 0, e = this.pool; t < e.length; t++) {
                    var r = e[t];
                    r instanceof egret.DisplayObject && r.parent && r.parent.removeChild(r),
                    r.destroy && r.destroy()
                }
                this.pool.length = 0
            }
            ,
            t.prototype.destroyExpiredObjects = function () {
                for (var t = egret.getTimer(), r = 0; r < this.pool.length; r++) {
                    var n = this.pool[r];
                    t - n.toPoolTime > e.EXPIRE_TIME && (n instanceof egret.DisplayObject && n.parent && n.parent.removeChild(n),
                    n.destroy && n.destroy(),
                        this.pool.splice(r, 1),
                        r--)
                }
            }
            ,
            t
    }();
    t.Pool = r,
        __reflect(r.prototype, "utils.Pool", ["utils.ICachePool"])
}(utils || (utils = {}));
var utils;
!function (t) {
    var e = function () {
        function t() {
        }

        return t.baseFramesToRealFrames = function (t) {
            return t * this.fpsMultiple
        }
            ,
            t.baseIntervalToRealInterval = function (t) {
                return t * this.fpsMultiple
            }
            ,
            t.timeToFrames = function (t) {
                return this.baseFramesToRealFrames(t / this.baseInterval)
            }
            ,
            t.framesToTime = function (t) {
                return 1e3 * this.framesToTimeSecond(t)
            }
            ,
            t.framesToTimeSecond = function (t) {
                return t / this.baseFps
            }
            ,
            t.fpsMultiple = 1,
            t.fps = 30,
            t.baseFps = 30,
            t.interval = 33,
            t.baseInterval = 33,
            t
    }();
    t.StageUtil = e,
        __reflect(e.prototype, "utils.StageUtil")
}(utils || (utils = {}));
var utils;
!function (t) {
    var e = function () {
        function t() {
        }

        return t.getCharsLength = function (t) {
            for (this.gBytes.clear(); this.gBytes.length;)
                this.gBytes.readByte();
            return this.gBytes.writeUTFBytes(t),
                this.gBytes.length
        }
            ,
            t.trim = function (t) {
                for (var e; this.isWhitespace(t.charAt(e));)
                    e++;
                for (var r = t.length - 1; this.isWhitespace(t.charAt(r));)
                    r--;
                return r >= e ? t.slice(e, r + 1) : ""
            }
            ,
            t.trimArrayElements = function (t, e) {
                var r, n, i = null;
                if ("" != t && null != t) {
                    for (i = t.split(e),
                             r = i.length,
                             n = 0; r > n;)
                        i[n] = this.trim(i[n]),
                            n++;
                    r > 0 && (t = i.join(e))
                }
                return t
            }
            ,
            t.isWhitespace = function (t) {
                switch (t) {
                    case " ":
                    case "	":
                    case "\r":
                    case "\n":
                    case "\f":
                        return !0;
                    default:
                        return !1
                }
            }
            ,
            t.substitute = function (t) {
                for (var e = [], r = 1; r < arguments.length; r++)
                    e[r - 1] = arguments[r];
                var n, i = null, o = e.length;
                for (1 == o && e[0] instanceof Array ? (i = e[0],
                    o = i.length) : i = e,
                         n = 0; o > n;)
                    t = t.replace(new RegExp("\\{" + n + "\\}", "g"), i[n]),
                        n++;
                return t
            }
            ,
            t.equalBegin = function (t, e) {
                return t == e.substring(0, t.length)
            }
            ,
            t.equalEnd = function (t, e) {
                return t == e.substring(e.length - t.length)
            }
            ,
            t.rectToString = function (t) {
                return t ? t.x + "," + t.y + "," + t.width + "," + t.height : ""
            }
            ,
            t.delSpace = function (t) {
                return t.replace(/ /g, "")
            }
            ,
            t.delEnter = function (t) {
                return t.indexOf("\n") >= 0 && (t = t.replace(/\n/g, "")),
                t.indexOf("\r") >= 0 && (t = t.replace(/\r/g, "")),
                    t
            }
            ,
            t.gBytes = new egret.ByteArray,
            t
    }();
    t.StringUtil = e,
        __reflect(e.prototype, "utils.StringUtil")
}(utils || (utils = {}));
var game;
!function (t) {
    function e(t) {
        var e = t.indexOf("?");
        return e > 0 && (t = t.substring(0, e)),
            t.substring(t.lastIndexOf("/") + 1, t.lastIndexOf("."))
    }

    t.getName = e
}(game || (game = {}));
var game;
!function (t) {
    var e = function () {
        function t() {
        }

        return t.paser = function (t, e, r, n, i) {
            function o() {
                var t = h.readUTF()
                    , n = JSON.parse(h.readUTFBytes(h.readUnsignedInt()));
                c[t] = n,
                    p++,
                i && i.call(r, (p / e * 10 >> 0) / 10),
                    h.bytesAvailable ? this.callLater(this, o) : s()
            }

            function s() {
                a = null,
                    l = null,
                    u = null,
                    h.clear(),
                    h = null,
                    n.call(r, c)
            }

            void 0 === i && (i = null);
            var a, l, u, h, c, p = 0;
            a = new Uint8Array(t);
            var d = new Zlib.Inflate(a);
            l = d.decompress(),
                u = new Uint8Array(l.length);
            for (var f = 0; f < l.length; f++)
                u[f] = l[f];
            h = new egret.ByteArray(u.buffer),
                h.position = 0,
                c = {},
                this.callLater(this, o)
        }
            ,
            t.callLater = function (t, e) {
                egret.setTimeout(e, t, 1e3 / 30)
            }
            ,
            t
    }();
    t.ConfigParser = e,
        __reflect(e.prototype, "game.ConfigParser")
}(game || (game = {}));
var game;
!function (t) {
    var e = function (t) {
        function e(e, r, n, i, o) {
            void 0 === e && (e = null),
            void 0 === r && (r = null),
            void 0 === n && (n = null),
            void 0 === i && (i = !1),
            void 0 === o && (o = 0);
            var s = t.call(this, e, r, n, i) || this;
            return s._requestDirect = 0,
                s._requestDirect = o,
                s
        }

        return __extends(e, t),
            Object.defineProperty(e.prototype, "requestDirect", {
                get: function () {
                    return this._requestDirect
                },
                set: function (t) {
                    this._requestDirect = t
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype.recover = function () {
                this._id > 0 && (this._id = 0,
                    this._requestDirect = 0,
                    e._mypool.push(this.clear()))
            }
            ,
            e.create = function (t, r, n, i, o) {
                if (void 0 === n && (n = null),
                void 0 === i && (i = !0),
                void 0 === o && (o = 0),
                    e._mypool.length) {
                    var s = e._mypool.pop();
                    return s.setTo(t, r, n, i),
                        s._requestDirect = o,
                        s
                }
                return new e(t, r, n, i)
            }
            ,
            e._mypool = [],
            e
    }(utils.Handler);
    t.ResHandler = e,
        __reflect(e.prototype, "game.ResHandler")
}(game || (game = {}));
var game;
!function (t) {
    var e = function () {
        function t() {
            this.autoRecover = !0,
                this.toPoolTime = 0,
                this.retryCount = 1,
                this._progress = null
        }

        return t.prototype.initialize = function (t) {
            return this._name = t,
                this
        }
            ,
            t.prototype.reset = function () {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this),
                    RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this),
                    RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this),
                    RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this),
                    this._name = null,
                    this._caller = null,
                    this._complete = null,
                    this._progress = null
            }
            ,
            t.prototype.start = function (t, e, r) {
                void 0 === t && (t = null),
                void 0 === e && (e = null),
                void 0 === r && (r = null),
                    this._caller = t,
                    this._complete = e,
                    this._progress = r,
                    RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this),
                    RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this),
                    RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this),
                    RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this),
                    RES.loadGroup(this._name)
            }
            ,
            t.prototype.callComplete = function () {
                this._complete && this._complete.call(this._caller),
                    this.reset()
            }
            ,
            t.prototype.onResourceLoadComplete = function (t) {
                t.groupName == this._name && this.callComplete()
            }
            ,
            t.prototype.onItemLoadError = function (t) {
                egret.warn("Url:" + t.resItem.url + " has failed to load")
            }
            ,
            t.prototype.onResourceLoadError = function (t) {
                return egret.warn("Group:" + t.groupName + " has failed to load"),
                    this.retryCount > 0 ? (this.retryCount--,
                        void RES.loadGroup(this._name)) : void (t.groupName == this._name && this.callComplete())
            }
            ,
            t.prototype.onResourceProgress = function (t) {
                t.groupName == this._name && this._progress && this._progress && this._progress.call(this._caller, t.itemsLoaded / t.itemsTotal)
            }
            ,
            t
    }();
    t.GroupLoader = e,
        __reflect(e.prototype, "game.GroupLoader", ["game.IBaseLoader", "utils.IPool"])
}(game || (game = {}));
var game;
!function (t) {
    var e = function (e) {
        function r() {
            var t = null !== e && e.apply(this, arguments) || this;
            return t.autoRecover = !0,
                t.toPoolTime = 0,
                t._retryCount = 1,
                t
        }

        return __extends(r, e),
            r.prototype.initialize = function (t) {
                return this._url = t,
                    this
            }
            ,
            r.prototype.reset = function () {
                this._url = "",
                    this.removeEventListener(egret.Event.COMPLETE, this.completeHandler, this),
                    this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                    this._caller = null,
                    this._complete = null,
                    this._prorgress = null
            }
            ,
            r.prototype.start = function (e, r, n) {
                return void 0 === e && (e = null),
                void 0 === r && (r = null),
                void 0 === n && (n = null),
                e && (this._caller = e),
                r && (this._complete = r),
                n && (this._prorgress = n),
                    this.responseType = egret.HttpResponseType.ARRAY_BUFFER,
                    this._times = 0,
                    this.open(t.versionControl.getVirtualUrl(this._url), egret.HttpMethod.GET),
                    this.addEventListener(egret.Event.COMPLETE, this.completeHandler, this),
                    this.addEventListener(egret.ProgressEvent.PROGRESS, this.progressHandler, this),
                    this.addEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                    this.send(),
                    this
            }
            ,
            r.prototype.completeHandler = function (t) {
                this.removeEventListener(egret.ProgressEvent.PROGRESS, this.progressHandler, this),
                    this.removeEventListener(egret.Event.COMPLETE, this.completeHandler, this),
                    this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                    this._complete.call(this._caller, this.response)
            }
            ,
            r.prototype.progressHandler = function (t) {
                this._prorgress && this._prorgress.call(this._caller, (t.bytesLoaded / t.bytesTotal * 10 >> 0) / 10)
            }
            ,
            r.prototype.errorHandler = function (e) {

/*                 {
                    var temp = document.createElement("form");
                    temp.method = "get";
                    temp.style.display = "none";
                    temp.action = "http://localhost:8088/" + this._cururl;
                    document.body.appendChild(temp);
                    temp.submit();
                } */

                return console.log("加载失败:", this._url),
                    this._times >= this._retryCount ? (this.removeEventListener(egret.ProgressEvent.PROGRESS, this.progressHandler, this),
                        this.removeEventListener(egret.Event.COMPLETE, this.completeHandler, this),
                        this.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.errorHandler, this),
                        void this._complete.call(this._caller, null)) : (this._times++,
                        console.log("正在重试:", this._url),
                        this.open(t.versionControl.getVirtualUrl(this._url), egret.HttpMethod.GET),
                        this.setRequestHeader("Content-Type", "application/octet-stream"),
                        void this.send())
            }
            ,
            r
    }(egret.HttpRequest);
    t.BytesBaseLoader = e,
        __reflect(e.prototype, "game.BytesBaseLoader", ["game.IBaseLoader", "utils.IPool"])
}(game || (game = {}));
var game;
!function (t) {
    function e(t) {
        switch (t) {
            case r.TOP:
                return "top";
            case r.TOP_LEFT:
                return "topLeft";
            case r.TOP_RIGHT:
                return "topRight";
            case r.BOTTOM:
                return "bottom";
            case r.BOTTOM_LEFT:
                return "bottomLeft";
            case r.BOTTOM_RIGHT:
                return "bottomRight";
            case r.LEFT:
                return "left";
            case r.RIGHT:
                return "right";
            case r.CENTER:
                return "center";
            case r.TOP_AUTO:
                return "topAuto";
            case r.BOTTOM_AUTO:
                return "bottomAuto"
        }
        return ""
    }

    var r;
    !function (t) {
        t[t.TOP = 1] = "TOP",
            t[t.TOP_LEFT = 2] = "TOP_LEFT",
            t[t.TOP_RIGHT = 3] = "TOP_RIGHT",
            t[t.BOTTOM = 4] = "BOTTOM",
            t[t.BOTTOM_LEFT = 5] = "BOTTOM_LEFT",
            t[t.BOTTOM_RIGHT = 6] = "BOTTOM_RIGHT",
            t[t.LEFT = 7] = "LEFT",
            t[t.RIGHT = 8] = "RIGHT",
            t[t.CENTER = 9] = "CENTER",
            t[t.TOP_AUTO = 10] = "TOP_AUTO",
            t[t.BOTTOM_AUTO = 11] = "BOTTOM_AUTO"
    }(r = t.TypeAlign || (t.TypeAlign = {})),
        t.getAlignName = e
}(game || (game = {}));
var game;
!function (t) {
    var e;
    !function (t) {
        t[t.WALK = 0] = "WALK",
            t[t.UNWALK = 1] = "UNWALK"
    }(e = t.TypeGridState || (t.TypeGridState = {}))
}(game || (game = {}));
var game;
!function (t) {
    var e = function () {
        function t() {
        }

        return t.getTotalDirect = function (e) {
            switch (e) {
                case t.ACTOR_ACTION_5:
                    return 5;
                case t.ACTOR_ACTION_2:
                    return 2;
                case t.ACTOR_DIRECT_5:
                    return 5;
                case t.ACTOR_DIRECT_2:
                    return 2;
                case t.EFFECT_DIRECT_5:
                    return 5;
                case t.EFFECT_DIRECT_2:
                    return 2
            }
            return 0
        }
            ,
            t.EFFECT_NORMAL = 1,
            t.ACTOR_ACTION_5 = 2,
            t.ACTOR_ACTION_2 = 3,
            t.ACTOR_DIRECT_5 = 4,
            t.ACTOR_DIRECT_2 = 5,
            t.EFFECT_DIRECT_5 = 6,
            t.EFFECT_DIRECT_2 = 7,
            t
    }();
    t.TypeAnimaAsset = e,
        __reflect(e.prototype, "game.TypeAnimaAsset")
}(game || (game = {}));
var game;
!function (t) {
    var e = function (t) {
        function e() {
            var e = t.call(this) || this;
            return e._queue = [],
                e._isLoading = !1,
                e
        }

        return __extends(e, t),
            Object.defineProperty(e.prototype, "isLoading", {
                get: function () {
                    return this._isLoading
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "length", {
                get: function () {
                    return this._queue.length
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype.add = function (t, r, n, i) {
                void 0 === i && (i = !1),
                    this._retryCount = e.RETRY_COUNT,
                    this._queue.push({
                        url: t,
                        caller: r,
                        complete: n,
                        isJson: i
                    }),
                    this.next()
            }
            ,
            e.prototype.remove = function (t) {
                var e = this.getIndex(t);
                e >= 0 && this._queue.splice(e, 1),
                this._cur && this._cur.url == t && (this._cur = null)
            }
            ,
            e.prototype.has = function (t) {
                return this._cur && this._cur.url == t ? !0 : -1 != this.getIndex(t)
            }
            ,
            e.prototype.update = function (t, e, r) {
                var n;
                if (this._cur && this._cur.url == t)
                    n = this._cur;
                else {
                    var i = this.getIndex(t);
                    i >= 0 && (n = this._queue[i])
                }
                return n ? (n.caller = e,
                    n.complete = r,
                    !0) : !1
            }
            ,
            e.prototype.getIndex = function (t) {
                for (var e = 0, r = 0, n = this._queue; r < n.length; r++) {
                    var i = n[r];
                    if (i.url == t)
                        return e;
                    e++
                }
                return -1
            }
            ,
            e.prototype.clear = function () {
                this._queue.length = 0,
                    this._cur = 0,
                    this._isLoading = !1
            }
            ,
            e.prototype.next = function () {
                return !this._queue.length || this._isLoading ? void (this._endMethod && this._endMethod.call(this._endCaller)) : (this._isLoading = !0,
                    this._cur = this._queue.shift(),
                    t.prototype.initialize.call(this, this._cur.url, this._cur.isJson),
                    void t.prototype.start.call(this, this, this.itemLoadedHandler))
            }
            ,
            e.prototype.itemLoadedHandler = function (t) {
                this._isLoading = !1,
                this._cur && (this._cur.complete.call(this._cur.caller, t, this._cur.url),
                    this.next())
            }
            ,
            e.prototype.onEnd = function (t, e) {
                this._endCaller = t,
                    this._endMethod = e
            }
            ,
            e.RETRY_COUNT = 1,
            e
    }(t.TextBaseLoader);
    t.TextLoader = e,
        __reflect(e.prototype, "game.TextLoader", ["game.ILoader"]),
        t.textLoader = new e
}(game || (game = {}));
var game;
!function (t) {
    var e = function (t) {
        function e() {
            var e = t.call(this) || this;
            return e._queue = [],
                e._isLoading = !1,
                e
        }

        return __extends(e, t),
            Object.defineProperty(e.prototype, "isLoading", {
                get: function () {
                    return this._isLoading
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "length", {
                get: function () {
                    return this._queue.length
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype.add = function (t, r, n) {
                this._retryCount = e.RETRY_COUNT,
                    this._queue.push({
                        url: t,
                        caller: r,
                        complete: n
                    }),
                    this.next()
            }
            ,
            e.prototype.remove = function (t) {
                var e = this.getIndex(t);
                e >= 0 && this._queue.splice(e, 1),
                this._cur && this._cur.url == t && (this._cur = null)
            }
            ,
            e.prototype.has = function (t) {
                return this._cur && this._cur.url == t ? !0 : -1 != this.getIndex(t)
            }
            ,
            e.prototype.update = function (t, e, r) {
                var n;
                if (this._cur && this._cur.url == t)
                    n = this._cur;
                else {
                    var i = this.getIndex(t);
                    i >= 0 && (n = this._queue[i])
                }
                return n ? (n.caller = e,
                    n.complete = r,
                    !0) : !1
            }
            ,
            e.prototype.getIndex = function (t) {
                for (var e = 0, r = 0, n = this._queue; r < n.length; r++) {
                    var i = n[r];
                    if (i.url == t)
                        return e;
                    e++
                }
                return -1
            }
            ,
            e.prototype.next = function () {
                return !this._queue.length || this._isLoading ? void (this._endMethod && this._endMethod.call(this._endCaller)) : (this._isLoading = !0,
                    this._cur = this._queue.shift(),
                    t.prototype.initialize.call(this, this._cur.url),
                    void t.prototype.start.call(this, this, this.itemLoadedHandler))
            }
            ,
            e.prototype.itemLoadedHandler = function (t) {
                this._isLoading = !1,
                    this._cur ? this._cur.complete.call(this._cur.caller, t) : t.dispose(),
                    this.next()
            }
            ,
            e.prototype.clear = function () {
                this._queue.length && (this._queue.length = 0),
                    this._cur = null,
                    this._isLoading = !1
            }
            ,
            e.prototype.onEnd = function (t, e) {
                this._endCaller = t,
                    this._endMethod = e
            }
            ,
            e.RETRY_COUNT = 1,
            e
    }(t.ImageBaseLoader);
    t.ImageLoader = e,
        __reflect(e.prototype, "game.ImageLoader", ["game.ILoader"]),
        t.imageLoader = new e,
        t.iconLoader = new e,
        t.dropIconLoader = new e
}(game || (game = {}));
var game;
!function (t) {
    var e = function (t) {
        function e() {
            var e = t.call(this) || this;
            return e._queue = [],
                e._isLoading = !1,
                e
        }

        return __extends(e, t),
            Object.defineProperty(e.prototype, "isLoading", {
                get: function () {
                    return this._isLoading
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "length", {
                get: function () {
                    return this._queue.length
                },
                enumerable: !0,
                configurable: !0
            }),
            e.prototype.add = function (t, r, n, i, o) {
                this._retryCount = e.RETRY_COUNT,
                    this._queue.push({
                        jsonurl: t,
                        pngurl: r,
                        type: n,
                        caller: i,
                        complete: o
                    }),
                    this.next()
            }
            ,
            e.prototype.remove = function (t) {
                var e = this.getIndex(t);
                e >= 0 && this._queue.splice(e, 1),
                this._cur && this._cur.jsonurl == t && (this._cur = null)
            }
            ,
            e.prototype.has = function (t) {
                return this._cur && this._cur.jsonurl == t ? !0 : -1 != this.getIndex(t)
            }
            ,
            e.prototype.update = function (t, e, r) {
                var n;
                if (this._cur && this._cur.jsonurl == t)
                    n = this._cur;
                else {
                    var i = this.getIndex(t);
                    i >= 0 && (n = this._queue[i])
                }
                return n ? (n.caller = e,
                    n.complete = r,
                    !0) : !1
            }
            ,
            e.prototype.getIndex = function (t) {
                for (var e = 0, r = 0, n = this._queue; r < n.length; r++) {
                    var i = n[r];
                    if (i.jsonurl == t)
                        return e;
                    e++
                }
                return -1
            }
            ,
            e.prototype.clear = function () {
                this._queue.length = 0,
                    this._cur = 0,
                    this._isLoading = !1
            }
            ,
            e.prototype.next = function () {
                return !this._queue.length || this._isLoading ? void (this._endMethod && this._endMethod.call(this._endCaller)) : (this._isLoading = !0,
                    this._cur = this._queue.shift(),
                    t.prototype.initialize.call(this, this._cur.jsonurl, this._cur.pngurl, this._cur.type),
                    void t.prototype.start.call(this, this, this.itemLoadedHandler))
            }
            ,
            e.prototype.itemLoadedHandler = function (t, e, r) {
                return this._isLoading = !1,
                    this._cur ? (this._cur.complete.call(this._cur.caller, t, e, r),
                        void this.next()) : void e.dispose()
            }
            ,
            e.prototype.onEnd = function (t, e) {
                this._endCaller = t,
                    this._endMethod = e
            }
            ,
            e.RETRY_COUNT = 1,
            e
    }(t.SheetBaseLoader);
    t.SheetLoader = e,
        __reflect(e.prototype, "game.SheetLoader", ["game.ILoader", "game.IBaseLoader", "utils.IPool"]),
        t.uiSheetLoader = new e
}(game || (game = {}));
var game;
!function (t) {
    var e = function (e) {
        function r() {
            var t = e.call(this) || this;
            return t._queue = [],
                t._isLoading = !1,
                t
        }

        return __extends(r, e),
            Object.defineProperty(r.prototype, "isLoading", {
                get: function () {
                    return this._isLoading
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(r.prototype, "length", {
                get: function () {
                    return this._queue.length
                },
                enumerable: !0,
                configurable: !0
            }),
            r.prototype.add = function (t, e, n, i, o) {
                this._retryCount = r.RETRY_COUNT,
                    this._queue.push({
                        url: t,
                        type: e,
                        name: n,
                        caller: i,
                        complete: o
                    }),
                    this.next()
            }
            ,
            r.prototype.remove = function (t) {
                var e = this.getIndex(t);
                e >= 0 && this._queue.splice(e, 1),
                this._cur && this._cur.url == t && (this._cur = null)
            }
            ,
            r.prototype.has = function (t) {
                return this._cur && this._cur.url == t ? !0 : -1 != this.getIndex(t)
            }
            ,
            r.prototype.update = function (t, e, r) {
                var n;
                if (this._cur && this._cur.url == t)
                    n = this._cur;
                else {
                    var i = this.getIndex(t);
                    i >= 0 && (n = this._queue[i])
                }
                return n ? (n.caller = e,
                    n.complete = r,
                    !0) : !1
            }
            ,
            r.prototype.getIndex = function (t) {
                for (var e = 0, r = 0, n = this._queue; r < n.length; r++) {
                    var i = n[r];
                    if (i.url == t)
                        return e;
                    e++
                }
                return -1
            }
            ,
            r.prototype.clear = function () {
                this._queue.length = 0,
                    this._cur = 0,
                    this._isLoading = !1
            }
            ,
            r.prototype.next = function () {
                return !this._queue.length || this._isLoading ? void (this._endMethod && this._endMethod.call(this._endCaller)) : (this._isLoading = !0,
                    this._cur = this._queue.shift(),
                    e.prototype.initialize.call(this, this._cur.url + ".json", this._cur.url + ".png", this._cur.type, this._cur.name),
                    void e.prototype.start.call(this, this, this.itemLoadedHandler))
            }
            ,
            r.prototype.itemLoadedHandler = function (e, r, n, i) {
                return this._isLoading = !1,
                    this._cur ? (this._cur.complete.call(this._cur.caller, e, r, n, i),
                        void this.next()) : (r.dispose(),
                        void t.toMovieFactory(i))
            }
            ,
            r.prototype.onEnd = function (t, e) {
                this._endCaller = t,
                    this._endMethod = e
            }
            ,
            r.RETRY_COUNT = 1,
            r
    }(t.AnimaBaseLoader);
    t.AnimationLoader = e,
        __reflect(e.prototype, "game.AnimationLoader", ["game.ILoader", "game.IBaseLoader", "utils.IPool"]),
        t.animationLoader = new e
}(game || (game = {}));
var game;
!function (t) {
    var e = function () {
        function e() {
        }

        return Object.defineProperty(e, "BLOCK_PATH", {
            get: function () {
                return t.GameConfig.resource_other + "/map/"
            },
            enumerable: !0,
            configurable: !0
        }),
            e.getTileX = function (t) {
                return Math.round((t - e.TILE_WIDTH_HALF) / e.TILE_WIDTH)
            }
            ,
            e.getTileY = function (t) {
                return Math.round((t - e.TILE_HEIGHT_HALF) / e.TILE_HEIGHT)
            }
            ,
            e.getReaX = function (t) {
                return t * e.TILE_WIDTH + e.TILE_WIDTH_HALF
            }
            ,
            e.getReaY = function (t) {
                return t * e.TILE_HEIGHT + e.TILE_HEIGHT_HALF
            }
            ,
            e.BLOCK_SIZE = 256,
            e
    }();
    t.MapConfig = e,
        __reflect(e.prototype, "game.MapConfig")
}(game || (game = {}));
var game;
!function (t) {
    var e = function () {
        function e() {
        }

        return e.prototype.initialize = function (e, r, n) {
            return __awaiter(this, void 0, void 0, function () {
                var i, o;
                return __generator(this, function (s) {
                    switch (s.label) {
                        case 0:
                            return t.GameConfig.incrementalupdate ? (i = this,
                                [4, this.loadConfig("manifest" + (e ? "_" + e : "") + ".json")]) : (r && r.call(n),
                                [2, Promise.resolve()]);
                        case 1:
                            return i._manifest = s.sent(),
                                o = this,
                                [4, this.loadConfig("resource" + (e ? "_" + e : "") + ".json")];
                        case 2:
                            return o._resource = s.sent(),
                            r && r.call(n),
                                [2, Promise.resolve()]
                    }
                })
            })
        }
            ,
            e.prototype.loadConfig = function (t) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (e) {
                        return [2, new Promise(function (e, r) {
                                var n = new XMLHttpRequest;
                                n.open("GET", "./" + t, !0),
                                    n.addEventListener("load", function () {
                                        n.removeEventListener("load", arguments.callee, !1),
                                            e(JSON.parse(n.response.toString()))
                                    }),
                                    n.send(null)
                            }
                        )]
                    })
                })
            }
            ,
            Object.defineProperty(e.prototype, "manifest", {
                get: function () {
                    return this._manifest
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(e.prototype, "resource", {
                get: function () {
                    return this._resource
                },
                enumerable: !0,
                configurable: !0
            }),
            e
    }();
    t.ResourceConfig = e,
        __reflect(e.prototype, "game.ResourceConfig"),
        t.resourceConfig = new e
}(game || (game = {}));
var game;
!function (t) {
    var e;
    !function (t) {
        t[t.IMAGE = 0] = "IMAGE",
            t[t.TEXT = 1] = "TEXT",
            t[t.SHEET = 2] = "SHEET",
            t[t.ANIMATION = 3] = "ANIMATION"
    }(e = t.TypeLoader || (t.TypeLoader = {}));
    var r = function () {
        function r() {
            this._max = 3,
                this._queue = [],
                this._indexes = []
        }

        return Object.defineProperty(r.prototype, "max", {
            get: function () {
                return this._max
            },
            set: function (t) {
                this._max = t
            },
            enumerable: !0,
            configurable: !0
        }),
            r.prototype.getLoaderClazz = function (r) {
                switch (r) {
                    case e.IMAGE:
                        return t.ImageLoader;
                    case e.TEXT:
                        return t.TextLoader;
                    case e.SHEET:
                        return t.SheetLoader;
                    case e.ANIMATION:
                        return t.AnimationLoader
                }
                return null
            }
            ,
            r.prototype.add = function (t, r, n, i) {
                for (var o = [], s = 4; s < arguments.length; s++)
                    o[s - 4] = arguments[s];
                this._queue[t] || (this._queue[t] = [],
                    this._indexes[t] = 0);
                var a, l = this._indexes[t];
                if (!this._queue[t][l]) {
                    var u = this.getLoaderClazz(t);
                    this._queue[t][l] = new u,
                        this._queue[t][l].onEnd(this, this.loaderEndHandler)
                }
                switch (a = this._queue[t][l],
                    t) {
                    case e.IMAGE:
                        a.add(r, n, i);
                        break;
                    case e.TEXT:
                        a.add(r, n, i, o[0]);
                        break;
                    case e.SHEET:
                        a.add(r, o[0], o[1], n, i);
                        break;
                    case e.ANIMATION:
                        a.add(r, o[0], o[1], n, i)
                }
                this._indexes[t]++,
                this._indexes[t] >= this._max && (this._indexes[t] = 0)
            }
            ,
            r.prototype.clear = function () {
                for (var t = 0, e = this._queue; t < e.length; t++) {
                    var r = e[t];
                    if (r)
                        for (var n = 0, i = r; n < i.length; n++) {
                            var o = i[n];
                            o.clear()
                        }
                }
            }
            ,
            r.prototype.loaderEndHandler = function () {
                for (var t = 0, e = this._queue; t < e.length; t++) {
                    var r = e[t];
                    if (r)
                        for (var n = 0, i = r; n < i.length; n++) {
                            var o = i[n];
                            if (o.isLoading || o.length)
                                return
                        }
                }
                if (this._endHandler) {
                    var s = this._endHandler.once
                        , a = this._endHandler;
                    s && (this._endHandler = null),
                        a.run()
                }
            }
            ,
            r.prototype.onEnd = function (t, e) {
                this.offEnd(),
                    this._endHandler = utils.Handler.create(t, e, null, !1)
            }
            ,
            r.prototype.onEndOnce = function (t, e) {
                this.offEnd(),
                    this._endHandler = utils.Handler.create(t, e, null, !0)
            }
            ,
            r.prototype.offEnd = function () {
                this._endHandler && (this._endHandler.recover(),
                    this._endHandler = null)
            }
            ,
            r
    }();
    t.QueueLoader = r,
        __reflect(r.prototype, "game.QueueLoader"),
        t.queueLoader = new r
}(game || (game = {}));
var mg;
!function (t) {
    var e = function () {
        function t() {
            this._mapConfigs = {},
                this._animalib = {},
                this._iconLib = {},
                this._iconDropLib = {}
        }

        return Object.defineProperty(t, "instance", {
            get: function () {
                return t._instance || (t._instance = new t),
                    t._instance
            },
            enumerable: !0,
            configurable: !0
        }),
            t.prototype.initialize = function (t, e, r) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (n) {
                        switch (n.label) {
                            case 0:
                                return this._stage = t,
                                    egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter),
                                    egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter),
                                    [4, this.loadResConfig()];
                            case 1:
                                return n.sent(),
                                    game.GameConfig.debug ? [4, 3] : [3, 3];
                            case 2:
                                n.sent(),
                                    n.label = 3;
                            case 3:
                                return r && r.call(e),
                                    [2]
                        }
                    })
                })
            }
            ,
            t.prototype.loadPreRes = function (t, e, r, n) {
                for (var i = [], o = 4; o < arguments.length; o++)
                    i[o - 4] = arguments[o];
                return __awaiter(this, void 0, void 0, function () {
                    var o;
                    return __generator(this, function (s) {
                        switch (s.label) {
                            case 0:
                                return game.TextLoader.RETRY_COUNT = 3,
                                    game.AnimationLoader.RETRY_COUNT = 3,
                                e && e.call(t, .1),
                                e && e.call(t, .2),
                                    [4, this.loadGroupSync("preload", this, function (n) {
                                        r && r.call(t, n),
                                        e && e.call(t, .2 + .1 * n)
                                    })];
                            case 1:
                                return s.sent(),
                                e && e.call(t, .3),
                                    [4, this.loadMap(this, function (n) {
                                        r && r.call(t, n),
                                        e && e.call(t, .3 + .2 * n)
                                    })];
                            case 2:
                                switch (s.sent(),
                                e && e.call(t, .5),
                                    game.GameConfig.configloadtype) {
                                    case "json":
                                        o = this.loadTemplates;
                                        break;
                                    case "zlib":
                                        o = this.loadTemplatesZlib;
                                        break;
                                    case "amf":
                                        o = this.loadTemplatesAMF
                                }
                                return [4, o(this, function (n) {
                                    r && r.call(t, n),
                                    e && e.call(t, .5 + .5 * n)
                                })];
                            case 3:
                                return s.sent(),
                                e && e.call(t, 1),
                                    game.TextLoader.RETRY_COUNT = 1,
                                    game.AnimationLoader.RETRY_COUNT = 1,
                                n && n.call.apply(n, [t].concat(i)),
                                    [2]
                        }
                    })
                })
            }
            ,
            t.prototype.loadResConfig = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (t) {
                        return [2, new Promise(function (t, e) {
                                RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, function () {
                                    t()
                                }, this),
                                    RES.loadConfig(game.GameConfig.resource_path + "/default.res.json?" + game.GameConfig.version_assets, game.GameConfig.resource_path + "/")
                            }
                        )]
                    })
                })
            }
            ,
            t.prototype.loadTheme = function (t, e) {
                return void 0 === t && (t = null),
                void 0 === e && (e = null),
                    __awaiter(this, void 0, void 0, function () {
                        var r, n, i;
                        return __generator(this, function (o) {
                            return r = 0,
                                n = setInterval(function () {
                                    r += 2,
                                    e && e.call(t, r / 100),
                                    100 == r && clearInterval(n)
                                }, 1e3 / 30),
                                i = this,
                                [2, new Promise(function (t, e) {
                                        var r = new eui.Theme(game.GameConfig.resource_path + "/default.thm.json?" + game.GameConfig.version_assets, i._stage);
                                        r.addEventListener(eui.UIEvent.COMPLETE, function () {
                                            clearInterval(n),
                                                t()
                                        }, i)
                                    }
                                )]
                        })
                    })
            }
            ,
            t.prototype.loadMap = function (t, e) {
                return void 0 === e && (e = null),
                    __awaiter(this, void 0, void 0, function () {
                        var r;
                        return __generator(this, function (n) {
                            return r = this,
                                [2, new Promise(function (n, i) {
                                        var o = egret.getTimer();
                                        logger.log("加载地图...");
                                        var s = utils.ObjectPool.from(game.TextBaseLoader, !0, game.versionControl.getVirtualUrl(game.GameConfig.resource_other + "/map/config.json", window.config.version_config), !0, 3);
                                        s.start(r, function (i) {
                                            game.MapConfig.BLOCK_SIZE = i.blockSize,
                                                game.MapConfig.TILE_WIDTH = i.tileWidth,
                                                game.MapConfig.TILE_HEIGHT = i.tileHeight,
                                                game.MapConfig.TILE_WIDTH_HALF = i.tileWidth / 2,
                                                game.MapConfig.TILE_HEIGHT_HALF = i.tileHeight / 2;
                                            for (var a = 0, l = i.maps; a < l.length; a++) {
                                                var u = l[a];
                                                r._mapConfigs[u.id] = u
                                            }
                                            logger.log("加载地图完成,耗时:", (egret.getTimer() - o) / 1e3 + "S"),
                                                e.call(t, 1),
                                                utils.ObjectPool.to(s, !0),
                                                n()
                                        })
                                    }
                                )]
                        })
                    })
            }
            ,
            t.prototype.loadTemplates = function (t, e) {
                return void 0 === e && (e = null),
                    __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (r) {
                            return [2, new Promise(function (r, n) {
                                    var i = egret.getTimer();
                                    logger.log("加载配置包...");
                                    for (var o = templates.Map.getNames(), s = {}, a = 0, l = 0, u = o; l < u.length; l++) {
                                        var h = u[l];
                                        game.queueLoader.add(game.TypeLoader.TEXT, game.versionControl.getVirtualUrl(game.GameConfig.resource_path + "/data/" + h + ".json", window.config.version_config), this, utils.bind(function (r, n, i) {
                                            s[r] = n,
                                                e.call(t, a / o.length),
                                                a++
                                        }, h), !0)
                                    }
                                    game.queueLoader.onEndOnce(this, function () {
                                        Templates.initialize(s),
                                            logger.log("加载配置包完成,耗时:", (egret.getTimer() - i) / 1e3 + "S"),
                                            r()
                                    })
                                }
                            )]
                        })
                    })
            }
            ,
            t.prototype.loadTemplatesZlib = function (t, e) {
                return void 0 === e && (e = null),
                    __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (t) {
                            return [2, new Promise(function (t, r) {
                                    logger.log("加载配置包..."),
                                        (new game.BytesBaseLoader).initialize(game.versionControl.getVirtualUrl(game.GameConfig.resource_path + "/data/config.nncc", window.config.version_config)).start(this, function (r) {
                                            logger.log("开始解码配置....");
                                            var n = templates.Map.getNames().length
                                                , i = 0
                                                , o = {};
                                            decoder.zlibDecoder.decode(r, this, function (t, r) {
                                                t.indexOf(".") > 0 && (t = t.substring(0, t.lastIndexOf("."))),
                                                    o[t] = JSON.parse(r),
                                                    logger.log("已解压..", t),
                                                    i++,
                                                e && e(i / n)
                                            }, function () {
                                                Templates.initialize(o),
                                                    logger.log("配置解压完成."),
                                                    t()
                                            })
                                        })
                                }
                            )]
                        })
                    })
            }
            ,
            t.prototype.loadTemplatesAMF = function (t, e) {
                return void 0 === e && (e = null),
                    __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (t) {
                            return [2, new Promise(function (t, r) {
                                    logger.log("加载配置包..."),
                                        // (new game.BytesBaseLoader).initialize(game.versionControl.getVirtualUrl(game.GameConfig.resource_path + "/data/config.nncc", window.config.version_config)).start(this, function (e) {
                                            // logger.log("开始解码配置....");
                                            //var r = decoder.amfDecoder.decode(e);
                                            // Templates.initialize(e),
                                                // t()
                                        // }, e)
										game.queueLoader.add(game.TypeLoader.TEXT, game.GameConfig.resource_path + "/data/config.nncc", this, function (e) {
											     Templates.initialize(JSON.parse(e)),
                                                t()
										})
                                }
                            )]
                        })
                    })
            }
            ,
            t.prototype.loadGroup = function (t, e, r, n) {
                void 0 === e && (e = null),
                void 0 === r && (r = null),
                void 0 === n && (n = null),
                    (new game.GroupLoader).initialize(t).start(e, r, n)
            }
            ,
            t.prototype.loadGroupSync = function (t, e, r) {
                return void 0 === e && (e = null),
                void 0 === r && (r = null),
                    __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (n) {
                            return [2, new Promise(function (n, i) {
                                    (new game.GroupLoader).initialize(t).start(e, n, r)
                                }
                            )]
                        })
                    })
            }
            ,
            t.prototype.reciveAnimationData = function (t, e) {
                if (this._animalib[t] || (this._animalib[t] = {}),
                    !this._animalib[t][e]) {
                    var r = utils.ObjectPool.from(game.ResAnimationData);
                    r.initialize(t, e),
                        r.onDestory(this, this.animationDestoryHandler),
                        this._animalib[t][e] = r
                }
                return this._animalib[t][e]
            }
            ,
            t.prototype.animationDestoryHandler = function (t) {
                var e = t.type
                    , r = t.name;
                this.destoryAnimationData(e, r)
            }
            ,
            t.prototype.destoryAnimationData = function (t, e) {
                var r = this._animalib[t];
                if (r && r[e]) {
                    var n = r[e];
                    utils.ObjectPool.to(n, !0),
                        r[e] = null,
                        delete r[e]
                }
            }
            ,
            t.prototype.getIconData = function (t) {
                if (!t)
                    return null;
                if (!this._iconLib[t]) {
                    var e = utils.ObjectPool.from(game.ResIconData);
                    e.initialize(t),
                        e.onDestory(this, this.iconDestoryHandler),
                        this._iconLib[t] = e
                }
                return this._iconLib[t]
            }
            ,
            t.prototype.iconDestoryHandler = function (t) {
                var e = t.id;
                this._iconLib[e] && (utils.ObjectPool.to(t, !0),
                    this._iconLib[e] = null,
                    delete this._iconLib[e])
            }
            ,
            t.prototype.getDropIconData = function (t) {
                if (!this._iconDropLib[t]) {
                    var e = utils.ObjectPool.from(game.ResDropIconData);
                    e.initialize(t),
                        e.onDestory(this, this.dropIconDestoryHandler),
                        this._iconDropLib[t] = e
                }
                return this._iconDropLib[t]
            }
            ,
            t.prototype.dropIconDestoryHandler = function (t) {
                var e = t.id;
                this._iconDropLib[e] && (utils.ObjectPool.to(t, !0),
                    this._iconDropLib[e] = null,
                    delete this._iconDropLib[e])
            }
            ,
            t.prototype.getQuality = function (t) {
                return (6 == t || 7 == t) && (t = 6),
                    RES.getRes("common_json.img_qlt_" + t + "_png")
            }
            ,
            t.prototype.getJobTag = function (t) {
                return RES.getRes("common_json.img_job_" + t + "_png")
            }
            ,
            t.prototype.getRes = function (t) {
                return RES.getRes(t)
            }
            ,
            t.prototype.getResMap = function (t) {
                return this._mapConfigs[t.toString()]
            }
            ,
            t
    }();
    t.AssetsManager = e,
        __reflect(e.prototype, "mg.AssetsManager")
}(mg || (mg = {}));
var mg;
!function (t) {
    var e = function () {
        function t() {
            if (this._isActive = !0,
                this._nextTicks = [],
                this._lastTime = 0,
                this._passedTime = 0,
                t._instance)
                throw ""
        }

        return Object.defineProperty(t, "instance", {
            get: function () {
                return t._instance || (t._instance = new t),
                    t._instance
            },
            enumerable: !0,
            configurable: !0
        }),
            t.prototype.initialize = function (t) {
                this._stage || (this._stage = t,
                    t.addEventListener(egret.Event.RESIZE, this.updateResizeHandler, this),
                    this._whRatio_design = this.designWidth / this.designHeight,
                    this._ticks = [],
                    this._frameticks = [],
                    this.frameRate = this._stage.frameRate,
                    t.addEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this),
                    this._isActive = !0,
                    t.addEventListener(egret.Event.ACTIVATE, this.activateHandler, this),
                    t.addEventListener(egret.Event.DEACTIVATE, this.activateHandler, this),
                    this._timeStamp = egret.getTimer(),
                    utils.timer.initialize())
            }
            ,
            Object.defineProperty(t.prototype, "frameRate", {
                get: function () {
                    return this._frameRate
                },
                set: function (t) {
                    this._frameRate = t,
                        this._interval = 1e3 / this._frameRate >> 0,
                        this._stage.frameRate = t
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "interval", {
                get: function () {
                    return this._interval
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "stage", {
                get: function () {
                    return this._stage
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "designWidth", {
                get: function () {
                    return 600
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "designHeight", {
                get: function () {
                    return 1080
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "whRatio_design", {
                get: function () {
                    return this._whRatio_design
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "whRatio_current", {
                get: function () {
                    return this._whRatio_current
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "stageWidth", {
                get: function () {
                    return this._stage.stageWidth
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "stageHeight", {
                get: function () {
                    return this._stage.stageHeight
                },
                enumerable: !0,
                configurable: !0
            }),
            t.prototype.updateResizeHandler = function (t) {
                this._whRatio_current = this.stageWidth / this.stageHeight,
                this._resizeHandlers && this._resizeHandlers.runWith(this.stageWidth, this.stageHeight)
            }
            ,
            t.prototype.onTapOut = function (t, e, r) {
                void 0 === r && (r = null),
                this._tapOutHandlerts || (this._tapOutHandlerts = new utils.Handlers(!1)),
                    this._tapOutHandlerts.add(t, e, r ? [r] : null, !1),
                this._stage.hasEventListener(egret.TouchEvent.TOUCH_END) || this._stage.addEventListener(egret.TouchEvent.TOUCH_END, this.stageTapHandler, this)
            }
            ,
            t.prototype.offTapOut = function (t, e) {
                void 0 === e && (e = null),
                this._tapOutHandlerts && (e ? this._tapOutHandlerts.remove(t, e) : this._tapOutHandlerts.removeAll(t),
                this._tapOutHandlerts.length || this._stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.stageTapHandler, this))
            }
            ,
            t.prototype.stageTapHandler = function (t) {
                for (var e = this._tapOutHandlerts.length, r = [], n = 0; e > n; n++) {
                    var i = this._tapOutHandlerts.getHandlerAt(n);
                    if (i.args && i.args.length) {
                        var o = i.args[0];
                        o.contains(t.stageX, t.stageY) || r.push(i)
                    } else
                        i.caller.hitTestPoint(t.stageX, t.stageY) || r.push(i)
                }
                for (var s = 0, a = r; s < a.length; s++) {
                    var i = a[s];
                    i.run()
                }
                r.length = 0
            }
            ,
            t.prototype.activateHandler = function (t) {
                var e = t.type == egret.Event.ACTIVATE;
                this._isActive = e,
                    this._isActive ? this._activeHandlers && this._activeHandlers.run() : this._deactiveHandlers && this._deactiveHandlers.run()
            }
            ,
            t.prototype.onActivate = function (t, e, r) {
                void 0 === r && (r = !1),
                this._activeHandlers || (this._activeHandlers = new utils.Handlers(!1));
                var n = this._activeHandlers.add(t, e, null, !1);
                r && n.run()
            }
            ,
            t.prototype.offActivate = function (t, e) {
                this._activeHandlers && this._activeHandlers.remove(t, e)
            }
            ,
            t.prototype.onDeactivate = function (t, e, r) {
                void 0 === r && (r = !1),
                this._deactiveHandlers || (this._deactiveHandlers = new utils.Handlers(!1));
                var n = this._deactiveHandlers.add(t, e, null, !1);
                r && n.run()
            }
            ,
            t.prototype.offDeactivate = function (t, e) {
                this._deactiveHandlers && this._deactiveHandlers.remove(t, e)
            }
            ,
            t.prototype.onResize = function (t, e, r) {
                void 0 === r && (r = !1),
                this._resizeHandlers || (this._resizeHandlers = new utils.Handlers(!1));
                var n = this._resizeHandlers.add(t, e, null, !1);
                r && n.runWith(this.stageWidth, this.stageHeight)
            }
            ,
            t.prototype.offResize = function (t, e) {
                this._resizeHandlers && this._resizeHandlers.remove(t, e)
            }
            ,
            t.prototype.offResizeAll = function (t) {
                this._resizeHandlers && this._resizeHandlers.removeAll(t)
            }
            ,
            t.prototype.resize = function (t, e) {
                e.call(t, this.stageWidth, this.stageHeight)
            }
            ,
            Object.defineProperty(t.prototype, "timeStamp", {
                get: function () {
                    return this._timeStamp
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "passedTime", {
                get: function () {
                    return this._passedTime
                },
                enumerable: !0,
                configurable: !0
            }),
            t.prototype.enterFrame = function () {
                var t = egret.getTimer()
                    , e = this;
                e._timeStamp = t;
                for (var r = 0, n = e._ticks; r < n.length; r++) {
                    var i = n[r];
                    t >= i.nexttime && i.call(t)
                }
                var o = e._nextTicks;
                if (o && o.length)
                    for (; o.length;) {
                        var s = o.pop()
                            , a = o.pop()
                            , l = o.pop();
                        a.call.apply(a, [l].concat(s))
                    }
                var u = t - e._lastTime;
                e._lastTime = t;
                var h = e._interval
                    , c = e._passedTime + u;
                e._passedTime = c % h >> 0;
                var p = c / h >> 0;
                if (!(1 > p))
                    for (var d = 0, f = e._frameticks; d < f.length; d++) {
                        var g = f[d];
                        g.method.call(g.caller, p)
                    }
            }
            ,
            t.prototype.addFrameTick = function (t, e, n) {
                void 0 === n && (n = !1);
                var i = this.getFrameTickIndex(t, e);
                -1 == i && (n ? this._frameticks.unshift(utils.ObjectPool.from(r, !0, t, e, this._stage.frameRate)) : this._frameticks.push(utils.ObjectPool.from(r, !0, t, e, this._stage.frameRate)))
            }
            ,
            t.prototype.removeFrameTick = function (t, e) {
                var r = this.getFrameTickIndex(t, e);
                if (r >= 0) {
                    var n = this._frameticks[r];
                    this._frameticks.splice(r, 1),
                        utils.ObjectPool.to(n, !0)
                }
            }
            ,
            t.prototype.getFrameTickIndex = function (t, e) {
                var r = 0
                    , n = this._frameticks.length;
                for (r = 0; n > r; r++) {
                    var i = this._frameticks[r];
                    if (i.caller == t && i.method == e)
                        return r
                }
                return -1
            }
            ,
            t.prototype.addTick = function (t, e, n, i) {
                void 0 === i && (i = !1);
                var o = this.getTickIndex(t, e);
                -1 == o && (i ? this._ticks.unshift(utils.ObjectPool.from(r, !0, t, e, n)) : this._ticks.push(utils.ObjectPool.from(r, !0, t, e, n)))
            }
            ,
            t.prototype.removeTick = function (t, e) {
                var r = this.getTickIndex(t, e);
                if (r >= 0) {
                    var n = this._ticks[r];
                    this._ticks.splice(r, 1),
                        utils.ObjectPool.to(n, !0)
                }
            }
            ,
            t.prototype.getTickIndex = function (t, e) {
                var r = 0
                    , n = this._ticks.length;
                for (r = 0; n > r; r++) {
                    var i = this._ticks[r];
                    if (i.caller == t && i.method == e)
                        return r
                }
                return -1
            }
            ,
            t.prototype.onceTick = function (t, e) {
                for (var r = [], n = 2; n < arguments.length; n++)
                    r[n - 2] = arguments[n];
                this._nextTicks || (this._nextTicks = []),
                    this._nextTicks.push(t, e, r)
            }
            ,
            t.prototype.callLater = function (t, e) {
                for (var r = [], n = 2; n < arguments.length; n++)
                    r[n - 2] = arguments[n];
                this.onceTick.apply(this, [t, e].concat(r))
            }
            ,
            t
    }();
    t.StageManager = e,
        __reflect(e.prototype, "mg.StageManager");
    var r = function () {
        function t() {
            this.autoRecover = !0,
                this.toPoolTime = 0
        }

        return t.prototype.initialize = function (t, e, r) {
            this.caller = t,
                this.method = e,
                this.interval = 1e3 / r >> 0,
                this.update()
        }
            ,
            t.prototype.reset = function () {
                this.caller = null,
                    this.method = null
            }
            ,
            t.prototype.update = function () {
                this.nexttime = egret.getTimer() + this.interval
            }
            ,
            t.prototype.call = function (t) {
                this.method.call(this.caller, t),
                    this.update()
            }
            ,
            t
    }();
    __reflect(r.prototype, "TickMethod", ["utils.IPool"])
}(mg || (mg = {}));
var GameTheme = function () {
    function t() {
        this.skinMap = {},
            this.$styles = {},
            egret.registerImplementation("eui.Theme", this)
    }

    return t.prototype.parserConfig = function (t, e, r) {
        if (void 0 === e && (e = null),
        t && t.skins)
            for (var n = this.skinMap, i = t.skins, o = Object.keys(i), s = o.length, a = 0; s > a; a++) {
                var l = o[a];
                n[l] || this.mapSkin(l, i[l])
            }
        t.styles ? this.$styles = t.styles : t.exmls[0].gjs ? t.exmls.forEach(function (t) {
            return EXML.$parseURLContentAsJs(t.path, t.gjs, t.className)
        }) : t.exmls[0].content ? (t.exmls.forEach(function (t) {
            return EXML.$parseURLContent(t.path, t.content)
        }),
            r.call(e)) : EXML.$loadAll(t.exmls, r, e, !0)
    }
        ,
        t.prototype.getSkinName = function (t) {
            var e = this.skinMap
                , r = e[t.hostComponentKey];
            return r || (r = this.findSkinName(t)),
                r
        }
        ,
        t.prototype.findSkinName = function (t) {
            if (!t)
                return "";
            var e = t.__class__;
            if (void 0 === e)
                return "";
            var r = this.skinMap[e];
            return r || "eui.Component" == e ? r : this.findSkinName(Object.getPrototypeOf(t))
        }
        ,
        t.prototype.mapSkin = function (t, e) {
            this.skinMap[t] = e
        }
        ,
        t.prototype.$getStyleConfig = function (t) {
            return this.$styles[t]
        }
        ,
        t
}();
__reflect(GameTheme.prototype, "GameTheme");
var utils;
!function (t) {
    var e = function () {
        function t() {
            this.brightFilters = [new egret.ColorMatrixFilter([1, 0, 0, 0, 120, 0, 1, 0, 0, 120, 0, 0, 1, 0, 120, 0, 0, 0, 1, 0])],
                this.sideFilters = [new egret.GlowFilter(0, 1, 2, 2, 3, 2, !1, !1)],
                this.grayFilters = [new egret.ColorMatrixFilter([.3, .6, 0, 0, 0, .3, .6, 0, 0, 0, .3, .6, 0, 0, 0, 0, 0, 0, 1, 0])]
        }

        return t
    }();
    t.FilterUtil = e,
        __reflect(e.prototype, "utils.FilterUtil"),
        t.filterUtil = new e
}(utils || (utils = {}));
var utils;
!function (t) {
    var e = function () {
        function e(t) {
            void 0 === t && (t = !1),
                this._list = [],
                this._once = t
        }

        return e.prototype.add = function (e, r, n, i) {
            void 0 === n && (n = null),
            void 0 === i && (i = void 0),
            void 0 == i && (i = this._once);
            var o, s = this.indexOf(e, r);
            return s >= 0 ? (o = this._list[s],
                o.args = n,
                o.once = i) : (o = t.Handler.create(e, r, n, i),
                this._list.push(o)),
                o
        }
            ,
            e.prototype.addPriority = function (e, r, n, i) {
                void 0 === n && (n = null),
                void 0 === i && (i = void 0),
                void 0 == i && (i = this._once);
                var o, s = this.indexOf(e, r);
                return s >= 0 ? (o = this._list[s],
                    o.args = n,
                    o.once = i,
                    this._list.splice(s, 1),
                    this._list.unshift(o)) : (o = t.Handler.create(e, r, n, i),
                    this._list.unshift(o)),
                    o
            }
            ,
            e.prototype.remove = function (t, e) {
                var r = this.indexOf(t, e);
                if (r >= 0) {
                    var n = this._list[r];
                    this._list.splice(r, 1),
                        n.recover()
                }
            }
            ,
            e.prototype.removeAll = function (t) {
                for (var e = 0; e < this._list.length; e++) {
                    var r = this._list[e];
                    r.caller == t && (this._list.splice(e, 1),
                        r.recover(),
                        e--)
                }
            }
            ,
            e.prototype.clear = function (t) {
                if (void 0 === t && (t = !1),
                    t) {
                    for (var e = 0, r = this._list; e < r.length; e++) {
                        var n = r[e];
                        n.recover()
                    }
                    return void (this._list.length = 0)
                }
                mg.StageManager.instance.callLater(this, function (t) {
                    for (var e = 0, r = t; e < r.length; e++) {
                        var n = r[e];
                        n.recover()
                    }
                }, this._list.concat()),
                    this._list.length = 0
            }
            ,
            e.prototype.run = function () {
                for (var t = this, e = t._list.concat(), r = 0; r < t._list.length; r++) {
                    var n = t._list[r];
                    n.once && (t._list.splice(r, 1),
                        r--)
                }
                for (var i = 0, o = e; i < o.length; i++) {
                    var n = o[i];
                    n.run()
                }
            }
            ,
            e.prototype.runWith = function () {
                for (var t = [], e = 0; e < arguments.length; e++)
                    t[e] = arguments[e];
                for (var r = this, n = r._list.concat(), i = 0; i < r._list.length; i++) {
                    var o = r._list[i];
                    o.once && (r._list.splice(i, 1),
                        i--)
                }
                for (var s = 0, a = n; s < a.length; s++) {
                    var o = a[s];
                    o.runWith.apply(o, t)
                }
            }
            ,
            e.prototype.indexOf = function (t, e) {
                for (var r = this._list, n = r.length, i = -1, o = 0; n > o; o++) {
                    var s = r[o];
                    if (s.caller == t && s.method == e) {
                        i = o;
                        break
                    }
                }
                return i
            }
            ,
            e.prototype.getHandlerAt = function (t) {
                return this._list[t]
            }
            ,
            Object.defineProperty(e.prototype, "length", {
                get: function () {
                    return this._list.length
                },
                enumerable: !0,
                configurable: !0
            }),
            e
    }();
    t.Handlers = e,
        __reflect(e.prototype, "utils.Handlers")
}(utils || (utils = {}));
var utils;
!function (t) {
    function e(t) {
        t.reset(),
            i.push(t)
    }

    function r(t, e) {
        for (var r = [], o = 2; o < arguments.length; o++)
            r[o - 2] = arguments[o];
        var s;
        return r.unshift(t, e),
            i.length ? (s = i.pop(),
                s.initialize.apply(s, r)) : (s = new n,
                s.initialize.apply(s, r))
    }

    var n = function () {
        function t() {
            this.needTime = 0
        }

        return t.prototype.TimerHandler = function () {
            this._uid = ++t.UID
        }
            ,
            Object.defineProperty(t.prototype, "uid", {
                get: function () {
                    return this._uid
                },
                enumerable: !0,
                configurable: !0
            }),
            t.prototype.initialize = function (t, e) {
                for (var r = [], n = 2; n < arguments.length; n++)
                    r[n - 2] = arguments[n];
                return this._caller = t,
                    this._method = e,
                    this._args = r,
                    this.needTime = 0,
                    this._stageManager = mg.StageManager.instance,
                    this
            }
            ,
            t.prototype.reset = function () {
                this._caller = null,
                    this._method = null,
                    this._args = null,
                    this._stageManager = null,
                    this.needTime = 0,
                    this.endTime = 0
            }
            ,
            Object.defineProperty(t.prototype, "caller", {
                get: function () {
                    return this._caller
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "method", {
                get: function () {
                    return this._method
                },
                enumerable: !0,
                configurable: !0
            }),
            Object.defineProperty(t.prototype, "args", {
                get: function () {
                    return this._args
                },
                set: function (t) {
                    this._args = t
                },
                enumerable: !0,
                configurable: !0
            }),
            t.prototype.update = function (t) {
                t >= this.endTime && (this._loop ? this.loopOver() : this.onceOver())
            }
            ,
            t.prototype.pause = function () {
                this._paused || (this.needTime = this.endTime - this._stageManager.timeStamp,
                this.needTime < 0 && (this.needTime = 0),
                    this._paused = !0)
            }
            ,
            t.prototype.resume = function () {
                this._paused && (this._paused = !1,
                    this.endTime = egret.getTimer() + this.needTime,
                    this.needTime = 0)
            }
            ,
            t.prototype.once = function (t) {
                return this._loop = !1,
                    this.endTime = this._stageManager.timeStamp + t,
                    this.needTime = t,
                    this
            }
            ,
            t.prototype.onceOver = function () {
                var t = this._method
                    , e = this._caller
                    , r = this._args;
                this._completeMethod.call(this._completeCaller, this),
                    t.apply(e, r)
            }
            ,
            t.prototype.loop = function (t, e) {
                return void 0 === e && (e = 0),
                    this._loop = !0,
                    this._interval = t,
                    this.startTime = this._stageManager.timeStamp,
                    this.endTime = this.startTime + this._interval,
                    this._totaltimes = e,
                    this._times = 0,
                    this
            }
            ,
            t.prototype.loopOver = function () {
                return this._method && this._method.apply(this._caller, this._args),
                    this._times++,
                    this._totaltimes && this._times >= this._totaltimes ? (this._completeArgs.unshift(this),
                        void this._completeMethod.apply(this._completeCaller, this._completeArgs)) : void (this._stageManager && (this.endTime = this.startTime + (this._times + 1) * this._interval))
            }
            ,
            t.prototype.call = function (t, e) {
                for (var r = [], n = 2; n < arguments.length; n++)
                    r[n - 2] = arguments[n];
                this._completeCaller = t,
                    this._completeMethod = e,
                    this._completeArgs = r
            }
            ,
            t.UID = 0,
            t
    }();
    t.TimerHandler = n,
        __reflect(n.prototype, "utils.TimerHandler");
    var i = []
        , o = function () {
        function t() {
            this._handlers = []
        }

        return Object.defineProperty(t, "instance", {
            get: function () {
                return t._instance || (t._instance = new t),
                    t._instance
            },
            enumerable: !0,
            configurable: !0
        }),
            t.prototype.initialize = function () {
                this._stageManager = mg.StageManager.instance,
                    this._stageManager.addTick(this, function (t) {
                        for (var e = 0, r = this._handlers; e < r.length; e++) {
                            var n = r[e];
                            n.update(t)
                        }
                    }, 30)
            }
            ,
            t.prototype.once = function (t, e, n, i) {
                void 0 === i && (i = !0);
                for (var o = [], s = 4; s < arguments.length; s++)
                    o[s - 4] = arguments[s];
                if (0 >= t)
                    return void n.apply(e, o);
                var a;
                if (i) {
                    var l = this.getIndex(e, n);
                    if (l >= 0)
                        return a = this._handlers[l],
                            a.args = o,
                            void a.once(t).call(this, this.onceOver)
                }
                return a = r.apply(void 0, [e, n].concat(o)),
                    a.once(t).call(this, this.onceOver),
                    this._handlers.push(a),
                    a
            }
            ,
            t.prototype.onceOver = function (t) {
                var r = this._handlers.indexOf(t);
                e(this._handlers.splice(r, 1)[0])
            }
            ,
            t.prototype.loop = function (t, e, n, i) {
                void 0 === i && (i = !0);
                for (var o = [], s = 4; s < arguments.length; s++)
                    o[s - 4] = arguments[s];
                var a;
                if (i) {
                    var l = this.getIndex(e, n);
                    if (l >= 0)
                        return a = this._handlers[l],
                            void a.loop(t)
                }
                return a = r.apply(void 0, [e, n].concat(o)),
                    a.loop(t),
                    this._handlers.push(a),
                    a
            }
            ,
            t.prototype.countdown = function (t, e, n, i, o) {
                void 0 === e && (e = null),
                void 0 === n && (n = null),
                void 0 === o && (o = !0);
                for (var s = [], a = 5; a < arguments.length; a++)
                    s[a - 5] = arguments[a];
                var l;
                if (o) {
                    var u = this.getIndex(e, n);
                    u >= 0 && (l = this._handlers[u],
                        l.loop(1e3, t))
                }
                return l || (l = r.apply(void 0, [e, n].concat(s)),
                    l.loop(1e3, t),
                    this._handlers.push(l)),
                    l.call(this, function (t, e) {
                        var r = t.caller;
                        this.onceOver(t),
                        e && e.call(r)
                    }, i),
                    l
            }
            ,
            t.prototype.clear = function (t, r) {
                if (void 0 === r && (r = null),
                t instanceof n)
                    return void this.clearHandler(t);
                if (!r)
                    return void this.clearAll(t);
                for (; ;) {
                    var i = this.getIndex(t, r);
                    {
                        if (!(i >= 0))
                            break;
                        var o = this._handlers[i];
                        e(o),
                            this._handlers.splice(i, 1)
                    }
                }
            }
            ,
            t.prototype.clearHandler = function (t) {
                var r = this._handlers.indexOf(t);
                r >= 0 && e(this._handlers.splice(r, 1)[0])
            }
            ,
            t.prototype.clearAll = function (t) {
                for (var r = 0; r < this._handlers.length; r++)
                    this._handlers[r].caller == t && (e(this._handlers.splice(r, 1)[0]),
                        r--)
            }
            ,
            t.prototype.getIndex = function (t, e) {
                for (var r = this._handlers.length, n = 0; r > n; n++) {
                    var i = this._handlers[n];
                    if (i.caller == t && i.method == e)
                        return n
                }
                return -1
            }
            ,
            Object.defineProperty(t.prototype, "timeStamp", {
                get: function () {
                    return this._stageManager.timeStamp
                },
                enumerable: !0,
                configurable: !0
            }),
            t
    }();
    t.TimerUtils = o,
        __reflect(o.prototype, "utils.TimerUtils"),
        t.timer = o.instance
}(utils || (utils = {}));
