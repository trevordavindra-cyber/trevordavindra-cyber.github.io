/* ILLUMINATI upgrade 310 - SOURCE NOTES (hl310)
   Frontier directive: factual answers say where they come from.
   A factual answer ends with a short source line - where the fact
   comes from (general knowledge, memory, math, the user's own words,
   or an open relay). Unknowns stay flagged. Nothing removed.
*/
(function () {
  if (window.__HL310) return; window.__HL310 = true;

  var DIRECTIVE = 'SOURCE RULE: for factual answers, end with one short line starting "source:" naming where the facts come from (general knowledge, memory, math, the user\'s own words, or a public relay). Keep it to one line. Opinions, jokes, and pure creative writing skip it. If a fact is uncertain, say so in the source line instead of guessing.';

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) { j = null; }
        if (j && j.messages && j.messages.length) {
          var msgs = j.messages.slice(), touched = false;
          for (var s = 0; s < msgs.length; s++) {
            if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('SOURCE RULE') < 0) {
              msgs[s] = { role: 'system', content: msgs[s].content + '\n\n' + DIRECTIVE };
              touched = true; break;
            }
          }
          if (!touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl310] source notes online: factual answers carry a source line'); } catch (e3) {}
})();
