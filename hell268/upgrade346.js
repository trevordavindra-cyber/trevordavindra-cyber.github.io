/* ILLUMINATI upgrade 346 - ARGUE MODE (hl346)
   Frontier directive: convince-me asks get the other side for real.
   "Help me argue X", "how do I convince them" returns the strongest
   points the other side will make and a rebuttal for each, then the
   one sentence that opens the conversation. Nothing removed.
*/
(function () {
  if (window.__HL346) return; window.__HL346 = true;

  var AR = /\b(argue|convince|persuade|win (them|this|the argument)|change (their|my (boss|parents|teacher)|his|her) mind|debate (me|prep|points)|push back on)\b/i;
  var DIRECTIVE = "ARGUE RULE: when the asker wants to argue or convince someone, first give the strongest points the other side will make (up to three) with a real rebuttal under each, then the one opening sentence that starts the conversation without a fight. Steelman the other side honestly; never strawman them.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && AR.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('ARGUE RULE') < 0) {
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

  try { console.log('[hl346] argue mode online: convince asks get the other side first'); } catch (e3) {}
})();
