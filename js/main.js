// ======================================
//  ADESEWA.ORG — Main JavaScript
// ======================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Footer year ----
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Sticky header on scroll ----
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Mobile menu toggle ----
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', !isOpen);
      hamburger.classList.toggle('open', !isOpen);
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.setAttribute('aria-hidden', String(isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Hero slide dots (auto-cycle) ----
  const slideDots = document.querySelectorAll('.slide-dot');
  let currentSlide = 0;
  let slideInterval;

  const setSlide = (idx) => {
    slideDots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
    currentSlide = idx;
  };

  if (slideDots.length) {
    slideDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        setSlide(i);
        startSlideInterval();
      });
    });

    const startSlideInterval = () => {
      slideInterval = setInterval(() => {
        setSlide((currentSlide + 1) % slideDots.length);
      }, 4000);
    };

    startSlideInterval();
  }

  // ---- Supporters Carousel ----
  const carousel = document.getElementById('supporters-carousel');
  const prevBtn = document.getElementById('supporters-prev');
  const nextBtn = document.getElementById('supporters-next');
  const prevBtnMobile = document.getElementById('supporters-prev-mobile');
  const nextBtnMobile = document.getElementById('supporters-next-mobile');
  const mobileDots = document.querySelectorAll('#supporters-mobile-dots .mobile-dot');

  if (carousel) {
    const cards = carousel.querySelectorAll('.supporter-card');
    const cardCount = cards.length;
    let currentCard = 0;

    const getCardWidth = () => {
      if (cards[0]) {
        const style = window.getComputedStyle(carousel);
        const gap = parseFloat(style.gap) || 24;
        return cards[0].offsetWidth + gap;
      }
      return 0;
    };

    const scrollToCard = (idx) => {
      idx = Math.max(0, Math.min(idx, cardCount - 1));
      currentCard = idx;
      const cw = getCardWidth();
      carousel.scrollTo({ left: idx * cw, behavior: 'smooth' });
      updateDots();
      updateArrows();
    };

    const updateArrows = () => {
      [prevBtn, prevBtnMobile].forEach(btn => {
        if (btn) btn.disabled = currentCard === 0;
      });
      [nextBtn, nextBtnMobile].forEach(btn => {
        if (btn) btn.disabled = currentCard >= cardCount - 1;
      });
    };

    const updateDots = () => {
      mobileDots.forEach((dot, i) => dot.classList.toggle('active', i === currentCard));
    };

    [prevBtn, prevBtnMobile].forEach(btn => {
      if (btn) btn.addEventListener('click', () => scrollToCard(currentCard - 1));
    });

    [nextBtn, nextBtnMobile].forEach(btn => {
      if (btn) btn.addEventListener('click', () => scrollToCard(currentCard + 1));
    });

    // Track scroll position
    carousel.addEventListener('scroll', () => {
      const cw = getCardWidth();
      if (cw > 0) {
        currentCard = Math.round(carousel.scrollLeft / cw);
        updateDots();
        updateArrows();
      }
    }, { passive: true });

    updateArrows();
  }

  // ---- Tab buttons (Top Gifters / Top Viewers) ----
  const tabGifters = document.getElementById('tab-gifters');
  const tabViewers = document.getElementById('tab-viewers');

  if (tabGifters && tabViewers) {
    tabGifters.addEventListener('click', () => {
      tabGifters.classList.add('active');
      tabViewers.classList.remove('active');
    });
    tabViewers.addEventListener('click', () => {
      tabViewers.classList.add('active');
      tabGifters.classList.remove('active');
    });
  }

  // ---- Intersection Observer reveal animations ----
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ---- Contact form ----
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('[type="submit"]');
      if (!submitBtn || submitBtn.disabled) return;

      const firstName = document.getElementById('contact-first-name')?.value.trim() || '';
      const lastName = document.getElementById('contact-last-name')?.value.trim() || '';
      const email = document.getElementById('contact-email-input')?.value.trim() || '';
      const subject = document.getElementById('contact-subject')?.value.trim() || '';
      const message = document.getElementById('contact-message')?.value.trim() || '';

      if (!firstName || !lastName || !email || !subject || !message) {
        alert('Please fill out all fields.');
        return;
      }

      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;

      fetch('https://formsubmit.co/ajax/hello@adesewa.org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: `${firstName} ${lastName}`,
          Email: email,
          Subject: subject,
          Message: message,
          _subject: `New contact form submission: ${subject}`,
          _captcha: 'false'
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success === 'true' || data.success === true) {
          submitBtn.innerHTML = '<span>Message Sent! ✓</span>';
          contactForm.reset();
        } else if (data.message && data.message.toLowerCase().includes('activ')) {
          submitBtn.innerHTML = '<span>Activation Email Sent! Check Inbox</span>';
          contactForm.reset();
        } else {
          submitBtn.innerHTML = '<span>Error! Try again</span>';
          submitBtn.disabled = false;
          console.error(data);
        }
        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
        }, 6000);
      })
      .catch(error => {
        submitBtn.innerHTML = '<span>Error! Try again</span>';
        submitBtn.disabled = false;
        console.error('Error submitting form:', error);
        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
        }, 4000);
      });
    });
  }

  // ---- Gallery lightbox (simple) ----
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (galleryItems.length) {
    // Create lightbox element
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.95); backdrop-filter: blur(10px);
      display: none; align-items: center; justify-content: center;
      cursor: zoom-out;
    `;

    const lbImg = document.createElement('img');
    lbImg.style.cssText = `
      max-width: 90vw; max-height: 90vh; object-fit: contain;
      border-radius: 0.5rem; box-shadow: 0 32px 80px rgba(0,0,0,0.8);
    `;

    lb.appendChild(lbImg);
    document.body.appendChild(lb);

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgEl = item.querySelector('.gallery-item-img');
        if (!imgEl) return;
        const style = window.getComputedStyle(imgEl);
        const bgImage = style.backgroundImage;
        const url = bgImage.replace(/url\(["']?|["']?\)/g, '');
        lbImg.src = url;
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    lb.addEventListener('click', () => {
      lb.style.display = 'none';
      document.body.style.overflow = '';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        lb.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  // ---- Add reveal class to major sections ----
  const autoReveal = [
    '.section-eyebrow', '.section-title', '.section-desc',
    '.supporter-card', '.battle-card', '.service-card',
    '.review-card', '.archive-card', '.outreach-card',
    '.gallery-item', '.social-icon-btn', '.stat-item'
  ];

  autoReveal.forEach((selector, sIdx) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        if (i < 4) el.classList.add(`reveal-delay-${i + 1}`);
      }
    });
  });

  // Re-observe newly added reveal elements
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => {
      if (!el.classList.contains('visible')) observer.observe(el);
    });
  }

});
