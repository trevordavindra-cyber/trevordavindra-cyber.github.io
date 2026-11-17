/* ILLUMINATI upgrade #234: hl234-webpaw3 (v19.132)
   THE ASK: make the web access better. WEB PAW v3, full rewrite on the same
   real seams (window.fetch + DOM), supersedes hl233 in this build:
   - deeper reads: up to 9000 chars of a page, 15s timeout so a hung read
     can never stall a run
   - real search results with links: DuckDuckGo titles + snippets + URLs,
     Wikipedia fallback direct (no proxy needed), jina fallback under that
   - the fetched content rides inside the relay request itself, so the chat
     stays clean; context stays good for several follow-up answers
   - in auto runs the AI can now ask for a page OR a search: it ends a reply
     with WEB NEED: <url> or WEB SEARCH: <query> and the paw fetches it and
     hands it the content, then it continues (capped, no loops)
   - toggle /web on|off (default on); /web <url> reads a page;
     /web <question> searches
   Guard: __HL234 */
(function () {
  if (window.__HL234) return; window.__HL234 = true;

  var MAXREAD = 9000;
  var webOn = true;
  try { webOn = localStorage.getItem('hl233-web') !== '0' && localStorage.getItem('hl234-web') !== '0'; } catch (e) {}
  var ctx = null, doneKeys = {}, inflight = false, followups = 0;

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
    var t = setTimeout(function () { try { c.abort(); } catch (e) {} }, ms || 15000);
    return fetch(url, { signal: c.signal })['finally'](function () { clearTimeout(t); });
  }

  function clean(t) {
    try {
      t = String(t || '');
      t = t.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
      t = t.replace(/<nav[\s\S]*?<\/nav>/gi, ' ').replace(/<footer[\s\S]*?<\/footer>/gi, ' ');
      if (/<[a-z][\s\S]*>/i.test(t)) t = t.replace(/<[^>]+>/g, ' ');
      t = t.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
      return t.slice(0, MAXREAD);
    } catch (e) { return ''; }
  }

  function fetchPage(url) {
    var path = url.replace(/^https?:\/\//, '');
    return tfetch('https://r.jina.ai/' + path)
      .then(function (r) { if (!r.ok) throw new Error('read blocked'); return r.text(); })
      .catch(function () {
        return tfetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(url))
          .then(function (r) { if (!r.ok) throw new Error('read blocked'); return r.text(); });
      })
      .then(clean);
  }

  function wikiSearch(q) {
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
                var ex = String(pages[k].extract || '').slice(0, 1400);
                if (ex) out.push('WIKIPEDIA — ' + ti + ':\n' + ex);
                break;
              }
            }
          });
          if (!out.length) throw new Error('no results');
          return out.join('\n\n').slice(0, MAXREAD);
        });
      });
  }

  function ddgSearch(q) {
    var ddg = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q);
    return tfetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(ddg))
      .then(function (r) { if (!r.ok) throw new Error('search blocked'); return r.text(); })
      .then(function (h) {
        var out = [];
        try {
          var doc = new DOMParser().parseFromString(h, 'text/html');
          var rows = doc.querySelectorAll('.result');
          for (var i = 0; i < rows.length && out.length < 6; i++) {
            var a = rows[i].querySelector('a.result__a'), s = rows[i].querySelector('.result__snippet');
            if (a) {
              var href = a.getAttribute('href') || '';
              var m = /uddg=([^&]+)/.exec(href);
              if (m) { try { href = decodeURIComponent(m[1]); } catch (e2) {} }
              if (href && href.indexOf('//') === 0) href = 'https:' + href;
              out.push((out.length + 1) + '. ' + (a.textContent || '').trim() + ' — ' + href + ((s && s.textContent) ? '\n   ' + s.textContent.trim() : ''));
            }
          }
        } catch (e3) {}
        if (!out.length) {
          String(h).split('\n').forEach(function (ln) {
            ln = ln.replace(/<[^>]+>/g, ' ').trim();
            if (ln.length > 40 && out.length < 6) out.push(ln.slice(0, 220));
          });
        }
        if (!out.length) throw new Error('no results');
        return out.join('\n').slice(0, MAXREAD);
      });
  }

  function searchWeb(q) {
    return ddgSearch(q).catch(function () { return wikiSearch(q); })
      .catch(function () {
        return tfetch('https://r.jina.ai/https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q))
          .then(function (r) { if (!r.ok) throw new Error('search blocked'); return r.text(); })
          .then(clean);
      });
  }

  /* the injection seam: fetched web context rides inside the relay request body */
  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      if (ctx && ctx.uses > 0 && init && typeof init.body === 'string') {
        var u = (typeof input === 'string') ? input : (input && input.url) || '';
        if (/pollinations\.ai|aihorde\.ai/.test(u)) {
          var block = '\n\n[WEB CONTEXT — live web read of ' + ctx.url + ']\n' + ctx.text + '\n[end web context] Use the above live web content as your source; cite the page when you use it.';
          var b = JSON.parse(init.body);
          var hit = false;
          if (b && b.messages && b.messages.length) {
            for (var i = b.messages.length - 1; i >= 0; i--) {
              if (b.messages[i] && b.messages[i].role === 'user') { b.messages[i].content = String(b.messages[i].content || '') + block; hit = true; break; }
            }
          } else if (b && typeof b.prompt === 'string') { b.prompt += block; hit = true; }
          if (hit) { init.body = JSON.stringify(b); ctx.uses--; if (ctx.uses <= 0) ctx = null; }
        }
      }
    } catch (e) {}
    return of.apply(this, arguments);
  };

  var URL_RE = /https?:\/\/[^\s<>"')]+/i;
  var SEARCH_RE = /\b(search|look ?up|google|find online|latest news|news on)\b/i;

  function save() { try { localStorage.setItem('hl234-web', webOn ? '1' : '0'); } catch (e) {} }

  function webSend(text) {
    try {
      var t = $('txt'), sb = $('send');
      if (!t || !sb) return;
      t.value = text; sb.click();
    } catch (e) {}
  }

  function webFetch(x, isCmd) {
    if (inflight) { if (!isCmd) setTimeout(function () { webFetch(x, isCmd); }, 2500); return; }
    inflight = true;
    var um = URL_RE.exec(x), p;
    if (um) {
      var url = um[0];
      doLine('omen', 'reading the web: ' + url);
      p = fetchPage(url).then(function (txt) {
        ctx = { url: url, text: txt, uses: 4 };
        doLine('omen', 'page read: ' + url + ' (' + txt.length + ' chars) — answering from the live page');
      });
    } else {
      var q = x.replace(SEARCH_RE, '').replace(/^(for|about|up|the)\s+/i, '').trim() || x;
      doLine('omen', 'searching the web: ' + q);
      p = searchWeb(q).then(function (txt) {
        ctx = { url: 'web search: ' + q, text: txt, uses: 3 };
        doLine('omen', 'web results in for "' + q + '" — answering from the live results');
      });
    }
    p.catch(function (e) { doLine('omen r', 'the web read failed: ' + String(e).slice(0, 90)); })
      .then(function () { inflight = false; if (!isCmd) webSend(x); });
  }

  function handle(v) {
    var t = (v || '').trim();
    if (t.charAt(0) === '/') {
      var m = /^\/web\b\s*(on|off)?\s*([\s\S]*)$/i.exec(t);
      if (!m) return false;
      var a = (m[1] || '').toLowerCase(), rest = (m[2] || '').trim();
      if (a === 'on') { webOn = true; save(); doLine('omen', 'WEB PAW on: give it links or ask it to look things up.'); }
      else if (a === 'off') { webOn = false; ctx = null; save(); doLine('omen', 'WEB PAW off.'); }
      else if (rest) { webFetch(rest, true); }
      else doLine('omen', webOn ? 'WEB PAW is on. /web <url> reads a page, /web <question> searches the live web.' : 'WEB PAW is off. /web on enables.');
      return true;
    }
    if (!webOn || inflight) return false;
    var um = URL_RE.exec(t);
    if (um) { webFetch(t, false); return true; }
    if (SEARCH_RE.test(t) && t.length > 8) { webFetch(t, false); return true; }
    return false;
  }

  document.addEventListener('keydown', function (e) {
    try {
      if (e.key !== 'Enter' || e.shiftKey) return;
      var t = e.target;
      if (!t || t.id !== 'txt') return;
      var v = (t.value || '').trim(); if (!v) return;
      if (handle(v)) { t.value = ''; e.preventDefault(); e.stopImmediatePropagation(); }
      else if (v.charAt(0) !== '/') followups = 0;
    } catch (e2) {}
  }, true);

  function bindCap() {
    var sb = $('send');
    if (!sb || !sb.parentNode || sb._hl234cap) return;
    sb._hl234cap = true;
    sb.parentNode.addEventListener('click', function (e) {
      try {
        var t = $('txt'); var v = (t && t.value || '').trim();
        if (!v) return;
        if (handle(v)) { t.value = ''; e.stopPropagation(); e.preventDefault(); }
        else if (v.charAt(0) !== '/') followups = 0;
      } catch (e2) {}
    }, true);
  }
  bindCap();
  try { new MutationObserver(function () { bindCap(); }).observe(document.body, { childList: true, subtree: true }); } catch (e) { setInterval(bindCap, 2000); }

  /* WEB NEED / WEB SEARCH: the AI asks for a page or a search mid-task; this reads it and continues */
  function busyNow() {
    var st = $('st-state'); if (!st) return true;
    var s = (st.textContent || '').toUpperCase();
    return s.indexOf('WORKING') >= 0 || s.indexOf('FORGING') >= 0;
  }
  setInterval(function () {
    try {
      if (!webOn || inflight || busyNow()) return;
      var ls = document.querySelectorAll('#chat .line.imp');
      if (!ls.length) return;
      var b = ls[ls.length - 1].querySelector('.lbody') || ls[ls.length - 1];
      var txt = b.textContent || '';
      var m = /WEB NEED:\s*(https?:\/\/\S+|[\w.-]+\.[a-z]{2,}\S*)/i.exec(txt);
      var m2 = /WEB SEARCH:\s*([^\n]{3,120})/i.exec(txt);
      var key = null, act = null;
      if (m) {
        var u = /^https?:/i.test(m[1]) ? m[1] : 'https://' + m[1];
        key = u; act = function () { return fetchPage(u).then(function (t2) { ctx = { url: u, text: t2, uses: 3 }; }); };
        doLine('omen', 'reading the page it asked for: ' + u);
      } else if (m2) {
        var q = m2[1].trim(); key = 'search: ' + q;
        act = function () { return searchWeb(q).then(function (t2) { ctx = { url: 'web search: ' + q, text: t2, uses: 3 }; }); };
        doLine('omen', 'running the search it asked for: ' + q);
      }
      if (!act || doneKeys[key] || followups >= 3) return;
      doneKeys[key] = 1; followups++;
      inflight = true;
      act().then(function () { doLine('omen', 'web read done — continuing with it'); })
        .catch(function (e) { doLine('omen r', 'that web read failed: ' + String(e).slice(0, 90)); })
        .then(function () { inflight = false; webSend('(continuing the task with the web content now loaded)'); });
    } catch (e) {}
  }, 3000);

  console.log('[hl234] online: WEB PAW v3 (deep reads, search with links + wikipedia fallback, /web <url|question>, WEB NEED + WEB SEARCH in runs)');
})();