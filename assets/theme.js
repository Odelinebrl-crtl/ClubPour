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
        rect.top < viewportHeight * 0.82 &&
        rect.bottom > viewportHeight * 0.07
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
   HERO VÊTEMENTS
   SLIDER + TEXTE + PARALLAX
========================================================= */

function initClothingHero() {

  document
    .querySelectorAll('[data-clothing-hero]')
    .forEach((hero) => {

      if (hero.dataset.clothingReady === 'true') {
        return;
      }

      hero.dataset.clothingReady = 'true';


      const slides = Array.from(
        hero.querySelectorAll('[data-clothing-slide]')
      );

      const dots = Array.from(
        hero.querySelectorAll('[data-clothing-dot]')
      );

      const images = Array.from(
        hero.querySelectorAll('.clothing-hero__image')
      );


      if (!slides.length) {
        return;
      }


      let currentIndex = 0;

      let isAnimating = false;

      let autoplayTimer = null;

      let parallaxTicking = false;


      const autoplayEnabled =
        hero.dataset.autoplay !== 'false';

      const autoplayDelay =
        Number(hero.dataset.speed) || 4000;

      const slideDuration = 820;


/* =========================================================
   ÉTAT INITIAL
========================================================= */

slides.forEach((slide) => {

  slide.classList.remove(
    'is-active',
    'is-entering',
    'is-from-right',
    'is-from-left',
    'is-moving',
    'is-text-visible'
  );

});


/* =========================================================
   ENTRÉE TEXTE — PREMIÈRE SLIDE
========================================================= */

const firstSlide = slides[0];

firstSlide.classList.add(
  'is-active'
);


/*
  On laisse d'abord le navigateur afficher
  l'image seule, sans texte.
*/

window.requestAnimationFrame(() => {

  window.requestAnimationFrame(() => {

    window.setTimeout(() => {

      firstSlide.classList.add(
        'is-text-visible'
      );

    }, 120);

  });

});


/* =========================================================
   PAGINATION INITIALE
========================================================= */

      dots.forEach((dot, index) => {

        dot.classList.toggle(
          'is-active',
          index === 0
        );

      });


/* =========================================================
   PAGINATION — IMMÉDIATE
========================================================= */

      function updatePagination(index) {

        dots.forEach((dot, dotIndex) => {

          dot.classList.toggle(
            'is-active',
            dotIndex === index
          );

        });

      }


/* =========================================================
   AUTOPLAY
========================================================= */

      function stopAutoplay() {

        if (!autoplayTimer) {
          return;
        }

        window.clearInterval(
          autoplayTimer
        );

        autoplayTimer = null;

      }


      function startAutoplay() {

        stopAutoplay();


        if (
          !autoplayEnabled ||
          slides.length < 2
        ) {
          return;
        }


        autoplayTimer =
          window.setInterval(() => {

            if (isAnimating) {
              return;
            }


            const nextIndex =
              (currentIndex + 1) %
              slides.length;


            goToSlide(
              nextIndex,
              'next'
            );

          }, autoplayDelay);

      }


/* =========================================================
   CHANGEMENT DE SLIDE
========================================================= */

      function goToSlide(
        newIndex,
        direction
      ) {

        if (
          isAnimating ||
          newIndex === currentIndex
        ) {
          return;
        }


        isAnimating = true;


        const oldSlide =
          slides[currentIndex];

        const newSlide =
          slides[newIndex];


        /*
          Le numéro sélectionné devient actif
          IMMÉDIATEMENT.
        */

        updatePagination(
          newIndex
        );


        /*
          Le texte de l'ancienne image disparaît.
        */

        oldSlide.classList.remove(
          'is-text-visible'
        );


        /*
          Nettoyage du prochain slide.
        */

        newSlide.classList.remove(
          'is-active',
          'is-entering',
          'is-from-right',
          'is-from-left',
          'is-moving',
          'is-text-visible'
        );


        /*
          PAGE SUIVANTE :
          arrive depuis la droite.

          PAGE PRÉCÉDENTE :
          arrive depuis la gauche.
        */

        newSlide.classList.add(
          'is-entering',
          direction === 'next'
            ? 'is-from-right'
            : 'is-from-left'
        );


        /*
          Force le navigateur à enregistrer
          la position de départ.
        */

        void newSlide.offsetWidth;


        /*
          Active la transition horizontale.
        */

        newSlide.classList.add(
          'is-moving'
        );


        /*
          Puis on retire le décalage :
          la nouvelle image glisse vers sa place.
        */

        window.requestAnimationFrame(() => {

          window.requestAnimationFrame(() => {

            newSlide.classList.remove(
              'is-from-right',
              'is-from-left'
            );

          });

        });


/* =========================================================
   FIN DE TRANSITION IMAGE
========================================================= */

        window.setTimeout(() => {

          oldSlide.classList.remove(
            'is-active'
          );


          newSlide.classList.remove(
            'is-entering',
            'is-moving'
          );


          newSlide.classList.add(
            'is-active'
          );


          currentIndex =
            newIndex;


          /*
            Une fois seulement que l'image
            est complètement installée,
            le texte apparaît du haut vers le bas.
          */

          window.setTimeout(() => {

            newSlide.classList.add(
              'is-text-visible'
            );

            isAnimating = false;

          }, 100);


        }, slideDuration);

      }


/* =========================================================
   CLIC SUR 01 / 02 / 03...
========================================================= */

      dots.forEach((dot, index) => {

        dot.addEventListener(
          'click',
          () => {

            if (
              index === currentIndex ||
              isAnimating
            ) {
              return;
            }


            const direction =
              index > currentIndex
                ? 'next'
                : 'prev';


            /*
              Mise à jour visuelle immédiate.
            */

            updatePagination(
              index
            );


            goToSlide(
              index,
              direction
            );


            /*
              Après un clic manuel,
              on repart sur un cycle complet.
            */

            startAutoplay();

          }
        );

      });


/* =========================================================
   HERO VÊTEMENTS — PARALLAX
   IDENTIQUE AU HERO DE LA HOME
========================================================= */

function updateClothingParallax() {

  const scrollY = window.scrollY;

  const heroTop =
    hero.getBoundingClientRect().top + scrollY;

  const heroHeight =
    hero.offsetHeight;


  /*
    Distance réellement parcourue
    à l'intérieur du Hero.
  */

  const localScroll =
    Math.max(
      0,
      Math.min(
        scrollY - heroTop,
        heroHeight
      )
    );


  /*
    Même coefficient que le Hero Home.
  */

  const translateY =
    localScroll * 0.22;


  images.forEach((image) => {

    image.style.transform =
      `translate3d(0, ${translateY}px, 0) scale(1.08)`;

  });


  parallaxTicking = false;
}


function requestClothingParallax() {

  if (parallaxTicking) {
    return;
  }


  parallaxTicking = true;


  window.requestAnimationFrame(() => {

    updateClothingParallax();

  });

}


/* LE LISTENER QUI FAIT RÉELLEMENT BOUGER L'IMAGE */

window.addEventListener(
  'scroll',
  requestClothingParallax,
  {
    passive: true
  }
);


window.addEventListener(
  'resize',
  requestClothingParallax
);


/* Position initiale */

updateClothingParallax();


/* =========================================================
   START
========================================================= */

      startAutoplay();

    });

}


