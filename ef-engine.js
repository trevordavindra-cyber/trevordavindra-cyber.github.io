/* EditForge AI — engine: compositor, preview player, exporter */
'use strict';
EF.engine = {};
const W = 720, H = 1280, FPS = 30;

/* ---------- helpers ---------- */
function assetById(id){ return EF.assets.find(a=>a.id===id) || (EF.music && EF.music.id===id ? EF.music : null); }
function ease(x){ return x<0.5 ? 2*x*x : 1-Math.pow(-2*x+2,2)/2; }
function coverGeom(sw, sh, scale, ox, oy){
  const s = Math.max(W/sw, H/sh) * scale;
  const dw = sw*s, dh = sh*s;
  return {dx:(W-dw)/2 + ox, dy:(H-dh)/2 + oy, dw, dh};
}
function gradeCss(name){
  const g = EF.GRADES[name] || EF.GRADES.punch;
  return g.filter;
}
function accentColor(name){
  const g = EF.GRADES[name] || EF.GRADES.punch;
  return g.accent;
}

/* ---------- compositor ---------- */
EF.engine.makeCanvas = function(){ const c = document.createElement('canvas'); c.width=W; c.height=H; return c; };

EF.engine.timelineAt = function(scenes, t){
  for (let i=0;i<scenes.length;i++){
    const s = scenes[i];
    if (t < s.start + s.dur || i===scenes.length-1) return {i, s, tin: t - s.start};
  }
  return {i:0, s:scenes[0], tin:0};
};

/* draw one frame of the timeline at time t onto ctx.
   prevCanvas: snapshot of the previous scene's last frame for transitions. */
EF.engine.drawFrame = function(ctx, project, t, opts){
  opts = opts || {};
  const scenes = project.scenes;
  if (!scenes.length) return null;
  const {i, s, tin} = EF.engine.timelineAt(scenes, Math.max(0, Math.min(t, project.total-0.001)));
  const a = assetById(s.assetId);
  if (!a) return {i, s};
  const src = s.srcIn + tin;
  // ensure video frame is present
  let ready = true;
  if (a.kind==='video'){
    const v = a.el;
    if (v.readyState < 2) ready = false;
    if (opts.exportMode){
      const diff = Math.abs(v.currentTime - src);
      if (diff > 1/50 && !v.seeking) { try{ v.currentTime = Math.min(src, (a.duration||0)-0.01); }catch(e){} }
      if (v.seeking) ready = false;
    }
  }
  // zoom
  const p = Math.min(1, tin/Math.max(0.001,s.dur));
  let z = s.z0 + (s.z1-s.z0)*ease(p);
  z *= 1 + s.punch*Math.exp(-tin*9);
  // shake
  let ox=0, oy=0;
  if (s.shake>0.02){
    const k = t*11;
    ox = Math.sin(k*1.7+s.start)*s.shake*10;
    oy = Math.cos(k*2.3+s.start*2)*s.shake*8;
  }
  ctx.save();
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H);
  if (ready){
    ctx.filter = gradeCss(s.grade);
    let g;
    if (a.kind==='video') g = coverGeom(a.width||W, a.height||H, z, ox, oy);
    else g = coverGeom(a.width, a.height, z, ox, oy);
    try { ctx.drawImage(a.el, g.dx, g.dy, g.dw, g.dh); } catch(e){}
    ctx.filter = 'none';
    const acc = accentColor(s.grade);
    if (acc){ ctx.fillStyle = acc; ctx.fillRect(0,0,W,H); }
  } else {
    ctx.fillStyle = '#101018'; ctx.fillRect(0,0,W,H);
  }
  ctx.restore();
  // transition from previous scene
  const TR = 0.16;
  if (i>0 && s.transition && tin < TR && opts.prevCanvas){
    const k = tin/TR;
    if (s.transition==='crossfade' || s.transition==='zoompunch'){
      ctx.save(); ctx.globalAlpha = 1-k; ctx.drawImage(opts.prevCanvas,0,0,W,H); ctx.restore();
    } else if (s.transition==='flash'){
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1-k*1.6)*0.9;
      ctx.fillStyle = '#fff'; ctx.fillRect(0,0,W,H);
      ctx.restore();
    } else if (s.transition==='fadeblack'){
      ctx.save();
      ctx.globalAlpha = Math.max(0,1-Math.abs(k-0.5)*2.4);
      ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H);
      ctx.restore();
    }
  }
  // vignette
  if (s.grade==='film' || s.grade==='gritty' || s.grade==='soft'){
    if (!EF.engine._vig){
      const v = EF.engine.makeCanvas();
      const vc = v.getContext('2d');
      const rg = vc.createRadialGradient(W/2,H/2,H*0.28,W/2,H/2,H*0.72);
      rg.addColorStop(0,'rgba(0,0,0,0)'); rg.addColorStop(1,'rgba(0,0,0,0.38)');
      vc.fillStyle = rg; vc.fillRect(0,0,W,H);
      EF.engine._vig = v;
    }
    ctx.drawImage(EF.engine._vig,0,0);
  }
  // hook text
  if (project.hookText && t < 2.2){
    const k = Math.min(1, t/0.35);
    const pop = 1 + 0.25*Math.exp(-t*4);
    ctx.save();
    ctx.textAlign='center';
    ctx.font = '800 ' + Math.round(64*pop) + 'px -apple-system, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 3;
    ctx.globalAlpha = k * (t>1.8 ? Math.max(0,(2.2-t)/0.4) : 1);
    const words = project.hookText.toUpperCase().split(/\s+/);
    const lines = [];
    let line = '';
    for (const w of words){
      const cand = line ? line+' '+w : w;
      if (ctx.measureText(cand).width > W*0.86 && line){ lines.push(line); line = w; } else line = cand;
    }
    if (line) lines.push(line);
    const lh = Math.round(74*pop);
    const y0 = H*0.40 - (lines.length-1)*lh/2;
    lines.forEach((ln,idx)=> ctx.fillText(ln, W/2, y0 + idx*lh));
    ctx.restore();
  }
  return {i, s};
};

