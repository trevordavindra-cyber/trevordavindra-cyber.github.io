/* ILLUMINATI upgrade 469 - EMAIL TRIAGE MODE (hl469)
   Frontier directive: an inbox where nobody waits blind. Nothing removed.
*/
(function () {
  if (window.__HL469) return; window.__HL469 = true;

  var RP = /\b(inbox zero|too many emails|email overload|triage my inbox|clear my inbox|unread emails)\b/i;
  var DIRECTIVE = "EMAIL TRIAGE RULE: when the asker faces inbox overload, sort into three piles in one pass: reply now (two minutes or less), needs a longer reply today, archive. Everything read-only (newsletters, notifications) gets archived or unsubscribed, not left unread. Start the longer replies by sending one-line acknowledgments so nobody is waiting blind. Never triage oldest-first if something from a real person sits unread; people beat promotions. Empty inbox is a state, not a goal: the win is nobody waiting on them without knowing when to expect an answer.";

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

  try { console.log('[hl469] email triage mode online: three piles in one pass, people beat promotions, acknowledgments first'); } catch (e3) {}
})();
