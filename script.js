// Nav scroll
const nav = document.getElementById('nav');
const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
}

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Animated counters
const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const dur = 1600; const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

// Companies carousel
const companiesCarousel = document.getElementById('companiesCarousel');
const carouselTrack = document.getElementById('carouselTrack');
if (companiesCarousel && carouselTrack) {
  const cards = carouselTrack.querySelectorAll('.company-card');
  cards.forEach(c => {
    const clone = c.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    carouselTrack.appendChild(clone);
  });
  const allCards = carouselTrack.querySelectorAll('.company-card');
  let pos = 0;
  let cardW = 280;
  const measure = () => { cardW = (allCards[0]?.offsetWidth || 280) + 24; };
  measure();
  window.addEventListener('resize', measure);
  const speed = 0.6;
  let raf = null;
  const step = () => {
    pos -= speed;
    const half = cardW * (allCards.length / 2);
    if (pos <= -half) pos += half;
    carouselTrack.style.transform = `translateX(${pos}px)`;
    raf = requestAnimationFrame(step);
  };
  const start = () => { if (!raf) raf = requestAnimationFrame(step); };
  const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = null; } };
  const jump = (dir) => {
    stop();
    pos += dir * cardW;
    carouselTrack.style.transform = `translateX(${pos}px)`;
    start();
  };
  start();
  companiesCarousel.addEventListener('mouseenter', stop);
  companiesCarousel.addEventListener('mouseleave', start);
  companiesCarousel.addEventListener('touchstart', stop, { passive: true });
  companiesCarousel.addEventListener('touchend', start, { passive: true });
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (prevBtn) prevBtn.addEventListener('click', () => jump(1));
  if (nextBtn) nextBtn.addEventListener('click', () => jump(-1));
}

// Chips: click to reveal description
const chips = document.querySelectorAll('.chip');
const chipInfo = document.getElementById('chipInfo');
const chipTitle = document.getElementById('chipTitle');
const chipDesc = document.getElementById('chipDesc');
if (chips.length && chipInfo) {
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const isActive = chip.classList.contains('active');
      chips.forEach(c => c.classList.remove('active'));
      if (isActive) {
        chipInfo.classList.remove('show');
      } else {
        chip.classList.add('active');
        chipTitle.textContent = chip.textContent;
        chipDesc.textContent = chip.dataset.desc;
        chipInfo.classList.add('show');
        const navH = (document.getElementById('nav')?.offsetHeight || 64) + 12;
        const top = chipInfo.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}
