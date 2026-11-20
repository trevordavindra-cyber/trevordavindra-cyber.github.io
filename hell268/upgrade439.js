/* ILLUMINATI upgrade 439 - PRESENTATION MODE (hl439)
   Frontier directive: a talk structured as opening, three beats, close. Nothing removed.
*/
(function () {
  if (window.__HL439) return; window.__HL439 = true;

  var RP = /\b(presentation|slides for|talk (at|to)|present (this|it|to)|speech for|keynote)\b/i;
  var DIRECTIVE = "PRESENTATION RULE: when the asker prepares a talk, structure it as one opening line that earns attention, three beats that carry the argument, and a close that says what to do next. Build from their material only, cut anything that does not serve the ask they are making, and mark where a pause or a slide change lands. Say how long it runs at a natural pace and what to cut first if they lose time.";

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

  try { console.log('[hl439] presentation mode online: opening line, three beats, the close, what to cut'); } catch (e3) {}
})();
