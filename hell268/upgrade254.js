/* ILLUMINATI upgrade #254: hl254-errautopsy (v19.157)
   THE ASK: coding grind #254. When something in the page breaks, the engine
   should see the break, not just hear about it.
   - A ring buffer (window.__HL254_ERRS, newest 25) records every uncaught
     error and rejected promise in the page: message, stack head, source
     line, timestamp.
   - When a user message looks like an error report, the engine's next call
     carries [ERROR AUTOPSY]: the user's pasted error, the page's build
     info (version + mirror), the list of live upgrade guards, and the
     recent page errors so the engine can diagnose against what actually
     happened in the browser.
   - Exposes window.__HL254_REPORT() so any module can pull the same autopsy
     block. Zero change when no error-shaped message is present; nothing
     existing removed. Coexists with hl250-253. Guard: __HL254 */
(function () {
  if (window.__HL254) return; window.__HL254 = true;

  var ERRS = [];
  function note(kind, msg, stack, source) {
    try {
      ERRS.push({ k: kind, m: String(msg || '').slice(0, 300), s: String(stack || '').split('\n').slice(0, 4).join(' | ').slice(0, 300), src: String(source || '').slice(0, 120), at: new Date().toISOString().slice(11, 19) });
      if (ERRS.length > 25) ERRS.shift();
    } catch (e) {}
  }
  window.addEventListener('error', function (ev) {
    note('error', ev && ev.message, ev && ev.error && ev.error.stack, ev && (ev.filename + ':' + ev.lineno));
  }, true);
  window.addEventListener('unhandledrejection', function (ev) {
    var r = ev && ev.reason;
    note('rejection', r && (r.message || r), r && r.stack, '');
  }, true);
  try {
    var oe = console.error;
    console.error = function () {
      try { var a = Array.prototype.slice.call(arguments).map(String).join(' '); note('console', a, '', ''); } catch (e2) {}
      return oe.apply(console, arguments);
    };
  } catch (e3) {}

  var ERR_RE = /(?:syntax|type|reference|range)error\b|net::err_[a-z_]+|uncaught|stack\s*trace|at\s+\S+\s*\(\S+:\d+|\bit'?s (?:broken|erroring|error)\b|(?:gives?|getting|throws?) (?:an? )?error/i;

  function guards() {
    var out = [];
    try { for (var k in window) { if (/^__HL\d+$/.test(k) && window[k]) out.push(k.replace('__', 'hl')); } } catch (e) {}
    return out.join(' ');
  }
  function build() {
    try {
      var m = document.body.innerText.match(/ILLUMINATI v[\d.]+[^\n]*/);
      var info = 'BUILD: ' + (m ? m[0] : (window.__HL253 ? 'v19.156+' : 'unknown'));
      var recent = ERRS.length ? ERRS.map(function (e, i) { return (i + 1) + '. [' + e.at + '] ' + e.k + ': ' + e.m + (e.src ? ' @ ' + e.src : '') + (e.s ? ' | ' + e.s : ''); }).join('\n') : '(no uncaught errors recorded this session)';
      return '[ERROR AUTOPSY - page-side error capture active]\n' + info + '\nLIVE UPGRADE GUARDS: ' + guards() + '\nRECENT PAGE ERRORS (newest last):\n' + recent + '\nDiagnose the user error against these real page errors. Mark every inference as an inference; if the page errors do not explain it, say what you would need.\nEnd of error autopsy.';
    } catch (e4) { return ''; }
  }
  window.__HL254_REPORT = build;

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
        if (q && ERR_RE.test(q) && q.indexOf('[ERROR AUTOPSY') === -1) {
          try { lastUser.content += '\n\n' + build(); b.messages = msgs; init.body = JSON.stringify(b); console.log('[hl254] error autopsy attached'); } catch (e5) {}
          return of.apply(self, args);
        }
      }
    } catch (e) {}
    return of.apply(self, args);
  };

  try { console.log('[hl254] error autopsy online: page errors are captured in a live ring buffer and ride into every error-shaped ask so the engine diagnoses the real break'); } catch (e6) {}
})();
