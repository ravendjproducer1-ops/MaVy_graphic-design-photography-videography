(() => {
  const O = window.SITE_OVERRIDES || {}, L = O.links || {}, $ = s => document.querySelector(s);
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h) e.innerHTML = h; return e; };
  const base = (O.siteUrl || location.origin + location.pathname).split('?')[0];
  const tg = (L.telegram || 'https://t.me/MAVY19000').split('?')[0], fb = L.facebook || 'https://www.facebook.com/son.moeun?mibextid=LQQJ4d', aba = L.aba || 'https://pay.ababank.com/oRF8/qvohrtpl';
  const P = new URLSearchParams(location.search); if (P.get('ref')) sessionStorage.setItem('ref', P.get('ref'));
  const ref = sessionStorage.getItem('ref') || '';
  const toast = m => { const t = el('div', 'toast2', m); document.body.append(t); requestAnimationFrame(() => t.classList.add('on')); setTimeout(() => { t.classList.remove('on'); setTimeout(() => t.remove(), 400); }, 2200); };
  const sw = el('label', 'hap', '<input type="checkbox" switch>'); document.body.append(sw);
  window.haptic = () => { if (navigator.vibrate) navigator.vibrate(12); else sw.click(); };
  let closeToday = () => {};
  if (ref) toast('ស្វាគមន៍ · ' + ref);
  if (O.cfToken) { const s = el('script'); s.defer = true; s.src = 'https://static.cloudflareinsights.com/beacon.min.js'; s.dataset.cfBeacon = JSON.stringify({ token: O.cfToken }); document.head.append(s); }

  // Golden-hour atmosphere (Phnom Penh time)
  const hr = +new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh', hour: 'numeric', hour12: false }) % 24;
  const TOD = hr >= 5 && hr < 8 ? ['Sunrise', '#fb923c', '#f472b6'] : hr >= 8 && hr < 16 ? ['Daylight', '#38bdf8', '#818cf8'] : hr >= 16 && hr < 19 ? ['Golden Hour', '#f59e0b', '#ef4444'] : ['Night', '#4338ca', '#7c3aed'];
  const tod = el('div', 'tod'); tod.style.background = `radial-gradient(ellipse at 15% 0%,${TOD[1]}55,transparent 60%),radial-gradient(ellipse at 85% 25%,${TOD[2]}44,transparent 55%)`; document.body.prepend(tod);

  // Khmer-inspired diamond dividers
  ['#techstack', '.process', '#projects', '#iqgame', '#contact'].forEach(s => { const e = $(s); if (e) e.before(el('div', 'kbach')); });

  // Widgets: Phnom Penh time, colour of the day, availability
  const mq = $('.marquee');
  if (mq) {
    const d = new Date(), hue = (Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5) * 47) % 360;
    const f = n => { const k = (n + hue / 30) % 12; return Math.round(255 * (.55 - .315 * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, '0'); };
    const hex = ('#' + [0, 8, 4].map(f).join('')).toUpperCase();
    mq.after(el('div', 'widgets', `<div class="wg"><small>ភ្នំពេញ</small><b id="wgTime">--:--</b><span>${TOD[0]}</span></div><button class="wg wg-c" id="wgColor" style="--c:${hex}"><small>Color of the day</small><b>${hex}</b><span>tap to copy</span></button><div class="wg"><small>Status</small><b>${O.slots || 'Open'}</b><span>${O.slots ? 'slots left' : (O.status || 'Available for work')}</span></div>`));
    const tick = () => $('#wgTime').textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Phnom_Penh', hour: '2-digit', minute: '2-digit' }); tick(); setInterval(tick, 15000);
    $('#wgColor').onclick = () => { navigator.clipboard.writeText(hex); haptic(); toast(hex); };
  }

  // Dynamic Island
  const isl = el('div', 'island', `<button class="isl-main"><i class="dot"></i><span>${O.status || 'ទំនេរទទួលការងារ'}</span></button><div class="isl-acts"><button data-a="brief">${ic('pen', 20)}</button><a href="${tg}" target="_blank" rel="noopener">${ic('link', 20)}</a><a href="${aba}" target="_blank" rel="noopener">${ic('wallet', 20)}</a><button data-a="qr">${ic('qr', 20)}</button><button data-a="cam">${ic('camera', 20)}</button><button data-a="share">${ic('up', 20)}</button></div>`);
  document.body.append(isl);
  isl.querySelector('.isl-main').onclick = e => { isl.classList.toggle('open'); haptic(); e.stopPropagation(); };
  document.addEventListener('click', e => { if (!isl.contains(e.target)) isl.classList.remove('open'); });
  isl.addEventListener('click', e => { const a = e.target.closest('[data-a]'); if (!a) return; isl.classList.remove('open'); haptic(); ({ brief: openBrief, qr: () => $('#qrBtn').click(), cam: camMode, share })[a.dataset.a](); });
  function share() { navigator.share ? navigator.share({ title: document.title, url: base }).catch(() => {}) : navigator.clipboard.writeText(base).then(() => toast('Link copied')); }
  function vcf() { const em = ($('#copyEmailBtn') || { dataset: {} }).dataset.email || 'ravendjproducer.1@gmail.com'; const a = el('a'); a.href = URL.createObjectURL(new Blob([`BEGIN:VCARD\nVERSION:3.0\nFN:Ma Vy\nTITLE:Graphic Designer · Photographer · Videographer\nEMAIL:${em}\nURL:${base}\nURL:${tg}\nURL:${fb}\nEND:VCARD`], { type: 'text/vcard' })); a.download = 'MaVy.vcf'; a.click(); }

  // Control-Center style contact tiles
  const sb = $('.social-links-box');
  if (sb) {
    sb.style.display = 'none';
    const g = el('div', 'cc-grid'), T = [['link', 'Telegram', tg, 1], ['globe', 'Facebook', fb, 1], ['wallet', 'ABA Pay', aba, 1], ['download', 'Save Contact', 0, 'vcf'], ['up', 'Share', 0, 'share'], ['camera', 'Card', '?card', 0]];
    g.innerHTML = T.map(([i, l, h, x]) => h ? `<a class="cc-tile" href="${h}" ${x ? 'target="_blank" rel="noopener"' : ''}><span>${ic(i, 26)}</span><b>${l}</b></a>` : `<button class="cc-tile" data-x="${x}"><span>${ic(i, 26)}</span><b>${l}</b></button>`).join('');
    sb.after(g); g.onclick = e => { haptic(); const b = e.target.closest('[data-x]'); if (b) b.dataset.x === 'vcf' ? vcf() : share(); };
  }

  // Bottom-sheet swipe to close
  document.addEventListener('touchstart', e => { const c = e.target.closest('.modal-card'); if (c) c._y = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', e => { const c = e.target.closest('.modal-card'); if (c && c._y != null && e.changedTouches[0].clientY - c._y > 90) c.closest('.modal').click(); if (c) c._y = null; });

  // QR with ?ref= source tracking
  const qa = $('#qrDl') && $('#qrDl').parentElement;
  if (qa && window.QRCode) {
    const ri = el('input', 'ref-in'); ri.placeholder = 'ref: poster, card, fb…'; qa.before(ri);
    ri.oninput = () => { const u = base + (ri.value.trim() ? '?ref=' + encodeURIComponent(ri.value.trim()) : ''); $('#qrBox').innerHTML = ''; new QRCode($('#qrBox'), { text: u, width: 240, height: 240, colorDark: '#0b1020', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H }); $('#qrUrl').textContent = u; };
  }

  // Brief builder + price estimator
  const SV = O.prices && O.prices.length ? O.prices : ['Graphic Design', 'Photography', 'Videography'].map(name => ({ name })), hasP = SV.some(s => s.price), BUD = ['< $50', '$50 – $150', '$150 – $500', '$500+'];
  const bf = { s: [], b: '', d: '', n: '' }; let step = 0;
  const bm = el('div', 'modal', `<div class="modal-card sheet"><button class="modal-x">${ic('x', 20)}</button><div id="bf"></div></div>`); document.body.append(bm);
  const total = () => SV.filter(s => bf.s.includes(s.name)).reduce((a, s) => a + (+s.price || 0), 0);
  const brief = () => `សួស្តី Ma Vy! ខ្ញុំចង់កម្មង់ការងារ៖\n• សេវា៖ ${bf.s.join(', ') || '-'}${hasP && total() ? ' (ប្រហែល $' + total() + ')' : ''}\n• ថ្ងៃកំណត់៖ ${bf.d || '-'}\n${hasP ? '' : '• ថវិកា៖ ' + (bf.b || '-') + '\n'}• ព័ត៌មាន៖ ${bf.n || '-'}${ref ? '\n• ប្រភព៖ ' + ref : ''}`;
  function renderBrief() {
    const chip = (v, on, k, lbl) => `<button class="chip ${on ? 'on' : ''}" data-k="${k}" data-v="${v}">${lbl || v}</button>`;
    let b = '';
    if (step === 0) b = `<h3>1. ប្រភេទការងារ</h3><div class="chips">${SV.map(s => chip(s.name, bf.s.includes(s.name), 's', s.name + (s.price ? ' · $' + s.price : ''))).join('')}</div>${hasP ? `<p class="tot">សរុបប្រហែល <b>$${total()}</b></p>` : ''}`;
    if (step === 1) b = `<h3>2. ថ្ងៃកំណត់${hasP ? '' : ' & ថវិកា'}</h3><input type="date" id="bd" value="${bf.d}">${hasP ? '' : `<div class="chips">${BUD.map(x => chip(x, bf.b === x, 'b')).join('')}</div>`}`;
    if (step === 2) b = `<h3>3. ព័ត៌មានបន្ថែម</h3><textarea id="bn" rows="4" placeholder="ឯកសារយោង / link / គំនិត...">${bf.n}</textarea>`;
    if (step === 3) b = `<h3>4. ត្រៀមផ្ញើ</h3><pre class="msg">${brief().replace(/</g, '&lt;')}</pre><div class="qr-actions"><a class="btn-glow" target="_blank" rel="noopener" href="${tg}?text=${encodeURIComponent(brief())}">${ic('link', 16)} Telegram</a><a class="btn-glass" target="_blank" rel="noopener" href="${aba}">${ic('wallet', 16)} ABA</a><button class="btn-glass" id="bcopy">${ic('check', 16)} Copy</button></div>`;
    $('#bf').innerHTML = `<div class="dots">${[0, 1, 2, 3].map(i => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>${b}${step < 3 ? `<div class="qr-actions"><button class="btn-glass" id="bprev" ${step ? '' : 'disabled'}>${ic('left', 16)}</button><button class="btn-glow" id="bnext">${ic('right', 16)}</button></div>` : ''}`;
  }
  function openBrief() { step = 0; renderBrief(); bm.classList.add('open'); }
  bm.addEventListener('click', e => {
    if (e.target === bm || e.target.closest('.modal-x')) return bm.classList.remove('open');
    if ($('#bd')) bf.d = $('#bd').value; if ($('#bn')) bf.n = $('#bn').value;
    const c = e.target.closest('.chip');
    if (c) { const { k, v } = c.dataset; if (k === 's') bf.s = bf.s.includes(v) ? bf.s.filter(x => x !== v) : [...bf.s, v]; else bf[k] = v; haptic(); renderBrief(); }
    if (e.target.closest('#bnext')) { step++; renderBrief(); }
    if (e.target.closest('#bprev')) { step--; renderBrief(); }
    if (e.target.closest('#bcopy')) navigator.clipboard.writeText(brief()).then(() => toast('Copied'));
  });
  const hc = $('.hero-cta'); if (hc) { const b = el('button', 'btn-glass', `${ic('pen', 18)} Brief`); b.onclick = openBrief; hc.append(b); }

  // Camera mode
  function camMode() {
    const v = el('div', 'vf', `<b class="rec"><i></i>REC <time>00:00</time></b><span class="iso">ISO 100 · f/1.8 · 1/250</span><em class="fz"></em><button class="vf-x">${ic('x', 22)}</button>`); document.body.append(v);
    let s = 0; const tm = setInterval(() => { s++; v.querySelector('time').textContent = String(s / 60 | 0).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }, 1000);
    v.onclick = e => { if (e.target.closest('.vf-x')) { clearInterval(tm); return v.remove(); } const f = v.querySelector('.fz'); f.style.cssText = `left:${e.clientX}px;top:${e.clientY}px`; f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); haptic(); };
  }

  // Works: reels row + App-Store-style expanding case study + colour palette
  const gl = $('#gallery'), items = (O.gallery || []).filter(x => x.src), mp4 = u => /\.mp4(\?|$)/i.test(u || '');
  function pal(src, box) {
    const im = new Image(); im.onload = () => { try { const c = el('canvas'); c.width = c.height = 40; const x = c.getContext('2d'); x.drawImage(im, 0, 0, 40, 40); const d = x.getImageData(0, 0, 40, 40).data, m = {}; for (let i = 0; i < d.length; i += 4) { const k = [d[i], d[i + 1], d[i + 2]].map(v => (v >> 5) << 5).join(','); m[k] = (m[k] || 0) + 1; } box.innerHTML = Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => { const h = '#' + k.split(',').map(v => (+v + 16).toString(16).padStart(2, '0')).join(''); return `<button style="background:${h}" data-h="${h}">${h}</button>`; }).join(''); } catch (e) {} }; im.src = src;
  }
  if (gl && items.length) {
    const sheet = el('div', 'today'); document.body.append(sheet); let last = '';
    const open = (it, from) => {
      const r = from.getBoundingClientRect(), W = Math.min(innerWidth * .92, 620), H = innerHeight * .88; last = `top:${r.top}px;left:${r.left}px;width:${r.width}px;height:${r.height}px;border-radius:20px`;
      sheet.innerHTML = `<div class="td-card"><button class="modal-x">${ic('x', 20)}</button><div class="td-media">${mp4(it.link) ? `<video src="${it.link}" poster="${it.src}" controls autoplay playsinline></video>` : `<img src="${it.src}" alt="">`}</div><div class="td-body"><h3>${it.title || ''}</h3><p>${it.desc || ''}</p><div class="pal"></div><div class="qr-actions">${it.link && !mp4(it.link) ? `<a class="btn-glass" href="${it.link}" target="_blank" rel="noopener">${ic('video', 16)} Play</a>` : ''}<a class="btn-glow" target="_blank" rel="noopener" href="${tg}?text=${encodeURIComponent('សួស្តី ខ្ញុំចង់បានស្នាដៃបែប «' + (it.title || '') + '»')}">${ic('link', 16)} Order similar</a></div></div></div>`;
      const c = sheet.firstChild; c.style.cssText = last; sheet.classList.add('open'); pal(it.src, c.querySelector('.pal'));
      requestAnimationFrame(() => requestAnimationFrame(() => c.style.cssText = `top:${(innerHeight - H) / 2}px;left:${(innerWidth - W) / 2}px;width:${W}px;height:${H}px;border-radius:28px`));
    };
    closeToday = () => { const c = sheet.firstChild; if (!c || !sheet.classList.contains('open')) return; c.style.cssText = last; sheet.classList.remove('open'); setTimeout(() => sheet.innerHTML = '', 600); };
    sheet.onclick = e => { const h = e.target.closest('[data-h]'); if (h) { navigator.clipboard.writeText(h.dataset.h); return toast(h.dataset.h); } if (e.target === sheet || e.target.closest('.modal-x')) closeToday(); };
    gl.addEventListener('click', e => { const f = e.target.closest('figure'); if (!f) return; e.stopImmediatePropagation(); open(items[[...gl.children].indexOf(f)], f); }, true);
    const vids = items.filter(x => x.cat === 'video');
    if (vids.length) {
      const r = el('div', 'reels', vids.map(v => `<div class="reel"><img src="${v.src}" alt="" loading="lazy">${mp4(v.link) ? `<video muted loop playsinline preload="metadata" src="${v.link}"></video>` : ''}<span>${ic('video', 16)} ${v.title || ''}</span></div>`).join('')); gl.before(r);
      const io = new IntersectionObserver(es => es.forEach(e => { const v = e.target.querySelector('video'); if (v) e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }), { threshold: .6 });
      [...r.children].forEach(x => io.observe(x)); r.onclick = e => { const x = e.target.closest('.reel'); if (x) open(vids[[...r.children].indexOf(x)], x); };
    }
  }

  // Aperture cursor (PC)
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    const c = el('div', 'cur', '<i></i><span></span>'); document.body.append(c); let x = 0, y = 0, tx = 0, ty = 0;
    addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; c.classList.add('on'); });
    (function loop() { x += (tx - x) * .22; y += (ty - y) * .22; c.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', e => { const t = e.target, v = t.closest('figure,.reel,.image-frame'); c.dataset.m = v ? 'VIEW' : t.closest('a,button,.chip,.cc-tile') ? 'tap' : ''; c.lastChild.textContent = v ? 'VIEW' : ''; });
    addEventListener('mousedown', () => c.classList.add('down')); addEventListener('mouseup', () => c.classList.remove('down'));
  }

  // Easter egg: 5 taps on the logo = Film Noir
  const lg = $('.brand-box'); let n = 0, tm0;
  if (lg) lg.addEventListener('click', () => { n++; clearTimeout(tm0); tm0 = setTimeout(() => n = 0, 1500); if (n >= 5) { n = 0; document.documentElement.classList.toggle('noir'); toast('Film Noir'); haptic(); } });

  // Digital business card (?card)
  if (P.has('card')) {
    const cv = el('div', 'cardview', `<div class="cv"><img src="profile.webp" alt=""><h2>Ma Vy</h2><p>Graphic Designer · Photographer · Videographer</p><div class="cv-btns"><a class="btn-glow" href="${tg}">Telegram</a><a class="btn-glass" href="${fb}">Facebook</a><a class="btn-glass" href="${aba}">ABA Pay</a><button class="btn-glass" id="cvv">Save Contact</button><a class="btn-glass" id="cvw" href="${base}">Website</a></div></div>`);
    document.body.append(cv); $('#cvv').onclick = vcf; $('#cvw').onclick = e => { e.preventDefault(); cv.remove(); };
  }
  addEventListener('keydown', e => { if (e.key !== 'Escape') return; bm.classList.remove('open'); closeToday(); const x = $('.vf-x'); if (x) x.click(); });
})();
