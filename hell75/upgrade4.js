// ILLUMINATI upgrade #4: The Eye Sees (v18.10)
// Keyboard easter egg: typing O-R-A-C-L-E anywhere opens a small overlay
// telling the user the eye is watching. Additive only.
(function () {
  function init() {
    try {
      if (document.getElementById('hl4-oracle')) return;
      var buf = '';
      var ov = document.createElement('div');
      ov.id = 'hl4-oracle';
      ov.style.cssText = 'position:fixed;inset:0;display:none;align-items:center;justify-content:center;' +
        'background:rgba(0,0,0,.85);z-index:99998;flex-direction:column;gap:12px;';
      ov.innerHTML = '<div style="font-size:44px">👁</div>' +
        '<div style="font-family:monospace;letter-spacing:4px;color:#00e5ff;font-size:16px">THE EYE SEES ALL</div>' +
        '<div style="font-family:monospace;color:rgba(255,255,255,.5);font-size:11px">press any key to close</div>';
      document.body.appendChild(ov);
      document.addEventListener('keydown', function (e) {
        if (ov.style.display === 'flex') { ov.style.display = 'none'; return; }
        if (e.key && e.key.length === 1) {
          buf = (buf + e.key.toLowerCase()).slice(-7);
          if (buf === 'oracle') {
            ov.style.display = 'flex';
            buf = '';
          }
        }
      });
    } catch (e) { /* silent */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();