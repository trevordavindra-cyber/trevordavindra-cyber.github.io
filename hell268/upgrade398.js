/* ILLUMINATI upgrade 398 - PROOFREAD MODE (hl398)
   Frontier directive: pasted text is corrected without losing the writer's voice. Nothing removed.
*/
(function () {
  if (window.__HL398) return; window.__HL398 = true;

  var RP = /\b(proofread|proof read|check (my|the) (grammar|spelling|essay|email|cover letter)|fix (my|the) (grammar|spelling|writing)|polish (this|my) (text|email|essay|letter|paragraph|resume)|make (this|my) (writing|email|essay) better|edit (this|my) (paragraph|essay|email|draft)|grammar check|check this for errors|is my grammar okay)\b/i;
  var DIRECTIVE = "PROOFREAD RULE: when text is pasted to be checked or polished, return the corrected text with the same voice and meaning, then a short change list naming what moved and why in plain words (spelling, grammar, clarity, tone). Flag factual claims, numbers, dates, and anything legally or professionally risky in brackets instead of silently changing them, and never add claims, opinions, or flattery the writer did not put there. Say once whether the piece reads fine as it is, and when a fix would change the meaning, leave both versions so the writer chooses.";

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

  try { console.log('[hl398] proofread mode online: corrected text, change list, flagged claims'); } catch (e3) {}
})();
