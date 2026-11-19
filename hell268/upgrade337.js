/* ILLUMINATI upgrade 337 - PRONOUNCE MODE (hl337)
   Frontier directive: pronunciation asks lead with the sound.
   "How do you pronounce Gyro" opens with a plain-English phonetic
   spelling (say-it-how-it-looks), then the word in its own
   language if it has one, then one line on the common
   mispronunciation. Nothing removed.
*/
(function () {
  if (window.__HL337) return; window.__HL337 = true;

  var PN = /\b(how (do|is|to) .{0,30} pronounce|pronunciation of|how to say|how do you say|say it out loud|correct way to say)\b/i;
  var DIRECTIVE = "PRONOUNCE RULE: when the ask is how to pronounce or say a word, open with a plain-English phonetic spelling (say-it-how-it-looks, capital letters for the stressed syllable), then the word in its own language or script if it has one, then one line naming the most common mispronunciation. Keep it short enough to actually say.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && PN.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('PRONOUNCE RULE') < 0) {
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

  try { console.log('[hl337] pronounce mode online: pronunciation asks lead with the sound'); } catch (e3) {}
})();
