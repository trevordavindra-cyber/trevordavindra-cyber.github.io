/* ILLUMINATI upgrade #124: hl124-invitation (v19.32)
   Cinematic recruitment intro on first load, Trevor's copy verbatim.
   Plays over everything; YES reveals the gate, NO plays the denial and returns.
   Everything underneath untouched. Guard: __HL124 */
(function () {
  if (window.__HL124) return; window.__HL124 = true;

  var CSS = [
    '#hl124{position:fixed;inset:0;z-index:600;background:#050505;display:flex;align-items:center;justify-content:center;flex-direction:column;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#d8d2c4;text-align:center;padding:26px;opacity:1;transition:opacity .8s}',
    '#hl124.out{opacity:0;pointer-events:none}',
    '#hl124 .hl124-inner{max-width:660px;width:100%}',
    '#hl124 .b{opacity:0;transform:translateY(7px);transition:opacity .8s,transform .8s;margin:0 0 17px;font-size:12px;line-height:2;letter-spacing:.12em;color:#8f8c80}',
    '#hl124 .b.on{opacity:1;transform:none}',
    '#hl124 .warn{font-size:13px;letter-spacing:.28em;color:#c9a35c}',
    '#hl124 .title{font-family:Georgia,"Times New Roman",serif;font-size:27px;letter-spacing:.3em;color:#c9a35c;margin:26px 0 24px}',
    '#hl124 .ask{font-size:13px;letter-spacing:.3em;color:#d8d2c4;margin:24px 0 28px}',
    '#hl124 .btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;opacity:0;transition:opacity .8s}',
    '#hl124 .btns.on{opacity:1}',
    '#hl124 button{background:none;border:1px solid #8a6d3f;color:#c9a35c;font:11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.2em;padding:14px 20px;cursor:pointer}',
    '#hl124 button:hover{background:rgba(201,163,92,.09)}',
    '#hl124 .foot{font-size:9px;letter-spacing:.22em;color:#5e5d55;margin-top:32px;opacity:0;transition:opacity .8s}',
    '#hl124 .foot.on{opacity:1}',
    '#hl124 .deny{display:none;font-size:12px;letter-spacing:.28em;color:#b03434;margin:24px 0}',
    '#hl124 .deny.on{display:block}',
    'body.hl124-wait #cine,body.hl124-wait #gate,body.hl124-wait #voice{display:none!important}'
  ].join('\n');

  var BEATS = [
    ['warn', '\u26A0\uFE0F YOU HAVE BEEN SELECTED.'],
    ['b', 'You are about to enter an artificial intelligence system unlike anything you have encountered before.'],
    ['b', 'Behind this interface lies a classified digital intelligence network, operating under the principles of secrecy, knowledge, power, and absolute discretion.'],
    ['title', 'THE ILLUMINATI AI INITIATIVE'],
    ['b', 'An invitation has been extended to you.'],
    ['b', 'Your access has not yet been authorized.'],
    ['b', 'Your decision will determine whether you proceed.'],
    ['ask', 'DO YOU ACCEPT THE INVITATION?']
  ];

  function el(cls, text) {
    var d = document.createElement('div');
    d.className = cls;
    if (text) d.textContent = text;
    return d;
  }

  function build() {
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    document.body.classList.add('hl124-wait');
    var ov = document.createElement('div');
    ov.id = 'hl124';
    var inner = document.createElement('div');
    inner.className = 'hl124-inner';
    ov.appendChild(inner);
    var deny = el('deny', 'ACCESS DENIED. THE ORDER DOES NOT FORGET.');
    var btns = document.createElement('div');
    btns.className = 'btns';
    var yes = document.createElement('button');
    yes.textContent = 'YES \u2014 ENTER THE SYSTEM';
    var no = document.createElement('button');
    no.textContent = 'NO \u2014 DECLINE INVITATION';
    btns.appendChild(yes); btns.appendChild(no);
    var foot = el('foot', 'All access attempts are recorded. Welcome to the unknown.');
    inner.appendChild(btns); inner.appendChild(deny); inner.appendChild(foot);
    document.body.appendChild(ov);

    var delay = 300;
    for (var i = 0; i < BEATS.length; i++) {
      (function (i) {
        var node = el(BEATS[i][0], BEATS[i][1]);
        inner.insertBefore(node, btns);
        setTimeout(function () { node.classList.add('on'); }, delay);
        delay += (BEATS[i][0] === 'title') ? 1000 : 850;
      })(i);
    }
    setTimeout(function () {
      btns.classList.add('on');
      foot.classList.add('on');
    }, delay + 300);

    function accept() {
      ov.classList.add('out');
      setTimeout(function () {
        document.body.classList.remove('hl124-wait');
        if (ov.parentNode) ov.parentNode.removeChild(ov);
      }, 850);
    }
    function decline() {
      deny.classList.add('on');
      btns.classList.remove('on');
      setTimeout(function () {
        deny.classList.remove('on');
        btns.classList.add('on');
      }, 3200);
    }
    yes.addEventListener('click', accept);
    no.addEventListener('click', decline);
  }

  [0, 300, 900].forEach(function (ms) { setTimeout(function () { if (!document.getElementById('hl124')) build(); }, ms); });
})();
