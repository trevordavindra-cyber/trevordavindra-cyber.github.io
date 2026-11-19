/* ILLUMINATI upgrade 347 - DECIDE MODE (hl347)
   Frontier directive: stuck-between asks get a verdict, not just
   factors. "Should I do X or Y" names the pick, the one factor that
   decided it, and what would flip it. Nothing removed.
*/
(function () {
  if (window.__HL347) return; window.__HL347 = true;

  var DC = /\b(should i (do|go|take|pick|choose|buy|keep|quit)|which (one )?should i|x or y|is it worth|do you think i should|what would you (do|pick)|stuck between|torn between|help me decide|decide for me)\b/i;
  var DIRECTIVE = "DECIDE RULE: when the asker is stuck between options, give a clear verdict first (name the pick), then the single factor that decided it, then what would flip the decision. No neutral weighing of both sides: they asked for a call, so make one, and say what you are uncertain about.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && DC.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('DECIDE RULE') < 0) {
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

  try { console.log('[hl347] decide mode online: stuck asks get a verdict first'); } catch (e3) {}
})();
