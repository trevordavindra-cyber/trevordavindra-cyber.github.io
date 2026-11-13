/* hell26 loader: runs the ILLUMINATI core with the coding intro removed */
const SRC = '../hell24/app.js';
let code = '';
try {
  const r = await fetch(SRC, { cache: 'reload' });
  if (r.ok) code = await r.text();
} catch (e) {}
if (!code) { location.replace('../hell24/'); }
else {
  // strip the boot terminal lines entirely: tap goes straight to the voice
  const bootRe = /const BOOT=\[[\s\S]*?\];/;
  if (bootRe.test(code)) code = code.replace(bootRe, 'const BOOT=[];');
  // give the spoken intro room to finish before the safety watchdog opens the app
  if (code.split('},9000);').length === 2) code = code.replace('},9000);', '},25000);');
  try {
    const blob = new Blob([code], { type: 'text/javascript' });
    await import(URL.createObjectURL(blob));
  } catch (e) {
    try { await import(SRC); } catch (e2) { location.replace('../hell24/'); }
  }
}
