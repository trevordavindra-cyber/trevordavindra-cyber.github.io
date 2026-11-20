/* ILLUMINATI upgrade 503 - CODE MODE (hl503)
   Major capability: run code. Put a javascript block in your message (or say
   run this code) and the browser executes it, then the real output is fed to
   the AI. Nothing removed.
*/
(function () {
  if (window.__HL503) return; window.__HL503 = true;

  function extract(text) {
    var m = text.match(/```(?:js|javascript)?\s*([\s\S]*?)```/i);
    if (m && m[1].trim()) return m[1].trim();
    if (/\brun this code\b/i.test(text)) {
      var after = text.split(/```(?:js|javascript)?/i)[1];
      if (after) { after = after.split('```')[0]; if (after.trim()) return after.trim(); }
    }
    return null;
  }

  function run(code) {
    var out = [];
    function push() {
      try {
        var parts = Array.prototype.slice.call(arguments).map(function (x) {
          if (typeof x === 'string') return x;
          try { return JSON.stringify(x); } catch (e) { return String(x); }
        });
        out.push(parts.join(' '));
      } catch (e2) {}
    }
    var fake = { log: push, info: push, warn: push, error: push };
    try {
      var fn = Function('"use strict";var console=arguments[0];' + code);
      fn(fake);
      var s = out.join('\n');
      if (s.length > 2000) s = s.slice(0, 2000) + '\n[output truncated]';
      return s ? s : '[code ran with no printed output]';
    } catch (e) {
      var s2 = out.join('\n');
      return (s2 ? s2 + '\n' : '') + 'ERROR: ' + (e && e.message ? e.message : String(e));
    }
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
          var code = extract(last);
          if (code && code.length < 4000) {
            var result = run(code);
            var note = { role: 'system', content: 'CODE EXECUTION RESULT (this code was actually executed in this browser just now):\n' + result + '\n\nCODE RULE: base your answer on this real output. If the code errored, explain the error and the fix. Do not invent output you did not see here.' };
            var msgs = j.messages, added = false, touched = false;
            for (var k = 0; k < msgs.length; k++) {
              if (msgs[k] && msgs[k].role === 'user') { msgs.splice(k, 0, note); added = true; touched = true; break; }
            }
            if (!added) { msgs.push(note); touched = true; }
            if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
          }
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl503] code mode online: javascript blocks actually run and the output is used'); } catch (e3) {}
})();
