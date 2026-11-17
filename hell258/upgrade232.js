/* ILLUMINATI upgrade #232: hl232-autodrive2 (v19.131)
   THE ASK: the AI can work autonomously. AUTO drive v2, rebuilt on DOM seams
   (the engine is a module, so its functions are not reachable from here):
   arm AUTO, send it a task, and it keeps working step by step on its own —
   each step a real reply through the normal send path (omni/horde/relay,
   reasoning, stripper, memory, REA all unchanged) — until it reports TASK
   COMPLETE, pauses to ask you something, or you stop it. Caps: 6 steps per
   run, 8 minutes. Controls: AUTO pill next to SEND (tap = arm / stop /
   resume), /auto on|off, or the STOP button. Off by default. Guard: __HL232 */
(function () {
  if (window.__HL232) return; window.__HL232 = true;

  var MAX = 6, DEADLINE = 8 * 60 * 1000;
  var run = { active: false, step: 0, deadline: 0 };
  var armed = false;
  try { armed = localStorage.getItem('hl232-auto') === '1'; } catch (e) {}
  var lastUser = '', inflight = false, pill = null;

  function $(id) { return document.getElementById(id); }

  function doLine(cls, text) {
    try {
      var chat = $('chat'); if (!chat) return;
      var d = document.createElement('div'); d.className = 'line ' + cls;
      var hd = document.createElement('div'); hd.className = 'lhead';
      var tm = '';
      try { tm = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); } catch (e2) {}
      hd.innerHTML = '<span class="lwho">GATE</span><span class="lt">' + tm + '</span>';
      d.appendChild(hd);
      var bd = document.createElement('div'); bd.className = 'lbody'; bd.textContent = text;
      d.appendChild(bd); chat.appendChild(d);
      try { chat.scrollTop = chat.scrollHeight; } catch (e3) {}
    } catch (e) {}
  }

  function lastAI() {
    try {
      var ls = document.querySelectorAll('#chat .line.imp');
      if (ls.length) { var b = ls[ls.length - 1].querySelector('.lbody') || ls[ls.length - 1]; return (b.textContent || '').trim(); }
    } catch (e) {}
    return '';
  }

  function busy() {
    var st = $('st-state'); if (!st) return true;
    var t = (st.textContent || '').toUpperCase();
    return t.indexOf('WORKING') >= 0 || t.indexOf('FORGING') >= 0;
  }

  function paint() {
    if (!pill) return;
    try {
      if (run.active) { pill.textContent = 'AUTO ' + run.step + '/' + MAX; pill.style.color = '#ff8a3d'; pill.style.borderColor = '#ff8a3d'; }
      else if (armed) { pill.textContent = 'AUTO'; pill.style.color = '#3ddc84'; pill.style.borderColor = '#3ddc84'; }
      else { pill.textContent = 'AUTO'; pill.style.color = '#8b8b96'; pill.style.borderColor = '#26262e'; }
    } catch (e) {}
  }

  function stopRun(reason) {
    if (!run.active) { paint(); return; }
    run.active = false; paint();
    doLine('omen', 'AUTO stopped' + (reason ? ' — ' + reason : '') + ' after ' + run.step + ' step' + (run.step === 1 ? '' : 's') + '.');
  }

  function waitReply(cb) {
    var sawBusy = busy(), n = 0;
    (function tick() {
      if (!run.active) return;
      var b = busy();
      if (b) sawBusy = true;
      n++;
      if (sawBusy && !b) { setTimeout(cb, 1500); return; }
      if (n > 200) { stopRun('timed out waiting for the relay'); return; }
      setTimeout(tick, 1500);
    })();
  }

  function stepSend() {
    var t = $('txt'), sb = $('send');
    if (!t || !sb) { stopRun('composer missing'); return; }
    t.value = 'AUTO STEP ' + (run.step + 1) + '/' + MAX + ': continue working my last task on your own. Do the next concrete step right now and show the real output. When the whole task is finished, end your reply with the line TASK COMPLETE. If you are truly blocked, end with the line AUTO BLOCKED and say what you need.';
    sb.click();
  }

  function loop() {
    if (!run.active) return;
    waitReply(function () {
      if (!run.active) return;
      var a = lastAI();
      if (!a || a.indexOf('(static') === 0) { stopRun('nothing came back from the relay'); return; }
      if (/TASK COMPLETE/i.test(a)) { run.active = false; paint(); doLine('omen', 'AUTO: task complete in ' + run.step + ' step' + (run.step === 1 ? '' : 's') + '.'); return; }
      if (/AUTO BLOCKED/i.test(a)) { run.active = false; paint(); doLine('omen', 'AUTO paused — it needs something from you. tap AUTO to resume.'); return; }
      if (a.charAt(a.length - 1) === '?') { run.active = false; paint(); doLine('omen', 'AUTO paused — it asked you something. tap AUTO to resume after you answer.'); return; }
      if (run.step >= MAX) { stopRun('step cap reached — tap AUTO to continue the run'); return; }
      run.step++; paint();
      doLine('omen', 'AUTO step ' + run.step + '/' + MAX);
      stepSend();
      setTimeout(loop, 4000);
    });
  }

  function maybeStart() {
    if (inflight) return;
    inflight = true;
    setTimeout(function () {
      inflight = false;
      if (!armed || run.active) return;
      var u = (lastUser || '').trim();
      if (u.length < 4 || u.charAt(0) === '/' || u.charAt(u.length - 1) === '?') return;
      run = { active: true, step: 0, deadline: Date.now() + DEADLINE };
      paint();
      doLine('omen', 'AUTO engaged — it works this on its own until done, up to ' + MAX + ' steps.');
      loop();
    }, 80);
  }

  function cmd(v) {
    var m = /^\/auto\b\s*(on|off)?/i.exec(v);
    if (!m) return false;
    var a = (m[1] || '').toLowerCase();
    if (a === 'on') armed = true;
    else if (a === 'off') { armed = false; stopRun('turned off'); }
    else armed = !armed;
    try { localStorage.setItem('hl232-auto', armed ? '1' : '0'); } catch (e2) {}
    paint();
    doLine('omen', armed ? 'AUTO armed. send a task and it works it on its own until done or stopped.' : 'AUTO off.');
    return true;
  }

  document.addEventListener('keydown', function (e) {
    try {
      if (e.key !== 'Enter' || e.shiftKey) return;
      var t = e.target;
      if (!t || t.id !== 'txt') return;
      var v = (t.value || '').trim();
      if (v && v.charAt(0) === '/') {
        if (cmd(v)) { t.value = ''; e.preventDefault(); e.stopImmediatePropagation(); }
      } else if (v) { lastUser = v; maybeStart(); }
    } catch (e2) {}
  }, true);

  function buildPill() {
    var sb = $('send');
    if (!sb || !sb.parentNode) return;
    var ex = $('autodrive');
    if (ex) { if (pill !== ex) { pill = ex; paint(); } return; }
    pill = document.createElement('button');
    pill.id = 'autodrive'; pill.type = 'button'; pill.textContent = 'AUTO';
    pill.title = 'AUTO drive: the ai works your task on its own';
    pill.style.cssText = 'font:inherit;font-size:11px;letter-spacing:1.5px;border-radius:9px;border:1px solid #26262e;background:#16161c;color:#8b8b96;padding:9px 12px;margin:0 8px 0 0;cursor:pointer;flex:0 0 auto;';
    sb.parentNode.insertBefore(pill, sb);
    pill.addEventListener('click', function () {
      try {
        if (run.active) { stopRun('stopped by operator'); return; }
        if (!armed) { armed = true; try { localStorage.setItem('hl232-auto', '1'); } catch (e2) {} paint(); doLine('omen', 'AUTO armed. send a task and it works it on its own until done or you stop it.'); return; }
        var a = lastAI();
        if (!a) { doLine('omen', 'AUTO is armed but there is nothing to continue yet. send a task.'); return; }
        run = { active: true, step: 0, deadline: Date.now() + DEADLINE };
        paint(); doLine('omen', 'AUTO resumed.'); loop();
      } catch (e3) {}
    });
    if (!sb._hl232cap) {
      sb._hl232cap = true;
      sb.parentNode.addEventListener('click', function () {
        try {
          var t = $('txt'); var v = (t && t.value || '').trim();
          if (v && v.charAt(0) === '/') { if (cmd(v)) { t.value = ''; } }
          else if (v) { lastUser = v; maybeStart(); }
        } catch (e4) {}
      }, true);
    }
    paint();
  }
  buildPill();
  try { new MutationObserver(function () { if (!document.getElementById('autodrive')) buildPill(); }).observe(document.body, { childList: true, subtree: true }); } catch (e) { setInterval(buildPill, 2000); }

  try {
    var st = $('stop');
    if (st) st.addEventListener('click', function () { try { stopRun('stopped by operator'); } catch (e2) {} });
  } catch (e) {}

  console.log('[hl232] online: AUTO drive v2 (pill by SEND, /auto on|off, STOP cuts the run; 6 steps / 8 min caps)');
})();