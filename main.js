/**
 * main.js
 * UI behaviour: mobile nav, scroll reveals, sticky header.
 * No copy lives here — all text is in content.json / content.js.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initStickyHeader();
  initScrollReveal();
  initSmoothScroll();
});

// ── MOBILE NAV ───────────────────────────────────────────────────────────────
function initMobileNav() {
  const toggle   = document.getElementById('nav-toggle');
  const navMenu  = document.getElementById('nav-menu');
  const overlay  = document.getElementById('nav-overlay');
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
    const isOpen = navMenu.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  });

  overlay && overlay.addEventListener('click', closeNav);

  navLinks.forEach(link => link.addEventListener('click', closeNav));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });
}

// ── STICKY HEADER ────────────────────────────────────────────────────────────
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let lastScroll = 0;
  const threshold = 80;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    if (current > threshold) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    // Hide on scroll down, show on scroll up (mobile UX)
    if (current > lastScroll && current > 200) {
      header.classList.add('is-hidden');
    } else {
      header.classList.remove('is-hidden');
    }

    lastScroll = current <= 0 ? 0 : current;
  }, { passive: true });
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
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
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
      const headerH = document.getElementById('site-header')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
