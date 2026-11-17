/* ILLUMINATI upgrade #220: hl220-ironline (v19.127)
   THE RELAY SELF-HEALS. A 403, 429 or 5xx from the AI relays used to bubble
   up as a dead circuit. Now the relay line repairs itself before anything
   reaches the chat:
   1) CLOUD POSTS — on a refused answer the same ask is retried once on the
      alternate fast model, then flattened to a plain GET prompt, then the
      engine's own Horde fallback takes over as before. Streaming bodies are
      only retried on the alternate model, so the stream keeps its shape.
   2) HORDE POSTS — one spaced retry on a refused ticket, then the engine's
      own reroute as before.
   A refused answer never surfaces as a raw 403: the user sees the normal
   reroute lines instead. Nothing existing is removed. Guard: __HL220 */
(function () {
  if (window.__HL220) return; window.__HL220 = true;

  function isBad(s) { return s === 403 || s === 429 || s === 500 || s === 502 || s === 503 || s === 504; }

  function flatten(body) {
    var sys = '', last = '';
    for (var i = 0; i < body.messages.length; i++) {
      var m = body.messages[i];
      if (!m || typeof m.content !== 'string') continue;
      if (m.role === 'system') sys += m.content + '\n';
      if (m.role === 'user') last = m.content;
    }
    return (sys + '\nUser: ' + last + '\nILLUMINATI:').slice(0, 1500);
  }

  var realFetch = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : ((input && input.url) || '');
      var isPost = init && init.method === 'POST';
      var cloud = isPost && url.indexOf('https://text.pollinations.ai/openai') === 0 && init.body && typeof init.body === 'string';
      var horde = isPost && url.indexOf('https://aihorde.net/api/v2/generate/text/async') === 0 && init.body && typeof init.body === 'string';
      if (!cloud && !horde) return realFetch.apply(this, arguments);
      var self = this;
      var body = null;
      try { body = JSON.parse(init.body); } catch (e) { body = null; }
      var streaming = !!(body && body.stream);

      function go(u, i2, step) {
        return realFetch.call(self, u, i2).then(function (res) {
          if (!isBad(res.status)) return res;
          if (cloud) {
            if (step === 0 && body && Array.isArray(body.messages)) {
              var b2 = Object.assign({}, body, { model: (body.model === 'openai-fast' ? 'openai' : 'openai-fast') });
              return go(url, Object.assign({}, i2, { body: JSON.stringify(b2) }), 1);
            }
            if (step === 1 && body && Array.isArray(body.messages) && !streaming) {
              return go('https://text.pollinations.ai/' + encodeURIComponent(flatten(body)), { method: 'GET' }, 2);
            }
            return res;
          }
          if (step === 0) {
            return new Promise(function (r) { setTimeout(r, 2500); }).then(function () { return go(u, i2, 1); });
          }
          return res;
        });
      }
      return go(url, init, 0);
    } catch (e3) {
      return realFetch.apply(this, arguments);
    }
  };

  try { console.log('[hl220] online: relay self-heal (refusals reroute, never surface)'); } catch (e4) {}
})();
