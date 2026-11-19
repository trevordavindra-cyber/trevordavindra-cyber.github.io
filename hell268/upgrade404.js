/* ILLUMINATI upgrade 404 - PRACTICE QUESTIONS MODE (hl404)
   Frontier directive: a topic gets quiz questions with answer keys. Nothing removed.
*/
(function () {
  if (window.__HL404) return; window.__HL404 = true;

  var RP = /\b(quiz me|practice questions|test me on|make (me )?(a )?(quiz|practice test|test)|practice problems|flash ?cards for|questions about (the|this) (chapter|unit|topic|lesson)|help me study .* (quiz|questions))\b/i;
  var DIRECTIVE = "PRACTICE QUESTIONS RULE: when the asker wants to be quizzed, give real questions at the level they name, one at a time or in a numbered set: three easy, two medium, one hard unless they say otherwise. After each answer key, explain why each wrong option is wrong, not just why the right one is right, and tie every question to the part of the material it tests. Never invent page numbers or chapter references; when the material is missing, ask what topic and level before writing questions.";

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

  try { console.log('[hl404] practice questions mode online: quiz sets, answer keys, wrong-option whys'); } catch (e3) {}
})();
