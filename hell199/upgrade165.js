/* hl165-current — THE CURRENT: a hairline gold river along the top edge that flows while the Order's voices are being fetched (any network request), then stills and fades when the channel goes quiet */
(function () {
  if (window.__HL165) return; window.__HL165 = 1;
  var css = ".hl165-current{position:fixed;top:0;left:0;height:2px;width:0%;z-index:9990;pointer-events:none;opacity:0;transition:opacity .45s ease;background:linear-gradient(90deg,rgba(197,164,91,.15),#c5a45b 45%,rgba(240,214,140,.95) 55%,rgba(197,164,91,.15));box-shadow:0 0 9px rgba(197,164,91,.5)}.hl165-current.on{opacity:1}@media (prefers-reduced-motion: reduce){.hl165-current{transition:opacity .45s ease}}";
  var st = document.createElement('style'); st.id = 'hl165-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var bar = null;
  function ensure() {
    if (bar || !document.body) return false;
    bar = document.createElement('div');
    bar.className = 'hl165-current';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    return true;
  }
  var tries = 0; var iv = setInterval(function () {
    if (ensure()) {
      clearInterval(iv);
      try {
        var orig = window.fetch;
        var inflight = 0, timer = null;
        function creep() {
          var w = parseFloat(bar.style.width) || 0;
          var target = 88;
          w += (target - w) * 0.045 + 0.15;
          if (w > target) w = target;
          bar.style.width = w.toFixed(2) + '%';
        }
        function start() {
          inflight++;
          bar.classList.add('on');
          if (!timer) timer = setInterval(creep, 70);
        }
        function settle() {
          inflight = Math.max(0, inflight - 1);
          if (inflight === 0) finish();
        }
        function finish() {
          if (timer) { clearInterval(timer); timer = null; }
          bar.style.width = '100%';
          setTimeout(function () {
            bar.classList.remove('on');
            setTimeout(function () { bar.style.width = '0%'; }, 500);
          }, 300);
        }
        window.fetch = function () {
          try { start(); } catch (e) {}
          var p = orig.apply(this, arguments);
          return p.then(function (r) { try { settle(); } catch (e) {} return r; }, function (er) { try { settle(); } catch (e) {} throw er; });
        };
      } catch (e) {}
    } else if (++tries > 90) clearInterval(iv);
  }, 800);
})();
