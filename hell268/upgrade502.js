/* ILLUMINATI upgrade 502 - CALC ENGINE (hl502)
   Major capability: exact math. When the message holds an arithmetic problem,
   the browser computes it for real and the verified result is fed to the AI.
   Nothing removed.
*/
(function () {
  if (window.__HL502) return; window.__HL502 = true;

  var NUM_RE = /[-+(]?\s*\d+(?:\.\d+)?(?:\s*[-+*/^xX×÷%]\s*[-+(]?\s*\d+(?:\.\d+)?\s*[-+*/^xX×÷%]?)*\s*\)?/;

  function calc(expr) {
    expr = expr.replace(/[xX×]/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');
    if (!/^[\d+\-*/().% ]+$/.test(expr)) return null;
    if (!/\d/.test(expr)) return null;
    try {
      var v = Function('"use strict";return (' + expr + ')')();
      if (typeof v !== 'number' || !isFinite(v)) return null;
      var s = (Math.round(v * 1e10) / 1e10).toString();
      return { expr: expr.replace(/\*\*/g, '^').replace(/\*/g, ' × ').replace(/\//g, ' ÷ ').replace(/\s+/g, ' ').trim(), val: s };
    } catch (e) { return null; }
  }

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) {}
        if (j && j.messages && j.messages.length) {
          var last = '';
          for (var i = j.messages.length - 1; i >= 0; i--) {
            if (j.messages[i] && j.messages[i].role === 'user' && typeof j.messages[i].content === 'string') { last = j.messages[i].content; break; }
          }
          if (last.length < 600) {
            var m = last.match(NUM_RE);
            if (m) {
              var r = calc(m[0]);
              if (r) {
                var note = { role: 'system', content: 'CALCULATOR RESULT (computed exactly in this browser, not estimated): ' + r.expr + ' = ' + r.val + '\n\nCALC RULE: give this verified number as the answer to the math in the message. If the message asks for something the plain expression does not cover, say what you computed and what is still open.' };
                var msgs = j.messages, added = false, touched = false;
                for (var k = 0; k < msgs.length; k++) {
                  if (msgs[k] && msgs[k].role === 'user') { msgs.splice(k, 0, note); added = true; touched = true; break; }
                }
                if (!added) { msgs.push(note); touched = true; }
                if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
              }
            }
          }
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl502] calc engine online: arithmetic is computed for real before the answer'); } catch (e3) {}
})();
