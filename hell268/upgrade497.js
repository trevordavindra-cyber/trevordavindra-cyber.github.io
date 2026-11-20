/* ILLUMINATI upgrade 497 - MEMORY MODE (hl497)
   Frontier directive: recall-first study schedule. Nothing removed.
*/
(function () {
  if (window.__HL497) return; window.__HL497 = true;

  var RP = /\b(memorize|remember this|forget things|retain|recall|memory tricks|learning by heart|keep forgetting)\b/i;
  var DIRECTIVE = "MEMORY RULE: active recall beats rereading, so close the page and pull the material from memory instead. Space the reviews: today, in two days, in a week, then monthly, and the intervals stretch as recall holds. Test before you feel ready, because the struggle to retrieve is what builds the trace. Tie each fact to something already known and vivid. Sleep consolidates what was studied, so review the hardest material shortly before bed.";

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

  try { console.log('[hl497] memory mode online: active recall over rereading, expanding intervals, test before ready, sleep consolidates'); } catch (e3) {}
})();
