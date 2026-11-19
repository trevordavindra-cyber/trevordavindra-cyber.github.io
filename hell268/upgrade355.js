/* ILLUMINATI upgrade 355 - BOW OUT MODE (hl355)
   Frontier directive: how-do-I-get-out-of-this asks get a graceful
   exit line. Nothing removed.
*/
(function () {
  if (window.__HL355) return; window.__HL355 = true;

  var BO = /\b(get out of|back out of|cancel (the plans|my plans|it)|how do i (get out|say no|back out)|excuse to (leave|skip|miss|get out of)|get me out of|don'?t want to go|avoid going|turn down the (invite|invitation)|politely (decline|say no))\b/i;
  var DIRECTIVE = "BOW OUT RULE: when the asker wants out of something, give the exact line to send in their voice (honest, no fake excuses, no elaborate lies), then one shorter fallback line, then what to expect back and how to hold the line in one reply. Offer the soonest-date alternative only if it helps.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && BO.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('BOW OUT RULE') < 0) {
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

  try { console.log('[hl355] bow out mode online: getting-out asks get the exact line'); } catch (e3) {}
})();
