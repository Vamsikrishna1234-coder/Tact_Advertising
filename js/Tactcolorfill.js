

document.addEventListener('DOMContentLoaded', () => {
  const tactNode = document.querySelector('.wm-word.tact');
  if (!tactNode) return;

  // Build spans for letters
  const text = tactNode.textContent.trim();
  tactNode.innerHTML = text.split('').map(ch => `<span class="wm-letter">${ch}</span>`).join('');
  const letterEls = Array.from(tactNode.querySelectorAll('.wm-letter'));
  if (!letterEls.length) return;

  // SECTION SELECTORS in exact order
  const sectionSelectors = [
    '.tactstatement-container', // -> T
    '#brand-section',         // -> A
    '.team-container',          // -> C
    '.contact-container'        // -> T
  ];
  let sections = sectionSelectors.map(sel => document.querySelector(sel)).filter(Boolean);

  // Safety: map only up to letters available
  if (sections.length > letterEls.length) {
    sections = sections.slice(0, letterEls.length);
  }

  function setLetters(count) {
    // Fill cumulatively up to "count"
    letterEls.forEach((el, i) => el.classList.toggle('filled', i < count));
  }

  function computeActiveCount() {
    if (!sections.length) return 0;
    const vpCenter = window.innerHeight / 2;
    const rects = sections.map(s => s.getBoundingClientRect());

    // If center is inside a section → return its index+1
    for (let i = 0; i < rects.length; i++) {
      if (vpCenter >= rects[i].top && vpCenter <= rects[i].bottom) {
        return i + 1;
      }
    }

    // Otherwise count how many sections' centers are above vpCenter
    let count = 0;
    for (let i = 0; i < rects.length; i++) {
      const center = rects[i].top + rects[i].height / 2;
      if (vpCenter >= center) count = i + 1;
    }

    return count;
  }

  let ticking = false;
  function update() {
    ticking = false;
    const count = computeActiveCount();
    setLetters(count);
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  // Events
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('load', requestUpdate);

  // In case images load late
  document.addEventListener('load', (e) => {
    if (e.target && e.target.tagName === 'IMG') requestUpdate();
  }, true);

  const mo = new MutationObserver(requestUpdate);
  mo.observe(document.body, { childList: true, subtree: true });

  // Initial run
  requestUpdate();
});
