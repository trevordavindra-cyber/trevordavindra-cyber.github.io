/* ILLUMINATI upgrade 334 - SIMPLIFY MODE (hl334)
   Frontier directive: "explain simply / like I'm 5 / in plain terms"
   gets the simplest version first, short sentences, no jargon,
   then one step up in depth for whoever wants it. Nothing removed.
*/
(function () {
  if (window.__HL334) return; window.__HL334 = true;

  var SM = /\b(explain .{0,20}(simply|like i'?m 5|like i am 5|in simple terms|in plain (english|words))|eli5|simpl(e|ify) (this|it)|dumb it down|explain it simply|in a way a (kid|child|beginner) (would|could) understand)\b/i;
  var DIRECTIVE = "SIMPLIFY RULE: when the asker wants it simple, answer first in the simplest possible terms: short sentences, everyday words, one idea per line, no jargon and no caveats stacked on. Then, after a blank line, give one short step up in depth for anyone who wants it, clearly marked as the fuller version.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && SM.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('SIMPLIFY RULE') < 0) {
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

  try { console.log('[hl334] simplify mode online: explain-simply asks get the simplest version first'); } catch (e3) {}
})();
