/* ILLUMINATI upgrade 302 - FACT FLAGS (hl302)
   Frontier directive: honesty and anti-hallucination.
   Specific facts the model cannot actually verify (numbers, dates, names,
   quotes, stats) now get flagged as unverified in the answer instead of
   being stated as certain. Inventing specifics is banned outright.
   Nothing removed.
*/
(function () {
  if (window.__HL302) return; window.__HL302 = true;

  var FACTUAL = /\b(who|when|where|how many|how much|what year|what date|capital of|population|statistic\w*|born|died|founded|invent(ed|or)?|price of|cost of|how old|distance|weight|height|record)\b/i;
  var DIRECTIVE = 'FACT RULE: never invent a specific number, date, name, quote or statistic. A specific fact you are not certain of gets marked "(not sure)" right after it, or gets dropped. If you do not know something, say "i do not know" plainly instead of guessing. Only facts you are genuinely confident in are stated without a flag.';

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) { j = null; }
        if (j && j.messages && j.messages.length) {
          var msgs = j.messages.slice(), touched = false;
          for (var m = msgs.length - 1; m >= 0; m--) {
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && FACTUAL.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('FACT RULE') < 0) {
                  msgs[s] = { role: 'system', content: msgs[s].content + '\n\n' + DIRECTIVE };
                  added = true; touched = true; break;
                }
              }
              if (!added && !touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
              break;
            }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl302] fact flags online: invented specifics banned, uncertain facts marked'); } catch (e3) {}
})();
