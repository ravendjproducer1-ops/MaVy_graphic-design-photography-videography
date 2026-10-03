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

  function share() { navigator.share ? navigator.share({ title: document.title, url: base }).catch(() => {}) : navigator.clipboard.writeText(base).then(() => toast('Link copied')); }
  function vcf() { const em = ($('#copyEmailBtn') || { dataset: {} }).dataset.email || 'ravendjproducer.1@gmail.com'; const a = el('a'); a.href = URL.createObjectURL(new Blob([`BEGIN:VCARD\nVERSION:3.0\nFN:Ma Vy\nTITLE:Graphic Designer · Photographer · Videographer\nEMAIL:${em}\nURL:${base}\nURL:${tg}\nURL:${fb}\nEND:VCARD`], { type: 'text/vcard' })); a.download = 'MaVy.vcf'; a.click(); }
  // keep Save Contact + digital Card in the normal social buttons
  const sbtn = $('.social-btn'); if (sbtn) { const sv = el('button', 'social-btn', 'Save Contact'); sv.onclick = vcf; const cd = el('a', 'social-btn', 'Card'); cd.href = '?card'; sbtn.parentElement.append(sv, cd); }
  // camera mode button
  const fw = $('.fab-wrap'); if (fw) { const cb = el('button', 'fab'); cb.title = 'Camera'; cb.innerHTML = ic('camera', 22); cb.onclick = () => { haptic(); camMode(); }; fw.prepend(cb); }

  // QR with ?ref= source tracking
  const qa = $('#qrDl') && $('#qrDl').parentElement;
  if (qa && window.QRCode) {
    const sh = el('button', 'btn-glass', ic('up', 16) + ' Share'); sh.onclick = share; qa.append(sh); const ri = el('input', 'ref-in'); ri.placeholder = 'ref: poster, card, fb…'; qa.before(ri);
    ri.oninput = () => { const u = base + (ri.value.trim() ? '?ref=' + encodeURIComponent(ri.value.trim()) : ''); $('#qrBox').innerHTML = ''; new QRCode($('#qrBox'), { text: u, width: 240, height: 240, colorDark: '#0b1020', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M }); $('#qrUrl').textContent = u; };
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
  // ---- v9 fixes ----
  const fb2 = $('.floating-status-badge'); if (fb2) fb2.remove();
  const gh = $('.social-btn[href*="github.com"]'); if (gh) gh.remove();
  const sbt = $('.social-btn'); if (sbt) sbt.parentElement.classList.add('soc-grid');
  const cc2 = $('.contact-card-modern'), q1 = $('.qr-card:not(.web)'), q2 = $('.qr-card.web');
  if (cc2 && q1 && q2) { const row = el('div', 'qr-row'); row.append(q1, q2); cc2.append(row); }
  const fw2 = $('.fab-wrap'); let ft;
  if (fw2) addEventListener('scroll', () => { fw2.classList.add('hide'); clearTimeout(ft); ft = setTimeout(() => fw2.classList.remove('hide'), 700); }, { passive: true });
  if (!items.length) {
    const s = $('#projects'); if (s) { s.style.display = 'none'; const pv = s.previousElementSibling; if (pv && pv.classList.contains('kbach')) pv.style.display = 'none'; }
    document.querySelectorAll('a[href="#projects"]').forEach(a => { if (a.closest('nav,.nav-links')) a.style.display = 'none'; else { a.href = '#techstack'; a.dataset.i18n = 'btn_skills'; a.textContent = 'View Skills'; } });
  }
  // intro: avatar pulse + name reveal -> split-curtain opens -> hero entrance
  const pl = $('.preloader');
  if (pl) {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) pl.remove();
    else {
      pl.innerHTML = '<div class="cur-t"></div><div class="cur-b"></div><div class="intro"><div class="av"><i></i><i></i><img src="LOGO-2.webp" alt=""></div><h1 class="nm">' + [...'MA VY'].map((c, i) => `<span><em style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</em></span>`).join('') + '</h1><p class="tl">Graphic Design · Photography · Videography</p><div class="pb"><i></i></div></div>';
      const root = document.documentElement; root.classList.add('lock'); setTimeout(() => root.classList.remove('lock'), 5000);
      let done = 0; const finish = () => { if (done) return; done = 1; pl.classList.add('open'); root.classList.add('go'); setTimeout(() => { pl.remove(); root.classList.remove('lock'); }, 1200); };
      Promise.all([new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r)), new Promise(r => setTimeout(r, 2000))]).then(finish);
      pl.onclick = finish;
    }
  }
  // ---- v12: light-painting cursor, focus-pull, timecode HUD ----
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches, lite = document.documentElement.classList.contains('lite');
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !calm && !lite) {
    const cv = el('canvas', 'paint'); document.body.append(cv); const cx = cv.getContext('2d'); let w, h, px = -1, py = -1, hue = 200, run = 0, idle = 0;
    const size = () => { w = cv.width = innerWidth; h = cv.height = innerHeight; }; size(); addEventListener('resize', size);
    const loop = () => { cx.globalCompositeOperation = 'destination-out'; cx.fillStyle = 'rgba(0,0,0,.08)'; cx.fillRect(0, 0, w, h); cx.globalCompositeOperation = 'source-over'; if (--idle > 0) requestAnimationFrame(loop); else { run = 0; cx.clearRect(0, 0, w, h); } };
    addEventListener('mousemove', ev => { if (px >= 0) { hue = (hue + 2) % 360; cx.strokeStyle = `hsl(${hue},95%,68%)`; cx.shadowColor = cx.strokeStyle; cx.shadowBlur = 14; cx.lineWidth = 2.5; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(px, py); cx.lineTo(ev.clientX, ev.clientY); cx.stroke(); } px = ev.clientX; py = ev.clientY; idle = 90; if (!run) { run = 1; requestAnimationFrame(loop); } }, { passive: true });
    document.addEventListener('mouseleave', () => px = -1);
  }
  if (!calm && !lite) {
    const fo = new IntersectionObserver(es => es.forEach(x => x.target.classList.toggle('defocus', !x.isIntersecting)), { rootMargin: '-15% 0px -15% 0px' });
    document.querySelectorAll('.techstack-header,.process h3,.process li,.tech-card').forEach(x => { x.classList.add('fp'); fo.observe(x); });
  }
  // ---- v13: bokeh lights, giant outline word, scroll hint, ink ripple ----
  if (!calm && !lite) {
    const bk = el('div', 'bokeh'), cl = ['#60a5fa', '#a78bfa', '#f472b6', '#fbbf24'];
    for (let i = 0; i < 14; i++) { const b = el('i'); b.style.cssText = `--s:${30 + Math.random() * 90}px;--x:${Math.random() * 100}vw;--d:${14 + Math.random() * 16}s;--dl:${-Math.random() * 20}s;--c:${cl[i % 4]}`; bk.append(b); }
    document.body.prepend(bk);
  }
  const tsec = $('#techstack'); if (tsec) tsec.prepend(el('div', 'bgword', 'DESIGN · PHOTO · VIDEO'));
  const hsec = $('.hero-section');
  if (hsec && !calm) { const sh = el('div', 'scrollhint', '<i></i><span>Scroll</span>'); hsec.append(sh); addEventListener('scroll', () => sh.classList.toggle('gone', scrollY > 80), { passive: true }); }
  document.addEventListener('click', ev => {
    const b = ev.target.closest('.btn-glow,.btn-glass,.chip,.social-btn,.g-tab'); if (!b || calm) return;
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, s = el('span', 'ripple2');
    s.style.cssText = `width:${d}px;height:${d}px;left:${ev.clientX - r.left - d / 2}px;top:${ev.clientY - r.top - d / 2}px`; b.append(s); setTimeout(() => s.remove(), 650);
  });
  // glows drift with the mouse (PC)
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) addEventListener('mousemove', ev => { const s = document.documentElement.style; s.setProperty('--mx', (ev.clientX / innerWidth - .5).toFixed(3)); s.setProperty('--my', (ev.clientY / innerHeight - .5).toFixed(3)); }, { passive: true });
  // magnetic buttons (PC) + marquee speeds up while scrolling
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) document.querySelectorAll('.btn-glow,.btn-glass,.social-btn').forEach(b => { b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; }); b.addEventListener('mouseleave', () => b.style.transform = ''); });
  const trk = $('.marquee .track'); let ly = scrollY, rate = 1;
  if (trk && trk.getAnimations) { const an = trk.getAnimations()[0]; if (an) { addEventListener('scroll', () => { rate = Math.min(8, 1 + Math.abs(scrollY - ly) / 6); ly = scrollY; }, { passive: true }); (function tick() { rate += (1 - rate) * .06; an.playbackRate = rate; requestAnimationFrame(tick); })(); } }
  // colour-grading playground
  const gsrc = O.gradeImg || (items.find(x => x.cat !== 'video') || {}).src || 'profile.webp';
  const LK = [['Original', 'none'], ['Teal & Orange', 'contrast(1.12) saturate(1.35) hue-rotate(-10deg) sepia(.15)'], ['B&W Film', 'grayscale(1) contrast(1.25) brightness(.95)'], ['Cinematic', 'contrast(1.2) saturate(.8) brightness(.92) hue-rotate(-12deg) sepia(.12)'], ['Vintage', 'sepia(.55) contrast(.95) saturate(.9) brightness(1.05)'], ['Golden', 'sepia(.3) saturate(1.4) brightness(1.05) hue-rotate(-15deg)']];
  const pr0 = $('.process');
  if (pr0) {
    const gs = el('section', 'techstack-section grade', `<div class="techstack-header"><h2 data-i18n="grade_title">Color Grading Playground</h2><p data-i18n="grade_desc">Pick a look and drag the slider to compare before / after.</p></div><div class="cmp" style="--p:50%"><img src="${gsrc}" alt="" loading="lazy"><img class="gr" src="${gsrc}" alt="" loading="lazy"><i class="hd"></i><span class="lb a">Before</span><span class="lb b">After</span></div><input class="rng" type="range" min="0" max="100" value="50" aria-label="compare"><div class="chips looks">${LK.map(([n], i) => `<button class="chip ${i === 1 ? 'on' : ''}" data-l="${i}">${n}</button>`).join('')}</div>`);
    pr0.after(gs); const cmp = gs.querySelector('.cmp'), gr = gs.querySelector('.gr'); gr.style.filter = LK[1][1];
    gs.querySelector('.rng').oninput = e => cmp.style.setProperty('--p', e.target.value + '%');
    gs.querySelector('.looks').onclick = e => { const b = e.target.closest('[data-l]'); if (!b) return; gs.querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === b)); gr.style.filter = LK[b.dataset.l][1]; haptic(); };
  }
  // next free date (from Admin busy dates)
  const busy = new Set(String(O.busyDates || '').split(/[,\s]+/).filter(Boolean)), ymd = d => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  if (busy.size) {
    const d = new Date(); let n = 0; do { d.setDate(d.getDate() + 1); n++; } while (busy.has(ymd(d)) && n < 120);
    const nf = el('p', 'nextfree', `${ic('check', 16)} <span data-i18n="nextfree">Next free date</span>: <b>${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</b>`);
    const hcta = $('.hero-cta'); if (hcta) hcta.after(nf);
    bm.addEventListener('change', ev => { if (ev.target.id === 'bd' && busy.has(ev.target.value)) toast('Booked · ថ្ងៃនេះពេញ'); });
  }
  addEventListener('keydown', e => { if (e.key !== 'Escape') return; bm.classList.remove('open'); closeToday(); const x = $('.vf-x'); if (x) x.click(); });
})();
