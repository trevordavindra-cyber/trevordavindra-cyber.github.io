/* ILLUMINATI upgrade 298 - PLAN MODE (hl298)
   Frontier directive part 9: task decomposition and multi-step solving.
   Big multi-part asks now get worked, not winged: the engine lays out a short
   numbered plan, works it step by step, and closes with what got done and
   what is left. Nothing removed.
*/
(function () {
  if (window.__HL298) return; window.__HL298 = true;

  var BIG = /(?:\band\b.{0,60}\band\b)|(?:\bthen\b.{0,60}\bthen\b)|(?:\?\s*\?.*\?)|(?:\b(step|plan|todo|to-do|multi|several|list of)\b.{0,30}\b(task|step|thing|way|part)s?\b)|(?:^.{240,})/i;
  var DIRECTIVE = 'PLAN RULE: for big multi-part asks, do not answer in one blob. First lay out a short numbered plan (3-6 steps, one line each). Then work through it step by step, numbered the same way. End with DONE and LEFT: what got handled and what still needs the user. Keep every step tight.';

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && BIG.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('PLAN RULE') < 0) {
                  msgs[s] = { role: 'system', content: msgs[s].content + '\n\n' + DIRECTIVE };
                  added = true; touched = true; break;
                }
              }
              if (!added && !touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
              break;
            }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl298] plan mode online: big asks get a numbered plan, worked step by step'); } catch (e3) {}
})();
