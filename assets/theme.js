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

  const heroes = document.querySelectorAll(
    '[data-clothing-hero]'
  );

  heroes.forEach((hero) => {

    /* évite les doubles initialisations */
    if (hero.dataset.sliderInitialized === 'true') {
      return;
    }

    hero.dataset.sliderInitialized = 'true';


    const slides = Array.from(
      hero.querySelectorAll('[data-clothing-slide]')
    );

    const dots = Array.from(
      hero.querySelectorAll('[data-clothing-dot]')
    );


    if (slides.length <= 1) {
      return;
    }


    let currentIndex = 0;

    let autoplayTimer = null;


    /* 4 secondes */

    const autoplayDelay = 4000;


    /* =========================
       AFFICHER UNE SLIDE
    ========================== */

    function showSlide(index) {

      if (index < 0) {
        index = slides.length - 1;
      }

      if (index >= slides.length) {
        index = 0;
      }


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


    /* =========================
       SLIDE SUIVANTE
    ========================== */

    function nextSlide() {

      showSlide(
        (currentIndex + 1) % slides.length
      );

    }


    /* =========================
       AUTOPLAY
    ========================== */

    function startAutoplay() {

      stopAutoplay();

      autoplayTimer = window.setInterval(
        nextSlide,
        autoplayDelay
      );

    }


    function stopAutoplay() {

      if (autoplayTimer) {

        window.clearInterval(
          autoplayTimer
        );

        autoplayTimer = null;

      }

    }


    /* =========================
       CLIC SUR 01 / 02 / 03...
    ========================== */

    dots.forEach((dot, index) => {

      dot.addEventListener('click', () => {

        showSlide(index);

        /* on repart pour 4 sec après le clic */
        startAutoplay();

      });

    });


    /* =========================
       INITIALISATION
    ========================== */

    showSlide(0);

    startAutoplay();

  });

}


/* CHARGEMENT NORMAL */

if (document.readyState === 'loading') {

  document.addEventListener(
    'DOMContentLoaded',
    initClothingHero
  );

} else {

  initClothingHero();

}


/* SHOPIFY THEME EDITOR */

document.addEventListener(
  'shopify:section:load',
  (event) => {

    const hero =
      event.target.querySelector?.(
        '[data-clothing-hero]'
      ) ||
      (
        event.target.matches?.(
          '[data-clothing-hero]'
        )
          ? event.target
          : null
      );


    if (hero) {

      hero.dataset.sliderInitialized = 'false';

      initClothingHero();

    }

  }
);
/* =========================================================
   HERO VÊTEMENTS — PARALLAX IDENTIQUE AU HERO HOME
========================================================= */

function initClothingHeroParallax() {

  const heroes = document.querySelectorAll(
    '[data-clothing-hero]'
  );

  if (!heroes.length) return;


  let ticking = false;


  function updateClothingParallax() {

    heroes.forEach((hero) => {

      const rect = hero.getBoundingClientRect();

      /*
        Inutile de calculer le parallax
        lorsque le hero n'est plus visible.
      */

      if (
        rect.bottom <= 0 ||
        rect.top >= window.innerHeight
      ) {
        return;
      }


      /*
        Distance parcourue depuis le haut du Hero.

        Au départ : 0
        Puis augmente lorsque l'on descend.
      */

      const scrolledInsideHero = Math.max(
        0,
        -rect.top
      );


      /*
        EXACTEMENT la même intensité
        que le Hero de la homepage.
      */

      const translateY =
        scrolledInsideHero * 0.22;


      /*
        On applique le mouvement à toutes les images
        pour que la slide suivante soit déjà correctement
        positionnée lorsqu'elle apparaît.
      */

      const images =
        hero.querySelectorAll(
          '.clothing-hero__image'
        );


      images.forEach((image) => {

        image.style.transform =
          `translate3d(0, ${translateY}px, 0) scale(1.08)`;

      });

    });


    ticking = false;
  }


  function onClothingScroll() {

    if (ticking) return;

    ticking = true;

    window.requestAnimationFrame(
      updateClothingParallax
    );

  }


  updateClothingParallax();


  window.addEventListener(
    'scroll',
    onClothingScroll,
    {
      passive: true
    }
  );

}


/* CHARGEMENT */

if (document.readyState === 'loading') {

  document.addEventListener(
    'DOMContentLoaded',
    initClothingHeroParallax
  );

} else {

  initClothingHeroParallax();

}


/* ÉDITEUR SHOPIFY */

document.addEventListener(
  'shopify:section:load',
  initClothingHeroParallax
);
