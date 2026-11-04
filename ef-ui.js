/* EditForge AI — ui wiring */
'use strict';
(function(){
  const $ = (id)=>document.getElementById(id);
  const show = (id)=>{ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(id).classList.add('active'); window.scrollTo(0,0); };

  /* chips */
  let styleChips = new Set(['spiderman']);
  document.querySelectorAll('#chips .chip').forEach(ch=>{
    if (ch.dataset.style==='spiderman') ch.classList.add('on');
    ch.addEventListener('click', ()=>{
      const s = ch.dataset.style;
      if (styleChips.has(s)){ styleChips.delete(s); ch.classList.remove('on'); }
      else { styleChips.add(s); ch.classList.add('on'); }
      if (!styleChips.size){ styleChips.add(s); ch.classList.add('on'); }
    });
  });
  const intenLabel = ['chill','fun','hyped','insane','unhinged'];
  $('inten').addEventListener('input', e=>{
    $('inten-val').textContent = intenLabel[Math.min(4, Math.floor(e.target.value/25))];
  });

  /* media tray */
  const renderTray = ()=>{
    const tray = $('tray'); tray.innerHTML='';
    EF.assets.forEach((a,idx)=>{
      const d = document.createElement('div');
      d.className='thumb';
      d.innerHTML = a.thumb ? '<img alt="" src="'+a.thumb+'">' : '';
      d.innerHTML += '<span class="k '+(a.kind==='image'?'img':'')+'">'+(a.kind==='image'?'PIC':'CLIP')+'</span><span class="t">'+(a.duration?a.duration.toFixed(1)+'s':'')+'</span>';
      d.title = a.name;
      d.addEventListener('click', ()=>{ EF.assets.splice(idx,1); renderTray(); });
      tray.appendChild(d);
    });
    if (EF.project && EF.project.scenes.length) $('make-msg').noteDirty = true;
  };
  $('btn-add').addEventListener('click', ()=> $('file-media').click());
  $('file-media').addEventListener('change', async e=>{
    if (!e.target.files.length) return;
    $('tray-msg').hidden = true;
    $('btn-add').textContent = 'reading your clips…';
    const {added, errors} = await EF.addFiles(e.target.files);
    $('btn-add').textContent = '＋ add clips / photos';
    renderTray();
    if (errors.length){ $('tray-msg').textContent = errors.join(' · '); $('tray-msg').hidden=false; $('tray-msg').className='msg err'; }
    e.target.value='';
  });

  /* music */
  $('btn-music').addEventListener('click', ()=> $('file-music').click());
  $('file-music').addEventListener('change', async e=>{
    const f = e.target.files[0]; if (!f) return;
    $('music-msg').hidden = true;
    $('btn-music').textContent = 'reading the song…';
    try{
      const m = await EF.probeMusic(f);
      $('music-msg').textContent = 'finding the beat…'; $('music-msg').hidden=false;
      const an = await EF.analyzeMusic(m);
      if (an){ m.bpm=an.bpm; m.beats=an.beats; m.onsets=an.onsets; m.confidence=an.confidence; }
      EF.music = m;
      $('music-name').textContent = f.name + (an&&an.bpm?(' · '+Math.round(an.bpm)+' bpm'+(an.confidence<0.25?' (beat unsure)':'')):' · no beat found, vibe pacing');
      $('music-row').hidden = false;
      $('music-msg').hidden = true;
    }catch(err){
      $('music-msg').textContent = err.message; $('music-msg').hidden=false; $('music-msg').className='msg err';
    }
    $('btn-music').textContent = '♪ add a song';
    e.target.value='';
  });
  $('btn-music-x').addEventListener('click', ()=>{
    if (EF.music) try{ EF.music.el.pause(); }catch(e){}
    EF.music = null; $('music-row').hidden = true;
  });

  /* make */
  $('btn-make').addEventListener('click', ()=>{
    const msg = $('make-msg');
    msg.hidden = false;
    try{
      const chips = Array.from(styleChips);
      const styleKey = EF.pickStyle($('brief').value, chips);
      const intensity = +$('inten').value;
      EF.project = EF.buildPlan({
        brief: $('brief').value, styleKey, intensity,
        hookText: $('hook').value,
        music: EF.music,
        targetLen: EF.music ? Math.min(EF.music.duration, 20) : null
      });
      show('scr-player');
      const st = EF.STYLES[styleKey];
      $('dur-note').textContent = st.label + ' cut · ' + EF.project.scenes.length + ' cuts · ' + EF.project.total.toFixed(1) + 's · beat ' + (EF.music&&EF.music.bpm?'synced ('+Math.round(EF.music.bpm)+' bpm)':'by vibe');
      drawStill(0);
    }catch(err){
      msg.textContent = err.message; msg.className='msg err';
      setTimeout(()=>{ msg.hidden=true; }, 4000);
    }
  });
  const drawStill = (t)=>{
    if (!EF.project) return;
    const cv = $('cv'), cx = cv.getContext('2d');
    EF.engine.drawFrame(cx, EF.project, t, {});
  };

  /* player */
  $('btn-play').addEventListener('click', ()=>{
    const P = EF.Player;
    if (P.playing){ P.stop(); $('btn-play').textContent='▶'; }
    else {
      if (P.t >= EF.project.total-0.05) P.t = 0;
      P.start(); $('btn-play').textContent='⏸';
    }
  });
  EF.ui = {
    onPlayerTick(t, total){ $('tl-fill').style.width = Math.min(100,(t/total*100)) + '%'; },
    onPlayerEnd(){ $('btn-play').textContent='▶'; }
  };
  $('btn-back-player').addEventListener('click', ()=>{
    EF.Player.stop(); $('btn-play').textContent='▶'; show('scr-studio');
  });
  $('btn-restyle').addEventListener('click', ()=>{
    EF.Player.stop(); $('btn-play').textContent='▶'; show('scr-studio');
  });
  /* re-draw first frame when returning to player */
  new MutationObserver(()=>{ if ($('scr-player').classList.contains('active') && EF.project) drawStill(EF.Player.t); })
    .observe($('scr-player'), {attributes:true, attributeFilter:['class']});

  /* export */
  $('btn-export').addEventListener('click', async ()=>{
    if (EF.exporting) return;
    EF.Player.stop(); $('btn-play').textContent='▶';
    EF.exporting = true;
    $('exp-box').hidden = false; $('exp-msg').hidden = true; $('dl').hidden = true;
    $('exp-fill').style.width = '0%';
    $('exp-note').textContent = 'rendering in real time… keep this screen open (' + EF.project.total.toFixed(0) + 's)';
    try{
      const out = await EF.exportVideo(EF.project,
        (p)=>{ $('exp-fill').style.width = Math.round(p*100)+'%'; },
        (n)=>{ $('exp-note').textContent = n; });
      $('exp-fill').style.width = '100%';
      const url = URL.createObjectURL(out.blob);
      const a = $('dl');
      a.href = url;
      a.download = 'editforge_' + Date.now() + '.' + out.ext;
      a.hidden = false;
      $('exp-note').textContent = 'done. tap save, then post it.';
    }catch(err){
      $('exp-msg').textContent = err.message; $('exp-msg').className='msg err'; $('exp-msg').hidden = false;
      $('exp-box').hidden = true;
    }
    EF.exporting = false;
  });

  /* nav */
  $('btn-new').addEventListener('click', ()=> show('scr-studio'));
  $('btn-back').addEventListener('click', ()=> show('scr-home'));
})();
