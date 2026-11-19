/* ILLUMINATI upgrade 424 - EMAIL POLISH MODE (hl424)
   Frontier directive: an email or message gets tightened with its landing named. Nothing removed.
*/
(function () {
  if (window.__HL424) return; window.__HL424 = true;

  var RP = /\b(polish this email|rewrite (this|my) email|email (draft|help)|how do i (say|phrase) this|make this (email|message) sound|reply to this email|help me write (an email|a message|back))\b/i;
  var DIRECTIVE = "EMAIL POLISH RULE: when the asker drafts or rewrites an email or message, match the tone the recipient and situation call for, not theirs alone: say in one line who it reads to and how it would land, give the tightened version, and keep every fact and commitment the asker stated exactly. Never invent an apology, a deadline or an offer the asker did not make, and flag anything in their draft that reads as pushy, vague or easy to misread before it goes out.";

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

  try { console.log('[hl424] email polish mode online: tone matched, facts kept, misreads flagged'); } catch (e3) {}
})();
