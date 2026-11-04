/* EditForge AI — core: state, media probing, music analysis */
'use strict';
window.EF = {
  assets: [],        // {id,kind:'video'|'image',name,url,el,duration,width,height,thumb}
  music: null,       // {id,name,url,el,duration,bpm,beats,onsets,confidence}
  project: null,
  busy: false
};
EF.uid = function(){ return 'a'+Math.random().toString(36).slice(2,10); };
EF.fileKind = function(f){
  if (f.type.startsWith('video/')) return 'video';
  if (f.type.startsWith('image/')) return 'image';
  const n = f.name.toLowerCase();
  if (/\.(mp4|mov|webm|m4v)$/.test(n)) return 'video';
  if (/\.(png|jpe?g|webp|gif|heic|hef)$/.test(n)) return 'image';
  return null;
};

/* ---------- media import ---------- */
EF.probeVideo = function(file){
  return new Promise((resolve,reject)=>{
    const el = document.createElement('video');
    el.preload = 'auto'; el.muted = true; el.playsInline = true; el.crossOrigin = 'anonymous';
    const url = URL.createObjectURL(file);
    let done = false;
    const fail = (e)=>{ if(!done){done=true; URL.revokeObjectURL(url); reject(new Error('could not read ' + file.name));} };
    el.onerror = ()=>fail();
    el.onloadedmetadata = ()=>{
      const duration = el.duration, w = el.videoWidth, h = el.videoHeight;
      if (!isFinite(duration) || duration <= 0) { fail(); return; }
      el.currentTime = Math.min(duration*0.1, 1.0);
      el.onseeked = ()=>{
        done = true;
        let thumb = null;
        try{
          const c = document.createElement('canvas');
          const s = 160/Math.max(w||1,h||1);
          c.width = Math.max(1,Math.round((w||160)*s)); c.height = Math.max(1,Math.round((h||284)*s));
          c.getContext('2d').drawImage(el,0,0,c.width,c.height);
          thumb = c.toDataURL('image/jpeg',0.6);
        }catch(e){ thumb = null; }
        resolve({kind:'video', name:file.name, url, el, duration, width:w, height:h, thumb});
      };
      setTimeout(()=>fail(), 6000);
    };
    el.src = url;
  });
};
EF.probeImage = function(file){
  return new Promise((resolve,reject)=>{
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = ()=>{
      const c = document.createElement('canvas');
      const s = 160/Math.max(img.width,img.height);
      c.width = Math.max(1,Math.round(img.width*s)); c.height = Math.max(1,Math.round(img.height*s));
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      resolve({kind:'image', name:file.name, url, el:img, duration:null, width:img.width, height:img.height, thumb:c.toDataURL('image/jpeg',0.7)});
    };
    img.onerror = ()=>{ URL.revokeObjectURL(url); reject(new Error('could not read ' + file.name)); };
    img.src = url;
  });
};
EF.addFiles = async function(fileList, onEach){
  const added = [], errors = [];
  for (const f of fileList){
    const k = EF.fileKind(f);
    try{
      if (!k){ errors.push(f.name + ' — not a clip or photo'); continue; }
      const p = k==='video' ? await EF.probeVideo(f) : await EF.probeImage(f);
      const asset = Object.assign({id:EF.uid(), duration: p.duration}, p);
      EF.assets.push(asset); added.push(asset);
      if (onEach) onEach(asset);
    }catch(err){ errors.push(f.name + ' — ' + err.message); }
  }
  return {added, errors};
};

