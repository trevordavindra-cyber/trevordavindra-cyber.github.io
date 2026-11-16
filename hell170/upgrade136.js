/* hl136: scroll rune rail - gold progress rail with rune thumb on the chat feed */
(function () {
  if (window.__HL136) return; window.__HL136 = true;
  var css = "#hl136-rail{position:fixed;right:7px;top:150px;bottom:190px;width:18px;border-radius:6px;background:none;z-index:4;opacity:0;transition:opacity .35s;pointer-events:none}#hl136-rail.on{opacity:1;pointer-events:auto}#hl136-rail::before{content:'';position:absolute;left:8px;top:0;bottom:0;width:3px;border-radius:2px;background:rgba(201,168,79,.16)}#hl136-thumb{position:absolute;left:3px;width:14px;height:14px;border-radius:50%;background:#c9a84f;color:#0a0a0a;font:700 9px/14px 'Courier New',monospace;text-align:center;box-shadow:0 0 9px rgba(201,168,79,.55);cursor:pointer;transition:top .12s linear,transform .15s}#hl136-thumb:active{transform:scale(1.4)}";
  var st = document.createElement('style'); st.id = 'hl136-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var rail = null, thumb = null, chat = null;
  function init() {
    chat = document.getElementById('chat'); if (!chat) return false;
    rail = document.createElement('div'); rail.id = 'hl136-rail';
    thumb = document.createElement('div'); thumb.id = 'hl136-thumb'; thumb.textContent = '\u16C9';
    rail.appendChild(thumb); document.body.appendChild(rail);
    rail.addEventListener('click', function (e) {
      var r = rail.getBoundingClientRect();
      var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      chat.scrollTo({ top: (e.clientY < r.top + r.height / 2) ? 0 : chat.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    });
    chat.addEventListener('scroll', function () { requestAnimationFrame(upd); }, { passive: true });
    return true;
  }
  function upd() {
    if (!rail) { if (!init()) return; }
    var max = chat.scrollHeight - chat.clientHeight;
    if (max <= 8) { rail.classList.remove('on'); return; }
    rail.classList.add('on');
    var track = rail.clientHeight - 14;
    var p = chat.scrollTop / max;
    thumb.style.top = Math.round(p * track) + 'px';
  }
  var iv = setInterval(upd, 700);
  window.addEventListener('resize', upd);
})();
