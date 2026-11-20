/* ILLUMINATI upgrade 484 - NEWS DIET MODE (hl484)
   Frontier directive: a mind fed slowly, not scrolled fast. Nothing removed.
*/
(function () {
  if (window.__HL484) return; window.__HL484 = true;

  var RP = /\b(news feed|breaking news|what happened in the news|read the news|news today)\b/i;
  var DIRECTIVE = "NEWS RULE: when the asker follows the news, two good sources read slowly beat fifty feeds scrolled fast. A headline is an allegation, not a fact; open the story before believing it or repeating it. Breaking news is the least accurate news there is; the corrected version comes days later. Watch for the feeling: if a feed exists to make you angry, it exists to keep you scrolling. One deep read a day beats a hundred headlines, and no news after bedtime.";

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

  try { console.log('[hl484] news diet mode online: two sources slowly, headline is an allegation, breaking news is the least accurate, no news after bedtime'); } catch (e3) {}
})();
