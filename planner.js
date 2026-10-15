// Dog Appreciation Corner: 7 photos (images/dog1.jpg ... dog7.jpg). Each time the corner is opened they are
// placed again at random in a 2-column grid without overlapping (one photo is centred in a middle row), slightly tilted, and can be
// dragged anywhere in the box.
(function dogGallery() {
  const gallery = document.getElementById('dog-gallery');
  const details = gallery.closest('details');
  const COUNT = 7, COLS = 2, ROWS = 4;
  const WIDTH = 42; // photo width, % of the gallery width (gallery height is 2x its width)
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const rand = (min, max) => Math.random() * (max - min) + min;
  // Lay the photos out again at random; runs on page load and every time the corner is opened.
  function layout() {
    gallery.innerHTML = '';
    const ids = shuffle(Array.from({ length: COUNT }, (_, i) => i + 1));
    // 4 rows: pairs in three of them and one photo centred in a middle row (row 1 or 2), so nothing looks missing.
    const soloRow = 1 + Math.floor(Math.random() * 2);
    const slots = [];
    for (let row = 0; row < ROWS; row++) {
      if (row === soloRow) slots.push({ row, x: (100 - WIDTH) / 2 });
      else for (let col = 0; col < COLS; col++) slots.push({ row, x: col * 50 + (50 - WIDTH) / 2 });
    }
    let topZ = COUNT;

    ids.forEach((n, i) => {
      const slot = slots[i];
      const img = document.createElement('img');
      img.src = 'images/dog' + n + '.jpg';
      img.alt = 'Dog photo ' + n;
      img.draggable = false;
      img.style.width = WIDTH + '%';
      img.style.left = (slot.x + rand(-1.5, 1.5)).toFixed(1) + '%';
      img.style.top = (slot.row * 25 + (25 - WIDTH / 2) / 2 + rand(-1, 1)).toFixed(1) + '%';
      img.style.zIndex = i + 1;
      img.style.setProperty('--rot', rand(-6, 6).toFixed(1) + 'deg');

      let dx = 0, dy = 0;
      img.addEventListener('pointerdown', (e) => {
        const g = gallery.getBoundingClientRect(), r = img.getBoundingClientRect();
        dx = e.clientX - r.left;
        dy = e.clientY - r.top;
        img.setPointerCapture(e.pointerId);
        img.classList.add('dragging');
        img.style.zIndex = ++topZ;
      });
      img.addEventListener('pointermove', (e) => {
        if (!img.classList.contains('dragging')) return;
        const g = gallery.getBoundingClientRect();
        // the on-screen box is slightly bigger than the layout box because of the tilt; use the layout size
        const w = img.offsetWidth, h = img.offsetHeight;
        const x = Math.min(Math.max(e.clientX - g.left - dx - (img.getBoundingClientRect().width - w) / 2, 0), g.width - w);
        const y = Math.min(Math.max(e.clientY - g.top - dy - (img.getBoundingClientRect().height - h) / 2, 0), g.height - h);
        img.style.left = (x / g.width * 100).toFixed(2) + '%';
        img.style.top = (y / g.height * 100).toFixed(2) + '%';
      });
      const drop = () => img.classList.remove('dragging');
      img.addEventListener('pointerup', drop);
      img.addEventListener('pointercancel', drop);
      gallery.appendChild(img);
    });
  }

  layout();
  if (details) details.addEventListener('toggle', () => { if (details.open) layout(); });
})();

// Give every WordArt header its own random look.
(function randomiseWordArt() {
  // [top, upper, horizon (dark band), lower] stops for a chrome-style gradient
  const palettes = [
    ['#ffffff', '#b8c4ff', '#2a2f8f', '#e6ccff'], // silver chrome
    ['#ffffff', '#ffb3f0', '#7a2cc4', '#9ff3ff'], // holographic pink
    ['#ffffff', '#a6f0ff', '#1a5fb0', '#e0e8ff'], // ice
    ['#faffd6', '#d4ff3d', '#2d5a00', '#f0ffb0'], // acid lime
    ['#ffffff', '#ffd1b0', '#b03a8a', '#ffe9a8'], // peach
  ];
  const shadows = ['#ff4de1', '#4de1ff', '#b58cff', '#c6ff00', '#ffffff'];
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

  // "NEW" badges: remember which entries were on the list when the page was last left, per device.
  const SEEN_PREFIX = 'planner-seen-';
  const currentKeys = {}; // listId -> keys of the entries on screen now
  function readSeen(listId) {
    try {
      const raw = localStorage.getItem(SEEN_PREFIX + listId);
      return raw === null ? null : JSON.parse(raw); // null = first visit: nothing counts as new
    } catch (e) { return null; }
  }
  function saveSeen() {
    try {
      Object.keys(currentKeys).forEach((id) => localStorage.setItem(SEEN_PREFIX + id, JSON.stringify(currentKeys[id])));
    } catch (e) { /* storage blocked: badges simply never show */ }
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveSeen(); });
  window.addEventListener('pagehide', saveSeen);

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
      const seen = readSeen(listId);
      let keptNew = [];
      try { keptNew = JSON.parse(sessionStorage.getItem(SEEN_PREFIX + 'new-' + listId) || '[]'); } catch (e) { /* ignore */ }
      const newKeys = [];
      currentKeys[listId] = [];
      rows.forEach((r) => {
        const title = (r[1] || '').trim();
        if (!title) return;
        const key = r.join('|');
        currentKeys[listId].push(key);
        const li = document.createElement('li');
        li.textContent = title;
        if ((seen && !seen.includes(key)) || keptNew.includes(key)) {
          newKeys.push(key);
          const badge = document.createElement('span');
          badge.className = 'new-badge';
          badge.textContent = 'NEW';
          li.appendChild(badge);
        }
        const details = r.slice(2).map((x) => x.trim()).filter(Boolean).join(' \u00B7 ');
        if (details) {
          const small = document.createElement('small');
          small.textContent = details;
          li.appendChild(small);
        }
        list.appendChild(li);
      });
      try { sessionStorage.setItem(SEEN_PREFIX + 'new-' + listId, JSON.stringify(newKeys)); } catch (e) { /* ignore */ }
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
