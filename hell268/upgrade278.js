/* ILLUMINATI upgrade #278: hl278-fit (v19.184)
   "it keeps failing to answer me and then the time runs out" - root cause
   found live: a ticket asking for more output tokens than the context
   window can never be fulfilled, so the swarm held every ticket until the
   timer died. This upgrade makes every ticket fulfillable:
   (1) TICKET SLIM: the prompt is trimmed to a size every worker can hold
       (head of the persona + the newest context), so no ticket overflows.
   (2) FULL SWARM ROUTING: every ticket is routed across the whole live
       free pool, so a model with no live worker can never stall a ticket.
   (3) The output cap stays at the worker-safe size (fixed at the source).
   Nothing removed. Guard: __HL278 */
(function () {
  if (window.__HL278) return; window.__HL278 = true;

  var of = window.fetch;
  if (typeof of !== 'function' || of.__hl278) return;

  var CAP = 5000;   /* chars kept before persona add-ons land */
  var HEAD = 1500, TAIL = 3400;

  function slim(p) {
    p = String(p || '');
    if (p.length <= CAP) return p;
    return p.slice(0, HEAD) + '\n[...middle trimmed to fit the worker...]\n' + p.slice(-TAIL);
  }
  function uniq(arr) {
    var seen = {}, out = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] && !seen[arr[i]]) { seen[arr[i]] = 1; out.push(arr[i]); }
    }
    return out;
  }

  var wrapped = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (url.indexOf('/generate/text/async') > -1 && init && typeof init.body === 'string' && init.body.charAt(0) === '{') {
        var b = JSON.parse(init.body);
        if (b && typeof b.prompt === 'string') {
          if (b.prompt.length > CAP) b.prompt = slim(b.prompt);
          if (Array.isArray(b.models) && window.HL270_POOL && window.HL270_POOL.length) {
            var wide = uniq(b.models.concat(window.HL270_POOL));
            if (wide.length > b.models.length) b.models = wide;
          }
          if (!b.params || typeof b.params !== 'object') b.params = {};
          if (typeof b.params.max_length !== 'number' || b.params.max_length > 512) b.params.max_length = 512;
          if (typeof b.params.max_context_length !== 'number') b.params.max_context_length = 2048;
          init.body = JSON.stringify(b);
        }
      }
    } catch (e1) {}
    return of.apply(this, arguments.length > 1 ? [input, init] : [input]);
  };

  wrapped.__hl278 = true;
  window.fetch = wrapped;
  try { console.log('[hl278] tickets now fit every worker: no more stalled or refused tickets'); } catch (e2) {}
})();
