/* ILLUMINATI upgrade #253: hl253-reahands (v19.156)
   THE ASK: make the engine be able to DO what REA does, exactly.
   REA (Reverse Engineer Anything, github.com/morluto/rea, MIT) is already in
   every reply as discipline (hl114) and runs its recon on clone asks (hl208).
   What the engine could not do until now is REA's actual evidence work on an
   arbitrary REA ask. hl253-reahands gives it REA's hands:
   - The FULL live REA skill is fetched from the rea repo (47 KB SKILL.md,
     not hl114's 3 KB slice), cached in localStorage with a weekly refresh,
     and the route sections ride into every REA-type call.
   - When a question is a REA ask (reverse engineer, decompile, take apart,
     analyze/inspect a target), the engine gathers REAL shipped-artifact
     evidence before answering, routed by target type exactly the way REA's
     "route the target first" section says:
       * a URL target -> live recon through the reader relays
         (r.jina.ai, allorigins raw fallback), structure and content;
       * a GitHub repo target -> the repo's own metadata plus its README
         straight from the source (api.github.com + raw.githubusercontent,
         both keyless and free);
       * an npm package target -> the package's registry record plus its
         real published files read through unpkg (registry + unpkg, both
         keyless and free).
   - The evidence lands in the call as [REA RUN — LIVE EVIDENCE] and the
     engine is instructed to walk the REA chain: artifact -> observation ->
     conclusion, marking every inference as an inference. If a target can't
     be reached, REA discipline still engages and the engine says what it
     assumed. Everything else passes untouched - zero added latency when no
     REA ask is present, nothing existing removed. Coexists with hl114,
     hl208, hl250-252. Guard: __HL253 */
