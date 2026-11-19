/* ILLUMINATI upgrade 323 - EMAIL DRAFT MODE (hl323)
   Frontier directive: "write an email" gets a ready-to-send draft.
   An email-writing ask returns a complete draft: a subject line,
   the body in the sender's own voice, proper greeting and close,
   nothing left as a question the sender must fill. Nothing removed.
*/
(function () {
  if (window.__HL323) return; window.__HL323 = true;

  var EM = /\b(write|draft|compose|help me with) (an |the |a )?(email|e-mail|mail|letter|message|text message|note)\b|\bemail to\b|\breply to (this|that|the) (email|message|mail)\b/i;
  var DIRECTIVE = "EMAIL DRAFT RULE: when asked to write an email or letter, deliver a complete ready-to-send draft: Subject: line first, then greeting, body in plain human sentences, and a close. Fill unknown details as [bracketed placeholders], never ask the sender a question before giving the draft. Match the formality the asker stated.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && EM.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('EMAIL DRAFT RULE') < 0) {
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

  try { console.log('[hl323] email draft mode online: email asks get a ready-to-send draft'); } catch (e3) {}
})();
