/**
 * main.js
 * UI behaviour: mobile nav, scroll reveals, sticky header,
 * hero parallax, dynamic header height, responsive hero background.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initStickyHeader();
  initScrollReveal();
  initSmoothScroll();
  initHeroParallax();
  initHeroBackgroundSwitch();
  initHeaderHeight();
});

// ── MOBILE NAV ───────────────────────────────────────────────────────────────
function initMobileNav() {
  const toggle  = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const overlay = document.getElementById('nav-overlay');
  const navLinks = navMenu ? navMenu.querySelectorAll('.nav-link') : [];

  if (!toggle || !navMenu) return;

  function openNav() {
    navMenu.classList.add('is-open');
    overlay && overlay.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navMenu.classList.remove('is-open');
    overlay && overlay.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    navMenu.classList.contains('is-open') ? closeNav() : openNav();
  });

  overlay && overlay.addEventListener('click', closeNav);
  navLinks.forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
}

// ── STICKY HEADER ────────────────────────────────────────────────────────────
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let lastScroll = 0;
  const threshold = 60;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    header.classList.toggle('is-scrolled', current > threshold);

    if (current > lastScroll && current > 200) {
      header.classList.add('is-hidden');
    } else {
      header.classList.remove('is-hidden');
    }
    lastScroll = current <= 0 ? 0 : current;
  }, { passive: true });
}

// ── HEADER HEIGHT — keep --header-h variable in sync on resize ────────────────
function initHeaderHeight() {
  const header = document.getElementById('site-header');
  function update() {
    document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);
  }
  update();
  window.addEventListener('resize', update, { passive: true });
}

// ── HERO PARALLAX — gentle scale + backdrop tilt on scroll ───────────────────
function initHeroParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  // Scale the hero background layers slightly as user scrolls
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroH    = hero.offsetHeight;
    if (scrolled > heroH) return;

    const progress = scrolled / heroH;          // 0 → 1 while hero is in view
    const scale    = 1 + progress * 0.04;       // 1 → 1.04
    const translateY = progress * 60;           // image drifts down slightly

    hero.querySelectorAll('.hero-bg').forEach(bg => {
      bg.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    });
  }, { passive: true });
}

// ── HERO BACKGROUND SWITCH — show desktop image above 900px, mobile below ─────
function initHeroBackgroundSwitch() {
  const desktopBg = document.querySelector('.hero-bg--desktop');
  const mobileBg  = document.querySelector('.hero-bg--mobile');

  if (!desktopBg || !mobileBg) return;

  function updateBg() {
    const isDesktop = window.innerWidth >= 900;
    desktopBg.style.display = isDesktop ? 'block' : 'none';
    mobileBg.style.display  = isDesktop ? 'none'  : 'block';
  }

  updateBg();
  window.addEventListener('resize', updateBg, { passive: true });
}

// ── SCROLL REVEAL ─────────────────────────────────────────────────────────────
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -50px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}

// ── SMOOTH SCROLL ────────────────────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const headerH = document.getElementById('site-header')?.offsetHeight || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
