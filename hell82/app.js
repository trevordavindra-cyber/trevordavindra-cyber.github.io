/* hell29 loader: runs the ILLUMINATI core engine (v16 lineage) with coding intro + entry hum removed */
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
  const omniRe=/async function askOmni\(user\)\{[\s\S]*?\n\}/;
  const omniNew=`async function askOmni(user){
  const poolP=askUnfiltered(user,null,true).catch(()=>null);
  const fast=await Promise.race([askCloudSafe(user).catch(()=>null), new Promise(r=>setTimeout(()=>r(null),9000))]);
  if(fast && !REFUSE.test(fast.trim().slice(0,80))) return fast;
  const first=await poolP;
  if(first && !REFUSE.test(first.trim().slice(0,80))) return first;
  if(first) return first;
  throw new Error('every brain stalled');
}`;
  if(omniRe.test(code)) code=code.replace(omniRe,omniNew);

  try {
    const blob = new Blob([code], { type: 'text/javascript' });
    await import(URL.createObjectURL(blob));
  } catch (e) {
    try { await import(SRC); } catch (e2) { location.replace('../hell24/'); }
  }
}