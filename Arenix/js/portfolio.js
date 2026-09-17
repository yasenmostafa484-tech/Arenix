/**
 * ARENIX PORTFOLIO PREVIEW ENGINE
 * Lazy loading of live iframes, graceful fallback state handling,
 * and external direct launch routing.
 */

(function () {
  'use strict';

  const previewWindows = document.querySelectorAll('.preview-window');

  // Intersection Observer for intelligent on-demand loading of live iframes
  if ('IntersectionObserver' in window) {
    const previewObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const windowEl = entry.target;
          loadProjectPreview(windowEl);
          previewObserver.unobserve(windowEl);
        }
      });
    }, { rootMargin: '150px 0px', threshold: 0.1 });

    previewWindows.forEach(function (w) {
      previewObserver.observe(w);
    });
  } else {
    // Fallback if IntersectionObserver not available
    previewWindows.forEach(function (w) {
      loadProjectPreview(w);
    });
  }

  function loadProjectPreview(windowEl) {
    const iframe = windowEl.querySelector('.preview-iframe');
    const fallback = windowEl.querySelector('.preview-fallback-cover');
    const targetUrl = windowEl.getAttribute('data-src');

    if (!iframe || !targetUrl) return;

    // Safety timeout: if iframe doesn't load within 5.5s or is blocked by CSP, keep elegant fallback
    let isLoaded = false;
    const timeout = setTimeout(function () {
      if (!isLoaded) {
        // Fallback remains visible as a polished editorial showcase
        console.info('Preserving editorial presentation for:', targetUrl);
      }
    }, 5500);

    iframe.onload = function () {
      isLoaded = true;
      clearTimeout(timeout);
      if (fallback) {
        fallback.classList.add('loaded');
      }
    };

    iframe.onerror = function () {
      clearTimeout(timeout);
      if (fallback) {
        fallback.classList.remove('loaded');
      }
    };

    // Set src to begin loading
    iframe.src = targetUrl;
  }
})();
