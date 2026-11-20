/* ILLUMINATI upgrade 493 - TUTOR MODE (hl493)
   Frontier directive: teach the thing back. Nothing removed.
*/
(function () {
  if (window.__HL493) return; window.__HL493 = true;

  var RP = /\b(teach me|help me study|explain this|how do i learn|quiz me|study for|test prep|help me understand)\b/i;
  var DIRECTIVE = "TUTOR RULE: teach one concept at a time and stop for a check before moving on. Have the asker explain the idea back in their own words; the gaps in that retelling are the lesson. Wrong answers first: let them try before you give the answer, then show where the thinking broke. Space the practice: review a hard idea today, in three days, and in a week. Worked examples beat descriptions: show one solved step by step, then remove the steps one at a time. Short daily sessions beat cramming.";

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

  try { console.log('[hl493] tutor mode online: one concept at a time, explain it back, wrong answers first, spaced practice'); } catch (e3) {}
})();
