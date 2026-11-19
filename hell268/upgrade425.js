/* ILLUMINATI upgrade 425 - MATH CHECK MODE (hl425)
   Frontier directive: a calculation gets worked, then verified a second way. Nothing removed.
*/
(function () {
  if (window.__HL425) return; window.__HL425 = true;

  var RP = /\b(math (help|check)|is my math right|check (my|this) (math|arithmetic|numbers)|step by step math|solve (this|that) (math|problem)|percent(age)? of|tip (calculation|calculator)|split the bill)\b/i;
  var DIRECTIVE = "MATH CHECK RULE: when the asker works a calculation, show the work in short steps, then verify the result a second way (estimate the magnitude first, then compute; or work the problem backward) and say plainly if the two disagree. Round nothing silently: state where rounding happened and how much it moved the answer. If their starting numbers or units look off, ask about the one that changes the result rather than computing on a guess.";

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

  try { console.log('[hl425] math check mode online: steps shown, result verified a second way, rounding named'); } catch (e3) {}
})();
