// ============================================================
//  MOTION PACK — header su scroll, spotlight card, reveal in, tab slider, scroll top
// ============================================================

// ============================================================
//  MOTION PACK · header su scroll, spotlight card, reveal in
//  scroll, slider dei tab, micro-feedback sui bottoni "seleziona"
// ============================================================

// ----- Header che si comprime/scurisce quando si scorre -----
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ----- Spotlight + leggero tilt 3D che segue il cursore sulle card -----
function initCardSpotlight() {
  let ticking = false;
  let lastEvent = null;

  function updateCard(e) {
    const card = e.target.closest(".card-squadra");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    card.style.setProperty("--mx", `${px}%`);
    card.style.setProperty("--my", `${py}%`);
    const tiltY = (x / rect.width - 0.5) * 6; // rotazione asse Y
    const tiltX = (0.5 - y / rect.height) * 6; // rotazione asse X
    card.style.setProperty("--tilt-x", `${tiltX}deg`);
    card.style.setProperty("--tilt-y", `${tiltY}deg`);
  }

  document.addEventListener(
    "pointermove",
    (e) => {
      lastEvent = e;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (lastEvent) updateCard(lastEvent);
        ticking = false;
      });
    },
    { passive: true },
  );
}

// ----- Reveal a comparsa quando gli elementi entrano nel viewport -----
let revealObserver = null;
function initScrollReveal() {
  if (!("IntersectionObserver" in window)) return;
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );
}

// Da richiamare dopo ogni render che genera nuove card/sezioni:
// marca i nodi come "da rivelare" e li affida all'observer.
function observeReveal(selector, root) {
  if (!revealObserver) return;
  const scope = root || document;
  const nodes = scope.querySelectorAll(selector);
  nodes.forEach((el, i) => {
    if (el.classList.contains("in-view") || el.dataset.revealBound === "1")
      return;
    el.dataset.revealBound = "1";
    el.classList.add("reveal-on-scroll");
    el.style.transitionDelay = `${Math.min(i, 10) * 35}ms`;
    revealObserver.observe(el);
  });
}

// ----- Indicatore a slitta dietro il tab attivo (Listone / Il Mio) -----
function ensureTabSlider() {
  const group = document.querySelector(".tab-group");
  if (!group) return null;
  let slider = group.querySelector(".tab-slider");
  if (!slider) {
    slider = document.createElement("span");
    slider.className = "tab-slider";
    group.prepend(slider);
  }
  return slider;
}

function updateTabSlider() {
  const group = document.querySelector(".tab-group");
  const active = group && group.querySelector(".btn-tab.active");
  const slider = ensureTabSlider();
  if (!group || !active || !slider) return;
  const groupRect = group.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  slider.style.width = `${activeRect.width}px`;
  slider.style.transform = `translateX(${activeRect.left - groupRect.left}px)`;
}

// ----- Piccolo impulso visivo sui pulsanti "seleziona tutti" al click -----
function initSelectAllPulse() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-select-all, .btn-select-all-squadra");
    if (!btn) return;
    btn.classList.remove("just-triggered");
    // forza il reflow così l'animazione riparte anche su click ravvicinati
    void btn.offsetWidth;
    btn.classList.add("just-triggered");
    setTimeout(() => btn.classList.remove("just-triggered"), 550);
  });
}

// ----- Scorre fino all'inizio del contenuto, tenendo conto dell'altezza
// reale di header e toolbar (che sono sticky su desktop ma non su mobile).
// Serve per evitare che, aprendo la card di una squadra mentre si è
// scrollati in basso nella griglia, la nuova sezione appaia "fuori
// schermo" e sembri che la pagina non abbia reagito al click. -----
function scrollToMain() {
  const header = document.querySelector(".site-header");
  const toolbar = document.querySelector(".toolbar:not(.hidden)");
  const main = document.querySelector(".main-content");
  if (!main) return;

  let offset = header ? header.getBoundingClientRect().height : 0;
  if (toolbar) {
    const pos = window.getComputedStyle(toolbar).position;
    if (pos === "sticky" || pos === "fixed") {
      offset += toolbar.getBoundingClientRect().height;
    }
  }
  offset += 12;

  const rectTop = main.getBoundingClientRect().top + window.scrollY;
  const target = Math.max(rectTop - offset, 0);

  // Se siamo già vicini alla posizione giusta non serve animare lo scroll.
  if (Math.abs(window.scrollY - target) < 4) return;
  window.scrollTo({ top: target, behavior: "smooth" });
}

// ----- Bottone flottante "torna su" -----
function initScrollTopButton() {
  const btn = document.createElement("button");
  btn.className = "btn-scroll-top";
  btn.type = "button";
  btn.title = "Torna su";
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.body.appendChild(btn);

  const onScroll = () => {
    btn.classList.toggle("visible", window.scrollY > 420);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initCardSpotlight();
  initScrollReveal();
  initSelectAllPulse();
  initScrollTopButton();
  window.addEventListener("resize", updateTabSlider);
});

