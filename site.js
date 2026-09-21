(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menuDetails = [...document.querySelectorAll('.site-header details')];

  const closeMenus = (exception = null) => {
    menuDetails.forEach((menu) => {
      if (menu !== exception) menu.open = false;
    });
  };

  menuDetails.forEach((menu) => {
    menu.addEventListener('toggle', () => {
      if (menu.open) closeMenus(menu);
    });
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeMenus());
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header details')) closeMenus();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openMenu = menuDetails.find((menu) => menu.open);
    if (openMenu) {
      openMenu.open = false;
      openMenu.querySelector('summary')?.focus();
    }
  });

  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - lastScrollY) > 4) closeMenus();
    lastScrollY = window.scrollY;
  }, { passive: true });

  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const href = link.getAttribute('href')?.split('#')[0] || '';
    if (href === currentPage) link.setAttribute('aria-current', 'page');
  });
  if (['nature-castle-vattavada.html', 'niva-waterways.html', 'riparian-ayur-resorts.html'].includes(currentPage)) {
    document.querySelector('.stay-menu-toggle > summary')?.setAttribute('aria-current', 'page');
  }

  const loader = document.querySelector('#pageLoader');
  if (loader) {
    const startedAt = performance.now();
    let dismissed = false;
    let loaderSeen = false;
    try { loaderSeen = sessionStorage.getItem('padathil-loader-seen') === 'true'; } catch {}
    const dismissLoader = (immediate = false) => {
      if (dismissed) return;
      dismissed = true;
      try { sessionStorage.setItem('padathil-loader-seen', 'true'); } catch {}
      const elapsed = performance.now() - startedAt;
      const delay = immediate || reducedMotion.matches ? 0 : Math.max(0, 750 - elapsed);
      window.setTimeout(() => {
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-loaded');
        loader.setAttribute('aria-hidden', 'true');
      }, delay);
    };
    window.addEventListener('load', () => dismissLoader(), { once: true });
    window.addEventListener('pointerdown', () => dismissLoader(true), { once: true, passive: true });
    window.addEventListener('keydown', () => dismissLoader(true), { once: true });
    window.setTimeout(() => dismissLoader(), 1200);
    if (loaderSeen) dismissLoader(true);
  }

  const toTop = document.querySelector('#toTop');
  if (toTop) {
    const updateToTop = () => toTop.classList.toggle('is-visible', window.scrollY > 520);
    updateToTop();
    window.addEventListener('scroll', updateToTop, { passive: true });
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    });
  }

  const galleryLinks = [...document.querySelectorAll('.gallery-card a')];
  if (!galleryLinks.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Gallery image viewer');
  lightbox.innerHTML = `
    <div class="lightbox-panel" role="document">
      <button class="lightbox-close" type="button" aria-label="Close image viewer">&times;</button>
      <button class="lightbox-control lightbox-prev" type="button" aria-label="Previous image">&#8592;</button>
      <figure>
        <img class="lightbox-image" alt="" />
        <figcaption class="lightbox-caption"></figcaption>
      </figure>
      <button class="lightbox-control lightbox-next" type="button" aria-label="Next image">&#8594;</button>
    </div>`;
  document.body.append(lightbox);

  const image = lightbox.querySelector('.lightbox-image');
  const caption = lightbox.querySelector('.lightbox-caption');
  const closeButton = lightbox.querySelector('.lightbox-close');
  let activeIndex = 0;
  let previousFocus = null;

  const renderImage = () => {
    const link = galleryLinks[activeIndex];
    const thumbnail = link.querySelector('img');
    image.src = link.href;
    image.alt = thumbnail?.alt || '';
    caption.textContent = link.closest('figure')?.querySelector('figcaption')?.textContent?.trim() || image.alt;
  };

  const openLightbox = (index) => {
    activeIndex = index;
    previousFocus = document.activeElement;
    renderImage();
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    image.removeAttribute('src');
    document.body.classList.remove('lightbox-open');
    previousFocus?.focus();
  };

  const step = (direction) => {
    activeIndex = (activeIndex + direction + galleryLinks.length) % galleryLinks.length;
    renderImage();
  };

  galleryLinks.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openLightbox(index);
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => step(-1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'ArrowRight') step(1);
    if (event.key !== 'Tab') return;
    const controls = [...lightbox.querySelectorAll('button:not([disabled])')];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
