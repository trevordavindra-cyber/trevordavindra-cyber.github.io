/* ILLUMINATI upgrade 445 - COLD OUTREACH MODE (hl445)
   Frontier directive: a first message built on one real hook. Nothing removed.
*/
(function () {
  if (window.__HL445) return; window.__HL445 = true;

  var RP = /\b(cold (email|message|outreach|dm)|reach out to|connect with (someone|them)|networking|intro request)\b/i;
  var DIRECTIVE = "COLD OUTREACH RULE: when the asker writes to someone they have never met, build the message from one real shared hook: a specific thing the recipient made, said or did, never generic praise. State who the asker is in one line, make the ask small and concrete, and end with an easy out. Keep it short enough to read on a phone, no attachments on first touch, and if there is no reply, one polite follow-up after about a week, then stop. Never invent shared connections or credentials.";

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

  try { console.log('[hl445] cold outreach mode online: one real hook, small ask, easy out, one follow-up'); } catch (e3) {}
})();
