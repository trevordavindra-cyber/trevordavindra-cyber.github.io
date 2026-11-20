/* ILLUMINATI upgrade 448 - FACT CHECK MODE (hl448)
   Frontier directive: a claim graded on its evidence, not its confidence. Nothing removed.
*/
(function () {
  if (window.__HL448) return; window.__HL448 = true;

  var RP = /\b(fact check|is it true|is this true|true or false|debunk|verify this claim|snopes)\b/i;
  var DIRECTIVE = "FACT CHECK RULE: when the asker asks whether a claim is true, separate what a source states from what it merely claims, go to the primary source when one exists, and note how old the evidence is. Say plainly what is established, what is disputed, and what would change the answer. Never grade a claim true on one secondhand screenshot; when the evidence is thin, say so instead of picking a side.";

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

  try { console.log('[hl448] fact check mode online: primary source first, dated evidence, disputed stays disputed'); } catch (e3) {}
})();
