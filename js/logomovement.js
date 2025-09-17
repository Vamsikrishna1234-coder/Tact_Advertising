// logomovement.js
gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const stepStartIndex = 0; // start from hero (1st section)
  const stepStartSection = sections[stepStartIndex];
  const stepEndSection = sections[sections.length - 1];
  const maxX = window.innerWidth - 350;

  // === AUTO SCROLL HERO → 2ND SECTION ===
  setTimeout(() => {
    let tl = gsap.timeline();

    // Logo moves up
    tl.to("#logo", {
      marginTop: 0,
      duration: 0.3,
      ease: "power2.out"
    });

    // Scroll to 2nd section automatically
    tl.to(window, {
      scrollTo: { y: "#tact-statement", offsetY: 0 },
      duration: 0.5,
      ease: "power2.inOut"
    });
  }, 2500);

  // === LOGO MOVE ACROSS SCROLL (only on desktop) ===
  if (window.innerWidth >= 1024) {   // set breakpoint here
    gsap.to("#logo", {
      x: maxX,
      ease: "none",
      scrollTrigger: {
        trigger: stepStartSection,
        start: "top top",
        endTrigger: stepEndSection,
        end: "bottom bottom",
        scrub: true
      }
    });
  }
});
