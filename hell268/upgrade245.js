/* ILLUMINATI upgrade #245: hl245-onpar (v19.147)
   THE ASK: make the AI on par with a real assistant on the web.
   What it adds, purely on top of the existing web brain (nothing removed):
   1. DEEP READS: after the live research pass reads its sources, this rides
      the same injection seam and goes one level deeper - it follows up to 2
      links inside the sources that match the question's keywords, reads them
      through the same reader proxy, and appends a DEEP READS section to the
      research brief, capped by a 12s budget so the answer still lands fast.
   2. SESSION MEMORY OF READS: what was read in earlier research rounds this
      session is carried along as WHAT YOU READ EARLIER, so follow-up
      questions can lean on the whole session's research, not one round.
   The seam: the research brief lives in __HL241CTX before the relay request
   goes out; this enriches that object in place, so the existing injector
   delivers everything and no request is sent twice. Guard: __HL245 */
(function () {
  if (window.__HL245) return; window.__HL245 = true;

  var MAXHOPS = 2, PERPAGE = 3500, DEEPBUDGET = 12000;

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

  var STOP = { this:1,that:1,with:1,from:1,have:1,about:1,what:1,when:1,where:1,which:1,who:1,was:1,were:1,will:1,would:1,could:1,should:1,their:1,there:1,than:1,then:1,they:1,been:1,into:1,over:1,after:1,before:1,while:1,year:1,years:1,more:1,most:1,also:1,just:1,like:1,some:1,such:1,only:1,very:1,much:1,many:1,make:1,made:1,tell:1,show:1,find:1,give:1,want:1,need:1,does:1,did:1,doing:1,because:1,against:1,between:1,through:1,during:1,above:1,below:1,again:1,further:1,once:1,here:1,why:1,how:1,all:1,any:1,both:1,each:1,few:1,other:1,own:1,same:1,too:1,can:1,get:1,got:1,your:1,you:1 };

  function keys(q) {
    var w = String(q || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
      .filter(function (x) { return x.length > 3 && !STOP[x]; });
    return w.slice(0, 6);
  }

  function readPage(url, cap) {
    return tfetch('https://r.jina.ai/' + url, 8000)
      .then(function (r) { if (!r.ok) throw new Error('blocked'); return r.text(); })
      .then(function (t) { return { url: url, text: clean(t).slice(0, cap || PERPAGE) }; })
      ['catch'](function () { return null; });
  }

  function deepen(block, q) {
    var t0 = Date.now();
    var urls = [], m;
    var re = /SOURCE \d+: ?[^\n]*\n(https?:\/\/\S+)/g;
    while ((m = re.exec(block)) && urls.length < 3) urls.push(m[1]);
    urls = urls.filter(function (u) { return !/wikipedia\.org/i.test(u); }).slice(0, 2);
    if (!urls.length) return Promise.resolve(null);

    var ks = keys(q), used = 0;
    function rd(u, cap) {
      if (Date.now() - t0 > DEEPBUDGET || used >= MAXHOPS + 2) return Promise.resolve(null);
      used++;
      return readPage(u, cap);
    }

    return Promise.all(urls.map(function (u) { return rd(u, PERPAGE); })).then(function (pages) {
      pages = pages.filter(Boolean);
      /* one hop deeper: follow links inside the sources whose anchor text or
         url matches the question's keywords */
      var hops = [];
      pages.forEach(function (p) {
        var re2 = /\[([^\]]{3,80})\]\((https?:\/\/[^)\s]+)\)/g, mm, n = 0;
        while ((mm = re2.exec(p.text)) && n < 14 && hops.length < MAXHOPS) {
          var hay = (mm[1] + ' ' + mm[2]).toLowerCase(); n++;
          for (var i = 0; i < ks.length; i++) {
            if (hay.indexOf(ks[i]) >= 0 && !/wikipedia\.org|\.pdf($|\?)|facebook\.com|twitter\.com|x\.com|instagram\.com|youtube\.com/i.test(mm[2])) { hops.push(mm[2]); break; }
          }
        }
      });
      hops = hops.filter(function (u, i) { return hops.indexOf(u) === i && urls.indexOf(u) < 0; }).slice(0, MAXHOPS);
      var hpPromise = hops.length ? Promise.all(hops.map(function (u) { return rd(u, 3000); })) : Promise.resolve([]);
      return hpPromise.then(function (hp) {
        var all = pages.concat(hp.filter(Boolean));
        if (!all.length) return null;
        var extra = '\n\nDEEP READS - pages followed from those sources just now:\n';
        var tot = 0;
        all.forEach(function (r, i) {
          var t = r.text.slice(0, Math.max(800, PERPAGE + 500 - tot));
          tot += t.length;
          extra += 'DEEP SOURCE ' + (i + 1) + ': ' + r.url + '\n' + t + '\n';
        });
        extra += '[end deep reads] These came from following links inside the sources above. Use them when they answer the question better; still name your sources in plain words.';
        return extra;
      });
    });
  }

  var busy = false;
  var of = window.fetch;
  window.fetch = function (u, init) {
    try {
      var url = (typeof u === 'string') ? u : (u && u.url) || '';
      var c = window.__HL241CTX;
      if (/pollinations\.ai|aihorde\.ai/.test(url) && init && init.method && String(init.method).toUpperCase() === 'POST' && !busy &&
          c && typeof c.block === 'string' && c.uses > 0 && c.block.indexOf('DEEP READS') < 0) {
        var q = '';
        try {
          var b = JSON.parse(init.body);
          for (var i = (b.messages || []).length - 1; i >= 0; i--) {
            if (b.messages[i] && b.messages[i].role === 'user' && typeof b.messages[i].content === 'string') { q = b.messages[i].content; break; }
          }
        } catch (e2) {}
        busy = true;
        var self = this;
        return deepen(c.block, q).then(function (extra) {
          busy = false;
          try {
            /* session memory: keep what was read this session, feed it back */
            var mem = window.__HL245MEM || [];
            if (extra) {
              mem.push({ q: String(q).slice(0, 120), head: extra.slice(0, 2400) });
              while (mem.length > 3) mem.shift();
              window.__HL245MEM = mem;
            }
            if (mem.length > 1) {
              var prev = '\n\nWHAT YOU READ EARLIER THIS SESSION (older research rounds, may help):\n';
              mem.slice(0, -1).forEach(function (m, j) { prev += 'ROUND ' + (j + 1) + ' on "' + m.q + '": ' + m.head + '\n'; });
              c.block += prev;
            }
            if (extra) c.block += extra;
          } catch (e3) {}
          return of.call(self, u, init);
        })['catch'](function () { busy = false; return of.call(self, u, init); });
      }
    } catch (e) {}
    return of.apply(this, arguments);
  };

  console.log('[hl245] online: deep reads on (follows links inside sources, remembers what it read across the convo)');
})();
