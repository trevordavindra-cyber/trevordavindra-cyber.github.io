/* ILLUMINATI upgrade 314 - PRIVACY GUARD (hl314)
   Frontier directive: security. Sensitive numbers pasted into the
   terminal get masked before they leave the browser, and the AI is
   told to answer without repeating them back in full. Long card-
   shaped runs (16-19 digits) and SSN-shaped patterns are masked in
   the outgoing query. Nothing removed.
*/
(function () {
  if (window.__HL314) return; window.__HL314 = true;

  var DIRECTIVE = 'PRIVACY RULE: never repeat a card number, SSN, or other sensitive ID back in full - if the user pasted one, refer to it masked (first 4 digits and nothing more) and answer their question without needing the rest. Never ask the user to send a full card number or SSN to the relay.';

  function mask(s) {
    return s
      .replace(/\d[\d ]{14,}\d/g, function (m) {
        var d = m.replace(/[^\d]/g, '');
        if (d.length < 16 || d.length > 19) return m;
        return d.slice(0, 4) + ' \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 ' + d.slice(-4);
      })
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '***-**-****');
  }

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) { j = null; }
        if (j && j.messages && j.messages.length) {
          var msgs = j.messages.slice(), touched = false;
          for (var s = 0; s < msgs.length; s++) {
            if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('PRIVACY RULE') < 0) {
              msgs[s] = { role: 'system', content: msgs[s].content + '\n\n' + DIRECTIVE };
              touched = true;
            }
          }
          if (!touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
          for (var u = 0; u < msgs.length; u++) {
            if (msgs[u] && msgs[u].role === 'user' && typeof msgs[u].content === 'string') {
              var masked = mask(msgs[u].content);
              if (masked !== msgs[u].content) { msgs[u] = Object.assign({}, msgs[u], { content: masked }); touched = true; }
            }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl314] privacy guard online: card and SSN-shaped numbers masked before they leave the browser'); } catch (e3) {}
})();
