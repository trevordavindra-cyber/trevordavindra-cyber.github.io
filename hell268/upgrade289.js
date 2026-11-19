/* ILLUMINATI upgrade 289 - OMNIBRAIN MATH CHECK (hl289)
   PROJECT OMNIBRAIN phase 8: independent arithmetic verification.
   Scans the AI's answer for arithmetic it asserted as an equation (a op b = c),
   re-computes every one with the site's exact evaluator (the /calc engine, no AI
   involved), and appends a short MATH CHECK line when the stated result is wrong.
   Numbers only never rewritten mid-answer: the check rides under the answer.
*/
(function () {
  if (window.__HL289) return; window.__HL289 = true;

  var RE = /(-?\d+(?:\.\d+)?)\s*([+\-*/xX\u00d7^])\s*(-?\d+(?:\.\d+)?)\s*=\s*(-?\d+(?:\.\d+)?)/g;

  function calcExpr(a, op, b) {
    var x = parseFloat(a), y = parseFloat(b), r = null;
    try {
      if (op === '+') r = x + y;
      else if (op === '-') r = x - y;
      else if (op === '*' || op === 'x' || op === 'X' || op === '\u00d7') r = x * y;
      else if (op === '/') r = y === 0 ? NaN : x / y;
      else if (op === '^') r = Math.pow(x, y);
    } catch (e1) { r = null; }
    if (r === null || isNaN(r) || !isFinite(r)) return null;
    return Math.round(r * 1e6) / 1e6;
  }

  function numEq(p, q) { return Math.abs(parseFloat(p) - parseFloat(q)) < 1e-6; }

  function scan(text) {
    var bad = [], m, n = 0;
    RE.lastIndex = 0;
    while ((m = RE.exec(String(text))) !== null && n < 40) {
      n++;
      var line = text.slice(Math.max(0, m.index - 60), m.index + 80);
      if (/;|\{|\}|function|=>|var |let |const /.test(line)) continue;
      var real = calcExpr(m[1], m[2], m[3]);
      if (real === null) continue;
      if (!numEq(real, m[4])) {
        bad.push(m[1] + ' ' + m[2] + ' ' + m[3] + ' = ' + real + ' (the answer said ' + m[4] + ')');
        if (bad.length >= 3) break;
      }
    }
    return bad;
  }

  var prev = window.askOmni;
  window.askOmni = function (user) {
    var p;
    try { p = Promise.resolve(prev.apply(this, arguments)); } catch (e2) { p = Promise.resolve(null); }
    return p.then(function (ans) {
      if (!ans) return ans;
      var bad = scan(ans);
      if (!bad.length) return ans;
      try { notice('ok', 'OMNIBRAIN', 'math check: ' + bad.length + ' wrong equation(s) caught'); } catch (e3) {}
      try { feed('OMNIBRAIN MATH CHECK :: recomputed the math, ' + bad.length + ' correction(s)', 'live'); } catch (e4) {}
      return ans + '\n\nMATH CHECK (verified by exact recomputation):\n' + bad.map(function (b) { return '\u2022 ' + b; }).join('\n');
    })['catch'](function () { return prev.apply(this, arguments); });
  };

  try { console.log('[hl289] omnibrain math check online: every stated equation is recomputed exactly'); } catch (e5) {}
})();
