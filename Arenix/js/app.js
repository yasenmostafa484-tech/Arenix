/**
 * ARENIX APP COORDINATOR
 * Global Scroll Reveals, Micro-interactions, Process Timeline Progression,
 * Number Count-up Animation, FAQ Accordion, and Smooth Scrolling.
 */

(function () {
  'use strict';

  // 1. Smooth anchor scrolling helper
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const navHeight = 90;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 2. Dynamic Year in footer
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 3. Global Scroll Reveal Observer (Precision & Staggered Viewport Reveals)
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: reveal immediately
    document.querySelectorAll('.reveal-on-scroll').forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  // 4. Subtle Number Count-Up Animation (For existing stat: "05 Live Deployments")
  const countElements = document.querySelectorAll('.count-up-number');
  if ('IntersectionObserver' in window && countElements.length > 0) {
    const countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target') || el.textContent, 10);
          if (!isNaN(target)) {
            let start = 0;
            const duration = 800; // ms
            const startTime = performance.now();

            function updateNumber(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(easeOut * target);
              el.textContent = current < 10 ? '0' + current : current;

              if (progress < 1) {
                requestAnimationFrame(updateNumber);
              } else {
                el.textContent = target < 10 ? '0' + target : target;
              }
            }
            requestAnimationFrame(updateNumber);
          }
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    countElements.forEach(function (el) {
      countObserver.observe(el);
    });
  }

  // 5. Capability Card Focus/Hover enhancement
  const capabilityCards = document.querySelectorAll('.capability-card');
  capabilityCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      capabilityCards.forEach(function (c) {
        if (c !== card) c.style.opacity = '0.55';
      });
    });

    card.addEventListener('mouseleave', function () {
      capabilityCards.forEach(function (c) {
        c.style.opacity = '1';
      });
    });
  });

  // 6. Process Step Scroll-Driven Active Progression
  const processItems = document.querySelectorAll('.process-item');
  if ('IntersectionObserver' in window && processItems.length > 0) {
    const processObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          processItems.forEach(function (p) { p.classList.remove('active-step'); });
          entry.target.classList.add('active-step');
        }
      });
    }, {
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.3
    });

    processItems.forEach(function (item) {
      processObserver.observe(item);
    });
  }

  processItems.forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      processItems.forEach(function (p) {
        if (p !== item) p.style.opacity = '0.55';
      });
    });

    item.addEventListener('mouseleave', function () {
      processItems.forEach(function (p) {
        p.style.opacity = '1';
      });
    });
  });

  // 7. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(function (i) { i.classList.remove('open'); });
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // 8. Project Case Study Drawer Accordion Toggle
  const caseStudyToggles = document.querySelectorAll('.case-study-toggle');
  caseStudyToggles.forEach(function (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      const targetId = this.getAttribute('aria-controls');
      const drawer = targetId ? document.getElementById(targetId) : null;
      if (!drawer) return;

      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('open');
        const textSpan = this.querySelector('span');
        if (textSpan) textSpan.textContent = 'View Case Study';
      } else {
        this.setAttribute('aria-expanded', 'true');
        drawer.classList.add('open');
        const textSpan = this.querySelector('span');
        if (textSpan) textSpan.textContent = 'Hide Case Study';
      }
    });
  });
})();
