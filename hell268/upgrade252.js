/* ILLUMINATI upgrade #252: hl252-codex (v19.154)
   THE ASK: find the free coding knowledge that is at least a terabyte big
   and give it to the AI.
   The big free coding libraries are real and downloadable:
   - The Stack v2 on Hugging Face (bigcode) - terabytes of source code in
     600+ languages, built from the Software Heritage archive, free.
   - The Stack (v1) - 3 TB of permissively licensed source code, free.
   - The Stack Exchange data dump - ~92 GB of every Stack Overflow Q&A,
     free, CC BY-SA.
   A phone browser cannot hold a terabyte, so the AI gets that knowledge the
   way it can actually use it: live retrieval. hl252-codex wires the free
   Stack Exchange coding knowledge base straight into every code answer:
   - When the user's question looks like coding (languages, tools, bugs,
     APIs, patterns...), the terminal queries the free Stack Exchange API
     (no key, no cost) for the top relevant questions and their
     highest-voted accepted answers.
   - Those land in the request as CODEX VAULT context, and the AI is told to
     use them and say they come from Stack Exchange.
   - Hard timeout keeps the reply snappy; if the vault is unreachable the
     answer just runs as before. Nothing else changes.
   Coexists with hl245-251. Guard: __HL252 */
(function () {
  if (window.__HL252) return; window.__HL252 = true;

  var CODING_RE = /(\bcode\b|\bjavascript\b|\bjs\b|\bpython\b|\bjava\b|\bc\+\+\b|\bc#\b|\bcss\b|\bhtml\b|function\b|\bapi\b|librar|\bframework|framework\b|\bbug\b|\bregex\b|\bsql\b|\bgit\b|\bdocker\b|\breact\b|\bnode\b|\barray\b|\bstring\b|\bloop\b|\berror\b|\bexception\b|\bdebug|\bcompile|\bsyntax\b|\bdatabase\b|\bjson\b|\bxml\b|\bhttp\b|\bserver\b|\blinux\b|\bscript|\bclass\b|\bmethod\b|\basync\b|\bpromise\b|\bstyling\b|\bshader\b|\bgame engine\b|\broblox\b|\blua\b)/i;
  var lastQ = '', lastHits = null, lastAt = 0;

  function stripHtml(s) {
    return String(s || '').replace(/<[^>]*>/g, ' ').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
  }

  function lookup(q) {
    var url = 'https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&pagesize=3&site=stackoverflow&q=' + encodeURIComponent(q.slice(0, 140));
    return fetch(url, { headers: { 'Accept': 'application/json' } })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        var items = (d && d.items || []).slice(0, 3);
        var ids = items.map(function (x) { return x.question_id; }).filter(Boolean);
        if (!ids.length) return [];
        var aurl = 'https://api.stackexchange.com/2.3/questions/' + ids.join(';') + '/answers?order=desc&sort=votes&site=stackoverflow&pagesize=3&filter=withbody';
        return fetch(aurl, { headers: { 'Accept': 'application/json' } })
          .then(function (r2) { if (!r2.ok) throw 0; return r2.json(); })
          .then(function (d2) {
            var ans = d2 && d2.items || [];
            return items.map(function (qitem) {
              var best = ans.filter(function (a) { return a.question_id === qitem.question_id; })
                .sort(function (a, b) { return (b.is_accepted ? 1 : 0) - (a.is_accepted ? 1 : 0) || (b.score || 0) - (a.score || 0); })[0];
              return {
                title: qitem.title,
                link: qitem.link,
                score: best && best.score || 0,
                accepted: !!(best && best.is_accepted),
                body: best ? stripHtml(best.body).slice(0, 900) : ''
              };
            });
          });
      });
  }

  function cached(q) {
    var now = Date.now();
    if (q === lastQ && lastHits && now - lastAt < 600000) return Promise.resolve(lastHits);
    lastQ = q; lastHits = null;
    return new Promise(function (resolve) {
      var done = false;
      var t = setTimeout(function () { if (!done) { done = true; resolve(null); } }, 8000);
      lookup(q).then(function (hits) {
        if (done) return; done = true; clearTimeout(t);
        lastHits = hits; lastAt = Date.now();
        try { console.log('[hl252] codex: ' + hits.length + ' Stack Exchange answer(s) wired in'); } catch (e2) {}
        resolve(hits);
      })['catch'](function () { if (!done) { done = true; clearTimeout(t); resolve(null); } });
    });
  }

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var isRelay = /pollinations\.ai|textdb\.online|aihorde\.net|openrouter|deepinfra|groq|huggingface\.co/.test(url);
      var isLocal = /jsonblob\.com/.test(url);
      if (isRelay && !isLocal && init && typeof init.body === 'string' && init.body.indexOf('"messages"') > -1) {
        var b = JSON.parse(init.body);
        var msgs = b && b.messages || [];
        var lastUser = null;
        for (var i = msgs.length - 1; i >= 0; i--) {
          if (msgs[i] && msgs[i].role === 'user') { lastUser = msgs[i]; break; }
        }
        var q = lastUser && String(lastUser.content || '') || '';
        if (q && CODING_RE.test(q)) {
          return cached(q).then(function (hits) {
            try {
              if (hits && hits.length) {
                var block = '\n\nCODEX VAULT - live excerpts from the free Stack Exchange coding knowledge base (Stack Overflow, CC BY-SA, hundreds of gigabytes of real Q&A from the free data dumps). Use these when they fit the question, and mention they come from Stack Overflow:';
                hits.forEach(function (h, k) {
                  block += '\n\n' + (k + 1) + '. ' + (h.title || '') + (h.accepted ? ' [ACCEPTED ANSWER, ' + h.score + ' votes]' : ' [' + h.score + ' votes]');
                  if (h.link) block += ' (' + h.link + ')';
                  if (h.body) block += '\n   ' + h.body;
                });
                lastUser.content += block;
                b.messages = msgs;
                init.body = JSON.stringify(b);
              }
            } catch (e3) {}
            return of.apply(this, arguments);
          });
        }
      }
    } catch (e) {}
    return of.apply(this, arguments);
  };

  try { console.log('[hl252] codex online: the free Stack Exchange coding knowledge base (the 92 GB dump, live) rides into every code answer; the multi-terabyte free code libraries are The Stack v1 (3 TB) + The Stack v2 (600+ languages) on Hugging Face'); } catch (e4) {}
})();
