(() => {
  document.documentElement.classList.add('js');

  // плавное появление блоков
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const i = [...en.target.parentElement.children].indexOf(en.target);
        en.target.style.transitionDelay = Math.min(i, 6) * 70 + 'ms';
        en.target.classList.add('in');
        io.unobserve(en.target);
        setTimeout(() => { en.target.style.transitionDelay = ''; }, 1200);
      });
    }, { threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }

  // галерея фотографий на странице проекта: свайп, стрелки, точки, клавиатура
  document.querySelectorAll('[data-gallery]').forEach((g) => {
    const track = g.querySelector('.g-track');
    const slides = [...track.children];
    const prev = g.querySelector('.g-prev');
    const next = g.querySelector('.g-next');
    const count = g.querySelector('.g-count');
    const dots = [...g.querySelectorAll('.g-dots button')];
    const pad = (n) => String(n).padStart(2, '0');
    let cur = -1;

    const update = () => {
      const i = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
      if (i === cur) return;
      cur = Math.max(0, Math.min(slides.length - 1, i));
      count.textContent = pad(cur + 1) + ' / ' + pad(slides.length);
      dots.forEach((d, k) => d.setAttribute('aria-current', k === cur ? 'true' : 'false'));
      prev.disabled = cur === 0;
      next.disabled = cur === slides.length - 1;
    };
    const go = (i) => {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: i * track.clientWidth });
    };

    prev.addEventListener('click', () => go(cur - 1));
    next.addEventListener('click', () => go(cur + 1));
    dots.forEach((d, k) => d.addEventListener('click', () => go(k)));
    track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    track.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowLeft') { ev.preventDefault(); go(cur - 1); }
      if (ev.key === 'ArrowRight') { ev.preventDefault(); go(cur + 1); }
    });
    window.addEventListener('resize', () => { const c = cur; cur = -1; track.scrollLeft = c * track.clientWidth; update(); });
    update();
  });

  // фильтр по тегам
  const chips = document.querySelectorAll('.chip');
  const cards = document.querySelectorAll('#projects .card');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.toggle('is-on', c === chip));
    const tag = chip.dataset.tag;
    cards.forEach((card) => {
      const tags = (card.dataset.tags || '').split('|');
      card.hidden = !!tag && !tags.includes(tag);
    });
  }));
})();
