/* ILLUMINATI upgrade #248: hl248-databrain (v19.150)
   THE ASK: make the AI smarter with data analytics.
   A real stats engine, computed in the browser, not guessed by the model.
   When the user's message carries numbers (a table, a list of readings,
   anything numeric) the upgrade computes exact statistics locally and
   hands them to the model as ground truth, so every data answer uses
   true math:
     count, sum, mean, median, min, max, spread (stdev), the trend
     (first-half mean vs second-half mean with direction), outliers
     (more than 2 standard deviations from the mean), and a unicode
     sparkline of the series.
   The model is told to use these exact figures and, when a chart helps,
   to draw it as a code block.
   Triggers on 8+ numbers in the message, or 4+ numbers plus an
   analytics word (analyze, average, trend, mean, median, stats, chart,
   graph, spread, outlier, variance, data). Standalone 4-digit years are
   dropped so dates don't pollute the series.
   Rides the outgoing request body directly, so it works with or without
   a research pass running, and coexists with hl245/246/247.
   Guard: __HL248 */
(function () {
  if (window.__HL248) return; window.__HL248 = true;

  var AN_RE = /\b(analy[sz]e|analy[sz]is|average|mean\b|median|trend|stats|statistics|chart|graph|spread|outlier|variance|percent|growth|data)\b/i;
  var BARS = ['▁','▂','▃','▄','▅','▆','▇','█'];

  function sparkline(vals) {
    var n = Math.min(vals.length, 24), step = vals.length / n, out = '';
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), span = (hi - lo) || 1;
    for (var i = 0; i < n; i++) {
      var a = Math.round(i * step), b = Math.max(a + 1, Math.round((i + 1) * step));
      var slice = vals.slice(a, b);
      var m = slice.reduce(function (x, y) { return x + y; }, 0) / slice.length;
      out += BARS[Math.max(0, Math.min(7, Math.round((m - lo) / span * 7)))];
    }
    return out;
  }

  function stats(text) {
    var t = String(text || '');
    t = t.replace(/(^|\D)(19|20)\d{2}(?=\D|$)/g, '$1 ');
    var m = t.match(/-?\d+(?:\.\d+)?/g) || [];
    var v = m.map(parseFloat).filter(function (x) { return isFinite(x); });
    if (v.length < 4) return null;
    var n = v.length, sum = 0, i;
    for (i = 0; i < n; i++) sum += v[i];
    var mean = sum / n;
    var s = v.slice().sort(function (a, b) { return a - b; });
    var median = (n % 2) ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
    var min = s[0], max = s[n - 1];
    var sq = 0;
    for (i = 0; i < n; i++) sq += (v[i] - mean) * (v[i] - mean);
    var sd = Math.sqrt(sq / n);
    var half = Math.floor(n / 2);
    var h1 = 0, h2 = 0, j;
    for (j = 0; j < half; j++) h1 += v[j];
    for (j = half; j < n; j++) h2 += v[j];
    h1 = half ? h1 / half : mean;
    h2 = (n - half) ? h2 / (n - half) : mean;
    var trend = 'flat';
    if (sd > 0 && Math.abs(h2 - h1) > 0.15 * sd) trend = (h2 > h1 ? 'rising' : 'falling');
    var outs = [];
    if (sd > 0) for (i = 0; i < n; i++) if (Math.abs(v[i] - mean) > 2 * sd) outs.push(v[i]);
    return {
      n: n, sum: sum, mean: mean, median: median, min: min, max: max, sd: sd,
      h1: h1, h2: h2, trend: trend, outs: outs, spark: sparkline(v), vals: v
    };
  }

  function fmt(x) {
    if (!isFinite(x)) return String(x);
    return String(Math.round(x * 100) / 100);
  }

  function block(st) {
    var b = '\n\nDATA ANALYSIS - computed in the browser from the numbers in this message. These figures are exact; use them instead of estimating:\n'
      + 'count=' + st.n + ', sum=' + fmt(st.sum) + ', mean=' + fmt(st.mean) + ', median=' + fmt(st.median)
      + ', min=' + fmt(st.min) + ', max=' + fmt(st.max) + ', spread (stdev)=' + fmt(st.sd)
      + ', first half mean=' + fmt(st.h1) + ' vs second half mean=' + fmt(st.h2) + ' (trend: ' + st.trend + ')'
      + (st.outs.length ? ', outliers (>2 stdev from mean): ' + st.outs.slice(0, 8).map(fmt).join(', ') : ', no outliers beyond 2 stdev')
      + '\nshape of the series: ' + st.spark
      + '\nWhen a chart would help, draw it as a plain code block from these figures. Do not recompute these numbers and get a different answer; these are the real ones.';
    return b;
  }

  function arm(u, init) {
    var b = null, q = '', lastUser = -1;
    try { b = JSON.parse(init.body); } catch (e2) { return of2(u, init); }
    for (var i = (b.messages || []).length - 1; i >= 0; i--) {
      if (b.messages[i] && b.messages[i].role === 'user' && typeof b.messages[i].content === 'string') { q = b.messages[i].content; lastUser = i; break; }
    }
    if (!q || q.indexOf('DATA ANALYSIS') >= 0) return of2(u, init);
    var nums = (q.replace(/(^|\D)(19|20)\d{2}(?=\D|$)/g, '$1 ').match(/-?\d+(?:\.\d+)?/g) || []).length;
    if (!(nums >= 8 || (nums >= 4 && AN_RE.test(q)))) return of2(u, init);
    var st = stats(q);
    if (!st) return of2(u, init);
    b.messages[lastUser].content += block(st);
    init.body = JSON.stringify(b);
    try { console.log('[hl248] data brain: ' + st.n + ' numbers, mean ' + fmt(st.mean) + ', trend ' + st.trend + (st.outs.length ? ', ' + st.outs.length + ' outlier(s)' : '')); } catch (e3) {}
    return of2(u, init);
  }

  var of2 = window.fetch;
  window.fetch = function (u, init) {
    try {
      var url = (typeof u === 'string') ? u : (u && u.url) || '';
      if (/pollinations\.ai|aihorde\.ai/.test(url) && init && init.method && String(init.method).toUpperCase() === 'POST' && typeof init.body === 'string') {
        return arm(u, init);
      }
    } catch (e) {}
    return of2.apply(this, arguments);
  };

  console.log('[hl248] online: data brain on (exact stats computed in browser: mean, median, spread, trend, outliers, sparkline)');
})();
