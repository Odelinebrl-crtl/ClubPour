document.documentElement.classList.add('js');

const hero = document.querySelector('.pour-hero');
const heroImage = document.querySelector('.pour-hero__image');

if (hero && heroImage) {
  let ticking = false;

  const updateHeroParallax = () => {
    const rect = hero.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    /*
      L'effet fonctionne uniquement lorsque
      le Hero est encore visible à l'écran.
    */
    if (rect.bottom > 0 && rect.top < viewportHeight) {
      const progress = -rect.top / hero.offsetHeight;

      /*
        Intensité du mouvement.
        90 = mouvement visible mais élégant.
      */
      const movement = progress * 90;

      heroImage.style.transform =
        `translate3d(0, ${movement}px, 0)`;
    }

    ticking = false;
  };

  const requestHeroUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeroParallax);
      ticking = true;
    }
  };

  updateHeroParallax();

  window.addEventListener('scroll', requestHeroUpdate, {
    passive: true
  });

  window.addEventListener('resize', requestHeroUpdate);
}
