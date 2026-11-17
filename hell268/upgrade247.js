/* ILLUMINATI upgrade #247: hl247-factcheck (v19.149)
   THE ASK: real, accurate answers - a fact-check mode.
   When a question asks to verify ("fact check", "is it true", "true or
   false", "verify", "real or fake", "did X really", "debunk"), two things
   happen before the relay request goes out:
   1. CROSS-CHECK SOURCE: one more independent source is fetched from a
      reworded claim query ("fact check" / "evidence" / "criticism"
      variant) and added to the material the answer is built from.
   2. VERDICT DISCIPLINE: the answering model is instructed to split its
      answer into key claims and tag each [VERIFIED] (2+ sources agree),
      [SINGLE SOURCE] (one source), or [UNVERIFIED] (none support it or
      sources conflict), end with a "COULD NOT VERIFY:" line, and never
      dress an unverified claim up as fact.
   Works two ways: with the research pipeline pending it rides the
   __HL241CTX seam (like hl245/hl246); with no research pass running it
   gathers its own sources and adds them to the outgoing message.
   Budget: one search + up to two reads, 8s caps.
   Guard: __HL247 */
(function () {
  if (window.__HL247) return; window.__HL247 = true;

  var PERPAGE = 6000, CHUNK = 900;
  var FC_RE = /fact[ -]?check|is it true|true or false|\bverify\b|real or fake|did .* really|debunk|actually true/i;

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

  var STOP = { this:1,that:1,with:1,from:1,have:1,about:1,what:1,when:1,where:1,which:1,who:1,was:1,were:1,will:1,would:1,could:1,should:1,their:1,there:1,than:1,then:1,they:1,been:1,into:1,over:1,after:1,before:1,while:1,year:1,years:1,more:1,most:1,also:1,just:1,like:1,some:1,such:1,only:1,very:1,much:1,many:1,make:1,made:1,tell:1,show:1,find:1,give:1,want:1,need:1,does:1,did:1,doing:1,because:1,against:1,between:1,through:1,during:1,above:1,below:1,again:1,further:1,once:1,here:1,why:1,how:1,all:1,any:1,both:1,each:1,few:1,other:1,own:1,same:1,too:1,can:1,get:1,got:1,your:1,you:1,please:1,research:1,fact:1,check:1,verify:1,true:1,actually:1,really:1,debunk:1,real:1,fake:1 };

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

  var DIR = '\n\nFACT-CHECK MODE ON: before answering, split your answer into its key claims. Tag each key claim [VERIFIED] when two or more sources above agree on it, [SINGLE SOURCE] when only one does, [UNVERIFIED] when no source supports it or the sources conflict. At the very end add one line starting "COULD NOT VERIFY:" naming anything left unverified, or "COULD NOT VERIFY: nothing" if every claim checked out. Never dress an unverified claim up as fact, and name the source behind each claim in plain words.';

  function pickVariant(q) {
    var v = ['fact check', 'evidence', 'criticism', 'analysis'];
    var h = 0; for (var i = 0; i < q.length; i++) h = (h + q.charCodeAt(i)) % 997;
    return v[h % v.length];
  }

  function blockHosts(block) {
    var host = {}, re = /SOURCE \w+: ?[^\n]*\n(https?:\/\/\S+)/g, m;
    while ((m = re.exec(block))) {
      host[m[1].replace(/[)\]]+$/, '').replace(/^https?:\/\//, '').split('/')[0]] = 1;
    }
    return host;
  }

  /* gather: one counter-query, up to `want` fresh sources, keyword excerpts */
  function gather(q, block, want) {
    var ks = keys(q);
    if (!ks.length) return Promise.resolve('');
    var variant = ks.join(' ') + ' ' + pickVariant(q);
    var host = block ? blockHosts(block) : {};
    return search(variant).then(function (hl) {
      hl.sort(function (a, b) { return hits(b.t + ' ' + b.url, ks) - hits(a.t + ' ' + a.url, ks); });
      var picked = [];
      for (var i = 0; i < hl.length && picked.length < want; i++) {
        var u = hl[i].url;
        if (/wikipedia\.org|\.pdf($|\?)|facebook\.com|twitter\.com|x\.com|instagram\.com|youtube\.com/i.test(u)) continue;
        if (host[u.replace(/^https?:\/\//, '').split('/')[0]]) continue;
        picked.push(u);
      }
      if (!picked.length) return '';
      return Promise.all(picked.map(function (u) {
        return readPage(u).then(function (t) { return { url: u, text: t }; })['catch'](function () { return null; });
      })).then(function (pages) {
        pages = (pages || []).filter(Boolean).filter(function (p) { return p.text && p.text.length > 200; });
        if (!pages.length) return '';
        var out = '';
        pages.forEach(function (p, i) {
          out += 'SOURCE F' + (i + 1) + ': ' + p.url + '\n' + windows(p.text, ks, 1) + '\n';
        });
        try { console.log('[hl247] fact-check source in: ' + pages.length + ' (counter query: ' + variant + ')'); } catch (e2) {}
        return out;
      });
    })['catch'](function () { return ''; });
  }

  var busy = false;
  var of = window.fetch;
  window.fetch = function (u, init) {
    try {
      var url = (typeof u === 'string') ? u : (u && u.url) || '';
      if (/pollinations\.ai|aihorde\.ai/.test(url) && init && init.method && String(init.method).toUpperCase() === 'POST' && !busy) {
        var q = '', lastUser = -1, b = null;
        try {
          b = JSON.parse(init.body);
          for (var i = (b.messages || []).length - 1; i >= 0; i--) {
            if (b.messages[i] && b.messages[i].role === 'user' && typeof b.messages[i].content === 'string') { q = b.messages[i].content; lastUser = i; break; }
          }
        } catch (e2) { b = null; }
        if (q && FC_RE.test(q)) {
          var c = window.__HL241CTX;
          if (c && typeof c.block === 'string' && c.uses > 0 && c.block.indexOf('LIVE WEB RESEARCH') >= 0 && c.block.indexOf('FACT-CHECK MODE') < 0) {
            /* ride the research seam: directive + counter source go into the block */
            busy = true;
            var self = this;
            return gather(q, c.block, 1).then(function (src) {
              busy = false;
              try { c.block += (src ? '\n\nCROSS-CHECK SOURCES fetched just now for fact-checking:\n' + src : '') + DIR; } catch (e3) {}
              return of.call(self, u, init);
            })['catch'](function () { busy = false; try { c.block += DIR; } catch (e4) {} return of.call(self, u, init); });
          }
          if (b && lastUser >= 0 && q.indexOf('FACT-CHECK MODE') < 0) {
            /* no research pass running: gather sources and add them to the message */
            busy = true;
            var self2 = this;
            return gather(q, null, 2).then(function (src) {
              busy = false;
              try {
                if (src) b.messages[lastUser].content += '\n\nLIVE SOURCES fetched just now to check this:\n' + src;
                b.messages[lastUser].content += DIR;
                init.body = JSON.stringify(b);
              } catch (e3) {}
              return of.call(self2, u, init);
            })['catch'](function () { busy = false; return of.call(self2, u, init); });
          }
        }
      }
    } catch (e) {}
    return of.apply(this, arguments);
  };

  console.log('[hl247] online: fact-check mode on (cross-check source + verdict labels on verify asks)');
})();
