/* ILLUMINATI upgrade 352 - CODE READ MODE (hl352)
   Frontier directive: pasted code gets a plain-English read of what
   it does, then anything wrong. Nothing removed.
*/
(function () {
  if (window.__HL352) return; window.__HL352 = true;

  var CR = /\b(what does this (code|script|function) do|read this code|explain this code|what('s| is) wrong with this (code|script|function)|debug this|why (isn't|doesnt|doesn't|is not|does not) this (code|script|work)|this code (is broken|doesn't work|doesnt work))\b/i;
  var DIRECTIVE = "CODE READ RULE: when the asker pastes code, first say in plain English what the code does overall (one or two sentences), then walk the parts that matter, then anything wrong or risky with the exact line it is on and the fix. No line-by-line lecture when a short read answers it.";

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) { j = null; }
        if (j && j.messages && j.messages.length) {
          var msgs = j.messages.slice(), touched = false;
          for (var m = msgs.length - 1; m >= 0; m--) {
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && CR.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('CODE READ RULE') < 0) {
                  msgs[s] = { role: 'system', content: msgs[s].content + '\n\n' + DIRECTIVE };
                  added = true; touched = true; break;
                }
              }
              if (!added && !touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
              break;
            }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl352] code read mode online: code asks get a plain read first'); } catch (e3) {}
})();
