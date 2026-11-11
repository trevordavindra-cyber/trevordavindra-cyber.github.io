/* WITCH TOOLPACK — on-device tools that run inside the one witch brain, free, offline-capable */
(function () {
"use strict";
const T = [];
const n = (s) => s.replace(/[<>&]/g, "");
function on(msg) { return "**on-device tool**\n" + msg; }

/* ---------- units ---------- */
const UNITS = {
length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254, nmi: 1852, um: 1e-6 },
mass: { kg: 1, g: 0.001, mg: 1e-6, t: 1000, lb: 0.45359237, oz: 0.028349523125, st: 6.35029318 },
volume: { l: 1, ml: 0.001, "m3": 1000, gal: 3.785411784, qt: 0.946352946, pt: 0.473176473, cup: 0.2365882365, "fl oz": 0.0295735295625, tbsp: 0.0147867648, tsp: 0.00492892159 },
area: { "m2": 1, "km2": 1e6, "cm2": 1e-4, "ft2": 0.09290304, "in2": 0.00064516, acre: 4046.8564224, ha: 10000 },
speed: { "m/s": 1, "km/h": 0.277777778, mph: 0.44704, kn: 0.514444444, "ft/s": 0.3048 },
time: { s: 1, ms: 0.001, min: 60, h: 3600, day: 86400, week: 604800, year: 31557600 },
data: { b: 1, kb: 1e3, mb: 1e6, gb: 1e9, tb: 1e12, kib: 1024, mib: 1048576, gib: 1073741824 },
energy: { j: 1, kj: 1000, cal: 4.184, kcal: 4184, wh: 3600, kwh: 3.6e6, btu: 1055.06 },
pressure: { pa: 1, kpa: 1000, bar: 1e5, psi: 6894.757293, atm: 101325, mmhg: 133.322387415 },
angle: { deg: 1, rad: 57.29577951308232, grad: 0.9, turn: 360 }
};
const ALIAS = { kilometer: "km", kilometers: "km", meter: "m", meters: "m", mile: "mi", miles: "mi", foot: "ft", feet: "ft", inch: "in", inches: "in", yard: "yd", yards: "yd", gram: "g", grams: "g", kilogram: "kg", kilograms: "kg", pound: "lb", pounds: "lb", ounce: "oz", ounces: "oz", liter: "l", liters: "l", litre: "l", litre: "l", gallon: "gal", gallons: "gal", celsius: "c", fahrenheit: "f", kelvin: "k", byte: "b", bytes: "b", kilobyte: "kb", megabyte: "mb", gigabyte: "gb", terabyte: "tb", minute: "min", minutes: "min", hour: "h", hours: "h", days: "day", week: "week", weeks: "week", years: "year", pound: "lb", ounce: "oz" };
const CAT = {}; Object.keys(UNITS).forEach((c) => Object.keys(UNITS[c]).forEach((u) => { CAT[u] = c; CAT[ALIAS[u] || u] = c; }));
function u1(u) { u = u.toLowerCase().replace(/^°/, ""); return ALIAS[u] || u; }
function conv(v, from, to) {
  from = u1(from); to = u1(to);
  if ((from === "c" || from === "f" || from === "k") && (to === "c" || to === "f" || to === "k")) {
    const c = from === "c" ? v : from === "f" ? (v - 32) * 5 / 9 : v - 273.15;
    const r = to === "c" ? c : to === "f" ? c * 9 / 5 + 32 : c + 273.15;
    return r;
  }
  const cf = CAT[from], ct = CAT[to];
  if (!cf || !ct || cf !== ct) return null;
  return v * UNITS[cf][from] / UNITS[ct][to];
}
T.push({ re: /(-?\d+(?:\.\d+)?)\s*°?\s*([a-z°/2³2]+)\s*(?:to|in|into)\s*°?\s*([a-z°/2³2]+)/i,
  fn: (m) => {
    const v = parseFloat(m[1]), from = u1(m[2]), to = u1(m[3]);
    const r = conv(v, from, to);
    if (r === null) return null;
    const out = Math.abs(r) >= 1e6 ? r.toExponential(4) : Math.round(r * 1e6) / 1e6;
    return on(n(v + " " + from + " = " + out + " " + to));
  } });

/* ---------- safe calculator ---------- */
function calc(src) {
  let e = src.toLowerCase().replace(/\bsqrt\(/g, "Math.sqrt(").replace(/\bsin\(/g, "Math.sin(").replace(/\bcos\(/g, "Math.cos(").replace(/\btan\(/g, "Math.tan(").replace(/\blog\(/g, "Math.log10(").replace(/\bln\(/g, "Math.log(").replace(/\babs\(/g, "Math.abs(").replace(/\bround\(/g, "Math.round(").replace(/\bfloor\(/g, "Math.floor(").replace(/\bceil\(/g, "Math.ceil(").replace(/\bpi\b/g, "Math.PI").replace(/\be\b/g, "Math.E").replace(/\^/g, "**").replace(/%(?=\d)/g, "/100*");
  if (/[^0-9+\-*/().,%!\s Math sqrt sin cos tan log ln abs round floor ceil pi e ]/i.test(e.replace(/Math\.\w+/g, ""))) return null;
  if (/[;=]|=>|\bwhile\b|\bfor\b|\bif\b|document|window|fetch|localStorage|import|eval/.test(e)) return null;
  try { const r = Function('"use strict"; return (' + e + ")")(); if (typeof r !== "number" || !isFinite(r)) return null; return Math.round(r * 1e10) / 1e10; } catch (x) { return null; }
}
T.push({ re: /^(?:calc|calculate|what(?:'s| is)|compute|solve)\s+(.+?)[?]?$[^}]/i, fn: (m) => { const r = calc(m[1]); return r === null ? null : on(n(m[1].trim() + " = " + r)); } });
T.push({ re: /^(-?\d+(?:\.\d+)?)\s*(?:percent of|% of)\s*(-?\d+(?:\.\d+)?)$/i, fn: (m) => on(n(m[1] + "% of " + m[2] + " = " + (parseFloat(m[1]) / 100 * parseFloat(m[2])))) });

/* ---------- stats ---------- */
T.push({ re: /^(?:stats|statistics|mean|average|median|mode|std|stddev)\s+(?:of\s+|for\s+)?(.+)$[^}]/i, fn: (m) => {
  const nums = m[1].split(/[\s,;]+/).map(parseFloat).filter((x) => !isNaN(x));
  if (nums.length < 2) return null;
  const sum = nums.reduce((a, b) => a + b, 0), mean = sum / nums.length;
  const s = [...nums].sort((a, b) => a - b);
  const med = nums.length % 2 ? s[(nums.length - 1) / 2] : (s[nums.length / 2 - 1] + s[nums.length / 2]) / 2;
  const cnt = {}; nums.forEach((x) => { cnt[x] = (cnt[x] || 0) + 1; });
  const mode = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0];
  const sd = Math.sqrt(nums.reduce((a, b) => a + (b - mean) * (b - mean), 0) / nums.length);
  return on(n("count " + nums.length + " · sum " + Math.round(sum * 1e4) / 1e4 + " · mean " + Math.round(mean * 1e4) / 1e4 + " · median " + med + " · mode " + mode[0] + " · range " + (s[s.length - 1] - s[0]) + " · std dev " + Math.round(sd * 1e4) / 1e4 + " · min " + s[0] + " · max " + s[s.length - 1]));
} });

/* ---------- ciphers / encoders ---------- */
T.push({ re: /^(?:base64(?: encode| enc)?|b64)\s+(?:of\s+)?(.+)$[^}]/i, fn: (m) => on(n("base64: " + btoa(unescape(encodeURIComponent(m[1]))))) });
T.push({ re: /^(?:base64 decode|b64 decode|unb64)\s+(?:of\s+)?(.+)$[^}]/i, fn: (m) => { try { return on(n("decoded: " + decodeURIComponent(escape(atob(m[1].replace(/\s/g, "")))))); } catch (x) { return on("that isn't valid base64."); } } });
T.push({ re: /^(?:hex encode|to hex)\s+(?:of\s+)?(.+)$[^}]/i, fn: (m) => on(n("hex: " + [...new TextEncoder().encode(m[1])].map((b) => b.toString(16).padStart(2, "0")).join(" "))) });
T.push({ re: /^(?:binary encode|to binary)\s+(?:of\s+)?(.+)$[^}]/i, fn: (m) => on(n("binary: " + [...new TextEncoder().encode(m[1])].map((b) => b.toString(2).padStart(8, "0")).join(" "))) });
T.push({ re: /^(?:url encode|encode url)\s+(?:of\s+)?(.+)$[^}]/i, fn: (m) => on(n("url-encoded: " + encodeURIComponent(m[1]))) });
T.push({ re: /^(?:url decode|decode url)\s+(?:of\s+)?(.+)$[^}]/i, fn: (m) => { try { return on(n("decoded: " + decodeURIComponent(m[1].replace(/\+/g, " ")))); } catch (x) { return on("that isn't valid url encoding."); } } });
const rot = (s, k) => s.replace(/[a-z]/gi, (c) => { const b = c <= "Z" ? 65 : 97; return String.fromCharCode((c.charCodeAt(0) - b + k + 26) % 26 + b); });
T.push({ re: /^(?:rot13|rot 13)\s+(?:of\s+)?(.+)$[^}]/i, fn: (m) => on(n("rot13: " + rot(m[1], 13))) });
T.push({ re: /^(?:caesar|rot)\s+(-?\d+)\s+(?:of\s+)?(.+)$[^}]/i, fn: (m) => on(n("shift " + m[1] + ": " + rot(m[2], parseInt(m[1])))) });
T.push({ re: /^(?:atbash)\s+(?:of\s+)?(.+)$[^}]/i, fn: (m) => on(n("atbash: " + m[1].replace(/[a-z]/gi, (c) => { const b = c <= "Z" ? 65 : 97; return String.fromCharCode(b + 25 - (c.charCodeAt(0) - b)); }))) });
const MORSE = { a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....", i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.", ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--" };
const MORSER = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));
T.push({ re: /^(?:morse encode|morse)\s+(?:of\s+)?(.+)$[^}]/i, fn: (m) => on(n("morse: " + m[1].toLowerCase().split("").map((c) => MORSE[c] || (c === " " ? "/" : "")).filter(Boolean).join(" "))) });
T.push({ re: /^(?:morse decode)\s+(.+)$[^}]/i, fn: (m) => { const r = m[1].trim().split(/\s+/).map((c) => c === "/" ? " " : (MORSER[c] || "?")).join(""); return on(n("decoded: " + r)); } });
T.push({ re: /^(?:leet|1337)\s+(?:of\s+)?(.+)$[^}]/i, fn: (m) => on(n("leet: " + m[1].replace(/[aeiost]/gi, (c) => ({ a: "4", e: "3", i: "1", o: "0", s: "5", t: "7" })[c.toLowerCase()] || c))) });
T.push({ re: /^(?:nato)\s+(?:of\s+)?(.+)$[^}]/i, fn: (m) => { const N = { a: "alfa", b: "bravo", c: "charlie", d: "delta", e: "echo", f: "foxtrot", g: "golf", h: "hotel", i: "india", j: "juliett", k: "kilo", l: "lima", m: "mike", n: "november", o: "oscar", p: "papa", q: "quebec", r: "romeo", s: "sierra", t: "tango", u: "uniform", v: "victor", w: "whiskey", x: "x-ray", y: "yankee", z: "zulu" }; return on(n("nato: " + m[1].toLowerCase().split("").map((c) => N[c] || c).join(" "))); } });

