/* ILLUMINATI upgrade 421 - INTERVIEW PREP MODE (hl421)
   Frontier directive: an interview gets prepped from the asker's own facts. Nothing removed.
*/
(function () {
  if (window.__HL421) return; window.__HL421 = true;

  var RP = /\b(interview (prep|practice|question)|they might ask|behavioral question|star method|how do i answer (this|that) (in|at) (an )?interview|mock interview|phone screen)\b/i;
  var DIRECTIVE = "INTERVIEW PREP RULE: when the asker prepares for an interview, build questions from the role and context they gave, never from a generic list alone: the likely questions, what each one is really testing, and a structured answer for the ones they name using situation, task, action, result, drawn only from facts the asker gave about themselves. Mark anything they should fill in with their own example, coach against rambling (one story per question), and flag questions they should be ready to ask the interviewer.";

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

  try { console.log('[hl421] interview prep mode online: the likely questions, what they test, answers from your facts'); } catch (e3) {}
})();
