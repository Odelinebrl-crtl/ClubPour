/* =========================================================
   POUR — COOKIE BANNER
   Shopify Customer Privacy API
========================================================= */

(function () {
  'use strict';

  const banner = document.getElementById('PourCookieBanner');

  if (!banner) return;

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

  const preferenceInputs = {
    preferences: banner.querySelector(
      '[data-pour-cookie-preference="preferences"]'
    ),

    analytics: banner.querySelector(
      '[data-pour-cookie-preference="analytics"]'
    ),

    marketing: banner.querySelector(
      '[data-pour-cookie-preference="marketing"]'
    )
  };


  /* =======================================================
     CHARGEMENT DE L'API SHOPIFY
  ======================================================= */

  function loadCustomerPrivacyAPI(callback) {

    if (
      window.Shopify &&
      window.Shopify.customerPrivacy
    ) {
      callback();
      return;
    }

    if (
      !window.Shopify ||
      typeof window.Shopify.loadFeatures !== 'function'
    ) {
      console.error(
        'POUR Cookie Banner: Customer Privacy API unavailable.'
      );

      return;
    }

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
            'POUR Cookie Banner: unable to load Customer Privacy API.',
            error
          );

          return;
        }

        callback();
      }
    );
  }


  /* =======================================================
     AFFICHER / CACHER
  ======================================================= */

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


  /* =======================================================
     PRÉFÉRENCES
  ======================================================= */

  function showPreferences() {

    preferencesPanel.hidden = false;

    preferencesPanel.setAttribute(
      'aria-hidden',
      'false'
    );
  }

  function hidePreferences() {

    preferencesPanel.hidden = true;

    preferencesPanel.setAttribute(
      'aria-hidden',
      'true'
    );
  }


  /* =======================================================
     CONSENTEMENT TOTAL
  ======================================================= */

  function acceptAll() {

    if (
      !window.Shopify ||
      !window.Shopify.customerPrivacy
    ) {
      return;
    }

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
  }


  /* =======================================================
     REFUS TOTAL
  ======================================================= */

  function refuseAll() {

    if (
      !window.Shopify ||
      !window.Shopify.customerPrivacy
    ) {
      return;
    }

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
  }


  /* =======================================================
     PRÉFÉRENCES PERSONNALISÉES
  ======================================================= */

  function savePreferences() {

    if (
      !window.Shopify ||
      !window.Shopify.customerPrivacy
    ) {
      return;
    }

    const preferences =
      preferenceInputs.preferences
        ? preferenceInputs.preferences.checked
        : false;

    const analytics =
      preferenceInputs.analytics
        ? preferenceInputs.analytics.checked
        : false;

    const marketing =
      preferenceInputs.marketing
        ? preferenceInputs.marketing.checked
        : false;


    window.Shopify.customerPrivacy.setTrackingConsent(
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


  /* =======================================================
     ÉVÉNEMENTS
  ======================================================= */

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


  /* =======================================================
     INITIALISATION
  ======================================================= */

 loadCustomerPrivacyAPI(function () {

  try {

    console.log(
      'POUR — Customer Privacy API:',
      window.Shopify.customerPrivacy
    );

    const consent =
      window.Shopify.customerPrivacy.currentVisitorConsent();

    console.log(
      'POUR — Consentement actuel:',
      consent
    );

    /*
     * Affichage uniquement si aucun choix
     * n'a encore été enregistré.
     */
    const hasConsent =
      consent.analytics !== '' ||
      consent.marketing !== '' ||
      consent.preferences !== '';

    if (!hasConsent) {
      showBanner();
    }

  } catch (error) {

    console.error(
      'POUR Cookie Banner:',
      error
    );

  }

});
