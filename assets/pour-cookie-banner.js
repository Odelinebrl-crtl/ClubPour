(function () {
  'use strict';

  function initPourCookieBanner() {
    const banner = document.getElementById('PourCookieBanner');

    if (!banner) {
      return;
    }

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


    /* =========================================================
       AFFICHAGE
    ========================================================= */

    function showBanner() {
      banner.hidden = false;
      banner.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add(
        'pour-cookie-banner-open'
      );
      document.body.classList.add(
        'pour-cookie-banner-open'
      );
    }


    function hideBanner() {
      banner.hidden = true;
      banner.setAttribute('aria-hidden', 'true');

      document.documentElement.classList.remove(
        'pour-cookie-banner-open'
      );

      document.body.classList.remove(
        'pour-cookie-banner-open'
      );
    }


    /* =========================================================
       PRÉFÉRENCES
    ========================================================= */

    function openPreferences() {
      if (!preferencesPanel) {
        return;
      }

      preferencesPanel.hidden = false;
      preferencesPanel.setAttribute(
        'aria-hidden',
        'false'
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


    /* =========================================================
       SHOPIFY CUSTOMER PRIVACY API
    ========================================================= */

    function getShopifyPrivacy() {
      if (
        window.Shopify &&
        window.Shopify.customerPrivacy
      ) {
        return window.Shopify.customerPrivacy;
      }

      return null;
    }


    function setShopifyConsent(consent) {
      const privacy = getShopifyPrivacy();

      if (
        !privacy ||
        typeof privacy.setTrackingConsent !== 'function'
      ) {
        console.warn(
          'POUR COOKIE : API Shopify non disponible'
        );

        return;
      }

      try {
        privacy.setTrackingConsent(
          consent,
          function (result) {
            console.log(
              'POUR COOKIE : consentement Shopify enregistré',
              result
            );
          }
        );
      } catch (error) {
        console.error(
          'POUR COOKIE : erreur API Shopify',
          error
        );
      }
    }


    /* =========================================================
       ACCEPTER
    ========================================================= */

    acceptButtons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        console.log(
          'POUR COOKIE : bouton ACCEPTER cliqué'
        );

        /*
         * IMPORTANT :
         * On ferme immédiatement le bandeau.
         * La sauvegarde Shopify se fait indépendamment.
         */

        hideBanner();

        setShopifyConsent(true);
      });
    });


    /* =========================================================
       REFUSER
    ========================================================= */

    refuseButtons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        console.log(
          'POUR COOKIE : bouton REFUSER cliqué'
        );

        /*
         * Même logique :
         * fermeture immédiate du bandeau.
         */

        hideBanner();

        setShopifyConsent(false);
      });
    });


    /* =========================================================
       OUVRIR PRÉFÉRENCES
    ========================================================= */

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


    /* =========================================================
       FERMER PRÉFÉRENCES
    ========================================================= */

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


    /* =========================================================
       ENREGISTRER PRÉFÉRENCES
    ========================================================= */

    if (savePreferencesButton) {
      savePreferencesButton.addEventListener(
        'click',
        function (event) {
          event.preventDefault();
          event.stopPropagation();

          const consent = {
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
            'POUR COOKIE : préférences enregistrées',
            consent
          );


          /*
           * Fermeture immédiate.
           */

          hideBanner();
          closePreferences();


          /*
           * Enregistrement Shopify.
           */

          setShopifyConsent(consent);
        }
      );
    }


    /* =========================================================
       ÉTAT INITIAL
    ========================================================= */

    function checkExistingConsent() {
      const privacy = getShopifyPrivacy();

      if (
        privacy &&
        typeof privacy.currentVisitorConsent === 'function'
      ) {
        try {
          const consent =
            privacy.currentVisitorConsent();

          console.log(
            'POUR COOKIE : consentement actuel',
            consent
          );

          /*
           * Si Shopify connaît déjà le choix,
           * on ne montre pas le bandeau.
           */

          if (
            consent &&
            (
              consent.analytics === 'yes' ||
              consent.analytics === 'no'
            )
          ) {
            hideBanner();
            return;
          }

        } catch (error) {
          console.warn(
            'POUR COOKIE : impossible de lire le consentement',
            error
          );
        }
      }

      showBanner();
    }


    /* =========================================================
       INITIALISATION
    ========================================================= */

    /*
     * On initialise le bandeau immédiatement.
     * On ne bloque surtout pas l'interface en attendant Shopify.
     */

    checkExistingConsent();


    /*
     * On demande quand même à Shopify de charger
     * son API si elle n'est pas encore disponible.
     */

    if (
      window.Shopify &&
      typeof window.Shopify.loadFeatures === 'function'
    ) {
      try {
        window.Shopify.loadFeatures(
          [
            {
              name: 'consent-tracking-api',
              version: '0.1'
            }
          ],
          function () {
            console.log(
              'POUR COOKIE : API Shopify chargée'
            );
          }
        );
      } catch (error) {
        console.warn(
          'POUR COOKIE : chargement API Shopify impossible',
          error
        );
      }
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
