("use strict");
const window = {};
!(function () {
    var e = (function e(t, n, s) {
        function r(o, i) {
            if (!n[o]) {
                if (!t[o]) {
                    var h = "function" == typeof require && require;
                    if (!i && h) return h(o, !0);
                    if (a) return a(o, !0);
                    var l = new Error("Cannot find module '" + o + "'");
                    throw ((l.code = "MODULE_NOT_FOUND"), l);
                }
                var u = (n[o] = { exports: {} });
                t[o][0].call(
                    u.exports,
                    function (e) {
                        return r(t[o][1][e] || e);
                    },
                    u,
                    u.exports,
                    e,
                    t,
                    n,
                    s
                );
            }
            return n[o].exports;
        }
        for (
            var a = "function" == typeof require && require, o = 0;
            o < s.length;
            o++
        )
            r(s[o]);
        return r;
    })(
        {
            1: [
                function (e, t, n) {
                    const s = e("ret"),
                        r = e("drange"),
                        a = s.types;
                    t.exports = class e {
                        constructor(e, t) {
                            if ((this._setDefaults(e), e instanceof RegExp))
                                (this.ignoreCase = e.ignoreCase),
                                    (this.multiline = e.multiline),
                                    (e = e.source);
                            else {
                                if ("string" != typeof e)
                                    throw new Error(
                                        "Expected a regexp or string"
                                    );
                                (this.ignoreCase = t && -1 !== t.indexOf("i")),
                                    (this.multiline =
                                        t && -1 !== t.indexOf("m"));
                            }
                            this.tokens = s(e);
                        }
                        _setDefaults(t) {
                            (this.max =
                                null != t.max
                                    ? t.max
                                    : null != e.prototype.max
                                    ? e.prototype.max
                                    : 100),
                                (this.defaultRange = t.defaultRange
                                    ? t.defaultRange
                                    : this.defaultRange.clone()),
                                t.randInt && (this.randInt = t.randInt);
                        }
                        gen() {
                            return this._gen(this.tokens, []);
                        }
                        _gen(e, t) {
                            var n, s, r, o, i;
                            switch (e.type) {
                                case a.ROOT:
                                case a.GROUP:
                                    if (e.followedBy || e.notFollowedBy)
                                        return "";
                                    for (
                                        e.remember &&
                                            void 0 === e.groupNumber &&
                                            (e.groupNumber = t.push(null) - 1),
                                            s = "",
                                            o = 0,
                                            i = (n = e.options
                                                ? this._randSelect(e.options)
                                                : e.stack).length;
                                        o < i;
                                        o++
                                    )
                                        s += this._gen(n[o], t);
                                    return (
                                        e.remember && (t[e.groupNumber] = s), s
                                    );
                                case a.POSITION:
                                    return "";
                                case a.SET:
                                    var h = this._expand(e);
                                    return h.length
                                        ? String.fromCharCode(
                                              this._randSelect(h)
                                          )
                                        : "";
                                case a.REPETITION:
                                    for (
                                        r = this.randInt(
                                            e.min,
                                            e.max === 1 / 0
                                                ? e.min + this.max
                                                : e.max
                                        ),
                                            s = "",
                                            o = 0;
                                        o < r;
                                        o++
                                    )
                                        s += this._gen(e.value, t);
                                    return s;
                                case a.REFERENCE:
                                    return t[e.value - 1] || "";
                                case a.CHAR:
                                    var l =
                                        this.ignoreCase && this._randBool()
                                            ? this._toOtherCase(e.value)
                                            : e.value;
                                    return String.fromCharCode(l);
                            }
                        }
                        _toOtherCase(e) {
                            return (
                                e +
                                (97 <= e && e <= 122
                                    ? -32
                                    : 65 <= e && e <= 90
                                    ? 32
                                    : 0)
                            );
                        }
                        _randBool() {
                            return !this.randInt(0, 1);
                        }
                        _randSelect(e) {
                            return e instanceof r
                                ? e.index(this.randInt(0, e.length - 1))
                                : e[this.randInt(0, e.length - 1)];
                        }
                        _expand(e) {
                            if (e.type === s.types.CHAR) return new r(e.value);
                            if (e.type === s.types.RANGE)
                                return new r(e.from, e.to);
                            {
                                let t = new r();
                                for (let n = 0; n < e.set.length; n++) {
                                    let s = this._expand(e.set[n]);
                                    if ((t.add(s), this.ignoreCase))
                                        for (let e = 0; e < s.length; e++) {
                                            let n = s.index(e),
                                                r = this._toOtherCase(n);
                                            n !== r && t.add(r);
                                        }
                                }
                                return e.not
                                    ? this.defaultRange.clone().subtract(t)
                                    : this.defaultRange.clone().intersect(t);
                            }
                        }
                        randInt(e, t) {
                            return e + Math.floor(Math.random() * (1 + t - e));
                        }
                        get defaultRange() {
                            return (this._range =
                                this._range || new r(32, 126));
                        }
                        set defaultRange(e) {
                            this._range = e;
                        }
                        static randexp(t, n) {
                            var s;
                            return (
                                "string" == typeof t && (t = new RegExp(t, n)),
                                void 0 === t._randexp
                                    ? ((s = new e(t, n)), (t._randexp = s))
                                    : (s = t._randexp)._setDefaults(t),
                                s.gen()
                            );
                        }
                        static sugar() {
                            RegExp.prototype.gen = function () {
                                return e.randexp(this);
                            };
                        }
                    };
                },
                { drange: 2, ret: 3 },
            ],
            2: [
                function (e, t, n) {
                    class s {
                        constructor(e, t) {
                            (this.low = e),
                                (this.high = t),
                                (this.length = 1 + t - e);
                        }
                        overlaps(e) {
                            return !(this.high < e.low || this.low > e.high);
                        }
                        touches(e) {
                            return !(
                                this.high + 1 < e.low || this.low - 1 > e.high
                            );
                        }
                        add(e) {
                            return new s(
                                Math.min(this.low, e.low),
                                Math.max(this.high, e.high)
                            );
                        }
                        subtract(e) {
                            return e.low <= this.low && e.high >= this.high
                                ? []
                                : e.low > this.low && e.high < this.high
                                ? [
                                      new s(this.low, e.low - 1),
                                      new s(e.high + 1, this.high),
                                  ]
                                : e.low <= this.low
                                ? [new s(e.high + 1, this.high)]
                                : [new s(this.low, e.low - 1)];
                        }
                        toString() {
                            return this.low == this.high
                                ? this.low.toString()
                                : this.low + "-" + this.high;
                        }
                    }
                    class r {
                        constructor(e, t) {
                            (this.ranges = []),
                                (this.length = 0),
                                null != e && this.add(e, t);
                        }
                        _update_length() {
                            this.length = this.ranges.reduce(
                                (e, t) => e + t.length,
                                0
                            );
                        }
                        add(e, t) {
                            const n = (e) => {
                                let t = 0;
                                for (
                                    ;
                                    t < this.ranges.length &&
                                    !e.touches(this.ranges[t]);

                                )
                                    t++;
                                const n = this.ranges.slice(0, t);
                                for (
                                    ;
                                    t < this.ranges.length &&
                                    e.touches(this.ranges[t]);

                                )
                                    (e = e.add(this.ranges[t])), t++;
                                n.push(e),
                                    (this.ranges = n.concat(
                                        this.ranges.slice(t)
                                    )),
                                    this._update_length();
                            };
                            return (
                                e instanceof r
                                    ? e.ranges.forEach(n)
                                    : (null == t && (t = e), n(new s(e, t))),
                                this
                            );
                        }
                        subtract(e, t) {
                            const n = (e) => {
                                let t = 0;
                                for (
                                    ;
                                    t < this.ranges.length &&
                                    !e.overlaps(this.ranges[t]);

                                )
                                    t++;
                                let n = this.ranges.slice(0, t);
                                for (
                                    ;
                                    t < this.ranges.length &&
                                    e.overlaps(this.ranges[t]);

                                )
                                    (n = n.concat(this.ranges[t].subtract(e))),
                                        t++;
                                (this.ranges = n.concat(this.ranges.slice(t))),
                                    this._update_length();
                            };
                            return (
                                e instanceof r
                                    ? e.ranges.forEach(n)
                                    : (null == t && (t = e), n(new s(e, t))),
                                this
                            );
                        }
                        intersect(e, t) {
                            const n = [],
                                a = (e) => {
                                    let t = 0;
                                    for (
                                        ;
                                        t < this.ranges.length &&
                                        !e.overlaps(this.ranges[t]);

                                    )
                                        t++;
                                    for (
                                        ;
                                        t < this.ranges.length &&
                                        e.overlaps(this.ranges[t]);

                                    ) {
                                        let r = Math.max(
                                                this.ranges[t].low,
                                                e.low
                                            ),
                                            a = Math.min(
                                                this.ranges[t].high,
                                                e.high
                                            );
                                        n.push(new s(r, a)), t++;
                                    }
                                };
                            return (
                                e instanceof r
                                    ? e.ranges.forEach(a)
                                    : (null == t && (t = e), a(new s(e, t))),
                                (this.ranges = n),
                                this._update_length(),
                                this
                            );
                        }
                        index(e) {
                            let t = 0;
                            for (
                                ;
                                t < this.ranges.length &&
                                this.ranges[t].length <= e;

                            )
                                (e -= this.ranges[t].length), t++;
                            return this.ranges[t].low + e;
                        }
                        toString() {
                            return "[ " + this.ranges.join(", ") + " ]";
                        }
                        clone() {
                            return new r(this);
                        }
                        numbers() {
                            return this.ranges.reduce((e, t) => {
                                let n = t.low;
                                for (; n <= t.high; ) e.push(n), n++;
                                return e;
                            }, []);
                        }
                        subranges() {
                            return this.ranges.map((e) => ({
                                low: e.low,
                                high: e.high,
                                length: 1 + e.high - e.low,
                            }));
                        }
                    }
                    t.exports = r;
                },
                {},
            ],
            3: [
                function (e, t, n) {
                    const s = e("./util"),
                        r = e("./types"),
                        a = e("./sets"),
                        o = e("./positions");
                    (t.exports = (e) => {
                        var t,
                            n,
                            i = 0,
                            h = { type: r.ROOT, stack: [] },
                            l = h,
                            u = h.stack,
                            p = [],
                            c = (t) => {
                                s.error(
                                    e,
                                    `Nothing to repeat at column ${t - 1}`
                                );
                            },
                            g = s.strToChars(e);
                        for (t = g.length; i < t; )
                            switch ((n = g[i++])) {
                                case "\\":
                                    switch ((n = g[i++])) {
                                        case "b":
                                            u.push(o.wordBoundary());
                                            break;
                                        case "B":
                                            u.push(o.nonWordBoundary());
                                            break;
                                        case "w":
                                            u.push(a.words());
                                            break;
                                        case "W":
                                            u.push(a.notWords());
                                            break;
                                        case "d":
                                            u.push(a.ints());
                                            break;
                                        case "D":
                                            u.push(a.notInts());
                                            break;
                                        case "s":
                                            u.push(a.whitespace());
                                            break;
                                        case "S":
                                            u.push(a.notWhitespace());
                                            break;
                                        default:
                                            /\d/.test(n)
                                                ? u.push({
                                                      type: r.REFERENCE,
                                                      value: parseInt(n, 10),
                                                  })
                                                : u.push({
                                                      type: r.CHAR,
                                                      value: n.charCodeAt(0),
                                                  });
                                    }
                                    break;
                                case "^":
                                    u.push(o.begin());
                                    break;
                                case "$":
                                    u.push(o.end());
                                    break;
                                case "[":
                                    var d;
                                    "^" === g[i] ? ((d = !0), i++) : (d = !1);
                                    var f = s.tokenizeClass(g.slice(i), e);
                                    (i += f[1]),
                                        u.push({
                                            type: r.SET,
                                            set: f[0],
                                            not: d,
                                        });
                                    break;
                                case ".":
                                    u.push(a.anyChar());
                                    break;
                                case "(":
                                    var y = {
                                        type: r.GROUP,
                                        stack: [],
                                        remember: !0,
                                    };
                                    "?" === (n = g[i]) &&
                                        ((n = g[i + 1]),
                                        (i += 2),
                                        "=" === n
                                            ? (y.followedBy = !0)
                                            : "!" === n
                                            ? (y.notFollowedBy = !0)
                                            : ":" !== n &&
                                              s.error(
                                                  e,
                                                  `Invalid group, character '${n}'` +
                                                      ` after '?' at column ${
                                                          i - 1
                                                      }`
                                              ),
                                        (y.remember = !1)),
                                        u.push(y),
                                        p.push(l),
                                        (l = y),
                                        (u = y.stack);
                                    break;
                                case ")":
                                    0 === p.length &&
                                        s.error(
                                            e,
                                            `Unmatched ) at column ${i - 1}`
                                        ),
                                        (u = (l = p.pop()).options
                                            ? l.options[l.options.length - 1]
                                            : l.stack);
                                    break;
                                case "|":
                                    l.options ||
                                        ((l.options = [l.stack]),
                                        delete l.stack);
                                    var w = [];
                                    l.options.push(w), (u = w);
                                    break;
                                case "{":
                                    var v,
                                        R,
                                        m = /^(\d+)(,(\d+)?)?\}/.exec(
                                            g.slice(i)
                                        );
                                    null !== m
                                        ? (0 === u.length && c(i),
                                          (v = parseInt(m[1], 10)),
                                          (R = m[2]
                                              ? m[3]
                                                  ? parseInt(m[3], 10)
                                                  : 1 / 0
                                              : v),
                                          (i += m[0].length),
                                          u.push({
                                              type: r.REPETITION,
                                              min: v,
                                              max: R,
                                              value: u.pop(),
                                          }))
                                        : u.push({
                                              type: r.CHAR,
                                              value: 123,
                                          });
                                    break;
                                case "?":
                                    0 === u.length && c(i),
                                        u.push({
                                            type: r.REPETITION,
                                            min: 0,
                                            max: 1,
                                            value: u.pop(),
                                        });
                                    break;
                                case "+":
                                    0 === u.length && c(i),
                                        u.push({
                                            type: r.REPETITION,
                                            min: 1,
                                            max: 1 / 0,
                                            value: u.pop(),
                                        });
                                    break;
                                case "*":
                                    0 === u.length && c(i),
                                        u.push({
                                            type: r.REPETITION,
                                            min: 0,
                                            max: 1 / 0,
                                            value: u.pop(),
                                        });
                                    break;
                                default:
                                    u.push({
                                        type: r.CHAR,
                                        value: n.charCodeAt(0),
                                    });
                            }
                        return (
                            0 !== p.length && s.error(e, "Unterminated group"),
                            h
                        );
                    }),
                        (t.exports.types = r);
                },
                {
                    "./positions": 4,
                    "./sets": 5,
                    "./types": 6,
                    "./util": 7,
                },
            ],
            4: [
                function (e, t, n) {
                    const s = e("./types");
                    (n.wordBoundary = () => ({
                        type: s.POSITION,
                        value: "b",
                    })),
                        (n.nonWordBoundary = () => ({
                            type: s.POSITION,
                            value: "B",
                        })),
                        (n.begin = () => ({
                            type: s.POSITION,
                            value: "^",
                        })),
                        (n.end = () => ({ type: s.POSITION, value: "$" }));
                },
                { "./types": 6 },
            ],
            5: [
                function (e, t, n) {
                    const s = e("./types"),
                        r = () => [{ type: s.RANGE, from: 48, to: 57 }],
                        a = () =>
                            [
                                { type: s.CHAR, value: 95 },
                                { type: s.RANGE, from: 97, to: 122 },
                                { type: s.RANGE, from: 65, to: 90 },
                            ].concat(r()),
                        o = () => [
                            { type: s.CHAR, value: 9 },
                            { type: s.CHAR, value: 10 },
                            { type: s.CHAR, value: 11 },
                            { type: s.CHAR, value: 12 },
                            { type: s.CHAR, value: 13 },
                            { type: s.CHAR, value: 32 },
                            { type: s.CHAR, value: 160 },
                            { type: s.CHAR, value: 5760 },
                            { type: s.RANGE, from: 8192, to: 8202 },
                            { type: s.CHAR, value: 8232 },
                            { type: s.CHAR, value: 8233 },
                            { type: s.CHAR, value: 8239 },
                            { type: s.CHAR, value: 8287 },
                            { type: s.CHAR, value: 12288 },
                            { type: s.CHAR, value: 65279 },
                        ],
                        i = () => [
                            { type: s.CHAR, value: 10 },
                            { type: s.CHAR, value: 13 },
                            { type: s.CHAR, value: 8232 },
                            { type: s.CHAR, value: 8233 },
                        ];
                    (n.words = () => ({ type: s.SET, set: a(), not: !1 })),
                        (n.notWords = () => ({
                            type: s.SET,
                            set: a(),
                            not: !0,
                        })),
                        (n.ints = () => ({
                            type: s.SET,
                            set: r(),
                            not: !1,
                        })),
                        (n.notInts = () => ({
                            type: s.SET,
                            set: r(),
                            not: !0,
                        })),
                        (n.whitespace = () => ({
                            type: s.SET,
                            set: o(),
                            not: !1,
                        })),
                        (n.notWhitespace = () => ({
                            type: s.SET,
                            set: o(),
                            not: !0,
                        })),
                        (n.anyChar = () => ({
                            type: s.SET,
                            set: i(),
                            not: !0,
                        }));
                },
                { "./types": 6 },
            ],
            6: [
                function (e, t, n) {
                    t.exports = {
                        ROOT: 0,
                        GROUP: 1,
                        POSITION: 2,
                        SET: 3,
                        RANGE: 4,
                        REPETITION: 5,
                        REFERENCE: 6,
                        CHAR: 7,
                    };
                },
                {},
            ],
            7: [
                function (e, t, n) {
                    const s = e("./types"),
                        r = e("./sets"),
                        a = { 0: 0, t: 9, n: 10, v: 11, f: 12, r: 13 };
                    (n.strToChars = function (e) {
                        return e.replace(
                            /(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z[\\\]^?])|([0tnvfr]))/g,
                            function (e, t, n, s, r, o, i, h) {
                                if (n) return e;
                                var l = t
                                        ? 8
                                        : s
                                        ? parseInt(s, 16)
                                        : r
                                        ? parseInt(r, 16)
                                        : o
                                        ? parseInt(o, 8)
                                        : i
                                        ? "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?".indexOf(
                                              i
                                          )
                                        : a[h],
                                    u = String.fromCharCode(l);
                                return (
                                    /[[\]{}^$.|?*+()]/.test(u) &&
                                        (u = "\\" + u),
                                    u
                                );
                            }
                        );
                    }),
                        (n.tokenizeClass = (e, t) => {
                            for (
                                var a,
                                    o,
                                    i = [],
                                    h =
                                        /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(?:\\)?([^\]]))|(\])|(?:\\)?([^])/g;
                                null != (a = h.exec(e));

                            )
                                if (a[1]) i.push(r.words());
                                else if (a[2]) i.push(r.ints());
                                else if (a[3]) i.push(r.whitespace());
                                else if (a[4]) i.push(r.notWords());
                                else if (a[5]) i.push(r.notInts());
                                else if (a[6]) i.push(r.notWhitespace());
                                else if (a[7])
                                    i.push({
                                        type: s.RANGE,
                                        from: (a[8] || a[9]).charCodeAt(0),
                                        to: a[10].charCodeAt(0),
                                    });
                                else {
                                    if (!(o = a[12])) return [i, h.lastIndex];
                                    i.push({
                                        type: s.CHAR,
                                        value: o.charCodeAt(0),
                                    });
                                }
                            n.error(t, "Unterminated character class");
                        }),
                        (n.error = (e, t) => {
                            throw new SyntaxError(
                                "Invalid regular expression: /" + e + "/: " + t
                            );
                        });
                },
                { "./sets": 5, "./types": 6 },
            ],
        },
        {},
        [1]
    )(1);
    "function" == typeof define && "object" == typeof define.amd
        ? define("RandExp", function () {
              return e;
          })
        : "undefined" != typeof window && (window.RandExp = e);
})();
var UAGenerator = function () {
    (this.isArray = function (e) {
        return "[object Array]" === Object.prototype.toString.call(e);
    }),
        (this.isString = function (e) {
            return "string" == typeof e;
        }),
        (this.isUndefined = function (e) {
            return void 0 === e;
        }),
        (this.get = function (e) {
            return this.isArray(e)
                ? e[Math.floor(Math.random() * e.length)]
                : null;
        }),
        (this.patterns = {
            locales: ["en-(US|AU|CA|IN|IE|MT|NZ|PH|SG|ZA|GB|US)"],
            net_clr: {
                v1: ["( \\.NET CLR 1\\.[0-1]\\.[4-5]07[0-5][0-9];|)"],
                v2up: ["( \\.NET CLR [2-3]\\.[1-8]\\.[3-5]07[0-9][0-9];|)"],
            },
            media_server: ["( Media Center PC [4-6]\\.0;|)"],
            windows: ["Windows NT (6\\.[1-3]|10\\.0)"],
            macos: {
                v10_blink: ["Intel Mac OS X 10_(1[0-4])_[0-4]"],
                v10_firefox: ["Intel Mac OS X 10\\.(1[0-4])"],
            },
            applewebkit: [
                "AppleWebKit/(60[1-5]\\.[1-7]\\.[1-8])",
                "AppleWebKit/(53[5-8]\\.[1-2][0-9]\\.[1-3][0-9])",
            ],
            browsers_versions: {
                chrome: [
                    "(81\\.0\\.4404|80\\.0\\.3987|79\\.0\\.3945|78\\.0\\.3904|94\\.0\\.4606|64\\.0\\.3282|70\\.0\\.3538|83\\.0\\.4103" +
                        "|84\\.0\\.4147\\.89|66\\.0\\.3359\\.117|65\\.0\\.3325\\.181|62\\.0\\.3202\\.62|76\\.0\\.3809\\.100" +
                        "|95\\.0\\.2883|84\\.0\\.4125|48\\.0\\.2564|99\\.0\\.2623|50\\.0\\.2661|98\\.0\\.3029|92\\.0\\.4515)\\.(?:[89]\\d|1[0-4]{2})",
                ],
                safari: ["1[12]\\.[0-1]\\.[1-5]"],
                firefox: ["7[3456789]\\.[01]"],
                opera: [
                    "5[345]\\.[0-3]\\.2[1-3][0-9][0-9]\\.([1-2]|)[1-9][0-9]",
                ],
                edge: [
                    "Chrome/81\\.0\\.4044\\.117 Safari/537\\.36 Edg/8[01]\\.17763",
                    "Chrome/81\\.0\\.4044\\.129 Safari/537\\.36 Edg/8[01]\\.0\\.416\\.68",
                    "Chrome/94\\.0\\.4606\\.71 Safari/537\\.36 Edg/9[24]\\.0\\.992\\.38",
                    "Chrome/95\\.0\\.4638\\.69 Safari/537\\.36 Edg/95\\.0\\.1020\\.44",
                ],
            },
        }),
        (this.useragents = {
            ie: {
                v6: {
                    name: "Internet Explorer 6",
                    regexp: [
                        "Mozilla/4\\.0 \\(compatible; MSIE 6\\.0; Windows NT 5\\.1;( SV1;||)" +
                            this.get(this.patterns.net_clr.v2up) +
                            " " +
                            this.get(this.patterns.locales) +
                            "\\)",
                    ],
                },
                v7: {
                    name: "Internet Explorer 7",
                    regexp: [
                        "Mozilla/4\\.0 \\((compatible|compatible|Windows; U); MSIE 7\\.0; Windows NT (5\\.1|6\\.0);( WOW64;|)" +
                            this.get(this.patterns.net_clr.v1) +
                            this.get(this.patterns.media_server) +
                            " InfoPath\\.[1-3]; " +
                            this.get(this.patterns.locales) +
                            "\\)",
                    ],
                },
                v8: {
                    name: "Internet Explorer 8",
                    regexp: [
                        "Mozilla/4\\.0 \\(compatible; MSIE 8\\.0; Windows NT (5\\.1|6\\.[01]); Trident/4\\.0; (WOW64|WOW64|GTB7\\.[2-6]); InfoPath\\.[2-3];( SV1;|)" +
                            this.get(this.patterns.net_clr.v1) +
                            " " +
                            this.get(this.patterns.locales) +
                            "\\)",
                    ],
                },
                v9: {
                    name: "Internet Explorer 9",
                    regexp: [
                        "Mozilla/5\\.0 \\((compatible|Windows; U); MSIE 9\\.0; Windows NT 6\\.[01]; (Win64; x64; |WOW64; |)Trident/5\\.0;" +
                            this.get(this.patterns.net_clr.v2up) +
                            this.get(this.patterns.media_server) +
                            "( Zune 4\\.[0-7];|||)( \\.NET4\\.0(C|E);) " +
                            this.get(this.patterns.locales) +
                            "\\)",
                    ],
                },
                v10: {
                    name: "Internet Explorer 10",
                    regexp: [
                        "Mozilla/5\\.0 \\(compatible; MSIE 10\\.0; Windows NT 6\\.[12];( InfoPath\\.[2-3];|)" +
                            this.get(this.patterns.net_clr.v2up) +
                            " (WOW64; |)Trident/6\\.0(; " +
                            this.get(this.patterns.locales) +
                            "|)\\)",
                    ],
                },
                v11: {
                    name: "Internet Explorer 11",
                    regexp: [
                        "Mozilla/5\\.0 \\(" +
                            this.get(this.patterns.windows) +
                            "; (?:WOW64; )?Trident/7\\.0; rv:11\\.0\\) like Gecko",
                    ],
                },
            },
            edge: {
                desktop: {
                    name: "Edge on Windows",
                    regexp: [
                        "Mozilla/5\\.0 \\(Windows NT 10\\.0; Win64; x64\\) AppleWebKit/537\\.36 \\(KHTML, like Gecko\\) " +
                            this.get(this.patterns.browsers_versions.edge),
                    ],
                },
                xbox: {
                    name: "Edge on Xbox",
                    regexp: [
                        "Mozilla/5\\.0 \\(Windows NT 10\\.0; Win64; x64; Xbox; Xbox One\\) AppleWebKit/537\\.36 \\(KHTML, like Gecko\\) " +
                            this.get(this.patterns.browsers_versions.edge),
                    ],
                },
            },
            chrome: {
                win: {
                    name: "Chrome on Windows",
                    regexp: [
                        "Mozilla/5\\.0 \\(" +
                            this.get(this.patterns.windows) +
                            "(; Win64; x64|; WOW64|)\\) AppleWebKit/537\\.36 \\(KHTML, like Gecko\\) Chrome/(" +
                            this.get(this.patterns.browsers_versions.chrome) +
                            ") Safari/537\\.36",
                    ],
                },
                mac: {
                    name: "Chrome on Mac",
                    regexp: [
                        "Mozilla/5\\.0 \\(Macintosh; " +
                            this.get(this.patterns.macos.v10_blink) +
                            "\\) AppleWebKit/537\\.36 \\(KHTML, like Gecko\\) Chrome/(" +
                            this.get(this.patterns.browsers_versions.chrome) +
                            ") Safari/537\\.36",
                    ],
                },
                linux: {
                    name: "Chrome on Linux",
                    regexp: [
                        "Mozilla/5\\.0 \\(X11;( U; | )Linux (x86_64|i686)\\) AppleWebKit/537\\.36 \\(KHTML, like Gecko\\) Chrome/(" +
                            this.get(this.patterns.browsers_versions.chrome) +
                            ") Safari/537\\.36",
                    ],
                },
            },
            firefox: {
                win: {
                    name: "Firefox on Windows",
                    regexp: [
                        "Mozilla/5\\.0 \\(" +
                            this.get(this.patterns.windows) +
                            "; (WOW64|Win64); rv:(" +
                            this.get(this.patterns.browsers_versions.firefox) +
                            ")\\) Gecko/20100101 Firefox/(\\3)",
                    ],
                },
                mac: {
                    name: "Firefox on Mac",
                    regexp: [
                        "Mozilla/5\\.0 \\(Macintosh;( U; | )" +
                            this.get(this.patterns.macos.v10_firefox) +
                            "; rv:(" +
                            this.get(this.patterns.browsers_versions.firefox) +
                            ")\\) Gecko/20100101 Firefox/(\\3)",
                    ],
                },
                linux: {
                    name: "Firefox on Linux",
                    regexp: [
                        "Mozilla/5\\.0 \\(X11; (NetBSD i686|Linux i686|Linux x86_64|Ubuntu; Linux|SunOS sun4u|Gentoo); rv:(" +
                            this.get(this.patterns.browsers_versions.firefox) +
                            ")\\) Gecko/20100101 Firefox/(\\2)",
                    ],
                },
                android: {
                    name: "Firefox on Android",
                    regexp: [
                        "Mozilla/5\\.0 \\(Android (?:6\\.0(?:\\.1)?|7\\.(?:0|1(?:\\.[12])?)|8\\.[01]|9\\.0); Mobile; rv:(" +
                            this.get(this.patterns.browsers_versions.firefox) +
                            ")\\) Gecko/\\1 Firefox/\\1",
                    ],
                },
            },
            safari: {
                mac: {
                    name: "Safari on Mac",
                    regexp: [
                        "Mozilla/5\\.0 \\(Macintosh;( U; | )" +
                            this.get(this.patterns.macos.v10_blink) +
                            "; " +
                            this.get(this.patterns.locales) +
                            "\\) " +
                            this.get(this.patterns.applewebkit) +
                            " \\(KHTML, like Gecko\\) Version/" +
                            this.get(this.patterns.browsers_versions.safari) +
                            " Safari/(\\4)",
                    ],
                },
                iphone: {
                    name: "Safari on iPhone",
                    regexp: [
                        "Mozilla/5\\.0 \\(iPhone; U; CPU iPhone OS 11_[0-3]_[0-9] like Mac OS X; " +
                            this.get(this.patterns.locales) +
                            "\\) " +
                            this.get(this.patterns.applewebkit) +
                            " \\(KHTML, like Gecko\\) Version/" +
                            this.get(this.patterns.browsers_versions.safari) +
                            " Mobile/8(J|F|C)[1-4](8a|90|) Safari/6533\\.18\\.5",
                    ],
                },
                ipad: {
                    name: "Safari on iPad",
                    regexp: [
                        "Mozilla/5\\.0 \\(iPad;( U;|) CPU OS 11_[0-3](_2|) like Mac OS X(; " +
                            this.get(this.patterns.locales) +
                            ")\\) " +
                            this.get(this.patterns.applewebkit) +
                            " \\(KHTML, like Gecko\\) Version/" +
                            this.get(this.patterns.browsers_versions.safari) +
                            " Mobile/8(J|F|C)[1-4](8a|90|) Safari/(\\5)",
                    ],
                },
            },
            opera: {
                win: {
                    name: "Opera on Windows",
                    regexp: [
                        "Mozilla/5\\.0 \\(" +
                            this.get(this.patterns.windows) +
                            "(; Win64; x64|; WOW64|)\\) AppleWebKit/537\\.36 \\(KHTML, like Gecko\\) Chrome/(" +
                            this.get(this.patterns.browsers_versions.chrome) +
                            ") Safari/537\\.36 OPR/" +
                            this.get(this.patterns.browsers_versions.opera),
                    ],
                },
                mac: {
                    name: "Opera on Mac",
                    regexp: [
                        "Mozilla/5\\.0 \\(Macintosh; " +
                            this.get(this.patterns.macos.v10_blink) +
                            "\\) AppleWebKit/537\\.36 \\(KHTML, like Gecko\\) Chrome/(" +
                            this.get(this.patterns.browsers_versions.chrome) +
                            ") Safari/537\\.36 OPR/" +
                            this.get(this.patterns.browsers_versions.opera),
                    ],
                },
                linux: {
                    name: "Opera on Linux",
                    regexp: [
                        "Mozilla/5\\.0 \\(X11;( U; | )Linux (x86_64|i686)\\) AppleWebKit/537\\.36 \\(KHTML, like Gecko\\) Chrome/(" +
                            this.get(this.patterns.browsers_versions.chrome) +
                            ") Safari/537\\.36 OPR/" +
                            this.get(this.patterns.browsers_versions.opera),
                    ],
                },
            },
        }),
        (this.randexp = function (e) {
            if ("undefined" == typeof window.RandExp)
                throw new Error('"RandExp" component must be included first');
            return this.isString(e)
                ? new window.RandExp(e).gen()
                : !!console.error("regexp must be string");
        }),
        (this.getAllByKeyName = function (e, t) {
            var i = [];
            return (
                (this.recursive = function (e, t) {
                    for (var s in e)
                        "object" != typeof e[s] ||
                        this.isArray(e[s]) ||
                        null === e[s]
                            ? s === t && i.push(e[s])
                            : this.recursive(e[s], t);
                }),
                this.recursive(e, t),
                i
            );
        }),
        (this.testAllRegexp = function () {
            var e = this.getAllByKeyName(this.useragents, "regexp");
            if (this.isArray(e)) {
                var t = e.length;
                if (t > 0)
                    for (var i = 0; i < t; i++) {
                        var s = e[i],
                            r = s.length;
                        console.info("Testing regexps (" + r + ') "' + s + '"');
                        for (var n = 0; n < r; n++) {
                            console.log("> Generate value for regexp: " + s[n]);
                            for (var o = 0; o < 9; o++)
                                console.log(
                                    ">> Generated value: " + this.randexp(s[n])
                                );
                        }
                    }
            } else
                console.error(
                    "Regexps variable must be an array and dont be empty",
                    e
                );
            return null;
        }),
        (this.generate = function (e) {
            this.isString(e) && (e = [e]),
                this.isArray(e) || (e = []),
                e.length <= 0 && (e = ["*"]);
            for (var t = [], i = 0, s = e.length; i < s; i++) {
                if ("*" === e[i])
                    return this.randexp(
                        this.get(
                            this.get(
                                this.getAllByKeyName(this.useragents, "regexp")
                            )
                        )
                    );
                var r,
                    n,
                    o = e[i].split("_");
                !this.isUndefined(o[0]) && this.isString(o[0]) && (r = o[0]),
                    !this.isUndefined(o[1]) &&
                        this.isString(o[1]) &&
                        (n = o[1]),
                    this.isUndefined(r) ||
                        this.isUndefined(n) ||
                        this.isUndefined(this.useragents[r][n]) ||
                        t.push(this.get(this.useragents[r][n].regexp));
            }
            return t.length > 0
                ? this.randexp(this.get(t))
                : !!console.error("User-Agent patterns not found");
        });
};
function get_random_ua() {
    try{
        const ua = new UAGenerator();
        return ua.generate([
            "edge_desktop",
            "chrome_win",
            "chrome_mac",
            "firefox_win",
            "firefox_mac",
            "firefox_linux",
            "opera_win",
            "opera_mac",
            "safari_mac",
        ]);
    } catch(e) {
        return 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.53';
    }
}
