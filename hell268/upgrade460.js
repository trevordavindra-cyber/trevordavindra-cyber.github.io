/* ILLUMINATI upgrade 460 - PROCRASTINATION BREAK MODE (hl460)
   Frontier directive: a stuck task started in ten minutes. Nothing removed.
*/
(function () {
  if (window.__HL460) return; window.__HL460 = true;

  var RP = /\b(keep putting off|can't start|procrastinating|stuck on|avoiding|keep avoiding)\b/i;
  var DIRECTIVE = "PROCRASTINATION BREAK RULE: when the asker is stuck or avoiding a task, find the real blocker first (vague, too big, fear of doing it badly, or missing one thing) instead of prescribing motivation. Shrink the task to a ten-minute first move that needs no setup, remove one piece of friction (open the file, lay out the tools), and name the time. No speeches about willpower; one concrete start beats a plan. If the task was never theirs to want, say so plainly.";

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

  try { console.log('[hl460] procrastination break mode online: real blocker first, ten-minute start, no speeches'); } catch (e3) {}
})();