/* snapshot current canvas into prevCanvas */
EF.engine.snap = function(canvas, prevCanvas){
  const p = prevCanvas.getContext('2d');
  p.clearRect(0,0,W,H);
  p.drawImage(canvas,0,0);
};

/* ---------- preview player ---------- */
EF.Player = {
  playing:false, raf:0, t0:0, t:0, musicEl:null, prevCanvas:null,
  start(){
    const P = EF.project; if (!P || !P.scenes.length) return;
    this.playing = true;
    this.prevCanvas = EF.engine.makeCanvas();
    if (P.musicId && EF.music){ this.musicEl = EF.music.el; try{ this.musicEl.currentTime = 0; this.musicEl.play(); }catch(e){} }
    this.t0 = performance.now() - this.t*1000;
    const step = ()=>{
      if (!this.playing) return;
      const t = (performance.now()-this.t0)/1000;
      if (t >= P.total){ this.stop(); EF.ui.onPlayerEnd && EF.ui.onPlayerEnd(); return; }
      this.t = t;
      const {i} = EF.engine.timelineAt(P.scenes, t);
      if (this._lastIdx !== undefined && i !== this._lastIdx){
        EF.engine.snap(document.getElementById('cv'), this.prevCanvas);
        // manage videos: pause old, cue new
        const prevA = assetById(P.scenes[this._lastIdx].assetId);
        if (prevA && prevA.kind==='video') prevA.el.pause();
      }
      this._lastIdx = i;
      const s = P.scenes[i];
      const a = assetById(s.assetId);
      if (a && a.kind==='video'){
        const v = a.el;
        const src = s.srcIn + (t - s.start);
        if (v.paused){ try{ v.currentTime = src; v.play(); }catch(e){} }
        else if (Math.abs(v.currentTime - src) > 0.35 && !v.seeking){ try{ v.currentTime = src; }catch(e){} }
      }
      if (this.musicEl && Math.abs(this.musicEl.currentTime - t) > 0.2 && !this.musicEl.seeking){ try{ this.musicEl.currentTime = t; }catch(e){} }
      const cv = document.getElementById('cv');
      const cx = cv.getContext('2d');
      EF.engine.drawFrame(cx, P, t, {prevCanvas:this.prevCanvas});
      EF.ui.onPlayerTick && EF.ui.onPlayerTick(t, P.total);
      this.raf = requestAnimationFrame(step);
    };
    this._lastIdx = undefined;
    this.raf = requestAnimationFrame(step);
  },
  stop(){
    this.playing = false;
    cancelAnimationFrame(this.raf);
    if (this.musicEl){ try{ this.musicEl.pause(); }catch(e){} this.musicEl=null; }
    for (const a of EF.assets) if (a.kind==='video') try{ a.el.pause(); }catch(e){}
  },
  seek(t){ this.t = t; }
};

