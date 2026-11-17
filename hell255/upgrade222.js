/* ILLUMINATI upgrade #222: hl222-prism (v19.128)
   Syntax light for the code casement: keywords, strings, comments and numbers
   tinted inside every rendered code block. Purely visual; the code text itself
   is untouched. Guard: __HL222 */
(function () {
  if (window.__HL222) return; window.__HL222 = true;

  var CSS = '.hlc-kw{color:#f0c674}.hlc-str{color:#b5bd68}.hlc-com{color:#8a8272;font-style:italic}.hlc-num{color:#c5a3ff}.hlc-fn{color:#81a2be}';
  var st = document.createElement('style'); st.id = 'hl222-css'; st.textContent = CSS;
  (document.head || document.documentElement).appendChild(st);

  var HASH_C = 'python|ruby|perl|bash|shell|sh|yaml|yml|r';
  var KW = [
    'function|def|return|if|elif|else|for|while|import|from|as|class|var|let|const|new|try|catch|except|finally|throw|raise|async|await|yield|this|self|super|switch|case|default|break|continue|and|or|not|in|of|is|typeof|instanceof|delete|with|lambda|global|pass|do|static|get|set|public|private|protected|void|struct|enum|match|impl|fn|use|mod|pub|end|then|fi|esac|done|local',
    'true|false|null|undefined|None|True|False|nil|NaN|Infinity',
    'int|float|str|bool|list|dict|set|tuple|map|filter|print|console|log|echo|puts|println|System|out|err|require|module|exports|document|window|querySelector|getElementById|addEventListener|fetch|setTimeout|setInterval|Promise|JSON|Math|Array|Object|String|Number|Date|Error|RangeError|TypeError'
  ].join('|');

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function hi(code, lang) {
    var e = esc(code);
    var hashOk = HASH_C.split('|').indexOf(lang) > -1;
    e = e.replace(/(&lt;![\s\S]*?--&gt;|\/\*[\s\S]*?\*\/|(?:^|\n)\/\/[^\n]*)/g, '\u0001$1\u0002');
    if (hashOk) e = e.replace(/(^|\n)(#[^\n]*)/g, '$1\u0001$2\u0002');
    e = e.replace(/("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '\u0003$1\u0004');
    e = e.replace(new RegExp('\\b(' + KW + ')\\b', 'g'), '\u0005$1\u0006');
    e = e.replace(/\b(\d+(?:\.\d+)?)\b/g, '\u0007$1\u0008');
    e = e.replace(/([A-Za-z_$][\w$]*)\(/g, '\u0009$1\u000a(');
    e = e.replace(/\u0001([\s\S]*?)\u0002/g, '<span class="hlc-com">$1</span>');
    e = e.replace(/\u0003([\s\S]*?)\u0004/g, '<span class="hlc-str">$1</span>');
    e = e.replace(/\u0005([\s\S]*?)\u0006/g, '<span class="hlc-kw">$1</span>');
    e = e.replace(/\u0009([\s\S]*?)\u000a/g, '<span class="hlc-fn">$1</span>');
    e = e.replace(/\u0007([\s\S]*?)\u0008/g, '<span class="hlc-num">$1</span>');
    return e;
  }

  window.hl222light = function (lbody) {
    var blocks = lbody.querySelectorAll('pre.hlpre');
    for (var i = 0; i < blocks.length; i++) {
      var pre = blocks[i];
      if (pre.dataset.hl222 === '1') continue;
      pre.dataset.hl222 = '1';
      var lang = (pre.parentElement && pre.parentElement.dataset.hllang) || 'code';
      try { pre.innerHTML = hi(pre.textContent, lang); } catch (e2) {}
    }
  };
  try { console.log('[hl222] online: prism light on code blocks'); } catch (e) {}
})();
