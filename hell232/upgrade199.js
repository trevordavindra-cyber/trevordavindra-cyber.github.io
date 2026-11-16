/* ILLUMINATI upgrade #199: hl199-voicestudio — THE VOICE STUDIO
   A studio to select or make the Order's voice: a relay voice pitched down
   through playback, or any device voice tuned deep. THE ABYSS preset (dark,
   heavy, strained, deep) ships as the default. Wires into the EXISTING speak
   path by wrapping speechSynthesis.speak, so every SPEAK button, the settings
   SPEAK REPLIES toggle and all upgrades keep working untouched. The "/" hint,
   the council, the REA and every other feature are unaffected; turn ABYSS off
   and speech returns exactly as it was. */
(function () {
  if (window.__HL199) return; window.__HL199 = 1;
  var $id = function (i) { return document.getElementById(i); };
  var S = { on: true, src: 'relay', voice: '', rate: 0.72 };
  try {
    var raw = localStorage.getItem('hl199-voice');
    if (raw) { var j = JSON.parse(raw); if (j && typeof j === 'object') { S.on = !!j.on; S.src = j.src === 'device' ? 'device' : 'relay'; S.voice = j.voice || ''; if (isFinite(j.rate)) S.rate = Math.min(1, Math.max(0.5, parseFloat(j.rate))); } }
  } catch (e) { }
  function save() { try { localStorage.setItem('hl199-voice', JSON.stringify(S)); } catch (e) { } }

  var css = document.createElement('style'); css.id = 'hl199-style';
  css.textContent = [
    '#hl199-panel{position:fixed;inset:0;z-index:2147483001;display:none;background:rgba(4,3,2,.88);}',
    '#hl199-panel.on{display:flex;align-items:center;justify-content:center;}',
    '#hl199-card{width:min(92vw,420px);max-height:80vh;overflow:auto;background:linear-gradient(160deg,#14100a,#0c0a06);border:1px solid rgba(198,166,77,.55);border-radius:4px;padding:16px 16px 14px;color:#c6a64d;font:12px/1.5 Georgia,"Times New Roman",serif;letter-spacing:.06em;box-shadow:0 0 30px rgba(0,0,0,.8);}',
    '#hl199-card h2{margin:0 0 4px;font-size:14px;letter-spacing:.2em;color:#e0c268;font-weight:600;}',
    '#hl199-card p{margin:2px 0 10px;color:rgba(198,166,77,.7);font-size:10.5px;}',
    '.hl199-row{display:flex;gap:6px;margin:6px 0;flex-wrap:wrap;}',
    '.hl199-b{flex:1;min-width:88px;background:rgba(198,166,77,.08);border:1px solid rgba(198,166,77,.5);color:#c6a64d;font:600 10.5px/1.3 Georgia,serif;letter-spacing:.12em;padding:8px 6px;border-radius:2px;text-transform:uppercase;}',
    '.hl199-b.hot{background:rgba(198,166,77,.22);color:#eed9a0;}',
    '#hl199-voices{width:100%;background:rgba(198,166,77,.06);border:1px solid rgba(198,166,77,.4);color:#c6a64d;font:11px Georgia,serif;padding:7px;border-radius:2px;margin:4px 0;}',
    '#hl199-rate{width:100%;accent-color:#c6a64d;margin:6px 0 2px;}',
    '#hl199-foot{margin-top:10px;color:rgba(198,166,77,.55);font-size:9.5px;letter-spacing:.08em;}'
  ].join('');
  (document.head || document.documentElement).appendChild(css);

  /* ---------- speak pipeline ---------- */
  var origSpeak = null, origCancel = null;
  try { origSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis); } catch (e) { }
  try { origCancel = window.speechSynthesis.cancel.bind(window.speechSynthesis); } catch (e) { }
  var curAu = null, gen = 0;
  function stopAudio() {
    if (curAu) { try { curAu.pause(); curAu.src = ''; } catch (e) { } curAu = null; }
  }
  function chunk(t) {
    var parts = [], w = String(t).split(/(\s+)/), line = '';
    for (var i = 0; i < w.length; i++) {
      if ((line + w[i]).length > 180 && line.trim()) { parts.push(line.trim()); line = ''; }
      line += w[i];
    }
    if (line.trim()) parts.push(line.trim());
    return parts.length ? parts : [String(t).slice(0, 180)];
  }
  function playDevice(txt, u, fin) {
    try {
      var ut = new SpeechSynthesisUtterance(txt);
      ut.pitch = 0.1; ut.rate = Math.max(0.5, Math.min(1, S.rate));
      if (S.voice) {
        var vs = window.speechSynthesis.getVoices() || [];
        for (var i = 0; i < vs.length; i++) { if (vs[i].name === S.voice) { ut.voice = vs[i]; break; } }
      }
      var done = false;
      ut.onend = function () { if (!done) { done = true; fin(); } };
      ut.onerror = function () { if (!done) { done = true; fin(); } };
      if (origSpeak) origSpeak(ut); else fin();
    } catch (e) { fin(); }
  }
  function playRelay(txt, fin, tryN) {
    tryN = tryN || 0;
    var au = new Audio('https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=' + encodeURIComponent(txt));
    curAu = au;
    au.playbackRate = S.rate;
    try { au.preservesPitch = false; au.webkitPreservesPitch = false; } catch (e) { }
    au.onended = function () { if (curAu === au) { curAu = null; fin(); } };
    au.onerror = function () {
      if (curAu !== au) return;
      curAu = null;
      if (tryN < 1) { playDevice(txt, null, fin); } else { fin(); }
    };
    var p = au.play();
    if (p && p.catch) p.catch(function () { if (curAu === au) { stopAudio(); playDevice(txt, null, fin); } });
  }
  function speakDark(txt, u) {
    var my = ++gen, done = false;
    var fin = function () { if (!done && my === gen) { done = true; if (u && u.onend) { try { u.onend.call(u); } catch (e) { } } } };
    if (u && u.onstart) { try { u.onstart.call(u); } catch (e) { } }
    var parts = chunk(txt);
    (function next(i) {
      if (my !== gen) return;
      if (i >= parts.length) { fin(); return; }
      var fin2 = function () { if (my === gen) next(i + 1); };
      if (S.src === 'relay') playRelay(parts[i], fin2); else playDevice(parts[i], u, fin2);
    })(0);
  }
  window.__hl199 = {
    state: S,
    preview: function () {
      var u = new SpeechSynthesisUtterance('the abyss opens. the order is listening.');
      this.speak(u);
    },
    speak: function (u) {
      if (!S.on || !origSpeak) { if (origSpeak) { try { origSpeak(u); } catch (e) { } } return; }
      gen++;
      try { if (origCancel) origCancel(); } catch (e) { }
      stopAudio();
      var txt = (u && u.text) || '';
      if (!txt) { try { origSpeak(u); } catch (e) { } return; }
      speakDark(txt, u);
    }
  };
  try {
    window.speechSynthesis.speak = function (u) { window.__hl199.speak(u); };
    window.speechSynthesis.cancel = function () { gen++; stopAudio(); if (origCancel) origCancel(); };
  } catch (e) { }

  /* ---------- UI ---------- */
  function mkbtn(txt) { var b = document.createElement('button'); b.className = 'hl199-b'; b.type = 'button'; b.textContent = txt; return b; }
  function paintBtn() {
    var b = $id('hl199-btn'); if (b) b.textContent = 'ABYSS VOICE: ' + (S.on ? 'ON' : 'OFF');
  }
  function buildPanel() {
    if ($id('hl199-panel')) return true;
    var pan = document.createElement('div'); pan.id = 'hl199-panel';
    pan.innerHTML = '<div id="hl199-card">' +
      '<h2>VOICE STUDIO</h2>' +
      '<p>select or make the order\u2019s voice. the abyss is dark, heavy, strained, deep.</p>' +
      '<div class="hl199-row">' +
      '<button id="hl199-src-relay" class="hl199-b">RELAY VOICE</button>' +
      '<button id="hl199-src-device" class="hl199-b">DEVICE VOICE</button>' +
      '</div>' +
      '<select id="hl199-voices"><option value="">DEEPEST DEVICE VOICE (AUTO)</option></select>' +
      '<div>DEPTH \u00b7 ' + '<input id="hl199-rate" type="range" min="0.55" max="1" step="0.01">' +
      '<span id="hl199-ratev"></span></div>' +
      '<div class="hl199-row">' +
      '<button id="hl199-prev" class="hl199-b">PREVIEW</button>' +
      '<button id="hl199-preset" class="hl199-b">THE ABYSS</button>' +
      '<button id="hl199-save" class="hl199-b">SAVE + CLOSE</button>' +
      '</div>' +
      '<div id="hl199-foot">relay is the order\u2019s own voice, pitched down. device uses your phone\u2019s voices. settings \u00b7 abyss voice turns it off entirely.</div>' +
      '</div>';
    document.body.appendChild(pan);
    $id('hl199-src-relay').addEventListener('click', function () { S.src = 'relay'; paint(); });
    $id('hl199-src-device').addEventListener('click', function () { S.src = 'device'; paint(); });
    $id('hl199-voices').addEventListener('change', function () { S.voice = this.value; });
    $id('hl199-rate').addEventListener('input', function () { S.rate = parseFloat(this.value) || 0.72; $id('hl199-ratev').textContent = Math.round(S.rate * 100) + '%'; });
    $id('hl199-prev').addEventListener('click', function () { window.__hl199.preview(); });
    $id('hl199-preset').addEventListener('click', function () { S.src = 'relay'; S.voice = ''; S.rate = 0.72; save(); paint(); });
    $id('hl199-save').addEventListener('click', function () { save(); close(); });
    pan.addEventListener('click', function (e) { if (e.target === pan) close(); });
    function paint() {
      $id('hl199-src-relay').className = 'hl199-b' + (S.src === 'relay' ? ' hot' : '');
      $id('hl199-src-device').className = 'hl199-b' + (S.src === 'device' ? ' hot' : '');
      $id('hl199-voices').style.display = S.src === 'device' ? 'block' : 'none';
      $id('hl199-rate').value = S.rate; $id('hl199-ratev').textContent = Math.round(S.rate * 100) + '%';
      fillVoices();
    }
    function fillVoices() {
      var sel = $id('hl199-voices'); if (!sel) return;
      var vs = []; try { vs = window.speechSynthesis.getVoices() || []; } catch (e) { }
      var cur = sel.value;
      sel.innerHTML = '<option value="">DEEPEST DEVICE VOICE (AUTO)</option>';
      var prefer = /daniel|arthur|fred|albert|alex|george|gordon|eddy|reed|rocko|grand|male/i;
      var sorted = vs.slice().sort(function (a, b) { return (prefer.test(b.name) ? 1 : 0) - (prefer.test(a.name) ? 1 : 0); });
      sorted.forEach(function (v) { var o = document.createElement('option'); o.value = v.name; o.textContent = v.name; sel.appendChild(o); });
      if (cur) sel.value = cur;
      if (S.voice) sel.value = S.voice;
    }
    try { window.speechSynthesis.addEventListener && window.speechSynthesis.addEventListener('voiceschanged', fillVoices); } catch (e) { }
    paint();
    return true;
  }
  function open() { if (buildPanel()) { $id('hl199-panel').classList.add('on'); } }
  function close() { var p = $id('hl199-panel'); if (p) p.classList.remove('on'); }
  window.__hl199.open = open; window.__hl199.close = close;
  function buildBar() {
    var bs = $id('b-speak');
    if (!bs || !bs.parentNode) return false;
    if ($id('hl199-btn')) return true;
    var b1 = mkbtn(''); b1.id = 'hl199-btn'; b1.addEventListener('click', function () { S.on = !S.on; save(); paintBtn(); });
    var b2 = mkbtn('VOICE STUDIO'); b2.id = 'hl199-studio-btn'; b2.addEventListener('click', open);
    bs.parentNode.appendChild(b1); bs.parentNode.appendChild(b2);
    paintBtn();
    return true;
  }
  var iv = setInterval(function () { if (document.body && buildBar()) clearInterval(iv); }, 1200);
  setTimeout(function () { clearInterval(iv); }, 180000);
})();
