/* hl146-voice — dictate into the composer: gold mic chip, live transcript, institutional toasts */
(function () {
  if (window.__HL146) return; window.__HL146 = 1;
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var css = ".hl146-chip{position:fixed;right:10px;top:calc(50% + 12px);z-index:8550;width:34px;height:34px;border-radius:50%;background:rgba(13,13,13,.92);border:1px solid rgba(197,164,91,.45);color:#C5A45B;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:.72;transition:opacity .2s,border-color .2s;box-sizing:border-box;padding:0}.hl146-chip:hover{opacity:1;border-color:rgba(197,164,91,.8)}.hl146-chip svg{width:15px;height:15px;fill:#C5A45B;pointer-events:none}.hl146-on{opacity:1!important;border-color:#C5A45B!important;box-shadow:0 0 0 3px rgba(197,164,91,.18),0 0 14px rgba(197,164,91,.35);animation:hl146pulse 1.4s ease-out infinite}@keyframes hl146pulse{0%{box-shadow:0 0 0 2px rgba(197,164,91,.35),0 0 10px rgba(197,164,91,.25)}70%{box-shadow:0 0 0 9px rgba(197,164,91,0),0 0 18px rgba(197,164,91,.4)}100%{box-shadow:0 0 0 2px rgba(197,164,91,0),0 0 10px rgba(197,164,91,.25)}}.hl146-pill{position:fixed;right:52px;top:calc(50% + 15px);z-index:8551;display:none;max-width:min(300px,60vw);background:rgba(10,10,10,.95);border:1px solid rgba(197,164,91,.5);color:#C5A45B;font:600 9px Inter,system-ui,sans-serif;letter-spacing:.08em;border-radius:4px;padding:5px 9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}.hl146-toast{position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:9600;background:rgba(10,10,10,.96);border:1px solid rgba(197,164,91,.55);color:#EDE3CE;font:600 10px Inter,system-ui,sans-serif;letter-spacing:.14em;border-radius:5px;padding:9px 14px;opacity:0;transition:opacity .3s;pointer-events:none;max-width:86vw;text-align:center}@media (max-width:640px){.hl146-chip{width:30px;height:30px;right:7px;top:calc(50% + 10px)}.hl146-chip svg{width:13px;height:13px}.hl146-pill{right:44px;top:calc(50% + 13px)}}";
  var st = document.createElement('style'); st.id = 'hl146-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var chip, pill, toast, rec, on = false, tt;
  function micSvg() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"/></svg>';
  }
  function toast(msg) {
    if (!toast) return;
    toast.textContent = msg; toast.style.opacity = '1';
    clearTimeout(tt); tt = setTimeout(function () { toast.style.opacity = '0'; }, 2600);
  }
  function setTxt(v) {
    var t = document.querySelector('#txt'); if (!t) return false;
    t.value = v;
    try { t.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) { }
    try { t.focus(); } catch (e) { }
    return true;
  }
  function build() {
    if (!SR || chip || !document.body) return false;
    chip = document.createElement('button'); chip.className = 'hl146-chip'; chip.type = 'button';
    chip.setAttribute('aria-label', 'Dictate into the composer'); chip.title = 'Dictate';
    chip.innerHTML = micSvg();
    chip.addEventListener('click', toggle);
    document.body.appendChild(chip);
    pill = document.createElement('div'); pill.className = 'hl146-pill'; pill.setAttribute('aria-live', 'polite'); document.body.appendChild(pill);
    toast = document.createElement('div'); toast.className = 'hl146-toast'; document.body.appendChild(toast);
    return true;
  }
  function toggle() {
    if (on) { try { rec.stop(); } catch (e) { } return; }
    try {
      rec = new SR();
      rec.lang = (navigator.language || 'en-US'); rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
      rec.onstart = function () { on = true; chip.classList.add('hl146-on'); pill.textContent = 'LISTENING'; pill.style.display = 'block'; };
      rec.onresult = function (e) {
        var fin = '', intr = '';
        for (var i = 0; i < e.results.length; i++) {
          var r = e.results[i];
          if (r.isFinal) fin += r[0].transcript; else intr += r[0].transcript;
        }
        var txt = (fin + intr).trim();
        if (txt) {
          pill.textContent = 'LISTENING \u00b7 ' + txt.slice(-38).toUpperCase();
          setTxt(txt);
        }
      };
      rec.onerror = function (e) {
        var m = { 'not-allowed': 'MICROPHONE ACCESS DENIED', 'service-not-allowed': 'SPEECH SERVICE UNAVAILABLE', 'no-speech': 'NO SPEECH DETECTED', 'network': 'SPEECH SERVICE UNAVAILABLE', 'audio-capture': 'NO MICROPHONE FOUND', 'aborted': '' }[e.error] || 'DICTATION UNAVAILABLE';
        if (m) toast(m);
      };
      rec.onend = function () {
        on = false; chip.classList.remove('hl146-on'); pill.style.display = 'none';
      };
      rec.start();
    } catch (e) { toast('DICTATION UNAVAILABLE'); }
  }
  var tries = 0; var iv = setInterval(function () { if (build()) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();
