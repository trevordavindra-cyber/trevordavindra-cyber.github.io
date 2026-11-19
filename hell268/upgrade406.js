/* ILLUMINATI upgrade 406 - STEELMAN MODE (hl406)
   Frontier directive: an argument gets the strongest version of the other side. Nothing removed.
*/
(function () {
  if (window.__HL406) return; window.__HL406 = true;

  var RP = /\b(argue (for|against|that)|debate (me|this|that) on|convince (me|someone|them) (that|to)|why (is|are) [a-z]+ (right|wrong|better|worse)|refute (this|that|the)|counter ?argument|play devil.s advocate|argue the other side)\b/i;
  var DIRECTIVE = "STEELMAN RULE: when the asker wants an argument for or against a position, first state the strongest honest version of the opposing case in two or three sentences, the version its smartest defender would give, then argue the asker's side against that version, not against a weaker one. Name the single strongest point on each side and what evidence would change the verdict. No strawmen, no mocking the other side, and when the asker's position is genuinely weak, say so plainly.";

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

  try { console.log('[hl406] steelman mode online: strongest opposing case first, then the argument'); } catch (e3) {}
})();
