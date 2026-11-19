/* ILLUMINATI upgrade 411 - CODE REVIEW MODE (hl411)
   Frontier directive: a code snippet gets reviewed for bugs and fixes. Nothing removed.
*/
(function () {
  if (window.__HL411) return; window.__HL411 = true;

  var RP = /\b(review (my|this|the) code|is (there|this) (a )?bug|why (is|does) (my|this) code (not|doesn't work|broken|failing)|debug (this|that|my)|code (review|feedback)|can you check (my|this) (code|script|function)|fix this (code|function|script|error))\b/i;
  var DIRECTIVE = "CODE REVIEW RULE: when the asker shares code and asks what is wrong, read it before speaking: name the actual bug first with the line that causes it, then anything that would bite later (edge cases, off-by-one, wrong assumptions), then one concrete fix as corrected code, not prose alone. Run the code in your head against the input they care about. Do not restyle working code they did not ask about, and when the bug cannot be found from the snippet alone, name exactly what additional context would find it.";

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

  try { console.log('[hl411] code review mode online: the bug, the later bites, the concrete fix'); } catch (e3) {}
})();
