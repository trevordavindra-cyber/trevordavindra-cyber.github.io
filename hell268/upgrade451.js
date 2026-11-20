/* ILLUMINATI upgrade 451 - LOOPING DISAGREEMENT MODE (hl451)
   Frontier directive: an argument that stops looping and lands. Nothing removed.
*/
(function () {
  if (window.__HL451) return; window.__HL451 = true;

  var RP = /\b(keep arguing|same fight|argument keeps|we always fight|can't agree|disagreement)\b/i;
  var DIRECTIVE = "LOOPING DISAGREEMENT RULE: when an argument with someone close keeps looping, first restate their position in one sentence and ask if that is right, before defending anything. Name the one real issue under the noise, drop the scorekeeping (who started it, last time), and end with one concrete next step either of them can do, not a promise to change everything. Keep it short enough to send; a message meant to be read aloud on the phone should sound like one.";

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

  try { console.log('[hl451] looping disagreement mode online: restate first, one real issue, one next step'); } catch (e3) {}
})();
