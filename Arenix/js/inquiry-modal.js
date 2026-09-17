/**
 * ARENIX INQUIRY TERMINAL & MODAL HANDLER
 * Interactive project configuration modal routing directly to WhatsApp or Email.
 */

(function () {
  'use strict';

  const modal = document.getElementById('inquiryModal');
  const openButtons = document.querySelectorAll('.open-inquiry-modal');
  const closeButton = document.getElementById('closeInquiryModal');
  const inquiryForm = document.getElementById('inquiryForm');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Project Type Selection Pills
  const typePills = document.querySelectorAll('.type-pill');
  let selectedType = 'Digital Experience';

  typePills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      typePills.forEach(function (p) { p.classList.remove('selected'); });
      this.classList.add('selected');
      selectedType = this.getAttribute('data-type') || this.textContent;
    });
  });

  // Form submission: compose message to WhatsApp or Email
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('inquiryName').value.trim();
      const contact = document.getElementById('inquiryContact').value.trim();
      const message = document.getElementById('inquiryDetails').value.trim();

      const fullMessage = `Hello ARENIX,\n\nI would like to start a project.\n- Name: ${name || 'N/A'}\n- Contact: ${contact || 'N/A'}\n- Project Type: ${selectedType}\n- Details: ${message || 'N/A'}`;

      // Open WhatsApp with encoded message
      const whatsappUrl = `https://wa.me/201500347497?text=${encodeURIComponent(fullMessage)}`;
      window.open(whatsappUrl, '_blank');

      closeModal();
    });
  }

  // Audit Form Submission (Free Website Audit Page)
  const auditForm = document.getElementById('auditForm');
  if (auditForm) {
    auditForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('auditName') ? document.getElementById('auditName').value.trim() : '';
      const email = document.getElementById('auditEmail') ? document.getElementById('auditEmail').value.trim() : '';
      const url = document.getElementById('auditUrl') ? document.getElementById('auditUrl').value.trim() : '';

      const fullMessage = `Hello ARENIX,\n\nI would like to request a Free Website Audit.\n- Name: ${name || 'N/A'}\n- Email: ${email || 'N/A'}\n- Website URL: ${url || 'N/A'}`;

      const whatsappUrl = `https://wa.me/201500347497?text=${encodeURIComponent(fullMessage)}`;
      window.open(whatsappUrl, '_blank');
    });
  }
})();

