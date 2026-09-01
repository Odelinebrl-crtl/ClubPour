(function () {
  'use strict';

  console.log('POUR COOKIE : JS chargé');

  function initPourCookieBanner() {

    const banner = document.getElementById('PourCookieBanner');

    console.log(
      'POUR COOKIE : bannière trouvée =',
      !!banner
    );

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

    console.log(
      'POUR COOKIE : boutons accepter =',
      acceptButtons.length
    );

    console.log(
      'POUR COOKIE : boutons refuser =',
      refuseButtons.length
    );

    function hideBanner() {

      console.log(
        'POUR COOKIE : EXECUTION hideBanner()'
      );

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

      banner.style.removeProperty('display');

      document.documentElement.classList.add(
        'pour-cookie-banner-open'
      );

      document.body.classList.add(
        'pour-cookie-banner-open'
      );
    }

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

    /*
     * ACCEPTER
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

          hideBanner();

        }
      );

    });

    /*
     * REFUSER
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

          hideBanner();

        }
      );

    });

    /*
     * PRÉFÉRENCES
     */

    if (preferencesButton) {

      preferencesButton.addEventListener(
        'click',
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          console.log(
            'POUR COOKIE : PRÉFÉRENCES cliqué'
          );

          openPreferences();

        }
      );

    }

    /*
     * FERMER PRÉFÉRENCES
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
     * ENREGISTRER PRÉFÉRENCES
     */

    if (savePreferencesButton) {

      savePreferencesButton.addEventListener(
        'click',
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          console.log(
            'POUR COOKIE : ENREGISTRER cliqué'
          );

          hideBanner();
          closePreferences();

        }
      );

    }

    /*
     * IMPORTANT :
     * On affiche la bannière pour le test.
     */

    showBanner();

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
