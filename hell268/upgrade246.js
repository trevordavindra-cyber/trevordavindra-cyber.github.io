/* ILLUMINATI upgrade #246: hl246-deepmind (v19.148)
   THE ASK: make the research pass genuinely good, not just present.
   Adds three quality passes, all additive on the same seam as hl245
   (enriching the pending research brief in __HL241CTX before the relay
   request goes out; the existing injector delivers it, nothing re-sent):
   1. SECOND SEARCH PASS: the question is reworded to its keyword core and
      searched again (Bing RSS, DDG fallback). Sources the first pass missed
      get read and added as EXTRA SOURCES, ranked by keyword overlap.
   2. SMART EXCERPTS: instead of keeping the top of each page, the text is
      cut into chunks and the chunks densest in the question's keywords are
      kept, so the brief carries the part of each page that answers the
      question, not its intro.
   3. DISAGREEMENT FLAG: the brief now tells the model to say so plainly
      when sources disagree, instead of averaging silently.
   Budget: one search + two reads, 8s caps, so the answer still lands fast.
   Guard: __HL246 */
(function () {
  if (window.__HL246) return; window.__HL246 = true;

  var PERPAGE = 6000, CHUNK = 900;

  function tfetch(url, ms) {
    var c = new AbortController();
    var t = setTimeout(function () { try { c.abort(); } catch (e) {} }, ms || 8000);
    return fetch(url, { signal: c.signal })['finally'](function () { clearTimeout(t); });
  }

  function clean(t) {
    return String(t || '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ').trim();
  }

  var STOP = { this:1,that:1,with:1,from:1,have:1,about:1,what:1,when:1,where:1,which:1,who:1,was:1,were:1,will:1,would:1,could:1,should:1,their:1,there:1,than:1,then:1,they:1,been:1,into:1,over:1,after:1,before:1,while:1,year:1,years:1,more:1,most:1,also:1,just:1,like:1,some:1,such:1,only:1,very:1,much:1,many:1,make:1,made:1,tell:1,show:1,find:1,give:1,want:1,need:1,does:1,did:1,doing:1,because:1,against:1,between:1,through:1,during:1,above:1,below:1,again:1,further:1,once:1,here:1,why:1,how:1,all:1,any:1,both:1,each:1,few:1,other:1,own:1,same:1,too:1,can:1,get:1,got:1,your:1,you:1,please:1,research:1 };

  function keys(q) {
    return String(q || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
      .filter(function (x) { return x.length > 3 && !STOP[x]; }).slice(0, 6);
  }

  function hits(s, ks) {
    s = String(s || '').toLowerCase();
    var n = 0;
    for (var i = 0; i < ks.length; i++) if (s.indexOf(ks[i]) >= 0) n++;
    return n;
  }

  /* smart excerpts: best keyword-dense chunks instead of the top of the page */
  function windows(text, ks, want) {
    var t = String(text || '');
    var out = [], chunks = [];
    for (var i = 0; i < t.length; i += CHUNK) {
      var c = t.slice(i, i + CHUNK + 60);
      if (c.length < 120) break;
      chunks.push({ s: c, n: hits(c, ks) });
    }
    chunks.sort(function (a, b) { return b.n - a.n; });
    for (var j = 0; j < chunks.length && out.length < want; j++) {
      if (chunks[j].n > 0) out.push(chunks[j].s);
    }
    if (!out.length && chunks.length) out.push(chunks[0].s);
    return out.join(' ... ');
  }

  function bing(q) {
    return tfetch('https://www.bing.com/search?q=' + encodeURIComponent(q) + '&format=rss&count=10', 8000)
      .then(function (r) { return r.text(); })
      .then(function (x) {
        var out = [], it, re = /<item>([\s\S]*?)<\/item>/g;
        while ((it = re.exec(x)) && out.length < 8) {
          var b = it[1], tt = /<title>([\s\S]*?)<\/title>/.exec(b), ll = /<link>([\s\S]*?)<\/link>/.exec(b);
          if (tt && ll && /^https?:\/\//.test(ll[1].trim())) out.push({ t: tt[1], url: ll[1].trim() });
        }
        return out;
      });
  }

  function ddg(q) {
    var u = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q));
    return tfetch(u, 8000).then(function (r) { return r.text(); }).then(function (h) {
      var out = [], m, re = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
      while ((m = re.exec(h)) && out.length < 8) {
        var url = m[1];
        var dd = /uddg=([^&]+)/.exec(url);
        if (dd) url = decodeURIComponent(dd[1]);
        if (/^https?:\/\//.test(url)) out.push({ t: m[2].replace(/<[^>]+>/g, ' '), url: url });
      }
      return out;
    });
  }

  function search(q) {
    return bing(q)['catch'](function () { return ddg(q)['catch'](function () { return []; }); });
  }

  function readPage(url) {
    return tfetch('https://r.jina.ai/' + url, 8000)
      .then(function (r) { if (!r.ok) throw new Error('blocked'); return r.text(); })
      .then(function (t) { return clean(t).slice(0, PERPAGE); });
  }

  function enrich(block, q) {
    var ks = keys(q);
    if (!ks.length) return Promise.resolve(null);
    var variant = ks.join(' ');
    var have = [];
    var re = /SOURCE \d+: ?[^\n]*\n(https?:\/\/\S+)/g, m;
    while ((m = re.exec(block))) have.push(m[1].replace(/[)\]]+$/, ''));
    var host = {};
    have.forEach(function (u) { host[u.replace(/^https?:\/\//, '').split('/')[0]] = 1; });

    return search(variant).then(function (hitList) {
      /* rank by keyword overlap, skip sources the first pass already read */
      hitList.sort(function (a, b) { return hits(b.t + ' ' + b.url, ks) - hits(a.t + ' ' + a.url, ks); });
      var picked = [];
      for (var i = 0; i < hitList.length && picked.length < 2; i++) {
        var u = hitList[i].url;
        if (have.indexOf(u) >= 0) continue;
        if (/wikipedia\.org|\.pdf($|\?)|facebook\.com|twitter\.com|x\.com|instagram\.com|youtube\.com/i.test(u)) continue;
        if (host[u.replace(/^https?:\/\//, '').split('/')[0]]) continue;
        picked.push(u);
      }
      if (!picked.length) return null;
      return Promise.all(picked.map(function (u) {
        return readPage(u).then(function (t) { return { url: u, text: t }; })['catch'](function () { return null; });
      }));
    }).then(function (pages) {
      pages = (pages || []).filter(Boolean).filter(function (p) { return p.text && p.text.length > 200; });
      if (!pages.length) return null;
      var extra = '\n\nEXTRA SOURCES - a second search pass reworded as "' + variant + '" just now:\n';
      pages.forEach(function (p, i) {
        extra += 'SOURCE E' + (i + 1) + ': ' + p.url + '\n' + windows(p.text, ks, 2) + '\n';
      });
      extra += '[end extra sources] If these cover the question better than the sources above, say so and use them. If any source contradicts another, say so plainly instead of blending them. Still name your sources in plain words.';
      try { console.log('[hl246] extra sources added: ' + pages.length + ' (reworded: ' + variant + ')'); } catch (e2) {}
      return extra;
    });
  }

  var busy = false;
  var of = window.fetch;
  window.fetch = function (u, init) {
    try {
      var url = (typeof u === 'string') ? u : (u && u.url) || '';
      var c = window.__HL241CTX;
      if (/pollinations\.ai|aihorde\.ai/.test(url) && init && init.method && String(init.method).toUpperCase() === 'POST' && !busy &&
          c && typeof c.block === 'string' && c.uses > 0 && c.block.indexOf('EXTRA SOURCES') < 0 && c.block.indexOf('LIVE WEB RESEARCH') >= 0) {
        var q = '';
        try {
          var b = JSON.parse(init.body);
          for (var i = (b.messages || []).length - 1; i >= 0; i--) {
            if (b.messages[i] && b.messages[i].role === 'user' && typeof b.messages[i].content === 'string') { q = b.messages[i].content; break; }
          }
        } catch (e2) {}
        busy = true;
        var self = this;
        return enrich(c.block, q).then(function (extra) {
          busy = false;
          try { if (extra) c.block += extra; } catch (e3) {}
          return of.call(self, u, init);
        })['catch'](function () { busy = false; return of.call(self, u, init); });
      }
    } catch (e) {}
    return of.apply(this, arguments);
  };

  console.log('[hl246] online: research deepmind on (second search pass, keyword-ranked sources, smart excerpts, disagreement flag)');
})();
