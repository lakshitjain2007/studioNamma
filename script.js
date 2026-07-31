/**
 * STUDIO NAMMA - MASTER JAVASCRIPT CONTROLLER
 * Theme Switcher, Real-Time City Clocks, Custom Mouse Cursor, Overlay Modals & Hover Media
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initThemeToggle();
  initWorldClock();
  initCustomCursor();
  initNavigationMenu();
  initContactDrawer();
  initHoverMedia();
  initCookieBanner();
});

/* ==========================================
   1. Preloader
   ========================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 600);
  });

  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 2000);
}

/* ==========================================
   2. Dark/Light Theme Switcher
   ========================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;
  const themeLabels = themeBtn.querySelectorAll('.theme-label');

  const savedTheme = localStorage.getItem('namma_theme');
  let currentTheme = savedTheme ? savedTheme : 'light';

  applyTheme(currentTheme);

  themeBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
    localStorage.setItem('namma_theme', currentTheme);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('is-dark', theme === 'dark');
    themeLabels.forEach((lbl) => {
      lbl.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    });
  }
}

/* ==========================================
   3. Real-Time World Clocks
   ========================================== */
function initWorldClock() {
  const timeElements = {
    paris: document.getElementById('time-paris'),
    la: document.getElementById('time-la'),
    barcelona: document.getElementById('time-barcelona'),
    hk: document.getElementById('time-hk')
  };

  const timezones = {
    paris: 'Europe/Paris',
    la: 'America/Los_Angeles',
    barcelona: 'Europe/Madrid',
    hk: 'Asia/Hong_Kong'
  };

  function updateClocks() {
    const now = new Date();
    for (const [city, tz] of Object.entries(timezones)) {
      if (timeElements[city]) {
        try {
          const formatted = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }).format(now);
          timeElements[city].textContent = formatted;
        } catch (e) {
          timeElements[city].textContent = '--:--';
        }
      }
    }
  }

  updateClocks();
  setInterval(updateClocks, 1000);
}

/* ==========================================
   4. Custom Mouse Cursor Follower
   ========================================== */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;
  const cursorText = cursor.querySelector('.cursor-text');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-cursor-hover]');
    if (target) {
      const text = target.getAttribute('data-cursor-hover');
      cursor.classList.add('hover');
      if (cursorText && text) cursorText.textContent = text;
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-cursor-hover]');
    if (target) {
      cursor.classList.remove('hover');
      if (cursorText) cursorText.textContent = '';
    }
  });
}

/* ==========================================
   5. Fullscreen Navigation Overlay
   ========================================== */
function initNavigationMenu() {
  const menuBtn = document.getElementById('menu-toggle');
  const menuOverlay = document.getElementById('nav-menu-overlay');
  if (!menuBtn || !menuOverlay) return;

  const menuLabels = menuBtn.querySelectorAll('.menu-label');
  let isOpen = false;

  menuBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    toggleMenu(isOpen);
  });

  function toggleMenu(open) {
    if (open) {
      menuOverlay.classList.add('active');
      menuLabels.forEach((l) => (l.textContent = 'Close'));
      document.body.style.overflow = 'hidden';
    } else {
      menuOverlay.classList.remove('active');
      menuLabels.forEach((l) => (l.textContent = 'Menu'));
      document.body.style.overflow = '';
    }
  }

  // Menu Link Image Previews
  const menuLinks = menuOverlay.querySelectorAll('.menu-item-link');
  const previewBox = document.getElementById('menu-hover-preview');

  menuLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      const imgUrl = link.getAttribute('data-preview');
      if (previewBox && imgUrl) {
        previewBox.style.backgroundImage = `url('${imgUrl}')`;
        previewBox.style.opacity = '1';
        previewBox.style.transform = 'translateY(-50%) scale(1)';
      }
    });

    link.addEventListener('mouseleave', () => {
      if (previewBox) {
        previewBox.style.opacity = '0';
        previewBox.style.transform = 'translateY(-50%) scale(0.9)';
      }
    });

    link.addEventListener('click', () => {
      isOpen = false;
      toggleMenu(false);
    });
  });

  // Handle Menu Contact trigger
  const menuContactTrigger = document.getElementById('menu-contact-trigger');
  if (menuContactTrigger) {
    menuContactTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      const contactToggle = document.getElementById('contact-toggle');
      if (contactToggle) contactToggle.click();
    });
  }
}

