/* hell84 loader: runs the ILLUMINATI core engine (v16 lineage) with coding intro + entry hum removed */
const SRC = '../hell24/app.js';
let code = '';
try {
  const r = await fetch(SRC, { cache: 'reload' });
  if (r.ok) code = await r.text();
} catch (e) {}
if (!code) { location.replace('../hell24/'); }
else {
  const bootRe = /const BOOT=\[[\s\S]*?\];/;
  if (bootRe.test(code)) code = code.replace(bootRe, 'const BOOT=[];');
  const humRe = /try\{\s*const AC=window\.AudioContext[\s\S]*?\}catch\(e\)\{\}/;
  if (humRe.test(code)) code = code.replace(humRe, '/* entry hum removed */');
  if (code.split('},9000);').length === 2) code = code.replace('},9000);', '},25000);');

  const sub=(from,to)=>{ if(code.includes(from)) code=code.split(from).join(to); };

  /* omni: fast cloud brain first, forge pool backup */
  const omniRe=/async function askOmni\(user\)\{[\s\S]*?\n\}/;
  const omniNew=`async function askOmni(user){
  const poolP=askUnfiltered(user,null,true).catch(()=>null);
  const fast=await Promise.race([askCloudSafe(user).catch(()=>null), new Promise(r=>setTimeout(()=>r(null),9000))]);
  if(fast && String(fast).trim() && !REFUSE.test(fast.trim().slice(0,80))) return fast;
  const first=await poolP;
  if(first && String(first).trim() && !REFUSE.test(first.trim().slice(0,80))) return first;
  if(first && String(first).trim()) return first;
  throw new Error('every brain stalled');
}`;
  if(omniRe.test(code)) code=code.replace(omniRe,omniNew);

  /* empty-reply hardening: no brain may hand back blank text */
  sub("if(out) return out;\n    throw new Error('empty relay');","if(out&&out.trim()) return out;\n    throw new Error('empty relay');");
  sub("if(!t) throw e;","if(!t||!t.trim()) throw e;");
  sub("if(out) return out;\n  throw new Error('empty stream');","if(out&&out.trim()) return out;\n    throw new Error('empty stream');");
  sub("if(g.length){ let t=(g[0].text||'').trim(); const i=t.indexOf('\\nUser:'); if(i>-1) t=t.slice(0,i).trim(); return t; }",
      "if(g.length){ let t=(g[0].text||'').trim(); const i=t.indexOf('\\nUser:'); if(i>-1) t=t.slice(0,i).trim(); if(t) return t; }");

  /* rows must land in the chat: line() builds every row but must also hang it on the page */
  const lineRe=/function line\(cls,text\)\{[\s\S]*?\n\}/;
  const lm=code.match(lineRe);
  if(lm && !lm[0].includes('chat.appendChild')) code=code.replace(lineRe, m=>m.replace('return d;','chat.appendChild(d);\n  return d;'));

  /* sendQuery: an empty answer reroutes through the unfiltered forge instead of printing blank */
  sub("lastLat=Date.now()-t0;",
`answer=String(answer==null?'':answer).trim();
    if(!answer){ wait.textContent='the fast brain came back empty — rerouting through the unfiltered forge…'; feed('EMPTY REPLY — REROUTING TO HORDE','warn'); answer=await askUnfiltered(user); answer=String(answer==null?'':answer).trim(); }
    lastLat=Date.now()-t0;`);

  try {
    const blob = new Blob([code], { type: 'text/javascript' });
    await import(URL.createObjectURL(blob));
  } catch (e) {
    try { await import(SRC); } catch (e2) { location.replace('../hell24/'); }
  }
}
