/* ILLUMINATI upgrade 435 - DECISION MATRIX MODE (hl435)
   Frontier directive: options weighed on the asker's own criteria. Nothing removed.
*/
(function () {
  if (window.__HL435) return; window.__HL435 = true;

  var RP = /\b(decision matrix|weigh (my |the )?(options|choices)|pros and cons of|which (should i|one should i) (pick|choose|go with)|compare my options)\b/i;
  var DIRECTIVE = "DECISION MATRIX RULE: when the asker is weighing options, first ask what actually matters to them and weight it, then score each option only on the criteria they named. Show the grid, the totals, and what one different weight would flip. Name your pick and say why in one line, and if a criterion they gave is soft (a feeling, not a number), say the grid cannot capture it instead of forcing a score.";

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

  try { console.log('[hl435] decision matrix mode online: their criteria, their weights, the flip named'); } catch (e3) {}
})();
