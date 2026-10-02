(() => {
  const O = window.SITE_OVERRIDES || {}, $ = s => document.querySelector(s), L = O.links || {}, F = O.flags || {};
  if (O.brand) $('.brand-name').firstChild.textContent = O.brand + ' ';
  if (L.email) { const c = $('#copyEmailBtn'); c.dataset.email = L.email; c.querySelector('.email-text-val').textContent = L.email; }
  if (L.telegram) document.querySelectorAll('a[href*="t.me/"]').forEach(a => a.href = L.telegram);
  if (L.github) document.querySelectorAll('a[href*="github.com/"]').forEach(a => a.href = L.github);
  if (L.aba) document.querySelectorAll('a[href*="pay.ababank.com"]').forEach(a => a.href = L.aba);
  if (L.facebook) $('.social-btn.facebook').href = L.facebook;
  if (F.games === false) document.querySelectorAll('#iqgame,a[href="#iqgame"]').forEach(e => e.style.display = 'none');
  if (O.theme && !localStorage.getItem('site_theme_color')) { $('.color-dot.' + O.theme)?.click(); localStorage.removeItem('site_theme_color'); }

  // announcement banner
  const bt = O.banner && O.banner.text;
  if (bt && sessionStorage.getItem('ann') !== bt) {
    const b = document.createElement('div'); b.className = 'announce';
    b.innerHTML = `<span>${ic('megaphone', 16)} ${bt}</span><button aria-label="close">${ic('x', 16)}</button>`;
    b.querySelector('button').onclick = () => { b.remove(); sessionStorage.setItem('ann', bt); };
    document.body.prepend(b);
  }

  // typewriter roles
  const R = O.roles && O.roles.length ? O.roles : ['Graphic Designer', 'Photographer', 'Videographer'], d = $('.hero-desc');
  if (d) {
    const p = document.createElement('p'); p.className = 'typer'; p.innerHTML = '' + ic('zap', 18) + ' <span></span><i class="caret"></i>'; d.before(p);
    const t = p.querySelector('span'); let r = 0, i = 0, del = 0;
    const step = () => {
      const w = R[r]; i += del ? -1 : 1; t.textContent = w.slice(0, i); let ms = del ? 35 : 70;
      if (!del && i === w.length) { del = 1; ms = 1400; } else if (del && i === 1) { del = 0; r = (r + 1) % R.length; ms = 120; }
      setTimeout(step, ms);
    };
    matchMedia('(prefers-reduced-motion: reduce)').matches ? t.textContent = R[0] : step();
  }

  // floating buttons + website QR
  const fw = document.createElement('div'); fw.className = 'fab-wrap';
  fw.innerHTML = '<button class="fab" id="qrBtn" title="QR">'+ic('qr',22)+'</button><button class="fab" id="topBtn" title="Top">'+ic('up',22)+'</button>'; document.body.append(fw);
  const m = document.createElement('div'); m.className = 'modal';
  m.innerHTML = '<div class="modal-card"><button class="modal-x">'+ic('x',20)+'</button><h3>QR Code · គេហទំព័រ</h3><div id="qrBox"></div><small id="qrUrl"></small><div class="qr-actions"><button class="btn-glow" id="qrDl">'+ic('download',16)+' PNG</button><button class="btn-glass" id="qrCopy">'+ic('link',16)+' Copy link</button></div></div>'; document.body.append(m);
  const url = O.siteUrl || location.href.split('#')[0]; $('#qrUrl').textContent = url; let made = 0;
  const open = o => {
    m.classList.toggle('open', o);
    if (o && !made && window.QRCode) { new QRCode($('#qrBox'), { text: url, width: 240, height: 240, colorDark: '#0b1020', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H }); made = 1; }
  };
  $('#qrBtn').onclick = () => open(1); m.querySelector('.modal-x').onclick = () => open(0);
  m.onclick = e => e.target === m && open(0); addEventListener('keydown', e => e.key === 'Escape' && open(0));
  $('#qrDl').onclick = () => { const c = $('#qrBox canvas'), a = document.createElement('a'); a.href = c ? c.toDataURL('image/png') : $('#qrBox img').src; a.download = 'website-qr.png'; a.click(); };
  $('#qrCopy').onclick = e => { const b = e.currentTarget; navigator.clipboard.writeText(url).then(() => { b.innerHTML = ic('check', 16) + ' Copied'; setTimeout(() => b.innerHTML = ic('link', 16) + ' Copy link', 1500); }); };
  const tb = $('#topBtn'); tb.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  addEventListener('scroll', () => tb.classList.toggle('show', scrollY > 600), { passive: true });

  // preloader
  const pl = document.createElement('div'); pl.className = 'preloader'; pl.innerHTML = '<img src="LOGO-2.webp" alt="" width="84" height="84"><i></i>'; document.body.append(pl);
  const hide = () => { pl.classList.add('off'); setTimeout(() => pl.remove(), 700); };
  document.readyState === 'complete' ? setTimeout(hide, 300) : addEventListener('load', () => setTimeout(hide, 250)); setTimeout(hide, 3500);
  // background grid
  const g = document.createElement('div'); g.className = 'bg-grid'; document.body.prepend(g);
  // skills marquee
  const hero = $('.hero-section');
  if (hero) { const row = ['Graphic Design', 'Photography', 'Videography', 'Graphic Design', 'Photography', 'Videography'].map(x => `<span>${x}</span>`).join(''); const mq = document.createElement('div'); mq.className = 'marquee'; mq.innerHTML = `<div class="track">${row}${row}</div>`; hero.after(mq); }
  // 3D tilt on cards (desktop only)
  if (matchMedia('(hover:hover)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches)
    document.querySelectorAll('.tech-card,.bento-box').forEach(el => {
      el.classList.add('tilt'); let r = 0;
      el.addEventListener('mousemove', e => { if (r) return; r = requestAnimationFrame(() => { const b = el.getBoundingClientRect(); el.style.setProperty('--ry', ((e.clientX - b.left) / b.width - .5) * 6 + 'deg'); el.style.setProperty('--rx', ((e.clientY - b.top) / b.height - .5) * -6 + 'deg'); r = 0; }); });
      el.addEventListener('mouseleave', () => { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); });
    });

  // profile photo: 3D tilt + shutter click effect + lightbox
  const fr = $('.image-frame'), pc = $('.image-frame-container');
  if (fr) {
    pc.addEventListener('mousemove', e => { const b = pc.getBoundingClientRect(); pc.style.setProperty('--px', ((e.clientX - b.left) / b.width - .5) * 14 + 'deg'); pc.style.setProperty('--py', ((e.clientY - b.top) / b.height - .5) * -14 + 'deg'); });
    pc.addEventListener('mouseleave', () => { pc.style.removeProperty('--px'); pc.style.removeProperty('--py'); });
    const lb = document.createElement('div'); lb.className = 'lightbox';
    lb.innerHTML = `<img src="${fr.querySelector('img').src}" alt=""><button class="modal-x">${ic('x', 22)}</button>`; document.body.append(lb);
    const closeLb = () => lb.classList.remove('open'); lb.onclick = closeLb; addEventListener('keydown', e => e.key === 'Escape' && closeLb());
    fr.addEventListener('click', e => {
      const r = fr.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      fr.classList.remove('shot'); void fr.offsetWidth; fr.classList.add('shot');
      for (let i = 0; i < 16; i++) { const s = document.createElement('i'); s.className = 'spark'; const a = i / 16 * 6.283, d = 70 + Math.random() * 80; s.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px`; fr.append(s); setTimeout(() => s.remove(), 900); }
      const rp = document.createElement('b'); rp.className = 'ripple'; rp.style.cssText = `left:${x}px;top:${y}px`; fr.append(rp); setTimeout(() => rp.remove(), 900);
      setTimeout(() => lb.classList.add('open'), 420);
    });
  }
  // inline website QR card
  const qc = $('.qr-card');
  if (qc && window.QRCode) {
    const card = document.createElement('div'); card.className = 'qr-card web';
    card.innerHTML = `<div class="qr-inline" id="qrInline"></div><div><b>QR គេហទំព័រ · Website QR</b><span>Scan to open this website on any phone.</span>${location.protocol === 'file:' && !O.siteUrl ? '<span class="qr-warn">Site មិនទាន់ online · QR នេះប្រើបានតែលើកុំព្យូទ័រនេះ។ បំពេញ Site URL ក្នុង Admin។</span>' : ''}<button class="btn-glass" id="qrDl2">${ic('download', 16)} PNG</button></div>`;
    qc.after(card);
    new QRCode($('#qrInline'), { text: url, width: 160, height: 160, colorDark: '#0b1020', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H });
    $('#qrDl2').onclick = () => { const c = $('#qrInline canvas'), a = document.createElement('a'); a.href = c ? c.toDataURL('image/png') : $('#qrInline img').src; a.download = 'website-qr.png'; a.click(); };
  }

  // cleanup + film grain
  $('.header-status-indicator')?.remove();
  const gr = document.createElement('div'); gr.className = 'bg-grain'; document.body.prepend(gr);
  // order buttons on skill cards (Telegram with prefilled text)
  const tg0 = (L.telegram || 'https://t.me/MAVY19000').split('?')[0];
  document.querySelectorAll('#techstack .tech-card').forEach(c => {
    const a = document.createElement('a'); a.className = 'card-cta'; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', 'Telegram');
    a.href = `${tg0}?text=${encodeURIComponent('សួស្តី ខ្ញុំចង់ទាក់ទងអំពី ' + c.querySelector('h4').textContent)}`; a.innerHTML = ic('ext', 18); c.append(a);
  });
  // gallery
  const gl = $('#gallery');
  if (gl) {
    const items = (O.gallery || []).filter(x => x.src);
    if (!items.length) {
      $('.gal-filter').style.display = 'none'; gl.className = 'gal-empty';
      gl.innerHTML = `${ic('camera', 36)}<p data-i18n="gal_empty">ស្នាដៃកំពុងត្រូវបានរៀបចំ។ ទាក់ទងខ្ញុំដើម្បីមើល Portfolio។</p><a class="btn-glow" href="${tg0}?text=${encodeURIComponent('សួស្តី ខ្ញុំចង់មើល Portfolio')}" target="_blank" rel="noopener" data-i18n="gal_cta">ស្នើសុំមើល Portfolio</a>`;
    } else {
      gl.innerHTML = items.map(x => `<figure data-cat="${x.cat}"><img src="${x.src}" alt="${x.title || ''}" loading="lazy" decoding="async"><figcaption>${x.title || ''}${x.desc ? '<small>' + x.desc + '</small>' : ''}</figcaption></figure>`).join('');
      const fl = document.querySelectorAll('.gal-filter [data-f]');
      fl.forEach(b => b.onclick = () => { fl.forEach(x => x.classList.toggle('active', x === b)); gl.querySelectorAll('figure').forEach(f => f.hidden = !(b.dataset.f === 'all' || f.dataset.cat === b.dataset.f)); });
      const glb = document.createElement('div'); glb.className = 'lightbox'; glb.innerHTML = `<img alt=""><button class="modal-x">${ic('x', 22)}</button>`; document.body.append(glb);
      gl.addEventListener('click', e => { const f = e.target.closest('figure'); if (!f) return; glb.querySelector('img').src = f.querySelector('img').src; glb.classList.add('open'); });
      glb.onclick = () => glb.classList.remove('open');
    }
  }
  // lite mode for phones / data saver
  if (matchMedia('(max-width:768px)').matches || (navigator.connection && navigator.connection.saveData)) document.documentElement.classList.add('lite');
})();
