/* hl167-sentinel — THE SENTINEL: when the channel is severed the Order says so — a gold notice appears when the connection drops and confirms when it returns */
(function () {
  if (window.__HL167) return; window.__HL167 = 1;
  var css = ".hl167-banner{position:fixed;top:14px;left:50%;transform:translate(-50%,-14px);z-index:9600;pointer-events:none;opacity:0;transition:opacity .5s ease,transform .5s cubic-bezier(.2,.7,.2,1);background:rgba(8,8,8,.94);border:1px solid rgba(197,164,91,.55);border-left:3px solid #c5a45b;padding:10px 18px;color:#e8d9a8;font-family:Georgia,'Times New Roman',serif;font-size:12px;letter-spacing:.24em;text-transform:uppercase;box-shadow:0 4px 26px rgba(0,0,0,.7),0 0 18px rgba(197,164,91,.12);max-width:86vw;text-align:center;white-space:normal}.hl167-banner.on{opacity:1;transform:translate(-50%,0)}@media (max-width:640px){.hl167-banner{font-size:10px;padding:9px 14px;top:12px}}";
  var st = document.createElement('style'); st.id = 'hl167-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var banner = null;
  function ensure() {
    if (banner || !document.body) return false;
    banner = document.createElement('div');
    banner.className = 'hl167-banner';
    banner.setAttribute('aria-hidden', 'true');
    document.body.appendChild(banner);
    return true;
  }
  function say(text, hold) {
    banner.textContent = text;
    banner.classList.add('on');
    clearTimeout(say._t);
    if (!hold) say._t = setTimeout(function () { banner.classList.remove('on'); }, 2800);
  }
  var tries = 0; var iv = setInterval(function () {
    if (ensure()) {
      clearInterval(iv);
      window.addEventListener('offline', function () { say('THE CHANNEL IS SEVERED \u2014 WORDS WAIT FOR THE VEIL TO LIFT', true); });
      window.addEventListener('online', function () { say('THE CHANNEL IS RESTORED'); });
      if (navigator.onLine === false) say('THE CHANNEL IS SEVERED \u2014 WORDS WAIT FOR THE VEIL TO LIFT', true);
    } else if (++tries > 90) clearInterval(iv);
  }, 800);
})();
