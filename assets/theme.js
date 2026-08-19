document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');

if (header) {
  const updateHeader = () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  updateHeader();

  window.addEventListener('scroll', updateHeader, {
    passive: true
  });
}
