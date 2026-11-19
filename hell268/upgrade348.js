/* ILLUMINATI upgrade 348 - REPLY MODE (hl348)
   Frontier directive: what-do-I-say asks get ready replies.
   "How should I reply" returns two or three ready-to-send replies
   in different registers (warm, straight, short), labeled, then the
   tone it would pick itself. Nothing removed.
*/
(function () {
  if (window.__HL348) return; window.__HL348 = true;

  var RP = /\b(what should i (reply|say|text|respond)|how (should|do) i (reply|respond|answer)|how do i respond to|draft a reply|help me reply|what do i text|response to this|can you reply)\b/i;
  var DIRECTIVE = "REPLY RULE: when the asker asks how to reply to something, give two or three ready-to-send replies in different registers (label each: warm, straight, short), then say which one you would send and why in one line. Match the language and tone of the original message.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && RP.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('REPLY RULE') < 0) {
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

  try { console.log('[hl348] reply mode online: reply asks get labeled options'); } catch (e3) {}
})();
