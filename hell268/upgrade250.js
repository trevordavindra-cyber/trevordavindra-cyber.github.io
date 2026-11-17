/* ILLUMINATI upgrade #250: hl250-permamem (v19.152)
   THE ASK: make sure the info you give it is permanent.
   A permanent memory store, kept in the phone's localStorage, that
   survives reloads and app closes:
   - "remember ..." (at the start of a message or after a sentence end)
     writes the fact to permanent memory on the spot and the AI confirms
     it is saved for good.
   - "forget everything" / "clear your memory" wipes the store; the AI
     confirms the wipe.
   - "forget <something>" removes matching facts and confirms the count.
   - "what do you remember" makes it recite the store.
   - On EVERY request, the store rides along as PERMANENT MEMORY and the
     model is told to honor those facts always.
   Newest 60 facts kept, deduped, timestamped. Coexists with hl245-248.
   Guard: __HL250 */
(function () {
  if (window.__HL250) return; window.__HL250 = true;

  var KEY = 'hl250_mem';
  var ls = null;
  try { ls = window.localStorage; } catch (e) {}
  function load() { try { return JSON.parse(ls.getItem(KEY) || '[]') || []; } catch (e2) { return []; } }
  function save(a) { try { ls.setItem(KEY, JSON.stringify(a.slice(-60))); } catch (e3) {} }
  function norm(s) { return String(s || '').trim().replace(/\s+/g, ' ').toLowerCase(); }

  var REM_RE = /(?:^|[.\n])\s*remember(?:\s+(?:this|that|it))?\s*[:,-]?\s*(.+)/i;
  var FORGET_ALL = /\b(forget|clear|erase|delete|wipe)\s+(everything|all|your memory)\b/i;
  var FORGET_ONE = /(?:^|[.\n])\s*forget\s+(?:that\s+)?["']?(.{4,120}?)?["']?\s*(?:[.\n]|$)/i;
  var ASK_MEM = /\b(what\s+do\s+you\s+remember|what\s+have\s+i\s+told\s+you|your\s+memories|list\s+your\s+memor)/i;

  function factFrom(q) {
    var m = q.match(REM_RE);
    if (!m) return null;
    return m[1].trim().replace(/^["']+|["'.]+$/g, '');
  }

  var of3 = window.fetch;
  window.fetch = function (u, init) {
    try {
      var url = (typeof u === 'string') ? u : (u && u.url) || '';
      if (/pollinations\.ai|aihorde\.ai/.test(url) && init && init.method && String(init.method).toUpperCase() === 'POST' && typeof init.body === 'string') {
        var b = null;
        try { b = JSON.parse(init.body); } catch (e4) {}
        if (b && b.messages) {
          var last = -1, q = '', i;
          for (i = b.messages.length - 1; i >= 0; i--) {
            if (b.messages[i] && b.messages[i].role === 'user' && typeof b.messages[i].content === 'string') { q = b.messages[i].content; last = i; break; }
          }
          if (q && q.indexOf('PERMANENT MEMORY') < 0) {
            var memo = load(), note = '';
            if (FORGET_ALL.test(q)) {
              var had = memo.length;
              memo = []; save(memo);
              note = '\n\nMEMORY CLEARED: the permanent memory store was just emptied at the user\'s request (' + had + ' fact' + (had === 1 ? '' : 's') + ' erased). Confirm plainly that every permanent memory is gone.';
              try { console.log('[hl250] permanent memory cleared (' + had + ')'); } catch (e5) {}
            } else {
              var f = factFrom(q);
              if (f && f.length >= 4 && f.length <= 400) {
                var dup = false, j;
                for (j = 0; j < memo.length; j++) { if (norm(memo[j].text) === norm(f)) { dup = true; break; } }
                if (!dup) { memo.push({ t: Date.now(), text: f }); save(memo); }
                note = '\n\nMEMORY SAVED: the fact "' + f + '" is now written to permanent memory and survives reloads and app closes. Confirm it is saved for good' + (dup ? ' (it was already on file; say so)' : '') + '.';
              } else if (FORGET_ONE.test(q)) {
                var m2 = q.match(FORGET_ONE), frag = norm(m2[1]), before = memo.length;
                memo = memo.filter(function (x) { return norm(x.text).indexOf(frag) < 0; }); save(memo);
                note = '\n\nMEMORY FORGOT: ' + (before - memo.length) + ' permanent memor' + (before - memo.length === 1 ? 'y was' : 'ies were') + ' removed matching "' + m2[1] + '". Confirm what was erased' + (before === memo.length ? ' (nothing matched; say so)' : '') + '.';
              }
              if (ASK_MEM.test(q)) {
                note += '\n\nMEMORY REQUEST: the user wants the permanent memory list. Recite every fact below, numbered, newest last.';
              }
              if (memo.length) {
                var lines = memo.slice(-40).map(function (x, k) { return (k + 1) + '. ' + x.text; }).join('\n');
                note += '\n\nPERMANENT MEMORY - these facts were saved for good by the user and must always be honored, even in future conversations:\n' + lines;
              }
              if (note) {
                b.messages[last].content += note;
                init.body = JSON.stringify(b);
                try { console.log('[hl250] permanent memory: ' + memo.length + ' fact(s) riding along'); } catch (e6) {}
              }
            }
          }
        }
      }
    } catch (e7) {}
    return of3.apply(this, arguments);
  };

  console.log('[hl250] online: permanent memory (facts saved in phone storage, survive reloads, ride into every answer)');
})();
