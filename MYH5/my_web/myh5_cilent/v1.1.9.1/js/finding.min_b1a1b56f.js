var __reflect = this && this.__reflect || function (t, e, n) {
    t.__class__ = e, n ? n.push(e) : n = [e], t.__types__ = t.__types__ ? n.concat(t.__types__) : n
}, __extends = this && this.__extends || function (t, e) {
    function n() {
        this.constructor = t
    }

    for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
    n.prototype = e.prototype, t.prototype = new n
}, PF;
!function (t) {
    var e = function () {
        function e(e) {
            e = e || {}, this.allowDiagonal = e.allowDiagonal, this.dontCrossCorners = e.dontCrossCorners, this.heuristic = e.heuristic || t.Heuristic.manhattan, this.weight = e.weight || 1, this.diagonalMovement = e.diagonalMovement, this.diagonalMovement || (this.allowDiagonal ? this.dontCrossCorners ? this.diagonalMovement = t.DiagonalMovement.OnlyWhenNoObstacles : this.diagonalMovement = t.DiagonalMovement.IfAtMostOneObstacle : this.diagonalMovement = t.DiagonalMovement.Never)
        }

        return e.prototype.findPath = function (e, n, i, o, r) {
            var s, a, h, l, u, c, f, d, p = new t.Heap(function (t, e) {
                    return t.f - e.f
                }), g = r.getNodeAt(e, n), v = r.getNodeAt(i, o), m = this.heuristic, F = this.diagonalMovement,
                M = this.weight, y = Math.abs, b = Math.SQRT2;
            for (g.g = 0, g.f = 0, p.push(g), g.opened = !0; !p.empty();) {
                if (s = p.pop(), s.closed = !0, s === v) return t.backtraceNode(v);
                for (a = r.getNeighbors(s, F), l = 0, u = a.length; u > l; ++l) h = a[l], h.closed || (c = h.x, f = h.y, d = s.g + (c - s.x === 0 || f - s.y === 0 ? 1 : b), (!h.opened || d < h.g) && (h.g = d, h.h = h.h || M * m(y(c - i), y(f - o)), h.f = h.g + h.h, h.parent = s, h.opened ? p.updateItem(h) : (p.push(h), h.opened = !0)))
            }
            return []
        }, e
    }();
    t.AStarFinder = e, __reflect(e.prototype, "PF.AStarFinder")
}(PF || (PF = {}));
var PF;
!function (t) {
    var e = function () {
        function e(e) {
            e = e || {}, this.allowDiagonal = e.allowDiagonal, this.dontCrossCorners = e.dontCrossCorners, this.diagonalMovement = e.diagonalMovement, this.heuristic = e.heuristic || t.Heuristic.manhattan, this.weight = e.weight || 1, this.diagonalMovement || (this.allowDiagonal ? this.dontCrossCorners ? this.diagonalMovement = t.DiagonalMovement.OnlyWhenNoObstacles : this.diagonalMovement = t.DiagonalMovement.IfAtMostOneObstacle : this.diagonalMovement = t.DiagonalMovement.Never), this.diagonalMovement === t.DiagonalMovement.Never ? this.heuristic = e.heuristic || t.Heuristic.manhattan : this.heuristic = e.heuristic || t.Heuristic.octile
        }

        return e.prototype.findPath = function (e, n, i, o, r) {
            var s, a, h, l, u, c, f, d, p = function (t, e) {
                    return t.f - e.f
                }, g = new t.Heap(p), v = new t.Heap(p), m = r.getNodeAt(e, n), F = r.getNodeAt(i, o), M = this.heuristic,
                y = this.diagonalMovement, b = this.weight, P = Math.abs, _ = Math.SQRT2, w = 1, N = 2;
            for (m.g = 0, m.f = 0, g.push(m), m.opened = w, F.g = 0, F.f = 0, v.push(F), F.opened = N; !g.empty() && !v.empty();) {
                for (s = g.pop(), s.closed = !0, a = r.getNeighbors(s, y), l = 0, u = a.length; u > l; ++l) if (h = a[l], !h.closed) {
                    if (h.opened === N) return t.biBacktrace(s, h);
                    c = h.x, f = h.y, d = s.g + (c - s.x === 0 || f - s.y === 0 ? 1 : _), (!h.opened || d < h.g) && (h.g = d, h.h = h.h || b * M(P(c - i), P(f - o)), h.f = h.g + h.h, h.parent = s, h.opened ? g.updateItem(h) : (g.push(h), h.opened = w))
                }
                for (s = v.pop(), s.closed = !0, a = r.getNeighbors(s, y), l = 0, u = a.length; u > l; ++l) if (h = a[l], !h.closed) {
                    if (h.opened === w) return t.biBacktrace(h, s);
                    c = h.x, f = h.y, d = s.g + (c - s.x === 0 || f - s.y === 0 ? 1 : _), (!h.opened || d < h.g) && (h.g = d, h.h = h.h || b * M(P(c - e), P(f - n)), h.f = h.g + h.h, h.parent = s, h.opened ? v.updateItem(h) : (v.push(h), h.opened = N))
                }
            }
            return []
        }, e
    }();
    t.BiAStarFinder = e, __reflect(e.prototype, "PF.BiAStarFinder")
}(PF || (PF = {}));
var PF;
!function (t) {
    var e = function (t) {
        function e(e) {
            var n = t.call(this, e) || this, i = n.heuristic;
            return n.heuristic = function (t, e) {
                return 1e6 * i(t, e)
            }, n
        }

        return __extends(e, t), e
    }(t.AStarFinder);
    t.BestFirstFinder = e, __reflect(e.prototype, "PF.BestFirstFinder")
}(PF || (PF = {}));
var PF;
!function (t) {
    var e = function () {
        function t() {
        }

        return t.manhattan = function (t, e) {
            return t + e
        }, t.euclidean = function (t, e) {
            return Math.sqrt(t * t + e * e)
        }, t.octile = function (t, e) {
            var n = Math.SQRT2 - 1;
            return e > t ? n * t + e : n * e + t
        }, t.chebyshev = function (t, e) {
            return Math.max(t, e)
        }, t
    }();
    t.Heuristic = e, __reflect(e.prototype, "PF.Heuristic")
}(PF || (PF = {}));
var PF;
!function (t) {
    function e(t, e) {
        return e > t ? -1 : t > e ? 1 : 0
    }

    function n(t, n, i, o, r) {
        var s;
        if (null == i && (i = 0), null == r && (r = e), 0 > i) throw new Error("lo must be non-negative");
        for (null == o && (o = t.length); o > i;) s = d((i + o) / 2), r(n, t[s]) < 0 ? o = s : i = s + 1;
        return [].splice.apply(t, [i, i - i].concat(n)), n
    }

    function i(t, n, i) {
        return null == i && (i = e), t.push(n), c(t, 0, t.length - 1, i)
    }

    function o(t, n) {
        var i, o;
        return null == n && (n = e), i = t.pop(), t.length ? (o = t[0], t[0] = i, f(t, 0, n)) : o = i, o
    }

    function r(t, n, i) {
        var o;
        return null == i && (i = e), o = t[0], t[0] = n, f(t, 0, i), o
    }

    function s(t, n, i) {
        var o;
        return null == i && (i = e), t.length && i(t[0], n) < 0 && (o = [t[0], n], n = o[0], t[0] = o[1], f(t, 0, i)), n
    }

    function a(t, n) {
        var i, o, r, s, a, h;
        for (null == n && (n = e), s = function () {
            h = [];
            for (var e = 0, n = d(t.length / 2); n >= 0 ? n > e : e > n; n >= 0 ? e++ : e--) h.push(e);
            return h
        }.apply(this).reverse(), a = [], o = 0, r = s.length; r > o; o++) i = s[o], a.push(f(t, i, n));
        return a
    }

    function h(t, n, i) {
        var o;
        return null == i && (i = e), o = t.indexOf(n), -1 !== o ? (c(t, 0, o, i), f(t, o, i)) : void 0
    }

    function l(t, n, i) {
        var o, r, h, l, u;
        if (null == i && (i = e), r = t.slice(0, n), !r.length) return r;
        for (a(r, i), u = t.slice(n), h = 0, l = u.length; l > h; h++) o = u[h], s(r, o, i);
        return r.sort(i).reverse()
    }

    function u(t, i, r) {
        var s, h, l, u, c, f, d, g, v, m;
        if (null == r && (r = e), 10 * i <= t.length) {
            if (u = t.slice(0, i).sort(r), !u.length) return u;
            for (l = u[u.length - 1], g = t.slice(i), c = 0, d = g.length; d > c; c++) s = g[c], r(s, l) < 0 && (n(u, s, 0, null, r), u.pop(), l = u[u.length - 1]);
            return u
        }
        for (a(t, r), m = [], h = f = 0, v = p(i, t.length); v >= 0 ? v > f : f > v; h = v >= 0 ? ++f : --f) m.push(o(t, r));
        return m
    }

    function c(t, n, i, o) {
        var r, s, a;
        for (null == o && (o = e), r = t[i]; i > n && (a = i - 1 >> 1, s = t[a], o(r, s) < 0);) t[i] = s, i = a;
        return t[i] = r
    }

    function f(t, n, i) {
        var o, r, s, a, h;
        for (null == i && (i = e), r = t.length, h = n, s = t[n], o = 2 * n + 1; r > o;) a = o + 1, r > a && !(i(t[o], t[a]) < 0) && (o = a), t[n] = t[o], n = o, o = 2 * n + 1;
        return t[n] = s, c(t, h, n, i)
    }

    var d = Math.floor, p = Math.min, g = function () {
        function t(n) {
            void 0 === n && (n = null), this.push = function (t) {
                return i(this.nodes, t, this.cmp)
            }, this.pop = function () {
                return o(this.nodes, this.cmp)
            }, this.peek = function () {
                return this.nodes[0]
            }, this.contains = function (t) {
                return -1 !== this.nodes.indexOf(t)
            }, this.replace = function (t) {
                return r(this.nodes, t, this.cmp)
            }, this.pushpop = function (t) {
                return s(this.nodes, t, this.cmp)
            }, this.heapify = function () {
                return a(this.nodes, this.cmp)
            }, this.updateItem = function (t) {
                return h(this.nodes, t, this.cmp)
            }, this.clear = function () {
                return this.nodes = []
            }, this.empty = function () {
                return 0 === this.nodes.length
            }, this.size = function () {
                return this.nodes.length
            }, this.clone = function () {
                var e;
                return e = new t, e.nodes = this.nodes.slice(0), e
            }, this.toArray = function () {
                return this.nodes.slice(0)
            }, this.cmp = null != n ? n : e, this.nodes = [], this.insert = this.push, this.top = this.peek, this.front = this.peek, this.has = this.contains, this.copy = this.clone
        }

        return t.push = i, t.pop = o, t.replace = r, t.pushpop = s, t.heapify = a, t.updateItem = h, t.nlargest = l, t.nsmallest = u, t
    }();
    t.Heap = g, __reflect(g.prototype, "PF.Heap")
}(PF || (PF = {}));
var PF;
!function (t) {
    t.DiagonalMovement = {Always: 1, Never: 2, IfAtMostOneObstacle: 3, OnlyWhenNoObstacles: 4}
}(PF || (PF = {}));
var PF;
!function (t) {
    var e = function () {
        function e() {
            this.nodes = [], this._buildNodes = function (e, n, i) {
                var o, r, s = this;
                for (s.nodes || (s.nodes = []), s.nodes.length = n, o = 0; n > o; ++o) for (s.nodes[o] = new Array(e), r = 0; e > r; ++r) s.nodes[o][r] = t.Node.from(r, o);
                if (void 0 === i) return s.nodes;
                if (i.length !== n || i[0].length !== e) throw new Error("Matrix size does not fit");
                for (o = 0; n > o; ++o) for (r = 0; e > r; ++r) i[o][r] && (s.nodes[o][r].walkable = !1);
                return s.nodes
            }, this.getNodeAt = function (t, e) {
                return this.nodes[e][t]
            }, this.isWalkableAt = function (t, e) {
                return this.isInside(t, e) && this.nodes[e][t].walkable
            }, this.isInside = function (t, e) {
                return t >= 0 && t < this.width && e >= 0 && e < this.height
            }, this.setWalkableAt = function (t, e, n) {
                this.nodes[e][t].walkable = n
            }, this.getNeighbors = function (e, n) {
                var i = e.x, o = e.y, r = [], s = !1, a = !1, h = !1, l = !1, u = !1, c = !1, f = !1, d = !1,
                    p = this.nodes;
                if (this.isWalkableAt(i, o - 1) && (r.push(p[o - 1][i]), s = !0), this.isWalkableAt(i + 1, o) && (r.push(p[o][i + 1]), h = !0), this.isWalkableAt(i, o + 1) && (r.push(p[o + 1][i]), u = !0), this.isWalkableAt(i - 1, o) && (r.push(p[o][i - 1]), f = !0), n === t.DiagonalMovement.Never) return r;
                if (n === t.DiagonalMovement.OnlyWhenNoObstacles) a = f && s, l = s && h, c = h && u, d = u && f; else if (n === t.DiagonalMovement.IfAtMostOneObstacle) a = f || s, l = s || h, c = h || u, d = u || f; else {
                    if (n !== t.DiagonalMovement.Always) throw new Error("Incorrect value of diagonalMovement");
                    a = !0, l = !0, c = !0, d = !0
                }
                return a && this.isWalkableAt(i - 1, o - 1) && r.push(p[o - 1][i - 1]), l && this.isWalkableAt(i + 1, o - 1) && r.push(p[o - 1][i + 1]), c && this.isWalkableAt(i + 1, o + 1) && r.push(p[o + 1][i + 1]), d && this.isWalkableAt(i - 1, o + 1) && r.push(p[o + 1][i - 1]), r
            }, this.clone = function () {
                var n, i, o = this.width, r = this.height, s = this.nodes, a = new e, h = new Array(r);
                for (a.initialize(o, r), n = 0; r > n; ++n) for (h[n] = new Array(o), i = 0; o > i; ++i) h[n][i] = t.Node.from(i, n, s[n][i].walkable);
                return a.nodes = h, a
            }
        }

        return e.prototype.initialize = function (t, e, n) {
            void 0 === n && (n = null);
            var i;
            "object" != typeof t ? i = t : (e = t.length, i = t[0].length, n = t), this.width = i, this.height = e, this.clearNodes(), this.nodes = this._buildNodes(i, e, n)
        }, e.prototype.reset = function () {
            this.clearNodes(), this.width = this.height = 0
        }, e.prototype.resetState = function () {
            if (this.nodes) for (var t = 0, e = this.nodes; t < e.length; t++) for (var n = e[t], i = 0, o = n; i < o.length; i++) {
                var r = o[i];
                r.resetState()
            }
        }, e.prototype.clearNodes = function () {
            if (this.nodes) {
                for (var e = 0, n = this.nodes; e < n.length; e++) {
                    for (var i = n[e], o = 0, r = i; o < r.length; o++) {
                        var s = r[o];
                        t.Node.to(s)
                    }
                    i.length = 0
                }
                this.nodes.length = 0
            }
        }, e
    }();
    t.Grid = e, __reflect(e.prototype, "PF.Grid")
}(PF || (PF = {}));
var PF;
!function (t) {
    var e = function () {
        function t() {
            this.allowDiagonal = !0, this.dontCrossCorners = !0, this.heuristic = null, this.weight = 1, this.diagonalMovement = 0, this.timeLimit = 10, this.trackRecursion = !0
        }

        return t
    }();
    t.Option = e, __reflect(e.prototype, "PF.Option")
}(PF || (PF = {}));
var PF;
!function (t) {
    function e(t) {
        for (var e = [[t.x, t.y]]; t.parent;) t = t.parent, e.push([t.x, t.y]);
        return e.reverse()
    }

    function n(t) {
        for (var e = [t]; t.parent;) t = t.parent, e.push(t);
        return e.reverse()
    }

    function i(t, n) {
        var i = e(t), o = e(n);
        return i.concat(o.reverse())
    }

    function o(t) {
        var e, n, i, o, r, s = 0;
        for (e = 1; e < t.length; ++e) n = t[e - 1], i = t[e], o = n[0] - i[0], r = n[1] - i[1], s += Math.sqrt(o * o + r * r);
        return s
    }

    function r(t, e, n, i) {
        var o, r, s, a, h, l, u = Math.abs, c = [];
        for (s = u(n - t), a = u(i - e), o = n > t ? 1 : -1, r = i > e ? 1 : -1, h = s - a; ;) {
            if (c.push([t, e]), t === n && e === i) break;
            l = 2 * h, l > -a && (h -= a, t += o), s > l && (h += s, e += r)
        }
        return c
    }

    function s(t) {
        var e, n, i, o, s, a, h = [], l = t.length;
        if (2 > l) return h;
        for (s = 0; l - 1 > s; ++s) for (e = t[s], n = t[s + 1], i = r(e[0], e[1], n[0], n[1]), o = i.length, a = 0; o - 1 > a; ++a) h.push(i[a]);
        return h.push(t[l - 1]), h
    }

    function a(t, e) {
        var n, i, o, s, a, h, l, u, c, f, d, p = e.length, g = e[0][0], v = e[0][1], m = e[p - 1][0], F = e[p - 1][1];
        for (n = g, i = v, a = [[n, i]], h = 2; p > h; ++h) {
            for (u = e[h], o = u[0], s = u[1], c = r(n, i, o, s), d = !1, l = 1; l < c.length; ++l) if (f = c[l], !t.isWalkableAt(f[0], f[1])) {
                d = !0;
                break
            }
            if (d) {
                var M = e[h - 1];
                a.push(M), n = M[0], i = M[1]
            }
        }
        return a.push([m, F]), a
    }

    function h(t) {
        if (t.length < 3) return t;
        var e, n, i, o, r, s, a = [], h = t[0][0], l = t[0][1], u = t[1][0], c = t[1][1], f = u - h, d = c - l;
        for (r = Math.sqrt(f * f + d * d), f /= r, d /= r, a.push([h, l]), s = 2; s < t.length; s++) e = u, n = c, i = f, o = d, u = t[s][0], c = t[s][1], f = u - e, d = c - n, r = Math.sqrt(f * f + d * d), f /= r, d /= r, (f !== i || d !== o) && a.push([e, n]);
        return a.push([u, c]), a
    }

    t.backtrace = e, t.backtraceNode = n, t.biBacktrace = i, t.pathLength = o, t.interpolate = r, t.expandPath = s, t.smoothenPath = a, t.compressPath = h
}(PF || (PF = {}));
var PF;
!function (t) {
    var e = function () {
        function t() {
        }

        return t.prototype.initialize = function (t, e, n) {
            void 0 === n && (n = !0), this.x = t, this.y = e, this.walkable = n, this.walkable && (this.objects || (this.objects = []))
        }, t.prototype.reset = function () {
            var t = this;
            t.x = 0, t.y = 0, t.walkable = !0, t.objects && t.objects.length && (t.objects.length = 0), t.resetState()
        }, t.prototype.resetState = function () {
            var t = this;
            t.g = 0, t.f = 0, t.h = 0, t.by = 0, t.parent = null, t.opened = !1, t.closed = !1, t.tested = !1
        }, t.prototype.hasObject = function (t) {
            return void 0 === t && (t = null), this.objects && (t ? this.objects.indexOf(t) >= 0 : !!this.objects.length)
        }, t.from = function (e, n, i) {
            void 0 === i && (i = !0);
            var o;
            return o = this._pool.length ? this._pool.pop() : new t, o.initialize(e, n, i), o
        }, t.to = function (t) {
            t.reset(), this._pool.push(t)
        }, t._pool = [], t
    }();
    t.Node = e, __reflect(e.prototype, "PF.Node")
}(PF || (PF = {}));
var PF;
!function (t) {
    var e = function (t) {
        function e(e) {
            var n = t.call(this, e) || this, i = n.heuristic;
            return n.heuristic = function (t, e) {
                return 1e6 * i(t, e)
            }, n
        }

        return __extends(e, t), e
    }(t.BiAStarFinder);
    t.BiBestFirstFinder = e, __reflect(e.prototype, "PF.BiBestFirstFinder")
}(PF || (PF = {}));
var PF;
!function (t) {
    var e = function () {
        function e(e) {
            e = e || {}, this.allowDiagonal = e.allowDiagonal, this.dontCrossCorners = e.dontCrossCorners, this.diagonalMovement = e.diagonalMovement, this.diagonalMovement || (this.allowDiagonal ? this.dontCrossCorners ? this.diagonalMovement = t.DiagonalMovement.OnlyWhenNoObstacles : this.diagonalMovement = t.DiagonalMovement.IfAtMostOneObstacle : this.diagonalMovement = t.DiagonalMovement.Never)
        }

        return e.prototype.findPath = function (e, n, i, o, r) {
            var s, a, h, l, u, c = r.getNodeAt(e, n), f = r.getNodeAt(i, o), d = [], p = [], g = this.diagonalMovement,
                v = 0, m = 1;
            for (d.push(c), c.opened = !0, c.by = v, p.push(f), f.opened = !0, f.by = m; d.length && p.length;) {
                for (h = d.shift(), h.closed = !0, s = r.getNeighbors(h, g), l = 0, u = s.length; u > l; ++l) if (a = s[l], !a.closed) if (a.opened) {
                    if (a.by === m) return t.biBacktrace(h, a)
                } else d.push(a), a.parent = h, a.opened = !0, a.by = v;
                for (h = p.shift(), h.closed = !0, s = r.getNeighbors(h, g), l = 0, u = s.length; u > l; ++l) if (a = s[l], !a.closed) if (a.opened) {
                    if (a.by === v) return t.biBacktrace(a, h)
                } else p.push(a), a.parent = h, a.opened = !0, a.by = m
            }
            return []
        }, e
    }();
    t.BiBreadthFirstFinder = e, __reflect(e.prototype, "PF.BiBreadthFirstFinder")
}(PF || (PF = {}));
var PF;
!function (t) {
    var e = function () {
        function e(e) {
            e = e || {}, this.allowDiagonal = e.allowDiagonal, this.dontCrossCorners = e.dontCrossCorners, this.diagonalMovement = e.diagonalMovement, this.diagonalMovement || (this.allowDiagonal ? this.dontCrossCorners ? this.diagonalMovement = t.DiagonalMovement.OnlyWhenNoObstacles : this.diagonalMovement = t.DiagonalMovement.IfAtMostOneObstacle : this.diagonalMovement = t.DiagonalMovement.Never)
        }

        return e.prototype.findPath = function (e, n, i, o, r) {
            var s, a, h, l, u, c = [], f = this.diagonalMovement, d = r.getNodeAt(e, n), p = r.getNodeAt(i, o);
            for (c.push(d), d.opened = !0; c.length;) {
                if (h = c.shift(), h.closed = !0, h === p) return t.backtrace(p);
                for (s = r.getNeighbors(h, f), l = 0, u = s.length; u > l; ++l) a = s[l], a.closed || a.opened || (c.push(a), a.opened = !0, a.parent = h)
            }
            return []
        }, e
    }();
    __reflect(e.prototype, "BreadthFirstFinder")
}(PF || (PF = {}));
var PF;
!function (t) {
    var e = function (t) {
        function e(e) {
            var n = t.call(this, e) || this;
            return n.heuristic = function (t, e) {
                return 0
            }, n
        }

        return __extends(e, t), e
    }(t.AStarFinder);
    t.DijkstraFinder = e, __reflect(e.prototype, "PF.DijkstraFinder")
}(PF || (PF = {}));
var PF;
!function (t) {
    var e = function () {
        function e(e) {
            e = e || {}, this.allowDiagonal = e.allowDiagonal, this.dontCrossCorners = e.dontCrossCorners, this.diagonalMovement = e.diagonalMovement, this.heuristic = e.heuristic || t.Heuristic.manhattan, this.weight = e.weight || 1, this.trackRecursion = e.trackRecursion || !1, this.timeLimit = e.timeLimit || 1 / 0, this.diagonalMovement || (this.allowDiagonal ? this.dontCrossCorners ? this.diagonalMovement = t.DiagonalMovement.OnlyWhenNoObstacles : this.diagonalMovement = t.DiagonalMovement.IfAtMostOneObstacle : this.diagonalMovement = t.DiagonalMovement.Never), this.diagonalMovement === t.DiagonalMovement.Never ? this.heuristic = e.heuristic || t.Heuristic.manhattan : this.heuristic = e.heuristic || t.Heuristic.octile
        }

        return e.prototype.findPath = function (e, n, i, o, r) {
            var s, a, h, l = 0, u = (new Date).getTime(), c = function (t, e) {
                return this.heuristic(Math.abs(e.x - t.x), Math.abs(e.y - t.y))
            }.bind(this), f = function (t, e) {
                return t.x === e.x || t.y === e.y ? 1 : Math.SQRT2
            }, d = function (e, n, i, o, s) {
                if (l++, this.timeLimit > 0 && (new Date).getTime() - u > 1e3 * this.timeLimit) return 1 / 0;
                var a = n + c(e, g) * this.weight;
                if (a > i) return a;
                if (e == g) return o[s] = [e.x, e.y], e;
                var h, p, v, m, F = r.getNeighbors(e, this.diagonalMovement);
                for (v = 0, h = 1 / 0; m = F[v]; ++v) {
                    if (this.trackRecursion && (m.retainCount = m.retainCount + 1 || 1, m.tested !== !0 && (m.tested = !0)), p = d(m, n + f(e, m), i, o, s + 1), p instanceof t.Node) return o[s] = [e.x, e.y], p;
                    this.trackRecursion && 0 === --m.retainCount && (m.tested = !1), h > p && (h = p)
                }
                return h
            }.bind(this), p = r.getNodeAt(e, n), g = r.getNodeAt(i, o), v = c(p, g);
            for (s = 0; !0; ++s) {
                if (a = [], h = d(p, 0, v, a, 0), h === 1 / 0) return [];
                if (h instanceof t.Node) return a;
                v = h
            }
        }, e
    }();
    t.IDAStarFinder = e, __reflect(e.prototype, "PF.IDAStarFinder")
}(PF || (PF = {}));
var PF;
!function (t) {
    var e = function (t) {
        function e(e) {
            var n = t.call(this, e) || this;
            return n.heuristic = function (t, e) {
                return 0
            }, n
        }

        return __extends(e, t), e
    }(t.BiAStarFinder);
    t.BiDijkstraFinder = e, __reflect(e.prototype, "PF.BiDijkstraFinder")
}(PF || (PF = {}));