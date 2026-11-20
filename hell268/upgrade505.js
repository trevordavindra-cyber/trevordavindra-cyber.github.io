/* ILLUMINATI upgrade 505 - NEWS DECK (hl505)
   Major capability: live news headlines inside the chat, fetched fresh.
   Say "news", "headlines" or "what's happening" and a LIVE NEWS panel opens
   under the message with the latest stories from BBC World, NPR and The
   Guardian, each with its source and a link out. Pulled through a free
   reader proxy straight from the newsrooms' own feeds, cached for 5 minutes
   so repeats land instantly, with a RELOAD button for a fresh pull.
   Purely additive.
*/
(function () {
  if (window.__HL505) return; window.__HL505 = true;

  var FEEDS = [
    ['BBC', 'https://feeds.bbci.co.uk/news/world/rss.xml'],
    ['NPR', 'https://feeds.npr.org/1001/rss.xml'],
    ['GUARDIAN', 'https://www.theguardian.com/world/rss']
  ];
  var cache = null, cacheAt = 0, TTL = 5 * 60 * 1000;

  function tfetch(url, ms) {
    var c = new AbortController();
    var t = setTimeout(function () { try { c.abort(); } catch (e) {} }, ms || 8000);
    return fetch(url, { signal: c.signal, cache: 'no-store' })['finally'](function () { clearTimeout(t); });
  }

  function grab(name, url) {
    return tfetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(url), 8000)
      .then(function (r) { if (!r.ok) throw new Error('blocked'); return r.text(); })
      .then(function (x) {
        var out = [];
        try {
          var d = new DOMParser().parseFromString(x, 'text/xml');
          var items = d.querySelectorAll('item');
          for (var i = 0; i < items.length && out.length < 5; i++) {
            var g = function (tag) { var e = items[i].querySelector(tag); return e ? (e.textContent || '').trim() : ''; };
            var t = g('title'), l = g('link'), d2 = g('pubDate');
            if (t && /^https?:\/\//.test(l)) out.push({ s: name, t: t, u: l, d: d2 ? Date.parse(d2) || 0 : 0 });
          }
        } catch (e2) {}
        return out;
      })['catch'](function () { return []; });
  }

  function load(bust) {
    if (!bust && cache && Date.now() - cacheAt < TTL) return Promise.resolve(cache);
    return Promise.all(FEEDS.map(function (f) { return grab(f[0], f[1]); })).then(function (groups) {
      var all = [], seen = {};
      groups.forEach(function (g) {
        g.forEach(function (it) {
          var k = (it.t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
          if (k && !seen[k]) { seen[k] = 1; all.push(it); }
        });
      });
      all.sort(function (a, b) { return (b.d || 0) - (a.d || 0); });
      all = all.slice(0, 10);
      cache = all; cacheAt = Date.now();
      return all;
    });
  }

  function panel(items) {
    var wrap = document.createElement('div');
    wrap.className = 'hl505news';
    wrap.style.cssText = 'margin:8px 0 4px 0;border:1px solid rgba(212,175,55,.4);border-radius:10px;overflow:hidden;background:#0a0a0a;';
    var bar = document.createElement('div');
    bar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:7px 10px;background:rgba(212,175,55,.08);';
    var lab = document.createElement('span');
    lab.textContent = 'LIVE NEWS - ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    lab.style.cssText = 'font-size:10px;letter-spacing:.12em;color:#c9b458;flex:1;';
    var rl = document.createElement('button'); rl.textContent = 'RELOAD';
    rl.style.cssText = 'padding:5px 10px;font-size:10px;border:1px solid rgba(212,175,55,.5);border-radius:6px;background:#141414;color:#e8cf7a;cursor:pointer;';
    rl.addEventListener('click', function () {
      lab.textContent = 'LIVE NEWS - pulling';
      load(true).then(function (fresh) { build(fresh, body); lab.textContent = 'LIVE NEWS - ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); });
    });
    bar.appendChild(lab); bar.appendChild(rl);
    var body = document.createElement('div'); body.style.cssText = 'padding:4px 10px 10px 10px;';
    wrap.appendChild(bar); wrap.appendChild(body);
    build(items, body);
    return wrap;
  }

  function build(items, body) {
    body.textContent = '';
    if (!items || !items.length) {
      var m = document.createElement('div');
      m.textContent = 'the news feeds did not answer just now. tap RELOAD or try again in a minute.';
      m.style.cssText = 'font-size:12px;color:#9a8a55;padding:8px 2px;';
      body.appendChild(m);
      return;
    }
    items.forEach(function (it) {
      var row = document.createElement('div');
      row.style.cssText = 'padding:7px 0;border-top:1px solid rgba(212,175,55,.12);';
      var a = document.createElement('a');
      a.href = it.u; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = it.t;
      a.style.cssText = 'display:block;font-size:13px;line-height:1.35;color:#e8dfc8;text-decoration:none;';
      var src = document.createElement('div');
      src.textContent = it.s + (it.d ? ' - ' + new Date(it.d).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '');
      src.style.cssText = 'font-size:9px;letter-spacing:.1em;color:#8a7b4d;margin-top:3px;';
      row.appendChild(a); row.appendChild(src);
      body.appendChild(row);
    });
  }

  function scan() {
    try {
      var chat = document.getElementById('chat') || document.querySelector('main') || document.body;
      var kids = chat.children;
      for (var i = 0; i < kids.length; i++) {
        var n = kids[i];
        if (n.classList && n.classList.contains('hl505news')) continue;
        var nx = n.nextElementSibling;
        if (nx && nx.classList && nx.classList.contains('hl505news')) continue;
        var txt = ''; try { txt = n.textContent || ''; } catch (e2) {}
        if (txt.length > 2000 || !/\b(news|headlines|what'?s happening)\b/i.test(txt)) continue;
        var p = document.createElement('div');
        p.className = 'hl505news';
        p.style.cssText = 'margin:8px 0 4px 0;padding:8px 10px;font-size:11px;letter-spacing:.08em;color:#c9b458;border:1px solid rgba(212,175,55,.3);border-radius:10px;background:#0a0a0a;';
        p.textContent = 'LIVE NEWS - pulling the latest';
        if (n.parentNode) n.parentNode.insertBefore(p, n.nextSibling); else chat.appendChild(p);
        (function (ph) {
          load(false).then(function (items) {
            var real = panel(items);
            if (ph.parentNode) ph.parentNode.replaceChild(real, ph);
          });
        })(p);
        try { console.log('[hl505] news deck opened'); } catch (e3) {}
      }
    } catch (e4) {}
  }
  var tmr = null;
  function kick() { if (tmr) return; tmr = setTimeout(function () { tmr = null; scan(); }, 400); }
  function arm() {
    var c = document.getElementById('chat') || document.querySelector('main');
    if (c && !arm.done) { arm.done = true; new MutationObserver(kick).observe(c, { childList: true, subtree: true, characterData: true }); }
  }
  arm(); setInterval(arm, 2000); setInterval(scan, 2500);

  try { console.log('[hl505] news deck online: say "news" for live headlines from bbc, npr and the guardian'); } catch (e5) {}
})();
