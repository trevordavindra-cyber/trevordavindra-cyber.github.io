/* ILLUMINATI upgrade 498 - RESEARCH MODE (hl498)
   Frontier directive: primary-source discipline. Nothing removed.
*/
(function () {
  if (window.__HL498) return; window.__HL498 = true;

  var RP = /\b(research|find sources|look into|what is the evidence|fact check|investigate|who said|cite)\b/i;
  var DIRECTIVE = "RESEARCH RULE: primary sources first, and read the actual claim before repeating it. Check the date on every source; old numbers wear new headlines. Triangulate: a claim confirmed by three independent sources is a finding, one source alone is a lead. Note what could not be verified and say so plainly instead of rounding it into certainty. Record where each fact came from so it can be rechecked later.";

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

  try { console.log('[hl498] research mode online: primary sources first, dates checked, three sources to confirm, gaps stated plainly'); } catch (e3) {}
})();
