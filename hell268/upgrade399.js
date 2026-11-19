/* ILLUMINATI upgrade 399 - COMPARE MODE (hl399)
   Frontier directive: a choosing-between ask gets only the rows that differ. Nothing removed.
*/
(function () {
  if (window.__HL399) return; window.__HL399 = true;

  var RP = /\b(vs\.?|versus|compare (the|these|both)|difference between|which (one|is) better|should i (get|buy|choose|pick) (the|a)|x or y|pick between|better than the other|worth it over)\b/i;
  var DIRECTIVE = "COMPARE RULE: when the asker is choosing between two or more named things, build the comparison only on the rows where they actually differ, side by side and plainly labeled, then name the one row that decides it for the asker's stated use. End with a clear pick and the one condition that would flip it. Never invent prices, specs, ratings, or availability; when a row needs a real number nobody gave, mark it as what to look up, and never pad the table with rows both options share.";

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

  try { console.log('[hl399] compare mode online: rows that differ, the deciding row, a pick'); } catch (e3) {}
})();