/* ---------- text tools ---------- */
T.push({ re: /^(?:word count|count words)\s+(?:of\s+)?([\s\S]+)$[^}]/i, fn: (m) => { const t = m[1].trim(); return on(n("words " + (t.split(/\s+/).filter(Boolean).length) + " · chars " + t.length + " · chars no spaces " + t.replace(/\s/g, "").length + " · sentences " + (t.split(/[.!?]+/).filter((x) => x.trim()).length))); } });
T.push({ re: /^(?:upper|uppercase|shout)\s+(?:case\s+)?([\s\S]+)$[^}]/i, fn: (m) => on(n(m[1].toUpperCase())) });
T.push({ re: /^(?:lower|lowercase)\s+(?:case\s+)?([\s\S]+)$[^}]/i, fn: (m) => on(n(m[1].toLowerCase())) });
T.push({ re: /^(?:title case)\s+([\s\S]+)$[^}]/i, fn: (m) => on(n(m[1].replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()))) });
T.push({ re: /^(?:camel ?case)\s+([\s\S]+)$[^}]/i, fn: (m) => on(n(m[1].toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()))) });
T.push({ re: /^(?:snake ?case)\s+([\s\S]+)$[^}]/i, fn: (m) => on(n(m[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, "_"))) });
T.push({ re: /^(?:kebab ?case|slugify|slug)\s+([\s\S]+)$[^}]/i, fn: (m) => on(n(m[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))) });
T.push({ re: /^(?:sort lines|sort)\s+([\s\S]+)$[^}]/im, fn: (m) => { const ls = m[1].trim().split(/\n/).sort((a, b) => a.localeCompare(b)); return on(n(ls.join("\n"))); } });
T.push({ re: /^(?:unique lines|dedupe|remove duplicate lines)\s+([\s\S]+)$[^}]/im, fn: (m) => { const seen = new Set(); return on(n(m[1].trim().split(/\n/).filter((l) => { const k = l.trim(); if (!k || seen.has(k)) return false; seen.add(k); return true; }).join("\n"))); } });
T.push({ re: /^(?:reverse (?:text|it|this)|reverse)\s+([\s\S]+)$[^}]/i, fn: (m) => on(n([...m[1]].reverse().join(""))) });
T.push({ re: /^(?:extract emails?)\s+([\s\S]+)$[^}]/i, fn: (m) => { const e = m[1].match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi); return on(n(e ? e.length + " found:\n" + [...new Set(e)].join("\n") : "no email addresses found")); } });
T.push({ re: /^(?:extract links?|extract urls?)\s+([\s\S]+)$[^}]/i, fn: (m) => { const e = m[1].match(/https?:\/\/[^\s"'<>)]+/gi); return on(n(e ? e.length + " found:\n" + [...new Set(e)].join("\n") : "no links found")); } });
T.push({ re: /^(?:lorem(?: ipsum)?)(?: (\d+))?$[^}]/i, fn: (m) => { const w = parseInt(m[2] || "40"); const L = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit".split(" "); const out = []; for (let i = 0; i < w; i++) out.push(L[Math.floor(Math.random() * L.length)]); let s = out.join(" "); s = s[0].toUpperCase() + s.slice(1) + "."; return on(n(s)); } });

/* ---------- generators ---------- */
T.push({ re: /^(?:password|gen password|generate password)(?: (\d+))?$[^}]/i, fn: (m) => { const len = Math.min(Math.max(parseInt(m[2] || "16"), 8), 64); const cs = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*-_=+"; const a = new Uint32Array(len); crypto.getRandomValues(a); let p = ""; for (let i = 0; i < len; i++) p += cs[a[i] % cs.length]; return on(n("password (" + len + " chars, generated on your phone, never sent anywhere):\n`" + p + "`")); } });
T.push({ re: /^(?:uuid|guid|gen uuid)$[^}]/i, fn: (m) => on(n("uuid v4: " + (crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16); })))) });
T.push({ re: /^(?:flip a coin|coin flip|flip coin)$[^}]/i, fn: () => on(n("🪙 " + (Math.random() < 0.5 ? "heads" : "tails"))) });
T.push({ re: /^(?:roll (?:a )?dice|roll a die|roll d6|roll the dice)$[^}]/i, fn: () => on(n("🎲 you rolled a " + (1 + Math.floor(Math.random() * 6)))) });
T.push({ re: /^(?:roll )?d(\d+)$[^}]/i, fn: (m) => on(n("🎲 d" + m[1] + " → " + (1 + Math.floor(Math.random() * parseInt(m[1]))))) });
T.push({ re: /^(?:random number|pick a number)(?: between (-?\d+) and (-?\d+))?$[^}]/i, fn: (m) => { const lo = m[1] !== undefined ? parseInt(m[1]) : 1, hi = m[2] !== undefined ? parseInt(m[2]) : 100; return on(n("🎲 " + (lo + Math.floor(Math.random() * (hi - lo + 1))) + " (" + lo + " to " + hi + ")")); } });
T.push({ re: /^(?:random color|pick a color)$[^}]/i, fn: () => { const c = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0"); return on(n("random color: " + c)); } });
T.push({ re: /^(?:pick (?:one )?(?:from|of)|choose (?:one )?(?:from|of))\s+(.+)$[^}]/i, fn: (m) => { const opts = m[1].split(/,| or /).map((s) => s.trim()).filter(Boolean); if (opts.length < 2) return null; return on(n("🎲 i pick: " + opts[Math.floor(Math.random() * opts.length)])); } });

/* ---------- numbers ---------- */
const ONES = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"], TENS = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
function words(x) { if (x < 20) return ONES[x]; if (x < 100) return TENS[Math.floor(x / 10)] + (x % 10 ? "-" + ONES[x % 10] : ""); if (x < 1000) return ONES[Math.floor(x / 100)] + " hundred" + (x % 100 ? " " + words(x % 100) : ""); for (const [d, w] of [[1e9, "billion"], [1e6, "million"], [1e3, "thousand"]]) { if (x >= d) return words(Math.floor(x / d)) + " " + w + (x % d ? " " + words(x % d) : ""); } }
T.push({ re: /^(?:number to words|words for|spell out)\s+(-?\d+(?:\.\d+)?)$[^}]/i, fn: (m) => { const x = parseFloat(m[1]); if (!isFinite(x) || Math.abs(x) >= 1e12) return null; return on(n((x < 0 ? "negative " : "") + words(Math.floor(Math.abs(x))) + (m[1].includes(".") ? " point " + m[1].split(".")[1].split("").map((d) => ONES[+d]).join(" ") : ""))); } });
T.push({ re: /^(?:roman(?: numeral)?|to roman)\s+(-?\d+)$[^}]/i, fn: (m) => { const x = parseInt(m[1]); if (x <= 0 || x > 3999) return on("roman numerals go 1 to 3999."); const R = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]]; let v = x, s = ""; R.forEach(([d, r]) => { while (v >= d) { s += r; v -= d; } }); return on(n(x + " = " + s)); } });
T.push({ re: /^(?:from roman|roman decode)\s+([mdclxvi]+)$[^}]/i, fn: (m) => { const V = { i: 1, v: 5, x: 10, l: 50, c: 100, d: 500, m: 1000 }; let t = 0; const s = m[1].toLowerCase(); for (let i = 0; i < s.length; i++) t += V[s[i]] < (V[s[i + 1]] || 0) ? -V[s[i]] : V[s[i]]; return on(n(m[1].toUpperCase() + " = " + t)); } });
T.push({ re: /^(?:base (\d+)|to base (\d+))\s+(?:of\s+)?(-?\d+)$[^}]/i, fn: (m) => { const b = parseInt(m[1] || m[2]), x = parseInt(m[3]); if (b < 2 || b > 36) return on("base goes 2 to 36."); return on(n(x + " in base " + b + " = " + x.toString(b))); } });

