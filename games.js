(() => {
  const $ = s => document.querySelector(s), box = $('#gameStage'), tabs = document.querySelectorAll('[data-g]');
  if (!box) return;
  const O = window.SITE_OVERRIDES || {}; let best = {}, cur = '', stop = () => {};
  try { best = JSON.parse(localStorage.getItem('g_best') || '{}'); } catch (e) {}
  const showBest = k => $('#gameBest').innerHTML = ic('trophy', 16) + ' ' + (best[k] != null ? best[k] : '—');
  const save = (k, v, low) => { if (best[k] == null || (low ? v < best[k] : v > best[k])) { best[k] = v; localStorage.setItem('g_best', JSON.stringify(best)); } showBest(k); };
  const confetti = () => { const cl = ['#3b82f6', '#a855f7', '#22c55e', '#f59e0b', '#ec4899']; for (let i = 0; i < 32; i++) { const s = document.createElement('span'); s.className = 'cf'; s.style.cssText = `left:${Math.random() * 100}vw;background:${cl[i % 5]};--d:${1.5 + Math.random() * 1.5}s;--x:${Math.random() * 200 - 100}px`; document.body.appendChild(s); setTimeout(() => s.remove(), 3200); } };
  const win = m => { navigator.vibrate && navigator.vibrate([30, 40, 30]); confetti(); box.insertAdjacentHTML('beforeend', `<div class="g-win"><div>${m}</div><button class="btn-glow" id="again">${ic('rotate', 18)} Play again</button></div>`); $('#again').onclick = () => start(cur); };

  const MI = ['zap', 'star', 'target', 'key', 'globe', 'bug', 'keyboard', 'trophy'], TR = () => ic('trophy', 34);
  function memory() {
    const c = [...MI, ...MI].sort(() => Math.random() - .5);
    box.innerHTML = `<div class="g-bar"><span>Moves: <b id="mv">0</b></span><span>Find all pairs</span></div><div class="mem">${c.map(x => `<button class="mc" data-k="${x}"><i>${ic('help', 26)}</i><b>${ic(x, 30)}</b></button>`).join('')}</div>`;
    let a = null, lock = false, m = 0, done = 0;
    box.querySelectorAll('.mc').forEach(b => b.onclick = () => {
      if (lock || b.classList.contains('on')) return; b.classList.add('on');
      if (!a) { a = b; return; }
      $('#mv').textContent = ++m;
      if (a.dataset.k === b.dataset.k) { a.classList.add('ok'); b.classList.add('ok'); a = null; if (++done === 8) { save('memory', m, 1); win(`${TR()} ${m} moves`); } }
      else { lock = true; setTimeout(() => { a.classList.remove('on'); b.classList.remove('on'); a = null; lock = false; }, 700); }
    });
  }
  const live = () => { const r = box.getBoundingClientRect(); return !/INPUT|TEXTAREA/.test(document.activeElement.tagName) && r.bottom > 0 && r.top < innerHeight; };
  function snake() {
    box.innerHTML = `<div class="g-bar"><span>${ic('apple', 16)} <b id="sc">0</b></span><button class="g-btn" id="pz" aria-label="pause">${ic('pause', 16)}</button></div><canvas id="sn" width="320" height="320"></canvas><div class="dpad"><i></i><button data-d="up">${ic('upc', 26)}</button><i></i><button data-d="left">${ic('left', 26)}</button><button data-d="down">${ic('down', 26)}</button><button data-d="right">${ic('right', 26)}</button></div><p class="g-hint">WASD / Arrows · Space = Pause · Swipe / D-pad</p>`;
    const cv = $('#sn'), x = cv.getContext('2d'), N = 16, S = 20, ac = getComputedStyle(document.body).getPropertyValue('--accent-color');
    const V = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }, KM = { arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down', arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right' };
    let sn = [[8, 8], [7, 8], [6, 8]], d = [1, 0], nd = d, f = [12, 8], sc = 0, sx, sy, paused = false;
    const go = n => { const m = V[n]; if (m[0] + d[0] || m[1] + d[1]) nd = m; };
    const key = e => { if (!live()) return; const k = e.key.toLowerCase(); if (k === ' ' || k === 'p') { paused = !paused; e.preventDefault(); } else if (KM[k]) { e.preventDefault(); go(KM[k]); } };
    const ts = e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const te = e => { const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; if (Math.max(Math.abs(dx), Math.abs(dy)) > 20) go(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')); };
    addEventListener('keydown', key); cv.addEventListener('touchstart', ts, { passive: true }); cv.addEventListener('touchend', te);
    box.querySelectorAll('.dpad button').forEach(b => b.onpointerdown = e => { e.preventDefault(); go(b.dataset.d); });
    $('#pz').onclick = () => paused = !paused;
    const L = setInterval(() => {
      if (paused) return; d = nd; const h = [sn[0][0] + d[0], sn[0][1] + d[1]];
      if (h[0] < 0 || h[1] < 0 || h[0] >= N || h[1] >= N || sn.some(p => p[0] === h[0] && p[1] === h[1])) { clearInterval(L); save('snake', sc); return win(`${TR()} ${sc}`); }
      sn.unshift(h);
      if (h[0] === f[0] && h[1] === f[1]) { $('#sc').textContent = ++sc; f = [Math.random() * N | 0, Math.random() * N | 0]; } else sn.pop();
      x.fillStyle = '#050a18'; x.fillRect(0, 0, 320, 320); x.fillStyle = '#f87171'; x.fillRect(f[0] * S + 2, f[1] * S + 2, 16, 16);
      x.fillStyle = ac; sn.forEach(p => x.fillRect(p[0] * S + 1, p[1] * S + 1, 18, 18));
    }, 110);
    return () => { clearInterval(L); removeEventListener('keydown', key); };
  }
  function dodge() {
    box.innerHTML = `<div class="g-bar"><span>${ic('star', 16)} <b id="sc">0</b></span><button class="g-btn" id="pz" aria-label="pause">${ic('pause', 16)}</button></div><canvas id="sn" width="320" height="360"></canvas><div class="dpad lr"><button data-d="left">${ic('left', 28)}</button><button data-d="right">${ic('right', 28)}</button></div><p class="g-hint">A / D or ← → · Space = Pause · Drag / Hold buttons</p>`;
    const cv = $('#sn'), x = cv.getContext('2d'), ac = getComputedStyle(document.body).getPropertyValue('--accent-color');
    let px = 138, dir = 0, sc = 0, bl = [], tk = 0, paused = false, over = false, raf, keys = {};
    const kd = e => { if (!live()) return; const k = e.key.toLowerCase(); if (k === ' ' || k === 'p') { paused = !paused; e.preventDefault(); } else if (['arrowleft', 'arrowright', 'a', 'd'].includes(k)) { keys[k] = 1; e.preventDefault(); } };
    const ku = e => delete keys[e.key.toLowerCase()];
    addEventListener('keydown', kd); addEventListener('keyup', ku);
    box.querySelectorAll('.dpad button').forEach(b => { b.onpointerdown = e => { e.preventDefault(); dir = b.dataset.d === 'left' ? -1 : 1; }; b.onpointerup = b.onpointerleave = () => dir = 0; });
    cv.addEventListener('pointermove', e => { px = Math.max(0, Math.min(276, (e.clientX - cv.getBoundingClientRect().left) * 320 / cv.clientWidth - 22)); });
    $('#pz').onclick = () => paused = !paused;
    const loop = () => {
      raf = requestAnimationFrame(loop); if (paused || over) return;
      px = Math.max(0, Math.min(276, px + ((keys.arrowleft || keys.a ? -1 : 0) + (keys.arrowright || keys.d ? 1 : 0) + dir) * 5));
      if (++tk % Math.max(14, 40 - (sc >> 2)) === 0) bl.push({ x: Math.random() * 296, y: -20 });
      bl.forEach(b => b.y += 2.4 + sc * .04);
      bl = bl.filter(b => { if (b.y > 360) { $('#sc').textContent = ++sc; return false; } return true; });
      if (bl.some(b => b.y + 20 > 336 && b.y < 348 && b.x + 24 > px && b.x < px + 44)) { over = true; cancelAnimationFrame(raf); save('dodge', sc); return win(`${TR()} ${sc}`); }
      x.fillStyle = '#050a18'; x.fillRect(0, 0, 320, 360); x.fillStyle = '#f87171'; bl.forEach(b => x.fillRect(b.x, b.y, 24, 20));
      x.fillStyle = ac; x.fillRect(px, 336, 44, 12);
    };
    loop(); return () => { cancelAnimationFrame(raf); removeEventListener('keydown', kd); removeEventListener('keyup', ku); };
  }
  function color() {
    let i = 0, s = 0, t;
    const h2 = v => Math.max(0, Math.min(255, v | 0)).toString(16).padStart(2, '0');
    const show = () => {
      if (i >= 10) { save('color', s); return win(`${TR()} ${s}/10`); }
      const tg = [0, 0, 0].map(() => 40 + Math.random() * 175), ms = [14, 40, 70, 105].sort(() => Math.random() - .5);
      const o = ms.map(m => '#' + tg.map(v => h2(v + (Math.random() < .5 ? -m : m))).join('')), a = ms.indexOf(14);
      box.innerHTML = `<div class="g-bar"><span>${i + 1}/10</span><span>${ic('star', 16)} ${s}</span></div><div class="swatch-t" style="background:#${tg.map(h2).join('')}"></div><p class="g-hint">Pick the closest color</p><div class="swatches">${o.map((c, k) => `<button class="sw" data-k="${k}" style="background:${c}"></button>`).join('')}</div>`;
      const bs = box.querySelectorAll('.sw');
      bs.forEach(b => b.onclick = () => { bs.forEach(x => x.disabled = 1); const k = +b.dataset.k; b.classList.add(k === a ? 'ok' : 'bad'); bs[a].classList.add('ok'); if (k === a) s++; t = setTimeout(() => { i++; show(); }, 700); });
    };
    show(); return () => clearTimeout(t);
  }
  const games = { memory, snake, dodge, color };
  function start(k) { stop(); cur = k; tabs.forEach(t => t.classList.toggle('active', t.dataset.g === k)); showBest(k); stop = games[k]() || (() => {}); }
  tabs.forEach(t => t.onclick = () => start(t.dataset.g));
  start('memory');
})();
