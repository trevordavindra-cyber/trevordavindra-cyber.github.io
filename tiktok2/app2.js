// ---------- timeline + editors ----------
function drawTimeline(){
  var tv=$('trVideo'),tm=$('trMusic'),tc=$('trCaps');
  tv.innerHTML='';tm.innerHTML='';tc.innerHTML='';
  if(!S.clips.length)tv.innerHTML='<span class="tempty">empty — auto edit or add clips from library</span>';
  var tot=Math.max(0.1,totalDur());
  S.clips.forEach(function(c,i){
    var m=M[c.src];var d=document.createElement('div');d.className='tclip'+(S.selected===c.id?' sel':'');
    d.style.flexGrow=String(Math.max(0.4,clipOutDur(c)));
    d.textContent=(m?m.name.slice(0,10):'?')+' '+(c.speed!==1?c.speed+'x':'')+(c.trans!=='cut'?' '+c.trans:'');
    d.onclick=function(){selectClip(i)};
    tv.appendChild(d);
  });
  if(S.musicId&&M[S.musicId]){
    var d=document.createElement('div');d.className='tclip music';d.style.flexGrow=String(tot);
    d.textContent=(M[S.musicId].name||'music').slice(0,14)+(M[S.musicId].bpm?' · '+M[S.musicId].bpm+'bpm':'');
    d.onclick=function(){S.musicId=null;drawTimeline();save();log('music removed')};
    tm.appendChild(d);
  } else tm.innerHTML='<span class="tempty">no music — add in library</span>';
  if(!S.captions.length)tc.innerHTML='<span class="tempty">no captions — add in panel below</span>';
  S.captions.forEach(function(c,i){
    var d=document.createElement('div');d.className='tclip cap';d.style.flexGrow=String(Math.max(0.2,c.t1-c.t0));
    d.textContent=c.text.slice(0,16);
    d.onclick=function(){openCap(i)};
    tc.appendChild(d);
  });
}
function selectClip(i){
  S.selected=S.clips[i].id;
  var c=S.clips[i],m=M[c.src];
  $('clipPanel').style.display='block';$('capPanel').style.display='none';
  $('cpName').textContent=(m?m.name:'?')+' #'+(i+1);
  var md=m?m.dur:10;
  var inR=$('cpIn');inR.max=md;inR.value=c.start;$('cpInV').textContent=c.start.toFixed(2);
  var outR=$('cpOut');outR.max=md;outR.value=c.end;$('cpOutV').textContent=c.end.toFixed(2);
  $('cpSpeed').value=c.speed;$('cpSpeedV').textContent=c.speed.toFixed(2)+'x';
  $('cpZoom').value=c.zoom;$('cpZoomV').textContent=c.zoom.toFixed(1);
  $('cpTrans').value=c.trans||'cut';
  $('cpKeep').value=c.keep?'1':'0';
  drawTimeline();
}
function bindClipPanel(){
  $('cpIn').oninput=function(){var c=cur();if(!c)return;c.start=clamp(parseFloat(this.value),0,c.end-0.2);$('cpInV').textContent=c.start.toFixed(2)};
  $('cpOut').oninput=function(){var c=cur();if(!c)return;c.end=clamp(parseFloat(this.value),c.start+0.2,M[c.src]?M[c.src].dur:c.start+10);$('cpOutV').textContent=c.end.toFixed(2)};
  $('cpSpeed').oninput=function(){var c=cur();if(!c)return;c.speed=parseFloat(this.value);$('cpSpeedV').textContent=c.speed.toFixed(2)+'x'};
  $('cpZoom').oninput=function(){var c=cur();if(!c)return;c.zoom=parseFloat(this.value);$('cpZoomV').textContent=c.zoom.toFixed(1)};
  $('cpTrans').onchange=function(){var c=cur();if(!c)return;c.trans=this.value};
  $('cpKeep').onchange=function(){var c=cur();if(!c)return;c.keep=this.value==='1'};
  $('cpDup').onclick=function(){var i=S.clips.findIndex(function(x){return x.id===S.selected});if(i<0)return;var c=Object.assign({},S.clips[i],{id:uid()});S.clips.splice(i+1,0,c);drawTimeline();save()};
  $('cpDel').onclick=function(){var i=S.clips.findIndex(function(x){return x.id===S.selected});if(i<0)return;S.clips.splice(i,1);S.selected=null;$('clipPanel').style.display='none';drawTimeline();save()};
}
function cur(){return S.clips.find(function(x){return x.id===S.selected})}
var capEdit=null;
function openCap(i){
  capEdit=S.captions[i].id;
  $('capPanel').style.display='block';$('clipPanel').style.display='none';
  $('capText').value=S.captions[i].text;
  drawTimeline();
}
function bindCapPanel(){
  $('capSave').onclick=function(){
    if(capEdit){var c=S.captions.find(function(x){return x.id===capEdit});if(c)c.text=$('capText').value.trim()}
    drawTimeline();save();log('caption saved');
  };
  $('capAdd').onclick=function(){
    var lines=$('capText').value.trim().split('\n').filter(function(x){return x.trim()});
    var t=0.5,tot=totalDur();
    if(!lines.length)lines=['your caption here'];
    lines.forEach(function(l){
      var d=Math.max(1.2,tot/Math.max(1,lines.length));
      S.captions.push({id:uid(),t0:t,t1:Math.min(tot,t+d),text:l.trim()});
      t+=d;
    });
    capEdit=null;$('capText').value='';
    drawTimeline();save();log(lines.length+' caption line(s) added');
  };
  $('capAuto').onclick=function(){
    if(!S.clips.length){log('no clips yet');return}
    S.captions=[];
    var t=0;
    S.clips.forEach(function(c){
      var d=clipOutDur(c),txt=(M[c.src]&&M[c.src].name||'clip').replace(/\.[a-z0-9]+$/i,'').slice(0,40);
      S.captions.push({id:uid(),t0:t,t1:t+d,text:txt.toUpperCase()});
      t+=d;
    });
    drawTimeline();save();log('captions fit to clips — tap any to edit text');
  };
  $('capStyle').onchange=function(){S.capStyle=this.value;save()};
}
// ---------- media list ----------
function renderMediaList(){
  var el=$('mediaList');el.innerHTML='';
  var ms=Object.values(M);
  if(!ms.length){el.innerHTML='<div class="note">nothing uploaded yet</div>';return}
  ms.forEach(function(m){
    var d=document.createElement('div');d.className='mitem';
    var meta=(m.kind==='video'?'video':'music')+' · '+(m.dur||0).toFixed(1)+'s'+(m.scenes?' · '+m.scenes.length+' scenes':'')+(m.bpm?' · '+m.bpm+'bpm':'');
    d.innerHTML='<span class="nm">'+esc(m.name)+'</span><span class="meta">'+esc(meta)+'</span>';
    var b1=document.createElement('button');b1.textContent=m.kind==='video'?'+ TIMELINE':'+ MUSIC';b1.className='ghost small';
    b1.onclick=function(){
      if(m.kind==='video'){
        var seg=pickSeg(m,Math.min(2.5,(m.dur||2)/2));
        S.clips.push({id:uid(),src:m.id,start:seg.start,end:seg.end,speed:1,ramp:0,zoom:1,trans:'cut',keep:0});
        $('playhint').style.display='none';
      } else {S.musicId=m.id}
      drawTimeline();save();
    };
    var b2=document.createElement('button');b2.textContent='DEL';b2.className='ghost small';
    b2.onclick=async function(){
      delete M[m.id];await idbDel(m.id);
      S.clips=S.clips.filter(function(c){return c.src!==m.id});
      if(S.musicId===m.id)S.musicId=null;
      renderMediaList();drawTimeline();save();log('removed '+m.name);
    };
    d.appendChild(b1);d.appendChild(b2);
    el.appendChild(d);
  });
}
function bindUploads(){
  $('fVid').onchange=function(){
    [...this.files].forEach(function(f){addMedia(f,'video')});this.value='';
  };
  $('fMus').onchange=function(){if(this.files[0])addMedia(this.files[0],'audio');this.value=''};
  $('fRef').onchange=async function(){
    if(!this.files[0])return;this.value='';
    var m=await addMedia(this.files[0],'video');
    S.refId=m.id;
    await analyzeScenes(m);
    var st=m.stats;var cpm=st?st.cutsPerMin:0;
    var rec=cpm>45?'velocity':cpm>32?'football':cpm>22?'gaming':cpm>14?'cinematic':'documentary';
    var extra=st&&st.sat<0.18?'dark palette':st&&st.sat>0.4?'vivid palette':'natural palette';
    S.refReport=rec;
    $('refCard').style.display='block';
    $('refReport').innerHTML='this reference cuts <b>'+cpm.toFixed(0)+' times/min</b>, '+extra+' → closest style: <b>'+(STYLES[rec]?STYLES[rec].label:rec)+'</b>';
    log('reference analyzed → '+rec,true);save();
  };
  $('btnRefApply').onclick=function(){
    if(!S.refReport)return;
    S.style=S.refReport;
    syncStyleChips();
    log('applied reference pacing + grade ('+S.style+')',true);save();
  };
}
// ---------- assistant ----------
function projSummary(){
  var vids=videoMedias().map(function(m){return m.name.slice(0,24)}).join(', ');
  return 'style='+S.style+' | clips='+S.clips.length+' | total='+totalDur().toFixed(1)+'s | music='+(S.musicId&&M[S.musicId]?(M[S.musicId].name||'').slice(0,20)+' '+(M[S.musicId].bpm||'')+'bpm':'none')+' | captions='+S.captions.length+' | footage in library: '+(vids||'none');
}
function applyOps(ops){
  (ops||[]).forEach(function(o){
    try{
      if(o.op==='set_style'&&STYLES[o.style]){S.style=o.style;syncStyleChips();log('style → '+STYLES[o.style].label,true)}
      else if(o.op==='pace'&&o.mult){S.variations=[buildPlan(clamp(o.mult,0.3,3),'ASSISTANT')];applyPlan(S.variations[0]);log('pace x'+o.mult)}
      else if(o.op==='transition'&&o.type){S.clips.forEach(function(c){c.trans=o.type});drawTimeline();log('transitions → '+o.type)}
      else if(o.op==='speed'){S.clips.forEach(function(c,i){if(o.clip==null||i===o.clip)c.speed=clamp(o.rate||1.5,0.25,3)});drawTimeline();log('speed updated')}
      else if(o.op==='ramp'){S.clips.forEach(function(c,i){if(o.clip==null||i===o.clip)c.ramp=o.on?1:0});log('speed ramps '+(o.on?'on':'off'))}
      else if(o.op==='beats'&&S.musicId){var p=buildPlan(1,'BEATS');applyPlan(p);log('recut on the beat',true)}
      else if(o.op==='music_gain'){S.musicGain=clamp(o.value,0,2);log('music gain '+S.musicGain)}
      else if(o.op==='music_remove'){S.musicId=null;drawTimeline();log('music removed')}
      else if(o.op==='captions_set'&&o.text){var lines=o.text.split('|');var t=0.4,tot=Math.max(4,totalDur());S.captions=lines.map(function(l){var d=Math.max(1.2,tot/Math.max(1,lines.length));var c={id:uid(),t0:t,t1:Math.min(tot,t+d),text:l.trim().toUpperCase()};t+=d;return c});S.capStyle=o.mode||'bold';drawTimeline();log('captions set')}
      else if(o.op==='captions_fit'){$('capAuto').click()}
      else if(o.op==='zoom'){S.clips.forEach(function(c,i){if(o.clip==null||i===o.clip)c.zoom=clamp(o.value,-3,3)});drawTimeline();log('zoom updated')}
      else if(o.op==='shorten'){S.clips.forEach(function(c){var d=(c.end-c.start);var cut=Math.min(d*0.3,o.amount||0.3);c.end=c.start+d-cut});drawTimeline();log('tightened clips')}
      else if(o.op==='remove_clip'&&o.clip!=null&&S.clips[o.clip]){S.clips.splice(o.clip,1);drawTimeline();log('clip '+(o.clip+1)+' removed')}
      else if(o.op==='duplicate'&&o.clip!=null&&S.clips[o.clip]){S.clips.splice(o.clip+1,0,Object.assign({},S.clips[o.clip],{id:uid()}));drawTimeline();log('clip duplicated')}
      else if(o.op==='shuffle'){S.clips.sort(function(){return Math.random()-0.5});drawTimeline();log('clips shuffled')}
      else log('skipped unknown op');
    }catch(e){log('op failed: '+e.message)}
  });
  save();
}
function localAssistant(text){
  var t=text.toLowerCase(),ops=[],said=[];
  var found=STYLIST.find(function(s){return t.indexOf(s)>-1||t.indexOf(STYLES[s].label.toLowerCase())>-1||(s==='dark'&&t.indexOf('dark')>-1)});
  if(found){ops.push({op:'set_style',style:found});said.push(STYLES[found].label.toLowerCase()+' style')}
  if(t.indexOf('faster')>-1){ops.push({op:'pace',mult:1.4});said.push('faster cuts')}
  if(t.indexOf('slower')>-1){ops.push({op:'pace',mult:0.7});said.push('slower cuts')}
  if(t.indexOf('beat')>-1){ops.push({op:'beats'});said.push('cut to the beat')}
  ['flash','punch','whip','shake','fade'].forEach(function(tr){if(t.indexOf(tr)>-1){ops.push({op:'transition',type:tr});said.push(tr+' transitions')}});
  if(t.indexOf('louder')>-1){ops.push({op:'music_gain',value:1.1});said.push('music up')}
  if(t.indexOf('quieter')>-1||t.indexOf('lower the music')>-1){ops.push({op:'music_gain',value:0.5});said.push('music down')}
  if(t.indexOf('no music')>-1||t.indexOf('remove music')>-1){ops.push({op:'music_remove'});said.push('music off')}
  if(t.indexOf('caption')>-1||t.indexOf('subtitle')>-1){var m=t.split(/captions?[:\s]+(.*)/);ops.push({op:m[1]?'captions_set':'captions_fit',text:m[1]});said.push('captions')}
  if(t.indexOf('shorter')>-1||t.indexOf('tighten')>-1){ops.push({op:'shorten',amount:0.25});said.push('tighter cuts')}
  if(t.indexOf('shuffle')>-1||t.indexOf('reorder')>-1){ops.push({op:'shuffle'});said.push('shuffled')}
  if(t.indexOf('ramp')>-1||t.indexOf('velocity')>-1){ops.push({op:'ramp',on:true});said.push('speed ramps on')}
  return ops.length?{ops:ops,note:said.join(', ')}:null;
}
async function llmAssistant(text,isSuggest){
  var sys='You are the editing brain of a TikTok editor. Current project: '+projSummary()+'. Available ops (JSON only): {"op":"set_style","style":"anime|football|gaming|marvel|movies|cinematic|dark|velocity|phonk|luxury|documentary|emotional"}, {"op":"pace","mult":1.3}, {"op":"transition","type":"cut|flash|fade|punch|whip|shake"}, {"op":"speed","clip":0,"rate":1.5}, {"op":"ramp","on":true}, {"op":"beats"}, {"op":"music_gain","value":1.1}, {"op":"music_remove"}, {"op":"captions_set","text":"line1|line2"}, {"op":"captions_fit"}, {"op":"zoom","clip":0,"value":2}, {"op":"shorten","amount":0.3}, {"op":"remove_clip","clip":0}, {"op":"duplicate","clip":0}, {"op":"shuffle"}. Reply ONLY with JSON: {"ops":[...],"reply":"one short sentence"}. User request: '+text;
  for(var a=0;a<3;a++){
    try{
      var r=await fetch('https://text.pollinations.ai/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'openai-fast',messages:[{role:'user',content:sys}]})});
      if(!r.ok)throw new Error('http '+r.status);
      var j=await r.json();
      var txt=((j.choices||[])[0]||{}).message?j.choices[0].message.content:'';
      var a2=txt.indexOf('{'),b2=txt.lastIndexOf('}');
      var d=JSON.parse(txt.slice(a2,b2+1));
      return d;
    }catch(e){await sleep(20000)}
  }
  return null;
}
async function sendChat(){
  var text=$('chatIn').value.trim();
  if(!text)return;
  chatAdd('me',text);$('chatIn').value='';
  var loc=localAssistant(text);
  if(loc){applyOps(loc.ops);chatAdd('ai','done: '+loc.note+'. preview it.')}
  else{
    chatAdd('sys','thinking…');
    var d=await llmAssistant(text,false);
    if(d){applyOps(d.ops);chatAdd('ai',d.reply||'done — preview it')}
    else chatAdd('ai','the ai relay is busy right now — try again in a minute');
  }
}
async function suggest(){
  chatAdd('sys','analyzing your edit…');
  var d=await llmAssistant('Suggest up to 3 concrete improvements for this project as ops. Reply {"ops":[...],"reply":"short summary of what you changed"}.',true);
  if(d){applyOps(d.ops);chatAdd('ai',d.reply||'applied improvements')}
  else chatAdd('ai','relay busy — try again in a minute');
}
function chatAdd(who,txt){
  var d=document.createElement('div');d.className=who;d.textContent=(who==='me'?'you: ':who==='ai'?'editor: ':'')+txt;
  $('chat').appendChild(d);$('chat').scrollTop=$('chat').scrollHeight;
}
// ---------- ai generator ----------
async function genScript(topic){
  var prompt='You write viral TikTok video scripts. Topic: "'+topic+'". Reply with ONLY valid JSON: {"caption":"one short punchy sentence","hashtags":["#Tag1","#Tag2","#Tag3","#Tag4","#Tag5"],"scenes":[{"img":"short vivid image prompt, cinematic, vertical 9:16, no text in image","text":"8 to 16 words of narration"}]} — exactly 6 scenes, scene 1 is the hook.';
  for(var a=0;a<3;a++){
    try{
      var r=await fetch('https://text.pollinations.ai/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'openai-fast',messages:[{role:'user',content:prompt}]})});
      if(!r.ok)throw new Error('http '+r.status);
      var j=await r.json();
      var txt=((j.choices||[])[0]||{}).message?j.choices[0].message.content:'';
      var i2=txt.indexOf('{'),b2=txt.lastIndexOf('}');
      var d=JSON.parse(txt.slice(i2,b2+1));
      if(d.scenes&&d.scenes.length>=4)return d;throw new Error('bad shape');
    }catch(e){log('script retry '+(a+1)+': '+e.message);await sleep(15000)}
  }
  throw new Error('script service busy');
}
async function genImage(p,idx){
  var url='https://image.pollinations.ai/prompt/'+encodeURIComponent(p+' cinematic vertical 9:16, high detail')+'?width=720&height=1280&nologo=true&seed='+(Math.floor(Math.random()*99999)+idx*7);
  for(var a=0;a<5;a++){
    try{
      var r=await fetch(url);if(!r.ok)throw new Error('http '+r.status);
      var b=await r.blob();if(b.size<20000)throw new Error('small');
      return b;
    }catch(e){log('image retry '+(a+1)+': '+e.message);await sleep(7000+a*4000)}
  }
  return null;
}
async function getVoice(text,voice,actx){
  try{
    var r=await fetch('https://api.streamelements.com/kappa/v2/speech?voice='+voice+'&text='+encodeURIComponent(text));
    if(!r.ok)throw new Error('http '+r.status);
    return await actx.decodeAudioData(await r.arrayBuffer());
  }catch(e){
    log('voice fallback (silence): '+e.message);
    var d=Math.max(2.2,text.split(' ').length*0.42);
    var s=actx.createBuffer(1,Math.ceil(d*actx.sampleRate),actx.sampleRate);return s;
  }
}
function groupsFor(text,dur){
  var words=text.split(/\s+/),g=[];
  for(var i=0;i<words.length;i+=2)g.push({w:words.slice(i,i+2).join(' ').toUpperCase(),c:(words[i]||'').length+(words[i+1]||'').length});
  var tot=0;g.forEach(function(x){tot+=x.c});tot=tot||1;
  var t=0.12,span=Math.max(0.6,dur-0.2);
  g.forEach(function(x){var w=x.c/tot*span;x.t0=t;x.t1=t+w;t+=w});
  return g;
}
async function runGenerator(){
  var topic=$('genTopic').value.trim();
  if(!topic){log('type a topic for the generator');return}
  var btn=$('btnGen');btn.disabled=true;btn.textContent='GENERATING…';
  try{
    log('writing script…',true);
    var data=await genScript(topic);
    var actx=new (window.AudioContext||window.webkitAudioContext)();
    var imgs=[],clips=[];
    for(var i=0;i<data.scenes.length;i++){
      log('scene '+(i+1)+' image…');
      var b=await genImage(data.scenes[i].img,i);
      if(b)imgs.push(await blobToImg(b));else imgs.push(null);
      clips.push({buf:await getVoice(data.scenes[i].text,$('genVoice').value,actx)});
    }
    log('rendering ai clip…',true);
    var blob=await renderGen(actx,imgs,clips,data.scenes);
    var m=await addMedia(new File([blob],('AI: '+topic).slice(0,40)+'.webm',{type:blob.type}),'video');
    var t=0;
    data.scenes.forEach(function(sc,i){
      var d=clips[i].buf.duration;
      S.captions.push({id:uid(),t0:t,t1:t+d,text:sc.text.toUpperCase()});t+=d;
    });
    if(!S.clips.length){S.clips.push({id:uid(),src:m.id,start:0,end:m.dur,speed:1,ramp:0,zoom:1,trans:'cut',keep:1});$('playhint').style.display='none'}
    drawTimeline();save();
    log('ai clip ready: '+m.name+' — in your library',true);
    $('capAIOut').style.display='block';$('capAIOut').textContent=data.caption+'\n'+data.hashtags.join(' ');
  }catch(e){log('generator: '+e.message)}
  btn.disabled=false;btn.textContent='GENERATE AI CLIP';
}
function blobToImg(b){return new Promise(function(res,rej){var u=URL.createObjectURL(b),im=new Image();im.onload=function(){res(im)};im.onerror=rej;im.src=u})}
async function renderGen(actx,imgs,clips,scenes){
  var W=720,H=1280,cv=document.createElement('canvas');cv.width=W;cv.height=H;
  var ctx=cv.getContext('2d');
  var starts=[],t=0;clips.forEach(function(c){starts.push(t);t+=c.buf.duration});
  var total=t+0.15;
  var dest=actx.createMediaStreamDestination();
  var t0=actx.currentTime+0.25;
  clips.forEach(function(c,i){var s=actx.createBufferSource();s.buffer=c.buf;s.connect(dest);s.start(t0+starts[i])});
  var gs=clips.map(function(c,i){return groupsFor(scenes[i].text,c.buf.duration)});
  var mime='';var o=['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];
  for(var i=0;i<o.length;i++){if(window.MediaRecorder&&MediaRecorder.isTypeSupported(o[i])){mime=o[i];break}}
  var stream=cv.captureStream(30);dest.stream.getAudioTracks().forEach(function(tr){stream.addTrack(tr)});
  var rec=new MediaRecorder(stream,mime?{mimeType:mime,videoBitsPerSecond:4000000}:{videoBitsPerSecond:4000000});
  var chunks=[];rec.ondataavailable=function(e){if(e.data.size)chunks.push(e.data)};
  var done=new Promise(function(res){rec.onstop=function(){res(new Blob(chunks,{type:mime||'video/webm'}))}});
  rec.start(500);
  return new Promise(function(res){
    function frame(){
      var now=actx.currentTime-t0;
      if(now>=total){try{rec.stop()}catch(x){};res(done);return}
      var i=0;while(i<clips.length-1&&now>=starts[i+1])i++;
      var p=clamp((now-starts[i])/clips[i].buf.duration,0,1);
      ctx.fillStyle='#05070d';ctx.fillRect(0,0,W,H);
      var im=imgs[i];
      if(im){var s0=Math.max(W/im.width,H/im.height)*(1+0.3*p);ctx.drawImage(im,(W-im.width*s0)/2,(H-im.height*s0)/2,im.width*s0,im.height*s0)}
      var vg=ctx.createRadialGradient(W/2,H/2,H*0.25,W/2,H/2,H*0.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.45)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
      var cur=null;for(var k=0;k<gs[i].length;k++){if(now>=starts[i]+gs[i][k].t0&&now<starts[i]+gs[i][k].t1){cur=gs[i][k];break}}
      if(cur){var fs=56;ctx.font='900 '+fs+'px Arial, sans-serif';while(ctx.measureText(cur.w).width>W-70&&fs>34){fs-=3;ctx.font='900 '+fs+'px Arial, sans-serif'}
        ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineWidth=fs*0.18;ctx.strokeStyle='#000';ctx.strokeText(cur.w,W/2,H-250);ctx.fillStyle='#fff';ctx.fillText(cur.w,W/2,H-250)}
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}
// ---------- export / cover / batch ----------
async function doExport(){
  var btn=$('btnExport');btn.disabled=true;btn.textContent='RENDERING…';
  try{
    if(!S.clips.length){log('timeline is empty');return}
    S.res=parseInt($('exRes').value);S.fps=parseInt($('exFps').value);
    log('rendering '+S.res+'p '+S.fps+'fps… keep this tab open',true);
    var blob=await renderProject({canvas:$('cv'),record:true,onprogress:pbar});
    var isMp4=blob&&blob.type.indexOf('mp4')>-1;
    var u=URL.createObjectURL(blob);
    var out=$('exOut');out.innerHTML='';
    var a=document.createElement('a');a.className='dl';a.href=u;a.download='edit-'+Date.now()+'.'+(isMp4?'mp4':'webm');
    a.textContent='DOWNLOAD ('+(isMp4?'MP4':'WEBM')+', '+Math.round(blob.size/1048576)+' MB)';
    out.appendChild(a);
    log('export done',true);
  }catch(e){log('export: '+e.message)}
  btn.disabled=false;btn.textContent='RENDER + DOWNLOAD';
}
async function doBatch(){
  if(!S.variations.length){log('make variations first (studio: 3 VARIATIONS)');return}
  $('btnBatch').disabled=true;
  var out=$('batchOut');out.innerHTML='';
  for(var i=0;i<S.variations.length;i++){
    log('batch '+(i+1)+'/3: '+S.variations[i].label,true);
    applyPlan(S.variations[i]);
    try{
      var blob=await renderProject({canvas:$('cv'),record:true,onprogress:pbar});
      var a=document.createElement('a');a.className='dl';
      a.href=URL.createObjectURL(blob);a.download='edit-'+S.variations[i].label.toLowerCase()+'.webm';
      a.textContent='DOWNLOAD '+S.variations[i].label+' ('+Math.round(blob.size/1048576)+' MB)';
      out.appendChild(a);
    }catch(e){log('batch '+S.variations[i].label+': '+e.message)}
  }
  $('btnBatch').disabled=false;log('batch done',true);
}
async function doCover(){
  try{
    if(!S.clips.length){log('timeline is empty');return}
    var frac=parseInt($('covFrame').value)/100;
    var c=S.clips[0],m=M[c.src];
    var el=document.createElement('video');el.src=m.url;el.muted=true;el.playsInline=true;
    await new Promise(function(r){el.onloadeddata=r;setTimeout(r,3000)});
    await seekTo(el,c.start+(c.end-c.start)*frac,4000);
    var cv=$('coverCv');cv.style.display='block';
    var ctx=cv.getContext('2d');var st=STYLES[S.style];
    ctx.filter=st.grade;drawCover(ctx,el,720,1280,1.05,0,0);ctx.filter='none';
    if(st.tint){ctx.fillStyle=st.tint;ctx.fillRect(0,0,720,1280)}
    var vg=ctx.createRadialGradient(360,640,320,360,640,1000);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.5)');ctx.fillStyle=vg;ctx.fillRect(0,0,720,1280);
    var title=$('covTitle').value.trim();
    if(title){ctx.font='900 88px Arial, sans-serif';ctx.textAlign='center';ctx.lineJoin='round';ctx.lineWidth=16;ctx.strokeStyle='#000';
      var words=title.toUpperCase().split(' ');var lines=[],cur2='';
      words.forEach(function(w){if(ctx.measureText((cur2+' '+w).trim()).width>600&&cur2){lines.push(cur2);cur2=w}else cur2=(cur2+' '+w).trim()});
      lines.push(cur2);
      lines.forEach(function(l,i){var y=1050-(lines.length-1-i)*104;ctx.strokeText(l,360,y);ctx.fillStyle='#fff';ctx.fillText(l,360,y)});
    }
    cv.toBlob(function(b){
      var a=$('covDl');a.href=URL.createObjectURL(b);a.style.display='block';
      log('cover ready — download below',true);
    },'image/png');
  }catch(e){log('cover: '+e.message)}
}
async function capAI(){
  var btn=$('btnCapAI');btn.disabled=true;
  try{
    var topic=$('covTitle').value.trim()||(S.clips.length?'my video edit':'my video');
    var d=await genScript(topic);
    var txt=d.caption+'\n'+d.hashtags.join(' ');
    var o=$('capAIOut');o.style.display='block';o.textContent=txt;
    $('btnCapCopy').style.display='block';
    $('btnCapCopy').onclick=function(){navigator.clipboard.writeText(txt);$('btnCapCopy').textContent='COPIED'};
  }catch(e){log('caption ai: '+e.message)}
  btn.disabled=false;
}
// ---------- styles / tabs / misc ----------
function syncStyleChips(){
  var el=$('styleChips');el.innerHTML='';
  STYLIST.forEach(function(k){
    var d=document.createElement('div');d.className='chip'+(S.style===k?' on':'');d.textContent=STYLES[k].label;
    d.onclick=function(){S.style=k;syncStyleChips();save();log('style → '+STYLES[k].label,true)};
    el.appendChild(d);
  });
  $('styleDesc').textContent=STYLES[S.style]?('grade: '+STYLES[S.style].grade+' · pace: '+STYLES[S.style].pace.toFixed(1)+' cuts/s · transitions: '+STYLES[S.style].trans.join('/')):'—';
}
function bindTabs(){
  document.querySelectorAll('nav .tab').forEach(function(t){
    t.onclick=function(){
      document.querySelectorAll('nav .tab').forEach(function(x){x.classList.remove('on')});
      document.querySelectorAll('.page').forEach(function(x){x.classList.remove('on')});
      t.classList.add('on');$('page-'+t.dataset.page).classList.add('on');
    };
  });
}
// ---------- save / restore ----------
var saveT=null;
function save(){
  clearTimeout(saveT);
  saveT=setTimeout(function(){
    try{
      var meta={};Object.values(M).forEach(function(m){meta[m.id]={id:m.id,name:m.name,kind:m.kind,dur:m.dur}});
      var data=Object.assign({},S,{media:meta,variations:[]});
      data.selected=null;
      localStorage.setItem('tk2proj',JSON.stringify(data));
      $('saveState').textContent='saved';
    }catch(e){}
  },700);
}
async function restore(){
  try{
    var raw=localStorage.getItem('tk2proj');if(!raw)return;
    var d=JSON.parse(raw);
    S=Object.assign(S,d);
    var meta=d.media||{};
    for(var id in meta){
      var blob=await idbGet(id);
      if(!blob){delete meta[id];continue}
      M[id]=Object.assign({},meta[id],{blob:blob,url:URL.createObjectURL(blob)});
      if(M[id].kind==='video')analyzeScenes(M[id]).catch(function(){});
    }
    S.variations=[];S.selected=null;
    renderMediaList();drawTimeline();syncStyleChips();
    if(S.clips.length)$('playhint').style.display='none';
    log('project restored: '+S.clips.length+' clips, '+Object.keys(M).length+' media',true);
  }catch(e){log('restore: '+e.message)}
}
// ---------- init ----------
async function init(){
  await idbOpen();
  bindTabs();bindClipPanel();bindCapPanel();bindUploads();syncStyleChips();
  $('btnPlay').onclick=preview;$('btnStop').onclick=function(){STOPFLAG=true;log('stopping…')};
  $('btnAuto').onclick=autoEdit;$('btnAnalyze').onclick=async function(){
    var vs=videoMedias();
    if(!vs.length){log('no footage yet');return}
    for(var i=0;i<vs.length;i++)await analyzeScenes(vs[i]);
  };
  $('btnBeats').onclick=async function(){
    var a=Object.values(M).filter(function(m){return m.kind==='audio'});
    if(!a.length){log('no music uploaded yet');return}
    for(var i=0;i<a.length;i++)await detectBeats(a[i]);
  };
  $('btnVariations').onclick=makeVariations;
  $('btnSend').onclick=sendChat;
  $('btnSuggest').onclick=suggest;
  $('btnGen').onclick=runGenerator;
  $('btnExport').onclick=doExport;
  $('btnBatch').onclick=doBatch;
  $('btnCover').onclick=doCover;
  $('covFrame').oninput=function(){$('covFrameV').textContent=this.value+'%'};
  $('btnCapAI').onclick=capAI;
  $('btnNew').onclick=function(){if(confirm('Start a new project? Library is kept.')){S.clips=[];S.captions=[];S.musicId=null;S.variations=[];drawTimeline();save();log('new project started')}};
  $('btnWipe').onclick=async function(){
    if(!confirm('Delete ALL media + project data on this device?'))return;
    var ks=await idbKeys();for(var i=0;i<ks.length;i++)await idbDel(ks[i]);
    M={};S.clips=[];S.captions=[];S.musicId=null;
    localStorage.removeItem('tk2proj');
    renderMediaList();drawTimeline();log('everything cleared');
  };
  $('exRes').onchange=function(){S.res=parseInt(this.value);save()};
  $('exFps').onchange=function(){S.fps=parseInt(this.value);save()};
  $('capStyle').value=S.capStyle;
  await restore();
  renderMediaList();drawTimeline();syncStyleChips();
  log('ULTIMATE AI TIKTOK EDIT MAKER ready — upload footage in LIBRARY, then AUTO EDIT',true);
}
init();
