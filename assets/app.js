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

  const STD = 'https://mcfilmsecuador.com/bodas/plantillas';
  const STD_DEMO = 'https://mcfilmsecuador.com/bodas/jennifer-y-brian';
  const GAL_DEMO = 'https://mcfilmsecuador.com/gallery/juan-sydney-q8m3';
  const GAL_TXT = 'Galería web privada · 60 días (1 año +$99)';
  // star: plan insignia (etiqueta dorada) · elige: el cliente escoge UNA opción (ids en eligeIds) · links: ejemplos en vivo
  const PLANES = {
    bodas: [
      { n: 'Deluxe', h: '12 horas', p: 2349, img: 'catedral', star: true, tag: 'Insignia · Solo 12 bodas al año', album: 30, cubre: ['f2', 'v2', 'simultaneo', 'reel', 'speech', 'express', 'mirror', 'std', 'web', 'galeria', 'mini'],
        items: ['2 fotógrafos + 2 videógrafos', 'Preparativos de novia y novio en simultáneo', 'Ceremonia religiosa y recepción', 'Tomas aéreas', 'Magic Mirror 1h · impresiones ilimitadas y marco personalizado', 'Save the date (foto + video)', 'Web interactiva del save the date: 14 plantillas o diseño propio, RSVP, invitación con el nombre de cada invitado, en español e inglés', 'Video documental · 20 min', 'Highlight de la fiesta · 45–60 min', 'Video speech (discursos)', 'Entrega express 72h: adelanto de fotos + reel de 1 min', 'Segundo reel de 1 min', 'Todas las fotografías editadas, en digital', 'Álbum 30×30 · 30 hojas (100–120 fotos), tapa premium + caja', '2 mini álbumes para los padres', 'Galería web privada · 1 año', 'Enlace del Magic Mirror'],
        nota: '<b>Experiencia Deluxe:</b> dirección personal de José Andrés y Xavier Mercado · reunión de planificación del timeline · fecha exclusiva.',
        links: [['Ver la web save the date', STD_DEMO], ['Ver una galería de boda', GAL_DEMO]] },
      { n: 'Diamante', h: '10 horas', p: 1729, img: 'velo-pasto', star: true, tag: 'Más elegido', album: 25, cubre: ['v2', 'reel', 'speech'], eligeIds: ['mirror', 'std'],
        items: ['1 fotógrafo + 2 videógrafos', 'Arreglo de los novios', 'Ceremonia religiosa y recepción', 'Tomas aéreas', 'Video documental · 16 min', 'Highlight de la fiesta · 35–45 min', 'Video speech (discursos)', 'Reel de 1 min', 'Todas las fotografías editadas, en digital', 'Álbum 30×30 · 25 hojas (80–100 fotos) + caja', GAL_TXT],
        elige: ['Magic Mirror 1h (impresiones + marco)', 'Save the date (foto + video)', 'Preboda', 'Posboda'],
        nota: 'Web interactiva del save the date: <b>+$99</b>.',
        ind: 'Individual: Foto 10h $979 · Video 10h $1,039 · Hora extra $99',
        links: [['Ver plantillas save the date', STD], ['Ver una galería de boda', GAL_DEMO]] },
      { n: 'Oro', h: '8 horas', p: 1419, img: 'arco', album: 20, cubre: ['v2', 'reel'], items: ['1 fotógrafo + 2 videógrafos', 'Arreglo de los novios', 'Ceremonia religiosa y recepción', 'Tomas aéreas', 'Video documental · 14 min', 'Highlight de la fiesta · 25–35 min', 'Reel de 1 min', 'Todas las fotografías editadas, en digital', 'Álbum 30×30 · 20 hojas (60–80 fotos)', GAL_TXT], ind: 'Individual: Foto 8h $859 · Video 8h $919 · Hora extra $99' },
      { n: 'Plata', h: '7 horas', p: 1199, img: 'luces', album: 15, items: ['1 fotógrafo + 1 videógrafo', 'Arreglo de la novia', 'Ceremonia religiosa y recepción', 'Tomas aéreas', 'Video documental · 12 min', 'Highlight de la fiesta · 20–25 min', 'Reel de 30 s', 'Todas las fotografías editadas, en digital', 'Álbum 30×30 · 15 hojas (45–60 fotos)', GAL_TXT], ind: 'Individual: Foto 7h $749 · Video 7h $809 · Hora extra $99' },
      { n: 'Bronce', h: '5 horas', p: 999, img: 'caminando', album: 10, items: ['1 fotógrafo + 1 videógrafo', 'Ceremonia religiosa y recepción', 'Tomas aéreas', 'Video documental · 10 min', 'Highlight de la fiesta · 15–20 min', 'Todas las fotografías editadas, en digital', 'Álbum 30×30 · 10 hojas (30–45 fotos)', GAL_TXT], ind: 'Individual: Foto 5h $659 · Video 5h $719 · Hora extra $99' },
      { n: 'Boda Civil', h: '4 horas', p: 439, img: 'anillos-libro', items: ['1 fotógrafo', 'Ceremonia civil', 'Almuerzo o cena', 'Sesión de novios', 'Todas las fotografías editadas, en digital', 'Álbum 20×20 · 15 hojas personalizado (50 fotos)', GAL_TXT], ind: 'Solo fotografía · Si ya contrataste tu plan de boda: $369' }
    ],
    quince: [
      { n: 'Diamante', h: '9 horas', p: 1289, img: 'escalera', star: true, tag: 'Insignia', album: 20, cubre: ['reel', 'mirror', 'cajas'], items: ['Arreglo en casa de la quinceañera', 'Ceremonia religiosa y recepción', 'Sesión el mismo día del evento', 'Sesión en El Cajas', '1 hora de Magic Mirror', 'Tomas aéreas', 'Video cinema · 17 min', 'Video fiesta · 35 min', 'Reel de 1 min', 'Todo el material fotográfico, en digital', 'Álbum 30×30 · 20 hojas (90 fotos)', 'Enlace con fotos y videos del Happy Hour', 'Galería web con contraseña · 30 días (opc. 1 año)'], ind: 'Individual: Video 9h $869 · Foto 9h $809 · Hora extra $99' },
      { n: 'Oro', h: '7 horas', p: 1019, img: 'novia-ventana', tag: 'Más elegido', album: 15, cubre: ['reel'], items: ['Sesión en casa de la quinceañera', 'Ceremonia religiosa y recepción', 'Sesión el mismo día del evento', 'Tomas aéreas', 'Video cinema · 12 min', 'Video fiesta · 25 min', 'Reel de 1 min', 'Todo el material fotográfico, en digital', 'Álbum 30×30 · 15 hojas (70 fotos)', 'Galería web con contraseña · 30 días (opc. 1 año)'], ind: 'Individual: Video 7h $809 · Foto 7h $759 · Hora extra $99' },
      { n: 'Plata', h: '5 horas', p: 729, img: 'retrato', album: 10, cubre: ['reel'], items: ['Salón de recepciones', 'Sesión el mismo día del evento', 'Video cinema · 10 min', 'Video fiesta · 20 min', 'Reel de 1 min', 'Todo el material fotográfico, en digital', 'Álbum 30×30 · 10 hojas', 'Galería web con contraseña · 30 días (opc. 1 año)'], ind: 'Individual: Video 5h $559 · Foto 5h $499 · Hora extra $99' },
      { n: 'Bautizos y cumpleaños', h: '4 horas', p: 689, img: 'jardin', items: ['Ceremonia religiosa (opcional)', 'Sesión al homenajeado(a) el mismo día', 'Salón de recepciones', 'Video cinema · 10 min', 'Todo el material fotográfico, en digital', 'Álbum 20×20 (60 fotos)', 'Galería web con contraseña · 30 días (opc. 1 año)'], ind: 'Individual: Video 4h $499 · Foto 4h $439 · Hora extra $79' }
    ],
    destino: [
      { n: 'Destino Oro', h: '12 horas', p: 2059, suf: '+ viáticos', img: 'montana', tag: 'Premium', items: ['Llegamos 24h antes a reconocer locaciones', 'Arreglo de los novios', 'Ceremonia religiosa y recepción', 'Postboda el mismo día', 'Tomas aéreas', 'Video cinema · 20 min', 'Video fiesta · 45 min', 'Video para redes · 3 min', 'Todo el material fotográfico, en digital', 'Álbum 30×30 · 25 hojas', 'Galería web con contraseña · 60 días (opc. 1 año)'], ind: 'Los viáticos dependen de la ciudad o país e incluyen costos de producción.' },
      { n: 'Destino Plata', h: '9 horas', p: 1839, suf: '+ viáticos', img: 'paramo', items: ['Arreglo de los novios', 'Ceremonia religiosa y recepción', 'Postboda el mismo día', 'Tomas aéreas', 'Video cinema · 15 min', 'Video fiesta · 40 min', 'Video para redes · 2 min', 'Todo el material fotográfico, en digital', 'Álbum 30×30 (90–120 fotos)', 'Galería web con contraseña · 30 días (opc. 1 año)'], ind: 'Los viáticos dependen de la ciudad o país e incluyen costos de producción.' }
    ],
    espejo: [
      { n: 'Espejo 1', h: '1 hora', p: 350, img: 'risas', items: ['1 hora de espejo mágico', 'Impresión de fotos ilimitada', 'Diseño personalizado', 'Fotos digitales por enlace'] },
      { n: 'Espejo 2', h: '2 horas', p: 500, img: 'fiesta', tag: 'Más elegido', items: ['2 horas de espejo mágico', 'Impresión de fotos ilimitada', 'Diseño personalizado', 'Fotos digitales por enlace', 'Álbum de recuerdos con fotos y firmas'] },
      { n: 'Corporativo', h: '3 horas', p: 650, img: 'petalos', items: ['3 horas de espejo mágico', 'Marcos de impresión con tu marca', 'Impresión de fotos ilimitada', 'Fotos digitales por enlace'], ind: 'Ya tienes un plan con nosotros: hora adicional de espejo $249' }
    ]
  };

  // Arma tu plan: plan a medida, ~10–15 % sobre los planes armados. Precio por horas (interpola entre puntos)
  // de la cobertura con 1 fotógrafo + 1 videógrafo, fotos editadas, documental, highlight y galería 60 días;
  // el resto se suma por opción (OPCIONES y ALBUM).
  const PRECIOS = {
    boda: { fv: { 5: 969, 7: 1059, 8: 1099, 10: 1149, 12: 1199 }, foto: { 5: 599, 7: 669, 8: 749, 10: 859, 12: 939 }, video: { 5: 789, 7: 799, 8: 839, 10: 869, 12: 909 } },
    quince: { fv: { 5: 569, 7: 869, 9: 899, 12: 989 }, foto: { 5: 429, 7: 679, 9: 709, 12: 789 }, video: { 5: 519, 7: 789, 9: 859, 12: 939 } }
  };
  // g: paso donde aparece · s: solo con foto ('foto') o con video ('video') · ev: solo en ese evento · def: marcado al inicio
  const OPCIONES = [
    { g: 'momentos', id: 'casa-novia', n: 'Casa de la novia', p: 0, ev: 'boda', def: true },
    { g: 'momentos', id: 'casa-novio', n: 'Casa del novio', p: 0, ev: 'boda' },
    { g: 'momentos', id: 'simultaneo', n: 'Novia y novio al mismo tiempo', p: 149, ev: 'boda' },
    { g: 'momentos', id: 'casa-q', n: 'Casa de la quinceañera', p: 0, ev: 'quince', def: true },
    { g: 'momentos', id: 'religiosa', n: 'Ceremonia religiosa', p: 0, def: true },
    { g: 'momentos', id: 'civil', n: 'Ceremonia civil', p: 0, ev: 'boda' },
    { g: 'momentos', id: 'recepcion', n: 'Recepción y fiesta', p: 0, def: true },
    { g: 'momentos', id: 'sesion', n: 'Sesión el mismo día', p: 0 },
    { g: 'momentos', id: 'cajas', n: 'Sesión en El Cajas', p: 129, ev: 'quince' },
    { g: 'equipo', id: 'f2', n: 'Segundo fotógrafo', p: 149, s: 'foto' },
    { g: 'equipo', id: 'v2', n: 'Segundo videógrafo', p: 149, s: 'video' },
    { g: 'equipo', id: 'aereas', n: 'Tomas aéreas', p: 0, s: 'video', inc: true },
    { g: 'entrega', id: 'fotos', n: 'Todas las fotografías editadas, en digital', p: 0, s: 'foto', inc: true },
    { g: 'entrega', id: 'documental', n: 'Video documental', p: 0, s: 'video', inc: true },
    { g: 'entrega', id: 'highlight', n: 'Highlight de la fiesta', p: 0, s: 'video', inc: true },
    { g: 'entrega', id: 'galeria60', n: 'Galería web privada · 60 días', p: 0, inc: true },
    { g: 'entrega', id: 'reel', n: 'Reel de 1 min', p: 99, s: 'video' },
    { g: 'entrega', id: 'speech', n: 'Video speech (discursos)', p: 99, s: 'video', ev: 'boda' },
    { g: 'entrega', id: 'deseos', n: 'Video de buenos deseos', p: 129, s: 'video' },
    { g: 'entrega', id: 'express', n: 'Entrega express 72h · fotos + reel', p: 99 },
    { g: 'entrega', id: 'mini', n: 'Mini álbum para padres', p: 99, s: 'foto' },
    { g: 'entrega', id: 'galeria', n: 'Galería web · 1 año', p: 99 },
    { g: 'experiencias', id: 'mirror', n: 'Magic Mirror · 1h', p: 249 },
    { g: 'experiencias', id: 'std', n: 'Sesión save the date, pre o posboda', p: 269, ev: 'boda' },
    { g: 'experiencias', id: 'web', n: 'Web interactiva save the date', p: 129, ev: 'boda' },
    { g: 'experiencias', id: 'streaming', n: 'Transmisión en vivo', p: 199 }
  ];
  const ALBUM = { 0: 0, 10: 129, 15: 159, 20: 189, 25: 219, 30: 249 }; // álbum 30×30 por hojas
  const PASOS = [['momentos', 'Momentos que cubrimos'], ['equipo', 'Tu equipo'], ['entrega', 'Lo que recibes'], ['experiencias', 'Experiencias']];

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
  // Las secciones van apiladas (sticky): su posición en pantalla no sirve para saltar a ellas.
  // Se calcula su lugar real sumando la altura de las secciones anteriores.
  const realTop = el => {
    if (el.id === 'top') return 0;
    const main = el.parentElement;
    if (!main || main.tagName !== 'MAIN') return el.getBoundingClientRect().top + scrollY;
    let y = main.getBoundingClientRect().top + scrollY;
    for (const s of main.children) {
      if (s === el) break;
      if (s.hidden || getComputedStyle(s).display === 'none') continue;
      const cs = getComputedStyle(s);
      y += s.offsetHeight + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);
    }
    return y;
  };
  const goTo = target => {
    const el = typeof target === 'string' ? $(target) : target; if (!el || el.hidden) return;
    const y = realTop(el);
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
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
      if (k === i && !lowData) v.play().catch(() => {}); else v.pause();
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
      <li class="p-item${p.star ? ' star' : ''}" data-i="${i}">
        <div class="p-row"><h3 class="p-name">${p.n}</h3><div class="p-price">$${money(p.p)}<small>${p.suf || '+ IVA'}</small></div></div>
        <div class="p-body">
          <div class="p-meta"><span>${p.h} de cobertura</span>${p.tag ? `<span class="p-tag">${p.tag}</span>` : ''}</div>
          <ul class="p-inc">${p.items.map(t => `<li>${t}</li>`).join('')}</ul>
          ${p.elige ? `<div class="p-elige"><b>Elige 1 opción</b><ul>${p.elige.map(t => `<li>${t}</li>`).join('')}</ul></div>` : ''}
          ${p.nota ? `<p class="p-nota">${p.nota}</p>` : ''}
          ${p.ind ? `<p class="p-ind">${p.ind}</p>` : ''}
          ${p.links ? `<div class="p-links">${p.links.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join('')}</div>` : ''}
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
  const stt = { evento: 'boda', servicio: 'fv', horas: 7, album: 15, sel: new Set(OPCIONES.filter(o => o.def || o.inc).map(o => o.id)) };
  const conFoto = () => stt.servicio !== 'video', conVideo = () => stt.servicio !== 'foto';
  const aplica = o => (!o.ev || o.ev === stt.evento) && (o.s !== 'foto' || conFoto()) && (o.s !== 'video' || conVideo());
  const ck = '<span class="ck"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0b0b0c" stroke-width="3.2"><path d="m5 12 5 5 9-10"/></svg></span>';
  const dyn = $('#b-dyn');
  const pintarPasos = () => {
    dyn.innerHTML = PASOS.map(([g, t], k) => `
      <div class="b-step">
        <div class="b-label"><b>0${k + 4} · ${t}</b><span>Paso ${k + 4} de 7</span></div>
        ${g === 'momentos' ? '<p class="b-hint">Incluidos en tus horas de cobertura.</p>' : ''}
        <div class="extras">${OPCIONES.filter(o => o.g === g && aplica(o)).map(o => `
          <button class="opt extra${stt.sel.has(o.id) ? ' on' : ''}" data-id="${o.id}" ${o.inc ? 'disabled' : ''}>
            ${ck}<b>${o.n}</b><span class="pr">${o.inc ? 'Incluido' : o.p ? '+$' + o.p : ''}</span>
          </button>`).join('')}</div>
        ${g === 'entrega' && conFoto() ? `<div class="b-sub">Álbum 30×30</div><div class="seg seg-album" data-k="album">${Object.keys(ALBUM).map(Number).sort((a, b) => a - b).map(h => `
          <button class="opt${stt.album === h ? ' on' : ''}" data-v="${h}"><b>${h ? h + ' hojas' : 'Sin álbum'}</b>${h ? `<small>+$${ALBUM[h]}</small>` : ''}</button>`).join('')}</div>` : ''}
      </div>`).join('');
  };
  const precioBase = () => {
    const pts = PRECIOS[stt.evento][stt.servicio], hs = Object.keys(pts).map(Number).sort((a, b) => a - b), h = stt.horas;
    if (h <= hs[0]) return pts[hs[0]];
    if (h >= hs[hs.length - 1]) return pts[hs[hs.length - 1]];
    for (let i = 0; i < hs.length - 1; i++) if (h <= hs[i + 1]) return Math.round(pts[hs[i]] + (pts[hs[i + 1]] - pts[hs[i]]) * (h - hs[i]) / (hs[i + 1] - hs[i]));
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
    const base = precioBase(), elegidas = OPCIONES.filter(o => aplica(o) && stt.sel.has(o.id));
    const album = conFoto() ? stt.album : 0;
    const pagadas = elegidas.filter(o => o.p), incluidas = elegidas.filter(o => !o.p);
    const total = base + pagadas.reduce((s, o) => s + o.p, 0) + ALBUM[album];
    const fot = conFoto() ? 1 + stt.sel.has('f2') : 0, vid = conVideo() ? 1 + stt.sel.has('v2') : 0;
    const equipo = [fot && `${fot} fotógrafo${fot > 1 ? 's' : ''}`, vid && `${vid} videógrafo${vid > 1 ? 's' : ''}`].filter(Boolean).join(' + ');
    const momentos = incluidas.filter(o => o.g === 'momentos').map(o => o.n), recibes = incluidas.filter(o => o.g !== 'momentos').map(o => o.n);
    animateTo(total); $('#mini-total').textContent = '$' + money(total);
    $('#sum-list').innerHTML = `<li><span>${labels[stt.evento]} · ${labels[stt.servicio]} · ${stt.horas}h<small>${equipo}</small></span><span>$${money(base)}</span></li>` +
      (momentos.length ? `<li><span>Cubrimos<small>${momentos.join(' · ')}</small></span><span>Incluido</span></li>` : '') +
      `<li><span>Recibes<small>${recibes.join(' · ')}</small></span><span>Incluido</span></li>` +
      pagadas.map(o => `<li><span>${o.n}</span><span>$${o.p}</span></li>`).join('') +
      (album ? `<li><span>Álbum 30×30 · ${album} hojas</span><span>$${ALBUM[album]}</span></li>` : '');
    // Sugerencia: el plan armado más barato que ya trae todo lo elegido
    const tip = $('#sum-tip'), grupo = stt.evento === 'boda' ? PLANES.bodas : PLANES.quince;
    const ids = pagadas.map(o => o.id);
    const mejor = stt.servicio === 'fv' && (ids.length || album) && [...grupo].sort((a, b) => a.p - b.p).find(p => parseInt(p.h) >= stt.horas && p.p < total &&
      album <= (p.album || 0) && ids.every(id => (p.cubre || []).includes(id) || (p.eligeIds || []).includes(id)) && ids.filter(id => (p.eligeIds || []).includes(id)).length <= 1);
    tip.classList.toggle('show', !!mejor);
    if (mejor) tip.innerHTML = `El <b>Plan ${mejor.n}</b> (${mejor.h}) ya incluye lo que elegiste por $${money(mejor.p)}. Ahorras $${money(total - mejor.p)}. <a href="#planes">Ver plan</a>`;
    const msg = `Hola MCFILMS, armé mi plan en la web:\n• ${labels[stt.evento]} · ${labels[stt.servicio]} · ${stt.horas} horas (${equipo})\n` +
      (momentos.length ? `• Cubrir: ${momentos.join(', ')}\n` : '') + pagadas.map(o => `• ${o.n}`).join('\n') + (pagadas.length ? '\n' : '') +
      (album ? `• Álbum 30×30 de ${album} hojas\n` : '') + `Total estimado: $${money(total)} + IVA\n¿Tienen disponible mi fecha?`;
    $('#send-wa').href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    stt.resumen = msg;
  };
  $$('.b-card > .b-step .seg').forEach(seg => seg.addEventListener('click', e => {
    const o = e.target.closest('.opt'); if (!o) return;
    $$('.opt', seg).forEach(x => x.classList.toggle('on', x === o)); stt[seg.dataset.k] = o.dataset.v;
    pintarPasos(); calc();
  }));
  dyn.addEventListener('click', e => {
    const a = e.target.closest('.seg-album .opt');
    if (a) { stt.album = +a.dataset.v; $$('.seg-album .opt').forEach(x => x.classList.toggle('on', x === a)); return calc(); }
    const o = e.target.closest('.extra'); if (!o || o.disabled) return;
    const id = o.dataset.id; stt.sel.has(id) ? stt.sel.delete(id) : stt.sel.add(id); o.classList.toggle('on', stt.sel.has(id)); calc();
  });
  pintarPasos();
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
  // Instagram tipo feed: 9 publicaciones visibles; al bajar, el feed se desliza hasta 18
  const IG = 'https://www.instagram.com/mcfilms.ec/';
  const icReel = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  const IGF = ['abrazo-madera', 'anillos-flores', 'caminando-salon', 'puerta', 'auto-risas', 'anillos-luz', 'arco-piedra', 'retrato-velo', 'zapatos-votos',
    'catedral', 'velo-pasto', 'amigos', 'altar', 'lago', 'anillos-libro', 'fiesta', 'jardin', 'petalos'];
  const igGrid = $('#igf-grid'), igSec = $('.ig-sec');
  // Muro de fotos inclinado detrás del cristal
  const igCols = $('#ig-cols');
  igCols.innerHTML = [0, 1, 2, 3, 4].map(c => `<div class="ig-col">${[0, 1, 2, 3, 4, 5].map(r => `<span><img src="assets/img/${IGF[(c * 4 + r * 3) % IGF.length]}-s.webp" alt="" loading="lazy" decoding="async"></span>`).join('')}</div>`).join('');
  const igColEls = $$('.ig-col', igCols);
  const renderFeed = posts => { igGrid.innerHTML = posts.slice(0, 18).map(p => `<a href="${p.url}" target="_blank" rel="noopener" aria-label="Ver publicación en Instagram"><img src="${p.img}" alt="Publicación de MCFILMS en Instagram" loading="lazy" decoding="async" referrerpolicy="no-referrer">${p.video ? icReel : ''}</a>`).join(''); };
  renderFeed(IGF.map(n => ({ img: `assets/img/${n}-s.webp`, url: IG })));
  $('#igf-hl').innerHTML = [['Wedding', 'lago'], ['Destino', 'montana'], ['Team', 'amigos'], ['Quince', 'retrato'], ['Momentos', 'risas'], ['Tips', 'anillos-luz']]
    .map(([t, n]) => `<a href="${IG}" target="_blank" rel="noopener"><i><img src="assets/img/${n}-s.webp" alt="" loading="lazy"></i>${t}</a>`).join('');
  // Publicaciones reales de @mcfilms.ec (api/instagram.php). Si la API no responde, se quedan las fotos del portafolio.
  fetch('api/instagram.php?h=' + Math.floor(Date.now() / 36e5)).then(r => r.ok ? r.json() : null).then(d => {
    if (!d || !d.data || d.data.length < 9) return;
    renderFeed(d.data);
    const k = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'K' : n;
    if (d.profile && d.profile.followers) $('#ig-followers').textContent = k(d.profile.followers);
    if (d.profile && d.profile.posts) $('#ig-posts').textContent = k(d.profile.posts);
  }).catch(() => {});
  const wallCols = $('#wall-cols'), wallSec = $('.wall-sec');
  const WF = ['catedral', 'caminando', 'luces', 'arco', 'velo-pasto', 'montana', 'amigos', 'altar', 'retrato-velo', 'lago', 'calle', 'jardin', 'auto', 'petalos', 'abrazo-velo'];
  wallCols.innerHTML = [0, 1, 2, 3, 4].map(c => `<div class="ig-col">${[0, 1, 2, 3, 4, 5].map(r => `<span><img src="assets/img/${WF[(c * 4 + r * 3) % WF.length]}-s.webp" alt="" loading="lazy" decoding="async"></span>`).join('')}</div>`).join('');
  const wallColEls = $$('.ig-col', wallCols), wallItems = $$('.wall-item', wallSec), wallCard = $('#wall-card');
  $('.wave').innerHTML = Array.from({ length: 32 }, (_, i) => `<i style="animation-delay:${(i * 97 % 1400) / 1000}s"></i>`).join('');

  /* ═════════ PODCAST: la tarjeta amarilla reproduce «Detrás de las bodas» ═════════
     El audio sale del RSS público de Spotify for Creators (api/podcast.php). Nunca suena solo:
     arranca con el clic en play; la onda se mueve solo mientras suena. */
  (() => {
    const pod = $('.pod'), au = $('#pp-audio');
    if (!pod || !au) return;
    let eps = [{ title: 'Get Ready: donde empieza la historia de tu boda', duration: '00:57:56',
      audio: 'https://anchor.fm/s/1185fdc50/podcast/play/127277711/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2026-9-11%2Fa4fd7174-d006-0dd0-b4d0-2302813c1049.mp3' }];
    let cur = 0;
    const fmt = t => { t = Math.max(0, Math.floor(t || 0)); const h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0'); };
    const dur = e => { const p = String(e.duration || '').split(':').map(Number); return p.reduce((a, v) => a * 60 + (v || 0), 0); };
    const total = () => isFinite(au.duration) && au.duration > 0 ? au.duration : dur(eps[cur]);
    const paint = () => {
      const T = total(), pct = T ? au.currentTime / T * 100 : 0;
      $('#pp-fill').style.width = pct + '%';
      $('#pp-bar').setAttribute('aria-valuenow', Math.round(pct));
      $('#pp-time').textContent = fmt(au.currentTime) + ' / ' + fmt(T);
    };
    const show = () => {
      const n = eps.length - cur; // el RSS trae el más nuevo primero
      $('#pp-num').textContent = 'Episodio ' + n;
      $('#pp-title').textContent = eps[cur].title;
      $('#pp-prev').disabled = cur >= eps.length - 1;
      $('#pp-next').disabled = cur <= 0;
      paint();
    };
    const load = (i, play) => {
      cur = i; au.src = eps[i].audio; show();
      if (play) au.play().catch(() => {});
      if ('mediaSession' in navigator) navigator.mediaSession.metadata = new MediaMetadata({ title: eps[i].title, artist: 'Detrás de las bodas · MCFILMS' });
    };
    $('#pp-play').addEventListener('click', () => {
      if (!au.src) au.src = eps[cur].audio;
      au.paused ? au.play().catch(() => pod.classList.remove('loading')) : au.pause();
    });
    $('#pp-prev').addEventListener('click', () => cur < eps.length - 1 && load(cur + 1, !au.paused));
    $('#pp-next').addEventListener('click', () => cur > 0 && load(cur - 1, !au.paused));
    const seek = x => { const r = $('#pp-bar').getBoundingClientRect(), T = total(); if (!T) return; if (!au.src) au.src = eps[cur].audio; au.currentTime = Math.min(1, Math.max(0, (x - r.left) / r.width)) * T; paint(); };
    $('#pp-bar').addEventListener('click', e => seek(e.clientX));
    $('#pp-bar').addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); if (!au.src) au.src = eps[cur].audio; au.currentTime = Math.max(0, au.currentTime + (e.key === 'ArrowRight' ? 15 : -15)); paint(); } });
    au.addEventListener('play', () => pod.classList.add('playing', 'loading'));
    au.addEventListener('playing', () => pod.classList.remove('loading'));
    au.addEventListener('waiting', () => pod.classList.add('loading'));
    au.addEventListener('pause', () => pod.classList.remove('playing', 'loading'));
    au.addEventListener('ended', () => { pod.classList.remove('playing'); if (cur > 0) load(cur - 1, true); });
    au.addEventListener('timeupdate', paint);
    au.addEventListener('loadedmetadata', paint);
    au.addEventListener('play', () => $('#pp-play').setAttribute('aria-label', 'Pausar'));
    au.addEventListener('pause', () => $('#pp-play').setAttribute('aria-label', 'Reproducir'));
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => au.play());
      navigator.mediaSession.setActionHandler('pause', () => au.pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => $('#pp-prev').click());
      navigator.mediaSession.setActionHandler('nexttrack', () => $('#pp-next').click());
    }
    show();
    // Episodios nuevos del RSS; si falla, queda el episodio 1 de arriba.
    fetch('api/podcast.php?h=' + Math.floor(Date.now() / 36e5)).then(r => r.ok ? r.json() : null).then(d => {
      if (!d || !d.episodes || !d.episodes.length || !au.paused || au.src) return;
      eps = d.episodes; cur = 0; show();
    }).catch(() => {});
  })();

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
    // Instagram: el feed sube como si estuvieras navegando el perfil
    const gr = igSec.getBoundingClientRect();
    if (gr.top < vh && gr.bottom > 0) {
      const p = clamp(-gr.top / (igSec.offsetHeight - vh));
      const view = igGrid.parentElement.offsetHeight, dist = Math.max(0, igGrid.offsetHeight - view);
      igGrid.style.transform = `translate3d(0,${-easeIO(clamp((p - .12) / .76)) * dist}px,0)`;
      igColEls.forEach((c, i) => { c.style.transform = `translate3d(0,${(i % 2 ? 1 : -1) * (p - .5) * 260}px,0)`; });
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
  // Solo las secciones visibles (una oculta mide 0 y descuadraría el apilado de tarjetas).
  let panels = $$('main > .panel:not([hidden])');
  const setTops = () => panels.forEach(pn => { pn._top = Math.min(0, innerHeight - pn.offsetHeight); pn.style.top = pn._top + 'px'; });
  addEventListener('mcf:paneles', () => { panels = $$('main > .panel:not([hidden])'); setTops(); observeAll(); onScroll(); });
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