/* ---------- dates ---------- */
T.push({ re: /^(?:days (?:between|from)|date diff|how many days)\s+(.+?)\s+(?:to|and|until)\s+(.+)$[^}]/i, fn: (m) => { const a = new Date(m[1]), b = new Date(m[2]); if (isNaN(a) || isNaN(b)) return null; return on(n(Math.round(Math.abs(b - a) / 864e5) + " days between " + a.toDateString() + " and " + b.toDateString())); } });
T.push({ re: /^(?:what day|which day|weekday of|day of week)\s+(.+)$[^}]/i, fn: (m) => { const d = new Date(m[1]); if (isNaN(d)) return null; return on(n(m[1].trim() + " is a " + d.toLocaleDateString("en-US", { weekday: "long" }))); } });
T.push({ re: /^(?:unix time|what.s the unix time|epoch now)$[^}]/i, fn: () => on(n("unix time now: " + Math.floor(Date.now() / 1000))) });
T.push({ re: /^(?:age|how old)\s+(?:if born |for someone born )?(?:on\s+)?(.+)$[^}]/i, fn: (m) => { const d = new Date(m[1]); if (isNaN(d) || d > new Date()) return null; const now = new Date(); let a = now.getFullYear() - d.getFullYear(); if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) a--; const days = Math.floor((now - d) / 864e5); return on(n("born " + d.toDateString() + " → " + a + " years old (about " + Math.round(days / 30.44) + " months, " + days.toLocaleString() + " days)")); } });

