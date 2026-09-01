(function () {
  'use strict';

  const COOKIE_CONSENT_KEY = 'pour_cookie_consent';

  console.log('POUR COOKIE : JS chargé');

  function initPourCookieBanner() {

    const banner = document.getElementById('PourCookieBanner');

    if (!banner) {
      console.error(
        'POUR COOKIE : #PourCookieBanner introuvable'
      );
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

    /*
     * ==============================
     * AFFICHER / CACHER
     * ==============================
     */

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

    /*
     * ==============================
     * MÉMORISATION
     * ==============================
     */

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

    /*
     * ==============================
     * PRÉFÉRENCES
     * ==============================
     */

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

    /*
     * ==============================
     * ACCEPTER
     * ==============================
     */

    acceptButtons.forEach(function (button) {

      button.addEventListener(
        'click',
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          console.log(
            'POUR COOKIE : ACCEPTER cliqué'
          );

          saveConsent({
            necessary: true,
            preferences: true,
            analytics: true,
            marketing: true
          });

          hideBanner();

        }
      );

    });

    /*
     * ==============================
     * REFUSER
     * ==============================
     */

    refuseButtons.forEach(function (button) {

      button.addEventListener(
        'click',
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          console.log(
            'POUR COOKIE : REFUSER cliqué'
          );

          saveConsent({
            necessary: true,
            preferences: false,
            analytics: false,
            marketing: false
          });

          hideBanner();

        }
      );

    });

    /*
     * ==============================
     * PRÉFÉRENCES
     * ==============================
     */

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

    /*
     * ==============================
     * FERMER PRÉFÉRENCES
     * ==============================
     */

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

    /*
     * ==============================
     * ENREGISTRER PRÉFÉRENCES
     * ==============================
     */

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
            'POUR COOKIE : préférences enregistrées',
            consent
          );

          saveConsent(consent);

          hideBanner();

          closePreferences();

        }
      );

    }

    /*
     * ==============================
     * VÉRIFIER SI UN CHOIX EXISTE
     * ==============================
     */

    const savedConsent = getSavedConsent();

    if (savedConsent) {

      console.log(
        'POUR COOKIE : choix déjà enregistré',
        savedConsent
      );

      hideBanner();

    } else {

      showBanner();

    }

  }

  if (document.readyState === 'loading') {

    document.addEventListener(
      'DOMContentLoaded',
      initPourCookieBanner
    );

  } else {

    initPourCookieBanner();

  }

})();
