(function () {
  'use strict';

  console.log('POUR COOKIE — JS chargé');

  const banner = document.getElementById('PourCookieBanner');

  if (!banner) {
    console.error('POUR COOKIE — bannière introuvable dans le HTML');
    return;
  }

  console.log('POUR COOKIE — HTML trouvé');

  banner.hidden = false;
  banner.setAttribute('aria-hidden', 'false');

  document.documentElement.classList.add('pour-cookie-open');

  console.log('POUR COOKIE — bannière forcée à l’écran');
})();
