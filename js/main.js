/**
 * Hope For Young Parents Uganda — Main JavaScript
 * Handles: sticky header, mobile menu, scroll reveal, counter animation
 */

(function () {
  'use strict';

  /* ===================================================
     STICKY HEADER
     =================================================== */
  const header = document.getElementById('site-header');

  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();


  /* ===================================================
     ACTIVE NAV LINK (scroll-spy)
     =================================================== */
  const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
  const sections = [];

  navLinks.forEach(link => {
    const id = link.getAttribute('href').substring(1);
    const el = document.getElementById(id);
    if (el) sections.push({ id, el, link });
  });

  function updateActiveNav() {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(({ id, el }) => {
      if (el.offsetTop <= scrollPos) {
        current = id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });

    const activeSection = sections.find(s => s.id === current);
    if (activeSection) {
      activeSection.link.classList.add('active');
      activeSection.link.setAttribute('aria-current', 'page');
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();


  /* ===================================================
     MOBILE NAVIGATION
     =================================================== */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOpen = false;
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      menuOpen ? closeMenu() : openMenu();
    });

    // Close when a mobile link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    });

    // Close when clicking outside
    mobileNav.addEventListener('click', e => {
      if (e.target === mobileNav) closeMenu();
    });
  }


  /* ===================================================
     SMOOTH SCROLL for anchor links
     =================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 80;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });


  /* ===================================================
     SCROLL REVEAL ANIMATION
     =================================================== */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('revealed'));
  }


  /* ===================================================
     COUNTER ANIMATION (Impact section)
     =================================================== */
  const statNums = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const step = 30;
    const increment = target / (duration / step);
    let current = 0;

    const suffix = el.textContent.includes('+') ? '+' : '';

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, step);
  }

  if ('IntersectionObserver' in window && statNums.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNums.forEach(el => counterObserver.observe(el));
  }


  /* ===================================================
     HERO STATS BAR — same counter animation
     =================================================== */
  const heroStatNums = document.querySelectorAll('.hero-stat-num[data-stat]');

  if ('IntersectionObserver' in window && heroStatNums.length > 0) {
    const heroCounterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent;
            const num = parseInt(text, 10);
            const suffix = text.replace(/\d/g, '');
            if (!isNaN(num)) {
              el.setAttribute('data-target', num);
              el.textContent = '0' + suffix;
              animateCounter(el);
            }
            heroCounterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    heroStatNums.forEach(el => heroCounterObserver.observe(el));
  }


  /* ===================================================
     QUICK CARD & HEALTH CARD keyboard accessibility
     =================================================== */
  document.querySelectorAll('.quick-card, .health-card').forEach(card => {
    if (card.tagName !== 'A') {
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    }
  });


  /* ===================================================
     NETWORK NODES — subtle pulsing animation via JS
     =================================================== */
  const networkNodes = document.querySelectorAll('.network-node');
  if (networkNodes.length) {
    networkNodes.forEach((node, i) => {
      node.style.animationDelay = `${i * 0.4}s`;
      node.style.animation = `floatShape ${3 + i * 0.3}s ease-in-out ${i * 0.4}s infinite`;
    });
  }


  /* ===================================================
     TOPIC CHIPS — click to scroll to section
     (placeholder — expand when individual topic pages exist)
     =================================================== */
  document.querySelectorAll('.topic-chip').forEach(chip => {
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    chip.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chip.click();
      }
    });
    chip.addEventListener('click', () => {
      const targetId = chip.closest('section').id;
      const target = document.getElementById(targetId);
      if (target) {
        const headerH = header ? header.offsetHeight : 80;
        window.scrollTo({ top: target.offsetTop - headerH, behavior: 'smooth' });
      }
    });
  });


  /* ===================================================
     PRINT: reveal all hidden elements
     =================================================== */
  window.addEventListener('beforeprint', () => {
    revealEls.forEach(el => el.classList.add('revealed'));
  });

})();


