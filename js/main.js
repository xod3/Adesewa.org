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

  // ---- Floating Adesewa Theme Song Controller ----
  (function initBackgroundMusic() {
    const audioUrl = '/assets/AdesewaThemeSong.mp3';
    
    // Create audio element
    const audio = document.createElement('audio');
    audio.id = 'bg-opera-audio';
    audio.src = audioUrl;
    audio.loop = true;
    audio.volume = 0.08;
    document.body.appendChild(audio);

    // Inject CSS styles for the floating player
    const style = document.createElement('style');
    style.textContent = `
      .music-player-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'Inter', sans-serif;
      }
      .music-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(15, 13, 10, 0.75);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(245, 183, 49, 0.4);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--gold, #f5b731);
        transition: all 0.3s ease;
        padding: 0;
        outline: none;
      }
      .music-btn:hover {
        border-color: var(--gold, #f5b731);
        transform: scale(1.08);
        box-shadow: 0 0 15px rgba(245, 183, 49, 0.3);
      }
      .music-btn.playing {
        animation: pulse-border 2s infinite;
      }
      @keyframes pulse-border {
        0%, 100% { border-color: rgba(245, 183, 49, 0.4); }
        50% { border-color: var(--gold, #f5b731); }
      }
      .music-waves {
        display: flex;
        align-items: flex-end;
        gap: 2px;
        height: 14px;
        width: 16px;
      }
      .music-wave-bar {
        width: 2px;
        height: 100%;
        background-color: var(--gold, #f5b731);
        border-radius: 1px;
        transition: height 0.2s ease;
        animation: wave-bounce 0.8s ease infinite alternate;
        animation-play-state: paused;
      }
      .music-waves.playing .music-wave-bar {
        animation-play-state: running;
      }
      .music-wave-bar:nth-child(2) { animation-delay: 0.15s; }
      .music-wave-bar:nth-child(3) { animation-delay: 0.3s; }
      .music-wave-bar:nth-child(4) { animation-delay: 0.45s; }
      
      @keyframes wave-bounce {
        0% { height: 20%; }
        100% { height: 100%; }
      }
      .music-tooltip {
        background: rgba(15, 13, 10, 0.85);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(245, 183, 49, 0.2);
        color: #fff;
        font-size: 9px;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 6px 12px;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        opacity: 0;
        transform: translateX(10px);
        transition: all 0.3s ease;
        pointer-events: none;
        white-space: nowrap;
      }
      .music-player-widget:hover .music-tooltip {
        opacity: 1;
        transform: translateX(0);
      }
    `;
    document.head.appendChild(style);

    // Create widget container
    const widget = document.createElement('div');
    widget.className = 'music-player-widget';
    widget.innerHTML = `
      <span class="music-tooltip">Adesewa Theme Song ♪</span>
      <button class="music-btn" aria-label="Toggle ambient audio">
        <div class="music-waves">
          <div class="music-wave-bar"></div>
          <div class="music-wave-bar"></div>
          <div class="music-wave-bar"></div>
          <div class="music-wave-bar"></div>
        </div>
      </button>
    `;
    document.body.appendChild(widget);

    const musicBtn = widget.querySelector('.music-btn');
    const musicWaves = widget.querySelector('.music-waves');

    function updateUI(isPlaying) {
      if (isPlaying) {
        musicBtn.classList.add('playing');
        musicWaves.classList.add('playing');
      } else {
        musicBtn.classList.remove('playing');
        musicWaves.classList.remove('playing');
      }
    }

    function togglePlay() {
      if (audio.paused) {
        audio.play()
          .then(() => updateUI(true))
          .catch(err => console.warn('Audio play prevented:', err));
      } else {
        audio.pause();
        updateUI(false);
      }
    }

    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    // Try auto-play immediately
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updateUI(true);
        })
        .catch(() => {
          // Autoplay blocked (normal browser behavior)
          updateUI(false);
          
          // Play smoothly upon first user interaction anywhere on the document
          const playOnInteraction = () => {
            audio.play()
              .then(() => {
                updateUI(true);
                window.removeEventListener('click', playOnInteraction);
                window.removeEventListener('touchstart', playOnInteraction);
              })
              .catch(err => console.warn('Play failed on interaction:', err));
          };
          window.addEventListener('click', playOnInteraction);
          window.addEventListener('touchstart', playOnInteraction);
        });
    }
  })();

});
