// Big blocky pixel title: draws the h1 text from a 5x7 pixel font as SVG (no font download needed).
(function pixelTitle() {
  const h1 = document.querySelector('h1.pixel-title');
  if (!h1) return;
  const FONT = {
    M: ['X...X', 'XX.XX', 'X.X.X', 'X.X.X', 'X...X', 'X...X', 'X...X'],
    O: ['.XXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.XXX.'],
    V: ['X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.X.X.', '..X..'],
    I: ['XXXXX', '..X..', '..X..', '..X..', '..X..', '..X..', 'XXXXX'],
    E: ['XXXXX', 'X....', 'X....', 'XXXX.', 'X....', 'X....', 'XXXXX'],
    N: ['X...X', 'XX..X', 'X.X.X', 'X..XX', 'X...X', 'X...X', 'X...X'],
    G: ['.XXX.', 'X...X', 'X....', 'X.XXX', 'X...X', 'X...X', '.XXX.'],
    H: ['X...X', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X'],
    T: ['XXXXX', '..X..', '..X..', '..X..', '..X..', '..X..', '..X..'],
  };
  const words = h1.textContent.trim().toUpperCase().split(/\s+/);
  if (!words.every((w) => [...w].every((c) => FONT[c]))) return; // unknown letter: keep plain text
  const NS = 'http://www.w3.org/2000/svg';
  const width = Math.max(...words.map((w) => w.length * 6 - 1));
  const height = words.length * 8 - 1;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + (width + 1) + ' ' + (height + 1));
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('shape-rendering', 'crispEdges');
  const shadow = document.createElementNS(NS, 'g');
  const front = document.createElementNS(NS, 'g');
  shadow.setAttribute('fill', '#1f3fff');
  shadow.setAttribute('transform', 'translate(0.45 0.45)');
  front.setAttribute('fill', '#ffffff');
  const rect = (parent, x, y) => {
    const r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', 1.02); r.setAttribute('height', 1.02);
    parent.appendChild(r);
  };
  const filled = [];
  words.forEach((word, row) => {
    [...word].forEach((ch, i) => {
      FONT[ch].forEach((line, y) => {
        [...line].forEach((cell, x) => {
          if (cell !== 'X') return;
          rect(shadow, i * 6 + x, row * 8 + y);
          rect(front, i * 6 + x, row * 8 + y);
          filled.push([i * 6 + x, row * 8 + y]);
        });
      });
    });
  });
  svg.appendChild(shadow);
  svg.appendChild(front);
  // a few lime "glitch" pixels that blink on top of the letters themselves
  const glitch = document.createElementNS(NS, 'g');
  glitch.setAttribute('fill', '#c6ff00');
  for (let i = 0; i < 7; i++) {
    const r = document.createElementNS(NS, 'rect');
    const cell = filled[Math.floor(Math.random() * filled.length)];
    r.setAttribute('x', cell[0]);
    r.setAttribute('y', cell[1]);
    r.setAttribute('width', 1.02); r.setAttribute('height', 1.02);
    r.setAttribute('class', 'glitch-px');
    r.style.animationDelay = (-Math.random() * 3).toFixed(2) + 's';
    r.style.animationDuration = (1.2 + Math.random() * 1.6).toFixed(2) + 's';
    glitch.appendChild(r);
  }
  svg.appendChild(glitch);
  h1.setAttribute('aria-label', h1.textContent.trim());
  h1.textContent = '';
  h1.appendChild(svg);
})();

