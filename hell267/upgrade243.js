/* ILLUMINATI upgrade #243: hl243-websearch2 (v19.140)
   THE ASK: the web brain's search leg was dying (DuckDuckGo's html page through
   the proxy started returning 500s), so research mode sometimes fell back to
   memory with no live reads. This rebuilds the search under the same triggers:
   Bing RSS (clean machine-readable results) first, then DuckDuckGo html, then
   DuckDuckGo via the reader proxy, with Wikipedia always as the floor, and a
   25-second budget so it answers with whatever it gathered instead of hanging.
   Page reads, source naming, Enter + SEND capture all kept. Nothing removed.
   Guard: __HL243 */
(function () {
  if (window.__HL243) return; window.__HL243 = true;

  var MAXPAGES = 3, PERPAGE = 5000, MAXTOTAL = 15000, BUDGET = 25000;
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

  function stripCdata(s) {
    return String(s || '').replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /* 1. Bing RSS through the reader proxy: machine-readable results */
  function bingHits(q) {
    var inner = 'https://www.bing.com/search?q=' + encodeURIComponent(q) + '&format=rss&count=15';
    var u = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(inner);
    return tfetch(u, 10000).then(function (r) {
      if (!r.ok) throw new Error('search blocked');
      return r.text();
    }).then(function (x) {
      var items = String(x).match(/<item>[\s\S]*?<\/item>/g) || [];
      var out = [];
      for (var i = 0; i < items.length && out.length < 8; i++) {
        var t = stripCdata((/<title>([\s\S]*?)<\/title>/.exec(items[i]) || [])[1]);
        var l = String((/<link>([\s\S]*?)<\/link>/.exec(items[i]) || [])[1] || '').trim();
        var d = stripCdata((/<description>([\s\S]*?)<\/description>/.exec(items[i]) || [])[1]);
        if (l && /^https?:\/\//i.test(l) && l.indexOf('bing.com/search') < 0 && l.indexOf('bing.com:80/search') < 0) {
          out.push({ title: t, url: l, snip: d });
        }
      }
      if (!out.length) throw new Error('no results');
      return out;
    });
  }

  /* 2. DuckDuckGo html through the reader proxy (original leg) */
  function ddgHits(q) {
    var ddg = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q);
    var u = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(ddg);
    return tfetch(u, 10000).then(function (r) {
      if (!r.ok) throw new Error('search blocked');
      return r.text();
    }).then(function (h) {
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

  /* 3. DuckDuckGo through the jina reader: markdown link list */
  function jinaHits(q) {
    var u = 'https://r.jina.ai/https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q);
    return tfetch(u, 12000).then(function (r) {
      if (!r.ok) throw new Error('search blocked');
      return r.text();
    }).then(function (x) {
      var out = [], seen = {};
      var re = /\[([^\]]{4,140})\]\((https?:\/\/[^)\s]+)\)/g, m;
      while ((m = re.exec(x)) && out.length < 8) {
        var url = m[2], title = m[1];
        if (/duckduckgo\.com|jina\.ai|\/y\.js/.test(url) || seen[url]) continue;
        seen[url] = 1;
        out.push({ title: title, url: url, snip: '' });
      }
      if (!out.length) throw new Error('no results');
      return out;
    });
  }

  function searchWeb(q, t0) {
    return bingHits(q)['catch'](function () {
      if (Date.now() - t0 > BUDGET) throw new Error('no results');
      return ddgHits(q);
    })['catch'](function () {
      if (Date.now() - t0 > BUDGET) throw new Error('no results');
      return jinaHits(q);
    });
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

  function wikiText(q) {
    var u = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srlimit=3&srsearch=' + encodeURIComponent(q);
    return tfetch(u, 10000)
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var hits = (j.query && j.query.search) || [];
        if (!hits.length) throw new Error('no results');
        var titles = hits.map(function (h) { return h.title; });
        var u2 = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&explaintext=1&exintro=1&titles=' + encodeURIComponent(titles.join('|'));
        return tfetch(u2, 10000).then(function (r2) { return r2.json(); }).then(function (j2) {
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
    var t0 = Date.now();
    doLine('omen', 'research mode: searching the live web for "' + q + '"');
    return searchWeb(q, t0)['catch'](function () { return []; }).then(function (hits) {
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
      doLine('omen', 'read ' + rs.length + ' page' + (rs.length === 1 ? '' : 's') + ' — answering from the live web');
    });
  }

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

  /* DOCUMENT-level capture: survives every footer re-render */
  document.addEventListener('click', function (e) {
    try {
      var s = e.target && e.target.closest ? e.target.closest('#send') : null;
      if (!s) return;
      var t = $('txt'); var v = (t && t.value || '').trim(); if (!v) return;
      if (intercept(v)) { t.value = ''; e.preventDefault(); e.stopPropagation(); }
    } catch (e2) {}
  }, true);

  document.addEventListener('keydown', function (e) {
    try {
      if (e.key !== 'Enter' || e.shiftKey) return;
      var t = e.target;
      if (!t || t.id !== 'txt') return;
      var v = (t.value || '').trim(); if (!v) return;
      if (intercept(v)) { t.value = ''; e.preventDefault(); e.stopImmediatePropagation(); }
    } catch (e2) {}
  }, true);

  console.log('[hl243] online: web brain search hardened (bing rss -> ddg -> reader proxy -> wikipedia, 25s budget)');
})();
