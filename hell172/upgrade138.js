/* hl138: message-stamps - tiny gold log-stamp (time) under each feed message */
(function () {
  if (window.__HL138) return; window.__HL138 = true;
  var css = ".hl138-stamp{display:block;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9px;line-height:1.5;color:#c9a84f;opacity:.55;letter-spacing:1.5px;text-align:right;margin:3px 6px 8px;pointer-events:none;user-select:none}";
  var st = document.createElement('style'); st.id = 'hl138-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var feed = document.getElementById('feedlist') || document.getElementById('chat');
  if (!feed) return;
  function stamp(el) {
    if (!el || el.nodeType !== 1 || el.dataset.hl138) return;
    if (el.id && el.id.indexOf('hl136-rail') === 0) return;
    var txt = (el.textContent || '').trim();
    if (!txt) return;
    el.dataset.hl138 = '1';
    var s = document.createElement('span');
    s.className = 'hl138-stamp';
    var d = new Date();
    var hh = ('0' + d.getHours()).slice(-2), mm = ('0' + d.getMinutes()).slice(-2), ss = ('0' + d.getSeconds()).slice(-2);
    s.textContent = '\u25c8 ' + hh + ':' + mm + ':' + ss;
    el.appendChild(s);
  }
  var kids = feed.children;
  for (var i = 0; i < kids.length; i++) stamp(kids[i]);
  new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      for (var i = 0; i < m.addedNodes.length; i++) stamp(m.addedNodes[i]);
    });
  }).observe(feed, { childList: true, subtree: false });
})();
