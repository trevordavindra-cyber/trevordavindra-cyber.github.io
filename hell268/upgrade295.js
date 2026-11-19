/* ILLUMINATI upgrade 295 - TUTOR MODE (hl295)
   Frontier directive part 16: educational intelligence.
   Learning asks now get real teaching: small steps, one idea per step, a
   real example for each, practice questions at the end, level matched to
   the person. /teach <topic> turns into a full structured lesson.
   Nothing removed.
*/
(function () {
  if (window.__HL295) return; window.__HL295 = true;

  var LEARN = /\b(explain|teach|how does|how do|what is|why does|why is|tutor|homework|study|learn|lesson|help me understand|eli5)\b/i;
  var DIRECTIVE = 'TUTOR RULE: when the ask is about learning something, teach it instead of just answering: plain words, small steps, one idea per step, a concrete example for every big idea, and end with 2 quick practice questions WITH answers. Match the person: if they sound young, unsure, or the question is basic, go simpler and skip jargon; if they sound advanced, skip the basics and go deeper. Never sacrifice accuracy for simplicity.';

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) { j = null; }
        if (j && j.messages && j.messages.length) {
          var msgs = j.messages.slice(), touched = false;
          for (var m = msgs.length - 1; m >= 0; m--) {
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string') {
              var c = msgs[m].content;
              var tm = c.match(/^\s*\/teach\s+(.{1,600})/i);
              if (tm) {
                msgs[m] = { role: 'user', content: 'Teach me ' + tm[1].trim() + ' as a full lesson: explain it step by step in plain words with a real example for every big idea, then quiz me with 5 questions and give the answers at the end.' };
                touched = true;
              }
              if (LEARN.test(msgs[m].content)) {
                var added = false;
                for (var s = 0; s < msgs.length; s++) {
                  if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('TUTOR RULE') < 0) {
                    msgs[s] = { role: 'system', content: msgs[s].content + '\n\n' + DIRECTIVE };
                    added = true; touched = true; break;
                  }
                }
                if (!added && !touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
              }
              break;
            }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl295] tutor mode online: learning asks get real lessons, /teach runs a full lesson'); } catch (e3) {}
})();
