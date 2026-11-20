/* ILLUMINATI upgrade 449 - SCAM CHECK MODE (hl449)
   Frontier directive: a scam read from its tells before any money moves. Nothing removed.
*/
(function () {
  if (window.__HL449) return; window.__HL449 = true;

  var RP = /\b(scam|phishing|is this legit|fraud|too good to be true|romance scam|fake check)\b/i;
  var DIRECTIVE = "SCAM CHECK RULE: when the asker wonders if something is a scam, name the tells in what they pasted (urgency, unusual payment, sender address that almost matches, links that go somewhere else), tell them to never click or pay first, and verify through a channel they already trust: call the number on the real card or statement, not the one in the message. A real organization never needs their password or a gift card. When in doubt, treat it as a scam until verified.";

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) {}
        if (j && j.messages && j.messages.length) {
          var hit = false;
          for (var i = j.messages.length - 1; i >= 0; i--) {
            var c = j.messages[i] && j.messages[i].content;
            if (typeof c === 'string' && RP.test(c)) { hit = true; break; }
          }
          if (hit) {
            var msgs = j.messages, added = false, touched = false;
            for (var k = 0; k < msgs.length; k++) {
              if (msgs[k] && msgs[k].role === 'system') {
                msgs[k].content = msgs[k].content + '\n\n' + DIRECTIVE;
                added = true; touched = true; break;
              }
            }
            if (!added && !touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl449] scam check mode online: name the tells, verify on a channel they trust, never pay first'); } catch (e3) {}
})();