(function () {
  if (window.__HL253) return; window.__HL253 = true;

  var REA_RE = /reverse.?engineer|decompil|disassembl|\brea\b|under the hood|figure out how|take.{0,24}(apart|apart the)|tear.{0,24}down|what.{0,40}(built with|written in|made of|powered by|underneath)|how (does|is|do) (this|that|it|the) .{1,60}(work|built|made|implemented)|analyze (this|that|the) (app|site|website|package|binary|file|page)|inspect (this|that|the)|examine (this|that|the)|what is inside/i;
  var URL_RE = /https?:\/\/[^\s'"<>]+|www\.[^\s'"<>]+|\b[a-z0-9][a-z0-9-]*\.(?:com|net|org|io|dev|ai|co|app|xyz|me|gg|shop|store|online|site|pages\.dev)(?:\/[^\s'"<>]*)?/i;
  var GH_RE = /github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/i;
  var NPM_RE = /(?:\bnpm\b|\bpackage\b|\bunpkg\b)\s+(?:package\s+|called\s+|named\s+)?([@a-z0-9][@a-z0-9._\/-]{1,60})/i;
  var SKILL_URL = 'https://raw.githubusercontent.com/morluto/rea/main/.agents/skills/reverse-engineer-anything/SKILL.md';
  var SKILL_KEY = 'hl253:skill', SKILL_STAMP = 'hl253:skill-at';

  function clip(s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n) + '…' : s; }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function skillText() {
    var t = lsGet(SKILL_KEY), at = parseInt(lsGet(SKILL_STAMP) || '0', 10);
    if (t && Date.now() - at < 7 * 864e5) return Promise.resolve(t);
    return fetch(SKILL_URL).then(function (r) { if (!r.ok) throw 0; return r.text(); })
      .then(function (full) { lsSet(SKILL_KEY, full); lsSet(SKILL_STAMP, String(Date.now())); return full; })
      ['catch'](function () { return t || ''; });
  }

  function withTimeout(p, ms) {
    return Promise.race([p, new Promise(function (res) { setTimeout(function () { res(null); }, ms || 9000); })]);
  }
  function fetchText(url, max) {
    return withTimeout(fetch(url).then(function (r) { if (!r.ok) throw 0; return r.text(); }), 9000)
      .then(function (t) { return t === null ? null : clip(t, max); })['catch'](function () { return null; });
  }

  function reconSite(u) {
    var direct = fetchText('https://r.jina.ai/' + u, 2600);
    var fallback = fetchText('https://api.allorigins.win/raw?url=' + encodeURIComponent(u), 2600);
    return direct.then(function (t) { return t || fallback; });
  }

  function reconRepo(user, repo) {
    return Promise.all([
      fetchText('https://api.github.com/repos/' + user + '/' + repo, 900),
      fetchText('https://raw.githubusercontent.com/' + user + '/' + repo + '/main/README.md', 2600)
        .then(function (t) { return t || fetchText('https://raw.githubusercontent.com/' + user + '/' + repo + '/master/README.md', 2600); })
    ]).then(function (a) { return (a[0] || a[1]) ? ('REPO METADATA: ' + (a[0] || '(meta unreachable)') + '\n\nREADME:\n' + (a[1] || '(README unreachable)')) : null; });
  }

  function reconNpm(pkg) {
    var clean = String(pkg).replace(/[.,;:!)]+$/, '');
    return Promise.all([
      fetchText('https://registry.npmjs.org/' + clean, 1200),
      fetchText('https://unpkg.com/' + clean + '/package.json', 1600)
    ]).then(function (a) {
      if (!a[0] && !a[1]) return null;
      var main = null;
      try { var pj = JSON.parse(a[1] || a[0] || '{}'); main = pj.main || pj.module || (pj.browser && pj.browser) || null; } catch (e) {}
      var src = main ? fetchText('https://unpkg.com/' + clean + '/' + main, 2600) : Promise.resolve(null);
      return src.then(function (s) {
        return 'REGISTRY RECORD: ' + clip(a[0] || a[1], 900) + '\n\nPACKAGE.JSON: ' + clip(a[1] || '(unpkg unreachable)', 1200) + (s ? '\n\nMAIN FILE SOURCE (' + main + '):\n' + s : '');
      });
    });
  }

  function evidence(q) {
    var jobs = [];
    var gh = q.match(GH_RE);
    var um = q.match(URL_RE);
    var nm = q.match(NPM_RE);
    if (um) { var u = um[0].replace(/[.,;:!)]+$/, ''); if (!/^https?:\/\//i.test(u)) u = 'https://' + u; if (!gh || u.indexOf('github.com') === -1) jobs.push(reconSite(u)); }
    if (gh) jobs.push(reconRepo(gh[1], gh[2].replace(/\.git$/, '')));
    if (!um && !gh && nm) jobs.push(reconNpm(nm[1]));
    if (!jobs.length) return Promise.resolve(null);
    return Promise.all(jobs).then(function (rs) {
      var got = rs.filter(Boolean);
      return got.length ? got.join('\n\n-----\n\n') : null;
    });
  }

  function run(q) {
    return Promise.all([skillText(), evidence(q)]).then(function (r) {
      var skill = r[0] || '', ev = r[1];
      var block = '\n\n[REA RUN — Reverse Engineer Anything, github.com/morluto/rea, MIT]';
      if (skill) block += '\n\nREA FULL METHOD (live skill, follow its routes for this target type):\n' + skill.slice(0, 13000);
      if (ev) block += '\n\nREA RUN — LIVE EVIDENCE (fetched right now from the target; treat as shipped-artifact evidence, cite it, and mark every inference as an inference):\n' + ev;
      else block += '\n\nREA RUN — TARGET EVIDENCE COULD NOT BE FETCHED from the browser. Apply REA discipline anyway: state your assumptions plainly and label what is unverified.';
      block += '\nEnd of REA run.';
      return block;
    });
  }

  var of = window.fetch;
  window.fetch = function (input, init) {
    var self = this, args = arguments;
    try {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      var isRelay = /pollinations\.ai|textdb\.online|aihorde\.net|openrouter|deepinfra|groq|huggingface\.co/.test(url);
      if (isRelay && init && typeof init.body === 'string' && init.body.indexOf('"messages"') > -1) {
        var b = JSON.parse(init.body);
        var msgs = b && b.messages || [];
        var lastUser = null;
        for (var i = msgs.length - 1; i >= 0; i--) { if (msgs[i] && msgs[i].role === 'user') { lastUser = msgs[i]; break; } }
        var q = lastUser && String(lastUser.content || '') || '';
        if (q && REA_RE.test(q) && q.indexOf('[REA RUN') === -1 && q.indexOf('CODEX VAULT') === -1) {
          return run(q).then(function (block) {
            try { lastUser.content += block; b.messages = msgs; init.body = JSON.stringify(b); console.log('[hl253] REA hands: evidence run attached'); } catch (e3) {}
            return of.apply(self, args);
          })['catch'](function () { try { console.log('[hl253] REA hands: run failed, passing through'); } catch (e4) {} return of.apply(self, args); });
        }
      }
    } catch (e) {}
    return of.apply(this, arguments);
  };

  try { console.log('[hl253] REA hands online: the engine now does what REA does - routes the target, pulls real shipped-artifact evidence (sites, repos, packages), and walks the artifact->observation->conclusion chain'); } catch (e5) {}
})();