/* ==========================================
   6. Contact Drawer Modal
   ========================================== */
function initContactDrawer() {
  const triggers = [
    document.getElementById('contact-toggle'),
    document.getElementById('cta-say-hello-btn')
  ].filter(Boolean);

  const drawer = document.getElementById('contact-drawer');
  const closeBtn = document.getElementById('close-contact');
  const backdrop = document.getElementById('contact-backdrop');
  const formBlock = document.getElementById('contact-form-block');
  const form = document.getElementById('contact-form');
  const successState = document.getElementById('contact-success');
  const closeSuccessBtn = document.getElementById('close-success');

  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (formBlock) formBlock.style.display = 'block';
      if (successState) successState.classList.remove('active');
      if (form) form.reset();
    }, 400);
  }

  triggers.forEach((t) => t.addEventListener('click', openDrawer));
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeDrawer);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (formBlock) formBlock.style.display = 'none';
      if (successState) successState.classList.add('active');
    });
  }
}

/* ==========================================
   7. Hover Media Popups (Intro & Services)
   ========================================== */
function initHoverMedia() {
  // Intro Keywords Reveal
  const introSpans = document.querySelectorAll('.intro-hover-span');
  const introBox = document.getElementById('intro-floating-preview');

  introSpans.forEach((span) => {
    span.addEventListener('mouseenter', (e) => {
      const imgUrl = span.getAttribute('data-img');
      if (introBox && imgUrl) {
        introBox.style.backgroundImage = `url('${imgUrl}')`;
        introBox.style.opacity = '1';
        introBox.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    });

    span.addEventListener('mousemove', (e) => {
      if (introBox) {
        introBox.style.left = `${e.clientX}px`;
        introBox.style.top = `${e.clientY}px`;
      }
    });

    span.addEventListener('mouseleave', () => {
      if (introBox) {
        introBox.style.opacity = '0';
        introBox.style.transform = 'translate(-50%, -50%) scale(0.8)';
      }
    });
  });

  // Services Row Reveal
  const serviceRows = document.querySelectorAll('.service-row-item');
  const serviceBox = document.getElementById('services-hover-preview');

  serviceRows.forEach((row) => {
    row.addEventListener('mouseenter', (e) => {
      const mediaUrl = row.getAttribute('data-media');
      if (serviceBox && mediaUrl) {
        serviceBox.style.backgroundImage = `url('${mediaUrl}')`;
        serviceBox.style.opacity = '1';
        serviceBox.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    });

    row.addEventListener('mousemove', (e) => {
      if (serviceBox) {
        serviceBox.style.left = `${e.clientX}px`;
        serviceBox.style.top = `${e.clientY}px`;
      }
    });

    row.addEventListener('mouseleave', () => {
      if (serviceBox) {
        serviceBox.style.opacity = '0';
        serviceBox.style.transform = 'translate(-50%, -50%) scale(0.85)';
      }
    });
  });
}

/* ==========================================
   8. Cookie Banner
   ========================================== */
function initCookieBanner() {
  const card = document.getElementById('cookie-card');
  const acceptBtn = document.getElementById('accept-cookie-btn');
  if (!card || !acceptBtn) return;

  if (!localStorage.getItem('namma_cookies')) {
    setTimeout(() => {
      card.classList.add('active');
    }, 1200);
  }

  acceptBtn.addEventListener('click', () => {
    card.classList.remove('active');
    localStorage.setItem('namma_cookies', 'true');
  });
}
