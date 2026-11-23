/* FAMOUS CLIP ENGINE — phase 27: prompt in, real famous movie clips + real frames pulled and cut into the edit (clip material is pulled and assembled on the Fo side; this panel sends the request). Existing features untouched. */
(function(){
  var ME='trevordavindra1@fo.wajo.ai';
  var PRESETS=['spider-man','batman','marvel fight','fast x','rocky','joker','john wick','top gun','tom and jerry','peter parker','venom','deadpool'];
  function panel(){
    if(document.getElementById('fcPanel'))return;
    var p=document.createElement('div');p.id='fcPanel';
    p.style.cssText='position:fixed;left:10px;bottom:76px;z-index:9999;width:min(420px,92vw);background:linear-gradient(160deg,#141424,#1a1030);border:1px solid #7d5bff55;border-radius:16px;padding:14px;font-family:inherit;color:#eef;display:none;box-shadow:0 12px 40px #000a';
    var h=document.createElement('div');
    h.innerHTML='<div style="font-weight:800;letter-spacing:.5px;color:#a78bff">FAMOUS CLIP ENGINE</div><div style="font-size:11px;color:#9a94c9;margin:4px 0 10px">type a prompt like <b>make a cool spider-man edit</b> — real movie clips + real frames get pulled, beat-cut and captioned, then the finished mp4 lands in your texts</div>';
    var inp=document.createElement('input');inp.id='fcPrompt';inp.placeholder='make a cool spider-man edit...';
    inp.style.cssText='width:100%;box-sizing:border-box;padding:10px 12px;border-radius:10px;border:1px solid #7d5bff66;background:#0d0c1d;color:#fff;font-size:14px;outline:none';
    var chips=document.createElement('div');chips.id='fcChips';chips.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin:10px 0';
    PRESETS.forEach(function(t){var c=document.createElement('span');c.textContent=t;c.style.cssText='padding:5px 10px;border-radius:999px;background:#7d5bff22;border:1px solid #7d5bff55;color:#cfc4ff;font-size:11px;cursor:pointer';c.onclick=function(){inp.value='make a cool '+t+' edit';};chips.appendChild(c);});
    var opts=document.createElement('div');
    opts.innerHTML='<label style="font-size:11px;color:#9a94c9;display:block;margin:4px 0">style: <select id="fcStyle" style="background:#0d0c1d;color:#fff;border:1px solid #7d5bff55;border-radius:8px;padding:4px 8px"><option>phonk beat-cut</option><option>velocity</option><option>cinematic</option><option>glitch</option></select> length: <select id="fcLen" style="background:#0d0c1d;color:#fff;border:1px solid #7d5bff55;border-radius:8px;padding:4px 8px"><option>15s</option><option>30s</option><option>60s</option></select></label><label style="font-size:11px;color:#9a94c9;display:flex;gap:6px;align-items:center;margin:6px 0"><input type="checkbox" id="fcVoice" checked> add voiceover</label>';
    var btn=document.createElement('button');btn.id='fcGo';btn.textContent='BUILD THE EDIT';
    btn.style.cssText='width:100%;margin-top:10px;padding:11px;border:0;border-radius:10px;background:linear-gradient(90deg,#7d5bff,#b45bff);color:#fff;font-weight:800;letter-spacing:.5px;cursor:pointer';
    var note=document.createElement('div');note.id='fcNote';note.style.cssText='font-size:11px;color:#8fd0ff;margin-top:8px;min-height:14px';
    btn.onclick=function(){
      var q=(inp.value||'').trim();
      if(!q){note.textContent='type what you want first';return;}
      var body='FAMOUS CLIP EDIT request\nprompt: '+q+'\nstyle: '+document.getElementById('fcStyle').value+'\nlength: '+document.getElementById('fcLen').value+'\nvoiceover: '+(document.getElementById('fcVoice').checked?'yes':'no');
      note.textContent='opening your mail app with the request — hit send and I get it';
      var a=document.createElement('a');a.href='mailto:'+ME+'?subject='+encodeURIComponent('FAMOUS CLIP EDIT: '+q.slice(0,60))+'&body='+encodeURIComponent(body);
      document.body.appendChild(a);a.click();document.body.removeChild(a);
    };
    p.appendChild(h);p.appendChild(inp);p.appendChild(chips);p.appendChild(opts);p.appendChild(btn);p.appendChild(note);
    document.body.appendChild(p);
  }
  function toggle(){panel();var p=document.getElementById('fcPanel');p.style.display=p.style.display==='none'?'block':'none';}
  function mount(){
    if(document.getElementById('fcBtn'))return;
    var b=document.createElement('button');b.id='fcBtn';b.textContent='FAMOUS CLIPS';
    b.style.cssText='position:fixed;left:10px;bottom:16px;z-index:9999;width:auto;max-width:200px;padding:9px 14px;border:1px solid #7d5bff88;border-radius:999px;background:linear-gradient(90deg,#2a1a5e,#3a1a4e);color:#e6ddff;font-weight:800;font-size:12px;letter-spacing:.5px;cursor:pointer;box-shadow:0 6px 18px #0009';
    b.onclick=toggle;document.body.appendChild(b);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
