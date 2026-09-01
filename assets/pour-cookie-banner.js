(function () {
  'use strict';

  function initPourCookieBanner() {

    const banner = document.getElementById('PourCookieBanner');

    if (!banner) {
      console.error('POUR COOKIE : bannière introuvable.');
      return;
    }

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
       AFFICHER
    ========================================================= */

    function showBanner() {

      banner.hidden = false;
      banner.removeAttribute('hidden');

      banner.setAttribute(
        'aria-hidden',
        'false'
      );

      document.documentElement.classList.add(
        'pour-cookie-open'
      );
    }


    /* =========================================================
       CACHER
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
       PRÉFÉRENCES
    ========================================================= */

    function showPreferences() {

      if (!preferencesPanel) {
        return;
      }

      preferencesPanel.hidden = false;
      preferencesPanel.removeAttribute('hidden');

      preferencesPanel.setAttribute(
        'aria-hidden',
        'false'
      );
    }


    function hidePreferences() {

      if (!preferencesPanel) {
        return;
      }

      preferencesPanel.hidden = true;

      preferencesPanel.setAttribute(
        'aria-hidden',
        'true'
      );
    }


    /* =========================================================
       RÉCUPÉRER L'API SHOPIFY
    ========================================================= */

    function getPrivacyAPI() {

      if (
        window.Shopify &&
        window.Shopify.customerPrivacy
      ) {
        return window.Shopify.customerPrivacy;
      }

      return null;
    }


    /* =========================================================
       ATTENDRE L'API
    ========================================================= */

    function waitForPrivacyAPI(callback, attempts) {

      attempts = attempts || 0;

      const privacy = getPrivacyAPI();

      if (privacy) {

        callback(privacy);
        return;
      }

      if (attempts >= 50) {

        console.error(
          'POUR COOKIE : Customer Privacy API introuvable.'
        );

        return;
      }

      setTimeout(function () {

        waitForPrivacyAPI(
          callback,
          attempts + 1
        );

      }, 100);
    }


    /* =========================================================
       ACCEPTER
    ========================================================= */

    function acceptAll(event) {

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      console.log(
        'POUR COOKIE : clic ACCEPTER'
      );

      waitForPrivacyAPI(function (privacy) {

        if (
          typeof privacy.setTrackingConsent !== 'function'
        ) {

          console.error(
            'POUR COOKIE : setTrackingConsent indisponible.'
          );

          return;
        }

        privacy.setTrackingConsent(
          true,
          function (result) {

            console.log(
              'POUR COOKIE : acceptation enregistrée',
              result
            );

            hideBanner();
          }
        );

      });
    }


    /* =========================================================
       REFUSER
    ========================================================= */

    function refuseAll(event) {

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      console.log(
        'POUR COOKIE : clic REFUSER'
      );

      waitForPrivacyAPI(function (privacy) {

        if (
          typeof privacy.setTrackingConsent !== 'function'
        ) {

          console.error(
            'POUR COOKIE : setTrackingConsent indisponible.'
          );

          return;
        }

        privacy.setTrackingConsent(
          false,
          function (result) {

            console.log(
              'POUR COOKIE : refus enregistré',
              result
            );

            hideBanner();
          }
        );

      });
    }


    /* =========================================================
       ENREGISTRER LES PRÉFÉRENCES
    ========================================================= */

    function savePreferences(event) {

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      console.log(
        'POUR COOKIE : enregistrement préférences'
      );

      waitForPrivacyAPI(function (privacy) {

        if (
          typeof privacy.setTrackingConsent !== 'function'
        ) {

          console.error(
            'POUR COOKIE : setTrackingConsent indisponible.'
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
          function (result) {

            console.log(
              'POUR COOKIE : préférences enregistrées',
              result
            );

            hideBanner();
          }
        );

      });
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
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          showPreferences();
        }
      );
    }


    if (closePreferencesButton) {

      closePreferencesButton.addEventListener(
        'click',
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          hidePreferences();
        }
      );
    }


    if (savePreferencesButton) {

      savePreferencesButton.addEventListener(
        'click',
        savePreferences
      );
    }


    /* =========================================================
       CHARGEMENT / VÉRIFICATION API
    ========================================================= */

    function checkConsent() {

      waitForPrivacyAPI(function (privacy) {

        if (
          typeof privacy.currentVisitorConsent !== 'function'
        ) {

          console.error(
            'POUR COOKIE : currentVisitorConsent indisponible.'
          );

          return;
        }

        try {

          const consent =
            privacy.currentVisitorConsent();

          console.log(
            'POUR COOKIE : consentement actuel',
            consent
          );


          const noDecision =
            !consent ||
            (
              consent.analytics === '' &&
              consent.marketing === '' &&
              consent.preferences === ''
            );


          if (noDecision) {

            showBanner();

          } else {

            hideBanner();
          }

        } catch (error) {

          console.error(
            'POUR COOKIE : erreur lecture consentement',
            error
          );
        }

      });
    }


    /* =========================================================
       CHARGER L'API SI NÉCESSAIRE
    ========================================================= */

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
              'POUR COOKIE : erreur chargement API',
              error
            );

            return;
          }

          console.log(
            'POUR COOKIE : API Shopify prête'
          );

          checkConsent();
        }
      );

    } else {

      checkConsent();
    }
  }


  /* =========================================================
     DOM READY
  ========================================================= */

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initPourCookieBanner
    );

  } else {

    initPourCookieBanner();
  }

})();
