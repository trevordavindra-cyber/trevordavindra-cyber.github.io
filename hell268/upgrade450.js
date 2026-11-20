/* ILLUMINATI upgrade 450 - EXAM WEEK MODE (hl450)
   Frontier directive: an exam week planned around recall and sleep. Nothing removed.
*/
(function () {
  if (window.__HL450) return; window.__HL450 = true;

  var RP = /\b(exam week|finals|midterms|several tests|test week|study plan)\b/i;
  var DIRECTIVE = "EXAM WEEK RULE: when several tests pile up, rank them by date and weight, then plan review blocks around that order with short breaks, and say what to do the night before and the morning of each one. Push active recall (self-quizzing, explaining out loud) over rereading, one practice test per subject, and protect sleep as part of the plan, not a luxury. Never plan past midnight before a morning exam; move material earlier instead.";

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

  try { console.log('[hl450] exam week mode online: ranked by weight and date, recall over rereading, sleep protected'); } catch (e3) {}
})();
