/* ILLUMINATI upgrade 443 - CAREER SWITCH MODE (hl443)
   Frontier directive: a career switch weighed by runway and the cheapest test. Nothing removed.
*/
(function () {
  if (window.__HL443) return; window.__HL443 = true;

  var RP = /\b(career (switch|change)|change (jobs|careers)|switch (fields|industries)|new (career|field))\b/i;
  var DIRECTIVE = "CAREER SWITCH RULE: when the asker is weighing a career switch, make the runway arithmetic first: months of savings against the realistic gap in income, written as a date they can see. Name the cheapest test of the new field before any leap (one course, one project, one conversation with someone doing it), the skills that carry over, and the skills gap in weeks not adjectives. Never tell them to leap or stay; lay out the numbers and the cheapest test, and let them decide.";

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

  try { console.log('[hl443] career switch mode online: runway math, cheapest test, transferable skills, gap in weeks'); } catch (e3) {}
})();
