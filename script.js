(() => {
  'use strict';

  const menu = document.querySelector('.mobile-menu');
  if (menu) {
    menu.querySelectorAll('nav a').forEach((link) => {
      link.addEventListener('click', () => { menu.open = false; });
    });
    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target)) menu.open = false;
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.open) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    });
    const desktop = window.matchMedia('(min-width: 851px)');
    desktop.addEventListener('change', (event) => {
      if (event.matches) menu.open = false;
    });
  }

  // Everything remains visible and usable when animation libraries are unavailable.
  if (!window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const motion = gsap.matchMedia();

  motion.add('(prefers-reduced-motion: no-preference)', () => {
    // Keep the hero visible immediately; animate below-fold sections as they enter.

    gsap.utils.toArray('.section-heading, .pickup-copy, .contact-intro').forEach((element) => {
      gsap.from(element, {
        y: 24, duration: 0.85, ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: element, start: 'top 96%', once: true }
      });
    });

    gsap.utils.toArray('.services-grid, .pricing-grid, .order-steps, .contact-grid').forEach((group) => {
      // Each item owns a trigger so lower cards never animate while off-screen on phones.
      Array.from(group.children).forEach((element, index) => {
        gsap.from(element, {
          y: 32, duration: 0.8,
          delay: window.matchMedia('(min-width: 851px)').matches ? index * 0.1 : 0,
          ease: 'power2.out', clearProps: 'transform,opacity',
          scrollTrigger: { trigger: element, start: 'top 97%', once: true }
        });
      });
    });

    gsap.fromTo('.hero-image img', { scale: 1.06, yPercent: -2 }, {
      scale: 1.01, yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero-image', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
    gsap.fromTo('.pickup-image img', { scale: 1.08 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.pickup-image', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });

    gsap.to('.scroll-progress', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: document.documentElement, start: 0, end: 'max', scrub: 0.2 }
    });
  });

  motion.add('(min-width: 1101px) and (prefers-reduced-motion: no-preference)', () => {
    ScrollTrigger.create({
      trigger: '.faq-layout > div:first-child',
      start: 'top 130px',
      endTrigger: '.faq-list',
      end: 'bottom 440px',
      pin: true,
      pinSpacing: false
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
