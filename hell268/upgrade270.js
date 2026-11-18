/* ILLUMINATI upgrade #270: hl270-swarm (v19.176)
   "find more free public relays, at least 20, they'll never charge me a dime."
   The 16-brain pool now draws from the FULL live free horde: at boot this
   upgrade pulls https://aihorde.net/api/v2/status/models?type=text (free,
   no key, no account) and every live model joins the relay pool - 26+ solid
   servers verified live on Nov 18 2026, plus a hardcoded fallback so the
   pool never goes empty if the status endpoint stalls. Every horde fanout
   ticket is widened to the whole pool, so the ten-engine ask can route
   through 26+ distinct free servers. Nothing removed. Guard: __HL270 */
(function () {
  if (window.__HL270) return; window.__HL270 = true;

  var SEED = [
    'aphrodite/TheDrummer/Behemoth-128B-v3',
    'aphrodite/TheDrummer/Skyfall-31B-v4.2',
    'koboldcpp/Cydonia-24B-v4.3-heretic-Q4_K_M',
    'koboldcpp/Cydonia-24B-v4zg-Q4_K_M',
    'koboldcpp/G4-MeroMero-26B-A4B-it-uncensored-heretic',
    'koboldcpp/gemma-4-31B-it-heretic',
    'koboldcpp/gemma-4-E4B-it',
    'koboldcpp/Gemma-4-E4B-it-Ultra-Uncensored-Heretic',
    'koboldcpp/Gemma-4-E4B-Uncensored',
    'koboldcpp/Gemma-4-E4B-Uncensored-HauhauCS-Aggressive-Q4_K_M',
    'koboldcpp/L3-8B-Stheno-v3.2',
    'koboldcpp/L3-8B-Stheno-v3.2-SynthRP-r1_Q5_K_M-650',
    'koboldcpp/Llama-3.2-1B-Instruct',
    'koboldcpp/Llama-3.2-3B-Instruct-Q4_K_M',
    'koboldcpp/Llama-3-Lumimaid-8B-v0.1',
    'koboldcpp/NemoMix-Unleashed-12B-Q6_K',
    'koboldcpp/Qwen3-14B',
    'koboldcpp/Qwen3.5-4B',
    'koboldcpp/Rocinante-X-12B',
    'koboldcpp/Rocinante-X-12B-v1',
    'lmstudio/Qwen3.5-9B',
    'lmstudio/TheDrummer/Skyfall-31B-v4.2',
    'Nimbz/Gemma-4-Dark-Orthia-31B',
    'Qwen3.8-Flash-Next-Uncensored-NVFP4',
    'Qwen/Qwen3.8-Flash-Next',
    'sonar/TheDrummer/Behemoth-128B-v3-4.25bpw-h6-exl3'
  ];
  var TINY = /270m|0\.6B|1\.7B|debug-|RWKV7/i;

  function uniq(arr) {
    var seen = {}, out = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] && !seen[arr[i]]) { seen[arr[i]] = 1; out.push(arr[i]); }
    }
    return out;
  }
  var pool = SEED.slice();
  window.HL270_POOL = pool;

  /* live refresh: merge every live free horde model into the pool */
  try {
    fetch('https://aihorde.net/api/v2/status/models?type=text')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!Array.isArray(d)) return;
        var live = [];
        for (var i = 0; i < d.length; i++) {
          var m = d[i];
          var name = (typeof m === 'string') ? m : m && m.name;
          var count = (m && typeof m.count === 'number') ? m.count : 1;
          if (name && count > 0 && !TINY.test(name)) live.push(name);
        }
        if (live.length) {
          /* known-good first, then any new arrivals */
          pool.length = 0;
          for (var j = 0; j < SEED.length; j++) pool.push(SEED[j]);
          for (var k = 0; k < live.length; k++) pool.push(live[k]);
          var merged = uniq(pool);
          pool.length = 0;
          for (var x = 0; x < merged.length; x++) pool.push(merged[x]);
          window.HL270_POOL = pool;
        }
        try { console.log('[hl270] swarm online: ' + pool.length + ' free servers in the relay pool'); } catch (e2) {}
      })
      .catch(function () {
        try { console.log('[hl270] swarm online (fallback list): ' + pool.length + ' free servers'); } catch (e2) {}
      });
  } catch (e1) {}

  /* widen every horde fanout ticket to the whole free pool */
  var of = window.fetch;
  if (typeof of === 'function') {
    window.fetch = function (input, init) {
      try {
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        if (url.indexOf('aihorde.net/api/v2/generate/text/async') > -1 &&
            init && typeof init.body === 'string') {
          var b = JSON.parse(init.body);
          if (b && Array.isArray(b.models) && b.models.length >= 5 && window.HL270_POOL.length) {
            var wide = uniq(b.models.concat(window.HL270_POOL));
            if (wide.length > b.models.length) b.models = wide;
            init.body = JSON.stringify(b);
          }
        }
      } catch (e) {}
      return of.apply(this, arguments.length > 1 ? [input, init] : [input]);
    };
  }
})();
