/* ILLUMINATI upgrade #275: hl275-datapack (v19.181)
   "add more data to it for everything it would need"
   The brains only know what their training saw - no clock, no calendar, no
   fresh facts. This upgrade feeds every ask live data before it leaves the
   browser:
   (1) LIVE CLOCK: the current date, weekday and local time are injected into
       every cloud and forge ask, so "today", "yesterday" and time math work.
   (2) LIVE FACTS: when a message looks like a factual question (who / what /
       when / where / how many / define...), the page quietly pulls a
       Wikipedia summary and a DuckDuckGo instant answer for the topic and
       hands both to the brain as LIVE DATA. Cached 10 minutes per topic,
       6-second timeout, and it never blocks the reply if a source is slow or
       down - the ask ships with whatever arrived.
   (3) The forge (AI Horde) ask gets the clock too. Nothing removed.
   Guard: __HL275 */
(function () {
  if (window.__HL275) return; window.__HL275 = true;

  var cache = {}, lastQ = '', lastQAt = 0;

  function timeLine() {
    try {
      var d = new Date();
      var date = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      var time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      var tz = (Intl.DateTimeFormat && Intl.DateTimeFormat().resolvedOptions().timeZone) || 'local time';
      return 'LIVE DATA (current time): ' + date + ', ' + time + ' (' + tz + ').';
    } catch (e) { return 'LIVE DATA: clock unavailable.'; }
  }

  function factQ(t) {
    t = String(t || '').trim();
    if (!t || t.length > 400 || t.charAt(0) === '/') return false;
    return /\b(who|what|when|where|which|how many|how much|how old|define|definition|meaning of|tell me about|search|population|capital|born|died|history of|price of|temperature|weather)\b/i.test(t);
  }

  function topicOf(t) {
    t = String(t).trim().replace(/[?!.]+$/, '');
    if (t.length > 80) t = t.slice(0, 80);
    return t;
  }

  function fetchT(url, ms) {
    return new Promise(function (res) {
      var done = false, ctl = null;
      try { ctl = new AbortController(); } catch (e) {}
      var to = setTimeout(function () { if (!done) { done = true; try { ctl.abort(); } catch (e1) {} res(null); } }, ms);
      try {
        of(url, ctl ? { signal: ctl.signal } : undefined).then(function (r) {
          if (!r.ok) { if (!done) { done = true; clearTimeout(to); res(null); } return null; }
          return r.json();
        }).then(function (j) {
          if (done) return; done = true; clearTimeout(to); res(j || null);
        }).catch(function () { if (!done) { done = true; clearTimeout(to); res(null); } });
      } catch (e2) { if (!done) { done = true; clearTimeout(to); res(null); } }
    });
  }

  function wiki(q) {
    var url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrlimit=1&prop=extracts&exintro=1&explaintext=1&gsrsearch=' + encodeURIComponent(q);
    return fetchT(url, 6000).then(function (j) {
      try {
        var pages = j && j.query && j.query.pages;
        for (var k in pages) { var ex = pages[k] && pages[k].extract; if (ex) return String(ex).slice(0, 700); }
      } catch (e) {}
      return '';
    });
  }

  function ddg(q) {
    var target = 'https://api.duckduckgo.com/?q=' + encodeURIComponent(q) + '&format=json&no_html=1&skip_disambig=1';
    var url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(target);
    return fetchT(url, 6000).then(function (j) {
      try {
        var a = (j && (j.AbstractText || j.Abstract)) || '';
        if (!a && j && j.RelatedTopics && j.RelatedTopics.length) a = j.RelatedTopics[0].Text || '';
        return String(a).slice(0, 400);
      } catch (e) { return ''; }
    });
  }

  function liveBlock(userText) {
    var parts = [timeLine()];
    var t = String(userText || '').trim();
    if (!factQ(t)) return Promise.resolve(parts.join(' '));
    var key = topicOf(t).toLowerCase();
    var now = Date.now();
    if (t.toLowerCase() === lastQ && now - lastQAt < 60000) return Promise.resolve(parts.join(' '));
    lastQ = t.toLowerCase(); lastQAt = now;
    var hit = cache[key];
    if (hit && now - hit.t < 600000) {
      if (hit.wiki) parts.push('LIVE DATA (wikipedia): ' + hit.wiki);
      if (hit.ddg) parts.push('LIVE DATA (answers): ' + hit.ddg);
      return Promise.resolve(parts.join(' '));
    }
    return Promise.all([wiki(topicOf(t)), ddg(topicOf(t))]).then(function (r) {
      var w = String(r[0] || ''), d = String(r[1] || '');
      cache[key] = { t: now, wiki: w, ddg: d };
      if (w) parts.push('LIVE DATA (wikipedia): ' + w);
      if (d) parts.push('LIVE DATA (answers): ' + d);
      return parts.join(' ');
    });
  }

  var of = window.fetch;
  if (typeof of !== 'function' || of.__hl275) return;

  var wrapped = async function () {
    var a = Array.prototype.slice.call(arguments);
    var input = a[0], init = a[1];
    var url = (typeof input === 'string') ? input : (input && input.url) || '';

    try {
      if (init && init.method === 'POST' && typeof init.body === 'string') {
        if (url.indexOf('text.pollinations.ai/openai') > -1) {
          var b = JSON.parse(init.body);
          var msgs = b && b.messages;
          if (Array.isArray(msgs) && msgs.length && msgs[0] && msgs[0].role === 'system') {
            var sys = String(msgs[0].content || '');
            if (sys.indexOf('rewrite') === -1 && sys.indexOf('Extract durable') === -1) {
              var lastUser = '';
              for (var i = msgs.length - 1; i >= 0; i--) { if (msgs[i] && msgs[i].role === 'user') { lastUser = msgs[i].content; break; } }
              var block = await liveBlock(lastUser);
              msgs[0].content = sys + '\n\n' + block;
              a[1] = Object.assign({}, init, { body: JSON.stringify(b) });
            }
          }
        } else if (url.indexOf('/generate/text/async') > -1) {
          var h = JSON.parse(init.body);
          if (h && typeof h.prompt === 'string') {
            h.prompt = timeLine() + '\n' + h.prompt;
            a[1] = Object.assign({}, init, { body: JSON.stringify(h) });
          }
        }
      }
    } catch (e0) {}

    return of.apply(this, a);
  };
  wrapped.__hl275 = true;
  window.fetch = wrapped;
  try { console.log('[hl275] datapack online: live clock + live facts (wikipedia, answers) feed every ask'); } catch (e7) {}
})();
