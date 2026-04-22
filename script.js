/* ─────────────────────────────────────────────
   BARBERSHOP69 — script.js
───────────────────────────────────────────── */

'use strict';

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), Number(delay));
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Map iframe fallback ── */
// If iframe fails to load (no API key), show the fallback link
const mapFrame = document.querySelector('.map-frame iframe');
const mapFallback = document.querySelector('.map-fallback');

if (mapFrame && mapFallback) {
  // Always show fallback as the clickable overlay (on top of the iframe attempt)
  mapFrame.addEventListener('error', () => {
    mapFallback.style.display = 'flex';
  });

  // Check after short delay if iframe seems empty (no key = blocked)
  setTimeout(() => {
    try {
      const doc = mapFrame.contentDocument || mapFrame.contentWindow?.document;
      // If we can read it and it's empty, show fallback
      if (!doc || doc.body?.innerHTML?.trim() === '') {
        mapFallback.style.display = 'flex';
      }
    } catch (e) {
      // Cross-origin = Google loaded OK, hide fallback
      mapFallback.style.display = 'none';
    }
  }, 3000);
}

/* ── Smooth anchor scroll with offset ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 70;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => sectionObserver.observe(s));

/* ── Gallery: prevent layout shift on load ── */
document.querySelectorAll('.gallery-item img').forEach(img => {
  if (img.complete) return;
  img.style.opacity = '0';
  img.addEventListener('load', () => {
    img.style.transition = 'opacity 0.6s ease';
    img.style.opacity = '1';
  });
});

/* ── Cursor gold dot (desktop only) ── */
if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.id = 'cursor-dot';
  Object.assign(cursor.style, {
    position: 'fixed',
    width: '8px', height: '8px',
    borderRadius: '50%',
    background: 'var(--gold, #c9a227)',
    pointerEvents: 'none',
    zIndex: '9999',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.3s, transform 0.15s',
    opacity: '0',
    willChange: 'transform',
  });
  document.body.appendChild(cursor);

  let cx = -100, cy = -100;
  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    cursor.style.opacity = '0.7';
  });

  // Scale up on interactive elements
  const hoverTargets = 'a, button, .service-card, .gallery-item';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      cursor.style.opacity = '0.4';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.opacity = '0.7';
    });
  });

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
}

/* ── Service card staggered reveal (extra polish) ── */
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, i) => {
  card.dataset.delay = i * 80;
});
