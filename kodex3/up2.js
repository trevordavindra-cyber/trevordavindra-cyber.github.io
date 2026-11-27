(function(){
"use strict";
KODEX.hooks.renderAi = function(bubble, text, meta, done){
  var i = 0;
  var step = Math.max(4, Math.floor(text.length / 140));
  var timer = setInterval(function(){
    i += step;
    if (i >= text.length){
      clearInterval(timer);
      bubble.innerHTML = KODEX.renderMarkdown(text);
      if (done) done();
      return;
    }
    bubble.innerHTML = KODEX.renderMarkdown(text.slice(0, i));
    KODEX.chatEl.scrollTop = KODEX.chatEl.scrollHeight;
  }, 16);
};
})();
