/* ILLUMINATI upgrade 327 - SUGGEST MODE (hl327)
   Frontier directive: recommendation asks get picks, not a listicle.
   "What should I watch/eat/read/play" gets two or three concrete
   picks, each named with one line on why it fits what the asker
   said, and a straight pick among them. Nothing removed.
*/
(function () {
  if (window.__HL327) return; window.__HL327 = true;

  var SG = /\b(what (should|can|shall) i (watch|eat|read|play|listen|cook|drink|buy|do)|recommend( me)? |suggestion(s)? for|any (good|ideas for)|give me something to)\b/i;
  var DIRECTIVE = "SUGGEST RULE: when the asker wants a recommendation, give two or three concrete named picks, each with one line on why it fits what they said, then say which one you would pick and why in one clause. No generic listicles, no 'it depends' without an actual pick.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && SG.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('SUGGEST RULE') < 0) {
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

  try { console.log('[hl327] suggest mode online: recommendation asks get picks with a verdict'); } catch (e3) {}
})();