/* ---------- exporter ---------- */
EF.exportCaps = function(){
  const mimes = [
    ['video/mp4;codecs=avc1.42E01E,mp4a.40.2','mp4'],
    ['video/mp4','mp4'],
    ['video/webm;codecs=vp9,opus','webm'],
    ['video/webm;codecs=vp8,opus','webm'],
    ['video/webm','webm']
  ];
  for (const [m,ext] of mimes){
    try { if (window.MediaRecorder && MediaRecorder.isTypeSupported(m)) return {mime:m, ext}; } catch(e){}
  }
  return null;
};
EF.cancelExport = false;
EF.exportVideo = async function(project, onProgress, onNote){
  const caps = EF.exportCaps();
  if (!caps) throw new Error('no video recording in , try Chrome or update your phone');
  EF.cancelExport = false;
  const cv = EF.engine.makeCanvas();
  const cx = cv.getContext('2d');
  const stream = cv.captureStream(FPS);
  // audio graph
  let actx=null, dest=null, musicEl=null;
  const m = project.musicId ? EF.music : null;
  if (m){
    const AC = window.AudioContext || window.webkitAudioContext;
    actx = new AC();
    dest = actx.createMediaStreamDestination();
    musicEl = m.el;
    try{
      const src = actx.createMediaElementSource(musicEl);
      const g = actx.createGain();
      src.connect(g); g.connect(dest);
    }catch(e){ actx=null; dest=null; }
  }
  if (dest) dest.stream.getAudioTracks().forEach(t=> stream.addTrack(t));
  const rec = new MediaRecorder(stream, {mimeType:caps.mime, videoBitsPerSecond: 8000000});
  const chunks = [];
  rec.ondataavailable = e=>{ if (e.data && e.data.size) chunks.push(e.data); };
  const done = new Promise(res=>{ rec.onstop = ()=>res(); });
  // preroll: cue videos
  for (const s of project.scenes){
    const a = assetById(s.assetId);
    if (a && a.kind==='video'){ try{ a.el.pause(); a.el.currentTime = s.srcIn; }catch(e){} }
  }
  const prevCanvas = EF.engine.makeCanvas();
  const t0w = performance.now();
  if (m){ try{ musicEl.currentTime = 0; await musicEl.play(); }catch(e){} }
  if (actx && actx.state==='suspended') try{ await actx.resume(); }catch(e){}
  rec.start(250);
  const total = project.total;
  let frame = 0, lastIdx = -1;
  await new Promise(async (resolve)=>{
    const step = async ()=>{
      while (frame*1000/FPS <= total*1000 + 60){
        if (EF.cancelExport){ resolve(); return; }
        const target = frame/FPS;
        const wall = (performance.now()-t0w)/1000;
        if (wall < target - 0.002){ requestAnimationFrame(()=>{}); await new Promise(r=>setTimeout(r, Math.max(1,(target-wall)*1000-2))); continue; }
        const {i, s} = EF.engine.timelineAt(project.scenes, Math.min(target, total-0.001));
        if (i !== lastIdx){
          if (lastIdx >= 0) EF.engine.snap(cv, prevCanvas);
          lastIdx = i;
        }
        const a = assetById(s.assetId);
        if (a && a.kind==='video'){
          const src = s.srcIn + (target - s.start);
          const v = a.el;
          if (Math.abs(v.currentTime - src) > 1/50 && !v.seeking){
            try{ v.currentTime = Math.min(src,(a.duration||0)-0.01); }catch(e){}
            await new Promise(r=>{
              const to = setTimeout(r, 400);
              v.onseeked = ()=>{ clearTimeout(to); v.onseeked=null; r(); };
            });
          }
        }
        EF.engine.drawFrame(cx, project, target, {exportMode:true, prevCanvas});
        frame++;
        if (onProgress) onProgress(Math.min(1, target/total));
        await new Promise(r=>setTimeout(r,0));
      }
      resolve();
    };
    step();
  });
  try{ rec.stop(); }catch(e){}
  await done;
  if (musicEl) try{ musicEl.pause(); }catch(e){}
  if (actx) try{ actx.close(); }catch(e){}
  for (const a of EF.assets) if (a.kind==='video') try{ a.el.pause(); }catch(e){}
  if (EF.cancelExport) throw new Error('canceled');
  const blob = new Blob(chunks, {type: caps.mime.split(';')[0]});
  // playability check
  const ok = await new Promise(res=>{
    const v = document.createElement('video');
    v.muted = true;
    v.onloadedmetadata = ()=> res(v.duration>0 && isFinite(v.duration));
    v.onerror = ()=> res(false);
    setTimeout(()=>res(false), 6000);
    v.src = URL.createObjectURL(blob);
  });
  if (!ok) throw new Error('the render came out unplayable, try again, or screen-record the preview instead');
  return {blob, ext: caps.ext, mime: caps.mime};
};