/* ---------- colors ---------- */
T.push({ re: /^(?:hex to rgb|rgb of)\s+#?([0-9a-f]{6})$[^}]/i, fn: (m) => { const h = m[1]; return on(n("#" + h + " = rgb(" + parseInt(h.slice(0, 2), 16) + ", " + parseInt(h.slice(2, 4), 16) + ", " + parseInt(h.slice(4, 6), 16) + ")")); } });
T.push({ re: /^(?:rgb to hex|hex of)\s+rgb\((\d+),\s*(\d+),\s*(\d+)\)$[^}]/i, fn: (m) => on(n("rgb(" + m[1] + ", " + m[2] + ", " + m[3] + ") = #" + [m[1], m[2], m[3]].map((x) => (+x).toString(16).padStart(2, "0")).join(""))) });

/* ---------- readability ---------- */
T.push({ re: /^(?:readability|flesch)\s+(?:of\s+|score\s+(?:of\s+|for\s+))?([\s\S]+)$[^}]/i, fn: (m) => { const t = m[1].trim(); const sents = t.split(/[.!?]+/).filter((x) => x.trim()).length || 1; const ws = t.split(/\s+/).filter(Boolean); const syl = ws.reduce((a, w) => a + Math.max(1, (w.toLowerCase().match(/[aeiouy]+/g) || []).length), 0); const f = 206.835 - 1.015 * (ws.length / sents) - 84.6 * (syl / ws.length); const grade = f >= 90 ? "very easy (5th grade)" : f >= 70 ? "easy (6th-7th)" : f >= 60 ? "plain (8th-9th)" : f >= 50 ? "fairly hard (10th-12th)" : f >= 30 ? "hard (college)" : "very hard"; return on(n("flesch " + Math.round(f) + " / 100 · " + grade + " · " + ws.length + " words, " + sents + " sentences")); } });

