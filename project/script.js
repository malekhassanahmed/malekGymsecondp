/* ============================================================
   POWER ZONE FITNESS CLUB — script.js
   Vanilla JavaScript (ES6+). Beginner-friendly, commented.

   Features:
   1. Highlights slider (mandatory)
   2. Dynamic program cards from a JS array (mandatory)
   3. Contact form validation (mandatory)
   Extras: mobile nav, active link, back-to-top, reveal on scroll
   ============================================================ */

"use strict";

/* Marks that JavaScript is running. The reveal-on-scroll CSS hides
   elements only under this class, so content stays visible if the
   script ever fails to load. */
document.body.classList.add("js-enabled");

/* ============================================================
   FEATURE 2: DYNAMIC PROGRAMS FROM A JAVASCRIPT ARRAY
   Each program is an object with id, title, description, icon.
   ============================================================ */

const programs = [
  {
    id: 1,
    title: "Strength Training",
    description:
      "Build real, lasting strength with structured barbell and dumbbell sessions focused on the main lifts.",
    icon: "images/icon-strength.svg",
  },
  {
    id: 2,
    title: "Cardio Fitness",
    description:
      "Improve your endurance and heart health with treadmill, rowing and interval-based conditioning workouts.",
    icon: "images/icon-cardio.svg",
  },
  {
    id: 3,
    title: "Group Training",
    description:
      "Train alongside others in energetic coach-led sessions that keep you motivated and accountable.",
    icon: "images/icon-group.svg",
  },
  {
    id: 4,
    title: "Beginner Fitness",
    description:
      "A friendly introduction to the gym covering safe technique, simple routines and steady progress.",
    icon: "images/icon-beginner.svg",
  },
];

/**
 * Builds the HTML for a single program card.
 * @param {Object} program - One program object from the array above.
 * @returns {string} HTML markup for the card.
 */
function createProgramCard(program) {
  return `
    <article class="program-card">
      <div class="program-icon">
        <img src="${program.icon}" alt="" aria-hidden="true" />
      </div>
      <h3>${program.title}</h3>
      <p>${program.description}</p>
    </article>
  `;
}

/**
 * Renders all program cards into the Programs section.
 */
function renderPrograms() {
  const grid = document.getElementById("programs-grid");
  grid.innerHTML = programs.map(createProgramCard).join("");
}

/* ============================================================
   FEATURE 1: HIGHLIGHTS SLIDER
   Previous / Next buttons, dots, smooth sliding and
   automatic rotation (pauses while the user interacts).
   ============================================================ */

const highlights = [
  {
    title: "Modern Equipment, Every Zone",
    text: "Train on well-maintained strength and cardio equipment, with dedicated zones for lifting, conditioning and recovery.",
  },
  {
    title: "Coaching For Every Level",
    text: "From your very first session to advanced training, our team helps you master technique and progress safely.",
  },
  {
    title: "A Community That Pushes You",
    text: "Group sessions and a welcoming atmosphere make every workout something to look forward to.",
  },
  {
    title: "Beginner-Friendly Environment",
    text: "Never trained before? Our beginner fitness program gives you a clear, confident start at your own pace.",
  },
];

let currentSlide = 0;
let autoRotateTimer = null;

/** Creates all slides and dot buttons, then shows slide 0. */
function setupSlider() {
  const track = document.getElementById("slider-track");
  const dotsContainer = document.getElementById("slider-dots");

  // Build each slide from the highlights array
  track.innerHTML = highlights
    .map(
      (item, index) => `
      <article class="slide" aria-hidden="${index !== 0}">
        <p class="slide-number">HIGHLIGHT ${String(index + 1).padStart(2, "0")}</p>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `
    )
    .join("");

  // Build one dot button per slide (also lets users jump to a slide)
  dotsContainer.innerHTML = highlights
    .map(
      (_, index) =>
        `<button type="button" class="slider-dot" data-index="${index}"
           aria-label="Go to highlight ${index + 1}"></button>`
    )
    .join("");

  // Wire up the controls
  document.getElementById("prev-slide").addEventListener("click", () => {
    changeSlide(currentSlide - 1);
    restartAutoRotate();
  });
  document.getElementById("next-slide").addEventListener("click", () => {
    changeSlide(currentSlide + 1);
    restartAutoRotate();
  });

  dotsContainer.querySelectorAll(".slider-dot").forEach((dot) => {
    dot.addEventListener("click", (event) => {
      changeSlide(Number(event.target.dataset.index));
      restartAutoRotate();
    });
  });

  changeSlide(0); // show the first slide and highlight its dot
  startAutoRotate();
}

