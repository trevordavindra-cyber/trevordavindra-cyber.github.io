/* ILLUMINATI upgrade #231: hl231-webpaw (v19.130)
   THE ASK: the AI can work the internet. WEB PAW: give it a link and it
   reads the page live (r.jina.ai text read, allorigins raw fallback) and
   answers from the real page. Ask it to search ("search", "look up",
   "latest on...") and it pulls live web results and answers from those.
   Read pages stay in context for a few turns. In an AUTO run the AI can
   also ask for a page itself by writing WEB NEED: <url> and the next step
   reads it. Toggle: /web on|off (default on). Existing functionality
   untouched. Guard: __HL231 */
(function () {
  if (window.__HL231) return; window.__HL231 = true;

  var MAXREAD = 4200, MAXALL = 6400, MARK = '[WEB CONTEXT';
  if (typeof S !== 'undefined' && S && typeof S.web === 'undefined') S.web = 1;

  function say(c, t) { try { line(c, t); } catch (e) {} }
  function log(t) { try { feed(t, 'live'); } catch (e) {} }

  function clean(t) {
    try {
      t = String(t || '');
      t = t.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
      if (/<[a-z][\s\S]*>/i.test(t)) t = t.replace(/<[^>]+>/g, ' ');
      t = t.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
      return t.slice(0, MAXREAD);
    } catch (e) { return ''; }
  }

  function fetchPage(url) {
    var path = url.replace(/^https?:\/\//, '');
    return fetch('https://r.jina.ai/' + path)
      .then(function (r) { if (!r.ok) throw new Error('read blocked'); return r.text(); })
      .catch(function () {
        return fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(url))
          .then(function (r) { if (!r.ok) throw new Error('read blocked'); return r.text(); });
      })
      .then(clean);
  }

  function searchWeb(q) {
    var ddg = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q);
    return fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(ddg))
      .then(function (r) { if (!r.ok) throw new Error('search blocked'); return r.text(); })
      .then(function (h) {
        var out = [];
        try {
          var doc = new DOMParser().parseFromString(h, 'text/html');
          var rows = doc.querySelectorAll('.result');
          for (var i = 0; i < rows.length && out.length < 5; i++) {
            var a = rows[i].querySelector('a.result__a'), s = rows[i].querySelector('.result__snippet');
            if (a) out.push((out.length + 1) + '. ' + (a.textContent || '').trim() + ((s && s.textContent) ? ' — ' + s.textContent.trim() : ''));
          }
        } catch (e) {}
        if (!out.length) {
          String(h).split('\n').forEach(function (ln) {
            ln = ln.replace(/<[^>]+>/g, ' ').trim();
            if (ln.length > 40 && out.length < 5) out.push(ln.slice(0, 220));
          });
        }
        if (!out.length) throw new Error('no results');
        return out.join('\n').slice(0, MAXREAD);
      })
      .catch(function () {
        return fetch('https://r.jina.ai/https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q))
          .then(function (r) { if (!r.ok) throw new Error('search blocked'); return r.text(); })
          .then(clean);
      });
  }

  var bag = [], doneUrls = {};

  function lastAssistant() {
    try { for (var i = hist.length - 1; i >= 0; i--) { if (hist[i] && hist[i].role === 'assistant') return hist[i].content || ''; } } catch (e) {}
    return '';
  }

  function blockFor(url, text) { return '\n\n' + MARK + ' — live fetch of ' + url + ']\n' + text + '\n[end web context]'; }

  function bagAdd(url, text, uses) {
    try {
      for (var i = 0; i < bag.length; i++) { if (bag[i].url === url) { bag[i].text = text; bag[i].uses = uses; return; } }
      bag.push({ url: url, text: text, uses: uses || 3 });
    } catch (e) {}
  }

  async function augment(user) {
    try {
      if (!S.web || typeof user !== 'string' || user.indexOf(MARK) >= 0) return user;
      var m = /WEB NEED:\s*(https?:\/\/\S+|[\w.-]+\.[a-z]{2,}\S*)/i.exec(lastAssistant());
      if (m && !doneUrls[m[1]]) {
        doneUrls[m[1]] = 1;
        var u = /^https?:/i.test(m[1]) ? m[1] : 'https://' + m[1];
        say('omen', 'reading the web: ' + u);
        log('WEB READ :: ' + u);
        try { bagAdd(u, await fetchPage(u), 2); } catch (e2) { say('omen r', 'the page read failed: ' + String(e2).slice(0, 80)); }
      }
      if (!bag.length) return user;
      var extra = '', alive = [];
      for (var j = 0; j < bag.length; j++) {
        extra += blockFor(bag[j].url, bag[j].text);
        if (bag[j].uses - 1 > 0) { bag[j].uses--; alive.push(bag[j]); }
      }
      bag = alive;
      if (extra.length > MAXALL) extra = extra.slice(0, MAXALL) + '\n[web context trimmed]';
      return user + '\n\n(Use the live web content below as your source; cite what you used.)' + extra;
    } catch (e) {}
    return user;
  }

  function wrapAsk(name) {
    try {
      var orig = window[name];
      if (typeof orig !== 'function') return;
      window[name] = function (u) {
        var rest = Array.prototype.slice.call(arguments, 1);
        var self = this;
        return augment(u).then(function (u2) { return orig.apply(self, [u2].concat(rest)); });
      };
    } catch (e) {}
  }
  wrapAsk('askCloud'); wrapAsk('askCloudStream'); wrapAsk('askUnfiltered'); wrapAsk('askOmni'); wrapAsk('askStrip');

  var URL_RE = /https?:\/\/[^\s<>"')]+/i;
  var SEARCH_RE = /\b(search|look ?up|google|find online|latest news|news on)\b/i;

  var innerSend = window.sendQuery;
  if (typeof innerSend !== 'function') { log('HL231 SEND SEAM MISSING'); return; }
  window.sendQuery = function (u, isRegen) {
    var self = this, args = arguments;
    if (typeof u === 'string' && !isRegen && S.web) {
      var t = u.trim();
      var um = URL_RE.exec(t);
      var sm = (!um && SEARCH_RE.exec(t) && t.length > 8) ? t : null;
      if (um || sm) {
        var p;
        if (um) {
          var url = um[0];
          p = fetchPage(url).then(function (txt) {
            bagAdd(url, txt, 3);
            say('omen', 'page read: ' + url + ' (' + txt.length + ' chars) — answering from the live page');
            log('WEB READ OK :: ' + url);
          }).catch(function (e) { say('omen r', 'could not read that page: ' + String(e).slice(0, 80)); });
        } else {
          var q = t.replace(SEARCH_RE, '').replace(/^(for|about|up|the)\s+/i, '').trim() || t;
          p = searchWeb(q).then(function (txt) {
            bagAdd('web search: ' + q, txt, 2);
            say('omen', 'web search done for "' + q + '" — answering from the live results');
            log('WEB SEARCH OK :: ' + q);
          }).catch(function (e) { say('omen r', 'the web search failed: ' + String(e).slice(0, 80)); });
        }
        return p.then(function () { return innerSend.apply(self, args); });
      }
    }
    return innerSend.apply(self, args);
  };

  function webSend(x) {
    try {
      if (!S.web) { S.web = 1; saveS(); }
      var um = URL_RE.exec(x);
      if (um) {
        var url = um[0];
        fetchPage(url).then(function (txt) {
          bagAdd(url, txt, 4);
          say('omen', 'page read: ' + url + ' (' + txt.length + ' chars). now ask about it.');
        }).catch(function (e) { say('omen r', 'could not read that page: ' + String(e).slice(0, 80)); });
        return;
      }
      searchWeb(x).then(function (txt) {
        bagAdd('web search: ' + x, txt, 3);
        sendQuery('Using the live web results just fetched, answer: ' + x);
      }).catch(function (e) { say('omen r', 'the web search failed: ' + String(e).slice(0, 80)); });
    } catch (e) {}
  }

  var innerCmd = window.runCmd;
  if (typeof innerCmd === 'function') {
    try { CMDS.web = 'WEB PAW: read a page or search the live web (/web on|off, /web <url|question>)'; } catch (e) {}
    window.runCmd = function (raw) {
      try {
        var m = /^\/web\b\s*(on|off)?\s*([\s\S]*)$/i.exec(raw || '');
        if (m) {
          try { cmdHist.push(raw); cmdIdx = cmdHist.length; } catch (e2) {}
          var v = (m[1] || '').toLowerCase(), rest = (m[2] || '').trim();
          if (v === 'on') { S.web = 1; saveS(); say('omen', 'WEB PAW on: give it links or ask it to look things up.'); return; }
          if (v === 'off') { S.web = 0; bag = []; saveS(); say('omen', 'WEB PAW off.'); return; }
          if (rest) { webSend(rest); return; }
          say('omen', S.web ? 'WEB PAW is on. use: /web <url> to read a page, /web <question> to search.' : 'WEB PAW is off. /web on to enable.');
          return;
        }
      } catch (e) {}
      return innerCmd.apply(this, arguments);
    };
  }

  console.log('[hl231] online: WEB PAW (links read live, /web <url|question>, searches on ask, WEB NEED: <url> in auto runs)');
})();