/* ILLUMINATI upgrade #122: hl122-emblem (v19.30)
   Owner request: replace the site icon with Trevor's gold eye-in-pyramid emblem.
   The favicon carries his actual artwork (32px data URI); the app/manifest icon
   is the vector emblem at ../hell85/emblem.svg. Runs after hl119 and re-asserts
   itself so the older gold favicon cannot win. Everything else untouched. */
(function () {
  if (window.__HL122) return; window.__HL122 = true;
  var FAV = 'data:image/png;base64,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';
  var EMBLEM = '../hell85/emblem.svg?v=2';
  function set() {
    try {
      var l = document.querySelector('link[rel~="icon"]') || document.createElement('link');
      l.rel = 'icon'; l.type = 'image/png'; l.href = FAV;
      if (!l.parentNode) document.head.appendChild(l);
      var a = document.querySelector('link[rel="apple-touch-icon"]') || document.createElement('link');
      a.rel = 'apple-touch-icon'; a.href = EMBLEM;
      if (!a.parentNode) document.head.appendChild(a);
    } catch (e) {}
  }
  set();
  [300, 1200, 3000, 6000].forEach(function (t) { setTimeout(set, t); });
})();
