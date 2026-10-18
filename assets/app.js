/* MCFILMS 2026 — interacciones (sin dependencias; Lenis opcional para scroll suave) */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const WA = '593998400211';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const enc = p => p.split('/').map(encodeURIComponent).join('/');
  const money = n => n.toLocaleString('en-US');
  const conn = navigator.connection || {};
  const lowData = conn.saveData || /2g|3g/.test(conn.effectiveType || '');
  const img = (n, alt = '', cls = '') => `<img class="${cls}" src="assets/img/${n}-s.webp" srcset="assets/img/${n}-s.webp 1100w, assets/img/${n}.webp 2400w" sizes="(max-width: 1080px) 100vw, 50vw" alt="${alt}" loading="lazy" decoding="async">`;

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
    { n: 'José Andrés Mercado', r: 'Gerente General · Co-fundador', img: 'team-jose2-v2', bio: 'Visionario y arquitecto del sueño que dio vida a MCFILMS en 2015. Más de diez años liderando producciones audiovisuales con mirada de cine, y la convicción de que cada boda merece tratarse como una obra.', tags: ['Dirección', 'Estrategia', 'Desde 2015'] },
    { n: 'Javier Mercado', r: 'Director Creativo · Co-fundador', img: 'team-javier-v2', bio: 'El alma creativa de MCFILMS. Define el estilo narrativo que convierte cada boda en una pieza cinematográfica: el ritmo, la música, el color y esa emoción que te hace volver a verla una y otra vez.', tags: ['Narrativa', 'Edición', 'Color'] },
    { n: 'David Balseca', r: 'Director de Fotografía', img: 'team-david', bio: 'Guardián de nuestro lenguaje visual. Ojo clínico para la luz, la composición y el color; lidera la fotografía y la postproducción que definen la estética premium de cada álbum.', tags: ['Fotografía', 'Luz', 'Retoque'] },
    { n: 'Bryan Espinoza', r: 'Director de Video', img: 'team-bryan-v2', bio: 'Mirada fresca, técnica y cinematográfica. Cuida la composición, el movimiento y la luz para que cada película se sienta auténtica, dinámica y memorable.', tags: ['Cámara', 'Drone', 'Movimiento'] },
    { n: 'Andrea Mercado', r: 'Directora de Operaciones', img: 'team-andrea-v2', bio: 'El pilar que hace que todo funcione. Coordina equipos, tiempos y entregas para que tu experiencia sea impecable desde la primera reunión hasta que recibes tu película.', tags: ['Coordinación', 'Entregas', 'Atención'] }
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
      hv.play().catch(() => {});
    }, 250);
  });
  // Video del inicio: aparece en cuanto empieza a reproducirse; si el celular bloquea el autoplay, arranca al primer toque
  const showHero = () => hv.classList.add('on');
  hv.addEventListener('playing', showHero);
  if (!hv.paused && hv.readyState > 2) showHero();
  hv.play().catch(() => {});
  ['touchstart', 'pointerdown', 'scroll'].forEach(ev => addEventListener(ev, () => { if (hv.paused && !$('#hero')._cov) hv.play().catch(() => {}); }, { once: true, passive: true }));
  const svgMuted = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m23 9-6 6M17 9l6 6"/></svg>';
  const svgOn = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>';
  $('#sound').addEventListener('click', () => {
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
  const words = $$('.w', st), stSec = st.closest('section');

  /* ═════════ PELÍCULAS ═════════ */
  const track = $('#track');
  track.innerHTML = FILMS.map(([f, n, t], i) => `
    <article class="film" data-src="Galeria%20Videos/${enc(f)}" tabindex="0" role="button" aria-label="Ver película de ${n}">
      <div class="film-v">
        <video muted loop playsinline preload="metadata" src="Galeria%20Videos/previews/${enc(f)}#t=1"></video>
        <span class="play-sq"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg></span>
      </div>
      <div class="film-t"><b>${n}</b><span>${t}</span></div>
    </article>`).join('');
  const films = $$('.film', track);
  let activeFilm = -1;
  const setFilm = i => {
    if (i === activeFilm) return; activeFilm = i;
    films.forEach((f, k) => {
      const v = $('video', f); f.classList.toggle('on', k === i);
      if (k === i) v.play().catch(() => {}); else v.pause();
    });
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

  /* ═════════ CARRUSELES EL INSTANTE / EL DETALLE ═════════ */
  $$('.slides').forEach((sl, n) => {
    const imgs = $$('img', sl), bar = $('.slide-bar i', sl), DUR = 4000;
    let i = 0, timer = null;
    const restartBar = () => { sl.classList.remove('run'); void bar.offsetWidth; sl.classList.add('run'); };
    const next = () => { imgs[i].classList.remove('on'); i = (i + 1) % imgs.length; imgs[i].classList.add('on'); restartBar(); };
    const tick = () => { next(); timer = setTimeout(tick, DUR); };
    const start = () => { if (timer || reduce) return; restartBar(); timer = setTimeout(tick, DUR); };
    const stop = () => { clearTimeout(timer); timer = null; sl.classList.remove('run'); };
    setTimeout(() => new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? start() : stop()), { threshold: .3 }).observe(sl), n * 2000); // desfasados
  });

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

  /* ═════════ ESCAPARATE: lista que se enciende + foto fija (planes y equipo) ═════════ */
  const showcases = [];
  const makeShowcase = (list, stage, dots, chip) => {
    const sc = { list, stage, dots, items: [], active: -1, lock: 0 };
    sc.set = i => {
      if (i === sc.active) return; sc.active = i;
      $$(':scope > li', list).forEach((el, k) => el.classList.toggle('on', k === i));
      $$('img', stage).forEach((el, k) => el.classList.toggle('on', k === i));
      $$('i', dots).forEach((el, k) => el.classList.toggle('on', k === i));
      chip(sc.items[i]);
    };
    sc.load = (items, html, pics) => {
      sc.items = items; sc.active = -1;
      list.innerHTML = items.map(html).join('');
      $$('img', stage).forEach(i => i.remove());
      stage.insertAdjacentHTML('afterbegin', pics.join(''));
      dots.innerHTML = items.map(() => '<i></i>').join('');
      sc.set(0);
    };
    list.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      const li = e.target.closest('li[data-i]'); if (!li) return;
      sc.lock = Date.now(); sc.set(+li.dataset.i);
    });
    sc.update = vh => { // activo según posición de scroll
      if (Date.now() - sc.lock < 900) return;
      const lr = list.getBoundingClientRect(); if (lr.top > vh || lr.bottom < 0) return;
      const sb = stage.parentElement.getBoundingClientRect();
      const line = innerWidth <= 1080 ? sb.bottom + (vh - sb.bottom) * .3 : vh * .45;
      let idx = 0;
      $$(':scope > li', list).forEach((el, k) => { if (el.getBoundingClientRect().top < line) idx = k; });
      sc.set(idx);
    };
    showcases.push(sc);
    return sc;
  };

  // Planes
  const pList = $('#p-list');
  const plans = makeShowcase(pList, $('#stage'), $('#stage-dots'), p => {
    $('#st-name').textContent = p.n; $('#st-meta').innerHTML = `${p.h}<br>$${money(p.p)} ${p.suf || '+ IVA'}`;
  });
  const renderPlans = g => plans.load(PLANES[g], (p, i) => `
      <li class="p-item" data-i="${i}">
        <div class="p-row"><h3 class="p-name">${p.n}</h3><div class="p-price">$${money(p.p)}<small>${p.suf || '+ IVA'}</small></div></div>
        <div class="p-body">
          <div class="p-meta"><span>${p.h} de cobertura</span>${p.tag ? `<span class="p-tag">${p.tag}</span>` : ''}</div>
          <ul class="p-inc">${p.items.map(t => `<li>${t}</li>`).join('')}</ul>
          ${p.ind ? `<p class="p-ind">${p.ind}</p>` : ''}
          <a class="btn btn-k" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(`Hola MCFILMS, me interesa el plan ${p.n} (${p.h}). ¿Tienen disponible mi fecha?`)}">Reservar ${p.n}</a>
        </div>
      </li>`, PLANES[g].map(p => img(p.img, `Plan ${p.n} MCFILMS`)));
  $$('.cat').forEach(c => c.addEventListener('click', () => {
    $$('.cat').forEach(x => x.classList.toggle('on', x === c));
    renderPlans(c.dataset.g); plans.lock = Date.now();
  }));

  // Equipo
  const crew = makeShowcase($('#c-list'), $('#c-stage'), $('#c-dots'), m => {
    $('#cs-name').textContent = m.n.split(' ')[0]; $('#cs-meta').textContent = m.r;
  });
  crew.load(TEAM, (m, i) => `
      <li class="p-item" data-i="${i}">
        <div class="p-row"><h3 class="p-name">${m.n}</h3></div>
        <div class="p-body">
          <div class="p-meta"><span>${m.r}</span></div>
          <p class="c-bio">${m.bio}</p>
          <div class="c-tags">${m.tags.map(t => `<span>${t}</span>`).join('')}</div>
        </div>
      </li>`, TEAM.map(m => `<img src="assets/img/${m.img}.webp" alt="${m.n}, ${m.r} en MCFILMS" loading="lazy" decoding="async">`));

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
  const q = QUOTES.map(([t, n, c]) => `<blockquote class="quote"><div class="stars">★★★★★</div><p>“${t}”</p><footer><b>${n}</b>${c}</footer></blockquote>`).join('');
  $('#quotes').innerHTML = q + q;
  // Instagram: columnas que se mueven en sentidos opuestos al hacer scroll
  const IGF = ['bosque', 'auto', 'calle', 'jardin', 'bota', 'hindu', 'risas', 'anillos', 'retrato', 'novia-ventana', 'fiesta', 'escalera', 'paramo', 'abrazo-velo', 'petalos'];
  const igCols = $('#ig-cols');
  igCols.innerHTML = [0, 1, 2, 3, 4].map(c => `<div class="ig-col">${[0, 1, 2, 3, 4, 5].map(r => {
    const n = IGF[(c * 3 + r * 2) % IGF.length];
    return `<a href="https://www.instagram.com/mcfilms.ec/" target="_blank" rel="noopener" aria-label="Ver en Instagram"><img src="assets/img/${n}-s.webp" alt="" loading="lazy" decoding="async"></a>`;
  }).join('')}</div>`).join('');
  const igColEls = $$('.ig-col', igCols);
  // Publicaciones reales de @mcfilms.ec (api/instagram.php). Si la API no responde, se quedan las fotos del portafolio.
  fetch('api/instagram.php').then(r => r.ok ? r.json() : null).then(d => {
    if (!d || !d.data || d.data.length < 6) return;
    const posts = d.data;
    igCols.innerHTML = [0, 1, 2, 3, 4].map(c => `<div class="ig-col">${[0, 1, 2, 3, 4, 5].map(r => {
      const p = posts[(c * 6 + r) % posts.length];
      return `<a href="${p.url}" target="_blank" rel="noopener" aria-label="Ver publicación en Instagram"><img src="${p.img}" alt="Publicación de MCFILMS en Instagram" loading="lazy" decoding="async" referrerpolicy="no-referrer"></a>`;
    }).join('')}</div>`).join('');
    igColEls.splice(0, igColEls.length, ...$$('.ig-col', igCols));
    const f = d.profile && d.profile.followers;
    if (f) $('#ig-followers').textContent = f >= 1000 ? (f / 1000).toFixed(f >= 10000 ? 0 : 1).replace('.0', '') + 'K' : f;
  }).catch(() => {});
  const wallCols = $('#wall-cols'), wallSec = $('.wall-sec');
  const WF = ['catedral', 'caminando', 'luces', 'arco', 'velo-pasto', 'montana', 'amigos', 'altar', 'retrato-velo', 'lago', 'calle', 'jardin', 'auto', 'petalos', 'abrazo-velo'];
  wallCols.innerHTML = [0, 1, 2, 3, 4].map(c => `<div class="ig-col">${[0, 1, 2, 3, 4, 5].map(r => `<span><img src="assets/img/${WF[(c * 4 + r * 3) % WF.length]}-s.webp" alt="" loading="lazy" decoding="async"></span>`).join('')}</div>`).join('');
  const wallColEls = $$('.ig-col', wallCols), wallItems = $$('.wall-item', wallSec), wallCard = $('#wall-card');
  $('.wave').innerHTML = Array.from({ length: 32 }, (_, i) => `<i style="animation-delay:${(i * 97 % 1400) / 1000}s"></i>`).join('');

  /* ═════════ DIRECTORIO ═════════ */
  let provs = [], cat = 'Todos', limit = 10;
  const grupoDe = c => Object.keys(GRUPOS).find(g => GRUPOS[g].includes(c)) || 'Más';
  const dirEl = $('#dir'), moreBtn = $('#dir-more');
  const renderDir = () => {
    const qv = $('#dir-q').value.trim().toLowerCase();
    const list = provs.filter(p => (cat === 'Todos' || p.g === cat) && (!qv || (p.name + p.cat + p.ig + p.resp).toLowerCase().includes(qv)));
    const ini = n => n.replace(/[^\p{L}\s]/gu, '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const icWa = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.7-.1 1.3z"/></svg>';
    const icIg = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>';
    dirEl.innerHTML = list.slice(0, limit).map((p, i) => {
      const h = (p.ig || '').replace(/^@/, '').trim();
      return `<article class="prov" style="animation-delay:${(i % 10) * 40}ms">
        <div class="prov-av">${ini(p.name)}</div>
        <div class="prov-tx"><small>${nombreCat[p.cat] || p.cat}</small><b>${p.name}</b>${p.resp ? `<span>${p.resp}</span>` : ''}</div>
        <div class="prov-acts">
          ${p.link.includes('wa.me') ? `<a href="${p.link}" target="_blank" rel="noopener" aria-label="WhatsApp de ${p.name}">${icWa}<span>WhatsApp</span></a>` : ''}
          ${h ? `<a href="https://www.instagram.com/${encodeURIComponent(h)}/" target="_blank" rel="noopener" aria-label="Instagram de ${p.name}">${icIg}<span>@${h}</span></a>` : ''}
        </div>
      </article>`;
    }).join('') || '<p class="dir-empty">No encontramos proveedores con esa búsqueda.</p>';
    moreBtn.parentElement.style.display = list.length > limit ? '' : 'none';
  };
  fetch('assets/proveedores.json?v=1792337268').then(r => r.json()).then(d => {
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
    lastY = y;
    // hero parallax
    if (!reduce && y < vh * 1.2) {
      const k = y / vh;
      heroMedia.style.transform = `scale(${1 + k * .06})`;
      heroCopy.style.transform = `translate3d(0,${-y * .25}px,0)`;
      heroCopy.style.opacity = clamp(1 - k * 1.8);
    }
    updMini();
    // tarjetas apiladas: la de abajo sube un poco más pequeña y redondeada; la de arriba se aleja y oscurece
    if (!reduce) {
      const tops = panels.map(pn => pn.getBoundingClientRect().top);
      panels.forEach((pn, i) => {
        const next = panels[i + 1];
        const nt = next ? tops[i + 1] : vh;
        const glassNext = next && next.classList.contains('glassy');
        const k = easeIO(clamp((vh - nt) / vh));
        const cov = nt <= 0 && !glassNext; // tapada por completo: se oculta para ahorrar batería
        if (cov !== !!pn._cov) { pn._cov = cov; pn.style.visibility = cov ? 'hidden' : ''; }
        const t = tops[i];
        const e = i > 0 && t > 0 ? easeOut(clamp(1 - t / vh)) : 1; // entrada
        if (k > 0.001) {
          pn.style.setProperty('--dim', (k * (glassNext ? .22 : .7)).toFixed(3));
          pn.style.transform = `scale(${(1 - k * .07).toFixed(4)})`;
          pn.style.transformOrigin = `50% ${-pn._top + vh / 2}px`;
        } else if (e < 1) {
          pn.style.removeProperty('--dim');
          pn.style.transform = `scale(${(.9 + .1 * e).toFixed(4)})`;
          pn.style.transformOrigin = '50% 0';
        } else if (pn.style.transform) { pn.style.removeProperty('--dim'); pn.style.transform = ''; }
        const rr = e < 1 ? Math.round(36 * (1 - e)) : 0;
        // en paneles de cristal el recorte rompería el desenfoque: se redondea con border-radius
        if (pn.classList.contains('glassy')) pn.style.setProperty('--rr', rr + 'px');
        else pn.style.clipPath = rr ? `inset(0 round ${rr}px ${rr}px 0 0)` : '';
      });
    }
    // Cifras: muro en movimiento y textos que aparecen sobre el cristal
    const wr = wallSec.getBoundingClientRect();
    if (wr.top < vh && wr.bottom > 0) {
      const p = clamp(-wr.top / (wallSec.offsetHeight - vh)); // 0 → 1 mientras la sección está anclada
      wallColEls.forEach((c, i) => { c.style.transform = `translate3d(0,${(i % 2 ? 1 : -1) * (p - .5) * 260}px,0)`; });
      const ce = easeOut(clamp(p / .25));
      wallCard.style.transform = `scale(${.86 + .14 * ce})`; wallCard.style.opacity = ce;
      wallItems.forEach((it, i) => {
        const q = easeOut(clamp((p - .12 - i * .15) / .2));
        it.style.opacity = q; it.style.transform = `translate3d(0,${(1 - q) * 34}px,0)`; it.style.filter = q < 1 ? `blur(${((1 - q) * 10).toFixed(1)}px)` : '';
      });
    }
    // Instagram: columnas en paralaje
    const ir = igCols.getBoundingClientRect();
    if (!reduce && ir.top < vh && ir.bottom > 0) {
      const k = (ir.top + ir.height / 2 - vh / 2) / vh;
      igColEls.forEach((c, i) => { c.style.transform = `translate3d(0,${(i % 2 ? 1 : -1) * k * 160 - 80}px,0)`; });
    }
    if (hv.currentSrc) { if ($('#hero')._cov) hv.pause(); else if (hv.paused && !document.hidden) hv.play().catch(() => {}); }
    if (band._cov && !bandV.paused) bandV.pause();
    // statement
    const r = stSec.getBoundingClientRect(); // se completa cuando la tarjeta termina de subir
    const lit = Math.round(clamp((vh * .85 - r.top) / (vh * .7)) * words.length);
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
    showcases.forEach(sc => sc.update(vh));
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
