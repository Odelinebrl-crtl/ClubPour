(function () {
  'use strict';

  function initPourCookieBanner() {
    const banner = document.getElementById('PourCookieBanner');

    if (!banner) {
      console.error('POUR COOKIE : #PourCookieBanner introuvable dans la page.');
      return;
    }

    console.log('POUR COOKIE : bannière trouvée.');

    /* =========================================================
       AFFICHAGE FORCÉ POUR TEST
    ========================================================= */

    banner.hidden = false;
    banner.removeAttribute('hidden');
    banner.setAttribute('aria-hidden', 'false');

    document.documentElement.classList.add('pour-cookie-open');

    console.log('POUR COOKIE : bannière affichée.');

    /* =========================================================
       ÉLÉMENTS
    ========================================================= */

    const acceptButton = banner.querySelector(
      '[data-pour-cookie-accept]'
    );

    const refuseButton = banner.querySelector(
      '[data-pour-cookie-refuse]'
    );

    const preferencesButton = banner.querySelector(
      '[data-pour-cookie-preferences]'
    );

    const preferencesPanel = banner.querySelector(
      '[data-pour-cookie-preferences-panel]'
    );

    const closePreferencesButton = banner.querySelector(
      '[data-pour-cookie-preferences-close]'
    );

    const savePreferencesButton = banner.querySelector(
      '[data-pour-cookie-save]'
    );


    /* =========================================================
       FERMER
    ========================================================= */

    function hideBanner() {
      banner.hidden = true;
      banner.setAttribute('aria-hidden', 'true');

      document.documentElement.classList.remove(
        'pour-cookie-open'
      );
    }


    /* =========================================================
       PRÉFÉRENCES
    ========================================================= */

    function showPreferences() {
      if (!preferencesPanel) return;

      preferencesPanel.hidden = false;
      preferencesPanel.setAttribute(
        'aria-hidden',
        'false'
      );
    }


    function hidePreferences() {
      if (!preferencesPanel) return;

      preferencesPanel.hidden = true;
      preferencesPanel.setAttribute(
        'aria-hidden',
        'true'
      );
    }


    /* =========================================================
       ACCEPTER
    ========================================================= */

    function acceptAll() {

      if (
        window.Shopify &&
        window.Shopify.customerPrivacy &&
        typeof window.Shopify.customerPrivacy.setTrackingConsent === 'function'
      ) {

        window.Shopify.customerPrivacy.setTrackingConsent(
          {
            analytics: true,
            marketing: true,
            preferences: true
          },
          function () {
            hideBanner();
          }
        );

      } else {

        /* Pour que le bouton fonctionne même
           si l'API Shopify n'est pas disponible */

        hideBanner();
      }
    }


    /* =========================================================
       REFUSER
    ========================================================= */

    function refuseAll() {

      if (
        window.Shopify &&
        window.Shopify.customerPrivacy &&
        typeof window.Shopify.customerPrivacy.setTrackingConsent === 'function'
      ) {

        window.Shopify.customerPrivacy.setTrackingConsent(
          {
            analytics: false,
            marketing: false,
            preferences: false
          },
          function () {
            hideBanner();
          }
        );

      } else {

        hideBanner();
      }
    }


    /* =========================================================
       ENREGISTRER LES PRÉFÉRENCES
    ========================================================= */

    function savePreferences() {

      const preferencesInput = banner.querySelector(
        '[data-pour-cookie-preference="preferences"]'
      );

      const analyticsInput = banner.querySelector(
        '[data-pour-cookie-preference="analytics"]'
      );

      const marketingInput = banner.querySelector(
        '[data-pour-cookie-preference="marketing"]'
      );

      const consent = {
        preferences: preferencesInput
          ? preferencesInput.checked
          : false,

        analytics: analyticsInput
          ? analyticsInput.checked
          : false,

        marketing: marketingInput
          ? marketingInput.checked
          : false
      };


      if (
        window.Shopify &&
        window.Shopify.customerPrivacy &&
        typeof window.Shopify.customerPrivacy.setTrackingConsent === 'function'
      ) {

        window.Shopify.customerPrivacy.setTrackingConsent(
          consent,
          function () {
            hideBanner();
          }
        );

      } else {

        hideBanner();
      }
    }


    /* =========================================================
       BOUTONS
    ========================================================= */

    if (acceptButton) {
      acceptButton.addEventListener(
        'click',
        acceptAll
      );
    }

    if (refuseButton) {
      refuseButton.addEventListener(
        'click',
        refuseAll
      );
    }

    if (preferencesButton) {
      preferencesButton.addEventListener(
        'click',
        showPreferences
      );
    }

    if (closePreferencesButton) {
      closePreferencesButton.addEventListener(
        'click',
        hidePreferences
      );
    }

    if (savePreferencesButton) {
      savePreferencesButton.addEventListener(
        'click',
        savePreferences
      );
    }
  }


  /* =========================================================
     LANCEMENT
  ========================================================= */

  if (document.readyState === 'loading') {

    document.addEventListener(
      'DOMContentLoaded',
      initPourCookieBanner
    );

  } else {

    initPourCookieBanner();

  }

})();