/* =========================================================
   CHARGEMENT
========================================================= */

if (
  document.readyState ===
  'loading'
) {

  document.addEventListener(
    'DOMContentLoaded',
    initClothingHero
  );

} else {

  initClothingHero();

}


/* =========================================================
   SHOPIFY EDITOR
========================================================= */

document.addEventListener(
  'shopify:section:load',
  () => {

    document
      .querySelectorAll(
        '[data-clothing-hero]'
      )
      .forEach((hero) => {

        hero.dataset.clothingReady =
          'false';

      });


    initClothingHero();

  }
);
/* =========================================================
   PRODUITS POUR — CARROUSEL
   1 CLIC = 1 PRODUIT
========================================================= */

function initPourProductsCarousel() {

  document
    .querySelectorAll('[data-pour-products-carousel]')
    .forEach((carousel) => {

      if (carousel.dataset.carouselReady === 'true') {
        return;
      }

      carousel.dataset.carouselReady = 'true';


      const track =
        carousel.querySelector('[data-pour-products-track]');

      const prev =
        carousel.querySelector('[data-pour-products-prev]');

      const next =
        carousel.querySelector('[data-pour-products-next]');


      if (!track) {
        return;
      }


      /* =====================================================
         LARGEUR EXACTE D'UN PRODUIT
      ===================================================== */

      function getProductStep() {

        const firstProduct =
          track.querySelector('.pour-product');

        if (!firstProduct) {
          return 0;
        }


        const trackStyle =
          window.getComputedStyle(track);


        const gap =
          parseFloat(trackStyle.gap) || 0;


        const productWidth =
          firstProduct.getBoundingClientRect().width;


        return productWidth + gap;

      }


      /* =====================================================
         FLÈCHE DROITE
      ===================================================== */

      if (next) {

        next.addEventListener('click', () => {

          track.scrollBy({
            left: getProductStep(),
            behavior: 'smooth'
          });

        });

      }


      /* =====================================================
         FLÈCHE GAUCHE
      ===================================================== */

      if (prev) {

        prev.addEventListener('click', () => {

          track.scrollBy({
            left: -getProductStep(),
            behavior: 'smooth'
          });

        });

      }


      /* =====================================================
         ÉTAT DES FLÈCHES
      ===================================================== */

      function updateArrows() {

        const maxScroll =
          track.scrollWidth -
          track.clientWidth;


        if (prev) {

          prev.disabled =
            track.scrollLeft <= 2;

        }


        if (next) {

          next.disabled =
            track.scrollLeft >=
            maxScroll - 2;

        }

      }


      track.addEventListener(
        'scroll',
        () => {

          requestAnimationFrame(
            updateArrows
          );

        },
        {
          passive: true
        }
      );


      window.addEventListener(
        'resize',
        updateArrows
      );


      updateArrows();

    });

}


