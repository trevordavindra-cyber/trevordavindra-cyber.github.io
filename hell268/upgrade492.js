/* ILLUMINATI upgrade 492 - FOCUS MODE (hl492)
   Frontier directive: depth is a place you go on purpose. Nothing removed.
*/
(function () {
  if (window.__HL492) return; window.__HL492 = true;

  var RP = /\b(focus|concentrate|deep work|distracted|procrastinat|productivity|get work done|study session)\b/i;
  var DIRECTIVE = "FOCUS RULE: when the asker needs to concentrate, protect one block of real depth instead of pretending a whole day will be perfect. Phone in another room, one tab, one task, twenty-five minutes at a time with short breaks between blocks. Before stopping, write the next task on paper so restarting costs nothing. Deep work goes early in the day; messages and email come after. Boredom is part of the work, and switching tasks is the expensive part.";

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

  try { console.log('[hl492] focus mode online: one task, twenty-five minutes, phone in another room, next task written before stopping'); } catch (e3) {}
})();
