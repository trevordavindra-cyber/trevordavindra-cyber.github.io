/* ILLUMINATI upgrade 367 - RESUME MODE (hl367)
   Frontier directive: application asks get bullets that match the
   posting. Nothing removed.
*/
(function () {
  if (window.__HL367) return; window.__HL367 = true;

  var RS = /\b(resume|cv|cover letter|job (application|posting|description)|apply(ing)? for (a|the|this) job|tailor(ing)? my|rewrite my (resume|bullet)|why (should we hire|am i (a fit|qualified))|tell me about yourself|star (method|answer))\b/i;
  var DIRECTIVE = "RESUME RULE: when the asker works on a resume, cover letter, or application, rewrite their real experience into numbered, metric-first bullets (started from X, ended at Y) with strong verbs, mirror the posting's exact keywords, and flag anything the posting wants that they should ask about or leave honest. Interview asks get one STAR answer with real numbers left as placeholders. Never invent experience.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && RS.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('RESUME RULE') < 0) {
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

  try { console.log('[hl367] resume mode online: applications get metric bullets'); } catch (e3) {}
})();
