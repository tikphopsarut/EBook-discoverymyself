/* ============================================
   สูตรโกง ค้นหาตัวตนด้วย AI — Landing Page JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. NAVBAR — scroll effect
  // ============================================
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();


  // ============================================
  // 2. REVEAL ON SCROLL — intersection observer
  // ============================================
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 80, 400);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  // ============================================
  // 3. FLOATING PARTICLES — hero section
  // ============================================
  const particlesContainer = document.getElementById('particles');

  if (particlesContainer) {
    const PARTICLE_COUNT = 40;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const x        = Math.random() * 100;
      const duration = 6 + Math.random() * 10;
      const delay    = Math.random() * 10;
      const size     = Math.random() > 0.7 ? 3 : 2;

      p.style.cssText = `
        left: ${x}%;
        bottom: ${Math.random() * 40}%;
        width: ${size}px;
        height: ${size}px;
        --duration: ${duration}s;
        --delay: ${-delay}s;
        opacity: 0;
      `;

      particlesContainer.appendChild(p);
    }
  }


  // ============================================
  // 4. FAQ ACCORDION
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-answer').classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
      }
    });
  });


  // ============================================
  // 5. SMOOTH SCROLL for anchor links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  // ============================================
  // 6. COUNTER ANIMATION — hero stats
  // ============================================
  const statNums = document.querySelectorAll('.stat-num:not(.stat-text)');

  const animateCounter = (el) => {
    const rawText = el.textContent.trim();
    const numMatch = rawText.match(/^(\d+)/);
    if (!numMatch) return;

    const end      = parseInt(numMatch[1]);
    const duration = 1200;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * end);

      el.textContent = current;

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        statNums.forEach(el => animateCounter(el));
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }


  // ============================================
  // 7. BOOK TILT — 3D on mouse move
  // ============================================
  const bookCover = document.querySelector('.book-cover');

  if (bookCover) {
    const heroBook = document.querySelector('.hero-book');

    heroBook.addEventListener('mousemove', (e) => {
      const rect = heroBook.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;

      bookCover.style.transform = `
        perspective(1000px)
        rotateY(${x * 10}deg)
        rotateX(${-y * 6}deg)
        scale(1.02)
      `;
    });

    heroBook.addEventListener('mouseleave', () => {
      bookCover.style.transform = 'perspective(1000px) rotateY(-8deg)';
    });
  }


  // ============================================
  // 8. RIPPLE EFFECT on buttons
  // ============================================
  function addRipple(btn) {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-anim 0.6s ease-out forwards;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  }

  document.querySelectorAll('.btn-primary').forEach(btn => addRipple(btn));

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `@keyframes ripple-anim { to { transform: scale(1); opacity: 0; } }`;
  document.head.appendChild(rippleStyle);


  // ============================================
  // 9. PHASE ITEMS — stagger reveal
  // ============================================
  const phaseItems = document.querySelectorAll('.phase-item');
  const phaseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        phaseObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  phaseItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 100}ms`;
    phaseObserver.observe(item);
  });


  // ============================================
  // 10. SCROLL PROGRESS BAR
  // ============================================
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #00d4ff, #0060cc);
    z-index: 9998;
    width: 0%;
    transition: width 0.1s linear;
    box-shadow: 0 0 8px rgba(0,212,255,0.5);
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }, { passive: true });


  // Cursor trail removed — was causing visual distraction


  // ============================================
  // 12. PAGE MOCK — stagger reveal in preview
  // ============================================
  const pageMocks = document.querySelectorAll('.page-mock');
  const mockObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        mockObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  pageMocks.forEach((mock, i) => {
    mock.style.opacity = '0';
    mock.style.transform = 'translateY(24px)';
    mock.style.transition = `opacity 0.6s ease ${i * 120}ms, transform 0.6s ease ${i * 120}ms`;
    mock.classList.add('page-mock-hidden');
    mockObserver.observe(mock);
  });

  // Inject page-mock visible style
  const mockStyle = document.createElement('style');
  mockStyle.textContent = `.page-mock.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(mockStyle);


  // ============================================
  // 13. STEP ITEMS — stagger reveal
  // ============================================
  const stepItems = document.querySelectorAll('.step-item');
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        stepObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  stepItems.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`;
    stepObserver.observe(item);
  });

  const stepStyle = document.createElement('style');
  stepStyle.textContent = `.step-item.visible { opacity: 1 !important; transform: translateX(0) !important; }`;
  document.head.appendChild(stepStyle);

});


// ============================================
// MODAL — global functions
// ============================================
function openModal() {
  window.open('https://buy.stripe.com/6oU9AV2vwfSFbVpbdQaIM02', '_blank');
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