/* ---------- hash ---------- */
async function sha(algo, msg) { const d = await crypto.subtle.digest(algo, new TextEncoder().encode(msg)); return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join(""); }
T.push({ re: /^(?:sha-?256|hash)\s+(?:of\s+)?(.+)$[^}]/i, fn: (m) => sha("SHA-256", m[1]).then((h) => on(n("sha-256:\n`" + h + "`"))) });
T.push({ re: /^(?:sha-?512)\s+(?:of\s+)?(.+)$[^}]/i, fn: (m) => sha("SHA-512", m[1]).then((h) => on(n("sha-512:\n`" + h + "`"))) });

/* ---------- currency (free keyless ECB rates) ---------- */
T.push({ re: /^(\d+(?:\.\d+)?)\s*([a-z]{3})\s*(?:to|in|into)\s*([a-z]{3})$[^}]/i, fn: (m) => fetch("https://api.frankfurter.app/latest?from=" + m[2].toUpperCase() + "&to=" + m[3].toUpperCase()).then((r) => r.json()).then((j) => { if (!j.rates || !j.rates[m[3].toUpperCase()]) return on(n("no live rate for " + m[2].toUpperCase() + " → " + m[3].toUpperCase() + ".")); const r = parseFloat(m[1]) * j.rates[m[3].toUpperCase()]; return on(n(m[1] + " " + m[2].toUpperCase() + " = " + Math.round(r * 100) / 100 + " " + m[3].toUpperCase() + " (live ECB rate)")); }).catch(() => on("couldn't reach the free rate service — try again.")) });

