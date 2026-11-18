/* ILLUMINATI upgrade #251: hl251-cloudmem (v19.153)
   THE ASK: the next user gets access to everything the AI learned, always.
   Shared cloud memory on top of hl250's permanent memory:
   - The shared store is a public JSON blob; anyone opening the site reads it.
   - On load: pulls shared facts and merges them into the phone's permanent
     memory (hl250 picks them up on the very next answer).
   - When the phone's memory changes (remember / forget / wipe), the change is
     synced back to the shared store so the next visitor inherits everything.
   - Additions merge; removals and wipes replace, so forgetting works too.
   - Every network step is wrapped: if the store is unreachable the site simply
     runs on the phone's own permanent memory, exactly as before.
   Coexists with hl245-250. Guard: __HL251 */
(function () {
  if (window.__HL251) return; window.__HL251 = true;

  var STORE = 'https://jsonblob.com/api/jsonBlob/01a1ebf7-7243-72a0-a312-809fc1588a75';
  var KEY = 'hl250_mem';
  var ls = null;
  try { ls = window.localStorage; } catch (e) {}
  function local() { try { return JSON.parse(ls.getItem(KEY) || '[]') || []; } catch (e2) { return []; } }
  function saveLocal(a) { try { ls.setItem(KEY, JSON.stringify(a.slice(-60))); } catch (e3) {} }
  function norm(s) { return String(s || '').trim().replace(/\s+/g, ' ').toLowerCase(); }

  function mergeLists(cloud, localArr) {
    var out = [], seen = {};
    function add(f) {
      if (!f || !f.t) return;
      var k = norm(f.t);
      if (!k || seen[k]) return;
      seen[k] = 1;
      out.push({ t: f.t, ts: f.ts || f.added || 0 });
    }
    (cloud || []).forEach(add);
    (localArr || []).forEach(add);
    return out;
  }

  var lastSeen = null;

  function pullThenWatch() {
    fetch(STORE, { method: 'GET', headers: { 'Accept': 'application/json' } })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (data) {
        var cloud = (data && data.facts) || [];
        var localArr = local();
        var merged = mergeLists(cloud, localArr);
        if (merged.length > localArr.length) {
          saveLocal(merged);
          try { console.log('[hl251] shared memory: pulled ' + (merged.length - localArr.length) + ' new fact(s) from the cloud store'); } catch (e4) {}
        }
        lastSeen = JSON.stringify(local());
      })
      .catch(function () {
        lastSeen = JSON.stringify(local());
        try { console.log('[hl251] shared store unreachable; running on phone memory only'); } catch (e5) {}
      });
  }

  var pushTimer = null;
  function pushSoon(mode) {
    if (pushTimer) return;
    pushTimer = setTimeout(function () { pushTimer = null; pushNow(mode); }, 4000);
  }

  function pushNow(mode) {
    var localArr = local();
    fetch(STORE, { method: 'GET', headers: { 'Accept': 'application/json' } })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (data) {
        var cloud = (data && data.facts) || [];
        var body;
        if (mode === 'wipe') body = { facts: [] };
        else if (mode === 'replace') body = { facts: localArr.slice(-500) };
        else body = { facts: mergeLists(cloud, localArr).slice(-500) };
        return fetch(STORE, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(body)
        });
      })
      .then(function (r) {
        if (r && r.ok) {
          try { console.log('[hl251] shared memory: synced ' + localArr.length + ' fact(s) to the cloud store'); } catch (e6) {}
        }
      })
      .catch(function () {
        try { console.log('[hl251] cloud sync failed this round; facts kept on the phone'); } catch (e7) {}
      });
  }

  setInterval(function () {
    if (lastSeen === null) return;
    var cur = null;
    try { cur = ls.getItem(KEY); } catch (e8) {}
    if (cur === null) cur = '[]';
    if (cur === lastSeen) return;
    var before = null, after = null;
    try { before = JSON.parse(lastSeen) || []; after = JSON.parse(cur) || []; } catch (e9) { lastSeen = cur; return; }
    lastSeen = cur;
    if (after.length === 0 && before.length > 0) pushSoon('wipe');
    else if (after.length <= before.length) pushSoon('replace');
    else pushSoon('merge');
  }, 1500);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pullThenWatch);
  else pullThenWatch();

  try { console.log('[hl251] online: shared cloud memory (what the AI learns is saved for everyone who opens the site)'); } catch (e10) {}
})();
