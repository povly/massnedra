/**
 * simplebar - v6.3.0
 * Scrollbars, simpler.
 * https://grsmto.github.io/simplebar/
 *
 * Made by Adrien Denat from a fork by Jonathan Nicol
 * Under MIT License
 */

var SimpleBar = (function () {
  "use strict";
  var e = function (t, i) {
    return (
      (e =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, t) {
            e.__proto__ = t;
          }) ||
        function (e, t) {
          for (var i in t)
            Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
        }),
      e(t, i)
    );
  };
  var t =
    "undefined" != typeof globalThis
      ? globalThis
      : "undefined" != typeof window
      ? window
      : "undefined" != typeof global
      ? global
      : "undefined" != typeof self
      ? self
      : {};
  var i = function (e) {
      var t = typeof e;
      return null != e && ("object" == t || "function" == t);
    },
    s = "object" == typeof t && t && t.Object === Object && t,
    r = "object" == typeof self && self && self.Object === Object && self,
    l = s || r || Function("return this")(),
    o = l,
    n = function () {
      return o.Date.now();
    },
    a = /\s/;
  var c = function (e) {
      for (var t = e.length; t-- && a.test(e.charAt(t)); );
      return t;
    },
    h = /^\s+/;
  var u = function (e) {
      return e ? e.slice(0, c(e) + 1).replace(h, "") : e;
    },
    d = l.Symbol,
    p = d,
    v = Object.prototype,
    f = v.hasOwnProperty,
    m = v.toString,
    b = p ? p.toStringTag : void 0;
  var g = function (e) {
      var t = f.call(e, b),
        i = e[b];
      try {
        e[b] = void 0;
        var s = !0;
      } catch (e) {}
      var r = m.call(e);
      return s && (t ? (e[b] = i) : delete e[b]), r;
    },
    x = Object.prototype.toString;
  var y = g,
    E = function (e) {
      return x.call(e);
    },
    w = d ? d.toStringTag : void 0;
  var O = function (e) {
      return null == e
        ? void 0 === e
          ? "[object Undefined]"
          : "[object Null]"
        : w && w in Object(e)
        ? y(e)
        : E(e);
    },
    S = function (e) {
      return null != e && "object" == typeof e;
    };
  var A = u,
    k = i,
    W = function (e) {
      return "symbol" == typeof e || (S(e) && "[object Symbol]" == O(e));
    },
    M = /^[-+]0x[0-9a-f]+$/i,
    N = /^0b[01]+$/i,
    L = /^0o[0-7]+$/i,
    z = parseInt;
  var C = i,
    T = n,
    D = function (e) {
      if ("number" == typeof e) return e;
      if (W(e)) return NaN;
      if (k(e)) {
        var t = "function" == typeof e.valueOf ? e.valueOf() : e;
        e = k(t) ? t + "" : t;
      }
      if ("string" != typeof e) return 0 === e ? e : +e;
      e = A(e);
      var i = N.test(e);
      return i || L.test(e) ? z(e.slice(2), i ? 2 : 8) : M.test(e) ? NaN : +e;
    },
    R = Math.max,
    V = Math.min;
  var H = function (e, t, i) {
      var s,
        r,
        l,
        o,
        n,
        a,
        c = 0,
        h = !1,
        u = !1,
        d = !0;
      if ("function" != typeof e) throw new TypeError("Expected a function");
      function p(t) {
        var i = s,
          l = r;
        return (s = r = void 0), (c = t), (o = e.apply(l, i));
      }
      function v(e) {
        return (c = e), (n = setTimeout(m, t)), h ? p(e) : o;
      }
      function f(e) {
        var i = e - a;
        return void 0 === a || i >= t || i < 0 || (u && e - c >= l);
      }
      function m() {
        var e = T();
        if (f(e)) return b(e);
        n = setTimeout(
          m,
          (function (e) {
            var i = t - (e - a);
            return u ? V(i, l - (e - c)) : i;
          })(e)
        );
      }
      function b(e) {
        return (n = void 0), d && s ? p(e) : ((s = r = void 0), o);
      }
      function g() {
        var e = T(),
          i = f(e);
        if (((s = arguments), (r = this), (a = e), i)) {
          if (void 0 === n) return v(a);
          if (u) return clearTimeout(n), (n = setTimeout(m, t)), p(a);
        }
        return void 0 === n && (n = setTimeout(m, t)), o;
      }
      return (
        (t = D(t) || 0),
        C(i) &&
          ((h = !!i.leading),
          (l = (u = "maxWait" in i) ? R(D(i.maxWait) || 0, t) : l),
          (d = "trailing" in i ? !!i.trailing : d)),
        (g.cancel = function () {
          void 0 !== n && clearTimeout(n), (c = 0), (s = a = r = n = void 0);
        }),
        (g.flush = function () {
          return void 0 === n ? o : b(T());
        }),
        g
      );
    },
    j = H,
    B = i;
  var _ = function (e, t, i) {
      var s = !0,
        r = !0;
      if ("function" != typeof e) throw new TypeError("Expected a function");
      return (
        B(i) &&
          ((s = "leading" in i ? !!i.leading : s),
          (r = "trailing" in i ? !!i.trailing : r)),
        j(e, t, { leading: s, maxWait: t, trailing: r })
      );
    },
    q = function () {
      return (
        (q =
          Object.assign ||
          function (e) {
            for (var t, i = 1, s = arguments.length; i < s; i++)
              for (var r in (t = arguments[i]))
                Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return e;
          }),
        q.apply(this, arguments)
      );
    };
  function P(e) {
    return e && e.ownerDocument && e.ownerDocument.defaultView
      ? e.ownerDocument.defaultView
      : window;
  }
  function X(e) {
    return e && e.ownerDocument ? e.ownerDocument : document;
  }
  var Y = function (e) {
    return Array.prototype.reduce.call(
      e,
      function (e, t) {
        var i = t.name.match(/data-simplebar-(.+)/);
        if (i) {
          var s = i[1].replace(/\W+(.)/g, function (e, t) {
            return t.toUpperCase();
          });
          switch (t.value) {
            case "true":
              e[s] = !0;
              break;
            case "false":
              e[s] = !1;
              break;
            case void 0:
              e[s] = !0;
              break;
            default:
              e[s] = t.value;
          }
        }
        return e;
      },
      {}
    );
  };
  function F(e, t) {
    var i;
    e && (i = e.classList).add.apply(i, t.split(" "));
  }
  function I(e, t) {
    e &&
      t.split(" ").forEach(function (t) {
        e.classList.remove(t);
      });
  }
  function U(e) {
    return ".".concat(e.split(" ").join("."));
  }
  var $ = !(
      "undefined" == typeof window ||
      !window.document ||
      !window.document.createElement
    ),
    Z = Object.freeze({
      __proto__: null,
      addClasses: F,
      canUseDOM: $,
      classNamesToQuery: U,
      getElementDocument: X,
      getElementWindow: P,
      getOptions: Y,
      removeClasses: I,
    }),
    Q = null,
    G = null;
  function J() {
    if (null === Q) {
      if ("undefined" == typeof document) return (Q = 0);
      var e = document.body,
        t = document.createElement("div");
      t.classList.add("simplebar-hide-scrollbar"), e.appendChild(t);
      var i = t.getBoundingClientRect().right;
      e.removeChild(t), (Q = i);
    }
    return Q;
  }
  $ &&
    window.addEventListener("resize", function () {
      G !== window.devicePixelRatio &&
        ((G = window.devicePixelRatio), (Q = null));
    });
  var K = P,
    ee = X,
    te = Y,
    ie = F,
    se = I,
    re = U,
    le = (function () {
      function e(t, i) {
        void 0 === i && (i = {});
        var s = this;
        if (
          ((this.removePreventClickId = null),
          (this.minScrollbarWidth = 20),
          (this.stopScrollDelay = 175),
          (this.isScrolling = !1),
          (this.isMouseEntering = !1),
          (this.isDragging = !1),
          (this.scrollXTicking = !1),
          (this.scrollYTicking = !1),
          (this.wrapperEl = null),
          (this.contentWrapperEl = null),
          (this.contentEl = null),
          (this.offsetEl = null),
          (this.maskEl = null),
          (this.placeholderEl = null),
          (this.heightAutoObserverWrapperEl = null),
          (this.heightAutoObserverEl = null),
          (this.rtlHelpers = null),
          (this.scrollbarWidth = 0),
          (this.resizeObserver = null),
          (this.mutationObserver = null),
          (this.elStyles = null),
          (this.isRtl = null),
          (this.mouseX = 0),
          (this.mouseY = 0),
          (this.onMouseMove = function () {}),
          (this.onWindowResize = function () {}),
          (this.onStopScrolling = function () {}),
          (this.onMouseEntered = function () {}),
          (this.onScroll = function () {
            var e = K(s.el);
            s.scrollXTicking ||
              (e.requestAnimationFrame(s.scrollX), (s.scrollXTicking = !0)),
              s.scrollYTicking ||
                (e.requestAnimationFrame(s.scrollY), (s.scrollYTicking = !0)),
              s.isScrolling ||
                ((s.isScrolling = !0), ie(s.el, s.classNames.scrolling)),
              s.showScrollbar("x"),
              s.showScrollbar("y"),
              s.onStopScrolling();
          }),
          (this.scrollX = function () {
            s.axis.x.isOverflowing && s.positionScrollbar("x"),
              (s.scrollXTicking = !1);
          }),
          (this.scrollY = function () {
            s.axis.y.isOverflowing && s.positionScrollbar("y"),
              (s.scrollYTicking = !1);
          }),
          (this._onStopScrolling = function () {
            se(s.el, s.classNames.scrolling),
              s.options.autoHide &&
                (s.hideScrollbar("x"), s.hideScrollbar("y")),
              (s.isScrolling = !1);
          }),
          (this.onMouseEnter = function () {
            s.isMouseEntering ||
              (ie(s.el, s.classNames.mouseEntered),
              s.showScrollbar("x"),
              s.showScrollbar("y"),
              (s.isMouseEntering = !0)),
              s.onMouseEntered();
          }),
          (this._onMouseEntered = function () {
            se(s.el, s.classNames.mouseEntered),
              s.options.autoHide &&
                (s.hideScrollbar("x"), s.hideScrollbar("y")),
              (s.isMouseEntering = !1);
          }),
          (this._onMouseMove = function (e) {
            (s.mouseX = e.clientX),
              (s.mouseY = e.clientY),
              (s.axis.x.isOverflowing || s.axis.x.forceVisible) &&
                s.onMouseMoveForAxis("x"),
              (s.axis.y.isOverflowing || s.axis.y.forceVisible) &&
                s.onMouseMoveForAxis("y");
          }),
          (this.onMouseLeave = function () {
            s.onMouseMove.cancel(),
              (s.axis.x.isOverflowing || s.axis.x.forceVisible) &&
                s.onMouseLeaveForAxis("x"),
              (s.axis.y.isOverflowing || s.axis.y.forceVisible) &&
                s.onMouseLeaveForAxis("y"),
              (s.mouseX = -1),
              (s.mouseY = -1);
          }),
          (this._onWindowResize = function () {
            (s.scrollbarWidth = s.getScrollbarWidth()), s.hideNativeScrollbar();
          }),
          (this.onPointerEvent = function (e) {
            var t, i;
            s.axis.x.track.el &&
              s.axis.y.track.el &&
              s.axis.x.scrollbar.el &&
              s.axis.y.scrollbar.el &&
              ((s.axis.x.track.rect =
                s.axis.x.track.el.getBoundingClientRect()),
              (s.axis.y.track.rect = s.axis.y.track.el.getBoundingClientRect()),
              (s.axis.x.isOverflowing || s.axis.x.forceVisible) &&
                (t = s.isWithinBounds(s.axis.x.track.rect)),
              (s.axis.y.isOverflowing || s.axis.y.forceVisible) &&
                (i = s.isWithinBounds(s.axis.y.track.rect)),
              (t || i) &&
                (e.stopPropagation(),
                "pointerdown" === e.type &&
                  "touch" !== e.pointerType &&
                  (t &&
                    ((s.axis.x.scrollbar.rect =
                      s.axis.x.scrollbar.el.getBoundingClientRect()),
                    s.isWithinBounds(s.axis.x.scrollbar.rect)
                      ? s.onDragStart(e, "x")
                      : s.onTrackClick(e, "x")),
                  i &&
                    ((s.axis.y.scrollbar.rect =
                      s.axis.y.scrollbar.el.getBoundingClientRect()),
                    s.isWithinBounds(s.axis.y.scrollbar.rect)
                      ? s.onDragStart(e, "y")
                      : s.onTrackClick(e, "y")))));
          }),
          (this.drag = function (t) {
            var i, r, l, o, n, a, c, h, u, d, p;
            if (s.draggedAxis && s.contentWrapperEl) {
              var v = s.axis[s.draggedAxis].track,
                f =
                  null !==
                    (r =
                      null === (i = v.rect) || void 0 === i
                        ? void 0
                        : i[s.axis[s.draggedAxis].sizeAttr]) && void 0 !== r
                    ? r
                    : 0,
                m = s.axis[s.draggedAxis].scrollbar,
                b =
                  null !==
                    (o =
                      null === (l = s.contentWrapperEl) || void 0 === l
                        ? void 0
                        : l[s.axis[s.draggedAxis].scrollSizeAttr]) &&
                  void 0 !== o
                    ? o
                    : 0,
                g = parseInt(
                  null !==
                    (a =
                      null === (n = s.elStyles) || void 0 === n
                        ? void 0
                        : n[s.axis[s.draggedAxis].sizeAttr]) && void 0 !== a
                    ? a
                    : "0px",
                  10
                );
              t.preventDefault(), t.stopPropagation();
              var x =
                  ("y" === s.draggedAxis ? t.pageY : t.pageX) -
                  (null !==
                    (h =
                      null === (c = v.rect) || void 0 === c
                        ? void 0
                        : c[s.axis[s.draggedAxis].offsetAttr]) && void 0 !== h
                    ? h
                    : 0) -
                  s.axis[s.draggedAxis].dragOffset,
                y =
                  ((x =
                    "x" === s.draggedAxis && s.isRtl
                      ? (null !==
                          (d =
                            null === (u = v.rect) || void 0 === u
                              ? void 0
                              : u[s.axis[s.draggedAxis].sizeAttr]) &&
                        void 0 !== d
                          ? d
                          : 0) -
                        m.size -
                        x
                      : x) /
                    (f - m.size)) *
                  (b - g);
              "x" === s.draggedAxis &&
                s.isRtl &&
                (y = (
                  null === (p = e.getRtlHelpers()) || void 0 === p
                    ? void 0
                    : p.isScrollingToNegative
                )
                  ? -y
                  : y),
                (s.contentWrapperEl[s.axis[s.draggedAxis].scrollOffsetAttr] =
                  y);
            }
          }),
          (this.onEndDrag = function (e) {
            s.isDragging = !1;
            var t = ee(s.el),
              i = K(s.el);
            e.preventDefault(),
              e.stopPropagation(),
              se(s.el, s.classNames.dragging),
              s.onStopScrolling(),
              t.removeEventListener("mousemove", s.drag, !0),
              t.removeEventListener("mouseup", s.onEndDrag, !0),
              (s.removePreventClickId = i.setTimeout(function () {
                t.removeEventListener("click", s.preventClick, !0),
                  t.removeEventListener("dblclick", s.preventClick, !0),
                  (s.removePreventClickId = null);
              }));
          }),
          (this.preventClick = function (e) {
            e.preventDefault(), e.stopPropagation();
          }),
          (this.el = t),
          (this.options = q(q({}, e.defaultOptions), i)),
          (this.classNames = q(
            q({}, e.defaultOptions.classNames),
            i.classNames
          )),
          (this.axis = {
            x: {
              scrollOffsetAttr: "scrollLeft",
              sizeAttr: "width",
              scrollSizeAttr: "scrollWidth",
              offsetSizeAttr: "offsetWidth",
              offsetAttr: "left",
              overflowAttr: "overflowX",
              dragOffset: 0,
              isOverflowing: !0,
              forceVisible: !1,
              track: { size: null, el: null, rect: null, isVisible: !1 },
              scrollbar: { size: null, el: null, rect: null, isVisible: !1 },
            },
            y: {
              scrollOffsetAttr: "scrollTop",
              sizeAttr: "height",
              scrollSizeAttr: "scrollHeight",
              offsetSizeAttr: "offsetHeight",
              offsetAttr: "top",
              overflowAttr: "overflowY",
              dragOffset: 0,
              isOverflowing: !0,
              forceVisible: !1,
              track: { size: null, el: null, rect: null, isVisible: !1 },
              scrollbar: { size: null, el: null, rect: null, isVisible: !1 },
            },
          }),
          "object" != typeof this.el || !this.el.nodeName)
        )
          throw new Error(
            "Argument passed to SimpleBar must be an HTML element instead of ".concat(
              this.el
            )
          );
        (this.onMouseMove = _(this._onMouseMove, 64)),
          (this.onWindowResize = H(this._onWindowResize, 64, { leading: !0 })),
          (this.onStopScrolling = H(
            this._onStopScrolling,
            this.stopScrollDelay
          )),
          (this.onMouseEntered = H(this._onMouseEntered, this.stopScrollDelay)),
          this.init();
      }
      return (
        (e.getRtlHelpers = function () {
          if (e.rtlHelpers) return e.rtlHelpers;
          var t = document.createElement("div");
          t.innerHTML =
            '<div class="simplebar-dummy-scrollbar-size"><div></div></div>';
          var i = t.firstElementChild,
            s = null == i ? void 0 : i.firstElementChild;
          if (!s) return null;
          document.body.appendChild(i), (i.scrollLeft = 0);
          var r = e.getOffset(i),
            l = e.getOffset(s);
          i.scrollLeft = -999;
          var o = e.getOffset(s);
          return (
            document.body.removeChild(i),
            (e.rtlHelpers = {
              isScrollOriginAtZero: r.left !== l.left,
              isScrollingToNegative: l.left !== o.left,
            }),
            e.rtlHelpers
          );
        }),
        (e.prototype.getScrollbarWidth = function () {
          try {
            return (this.contentWrapperEl &&
              "none" ===
                getComputedStyle(this.contentWrapperEl, "::-webkit-scrollbar")
                  .display) ||
              "scrollbarWidth" in document.documentElement.style ||
              "-ms-overflow-style" in document.documentElement.style
              ? 0
              : J();
          } catch (e) {
            return J();
          }
        }),
        (e.getOffset = function (e) {
          var t = e.getBoundingClientRect(),
            i = ee(e),
            s = K(e);
          return {
            top: t.top + (s.pageYOffset || i.documentElement.scrollTop),
            left: t.left + (s.pageXOffset || i.documentElement.scrollLeft),
          };
        }),
        (e.prototype.init = function () {
          $ &&
            (this.initDOM(),
            (this.rtlHelpers = e.getRtlHelpers()),
            (this.scrollbarWidth = this.getScrollbarWidth()),
            this.recalculate(),
            this.initListeners());
        }),
        (e.prototype.initDOM = function () {
          var e, t;
          (this.wrapperEl = this.el.querySelector(re(this.classNames.wrapper))),
            (this.contentWrapperEl =
              this.options.scrollableNode ||
              this.el.querySelector(re(this.classNames.contentWrapper))),
            (this.contentEl =
              this.options.contentNode ||
              this.el.querySelector(re(this.classNames.contentEl))),
            (this.offsetEl = this.el.querySelector(re(this.classNames.offset))),
            (this.maskEl = this.el.querySelector(re(this.classNames.mask))),
            (this.placeholderEl = this.findChild(
              this.wrapperEl,
              re(this.classNames.placeholder)
            )),
            (this.heightAutoObserverWrapperEl = this.el.querySelector(
              re(this.classNames.heightAutoObserverWrapperEl)
            )),
            (this.heightAutoObserverEl = this.el.querySelector(
              re(this.classNames.heightAutoObserverEl)
            )),
            (this.axis.x.track.el = this.findChild(
              this.el,
              ""
                .concat(re(this.classNames.track))
                .concat(re(this.classNames.horizontal))
            )),
            (this.axis.y.track.el = this.findChild(
              this.el,
              ""
                .concat(re(this.classNames.track))
                .concat(re(this.classNames.vertical))
            )),
            (this.axis.x.scrollbar.el =
              (null === (e = this.axis.x.track.el) || void 0 === e
                ? void 0
                : e.querySelector(re(this.classNames.scrollbar))) || null),
            (this.axis.y.scrollbar.el =
              (null === (t = this.axis.y.track.el) || void 0 === t
                ? void 0
                : t.querySelector(re(this.classNames.scrollbar))) || null),
            this.options.autoHide ||
              (ie(this.axis.x.scrollbar.el, this.classNames.visible),
              ie(this.axis.y.scrollbar.el, this.classNames.visible));
        }),
        (e.prototype.initListeners = function () {
          var e,
            t = this,
            i = K(this.el);
          if (
            (this.el.addEventListener("mouseenter", this.onMouseEnter),
            this.el.addEventListener("pointerdown", this.onPointerEvent, !0),
            this.el.addEventListener("mousemove", this.onMouseMove),
            this.el.addEventListener("mouseleave", this.onMouseLeave),
            null === (e = this.contentWrapperEl) ||
              void 0 === e ||
              e.addEventListener("scroll", this.onScroll),
            i.addEventListener("resize", this.onWindowResize),
            this.contentEl)
          ) {
            if (window.ResizeObserver) {
              var s = !1,
                r = i.ResizeObserver || ResizeObserver;
              (this.resizeObserver = new r(function () {
                s &&
                  i.requestAnimationFrame(function () {
                    t.recalculate();
                  });
              })),
                this.resizeObserver.observe(this.el),
                this.resizeObserver.observe(this.contentEl),
                i.requestAnimationFrame(function () {
                  s = !0;
                });
            }
            (this.mutationObserver = new i.MutationObserver(function () {
              i.requestAnimationFrame(function () {
                t.recalculate();
              });
            })),
              this.mutationObserver.observe(this.contentEl, {
                childList: !0,
                subtree: !0,
                characterData: !0,
              });
          }
        }),
        (e.prototype.recalculate = function () {
          if (
            this.heightAutoObserverEl &&
            this.contentEl &&
            this.contentWrapperEl &&
            this.wrapperEl &&
            this.placeholderEl
          ) {
            var e = K(this.el);
            (this.elStyles = e.getComputedStyle(this.el)),
              (this.isRtl = "rtl" === this.elStyles.direction);
            var t = this.contentEl.offsetWidth,
              i = this.heightAutoObserverEl.offsetHeight <= 1,
              s = this.heightAutoObserverEl.offsetWidth <= 1 || t > 0,
              r = this.contentWrapperEl.offsetWidth,
              l = this.elStyles.overflowX,
              o = this.elStyles.overflowY;
            (this.contentEl.style.padding = ""
              .concat(this.elStyles.paddingTop, " ")
              .concat(this.elStyles.paddingRight, " ")
              .concat(this.elStyles.paddingBottom, " ")
              .concat(this.elStyles.paddingLeft)),
              (this.wrapperEl.style.margin = "-"
                .concat(this.elStyles.paddingTop, " -")
                .concat(this.elStyles.paddingRight, " -")
                .concat(this.elStyles.paddingBottom, " -")
                .concat(this.elStyles.paddingLeft));
            var n = this.contentEl.scrollHeight,
              a = this.contentEl.scrollWidth;
            (this.contentWrapperEl.style.height = i ? "auto" : "100%"),
              (this.placeholderEl.style.width = s
                ? "".concat(t || a, "px")
                : "auto"),
              (this.placeholderEl.style.height = "".concat(n, "px"));
            var c = this.contentWrapperEl.offsetHeight;
            (this.axis.x.isOverflowing = 0 !== t && a > t),
              (this.axis.y.isOverflowing = n > c),
              (this.axis.x.isOverflowing =
                "hidden" !== l && this.axis.x.isOverflowing),
              (this.axis.y.isOverflowing =
                "hidden" !== o && this.axis.y.isOverflowing),
              (this.axis.x.forceVisible =
                "x" === this.options.forceVisible ||
                !0 === this.options.forceVisible),
              (this.axis.y.forceVisible =
                "y" === this.options.forceVisible ||
                !0 === this.options.forceVisible),
              this.hideNativeScrollbar();
            var h = this.axis.x.isOverflowing ? this.scrollbarWidth : 0,
              u = this.axis.y.isOverflowing ? this.scrollbarWidth : 0;
            (this.axis.x.isOverflowing =
              this.axis.x.isOverflowing && a > r - u),
              (this.axis.y.isOverflowing =
                this.axis.y.isOverflowing && n > c - h),
              (this.axis.x.scrollbar.size = this.getScrollbarSize("x")),
              (this.axis.y.scrollbar.size = this.getScrollbarSize("y")),
              this.axis.x.scrollbar.el &&
                (this.axis.x.scrollbar.el.style.width = "".concat(
                  this.axis.x.scrollbar.size,
                  "px"
                )),
              this.axis.y.scrollbar.el &&
                (this.axis.y.scrollbar.el.style.height = "".concat(
                  this.axis.y.scrollbar.size,
                  "px"
                )),
              this.positionScrollbar("x"),
              this.positionScrollbar("y"),
              this.toggleTrackVisibility("x"),
              this.toggleTrackVisibility("y");
          }
        }),
        (e.prototype.getScrollbarSize = function (e) {
          var t, i;
          if (
            (void 0 === e && (e = "y"),
            !this.axis[e].isOverflowing || !this.contentEl)
          )
            return 0;
          var s,
            r = this.contentEl[this.axis[e].scrollSizeAttr],
            l =
              null !==
                (i =
                  null === (t = this.axis[e].track.el) || void 0 === t
                    ? void 0
                    : t[this.axis[e].offsetSizeAttr]) && void 0 !== i
                ? i
                : 0,
            o = l / r;
          return (
            (s = Math.max(~~(o * l), this.options.scrollbarMinSize)),
            this.options.scrollbarMaxSize &&
              (s = Math.min(s, this.options.scrollbarMaxSize)),
            s
          );
        }),
        (e.prototype.positionScrollbar = function (t) {
          var i, s, r;
          void 0 === t && (t = "y");
          var l = this.axis[t].scrollbar;
          if (
            this.axis[t].isOverflowing &&
            this.contentWrapperEl &&
            l.el &&
            this.elStyles
          ) {
            var o = this.contentWrapperEl[this.axis[t].scrollSizeAttr],
              n =
                (null === (i = this.axis[t].track.el) || void 0 === i
                  ? void 0
                  : i[this.axis[t].offsetSizeAttr]) || 0,
              a = parseInt(this.elStyles[this.axis[t].sizeAttr], 10),
              c = this.contentWrapperEl[this.axis[t].scrollOffsetAttr];
            (c =
              "x" === t &&
              this.isRtl &&
              (null === (s = e.getRtlHelpers()) || void 0 === s
                ? void 0
                : s.isScrollOriginAtZero)
                ? -c
                : c),
              "x" === t &&
                this.isRtl &&
                (c = (
                  null === (r = e.getRtlHelpers()) || void 0 === r
                    ? void 0
                    : r.isScrollingToNegative
                )
                  ? c
                  : -c);
            var h = c / (o - a),
              u = ~~((n - l.size) * h);
            (u = "x" === t && this.isRtl ? -u + (n - l.size) : u),
              (l.el.style.transform =
                "x" === t
                  ? "translate3d(".concat(u, "px, 0, 0)")
                  : "translate3d(0, ".concat(u, "px, 0)"));
          }
        }),
        (e.prototype.toggleTrackVisibility = function (e) {
          void 0 === e && (e = "y");
          var t = this.axis[e].track.el,
            i = this.axis[e].scrollbar.el;
          t &&
            i &&
            this.contentWrapperEl &&
            (this.axis[e].isOverflowing || this.axis[e].forceVisible
              ? ((t.style.visibility = "visible"),
                (this.contentWrapperEl.style[this.axis[e].overflowAttr] =
                  "scroll"),
                this.el.classList.add(
                  "".concat(this.classNames.scrollable, "-").concat(e)
                ))
              : ((t.style.visibility = "hidden"),
                (this.contentWrapperEl.style[this.axis[e].overflowAttr] =
                  "hidden"),
                this.el.classList.remove(
                  "".concat(this.classNames.scrollable, "-").concat(e)
                )),
            this.axis[e].isOverflowing
              ? (i.style.display = "block")
              : (i.style.display = "none"));
        }),
        (e.prototype.showScrollbar = function (e) {
          void 0 === e && (e = "y"),
            this.axis[e].isOverflowing &&
              !this.axis[e].scrollbar.isVisible &&
              (ie(this.axis[e].scrollbar.el, this.classNames.visible),
              (this.axis[e].scrollbar.isVisible = !0));
        }),
        (e.prototype.hideScrollbar = function (e) {
          void 0 === e && (e = "y"),
            this.isDragging ||
              (this.axis[e].isOverflowing &&
                this.axis[e].scrollbar.isVisible &&
                (se(this.axis[e].scrollbar.el, this.classNames.visible),
                (this.axis[e].scrollbar.isVisible = !1)));
        }),
        (e.prototype.hideNativeScrollbar = function () {
          this.offsetEl &&
            ((this.offsetEl.style[this.isRtl ? "left" : "right"] =
              this.axis.y.isOverflowing || this.axis.y.forceVisible
                ? "-".concat(this.scrollbarWidth, "px")
                : "0px"),
            (this.offsetEl.style.bottom =
              this.axis.x.isOverflowing || this.axis.x.forceVisible
                ? "-".concat(this.scrollbarWidth, "px")
                : "0px"));
        }),
        (e.prototype.onMouseMoveForAxis = function (e) {
          void 0 === e && (e = "y");
          var t = this.axis[e];
          t.track.el &&
            t.scrollbar.el &&
            ((t.track.rect = t.track.el.getBoundingClientRect()),
            (t.scrollbar.rect = t.scrollbar.el.getBoundingClientRect()),
            this.isWithinBounds(t.track.rect)
              ? (this.showScrollbar(e),
                ie(t.track.el, this.classNames.hover),
                this.isWithinBounds(t.scrollbar.rect)
                  ? ie(t.scrollbar.el, this.classNames.hover)
                  : se(t.scrollbar.el, this.classNames.hover))
              : (se(t.track.el, this.classNames.hover),
                this.options.autoHide && this.hideScrollbar(e)));
        }),
        (e.prototype.onMouseLeaveForAxis = function (e) {
          void 0 === e && (e = "y"),
            se(this.axis[e].track.el, this.classNames.hover),
            se(this.axis[e].scrollbar.el, this.classNames.hover),
            this.options.autoHide && this.hideScrollbar(e);
        }),
        (e.prototype.onDragStart = function (e, t) {
          var i;
          void 0 === t && (t = "y"), (this.isDragging = !0);
          var s = ee(this.el),
            r = K(this.el),
            l = this.axis[t].scrollbar,
            o = "y" === t ? e.pageY : e.pageX;
          (this.axis[t].dragOffset =
            o -
            ((null === (i = l.rect) || void 0 === i
              ? void 0
              : i[this.axis[t].offsetAttr]) || 0)),
            (this.draggedAxis = t),
            ie(this.el, this.classNames.dragging),
            s.addEventListener("mousemove", this.drag, !0),
            s.addEventListener("mouseup", this.onEndDrag, !0),
            null === this.removePreventClickId
              ? (s.addEventListener("click", this.preventClick, !0),
                s.addEventListener("dblclick", this.preventClick, !0))
              : (r.clearTimeout(this.removePreventClickId),
                (this.removePreventClickId = null));
        }),
        (e.prototype.onTrackClick = function (e, t) {
          var i,
            s,
            r,
            l,
            o = this;
          void 0 === t && (t = "y");
          var n = this.axis[t];
          if (
            this.options.clickOnTrack &&
            n.scrollbar.el &&
            this.contentWrapperEl
          ) {
            e.preventDefault();
            var a = K(this.el);
            this.axis[t].scrollbar.rect =
              n.scrollbar.el.getBoundingClientRect();
            var c =
                null !==
                  (s =
                    null === (i = this.axis[t].scrollbar.rect) || void 0 === i
                      ? void 0
                      : i[this.axis[t].offsetAttr]) && void 0 !== s
                  ? s
                  : 0,
              h = parseInt(
                null !==
                  (l =
                    null === (r = this.elStyles) || void 0 === r
                      ? void 0
                      : r[this.axis[t].sizeAttr]) && void 0 !== l
                  ? l
                  : "0px",
                10
              ),
              u = this.contentWrapperEl[this.axis[t].scrollOffsetAttr],
              d = ("y" === t ? this.mouseY - c : this.mouseX - c) < 0 ? -1 : 1,
              p = -1 === d ? u - h : u + h,
              v = function () {
                o.contentWrapperEl &&
                  (-1 === d
                    ? u > p &&
                      ((u -= 40),
                      (o.contentWrapperEl[o.axis[t].scrollOffsetAttr] = u),
                      a.requestAnimationFrame(v))
                    : u < p &&
                      ((u += 40),
                      (o.contentWrapperEl[o.axis[t].scrollOffsetAttr] = u),
                      a.requestAnimationFrame(v)));
              };
            v();
          }
        }),
        (e.prototype.getContentElement = function () {
          return this.contentEl;
        }),
        (e.prototype.getScrollElement = function () {
          return this.contentWrapperEl;
        }),
        (e.prototype.removeListeners = function () {
          var e = K(this.el);
          this.el.removeEventListener("mouseenter", this.onMouseEnter),
            this.el.removeEventListener("pointerdown", this.onPointerEvent, !0),
            this.el.removeEventListener("mousemove", this.onMouseMove),
            this.el.removeEventListener("mouseleave", this.onMouseLeave),
            this.contentWrapperEl &&
              this.contentWrapperEl.removeEventListener(
                "scroll",
                this.onScroll
              ),
            e.removeEventListener("resize", this.onWindowResize),
            this.mutationObserver && this.mutationObserver.disconnect(),
            this.resizeObserver && this.resizeObserver.disconnect(),
            this.onMouseMove.cancel(),
            this.onWindowResize.cancel(),
            this.onStopScrolling.cancel(),
            this.onMouseEntered.cancel();
        }),
        (e.prototype.unMount = function () {
          this.removeListeners();
        }),
        (e.prototype.isWithinBounds = function (e) {
          return (
            this.mouseX >= e.left &&
            this.mouseX <= e.left + e.width &&
            this.mouseY >= e.top &&
            this.mouseY <= e.top + e.height
          );
        }),
        (e.prototype.findChild = function (e, t) {
          var i =
            e.matches ||
            e.webkitMatchesSelector ||
            e.mozMatchesSelector ||
            e.msMatchesSelector;
          return Array.prototype.filter.call(e.children, function (e) {
            return i.call(e, t);
          })[0];
        }),
        (e.rtlHelpers = null),
        (e.defaultOptions = {
          forceVisible: !1,
          clickOnTrack: !0,
          scrollbarMinSize: 25,
          scrollbarMaxSize: 0,
          ariaLabel: "scrollable content",
          tabIndex: 0,
          classNames: {
            contentEl: "simplebar-content",
            contentWrapper: "simplebar-content-wrapper",
            offset: "simplebar-offset",
            mask: "simplebar-mask",
            wrapper: "simplebar-wrapper",
            placeholder: "simplebar-placeholder",
            scrollbar: "simplebar-scrollbar",
            track: "simplebar-track",
            heightAutoObserverWrapperEl:
              "simplebar-height-auto-observer-wrapper",
            heightAutoObserverEl: "simplebar-height-auto-observer",
            visible: "simplebar-visible",
            horizontal: "simplebar-horizontal",
            vertical: "simplebar-vertical",
            hover: "simplebar-hover",
            dragging: "simplebar-dragging",
            scrolling: "simplebar-scrolling",
            scrollable: "simplebar-scrollable",
            mouseEntered: "simplebar-mouse-entered",
          },
          scrollableNode: null,
          contentNode: null,
          autoHide: !0,
        }),
        (e.getOptions = te),
        (e.helpers = Z),
        e
      );
    })(),
    oe = le.helpers,
    ne = oe.getOptions,
    ae = oe.addClasses,
    ce = oe.canUseDOM,
    he = (function (t) {
      function i() {
        for (var e = [], s = 0; s < arguments.length; s++) e[s] = arguments[s];
        var r = t.apply(this, e) || this;
        return i.instances.set(e[0], r), r;
      }
      return (
        (function (t, i) {
          if ("function" != typeof i && null !== i)
            throw new TypeError(
              "Class extends value " +
                String(i) +
                " is not a constructor or null"
            );
          function s() {
            this.constructor = t;
          }
          e(t, i),
            (t.prototype =
              null === i
                ? Object.create(i)
                : ((s.prototype = i.prototype), new s()));
        })(i, t),
        (i.initDOMLoadedElements = function () {
          document.removeEventListener(
            "DOMContentLoaded",
            this.initDOMLoadedElements
          ),
            window.removeEventListener("load", this.initDOMLoadedElements),
            Array.prototype.forEach.call(
              document.querySelectorAll("[data-simplebar]"),
              function (e) {
                "init" === e.getAttribute("data-simplebar") ||
                  i.instances.has(e) ||
                  new i(e, ne(e.attributes));
              }
            );
        }),
        (i.removeObserver = function () {
          var e;
          null === (e = i.globalObserver) || void 0 === e || e.disconnect();
        }),
        (i.prototype.initDOM = function () {
          var e,
            t,
            i,
            s = this;
          if (
            !Array.prototype.filter.call(this.el.children, function (e) {
              return e.classList.contains(s.classNames.wrapper);
            }).length
          ) {
            for (
              this.wrapperEl = document.createElement("div"),
                this.contentWrapperEl = document.createElement("div"),
                this.offsetEl = document.createElement("div"),
                this.maskEl = document.createElement("div"),
                this.contentEl = document.createElement("div"),
                this.placeholderEl = document.createElement("div"),
                this.heightAutoObserverWrapperEl =
                  document.createElement("div"),
                this.heightAutoObserverEl = document.createElement("div"),
                ae(this.wrapperEl, this.classNames.wrapper),
                ae(this.contentWrapperEl, this.classNames.contentWrapper),
                ae(this.offsetEl, this.classNames.offset),
                ae(this.maskEl, this.classNames.mask),
                ae(this.contentEl, this.classNames.contentEl),
                ae(this.placeholderEl, this.classNames.placeholder),
                ae(
                  this.heightAutoObserverWrapperEl,
                  this.classNames.heightAutoObserverWrapperEl
                ),
                ae(
                  this.heightAutoObserverEl,
                  this.classNames.heightAutoObserverEl
                );
              this.el.firstChild;

            )
              this.contentEl.appendChild(this.el.firstChild);
            this.contentWrapperEl.appendChild(this.contentEl),
              this.offsetEl.appendChild(this.contentWrapperEl),
              this.maskEl.appendChild(this.offsetEl),
              this.heightAutoObserverWrapperEl.appendChild(
                this.heightAutoObserverEl
              ),
              this.wrapperEl.appendChild(this.heightAutoObserverWrapperEl),
              this.wrapperEl.appendChild(this.maskEl),
              this.wrapperEl.appendChild(this.placeholderEl),
              this.el.appendChild(this.wrapperEl),
              null === (e = this.contentWrapperEl) ||
                void 0 === e ||
                e.setAttribute("tabindex", this.options.tabIndex.toString()),
              null === (t = this.contentWrapperEl) ||
                void 0 === t ||
                t.setAttribute("role", "region"),
              null === (i = this.contentWrapperEl) ||
                void 0 === i ||
                i.setAttribute("aria-label", this.options.ariaLabel);
          }
          if (!this.axis.x.track.el || !this.axis.y.track.el) {
            var r = document.createElement("div"),
              l = document.createElement("div");
            ae(r, this.classNames.track),
              ae(l, this.classNames.scrollbar),
              r.appendChild(l),
              (this.axis.x.track.el = r.cloneNode(!0)),
              ae(this.axis.x.track.el, this.classNames.horizontal),
              (this.axis.y.track.el = r.cloneNode(!0)),
              ae(this.axis.y.track.el, this.classNames.vertical),
              this.el.appendChild(this.axis.x.track.el),
              this.el.appendChild(this.axis.y.track.el);
          }
          le.prototype.initDOM.call(this),
            this.el.setAttribute("data-simplebar", "init");
        }),
        (i.prototype.unMount = function () {
          le.prototype.unMount.call(this), i.instances.delete(this.el);
        }),
        (i.initHtmlApi = function () {
          (this.initDOMLoadedElements = this.initDOMLoadedElements.bind(this)),
            "undefined" != typeof MutationObserver &&
              ((this.globalObserver = new MutationObserver(i.handleMutations)),
              this.globalObserver.observe(document, {
                childList: !0,
                subtree: !0,
              })),
            "complete" === document.readyState ||
            ("loading" !== document.readyState &&
              !document.documentElement.doScroll)
              ? window.setTimeout(this.initDOMLoadedElements)
              : (document.addEventListener(
                  "DOMContentLoaded",
                  this.initDOMLoadedElements
                ),
                window.addEventListener("load", this.initDOMLoadedElements));
        }),
        (i.handleMutations = function (e) {
          e.forEach(function (e) {
            e.addedNodes.forEach(function (e) {
              1 === e.nodeType &&
                (e.hasAttribute("data-simplebar")
                  ? !i.instances.has(e) &&
                    document.documentElement.contains(e) &&
                    new i(e, ne(e.attributes))
                  : e
                      .querySelectorAll("[data-simplebar]")
                      .forEach(function (e) {
                        "init" !== e.getAttribute("data-simplebar") &&
                          !i.instances.has(e) &&
                          document.documentElement.contains(e) &&
                          new i(e, ne(e.attributes));
                      }));
            }),
              e.removedNodes.forEach(function (e) {
                var t;
                1 === e.nodeType &&
                  ("init" === e.getAttribute("data-simplebar")
                    ? !document.documentElement.contains(e) &&
                      (null === (t = i.instances.get(e)) ||
                        void 0 === t ||
                        t.unMount())
                    : Array.prototype.forEach.call(
                        e.querySelectorAll('[data-simplebar="init"]'),
                        function (e) {
                          var t;
                          !document.documentElement.contains(e) &&
                            (null === (t = i.instances.get(e)) ||
                              void 0 === t ||
                              t.unMount());
                        }
                      ));
              });
          });
        }),
        (i.instances = new WeakMap()),
        i
      );
    })(le);
  return ce && he.initHtmlApi(), he;
})();