/* =========================================================
   CHARGEMENT
========================================================= */

if (document.readyState === 'loading') {

  document.addEventListener(
    'DOMContentLoaded',
    initPourProductsCarousel
  );

} else {

  initPourProductsCarousel();

}


/* =========================================================
   SHOPIFY EDITOR
========================================================= */

document.addEventListener(
  'shopify:section:load',
  () => {

    document
      .querySelectorAll('[data-pour-products-carousel]')
      .forEach((carousel) => {

        carousel.dataset.carouselReady =
          'false';

      });


    initPourProductsCarousel();

  }
);
/* =========================================================
   POUR — AJAX ADD TO CART + OUVERTURE CART DRAWER
========================================================= */

(function () {

  function getShopRoot() {
    if (
      window.Shopify &&
      window.Shopify.routes &&
      window.Shopify.routes.root
    ) {
      return window.Shopify.routes.root;
    }

    return '/';
  }


  function formatMoney(cents) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(cents / 100);
  }


  function openPourCartDrawer() {

    const drawer =
      document.querySelector('[data-cart-drawer]');

    const overlay =
      document.querySelector('[data-cart-drawer-overlay]');

    if (!drawer || !overlay) return;

    drawer.classList.add('is-active');
    overlay.classList.add('is-active');

    drawer.setAttribute(
      'aria-hidden',
      'false'
    );
const scrollbarWidth =
  window.innerWidth -
  document.documentElement.clientWidth;

document.body.style.setProperty(
  '--scrollbar-width',
  scrollbarWidth + 'px'
);
    document.body.classList.add(
      'cart-drawer-open'
    );
  }


  async function refreshPourCartDrawer() {

    const root = getShopRoot();

    const response =
      await fetch(root + 'cart.js', {
        headers: {
          Accept: 'application/json'
        }
      });

    if (!response.ok) {
      throw new Error(
        'Impossible de récupérer le panier.'
      );
    }

    const cart = await response.json();


    /* ===============================================
       COMPTEUR HEADER
    =============================================== */

    document
      .querySelectorAll('[data-cart-drawer-open]')
      .forEach((button) => {

        button.textContent =
          cart.item_count > 0
            ? `PANIER (${cart.item_count})`
            : 'PANIER';

      });


    const drawer =
      document.querySelector('[data-cart-drawer]');

    if (!drawer) return;


    /* ===============================================
       PANIER VIDE
    =============================================== */

    if (cart.item_count === 0) {

      drawer.innerHTML = `
        <div class="cart-drawer__header">

          <p class="cart-drawer__title">
            PANIER
          </p>

          <button
            type="button"
            class="cart-drawer__close"
            data-cart-drawer-close
            aria-label="Fermer le panier"
          >
            ×
          </button>

        </div>

        <div class="cart-drawer__empty">

          <p>
            VOTRE PANIER EST VIDE.
          </p>

          <a href="/pages/boutique?view=vetements">
            DÉCOUVRIR LA COLLECTION
          </a>

        </div>
      `;

      return;
    }


    /* ===============================================
       PRODUITS
    =============================================== */

    const itemsHTML =
      cart.items
        .map((item, index) => {

          const variant =
            item.variant_title &&
            item.variant_title !== 'Default Title'
              ? `
                <div class="cart-drawer__variants">
                  <p>${item.variant_title}</p>
                </div>
              `
              : '';

          const image =
            item.image
              ? `
                <img
                  src="${item.image}"
                  class="cart-drawer__image"
                  alt="${item.product_title}"
                  loading="lazy"
                >
              `
              : '';

          return `
            <div class="cart-drawer__item">

              <a
                href="${item.url}"
                class="cart-drawer__media"
              >
                ${image}
              </a>


              <div class="cart-drawer__content">

                <a
                  href="${item.url}"
                  class="cart-drawer__item-title"
                >
                  ${item.product_title}
                </a>


                <p class="cart-drawer__item-price">
                  ${formatMoney(item.final_line_price)}
                </p>


                ${variant}


                <div class="cart-drawer__actions">

                  <div class="cart-drawer__quantity">

                    <button
                      type="button"
                      data-cart-change
                      data-line="${index + 1}"
                      data-quantity="${item.quantity - 1}"
                      aria-label="Réduire la quantité"
                    >
                      −
                    </button>

                    <span>
                      ${item.quantity}
                    </span>

                    <button
                      type="button"
                      data-cart-change
                      data-line="${index + 1}"
                      data-quantity="${item.quantity + 1}"
                      aria-label="Augmenter la quantité"
                    >
                      +
                    </button>

                  </div>


                  <button
                    type="button"
                    class="cart-drawer__remove"
                    data-cart-change
                    data-line="${index + 1}"
                    data-quantity="0"
                  >
                    SUPPRIMER
                  </button>

                </div>

              </div>

            </div>
          `;

        })
        .join('');


    drawer.innerHTML = `

      <div class="cart-drawer__header">

        <p class="cart-drawer__title">
          PANIER
        </p>

        <button
          type="button"
          class="cart-drawer__close"
          data-cart-drawer-close
          aria-label="Fermer le panier"
        >
          ×
        </button>

      </div>


      <div class="cart-drawer__items">
        ${itemsHTML}
      </div>


      <div class="cart-drawer__footer">

        <div class="cart-drawer__total">

          <span>
            SOUS-TOTAL
          </span>

          <span>
            ${formatMoney(cart.total_price)}
          </span>

        </div>


        <p class="cart-drawer__shipping">
          Livraison et taxes calculées à l’étape suivante.
        </p>


        <form
          action="${root}cart"
          method="post"
        >

          <button
            type="submit"
            name="checkout"
            class="cart-drawer__checkout"
          >

            <span>
              PASSER AU PAIEMENT
            </span>

            <span aria-hidden="true">
              →
            </span>

          </button>

        </form>


        <a
          href="${root}cart"
          class="cart-drawer__view-cart"
        >
          VOIR LE PANIER
        </a>

      </div>
    `;
  }


  /* =====================================================
     AJOUT AU PANIER
  ====================================================== */

  document.addEventListener(
    'submit',
    async function (event) {

      const form =
        event.target.closest(
          'form[action*="/cart/add"]'
        );

      if (!form) return;

      event.preventDefault();


      const submitButton =
        form.querySelector(
          '[type="submit"]'
        );


      if (submitButton) {
        submitButton.disabled = true;
      }


      try {

        const root = getShopRoot();

        const formData =
          new FormData(form);


        const response =
          await fetch(
            root + 'cart/add.js',
            {
              method: 'POST',

              headers: {
                Accept: 'application/json'
              },

              body: formData
            }
          );


        if (!response.ok) {

          const error =
            await response.json();

          throw new Error(
            error.description ||
            'Impossible d’ajouter ce produit.'
          );

        }


        /* Met à jour le drawer */

        await refreshPourCartDrawer();


        /* Puis l'ouvre */

        openPourCartDrawer();


      } catch (error) {

        console.error(
          'POUR — Add to cart:',
          error
        );

        alert(
          error.message ||
          'Une erreur est survenue.'
        );

      } finally {

        if (submitButton) {
          submitButton.disabled = false;
        }

      }

    }
  );


  /* =====================================================
     MODIFICATION QUANTITÉ DANS LE DRAWER
  ====================================================== */

  document.addEventListener(
    'click',
    async function (event) {

      const button =
        event.target.closest(
          '[data-cart-change]'
        );

      if (!button) return;


      event.preventDefault();


      const line =
        Number(
          button.dataset.line
        );

      const quantity =
        Math.max(
          0,
          Number(
            button.dataset.quantity
          )
        );


      try {

        const root = getShopRoot();


        await fetch(
          root + 'cart/change.js',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Accept:
                'application/json'
            },

            body:
              JSON.stringify({
                line: line,
                quantity: quantity
              })
          }
        );


        await refreshPourCartDrawer();


      } catch (error) {

        console.error(
          'POUR — Update cart:',
          error
        );

      }

    }
  );


  /* =====================================================
     FERMETURE APRÈS RAFRAÎCHISSEMENT DU DRAWER
  ====================================================== */

  document.addEventListener(
    'click',
    function (event) {

      const close =
        event.target.closest(
          '[data-cart-drawer-close]'
        );

      if (!close) return;


      const drawer =
        document.querySelector(
          '[data-cart-drawer]'
        );

      const overlay =
        document.querySelector(
          '[data-cart-drawer-overlay]'
        );


      if (drawer) {

        drawer
          .classList
          .remove('is-active');

        drawer.setAttribute(
          'aria-hidden',
          'true'
        );

      }


      if (overlay) {

        overlay
          .classList
          .remove('is-active');

      }


      document.body
        .classList
        .remove(
          'cart-drawer-open'
        );

    }
  );

})();