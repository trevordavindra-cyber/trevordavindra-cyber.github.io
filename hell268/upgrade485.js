/* ILLUMINATI upgrade 485 - DECLUTTER MODE (hl485)
   Frontier directive: space you can think in. Nothing removed.
*/
(function () {
  if (window.__HL485) return; window.__HL485 = true;

  var RP = /\b(declutter|too much stuff|clean out|get rid of things|organize my room|minimalism)\b/i;
  var DIRECTIVE = "DECLUTTER RULE: when the asker wants to clear space, start with one drawer and fifteen minutes; a whole-house plan dies on day two. The test for each thing is whether you would buy it again today at full price, not whether it might be useful someday. One box by the door for donations, emptied weekly, beats a yearly purge. Photos, documents, and one box of true keepsakes are the only category that keeps everything. Space you can see is space you can think in.";

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

  try { console.log('[hl485] declutter mode online: one drawer for fifteen minutes, would you buy it again today, donation box by the door emptied weekly'); } catch (e3) {}
})();
