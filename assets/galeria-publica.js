// McFilms Gallery: fotos que el estudio elige en McFilms Studio («Elegir fotos para la web»).
// Columnas que se desplazan a distinta velocidad al bajar, fotos que aparecen al entrar en pantalla y visor grande.
(() => {
  const sec = document.getElementById('galeria');
  if (!sec) return;
  const BASE = /mcfilmsecuador\.com$/.test(location.hostname) ? '' : 'https://mcfilmsecuador.com';
  const stage = document.getElementById('gp-stage'), chips = document.getElementById('gp-chips'), mas = document.getElementById('gp-mas');
  const lbx = document.getElementById('gp-lbx'), img = document.getElementById('gp-img'), pie = document.getElementById('gp-pie');
  const PASO = 18, reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let fotos = [], filtro = null, visibles = PASO, lista = [], actual = 0, cols = [];

  const aparecer = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); aparecer.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });

  const pintar = () => {
    lista = filtro ? fotos.filter((f) => f.boda === filtro) : fotos;
    const n = innerWidth <= 760 ? 2 : 3;
    cols = Array.from({ length: n }, () => Object.assign(document.createElement('div'), { className: 'gp-col' }));
    const alto = cols.map(() => 0);
    lista.slice(0, visibles).forEach((f, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'gp-it'; b.style.aspectRatio = `${f.w} / ${f.h}`;
      b.style.transitionDelay = `${(i % n) * 90}ms`;
      b.setAttribute('aria-label', `Ver foto de ${f.boda}`);
      const im = document.createElement('img');
      im.src = `${BASE}/gallery/media/${f.id}/grid`; im.alt = `Boda de ${f.boda} · McFilms Gallery`; im.loading = 'lazy'; im.decoding = 'async';
      const nombre = document.createElement('span'); nombre.textContent = f.boda;
      b.append(im, nombre);
      b.onclick = () => abrir(i);
      const k = alto.indexOf(Math.min(...alto)); // a la columna más baja: mosaico parejo
      cols[k].append(b); alto[k] += f.h / f.w;
      aparecer.observe(b);
    });
    stage.style.setProperty('--gp-cols', n);
    stage.replaceChildren(...cols);
    mas.style.display = lista.length > visibles ? '' : 'none';
    chips.querySelectorAll('button').forEach((c) => c.classList.toggle('on', (c.dataset.boda || null) === filtro));
    mover();
  };

  // Paralaje: la columna central sube más rápido que las de los lados.
  const vel = [0, 140, 60];
  const mover = () => {
    if (reducir || sec.hidden) return;
    const r = sec.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = (innerHeight - r.top) / (r.height + innerHeight) - 0.5;
    cols.forEach((c, i) => { c.style.transform = `translate3d(0, ${(-p * vel[i % 3]).toFixed(1)}px, 0)`; });
  };
  let tick = false;
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; mover(); }); } }, { passive: true });
  let ancho = innerWidth;
  addEventListener('resize', () => { if ((innerWidth <= 760) !== (ancho <= 760)) { ancho = innerWidth; if (fotos.length) pintar(); } });

  const cambiar = (b) => { stage.classList.add('fuera'); setTimeout(() => { filtro = b; visibles = PASO; pintar(); stage.classList.remove('fuera'); }, 300); };
  const abrir = (i) => { actual = (i + lista.length) % lista.length; const f = lista[actual]; img.src = `${BASE}/gallery/media/${f.id}/large`; pie.textContent = f.boda; lbx.hidden = false; document.body.style.overflow = 'hidden'; };
  const cerrar = () => { lbx.hidden = true; document.body.style.overflow = ''; };
  document.getElementById('gp-x').onclick = cerrar;
  document.getElementById('gp-a').onclick = () => abrir(actual - 1);
  document.getElementById('gp-s').onclick = () => abrir(actual + 1);
  lbx.addEventListener('click', (e) => { if (e.target === lbx) cerrar(); });
  addEventListener('keydown', (e) => { if (lbx.hidden) return; if (e.key === 'Escape') cerrar(); if (e.key === 'ArrowRight') abrir(actual + 1); if (e.key === 'ArrowLeft') abrir(actual - 1); });
  mas.onclick = () => { visibles += PASO; pintar(); };

  fetch(`${BASE}/gallery/api/portafolio`).then((r) => (r.ok ? r.json() : [])).then((d) => {
    fotos = d;
    if (!fotos.length) { document.querySelectorAll('[data-gp]').forEach((a) => a.remove()); return; }
    const bodas = [...new Set(fotos.map((f) => f.boda))];
    if (bodas.length > 1) {
      const chip = (t, b) => { const c = document.createElement('button'); c.type = 'button'; c.textContent = t; if (b) c.dataset.boda = b; c.onclick = () => cambiar(b); return c; };
      chips.replaceChildren(chip('Todas', null), ...bodas.map((b) => chip(b, b)));
    }
    sec.hidden = false;
    // Título y textos con la misma animación de entrada que el resto de la página.
    const rev = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); } }), { threshold: 0.15 });
    sec.querySelectorAll('.rv, .split').forEach((x) => rev.observe(x));
    pintar();
    dispatchEvent(new Event('mcf:paneles')); // la página recalcula el apilado de secciones con esta incluida
  }).catch(() => {});
})();