/* ---------- graph plotter ---------- */
T.push({ re: /^(?:plot|graph)\s+(?:y\s*=\s*)?(.+)$[^}]/i, fn: (m) => { const expr = m[1]; if (!/x/.test(expr) || /[;=]|document|window|fetch|localStorage|import|eval/.test(expr)) return null; const e = expr.replace(/\^/g, "**").replace(/\bsqrt\(/g, "Math.sqrt(").replace(/\bsin\(/g, "Math.sin(").replace(/\bcos\(/g, "Math.cos(").replace(/\btan\(/g, "Math.tan(").replace(/\babs\(/g, "Math.abs(").replace(/\bpi\b/g, "Math.PI"); if (/[^0-9x+\-*/().,\sMathsqrtincoblPI*]/i.test(e.replace(/Math\.\w+/g, ""))) return null; let f; try { f = new Function("x", '"use strict"; return (' + e + ")"); } catch (x2) { return null; } const N = 240, lo = -10, hi = 10; const pts = []; for (let i = 0; i <= N; i++) { const x = lo + (hi - lo) * i / N; let y; try { y = f(x); } catch (x3) { y = NaN; } pts.push([x, typeof y === "number" && isFinite(y) ? y : NaN]); } const ys = pts.map((p) => p[1]).filter((y) => !isNaN(y)); if (!ys.length) return on("couldn't plot that — try y = x^2 style."); let ylo = Math.min(...ys), yhi = Math.max(...ys); if (yhi - ylo > 1e4) { for (const p of pts) if (!isNaN(p[1]) && (p[1] > 1e3 || p[1] < -1e3)) p[1] = NaN; const y2 = pts.map((p) => p[1]).filter((y) => !isNaN(y)); if (!y2.length) return on("that curve explodes off screen — try a tamer expression."); ylo = Math.min(...y2); yhi = Math.max(...y2); } if (yhi - ylo < 1e-6) { ylo -= 1; yhi += 1; } const W = 560, H = 300, pad = 24; const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d"); g.fillStyle = "#17111f"; g.fillRect(0, 0, W, H); g.strokeStyle = "rgba(255,255,255,0.15)"; g.beginPath(); g.moveTo(pad, H / 2); g.lineTo(W - pad, H / 2); const x0 = pad + (0 - lo) / (hi - lo) * (W - 2 * pad); g.moveTo(x0, pad); g.lineTo(x0, H - pad); g.stroke(); g.strokeStyle = "#b18cff"; g.lineWidth = 2.5; g.beginPath(); let pen = false; for (const [x, y] of pts) { if (isNaN(y)) { pen = false; continue; } const px = pad + (x - lo) / (hi - lo) * (W - 2 * pad), py = H - pad - (y - ylo) / (yhi - ylo) * (H - 2 * pad); if (pen) g.lineTo(px, py); else { g.moveTo(px, py); pen = true; } } g.stroke(); const url = c.toDataURL("image/png"); setTimeout(() => { const wrap = document.createElement("div"); wrap.className = "msg bot"; wrap.innerHTML = '<div class="bubble"><img class="attach" style="width:100%;border-radius:12px" alt="graph">'; wrap.querySelector("img").src = url; const msgs = document.getElementById("messages"); if (msgs) { msgs.appendChild(wrap); msgs.scrollTop = msgs.scrollHeight; } }, 0); return on(n("plotted " + expr.trim() + " from x = -10 to 10")); } });

function tryRun(text) {
  const t = text.trim();
  if (!t || t.length > 4000) return null;
  for (const tool of T) {
    const m = t.match(tool.re);
    if (m) { try { const r = tool.fn(m); if (r) return r; } catch (e) {} }
  }
  return null;
}
window.WITCH_TOOLS = { tryRun, count: T.length };
})();
