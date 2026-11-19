/* ILLUMINATI upgrade 343 - TEACH MODE (hl343)
   Frontier directive: learn asks get a real lesson.
   "Teach me X", "explain X like a tutor" starts from first
   principles, builds in numbered layers, and ends with one check
   question the asker answers before moving on. Nothing removed.
*/
(function () {
  if (window.__HL343) return; window.__HL343 = true;

  var TM = /\b(teach me|teach me about|help me learn|learn (about|how)|tutor me|walk me through (the basics|learning)|i want to understand|make me understand)\b/i;
  var DIRECTIVE = "TEACH RULE: when the asker wants to learn something, build a real lesson: start from first principles, layer it in numbered steps from simplest to fullest, use one concrete example per step, and end with one check question they answer before going deeper. Do not dump the whole topic at once.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && TM.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('TEACH RULE') < 0) {
                  msgs[s] = { role: 'system', content: msgs[s].content + '\n\n' + DIRECTIVE };
                  added = true; touched = true; break;
                }
              }
              if (!added && !touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
              break;
            }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl343] teach mode online: learn asks get a layered lesson'); } catch (e3) {}
})();
