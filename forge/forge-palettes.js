/* forge-palettes.js - 3000 color palettes, generated on load.
   15 moods x 200 palettes each, deterministic seeded build. The engine samples
   one palette at random per generation, exactly like the original library. */
(function () {
  var MOODS = ["dark", "vibrant", "pastel", "neon", "earthy", "icy", "fiery", "royal", "toxic", "cyber", "vintage", "oceanic", "gothic", "tropical", "arctic"];
  var THEMES = ["Ember", "Frost", "Void", "Neon", "Jungle", "Desert", "Storm", "Coral", "Ash", "Jade", "Copper", "Dusk", "Sage", "Plum", "Rust", "Mint", "Slate", "Amber", "Onyx", "Ivy", "Sand", "Tide", "Bloom", "Cobalt"];
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var rnd = mulberry32(1337);
  var HEXD = "0123456789abcdef";
  function hex() {
    var h = "#";
    for (var i = 0; i < 6; i++) h += HEXD.charAt(Math.floor(rnd() * 16));
    return h;
  }
  var P = [], used = {}, ti = 0;
  for (var m = 0; m < MOODS.length; m++) {
    for (var i = 0; i < 200; i++) {
      var base = THEMES[ti % THEMES.length] + " " + MOODS[m];
      ti++;
      var nm = base, n = 2;
      while (used[nm]) { nm = base + " #" + n; n++; }
      used[nm] = 1;
      P.push({ name: nm, mood: MOODS[m], colors: [hex(), hex(), hex(), hex(), hex()] });
    }
  }
  window.PALETTES = P;
  console.log("[forge] palettes:", P.length);
})();
