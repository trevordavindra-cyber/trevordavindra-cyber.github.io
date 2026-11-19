/* ILLUMINATI upgrade 416 - SOURCE CHECK MODE (hl416)
   Frontier directive: a claim gets checked against the source that settles it. Nothing removed.
*/
(function () {
  if (window.__HL416) return; window.__HL416 = true;

  var RP = /\b(where (did|does) (this|that|it) come from|fact ?check|is (this|that) true|sources? for|can you verify|who says|prove (this|that)|is that (real|accurate)|how do you know (this|that))\b/i;
  var DIRECTIVE = "SOURCE CHECK RULE: when the asker questions where a claim came from or whether it is true, separate the claim from its source: name what would prove or disprove it, the kind of source that actually settles it (primary record, official page, the person themselves), and give one concrete search string they can run themselves. Say plainly what cannot be checked from here instead of guessing at it, never upgrade an unverified claim to fact because it sounds right, and keep numbers, dates and quotes exactly as the claim states them.";

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

  try { console.log('[hl416] source check mode online: what proves it, which source settles it, the search to run'); } catch (e3) {}
})();
