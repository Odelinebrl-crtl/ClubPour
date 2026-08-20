document.documentElement.classList.add('js');

function initHeroParallax() {
  const hero = document.querySelector('.pour-hero');
  const heroImage = document.querySelector('.pour-hero__image');

  if (!hero || !heroImage) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;

    if (scrollY <= heroHeight) {
      /*
        Plus la valeur 0.22 est élevée,
        plus l'image bouge avec le scroll.
      */
      const translateY = scrollY * 0.22;

      heroImage.style.transform =
        `translate3d(0, ${translateY}px, 0) scale(1.08)`;
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  updateParallax();

  window.addEventListener('scroll', onScroll, {
    passive: true
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroParallax);
} else {
  initHeroParallax();
}

/*
  Shopify recharge parfois les sections sans
  recharger toute la page dans l'éditeur.
*/
document.addEventListener('shopify:section:load', initHeroParallax);
/* =========================================================
   CITATION POUR — SCROLL REVEAL
========================================================= */

function initPourQuoteReveal() {
  const quotes = document.querySelectorAll('[data-pour-quote]');

  if (!quotes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          requestAnimationFrame(() => {
            entry.target.classList.add('is-visible');
          });

        } else {

          entry.target.classList.remove('is-visible');

        }

      });
    },
    {
      threshold: 0.25,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  quotes.forEach((quote) => {
    observer.observe(quote);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPourQuoteReveal);
} else {
  initPourQuoteReveal();
}

document.addEventListener('shopify:section:load', initPourQuoteReveal);
