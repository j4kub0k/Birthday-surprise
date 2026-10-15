// Dog Appreciation Corner: 7 photos (images/dog1.jpg ... dog7.jpg) scattered like prints on a table.
// Tap a photo to bring it to the front.
(function buildDogGallery() {
  const gallery = document.getElementById('dog-gallery');
  const COUNT = 7, COLS = 2, ROWS = 4;
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const rand = (min, max) => Math.random() * (max - min) + min;
  const ids = shuffle(Array.from({ length: COUNT }, (_, i) => i + 1));
  // Pick COUNT of the COLS*ROWS grid cells, so photos spread out but jitter and overlap.
  const cells = shuffle(Array.from({ length: COLS * ROWS }, (_, i) => i)).slice(0, COUNT);
  let topZ = COUNT;
  ids.forEach((n, i) => {
    const col = cells[i] % COLS, row = Math.floor(cells[i] / COLS);
    const width = rand(46, 56); // % of the gallery width
    const left = Math.min(100 - width, Math.max(0, col * (100 - width) + rand(-5, 5)));
    const top = Math.min(72, Math.max(0, row * 24 + rand(-4, 4))); // % of the gallery height
    const img = document.createElement('img');
    img.src = 'images/dog' + n + '.jpg';
    img.alt = 'Dog photo ' + n;
    img.loading = 'lazy';
    img.style.width = width.toFixed(1) + '%';
    img.style.left = left.toFixed(1) + '%';
    img.style.top = top.toFixed(1) + '%';
    img.style.zIndex = i + 1;
    img.style.setProperty('--rot', rand(-14, 14).toFixed(1) + 'deg');
    img.addEventListener('click', () => { img.style.zIndex = ++topZ; });
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

// Flickering glitter over headers marked with data-sparkle.
(function addGlitter() {
  const colours = ['#ffffff', '#fff2a8', '#ffd700', '#ff9ee6', '#8ff3ff', '#c9a7ff'];
  document.querySelectorAll('[data-sparkle]').forEach((heading) => {
    const wrap = document.createElement('span');
    wrap.className = 'glitter-wrap';
    heading.parentNode.insertBefore(wrap, heading);
    wrap.appendChild(heading);
    for (let i = 0; i < 36; i++) {
      const g = document.createElement('span');
      g.className = 'glitter';
      g.setAttribute('aria-hidden', 'true');
      g.style.left = (Math.random() * 100).toFixed(1) + '%';
      g.style.top = (Math.random() * 100).toFixed(1) + '%';
      g.style.setProperty('--size', (2 + Math.random() * 3).toFixed(1) + 'px');
      g.style.setProperty('--col', colours[Math.floor(Math.random() * colours.length)]);
      g.style.setProperty('--dur', (0.5 + Math.random() * 1.1).toFixed(2) + 's');
      g.style.setProperty('--delay', (-Math.random() * 2).toFixed(2) + 's');
      wrap.appendChild(g);
    }
  });
})();

// Movie Night Planner: read the published Google Sheet tabs (CSV) and set up the "add" buttons.
(function movieNightPlanner() {
  const cfg = window.PLANNER || {};

  // Small CSV parser that handles quoted fields, commas and newlines inside quotes.
  function parseCsv(text) {
    const rows = [];
    let row = [], field = '', quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (quoted) {
        if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (ch === '"') quoted = false;
        else field += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === ',') { row.push(field); field = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(field); field = '';
        if (row.some((f) => f.trim() !== '')) rows.push(row);
        row = [];
      } else field += ch;
    }
    row.push(field);
    if (row.some((f) => f.trim() !== '')) rows.push(row);
    return rows;
  }

  function setMessage(list, text) {
    list.innerHTML = '';
    const li = document.createElement('li');
    li.className = 'muted';
    li.textContent = text;
    list.appendChild(li);
  }

  function setButton(id, url) {
    const a = document.getElementById(id);
    if (url) a.href = url;
    else { a.classList.add('disabled'); a.removeAttribute('href'); }
  }

  async function fillList(listId, csvUrl, emptyText) {
    const list = document.getElementById(listId);
    if (!csvUrl) { setMessage(list, 'Not connected yet.'); return; }
    try {
      const res = await fetch(csvUrl);
      if (!res.ok) { setMessage(list, 'Could not load the list (Google answered ' + res.status + '). Is the tab published as CSV?'); return; }
      const text = await res.text();
      if (/^\s*</.test(text)) { setMessage(list, 'That link is a web page, not CSV. Re-publish the tab as "Comma-separated values (.csv)".'); return; }
      const rows = parseCsv(text).slice(1).reverse(); // drop header, newest first
      if (!rows.length) { setMessage(list, emptyText); return; }
      list.innerHTML = '';
      rows.forEach((r) => {
        const title = (r[1] || '').trim();
        if (!title) return;
        const li = document.createElement('li');
        li.textContent = title;
        const details = r.slice(2).map((x) => x.trim()).filter(Boolean).join(' \u00B7 ');
        if (details) {
          const small = document.createElement('small');
          small.textContent = details;
          li.appendChild(small);
        }
        list.appendChild(li);
      });
      if (!list.children.length) setMessage(list, emptyText);
    } catch (e) {
      console.error('Planner: failed to load', csvUrl, e);
      setMessage(list, 'Could not reach Google (network or blocked). Try reloading.');
    }
  }

  setButton('add-movie', cfg.moviesFormUrl);
  setButton('add-date', cfg.datesFormUrl);
  fillList('movie-list', cfg.moviesCsvUrl, 'No movies yet. Add the first one!');
  fillList('date-list', cfg.datesCsvUrl, 'No dates yet. Add one!');
})();
