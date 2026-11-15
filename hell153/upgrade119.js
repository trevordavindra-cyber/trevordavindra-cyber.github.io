
/* ILLUMINATI upgrade #119: hl119-grand-order — the Order dressed in black marble and antique gold.
   Display layer only: recolors, typography, emblem, section naming, micro-details.
   Preserves every existing feature, handler, theme dial and the honesty protocol untouched.
   Other bloodline themes (phantom/ghost/overdrive/void/cybernetic) are left exactly as they were. */
(function () {
  if (window.__HL119) return; window.__HL119 = 1;
  var TAG = '[hl119] ';

  var CSS = 'body[data-hl="bloodline"] ::-webkit-scrollbar-thumb{background:rgba(201,163,92,.4);border-radius:2px}\nbody[data-hl="bloodline"]::after{content:\'\';position:fixed;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse at 50% 38%,transparent 52%,rgba(201,163,92,.07) 100%);animation:flick 6s infinite}\nbody[data-hl="bloodline"] #cine .c-emb{width:132px;height:132px;filter:drop-shadow(0 0 calc(26px*var(--glow)) rgba(201,163,92,.55));animation:cemb 2.6s ease-out both}\nbody[data-hl="bloodline"] #cine .c-rings i{position:absolute;inset:0;border:1px solid rgba(201,163,92,.35);border-radius:50%;animation:cring 3.2s ease-out infinite}\nbody[data-hl="bloodline"] #cine .c-rings i:nth-child(2){animation-delay:1.1s;border-color:rgba(201,163,92,.2)}\nbody[data-hl="bloodline"] #gate .sigil{width:104px;height:104px;color:var(--acc);filter:drop-shadow(0 0 calc(16px*var(--glow)) rgba(201,163,92,.45));animation:sigp 4s ease-in-out infinite}\nbody[data-hl="bloodline"] #gate h2{font-family:Georgia,\'Times New Roman\',serif;font-size:34px;letter-spacing:.28em;color:var(--acc);text-shadow:0 0 calc(22px*var(--glow)) rgba(201,163,92,.4)}\nbody[data-hl="bloodline"] #voice .sigil{color:var(--acc);filter:drop-shadow(0 0 calc(18px*var(--glow)) rgba(201,163,92,.5))}\nbody[data-hl="bloodline"] #hdr{padding:8px 14px 7px;border-bottom:1px solid rgba(201,163,92,.16);background:rgba(9,9,12,.6);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}\nbody[data-hl="bloodline"] h1.glitch::before{color:rgba(201,163,92,.75);clip-path:inset(0 0 55% 0);transform:translateX(-1.2px);animation:gl1 3.1s infinite steps(2)}\nbody[data-hl="bloodline"] .hbtn{background:rgba(201,163,92,.12);border:1px solid rgba(201,163,92,.4);color:var(--acc);font-size:11px;width:26px;height:26px;border-radius:8px;cursor:pointer;margin-left:6px;flex:0 0 auto}\nbody[data-hl="bloodline"] #warn{margin-top:6px;font-size:9.5px;letter-spacing:.1em;color:#A3835A;border:1px dashed rgba(201,163,92,.4);padding:4px 8px;display:inline-block;border-radius:6px}\nbody[data-hl="bloodline"] #nav button.on{background:linear-gradient(135deg,var(--acc2),var(--acc));color:#fff;border-color:var(--acc);box-shadow:0 0 calc(14px*var(--glow)) rgba(201,163,92,.35)}\nbody[data-hl="bloodline"] #ticker{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:9.5px;color:var(--acc);padding:5px 12px;border-bottom:1px solid rgba(201,163,92,.14);letter-spacing:.08em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\nbody[data-hl="bloodline"] #corewrap{position:relative;height:148px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;border-bottom:1px solid rgba(201,163,92,.12);background:radial-gradient(ellipse at 50% 55%,rgba(201,163,92,.08) 0%,transparent 65%)}\nbody[data-hl="bloodline"] .line.you{align-self:flex-end;background:linear-gradient(135deg,var(--acc2),var(--acc));color:#fff;border-bottom-right-radius:5px;box-shadow:0 2px 14px rgba(201,163,92,.22)}\nbody[data-hl="bloodline"] .line.imp{align-self:flex-start;background:rgba(9,9,12,.78);color:var(--wht);border:1px solid rgba(201,163,92,.2);border-bottom-left-radius:5px;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}\nbody[data-hl="bloodline"] .line.omen{align-self:center;max-width:92%;background:rgba(201,163,92,.08);color:#CFAE74;font-size:12.5px;font-style:italic;text-align:center;border-radius:10px;padding:7px 12px}\nbody[data-hl="bloodline"] .line.r{border-color:rgba(201,163,92,.55);color:var(--acc);font-style:normal}\nbody[data-hl="bloodline"] .abtn:active{background:rgba(201,163,92,.25);color:#fff}\nbody[data-hl="bloodline"] #chips{display:flex;gap:6px;padding:6px 10px calc(6px);overflow-x:auto;-webkit-overflow-scrolling:touch;border-top:1px solid rgba(201,163,92,.12)}\nbody[data-hl="bloodline"] .pbtn{background:rgba(255,255,255,.04);border:1px solid rgba(201,163,92,.32);color:#d9d9de;font-size:11px;padding:7px 12px;cursor:pointer;font-family:inherit;border-radius:999px;letter-spacing:.04em;transition:all .18s}\nbody[data-hl="bloodline"] .pbtn.on{background:linear-gradient(135deg,var(--acc2),var(--acc));border-color:var(--acc);color:#fff;box-shadow:0 0 calc(12px*var(--glow)) rgba(201,163,92,.3)}\nbody[data-hl="bloodline"] .vdel{position:absolute;top:3px;right:3px;width:22px;height:22px;border-radius:50%;background:rgba(201,163,92,.8);color:#fff;border:none;font-size:13px;line-height:1;cursor:pointer}\nbody[data-hl="bloodline"] #txt:focus{border-color:var(--acc);box-shadow:0 0 calc(12px*var(--glow)) rgba(201,163,92,.25)}\nbody[data-hl="bloodline"] #clear{background:none;border:1px solid rgba(255,255,255,.14);color:#A3835A;font-size:10px;padding:9px 8px;cursor:pointer;font-family:inherit;border-radius:999px;flex:0 0 auto}\nbody[data-hl="bloodline"] #clear.hot{border-color:var(--acc);color:var(--acc);background:rgba(201,163,92,.08)}\nbody[data-hl="bloodline"] #sugs{display:none;position:absolute;bottom:70px;left:10px;right:10px;z-index:20;flex-direction:column;background:rgba(9,9,12,.92);border:1px solid rgba(201,163,92,.3);border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.6);overflow:hidden;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}\nbody[data-hl="bloodline"] #sugs div:active{background:rgba(201,163,92,.15)}\nbody[data-hl="bloodline"] .note{background:rgba(9,9,12,.92);color:var(--wht);font-size:11.5px;padding:9px 12px;border-radius:12px;border:1px solid rgba(201,163,92,.35);opacity:0;transform:translateY(-8px);transition:all .25s;box-shadow:0 6px 24px rgba(0,0,0,.6);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}\nbody[data-hl="bloodline"] .note.warn{background:rgba(201,163,92,.85)}\nbody[data-hl="bloodline"] #cmdp{margin:14vh auto 0;width:min(92%,460px);background:rgba(9,9,12,.95);border:1px solid rgba(201,163,92,.4);border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.7),0 0 calc(40px*var(--glow)) rgba(201,163,92,.12)}\nbody[data-hl="bloodline"] #cmdin{width:100%;background:none;border:none;border-bottom:1px solid rgba(201,163,92,.25);color:var(--wht);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;padding:14px 16px;outline:none;letter-spacing:.04em}\nbody[data-hl="bloodline"] .cmd-item.sel,\nbody[data-hl="bloodline"] .cmd-item:hover{background:rgba(201,163,92,.14);color:#fff}\nbody[data-hl="bloodline"] .win{position:absolute;min-width:320px;max-width:min(720px,90vw);height:min(560px,72vh);background:rgba(9,9,12,.88);border:1px solid rgba(201,163,92,.3);border-radius:16px;box-shadow:0 24px 70px rgba(0,0,0,.65),0 0 calc(30px*var(--glow)) rgba(201,163,92,.08);display:flex;flex-direction:column;overflow:hidden;pointer-events:auto;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);animation:winin .28s ease-out}\nbody[data-hl="bloodline"] .win-hd{display:flex;align-items:center;gap:8px;padding:9px 12px;background:rgba(201,163,92,.08);border-bottom:1px solid rgba(201,163,92,.25);cursor:grab;user-select:none;-webkit-user-select:none}\nbody[data-hl="bloodline"] .inp:focus{border-color:var(--acc);box-shadow:0 0 calc(10px*var(--glow)) rgba(201,163,92,.2)}\nbody[data-hl="bloodline"] .lab-note{font-size:11px;line-height:1.5;color:#C9B18F;border:1px dashed rgba(201,163,92,.45);border-radius:10px;padding:8px 10px;margin:6px 0 10px;background:rgba(201,163,92,.05)}\nbody[data-hl="bloodline"] .acard{background:rgba(9,9,12,.72);border:1px solid rgba(201,163,92,.22);border-radius:14px;padding:10px 12px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}\nbody[data-hl="bloodline"] .astat.err{color:var(--acc);border-color:rgba(201,163,92,.6)}\nbody[data-hl="bloodline"] .vote{background:none;border:1px solid rgba(201,163,92,.4);color:var(--acc);font-size:10px;padding:4px 10px;border-radius:999px;cursor:pointer;font-family:inherit;margin-top:8px}\nbody[data-hl="bloodline"] #graphc,\nbody[data-hl="bloodline"] #anc{width:100%;max-width:560px;display:block;margin:8px auto;border:1px solid rgba(201,163,92,.18);border-radius:14px;background:rgba(5,5,5,.5);touch-action:none}\nbody[data-hl="bloodline"] .fnode{background:rgba(9,9,12,.72);border:1px solid rgba(201,163,92,.25);border-radius:14px;margin:8px 0;position:relative;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}\nbody[data-hl="bloodline"] .fnode-hd{display:flex;align-items:center;gap:8px;padding:8px 10px;border-bottom:1px solid rgba(201,163,92,.18);cursor:grab;touch-action:none}\nbody[data-hl="bloodline"] .fcon{width:2px;height:14px;background:linear-gradient(rgba(201,163,92,.7),rgba(201,163,92,.15));margin:0 auto}\nbody[data-hl="bloodline"] #pj-list .pbtn.on{box-shadow:0 0 calc(10px*var(--glow)) rgba(201,163,92,.3)}\nbody[data-hl="bloodline"] #st-prev{background:rgba(9,9,12,.72);border:1px solid rgba(201,163,92,.22);border-radius:14px;padding:12px;font-size:13px;color:#d9d9de;margin-top:8px}\n/* ===== GRAND ORDER design system (display layer only, nothing removed) ===== */\nbody[data-hl="bloodline"]{--acc:#C9A35C;--acc2:#8A6D3F;--deep:#241C0E;--glow:.55}\nbody[data-hl="bloodline"] ::selection{background:#C9A35C;color:#0A0A0C}\nbody[data-hl="bloodline"] ::-webkit-scrollbar-thumb{background:rgba(201,163,92,.45)}\nbody[data-hl="bloodline"] ::-webkit-scrollbar-thumb:hover{background:rgba(201,163,92,.7)}\n/* black-marble ambience: layered charcoal sheen over the living background */\nbody[data-hl="bloodline"] #app{background:radial-gradient(1200px 700px at 12% -8%,rgba(201,163,92,.045),transparent 60%),radial-gradient(900px 620px at 92% 8%,rgba(138,109,63,.05),transparent 65%),radial-gradient(1400px 900px at 50% 118%,rgba(36,28,14,.55),transparent 70%)}\n/* serif display typography */\nbody[data-hl="bloodline"] h1.glitch{font-family:Didot,\'Bodoni MT\',\'Playfair Display\',Georgia,\'Times New Roman\',serif;font-weight:500;letter-spacing:.18em}\nbody[data-hl="bloodline"] #gate h2,body[data-hl="bloodline"] #cine .c-lines div:first-child{font-family:Didot,\'Bodoni MT\',\'Playfair Display\',Georgia,\'Times New Roman\',serif}\nbody[data-hl="bloodline"] h3{font-family:Didot,\'Bodoni MT\',\'Playfair Display\',Georgia,\'Times New Roman\',serif;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:#C9A35C}\nbody[data-hl="bloodline"] h3::after{content:\'\';display:inline-block;width:52px;height:1px;background:linear-gradient(90deg,rgba(201,163,92,.7),transparent);margin-left:10px;vertical-align:middle}\nbody[data-hl="bloodline"] #nav button{font-family:Georgia,\'Times New Roman\',serif;letter-spacing:.08em;font-weight:500;font-size:10.5px;border-radius:4px}\nbody[data-hl="bloodline"] #nav button.on{color:#0A0A0C}\nbody[data-hl="bloodline"] .pbtn,body[data-hl="bloodline"] .abtn,body[data-hl="bloodline"] .vote{letter-spacing:.06em}\n/* gold hairline under header + nav */\nbody[data-hl="bloodline"] #hdr::after,body[data-hl="bloodline"] #nav::after{content:\'\';display:block;height:1px;background:linear-gradient(90deg,transparent,rgba(201,163,92,.5) 18%,rgba(230,200,138,.85) 50%,rgba(201,163,92,.5) 82%,transparent)}\n/* restrained glow on the living canvases */\nbody[data-hl="bloodline"] #bg{filter:hue-rotate(36deg) saturate(.72) brightness(.92)}\nbody[data-hl="bloodline"] #core{filter:hue-rotate(36deg) saturate(.72)}\nbody[data-hl="bloodline"] #hl46-embers{filter:hue-rotate(36deg) saturate(.72)}\n/* grand order seal beside the title */\n.go-seal{display:inline-block;vertical-align:middle;width:20px;height:20px;margin:0 8px 0 2px;opacity:.9;animation:gorot 24s linear infinite;transform-origin:50% 50%}\n@keyframes gorot{to{transform:rotate(360deg)}}\n.go-seal svg{display:block;width:100%;height:100%}\n/* gate: grand order eyebrow + slow access hairline */\nbody[data-hl="bloodline"] #gate .go-eyebrow{font-family:Georgia,serif;font-size:10px;letter-spacing:.5em;color:rgba(201,163,92,.75);margin-bottom:10px}\nbody[data-hl="bloodline"] #gate{background:radial-gradient(900px 600px at 50% 30%,rgba(36,28,14,.35),transparent 70%),#020202}\nbody[data-hl="bloodline"] #gate::after{content:\'\';position:absolute;left:50%;bottom:22vh;width:130px;height:1px;transform:translateX(-50%);background:linear-gradient(90deg,transparent,rgba(201,163,92,.8),transparent);animation:goacc 3.4s ease-in-out infinite}\n@keyframes goacc{0%,100%{opacity:.25;transform:translateX(-50%) scaleX(.6)}50%{opacity:1;transform:translateX(-50%) scaleX(1)}}\n/* notifications, modals, cards: gold hairlines, soft shadow */\nbody[data-hl="bloodline"] .note{border-left:2px solid rgba(201,163,92,.65);border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,.5)}\nbody[data-hl="bloodline"] .win{border-radius:10px;box-shadow:0 24px 70px rgba(0,0,0,.6)}\nbody[data-hl="bloodline"] .win-hd,body[data-hl="bloodline"] .fnode-hd{font-family:Georgia,serif;letter-spacing:.12em;text-transform:uppercase}\nbody[data-hl="bloodline"] .acard{border-radius:8px}\nbody[data-hl="bloodline"] .inp,body[data-hl="bloodline"] #txt{border-radius:6px}\nbody[data-hl="bloodline"] .pbtn{border-radius:999px}\n/* roman numeral section markers */\n.go-rn{font-family:Didot,Georgia,serif;color:rgba(201,163,92,.7);font-weight:400;margin-right:7px;letter-spacing:.05em}\n/* mobile refinement */\n@media (max-width:820px){\n body[data-hl="bloodline"] h3{letter-spacing:.16em}\n body[data-hl="bloodline"] h3::after{width:34px;margin-left:8px}\n body[data-hl="bloodline"] #nav button{font-size:10px;padding:6px 8px}\n body[data-hl="bloodline"] #bg{opacity:.7}\n body[data-hl="bloodline"] .go-seal{width:16px;height:16px}\n}\n/* respect the site\'s own reduce-motion switch */\nbody[data-hl="bloodline"].rm .go-seal{animation:none}\nbody[data-hl="bloodline"].rm #gate::after{animation:none}\n';

  var RENAV = { home:'THE ORDER', status:'STATE', brain:'ORACLE', agents:'INNER CIRCLE', arena:'GAUNTLET',
    debate:'COUNCIL', persona:'MASKS', graph:'OBSERVATORY', hist:'ARCHIVE', vault:'BLACK VAULT',
    about:'CODEX', logs:'RECORDS', flow:'FLOW', projects:'WORKS', studio:'ATELIER' };
  var RETITLE = { 'm-brain':'THE ORACLE', 'm-agents':'THE INNER CIRCLE', 'm-graph':'THE OBSERVATORY',
    'm-hist':'THE GRAND ARCHIVE', 'm-vault':'THE BLACK VAULT', 'm-debate':'THE COUNCIL CHAMBER', 'm-about':'THE CODEX' };

  var SEAL = '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="20" cy="20" r="18.5" stroke="#C9A35C" stroke-opacity=".55" stroke-width="1"/>' +
    '<circle cx="20" cy="20" r="15" stroke="#C9A35C" stroke-opacity=".3" stroke-width=".6"/>' +
    '<path d="M20 12.5 L27 20 L20 27.5 L13 20 Z" stroke="#E6C88A" stroke-width="1"/>' +
    '<circle cx="20" cy="20" r="2.6" fill="#C9A35C"/>' +
    '<path d="M20 3.5 V9 M36.5 20 H31 M20 36.5 V31 M3.5 20 H9" stroke="#C9A35C" stroke-opacity=".8" stroke-width="1"/>' +
    '</svg>';

  var FAV = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#0A0A0C"/>' +
    '<circle cx="20" cy="20" r="14" stroke="#C9A35C" stroke-width="2" fill="none"/>' +
    '<path d="M20 12 L26 20 L20 28 L14 20 Z" stroke="#E6C88A" stroke-width="2" fill="none"/>' +
    '<circle cx="20" cy="20" r="3" fill="#C9A35C"/></svg>');

  function recolor(node) {
    var st = node.style; if (!st) return;
    ['color', 'backgroundColor', 'borderColor', 'boxShadow', 'background', 'border', 'textShadow'].forEach(function (p) {
      var v = st[p]; if (!v || v.indexOf('192, 0, 32') < 0 && v.indexOf('192,0,32') < 0 && v.toLowerCase().indexOf('#c00020') < 0) return;
      st[p] = v.replace(/rgba?\(192,\s*0,\s*32/g, 'rgba(201,163,92').replace(/#C00020/gi, '#C9A35C');
    });
  }

  function dress() {
    var head = document.head;
    if (head && !document.getElementById('hl119-style')) {
      var st = document.createElement('style'); st.id = 'hl119-style'; st.textContent = CSS; head.appendChild(st);
    }
    // original gold emblem favicon
    try {
      var link = document.querySelector('link[rel~="icon"]') || document.createElement('link');
      link.rel = 'icon'; link.href = FAV;
      if (!link.parentNode) head.appendChild(link);
    } catch (e) {}
    // gold seal beside the masthead
    var h1 = document.querySelector('#hdr h1.glitch');
    if (h1 && !document.getElementById('go-seal')) {
      var sp = document.createElement('span'); sp.className = 'go-seal'; sp.id = 'go-seal'; sp.innerHTML = SEAL;
      h1.parentNode.insertBefore(sp, h1);
    }
    // navigation renamed to the Order's architecture (labels only; every tab still opens its own module)
    document.querySelectorAll('#nav button').forEach(function (b) {
      var m = b.getAttribute('data-m') || (b.id || '').replace('n-', '');
      if (m && RENAV[m.toLowerCase()]) b.textContent = RENAV[m.toLowerCase()];
    });
    // section titles + roman numerals in document order
    var secs = Array.prototype.slice.call(document.querySelectorAll('#main > section'));
    secs.forEach(function (sec, i) {
      var rn = ['', 'I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII'][Math.min(i + 1, 22)];
      var h3 = sec.querySelector('h3');
      if (!h3 || h3.querySelector('.go-rn')) return;
      var id = sec.id || '';
      if (RETITLE[id] && !h3.dataset.hl119t) { h3.dataset.hl119t = '1'; h3.textContent = RETITLE[id]; }
      var s = document.createElement('span'); s.className = 'go-rn'; s.textContent = rn;
      h3.insertBefore(s, h3.firstChild);
    });
    // gate: grand order eyebrow
    var gate = document.getElementById('gate');
    if (gate && !gate.querySelector('.go-eyebrow')) {
      var h2 = gate.querySelector('h2');
      if (h2) { var eb = document.createElement('div'); eb.className = 'go-eyebrow'; eb.textContent = 'THE GRAND ORDER'; h2.parentNode.insertBefore(eb, h2); }
    }
    // boot cinema subtitle, in the Order's voice
    document.querySelectorAll('#cine .c-lines div').forEach(function (d) {
      if (d.textContent === 'ULTIMATE INTELLIGENCE ENVIRONMENT') d.textContent = 'A PRIVATE INTELLIGENCE ORDER';
    });
    // recolor any red inline styles already in the DOM
    document.querySelectorAll('[style]').forEach(recolor);
  }

  // keep runtime-injected inline styles gold too (chat lines, statuses, feeds)
  var mo = null;
  function watch() {
    if (mo || !window.MutationObserver) return;
    mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === 'attributes') { recolor(m.target); continue; }
        for (var j = 0; j < m.addedNodes.length; j++) {
          var n = m.addedNodes[j];
          if (n.nodeType === 1) { recolor(n); if (n.querySelectorAll) n.querySelectorAll('[style]').forEach(recolor); }
        }
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  }

  var tries = 0;
  (function boot() {
    tries++;
    var ok = document.getElementById('hdr') && document.getElementById('nav');
    if (ok) { dress(); watch(); try { console.log(TAG + 'grand order applied'); } catch (e) {} }
    else if (tries < 120) setTimeout(boot, 250);
  })();
})();
