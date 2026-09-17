/**
 * ARENIX NAVIGATION CONTROLLER
 * Adaptive Floating Pill, Context Breadcrumb Tracker, Fullscreen Mobile Menu
 */

(function () {
  'use strict';

  const currentSectionLabel = document.getElementById('navCurrentSection');
  const navIsland = document.getElementById('navIsland');
  const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
  const mobileMenuClose = document.getElementById('mobileNavClose');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.nav-link');
  const heroSection = document.getElementById('hero');
  const mobileStickyBar = document.getElementById('mobileStickyBar');

  // Track sections for dynamic breadcrumb header & scroll-spy
  const sections = [
    { id: 'hero', label: 'INDEX' },
    { id: 'work', label: 'WORK' },
    { id: 'positioning', label: 'VISION' },
    { id: 'studio', label: 'STUDIO' },
    { id: 'capabilities', label: 'CAPABILITIES' },
    { id: 'standards', label: 'STANDARDS' },
    { id: 'process', label: 'PROCESS' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'CONTACT' }
  ];

  // Specific navigation sections mapped to sticky nav links
  const navSectionIds = ['work', 'studio', 'capabilities', 'standards', 'process', 'faq'];

  function updateActiveSection() {
    const scrollY = window.scrollY;
    const viewportOffset = 220;

    // 1. Determine active section for scroll-spy and breadcrumb
    let currentLabel = 'INDEX';
    let activeNavId = null;

    for (let i = sections.length - 1; i >= 0; i--) {
      const sectionEl = document.getElementById(sections[i].id);
      if (sectionEl) {
        const top = sectionEl.offsetTop - viewportOffset;
        if (scrollY >= top) {
          currentLabel = sections[i].label;
          if (navSectionIds.includes(sections[i].id)) {
            activeNavId = sections[i].id;
          } else if (sections[i].id === 'positioning') {
            activeNavId = 'work';
          }
          break;
        }
      }
    }

    // 2. Update Breadcrumb Label
    if (currentSectionLabel && currentSectionLabel.textContent !== currentLabel) {
      currentSectionLabel.style.opacity = '0';
      setTimeout(function () {
        currentSectionLabel.textContent = currentLabel;
        currentSectionLabel.style.opacity = '1';
      }, 120);
    }

    // 3. Update Desktop & Mobile Nav Links Active State (Scroll-Spy)
    desktopNavLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        if (activeNavId && targetId === activeNavId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });

    mobileNavLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        if (activeNavId && targetId === activeNavId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });

    // 4. Mobile Sticky Bottom CTA Bar (Appears when scrolled past Hero)
    if (mobileStickyBar && heroSection) {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      if (heroBottom <= 80) {
        mobileStickyBar.classList.add('visible');
        mobileStickyBar.setAttribute('aria-hidden', 'false');
      } else {
        mobileStickyBar.classList.remove('visible');
        mobileStickyBar.setAttribute('aria-hidden', 'true');
      }
    }
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  window.addEventListener('resize', updateActiveSection, { passive: true });
  updateActiveSection();

  // Mobile Menu Handlers
  function openMobileMenu() {
    if (!mobileNavOverlay) return;
    mobileNavOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (mobileMenuClose) mobileMenuClose.focus();
  }

  function closeMobileMenu() {
    if (!mobileNavOverlay) return;
    mobileNavOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (mobileMenuTrigger) mobileMenuTrigger.focus();
  }

  if (mobileMenuTrigger) {
    mobileMenuTrigger.addEventListener('click', openMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileMenu();
    });
  });

  // Close on Escape Key
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNavOverlay && mobileNavOverlay.classList.contains('open')) {
      closeMobileMenu();
    }
  });
})();
