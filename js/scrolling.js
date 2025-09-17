document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const breakpoint = 992; // only run snapping above 992px (desktop)

  // If we're on tablet/phone, do nothing and make sure normal scrolling works
  if (window.innerWidth <= breakpoint) {
    // Kill any existing ScrollTriggers just in case
    ScrollTrigger.getAll().forEach(t => t.kill());
    // Make sure body scrolls normally
    document.body.style.overflowY = 'auto';
    return; // skip the rest of the snapping code
  }

  // === DESKTOP SNAPPING CODE ===
  const sections = gsap.utils.toArray("section");

  function calcSnapPoints() {
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollRange <= 0) return [0];
    return sections.map(s => +(s.offsetTop / scrollRange).toFixed(5));
  }

  let snapPoints = calcSnapPoints();

  function initSnapTrigger() {
    snapPoints = calcSnapPoints();

    ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      snap: {
        snapTo: snapPoints,
        duration: 0.2,
        delay: 0,
        ease: "none",
        directional: true
      },
      onRefresh(self) {
        snapPoints = calcSnapPoints();
        if (self.vars && self.vars.snap) {
          self.vars.snap.snapTo = snapPoints;
        }
      }
    });
  }

  if (sections.length > 1) {
    setTimeout(() => {
      gsap.to(window, {
        scrollTo: { y: sections[1], autoKill: false },
        ease: "power2.inOut",
        onComplete: () => {
          initSnapTrigger();
          setTimeout(() => ScrollTrigger.refresh(), 60);
        }
      });
    }, 2500);
  } else {
    initSnapTrigger();
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
  window.addEventListener("resize", () => ScrollTrigger.refresh());
});
