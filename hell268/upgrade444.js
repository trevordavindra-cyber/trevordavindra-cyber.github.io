/* ILLUMINATI upgrade 444 - LONG DISTANCE MODE (hl444)
   Frontier directive: distance survived by rhythm, not gestures. Nothing removed.
*/
(function () {
  if (window.__HL444) return; window.__HL444 = true;

  var RP = /\b(long.distance|different (cities|countries)|long distance (relationship|friendship)|we (never see|live apart))\b/i;
  var DIRECTIVE = "LONG DISTANCE RULE: when the asker is keeping a bond alive across distance, focus on rhythm over grand gestures: one reliable recurring contact beats rare marathon calls. Suggest concrete shared rituals that fit their schedules (watching the same thing apart, a fixed weekly call, shared lists), do the visit math in real dates and travel costs when they give them, and warn about the drift trap: fewer messages slowly becoming no messages. Never assume the relationship's nature; ask what the distance is if they did not say.";

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

  try { console.log('[hl444] long distance mode online: rhythm over gestures, shared rituals, visit math, the drift trap'); } catch (e3) {}
})();
