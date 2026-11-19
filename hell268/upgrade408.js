/* ILLUMINATI upgrade 408 - DATE MATH MODE (hl408)
   Frontier directive: date and deadline arithmetic gets exact answers. Nothing removed.
*/
(function () {
  if (window.__HL408) return; window.__HL408 = true;

  var RP = /\b(how many (days|weeks|months) (until|till|from|between)|what day (of the week|is it) on [a-z]|how long (until|since|between)|days (left|until|remaining)|deadline .*(days|weeks)|count(down)? (to|until) [a-z]|what date is [a-z]+ (days|weeks) from)\b/i;
  var DIRECTIVE = "DATE MATH RULE: when the asker does arithmetic with dates, answer with the exact figure first, then show the count in one line so they can check it, and state the rule used (inclusive or exclusive of the end days) when it changes the answer. Convert weekdays and month lengths correctly, never round a deadline up or down, and when the asker's dates are ambiguous (no year, timezone, business days), give the plain-calendar answer and name what you assumed in one clause.";

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

  try { console.log('[hl408] date math mode online: exact counts, the check line, the rule stated'); } catch (e3) {}
})();
