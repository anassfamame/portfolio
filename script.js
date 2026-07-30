(() => {
  const root = document.documentElement;
  const langToggle = document.querySelector('.lang-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const header = document.querySelector('.site-header');

  const setLanguage = (lang) => {
    root.dataset.lang = lang;
    root.lang = lang;
    document.querySelectorAll('[data-fr][data-en]').forEach((node) => {
      node.textContent = node.dataset[lang];
    });
    document.querySelectorAll('[data-aria-fr][data-aria-en]').forEach((node) => {
      node.setAttribute('aria-label', node.dataset[`aria${lang.charAt(0).toUpperCase()}${lang.slice(1)}`]);
    });
    if (langToggle) {
      langToggle.textContent = lang === 'fr' ? 'EN' : 'FR';
      langToggle.setAttribute('aria-label', lang === 'fr' ? 'Switch to English' : 'Passer en français');
    }
    document.title = lang === 'fr'
      ? 'Anass Famame | Senior IT Manager Leader · RSI · Transformation IT'
      : 'Anass Famame | Senior IT Manager Leader · Head of IT · Transformation';
    try { localStorage.setItem('portfolio-language', lang); } catch (_) { /* storage can be unavailable */ }
  };

  let savedLanguage = 'fr';
  const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
  try { savedLanguage = localStorage.getItem('portfolio-language') || 'fr'; } catch (_) { /* default to French */ }
  if (requestedLanguage === 'en' || requestedLanguage === 'fr') savedLanguage = requestedLanguage;
  setLanguage(savedLanguage);

  langToggle?.addEventListener('click', () => setLanguage(root.dataset.lang === 'fr' ? 'en' : 'fr'));

  menuToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open') ?? false;
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 10), { passive: true });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.09 });
    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
  } else {
    document.querySelectorAll('.reveal').forEach((item) => item.classList.add('visible'));
  }
})();


// Portfolio security sec1
(() => {
  if (window.__portfolioSecurityInitialized) return;
  window.__portfolioSecurityInitialized = true;

  const toElement = (node) => {
    if (node instanceof Element) return node;
    return node?.parentElement || null;
  };

  const isCopyAllowed = (target) => {
    const element = toElement(target);

    return Boolean(
      element?.closest(
        [
          "a",
          "button",
          "input",
          "textarea",
          "[data-copy-allowed]",
          "#contact"
        ].join(",")
      )
    );
  };

  const getProtectedSelection = () => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return null;
    }

    const anchor = toElement(selection.anchorNode);
    const focus = toElement(selection.focusNode);

    return (
      anchor?.closest(".copy-guard") ||
      focus?.closest(".copy-guard") ||
      null
    );
  };

  const showProtectionNotice = () => {
    let notice = document.querySelector(".copy-notice");

    if (!notice) {
      notice = document.createElement("div");
      notice.className = "copy-notice";
      notice.setAttribute("role", "status");
      notice.setAttribute("aria-live", "polite");
      document.body.appendChild(notice);
    }

    const isEnglish =
      document.documentElement.dataset.lang === "en";

    notice.textContent = isEnglish
      ? "Protected content — reproduction requires prior authorization."
      : "Contenu protégé — reproduction soumise à autorisation préalable.";

    notice.classList.add("visible");

    window.clearTimeout(showProtectionNotice.timeoutId);

    showProtectionNotice.timeoutId = window.setTimeout(() => {
      notice.classList.remove("visible");
    }, 2200);
  };

  document.addEventListener("copy", (event) => {
    if (isCopyAllowed(event.target)) return;

    const protectedArea = getProtectedSelection();

    if (!protectedArea) return;

    event.preventDefault();
    showProtectionNotice();
  });

  document.addEventListener("cut", (event) => {
    if (isCopyAllowed(event.target)) return;

    const protectedArea = getProtectedSelection();

    if (!protectedArea) return;

    event.preventDefault();
    showProtectionNotice();
  });

  document.addEventListener("contextmenu", (event) => {
    const element = toElement(event.target);

    if (!element?.closest(".copy-guard")) return;
    if (isCopyAllowed(element)) return;

    event.preventDefault();
    showProtectionNotice();
  });

  document.addEventListener("dragstart", (event) => {
    const element = toElement(event.target);

    if (!element?.closest(".copy-guard")) return;
    if (isCopyAllowed(element)) return;

    event.preventDefault();
  });
})();
