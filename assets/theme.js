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

      /* DESCENTE */
      if (
        scrollingDown &&
        rect.top < viewportHeight * 0.82 &&
        rect.bottom > viewportHeight * 0.07
      ) {
        quote.classList.add('is-visible');
        quote.classList.remove('is-hidden-up');
      }

      /* REMONTÉE */
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

        /* PRÉPARE LE NOUVEAU */

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

        void newSlide.offsetWidth;

        /* FAIT SORTIR L'ANCIEN */

        oldSlide.classList.add(
          direction === 'next'
            ? 'leave-left'
            : 'leave-right',
          'product-leaving'
        );

        /* FAIT ENTRER LE NOUVEAU */

        requestAnimationFrame(() => {

          requestAnimationFrame(() => {

            newSlide.classList.remove(
              'enter-left',
              'enter-right',
              'product-entering'
            );

          });

        });

        /* FIN DE TRANSITION */

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


      /* =====================================================
         ÉTAT INITIAL
      ===================================================== */

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


      /* =====================================================
         ENTRÉE TEXTE — PREMIÈRE SLIDE
      ===================================================== */

      const firstSlide = slides[0];

      firstSlide.classList.add(
        'is-active'
      );


      window.requestAnimationFrame(() => {

        window.requestAnimationFrame(() => {

          window.setTimeout(() => {

            firstSlide.classList.add(
              'is-text-visible'
            );

          }, 120);

        });

      });


      /* =====================================================
         PAGINATION INITIALE
      ===================================================== */

      dots.forEach((dot, index) => {

        dot.classList.toggle(
          'is-active',
          index === 0
        );

      });


      /* =====================================================
         PAGINATION — IMMÉDIATE
      ===================================================== */

      function updatePagination(index) {

        dots.forEach((dot, dotIndex) => {

          dot.classList.toggle(
            'is-active',
            dotIndex === index
          );

        });

      }


      /* =====================================================
         AUTOPLAY
      ===================================================== */

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


      /* =====================================================
         CHANGEMENT DE SLIDE
      ===================================================== */

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

        updatePagination(
          newIndex
        );

        oldSlide.classList.remove(
          'is-text-visible'
        );

        newSlide.classList.remove(
          'is-active',
          'is-entering',
          'is-from-right',
          'is-from-left',
          'is-moving',
          'is-text-visible'
        );

        newSlide.classList.add(
          'is-entering',
          direction === 'next'
            ? 'is-from-right'
            : 'is-from-left'
        );

        void newSlide.offsetWidth;

        newSlide.classList.add(
          'is-moving'
        );

        window.requestAnimationFrame(() => {

          window.requestAnimationFrame(() => {

            newSlide.classList.remove(
              'is-from-right',
              'is-from-left'
            );

          });

        });


        /* =================================================
           FIN DE TRANSITION IMAGE
        ================================================= */

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

          window.setTimeout(() => {

            newSlide.classList.add(
              'is-text-visible'
            );

            isAnimating = false;

          }, 100);

        }, slideDuration);

      }


      /* =====================================================
         CLIC SUR 01 / 02 / 03...
      ===================================================== */

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

            updatePagination(
              index
            );

            goToSlide(
              index,
              direction
            );

            startAutoplay();

          }
        );

      });


      /* =====================================================
         HERO VÊTEMENTS — PARALLAX
      ===================================================== */

      function updateClothingParallax() {

        const scrollY = window.scrollY;

        const heroTop =
          hero.getBoundingClientRect().top + scrollY;

        const heroHeight =
          hero.offsetHeight;

        const localScroll =
          Math.max(
            0,
            Math.min(
              scrollY - heroTop,
              heroHeight
            )
          );

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


      updateClothingParallax();


      /* =====================================================
         START
      ===================================================== */

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
   POUR — QUICK VIEW
========================================================= */

(function () {

  const modal =
    document.querySelector(
      '[data-pour-quickview]'
    );

  const overlay =
    document.querySelector(
      '[data-pour-quickview-overlay]'
    );

  const content =
    document.querySelector(
      '[data-pour-quickview-content]'
    );


  if (!modal || !overlay || !content) {
    return;
  }


  function money(cents) {

    return new Intl.NumberFormat(
      'fr-FR',
      {
        style: 'currency',
        currency: 'EUR'
      }
    ).format(
      cents / 100
    );

  }


  function escapeHTML(value) {

    const element =
      document.createElement('div');

    element.textContent =
      value == null
        ? ''
        : String(value);

    return element.innerHTML;

  }


  function openModal() {

  modal.classList.add(
    'is-active'
  );

  overlay.classList.add(
    'is-active'
  );

  modal.setAttribute(
    'aria-hidden',
    'false'
  );

}

function closeModal() {

  modal.classList.remove(
    'is-active'
  );

  overlay.classList.remove(
    'is-active'
  );

  modal.setAttribute(
    'aria-hidden',
    'true'
  );

}





 function buildVariants(product) {

  const variants =
    product.variants || [];


  if (
    variants.length === 1 &&
    variants[0].title === 'Default Title'
  ) {

    return `
      <input
        type="hidden"
        name="id"
        value="${variants[0].id}"
        data-quickview-variant-id
      >
    `;

  }


  const firstAvailable =
    variants.find(
      variant => variant.available
    ) || variants[0];


  const parsedVariants =
    variants.map(variant => {

      const parts =
        variant.title
          .split(' / ')
          .map(value => value.trim());

      return {
        variant,
        color: parts[0] || '',
        size: parts[1] || ''
      };

    });


  const colors =
    [
      ...new Set(
        parsedVariants
          .map(item => item.color)
          .filter(Boolean)
      )
    ];


  const sizes =
    [
      ...new Set(
        parsedVariants
          .map(item => item.size)
          .filter(Boolean)
      )
    ];


  const firstParsed =
    parsedVariants.find(
      item =>
        item.variant.id ===
        firstAvailable.id
    ) || parsedVariants[0];


  return `

    <input
      type="hidden"
      name="id"
      value="${firstAvailable.id}"
      data-quickview-variant-id
    >


    <div class="pour-quickview__options">

      <p class="pour-quickview__option-label">
        COULEUR
      </p>

      <div class="pour-quickview__variants">

        ${colors.map(color => `

          <label class="pour-quickview__variant">

            <input
              type="radio"
              name="quickview-color"
              value="${escapeHTML(color)}"
              data-quickview-color
              ${color === firstParsed.color ? 'checked' : ''}
            >

            <span>
              ${escapeHTML(color)}
            </span>

          </label>

        `).join('')}

      </div>

    </div>


    <div class="pour-quickview__options">

      <p class="pour-quickview__option-label">
        TAILLE
      </p>

      <div class="pour-quickview__variants">

        ${sizes.map(size => `

          <label class="pour-quickview__variant">

            <input
              type="radio"
              name="quickview-size"
              value="${escapeHTML(size)}"
              data-quickview-size
              ${size === firstParsed.size ? 'checked' : ''}
            >

            <span>
              ${escapeHTML(size)}
            </span>

          </label>

        `).join('')}

      </div>

    </div>

  `;

}


  async function loadProduct(handle) {

    content.innerHTML = `

      <div class="pour-quickview__loading">
        CHARGEMENT
      </div>

    `;


    openModal();


    try {

      const response =
        await fetch(
          `/products/${handle}.js`,
          {
            headers: {
              Accept:
                'application/json'
            }
          }
        );


      if (!response.ok) {
        throw new Error(
          'Produit introuvable'
        );
      }


      const product =
        await response.json();


      const image =
        product.featured_image ||
        product.images?.[0] ||
        '';


      content.innerHTML = `

        <div class="pour-quickview__media">

          ${
            image
              ? `
                <img
                  src="${escapeHTML(image)}"
                  class="pour-quickview__image"
                  alt="${escapeHTML(product.title)}"
                >
              `
              : ''
          }

        </div>


        <div class="pour-quickview__info">

          <h2 class="pour-quickview__title">
            ${escapeHTML(product.title)}
          </h2>


          <p class="pour-quickview__price">
            ${money(product.price)}
          </p>


          <form
            action="/cart/add"
            method="post"
            class="pour-quickview__form"
          >

            ${buildVariants(product)}


            <input
              type="hidden"
              name="quantity"
              value="1"
            >


           <button
  type="submit"
  class="pour-quickview__submit"

  style="
    transition:
      background .25s ease,
      color .25s ease,
      border-color .25s ease;
  "

  onmouseenter="
    this.style.background='#ffffff';
    this.style.color='#111111';
    this.style.borderColor='#111111';
  "

  onmouseleave="
    this.style.background='#111111';
    this.style.color='#ffffff';
    this.style.borderColor='#111111';
  "
>
  PRÉCOMMANDEZ
</button>

          </form>


          <a
            href="${escapeHTML(product.url)}"
            class="pour-quickview__details"
          >
            VOIR LE PRODUIT
          </a>

        </div>
      `;

const quickViewForm =
  content.querySelector(
    '.pour-quickview__form'
  );


if (quickViewForm) {

  const variantInput =
    quickViewForm.querySelector(
      '[data-quickview-variant-id]'
    );

  const submitButton =
    quickViewForm.querySelector(
      '.pour-quickview__submit'
    );


  function updateQuickViewVariant() {

    const colorInput =
      quickViewForm.querySelector(
        '[data-quickview-color]:checked'
      );

    const sizeInput =
      quickViewForm.querySelector(
        '[data-quickview-size]:checked'
      );


    const selectedColor =
      colorInput
        ? colorInput.value
        : null;

    const selectedSize =
      sizeInput
        ? sizeInput.value
        : null;


    const matchingVariant =
      product.variants.find(
        variant => {

          const parts =
            variant.title
              .split(' / ')
              .map(value => value.trim());


          const variantColor =
            parts[0] || null;

          const variantSize =
            parts[1] || null;


          return (
            variantColor === selectedColor &&
            variantSize === selectedSize
          );

        }
      );


    if (!matchingVariant) {

      submitButton.disabled = true;

      submitButton.textContent =
        'INDISPONIBLE';

      return;
    }


    variantInput.value =
      matchingVariant.id;


    submitButton.disabled =
      !matchingVariant.available;


    submitButton.textContent =
      matchingVariant.available
        ? 'PRÉCOMMANDEZ'
        : 'ÉPUISÉ';

  }


  quickViewForm.addEventListener(
    'change',
    function (event) {

      if (
        event.target.matches(
          '[data-quickview-color]'
        ) ||
        event.target.matches(
          '[data-quickview-size]'
        )
      ) {

        updateQuickViewVariant();

      }

    }
  );


  updateQuickViewVariant();

}
    } catch (error) {

      console.error(
        'POUR Quick View:',
        error
      );


      content.innerHTML = `

        <div class="pour-quickview__loading">
          PRODUIT INDISPONIBLE
        </div>

      `;

    }

  }


  document.addEventListener(
    'click',
    function (event) {

      const quickButton =
        event.target.closest(
          '[data-quick-add]'
        );


      if (quickButton) {

        event.preventDefault();
        event.stopPropagation();


        const handle =
          quickButton.dataset.productHandle;


        if (handle) {

          loadProduct(handle);

        }

        return;

      }


      if (
        event.target.closest(
          '[data-pour-quickview-close]'
        )
      ) {

        closeModal();

        return;

      }


      if (
        event.target === overlay
      ) {

        closeModal();

      }

    }
  );


    /* =========================================================
     QUICK VIEW — FERMETURE APRÈS AJOUT AU PANIER
  ========================================================= */

  document.addEventListener(
    'submit',
    function (event) {

      const form =
        event.target.closest(
          '.pour-quickview__form'
        );

      if (!form) {
        return;
      }

      /*
       * On laisse le système panier existant
       * gérer l'ajout AJAX + l'ouverture du drawer.
       *
       * Ici, on s'occupe UNIQUEMENT
       * de fermer la Quick View.
       */

      closeModal();

    },
    true
  );



})();

/* ========================================================
   FORMULAIRES CLUB POUR — GESTION CAPTCHA / RETOUR
======================================================== */

const formStateKey = 'clubPrivilegesSubmittedForm';
const emailStateKey = 'clubPrivilegesSubmittedEmail';


/*
   FORMULAIRES CONCERNÉS
*/

const customerForms = document.querySelectorAll(
  '#club-hero-form, #club-final-form'
);


customerForms.forEach((form) => {

  const formName =
    form.id === 'club-hero-form'
      ? 'hero'
      : 'final';


  form.addEventListener('submit', () => {

    const emailInput =
      form.querySelector(
        'input[name="contact[email]"]'
      );


    /*
       On mémorise le formulaire utilisé
       avant que Shopify affiche le CAPTCHA.
    */

    sessionStorage.setItem(
      formStateKey,
      formName
    );


    /*
       On mémorise l'adresse email.
    */

    if (
      emailInput &&
      emailInput.value
    ) {

      sessionStorage.setItem(
        emailStateKey,
        emailInput.value
      );

    }

  });

});


/*
   PARAMÈTRES DE RETOUR SHOPIFY
*/

const params =
  new URLSearchParams(
    window.location.search
  );


const submittedForm =
  sessionStorage.getItem(
    formStateKey
  );


const submittedEmail =
  sessionStorage.getItem(
    emailStateKey
  );


/*
   APRÈS LE RETOUR SHOPIFY / CAPTCHA
*/

if (submittedForm) {

  const form =
    document.querySelector(
      `#club-${submittedForm}-form`
    );


  if (form) {

    const fields =
      form.querySelector(
        '[data-club-form-fields]'
      );


    const success =
  document.querySelector(
    `[data-club-success="${submittedForm}"]`
  );

    const error =
      form.querySelector(
        '[data-club-form-error]'
      );


    const already =
      form.querySelector(
        '[data-club-already]'
      );


    const emailInput =
      form.querySelector(
        'input[name="contact[email]"]'
      );


    /*
       RESTAURATION DE L'EMAIL
    */

    if (
      emailInput &&
      !emailInput.value &&
      submittedEmail
    ) {

      emailInput.value =
        submittedEmail;

    }


    /*
       DÉTECTION — EMAIL DÉJÀ INSCRIT
    */

    const hasEmailError =
      error &&
      error.textContent
        .toLowerCase()
        .includes('déjà inscrit');


    /*
       CAS 1 — EMAIL DÉJÀ INSCRIT
    */

    if (hasEmailError) {

      if (fields) {
        fields.hidden = false;
      }


      if (error) {
        error.hidden = true;
      }


      if (already) {
        already.hidden = false;
      }


      if (success) {
        success.hidden = true;
      }

    }


    /*
       CAS 2 — INSCRIPTION VALIDÉE
    */

    else if (
      params.get('customer_posted') === 'true'
    ) {

      /*
         On masque uniquement les champs
         du formulaire concerné.
      */

      if (fields) {
        fields.hidden = true;
      }


      /*
         On affiche le message de succès.
      */

      if (success) {

        success.hidden = false;

        success.style.display = '';

      }


      /*
         On masque les autres messages.
      */

      if (already) {
        already.hidden = true;
      }


      if (error) {
        error.hidden = true;
      }

    }

  }


  /*
     On nettoie après traitement.
  */

  sessionStorage.removeItem(
    formStateKey
  );

  sessionStorage.removeItem(
    emailStateKey
  );

}
