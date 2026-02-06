// Glitched Box — core JS (theme + header/search utilities)

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  // =========================
  // Sticky offsets (header + breadcrumbs)
  // =========================
  function syncStickyHeights() {
    const header = document.querySelector(".header");
    const breadcrumbs = document.querySelector(".breadcrumbs-bar");

    if (header) {
      root.style.setProperty("--header-h", `${Math.ceil(header.offsetHeight)}px`);
    }
    if (breadcrumbs) {
      root.style.setProperty("--breadcrumbs-h", `${Math.ceil(breadcrumbs.offsetHeight)}px`);
    }
  }


  // =========================
  // Theme
  // =========================
  const themeToggle =
    document.querySelector("[data-theme-toggle]") ||
    document.getElementById("themeToggle");

  const headerLogo = document.getElementById("headerLogo");

  function setLogoForTheme(theme) {
    if (!headerLogo) return;
    const darkSrc = headerLogo.getAttribute("data-logo-dark");
    const lightSrc = headerLogo.getAttribute("data-logo-light");
    if (darkSrc && lightSrc) {
      headerLogo.src = theme === "light" ? lightSrc : darkSrc;
    }
  }

  function getInitialTheme() {
    const saved = localStorage.getItem("gb_theme");
    if (saved === "dark" || saved === "light") return saved;

    const attr = root.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") return attr;

    return "dark";
  }

  function syncToggleUI(theme) {
    if (!themeToggle) return;

    // If it's a checkbox input, keep checked in sync
    if ("checked" in themeToggle) {
      themeToggle.checked = theme === "dark";
    }

    // ARIA for accessibility (useful if later you swap to role="switch")
    themeToggle.setAttribute(
      "aria-checked",
      theme === "dark" ? "true" : "false"
    );
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("gb_theme", theme);

    syncToggleUI(theme);
    setLogoForTheme(theme);

    // Recalculate sticky heights (logo/theme can change layout)
    requestAnimationFrame(syncStickyHeights);
  }

  // Init theme
  applyTheme(getInitialTheme());

  // Theme toggle interaction (checkbox change is the correct event)
  if (themeToggle) {
    themeToggle.addEventListener("change", () => {
      const next = themeToggle.checked ? "dark" : "light";
      applyTheme(next);
    });
  }

  // =========================
  // Search overlay (mobile)
  // =========================
  const searchToggle = document.getElementById("searchToggle");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchInputMobile = document.getElementById("searchInputMobile");
  const closeNodes = document.querySelectorAll("[data-search-close]");

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add("is-open");
    searchOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    window.setTimeout(() => searchInputMobile?.focus(), 0);
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove("is-open");
    searchOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }

  if (searchToggle) searchToggle.addEventListener("click", openSearch);
  closeNodes.forEach((n) => n.addEventListener("click", closeSearch));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearch();
  });

  // Keep sticky heights in sync
  window.addEventListener("load", syncStickyHeights);
  window.addEventListener("resize", syncStickyHeights);
  // First paint sync (fonts can shift layout)
  setTimeout(syncStickyHeights, 50);

  // =========================
  // Cart badge demo (safe)
  // =========================
  const cartBadge = document.getElementById("cartBadge");
  if (cartBadge) {
    const value = Number(cartBadge.textContent || "0");
    cartBadge.classList.toggle("show", value > 0);
  }
  // =========================
  // Newsletter (validation states)
  // =========================
  const newsletterForm =
    document.getElementById("newsletterForm") ||
    document.querySelector(".newsletter-form");

  const newsletterInput =
    document.getElementById("newsletterEmail") ||
    document.querySelector(".newsletter-input");

  const newsletterHelp =
    document.getElementById("newsletterHelp") ||
    document.querySelector(".newsletter-help");

  if (newsletterForm && newsletterInput) {
    const isValidEmail = (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

    const setHelp = (msg) => {
      if (!newsletterHelp) return;
      newsletterHelp.textContent = msg || "";
    };

    const clearStates = () => {
      newsletterInput.classList.remove("is-error", "is-success");
      newsletterInput.removeAttribute("aria-invalid");
      setHelp("");
    };

    const setError = (msg) => {
      newsletterInput.classList.add("is-error");
      newsletterInput.classList.remove("is-success");
      newsletterInput.setAttribute("aria-invalid", "true");
      setHelp(msg || "Por favor revisa tu correo.");
    };

    const setSuccess = (msg) => {
      newsletterInput.classList.add("is-success");
      newsletterInput.classList.remove("is-error");
      newsletterInput.setAttribute("aria-invalid", "false");
      setHelp(msg || "¡Listo! Te avisaremos por correo.");
    };

    // Validate on blur (no agresivo mientras escribe)
    newsletterInput.addEventListener("blur", () => {
      const v = newsletterInput.value.trim();
      if (!v) return clearStates();
      isValidEmail(v) ? setSuccess("") : setError("Correo inválido. Ejemplo: hola@dominio.com");
    });

    // While typing: if it was error, re-check and clear when fixed
    newsletterInput.addEventListener("input", () => {
      if (!newsletterInput.classList.contains("is-error")) return;
      const v = newsletterInput.value.trim();
      if (!v) return clearStates();
      if (isValidEmail(v)) setSuccess("");
    });

    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = newsletterInput.value.trim();
      if (!isValidEmail(v)) return setError("Correo inválido. Ejemplo: hola@dominio.com");

      // Aquí después conectas tu envío real (Mailchimp/API/etc.)
      setSuccess("¡Gracias! Revisa tu correo para confirmar (si aplica).");
      // Opcional: limpiar input después de éxito
      // newsletterForm.reset();
    });
  }

});
