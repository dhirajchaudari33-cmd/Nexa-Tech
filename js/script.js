/* =========================================================
   NexaTech Solutions — script.js
   Vanilla JavaScript only (no frameworks/libraries).

   Features implemented:
   1. Responsive mobile navigation toggle
   2. Dark / light theme toggle (persisted with localStorage)
   3. FAQ accordion (services page)
   4. Contact form validation with live feedback
   5. Image gallery lightbox / modal (home page)

   Each feature is wrapped in a guard clause so this single
   file can be shared safely across all three pages, even
   when a given page doesn't contain that feature's markup.
   ========================================================= */

   document.addEventListener("DOMContentLoaded", function () {
    setFooterYear();
    initNavToggle();
    initThemeToggle();
    initAccordion();
    initContactForm();
    initGalleryModal();
  });
  
  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  function setFooterYear() {
    var yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }
  
  /* ---------------------------------------------------------
     1. Mobile navigation toggle
     Shows/hides the primary nav on small screens and keeps
     the button's aria-expanded state in sync for screen readers.
  --------------------------------------------------------- */
  function initNavToggle() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("primaryNav");
    if (!toggle || !nav) return;
  
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  
    // Close the mobile menu automatically once a nav link is chosen,
    // so the menu doesn't stay open after navigating.
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth < 900) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }
  
  /* ---------------------------------------------------------
     2. Dark / light theme toggle
     Preference is remembered in localStorage so it persists
     between pages and future visits.
  --------------------------------------------------------- */
  function initThemeToggle() {
    var toggle = document.getElementById("themeToggle");
    var root = document.documentElement;
    var STORAGE_KEY = "nexatech-theme";
  
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      // localStorage may be unavailable (e.g. privacy mode) — fail silently.
    }
  
    if (saved === "dark") {
      root.setAttribute("data-theme", "dark");
    }
    updateToggleState();
  
    if (!toggle) return;
  
    toggle.addEventListener("click", function () {
      var isDark = root.getAttribute("data-theme") === "dark";
      if (isDark) {
        root.removeAttribute("data-theme");
      } else {
        root.setAttribute("data-theme", "dark");
      }
      try {
        localStorage.setItem(STORAGE_KEY, isDark ? "light" : "dark");
      } catch (err) {
        /* ignore */
      }
      updateToggleState();
    });
  
    function updateToggleState() {
      if (!toggle) return;
      var isDark = root.getAttribute("data-theme") === "dark";
      toggle.setAttribute("aria-pressed", String(isDark));
      var icon = toggle.querySelector("[aria-hidden]");
      if (icon) icon.textContent = isDark ? "☀️" : "🌙";
    }
  }
  
  /* ---------------------------------------------------------
     3. FAQ accordion (services.html)
     Each trigger toggles its own panel and updates
     aria-expanded. Panels use the `hidden` attribute rather
     than display:none so state is readable by assistive tech.
  --------------------------------------------------------- */
  function initAccordion() {
    var triggers = document.querySelectorAll(".accordion-trigger");
    if (!triggers.length) return;
  
    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        var panel = document.getElementById(trigger.getAttribute("aria-controls"));
  
        trigger.setAttribute("aria-expanded", String(!expanded));
        if (panel) panel.hidden = expanded;
  
        var icon = trigger.querySelector(".accordion-icon");
        if (icon) icon.textContent = expanded ? "+" : "−"; // minus sign when open
      });
    });
  }
  
  /* ---------------------------------------------------------
     4. Contact form validation (contact.html)
     Validates on submit and re-validates each field as the
     user types/blurs, showing specific, friendly error text
     next to the relevant field (announced via role="alert").
  --------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
  
    var status = document.getElementById("formStatus");
  
    var validators = {
      fullName: function (value) {
        if (!value.trim()) return "Please enter your full name.";
        if (value.trim().length < 2) return "Name looks too short — please check it.";
        return "";
      },
      email: function (value) {
        var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return "Please enter your email address.";
        if (!pattern.test(value.trim())) return "Please enter a valid email address, e.g. name@example.com.";
        return "";
      },
      phone: function (value) {
        if (!value.trim()) return ""; // optional field
        var pattern = /^[0-9+()\-\s]{6,}$/;
        if (!pattern.test(value.trim())) return "Please enter a valid phone number, or leave this field blank.";
        return "";
      },
      subject: function (value) {
        if (!value) return "Please choose a subject.";
        return "";
      },
      message: function (value) {
        if (!value.trim()) return "Please enter a message.";
        if (value.trim().length < 10) return "Please add a little more detail (at least 10 characters).";
        return "";
      }
    };
  
    Object.keys(validators).forEach(function (fieldName) {
      var field = form.elements[fieldName];
      if (!field) return;
      field.addEventListener("blur", function () {
        field.setAttribute("data-touched", "true");
        validateField(fieldName, field);
      });
      field.addEventListener("input", function () {
        if (field.getAttribute("data-touched") === "true") {
          validateField(fieldName, field);
        }
      });
    });
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var isFormValid = true;
  
      Object.keys(validators).forEach(function (fieldName) {
        var field = form.elements[fieldName];
        if (!field) return;
        field.setAttribute("data-touched", "true");
        var fieldIsValid = validateField(fieldName, field);
        if (!fieldIsValid) isFormValid = false;
      });
  
      if (!isFormValid) {
        status.textContent = "Please fix the highlighted fields and try again.";
        status.className = "form-status";
        var firstInvalid = form.querySelector('[data-touched="true"]:invalid, .error-message:not(:empty)');
        return;
      }
  
      // No backend exists yet for this prototype (front-end only, per brief),
      // so we simulate a successful submission and reset the form.
      status.textContent = "Thanks! Your message has been sent — we'll reply within one business day.";
      status.className = "form-status success";
      form.reset();
      Object.keys(validators).forEach(function (fieldName) {
        var field = form.elements[fieldName];
        if (field) field.removeAttribute("data-touched");
        var errorEl = document.getElementById(fieldName + "Error");
        if (errorEl) errorEl.textContent = "";
      });
    });
  
    function validateField(fieldName, field) {
      var message = validators[fieldName](field.value);
      var errorEl = document.getElementById(fieldName + "Error");
      if (errorEl) errorEl.textContent = message;
      field.setCustomValidity(message);
      return message === "";
    }
  }
  
  /* ---------------------------------------------------------
     5. Gallery lightbox / modal (index.html)
     Opens a larger preview of the selected work sample.
     Fully keyboard operable: Escape closes the modal, and
     focus returns to the button that opened it.
  --------------------------------------------------------- */
  function initGalleryModal() {
    var gallery = document.getElementById("gallery");
    var modal = document.getElementById("galleryModal");
    if (!gallery || !modal) return;
  
    var modalImage = document.getElementById("modalImage");
    var modalCaption = document.getElementById("modalCaption");
    var closeBtn = document.getElementById("modalClose");
    var lastFocusedElement = null;
  
    gallery.querySelectorAll(".gallery-item").forEach(function (item) {
      item.addEventListener("click", function () {
        lastFocusedElement = item;
        modalImage.src = item.getAttribute("data-full");
        modalImage.alt = item.getAttribute("data-caption") || "";
        modalCaption.textContent = item.getAttribute("data-caption") || "";
        openModal();
      });
    });
  
    closeBtn.addEventListener("click", closeModal);
  
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
  
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) closeModal();
    });
  
    function openModal() {
      modal.hidden = false;
      closeBtn.focus();
    }
  
    function closeModal() {
      modal.hidden = true;
      if (lastFocusedElement) lastFocusedElement.focus();
    }
  }