(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.quarto-post').forEach((post) => post.setAttribute('data-reveal', ''));
  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-in'));
  }

  const frame = document.querySelector('[data-crossfade]');
  if (frame && !reduceMotion) {
    const images = Array.from(frame.querySelectorAll('img')).slice(0, 3);
    const count = document.querySelector('[data-slide-count]');
    let current = 0;
    let timer;
    const advance = () => {
      images[current].classList.remove('is-active');
      current = (current + 1) % images.length;
      images[current].classList.add('is-active');
      if (count) count.textContent = `${current + 1} / ${images.length}`;
    };
    const start = () => { timer = window.setInterval(advance, 5600); };
    const stop = () => { window.clearInterval(timer); };
    start();
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  }

  const filters = document.querySelectorAll('[data-filter]');
  const projects = document.querySelectorAll('[data-topics]');
  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.filter;
      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      projects.forEach((project) => {
        const visible = selected === 'all' || project.dataset.topics.split(' ').includes(selected);
        project.hidden = !visible;
      });
    });
  });
})();
