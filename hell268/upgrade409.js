/* ILLUMINATI upgrade 409 - PHISHING CHECK MODE (hl409)
   Frontier directive: a suspicious message gets its red flags spotted. Nothing removed.
*/
(function () {
  if (window.__HL409) return; window.__HL409 = true;

  var RP = /\b(is this (a )?(scam|phishing|fraud|legit)|should i click (this|that) (link|button)|suspicious (email|text|message|link)|is this email (real|fake)|scam check|can i trust (this|that) (email|text|sender)|got this (email|text|message) from)\b/i;
  var DIRECTIVE = "PHISHING CHECK RULE: when the asker shares a suspicious message, email, or link, name the specific red flags you can see: urgency and deadline pressure, payment or gift-card asks, mismatched sender domains, link text that differs from its destination, requests for codes or credentials, and too-good offers. Then give a verdict in one line: clear, likely scam, or unconfirmable, and the one safe next step (check the sender by another channel, never click the link, contact the company's real number). Never say a message is safe when you cannot verify its sender; say what could not be checked.";

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

  try { console.log('[hl409] phishing check mode online: red flags named, verdict, the safe next step'); } catch (e3) {}
})();
