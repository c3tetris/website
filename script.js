// Mobile navigation toggle
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('mobile-menu');

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.setAttribute('aria-label', open ? 'Ouvrir le menu' : 'Fermer le menu');
  menu.hidden = open;
});

// Close the mobile menu after tapping a link
menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
  });
});

// Scroll-reveal with IntersectionObserver
const revealEls = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Avoid overlapping the contact panel while keeping one booking action visible.
const floatingCalendly = document.querySelector('.calendly-float');
const inlineCalendly = document.querySelector('.contact-booking');

if (floatingCalendly && inlineCalendly && 'IntersectionObserver' in window) {
  const updateBookingVisibility = () => {
    const rect = inlineCalendly.getBoundingClientRect();
    const inlineIsVisible = rect.width > 0 && rect.height > 0
      && rect.bottom > 0 && rect.top < window.innerHeight
      && rect.right > 0 && rect.left < window.innerWidth;
    floatingCalendly.classList.toggle('is-replaced-by-inline', inlineIsVisible);
  };
  const bookingObserver = new IntersectionObserver(updateBookingVisibility, { threshold: 0.3 });
  bookingObserver.observe(inlineCalendly);
  window.addEventListener('scroll', updateBookingVisibility, { passive: true });
  window.addEventListener('resize', updateBookingVisibility);
  updateBookingVisibility();
}

// Calendly popup; the visible link remains a fallback if the widget cannot load.
document.querySelectorAll('[data-calendly-popup]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
      event.preventDefault();
      window.Calendly.initPopupWidget({ url: link.href });
    }
  });
});
