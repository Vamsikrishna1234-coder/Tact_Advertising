// logomovement.js
gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const stepStartIndex = 1; // 2nd section index
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

  // === LOGO STEP-BY-STEP AFTER 2ND SECTION ===
  ScrollTrigger.create({
    trigger: stepStartSection,
    start: "top top",
    endTrigger: stepEndSection,
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      // Calculate logo X proportionally
      let progress = self.progress; // 0 → 1 between 2nd → last section
      let logoX = progress * maxX;
      gsap.to("#logo", { x: logoX, duration: 0.2, ease: "power2.out" });
    }
  });

  // === AUTO SCROLL LAST → 2ND SECTION WITH LOGO REVERSAL ===
  ScrollTrigger.create({
    trigger: stepEndSection,
    start: "bottom bottom",
    onEnter: () => {
      gsap.to(window, {
        scrollTo: { y: stepStartSection, offsetY: 0 },
        duration: 2,
        ease: "power2.inOut",
        onUpdate: function () {
          // Sync logo movement in reverse while scrolling back
          let scrollTop = window.scrollY;
          let totalScroll =
            stepEndSection.offsetTop - stepStartSection.offsetTop;
          let progress =
            (scrollTop - stepStartSection.offsetTop) / totalScroll;

          // Clamp between 0 and 1
          progress = Math.min(Math.max(progress, 0), 1);

          let logoX = progress * maxX;
          gsap.to("#logo", {
            x: logoX,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      });
    }
  });
});
