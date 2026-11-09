
  // boot screen
  const bootMsgs=['waking the neurons…','loading vibes.dll…','aligning values…','done. hi.'];
  let bmi=0;
  const bootTimer=setInterval(()=>{document.getElementById('boot-msg').textContent=bootMsgs[bmi++];if(bmi>=bootMsgs.length)clearInterval(bootTimer)},420);
  addEventListener('load',()=>setTimeout(()=>document.getElementById('boot').classList.add('done'),900));

  // scroll progress
  const prog=document.getElementById('progress');
  addEventListener('scroll',()=>{
    const h=document.documentElement;
    prog.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
  },{passive:true});

  // typewriter
  const phrases=["finish your to-do list","write the docs nobody reads","dream in embeddings","argue about fonts","debug itself at 3am","make the future feel close"];
  const typedEl=document.getElementById('typed');
  let pi=0,ci=0,deleting=false;
  function type(){
    const cur=phrases[pi];
    typedEl.textContent=deleting?cur.slice(0,ci--):cur.slice(0,ci++);
    let wait=deleting?38:72;
    if(!deleting&&ci>cur.length){deleting=true;wait=1600}
    else if(deleting&&ci<0){deleting=false;pi=(pi+1)%phrases.length;wait=350}
    setTimeout(type,wait);
  }
  type();

  // cursor glow (mouse only)
  const glow=document.getElementById('glow'),dot=document.getElementById('dot');
  let gx=innerWidth/2,gy=innerHeight/2,tx=gx,ty=gy;
  addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;dot.style.left=tx+'px';dot.style.top=ty+'px'});
  (function loop(){gx+=(tx-gx)*.09;gy+=(ty-gy)*.09;glow.style.left=gx+'px';glow.style.top=gy+'px';requestAnimationFrame(loop)})();

  // card spotlight + 3d tilt
  document.querySelectorAll('.card').forEach(c=>{
    c.addEventListener('mousemove',e=>{
      const r=c.getBoundingClientRect();
      const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
      c.style.setProperty('--mx',(e.clientX-r.left)+'px');
      c.style.setProperty('--my',(e.clientY-r.top)+'px');
      c.style.transform='perspective(900px) rotateY('+((px-.5)*8)+'deg) rotateX('+((.5-py)*8)+'deg) translateY(-7px)';
    });
    c.addEventListener('mouseleave',()=>{c.style.transform=''});
  });

  // magnetic buttons
  document.querySelectorAll('.magnetic').forEach(b=>{
    b.addEventListener('mousemove',e=>{
      const r=b.getBoundingClientRect();
      b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.28)+'px)';
    });
    b.addEventListener('mouseleave',()=>{b.style.transform=''});
  });

  // scroll reveal
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
  }),{threshold:.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // count-up stats
  const cio=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target,target=+el.dataset.count;cio.unobserve(el);
    let n=0;const step=()=>{n+=Math.max(1,target/40);if(n>=target){el.textContent=target+(target===1?'':'')}else{el.textContent=Math.floor(n);requestAnimationFrame(step)}};
    step();
  }),{threshold:.5});
  document.querySelectorAll('.num').forEach(el=>cio.observe(el));

  // mobile menu
  const burger=document.getElementById('burger'),mmenu=document.getElementById('mmenu'),scrim=document.getElementById('scrim');
  function closeMenu(){burger.classList.remove('open');mmenu.classList.remove('open');scrim.classList.remove('open')}
  if(burger){
    burger.addEventListener('click',()=>{
      const open=!mmenu.classList.contains('open');
      burger.classList.toggle('open',open);mmenu.classList.toggle('open',open);scrim.classList.toggle('open',open);
    });
    mmenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
    scrim.addEventListener('click',closeMenu);
    addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  }

  // for the curious
  console.log('%cSYNAPSE','font-size:28px;font-weight:bold;background:linear-gradient(90deg,#7c5cff,#ff4ecd);color:#fff;padding:6px 18px;border-radius:8px');
  console.log('%cyou found the basement. we keep the good weights down here. ⚡','color:#c8ff3e;font-size:13px');
