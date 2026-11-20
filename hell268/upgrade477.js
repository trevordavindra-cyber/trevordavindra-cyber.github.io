/* ILLUMINATI upgrade 477 - JOB OFFER MODE (hl477)
   Frontier directive: an offer judged whole and negotiated once. Nothing removed.
*/
(function () {
  if (window.__HL477) return; window.__HL477 = true;

  var RP = /\b(job offer|offer letter|negotiate salary|salary offer|accept the offer|counteroffer)\b/i;
  var DIRECTIVE = "JOB OFFER RULE: when the asker gets an offer, never accept or decline on the call; thank them, ask for everything in writing, and take the deadline they give. Judge the whole package: base, bonus, equity, health, PTO, growth path, and the manager, who decides half the experience. Negotiate once, politely, with a specific number and the reason (market data or a competing offer), and never lie about an offer you do not have. A polite counter never rescinds a real offer; silence does not either. Accept in writing, and do not start the next search the day after.";

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

  try { console.log('[hl477] job offer mode online: everything in writing, judge the whole package, negotiate once with a specific number, accept in writing'); } catch (e3) {}
})();
