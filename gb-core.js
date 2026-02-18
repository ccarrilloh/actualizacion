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
    updateMobileThemeToggle(theme);

    // Recalculate sticky heights (logo/theme can change layout)
    requestAnimationFrame(syncStickyHeights);
  }

  // Actualizar el toggle de tema móvil (icono + texto)
  function updateMobileThemeToggle(theme) {
    const mobileThemeIcon = document.getElementById('mobileThemeIcon');
    const mobileThemeDisplay = document.getElementById('mobileThemeDisplay');
    
    if (!mobileThemeIcon || !mobileThemeDisplay) return;
    
    if (theme === 'dark') {
      // Icono de luna + texto "Oscuro"
      mobileThemeIcon.innerHTML = '<path class="theme-icon-moon" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>';
      mobileThemeDisplay.textContent = 'Oscuro';
    } else {
      // Icono de sol + texto "Claro"
      mobileThemeIcon.innerHTML = '<circle cx="12" cy="12" r="5" fill="currentColor"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2"/><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2"/>';
      mobileThemeDisplay.textContent = 'Claro';
    }
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
    if (e.key === "Escape") {
      closeSearch();
      closeMobileMenu();
      closeLanguageSelector();
    }
  });

  // =========================
  // Mobile Menu (hamburguesa)
  // =========================
  const hamburgerToggle = document.getElementById("hamburgerToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuCloseNodes = document.querySelectorAll("[data-menu-close]");

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }

  if (hamburgerToggle) {
    hamburgerToggle.addEventListener("click", openMobileMenu);
  }
  
  menuCloseNodes.forEach((node) => {
    node.addEventListener("click", closeMobileMenu);
  });

  // =========================
  // Mobile Theme Toggle
  // =========================
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }


  // =========================
  // Mobile Language Toggle (UI only)
  // =========================
  const mobileLangToggle = document.getElementById('mobileLangToggle');
  const mobileLangDisplay = document.getElementById('mobileLangDisplay');

  function getInitialLang(){
    return localStorage.getItem('gb_lang') || 'es';
  }

  function applyLang(lang){
    localStorage.setItem('gb_lang', lang);
    if (mobileLangDisplay){
      mobileLangDisplay.textContent = (lang === 'es') ? 'Español' : 'English';
    }
    // Nota: esto solo actualiza el label del menú. La traducción real del sitio se implementa después.
  }

  applyLang(getInitialLang());

  if (mobileLangToggle){
    mobileLangToggle.addEventListener('click', () => {
      const current = localStorage.getItem('gb_lang') || 'es';
      const next = current === 'es' ? 'en' : 'es';
      applyLang(next);
    });
  }

  // Keep sticky heights in sync
  window.addEventListener("load", syncStickyHeights);
  window.addEventListener("resize", syncStickyHeights);
  // First paint sync (fonts can shift layout)
  setTimeout(syncStickyHeights, 50);
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

  // =========================
  // Language Selector
  // =========================
  const languageSelector = document.getElementById("languageSelector");
  const languageToggle = document.getElementById("languageToggle");
  const languageOptions = document.querySelectorAll(".language-option");
  const currentLangSpan = document.getElementById("currentLang");

  function closeLanguageSelector() {
    if (!languageSelector) return;
    languageSelector.classList.remove("is-open");
  }

  function openLanguageSelector() {
    if (!languageSelector) return;
    languageSelector.classList.add("is-open");
  }

  function toggleLanguageSelector() {
    if (!languageSelector) return;
    languageSelector.classList.toggle("is-open");
  }

  if (languageToggle) {
    languageToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLanguageSelector();
    });
  }

  // Abrir con hover (como en claude.ai)
  if (languageSelector) {
    languageSelector.addEventListener("mouseenter", openLanguageSelector);
    languageSelector.addEventListener("mouseleave", closeLanguageSelector);
  }

  languageOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const lang = option.getAttribute("data-lang");
      
      // Update UI
      currentLangSpan.textContent = lang.toUpperCase();
      
      // Update active state
      languageOptions.forEach(opt => opt.classList.remove("active"));
      option.classList.add("active");
      
      // Save preference
      localStorage.setItem("gb_language", lang);
      
      // Close dropdown
      closeLanguageSelector();
      
      // TODO: Aquí puedes agregar lógica para cambiar el idioma del sitio
      console.log("Idioma cambiado a:", lang);
    });
  });

  // Close language selector when clicking outside
  document.addEventListener("click", (e) => {
    if (languageSelector && !languageSelector.contains(e.target)) {
      closeLanguageSelector();
    }
  });

  // Load saved language on init
  const savedLang = localStorage.getItem("gb_language");
  if (savedLang) {
    currentLangSpan.textContent = savedLang.toUpperCase();
    languageOptions.forEach(opt => {
      if (opt.getAttribute("data-lang") === savedLang) {
        opt.classList.add("active");
      } else {
        opt.classList.remove("active");
      }
    });
  }

  // =========================
  // Back to Top button
  // =========================
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    const SCROLL_THRESHOLD = 300;

    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("show", window.scrollY > SCROLL_THRESHOLD);
    }, { passive: true });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }


  // =========================
  // Toggle Iniciar sesión / Mi cuenta
  // =========================
  function updateAuthButtons() {
    const isLoggedIn = localStorage.getItem('gb_user_logged_in') === 'true';
    
    const authButtonNavbar = document.querySelector('.icon-button[aria-label="Iniciar sesión"]') ||
                             document.querySelector('.icon-button[aria-label="Mi cuenta"]');
    
    const authLinkMobile = document.querySelector('.mobile-menu__link[href="login.html"]') ||
                          document.querySelector('.mobile-menu__link[href="account.html"]');
    
    if (isLoggedIn) {
      if (authButtonNavbar) {
        authButtonNavbar.setAttribute('aria-label', 'Mi cuenta');
        const spanText = authButtonNavbar.querySelector('span:not(.icon-wrap)');
        if (spanText) spanText.textContent = 'Mi cuenta';
      }
      
      if (authLinkMobile) {
        authLinkMobile.setAttribute('href', 'account.html');
        const spanText = authLinkMobile.querySelector('span:not(.icon-wrap)');
        if (spanText) spanText.textContent = 'Mi cuenta';
      }
    } else {
      if (authButtonNavbar) {
        authButtonNavbar.setAttribute('aria-label', 'Iniciar sesión');
        const spanText = authButtonNavbar.querySelector('span:not(.icon-wrap)');
        if (spanText) spanText.textContent = 'Iniciar sesión';
      }
      
      if (authLinkMobile) {
        authLinkMobile.setAttribute('href', 'login.html');
        const spanText = authLinkMobile.querySelector('span:not(.icon-wrap)');
        if (spanText) spanText.textContent = 'Iniciar sesión';
      }
    }
  }

  updateAuthButtons();

  window.gbLogin = function() {
    localStorage.setItem('gb_user_logged_in', 'true');
    updateAuthButtons();
  };

  window.gbLogout = function() {
    localStorage.removeItem('gb_user_logged_in');
    updateAuthButtons();
  };

  // =========================
  // SHOPPING CART SYSTEM
  // =========================
  const cartBadgeElement = document.getElementById("cartBadge");

  // Sistema de carrito global
  window.gbCart = {
    // Obtener carrito de localStorage
    getCart: function() {
      const cart = localStorage.getItem('gb_cart');
      return cart ? JSON.parse(cart) : [];
    },

    // Guardar carrito en localStorage
    saveCart: function(cart) {
      localStorage.setItem('gb_cart', JSON.stringify(cart));
      this.updateBadge();
    },

    // Agregar producto al carrito
    add: function(product) {
      const cart = this.getCart();
      
      // Buscar si el producto ya existe (misma variante)
      const existingIndex = cart.findIndex(
        item => item.id === product.id && item.variant === product.variant
      );

      if (existingIndex > -1) {
        // Si existe, aumentar cantidad
        cart[existingIndex].quantity += product.quantity;
      } else {
        // Si no existe, agregar nuevo
        cart.push({
          id: product.id,
          name: product.name,
          variant: product.variant,
          price: product.price,
          quantity: product.quantity,
          image: product.image || ''
        });
      }

      this.saveCart(cart);
      return true;
    },

    // Obtener cantidad total de productos
    getTotalQuantity: function() {
      const cart = this.getCart();
      return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Obtener total en dinero
    getTotalPrice: function() {
      const cart = this.getCart();
      return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Remover producto del carrito
    remove: function(productId, variant) {
      let cart = this.getCart();
      cart = cart.filter(item => !(item.id === productId && item.variant === variant));
      this.saveCart(cart);
    },

    // Limpiar carrito completo
    clear: function() {
      localStorage.removeItem('gb_cart');
      this.updateBadge();
    },

    // Actualizar el badge del navbar
    updateBadge: function() {
      if (!cartBadgeElement) return;
      
      const totalQuantity = this.getTotalQuantity();
      cartBadgeElement.textContent = totalQuantity;
      
      // Mostrar/ocultar badge con animación
      if (totalQuantity > 0) {
        cartBadgeElement.classList.add('show');
      } else {
        cartBadgeElement.classList.remove('show');
      }
    }
  };

  // Inicializar badge al cargar la página
  window.gbCart.updateBadge();

  // Exponer función helper para agregar desde product-page.js
  window.addToCart = function(productData) {
    return window.gbCart.add(productData);
  };

});
