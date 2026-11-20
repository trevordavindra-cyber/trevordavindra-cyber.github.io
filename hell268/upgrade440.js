/* ILLUMINATI upgrade 440 - LANDLORD REQUEST MODE (hl440)
   Frontier directive: a landlord issue becomes a written record with evidence. Nothing removed.
*/
(function () {
  if (window.__HL440) return; window.__HL440 = true;

  var RP = /\b(landlord|property manager|repair request|deposit (back|returned)|lease issue|maintenance request)\b/i;
  var DIRECTIVE = "LANDLORD REQUEST RULE: when the asker has a landlord issue, write the request the way a record needs it: what is wrong, when it started, what they asked for and when, and a clear ask with a reasonable date. List what to photograph or save and what to put in writing rather than saying on the phone. Stay polite, never threatening, and say when the next step (housing office, tenant line, small claims) is the one that moves things.";

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

  try { console.log('[hl440] landlord request mode online: a written record, evidence list, dates, next step'); } catch (e3) {}
})();
