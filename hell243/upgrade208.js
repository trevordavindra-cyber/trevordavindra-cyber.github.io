/* ILLUMINATI upgrade #208: hl208-reaclone (v19.116)
   THE REA GOES TO WORK AUTOMATICALLY. When Trevor asks the engine to clone,
   copy, recreate or remake a website, the query no longer just gets REA's
   grounding — REA itself runs: the engine holds the reply, sends a recon
   probe at the target site through the Order's reader relays (r.jina.ai,
   then the allorigins raw fallback), compresses what came back (title,
   sections, content), and injects it into the call as an [REA ACTIVE — SITE
   RECON] briefing so the engine builds the clone from the real site, not
   guesses. If the target can't be reached, REA discipline still engages and
   the engine says what it assumed. The clone ask with no URL makes the
   engine ask for the exact target in one line. Every other query passes
   through untouched — zero added latency when REA isn't needed, nothing
   existing removed. Guard: __HL208 */
(function () {
  if (window.__HL208) return; window.__HL208 = true;

  var MARK = '[REA ACTIVE';

  /* ---------- toast ---------- */
  var toast = null, toastT = null;
  function ensureToast() {
    if (toast) return toast;
    toast = document.createElement('div');
    toast.id = 'hl208-toast';
    toast.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:150px;z-index:2147483002;background:linear-gradient(180deg,rgba(20,16,8,.96),rgba(8,7,4,.98));border:1px solid rgba(201,162,39,.55);color:#e8d48a;font:600 11px/1.4 Georgia,"Times New Roman",serif;letter-spacing:.12em;padding:10px 14px;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.7),0 0 18px rgba(201,162,39,.18);display:none;max-width:88vw;text-align:center;';
    (document.body || document.documentElement).appendChild(toast);
    return toast;
  }
  function say(msg, hold) {
    var t = ensureToast();
    t.textContent = msg;
    t.style.display = 'block';
    if (toastT) clearTimeout(toastT);
    if (!hold) toastT = setTimeout(function () { t.style.display = 'none'; }, 4200);
  }

  /* ---------- intent ---------- */
  var VERB = '(?:clone|copy|recreate|remake|rebuild|mirror|duplicate|replicate|steal|rip|knock\\s?off|same\\s+as|modeled\\s+after|modelled\\s+after|based\\s+on|version\\s+of|remake\\s+of|copy\\s+of)';
  var SITE = '(?:website|web\\s?site|web\\s?page|webpage|site|page|webapp|web\\s?app|landing|homepage|home\\s?page|front\\s?end|frontend|interface|layout|dashboard|app)';
  var URL_RE = /https?:\/\/[^\s'"<>]+|www\.[^\s'"<>]+|\b[a-z0-9][a-z0-9-]*\.(?:com|net|org|io|dev|ai|co|app|xyz|me|gg|shop|store|online|site|pages\.dev)(?:\/[^\s'"<>]*)?/i;
  var reVerbSite = new RegExp(VERB + '[\\s\\S]{0,200}?' + SITE, 'i');
  var reSiteVerb = new RegExp(SITE + '[\\s\\S]{0,80}?' + VERB, 'i');
  var STRONG = /\b(?:clone|copy|recreate|remake|rebuild|mirror|duplicate|replicate|steal|rip)\b/i;
  function isClone(q) {
    if (!q || q.indexOf(MARK) !== -1) return false;
    if (reVerbSite.test(q) || reSiteVerb.test(q)) return true;
    if (URL_RE.test(q) && STRONG.test(q)) return true;
    return false;
  }
  function targetUrl(q) {
    var m = q.match(URL_RE);
    if (!m) return null;
    var u = m[0].replace(/[.,;:!)]+$/, '');
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    return u;
  }

  /* ---------- recon ---------- */
  function clip(s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n) + '…' : s; }
  function parseRecon(t) {
    var out = [], heads = [], m, n = 0;
    var tm = t.match(/Title:\s*(.+)/i);
    if (tm) out.push('TITLE: ' + tm[1].trim());
    var dm = t.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i) || t.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
    if (dm) out.push('DESC: ' + clip(dm[1], 200));
    var re = /^#{1,4}\s+(.+)$/gm;
    while ((m = re.exec(t)) && n < 12) { heads.push(m[1].trim()); n++; }
    if (heads.length) out.push('SECTIONS: ' + heads.join(' | '));
    if (!heads.length) {
      var hh = [], hre = /<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi;
      while ((m = hre.exec(t)) && hh.length < 12) { var h = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); if (h) hh.push(h); }
      if (hh.length) out.push('SECTIONS: ' + hh.join(' | '));
    }
    var body = t
      .replace(/^Title:.*$/gim, '').replace(/^URL Source:.*$/gim, '').replace(/^Published Time:.*$/gim, '').replace(/^Markdown Content:\s*/i, '')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/^#{1,4}\s+.*$/gm, ' ')
      .replace(/\s+/g, ' ').trim();
    out.push('CONTENT: ' + clip(body, 1250));
    return out.join('\n');
  }
  function fetchText(u, ms) {
    return new Promise(function (res, rej) {
      var done = false, ctl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      var to = setTimeout(function () { if (!done) { done = true; try { if (ctl) ctl.abort(); } catch (e) {} rej(new Error('timeout')); } }, ms || 9000);
      realFetch2(u, ctl ? { signal: ctl.signal } : {}).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      }).then(function (t) { if (done) return; done = true; clearTimeout(to); res(t); })
        .catch(function (e) { if (done) return; done = true; clearTimeout(to); rej(e); });
    });
  }
  var realFetch2 = typeof fetch === 'function' ? fetch.bind(window) : null;
  var CACHE = { url: '', ts: 0, text: '' };
  function recon(url) {
    if (CACHE.url === url && Date.now() - CACHE.ts < 120000 && CACHE.text) return Promise.resolve(CACHE.text);
    var tries = ['https://r.jina.ai/' + url, 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url)];
    var i = 0;
    function next() {
      if (i >= tries.length) return Promise.reject(new Error('no route'));
      var u = tries[i++];
      return fetchText(u, 9000).then(function (t) {
        if (!t || t.length < 40) throw new Error('empty');
        var b = parseRecon(t);
        CACHE = { url: url, ts: Date.now(), text: b };
        return b;
      }).catch(function () { return next(); });
    }
    return next();
  }
  function brief(url, b) {
    return 'The user asked to clone this website. Ground the clone in the REA recon below (structure, sections, palette cues, tone, real content), state any assumption you had to make, then deliver the COMPLETE working clone — full HTML/CSS/JS end to end, ready to run — in fenced code blocks.]\n[REA ACTIVE — SITE RECON OF ' + url + ']\n' + b;
  }
  function norecon(url) {
    return 'The target site (' + url + ') could not be fetched from the browser. Apply REA discipline anyway: state your assumptions plainly, reason from the user description and what such a site normally is, and deliver the complete clone code. Ask only for the one detail you cannot proceed without.]';
  }
  function noUrl() {
    return 'The user wants a website cloned but gave no target URL. Ask for the exact URL in one short line. Once given: reverse-engineer it (structure, palette, type, content) and deliver the complete working clone code.]';
  }

  /* ---------- interception ---------- */
  var realFetch = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : ((input && input.url) || '');
      if (init && init.method === 'POST' && url.indexOf('https://text.pollinations.ai/openai') === 0 && init.body && typeof init.body === 'string') {
        var body = null;
        try { body = JSON.parse(init.body); } catch (e) { body = null; }
        if (body && Array.isArray(body.messages) && !body.__hl208) {
          var li = -1;
          for (var k = body.messages.length - 1; k >= 0; k--) { if (body.messages[k] && body.messages[k].role === 'user') { li = k; break; } }
          if (li > -1) {
            var q = String(body.messages[li].content || '');
            if (isClone(q)) {
              body.__hl208 = 1;
              var u = targetUrl(q);
              var host = u ? u.replace(/^https?:\/\//i, '').split(/[\/?#]/)[0].toUpperCase() : '';
              var inject = function (extra) {
                var msgs = body.messages.slice();
                msgs.splice(li, 0, { role: 'system', content: extra });
                var nb = Object.assign({}, body, { messages: msgs });
                var ni = Object.assign({}, init, { body: JSON.stringify(nb) });
                return realFetch.call(this, input, ni);
              };
              if (u) {
                say('REA ACTIVE — REVERSE-ENGINEERING ' + host + ' …', true);
                var self = this;
                return recon(u).then(function (b) {
                  say('REA RECON COMPLETE — CLONE ENGAGED');
                  return inject.call(self, brief(u, b));
                }).catch(function () {
                  say('REA RECON BLOCKED — DISCIPLINE STILL ENGAGED');
                  return inject.call(self, norecon(u));
                });
              }
              return inject.call(this, noUrl());
            }
          }
        }
      } else if (typeof url === 'string' && url.indexOf('https://text.pollinations.ai/') === 0 && url.indexOf('/openai') === -1) {
        var m = url.match(/^https:\/\/text\.pollinations\.ai\/([^?]+)(\?.*)$/);
        if (m) {
          var txt = decodeURIComponent(m[1]);
          if (isClone(txt)) {
            var self2 = this, u2 = targetUrl(txt);
            var go = function (extra) {
              var np = (txt + '\n\n' + extra).slice(0, 1700);
              var nu = 'https://text.pollinations.ai/' + encodeURIComponent(np) + (m[2] || '');
              return realFetch.call(self2, nu, init);
            };
            if (u2) {
              say('REA ACTIVE — REVERSE-ENGINEERING ' + u2.replace(/^https?:\/\//i, '').split(/[\/?#]/)[0].toUpperCase() + ' …', true);
              return recon(u2).then(function (b) { say('REA RECON COMPLETE — CLONE ENGAGED'); return go(brief(u2, b)); })
                .catch(function () { say('REA RECON BLOCKED — DISCIPLINE STILL ENGAGED'); return go(norecon(u2)); });
            }
            return go(noUrl());
          }
        }
      }
    } catch (e) {}
    return realFetch.apply(this, arguments);
  };
})();
