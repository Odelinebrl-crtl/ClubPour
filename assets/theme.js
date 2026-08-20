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
   CITATION POUR — SCROLL DIRECTION REVEAL
========================================================= */

function initPourQuoteReveal() {
  const quotes = document.querySelectorAll('[data-pour-quote]');

  if (!quotes.length) return;

  let lastScrollY = window.scrollY;

  function updateQuoteAnimation() {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;

    quotes.forEach((quote) => {
      const rect = quote.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      /* DESCENTE :
         apparition seulement quand le haut de la section
         arrive à environ 58% de l'écran
      */
      if (
        scrollingDown &&
        rect.top < viewportHeight * 0.58 &&
        rect.bottom > viewportHeight * 0.25
      ) {
        quote.classList.add('is-visible');
        quote.classList.remove('is-hidden-up');
      }

      /* REMONTÉE :
         disparition seulement quand le haut de la section
         remonte vers environ 28% de l'écran
      */
      if (
        !scrollingDown &&
        rect.top > viewportHeight * 0.28 &&
        rect.top < viewportHeight * 0.65
      ) {
        quote.classList.remove('is-visible');
        quote.classList.add('is-hidden-up');
      }
    });

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', updateQuoteAnimation, {
    passive: true
  });

  updateQuoteAnimation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPourQuoteReveal);
} else {
  initPourQuoteReveal();
}

document.addEventListener('shopify:section:load', initPourQuoteReveal);
/* =========================================================
   PRODUCT PAGE — GALLERY + TABS + QUANTITY
========================================================= */

function initPourProductPage() {
  const page = document.querySelector('[data-product-page]');

  if (!page) return;

  /* Gallery */

  const mainImage = page.querySelector('[data-main-product-image]');
  const thumbs = page.querySelectorAll('[data-product-thumb]');

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      if (!mainImage) return;

      const nextImage = thumb.dataset.image;

      if (!nextImage || mainImage.src === nextImage) return;

      mainImage.classList.add('is-changing');

      setTimeout(() => {
        mainImage.src = nextImage;

        mainImage.onload = () => {
          requestAnimationFrame(() => {
            mainImage.classList.remove('is-changing');
          });
        };
      }, 180);

      thumbs.forEach((item) => {
        item.classList.remove('is-active');
      });

      thumb.classList.add('is-active');
    });
  });

  /* Tabs */

  const tabs = page.querySelectorAll('[data-product-tab]');
  const panels = page.querySelectorAll('[data-product-panel]');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.productTab;

      tabs.forEach((item) => {
        item.classList.toggle('is-active', item === tab);
      });

      panels.forEach((panel) => {
        panel.classList.toggle(
          'is-active',
          panel.dataset.productPanel === target
        );
      });
    });
  });

  /* Quantity */

  const minus = page.querySelector('[data-qty-minus]');
  const plus = page.querySelector('[data-qty-plus]');
  const quantity = page.querySelector('[data-qty-input]');

  if (minus && plus && quantity) {
    minus.addEventListener('click', () => {
      quantity.value = Math.max(
        1,
        Number(quantity.value || 1) - 1
      );
    });

    plus.addEventListener('click', () => {
      quantity.value =
        Number(quantity.value || 1) + 1;
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPourProductPage);
} else {
  initPourProductPage();
}

document.addEventListener('shopify:section:load', initPourProductPage);
/* =========================================================
   VIDEO HERO POUR — PARALLAX
========================================================= */

function initPourVideoParallax() {
  const sections = document.querySelectorAll('[data-video-parallax]');

  if (!sections.length) return;

  let ticking = false;

  function updateVideoParallax() {
    sections.forEach((section) => {
      const video = section.querySelector('.pour-video-hero__video');

      if (!video) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (
        rect.bottom < 0 ||
        rect.top > viewportHeight
      ) {
        return;
      }

      const progress =
        (viewportHeight - rect.top) /
        (viewportHeight + rect.height);

      const normalized = progress - 0.5;

   const movement = normalized * 80;

    video.style.transform =
  `translate3d(0, ${movement}px, 0)`;
    });

    ticking = false;
  }

  function requestVideoUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateVideoParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestVideoUpdate, {
    passive: true
  });

  window.addEventListener('resize', requestVideoUpdate);

  updateVideoParallax();
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    initPourVideoParallax
  );
} else {
  initPourVideoParallax();
}

document.addEventListener(
  'shopify:section:load',
  initPourVideoParallax
);
/* =========================================================
   PORTÉ PAR VOUS — CAROUSEL SIMPLE
========================================================= */

