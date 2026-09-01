(function () {
  'use strict';

  const COOKIE_CONSENT_KEY = 'pour_cookie_consent';

  console.log('POUR COOKIE : JS chargé');


  /* =========================================================
     SHOPIFY CUSTOMER PRIVACY API
  ========================================================= */

  function loadShopifyPrivacyAPI(callback) {

    // L'API est déjà disponible
    if (
      window.Shopify &&
      window.Shopify.customerPrivacy &&
      typeof window.Shopify.customerPrivacy.setTrackingConsent === 'function'
    ) {
      callback(null);
      return;
    }

    // Shopify n'est pas encore disponible
    if (
      !window.Shopify ||
      typeof window.Shopify.loadFeatures !== 'function'
    ) {
      callback(
        new Error('Shopify Customer Privacy API indisponible')
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
          callback(error);
          return;
        }

        if (
          !window.Shopify.customerPrivacy ||
          typeof window.Shopify.customerPrivacy.setTrackingConsent !== 'function'
        ) {
          callback(
            new Error('Customer Privacy API non disponible après chargement')
          );
          return;
        }

        callback(null);
      }
    );
  }


  /* =========================================================
     INITIALISATION
  ========================================================= */

  function initPourCookieBanner() {

    const banner = document.getElementById(
      'PourCookieBanner'
    );

    if (!banner) {

      console.error(
        'POUR COOKIE : #PourCookieBanner introuvable'
      );

      return;
    }


    /* =======================================================
       ELEMENTS
    ======================================================= */

    const acceptButtons = banner.querySelectorAll(
      '[data-pour-cookie-accept]'
    );

    const refuseButtons = banner.querySelectorAll(
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
       AFFICHAGE
    ======================================================= */

    function hideBanner() {

      banner.hidden = true;

      banner.setAttribute(
        'aria-hidden',
        'true'
      );

      banner.style.setProperty(
        'display',
        'none',
        'important'
      );

      document.documentElement.classList.remove(
        'pour-cookie-banner-open'
      );

      document.body.classList.remove(
        'pour-cookie-banner-open'
      );

      console.log(
        'POUR COOKIE : bannière cachée'
      );
    }


    function showBanner() {

      banner.hidden = false;

      banner.setAttribute(
        'aria-hidden',
        'false'
      );

      banner.style.removeProperty(
        'display'
      );

      document.documentElement.classList.add(
        'pour-cookie-banner-open'
      );

      document.body.classList.add(
        'pour-cookie-banner-open'
      );

      console.log(
        'POUR COOKIE : bannière affichée'
      );
    }


    /* =======================================================
       LOCAL STORAGE
    ======================================================= */

    function saveConsent(consent) {

      try {

        localStorage.setItem(
          COOKIE_CONSENT_KEY,
          JSON.stringify(consent)
        );

        console.log(
          'POUR COOKIE : choix mémorisé',
          consent
        );

      } catch (error) {

        console.warn(
          'POUR COOKIE : impossible de mémoriser le choix',
          error
        );

      }
    }


    function getSavedConsent() {

      try {

        const savedConsent =
          localStorage.getItem(
            COOKIE_CONSENT_KEY
          );

        if (!savedConsent) {
          return null;
        }

        return JSON.parse(savedConsent);

      } catch (error) {

        console.warn(
          'POUR COOKIE : impossible de lire le choix',
          error
        );

        return null;
      }
    }


    /* =======================================================
       PREFERENCES
    ======================================================= */

    function openPreferences() {

      if (!preferencesPanel) {
        return;
      }

      preferencesPanel.hidden = false;

      preferencesPanel.setAttribute(
        'aria-hidden',
        'false'
      );

      console.log(
        'POUR COOKIE : préférences ouvertes'
      );
    }


    function closePreferences() {

      if (!preferencesPanel) {
        return;
      }

      preferencesPanel.hidden = true;

      preferencesPanel.setAttribute(
        'aria-hidden',
        'true'
      );

    }


    /* =======================================================
       ENVOI DU CONSENTEMENT À SHOPIFY
    ======================================================= */

    function sendConsentToShopify(consent, callback) {

      loadShopifyPrivacyAPI(function (error) {

        if (error) {

          console.warn(
            'POUR COOKIE : API Shopify indisponible',
            error
          );

          if (typeof callback === 'function') {
            callback(error);
          }

          return;
        }


        const shopifyConsent = {

          analytics:
            !!consent.analytics,

          marketing:
            !!consent.marketing,

          preferences:
            !!consent.preferences

        };


        console.log(
          'POUR COOKIE : envoi à Shopify',
          shopifyConsent
        );


        window.Shopify.customerPrivacy.setTrackingConsent(
          shopifyConsent,
          function (result) {

            console.log(
              'POUR COOKIE : consentement Shopify enregistré',
              result
            );

            if (typeof callback === 'function') {
              callback(null, result);
            }

          }
        );

      });

    }


    /* =======================================================
       ACCEPTATION
    ======================================================= */

    acceptButtons.forEach(function (button) {

      button.addEventListener(
        'click',
        function (event) {

          event.preventDefault();
          event.stopPropagation();


          console.log(
            'POUR COOKIE : ACCEPTER cliqué'
          );


          const consent = {

            necessary: true,

            preferences: true,

            analytics: true,

            marketing: true

          };


          // On mémorise immédiatement le choix
          saveConsent(consent);


          // On transmet le choix à Shopify
          sendConsentToShopify(
            consent,
            function () {

              console.log(
                'POUR COOKIE : acceptation Shopify terminée'
              );

            }
          );


          // On ferme immédiatement la bannière
          hideBanner();

        }
      );

    });


    /* =======================================================
       REFUS
    ======================================================= */

    refuseButtons.forEach(function (button) {

      button.addEventListener(
        'click',
        function (event) {

          event.preventDefault();
          event.stopPropagation();


          console.log(
            'POUR COOKIE : REFUSER cliqué'
          );


          const consent = {

            necessary: true,

            preferences: false,

            analytics: false,

            marketing: false

          };


          // On mémorise immédiatement le choix
          saveConsent(consent);


          // On transmet le refus à Shopify
          sendConsentToShopify(
            consent,
            function () {

              console.log(
                'POUR COOKIE : refus Shopify terminé'
              );

            }
          );


          // On ferme immédiatement la bannière
          hideBanner();

        }
      );

    });


    /* =======================================================
       OUVRIR LES PRÉFÉRENCES
    ======================================================= */

    if (preferencesButton) {

      preferencesButton.addEventListener(
        'click',
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          openPreferences();

        }
      );

    }


    /* =======================================================
       FERMER LES PRÉFÉRENCES
    ======================================================= */

    if (closePreferencesButton) {

      closePreferencesButton.addEventListener(
        'click',
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          closePreferences();

        }
      );

    }


    /* =======================================================
       ENREGISTRER LES PRÉFÉRENCES
    ======================================================= */

    if (savePreferencesButton) {

      savePreferencesButton.addEventListener(
        'click',
        function (event) {

          event.preventDefault();
          event.stopPropagation();


          const consent = {

            necessary: true,

            preferences:
              !!(
                preferenceInputs.preferences &&
                preferenceInputs.preferences.checked
              ),

            analytics:
              !!(
                preferenceInputs.analytics &&
                preferenceInputs.analytics.checked
              ),

            marketing:
              !!(
                preferenceInputs.marketing &&
                preferenceInputs.marketing.checked
              )

          };


          console.log(
            'POUR COOKIE : préférences sélectionnées',
            consent
          );


          // On mémorise le choix
          saveConsent(consent);


          // On transmet les choix à Shopify
          sendConsentToShopify(
            consent,
            function () {

              console.log(
                'POUR COOKIE : préférences Shopify enregistrées'
              );

            }
          );


          // On ferme la bannière
          hideBanner();

          closePreferences();

        }
      );

    }


    /* =======================================================
       RESTAURATION DU CHOIX
    ======================================================= */

    const savedConsent = getSavedConsent();


    if (savedConsent) {

      console.log(
        'POUR COOKIE : choix local déjà enregistré',
        savedConsent
      );

      hideBanner();

      return;
    }


    /* =======================================================
       VÉRIFICATION DU CONSENTEMENT SHOPIFY EXISTANT
    ======================================================= */

    loadShopifyPrivacyAPI(function (error) {

      if (error) {

        console.warn(
          'POUR COOKIE : impossible de vérifier Shopify',
          error
        );

        showBanner();

        return;
      }


      if (
        !window.Shopify.customerPrivacy ||
        typeof window.Shopify.customerPrivacy.currentVisitorConsent !== 'function'
      ) {

        showBanner();

        return;
      }


      const shopifyConsent =
        window.Shopify.customerPrivacy.currentVisitorConsent();


      console.log(
        'POUR COOKIE : consentement Shopify actuel',
        shopifyConsent
      );


      const hasExistingShopifyConsent =
        shopifyConsent &&
        (
          shopifyConsent.analytics !== '' ||
          shopifyConsent.marketing !== '' ||
          shopifyConsent.preferences !== ''
        );


      if (hasExistingShopifyConsent) {

        const restoredConsent = {

          necessary: true,

          preferences:
            shopifyConsent.preferences === 'yes',

          analytics:
            shopifyConsent.analytics === 'yes',

          marketing:
            shopifyConsent.marketing === 'yes'

        };


        saveConsent(
          restoredConsent
        );


        console.log(
          'POUR COOKIE : consentement Shopify restauré localement',
          restoredConsent
        );


        hideBanner();

        return;
      }


      showBanner();

    });

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
