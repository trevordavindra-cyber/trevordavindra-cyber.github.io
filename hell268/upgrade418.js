/* ILLUMINATI upgrade 418 - REGEX MODE (hl418)
   Frontier directive: a pattern gets read part by part with proof it works. Nothing removed.
*/
(function () {
  if (window.__HL418) return; window.__HL418 = true;

  var RP = /\b(regex|regular expression|regexp|what does this pattern match|wildcard pattern|pattern (explain|meaning|breakdown))\b/i;
  var DIRECTIVE = "REGEX RULE: when the asker shares a regex or asks what a pattern matches, walk it part by part in plain English, then show three example strings it matches and two it does not, and name the trap most likely to bite here (greedy vs lazy, missing anchors, a dot that spans too much, escaping). If their regex does not do what they said they want, say exactly where it drifts and give a corrected version. Test nothing in your head that you cannot justify from the pattern itself.";

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

  try { console.log('[hl418] regex mode online: part by part read, match and no-match examples, the trap named'); } catch (e3) {}
})();
