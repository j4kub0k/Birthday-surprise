// Show the surprise section. Triggered by the Unity game on victory (Phase 4).
function revealSurprise() {
  const surprise = document.getElementById('surprise');
  surprise.hidden = false;
  surprise.scrollIntoView({ behavior: 'smooth' });
}

// The Unity build will post {type: "victory"} from inside its iframe.
window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) return;
  if (event.data && event.data.type === 'victory') revealSurprise();
});

document.getElementById('fake-victory').addEventListener('click', revealSurprise);

// Dog Appreciation Corner: 10 photos (images/dog1.jpg ... dog10.jpg), shuffled with a slight random tilt.
(function buildDogGallery() {
  const gallery = document.getElementById('dog-gallery');
  const ids = Array.from({ length: 10 }, (_, i) => i + 1);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  ids.forEach((n) => {
    const img = document.createElement('img');
    img.src = 'images/dog' + n + '.jpg';
    img.alt = 'Dog photo ' + n;
    img.loading = 'lazy';
    img.style.transform = 'rotate(' + (Math.random() * 8 - 4).toFixed(1) + 'deg)';
    gallery.appendChild(img);
  });
})();

// Give every WordArt header its own random look.
(function randomiseWordArt() {
  const palettes = [
    ['#ff2d2d', '#ffcc33', '#33ff66', '#33ccff'],
    ['#ff00aa', '#ff7a00', '#ffee00', '#ffffff'],
    ['#00f5d4', '#00bbf9', '#9b5de5', '#f15bb5'],
    ['#ffffff', '#ffe066', '#ff9f1c', '#e71d36'],
    ['#b8ff3d', '#2ee6a6', '#2aa9ff', '#7b4dff'],
  ];
  const shadows = ['#ff00aa', '#00e5ff', '#ff6a00', '#7cff00', '#b100ff'];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rand = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
  document.querySelectorAll('.hero h1, .panel h2, .wordart').forEach((el) => {
    const p = pick(palettes);
    el.style.setProperty('--wa-c1', p[0]);
    el.style.setProperty('--wa-c2', p[1]);
    el.style.setProperty('--wa-c3', p[2]);
    el.style.setProperty('--wa-c4', p[3]);
    el.style.setProperty('--wa-shadow', pick(shadows));
    el.style.setProperty('--wa-rot', rand(-4, 2) + 'deg');
    el.style.setProperty('--wa-skew', rand(-9, -2) + 'deg');
  });
})();

// Flickering sparkles around headers marked with data-sparkle.
(function addSparkles() {
  const glyphs = ['\u2726', '\u2727', '\u2728', '\u2733'];
  document.querySelectorAll('[data-sparkle]').forEach((heading) => {
    const wrap = document.createElement('span');
    wrap.className = 'sparkle-wrap';
    heading.parentNode.insertBefore(wrap, heading);
    wrap.appendChild(heading);
    for (let i = 0; i < 10; i++) {
      const sp = document.createElement('span');
      sp.className = 'sparkle';
      sp.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      sp.setAttribute('aria-hidden', 'true');
      sp.style.left = (Math.random() * 100).toFixed(1) + '%';
      sp.style.top = (Math.random() * 110 - 5).toFixed(1) + '%';
      sp.style.fontSize = (0.7 + Math.random() * 1.1).toFixed(2) + 'rem';
      sp.style.setProperty('--dur', (0.8 + Math.random() * 1.4).toFixed(2) + 's');
      sp.style.setProperty('--delay', (-Math.random() * 2).toFixed(2) + 's');
      wrap.appendChild(sp);
    }
  });
})();
