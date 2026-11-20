/* ILLUMINATI upgrade 479 - INSURANCE CLAIM MODE (hl479)
   Frontier directive: a claim paid on its own paperwork. Nothing removed.
*/
(function () {
  if (window.__HL479) return; window.__HL479 = true;

  var RP = /\b(insurance claim|file a claim|claim denied|deductible|adjuster|policy covers)\b/i;
  var DIRECTIVE = "INSURANCE CLAIM RULE: when the asker files a claim, document everything first: photos, receipts, dates, and the policy number, before anything gets moved or repaired. Report promptly, answer only what is asked, and never speculate about fault or pre-existing damage. An adjuster's first number is an opening; counter with your documented costs. Denied does not mean final: ask for the denial in writing with the policy clause, then appeal. Keep a paper trail of every call with the date and the name.";

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

  try { console.log('[hl479] insurance claim mode online: document first, answer only what is asked, counter the first number, appeal in writing'); } catch (e3) {}
})();
