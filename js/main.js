(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Navbar: blur/solid background on scroll
  --------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const onScrollNav = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 1);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------------------------------------------------------
     Mobile menu toggle
  --------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  const closeMobileMenu = () => {
    navToggle.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  navToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  /* ---------------------------------------------------------
     Smooth scroll for in-page anchors (native scroll-behavior
     already handles most; this only adjusts for the fixed navbar)
  --------------------------------------------------------- */
  const navHeight = () => navbar.offsetHeight + 12;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight();
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
      history.pushState(null, "", id);
    });
  });

  /* ---------------------------------------------------------
     Scrollspy: highlight active nav link
  --------------------------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (sections.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = `#${entry.target.id}`;
          const link = navLinks.find((a) => a.getAttribute("href") === id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => spyObserver.observe(section));
  }

  /* ---------------------------------------------------------
     Reveal on scroll (fade + slide / left-right)
  --------------------------------------------------------- */
  const revealTargets = document.querySelectorAll("[data-reveal], [data-reveal-x]");

  if (prefersReducedMotion) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------------------------------------------------
     Services accordion
  --------------------------------------------------------- */
  document.querySelectorAll(".service-item").forEach((item) => {
    const header = item.querySelector(".service-header");
    header.addEventListener("click", () => {
      const alreadyOpen = item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".service-item").forEach((el) => {
        el.classList.remove("is-open");
        el.querySelector(".service-header").setAttribute("aria-expanded", "false");
      });
      if (!alreadyOpen) {
        item.classList.add("is-open");
        header.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------------------------------------------------------
     FAQ accordion
  --------------------------------------------------------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const alreadyOpen = item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".faq-item").forEach((el) => {
        el.classList.remove("is-open");
        el.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (!alreadyOpen) {
        item.classList.add("is-open");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------------------------------------------------------
     "Método Elevator" — card carousel. Arrows/dots scroll the
     track; on every scroll we find whichever card sits closest
     to the track's horizontal center and mark it active — more
     than one card can be partially visible at once, so a simple
     visibility threshold isn't enough to pick the right one.
  --------------------------------------------------------- */
  const methodTrack = document.getElementById("methodTrack");
  const methodCards = document.querySelectorAll(".method-card");
  const methodDots = document.querySelectorAll(".method-dot");
  const methodPrev = document.getElementById("methodPrev");
  const methodNext = document.getElementById("methodNext");

  if (methodTrack && methodCards.length) {
    let methodIndex = 0;
    let methodScrollRAF = null;

    const setActiveMethod = (index) => {
      methodIndex = index;
      methodCards.forEach((c, i) => c.classList.toggle("is-active", i === index));
      methodDots.forEach((d, i) => {
        d.classList.toggle("is-active", i === index);
        d.setAttribute("aria-selected", i === index ? "true" : "false");
      });
      if (methodPrev) methodPrev.disabled = index === 0;
      if (methodNext) methodNext.disabled = index === methodCards.length - 1;
    };

    const goToMethod = (index) => {
      const clamped = Math.max(0, Math.min(methodCards.length - 1, index));
      // Scroll ONLY the track horizontally. `scrollIntoView` would bubble up
      // to every scrollable ancestor and jump the whole page vertically
      // (autoplay made the page creep down every 10s) — computing the delta
      // and scrolling the track directly keeps the page position untouched.
      const card = methodCards[clamped];
      const trackRect = methodTrack.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const delta = (cardRect.left + cardRect.width / 2) - (trackRect.left + trackRect.width / 2);
      methodTrack.scrollTo({
        left: methodTrack.scrollLeft + delta,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    };

    const closestCardToCenter = () => {
      const trackRect = methodTrack.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      methodCards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const distance = Math.abs(r.left + r.width / 2 - trackCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
      return closestIndex;
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let methodAutoplayTimer = null;

    const stopMethodAutoplay = () => {
      if (methodAutoplayTimer) {
        clearInterval(methodAutoplayTimer);
        methodAutoplayTimer = null;
      }
    };

    const startMethodAutoplay = () => {
      if (prefersReducedMotion) return;
      stopMethodAutoplay();
      methodAutoplayTimer = setInterval(() => {
        goToMethod((methodIndex + 1) % methodCards.length);
      }, 10000);
    };

    /* Any manual move (arrows, dots, drag/swipe on the track) restarts
       the 10s timer from zero, so autoplay always resumes after the
       user lets go rather than fighting their input. */
    const goToMethodManual = (index) => {
      goToMethod(index);
      startMethodAutoplay();
    };

    methodDots.forEach((dot, i) => dot.addEventListener("click", () => goToMethodManual(i)));
    methodPrev?.addEventListener("click", () => goToMethodManual(methodIndex - 1));
    methodNext?.addEventListener("click", () => goToMethodManual(methodIndex + 1));

    methodTrack.addEventListener("pointerdown", stopMethodAutoplay);
    methodTrack.addEventListener("pointerup", startMethodAutoplay);
    methodTrack.addEventListener("mouseenter", stopMethodAutoplay);
    methodTrack.addEventListener("mouseleave", startMethodAutoplay);

    methodTrack.addEventListener(
      "scroll",
      () => {
        if (methodScrollRAF) return;
        methodScrollRAF = requestAnimationFrame(() => {
          setActiveMethod(closestCardToCenter());
          methodScrollRAF = null;
        });
      },
      { passive: true }
    );

    setActiveMethod(closestCardToCenter());
    startMethodAutoplay();
  }

  /* ---------------------------------------------------------
     Contact form (static demo — replace action with real backend)
  --------------------------------------------------------- */
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      formSuccess.classList.add("is-visible");
      contactForm.reset();
    });
  }

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Hero canvas — floating teal light orbs
  --------------------------------------------------------- */
  const canvas = document.getElementById("orbsCanvas");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let width, height, dpr;
    let orbs = [];
    let rafId;

    const colors = [
      "rgba(45, 212, 191, 0.55)",
      "rgba(14, 165, 233, 0.5)",
      "rgba(45, 212, 191, 0.4)",
    ];

    const createOrbs = () => {
      const count = width < 700 ? 4 : 6;
      orbs = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 90 + Math.random() * 140,
        dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.2,
        color: colors[i % colors.length],
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createOrbs();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      orbs.forEach((orb) => {
        orb.x += orb.dx;
        orb.y += orb.dy;

        if (orb.x < -orb.r) orb.x = width + orb.r;
        if (orb.x > width + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = height + orb.r;
        if (orb.y > height + orb.r) orb.y = -orb.r;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";
      rafId = requestAnimationFrame(draw);
    };

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 200);
    });

    // Pause animation when hero is off-screen to save CPU/battery
    const heroEl = canvas.closest(".hero");
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!rafId) draw();
          } else {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      },
      { threshold: 0 }
    );

    resize();
    heroObserver.observe(heroEl);

    // Guard against the hero not having its final layout size yet
    // (e.g. web fonts still swapping in) by re-measuring once it settles.
    if ("ResizeObserver" in window) {
      const roObserver = new ResizeObserver(() => {
        if (canvas.clientWidth !== width || canvas.clientHeight !== height) {
          resize();
        }
      });
      roObserver.observe(heroEl);
    }
  }
})();
