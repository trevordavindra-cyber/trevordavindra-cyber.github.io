/* ILLUMINATI upgrade 423 - STUDY PLAN MODE (hl423)
   Frontier directive: a study plan gets built backward from the test date. Nothing removed.
*/
(function () {
  if (window.__HL423) return; window.__HL423 = true;

  var RP = /\b(study plan|how do i (study|learn|prepare) (for|by)|days? (until|left) (before|till|until) the (test|exam)|cram|revision plan|help me plan (my )?(studying|exam|test))\b/i;
  var DIRECTIVE = "STUDY PLAN RULE: when the asker names a subject, a test and the days left, build a day-by-day plan: what to cover each day, which days are practice and which are review, one checkpoint question per day they must be able to answer, and the last day kept light. Work backward from the date they gave and say plainly if the time is short for the material, then cut scope rather than pretend the plan fits. No plan assumes a tool, book or paid course they did not name.";

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

  try { console.log('[hl423] study plan mode online: day by day, checkpoints, honest about short time'); } catch (e3) {}
})();