/* ===================================================
   RESOURCES PAGE — Filter bar
   =================================================== */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const articleCards = document.querySelectorAll('#articles-container .article-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide cards
      articleCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          card.classList.remove('revealed');
          // Re-trigger animation
          setTimeout(() => card.classList.add('revealed'), 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();


/* ===================================================
   CONTACT PAGE — Form submission (client-side only)
   Replace with server-side handling when deploying
   =================================================== */
(function () {
  const form = document.getElementById('main-contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    const name    = form.querySelector('#contact-name');
    const type    = form.querySelector('#contact-type');
    const subject = form.querySelector('#contact-subject');
    const message = form.querySelector('#contact-message');
    const privacy = form.querySelector('[name="privacy"]');

    let valid = true;

    [name, type, subject, message].forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e05c7a';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!privacy.checked) {
      privacy.closest('.form-group').querySelector('span').style.color = '#e05c7a';
      valid = false;
    } else {
      privacy.closest('.form-group').querySelector('span').style.color = '';
    }

    if (!valid) {
      const firstError = form.querySelector('[style*="borderColor"]') ||
                         form.querySelector('[style*="color"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // Show success message
    form.innerHTML = `
      <div style="text-align:center;padding:3rem 1.5rem;">
        <div style="font-size:4rem;margin-bottom:1rem;">✅</div>
        <h3 style="color:var(--color-primary);margin-bottom:0.75rem;">Message Sent!</h3>
        <p style="color:var(--color-mid);line-height:1.7;max-width:400px;margin:0 auto;">
          Thank you for reaching out. We have received your message and will get back to you as soon as possible.<br><br>
          🔒 Your message is confidential.
        </p>
      </div>
    `;
  });
})();


/* ===================================================
   DONATE AMOUNT BUTTON — toggle active state
   =================================================== */
(function () {
  const amountBtns = document.querySelectorAll('.donate-amount-btn');
  if (!amountBtns.length) return;

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
})();


/* ===================================================
   STORY MODALS
   =================================================== */
(function () {
  const overlay = document.getElementById('story-modal-overlay');
  if (!overlay) return;

  const readMoreBtns = document.querySelectorAll('.story-read-more');
  let activeModal = null;

  function openModal(storyId) {
    const modal = document.getElementById(storyId);
    if (!modal) return;
    activeModal = modal;
    modal.classList.add('active');
    overlay.classList.add('active');
    overlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    // Focus the close button
    const closeBtn = modal.querySelector('.story-modal-close');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
  }

  function closeModal() {
    if (!activeModal) return;
    activeModal.classList.remove('active');
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeModal = null;
  }

  // Open on Read More click
  readMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(btn.getAttribute('data-story'));
    });
  });

  // Close on overlay click
  overlay.addEventListener('click', closeModal);

  // Close on close button
  document.querySelectorAll('.story-modal-close').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && activeModal) closeModal();
  });
})();


/* ===================================================
   PHOTO GALLERY LIGHTBOX
   =================================================== */
(function () {
  // Create lightbox elements once
  const lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';
  lightbox.id = 'gallery-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Photo viewer');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'gallery-lightbox-close';
  closeBtn.setAttribute('aria-label', 'Close photo');
  closeBtn.textContent = '✕';

  const img = document.createElement('img');
  img.alt = '';

  const caption = document.createElement('div');
  caption.className = 'gallery-lightbox-caption';

  lightbox.appendChild(closeBtn);
  lightbox.appendChild(img);
  lightbox.appendChild(caption);
  document.body.appendChild(lightbox);

  function openLightbox(src, alt, cap) {
    img.src = src;
    img.alt = alt || '';
    caption.textContent = cap || '';
    caption.style.display = cap ? 'block' : 'none';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    img.src = '';
  }

  // Attach click to all gallery items
  function initGalleryItems() {
    document.querySelectorAll('.gallery-item').forEach(item => {
      const galleryImg = item.querySelector('img');
      const cap = item.querySelector('.gallery-caption');
      if (!galleryImg) return;

      item.style.cursor = 'zoom-in';
      item.addEventListener('click', () => {
        openLightbox(
          galleryImg.src,
          galleryImg.alt,
          cap ? cap.textContent.trim() : ''
        );
      });

      item.setAttribute('tabindex', '0');
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(
            galleryImg.src,
            galleryImg.alt,
            cap ? cap.textContent.trim() : ''
          );
        }
      });
    });
  }

  initGalleryItems();

  // Close handlers
  closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
})();


/* ===================================================
   PWA INSTALL PROMPT
   =================================================== */
(function () {
  let deferredPrompt = null;
  const banner  = document.getElementById('pwa-banner');
  const installBtn = document.getElementById('pwa-install-btn');
  const dismissBtn = document.getElementById('pwa-dismiss-btn');

  if (!banner) return;

  // Catch the browser's install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Only show if not dismissed before
    if (!localStorage.getItem('pwa-dismissed')) {
      setTimeout(() => banner.classList.add('show'), 3000);
    }
  });

  // Install button clicked
  if (installBtn) {
    installBtn.addEventListener('click', () => {
      banner.classList.remove('show');
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choice => {
          deferredPrompt = null;
        });
      }
    });
  }

  // Dismiss button clicked
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      banner.classList.remove('show');
      localStorage.setItem('pwa-dismissed', '1');
    });
  }

  // Hide banner if already installed
  window.addEventListener('appinstalled', () => {
    banner.classList.remove('show');
    deferredPrompt = null;
  });
})();
