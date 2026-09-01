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
       AFFICHER LA BANNIÈRE
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
       OUVRIR LES PRÉFÉRENCES
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


    /* =========================================================
       FERMER LES PRÉFÉRENCES
    ========================================================= */

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
       ACCEPTATION TOTALE
    ========================================================= */

    function acceptAll() {

      const privacy =
        window.Shopify &&
        window.Shopify.customerPrivacy;

      if (!privacy) {

        console.error(
          'POUR COOKIE : Customer Privacy API indisponible.'
        );

        return;
      }

      privacy.setTrackingConsent(
        {
          analytics: true,
          marketing: true,
          preferences: true
        },
        function (result) {

          if (result && result.error) {

            console.error(
              'POUR COOKIE : erreur lors de l’acceptation.',
              result.error
            );

            return;
          }

          hideBanner();
        }
      );
    }


    /* =========================================================
       REFUSER
    ========================================================= */

    function refuseAll() {

      const privacy =
        window.Shopify &&
        window.Shopify.customerPrivacy;

      if (!privacy) {

        console.error(
          'POUR COOKIE : Customer Privacy API indisponible.'
        );

        return;
      }

      privacy.setTrackingConsent(
        {
          analytics: false,
          marketing: false,
          preferences: false
        },
        function (result) {

          if (result && result.error) {

            console.error(
              'POUR COOKIE : erreur lors du refus.',
              result.error
            );

            return;
          }

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
          'POUR COOKIE : Customer Privacy API indisponible.'
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

          if (result && result.error) {

            console.error(
              'POUR COOKIE : erreur lors de l’enregistrement.',
              result.error
            );

            return;
          }

          hideBanner();
        }
      );
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


    /* =========================================================
       CHARGEMENT DE L'API SHOPIFY
    ========================================================= */

    function startPrivacyAPI() {

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
              'POUR COOKIE : impossible de charger la Customer Privacy API.',
              error
            );

            return;
          }


          checkConsent();
        }
      );
    }


    /* =========================================================
       VÉRIFICATION DU CONSENTEMENT
    ========================================================= */

    function checkConsent() {

      const privacy =
        window.Shopify &&
        window.Shopify.customerPrivacy;

      if (!privacy) {

        console.error(
          'POUR COOKIE : Customer Privacy API indisponible.'
        );

        return;
      }


      try {

        const consent =
          privacy.currentVisitorConsent();

        console.log(
          'POUR COOKIE — consentement actuel :',
          consent
        );


        /*
         * Shopify renvoie une chaîne vide lorsqu'aucune
         * décision n'a encore été enregistrée.
         */

        const noDecision =
          !consent ||
          (
            (consent.analytics === '' ||
             typeof consent.analytics === 'undefined') &&

            (consent.marketing === '' ||
             typeof consent.marketing === 'undefined') &&

            (consent.preferences === '' ||
             typeof consent.preferences === 'undefined')
          );


        if (noDecision) {

          showBanner();

        } else {

          hideBanner();

        }

      } catch (error) {

        console.error(
          'POUR COOKIE : erreur pendant la vérification du consentement.',
          error
        );
      }
    }


    /* =========================================================
       LANCEMENT
    ========================================================= */

    startPrivacyAPI();
  }


  /* =========================================================
     DOM READY
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
