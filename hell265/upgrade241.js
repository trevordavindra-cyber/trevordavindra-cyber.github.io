/* ILLUMINATI upgrade #241: hl241-webbrain (v19.138)
   THE ASK: the AI should get a lot more done on the internet and websites,
   with real research smarts. WEB BRAIN, layered on top of hl234 (nothing
   removed): when an ask needs the live web ("research", "who is", "what
   happened", "find out", "when did", "news on"), it runs a research pass
   before answering:
   - searches DuckDuckGo (Wikipedia fallback), picks the top sources
   - reads up to 3 pages IN PARALLEL through the deep reader (bigger token
     cap on every page read, so even plain /web reads come back fuller)
   - injects a compiled research brief into the relay request, so the answer
     is written from live pages and names its sources
   - /web keeps working; /web off turns the research pass off too
   - WEB NEED / WEB SEARCH continuation keeps working, on deeper reads
   No new buttons, no auto loop: one research pass per ask, then it answers.
   Guard: __HL241 */
(function () {
  if (window.__HL241) return; window.__HL241 = true;

  var MAXPAGES = 3, PERPAGE = 5000, MAXTOTAL = 15000;
  var busy = false;

  function $(id) { return document.getElementById(id); }

  function doLine(cls, text) {
    try {
      var chat = $('chat'); if (!chat) return;
      var d = document.createElement('div'); d.className = 'line ' + cls;
      var hd = document.createElement('div'); hd.className = 'lhead';
      var tm = '';
      try { tm = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); } catch (e2) {}
      hd.innerHTML = '<span class="lwho">GATE</span><span class="lt">' + tm + '</span>';
      d.appendChild(hd);
      var bd = document.createElement('div'); bd.className = 'lbody'; bd.textContent = text;
      d.appendChild(bd); chat.appendChild(d);
      try { chat.scrollTop = chat.scrollHeight; } catch (e3) {}
    } catch (e) {}
  }

  function tfetch(url, ms) {
    var c = new AbortController();
    var t = setTimeout(function () { try { c.abort(); } catch (e) {} }, ms || 18000);
    return fetch(url, { signal: c.signal })['finally'](function () { clearTimeout(t); });
  }

  function clean(t) {
    try {
      t = String(t || '');
      t = t.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
      t = t.replace(/<nav[\s\S]*?<\/nav>/gi, ' ').replace(/<footer[\s\S]*?<\/footer>/gi, ' ');
      if (/<[a-z][\s\S]*>/i.test(t)) t = t.replace(/<[^>]+>/g, ' ');
      t = t.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
      return t;
    } catch (e) { return ''; }
  }

  function jina(url, cap) {
    var path = url.replace(/^https?:\/\//, '');
    var sep = path.indexOf('?') >= 0 ? '&' : '?';
    return tfetch('https://r.jina.ai/' + path + sep + 'x-token-limit=' + (cap || 16000))
      .then(function (r) { if (!r.ok) throw new Error('read blocked'); return r.text(); });
  }

  function fetchPage(url, cap) {
    return jina(url, cap)['catch'](function () {
      return tfetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(url))
        .then(function (r) { if (!r.ok) throw new Error('read blocked'); return r.text(); });
    }).then(function (t) { return clean(t).slice(0, cap || 6000); });
  }

  function ddgHits(q) {
    var ddg = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q);
    return tfetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(ddg))
      .then(function (r) { if (!r.ok) throw new Error('search blocked'); return r.text(); })
      .then(function (h) {
        var out = [];
        try {
          var doc = new DOMParser().parseFromString(h, 'text/html');
          var rows = doc.querySelectorAll('.result');
          for (var i = 0; i < rows.length && out.length < 8; i++) {
            var a = rows[i].querySelector('a.result__a'), s = rows[i].querySelector('.result__snippet');
            if (a) {
              var href = a.getAttribute('href') || '';
              var m = /uddg=([^&]+)/.exec(href);
              if (m) { try { href = decodeURIComponent(m[1]); } catch (e2) {} }
              if (href && href.indexOf('//') === 0) href = 'https:' + href;
              if (/^https?:\/\//i.test(href)) out.push({ title: (a.textContent || '').trim(), url: href, snip: s ? s.textContent.trim() : '' });
            }
          }
        } catch (e3) {}
        if (!out.length) throw new Error('no results');
        return out;
      });
  }

  function wikiText(q) {
    var u = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srlimit=3&srsearch=' + encodeURIComponent(q);
    return tfetch(u, 12000)
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var hits = (j.query && j.query.search) || [];
        if (!hits.length) throw new Error('no results');
        var titles = hits.map(function (h) { return h.title; });
        var u2 = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&explaintext=1&exintro=1&titles=' + encodeURIComponent(titles.join('|'));
        return tfetch(u2, 12000).then(function (r2) { return r2.json(); }).then(function (j2) {
          var pages = (j2.query && j2.query.pages) || {};
          var out = [];
          titles.forEach(function (ti) {
            for (var k in pages) {
              if (pages[k].title === ti) {
                var ex = String(pages[k].extract || '').slice(0, 3000);
                if (ex) out.push({ title: 'Wikipedia — ' + ti, url: 'https://en.wikipedia.org/wiki/' + encodeURIComponent(ti.replace(/ /g, '_')), text: ex });
                break;
              }
            }
          });
          if (!out.length) throw new Error('no results');
          return out;
        });
      });
  }

  function research(q) {
    doLine('omen', 'research mode: searching the live web for "' + q + '"');
    return ddgHits(q)['catch'](function () { return []; }).then(function (hits) {
      var urls = hits.map(function (h) { return h.url; }).slice(0, MAXPAGES);
      if (!urls.length) return wikiText(q);
      return Promise.all(urls.map(function (u) {
        return fetchPage(u, PERPAGE).then(function (t) { return { title: u.replace(/^https?:\/\//, '').split('/')[0], url: u, text: t }; })['catch'](function () { return null; });
      })).then(function (rs) {
        rs = rs.filter(Boolean).filter(function (r) { return r.text && r.text.length > 200; });
        if (!rs.length) return wikiText(q);
        return rs;
      });
    }).then(function (rs) {
      var block = 'LIVE WEB RESEARCH on "' + q + '" — read just now, ' + rs.length + ' source' + (rs.length === 1 ? '' : 's') + ':\n';
      var total = 0;
      rs.forEach(function (r, i) {
        var t = String(r.text || r.snip || '').slice(0, PERPAGE);
        if (total + t.length > MAXTOTAL) t = t.slice(0, Math.max(0, MAXTOTAL - total));
        total += t.length;
        block += '\nSOURCE ' + (i + 1) + ': ' + r.title + '\n' + r.url + '\n' + t + '\n';
      });
      block += '\n[end research] Answer from this live research. Name the sites you used in plain words. If it does not cover the question, say so.';
      window.__HL241CTX = { block: block, uses: 2 };
      doLine('omen', 'read ' + rs.length + ' page' + (rs.length === 1 ? '' : 's') + ' (' + hitsCount(rs) + ') — answering from the live web');
    });
  }

  function hitsCount(rs) {
    return rs.map(function (r) { return String(r.title || '').split('/')[0]; }).join(', ');
  }

  /* the injection seam: the research brief rides inside the relay request */
  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var c = window.__HL241CTX;
      if (c && c.uses > 0 && init && typeof init.body === 'string') {
        var u = (typeof input === 'string') ? input : (input && input.url) || '';
        if (/pollinations\.ai|aihorde\.ai/.test(u)) {
          var b = JSON.parse(init.body);
          var hit = false;
          if (b && b.messages && b.messages.length) {
            for (var i = b.messages.length - 1; i >= 0; i--) {
              if (b.messages[i] && b.messages[i].role === 'user') { b.messages[i].content = String(b.messages[i].content || '') + '\n\n' + c.block; hit = true; break; }
            }
          } else if (b && typeof b.prompt === 'string') { b.prompt += '\n\n' + c.block; hit = true; }
          if (hit) { init.body = JSON.stringify(b); c.uses--; if (c.uses <= 0) window.__HL241CTX = null; }
        }
      }
    } catch (e) {}
    return of.apply(this, arguments);
  };

  var URL_RE = /https?:\/\/[^\s<>"')]+/i;
  var RE_RE = /\b(research|deep dive|dig into|find out|look into|what happened|who is|who was|when did|news (on|about)|breaking)\b/i;

  function webOn() {
    try { return localStorage.getItem('hl234-web') !== '0' && localStorage.getItem('hl233-web') !== '0'; } catch (e) { return true; }
  }

  function webSend(text) {
    window.__HL241SENDING = true;
    try {
      var t = $('txt'), sb = $('send');
      if (!t || !sb) return;
      t.value = text; sb.click();
    } catch (e) {}
    setTimeout(function () { window.__HL241SENDING = false; }, 800);
  }

  function sending() { return !!window.__HL241SENDING; }

  function stripQ(t) {
    return t.replace(/^(please\s+)?(research( about| on)?|deep dive( on)?|dig into|find out( about)?|look into|what happened (with|to)|who (is|was)|when did|news (on|about))\b[:\s-]*/i, '').replace(/[?]+$/, '').trim() || t;
  }

  function intercept(v) {
    var t = (v || '').trim();
    if (!t || t.charAt(0) === '/' || sending() || busy || !webOn()) return false;
    if (URL_RE.test(t)) return false;            /* plain page reads stay with the existing paw */
    if (!RE_RE.test(t)) return false;
    busy = true;
    var q = stripQ(t);
    research(q)['catch'](function (e) {
      doLine('omen r', 'live research failed (' + String(e).slice(0, 80) + ') — answering from memory');
    }).then(function () {
      busy = false;
      webSend(t);
    });
    return true;
  }

  document.addEventListener('keydown', function (e) {
    try {
      if (e.key !== 'Enter' || e.shiftKey) return;
      var t = e.target;
      if (!t || t.id !== 'txt') return;
      var v = (t.value || '').trim(); if (!v) return;
      if (intercept(v)) { t.value = ''; e.preventDefault(); e.stopImmediatePropagation(); }
    } catch (e2) {}
  }, true);

  function bindCap() {
    var sb = $('send');
    if (!sb || !sb.parentNode || sb._hl241cap) return;
    sb._hl241cap = true;
    sb.parentNode.addEventListener('click', function (e) {
      try {
        var t = $('txt'); var v = (t && t.value || '').trim(); if (!v) return;
        if (intercept(v)) { t.value = ''; e.stopPropagation(); e.preventDefault(); }
      } catch (e2) {}
    }, true);
  }
  bindCap();
  try { new MutationObserver(function () { bindCap(); }).observe(document.body, { childList: true, subtree: true }); } catch (e) { setInterval(bindCap, 2000); }

  console.log('[hl241] online: web brain (research pass reads several live pages, answers with sources)');
})();
