/* ILLUMINATI upgrade #230: hl230-autodrive (v19.130)
   THE ASK: the AI can work autonomously. AUTO drive: send it a task and it
   keeps working step by step on its own — each step a real reply through the
   normal send path (omni / horde / relay, reasoning, stripper, memory, REA
   all unchanged) — until it reports TASK COMPLETE, pauses to ask you
   something, or you stop it. Caps: 6 steps per run, 8 minutes, and every
   step is visible in chat. Controls: the AUTO pill next to SEND (tap =
   arm / stop / resume), /auto on|off, or the engine STOP button. Off by
   default; your normal sends behave exactly as before. Everything existing
   stays. Guard: __HL230 */
(function () {
  if (window.__HL230) return; window.__HL230 = true;

  var MAX = 6, DEADLINE = 8 * 60 * 1000;
  var run = { active: false, step: 0, deadline: 0 };
  var CONT = "You are running in AUTO mode, working the user's last task on your own. Do the next concrete step of that task right now and show the real output; no permission-asking preamble. Do not ask the user anything unless you are truly blocked; if you are blocked, end your reply with the line AUTO BLOCKED and say what you need. When the whole task is finished, end your reply with the line TASK COMPLETE";

  function say(c, t) { try { line(c, t); } catch (e) {} }
  function note(k, a, b) { try { notice(k, a, b); } catch (e) {} }
  function log(t) { try { feed(t, 'live'); } catch (e) {} }
  function lastAnswer() {
    try { for (var i = hist.length - 1; i >= 0; i--) { if (hist[i] && hist[i].role === 'assistant') return hist[i].content || ''; } } catch (e) {}
    return '';
  }

  var pill = null;
  function paintPill() {
    if (!pill) return;
    try {
      if (run.active) { pill.textContent = 'AUTO ' + run.step + '/' + MAX; pill.style.color = '#ff8a3d'; pill.style.borderColor = '#ff8a3d'; }
      else if (S.auto) { pill.textContent = 'AUTO'; pill.style.color = '#3ddc84'; pill.style.borderColor = '#3ddc84'; }
      else { pill.textContent = 'AUTO'; pill.style.color = '#8b8b96'; pill.style.borderColor = '#26262e'; }
    } catch (e) {}
  }

  function stopRun(reason) {
    if (!run.active) { paintPill(); return; }
    run.active = false; paintPill();
    say('omen', 'AUTO stopped' + (reason ? ' — ' + reason : '') + ' after ' + run.step + ' step' + (run.step === 1 ? '' : 's') + '.');
    log('AUTO DRIVE STOPPED');
  }

  async function loop() {
    while (run.active) {
      if (Date.now() > run.deadline) { stopRun('time cap reached'); return; }
      var a = lastAnswer().trim();
      if (!a || a === '(static — nothing came back)') { stopRun('nothing came back from the relay'); return; }
      if (/TASK COMPLETE/i.test(a)) { run.active = false; paintPill(); say('omen', 'AUTO: task complete in ' + run.step + ' step' + (run.step === 1 ? '' : 's') + '.'); log('AUTO TASK COMPLETE'); return; }
      if (/AUTO BLOCKED/i.test(a)) { run.active = false; paintPill(); say('omen', 'AUTO paused — it needs something from you, check the last reply. tap AUTO to resume.'); return; }
      if (a.charAt(a.length - 1) === '?') { run.active = false; paintPill(); say('omen', 'AUTO paused — it asked you something. tap AUTO to resume once you have answered.'); return; }
      if (run.step >= MAX) { stopRun('step cap reached — tap AUTO to continue the run'); return; }
      run.step++; paintPill();
      log('AUTO STEP ' + run.step + '/' + MAX);
      try { await origSend(CONT + ' (step ' + run.step + ' of ' + MAX + ').', true); }
      catch (e) { stopRun('the relay cut out'); return; }
      if (aborted) { stopRun('transmission cut'); return; }
    }
  }

  var origSend = null;
  try { origSend = window.sendQuery; } catch (e) {}
  if (typeof origSend !== 'function') { log('HL230 SEND SEAM MISSING'); return; }

  window.sendQuery = function (u, isRegen) {
    var p = origSend.apply(this, arguments);
    try {
      if (typeof u === 'string' && !isRegen && S.auto && !run.active) {
        var t = u.trim();
        if (t.length > 3 && t.charAt(0) !== '/' && t.charAt(t.length - 1) !== '?') {
          run = { active: true, step: 0, deadline: Date.now() + DEADLINE };
          paintPill();
          say('omen', 'AUTO engaged on: ' + (t.length > 70 ? t.slice(0, 70) + '…' : t) + ' — it works this on its own until done, up to ' + MAX + ' steps.');
          note('ok', 'AI CORE', 'auto drive engaged');
          return p.then(function () { if (run.active) return loop(); });
        }
      }
    } catch (e) {}
    return p;
  };

  function buildPill() {
    try {
      var sb = document.getElementById('send');
      if (!sb || !sb.parentNode) return;
      var ex = document.getElementById('autodrive');
      if (ex) { pill = ex; paintPill(); return; }
      pill = document.createElement('button');
      pill.id = 'autodrive';
      pill.type = 'button';
      pill.textContent = 'AUTO';
      pill.title = 'AUTO drive: the ai works your task on its own';
      pill.style.cssText = 'font:inherit;font-size:11px;letter-spacing:1.5px;border-radius:9px;border:1px solid #26262e;background:#16161c;color:#8b8b96;padding:9px 12px;margin:0 8px 0 0;cursor:pointer;flex:0 0 auto;';
      sb.parentNode.insertBefore(pill, sb);
      pill.addEventListener('click', function () {
        try {
          if (run.active) { stopRun('stopped by operator'); return; }
          if (!S.auto) { S.auto = 1; saveS(); paintPill(); say('omen', 'AUTO armed. send it a task and it keeps working on its own until done or you stop it.'); note('ok', 'AI CORE', 'auto drive armed'); try { beep(700, .06); } catch (e2) {} return; }
          var a = lastAnswer().trim();
          if (!a) { say('omen', 'AUTO is armed but there is nothing to continue yet. send a task.'); return; }
          run = { active: true, step: 0, deadline: Date.now() + DEADLINE };
          paintPill(); say('omen', 'AUTO resumed.'); loop();
        } catch (e) {}
      });
      paintPill();
    } catch (e) {}
  }
  buildPill();
  try { new MutationObserver(function () { if (!document.getElementById('autodrive')) buildPill(); }).observe(document.body, { childList: true, subtree: true }); } catch (e) { setInterval(buildPill, 2000); }

  try {
    var sb2 = document.getElementById('stop');
    if (sb2) {
      var oldStop = sb2.onclick;
      sb2.onclick = function () {
        stopRun('stopped by operator');
        if (oldStop) return oldStop.apply(this, arguments);
      };
    }
  } catch (e) {}

  try {
    CMDS.auto = 'AUTO drive: the ai works your task on its own (/auto on|off)';
    var orc = window.runCmd;
    if (typeof orc === 'function') {
      window.runCmd = function (raw) {
        try {
          var m = /^\/auto\b\s*(on|off)?/i.exec(raw || '');
          if (m) {
            try { cmdHist.push(raw); cmdIdx = cmdHist.length; } catch (e2) {}
            var v = (m[1] || '').toLowerCase();
            if (v === 'on') { S.auto = 1; saveS(); paintPill(); say('omen', 'AUTO armed. send a task and it works it on its own until done or stopped.'); }
            else if (v === 'off') { S.auto = 0; stopRun('turned off'); saveS(); paintPill(); say('omen', 'AUTO off.'); }
            else { S.auto = S.auto ? 0 : 1; saveS(); paintPill(); say('omen', S.auto ? 'AUTO armed.' : 'AUTO off.'); }
            note('ok', 'AI CORE', 'auto drive ' + (S.auto ? 'on' : 'off'));
            log('CMD EXECUTED :: ' + raw);
            return;
          }
        } catch (e) {}
        return orc.apply(this, arguments);
      };
    }
  } catch (e) {}

  console.log('[hl230] online: AUTO drive (pill by SEND, /auto on|off, STOP cuts the run; 6 steps / 8 min caps)');
})();