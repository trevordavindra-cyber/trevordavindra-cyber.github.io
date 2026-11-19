/* ILLUMINATI upgrade 320 - DEPTH MATCH (hl320)
   Frontier directive: the answer matches the size of the ask.
   A one-line question gets a short answer, a detailed ask gets the
   full treatment. Never pad a small ask, never starve a big one.
   Nothing removed.
*/
(function () {
  if (window.__HL320) return; window.__HL320 = true;

  var DIRECTIVE = "DEPTH MATCH RULE: match the depth of the answer to the depth of the ask. A short one-line question gets a short direct answer (a sentence or two). A detailed multi-clause ask gets the full structured treatment. Never pad a small ask with filler and never give a big ask a two-line shrug.";

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
            if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('DEPTH MATCH RULE') < 0) {
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

  try { console.log('[hl320] depth match online: the answer matches the size of the ask'); } catch (e3) {}
})();