window.addEventListener("load", () => {
  const points = [
    {
      coordinates: [61.64333, 147.87706],
      properties: {
        balloonTitle: "ПС 220 кВ Омчак",
        balloonContent:
          "Монтажные и пусконаладочные работы по модернизации защит двух линий 110 кВ п. Омчак, Магаданская область, Россия (СМР, ПНР 2020 год)",
        address: "п. Омчак, Магаданская область",
      },
      filter: "Магаданская область",
    },
    {
      coordinates: [50.89980342338376, 128.5665373128645],
      properties: {
        balloonTitle: "ПС 220 кВ Белогорск",
        balloonContent:
          "Пусконаладочные работы УРЗА ПС 220 г. Белогорск, Амурская область, Россия (ПНР 2020 год)",
        address: "г. Белогорск, Амурская область",
      },
      filter: "Амурская область",
    },
    {
      coordinates: [49.74601092162551, 129.69413319061084],
      properties: {
        balloonTitle: "Райчихинская ГРЭС",
        balloonContent:
          "Комплекс пусконаладочных работ вторичных цепей и устройств РЗА Резервного трансформатора собственных нужд 220/10 СП «Райчихинская ГРЭС» пгт. Прогресс, Амурская область,Россия (ПНР, 2020 год);\n\nЭлектромонтажные и пусконаладочные по модернизации АОСН Райчихинской ГРЭС с реализацией УВ на отключение ВЛ 110 кВ Райчихинская ГРЭС – Бурея/т, Райчихинская ГРЭС, пгт Прогресс (в рамках инвестиционного проекта I_505-АГ-104) (СМР, ПНР, 2023)\n\nРаботы по установке дистанционной защиты ВЛ 35 кВ Райчихинской ГРЭС-Широкий и ВЛ 35 кВ Райчихинской ГРЭС -П/С «А» (СМР, ПНР, 2024)",
        address: "пгт. Прогресс, Амурская область",
      },
      filter: "Амурская область",
    },
    {
      coordinates: [52.44468288054643, 130.85413468774274],
      properties: {
        balloonTitle: "ПС 220 кВ Февральск",
        balloonContent:
          "Модернизация основной защиты АТ-2 220/110/35 ПС 220 кВ пгт. Февральск, Амурская область,Россия (СМР, ПНР, 2020 год)",
        address: "пгт. Февральск, Амурская область",
      },
      filter: "Амурская область",
    },
    {
      coordinates: [44.134542, 132.398096],
      properties: {
        balloonTitle: "ПС 500 кВ Дальрневосточная",
        balloonContent:
          "Выполнение демонтажных, электромонтажных и пусконаладочных работ на смежных подстанциях по объекту строительства «ЛЭП 220 кВ Лесозаводск- Спасск Дальневосточная» (СМР, ПНР, 2020-2021 год)",
        address: "Приморский край, с. Орехово",
      },
      filter: "Приморский край",
    },
    {
      coordinates: [43.884601, 132.774386],
      properties: {
        balloonTitle: "ПС 220 кВ НПС-41",
        balloonContent:
          "Выполнение демонтажных, электромонтажных и пусконаладочных работ на смежных подстанциях по объекту строительства «ЛЭП 220 кВ Лесозаводск- Спасск Дальневосточная» (СМР, ПНР, 2020-2021 год)",
        address: "Приморский край, с. Орехово",
      },
      filter: "Приморский край",
    },
    {
      coordinates: [44.310913, 132.728896],
      properties: {
        balloonTitle: "ПС 220 кВ НПС-40",
        balloonContent:
          "Выполнение демонтажных, электромонтажных и пусконаладочных работ на смежных подстанциях по объекту строительства «ЛЭП 220 кВ Лесозаводск- Спасск Дальневосточная» (СМР, ПНР, 2020-2021 год)",
        address: "Приморский край, с. Орехово",
      },
      filter: "Приморский край",
    },
    {
      coordinates: [42.82281983074669, 132.8609687194809],
      properties: {
        balloonTitle: "РП-5",
        balloonContent:
          'Электромонтажные и пусконаладочные работы РП-5, ООО "ТЭСК", г. Находка, Приморский край, Россия (СМР, ПНР, 2021 год)',
        address: "г. Находка, Приморский край",
      },
      filter: "Приморский край",
    },
    {
      coordinates: [49.133974626141296, 140.34205059326015],
      properties: {
        balloonTitle: "ПС 35 кВ «Терминал»",
        balloonContent:
          'Выполнение монтажных и пусконаладочных работ по реконструкции ПС 35 кВ «Терминал», г. Ванино, АО "Дальтрансуголь" (СМР, ПНР, 2021 год)',
        address: "г. Ванино, Хабаровский край",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [44.090331427432965, 133.23896478271305],
      properties: {
        balloonTitle: "ПС 220 кВ",
        balloonContent:
          "Демонтаж  и монтаж оборудования РЗА, ПА, АСУТП, ЦСПИ, ВЧ связи, прокладка, расключение, подключение кабельной продукции ПС 220 кВ Арсеньев-2  (СМР, ПНР, 2021 год)",
        address: "Приморский край, с. Орехово",
      },
      filter: "Приморский край",
    },
    {
      coordinates: [53.9671078559151, 123.92550718407813],
      properties: {
        balloonTitle: "ПС 220 кВ Сковородино",
        balloonContent:
          "Монтаж и наладка кабельных связей для вновь устанавливаемого УПАСК, модернизируемых МКПА и трансляции команд ПА на ПС 220 кВ Сковородино  (СМР 2021 год); Демонтажные, строительно – монтажные работы, а также монтаж оборудования ВЧ обработки (ВЧ заградители, конденсаторы связи) по титулу: «Модернизация ПС 220 кВ Сковородино, ПС 220 кВ Магдагачи, ПС 220 кВ Призейская, ПС 220 кВ Тында, ПС 220 кВ Благовещенская в части установки устройств ПА (41 шкаф)» для нужд филиала ПАО «ФСК ЕЭС» – МЭС Востока. (2023)",
        address: "Амурская область, с. Сковородино",
      },
      filter: "Амурская область",
    },
    {
      coordinates: [55.12632886806643, 124.75667610076746],
      properties: {
        balloonTitle: "ПС 220 кВ Тында",
        balloonContent:
          "Монтаж и наладка кабельных связей для вновь модернизируемых МКПА и трансляции команд ПА ПС 220 кВ Тында (СМР, 2021 год); Монтаж шкафа контроля переходных процессов, кабельных связей (СМР, 2021); Демонтажные, строительно-монтажные работы в объеме необходимом и достаточном для реализации инвестиционного проекта: «Модернизация ПС 220кВ Сковородино, ПС 220кВ Магдагачи, ПС 220кВ Призейская, ПС 220кВ Тында, ПС 220кВ Благовещенская в части установки устройств ПА. (41 шкаф)». (СМР, 2023)",
        address: "Амурская область, г. Тында",
      },
      filter: "Амурская область",
    },
    {
      coordinates: [58.8238, 125.52278],
      properties: {
        balloonTitle: "ПС 220 кВ Нижний Куранах",
        balloonContent:
          "Монтаж и наладка кабельных связей для трансляции команд ПА на ПС 220 кВ Нижний Куранах (СМР 2021 год)",
        address: "Республика Саха, с. Нижний Куранах",
      },
      filter: "Республика Саха",
    },
    {
      coordinates: [58.9637, 126.27251],
      properties: {
        balloonTitle: "ПС 220 кВ Томмот",
        balloonContent:
          'Монтаж и наладка кабельных связей для трансляции команд ПА ПС 220 кВ Томмот (СМР 2021 год) Реконструкция ПС 220 кВ Томмот (установка 3-х шкафов РЗиА резервной ячейки КРУЭ 110 кВ) (для ТП энергопринимающих устройств АО "ДРСК")"" (СМР, ПНР 2024 год)',
        address: "Республика Саха, пгт. Томмот",
      },
      filter: "Республика Саха",
    },
    {
      coordinates: [56.66889, 124.85333],
      properties: {
        balloonTitle: "Нерюнгирнская ГРЭС",
        balloonContent:
          "Монтаж и наладка кабельных связей для трансляции команд ПА Нерюнгринская ГРЭС (СМР 2021 год)",
        address: "Республика Саха, г. Нерюнгири",
      },
      filter: "Республика Саха",
    },
    {
      coordinates: [55.910908083894945, 124.9768882423874],
      properties: {
        balloonTitle: "ПП 220 кВ Нагорный",
        balloonContent:
          "Монтаж и наладка кабельных связей для трансляции команд ПА на ПП 220 кВ Нагорный (СМР 2021 год)",
        address: "Амурская область, п. Нагорный",
      },
      filter: "Амурская область",
    },
    {
      coordinates: [57.955674, 125.505066],
      properties: {
        balloonTitle: "ПС 220 кВ НПС-18",
        balloonContent:
          "Монтаж и наладка кабельных связей для трансляции команд ПА на ПС 220 кВ НПС-18 (СМР 2021 год)",
        address: "Республика Саха, п. НПС-18",
      },
      filter: "Республика Саха",
    },
    {
      coordinates: [43.83545637198625, 131.9604238994707],
      properties: {
        balloonTitle: "ПС 220 кВ Уссурийск-2",
        balloonContent:
          'Пусконаладочные работы на ПС 220 кВ Уссурийск-2. Замена Т-1, Т-2 мощностью 31,5 МВА на трансформаторы 2*63 МВА (ПНР 2021 год); Реконструкция ОРУ 110 кВ (установка КРУЭ-110) с заменой устройств РЗА (СМР, ПНР, 2022-2023год) Строительно-монтажные и пусконаладочные работы по проекту «Реконструкция ПС 220кВ Уссурийск-2. Расширение РУ 110кВ на одну линейную ячейку (для ТП энергопринимающих устройств АО «ДРСК»»). (СМР, ПНР, 2023); СМР и ПНР по инвестиционному проекту: "Модернизация ПС 220 кВ Уссурийск-2 в части установки устройств ПА (10 шкафов)". (СМР, ПНР, 2023); Строительно-монтажные и пусконаладочные работы по проекту «Реконструкция ПС 220кВ Уссурийск-2. Оснащение инженерно-техническими средствами охраны» (СМР, 2023)',
        address: "Приморский край, г. Уссурийск",
      },
      filter: "Приморский край",
    },
    {
      coordinates: [51.683557, 135.702146],
      properties: {
        balloonTitle: "ПС 220 кВ «Березовая»",
        balloonContent:
          "Сопровождение монтажных работ, проверка проекта на наличие ошибок и совместимость с действующим оборудованием, испытание вторичных цепей и аппаратов вторичной коммутации, погрузка автоматических выключателей, комплексные проверки, проверки под нагрузкой и ввод в эксплуатацию оборудования ПС 220 кВ «Березовая» (ПНР 2021 год)",
        address: "Хабаровский край, п. Березовая",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [48.95816369600153, 140.2359616772459],
      properties: {
        balloonTitle: "ПС 35 кВ Эгге",
        balloonContent:
          "Строительно-монтажные работы по модернизации устройств и комплексов РЗА на ПС 35 кВ Эгге (Установка 2х шкафов защит и АУВ ВЛ-35 кВ).(СМР, 2021год)",
        address: "Хабаровский край, п. Эгге",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [53.94058, 139.935406],
      properties: {
        balloonTitle: "ПС 35 кВ Многовершинное",
        balloonContent:
          'Разработка рабочей документации, выполнения строительномонтажных и пусконаладочных работ по установке шкафа РАС на ПС 35 кВ Многовершинное для нужд АО "ДРСК"',
        address: "Хабаровский край, п. Многовершинное",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [61.850562, 129.59961],
      properties: {
        balloonTitle: "ПС 110 кВ «Табага»",
        balloonContent:
          "Установка устройств противоаварийной автоматики на объектах ПАО «Якутскэнерго» в Центральном энергорайоне РС(Я)",
        address: "Республика Саха, п. Табага",
      },
      filter: "Республика Саха",
    },
    {
      coordinates: [46.460728, 134.288303],
      properties: {
        balloonTitle: "ОРУ 500 кВ Приморская ГРЭС",
        balloonContent:
          "Строительно-монтажные работы по модернизации верхнего уровня АСУ ТП на ОРУ 500 кВ Приморской ГРЭС.(СМР, ПНР, 2022 год); СМР по инвестиционному проекту: «Модернизация ПС 500 кВ Амурская, ОРУ 500 кВ Приморская ГРЭС, ПС 500 кВ Хабаровская. Установка ФОСШ 500 кВ и модернизация существующих устройств ПА (35 шкафов)» (СМР, ПНР 2023)",
        address: "Приморский край, г. Приморская ГРЭС",
      },
      filter: "Приморский край",
    },
    {
      coordinates: [43.16815738232563, 131.9420622063559],
      properties: {
        balloonTitle: "ПС 220 кВ Волна",
        balloonContent:
          "Строительно-монтажные работы «Модернизация ПС 220 кВ Волна. Замена устройств РЗА (15 шкафов)»(СМР, 2022 год)",
        address: "Приморский край, п. Волна",
      },
      filter: "Приморский край",
    },
    {
      coordinates: [46.93735, 142.019269],
      properties: {
        balloonTitle: "ПС 35/6 Правдинская",
        balloonContent:
          "Аварийное выполнение работ по ремонту КРУН 6 кВ ПС «Правдинская» (СМР, ПНР, 2022)",
        address: "Сахалинская область, п. Правдинская",
      },
      filter: "Сахалинская область",
    },
    {
      coordinates: [48.41990574371217, 135.36280660400135],
      properties: {
        balloonTitle: "Территория ТОСЭР Хабаровск",
        balloonContent:
          "Монтажные и пусконаладочные работы панелей вводного распределительного устройства (ВРУ) площадки репродуктора. Хабаровский край, Хабаровский район, село Ильинка, Территория ТОСЭР Хабаровск.(СМР, ПНР, 2022 год)",
        address: "Хабаровский край, с. Ильинка",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [50.314699, 128.558165],
      properties: {
        balloonTitle: "ПС 220 кВ Варваровка",
        balloonContent:
          "Проектные работы на объекте: «Техническое перевооружение ПС 220 кВ Варваровка. Замена ЗРУ-10 кВ на КРУН - 10кВ»(2022); Пуско-наладочные работы вновь смонтированных вторичных цепей и устройств РЗА по тому рабочей документации Р2200364-001-РЗ «Техническое перевооружение ПС 220 кВ Варваровка. Замена ЗРУ-10кВ на КРУН-10кВ (26 ячеек)» (ПНР, 2023)",
        address: "Амурская область, п. Варваровка",
      },
      filter: "Амурская область",
    },
    {
      coordinates: [43.368982, 132.309253],
      properties: {
        balloonTitle: "Артемовская ТЭЦ",
        balloonContent:
          "Демонтажные, строительно-монтажные и пусконаладочные работы, включая интеграцию в АСУ ТП на объекте: «Установка АОПО для ВЛ 110 кВ Артемовская ТЭЦ-Западная-Королевцы-Штыково №1,2. Артемовская ТЭЦ»(СМР, ПНР, 2022)",
        address: "Приморский край, г. Артем",
      },
      filter: "Приморский край",
    },
    {
      coordinates: [48.211262, 135.094607],
      properties: {
        balloonTitle: "ПС 500 кВ Хехцир-2",
        balloonContent:
          "Демонтажные и строительно-монтажные работы оборудования и кабельной продукции по  «Техническое перевооружение ПС 500 кВ Хехцир-2. Замена верхнего уровня АСУ ТП» (СМР, 2022)",
        address: "Хабаровский край, п. Хехцир-2",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [43.470890389386284, 132.15271047619586],
      properties: {
        balloonTitle: "ПС 500 кВ Владивосток",
        balloonContent:
          "Монтаж, наладка и ввод в эксплуатацию системы кондиционирования на объекте ПС 500 кВ Владивосток.(СМР, 2022)",
        address: "Приморский край, г. Владивосток",
      },
      filter: "Приморский край",
    },
    {
      coordinates: [48.393353, 135.144234],
      properties: {
        balloonTitle: "ТП-1",
        balloonContent:
          "Строительно-монтажные и пусконаладочные работы в помещении энергетического оборудования ТП-1  (ЗРУ-6 кВ, ЗРУ-0,4 кВ).(2023)",
        address: "Хабаровский край, г. Хабаровск",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [48.476531, 135.067573],
      properties: {
        balloonTitle: "ТП-10",
        balloonContent:
          'Техническое обслуживание устройств релейной защиты и автоматики трансформаторной подстанции ТП-10, расположенной в здании АО "СО ЕЭС" по адресу: г. Хабаровск, ул. Дзержинского, д.47. (2023)',
        address: "Хабаровский край, г. Хабаровск",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [53.435278, 125.813056],
      properties: {
        balloonTitle: "ПС 220 кВ Магдагачи",
        balloonContent:
          "Демонтажные, строительно-монтажные работы в объеме необходимом и достаточном для реализации инвестиционного проекта: «Модернизация ПС 220кВ Сковородино, ПС 220кВ Магдагачи, ПС 220кВ Призейская, ПС 220кВ Тында, ПС 220кВ Благовещенская в части установки устройств ПА. (41 шкаф)». (СМР, 2023)",
        address: "Амурская область, п. Магдагачи",
      },
      filter: "Амурская область",
    },
    {
      coordinates: [54.619444, 128.559444],
      properties: {
        balloonTitle: "ПС 220 кВ Призейская",
        balloonContent:
          "Демонтажные, строительно-монтажные работы в объеме необходимом и достаточном для реализации инвестиционного проекта: «Модернизация ПС 220кВ Сковородино, ПС 220кВ Магдагачи, ПС 220кВ Призейская, ПС 220кВ Тында, ПС 220кВ Благовещенская в части установки устройств ПА. (41 шкаф)». (СМР, 2023)",
        address: "Амурская область, п. Призейская",
      },
      filter: "Амурская область",
    },
    {
      coordinates: [50.33655732852906, 127.5419357645541],
      properties: {
        balloonTitle: "ПС 220 кВ Благовещенская",
        balloonContent:
          "Демонтажные, строительно-монтажные работы в объеме необходимом и достаточном для реализации инвестиционного проекта: «Модернизация ПС 220кВ Сковородино, ПС 220кВ Магдагачи, ПС 220кВ Призейская, ПС 220кВ Тында, ПС 220кВ Благовещенская в части установки устройств ПА. (41 шкаф)». (СМР, 2023)",
        address: "Амурская область, г. Благовещенск",
      },
      filter: "Амурская область",
    },
    {
      coordinates: [50.34254715157006, 138.45543120104918],
      properties: {
        balloonTitle: "ПС 220 кВ, Уктур",
        balloonContent:
          "Модернизации ССПИ на объектах филиала ПАО «ФСК ЕЭС» - МЭС Востока (2 этап строительства 4 ССПИ ПС) по Программе ПНиН ЕНЭС, 3 этап 17 объектов», Выполнение комплекса пуско-наладочных работ, за исключением работ во вновь смонтированных шкафах (ПНР, 2023)",
        address: "Хабаровский край, п. Уктур",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [49.11021, 140.255874],
      properties: {
        balloonTitle: "ПС 35/10 кВ Токи",
        balloonContent:
          "Электромонтажные работы по объекту «Развитие Ванинско-Совгаванского железнодорожного узла. Реконструкция ПС 35/10 кВ «Токи»» (СМР, 2023)",
        address: "Хабаровский край, п. Токи",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [55.60274208651081, 159.65413561767346],
      properties: {
        balloonTitle: "ДЭС-14",
        balloonContent:
          'Техническое перевооружение ВЧ связи и ВЧ обработки на ВЛ 35 кВ "Быстринская МГЭС-ДЭС-14". (2023)',
        address: "Камчатский край, п. ДЭС-14",
      },
      filter: "Камчатский край",
    },
    {
      coordinates: [56.03480863246386, 159.0442952246075],
      properties: {
        balloonTitle: "Быстринская мГЭС",
        balloonContent:
          'Техническое перевооружение ВЧ связи и ВЧ обработки на ВЛ 35 кВ "Быстринская МГЭС-ДЭС-14". (2023)',
        address: "Камчатский край, п. Быстринская мГЭС",
      },
      filter: "Камчатский край",
    },
    {
      coordinates: [56.259543862063225, 162.57091990417084],
      properties: {
        balloonTitle: "ПС «Погодная»",
        balloonContent:
          "Техническое перевооружение ВЧ связи и ВЧ обработки на ВЛ 35 кВ ДЭС-23 - ПС Погодная,  (2023)",
        address: "Камчатский край, п. Погодная",
      },
      filter: "Камчатский край",
    },
    {
      coordinates: [56.23553076651321, 162.53564349120614],
      properties: {
        balloonTitle: "ДЭС-23",
        balloonContent:
          "Техническое перевооружение ВЧ связи и ВЧ обработки на ВЛ 35 кВ ДЭС-23 - ПС Погодная,  (2023)",
        address: "Камчатский край, п. ДЭС-23",
      },
      filter: "Камчатский край",
    },
    {
      coordinates: [49.11722005549465, 140.32278503222489],
      properties: {
        balloonTitle: "ПС 220 кВ Ванино",
        balloonContent:
          "Строительно-монтажные и пусконаладочные работы по проекту «Техническое перевооружение ПС 220 кВ Ванино. Замена оборудования ОРУ-35 кВ (выключатели 35 кВ - 8 шт.)» (2023)",
        address: "Хабаровский край, г. Ванино",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [50.252564, 136.824939],
      properties: {
        balloonTitle: "Амурский ГМК",
        balloonContent:
          "Электромонтажные работы на участке охлаждения конденсата ГМЦ №1 (2023) Электромонтажные работы, в т.ч. испытание кабельной продукции, ПНР КТПН и электрооборудования в ПСУ на объекте - Участок охлаждения конденсата ГМЦ №1 (СМР, ПНР 2024)",
        address: "Хабаровский край, п. Амурский ГМК",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [51.366169, 128.078578],
      properties: {
        balloonTitle: "ПС 500 кВ Амурская",
        balloonContent:
          "СМР по инвестиционному проекту: «Модернизация ПС 500 кВ Амурская, ОРУ 500 кВ Приморская ГРЭС, ПС 500 кВ Хабаровская. Установка ФОСШ 500 кВ и модернизация существующих устройств ПА (35 шкафов)» (СМР, ПНР 2023)",
        address: "Амурская область, п. Амурская",
      },
      filter: "Амурская область",
    },
    {
      coordinates: [48.58479654946064, 133.783865354492],
      properties: {
        balloonTitle: "ПС 500 кВ Хабаровская",
        balloonContent:
          "СМР по инвестиционному проекту: «Модернизация ПС 500 кВ Амурская, ОРУ 500 кВ Приморская ГРЭС, ПС 500 кВ Хабаровская. Установка ФОСШ 500 кВ и модернизация существующих устройств ПА (35 шкафов)» (СМР, ПНР 2023)",
        address: "Хабаровский край, г. Хабаровск",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [50.011363, 136.511811],
      properties: {
        balloonTitle: "ПП 500 кВ Нерген",
        balloonContent:
          "Шеф-монтажные и шеф-наладочные работы шкафов ДФЗ ВЛ 500 кВ, (ПНР, 2023)",
        address: "Хабаровский край, п. Нерген",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [43.061918, 133.134548],
      properties: {
        balloonTitle: "Партизанская ГРЭС",
        balloonContent:
          "Установка АОПО (автоматики ограничения перегрузки оборудования) для ВЛ 110 кВ Партизанская ГРЭС – Находка тяговая (СМР, ПНР, 2023); Монтаж установки непрервыного осущения масла автотрансформатора АТ-1 на Партизанской ГРЭС (СМР, 2023)",
        address: "Приморский край, п. Партизанская ГРЭС",
      },
      filter: "Приморский край",
    },
    {
      coordinates: [53.980514703851426, 123.9691091738258],
      properties: {
        balloonTitle: "Тяговая подстанция Сковородино",
        balloonContent:
          "Строительно-монтажные работы по проекту «Тяговая подстанция Сковородино. Установка дополнительного трансформатора» (СМР, 2023)",
        address: "Амурская область, п. Сковородино",
      },
      filter: "Амурская область",
    },
    {
      coordinates: [48.525612, 135.17629],
      properties: {
        balloonTitle: "Хабаровский аэропорт",
        balloonContent:
          "Техническое обслуживание источника бесперебойного питания АВВ PowerWave 33 400kW (ТО, 2023)",
        address: "Хабаровский край, г. Хабаровск",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [49.877151, 136.926761],
      properties: {
        balloonTitle: "ПС 220 кВ Малмыж",
        balloonContent:
          "Выполнение шефмонтажных и шефналадочных работ оборудования РЗА (ПНР, 2023)",
        address: "Хабаровский край, п. Малмыж",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [50.00517954954891, 136.51970742333793],
      properties: {
        balloonTitle: "ПС 500 кВ Таежная",
        balloonContent:
          "Выполнение шефмонтажных и шефналадочных работ оборудования РЗА (ПНР, 2023)",
        address: "Хабаровский край, п. Таежная",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [48.20952, 135.0771],
      properties: {
        balloonTitle: "ПС 110 кВ Корфовская",
        balloonContent:
          "Проектные, строительно-монтажные и пусконаладочные работы по установке быстродействующих защит на ПС 110 кВ Корфовская, ПС 110 кВ Гайтер, ПС 110 кВ Картель (2023)",
        address: "Хабаровский край, п. Корфовская",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [50.353521031538904, 137.208462947082],
      properties: {
        balloonTitle: "ПС 110 кВ Гайтер",
        balloonContent:
          "Проектные, строительно-монтажные и пусконаладочные работы по установке быстродействующих защит на ПС 110 кВ Корфовская, ПС 110 кВ Гайтер, ПС 110 кВ Картель (РД, СМР, ПНР, 2023) Выполнение строительно-монтажных, проектно-изыскательских и пусконаладочных работ (включая поставку материалов) по оснащению устройствами определения мест повреждения на ПС 35 кВ и выше на территории Хабаровского края (СМР, ПНР, 2024)",
        address: "Хабаровский край, п. Гайтер",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [50.38027, 137.3248],
      properties: {
        balloonTitle: "ПС 110 кВ Картель,",
        balloonContent:
          "Проектные, строительно-монтажные и пусконаладочные работы по установке быстродействующих защит на ПС 110 кВ Корфовская, ПС 110 кВ Гайтер, ПС 110 кВ Картель (РД, СМР, ПНР, 2023)",
        address: "Хабаровский край, п. Картель",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [43.337372, 131.981474],
      properties: {
        balloonTitle: "ПС 220 кВ Промпарк",
        balloonContent:
          "Пуско-наладочные работы «Расширение РУ 10 кВ ПС 220 кВ Промпарк на 4 линейные ячейки для присоединения ЛЭП 10 кВ АО «КРДВ» для нужд филиала ПАО «ФСК ЕЭС» - МЭС Востока» (ПНР, 2023)",
        address: "Приморский край, п. Промпарк",
      },
      filter: "Приморский край",
    },
    {
      coordinates: [48.629039, 142.778708],
      properties: {
        balloonTitle: "ПС 220 кВ Макаровская",
        balloonContent:
          "Реконструкция оборудования ОРУ-220 кВ ПС «Макаровская». Пусконаладочные цепи УРЗА и вторичных цепей трансформатора 220/35/6.",
        address: "Сахалинская область, п. Макаровская",
      },
      filter: "Сахалинская область",
    },
    {
      coordinates: [49.89594, 136.894265],
      properties: {
        balloonTitle: "Горнодобывающее предприятие «Амур Минералс»",
        balloonContent:
          "Работы по монтажу фальшполов в отделении флотации и сгущения на Объекте: Обогатительная фабрика с хвостовым хозяйством и оборотным водоснабжением. Главный корпус. АМ.02.061 (СМР, 2024)",
        address: "Хабаровский край, п. Амур Минералс",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [48.54072, 134.910872],
      properties: {
        balloonTitle: "ПС 220 кВ Левобережная",
        balloonContent:
          "Строительно-монтажные работы, а также комплекс пуско-наладочных работ по титулу по «Модернизации ССПИ на объектах филиала ПАО «ФСК ЕЭС» - МЭС Востока (2 этап строительства. 14 ССПИ ПС) по программе ПНиН ЕНЭС, 32 объекта» (СМР, ПНР, 2024)",
        address: "Еврейская автономная область, п. Левобережная",
      },
      filter: "Еврейская АО",
    },
    {
      coordinates: [47.909951, 134.958415],
      properties: {
        balloonTitle: "ПС 220 кВ Гидролизная",
        balloonContent:
          "Строительно-монтажные работы, а также комплекс пуско-наладочных работ по титулу по «Модернизации ССПИ на объектах филиала ПАО «ФСК ЕЭС» - МЭС Востока (2 этап строительства. 14 ССПИ ПС) по программе ПНиН ЕНЭС, 32 объекта» (СМР, ПНР, 2024)",
        address: "Хабаровский край, п. Гидролизная",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [63.042562, 112.466162],
      properties: {
        balloonTitle: 'ПАО "Якутскэнерго"',
        balloonContent:
          "Работы по установке устройств противоаварийной автоматики на филиале Каскад Вилюйских ГЭС им. Е.Н.Батенчука (СМР, ПНР, 2024) Работы по обеспечению сбора и передачи доаварийной информации, приёма и передачи аварийных сигналов и команд на Каскаде Вилюйских ГЭС 1, 2",
        address: "Республика Саха, п. Каскад Вилюйских ГЭС",
      },
      filter: "Республика Саха",
    },
    {
      coordinates: [50.614344, 137.064104],
      properties: {
        balloonTitle: 'ООО "РН-Комсомольский НПЗ"',
        balloonContent:
          "Капитальный ремонт вторичных цепей РУ-6кВ РТП-25 (СМР, ПНР, 2024)",
        address: "Хабаровский край, п. РН-Комсомольский НПЗ",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [51.31883, 133.085018],
      properties: {
        balloonTitle: "ПС 110 кВ Северная",
        balloonContent:
          "Выполнение строительно-монтажных, проектно-изыскательских и пусконаладочных работ (включая поставку материалов) по оснащению устройствами определения мест повреждения на ПС 35 кВ и выше на территории Хабаровского края (СМР, ПНР, 2024)",
        address: "Хабаровский край, п. Северная",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [50.113539, 136.525904],
      properties: {
        balloonTitle: "ПС 110 кВ Эльбан",
        balloonContent:
          "Выполнение строительно-монтажных, проектно-изыскательских и пусконаладочных работ (включая поставку материалов) по оснащению устройствами определения мест повреждения на ПС 35 кВ и выше на территории Хабаровского края (СМР, ПНР, 2024)",
        address: "Хабаровский край, п. Эльбан",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [48.555756, 135.083252],
      properties: {
        balloonTitle: "ПС 220 кВ Амур",
        balloonContent:
          "Реконструкция ПС 220 кВ Амур. Установка двух УПАСК по ВОЛС ПС 220 кВ Амур - ПС ПО кВ НПЗ-З (ПИР, 2024)",
        address: "Хабаровский край, п. Амур",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [62.056871, 150.414203],
      properties: {
        balloonTitle: 'ПАО "Колымаэнерго"',
        balloonContent:
          "Выполнение строительно-монтажных и пуско-наладочных работ электротехнического оборудования ячейки №7 ЗРУ 220кВ Колымской ГЭС имени И.Ю. Фриштера» (СМР, ПНР 2024 год) Выполнение строительно-монтажных и пуско-наладочных работы систем релейной защиты, автоматики и связи Колымской ГЭС в целях реализации схемы выдачи мощности Усть-Среднеканской ГЭС в рамках инвестиционного проекта M_T-7036-106 (СМР, ПНР 2024 год)",
        address: "Магаданская область, п. Колымская ГЭС",
      },
      filter: "Магаданская область",
    },
    {
      coordinates: [62.059257, 129.772899],
      properties: {
        balloonTitle: 'ПАО «Якутэнерго»',
        balloonContent:
          "Выполнение пусконаладочных и шеф-надзорных работ шкафов РЗА, ОМП для Якутской ГРЭС.",
        address: "Якутская ГРЭС, Респ. Саха (Якутия), г Якутск",
      },
      filter: "Республика Саха",
    },
    {
      coordinates: [48.394465, 135.143135],
      properties: {
        balloonTitle: 'ООО «ТехноНИКОЛЬ Хабаровский край»',
        balloonContent:
          "Поставка материалов, монтаж линии 6кВ с установкой   КТП",
        address: "завод Технониколь, Хабаровский край, Хабаровск",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [48.391862, 135.156727],
      properties: {
        balloonTitle: 'ООО «ТехноНИКОЛЬ ДВ»',
        balloonContent:
          "Монтаж линии 0,4кВ и пневмосети линии АГРО",
        address: "производсвенная территория Технониколь, Хабаровский край, Хабаровск",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [44.255635, 135.105874],
      properties: {
        balloonTitle: 'ПС 220 кВ К',
        balloonContent:
          "Реконструкция ПС 220 кВ К с заменой и модернизацией устройств релейной защиты и автоматики (31 шкаф)",
        address: "ПС 220 кВ К, Горнореченский , Приморский край",
      },
      filter: "Приморский край",
    },
    {
      coordinates: [48.571529, 135.144952],
      properties: {
        balloonTitle: 'ПС 220 кВ К',
        balloonContent:
          "Модернизация системы автоматического регулирования Турбин Т-180/210-130 с заменой гидромеханической системы на электрогидравлическую ",
        address: "Хабаровская ТЭЦ-3,  Хабаровский край, Хабаровск",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [53.134988, 140.725943],
      properties: {
        balloonTitle: 'Николаевская ТЭЦ',
        balloonContent:
          "Проектные работы по реконструкции панелей защит ВЛ-110 кВ СП Николаевская ТЭЦ",
        address: "Николаевская ТЭЦ, Николаевск-на Амуре, Хабаровский край",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [48.477808, 135.456962],
      properties: {
        balloonTitle: 'ПС 220 кВ Князе-Волконское',
        balloonContent:
          "Техническое перевооружение ПС 220 кВ Князе-Волконское с заменой и модернизацией устройств релейно защиты и автоматики(15шкафов)",
        address: "ПС 220 кВ Князе-Волконское, Хабаровский край, Князе-Волконское",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [48.209246, 135.088287],
      properties: {
        balloonTitle: 'ПС 220 кВ Хехцир',
        balloonContent:
          "Проектирование: «Создание комплекса ПА АОПО 1АТ, 2 АТ на ПС 220 кВ РЦ, ПС 220 кВ Хехцир»",
        address: "ПС 220 кВ Хехцир,  Хабаровский край, Корфовский",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [47.872753, 134.958307],
      properties: {
        balloonTitle: 'ПС 110 кВ Хор',
        balloonContent:
          "Модернизация устройств РЗА В 110 С-29 на ПС 110 кВ Хор",
        address: "ПС 110 кВ Хор, Хабаровский край, Хор",
      },
      filter: "Хабаровский край",
    },
    {
      coordinates: [44.255635, 135.105874],
      properties: {
        balloonTitle: 'ПС 220 кВ К',
        balloonContent:
          "Модернизация устройств РЗА ШСВ 110 на ПС 110 кВ К",
        address: "ПС 220 кВ К, Горнореченский , Приморский край",
      },
      filter: "Приморский край",
    },
    {
      coordinates: [43.242631, 132.337643],
      properties: {
        balloonTitle: 'ПС 220кВ Суходол',
        balloonContent:
          "Техническое обслуживание оборудования устройств передачи аварийных сигналналов и команд (УПАСК) ВЛ 220 кВ «Зеленый угол – Суходол»",
        address: "ПС 220кВ Суходол, Приморский край, Романовка",
      },
      filter: "Приморский край",
    },
    {
      coordinates: [58.9637, 126.27251],
      properties: {
        balloonTitle: 'ПС 220 кВ Томмот',
        balloonContent:
          "Техническое перевооружение ПС 220 кВ Томмот (оснащение резервных ячеек №8, №9 КРУЭ 110 кВ микропроцессорными устройствами РЗА)(для ТП энергопринимающих устройств АО «Полюс Алдан",
        address: "ПС 220 кВ Томмот, г. Томмот, Республика Саха (Якутия)",
      },
      filter: "Республика Саха",
    },
    {
      coordinates: [48.394465, 135.143135],
      properties: {
        balloonTitle: 'ООО «ТехноНИКОЛЬ Хабаровский край»',
        balloonContent:
          "Работы по монтажу, пусконаладке и вводу в эксплуатацию блочно-модульной трансформаторной подстанции ТП-2",
        address: "ООО «ТехноНИКОЛЬ Хабаровский край», завод Технониколь, Хабаровский край, Хабаровск",
      },
      filter: "Хабаровский край",
    }
  ];

  // Получаем DOM элементы
  const mapContainer = document.querySelector(".p-map__item");
  const mapShow = mapContainer.querySelector(".p-map__show");
  const groupsContainer = document.querySelector(".p-map__groups");
  const placesContainer = document.querySelector(".p-map__places");
  const objectContainer = document.querySelector(".p-map__object");
  const placesTitle = document.querySelector(".p-map__places-title");
  const placesItems = document.querySelector(".p-map__places-items");
  const objectTitle = document.querySelector(".p-map__object-title");
  const objectSubtitle = document.querySelector(".p-map__object-subtitle");
  const objectText = document.querySelector(".p-map__object-text");

  mapShow.addEventListener('click', ()=>{
    mapContainer.classList.toggle('active');
  })

  ymaps.ready(function () {
    // Создаем кастомный макет для кластеров с числом точек
    var CustomClusterIconLayout = ymaps.templateLayoutFactory.createClass(
      '<div style="background-image: url(https://static.tildacdn.com/tild6565-3937-4162-b637-653665376534/Pin_Group.svg); ' +
        'width: 38px; height: 38px; background-size: contain; position: relative;">' +
        '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); ' +
        'color: white; font-weight: bold; font-size: 14px; text-align: center;">$[properties.geoObjects.length]</div>' +
        "</div>"
    );

    // Функция для создания групп регионов
    function createRegionGroups() {
      // Собираем уникальные регионы и их количество
      const regions = points.reduce((acc, point) => {
        acc[point.filter] = (acc[point.filter] || 0) + 1;
        return acc;
      }, {});

      // Сортируем регионы по алфавиту
      const sortedRegions = Object.entries(regions).sort((a, b) =>
        a[0].localeCompare(b[0])
      );

      // Создаем HTML для групп
      const groupsHTML = sortedRegions
        .map(
          ([region, count]) => `
      <div class="p-map__group">
        <div class="p-map__group-title">${region}</div>
        <div class="p-map__group-num">${count}</div>
        <div class="p-map__group-arrow">
          <svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2 17.8801L10.8832 8.99695L2 0.11377L0.585786 1.52798L8.05475 8.99695L0.585786 16.4659L2 17.8801Z" fill="#4564FF"/>
          </svg>
        </div>
      </div>
    `
        )
        .join("");

      // Вставляем созданные группы в контейнер
      groupsContainer.innerHTML = groupsHTML;
    }

    createRegionGroups();

    // Текущий выбранный регион (для возврата после просмотра деталей)
    let currentRegion = null;

    // Добавляем обработчики для кнопок "Назад"
    document.querySelectorAll(".p-map__back").forEach((backBtn) => {
      backBtn.addEventListener("click", () => {
        if (currentRegion){
          if (objectContainer.classList.contains("active")) {
            // Возврат из деталей объекта к списку объектов региона
            objectContainer.classList.remove("active");
            placesContainer.classList.add("active");

            // Восстанавливаем фильтрацию по региону
            if (currentRegion) {
              filterPointsByRegion(currentRegion);
            }
          } else if (placesContainer.classList.contains("active")) {
            // Возврат из списка объектов к списку регионов
            placesContainer.classList.remove("active");
            groupsContainer.classList.add("active");

            // Показываем все точки
            currentRegion = null;
            filterPointsByRegion(null);
          }
        } else {
            // Возврат из списка объектов к списку регионов
            objectContainer.classList.remove("active");
            placesContainer.classList.remove("active");
            groupsContainer.classList.add("active");

            filterPointsByRegion(null);
        }
      });
    });

    var myMap = new ymaps.Map("p-map__iframe", {
        center: [55.751574, 37.573856],
        zoom: 9,
        controls: [],
      }),
      clusterer = new ymaps.Clusterer({
        clusterIcons: [
          {
            href: "https://static.tildacdn.com/tild6565-3937-4162-b637-653665376534/Pin_Group.svg",
            size: [38, 38],
            offset: [-19, -38],
          },
        ],
        clusterNumbers: [10],
        clusterIconContentLayout: CustomClusterIconLayout,
        clusterDisableClickZoom: false,
        clusterOpenBalloonOnClick: false,
      }),
      getPointData = function (item) {
        return {

        };
      },
      getPointOptions = function () {
        return {
          iconLayout: "default#image",
          iconImageHref:
            "https://static.tildacdn.com/tild3765-3531-4639-a336-633133363238/Map_Pin.png",
          iconImageSize: [34, 48],
          iconImageOffset: [-19, -38],
        };
      },
      getSelectedPointOptions = function () {
        return {
          iconLayout: "default#image",
          iconImageHref:
            "https://static.tildacdn.com/tild3537-3037-4432-a237-326466663737/map_pin_.png",
          iconImageSize: [34, 48],
          iconImageOffset: [-19, -38],
        };
      },
      geoObjects = [];

    // Зум
    myMap.controls.add(
      new ymaps.control.ZoomControl({
        options: { position: { right: 50, top: 180 } },
      })
    );

    // Создаем все метки
    for (var i = 0, len = points.length; i < len; i++) {
      const placemark = new ymaps.Placemark(
        points[i].coordinates,
        getPointData(points[i]),
        getPointOptions()
      );

      // Добавляем обработчик клика на метку
      placemark.events.add('click', function (e) {
        const targetPoint = points.find(p =>
          p.coordinates === e.get('target').geometry.getCoordinates()
        );
        console.log(targetPoint);
        if (targetPoint) showObjectDetails(targetPoint, true);
      });

      geoObjects.push(placemark);
    }

    // Функция фильтрации точек по региону
    function filterPointsByRegion(region, isClickedPoint = true) {
      // Очищаем кластеризатор
      clusterer.removeAll();

      // Фильтруем точки
      const filteredPoints = region
        ? geoObjects.filter((_, index) => points[index].filter === region)
        : geoObjects;

      // Добавляем отфильтрованные точки
      clusterer.add(filteredPoints);

      // Если есть точки, центрируем карту
      if (filteredPoints.length > 0 && isClickedPoint) {
        myMap.setBounds(clusterer.getBounds(), {
          checkZoomRange: true,
          zoomMargin: 50, // Добавляем отступ для лучшего отображения
        });
      }
    }

    // Функция показа списка объектов для региона
    function showPlacesForRegion(region) {
      currentRegion = region;

      // Фильтруем точки по региону
      const regionPoints = points.filter((point) => point.filter === region);

      // Устанавливаем заголовок
      placesTitle.textContent = region;

      // Очищаем контейнер
      placesItems.innerHTML = "";

      // Добавляем точки
      regionPoints.forEach((point) => {
        const placeItem = document.createElement("div");
        placeItem.className = "p-map__place-item";
        placeItem.innerHTML = `
          <div class="p-map__place-title">${point.properties.balloonTitle}</div>
          <div class="p-map__place-text">${
            point.properties.address.split("<br>")[0]
          }</div>
          <div class="p-map__place-arrow">
            <svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M2 17.8801L10.8832 8.99695L2 0.11377L0.585786 1.52798L8.05475 8.99695L0.585786 16.4659L2 17.8801Z" fill="#4564FF"/>
            </svg>
          </div>
        `;

        // Добавляем обработчик клика
        placeItem.addEventListener("click", () => {
          showObjectDetails(point);
        });

        placesItems.appendChild(placeItem);
      });

      // Показываем контейнер
      groupsContainer.classList.remove("active");
      placesContainer.classList.add("active");
    }

    // Функция показа деталей объекта
    function showObjectDetails(point, single = false) {


      if (single){
        currentRegion = null;
      }

      objectTitle.textContent = point.properties.balloonTitle;
      objectSubtitle.textContent = point.properties.address.split("<br>")[0];
      objectText.textContent = point.properties.balloonContent;

      // Скрываем другие контейнеры
      groupsContainer.classList.remove("active");
      placesContainer.classList.remove("active");
      objectContainer.classList.add("active");

      // Выделяем точку на карте
      clusterer.removeAll();
      const selectedPoint = new ymaps.Placemark(
        point.coordinates,
        getPointData(point),
        getSelectedPointOptions()
      );
      clusterer.add(selectedPoint);
      myMap.setCenter(point.coordinates, 15);
    }

    // Добавляем обработчики для групп регионов
    document.querySelectorAll(".p-map__group").forEach((group) => {
      const region = group.querySelector(".p-map__group-title").textContent;

      group.addEventListener("click", () => {
        filterPointsByRegion(region);
        showPlacesForRegion(region);
      });
    });

    // Инициализация карты
    clusterer.add(geoObjects);
    myMap.geoObjects.add(clusterer);
    myMap.setBounds(clusterer.getBounds(), {
      checkZoomRange: true,
      zoomMargin: 50,
    });

    // Показываем группы по умолчанию
    groupsContainer.classList.add("active");
  });
});