/* ILLUMINATI upgrade 501 - BROWSE MODE (hl501)
   Major capability: the AI can now read a live web page. Paste any link and
   the page's real text is fetched fresh and fed into the answer. Nothing removed.
*/
(function () {
  if (window.__HL501) return; window.__HL501 = true;

  var URL_RE = /https?:\/\/[^\s<>"')\]]+/i;

  var of = window.fetch;
  window.fetch = function (input, init) {
    var orig = this, oargs = [input, init];
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) {}
        if (j && j.messages && j.messages.length) {
          var last = '', li = -1;
          for (var i = j.messages.length - 1; i >= 0; i--) {
            if (j.messages[i] && j.messages[i].role === 'user' && typeof j.messages[i].content === 'string') { last = j.messages[i].content; li = i; break; }
          }
          var m = last.match(URL_RE);
          if (m) {
            var target = m[0];
            return fetch('https://r.jina.ai/' + target, { cache: 'no-store' }).then(function (r2) { return r2.text(); }).then(function (page) {
              var note;
              if (page && page.length > 40) {
                if (page.length > 4000) page = page.slice(0, 4000) + '\n[page truncated]';
                note = { role: 'system', content: 'LIVE PAGE CONTENT (fetched fresh right now from ' + target + '):\n' + page + '\n\nBROWSE RULE: ground your answer in this real page content and say you read the live page. If the page does not answer the question, say so plainly.' };
              } else {
                note = { role: 'system', content: 'BROWSE RULE: the page at ' + target + ' could not be read just now. Say plainly that the page would not load instead of guessing what it says.' };
              }
              try {
                var j2 = j;
                var msgs = j2.messages.slice();
                var at = -1;
                for (var k = 0; k < msgs.length; k++) { if (msgs[k] && msgs[k].role === 'user') { at = k; break; } }
                if (at >= 0) msgs.splice(at, 0, note); else msgs.push(note);
                j2.messages = msgs;
                var init2 = Object.assign({}, init, { body: JSON.stringify(j2) });
                return of.apply(orig, [input, init2]);
              } catch (e2) { return of.apply(orig, oargs); }
            })['catch'](function () { return of.apply(orig, oargs); });
          }
        }
      }
    } catch (e3) {}
    return of.apply(orig, oargs);
  };

  try { console.log('[hl501] browse mode online: paste a link and the live page is read fresh'); } catch (e4) {}
})();
