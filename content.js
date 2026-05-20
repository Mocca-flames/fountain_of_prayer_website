/**
 * content.js
 * Loads content.json and populates the DOM.
 * All copy lives in content.json — edit there, not in index.html.
 */

async function loadContent() {
  try {
    const response = await fetch('./content.json');
    if (!response.ok) throw new Error('Failed to load content.json');
    const data = await response.json();
    populatePage(data);
  } catch (err) {
    console.error('[FOP] Content load error:', err);
  }
}

function populatePage(d) {
  // ── HEADER ─────────────────────────────────────────────────────────────────
  setText('[data-content="church-name"]',    d.church.name);
  setAttr('[data-content="church-name"]', 'aria-label', d.church.name);
  setText('[data-content="church-tagline"]', d.church.tagline);
  setAttr('[data-content="btn-call"]',   'href', `tel:${d.church.phone.replace(/\s/g,'')}`);
  setText('[data-content="btn-call"]',   `${d.church.phone}`);
  setAttr('[data-content="btn-maps"]',   'href', d.church.googleMapsUrl);

  // ── HERO ───────────────────────────────────────────────────────────────────
  setHTML('[data-content="hero-headline"]',    d.hero.headline);
  setText('[data-content="hero-subheadline"]', d.hero.subheadline);
  setAttr('[data-content="hero-cta-primary"]',   'href',  d.hero.ctaPrimary.href);
  setText('[data-content="hero-cta-primary"]',   d.hero.ctaPrimary.label);
  setAttr('[data-content="hero-cta-secondary"]', 'href',  d.hero.ctaSecondary.href);
  setText('[data-content="hero-cta-secondary"]', d.hero.ctaSecondary.label);

  // ── PILLARS ────────────────────────────────────────────────────────────────
  const pillarsContainer = document.querySelector('[data-content="pillars-list"]');
  if (pillarsContainer) {
    pillarsContainer.innerHTML = d.pillars.map(p => `
      <div class="pillar-card">
        <div class="pillar-icon pillar-icon--${p.icon}" aria-hidden="true">
          ${getPillarSVG(p.icon)}
        </div>
        <h3 class="pillar-title">${p.title}</h3>
        <p class="pillar-desc">${p.description}</p>
      </div>
    `).join('');
  }

  // ── SERVICES SECTION ───────────────────────────────────────────────────────
  setText('[data-content="services-title"]',    d.services.sectionTitle);
  setText('[data-content="services-subtitle"]', d.services.sectionSubtitle);

  // In-person services
  const ipContainer = document.querySelector('[data-content="inperson-list"]');
  if (ipContainer) {
    ipContainer.innerHTML = d.services.inPerson.items.map((s, i) => `
      <div class="service-card" style="--delay:${i * 0.1}s">
        <span class="service-day">${s.day}</span>
        <h3 class="service-name">${s.name}</h3>
        <div class="service-time">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${s.time}
        </div>
        <p class="service-desc">${s.description}</p>
      </div>
    `).join('');
  }

  // Radio
  setText('[data-content="radio-station"]', d.services.radio.station);
  setText('[data-content="radio-intro"]',   d.services.radio.intro);

  const radioContainer = document.querySelector('[data-content="radio-list"]');
  if (radioContainer) {
    radioContainer.innerHTML = d.services.radio.items.map(r => `
      <div class="radio-slot">
        <div class="radio-slot__header">
          <span class="radio-day">${r.day}</span>
          <span class="radio-time">${r.time}</span>
        </div>
        <p class="radio-note">${r.note}</p>
      </div>
    `).join('');
  }

  // ── ABOUT ──────────────────────────────────────────────────────────────────
  setText('[data-content="about-title"]',   d.about.sectionTitle);
  setHTML('[data-content="about-body"]',    d.about.body);
  setText('[data-content="leader-statement"]', d.about.leaderStatement);

  const communitiesEl = document.querySelector('[data-content="communities-list"]');
  if (communitiesEl) {
    communitiesEl.innerHTML = d.about.communities
      .map(c => `<span class="community-tag">${c}</span>`)
      .join('');
  }

  // ── CONTACT ────────────────────────────────────────────────────────────────
  setText('[data-content="contact-title"]',    d.contact.sectionTitle);
  setText('[data-content="contact-subtitle"]', d.contact.sectionSubtitle);

  setText('[data-content="contact-address"]', d.church.address.full);
  setAttr('[data-content="contact-address-link"]', 'href', d.church.googleMapsUrl);

  setAttr('[data-content="contact-phone-link"]', 'href', `tel:${d.church.phone.replace(/\s/g,'')}`);
  setText('[data-content="contact-phone-link"]', d.church.phone);

  const emailLink = document.querySelector('[data-content="contact-email-link"]');
  if (emailLink) {
    emailLink.href = `mailto:${d.church.email}`;
    emailLink.textContent = d.church.email;
  }

  setText('[data-content="review-callout"]', d.contact.reviewCallout);

  // ── FOOTER ─────────────────────────────────────────────────────────────────
  setText('[data-content="footer-name"]',      d.church.name);
  setAttr('[data-content="footer-fb"]',        'href', d.church.facebookUrl);
  setAttr('[data-content="footer-phone-link"]','href', `tel:${d.church.phone.replace(/\s/g,'')}`);
  setText('[data-content="footer-phone-link"]', d.church.phone);

  const year = new Date().getFullYear();
  setText('[data-content="footer-copy"]', `© ${year} ${d.footer.copyright}`);

  const navLinks = document.querySelector('[data-content="footer-nav"]');
  if (navLinks) {
    navLinks.innerHTML = d.footer.quickLinks
      .map(l => `<li><a href="${l.href}" class="footer-link">${l.label}</a></li>`)
      .join('');
  }
}

// ── HELPERS ─────────────────────────────────────────────────────────────────
function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}
function setHTML(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = value;
}
function setAttr(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

function getPillarSVG(icon) {
  const icons = {
    flame: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><path d="M12 2c0 0-7 6-7 12a7 7 0 0014 0c0-6-7-12-7-12z"/><path d="M12 12c0 0-3 2-3 4a3 3 0 006 0c0-2-3-4-3-4z" fill="currentColor" opacity="0.4"/></svg>`,
    hands: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><path d="M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v0M14 10V4a2 2 0 00-2-2v0a2 2 0 00-2 2v2M10 10.5V6a2 2 0 00-2-2v0a2 2 0 00-2 2v8"/><path d="M18 8a2 2 0 114 0v6a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 012.83-2.82L7 15"/></svg>`,
    star:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77" fill="currentColor" opacity="0.2"/></svg>`
  };
  return icons[icon] || icons.star;
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', loadContent);