// Dog Appreciation Corner ("TARA", a DOGEMA film): the photos images/dog1.jpg, dog2.jpg, ... (up to dog12.jpg, found
// automatically) as frames on movie film strips. Each row of the board is a strip of film; the photos can be dragged
// out of it and placed anywhere. The layout is redone at random every time the corner is opened.
(function dogGallery() {
  const gallery = document.getElementById('dog-gallery');
  const details = gallery.closest('details');
  const MAX = 12, COLS = 2;
  const WIDTH = 36;                   // photo width, % of the board width (a photo is 4:5)
  const EDGE = 20;                    // px of film edge (sprocket holes + edge print) above and below a photo
  const FRAMES = ['2A', '3', '3A', '4', '4A', '5', '5A'];
  const WORDS = ['STARRING TARA', 'GOOD DOG', 'BEST FRIEND', 'PURE JOY', '10/10', 'NOW SHOWING', 'SOLD OUT'];
  const NS = 'http://www.w3.org/2000/svg';
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };
  // A film reel drawn in SVG: rim, six windows and a hub.
  function reel(cls) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', 'reel ' + cls);
    svg.setAttribute('aria-hidden', 'true');
    const add = (tag, attrs) => {
      const e = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach((k) => e.setAttribute(k, attrs[k]));
      svg.appendChild(e);
    };
    add('circle', { cx: 50, cy: 50, r: 48, fill: '#0b0b0b', stroke: '#c6ff00', 'stroke-width': 2.5 });
    for (let k = 0; k < 6; k++) {
      const ang = (k * 60) * Math.PI / 180;
      add('circle', { cx: (50 + 28 * Math.cos(ang)).toFixed(2), cy: (50 + 28 * Math.sin(ang)).toFixed(2), r: 11, fill: '#060606', stroke: '#c6ff00', 'stroke-width': 2 });
    }
    add('circle', { cx: 50, cy: 50, r: 9, fill: '#c6ff00' });
    add('circle', { cx: 50, cy: 50, r: 3.5, fill: '#0b0b0b' });
    return svg;
  }

  // Which photos exist? Try dog1.jpg ... dog12.jpg once and keep the ones that load.
  const ready = Promise.all(Array.from({ length: MAX }, (_, i) => new Promise((resolve) => {
    const probe = new Image();
    probe.onload = () => resolve(i + 1);
    probe.onerror = () => resolve(0);
    probe.src = 'images/dog' + (i + 1) + '.jpg';
  }))).then((found) => found.filter(Boolean));

  // Lay everything out again at random; runs when the corner is opened.
  function layout(available) {
    gallery.innerHTML = '';
    const COUNT = available.length;
    if (!COUNT) { gallery.appendChild(el('p', 'hud-empty', 'NO FRAMES LOADED YET')); return; }
    const ROWS = Math.ceil(COUNT / COLS);
    // the board grows with the number of rows; sizes below are percentages of its height
    const ASPECT = 0.675 * ROWS;                  // board height / board width
    const PHOTO_H = WIDTH * 1.25 / ASPECT;        // photo height, % of the board height
    const TOP = 29.7 / ASPECT, SLOT = 60 / ASPECT; // first strip row starts at TOP %, each row is SLOT % tall
    gallery.style.aspectRatio = '1 / ' + ASPECT.toFixed(3);
    gallery.style.setProperty('--scn', '"SCN_' + String(COUNT).padStart(2, '0') + '"');
    const ids = shuffle(available.slice());
    // with an odd number of photos one is centred in a middle row, so nothing looks missing
    const odd = COUNT % 2 === 1;
    const soloRow = odd ? Math.min(ROWS - 2, 1 + Math.floor(Math.random() * Math.max(1, ROWS - 2))) : -1;
    const slots = [];
    for (let row = 0; row < ROWS; row++) {
      if (row === soloRow) slots.push({ row, x: (100 - WIDTH) / 2 });
      else for (let col = 0; col < COLS && slots.length < COUNT; col++) slots.push({ row, x: col * 50 + (50 - WIDTH) / 2 });
    }

    // reels peeking in from the corners, under the film
    gallery.append(reel('reel-a'), reel('reel-b'));

    // the film strips: one per row
    for (let row = 0; row < ROWS; row++) {
      const strip = el('div', 'strip');
      strip.style.top = 'calc(' + (TOP + row * SLOT).toFixed(2) + '% - ' + EDGE + 'px)';
      strip.style.height = 'calc(' + PHOTO_H.toFixed(2) + '% + ' + (EDGE * 2) + 'px)';
      strip.appendChild(el('span', 'strip-text', ('TARA 400 \u25B7 ' + (row * 2 + 1) + ' \u25B7 ' + (row * 2 + 1) + 'A \u25B7 ').repeat(6)));
      gallery.appendChild(strip);
    }

    // some frames look like old black-and-white film, one is warm sepia
    const base = ['color', 'color', 'color', 'color', 'bw', 'bw', 'sepia'];
    const looks = shuffle(Array.from({ length: COUNT }, (_, i) => base[i % base.length]));
    const stampOn = Math.floor(Math.random() * COUNT);
    let topZ = COUNT + 10;

    ids.forEach((n, i) => {
      const slot = slots[i];
      const shot = el('figure', 'shot look-' + looks[i]);
      shot.style.width = WIDTH + '%';
      shot.style.left = (slot.x + rand(-1, 1)).toFixed(1) + '%';
      shot.style.top = (TOP + slot.row * SLOT + rand(-0.3, 0.3)).toFixed(2) + '%';
      shot.style.zIndex = i + 10;
      shot.style.setProperty('--rot', rand(-1.8, 1.8).toFixed(1) + 'deg');

      const img = el('img');
      img.src = 'images/dog' + n + '.jpg';
      img.alt = 'Tara, photo ' + n;
      img.draggable = false;
      shot.appendChild(img);
      shot.appendChild(el('span', 'frame-no', '\u25B7 ' + n + ' / ' + pick(FRAMES)));
      if (i === stampOn) shot.appendChild(el('span', 'stamp', pick(WORDS)));

      let dx = 0, dy = 0;
      shot.addEventListener('pointerdown', (e) => {
        const r = shot.getBoundingClientRect();
        dx = e.clientX - r.left;
        dy = e.clientY - r.top;
        shot.setPointerCapture(e.pointerId);
        shot.classList.add('dragging', 'loose'); // pulled out of the reel: becomes a loose print
        shot.style.zIndex = ++topZ;
      });
      shot.addEventListener('pointermove', (e) => {
        if (!shot.classList.contains('dragging')) return;
        const g = gallery.getBoundingClientRect(), r = shot.getBoundingClientRect();
        // the on-screen box is slightly bigger than the layout box because of the tilt; use the layout size
        const w = shot.offsetWidth, h = shot.offsetHeight;
        const x = Math.min(Math.max(e.clientX - g.left - dx - (r.width - w) / 2, 0), g.width - w);
        const y = Math.min(Math.max(e.clientY - g.top - dy - (r.height - h) / 2, 0), g.height - h);
        shot.style.left = (x / g.width * 100).toFixed(2) + '%';
        shot.style.top = (y / g.height * 100).toFixed(2) + '%';
      });
      const drop = () => shot.classList.remove('dragging');
      shot.addEventListener('pointerup', drop);
      shot.addEventListener('pointercancel', drop);
      gallery.appendChild(shot);
    });

    // a ticket stub on the film beside the centred photo (only when there is one)
    if (soloRow >= 0) {
    const ticket = el('div', 'ticket');
    ticket.append(el('b', '', 'ADMIT ONE'), el('span', '', 'N\u00B0 000' + (1 + Math.floor(Math.random() * 9))));
    ticket.style.top = (TOP + soloRow * SLOT + 3).toFixed(1) + '%';
    ticket.style.left = (Math.random() < 0.5 ? 3 : 71) + '%';
    ticket.style.setProperty('--rot', rand(-9, 9).toFixed(1) + 'deg');
    ticket.style.zIndex = COUNT + 5;
    gallery.appendChild(ticket);
    }

    const foot = el('div', 'hud-foot');
    foot.append(el('span', '', 'A DOGEMA FILM'), el('span', '', COUNT + ' FRAMES LOADED'));
    gallery.appendChild(foot);
  }

  ready.then(layout);
  if (details) details.addEventListener('toggle', () => { if (details.open) ready.then(layout); });
})();

