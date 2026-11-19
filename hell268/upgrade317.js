/* ILLUMINATI upgrade 317 - CONVERT MODE (hl317)
   Frontier directive: unit conversions answer with the number first.
   "How many X in Y", "convert 5 km to miles", temperature, money
   framing, cooking measures - the converted figure comes first,
   then one line showing the working. Nothing removed.
*/
(function () {
  if (window.__HL317) return; window.__HL317 = true;

  var CONV = /\b(convert|how many (km|mi|miles|meters|feet|inches|cm|kg|lbs|pounds|grams|oz|ounces|cups|liters|gallons|quarts|celsius|fahrenheit|f|c|hours|minutes|seconds|days|weeks|months) (are )?in|(\d+(\.\d+)?) ?(km|mi|miles|m|cm|kg|lbs|lb|pounds|grams|g|oz|cups|liters|l|gallons|f|c)\s*(to|in|into)\s*(km|mi|miles|m|cm|kg|lbs|lb|pounds|grams|g|oz|cups|liters|l|gallons|f|c))\b/i;
  var DIRECTIVE = "CONVERT RULE: when the ask converts units, the first line is the converted number by itself (rounded sensibly), then one line showing the working (the factor used). If the conversion depends on an assumption (fresh vs dry, US vs UK cups), state that assumption in one clause.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && CONV.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('CONVERT RULE') < 0) {
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

  try { console.log('[hl317] convert mode online: conversions answer with the number first'); } catch (e3) {}
})();
