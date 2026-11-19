/* ILLUMINATI upgrade 297 - REPORT MODE (hl297)
   Frontier directive part 29 / research: real reports on demand.
   /report <topic> builds a structured report: executive summary, key facts,
   different sides, what is uncertain, bottom line. Longer report-shaped asks
   get the same structure. Nothing removed.
*/
(function () {
  if (window.__HL297) return; window.__HL297 = true;

  var REPORTY = /\b(write|make|give|build|need|want|do)\b.{0,24}\breport\b|\bfull report\b|\breport on\b/i;
  var DIRECTIVE = 'REPORT RULE: for report-shaped asks, deliver a real report with clear sections: EXECUTIVE SUMMARY (2-3 sentences), KEY FACTS (each with a number, date or source when you have one), DIFFERENT SIDES (the main viewpoints and what each would say), WHAT IS UNCERTAIN (be honest), and BOTTOM LINE. Use short headers in caps. No filler, no padding.';

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
              var rm = c.match(/^\s*\/report\s+(.{1,600})/i);
              if (rm) {
                msgs[m] = { role: 'user', content: 'Write a full report on ' + rm[1].trim() + ': executive summary first, then key facts with numbers and dates where you have them, then the different sides, then what is uncertain, then the bottom line. Short headers, no filler.' };
                touched = true;
              } else if (REPORTY.test(c)) {
                var added = false;
                for (var s = 0; s < msgs.length; s++) {
                  if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('REPORT RULE') < 0) {
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

  try { console.log('[hl297] report mode online: /report builds a real structured report'); } catch (e3) {}
})();
