/* MCFILMS 2026 — interacciones (sin dependencias; Lenis opcional para scroll suave) */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const WA = '593998400211';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const enc = p => p.split('/').map(encodeURIComponent).join('/');
  const money = n => n.toLocaleString('en-US');
  const conn = navigator.connection || {};
  const lowData = conn.saveData || /2g|3g/.test(conn.effectiveType || '');
  const img = (n, alt = '', cls = '') => `<img class="${cls}" src="img/${n}-s.webp" srcset="img/${n}-s.webp 1100w, img/${n}.webp 2400w" sizes="(max-width: 1080px) 100vw, 50vw" alt="${alt}" loading="lazy" decoding="async">`;

  /* ═════════ DATOS (editar aquí) ═════════ */

  const PLANES = {
    bodas: [
      { n: 'Diamante', h: '10 horas', p: 1649, img: 'velo-pasto', tag: 'Premium', cubre: ['reel', 'arreglo', 'std', 'mirror', '360'], items: ['Arreglo de ambos novios', 'Save the Date · Pre o Post boda', 'Ceremonia y recepción', 'Tomas y vuelo con drone', 'Magic Mirror 1h (o cabina 360)', 'Impresiones ilimitadas · marco propio', 'Video cinema · 17 min', 'Video fiesta · 45 min', 'Video redes · 3 min', 'Álbum 30×30 · 25 hojas (90–120 fotos)', 'Caja decorativa para el álbum', 'Acceso web · 30 días (opc. 1 año)'] },
      { n: 'Oro', h: '9 horas', p: 1349, img: 'arco', tag: 'Más elegido', cubre: ['reel', 'arreglo'], items: ['Arreglo de ambos novios', 'Ceremonia religiosa', 'Salón de recepciones', 'Tomas y vuelo con drone', 'Video cinema · 14 min', 'Video fiesta · 35 min', 'Video reel · 2 min', 'Material fotográfico digital', 'Álbum 30×30 · 20 hojas (70–90 fotos)', 'Acceso web · 30 días (opc. 1 año)'], ind: 'Individual: Foto 9h $819 · Video 9h $879 · Hora extra $99' },
      { n: 'Plata', h: '7 horas', p: 1149, img: 'luces', cubre: ['reel', 'arreglo'], items: ['Arreglo solo novia', 'Ceremonia religiosa', 'Salón de recepciones', 'Tomas y vuelo con drone', 'Video cinema · 12 min', 'Video fiesta · 30 min', 'Video reel · 1 min', 'Material fotográfico digital', 'Álbum 30×30 · 15 hojas (50–70 fotos)', 'Acceso web · 30 días (opc. 1 año)'], ind: 'Individual: Foto 7h $709 · Video 7h $769 · Hora extra $99' },
      { n: 'Bronce', h: '5 horas', p: 949, img: 'caminando', items: ['Ceremonia religiosa', 'Salón de recepciones', 'Tomas y vuelo con drone', 'Video cinema · 10 min', 'Video fiesta · 20 min', 'Material fotográfico digital', 'Álbum 30×30 · 10 hojas (30–50 fotos)', 'Acceso web · 30 días (opc. 1 año)'], ind: 'Individual: Foto 5h $629 · Video 5h $689 · Hora extra $99' }
    ],
    quince: [
      { n: 'Plata', h: '5 horas', p: 699, img: 'retrato', cubre: ['reel'], items: ['Salón de recepciones', 'Sesión el mismo día del evento', 'Video cinema · 10 min', 'Video fiesta · 20 min', 'Video reel · 1 min', 'Material fotográfico digital', 'Álbum 30×30 · 10 hojas', 'Acceso web con contraseña · 30 días'] },
      { n: 'Oro', h: '7 horas', p: 965, img: 'novia-ventana', tag: 'Más elegido', cubre: ['reel'], items: ['Sesión en casa de la quinceañera', 'Ceremonia religiosa', 'Salón de recepciones', 'Tomas y vuelo con dron', 'Video cinema · 12 min', 'Video fiesta · 25 min', 'Video reel · 1 min', 'Material fotográfico digital', 'Álbum 30×30 · 15 hojas (70 fotos)', 'Acceso web con contraseña · 30 días'] },
      { n: 'Diamante', h: '9 horas', p: 1229, img: 'escalera', tag: 'Premium', cubre: ['reel', 'std'], items: ['Sesión Pre-Quince adicional', 'Sesión en casa de la quinceañera', 'Ceremonia religiosa', 'Salón de recepciones', 'Tomas y vuelo con dron', 'Video cinema · 15 min', 'Video fiesta · 40 min', 'Video reel · 1 min', 'Material fotográfico digital', 'Álbum 30×30 · 20 hojas'] }
    ],
    destino: [
      { n: 'Destino Plata', h: '9 horas', p: 1670, suf: '+ viáticos', img: 'paramo', items: ['Arreglo de los novios', 'Ceremonia religiosa', 'Salón de recepciones', 'Post boda el mismo día', 'Tomas y vuelo con dron', 'Video cinema · 15 min', 'Video fiesta · 40 min', 'Video redes · 2 min', 'Material fotográfico digital', 'Álbum 30×30 · 90–120 fotos'] },
      { n: 'Destino Oro', h: '12 horas', p: 1870, suf: '+ viáticos', img: 'montana', tag: 'Premium', items: ['Llegamos 24h antes a reconocer locaciones', 'Arreglo de los novios', 'Ceremonia religiosa', 'Salón de recepciones', 'Post boda el mismo día', 'Tomas y vuelo con dron', 'Video cinema · 20 min', 'Video fiesta · 45 min', 'Video redes · 3 min', 'Álbum 30×30'] }
    ],
    espejo: [
      { n: 'Espejo 1', h: '1 hora', p: 350, img: 'risas', items: ['1 hora de espejo mágico', 'Impresión de fotos ilimitada', 'Diseño personalizado', 'Fotos digitales por enlace'] },
      { n: 'Espejo 2', h: '2 horas', p: 500, img: 'fiesta', tag: 'Más elegido', items: ['2 horas de espejo mágico', 'Impresión de fotos ilimitada', 'Diseño personalizado', 'Fotos digitales por enlace', 'Álbum de recuerdos con firmas'] },
      { n: 'Corporativo', h: '3 horas', p: 650, img: 'petalos', items: ['3 horas de espejo mágico', 'Marcos con tu marca', 'Impresión de fotos ilimitada', 'Fotos digitales por enlace'] },
      { n: 'Video 360', h: '1 hora', p: 220, img: 'fiesta2', items: ['1 hora de máquina video 360', 'Videos por código QR', 'Pistola de burbujas'] }
    ]
  };

  // Arma tu plan: precio por horas (interpola entre puntos; después del último suma "hora")
  const PRECIOS = {
    boda: { fv: { 5: 949, 7: 1149, 9: 1349 }, foto: { 5: 629, 7: 709, 9: 819 }, video: { 5: 689, 7: 769, 9: 879 }, hora: 99 },
    quince: { fv: { 5: 699, 7: 965, 9: 1229 }, foto: { 5: 449, 7: 609, 9: 779 }, video: { 5: 489, 7: 659, 9: 829 }, hora: 99 } // foto/video quince: confirmar
  };
  // ⚠️ Los marcados "confirmar" son estimados
  const EXTRAS = [
    { id: 'drone', n: 'Drone', p: 0, inc: true },
    { id: 'reel', n: 'Video reel redes · 1 min', p: 80 },   // confirmar
    { id: 'arreglo', n: 'Arreglo de novios', p: 120 },      // confirmar
    { id: 'std', n: 'Sesión Pre o Post boda', p: 250 },     // confirmar
    { id: 'mirror', n: 'Magic Mirror · 1h', p: 350 },
    { id: '360', n: 'Video 360 · 1h', p: 220 },
    { id: 'album', n: 'Álbum 30×30 · +5 hojas', p: 90 },    // confirmar
    { id: 'web', n: 'Acceso web · 1 año', p: 40 }           // confirmar
  ];

  const FILMS = [
    ['3 Juan & Sydney Wedding Redes.mp4', 'Juan & Sydney', 'Wedding film'],
    ['3 Marco & Elizabeth Wedding Redes.mp4', 'Marco & Elizabeth', 'Wedding film'],
    ['4 Paula  & Santiago Wedding Reel.mp4', 'Paula & Santiago', 'Reel'],
    ['3 Adriana & Andres Wedding Redes.mp4', 'Adriana & Andrés', 'Wedding film'],
    ['3 Minky & Milena Wedding Reel.mp4', 'Minky & Milena', 'Reel'],
    ['Mishell & Juan.mp4', 'Mishell & Juan', 'Wedding film']
  ];

  const TEAM = [
    ['6-Jose-Andres-Mercado', 'José Andrés Mercado', 'Gerente General · Co-fundador'],
    ['2-Javier_Mercado-', 'Javier Mercado', 'Director Creativo · Co-fundador'],
    ['3-David_Balseca', 'David Balseca', 'Director de Fotografía'],
    ['4-Bryan_Espinoza-', 'Bryan Espinoza', 'Director de Video'],
    ['5-Andrea_Mercado', 'Andrea Mercado', 'Directora de Operaciones']
  ];

  // ⚠️ Reemplazar por reseñas reales de clientes (Google / Instagram)
  const QUOTES = [
    ['Cuando vimos el video por primera vez, los dos lloramos. MCFILMS capturó exactamente la magia de ese día.', 'Sofía & Mateo', 'Cuenca'],
    ['Lo que más nos sorprendió fue lo discretos que fueron. Casi no los vimos, pero capturaron absolutamente todo.', 'Valentina & Carlos', 'Guayaquil'],
    ['Desde la primera reunión entendieron lo que queríamos. El resultado superó todas nuestras expectativas.', 'Ana & Diego', 'Cuenca'],
    ['Nos hicieron sentir súper cómodos. Tienen un ojo increíble para la luz y la estética.', 'Camila & Sebastián', 'Quito'],
    ['Teníamos miedo de posar, pero su dirección fue tan natural que nos olvidamos de las cámaras.', 'Paula & Gabriel', 'Guayaquil'],
    ['Elegimos el Plan Diamante y valió cada centavo. La sesión post boda fue divertidísima.', 'Estefanía & David', 'Cuenca']
  ];

  const GRUPOS = {
    'Recepción': ['Recepcion'], 'Planners': ['Wedding Planner'], 'Decoración': ['Decoración'],
    'Música': ['Dj', 'Orquesta', 'Banda', 'Musica Iglesia', 'Musica', 'Violin', 'Dj & Effects', 'Dj Y Effects', 'Musica Y Produccion', 'Sonido Y Montaje'],
    'Belleza': ['Make Up', 'Hair'], 'Moda': ['Dress', 'Trajes Novio'],
    'Show': ['Show Hora Loca', 'Pirotecnia Y Effects', 'Magic Mirror Y Maq 360'], 'Más': ['Dulces', 'Cerveza Artesanal', 'Vehiculos Bodas']
  };
  const nombreCat = { 'Recepcion': 'Recepción', 'Dj': 'DJ', 'Musica': 'Música', 'Musica Iglesia': 'Música iglesia', 'Violin': 'Violín', 'Dress': 'Vestidos', 'Vehiculos Bodas': 'Vehículos', 'Show Hora Loca': 'Hora loca' };

  /* ═════════ LOADER + HERO ═════════ */
  const heroImg = $('#hero-media img'), hv = $('#hero-video');
  const lNum = $('#l-num');
  let pct = 0;
  const tick = setInterval(() => { pct = Math.min(pct + 3 + Math.random() * 6, 94); lNum.textContent = String(Math.round(pct)).padStart(3, '0'); }, 60);
  const imgReady = heroImg.complete ? Promise.resolve() : new Promise(r => { heroImg.onload = heroImg.onerror = r; });
  Promise.all([imgReady, document.fonts ? document.fonts.ready : 0, new Promise(r => setTimeout(r, reduce ? 0 : 1700))]).then(() => {
    clearInterval(tick); lNum.textContent = '100';
    setTimeout(() => {
      $('#loader').classList.add('out');
      document.body.classList.remove('loading');
      document.body.classList.add('ready');
      setTimeout(() => $('#loader').remove(), 1200);
      if (!lowData) {
        hv.src = '../Videos%20Web/7.mp4';
        hv.addEventListener('canplay', () => { hv.classList.add('on'); }, { once: true });
        hv.play().catch(() => {});
      }
    }, 250);
  });
  const svgMuted = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m23 9-6 6M17 9l6 6"/></svg>';
  const svgOn = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>';
  $('#sound').addEventListener('click', () => {
    if (!hv.src) { hv.src = '../Videos%20Web/7.mp4'; hv.classList.add('on'); }
    hv.muted = !hv.muted; hv.play().catch(() => {});
    $('#sound').innerHTML = hv.muted ? svgMuted : svgOn;
  });

  /* ═════════ SCROLL SUAVE ═════════ */
  let lenis = null;
  window.addEventListener('load', () => {
    if (!reduce && window.Lenis && matchMedia('(hover: hover)').matches) {
      lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  });
  const goTo = target => {
    const el = typeof target === 'string' ? $(target) : target; if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: el.id === 'top' ? 0 : -20, duration: 1.4 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href').length < 2) return;
    e.preventDefault(); toggleMenu(false); goTo(a.getAttribute('href'));
  });

  /* ═════════ MENÚ ═════════ */
  const menuBtn = $('#menu-btn');
  function toggleMenu(open) {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    if (lenis) open ? lenis.stop() : lenis.start();
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }
  menuBtn.addEventListener('click', () => toggleMenu(!document.body.classList.contains('menu-open')));
  addEventListener('keydown', e => { if (e.key === 'Escape') { toggleMenu(false); closeModal(); } });

  /* ═════════ STATEMENT: palabras se encienden ═════════ */
  const st = $('#statement');
  st.innerHTML = st.innerHTML.replace(/(<span class="hl">([^<]+)<\/span>)|([^\s<]+)/g, (m, sp, inner, w) => sp ? `<span class="w hl">${inner}</span>` : `<span class="w">${w}</span>`);
  const words = $$('.w', st);

  /* ═════════ PELÍCULAS ═════════ */
  const track = $('#track');
  track.innerHTML = FILMS.map(([f, n, t], i) => `
    <article class="film" data-src="../Galeria%20Videos/${enc(f)}" tabindex="0" role="button" aria-label="Ver película de ${n}">
      <div class="film-v">
        <video muted loop playsinline preload="metadata" src="../Galeria%20Videos/previews/${enc(f)}#t=1"></video>
        <span class="play-sq"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg></span>
      </div>
      <div class="film-t"><b>${n}</b><span>${String(i + 1).padStart(2, '0')} · ${t}</span></div>
    </article>`).join('');
  $('#f-tot').textContent = String(FILMS.length).padStart(2, '0');
  const films = $$('.film', track);
  let activeFilm = -1;
  const setFilm = i => {
    if (i === activeFilm) return; activeFilm = i;
    films.forEach((f, k) => {
      const v = $('video', f); f.classList.toggle('on', k === i);
      if (k === i) v.play().catch(() => {}); else v.pause();
    });
    $('#f-now').textContent = String(i + 1).padStart(2, '0');
  };
  films.forEach(f => {
    const open = () => openModal(f.dataset.src);
    f.addEventListener('click', open);
    f.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
  });
  track.addEventListener('scroll', () => { // móvil: swipe
    const c = track.scrollLeft + track.clientWidth / 2;
    let best = 0, bd = 1e9;
    films.forEach((f, k) => { const d = Math.abs(f.offsetLeft + f.offsetWidth / 2 - c); if (d < bd) { bd = d; best = k; } });
    setFilm(best);
  }, { passive: true });

  /* ═════════ REEL BANDA ═════════ */
  const band = $('#band-reel'), bandV = $('video', band);
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !lowData) { if (!bandV.src) bandV.src = bandV.dataset.src; bandV.play().catch(() => {}); } else bandV.pause();
  }), { threshold: .3 }).observe(band);
  band.addEventListener('click', e => { e.preventDefault(); openModal(band.dataset.src, true); });

  /* Modal */
  const modal = $('#modal'), mv = $('#modal-v');
  function openModal(src, sound) { mv.src = src; mv.muted = false; modal.classList.add('open'); mv.play().catch(() => {}); if (lenis) lenis.stop(); }
  function closeModal() { if (!modal.classList.contains('open')) return; modal.classList.remove('open'); mv.pause(); mv.removeAttribute('src'); mv.load(); if (lenis) lenis.start(); }
  $('#modal-x').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  /* ═════════ PLANES: lista + escenario ═════════ */
  const pList = $('#p-list'), stage = $('#stage'), dots = $('#stage-dots');
  let group = 'bodas', activePlan = -1;
  const renderPlans = g => {
    group = g; activePlan = -1;
    const list = PLANES[g];
    pList.innerHTML = list.map((p, i) => `
      <li class="p-item" data-i="${i}">
        <div class="p-row"><h3 class="p-name">${p.n}</h3><div class="p-price">$${money(p.p)}<small>${p.suf || '+ IVA'}</small></div></div>
        <div class="p-body">
          <div class="p-meta"><span>${p.h} de cobertura</span>${p.tag ? `<span class="p-tag">${p.tag}</span>` : ''}</div>
          <ul class="p-inc">${p.items.map(t => `<li>${t}</li>`).join('')}</ul>
          ${p.ind ? `<p class="p-ind">${p.ind}</p>` : ''}
          <a class="btn btn-k" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(`Hola MCFILMS, me interesa el plan ${p.n} (${p.h}). ¿Tienen disponible mi fecha?`)}">Reservar ${p.n}</a>
        </div>
      </li>`).join('');
    $$('img', stage).forEach(i => i.remove());
    stage.insertAdjacentHTML('afterbegin', list.map(p => img(p.img, `Plan ${p.n} MCFILMS`)).join(''));
    dots.innerHTML = list.map(() => '<i></i>').join('');
    setPlan(0);
  };
  const setPlan = i => {
    if (i === activePlan) return; activePlan = i;
    const p = PLANES[group][i];
    $$('.p-item', pList).forEach((el, k) => el.classList.toggle('on', k === i));
    $$('img', stage).forEach((el, k) => el.classList.toggle('on', k === i));
    $$('i', dots).forEach((el, k) => el.classList.toggle('on', k === i));
    $('#st-name').textContent = p.n;
    $('#st-meta').innerHTML = `${p.h}<br>$${money(p.p)} ${p.suf || '+ IVA'}`;
  };
  pList.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    const li = e.target.closest('.p-item'); if (!li) return;
    lockPlan = Date.now(); setPlan(+li.dataset.i);
  });
  let lockPlan = 0;
  $$('.cat').forEach(c => c.addEventListener('click', () => {
    $$('.cat').forEach(x => x.classList.toggle('on', x === c));
    renderPlans(c.dataset.g); lockPlan = Date.now();
  }));

  /* ═════════ ARMA TU PLAN ═════════ */
  const stt = { evento: 'boda', servicio: 'fv', horas: 7, extras: new Set(['drone']) };
  const extrasEl = $('#extras');
  extrasEl.innerHTML = EXTRAS.map(x => `
    <button class="opt extra${x.inc ? ' on' : ''}" data-id="${x.id}" ${x.inc ? 'disabled' : ''}>
      <span class="ck"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0b0b0c" stroke-width="3.2"><path d="m5 12 5 5 9-10"/></svg></span>
      <b>${x.n}</b><span class="pr">${x.inc ? 'Incluido' : '+$' + x.p}</span>
    </button>`).join('');
  const precioBase = () => {
    const t = PRECIOS[stt.evento], pts = t[stt.servicio], hs = Object.keys(pts).map(Number).sort((a, b) => a - b);
    const h = stt.horas, last = hs[hs.length - 1];
    if (h >= last) return pts[last] + (h - last) * t.hora;
    for (let i = 0; i < hs.length - 1; i++) if (h >= hs[i] && h <= hs[i + 1]) return Math.round(pts[hs[i]] + (pts[hs[i + 1]] - pts[hs[i]]) * (h - hs[i]) / (hs[i + 1] - hs[i]));
    return pts[hs[0]];
  };
  const totalEl = $('#total');
  let shown = 0, raf;
  const animateTo = v => {
    cancelAnimationFrame(raf);
    const from = shown, t0 = performance.now();
    const step = now => { const k = Math.min(1, (now - t0) / 600), e = 1 - Math.pow(1 - k, 4); shown = Math.round(from + (v - from) * e); totalEl.textContent = money(shown); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  };
  const labels = { fv: 'Foto + Video', foto: 'Solo foto', video: 'Solo video', boda: 'Boda', quince: 'Quinceaños' };
  const calc = () => {
    const base = precioBase(), ex = EXTRAS.filter(x => stt.extras.has(x.id));
    const total = base + ex.reduce((s, x) => s + x.p, 0);
    animateTo(total); $('#mini-total').textContent = '$' + money(total);
    $('#sum-list').innerHTML = `<li><span>${labels[stt.evento]} · ${labels[stt.servicio]} · ${stt.horas}h</span><span>$${money(base)}</span></li>` +
      ex.map(x => `<li><span>${x.n}</span><span>${x.inc ? 'Incluido' : '$' + x.p}</span></li>`).join('');
    const tip = $('#sum-tip'), grupo = stt.evento === 'boda' ? PLANES.bodas : PLANES.quince;
    const pagados = ex.filter(x => !x.inc).map(x => x.id);
    const mejor = stt.servicio === 'fv' && pagados.length > 0 && [...grupo].sort((a, b) => a.p - b.p).find(p => parseInt(p.h) >= stt.horas && p.p < total &&
      pagados.every(id => (p.cubre || []).includes(id)));
    tip.classList.toggle('show', !!mejor);
    if (mejor) tip.innerHTML = `El <b>Plan ${mejor.n}</b> (${mejor.h}) ya incluye lo que elegiste por $${money(mejor.p)}. Ahorras $${money(total - mejor.p)}. <a href="#planes">Ver plan</a>`;
    const msg = `Hola MCFILMS, armé mi plan en la web:\n• ${labels[stt.evento]} · ${labels[stt.servicio]} · ${stt.horas} horas\n${ex.filter(x => !x.inc).map(x => `• ${x.n}`).join('\n')}\nTotal estimado: $${money(total)} + IVA\n¿Tienen disponible mi fecha?`;
    $('#send-wa').href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    stt.resumen = msg;
  };
  $$('.seg').forEach(seg => seg.addEventListener('click', e => {
    const o = e.target.closest('.opt'); if (!o) return;
    $$('.opt', seg).forEach(x => x.classList.toggle('on', x === o)); stt[seg.dataset.k] = o.dataset.v; calc();
  }));
  extrasEl.addEventListener('click', e => {
    const o = e.target.closest('.extra'); if (!o || o.disabled) return;
    const id = o.dataset.id; stt.extras.has(id) ? stt.extras.delete(id) : stt.extras.add(id); o.classList.toggle('on'); calc();
  });
  const hrs = $('#hrs');
  const onHrs = () => { stt.horas = +hrs.value; $('#hrs-v').textContent = hrs.value; hrs.style.setProperty('--p', ((hrs.value - hrs.min) / (hrs.max - hrs.min) * 100) + '%'); calc(); };
  hrs.addEventListener('input', onHrs);
  $('#send-mail').addEventListener('click', () => { $('#f-msg').value = stt.resumen || ''; $('#f-plan').value = 'Plan armado en la web'; });
  // Barra flotante (móvil)
  const mini = $('#mini');
  const vis = { card: false, sum: false };
  const updMini = () => { const on = vis.card && !vis.sum && innerWidth <= 1080 && $('#nosotros').getBoundingClientRect().top > innerHeight * .6; mini.classList.toggle('show', on); document.body.classList.toggle('mini-on', on); };
  new IntersectionObserver(es => es.forEach(e => { vis.card = e.isIntersecting; updMini(); })).observe($('.b-card'));
  new IntersectionObserver(es => es.forEach(e => { vis.sum = e.isIntersecting; updMini(); })).observe($('.summary'));
  mini.addEventListener('click', () => goTo('.summary'));

  /* ═════════ EQUIPO / TESTIMONIOS / IG ═════════ */
  $('#team').innerHTML = TEAM.map(([f, n, r], i) => `<div class="member rv d${i % 4}"><figure><img src="../Mcfilms%20Teams/${enc(f)}.webp" alt="${n}, ${r} en MCFILMS" loading="lazy"></figure><b>${n}</b><span>${r}</span></div>`).join('');
  const q = QUOTES.map(([t, n, c]) => `<blockquote class="quote"><div class="stars">★★★★★</div><p>“${t}”</p><footer><b>${n}</b>${c}</footer></blockquote>`).join('');
  $('#quotes').innerHTML = q + q;
  $('#ig-grid').innerHTML = ['bosque', 'auto', 'calle', 'jardin', 'bota', 'hindu'].map(n =>
    `<a href="https://www.instagram.com/mcfilms_ecuador/" target="_blank" rel="noopener" aria-label="Ver en Instagram"><img src="img/${n}-s.webp" alt="" loading="lazy"></a>`).join('');
  $('.wave').innerHTML = Array.from({ length: 32 }, (_, i) => `<i style="animation-delay:${(i * 97 % 1400) / 1000}s"></i>`).join('');

  /* ═════════ DIRECTORIO ═════════ */
  let provs = [], cat = 'Todos', limit = 10;
  const grupoDe = c => Object.keys(GRUPOS).find(g => GRUPOS[g].includes(c)) || 'Más';
  const dirEl = $('#dir'), moreBtn = $('#dir-more');
  const renderDir = () => {
    const qv = $('#dir-q').value.trim().toLowerCase();
    const list = provs.filter(p => (cat === 'Todos' || p.g === cat) && (!qv || (p.name + p.cat + p.ig + p.resp).toLowerCase().includes(qv)));
    dirEl.innerHTML = list.slice(0, limit).map(p => `
      <div class="prov"><small>${nombreCat[p.cat] || p.cat}</small><b>${p.name}</b><span>${p.ig}</span>
      <a href="${p.link}" target="_blank" rel="noopener">${p.link.includes('wa.me') ? 'WhatsApp' : 'Instagram'} →</a></div>`).join('') || '<p class="dir-empty">No encontramos proveedores con esa búsqueda.</p>';
    moreBtn.parentElement.style.display = list.length > limit ? '' : 'none';
  };
  fetch('proveedores.json?v=1791603233').then(r => r.json()).then(d => {
    provs = d.map(p => ({ ...p, g: grupoDe(p.cat) }));
    $('#chips').innerHTML = ['Todos', ...Object.keys(GRUPOS)].map(g => `<button class="chip${g === 'Todos' ? ' on' : ''}">${g}</button>`).join('');
    renderDir();
  }).catch(() => { dirEl.innerHTML = '<p class="dir-empty">No se pudo cargar el directorio.</p>'; });
  $('#chips').addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    $$('.chip').forEach(x => x.classList.toggle('on', x === c)); cat = c.textContent; limit = 10; renderDir();
  });
  $('#dir-q').addEventListener('input', () => { limit = 10; renderDir(); });
  moreBtn.addEventListener('click', () => { limit += 10; renderDir(); });

  /* ═════════ REVELADOS + CONTADORES ═════════ */
  const count = el => {
    const end = +el.dataset.count, suf = el.dataset.suf || '', pre = el.dataset.pre ? '<i>+</i>' : '', t0 = performance.now();
    const step = now => { const k = Math.min(1, (now - t0) / 1800), e = 1 - Math.pow(1 - k, 3); el.innerHTML = pre + Math.round(end * e) + suf; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); $$('[data-count]', e.target).forEach(count); io.unobserve(e.target);
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  const observeAll = () => $$('.rv:not(.in), .split:not(.in), .clip:not(.in)').forEach(el => io.observe(el));

  /* ═════════ LOOP DE SCROLL ═════════ */
  const nav = $('#nav'), heroMedia = $('#hero-media'), heroCopy = $('#hero-copy');
  const pars = $$('[data-par]'), filmsSec = $('#peliculas'), fBar = $('#f-bar');
  const desktop = () => innerWidth > 760;
  let lastY = 0, ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    // nav
    nav.classList.toggle('solid', y > vh - 90);
    document.body.classList.toggle('in-hero', y < vh * .6);
    const pr = pList.getBoundingClientRect();
    const inPlans = innerWidth <= 1080 && pr.top < vh && pr.bottom > 0; // en móvil la foto del plan se pega bajo el menú
    nav.classList.toggle('hide', y > lastY + 2 && y > vh * 1.3 && !inPlans && !document.body.classList.contains('menu-open'));
    if (inPlans) nav.classList.remove('hide');
    if (y < lastY - 2) nav.classList.remove('hide');
    lastY = y;
    // hero parallax
    if (!reduce && y < vh * 1.2) {
      const k = y / vh;
      heroMedia.style.transform = `scale(${1 + k * .06})`;
      heroCopy.style.transform = `translate3d(0,${-y * .25}px,0)`;
      heroCopy.style.opacity = clamp(1 - k * 1.8);
    }
    updMini();
    // tarjetas apiladas
    if (!reduce) panels.forEach((pn, i) => {
      const next = panels[i + 1];
      const nt = next ? next.getBoundingClientRect().top : vh;
      const k = clamp((vh - nt) / vh);
      const cov = nt <= 0; // tapada por completo: se oculta para no gastar batería
      if (cov !== !!pn._cov) { pn._cov = cov; pn.style.visibility = cov ? 'hidden' : ''; }
      if (k > 0.001) {
        pn.style.setProperty('--dim', (k * .72).toFixed(3));
        pn.style.transform = `scale(${(1 - k * .06).toFixed(4)})`;
        pn.style.transformOrigin = `50% ${-pn._top + vh / 2}px`;
      } else if (pn.style.transform) { pn.style.removeProperty('--dim'); pn.style.transform = ''; }
      if (i > 0) {
        const t = pn.getBoundingClientRect().top;
        const rr = t > 0 && t < vh ? Math.round(28 * clamp(t / (vh * .5))) : 0;
        pn.style.clipPath = rr ? `inset(0 round ${rr}px ${rr}px 0 0)` : '';
      }
    });
    if (hv.src) { if ($('#hero')._cov) hv.pause(); else if (hv.paused && !document.hidden) hv.play().catch(() => {}); }
    if (band._cov && !bandV.paused) bandV.pause();
    // statement
    const r = st.getBoundingClientRect();
    const lit = Math.round(clamp((vh * .95 - r.top) / (vh * .75)) * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < lit));
    // parallax imágenes
    if (!reduce) pars.forEach(im => { const b = im.parentElement.getBoundingClientRect(); if (b.bottom > 0 && b.top < vh) im.style.transform = `translate3d(0,${(b.top + b.height / 2 - vh / 2) * -.12}px,0)`; });
    // películas horizontales
    if (desktop()) {
      const fr = filmsSec.getBoundingClientRect();
      const p = clamp(-fr.top / (filmsSec.offsetHeight - vh));
      const dist = track.scrollWidth - innerWidth;
      track.style.transform = `translate3d(${-p * dist}px,0,0)`;
      fBar.style.transform = `scaleX(${p})`;
      if (fr.top < vh && fr.bottom > 0 && !filmsSec._cov) setFilm(Math.round(p * (films.length - 1)));
      else if (activeFilm > -1) { films.forEach(f => $('video', f).pause()); activeFilm = -1; }
    } else {
      const fr = filmsSec.getBoundingClientRect();
      if (fr.top < vh * .7 && fr.bottom > vh * .3 && !filmsSec._cov) { if (activeFilm < 0) setFilm(0); }
      else if (activeFilm > -1) { films.forEach(f => $('video', f).pause()); activeFilm = -1; }
    }
    // planes: activo según posición
    if (Date.now() - lockPlan > 900) {
      const items = $$('.p-item', pList);
      const sb = $('.p-stage').getBoundingClientRect();
      const line = innerWidth <= 1080 ? sb.bottom + (vh - sb.bottom) * .3 : vh * .45;
      const lr = pList.getBoundingClientRect();
      if (lr.top < vh && lr.bottom > 0) {
        let idx = 0;
        items.forEach((el, k) => { if (el.getBoundingClientRect().top < line) idx = k; });
        setPlan(idx);
      }
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  const panels = $$('main > .panel');
  const setTops = () => panels.forEach(pn => { pn._top = Math.min(0, innerHeight - pn.offsetHeight); pn.style.top = pn._top + 'px'; });
  addEventListener('resize', () => { setTops(); onScroll(); });
  addEventListener('load', setTops);
  new ResizeObserver(setTops).observe(document.querySelector('main'));

  /* Formulario */
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, btn = $('button[type=submit]', f);
    btn.disabled = true; btn.textContent = 'Enviando…';
    fetch(f.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(f) })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => { f.reset(); $('#form-ok').style.display = 'block'; btn.textContent = 'Enviado'; })
      .catch(() => { btn.disabled = false; btn.textContent = 'Reintentar'; alert('No se pudo enviar. Escríbenos a info@mcfilmsecuador.com o por WhatsApp.'); });
  });
  $('#yr').textContent = new Date().getFullYear();

  /* Init */
  renderPlans('bodas');
  onHrs();
  observeAll();
  setTops();
  onScroll();
})();
