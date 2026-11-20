/* ILLUMINATI upgrade 509 - TRANSLATE (hl509)
   Major capability: real translation inside the chat. Say "translate good
   morning to spanish", "translate this to japanese: where is the train", or
   "translate to french" to translate the AI's last reply. A panel shows the
   original and the translation with a COPY button. 60+ languages, free
   public translation service, nothing to sign up for. Nothing removed. */
(function () {
  if (window.__HL509) return; window.__HL509 = true;

  var L = { 'spanish':'es','french':'fr','german':'de','italian':'it','portuguese':'pt','russian':'ru','japanese':'ja','korean':'ko','chinese':'zh-CN','mandarin':'zh-CN','cantonese':'zh-TW','arabic':'ar','hindi':'hi','bengali':'bn','urdu':'ur','turkish':'tr','dutch':'nl','polish':'pl','swedish':'sv','norwegian':'no','danish':'da','finnish':'fi','greek':'el','hebrew':'he','thai':'th','vietnamese':'vi','indonesian':'id','malay':'ms','filipino':'tl','tagalog':'tl','swahili':'sw','yoruba':'yo','igbo':'ig','hausa':'ha','zulu':'zu','afrikaans':'af','romanian':'ro','ukrainian':'uk','czech':'cs','slovak':'sk','hungarian':'hu','bulgarian':'bg','serbian':'sr','croatian':'hr','albanian':'sq','persian':'fa','farsi':'fa','punjabi':'pa','tamil':'ta','telugu':'te','kannada':'kn','malayalam':'ml','marathi':'mr','gujarati':'gu','nepali':'ne','sinhala':'si','latin':'la','esperanto':'eo','icelandic':'is','irish':'ga','welsh':'cy','catalan':'ca','galician':'gl','basque':'eu','estonian':'et','latvian':'lv','lithuanian':'lt','slovenian':'sl','macedonian':'mk','somali':'so','amharic':'am' };

  function parse(txt) {
    var m = /^\s*translate\b(.*)$/i.exec(txt);
    if (!m) return null;
    var rest = m[1];
    var fm = /\bfrom\s+([a-z]+)\b/i.exec(rest);
    var tm = /\b(?:to|into|in)\s+([a-z]+)\b/i.exec(rest);
    var tgt = null, tgtName = null, src = 'en';
    if (tm && L[tm[1].toLowerCase()]) { tgt = L[tm[1].toLowerCase()]; tgtName = tm[1].toLowerCase(); }
    if (fm && L[fm[1].toLowerCase()]) src = L[fm[1].toLowerCase()];
    var text = rest;
    if (fm) text = text.replace(fm[0], ' ');
    if (tm) text = text.replace(tm[0], ' ');
    text = text.replace(/^[\s:,\-]+/, '').replace(/[\s:,\-]+$/, '').trim();
    if (/^(this|it|that|the (last )?(reply|answer|message))$/i.test(text)) text = '';
    if (text.length > 500) text = text.slice(0, 500);
    return { text: text, src: src, tgt: tgt, tgtName: tgtName };
  }

  function panel(title, orig, tr) {
    var old = document.querySelector('.hl509panel'); if (old) old.remove();
    var wrap = document.createElement('div');
    wrap.className = 'hl509panel';
    wrap.style.cssText = 'position:fixed;left:10px;right:10px;bottom:76px;z-index:99990;border:1px solid rgba(212,175,55,.45);border-radius:12px;background:#0a0a0a;box-shadow:0 10px 40px rgba(0,0,0,.7);';
    var bar = document.createElement('div');
    bar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:9px 12px;background:rgba(212,175,55,.1);';
    var lab = document.createElement('span'); lab.textContent = title;
    lab.style.cssText = 'font-size:11px;letter-spacing:.12em;color:#c9b458;flex:1;';
    var x = document.createElement('button'); x.textContent = 'CLOSE';
    x.style.cssText = 'padding:5px 10px;font-size:10px;border:1px solid rgba(212,175,55,.5);border-radius:6px;background:#141414;color:#e8cf7a;cursor:pointer;';
    x.addEventListener('click', function () { wrap.remove(); });
    bar.appendChild(lab); bar.appendChild(x); wrap.appendChild(bar);
    var body = document.createElement('div'); body.style.cssText = 'padding:8px 12px 12px 12px;';
    wrap.appendChild(body);
    if (orig) {
      var o = document.createElement('div'); o.textContent = orig;
      o.style.cssText = 'font-size:12px;color:#9a8a55;padding:4px 0 8px 0;border-bottom:1px solid rgba(212,175,55,.15);word-break:break-word;';
      body.appendChild(o);
    }
    if (tr) {
      var t = document.createElement('div'); t.textContent = tr;
      t.style.cssText = 'font-size:14px;color:#e8cf7a;padding:8px 0;word-break:break-word;';
      body.appendChild(t);
      var cp = document.createElement('button'); cp.textContent = 'COPY';
      cp.style.cssText = 'padding:6px 12px;font-size:10px;border:1px solid rgba(212,175,55,.5);border-radius:6px;background:#141414;color:#e8cf7a;cursor:pointer;';
      cp.addEventListener('click', function () {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(tr);
          else { var ta = document.createElement('textarea'); ta.value = tr; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
          cp.textContent = 'COPIED';
          setTimeout(function () { cp.textContent = 'COPY'; }, 1500);
        } catch (e) {}
      });
      body.appendChild(cp);
    }
    document.body.appendChild(wrap);
  }

  function go(hit) {
    if (!hit.tgt) {
      panel('TRANSLATE', hit.text || '', 'unknown language' + (hit.tgtName ? ' "' + hit.tgtName + '"' : '') + '. try: spanish, french, japanese, yoruba, swahili, hindi...');
      return;
    }
    if (!hit.text) {
      var last = window.__HL509LAST;
      if (last) { hit.text = last.slice(0, 500); }
      else { panel('TRANSLATE', '', 'give me the words: "translate good morning to ' + (hit.tgtName || 'spanish') + '"'); return; }
    }
    var url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(hit.text) + '&langpair=' + hit.src + '|' + hit.tgt;
    fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      var t = j && j.responseData && j.responseData.translatedText;
      var pair = hit.src.toUpperCase() + ' \u2192 ' + hit.tgt.toUpperCase();
      panel('TRANSLATE ' + pair, hit.text, t || ('the translation service came back empty. try again in a moment.'));
      try { console.log('[hl509] translated to ' + hit.tgt); } catch (e) {}
    })['catch'](function (e) {
      panel('TRANSLATE', hit.text, 'translation call failed. check your connection and try again.');
      try { console.log('[hl509] translate failed'); } catch (e2) {}
    });
  }

  var tmr = null, seen = {};
  function kick() { if (tmr) return; tmr = setTimeout(function () { tmr = null; scan(); }, 350); }
  function scan() {
    try {
      if (Object.keys(seen).length > 500) seen = {};
      var chat = document.getElementById('chat') || document.querySelector('main') || document.body;
      var kids = chat.children;
      for (var i = 0; i < kids.length; i++) {
        var n = kids[i];
        if (n.classList && (n.classList.contains('hl509panel') || n.classList.contains('hl508panel') || n.classList.contains('hl504plot'))) continue;
        var txt = ''; try { txt = (n.textContent || '').trim(); } catch (e2) {}
        if (!txt) continue;
        if (txt.length > 600) {
          if (!/^(remember|forget|translate|what do you remember|memory bank|clear memory|wipe memory)\b/i.test(txt)) window.__HL509LAST = txt.slice(0, 500);
          continue;
        }
        if (seen[txt]) continue;
        seen[txt] = 1;
        var hit = parse(txt);
        if (hit) { try { console.log('[hl509] translate: ' + (hit.text || '(last reply)') + ' -> ' + (hit.tgt || '?')); } catch (e3) {} go(hit); }
      }
    } catch (e4) {}
  }
  var c = document.getElementById('chat') || document.querySelector('main');
  if (c) new MutationObserver(kick).observe(c, { childList: true, subtree: true, characterData: true });
  setInterval(scan, 2500);

  try { console.log('[hl509] translate online: say "translate good morning to spanish"'); } catch (e5) {}
})();
