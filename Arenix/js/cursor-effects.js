/**
 * ARENIX BESPOKE CURSOR & MAGNETIC INTERACTIONS
 * Tactile, restrained, high-end cursor feedback and magnetic button springs.
 * Apple-level restraint + Linear-level smoothness.
 * Automatically disabled on touch/mobile devices and reduced motion.
 */

(function () {
  'use strict';

  // Strict mobile/touch and accessibility check
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 1. Create Minimalist Contextual Cursor DOM elements
  const cursorDot = document.createElement('div');
  const cursorFollower = document.createElement('div');
  const cursorLabel = document.createElement('span');

  cursorDot.className = 'custom-cursor-dot';
  cursorFollower.className = 'custom-cursor-follower';
  cursorLabel.className = 'custom-cursor-label';
  cursorLabel.textContent = 'VIEW ↗';

  cursorFollower.appendChild(cursorLabel);
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorFollower);

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  window.addEventListener('mouseleave', function () {
    cursorDot.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });

  window.addEventListener('mouseenter', function () {
    cursorDot.style.opacity = '1';
    cursorFollower.style.opacity = '1';
  });

  function updateFollower() {
    followerX += (mouseX - followerX) * 0.16;
    followerY += (mouseY - followerY) * 0.16;
    cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
    requestAnimationFrame(updateFollower);
  }
  requestAnimationFrame(updateFollower);

  // 2. Contextual Cursor States
  function attachCursorInteractions() {
    // Portfolio Preview Windows -> Contextual VIEW label
    const portfolioTargets = document.querySelectorAll('.preview-window, .project-showcase-item');
    portfolioTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursorFollower.classList.add('portfolio-hover');
      });
      el.addEventListener('mouseleave', function () {
        cursorFollower.classList.remove('portfolio-hover');
      });
    });

    // Standard Interactive Elements -> Expanded ring
    const interactiveElements = document.querySelectorAll('a, button, .type-pill, .faq-question');
    interactiveElements.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        if (!cursorFollower.classList.contains('portfolio-hover')) {
          cursorFollower.classList.add('active');
        }
      });
      el.addEventListener('mouseleave', function () {
        cursorFollower.classList.remove('active');
      });
    });
  }
  attachCursorInteractions();

  // 3. Subtle Magnetic Button Spring Engine (3–6px range max)
  const magneticTargets = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta, .project-view-link, .contact-channel-btn');

  magneticTargets.forEach(function (btn) {
    const icon = btn.querySelector('.btn-icon-arrow, svg');
    let rafId = null;

    btn.addEventListener('mousemove', function (e) {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * 0.18; // Max ~4-6px
      const deltaY = (e.clientY - centerY) * 0.18;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function () {
        btn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
        if (icon) {
          icon.style.transform = `translate3d(${deltaX * 0.45}px, ${deltaY * 0.45}px, 0)`;
        }
      });
    });

    btn.addEventListener('mouseleave', function () {
      if (rafId) cancelAnimationFrame(rafId);
      btn.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
      btn.style.transform = 'translate3d(0, 0, 0)';
      if (icon) {
        icon.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
        icon.style.transform = 'translate3d(0, 0, 0)';
      }

      setTimeout(function () {
        btn.style.transition = '';
        if (icon) icon.style.transition = '';
      }, 400);
    });
  });
})();
