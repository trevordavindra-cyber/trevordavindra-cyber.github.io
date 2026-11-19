/* ILLUMINATI upgrade 400 - STUDY PLAN MODE (hl400)
   Frontier directive: a weeks-out exam gets a day-by-day study plan. Nothing removed.
*/
(function () {
  if (window.__HL400) return; window.__HL400 = true;

  var RP = /\b(study plan|study schedule|how (do|should) i study|revise for|revision plan|exam (is|in) (next week|two weeks|a month)|prepare for (the|my) (exam|test|final|midterm)|cramming schedule|study for the .*(exam|test|final))\b/i;
  var DIRECTIVE = "STUDY PLAN RULE: when the asker has an exam or test coming and asks how to prepare, build a day-by-day plan from the days they actually have: topics weighted by how much the exam covers them, the hardest topic early not the night before, a short daily review of yesterday before new material, and one full practice run in the last two days. Name what to deliberately skip when time runs short, and end with the one session most likely to slip and why. Never invent a syllabus; when the topic list is missing, ask for it before laying out days.";

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

  try { console.log('[hl400] study plan mode online: day-by-day blocks, skip list, slip point'); } catch (e3) {}
})();
