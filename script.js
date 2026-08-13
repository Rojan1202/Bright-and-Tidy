/* ==========================================================================
   Bright & Tidy Cleaning Services — site scripts
   Each feature checks for its elements before running, so this one file
   can be shared safely across every page.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* -------------------------------------------------------
     1. Mobile navigation toggle (all pages)
  ------------------------------------------------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the menu after a link is chosen (better mobile UX)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------------------------------------------
     2. Gallery filter (gallery.html only)
  ------------------------------------------------------- */
  var filterBar = document.querySelector('.filter-bar');
  var galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBar && galleryItems.length) {
    filterBar.addEventListener('click', function (event) {
      var button = event.target.closest('.filter-btn');
      if (!button) return;

      filterBar.querySelectorAll('.filter-btn').forEach(function (btn) {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');

      var category = button.dataset.filter;

      galleryItems.forEach(function (item) {
        var match = category === 'all' || item.dataset.category === category;
        item.hidden = !match;
      });
    });
  }

  /* -------------------------------------------------------
     3. Contact form validation (contact.html only)
  ------------------------------------------------------- */
  var contactForm = document.querySelector('#contact-form');

  if (contactForm) {
    var statusBox = contactForm.querySelector('.form-status');

    var showError = function (field, message) {
      var errorEl = document.getElementById(field.id + '-error');
      if (errorEl) errorEl.textContent = message;
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      return !message;
    };

    var validateField = function (field) {
      if (field.hasAttribute('required') && !field.value.trim()) {
        return showError(field, 'This field is required.');
      }
      if (field.type === 'email' && field.value.trim()) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value.trim())) {
          return showError(field, 'Enter a valid email address.');
        }
      }
      return showError(field, '');
    };

    contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
    });

    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var fields = contactForm.querySelectorAll('input, select, textarea');
      var allValid = true;

      fields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });

      if (allValid) {
        statusBox.textContent = 'Thanks! Your quote request has been received — we\'ll reply within one working day.';
        statusBox.className = 'form-status success';
        statusBox.hidden = false;
        contactForm.reset();
      } else {
        statusBox.textContent = 'Please fix the highlighted fields and try again.';
        statusBox.className = 'form-status error';
        statusBox.hidden = false;
      }
    });
  }

  /* -------------------------------------------------------
     4. Instant quote calculator (services.html only)
  ------------------------------------------------------- */
  var calcForm = document.querySelector('#quote-calculator');

  if (calcForm) {
    var resultBox = calcForm.querySelector('.calc-result');
    var amountEl = calcForm.querySelector('.amount');
    var breakdownEl = calcForm.querySelector('.breakdown');

    var RATES = {
      domestic: 18,
      office: 22,
      endOfTenancy: 26,
      deep: 24
    };
    var ROOM_MINUTES = 35; // minutes of work per room, on average

    calcForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var serviceType = calcForm.serviceType.value;
      var rooms = parseInt(calcForm.rooms.value, 10);

      if (!serviceType || !rooms || rooms < 1) {
        resultBox.hidden = true;
        return;
      }

      var hourlyRate = RATES[serviceType];
      var estimatedHours = Math.max(1.5, (rooms * ROOM_MINUTES) / 60);
      estimatedHours = Math.round(estimatedHours * 2) / 2; // round to nearest 0.5h
      var estimatedCost = Math.round(estimatedHours * hourlyRate);

      amountEl.textContent = '£' + estimatedCost;
      breakdownEl.textContent =
        'Based on ' + rooms + ' room(s), approx. ' + estimatedHours +
        ' hour(s) at £' + hourlyRate + '/hour. Final price confirmed after a free walk-through.';
      resultBox.hidden = false;
    });
  }

});
