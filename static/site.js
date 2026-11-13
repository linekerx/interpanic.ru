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
