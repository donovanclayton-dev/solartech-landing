/* ── Year ─────────────────────────────────────────────── */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Sticky header ────────────────────────────────────── */
const header = document.querySelector("[data-header]");
if (header) {
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ── Smooth scroll for anchor links ──────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", id);
  });
});

/* ── Count-up animation ──────────────────────────────── */
function animateCountUp(el) {
  const target   = parseInt(el.dataset.count, 10);
  const suffix   = el.dataset.suffix  || "";
  const useComma = el.dataset.format  === "thousands";
  const duration = 2000; // ms
  const start    = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function frame(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutCubic(progress);
    const current  = Math.round(eased * target);

    el.textContent = (useComma ? current.toLocaleString() : current) + suffix;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

/* Fire once when the stats bar scrolls into view */
const statsBar = document.querySelector(".stats-bar");
if (statsBar && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.querySelectorAll(".stat-num[data-count]").forEach(animateCountUp);
          observer.disconnect(); // animate only once
        }
      });
    },
    { threshold: 0.4 }
  );
  observer.observe(statsBar);
}
