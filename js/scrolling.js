
(function () {
  const sections = Array.from(document.querySelectorAll("section"));
  if (!sections.length) return;

  // ✅ disable on mobile/tablet
  const isSmallScreen = window.matchMedia("(max-width: 992px)").matches;
  if (isSmallScreen) {
    // normal scrolling behaviour on mobile/tablet
    document.documentElement.style.scrollBehavior = "smooth";
    document.body.style.overflow = "auto";
    return; // stop running the rest of the script
  }

  // ✅ fullpage scroll for desktop only
  document.documentElement.style.scrollBehavior = "auto";
  document.body.style.overflow = "hidden";

  let currentIndex = 0;
  let isLocked = false;
  let positions = [];

  const clamp = i => Math.max(0, Math.min(i, sections.length - 1));

  const updatePositions = () => {
    positions = sections.map(s => s.offsetTop);
  };

  function goTo(index) {
    index = clamp(index);
    currentIndex = index;
    window.scrollTo({
      top: positions[currentIndex],
      left: 0,
      behavior: "auto"
    });
  }

  function step(dir) {
    const target = clamp(currentIndex + dir);
    if (target === currentIndex) return;

    isLocked = true;
    updatePositions();
    goTo(target);

    setTimeout(() => { isLocked = false; }, 800);
  }

  // Wheel
  window.addEventListener("wheel", e => {
    e.preventDefault();
    if (isLocked) return;
    if (Math.abs(e.deltaY) < 6) return;
    step(e.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  // Keyboard
  window.addEventListener("keydown", e => {
    if (isLocked) return;
    if (e.key === "ArrowDown") step(1);
    else if (e.key === "ArrowUp") step(-1);
  });

  // Touch
  let touchStartY = 0;
  window.addEventListener("touchstart", e => {
    if (e.touches[0]) touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener("touchend", e => {
    if (isLocked) return;
    const y = e.changedTouches[0]?.clientY || 0;
    const dy = touchStartY - y;
    if (Math.abs(dy) < 40) return;
    step(dy > 0 ? 1 : -1);
  }, { passive: true });

  // Resize
  window.addEventListener("resize", () => {
    updatePositions();
    goTo(currentIndex);
  });

  window.addEventListener("load", () => {
    updatePositions();
    goTo(0);

    setTimeout(() => {
      updatePositions();
      goTo(currentIndex);
    }, 500);
  });
})();






// (function () {
//   const sections = Array.from(document.querySelectorAll("section"));
//   if (!sections.length) return;

//   window.history.scrollRestoration = "manual";

//   document.documentElement.style.scrollBehavior = "auto";
//   document.body.style.overflow = "hidden";

//   let currentIndex = 0;
//   let isLocked = false;
//   let positions = [];

//   const clamp = i => Math.max(0, Math.min(i, sections.length - 1));

//   const updatePositions = () => {
//     positions = sections.map(s => s.offsetTop);
//   };

//   function goTo(index, force = false) {
//     index = clamp(index);
//     if (!force && currentIndex === index) return;
//     currentIndex = index;
//     window.scrollTo({
//       top: positions[currentIndex],
//       left: 0,
//       behavior: "smooth"
//     });
//   }

//   function step(dir) {
//     const target = clamp(currentIndex + dir);
//     if (target === currentIndex) return;

//     isLocked = true;
//     updatePositions();
//     goTo(target, true);

//     // unlock after smooth scroll finishes
//     setTimeout(() => { isLocked = false; }, 800);
//   }

//   // ✅ Wheel scroll (only one trigger per gesture)
//   let wheelTimeout;
//   window.addEventListener("wheel", e => {
//     e.preventDefault();
//     if (isLocked) return;

//     clearTimeout(wheelTimeout);
//     wheelTimeout = setTimeout(() => {
//       if (Math.abs(e.deltaY) > 40) {
//         step(e.deltaY > 0 ? 1 : -1);
//       }
//     }, 60); // debounce small wheel events
//   }, { passive: false });

//   // ✅ Keyboard navigation
//   window.addEventListener("keydown", e => {
//     if (isLocked) return;
//     if (e.key === "ArrowDown") step(1);
//     else if (e.key === "ArrowUp") step(-1);
//   });

//   // ✅ Touch navigation
//   let touchStartY = 0;
//   window.addEventListener("touchstart", e => {
//     if (e.touches[0]) touchStartY = e.touches[0].clientY;
//   }, { passive: true });

//   window.addEventListener("touchend", e => {
//     if (isLocked) return;
//     const y = e.changedTouches[0]?.clientY || 0;
//     const dy = touchStartY - y;
//     if (Math.abs(dy) < 50) return;
//     step(dy > 0 ? 1 : -1);
//   }, { passive: true });

//   window.addEventListener("resize", updatePositions);

//   window.addEventListener("load", () => {
//     updatePositions();
//     goTo(0, true);
//   });
// })();
