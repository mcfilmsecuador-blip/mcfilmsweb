/* MCFILMS 2026 — interacciones */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const WA = '593998400211';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const enc = p => p.split('/').map(encodeURIComponent).join('/');

  /* ═════════ DATOS (editar aquí) ═════════ */

  // Planes fijos. Los primeros 5 items se ven; el resto aparece con "Ver todo".
  const PLANES = {
    bodas: [
      { n: 'Bronce', h: '5 horas', p: 949, items: ['Ceremonia religiosa', 'Salón de recepciones', 'Tomas y vuelo con drone', 'Video cinema · 10 min', 'Video fiesta · 20 min', 'Material fotográfico digital', 'Álbum 30×30 · 10 hojas (30–50 fotos)', 'Enlace con el material', 'Acceso web · 30 días (opc. 1 año)'], ind: ['Foto 5h $629', 'Video 5h $689', 'Hora extra $99'] },
      { n: 'Plata', h: '7 horas', p: 1149, cubre: ['reel', 'arreglo'], items: ['Arreglo solo novia', 'Ceremonia religiosa', 'Salón de recepciones', 'Tomas y vuelo con drone', 'Video reel · 1 min', 'Video cinema · 12 min', 'Video fiesta · 30 min', 'Material fotográfico digital', 'Álbum 30×30 · 15 hojas (50–70 fotos)', 'Enlace con el material', 'Acceso web · 30 días (opc. 1 año)'], ind: ['Foto 7h $709', 'Video 7h $769', 'Hora extra $99'] },
      { n: 'Oro', h: '9 horas', p: 1349, cubre: ['reel', 'arreglo'], tag: 'Más elegido', feat: true, items: ['Arreglo de ambos novios', 'Ceremonia religiosa', 'Salón de recepciones', 'Tomas y vuelo con drone', 'Video reel · 2 min', 'Video cinema · 14 min', 'Video fiesta · 35 min', 'Material fotográfico digital', 'Álbum 30×30 · 20 hojas (70–90 fotos)', 'Enlace con el material', 'Acceso web · 30 días (opc. 1 año)'], ind: ['Foto 9h $819', 'Video 9h $879', 'Hora extra $99'] },
      { n: 'Diamante', h: '10 horas', p: 1649, cubre: ['reel', 'arreglo', 'std', 'mirror', '360'], tag: 'Premium', items: ['Arreglo de ambos novios', 'Save the Date · Pre o Post boda', 'Magic Mirror 1h (o cabina 360)', 'Tomas y vuelo con drone', 'Video cinema · 17 min', 'Ceremonia y recepción', 'Impresiones ilimitadas · marco personalizado', 'Video fiesta · 45 min', 'Video redes · 3 min', 'Material fotográfico digital', 'Álbum 30×30 · 25 hojas (90–120 fotos)', 'Caja decorativa para el álbum', 'Enlace fotos, videos y Magic Mirror', 'Acceso web · 30 días (opc. 1 año)'] }
    ],
    quince: [
      { n: 'Plata', h: '5 horas', p: 699, cubre: ['reel'], items: ['Salón de recepciones', 'Sesión el mismo día del evento', 'Video cinema · 10 min', 'Video fiesta · 20 min', 'Video reel · 1 min', 'Material fotográfico digital', 'Álbum 30×30 · 10 hojas personalizado', 'Acceso web con contraseña · 30 días (opc. 1 año)'] },
      { n: 'Oro', h: '7 horas', p: 965, cubre: ['reel'], tag: 'Más elegido', feat: true, items: ['Sesión en casa de la quinceañera', 'Ceremonia religiosa', 'Salón de recepciones', 'Tomas y vuelo con drone', 'Video cinema · 12 min', 'Sesión el mismo día del evento', 'Video fiesta · 25 min', 'Video reel · 1 min', 'Material fotográfico digital', 'Álbum 30×30 · 15 hojas (70 fotos)', 'Acceso web con contraseña · 30 días (opc. 1 año)'] },
      { n: 'Diamante', h: '9 horas', p: 1229, cubre: ['reel', 'std'], tag: 'Premium', items: ['Sesión Pre-Quince adicional', 'Sesión en casa de la quinceañera', 'Ceremonia religiosa', 'Salón de recepciones', 'Tomas y vuelo con dron', 'Sesión el mismo día del evento', 'Video cinema · 15 min', 'Video fiesta · 40 min', 'Video reel · 1 min', 'Material fotográfico digital', 'Álbum 30×30 · 20 hojas personalizado', 'Acceso web con contraseña'] }
    ],
    destino: [
      { n: 'Destino Plata', h: '9 horas', p: 1670, suf: '+ viáticos', items: ['Arreglo de los novios', 'Ceremonia religiosa', 'Salón de recepciones', 'Post boda el mismo día', 'Tomas y vuelo con dron', 'Video cinema · 15 min', 'Video fiesta · 40 min', 'Video redes · 2 min', 'Material fotográfico digital', 'Álbum 30×30 · 90–120 fotos', 'Enlace con todo el material', 'Acceso web con contraseña'] },
      { n: 'Destino Oro', h: '12 horas', p: 1870, suf: '+ viáticos', tag: 'Premium', feat: true, items: ['Llegamos 24h antes a reconocer locaciones', 'Arreglo de los novios', 'Ceremonia religiosa', 'Salón de recepciones', 'Post boda el mismo día', 'Tomas y vuelo con dron', 'Video cinema · 20 min', 'Video fiesta · 45 min', 'Video redes · 3 min', 'Material fotográfico digital', 'Álbum 30×30', 'Acceso web con contraseña'] }
    ],
    espejo: [
      { n: 'Espejo 1', h: '1 hora', p: 350, items: ['1 hora de espejo mágico', 'Impresión de fotos ilimitada', 'Diseño personalizado', 'Fotos digitales por enlace'] },
      { n: 'Espejo 2', h: '2 horas', p: 500, tag: 'Más elegido', feat: true, items: ['2 horas de espejo mágico', 'Impresión de fotos ilimitada', 'Diseño personalizado', 'Fotos digitales por enlace', 'Álbum de recuerdos con firmas'] },
      { n: 'Corporativo', h: '3 horas', p: 650, items: ['3 horas de espejo mágico', 'Marcos con tu marca', 'Impresión de fotos ilimitada', 'Fotos digitales por enlace'] },
      { n: 'Video 360', h: '1 hora', p: 220, tag: '360°', items: ['1 hora de máquina video 360', 'Entrega de videos por código QR', 'Pistola de burbujas'] }
    ]
  };

  // Arma tu plan: precio por horas (se interpola entre puntos; después del último suma "hora").
  const PRECIOS = {
    boda:   { fv: { 5: 949, 7: 1149, 9: 1349 }, foto: { 5: 629, 7: 709, 9: 819 }, video: { 5: 689, 7: 769, 9: 879 }, hora: 99, min: 5 },
    quince: { fv: { 5: 699, 7: 965, 9: 1229 }, foto: { 5: 449, 7: 609, 9: 779 }, video: { 5: 489, 7: 659, 9: 829 }, hora: 99, min: 5 } // foto/video quince: confirmar
  };
  // ⚠️ Precios de extras: los marcados "confirmar" son estimados, ajústalos aquí.
  const EXTRAS = [
    { id: 'drone', n: 'Drone', p: 0, inc: true },
    { id: 'reel', n: 'Video reel redes · 1 min', p: 80 },          // confirmar
    { id: 'arreglo', n: 'Arreglo de novios', p: 120 },             // confirmar
    { id: 'std', n: 'Sesión Pre o Post boda', p: 250 },            // confirmar
    { id: 'mirror', n: 'Magic Mirror · 1h', p: 350 },
    { id: '360', n: 'Video 360 · 1h', p: 220 },
    { id: 'album', n: 'Álbum 30×30 · +5 hojas', p: 90 },           // confirmar
    { id: 'web', n: 'Acceso web · 1 año', p: 40 }                  // confirmar
  ];

  const FOTOS = ['Mcfilms (101)', 'Mcfilms (11)', 'Juan & Sidney ', 'Mcfilms (113)', 'Mcfilms (132)-2', 'DSC02003', 'Mcfilms (154)-2', 'Mcfilms (17)', 'Mcfilms (187)', 'Kendall & Santiago Mcfilms (3)-2', 'Mcfilms (200)', 'Mcfilms (212)', 'Mcfilms (247)', 'Mcfilms (26)', 'Mcfilms (269)', 'Mcfilms (314)', 'Mcfilms (335)', 'DSC02160', 'Mcfilms (341)', 'Mcfilms (36)-4', 'Mcfilms (407)', 'Mcfilms (425)', 'Mcfilms (451)', 'Mcfilms (57)-2', 'Mcfilms (70)', 'Mcfilms (90)-3', 'Mcfilms (94)', 'Mcfilms (96)-2'];

  const FILMS = [
    ['3 Juan & Sydney Wedding Redes.mp4', 'Juan & Sydney', 'Wedding film'],
    ['3 Marco & Elizabeth Wedding Redes.mp4', 'Marco & Elizabeth', 'Wedding film'],
    ['3 Minky & Milena Wedding Reel.mp4', 'Minky & Milena', 'Reel'],
    ['4 Paula  & Santiago Wedding Reel.mp4', 'Paula & Santiago', 'Reel'],
    ['3 Joanny & Natali Reel.mp4', 'Joanny & Natali', 'Reel'],
    ['3 Adriana & Andres Wedding Redes.mp4', 'Adriana & Andrés', 'Wedding film'],
    ['3 Maria Gracia & Joseph Wedding Redes.mp4', 'María Gracia & Joseph', 'Wedding film'],
    ['3 Jose Felipe & Paula Redes.mp4', 'José Felipe & Paula', 'Wedding film'],
    ['Juan Jose & Amanda Wedding Reel .mp4', 'Juan José & Amanda', 'Reel'],
    ['Mishell & Juan.mp4', 'Mishell & Juan', 'Wedding film']
  ];

  const TEAM = [
    ['6-Jose-Andres-Mercado', 'José Andrés Mercado', 'Gerente General · Co-fundador'],
    ['2-Javier_Mercado-', 'Javier Mercado', 'Director Creativo · Co-fundador'],
    ['3-David_Balseca', 'David Balseca', 'Director de Fotografía'],
    ['4-Bryan_Espinoza-', 'Bryan Espinoza', 'Director de Video'],
    ['5-Andrea_Mercado', 'Andrea Mercado', 'Directora de Operaciones']
  ];

  const QUOTES = [
    ['Cuando vimos el video por primera vez, los dos lloramos. MCFILMS capturó exactamente la magia de ese día.', 'Sofía & Mateo', 'Cuenca'],
    ['Lo que más nos sorprendió fue lo discretos que fueron. Casi no los vimos, pero capturaron absolutamente todo.', 'Valentina & Carlos', 'Guayaquil'],
    ['Desde la primera reunión entendieron lo que queríamos. El resultado superó todas nuestras expectativas.', 'Ana & Diego', 'Cuenca'],
    ['Nos hicieron sentir súper cómodos. Tienen un ojo increíble para la luz y la estética.', 'Camila & Sebastián', 'Quito'],
    ['El tráiler de nuestra boda parecía sacado de Netflix. Son verdaderos artistas visuales.', 'Isabella & Jorge', 'Loja'],
    ['Teníamos miedo de posar, pero su dirección fue tan natural que nos olvidamos de las cámaras.', 'Paula & Gabriel', 'Guayaquil'],
    ['Las tomas de drone, el color, la música… todo encajó perfecto. Lloré viendo el video de los votos.', 'Verónica & Roberto', 'Cuenca'],
    ['Elegimos el Plan Diamante y valió cada centavo. La sesión post boda fue divertidísima.', 'Estefanía & David', 'Cuenca']
  ];

  // Agrupación de categorías del directorio
  const GRUPOS = {
    'Recepción': ['Recepcion'],
    'Planners': ['Wedding Planner'],
    'Decoración': ['Decoración'],
    'Música': ['Dj', 'Orquesta', 'Banda', 'Musica Iglesia', 'Musica', 'Violin', 'Dj & Effects', 'Dj Y Effects', 'Musica Y Produccion', 'Sonido Y Montaje'],
    'Belleza': ['Make Up', 'Hair'],
    'Moda': ['Dress', 'Trajes Novio'],
    'Show': ['Show Hora Loca', 'Pirotecnia Y Effects', 'Magic Mirror Y Maq 360'],
    'Más': ['Dulces', 'Cerveza Artesanal', 'Vehiculos Bodas']
  };
  const nombreCat = { 'Recepcion': 'Recepción', 'Dj': 'DJ', 'Musica': 'Música', 'Musica Iglesia': 'Música iglesia', 'Violin': 'Violín', 'Dress': 'Vestidos', 'Vehiculos Bodas': 'Vehículos', 'Show Hora Loca': 'Hora loca' };

  /* ═════════ RENDER ═════════ */

  // Marquee de fotos (duplicado para loop infinito)
  const fig = f => `<figure><img src="../Portafolio%20infinio/${enc(f)}.webp" alt="Fotografía de boda MCFILMS" loading="lazy" decoding="async"></figure>`;
  const half = Math.ceil(FOTOS.length / 2);
  const r1 = FOTOS.slice(0, half).map(fig).join(''), r2 = FOTOS.slice(half).map(fig).join('');
  $('#mq1').innerHTML = r1 + r1;
  $('#mq2').innerHTML = r2 + r2;

  // Películas
  const filmsEl = $('#films');
  filmsEl.innerHTML = FILMS.slice(0, 6).map(([f, n, t]) => `
    <article class="film rv" data-src="../Galeria%20Videos/${enc(f)}" tabindex="0" role="button" aria-label="Ver película de ${n}">
      <video muted loop playsinline preload="none" data-src="../Galeria%20Videos/previews/${enc(f)}"></video>
      <div class="film-t"><div><span>${t}</span><br><b>${n}</b></div><span class="play"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg></span></div>
    </article>`).join('');

  // Equipo
  $('#team').innerHTML = TEAM.map(([f, n, r], i) => `
    <div class="member rv d${i % 4}"><figure><img src="../Mcfilms%20Teams/${enc(f)}.webp" alt="${n}, ${r} en MCFILMS" loading="lazy"></figure><b>${n}</b><span>${r}</span></div>`).join('');

  // Testimonios (duplicado)
  const q = QUOTES.map(([t, n, c]) => `<blockquote class="quote"><div class="stars">★★★★★</div><p>“${t}”</p><footer><b>${n}</b>${c}</footer></blockquote>`).join('');
  $('#quotes').innerHTML = q + q;

  // Instagram (vista previa hasta conectar la API)
  $('#ig-grid').innerHTML = ['Mcfilms (94)', 'Juan & Sidney ', 'Mcfilms (187)', 'Mcfilms (407)', 'Kendall & Santiago Mcfilms (3)-2', 'Mcfilms (26)'].map(f =>
    `<a href="https://www.instagram.com/mcfilms_ecuador/" target="_blank" rel="noopener" aria-label="Ver en Instagram"><img src="../Portafolio%20infinio/${enc(f)}.webp" alt="" loading="lazy"></a>`).join('');

  // Onda del podcast
  $('.wave').innerHTML = Array.from({ length: 32 }, (_, i) => `<i style="animation-delay:${(i * 97 % 1400) / 1000}s"></i>`).join('');

  /* ═════════ PLANES ═════════ */
  const plansEl = $('#plans');
  const money = n => n.toLocaleString('en-US');
  const renderPlans = g => {
    const list = PLANES[g];
    plansEl.style.setProperty('--n', list.length);
    plansEl.innerHTML = list.map((p, i) => `
      <article class="plan${p.feat ? ' feat' : ''} rv d${i}">
        ${p.tag ? `<span class="plan-tag">${p.tag}</span>` : ''}
        <div><h3 class="plan-name">${p.n}</h3><div class="plan-h">${p.h}</div></div>
        <div class="plan-price"><b>$${money(p.p)}</b><span>${p.suf || '+ IVA'}</span></div>
        <ul class="plan-list">${p.items.map((t, j) => `<li${j > 4 ? ' class="x"' : ''}>${t}</li>`).join('')}</ul>
        ${p.items.length > 5 ? `<button class="plan-more">Ver todo lo incluido</button>` : ''}
        ${p.ind ? `<div class="plan-ind">${p.ind.map(x => `<span>${x}</span>`).join('')}</div>` : ''}
        <a class="btn ${p.feat ? 'btn-y' : 'btn-k'}" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(`Hola MCFILMS, me interesa el plan ${p.n} (${p.h}). ¿Tienen disponible mi fecha?`)}">Reservar <span class="arr">→</span></a>
      </article>`).join('');
    requestAnimationFrame(() => $$('.rv', plansEl).forEach(el => io.observe(el)));
  };
  plansEl.addEventListener('click', e => {
    const b = e.target.closest('.plan-more'); if (!b) return;
    const card = b.closest('.plan'); card.classList.toggle('exp');
    b.textContent = card.classList.contains('exp') ? 'Ver menos' : 'Ver todo lo incluido';
  });
  const pill = $('#tab-pill');
  const movePill = t => { pill.style.left = t.offsetLeft + 'px'; pill.style.top = t.offsetTop + 'px'; pill.style.width = t.offsetWidth + 'px'; };
  $$('.tab').forEach(t => t.addEventListener('click', () => {
    $$('.tab').forEach(x => x.classList.toggle('on', x === t));
    movePill(t); renderPlans(t.dataset.g);
  }));

  /* ═════════ ARMA TU PLAN ═════════ */
  const st = { evento: 'boda', servicio: 'fv', horas: 7, extras: new Set(['drone']) };
  const extrasEl = $('#extras');
  extrasEl.innerHTML = EXTRAS.map(x => `
    <button class="opt extra${x.inc ? ' on' : ''}" data-id="${x.id}" ${x.inc ? 'disabled' : ''}>
      <span class="ck"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0b0b0c" stroke-width="3"><path d="m5 12 5 5 9-10"/></svg></span>
      <b>${x.n}</b><span class="pr">${x.inc ? 'Incluido' : '+$' + x.p}</span>
    </button>`).join('');

  const precioBase = () => {
    const t = PRECIOS[st.evento], pts = t[st.servicio], hs = Object.keys(pts).map(Number).sort((a, b) => a - b);
    const h = st.horas, last = hs[hs.length - 1];
    if (h >= last) return pts[last] + (h - last) * t.hora;
    for (let i = 0; i < hs.length - 1; i++) {
      if (h >= hs[i] && h <= hs[i + 1]) return Math.round(pts[hs[i]] + (pts[hs[i + 1]] - pts[hs[i]]) * (h - hs[i]) / (hs[i + 1] - hs[i]));
    }
    return pts[hs[0]];
  };

  const totalEl = $('#total');
  let shown = 0, raf;
  const animateTo = v => {
    cancelAnimationFrame(raf);
    const from = shown, t0 = performance.now();
    const step = now => {
      const k = Math.min(1, (now - t0) / 600), e = 1 - Math.pow(1 - k, 4);
      shown = Math.round(from + (v - from) * e); totalEl.textContent = money(shown);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };

  const labels = { fv: 'Foto + Video', foto: 'Solo foto', video: 'Solo video', boda: 'Boda', quince: 'Quinceaños' };
  const calc = () => {
    const base = precioBase();
    const ex = EXTRAS.filter(x => st.extras.has(x.id));
    const total = base + ex.reduce((s, x) => s + x.p, 0);
    animateTo(total);
    $('#sum-list').innerHTML = `<li><span>${labels[st.evento]} · ${labels[st.servicio]} · ${st.horas}h</span><span>$${money(base)}</span></li>` +
      ex.map(x => `<li><span>${x.n}</span><span>${x.inc ? 'Incluido' : '$' + x.p}</span></li>`).join('');

    // Sugerencia: si un plan fijo da más por menos
    const tip = $('#sum-tip');
    const grupo = st.evento === 'boda' ? PLANES.bodas : PLANES.quince;
    const pagados = ex.filter(x => !x.inc).map(x => x.id);
    const mejor = st.servicio === 'fv' && pagados.length > 0 && grupo.find(p =>
      parseInt(p.h) >= st.horas && p.p < total && pagados.every(id => (p.cubre || []).includes(id) || (id === '360' && (p.cubre || []).includes('mirror'))));
    tip.classList.toggle('show', !!mejor);
    if (mejor) tip.innerHTML = `💡 El <b>Plan ${mejor.n}</b> (${mejor.h}) ya incluye lo que elegiste por $${money(mejor.p)}: ahorras $${money(total - mejor.p)}. <a href="#planes" style="text-decoration:underline">Ver plan</a>`;
    $('#mini-total').textContent = '$' + money(total);

    const msg = `Hola MCFILMS 👋 Armé mi plan en la web:\n• ${labels[st.evento]} · ${labels[st.servicio]} · ${st.horas} horas\n${ex.filter(x => !x.inc).map(x => `• ${x.n}`).join('\n')}\nTotal estimado: $${money(total)} + IVA\n¿Tienen disponible mi fecha?`;
    $('#send-wa').href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    st.resumen = msg.replace(/\n/g, ' ');
  };

  $$('.seg').forEach(seg => seg.addEventListener('click', e => {
    const o = e.target.closest('.opt'); if (!o) return;
    $$('.opt', seg).forEach(x => x.classList.toggle('on', x === o));
    st[seg.dataset.k] = o.dataset.v; calc();
  }));
  extrasEl.addEventListener('click', e => {
    const o = e.target.closest('.extra'); if (!o || o.disabled) return;
    const id = o.dataset.id; st.extras.has(id) ? st.extras.delete(id) : st.extras.add(id);
    o.classList.toggle('on'); calc();
  });
  const hrs = $('#hrs');
  const onHrs = () => {
    st.horas = +hrs.value; $('#hrs-v').textContent = hrs.value;
    hrs.style.setProperty('--p', ((hrs.value - hrs.min) / (hrs.max - hrs.min) * 100) + '%'); calc();
  };
  hrs.addEventListener('input', onHrs);
  $('#send-mail').addEventListener('click', () => {
    $('#f-msg').value = st.resumen || '';
    $('#f-plan').value = 'No sé aún, quiero asesoría';
  });

  const mini = $('#mini');
  const updMini = () => {
    const on = mini.dataset.card === '1' && mini.dataset.sum !== '1' && innerWidth <= 1080;
    mini.classList.toggle('show', on); document.body.classList.toggle('mini-on', on);
  };
  new IntersectionObserver(es => es.forEach(e => {
    mini.dataset[e.target === mini.nextElementSibling ? 'sum' : 'card'] = e.isIntersecting ? 1 : 0; updMini();
  })).observe($('.b-card'));
  new IntersectionObserver(es => es.forEach(e => { mini.dataset.sum = e.isIntersecting ? 1 : 0; updMini(); })).observe($('.summary'));
  mini.addEventListener('click', () => $('.summary').scrollIntoView({ behavior: 'smooth', block: 'center' }));

  /* ═════════ DIRECTORIO ═════════ */
  let provs = [], cat = 'Todos', limit = 12;
  const grupoDe = c => Object.keys(GRUPOS).find(g => GRUPOS[g].includes(c)) || 'Más';
  const dirEl = $('#dir'), moreBtn = $('#dir-more');
  const renderDir = () => {
    const qv = $('#dir-q').value.trim().toLowerCase();
    const list = provs.filter(p => (cat === 'Todos' || p.g === cat) && (!qv || (p.name + p.cat + p.ig + p.resp).toLowerCase().includes(qv)));
    dirEl.innerHTML = list.slice(0, limit).map((p, i) => `
      <div class="prov" style="animation-delay:${(i % 12) * 30}ms"><small>${nombreCat[p.cat] || p.cat}</small><b>${p.name}</b><span>${p.ig}</span>
      <a href="${p.link}" target="_blank" rel="noopener">${p.link.includes('wa.me') ? 'WhatsApp' : 'Instagram'} →</a></div>`).join('') || '<p class="dir-empty">No encontramos proveedores con esa búsqueda.</p>';
    moreBtn.parentElement.style.display = list.length > limit ? '' : 'none';
  };
  fetch('proveedores.json').then(r => r.json()).then(d => {
    provs = d.map(p => ({ ...p, g: grupoDe(p.cat) }));
    $('#chips').innerHTML = ['Todos', ...Object.keys(GRUPOS)].map(g => `<button class="chip${g === 'Todos' ? ' on' : ''}">${g}</button>`).join('');
    renderDir();
  }).catch(() => { dirEl.innerHTML = '<p class="dir-empty">No se pudo cargar el directorio.</p>'; });
  $('#chips').addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    $$('.chip').forEach(x => x.classList.toggle('on', x === c)); cat = c.textContent; limit = 12; renderDir();
  });
  $('#dir-q').addEventListener('input', () => { limit = 12; renderDir(); });
  moreBtn.addEventListener('click', () => { limit += 12; renderDir(); });

  /* ═════════ REVEAL + CONTADORES ═════════ */
  const count = el => {
    const end = +el.dataset.count, suf = el.dataset.suf || '', pre = el.querySelector('i') ? '<i>+</i>' : '';
    const t0 = performance.now();
    const step = now => {
      const k = Math.min(1, (now - t0) / 1800), e = 1 - Math.pow(1 - k, 3);
      el.innerHTML = pre + Math.round(end * e) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    $$('[data-count]', e.target).forEach(count);
    io.unobserve(e.target);
  }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
  $$('.rv, .split, .mark').forEach(el => io.observe(el));

  // Previews de películas: cargan y suenan solo al pasar el cursor / al verse en móvil
  const loadV = v => { if (!v.src && v.dataset.src) v.src = v.dataset.src; };
  const touch = matchMedia('(hover: none)').matches;
  $$('.film').forEach(f => {
    const v = $('video', f);
    if (!touch) {
      f.addEventListener('mouseenter', () => { loadV(v); v.play().catch(() => {}); });
      f.addEventListener('mouseleave', () => v.pause());
    }
    const open = () => openModal(f.dataset.src);
    f.addEventListener('click', open);
    f.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
  });
  if (touch) {
    const vio = new IntersectionObserver(es => es.forEach(e => {
      const v = $('video', e.target);
      if (e.isIntersecting) { loadV(v); v.play().catch(() => {}); } else v.pause();
    }), { threshold: .6 });
    $$('.film').forEach(f => vio.observe(f));
  }
  // Póster de cada película = primer frame
  $$('.film video').forEach(v => { v.preload = 'metadata'; v.src = v.dataset.src + '#t=0.5'; });

  /* Modal */
  const modal = $('#modal'), mv = $('#modal-v');
  const openModal = src => { mv.src = src; modal.classList.add('open'); mv.play().catch(() => {}); document.body.style.overflow = 'hidden'; };
  const closeModal = () => { modal.classList.remove('open'); mv.pause(); mv.removeAttribute('src'); mv.load(); document.body.style.overflow = ''; };
  $('#modal-x').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  /* ═════════ HERO REEL: se expande a pantalla completa con el scroll ═════════ */
  const reel = $('#reel'), frame = $('#reel-frame'), hv = $('#hero-video');
  const startHero = () => {
    const s = $('source', hv); if (!s.src) { s.src = s.dataset.src; hv.load(); }
    hv.play().then(() => { hv.style.opacity = 1; $('img', frame).style.opacity = 0; }).catch(() => {});
  };
  hv.style.transition = 'opacity .8s'; hv.style.opacity = 0;
  if ('requestIdleCallback' in window) requestIdleCallback(startHero, { timeout: 1500 }); else setTimeout(startHero, 600);
  $('#sound').addEventListener('click', () => {
    hv.muted = !hv.muted;
    $('#sound').innerHTML = hv.muted
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m23 9-6 6M17 9l6 6"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>';
  });

  /* ═════════ MANIFIESTO: palabras se encienden ═════════ */
  const man = $('#manifesto');
  man.innerHTML = man.innerHTML.replace(/(<span class="([^"]+)">([^<]+)<\/span>)|([^\s<]+)/g, (m, sp, cls, inner, word) =>
    sp ? `<span class="w ${cls}">${inner}</span>` : `<span class="w">${word}</span>`);
  const words = $$('.w', man);

  /* ═════════ SCROLL LOOP ═════════ */
  const nav = $('#nav'), prog = $('#progress');
  let lastY = 0, ticking = false, gut = parseFloat(getComputedStyle($('.wrap')).paddingLeft) || 20;
  const onScroll = () => {
    const y = scrollY, vh = innerHeight;
    prog.style.transform = `scaleX(${y / (document.documentElement.scrollHeight - vh)})`;
    nav.classList.toggle('is-scrolled', y > 20);
    nav.classList.toggle('is-hidden', y > lastY && y > 600 && !nav.classList.contains('open'));
    lastY = y;

    if (!reduce) {
      const r = reel.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
      const e = 1 - Math.pow(1 - Math.min(1, k * 1.6), 3);
      const maxW = Math.min(innerWidth - 2 * gut, 1240);
      frame.style.width = (maxW + (innerWidth - maxW) * e) + 'px';
      frame.style.height = (vh * (.72 + .28 * e)) + 'px';
      frame.style.borderRadius = (28 * (1 - e)) + 'px';
    }

    const mr = man.getBoundingClientRect();
    const mk = Math.min(1, Math.max(0, (vh * .85 - mr.top) / (mr.height + vh * .35)));
    const lit = Math.round(mk * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < lit));
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', () => { gut = parseFloat(getComputedStyle($('.wrap')).paddingLeft) || 20; onScroll(); movePill($('.tab.on')); });

  /* Menú móvil */
  const burger = $('#burger'), mnav = $('#mnav');
  const toggleMenu = open => {
    nav.classList.toggle('open', open); mnav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open); document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggleMenu(!mnav.classList.contains('open')));
  $$('a', mnav).forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  /* Cursor amarillo */
  const cur = $('#cursor');
  if (matchMedia('(hover: hover)').matches && !reduce) {
    let x = -50, y = -50, cx = -50, cy = -50;
    addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; }, { passive: true });
    const loop = () => { cx += (x - cx) * .2; cy += (y - cy) * .2; cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); };
    loop();
    document.addEventListener('mouseover', e => cur.classList.toggle('big', !!e.target.closest('a, button, .film, input, select, textarea')));
  } else cur.remove();

  /* Formulario (envío sin salir de la página) */
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, btn = $('button[type=submit]', f);
    btn.disabled = true; btn.textContent = 'Enviando…';
    fetch(f.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(f) })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => { f.reset(); $('#form-ok').style.display = 'block'; btn.textContent = 'Enviado ✓'; })
      .catch(() => { btn.disabled = false; btn.textContent = 'Reintentar'; alert('No se pudo enviar. Escríbenos a info@mcfilmsecuador.com o por WhatsApp.'); });
  });

  $('#yr').textContent = new Date().getFullYear();

  /* Init */
  renderPlans('bodas');
  requestAnimationFrame(() => movePill($('.tab.on')));
  onHrs();
  onScroll();
})();
