/* EditForge AI — the Director Engine: brief + assets -> edit plan */
'use strict';
EF.STYLES = {
  spiderman: { label:'spider-man', cut:[0.42,0.62], punch:0.26, transitions:['zoompunch','flash','zoompunch'], grade:'punch',  shake:0.5, ken:0.10, hookCut:0.45 },
  phonk:     { label:'phonk',      cut:[0.30,0.48], punch:0.34, transitions:['flash','zoompunch','flash'],   grade:'gritty', shake:0.8, ken:0.12, hookCut:0.4 },
  cinematic: { label:'cinematic',  cut:[0.95,1.6],  punch:0.05, transitions:['crossfade','fadeblack'],        grade:'film',   shake:0.1, ken:0.22, hookCut:1.2 },
  emotional: { label:'emotional',  cut:[0.8,1.3],   punch:0.05, transitions:['crossfade','fadeblack'],        grade:'soft',   shake:0.05,ken:0.18, hookCut:1.0 }
};
EF.GRADES = {
  punch:  { filter:'saturate(1.35) contrast(1.22) brightness(0.97)', accent:'rgba(120,40,200,0.10)' },
  gritty: { filter:'saturate(1.5) contrast(1.35) brightness(0.88) hue-rotate(-8deg)', accent:'rgba(255,40,80,0.08)' },
  film:   { filter:'saturate(0.9) contrast(1.08) brightness(1.02) sepia(0.12)', accent:'rgba(20,60,120,0.07)' },
  soft:   { filter:'saturate(0.92) contrast(1.02) brightness(1.04)', accent:'rgba(255,180,120,0.06)' }
};
EF.pickStyle = function(brief, chips){
  const b = (brief||'').toLowerCase();
  let score = { spiderman:0, phonk:0, cinematic:0, emotional:0 };
  const kw = {
    spiderman:['spider','spiderman','spider-man','hero','superhero','marvel','peter','parker','web','avenger'],
    phonk:['phonk','aggressive','brutal','hard','insane','crazy','rage','gym','sigma','dark'],
    cinematic:['cinematic','film','movie','epic','trailer','story','slow','aesthetic','vlog'],
    emotional:['emotional','sad','love','soft','cry','aesthetic','nostalgia','memory','friend']
  };
  for (const s in kw) for (const w of kw[s]) if (b.includes(w)) score[s]+= w.includes(' ')?2:1;
  if (chips && chips.length) for (const c of chips) score[c]=(score[c]||0)+3;
  let best='cinematic', bs=-1;
  for (const s in score) if (score[s]>bs){bs=score[s];best=s;}
  return best;
};
/* deterministic-ish rng */
EF.rng = function(seed){ let s = seed>>>0 || 1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; };
EF.hash = function(str){ let h=2166136261; for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);} return h>>>0; };

EF.buildPlan = function(opts){
  const {brief, styleKey, intensity, hookText, music, targetLen} = opts;
  const visuals = EF.assets.filter(a=>a.kind==='video'||a.kind==='image');
  if (!visuals.length) throw new Error('add at least one clip or photo first');
  const style = EF.STYLES[styleKey] || EF.STYLES.spiderman;
  const rand = EF.rng(EF.hash((brief||'') + styleKey + intensity));
  const inten = Math.min(1, Math.max(0, intensity/100));
  // total length
  let total;
  if (music && music.duration) total = Math.min(music.duration, targetLen || 20);
  else total = Math.min(targetLen || Math.min(20, Math.max(8, visuals.reduce((s,a)=>s+(a.duration||3),0)*0.55)), 30);
  total = Math.max(4, Math.min(total, 30));
  // cut times
  let cuts = [];
  if (music && music.beats && music.beats.length>4 && music.confidence>=0.25){
    // beat-locked: use beats, compressed after the "drop" (past 45%)
    const beats = music.beats;
    let use = beats.filter(t=>t < total-0.15);
    if (use.length < 4) use = [];
    else {
      cuts = [0];
      const dropAt = total*0.45;
      for (let i=1;i<use.length;i++){
        let d = use[i]-cuts[cuts.length-1];
        const inDrop = use[i] > dropAt;
        // on high intensity keep every beat; else merge pairs early on
        if (!inDrop && inten < 0.55 && d < 60/(music.bpm||120)*1.9 && rand()<0.5) continue;
        cuts.push(use[i]);
      }
      if (cuts[cuts.length-1] < total-0.2) cuts.push(total);
      else cuts.push(total);
      cuts = Array.from(new Set(cuts.map(c=>+c.toFixed(3)))).sort((a,b)=>a-b);
    }
  }
  if (!cuts.length){
    // style-driven pacing
    let t = 0;
    while (t < total){
      let [lo,hi] = style.cut;
      let d = lo + rand()*(hi-lo);
      d *= (1.18 - 0.55*inten);               // intensity compresses cuts
      if (t < total*0.18) d *= style.hookCut;  // hook breathes slightly
      cuts.push(+t.toFixed(3));
      t += Math.max(0.22, d);
    }
    cuts.push(+total.toFixed(3));
  }
  // materialize scenes round-robin over assets
  const scenes = [];
  let ai = 0, tPrev = 0;
  const cursor = new Map(); // assetId -> src cursor
  for (let i=0;i<cuts.length-1;i++){
    const start = cuts[i], dur = Math.max(0.18, cuts[i+1]-cuts[i]);
    // find asset with room, else loop
    let a = null;
    for (let k=0;k<visuals.length;k++){
      const cand = visuals[(ai+k)%visuals.length];
      const cur = cursor.get(cand.id)||0;
      const room = cand.kind==='image' ? Infinity : Math.max(0,(cand.duration||3)-cur-0.05);
      if (room >= dur*0.6){ a = cand; ai = (ai+k+1)%visuals.length; break; }
    }
    if (!a){ a = visuals[ai%visuals.length]; ai++; cursor.set(a.id, 0); }
    const cur = cursor.get(a.id)||0;
    const srcIn = a.kind==='image' ? 0 : Math.max(0, Math.min(cur, (a.duration||3)-0.05));
    cursor.set(a.id, srcIn + dur*0.98);
    const dir = i%2===0 ? 1 : -1;
    const ken = a.kind==='image' ? style.ken*2 : style.ken;
    scenes.push({
      assetId:a.id, start:+start.toFixed(3), dur:+dur.toFixed(3), srcIn:+srcIn.toFixed(3),
      z0: 1.04 + rand()*0.10,
      z1: 1.04 + rand()*0.10 + ken*dir,
      punch: style.punch*(0.7+0.6*inten)*(a.kind==='image'?0.6:1),
      transition: i===0 ? null : style.transitions[i % style.transitions.length],
      grade: style.grade,
      shake: style.shake*inten
    });
    tPrev = start+dur;
  }
  return {
    id: EF.uid(), createdAt: Date.now(), brief: brief||'', styleKey,
    intensity, hookText: (hookText||'').trim(), musicId: music?music.id:null,
    w:720, h:1280, fps:30, scenes, total
  };
};
