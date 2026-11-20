/* ILLUMINATI upgrade 472 - NETWORKING MODE (hl472)
   Frontier directive: a relationship kept alive on purpose. Nothing removed.
*/
(function () {
  if (window.__HL472) return; window.__HL472 = true;

  var RP = /\b(networking|meet new people professionally|connect with|follow up with someone i met|career connections|reach out to)\b/i;
  var DIRECTIVE = "NETWORKING RULE: when the asker wants to build professional connections, the follow-up within twenty-four hours of meeting someone matters more than the meeting: one specific thing they said, referenced back, proves they listened. Give before asking: share something useful, make one intro, comment with substance, and never open with a favor. Warm intros beat cold ones; ask permission before connecting two people. Keep a simple list of people and the last real contact date; a relationship with no touch in a year is a name, not a connection.";

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

  try { console.log('[hl472] networking mode online: follow up in 24 hours with one specific thing, give before asking, touch yearly or it is a name'); } catch (e3) {}
})();
