(function () {
  'use strict';

  function initPourCookieBanner() {

    const banner = document.getElementById('PourCookieBanner');

    if (!banner) {
      console.error('POUR COOKIE : bannière introuvable.');
      return;
    }

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

      if (!preferencesPanel) return;

      preferencesPanel.hidden = false;
      preferencesPanel.removeAttribute('hidden');

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
       ATTENDRE LA CONFIRMATION SHOPIFY
    ========================================================= */

    document.addEventListener(
      'visitorConsentCollected',
      function () {

        console.log(
          'POUR COOKIE : consentement Shopify enregistré.'
        );

        hideBanner();
      }
    );


    /* =========================================================
       ENREGISTRER LE CONSENTEMENT
    ========================================================= */

    function setConsent(consent) {

      const privacy =
        window.Shopify &&
        window.Shopify.customerPrivacy;

      if (!privacy) {

        console.error(
          'POUR COOKIE : Customer Privacy API indisponible.'
        );

        return;
      }

      if (
        typeof privacy.setTrackingConsent !== 'function'
      ) {

        console.error(
          'POUR COOKIE : setTrackingConsent indisponible.'
        );

        return;
      }

      console.log(
        'POUR COOKIE : enregistrement du consentement',
        consent
      );


      try {

        privacy.setTrackingConsent(
          consent,
          function (result) {

            console.log(
              'POUR COOKIE : réponse Shopify',
              result
            );

            /*
             * Shopify renvoie normalement un objet vide
             * lorsque l'enregistrement fonctionne.
             */

            if (
              result &&
              result.error
            ) {

              console.error(
                'POUR COOKIE : Shopify a retourné une erreur.',
                result.error
              );

              return;
            }

            hideBanner();
          }
        );

      } catch (error) {

        console.error(
          'POUR COOKIE : erreur setTrackingConsent.',
          error
        );
      }
    }


    /* =========================================================
       ACCEPTER
    ========================================================= */

    function acceptAll(event) {

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      setConsent({
        analytics: true,
        marketing: true,
        preferences: true
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

      setConsent({
        analytics: false,
        marketing: false,
        preferences: false
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

      setConsent({

        preferences:
          preferencesInput
            ? preferencesInput.checked
            : false,

        analytics:
          analyticsInput
            ? analyticsInput.checked
            : false,

        marketing:
          marketingInput
            ? marketingInput.checked
            : false

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

          showPreferences();
        }
      );
    }


    if (closePreferencesButton) {

      closePreferencesButton.addEventListener(
        'click',
        function (event) {

          event.preventDefault();

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
       CHARGEMENT API SHOPIFY
    ========================================================= */

    function loadPrivacyAPI() {

      if (
        window.Shopify &&
        window.Shopify.customerPrivacy
      ) {

        checkConsent();

        return;
      }


      if (
        !window.Shopify ||
        typeof window.Shopify.loadFeatures !== 'function'
      ) {

        console.error(
          'POUR COOKIE : Shopify.loadFeatures indisponible.'
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
              'POUR COOKIE : erreur chargement API.',
              error
            );

            return;
          }

          console.log(
            'POUR COOKIE : Customer Privacy API chargée.'
          );

          checkConsent();
        }
      );
    }


    /* =========================================================
       VÉRIFIER LE CONSENTEMENT
    ========================================================= */

    function checkConsent() {

      const privacy =
        window.Shopify &&
        window.Shopify.customerPrivacy;

      if (!privacy) return;


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
          'POUR COOKIE : erreur lecture consentement.',
          error
        );
      }
    }


    /* =========================================================
       DÉMARRAGE
    ========================================================= */

    loadPrivacyAPI();
  }


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
