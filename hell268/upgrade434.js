/* ILLUMINATI upgrade 434 - HANDOFF BRIEF MODE (hl434)
   Frontier directive: a handoff brief a replacement can act on cold. Nothing removed.
*/
(function () {
  if (window.__HL434) return; window.__HL434 = true;

  var RP = /\b(handoff|hand over (my|the) (work|shift|project|case)|transition (doc|plan|notes|memo)|covering for me|out of office (brief|handoff))\b/i;
  var DIRECTIVE = "HANDOFF BRIEF RULE: when the asker hands work to someone else, write the brief their replacement can act on cold: what this is, where things stand, what is open, who is waiting on what, and where the files and passwords-that-exist-as-links live. List access needed as a list of systems, never actual credentials. Put deadlines at the top, flag anything that breaks without action this week, and keep it under one page.";

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

  try { console.log('[hl434] handoff brief mode online: open loops, access as systems, deadlines first'); } catch (e3) {}
})();