/* ---------- music ---------- */
EF.probeMusic = function(file){
  return new Promise((resolve,reject)=>{
    const el = document.createElement('audio');
    el.preload = 'auto';
    const url = URL.createObjectURL(file);
    el.onloadedmetadata = ()=>{
      if (!isFinite(el.duration) || el.duration<=0){ URL.revokeObjectURL(url); reject(new Error('could not read that song')); return; }
      resolve({id:EF.uid(), name:file.name, url, el, duration:el.duration});
    };
    el.onerror = ()=>{ URL.revokeObjectURL(url); reject(new Error('could not read that song')); };
    el.src = url;
  });
};
/* decode + onset/beat analysis */
EF.analyzeMusic = async function(music){
  const ab = await (await fetch(music.url)).arrayBuffer();
  const AC = window.AudioContext || window.webkitAudioContext;
  const ctx = new AC();
  let buf;
  try { buf = await ctx.decodeAudioData(ab); }
  catch(e){ await ctx.close(); return null; }
  const sr = buf.sampleRate, hop = 512;
  const n = Math.floor(buf.length/hop);
  const L = buf.getChannelData(0), R = buf.numberOfChannels>1 ? buf.getChannelData(1) : null;
  const env = new Float32Array(n);
  for (let i=0;i<n;i++){
    let s = 0, off = i*hop, e = Math.min(off+hop, buf.length);
    for (let j=off;j<e;j++){ const v = R ? (L[j]+R[j])*0.5 : L[j]; s += v*v; }
    env[i] = Math.sqrt(s/Math.max(1,e-off));
  }
  // spectral flux-ish: positive energy diff
  const flux = new Float32Array(n);
  for (let i=1;i<n;i++) flux[i] = Math.max(0, env[i]-env[i-1]);
  // smooth
  const sm = new Float32Array(n);
  for (let i=0;i<n;i++){ let s=0,c=0; for (let k=-1;k<=1;k++){ const j=i+k; if(j>=0&&j<n){s+=flux[j];c++;} } sm[i]=s/c; }
  // stats
  let mean=0; for(let i=0;i<n;i++) mean+=sm[i]; mean/=Math.max(1,n);
  let va=0; for(let i=0;i<n;i++) va+=(sm[i]-mean)*(sm[i]-mean); const sd=Math.sqrt(va/Math.max(1,n));
  // peak pick
  const minGap = Math.max(2, Math.round(0.22*sr/hop));
  const peaks = [];
  for (let i=2;i<n-2;i++){
    if (sm[i]>sm[i-1] && sm[i]>=sm[i+1] && sm[i] > mean + sd*0.7){
      if (!peaks.length || i - peaks[peaks.length-1] >= minGap) peaks.push(i);
      else if (sm[i] > sm[peaks[peaks.length-1]]) peaks[peaks.length-1] = i;
    }
  }
  const onsets = peaks.map(i=> i*hop/sr);
  // intervals → bpm
  const ivs = [];
  for (let i=1;i<peaks.length;i++) ivs.push((peaks[i]-peaks[i-1])*hop/sr);
  let bpm = 0, conf = 0;
  if (ivs.length >= 4){
    ivs.sort((a,b)=>a-b);
    const med = ivs[Math.floor(ivs.length/2)];
    bpm = 60/med;
    while (bpm < 70) bpm *= 2;
    while (bpm > 180) bpm /= 2;
    // confidence: how many intervals sit near the median beat (or half/double)
    let hit = 0;
    for (const iv of ivs){
      const b = 60/bpm;
      const r = Math.abs((iv % b) - b*Math.round(iv/b)) < 0.001 ? iv : null;
      const near = Math.min(Math.abs(iv-b), Math.abs(iv-2*b), Math.abs(iv-b/2), Math.abs(iv%b), Math.abs(b-(iv%b)));
      if (near < 0.06) hit++;
    }
    conf = Math.min(1, hit/Math.max(1,ivs.length));
  }
  // beat grid: anchor on strongest early onset, step by beat
  let beats = [];
  if (bpm>0){
    const beat = 60/bpm;
    let anchor = onsets.length ? onsets[0] : 0;
    // choose onset closest to strongest flux in first 5s
    let best = 0, bi = 0;
    for (let i=0;i<n;i++){ const t=i*hop/sr; if(t>5) break; if(sm[i]>best){best=sm[i];bi=i;} }
    if (bi>0){
      const tcand = bi*hop/sr;
      anchor = onsets.reduce((a,o)=> Math.abs(o-tcand)<Math.abs(a-tcand)?o:a, anchor);
    }
    for (let t=anchor; t>=0; t-=beat); // backfill start
    let t0 = anchor % beat;
    for (let t=t0; t<buf.duration; t+=beat) beats.push(+t.toFixed(3));
  }
  await ctx.close();
  return {bpm:+bpm.toFixed(1), beats, onsets, confidence:+conf.toFixed(2)};
};
