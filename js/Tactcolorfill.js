
document.addEventListener('DOMContentLoaded', function () {
  const tactNode = document.querySelector('.wm-word.tact');
  if (!tactNode) return;

  // Split TACT into spans
  const text = tactNode.textContent.trim();
  tactNode.innerHTML = text.split('').map(l => `<span class="wm-letter">${l}</span>`).join('');
  const letterEls = Array.from(tactNode.querySelectorAll('.wm-letter'));

  // Grab sections
  let allSections = Array.from(document.querySelectorAll('.color-step'));
  if (!allSections.length) {
    allSections = Array.from(document.querySelectorAll('section'));
  }

  const heroSection = allSections[0];            // Hero = first section
  const stepSections = allSections.slice(1);     // Start filling from section 2
  const maxSteps = Math.min(letterEls.length, stepSections.length);

  const obsOptions = { root: null, threshold: 0.5 };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    if (visible.target === heroSection) {
      // Reset completely in Hero
      letterEls.forEach(el => el.classList.remove('filled'));
    } else {
      const stepIndex = stepSections.indexOf(visible.target);
      const fillCount = Math.max(0, Math.min(maxSteps, stepIndex + 1));

      letterEls.forEach((el, i) => {
        if (i < fillCount) el.classList.add('filled');
        else el.classList.remove('filled');
      });
    }
  }, obsOptions);

  // Observe hero + all step sections
  if (heroSection) observer.observe(heroSection);
  stepSections.forEach(sec => observer.observe(sec));

  window.addEventListener('unload', () => observer.disconnect());
});