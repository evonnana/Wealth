/* ============================================================
   Redbeacon Asset Management — script.js
   Vanilla JS only. No libraries.
   Modules:
     1. Mobile nav toggle
     2. Header shadow on scroll
     3. Scroll-in reveal animations (IntersectionObserver)
     4. Testimonial carousel
     5. Enquiry form: validation + FormSubmit AJAX
     6. Auto-updating footer year
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  function closeMenu() {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close the menu when any link inside it is clicked
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- 2. Header shadow on scroll ---------- */
  const header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Scroll-in reveal animations ---------- */
  const reveals = document.querySelectorAll(".reveal");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    // Fallback: show everything immediately
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    const io = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // animate once
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 4. Testimonial carousel ---------- */
  (function carousel() {
    const root = document.getElementById("carousel");
    const track = document.getElementById("carouselTrack");
    if (!root || !track) return;

    const slides = Array.prototype.slice.call(track.children);
    const dotsWrap = document.getElementById("carouselDots");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const AUTO_MS = 6000;
    let index = 0;
    let timer = null;

    // Build dot indicators
    const dots = slides.map(function (_, i) {
      const dot = document.createElement("button");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function update() {
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      dots.forEach(function (d, i) { d.classList.toggle("active", i === index); });
      slides.forEach(function (s, i) { s.setAttribute("aria-hidden", String(i !== index)); });
    }

    function goTo(i) { index = (i + slides.length) % slides.length; update(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function start() { timer = window.setInterval(next, AUTO_MS); }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });

    // Pause on hover / focus within
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    // Keyboard arrows when carousel has focus
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { next(); restart(); }
      else if (e.key === "ArrowLeft") { prev(); restart(); }
    });

    update();
    if (!prefersReduced) start();
  })();

  /* ---------- 5. Enquiry form: validation + FormSubmit AJAX ---------- */
  (function enquiryForm() {
    const form = document.getElementById("enquiryForm");
    if (!form) return;

    // ====== REPLACE_WITH_YOUR_EMAIL ======
    // CHANGE THIS EMAIL to wherever enquiries should be delivered.
    // First submission to a new address triggers a one-time FormSubmit
    // activation email — the form only delivers AFTER you click that link.
    const ENDPOINT = "https://formsubmit.co/ajax/isaiah.hui@redbeaconam.com";

    const submitBtn = document.getElementById("submitBtn");
    const formError = document.getElementById("formError");
    const formSuccess = document.getElementById("formSuccess");
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(fieldId, message) {
      const input = document.getElementById(fieldId);
      const slot = document.getElementById("err-" + fieldId);
      if (slot) slot.textContent = message || "";
      if (input) {
        if (message) input.setAttribute("aria-invalid", "true");
        else input.removeAttribute("aria-invalid");
      }
    }

    function validate() {
      let ok = true;
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name) { setError("name", "Please enter your full name."); ok = false; }
      else setError("name", "");

      if (!email) { setError("email", "Please enter your email address."); ok = false; }
      else if (!emailRe.test(email)) { setError("email", "Please enter a valid email address."); ok = false; }
      else setError("email", "");

      if (!message) { setError("message", "Please tell us a little about your enquiry."); ok = false; }
      else setError("message", "");

      return ok;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      formError.hidden = true;

      // Honeypot: if a bot filled the hidden field, silently succeed-looking abort.
      if (form._honey && form._honey.value) return;

      if (!validate()) {
        // Move focus to the first invalid field for accessibility
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Build JSON payload, including FormSubmit helper fields
      const payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        interest: form.interest.value,
        message: form.message.value.trim(),
        _subject: "New Wealth Blueprint request — Redbeacon website",
        _template: "table",
        _captcha: "false"
      };

      submitBtn.disabled = true;
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = "Sending…";

      fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed with status " + res.status);
          return res.json();
        })
        .then(function () {
          // Success: hide the form, show the friendly message
          form.hidden = true;
          formSuccess.hidden = false;
          formSuccess.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
          form.reset();
        })
        .catch(function () {
          formError.textContent = "Sorry — something went wrong sending your enquiry. Please try again, or email us directly.";
          formError.hidden = false;
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });

    // Clear a field's error as the user corrects it
    ["name", "email", "message"].forEach(function (id) {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener("input", function () {
          if (input.getAttribute("aria-invalid") === "true") setError(id, "");
        });
      }
    });
  })();

  /* ---------- 6. Auto-updating footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
