var __reflect = this && this.__reflect || function (t, i, e) {
    t.__class__ = i, e ? e.push(i) : e = [i], t.__types__ = t.__types__ ? e.concat(t.__types__) : e
}, __extends = this && this.__extends || function () {
    var t = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (t, i) {
        t.__proto__ = i
    } || function (t, i) {
        for (var e in i) i.hasOwnProperty(e) && (t[e] = i[e])
    };
    return function (i, e) {
        function s() {
            this.constructor = i
        }

        t(i, e), i.prototype = null === e ? Object.create(e) : (s.prototype = e.prototype, new s)
    }
}(), physicsape;
!function (t) {
    var i = function () {
        function i() {
            this._visible = !0, this._alwaysRepaint = !1
        }

        return i.prototype.init = function () {
        }, i.prototype.paint = function () {
        }, i.prototype.cleanup = function () {
            this.sprite.graphics.clear();
            for (var t = 0; t < this.sprite.numChildren; t++) this.sprite.removeChildAt(t)
        }, Object.defineProperty(i.prototype, "alwaysRepaint", {
            get: function () {
                return this._alwaysRepaint
            }, set: function (t) {
                this._alwaysRepaint = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(i.prototype, "visible", {
            get: function () {
                return this._visible
            }, set: function (t) {
                this._visible = t, this.sprite.visible = t
            }, enumerable: !0, configurable: !0
        }), i.prototype.setStyle = function (t, i, e, s, r) {
            void 0 === t && (t = 0), void 0 === i && (i = 0), void 0 === e && (e = 1), void 0 === s && (s = 16777215), void 0 === r && (r = 1), this.setLine(t, i, e), this.setFill(s, r)
        }, i.prototype.setLine = function (t, i, e) {
            void 0 === t && (t = 0), void 0 === i && (i = 0), void 0 === e && (e = 1), this.lineThickness = t, this.lineColor = i, this.lineAlpha = e
        }, i.prototype.setFill = function (t, i) {
            void 0 === t && (t = 16777215), void 0 === i && (i = 1), this.fillColor = t, this.fillAlpha = i
        }, Object.defineProperty(i.prototype, "sprite", {
            get: function () {
                if (null != this._sprite) return this._sprite;
                if (null == t.APEngine.container) throw new Error("The container property of the APEngine class has not been set");
                return this._sprite = new egret.Sprite, t.APEngine.container.addChild(this._sprite), this._sprite
            }, enumerable: !0, configurable: !0
        }), i
    }();
    t.AbstractItem = i, __reflect(i.prototype, "physicsape.AbstractItem")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function (i) {
        function e(e, s, r, n, o, c) {
            var a = i.call(this) || this;
            if ("ape.AbstractParticle" == egret.getQualifiedClassName(a)) throw new Error("AbstractParticle can't be instantiated directly");
            return a.interval = new t.PhysicsInterval(0, 0), a.curr = new t.PhysicsVector(e, s), a.prev = new t.PhysicsVector(e, s), a.samp = new t.PhysicsVector, a.temp = new t.PhysicsVector, a.fixed = r, a.forces = new t.PhysicsVector, a.collision = new t.Collision(new t.PhysicsVector, new t.PhysicsVector), a.collidable = !0, a.mass = n, a.elasticity = o, a.friction = c, a.setStyle(), a._center = new t.PhysicsVector, a._multisample = 0, a
        }

        return __extends(e, i), Object.defineProperty(e.prototype, "mass", {
            get: function () {
                return this._mass
            }, set: function (t) {
                if (0 >= t) throw new Error("mass may not be set <= 0");
                this._mass = t, this._invMass = 1 / this._mass
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "elasticity", {
            get: function () {
                return this._kfr
            }, set: function (t) {
                this._kfr = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "multisample", {
            get: function () {
                return this._multisample
            }, set: function (t) {
                this._multisample = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "center", {
            get: function () {
                return this._center.setTo(this.px, this.py), this._center
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "friction", {
            get: function () {
                return this._friction
            }, set: function (t) {
                if (0 > t || t > 1) throw new Error("Legal friction must be >= 0 and <=1");
                this._friction = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "fixed", {
            get: function () {
                return this._fixed
            }, set: function (t) {
                this._fixed = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "position", {
            get: function () {
                return new t.PhysicsVector(this.curr.x, this.curr.y)
            }, set: function (t) {
                this.curr.copy(t), this.prev.copy(t)
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "px", {
            get: function () {
                return this.curr.x
            }, set: function (t) {
                this.curr.x = t, this.prev.x = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "py", {
            get: function () {
                return this.curr.y
            }, set: function (t) {
                this.curr.y = t, this.prev.y = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "velocity", {
            get: function () {
                return this.curr.minus(this.prev)
            }, set: function (t) {
                this.prev = this.curr.minus(t)
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "collidable", {
            get: function () {
                return this._collidable
            }, set: function (t) {
                this._collidable = t
            }, enumerable: !0, configurable: !0
        }), e.prototype.setDisplay = function (i, e, s, r) {
            void 0 === e && (e = 0), void 0 === s && (s = 0), void 0 === r && (r = 0), this.displayObject = i, this.displayObjectRotation = r, this.displayObjectOffset = new t.PhysicsVector(e, s)
        }, e.prototype.addForce = function (t) {
            this.forces.plusEquals(t.mult(this.invMass))
        }, e.prototype.addMasslessForce = function (t) {
            this.forces.plusEquals(t)
        }, e.prototype.update = function (i) {
            if (!this.fixed) {
                this.addForce(t.APEngine.force), this.addMasslessForce(t.APEngine.masslessForce), this.temp.copy(this.curr);
                var e = this.velocity.plus(this.forces.multEquals(i));
                this.curr.plusEquals(e.multEquals(t.APEngine.damping)), this.prev.copy(this.temp), this.forces.setTo(0, 0)
            }
        }, e.prototype.initDisplay = function () {
            this.displayObject.x = this.displayObjectOffset.x, this.displayObject.y = this.displayObjectOffset.y, this.displayObject.rotation = this.displayObjectRotation, this.sprite.addChild(this.displayObject)
        }, e.prototype.getComponents = function (t) {
            var i = this.velocity, e = t.dot(i);
            return this.collision.vn = t.mult(e), this.collision.vt = i.minus(this.collision.vn), this.collision
        }, e.prototype.resolveCollision = function (t, i, e, s, r, n) {
            this.curr.plusEquals(t), this.velocity = i
        }, Object.defineProperty(e.prototype, "invMass", {
            get: function () {
                return this.fixed ? 0 : this._invMass
            }, enumerable: !0, configurable: !0
        }), e
    }(t.AbstractItem);
    t.AbstractParticle = i, __reflect(i.prototype, "physicsape.AbstractParticle")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function () {
        function i() {
            if ("ape.AbstractCollection" == egret.getQualifiedClassName(this)) throw new Error("AbstractCollection can't be instantiated directly");
            this._isParented = !1, this._particles = [], this._constraints = []
        }

        return Object.defineProperty(i.prototype, "particles", {
            get: function () {
                return this._particles
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(i.prototype, "constraints", {
            get: function () {
                return this._constraints
            }, enumerable: !0, configurable: !0
        }), i.prototype.addParticle = function (t) {
            this.particles.push(t), this.isParented && t.init()
        }, i.prototype.removeParticle = function (t) {
            var i = this.particles.indexOf(t);
            -1 != i && (this.particles.splice(i, 1), t.cleanup())
        }, i.prototype.addConstraint = function (t) {
            this.constraints.push(t), this.isParented && t.init()
        }, i.prototype.removeConstraint = function (t) {
            var i = this.constraints.indexOf(t);
            -1 != i && (this.constraints.splice(i, 1), t.cleanup())
        }, i.prototype.init = function () {
            for (var t = 0; t < this.particles.length; t++) this.particles[t].init();
            for (t = 0; t < this.constraints.length; t++) this.constraints[t].init()
        }, i.prototype.paint = function () {
            for (var t, i = this._particles.length, e = 0; i > e; e++) t = this._particles[e], (!t.fixed || t.alwaysRepaint) && t.paint();
            var s;
            for (i = this._constraints.length, e = 0; i > e; e++) s = this._constraints[e], (!s.fixed || s.alwaysRepaint) && s.paint()
        }, i.prototype.cleanup = function () {
            for (var t = 0; t < this.particles.length; t++) this.particles[t].cleanup();
            for (t = 0; t < this.constraints.length; t++) this.constraints[t].cleanup()
        }, Object.defineProperty(i.prototype, "sprite", {
            get: function () {
                if (null != this._sprite) return this._sprite;
                if (null == t.APEngine.container) throw new Error("The container property of the APEngine class has not been set");
                return this._sprite = new egret.Sprite, t.APEngine.container.addChild(this._sprite), this._sprite
            }, enumerable: !0, configurable: !0
        }), i.prototype.getAll = function () {
            return this.particles.concat(this.constraints)
        }, Object.defineProperty(i.prototype, "isParented", {
            get: function () {
                return this._isParented
            }, set: function (t) {
                this._isParented = t
            }, enumerable: !0, configurable: !0
        }), i.prototype.integrate = function (t) {
            for (var i = this._particles.length, e = 0; i > e; e++) {
                var s = this._particles[e];
                s.update(t)
            }
        }, i.prototype.satisfyConstraints = function () {
            for (var t = this._constraints.length, i = 0; t > i; i++) {
                var e = this._constraints[i];
                e.resolve()
            }
        }, i.prototype.checkInternalCollisions = function () {
            for (var i = this._particles.length, e = 0; i > e; e++) {
                var s = this._particles[e];
                if (s.collidable) {
                    for (var r = e + 1; i > r; r++) {
                        var n = this._particles[r];
                        n.collidable && t.CollisionDetector.test(s, n)
                    }
                    for (var o = this._constraints.length, c = 0; o > c; c++) {
                        var a = this._constraints[c];
                        a.collidable && !a.isConnectedTo(s) && (a.scp.updatePosition(), t.CollisionDetector.test(s, a.scp))
                    }
                }
            }
        }, i.prototype.checkCollisionsVsCollection = function (i) {
            for (var e = this._particles.length, s = 0; e > s; s++) {
                var r = this._particles[s];
                if (r.collidable) {
                    for (var n = i.particles.length, o = 0; n > o; o++) {
                        var c = i.particles[o];
                        c.collidable && t.CollisionDetector.test(r, c)
                    }
                    var a = i.constraints.length;
                    for (o = 0; a > o; o++) {
                        var p = i.constraints[o];
                        p.collidable && !p.isConnectedTo(r) && (p.scp.updatePosition(), t.CollisionDetector.test(r, p.scp))
                    }
                }
            }
            var l = this._constraints.length;
            for (s = 0; l > s; s++) {
                var h = this._constraints[s];
                if (h.collidable) {
                    n = i.particles.length;
                    for (var u = 0; n > u; u++) c = i.particles[u], c.collidable && !h.isConnectedTo(c) && (h.scp.updatePosition(), t.CollisionDetector.test(c, h.scp))
                }
            }
        }, i
    }();
    t.AbstractCollection = i, __reflect(i.prototype, "physicsape.AbstractCollection")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function (t) {
        function i(i, e, s, r, n, o, c) {
            void 0 === r && (r = !1), void 0 === n && (n = 1), void 0 === o && (o = .3), void 0 === c && (c = 0);
            var a = t.call(this, i, e, r, n, o, c) || this;
            return a._radius = s, a
        }

        return __extends(i, t), Object.defineProperty(i.prototype, "radius", {
            get: function () {
                return this._radius
            }, set: function (t) {
                this._radius = t
            }, enumerable: !0, configurable: !0
        }), i.prototype.init = function () {
            return this.cleanup(), null != this.displayObject ? this.initDisplay() : (this.sprite.graphics.clear(), this.sprite.graphics.lineStyle(this.lineThickness, this.lineColor, this.lineAlpha), this.sprite.graphics.beginFill(this.fillColor, this.fillAlpha), this.sprite.graphics.drawCircle(0, 0, this.radius), this.sprite.graphics.endFill()), this.paint(), this
        }, i.prototype.paint = function () {
            this.sprite.x = this.curr.x, this.sprite.y = this.curr.y
        }, i.prototype.getProjection = function (t) {
            var i = this.samp.dot(t);
            return this.interval.min = i - this._radius, this.interval.max = i + this._radius, this.interval
        }, i.prototype.getIntervalX = function () {
            return this.interval.min = this.curr.x - this._radius, this.interval.max = this.curr.x + this._radius, this.interval
        }, i.prototype.getIntervalY = function () {
            return this.interval.min = this.curr.y - this._radius, this.interval.max = this.curr.y + this._radius, this.interval
        }, i
    }(t.AbstractParticle);
    t.CircleParticle = i, __reflect(i.prototype, "physicsape.CircleParticle")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function (t) {
        function i(i) {
            var e = t.call(this) || this;
            if ("ape.AbstractConstraint" == egret.getQualifiedClassName(e)) throw new Error("AbstractConstraint can't be instantiated directly");
            return e.stiffness = i, e.setStyle(), e
        }

        return __extends(i, t), Object.defineProperty(i.prototype, "stiffness", {
            get: function () {
                return this._stiffness
            }, set: function (t) {
                this._stiffness = t
            }, enumerable: !0, configurable: !0
        }), i.prototype.resolve = function () {
        }, i
    }(t.AbstractItem);
    t.AbstractConstraint = i, __reflect(i.prototype, "physicsape.AbstractConstraint")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function (i) {
        function e(e, s, r, n, o, c, a, p, l) {
            void 0 === o && (o = 0), void 0 === c && (c = !1), void 0 === a && (a = 1), void 0 === p && (p = .3), void 0 === l && (l = 0);
            var h = i.call(this, e, s, c, a, p, l) || this;
            return h._extents = new Array(r / 2, n / 2), h._axes = new Array(new t.PhysicsVector(0, 0), new t.PhysicsVector(0, 0)), h.radian = o, h
        }

        return __extends(e, i), Object.defineProperty(e.prototype, "radian", {
            get: function () {
                return this._radian
            }, set: function (t) {
                this._radian = t, this.setAxes(t)
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "angle", {
            get: function () {
                return this.radian * t.PhysicsMath.ONE_EIGHTY_OVER_PI
            }, set: function (i) {
                this.radian = i * t.PhysicsMath.PI_OVER_ONE_EIGHTY
            }, enumerable: !0, configurable: !0
        }), e.prototype.init = function () {
            if (this.cleanup(), null != this.displayObject) this.initDisplay(); else {
                var t = 2 * this.extents[0], i = 2 * this.extents[1];
                this.sprite.graphics.clear(), this.sprite.graphics.lineStyle(this.lineThickness, this.lineColor, this.lineAlpha), this.sprite.graphics.beginFill(this.fillColor, this.fillAlpha), this.sprite.graphics.drawRect(-t / 2, -i / 2, t, i), this.sprite.graphics.endFill()
            }
            return this.paint(), this
        }, e.prototype.paint = function () {
            this.sprite.x = this.curr.x, this.sprite.y = this.curr.y, this.sprite.rotation = this.angle
        }, Object.defineProperty(e.prototype, "width", {
            get: function () {
                return 2 * this._extents[0]
            }, set: function (t) {
                this._extents[0] = t / 2
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "height", {
            get: function () {
                return 2 * this._extents[1]
            }, set: function (t) {
                this._extents[1] = t / 2
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "axes", {
            get: function () {
                return this._axes
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "extents", {
            get: function () {
                return this._extents
            }, enumerable: !0, configurable: !0
        }), e.prototype.getProjection = function (t) {
            var i = this.extents[0] * Math.abs(t.dot(this.axes[0])) + this.extents[1] * Math.abs(t.dot(this.axes[1])),
                e = this.samp.dot(t);
            return this.interval.min = e - i, this.interval.max = e + i, this.interval
        }, e.prototype.setAxes = function (t) {
            var i = Math.sin(t), e = Math.cos(t);
            this.axes[0].x = e, this.axes[0].y = i, this.axes[1].x = -i, this.axes[1].y = e
        }, e
    }(t.AbstractParticle);
    t.RectangleParticle = i, __reflect(i.prototype, "physicsape.RectangleParticle")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function () {
        function t(t, i) {
            this.vn = t, this.vt = i
        }

        return t
    }();
    t.Collision = i, __reflect(i.prototype, "physicsape.Collision")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function () {
        function i() {
        }

        return i.test = function (t, e) {
            t.fixed && e.fixed || (0 == t.multisample && 0 == e.multisample ? i.normVsNorm(t, e) : t.multisample > 0 && 0 == e.multisample ? i.sampVsNorm(t, e) : e.multisample > 0 && 0 == t.multisample ? i.sampVsNorm(e, t) : t.multisample == e.multisample ? i.sampVsSamp(t, e) : i.normVsNorm(t, e))
        }, i.normVsNorm = function (t, e) {
            t.samp.copy(t.curr), e.samp.copy(e.curr), i.testTypes(t, e)
        }, i.sampVsNorm = function (t, e) {
            var s = 1 / (t.multisample + 1), r = s;
            e.samp.copy(e.curr);
            for (var n = 0; n <= t.multisample; n++) {
                if (t.samp.setTo(t.prev.x + r * (t.curr.x - t.prev.x), t.prev.y + r * (t.curr.y - t.prev.y)), i.testTypes(t, e)) return;
                r += s
            }
        }, i.sampVsSamp = function (t, e) {
            for (var s = 1 / (t.multisample + 1), r = s, n = 0; n <= t.multisample; n++) {
                if (t.samp.setTo(t.prev.x + r * (t.curr.x - t.prev.x), t.prev.y + r * (t.curr.y - t.prev.y)), e.samp.setTo(e.prev.x + r * (e.curr.x - e.prev.x), e.prev.y + r * (e.curr.y - e.prev.y)), i.testTypes(t, e)) return;
                r += s
            }
        }, i.testTypes = function (e, s) {
            return e instanceof t.RectangleParticle && s instanceof t.RectangleParticle ? i.testOBBvsOBB(e, s) : e instanceof t.CircleParticle && s instanceof t.CircleParticle ? i.testCirclevsCircle(e, s) : e instanceof t.RectangleParticle && s instanceof t.CircleParticle ? i.testOBBvsCircle(e, s) : e instanceof t.CircleParticle && s instanceof t.RectangleParticle ? i.testOBBvsCircle(s, e) : !1
        }, i.testOBBvsOBB = function (e, s) {
            for (var r, n = Number.POSITIVE_INFINITY, o = 0; 2 > o; o++) {
                var c = e.axes[o], a = i.testIntervals(e.getProjection(c), s.getProjection(c));
                if (0 == a) return !1;
                var p = s.axes[o], l = i.testIntervals(e.getProjection(p), s.getProjection(p));
                if (0 == l) return !1;
                var h = Math.abs(a), u = Math.abs(l);
                if (h < Math.abs(n) || u < Math.abs(n)) {
                    var f = u > h;
                    r = f ? c : p, n = f ? a : l
                }
            }
            return t.CollisionResolver.resolveParticleParticle(e, s, r, n), !0
        }, i.testOBBvsCircle = function (e, s) {
            for (var r, n = Number.POSITIVE_INFINITY, o = new Array(2), c = 0; 2 > c; c++) {
                var a = e.axes[c], p = i.testIntervals(e.getProjection(a), s.getProjection(a));
                if (0 == p) return !1;
                Math.abs(p) < Math.abs(n) && (r = a, n = p), o[c] = p
            }
            var l = s.radius;
            if (Math.abs(o[0]) < l && Math.abs(o[1]) < l) {
                var h = i.closestVertexOnOBB(s.samp, e);
                r = h.minus(s.samp);
                var u = r.magnitude();
                if (n = l - u, !(n > 0)) return !1;
                r.divEquals(u)
            }
            return t.CollisionResolver.resolveParticleParticle(e, s, r, n), !0
        }, i.testCirclevsCircle = function (e, s) {
            var r = i.testIntervals(e.getIntervalX(), s.getIntervalX());
            if (0 == r) return !1;
            var n = i.testIntervals(e.getIntervalY(), s.getIntervalY());
            if (0 == n) return !1;
            var o = e.samp.minus(s.samp), c = o.magnitude(), a = e.radius + s.radius - c;
            return a > 0 ? (o.divEquals(c), t.CollisionResolver.resolveParticleParticle(e, s, o, a), !0) : !1
        }, i.testIntervals = function (t, i) {
            if (t.max < i.min) return 0;
            if (i.max < t.min) return 0;
            var e = i.max - t.min, s = i.min - t.max;
            return Math.abs(e) < Math.abs(s) ? e : s
        }, i.closestVertexOnOBB = function (i, e) {
            for (var s = i.minus(e.samp), r = new t.PhysicsVector(e.samp.x, e.samp.y), n = 0; 2 > n; n++) {
                var o = s.dot(e.axes[n]);
                o >= 0 ? o = e.extents[n] : 0 > o && (o = -e.extents[n]), r.plusEquals(e.axes[n].mult(o))
            }
            return r
        }, i
    }();
    t.CollisionDetector = i, __reflect(i.prototype, "physicsape.CollisionDetector")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function () {
        function t() {
        }

        return t.resolveParticleParticle = function (i, e, s, r) {
            i.curr.copy(i.samp), e.curr.copy(e.samp);
            var n = s.mult(r), o = i.elasticity + e.elasticity, c = i.invMass + e.invMass,
                a = t.clamp(1 - (i.friction + e.friction), 0, 1), p = i.getComponents(s), l = e.getComponents(s),
                h = l.vn.mult((o + 1) * i.invMass).plus(p.vn.mult(e.invMass - o * i.invMass)).divEquals(c),
                u = p.vn.mult((o + 1) * e.invMass).plus(l.vn.mult(i.invMass - o * e.invMass)).divEquals(c);
            p.vt.multEquals(a), l.vt.multEquals(a);
            var f = n.mult(i.invMass / c), y = n.mult(-e.invMass / c);
            h.plusEquals(p.vt), u.plusEquals(l.vt), i.fixed || i.resolveCollision(f, h, s, r, -1, e), e.fixed || e.resolveCollision(y, u, s, r, 1, i)
        }, t.clamp = function (t, i, e) {
            return t > e ? e : i > t ? i : t
        }, t
    }();
    t.CollisionResolver = i, __reflect(i.prototype, "physicsape.CollisionResolver")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function (i) {
        function e() {
            var e = i.call(this) || this;
            return e.delta = new t.PhysicsVector, e
        }

        return __extends(e, i), e.prototype.rotateByRadian = function (t, i) {
            for (var e, s = this.particles, r = s.length, n = 0; r > n; n++) {
                e = s[n];
                var o = e.center.distance(i), c = this.getRelativeAngle(i, e.center) + t;
                e.px = Math.cos(c) * o + i.x, e.py = Math.sin(c) * o + i.y
            }
        }, e.prototype.rotateByAngle = function (i, e) {
            var s = i * t.PhysicsMath.PI_OVER_ONE_EIGHTY;
            this.rotateByRadian(s, e)
        }, Object.defineProperty(e.prototype, "fixed", {
            get: function () {
                for (var t = 0; t < this.particles.length; t++) if (!this.particles[t].fixed) return !1;
                return !0
            }, set: function (t) {
                for (var i = 0; i < this.particles.length; i++) this.particles[i].fixed = t
            }, enumerable: !0, configurable: !0
        }), e.prototype.getRelativeAngle = function (t, i) {
            return this.delta.setTo(i.x - t.x, i.y - t.y), Math.atan2(this.delta.y, this.delta.x)
        }, e
    }(t.AbstractCollection);
    t.Composite = i, __reflect(i.prototype, "physicsape.Composite")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function (t) {
        function i(i) {
            void 0 === i && (i = !1);
            var e = t.call(this) || this;
            return e._composites = [], e._collisionList = [], e.collideInternal = i, e
        }

        return __extends(i, t), i.prototype.init = function () {
            t.prototype.init.call(this);
            for (var i = 0; i < this.composites.length; i++) this.composites[i].init()
        }, Object.defineProperty(i.prototype, "composites", {
            get: function () {
                return this._composites
            }, enumerable: !0, configurable: !0
        }), i.prototype.addComposite = function (t) {
            this.composites.push(t), t.isParented = !0, this.isParented && t.init()
        }, i.prototype.removeComposite = function (t) {
            var i = this.composites.indexOf(t);
            -1 != i && (this.composites.splice(i, 1), t.isParented = !1, t.cleanup())
        }, i.prototype.paint = function () {
            t.prototype.paint.call(this);
            for (var i = this._composites.length, e = 0; i > e; e++) {
                var s = this._composites[e];
                s.paint()
            }
        }, i.prototype.addCollidable = function (t) {
            this.collisionList.push(t)
        }, i.prototype.removeCollidable = function (t) {
            var i = this.collisionList.indexOf(t);
            -1 != i && this.collisionList.splice(i, 1)
        }, i.prototype.addCollidableList = function (t) {
            for (var i = 0; i < t.length; i++) {
                var e = t[i];
                this.collisionList.push(e)
            }
        }, Object.defineProperty(i.prototype, "collisionList", {
            get: function () {
                return this._collisionList
            }, enumerable: !0, configurable: !0
        }), i.prototype.getAll = function () {
            return this.particles.concat(this.constraints).concat(this.composites)
        }, Object.defineProperty(i.prototype, "collideInternal", {
            get: function () {
                return this._collideInternal
            }, set: function (t) {
                this._collideInternal = t
            }, enumerable: !0, configurable: !0
        }), i.prototype.cleanup = function () {
            t.prototype.cleanup.call(this);
            for (var i = 0; i < this.composites.length; i++) this.composites[i].cleanup()
        }, i.prototype.integrate = function (i) {
            t.prototype.integrate.call(this, i);
            for (var e = this._composites.length, s = 0; e > s; s++) {
                var r = this._composites[s];
                r.integrate(i)
            }
        }, i.prototype.satisfyConstraints = function () {
            t.prototype.satisfyConstraints.call(this);
            for (var i = this._composites.length, e = 0; i > e; e++) {
                var s = this._composites[e];
                s.satisfyConstraints()
            }
        }, i.prototype.checkCollisions = function () {
            this.collideInternal && this.checkCollisionGroupInternal();
            for (var t = this.collisionList.length, i = 0; t > i; i++) {
                var e = this.collisionList[i];
                this.checkCollisionVsGroup(e)
            }
        }, i.prototype.checkCollisionGroupInternal = function () {
            this.checkInternalCollisions();
            for (var t = this._composites.length, i = 0; t > i; i++) {
                var e = this._composites[i];
                e.checkCollisionsVsCollection(this);
                for (var s = i + 1; t > s; s++) {
                    var r = this._composites[s];
                    e.checkCollisionsVsCollection(r)
                }
            }
        }, i.prototype.checkCollisionVsGroup = function (t) {
            this.checkCollisionsVsCollection(t);
            for (var i = this._composites.length, e = t.composites.length, s = 0; i > s; s++) {
                var r = this._composites[s];
                r.checkCollisionsVsCollection(t);
                for (var n = 0; e > n; n++) {
                    var o = t.composites[n];
                    r.checkCollisionsVsCollection(o)
                }
            }
            for (n = 0; e > n; n++) o = t.composites[n], this.checkCollisionsVsCollection(o)
        }, i
    }(t.AbstractCollection);
    t.PhysicsGroup = i, __reflect(i.prototype, "physicsape.PhysicsGroup")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function () {
        function t(t, i) {
            this.min = t, this.max = i
        }

        return t.prototype.toString = function () {
            return this.min + " : " + this.max
        }, t
    }();
    t.PhysicsInterval = i, __reflect(i.prototype, "physicsape.PhysicsInterval")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function () {
        function t() {
        }

        return t.clamp = function (t, i, e) {
            return i > t ? i : t > e ? e : t
        }, t.sign = function (t) {
            return 0 > t ? -1 : 1
        }, t.ONE_EIGHTY_OVER_PI = 180 / Math.PI, t.PI_OVER_ONE_EIGHTY = Math.PI / 180, t
    }();
    t.PhysicsMath = i, __reflect(i.prototype, "physicsape.PhysicsMath")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function () {
        function t(t, i) {
            void 0 === t && (t = 0), void 0 === i && (i = 0), this.x = t, this.y = i
        }

        return t.prototype.setTo = function (t, i) {
            this.x = t, this.y = i
        }, t.prototype.copy = function (t) {
            this.x = t.x, this.y = t.y
        }, t.prototype.dot = function (t) {
            return this.x * t.x + this.y * t.y
        }, t.prototype.cross = function (t) {
            return this.x * t.y - this.y * t.x
        }, t.prototype.plus = function (i) {
            return new t(this.x + i.x, this.y + i.y)
        }, t.prototype.plusEquals = function (t) {
            return this.x += t.x, this.y += t.y, this
        }, t.prototype.minus = function (i) {
            return new t(this.x - i.x, this.y - i.y)
        }, t.prototype.minusEquals = function (t) {
            return this.x -= t.x, this.y -= t.y, this
        }, t.prototype.mult = function (i) {
            return new t(this.x * i, this.y * i)
        }, t.prototype.multEquals = function (t) {
            return this.x *= t, this.y *= t, this
        }, t.prototype.times = function (i) {
            return new t(this.x * i.x, this.y * i.y)
        }, t.prototype.divEquals = function (t) {
            return 0 == t && (t = 1e-4), this.x /= t, this.y /= t, this
        }, t.prototype.magnitude = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y)
        }, t.prototype.distance = function (t) {
            var i = this.minus(t);
            return i.magnitude()
        }, t.prototype.normalize = function () {
            var t = this.magnitude();
            return 0 == t && (t = 1e-4), this.mult(1 / t)
        }, t.prototype.toString = function () {
            return "(" + (Math.floor(100 * this.x) / 100 + "," + Math.floor(100 * this.y) / 100) + ")"
        }, t.prototype.equals = function (t) {
            return this.x == t.x && this.y == t.y
        }, t.prototype.rotate = function (i) {
            var e = Math.cos(i), s = Math.sin(i);
            return new t(this.x * e - this.y * s, this.x * s + this.y * e)
        }, t
    }();
    t.PhysicsVector = i, __reflect(i.prototype, "physicsape.PhysicsVector")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function (i) {
        function e(e, s, r, n, o, c, a, p) {
            void 0 === n && (n = !1), void 0 === o && (o = 1), void 0 === c && (c = .3), void 0 === a && (a = 0), void 0 === p && (p = 1);
            var l = i.call(this, e, s, r, n, o, c, a) || this;
            return l.tan = new t.PhysicsVector(0, 0), l.normSlip = new t.PhysicsVector(0, 0), l.rp = new t.RimParticle(r, 2), l.traction = p, l.orientation = new t.PhysicsVector, l
        }

        return __extends(e, i), Object.defineProperty(e.prototype, "speed", {
            get: function () {
                return this.rp.speed
            }, set: function (t) {
                this.rp.speed = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "angularVelocity", {
            get: function () {
                return this.rp.angularVelocity
            }, set: function (t) {
                this.rp.angularVelocity = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "traction", {
            get: function () {
                return 1 - this._traction
            }, set: function (t) {
                this._traction = 1 - t
            }, enumerable: !0, configurable: !0
        }), e.prototype.paint = function () {
            this.sprite.x = this.curr.x, this.sprite.y = this.curr.y, this.sprite.rotation = this.angle
        }, e.prototype.init = function () {
            return this.cleanup(), null != this.displayObject ? this.initDisplay() : (this.sprite.graphics.clear(), this.sprite.graphics.lineStyle(this.lineThickness, this.lineColor, this.lineAlpha), this.sprite.graphics.beginFill(this.fillColor, this.fillAlpha), this.sprite.graphics.drawCircle(0, 0, this.radius), this.sprite.graphics.endFill(), this.sprite.graphics.moveTo(-this.radius, 0), this.sprite.graphics.lineTo(this.radius, 0), this.sprite.graphics.moveTo(0, -this.radius), this.sprite.graphics.lineTo(0, this.radius)), this.paint(), this
        }, Object.defineProperty(e.prototype, "radian", {
            get: function () {
                return this.orientation.setTo(this.rp.curr.x, this.rp.curr.y), Math.atan2(this.orientation.y, this.orientation.x) + Math.PI
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "angle", {
            get: function () {
                return this.radian * t.PhysicsMath.ONE_EIGHTY_OVER_PI
            }, enumerable: !0, configurable: !0
        }), e.prototype.update = function (t) {
            i.prototype.update.call(this, t), this.rp.update(t)
        }, e.prototype.resolveCollision = function (e, s, r, n, o, c) {
            i.prototype.resolveCollision.call(this, e, s, r, n, o, c), this.resolve(r.mult(t.PhysicsMath.sign(n * o)))
        }, e.prototype.resolve = function (t) {
            this.tan.setTo(-this.rp.curr.y, this.rp.curr.x), this.tan = this.tan.normalize();
            var i = this.tan.mult(this.rp.speed), e = this.velocity.plusEquals(i), s = e.cross(t);
            this.tan.multEquals(s), this.rp.prev.copy(this.rp.curr.minus(this.tan));
            var r = (1 - this._traction) * this.rp.speed;
            this.normSlip.setTo(r * t.y, r * t.x), this.curr.plusEquals(this.normSlip), this.rp.speed *= this._traction
        }, e
    }(t.CircleParticle);
    t.WheelParticle = i, __reflect(i.prototype, "physicsape.WheelParticle")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function (i) {
        function e(e, s, r, n, o, c, a, p, l) {
            void 0 === o && (o = 0), void 0 === c && (c = !1), void 0 === a && (a = 1), void 0 === p && (p = .3), void 0 === l && (l = 0);
            var h = i.call(this, e, s, r, n, o, c, a, p, l) || this;
            return h._av = 0, h._vertices = new Array(new t.PhysicsVector(h.extents[0], -h.extents[1]), new t.PhysicsVector(h.extents[0], h.extents[1]), new t.PhysicsVector(-h.extents[0], h.extents[1]), new t.PhysicsVector(-h.extents[0], -h.extents[1])), h
        }

        return __extends(e, i), e.prototype.update = function (t) {
            this.angle += this._av * t, i.prototype.update.call(this, t)
        }, e.prototype.findHitPoint = function (i) {
            return i instanceof t.RectangleParticle ? this.findHitPointOBB(i) : i instanceof t.CircleParticle ? this.findHitPointCircle(i) : new t.PhysicsVector(0, 0)
        }, e.prototype.findHitPointCircle = function (i) {
            return new t.PhysicsVector(0, 0)
        }, e.prototype.findHitPointOBB = function (i) {
            var e, s, r = new Array(this.axes[0], this.axes[1], this.axes[0].mult(-1), this.axes[1].mult(-1)),
                n = new Array(r[0].mult(this.extents[0]), r[1].mult(this.extents[1]), r[2].mult(this.extents[0]), r[3].mult(this.extents[1])),
                o = new Array(n[0].plus(n[1]), n[1].plus(n[2]), n[2].plus(n[3]), n[3].plus(n[0])),
                c = i.curr.minus(this.curr),
                a = new Array(i.axes[0], i.axes[1], i.axes[0].mult(-1), i.axes[1].mult(-1)),
                p = new Array(a[0].mult(i.extents[0]), a[1].mult(i.extents[1]), a[2].mult(i.extents[0]), a[3].mult(i.extents[1])),
                l = new Array(p[0].plus(p[1]), p[1].plus(p[2]), p[2].plus(p[3]), p[3].plus(p[0]));
            for (e = 0; 4 > e; e++) p[e].plusEquals(c), l[e].plusEquals(c);
            var h, u = [];
            for (e = 0; 4 > e; e++) {
                for (h = !0, s = 0; 4 > s; s++) if (o[e].minus(p[s]).dot(a[s]) > .01) {
                    h = !1;
                    break
                }
                h && u.push(o[e])
            }
            for (e = 0; 4 > e; e++) {
                for (h = !0, s = 0; 4 > s; s++) if (l[e].minus(n[s]).dot(r[s]) > .01) {
                    h = !1;
                    break
                }
                h && u.push(l[e])
            }
            var f = new t.PhysicsVector(0, 0);
            for (e = 0; e < u.length; e++) f.plusEquals(u[e]);
            return u.length > 0 && f.multEquals(1 / u.length), f
        }, e.prototype.resolveCollision = function (t, e, s, r, n, o) {
            i.prototype.resolveCollision.call(this, t, e, s, r, n, o);
            var c = this.findHitPoint(o);
            if (void 0 != c) {
                var a = c.cross(t);
                this._av += a
            }
        }, e
    }(t.RectangleParticle);
    t.RigidParticle = i, __reflect(i.prototype, "physicsape.RigidParticle")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function () {
        function i(i, e) {
            this.curr = new t.PhysicsVector(i, 0), this.prev = new t.PhysicsVector(0, 0), this.sp = 0, this.av = 0, this.maxTorque = e, this.wr = i
        }

        return Object.defineProperty(i.prototype, "speed", {
            get: function () {
                return this.sp
            }, set: function (t) {
                this.sp = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(i.prototype, "angularVelocity", {
            get: function () {
                return this.av
            }, set: function (t) {
                this.av = t
            }, enumerable: !0, configurable: !0
        }), i.prototype.update = function (i) {
            this.sp = Math.max(-this.maxTorque, Math.min(this.maxTorque, this.sp + this.av));
            var e = -this.curr.y, s = this.curr.x, r = Math.sqrt(e * e + s * s);
            e /= r, s /= r, this.curr.x += this.sp * e, this.curr.y += this.sp * s;
            var n = this.prev.x, o = this.prev.y, c = this.prev.x = this.curr.x, a = this.prev.y = this.curr.y;
            this.curr.x += t.APEngine.damping * (c - n), this.curr.y += t.APEngine.damping * (a - o);
            var p = Math.sqrt(this.curr.x * this.curr.x + this.curr.y * this.curr.y), l = (p - this.wr) / p;
            this.curr.x -= this.curr.x * l, this.curr.y -= this.curr.y * l
        }, i
    }();
    t.RimParticle = i, __reflect(i.prototype, "physicsape.RimParticle")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function (i) {
        function e(t, e, s, r, n, o, c) {
            void 0 === s && (s = .5), void 0 === r && (r = !1), void 0 === n && (n = 1), void 0 === o && (o = 1), void 0 === c && (c = !1);
            var a = i.call(this, s) || this;
            return a.p1 = t, a.p2 = e, a.checkParticlesLocation(), a._restLength = a.currLength, a.setCollidable(r, n, o, c), a
        }

        return __extends(e, i), Object.defineProperty(e.prototype, "radian", {
            get: function () {
                var t = this.delta;
                return Math.atan2(t.y, t.x)
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "angle", {
            get: function () {
                return this.radian * t.PhysicsMath.ONE_EIGHTY_OVER_PI
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "center", {
            get: function () {
                return this.p1.curr.plus(this.p2.curr).divEquals(2)
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "rectScale", {
            get: function () {
                return this.scp.rectScale
            }, set: function (t) {
                null != this.scp && (this.scp.rectScale = t)
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "currLength", {
            get: function () {
                return this.p1.curr.distance(this.p2.curr)
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "rectHeight", {
            get: function () {
                return this.scp.rectHeight
            }, set: function (t) {
                null != this.scp && (this.scp.rectHeight = t)
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "restLength", {
            get: function () {
                return this._restLength
            }, set: function (t) {
                if (0 >= t) throw new Error("restLength must be greater than 0");
                this._restLength = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "collidable", {
            get: function () {
                return this._collidable
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "fixedEndLimit", {
            get: function () {
                return this.scp.fixedEndLimit
            }, set: function (t) {
                null != this.scp && (this.scp.fixedEndLimit = t)
            }, enumerable: !0, configurable: !0
        }), e.prototype.setCollidable = function (i, e, s, r) {
            void 0 === r && (r = !1), this._collidable = i, this._scp = null, this._collidable && (this._scp = new t.SpringConstraintParticle(this.p1, this.p2, this, e, s, r))
        }, e.prototype.isConnectedTo = function (t) {
            return t == this.p1 || t == this.p2
        }, Object.defineProperty(e.prototype, "fixed", {
            get: function () {
                return this.p1.fixed && this.p2.fixed
            }, enumerable: !0, configurable: !0
        }), e.prototype.init = function () {
            this.cleanup(), this.collidable ? this.scp.init() : null != this.displayObject && this.initDisplay(), this.paint()
        }, e.prototype.paint = function () {
            if (this.collidable) this.scp.paint(); else if (null != this.displayObject) {
                var t = this.center;
                this.sprite.x = t.x, this.sprite.y = t.y, this.sprite.rotation = this.angle
            } else this.sprite.graphics.clear(), this.sprite.graphics.lineStyle(this.lineThickness, this.lineColor, this.lineAlpha), this.sprite.graphics.moveTo(this.p1.px, this.p1.py), this.sprite.graphics.lineTo(this.p2.px, this.p2.py)
        }, e.prototype.setDisplay = function (i, e, s, r) {
            void 0 === e && (e = 0), void 0 === s && (s = 0), void 0 === r && (r = 0), this.collidable ? this.scp.setDisplay(i, e, s, r) : (this.displayObject = i, this.displayObjectRotation = r, this.displayObjectOffset = new t.PhysicsVector(e, s))
        }, e.prototype.initDisplay = function () {
            this.collidable ? this.scp.initDisplay() : (this.displayObject.x = this.displayObjectOffset.x, this.displayObject.y = this.displayObjectOffset.y, this.displayObject.rotation = this.displayObjectRotation, this.sprite.addChild(this.displayObject))
        }, Object.defineProperty(e.prototype, "delta", {
            get: function () {
                return this.p1.curr.minus(this.p2.curr)
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "scp", {
            get: function () {
                return this._scp
            }, enumerable: !0, configurable: !0
        }), e.prototype.resolve = function () {
            if (!this.p1.fixed || !this.p2.fixed) {
                var t = this.currLength, i = (t - this.restLength) / (t * (this.p1.invMass + this.p2.invMass)),
                    e = this.delta.mult(i * this.stiffness);
                this.p1.curr.minusEquals(e.mult(this.p1.invMass)), this.p2.curr.plusEquals(e.mult(this.p2.invMass))
            }
        }, e.prototype.checkParticlesLocation = function () {
            this.p1.curr.x == this.p2.curr.x && this.p1.curr.y == this.p2.curr.y && (this.p2.curr.x += 1e-4)
        }, e
    }(t.AbstractConstraint);
    t.SpringConstraint = i, __reflect(i.prototype, "physicsape.SpringConstraint")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function (i) {
        function e(e, s, r, n, o, c) {
            var a = i.call(this, 0, 0, 0, 0, 0, !1) || this;
            return a.p1 = e, a.p2 = s, a.lambda = new t.PhysicsVector(0, 0), a.avgVelocity = new t.PhysicsVector(0, 0), a.parent = r, a.rectScale = o, a.rectHeight = n, a.scaleToLength = c, a.fixedEndLimit = 0, a.rca = new t.PhysicsVector, a.rcb = new t.PhysicsVector, a
        }

        return __extends(e, i), Object.defineProperty(e.prototype, "rectScale", {
            get: function () {
                return this._rectScale
            }, set: function (t) {
                this._rectScale = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "rectHeight", {
            get: function () {
                return this._rectHeight
            }, set: function (t) {
                this._rectHeight = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "fixedEndLimit", {
            get: function () {
                return this._fixedEndLimit
            }, set: function (t) {
                this._fixedEndLimit = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "mass", {
            get: function () {
                return (this.p1.mass + this.p2.mass) / 2
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "elasticity", {
            get: function () {
                return (this.p1.elasticity + this.p2.elasticity) / 2
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "friction", {
            get: function () {
                return (this.p1.friction + this.p2.friction) / 2
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(e.prototype, "velocity", {
            get: function () {
                var t = this.p1.velocity, i = this.p2.velocity;
                return this.avgVelocity.setTo((t.x + i.x) / 2, (t.y + i.y) / 2), this.avgVelocity
            }, enumerable: !0, configurable: !0
        }), e.prototype.init = function () {
            if (null != this.displayObject) this.initDisplay(); else {
                var t = new egret.Sprite;
                this.parent.sprite.addChild(t), t.name = "inner";
                var i = this.parent.currLength * this.rectScale, e = this.rectHeight;
                t.graphics.clear(), t.graphics.lineStyle(this.parent.lineThickness, this.parent.lineColor, this.parent.lineAlpha), t.graphics.beginFill(this.parent.fillColor, this.parent.fillAlpha), t.graphics.drawRect(-i / 2, -e / 2, i, e), t.graphics.endFill()
            }
            return this.paint(), this
        }, e.prototype.paint = function () {
            var t = this.parent.center, i = this.parent.sprite;
            this.scaleToLength ? i.getChildByName("inner").width = this.parent.currLength * this.rectScale : null != this.displayObject && (i.getChildByName("inner").width = this.parent.restLength * this.rectScale), i.x = t.x, i.y = t.y, i.rotation = this.parent.angle
        }, e.prototype.initDisplay = function () {
            this.displayObject.x = this.displayObjectOffset.x, this.displayObject.y = this.displayObjectOffset.y, this.displayObject.rotation = this.displayObjectRotation;
            var t = new egret.Sprite;
            t.name = "inner", t.addChild(this.displayObject), this.parent.sprite.addChild(t)
        }, Object.defineProperty(e.prototype, "invMass", {
            get: function () {
                return this.p1.fixed && this.p2.fixed ? 0 : 1 / ((this.p1.mass + this.p2.mass) / 2)
            }, enumerable: !0, configurable: !0
        }), e.prototype.updatePosition = function () {
            var t = this.parent.center;
            this.curr.setTo(t.x, t.y), this.width = this.scaleToLength ? this.parent.currLength * this.rectScale : this.parent.restLength * this.rectScale, this.height = this.rectHeight, this.radian = this.parent.radian
        }, e.prototype.resolveCollision = function (t, i, e, s, r, n) {
            var o = this.getContactPointParam(n), c = 1 - o, a = o;
            if (this.p1.fixed) {
                if (a <= this.fixedEndLimit) return;
                this.lambda.setTo(t.x / a, t.y / a), this.p2.curr.plusEquals(this.lambda), this.p2.velocity = i
            } else if (this.p2.fixed) {
                if (c <= this.fixedEndLimit) return;
                this.lambda.setTo(t.x / c, t.y / c), this.p1.curr.plusEquals(this.lambda), this.p1.velocity = i
            } else {
                var p = c * c + a * a;
                if (0 == p) return;
                if (this.lambda.setTo(t.x / p, t.y / p), this.p1.curr.plusEquals(this.lambda.mult(c)), this.p2.curr.plusEquals(this.lambda.mult(a)), .5 == o) this.p1.velocity = i, this.p2.velocity = i; else {
                    var l = .5 > o ? this.p1 : this.p2;
                    l.velocity = i
                }
            }
        }, e.prototype.closestParamPoint = function (i) {
            var e = this.p2.curr.minus(this.p1.curr), s = e.dot(i.minus(this.p1.curr)) / e.dot(e);
            return t.PhysicsMath.clamp(s, 0, 1)
        }, e.prototype.getContactPointParam = function (i) {
            var e;
            if (i instanceof t.CircleParticle) e = this.closestParamPoint(i.curr); else if (i instanceof t.RectangleParticle) {
                for (var s, r = new Array(4), n = Number.POSITIVE_INFINITY, o = 0; 4 > o; o++) {
                    this.setCorners(i, o);
                    var c = this.closestPtSegmentSegment();
                    n > c && (n = c, s = o, r[o] = this.s)
                }
                e = r[s]
            }
            return e
        }, e.prototype.setCorners = function (t, i) {
            var e = t.curr.x, s = t.curr.y, r = t.axes, n = t.extents, o = r[0].x * n[0], c = r[0].y * n[0],
                a = r[1].x * n[1], p = r[1].y * n[1], l = o - a, h = c - p, u = o + a, f = c + p;
            0 == i ? (this.rca.x = e - u, this.rca.y = s - f, this.rcb.x = e + l, this.rcb.y = s + h) : 1 == i ? (this.rca.x = e + l, this.rca.y = s + h, this.rcb.x = e + u, this.rcb.y = s + f) : 2 == i ? (this.rca.x = e + u, this.rca.y = s + f, this.rcb.x = e - l, this.rcb.y = s - h) : 3 == i && (this.rca.x = e - l, this.rca.y = s - h, this.rcb.x = e - u, this.rcb.y = s - f)
        }, e.prototype.closestPtSegmentSegment = function () {
            var i, e = this.p1.curr, s = this.p2.curr, r = this.rca, n = this.rcb, o = s.minus(e), c = n.minus(r),
                a = e.minus(r), p = o.dot(o), l = c.dot(c), h = c.dot(a), u = o.dot(a), f = o.dot(c), y = p * l - f * f;
            0 != y ? this.s = t.PhysicsMath.clamp((f * h - u * l) / y, 0, 1) : this.s = .5, i = (f * this.s + h) / l, 0 > i ? (i = 0, this.s = t.PhysicsMath.clamp(-u / p, 0, 1)) : i > 0 && (i = 1, this.s = t.PhysicsMath.clamp((f - u) / p, 0, 1));
            var d = e.plus(o.mult(this.s)), v = r.plus(c.mult(i)), m = d.minus(v);
            return m.dot(m)
        }, e
    }(t.RectangleParticle);
    t.SpringConstraintParticle = i, __reflect(i.prototype, "physicsape.SpringConstraintParticle")
}(physicsape || (physicsape = {}));
var physicsape;
!function (t) {
    var i = function () {
        function i() {
        }

        return i.init = function (i) {
            void 0 === i && (i = .25), this.timeStep = i * i, this.numGroups = 0, this.groups = [], this.force = new t.PhysicsVector(0, 0), this.masslessForce = new t.PhysicsVector(0, 0), this.damping = 1, this._constraintCycles = 0, this._constraintCollisionCycles = 1
        }, Object.defineProperty(i, "damping", {
            get: function () {
                return this._damping
            }, set: function (t) {
                this._damping = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(i, "constraintCycles", {
            get: function () {
                return this._constraintCycles
            }, set: function (t) {
                this._constraintCycles = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(i, "constraintCollisionCycles", {
            get: function () {
                return this._constraintCollisionCycles
            }, set: function (t) {
                this._constraintCollisionCycles = t
            }, enumerable: !0, configurable: !0
        }), Object.defineProperty(i, "container", {
            get: function () {
                return this._container
            }, set: function (t) {
                this._container = t
            }, enumerable: !0, configurable: !0
        }), i.addForce = function (t) {
            this.force.plusEquals(t)
        }, i.addMasslessForce = function (t) {
            this.masslessForce.plusEquals(t)
        }, i.addGroup = function (t) {
            this.groups.push(t), t.isParented = !0, this.numGroups++, t.init()
        }, i.removeGroup = function (t) {
            var i = this.groups.indexOf(t);
            -1 != i && (this.groups.splice(i, 1), t.isParented = !1, this.numGroups--, t.cleanup())
        }, i.step = function () {
            this.integrate();
            for (var t = 0; t < this._constraintCycles; t++) this.satisfyConstraints();
            for (var i = 0; i < this._constraintCollisionCycles; i++) this.satisfyConstraints(), this.checkCollisions()
        }, i.paint = function () {
            for (var t = 0; t < this.numGroups; t++) {
                var i = this.groups[t];
                i.paint()
            }
        }, i.integrate = function () {
            for (var t = 0; t < this.numGroups; t++) {
                var i = this.groups[t];
                i.integrate(this.timeStep)
            }
        }, i.satisfyConstraints = function () {
            for (var t = 0; t < this.numGroups; t++) {
                var i = this.groups[t];
                i.satisfyConstraints()
            }
        }, i.checkCollisions = function () {
            for (var t = 0; t < this.numGroups; t++) {
                var i = this.groups[t];
                i.checkCollisions()
            }
        }, i
    }();
    t.APEngine = i, __reflect(i.prototype, "physicsape.APEngine")
}(physicsape || (physicsape = {}));