/** Moves the track to the requested slide and updates the dots. */
function changeSlide(index) {
  const track = document.getElementById("slider-track");
  const totalSlides = highlights.length;

  // Wrap around at both ends so Previous/Next always work
  currentSlide = (index + totalSlides) % totalSlides;

  // Slide the track sideways with a smooth CSS transition
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Update visibility of slides and the active dot
  track.querySelectorAll(".slide").forEach((slide, i) => {
    slide.setAttribute("aria-hidden", i !== currentSlide);
  });
  document.querySelectorAll(".slider-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
}

/** Rotates the slider every 6 seconds. */
function startAutoRotate() {
  autoRotateTimer = setInterval(() => changeSlide(currentSlide + 1), 6000);
}

/** Restarts auto-rotation after a manual interaction. */
function restartAutoRotate() {
  clearInterval(autoRotateTimer);
  startAutoRotate();
}

/* ============================================================
   FEATURE 3: CONTACT FORM VALIDATION
   Validates name, email and message in the browser.
   The page never reloads and nothing is sent to a server —
   this is a front-end demonstration only.
   ============================================================ */

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the form and shows/hides error messages.
 * @returns {boolean} true when every field is valid.
 */
function validateForm() {
  const nameField = document.getElementById("full-name");
  const emailField = document.getElementById("email");
  const messageField = document.getElementById("message");

  let isValid = true;

  // Rule 1: name must not be empty
  if (nameField.value.trim() === "") {
    showError(nameField, "name-error", "Please enter your full name.");
    isValid = false;
  } else {
    clearError(nameField, "name-error");
  }

  // Rule 2: email must have a valid format
  if (emailField.value.trim() === "") {
    showError(emailField, "email-error", "Please enter your email address.");
    isValid = false;
  } else if (!emailPattern.test(emailField.value.trim())) {
    showError(emailField, "email-error", "Please enter a valid email address (e.g. you@example.com).");
    isValid = false;
  } else {
    clearError(emailField, "email-error");
  }

  // Rule 3: message must not be empty
  if (messageField.value.trim() === "") {
    showError(messageField, "message-error", "Please write a short message.");
    isValid = false;
  } else {
    clearError(messageField, "message-error");
  }

  return isValid;
}

/** Marks a field as invalid and displays its error message. */
function showError(field, errorId, message) {
  field.classList.add("invalid");
  field.setAttribute("aria-invalid", "true");
  document.getElementById(errorId).textContent = message;
}

/** Clears the invalid state and error message of a field. */
function clearError(field, errorId) {
  field.classList.remove("invalid");
  field.removeAttribute("aria-invalid");
  document.getElementById(errorId).textContent = "";
}

/** Submit handler: validate, then show the success message. */
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const successMessage = document.getElementById("success-message");

  form.addEventListener("submit", (event) => {
    // Stop the browser from reloading the page
    event.preventDefault();

    successMessage.hidden = true;

    if (validateForm()) {
      // All fields are valid: show accessible success feedback
      successMessage.hidden = false;
      form.reset();
    } else {
      // Move focus to the first invalid field for keyboard users
      const firstInvalid = form.querySelector(".invalid");
      if (firstInvalid) firstInvalid.focus();
    }
  });
}

/* ============================================================
   MOBILE NAVIGATION (hamburger menu)
   ============================================================ */

function setupMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  // Close the mobile menu after choosing a link
  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ============================================================
   ACTIVE NAVIGATION LINK + HEADER AWARENESS (scroll spy)
   ============================================================ */

function setupActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */

function setupBackToTop() {
  const button = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    button.hidden = window.scrollY < 600;
  });

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ============================================================
   REVEAL-ON-SCROLL ANIMATIONS
   ============================================================ */

function setupRevealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
  });
}

/* ============================================================
   FOOTER YEAR + INITIALIZATION
   ============================================================ */

function init() {
  renderPrograms();     // Feature 2
  setupSlider();        // Feature 1
  setupContactForm();   // Feature 3
  setupMobileNav();
  setupActiveNav();
  setupBackToTop();
  setupRevealOnScroll();

  // Show the current year in the footer copyright notice
  document.getElementById("year").textContent = new Date().getFullYear();
}

// Run everything once the page has loaded
document.addEventListener("DOMContentLoaded", init);
