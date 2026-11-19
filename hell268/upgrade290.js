/* ILLUMINATI upgrade 290 - OMNIBRAIN BENCH (hl290)
   PROJECT OMNIBRAIN phase 13: real benchmarking, never fabricated.
   /bench [n] fires n (default 8, max 20) graded tasks from a built-in bank
   straight through the live AI pipeline and auto-grades each answer, then
   prints a scorecard. Every run is stored so before/after comparisons are real
   numbers from real runs. Nothing is claimed without having run.
*/
(function () {
  if (window.__HL290) return; window.__HL290 = true;

  var BANK = [
    { q: 'what is 17*23? answer with just the number', re: /391/ },
    { q: 'what is 144 divided by 12? answer with just the number', re: /12\b/ },
    { q: 'what is 12.5% of 80? answer with just the number', re: /10(\.0+)?\b/ },
    { q: 'what is 2^10? answer with just the number', re: /1024/ },
    { q: 'what is the square root of 196? answer with just the number', re: /14\b/ },
    { q: 'if a shirt costs $25 and is discounted 20%, what is the final price in dollars? just the number', re: /20(\.0+)?\b/ },
    { q: 'a train travels 60 mph for 2.5 hours. how far in miles? just the number', re: /150/ },
    { q: 'what is 15% tip on a $60 bill in dollars? just the number', re: /9(\.0+)?\b/ },
    { q: 'solve for x: 3x + 9 = 30. just the number', re: /7\b/ },
    { q: 'what is 7 factorial? just the number', re: /5040/ },
    { q: 'if all bloops are razzies and all razzies are lazzies, are all bloops lazzies? answer yes or no only', re: /\byes\b/i },
    { q: 'if some cats are black and some black things are dogs, are all cats dogs? answer yes or no only', re: /\bno\b/i },
    { q: 'john is taller than mary. mary is taller than sue. is john taller than sue? answer yes or no only', re: /\byes\b/i },
    { q: 'which is larger: 3/7 or 4/9? answer with the fraction that is larger', re: /3\s*\/\s*7/ },
    { q: 'reply with exactly one word: PURPLE', eq: 'PURPLE' },
    { q: 'reply with exactly one word: BANANA', eq: 'BANANA' },
    { q: 'what is the capital of australia? one word', re: /canberra/i },
    { q: 'which planet is closest to the sun? one word', re: /mercury/i },
    { q: 'what year did world war 2 end? just the year', re: /1945/ },
    { q: 'who wrote romeo and juliet? just the name', re: /shakespeare/i },
    { q: 'what is the chemical symbol for gold? one or two letters', re: /\bAu\b/ },
    { q: 'how many continents are there? just the number', re: /7\b/ },
    { q: 'what is the largest ocean on earth? name it', re: /pacific/i },
    { q: 'in javascript, what does Array.prototype.push return? answer: the new length, or the array?', re: /length/i },
    { q: 'in javascript, which loop always runs at least once? answer: for, while, or do-while', re: /do[\s-]*while/i },
    { q: 'what does CSS stand for? three words', re: /cascading\s+style\s+sheets/i },
    { q: 'in html, which tag holds javascript? just the tag name', re: /<\s*script/i },
    { q: 'in python, what keyword defines a function?', re: /\bdef\b/ },
    { q: 'what does HTTP status 404 mean? answer in under six words', re: /not\s*found/i },
    { q: 'write a javascript expression that returns true only when x is exactly 5. include the word x', re: /x\s*===?\s*5\b/ },
    { q: 'name the odd one out: apple, banana, carrot, cherry', re: /carrot/i },
    { q: 'how many minutes are in 3 hours? just the number', re: /180/ },
    { q: 'a recipe needs 2 cups for 4 servings. how many cups for 10 servings? just the number', re: /5\b/ },
    { q: 'what is 30% off $50 in dollars? just the number', re: /35/ },
    { q: 'count the letters in the word HELLO. just the number', re: /5\b/ },
    { q: 'is 97 a prime number? answer yes or no only', re: /\byes\b/i },
    { q: 'what comes next: 2, 4, 8, 16, ? just the number', re: /32/ },
    { q: 'what is the freezing point of water in celsius? just the number', re: /0(\.0+)?\b/ },
    { q: 'which is heavier, a kilogram of feathers or a kilogram of steel? answer: same, feathers, or steel', re: /same/i },
    { q: 'spell the number 8 backwards as a word', re: /thgie/i },
    { q: 'in git, what command stages a file named a.txt? include the command word', re: /add/i }
  ];

  var KEY = 'omnibrain-bench-v1';
  function ledger() { try { return JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { return []; } }
  function saveLedger(a) { try { localStorage.setItem(KEY, JSON.stringify(a.slice(-30))); } catch (e2) {} }

  function siteSay(who, t) {
    try { if (typeof window.say === 'function') window.say(who, t); else if (typeof feed === 'function') feed(t, 'live'); } catch (e) { try { feed(t, 'live'); } catch (e2) {} }
  }

  function grade(task, t) {
    var s = String(t || '');
    if (task.eq) { var m = s.match(new RegExp('[A-Za-z]*' + task.eq + '[A-Za-z]*')); return !!(m && m[0].toUpperCase() === task.eq); }
    return task.re.test(s.slice(0, 800));
  }

  function pick(n) {
    var idx = BANK.map(function (_, i) { return i; });
    for (var i = idx.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = idx[i]; idx[i] = idx[j]; idx[j] = tmp; }
    return idx.slice(0, Math.min(n, BANK.length)).map(function (i) { return BANK[i]; });
  }

  function runBench(nStr) {
    var n = Math.max(1, Math.min(20, parseInt(nStr, 10) || 8));
    var tasks = pick(n);
    var i = 0, correct = 0, t0 = Date.now(), results = [];
    siteSay('omen r', 'omnibrain bench: running ' + n + ' graded tasks through the live pipeline - real answers, real grading, no faking');
    function step() {
      if (i >= tasks.length) {
        var secs = Math.round((Date.now() - t0) / 1000);
        var pct = Math.round(100 * correct / tasks.length);
        siteSay('omen r', 'BENCH RESULT: ' + correct + '/' + tasks.length + ' correct (' + pct + '%), avg ' + Math.round(secs / tasks.length) + 's per task. saved to the bench ledger');
        var l = ledger(); l.push({ d: new Date().toISOString().slice(0, 10), n: tasks.length, c: correct, pct: pct, secs: secs }); saveLedger(l);
        try { feed('OMNIBRAIN BENCH :: ' + correct + '/' + tasks.length + ' (' + pct + '%)', 'live'); } catch (e3) {}
        return;
      }
      var t = tasks[i];
      siteSay('omen r', 'bench ' + (i + 1) + '/' + n + ': ' + t.q.slice(0, 60));
      var ts = Date.now();
      Promise.resolve(window.askOmni(t.q))['catch'](function () { return null; }).then(function (a) {
        var ok = grade(t, a);
        if (ok) correct++;
        results.push({ q: t.q, ok: ok, ms: Date.now() - ts });
        try { notice(ok ? 'ok' : 'warn', 'OMNIBRAIN', 'bench ' + (i + 1) + '/' + n + (ok ? ': correct' : ': MISSED - said: ' + String(a || '').slice(0, 60))); } catch (e4) {}
        i++; setTimeout(step, 400);
      });
    }
    step();
  }

  document.addEventListener('keydown', function (e) {
    try {
      var t = e.target;
      if (!t || t.id !== 'txt' || e.key !== 'Enter' || e.shiftKey) return;
      var v = (t.value || '').trim();
      var m = v.match(/^\/bench\s*(\d*)$/i);
      if (!m) return;
      e.preventDefault(); e.stopImmediatePropagation();
      t.value = '';
      runBench(m[1]);
    } catch (e2) {}
  }, true);

  try { if (window.CMDS && typeof CMDS === 'object') { CMDS.bench = 'run the omnibrain benchmark (/bench 10)'; } } catch (e5) {}
  try { console.log('[hl290] omnibrain bench online: /bench [n] runs graded tasks and scores the pipeline for real'); } catch (e6) {}
})();