// Give every heading its own random sticker look: fill/ink/outline colours, hard shadow and a slight tilt.
(function randomiseWordArt() {
  const variants = [
    { bg: '#ffffff', fg: '#1f3fff', bd: '#1f3fff', sh: '#c6ff00' }, // white pill, blue ink (BLISS)
    { bg: '#c6ff00', fg: '#000000', bd: '#000000', sh: '#1f3fff' }, // acid lime, black ink
    { bg: '#1f3fff', fg: '#ffffff', bd: '#ffffff', sh: '#c6ff00' }, // electric blue, white ink
    { bg: '#000000', fg: '#c6ff00', bd: '#c6ff00', sh: '#1f3fff' }, // black, lime ink
  ];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  document.querySelectorAll('.panel h2, .wordart').forEach((el) => {
    const v = pick(variants);
    el.style.setProperty('--wa-bg', v.bg);
    el.style.setProperty('--wa-fg', v.fg);
    el.style.setProperty('--wa-bd', v.bd);
    el.style.setProperty('--wa-sh', v.sh);
    el.style.setProperty('--wa-rot', (Math.random() * 5 - 3).toFixed(1) + 'deg');
  });
})();

// Flickering glitter over headers marked with data-sparkle.
(function addGlitter() {
  const colours = ['#ffffff', '#c6ff00', '#c6ff00', '#6f86ff', '#8ff3ff'];
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

  // ---- dates: strict parsing only (never Date.parse, which turns "Fri 14 Nov" into the year 2001) ----
  function validDate(y, m, d) {
    const dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d ? dt : null;
  }
  const SLASH = /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/;
  // Slash dates are ambiguous (3/4 = 3 April or March 4). Look at all dates: a part above 12 settles it.
  function detectOrder(strings) {
    let dmy = false, mdy = false;
    strings.forEach((s) => {
      const m = SLASH.exec(s.trim());
      if (!m) return;
      if (+m[1] > 12) dmy = true;
      if (+m[2] > 12) mdy = true;
    });
    if (dmy && !mdy) return 'dmy';
    if (mdy && !dmy) return 'mdy';
    return cfg.dateOrder === 'mdy' ? 'mdy' : 'dmy';
  }
  function parseDate(str, order) {
    const s = str.trim();
    let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s) || /^(\d{4})\/(\d{1,2})\/(\d{1,2})/.exec(s);
    if (m) return validDate(+m[1], +m[2], +m[3]);
    m = /^(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4})/.exec(s); // 14.11.2026 is always day first
    if (m) return validDate(+m[3], +m[2], +m[1]);
    m = SLASH.exec(s);
    if (m) return order === 'mdy' ? validDate(+m[3], +m[1], +m[2]) : validDate(+m[3], +m[2], +m[1]);
    return null; // free text such as "Fri 14 Nov evening": kept in the list, never hidden
  }
  const isTrue = (v) => /^(true|yes|y|x|1|\u2713|\u2714|watched)$/i.test((v || '').trim());

  // ---- "Add to calendar": an .ics file (works in Google, Apple and Outlook calendars) with built-in alerts,
  //      plus a Google Calendar link. All-day event on the chosen date.
  const pad2 = (n) => String(n).padStart(2, '0');
  const ymd = (d) => d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate());
  const icsEscape = (s) => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  // calendar files must wrap long lines (continuation lines start with a space); never split an emoji in half
  function foldLine(line) {
    const out = [];
    let rest = line;
    while (rest.length > 60) {
      let cut = 60;
      const code = rest.charCodeAt(cut - 1);
      if (code >= 0xD800 && code <= 0xDBFF) cut--; // do not cut between the two halves of an emoji
      out.push(rest.slice(0, cut));
      rest = ' ' + rest.slice(cut);
    }
    out.push(rest);
    return out.join('\r\n');
  }
  function eventInfo(date, note) {
    const title = cfg.eventTitle || 'Movie night \uD83C\uDFAC';
    const pageUrl = /^https?:/.test(location.href) ? location.origin + location.pathname : '';
    const lines = ['Pick a movie from the list and press play.'];
    if (note) lines.push(note);
    if (pageUrl) lines.push(pageUrl);
    return { title, description: lines.join('\n'), pageUrl };
  }
  function buildIcs(date, info) {
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const now = new Date();
    const stamp = now.getUTCFullYear() + pad2(now.getUTCMonth() + 1) + pad2(now.getUTCDate()) + 'T' +
      pad2(now.getUTCHours()) + pad2(now.getUTCMinutes()) + pad2(now.getUTCSeconds()) + 'Z';
    const alarm = (trigger, text) => ['BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEscape(text), 'TRIGGER:' + trigger, 'END:VALARM'];
    return [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Movie Night Planner//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:movie-night-' + ymd(date) + '@birthday-surprise',
      'DTSTAMP:' + stamp,
      'DTSTART;VALUE=DATE:' + ymd(date),
      'DTEND;VALUE=DATE:' + ymd(next),
      'SUMMARY:' + icsEscape(info.title),
      'DESCRIPTION:' + icsEscape(info.description),
      ...(info.pageUrl ? ['URL:' + info.pageUrl] : []),
      ...alarm('-PT6H', 'Movie night is tomorrow'),  // 18:00 the evening before
      ...alarm('PT9H', 'Movie night is today'),      // 09:00 on the day
      'END:VEVENT', 'END:VCALENDAR',
    ].map(foldLine).join('\r\n') + '\r\n';
  }
  function calendarButtons(date, note) {
    const info = eventInfo(date, note);
    const row = document.createElement('span');
    row.className = 'cal-row';
    const ics = document.createElement('button');
    ics.type = 'button';
    ics.className = 'chip';
    ics.textContent = 'Add to calendar';
    ics.addEventListener('click', () => {
      const blob = new Blob([buildIcs(date, info)], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'movie-night-' + ymd(date) + '.ics';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    });
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const g = document.createElement('a');
    g.className = 'chip';
    g.target = '_blank';
    g.rel = 'noopener';
    g.textContent = 'Google';
    g.href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(info.title) +
      '&dates=' + ymd(date) + '/' + ymd(next) +
      '&details=' + encodeURIComponent(info.description);
    row.append(ics, g);
    return row;
  }

  async function fillList(listId, csvUrl, emptyText, kind) {
    const list = document.getElementById(listId);
    const watchedList = kind === 'movies' ? document.getElementById('watched-list') : null;
    const watchedBlock = kind === 'movies' ? document.getElementById('watched-block') : null;
    if (!csvUrl) { setMessage(list, 'Not connected yet.'); return; }
    try {
      const res = await fetch(csvUrl);
      if (!res.ok) { setMessage(list, 'Could not load the list (Google answered ' + res.status + '). Is the tab published as CSV?'); return; }
      const text = await res.text();
      if (/^\s*</.test(text)) { setMessage(list, 'That link is a web page, not CSV. Re-publish the tab as "Comma-separated values (.csv)".'); return; }
      const parsed = parseCsv(text);
      const header = parsed[0] || [];
      const rows = parsed.slice(1).reverse(); // newest first
      // movies: a column whose header contains "watched" (tick it in the sheet) moves a movie to the watched list
      const wi = kind === 'movies' ? header.findIndex((h) => /watched/i.test(h)) : -1;
      if (watchedBlock) watchedBlock.hidden = wi < 0;
      if (!rows.length) {
        setMessage(list, emptyText);
        if (watchedList && wi >= 0) setMessage(watchedList, 'Nothing watched yet.');
        return;
      }

      const seen = readSeen(listId);
      let keptNew = [];
      try { keptNew = JSON.parse(sessionStorage.getItem(SEEN_PREFIX + 'new-' + listId) || '[]'); } catch (e) { /* ignore */ }
      const newKeys = [];
      currentKeys[listId] = [];

      const order = kind === 'dates' ? detectOrder(rows.map((r) => r[1] || '')) : 'dmy';
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const entries = [];
      rows.forEach((r) => {
        const title = (r[1] || '').trim();
        if (!title) return;
        const key = r.join('|');
        currentKeys[listId].push(key);
        const entry = { r, key, title, date: kind === 'dates' ? parseDate(title, order) : null, watched: wi >= 0 && isTrue(r[wi]) };
        if (entry.date && entry.date < today) return; // outdated dates disappear
        entries.push(entry);
      });
      if (kind === 'dates') {
        // real dates first (soonest first), free-text ones after, both keeping newest-first order otherwise
        const dated = entries.filter((e) => e.date).sort((a, b) => a.date - b.date);
        entries.splice(0, entries.length, ...dated, ...entries.filter((e) => !e.date));
      }

      list.innerHTML = '';
      if (watchedList) watchedList.innerHTML = '';
      entries.forEach((e) => {
        const li = document.createElement('li');
        li.textContent = e.date
          ? e.date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
          : e.title;
        if (!e.watched && ((seen && !seen.includes(e.key)) || keptNew.includes(e.key))) {
          newKeys.push(e.key);
          const badge = document.createElement('span');
          badge.className = 'new-badge';
          badge.textContent = 'NEW';
          li.appendChild(badge);
        }
        const details = e.r.slice(2).filter((x, i) => i + 2 !== wi).map((x) => x.trim()).filter(Boolean).join(' \u00B7 ');
        if (details) {
          const small = document.createElement('small');
          small.textContent = details;
          li.appendChild(small);
        }
        if (e.date) { li.classList.add('has-cal'); li.appendChild(calendarButtons(e.date, details)); }
        if (e.watched) { li.className = 'done'; watchedList.appendChild(li); } else list.appendChild(li);
      });
      try { sessionStorage.setItem(SEEN_PREFIX + 'new-' + listId, JSON.stringify(newKeys)); } catch (e) { /* ignore */ }
      if (!list.children.length) setMessage(list, kind === 'dates' ? 'No upcoming dates. Add one!' : emptyText);
      if (watchedList && wi >= 0 && !watchedList.children.length) setMessage(watchedList, 'Nothing watched yet.');
    } catch (e) {
      console.error('Planner: failed to load', csvUrl, e);
      setMessage(list, 'Could not reach Google (network or blocked). Try reloading.');
    }
  }

  // Link to the Google Sheet itself (the normal /edit link) so a movie can be ticked as watched; hidden until set in config.js
  const sheetLink = document.getElementById('open-sheet');
  if (cfg.sheetUrl) { sheetLink.href = cfg.sheetUrl; sheetLink.hidden = false; }
  setButton('add-movie', cfg.moviesFormUrl);
  setButton('add-date', cfg.datesFormUrl);
  fillList('movie-list', cfg.moviesCsvUrl, 'No movies yet. Add the first one!', 'movies');
  fillList('date-list', cfg.datesCsvUrl, 'No dates yet. Add one!', 'dates');
})();
