// HOME PAGE - Glitched Box
// Animaciones scroll + FAQ accordion

document.addEventListener("DOMContentLoaded", () => {
  
  // ============================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ============================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Opcional: dejar de observar después de animar
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar todos los elementos con la clase animate-on-scroll
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));

  // ============================================
  // FAQ ACCORDION
  // ============================================
  const faqRoot = document.querySelector("[data-faq]");
  if (!faqRoot) return;

  const faqItems = Array.from(faqRoot.querySelectorAll(".faq__item"));

  faqItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      const panel = btn.nextElementSibling;

      // Cerrar todos (comportamiento acordeón)
      faqItems.forEach((b) => {
        b.setAttribute("aria-expanded", "false");
        const p = b.nextElementSibling;
        if (p && p.classList.contains('faq__panel')) {
          p.style.display = 'none';
        }
        const icon = b.querySelector(".faq__icon");
        if (icon) icon.textContent = "+";
      });

      // Abrir el actual si estaba cerrado
      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        if (panel && panel.classList.contains('faq__panel')) {
          panel.style.display = 'block';
        }
        const icon = btn.querySelector(".faq__icon");
        if (icon) icon.textContent = "−";
      }
    });
  });
});
