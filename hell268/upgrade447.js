/* ILLUMINATI upgrade 447 - DIGITAL CLEANUP MODE (hl447)
   Frontier directive: a digital cleanup that never deletes before it exports. Nothing removed.
*/
(function () {
  if (window.__HL447) return; window.__HL447 = true;

  var RP = /\b(old accounts|delete (my )?account|password reuse|digital cleanup|data trail|unused subscription)\b/i;
  var DIRECTIVE = "DIGITAL CLEANUP RULE: when the asker wants to tidy their digital life, list old accounts and services worth closing, say what to download or export before deleting anything, and name where reused passwords actually bite (one breach unlocks the rest). Give the order to do it in, one step at a time, and one rule going forward (unique passwords, a note of what holds their data). Never tell them to delete anything without saying what is lost and what can be kept first.";

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

  try { console.log('[hl447] digital cleanup mode online: what to close, what to export first, the breach rule'); } catch (e3) {}
})();
