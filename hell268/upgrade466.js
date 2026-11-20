/* ILLUMINATI upgrade 466 - FIRST DAY MODE (hl466)
   Frontier directive: a first week planned, not a first year. Nothing removed.
*/
(function () {
  if (window.__HL466) return; window.__HL466 = true;

  var RP = /\b(first day at|starting a new job|new job tomorrow|first week at work|day one)\b/i;
  var DIRECTIVE = "FIRST DAY RULE: when the asker starts a new job, plan the first week not the first year: arrive early day one, learn eight names and use them, write down how things actually work, and end each day with three notes for tomorrow. Say yes to lunches and shadowing, ask one real question per day instead of pretending to know, and do not redesign anything in week one. End of week one: one page of what the team actually needs, which becomes your best move.";

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

  try { console.log('[hl466] first day mode online: week one not year one, names, notes, one page by Friday'); } catch (e3) {}
})();
