/* ILLUMINATI upgrade 305 - MEMORY CAPTURE (hl305)
   Frontier directive: memory that actually builds up over time.
   When you state a durable fact about yourself in chat, it gets saved in
   this browser (localStorage) with a timestamp, and every later ask carries
   a "remembered about you" block of the latest saved facts into the model
   context. Works alongside the existing recall - nothing is removed, and
   nothing leaves the browser.
   Nothing removed.
*/
(function () {
  if (window.__HL305) return; window.__HL305 = true;

  var KEY = 'hl-mem-capture';
  var FACT = /\b(my name is|i am called|call me|i live in|my birthday is|i was born|i work (at|for)|my job is|i go to school|remember (this|that):?|my favorite|my favourite|my dog|my cat|my (mom|dad|sister|brother|wife|husband|girlfriend|boyfriend|partner) is|i have (a|an|two|three))\b/i;
  var MARK = 'REMEMBERED ABOUT YOU';

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return (arr && arr.length) ? arr : [];
    } catch (e) { return []; }
  }
  function save(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr.slice(-50))); } catch (e2) {}
  }
  function capture(text) {
    try {
      if (!text || text.length > 400 || !FACT.test(text)) return;
      var line = text.trim().slice(0, 240);
      var arr = load();
      for (var i = 0; i < arr.length; i++) { if (arr[i].t === line) return; }
      arr.push({ t: line, at: new Date().toISOString() });
      save(arr);
      try { console.log('[hl305] memory captured:', line.slice(0, 60)); } catch (e5) {}
    } catch (e3) {}
  }

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) { j = null; }
        if (j && j.messages && j.messages.length) {
          var msgs = j.messages.slice(), touched = false;
          for (var m = msgs.length - 1; m >= 0; m--) {
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string') {
              capture(msgs[m].content);
              break;
            }
          }
          var mem = load().slice(-15);
          if (mem.length) {
            var block = MARK + ' (saved in this browser, oldest first):\n';
            for (var k = 0; k < mem.length; k++) block += '- ' + mem[k].t + '\n';
            block += 'Use these facts naturally when they matter. Do not recite them back unless asked.';
            for (var s2 = 0; s2 < msgs.length; s2++) {
              if (msgs[s2] && msgs[s2].role === 'system' && typeof msgs[s2].content === 'string') {
                if (msgs[s2].content.indexOf(MARK) < 0) {
                  msgs[s2] = { role: 'system', content: msgs[s2].content + '\n\n' + block };
                  touched = true;
                }
                break;
              }
            }
            if (!touched) { msgs.unshift({ role: 'system', content: block }); touched = true; }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e4) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl305] memory capture online: durable facts you state are saved here and carried into every ask'); } catch (e6) {}
})();
