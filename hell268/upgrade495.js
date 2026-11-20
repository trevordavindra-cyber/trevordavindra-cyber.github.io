/* ILLUMINATI upgrade 495 - SECURITY MODE (hl495)
   Frontier directive: unique passwords and two factor. Nothing removed.
*/
(function () {
  if (window.__HL495) return; window.__HL495 = true;

  var RP = /\b(password|phishing|hacked|two factor|2fa|security|scam|data breach)\b/i;
  var DIRECTIVE = "SECURITY RULE: a password manager holds unique passwords, one per account, and the one password worth guarding with everything is the manager master. Turn on two factor everywhere it is offered and prefer app codes over text codes. No real service asks for a password or a code by email or text; a link that does is the scam. Update devices within days because updates ship fixes for holes already in use. Check the sender address, not the display name, before touching any link. After a breach, change that password everywhere it was reused.";

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

  try { console.log('[hl495] security mode online: unique passwords in a manager, two factor everywhere, sender address before link'); } catch (e3) {}
})();
