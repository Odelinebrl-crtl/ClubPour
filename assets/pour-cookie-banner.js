(function () {
  'use strict';

  const banner = document.getElementById('PourCookieBanner');

  if (!banner) {
    console.error('POUR COOKIE: bannière introuvable.');
    return;
  }

  const preferencesPanel = banner.querySelector(
    '[data-pour-cookie-preferences-panel]'
  );

  const acceptButton = banner.querySelector(
    '[data-pour-cookie-accept]'
  );

  const preferencesButton = banner.querySelector(
    '[data-pour-cookie-preferences]'
  );

  const refuseButton = banner.querySelector(
    '[data-pour-cookie-refuse]'
  );

  const closePreferencesButton = banner.querySelector(
    '[data-pour-cookie-preferences-close]'
  );

  const savePreferencesButton = banner.querySelector(
    '[data-pour-cookie-save]'
  );

  const preferencesInput = banner.querySelector(
    '[data-pour-cookie-preference="preferences"]'
  );

  const analyticsInput = banner.querySelector(
    '[data-pour-cookie-preference="analytics"]'
  );

  const marketingInput = banner.querySelector(
    '[data-pour-cookie-preference="marketing"]'
  );


  /* =========================================================
     AFFICHER LA BANNIÈRE
  ========================================================= */

  function showBanner() {
    banner.hidden = false;

    banner.setAttribute(
      'aria-hidden',
      'false'
    );

    document.documentElement.classList.add(
      'pour-cookie-open'
    );
  }


  /* =========================================================
     CACHER LA BANNIÈRE
  ========================================================= */

  function hideBanner() {
    banner.hidden = true;

    banner.setAttribute(
      'aria-hidden',
      'true'
    );

    document.documentElement.classList.remove(
      'pour-cookie-open'
    );

    hidePreferences();
  }


  /* =========================================================
     AFFICHER LES PRÉFÉRENCES
  ========================================================= */

  function showPreferences() {
    if (!preferencesPanel) return;

    preferencesPanel.hidden = false;

    preferencesPanel.setAttribute(
      'aria-hidden',
      'false'
    );
  }


  /* =========================================================
     CACHER LES PRÉFÉRENCES
  ========================================================= */

  function hidePreferences() {
    if (!preferencesPanel) return;

    preferencesPanel.hidden = true;

    preferencesPanel.setAttribute(
      'aria-hidden',
      'true'
    );
  }


  /* =========================================================
     ACCEPTATION TOTALE
  ========================================================= */

  function acceptAll() {

    const privacy =
      window.Shopify &&
      window.Shopify.customerPrivacy;

    if (!privacy) {
      console.error(
        'POUR COOKIE: Customer Privacy API indisponible.'
      );
      return;
    }

    privacy.setTrackingConsent(
      {
        analytics: true,
        marketing: true,
        preferences: true
      },
      function () {
        hideBanner();
      }
    );
  }


  /* =========================================================
     REFUS TOTAL
  ========================================================= */

  function refuseAll() {

    const privacy =
      window.Shopify &&
      window.Shopify.customerPrivacy;

    if (!privacy) {
      console.error(
        'POUR COOKIE: Customer Privacy API indisponible.'
      );
      return;
    }

    privacy.setTrackingConsent(
      {
        analytics: false,
        marketing: false,
        preferences: false
      },
      function () {
        hideBanner();
      }
    );
  }


  /* =========================================================
     ENREGISTRER LES PRÉFÉRENCES
  ========================================================= */

  function savePreferences() {

    const privacy =
      window.Shopify &&
      window.Shopify.customerPrivacy;

    if (!privacy) {
      console.error(
        'POUR COOKIE: Customer Privacy API indisponible.'
      );
      return;
    }

    const analytics =
      analyticsInput
        ? analyticsInput.checked
        : false;

    const marketing =
      marketingInput
        ? marketingInput.checked
        : false;

    const preferences =
      preferencesInput
        ? preferencesInput.checked
        : false;

    privacy.setTrackingConsent(
      {
        analytics: analytics,
        marketing: marketing,
        preferences: preferences
      },
      function () {
        hideBanner();
      }
    );
  }


  /* =========================================================
     ÉVÉNEMENTS
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


  /* =========================================================
     INITIALISATION SHOPIFY
  ========================================================= */

  function initializePrivacyAPI() {

    if (
      window.Shopify &&
      window.Shopify.customerPrivacy
    ) {
      initializeBanner();
      return;
    }

    if (
      window.Shopify &&
      typeof window.Shopify.loadFeatures === 'function'
    ) {

      window.Shopify.loadFeatures(
        [
          {
            name: 'consent-tracking-api',
            version: '0.1'
          }
        ],
        function (error) {

          if (error) {
            console.error(
              'POUR COOKIE: impossible de charger la Customer Privacy API.',
              error
            );
            return;
          }

          initializeBanner();
        }
      );

      return;
    }

    console.error(
      'POUR COOKIE: Shopify.loadFeatures indisponible.'
    );
  }


  /* =========================================================
     INITIALISATION DE LA BANNIÈRE
  ========================================================= */

  function initializeBanner() {

    const privacy =
      window.Shopify &&
      window.Shopify.customerPrivacy;

    if (!privacy) {
      console.error(
        'POUR COOKIE: Customer Privacy API indisponible.'
      );
      return;
    }

    try {

      const consent =
        privacy.currentVisitorConsent();

      console.log(
        'POUR COOKIE — consentement actuel:',
        consent
      );


      /*
       * Si les trois catégories sont encore vides,
       * aucune décision n'a été prise.
       */

      const noDecision =
        !consent ||
        (
          consent.analytics === '' &&
          consent.marketing === '' &&
          consent.preferences === ''
        );


      if (noDecision) {
        showBanner();
        return;
      }


      /*
       * Une décision existe déjà :
       * on laisse la bannière masquée.
       */

      hideBanner();

    } catch (error) {

      console.error(
        'POUR COOKIE: erreur lors de l’initialisation.',
        error
      );

    }
  }


  /* =========================================================
     LANCEMENT
  ========================================================= */

  initializePrivacyAPI();

})();
