// Galería pública: fotos que el estudio marca «en la web» (🌐) en McFilms Studio.
(() => {
  const sec = document.getElementById('galeria');
  if (!sec) return;
  const BASE = /mcfilmsecuador\.com$/.test(location.hostname) ? '' : 'https://mcfilmsecuador.com';
  const grid = document.getElementById('gp-grid'), chips = document.getElementById('gp-chips'), mas = document.getElementById('gp-mas');
  const lbx = document.getElementById('gp-lbx'), img = document.getElementById('gp-img'), pie = document.getElementById('gp-pie');
  const PASO = 24;
  let fotos = [], filtro = null, visibles = PASO, lista = [], actual = 0;

  const pintar = () => {
    lista = filtro ? fotos.filter((f) => f.boda === filtro) : fotos;
    grid.replaceChildren(...lista.slice(0, visibles).map((f, i) => {
      const a = document.createElement('button');
      a.type = 'button'; a.className = 'gp-it'; a.style.aspectRatio = `${f.w} / ${f.h}`;
      a.setAttribute('aria-label', `Ver foto de ${f.boda}`);
      const im = document.createElement('img');
      im.src = `${BASE}/gallery/media/${f.id}/grid`; im.alt = `Boda de ${f.boda} · MCFILMS`; im.loading = 'lazy'; im.decoding = 'async';
      im.onload = () => a.classList.add('ok');
      a.append(im);
      a.onclick = () => abrir(i);
      return a;
    }));
    mas.style.display = lista.length > visibles ? '' : 'none';
    chips.querySelectorAll('button').forEach((b) => b.classList.toggle('on', (b.dataset.boda || null) === filtro));
  };
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
      const chip = (t, b) => { const c = document.createElement('button'); c.type = 'button'; c.textContent = t; if (b) c.dataset.boda = b; c.onclick = () => { filtro = b; visibles = PASO; pintar(); }; return c; };
      chips.replaceChildren(chip('Todas', null), ...bodas.map((b) => chip(b, b)));
    }
    sec.hidden = false;
    pintar();
  }).catch(() => {});
})();