function initPourCommunitySlider() {

  document
    .querySelectorAll('[data-community-slider]')
    .forEach((slider) => {

      if (slider.dataset.communityReady === 'true') return;

      slider.dataset.communityReady = 'true';

      const slides = Array.from(
        slider.querySelectorAll('.pour-community__slide')
      );

      const prev = slider.querySelector(
        '[data-community-prev]'
      );

      const next = slider.querySelector(
        '[data-community-next]'
      );

      if (!slides.length) return;


      let currentIndex = 0;
      let animating = false;


      /* ÉTAT INITIAL */

      slides.forEach((slide, index) => {

        slide.classList.remove(
          'is-active',
          'is-transitioning',
          'leave-left',
          'leave-right',
          'enter-left',
          'enter-right',
          'product-leaving',
          'product-entering'
        );

        if (index === 0) {
          slide.classList.add('is-active');
        }

      });


      function changeSlide(direction) {

        if (animating || slides.length < 2) return;

        animating = true;


        const oldSlide = slides[currentIndex];

        const newIndex =
          direction === 'next'
            ? (currentIndex + 1) % slides.length
            : (currentIndex - 1 + slides.length) % slides.length;

        const newSlide = slides[newIndex];


        /* =========================
           PRÉPARE LE NOUVEAU
        ========================= */

        newSlide.classList.remove(
          'is-active',
          'is-transitioning',
          'leave-left',
          'leave-right',
          'enter-left',
          'enter-right',
          'product-leaving',
          'product-entering'
        );


        newSlide.classList.add(
          'is-transitioning',
          direction === 'next'
            ? 'enter-right'
            : 'enter-left',
          'product-entering'
        );


        /*
          Force le navigateur à enregistrer
          l'état initial.
        */

        void newSlide.offsetWidth;


        /* =========================
           FAIT SORTIR L'ANCIEN
        ========================= */

        oldSlide.classList.add(
          direction === 'next'
            ? 'leave-left'
            : 'leave-right',
          'product-leaving'
        );


        /* =========================
           FAIT ENTRER LE NOUVEAU
        ========================= */

        requestAnimationFrame(() => {

          requestAnimationFrame(() => {

            newSlide.classList.remove(
              'enter-left',
              'enter-right',
              'product-entering'
            );

          });

        });


        /* =========================
           FIN DE TRANSITION
        ========================= */

        window.setTimeout(() => {

          oldSlide.classList.remove(
            'is-active',
            'leave-left',
            'leave-right',
            'product-leaving'
          );


          newSlide.classList.remove(
            'is-transitioning'
          );

          newSlide.classList.add(
            'is-active'
          );


          currentIndex = newIndex;

          animating = false;

        }, 580);

      }


      next?.addEventListener('click', () => {
        changeSlide('next');
      });


      prev?.addEventListener('click', () => {
        changeSlide('prev');
      });

    });

}


/* CHARGEMENT */

if (document.readyState === 'loading') {

  document.addEventListener(
    'DOMContentLoaded',
    initPourCommunitySlider
  );

} else {

  initPourCommunitySlider();

}


/* ÉDITEUR SHOPIFY */

document.addEventListener(
  'shopify:section:load',
  () => {

    document
      .querySelectorAll('[data-community-slider]')
      .forEach((slider) => {
        slider.dataset.communityReady = 'false';
      });

    initPourCommunitySlider();

  }
);
/* =========================================================
   HERO VÊTEMENTS — SLIDER
========================================================= */

function initClothingHero() {

  document
    .querySelectorAll('[data-clothing-hero]')
    .forEach((hero) => {

      if (hero.dataset.initialized === 'true') return;

      hero.dataset.initialized = 'true';


      const slides = Array.from(
        hero.querySelectorAll('[data-clothing-slide]')
      );

      const dots = Array.from(
        hero.querySelectorAll('[data-clothing-dot]')
      );


      if (!slides.length) return;


      let currentIndex = 0;
      let interval = null;


      const autoplay =
        hero.dataset.autoplay === 'true';

      const speed =
        parseInt(hero.dataset.speed, 10) || 5000;


      function showSlide(index) {

        currentIndex = index;


        slides.forEach((slide, slideIndex) => {

          slide.classList.toggle(
            'is-active',
            slideIndex === currentIndex
          );

        });


        dots.forEach((dot, dotIndex) => {

          dot.classList.toggle(
            'is-active',
            dotIndex === currentIndex
          );

        });

      }


      function nextSlide() {

        const nextIndex =
          (currentIndex + 1) % slides.length;

        showSlide(nextIndex);

      }


      function startAutoplay() {

        if (!autoplay || slides.length <= 1) return;

        clearInterval(interval);

        interval = setInterval(
          nextSlide,
          speed
        );

      }


      dots.forEach((dot, index) => {

        dot.addEventListener('click', () => {

          showSlide(index);

          startAutoplay();

        });

      });


      showSlide(0);

      startAutoplay();

    });

}


/* INITIALISATION */

if (document.readyState === 'loading') {

  document.addEventListener(
    'DOMContentLoaded',
    initClothingHero
  );

} else {

  initClothingHero();

}


document.addEventListener(
  'shopify:section:load',
  () => {

    document
      .querySelectorAll('[data-clothing-hero]')
      .forEach((hero) => {
        hero.dataset.initialized = 'false';
      });

    initClothingHero();

  }
);
