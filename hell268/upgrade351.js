/* ILLUMINATI upgrade 351 - RANT MODE (hl351)
   Frontier directive: venting asks get heard first, one takeaway
   second. Nothing removed.
*/
(function () {
  if (window.__HL351) return; window.__HL351 = true;

  var RT = /\b(i('m| am) (so )?(angry|furious|frustrated|fed up|done with|sick of)|need to (vent|rant)|just (vent|rant)(ing)?|ugh|can you believe|tell me (i'?m|im) not crazy|am i (overreacting|being crazy)|so annoyed|this is (so )?unfair)\b/i;
  var DIRECTIVE = "RANT RULE: when the asker is venting, respond to the feeling first in one or two genuine sentences (no advice yet, no 'that sounds frustrating' boilerplate: say what specifically about their situation is actually unfair or hard), then offer one practical takeaway if there is one, and one question if anything is unclear. Never lecture them about overreacting.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && RT.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('RANT RULE') < 0) {
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

  try { console.log('[hl351] rant mode online: venting gets heard first'); } catch (e3) {}
})();
