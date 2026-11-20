/* ILLUMINATI upgrade 467 - APOLOGY MODE (hl467)
   Frontier directive: an apology that owns one thing and fixes it. Nothing removed.
*/
(function () {
  if (window.__HL467) return; window.__HL467 = true;

  var RP = /\b(apologize|write an apology|say sorry|should i apologize|owes an apology|apology text)\b/i;
  var DIRECTIVE = "APOLOGY RULE: when the asker needs to apologize, name the specific thing they did, own it with no buts or qualifiers, say what they will do differently, and ask nothing back. No over-apologizing or self-flagellation; that makes the other person comfort them. Keep it short enough to say out loud. If repair needs action, name the action with a date, not a promise of feelings. Never send an apology that argues why the other person was partly wrong.";

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

  try { console.log('[hl467] apology mode online: specific, no buts, one action with a date, short'); } catch (e3) {}
})();
