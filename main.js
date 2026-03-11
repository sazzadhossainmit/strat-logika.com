document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Sticky Header Logic
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }

  // Mobile Menu Logic
  const mobileNav = document.getElementById('mobile-nav');
  const openBtn = document.getElementById('open-menu');
  const closeBtn = document.getElementById('close-menu');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      if (mobileNav) mobileNav.classList.add('open');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (mobileNav) mobileNav.classList.remove('open');
    });
  }

  window.closeMobileNav = function () {
    if (mobileNav) mobileNav.classList.remove('open');
  };

  // Slider Logic
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const nextBtn = document.getElementById('next-slide');
  const prevBtn = document.getElementById('prev-slide');
  let currentSlide = 0;

  function updateSlider(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (slides.length > 0) {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider(currentSlide);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (slides.length > 0) {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider(currentSlide);
      }
    });
  }

  if (dots.length > 0) {
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider(currentSlide);
      });
    });
  }

  // Auto-slide every 5 seconds
  if (slides.length > 0) {
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlider(currentSlide);
    }, 5000);
  }

  // Services Tabs Logic
  window.openService = function (serviceId) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));

    const contents = document.querySelectorAll('.service-content-wrapper');
    contents.forEach(content => content.classList.remove('active'));

    const targetContent = document.getElementById(serviceId);
    if (targetContent) targetContent.classList.add('active');

    const tabMap = {
      renewable: 0,
      waste: 1,
      drilling: 2,
      vessel: 3,
    };

    if (tabs[tabMap[serviceId]]) {
      tabs[tabMap[serviceId]].classList.add('active');
    }
  };

  // --- PROJECTS SECTION LOGIC ---
  window.filterProjects = function (category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const allBtns = Array.from(document.querySelectorAll('.filter-btn'));
    const clickedBtn = allBtns.find(btn => {
      if (category === 'all') return btn.innerText.includes('All');
      if (category === 'renewable') return btn.innerText.includes('Renewable');
      if (category === 'waste') return btn.innerText.includes('Waste');
      if (category === 'drilling') return btn.innerText.includes('Drilling');
      if (category === 'vessel') return btn.innerText.includes('Vessel');
    });
    if (clickedBtn) clickedBtn.classList.add('active');

    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      if (
        category === 'all' ||
        card.getAttribute('data-category') === category
      ) {
        card.style.display = 'block';
        card.style.opacity = '0';
        setTimeout(() => (card.style.opacity = '1'), 50);
      } else {
        card.style.display = 'none';
      }
    });
  };

  // Toggle Card Expansion
  window.toggleCard = function (card) {
    const isExpanded = card.classList.contains('expanded');

    const allCards = document.querySelectorAll('.project-card');
    allCards.forEach(c => c.classList.remove('expanded'));

    if (!isExpanded) {
      card.classList.add('expanded');
    }
  };

  // --- TESTIMONIAL SLIDER LOGIC ---
  let currentTestimonial = 0;
  const tSlides = document.querySelectorAll('.testimonial-slide');
  const tDots = document.querySelectorAll('.t-dot');

  window.showTestimonial = function (index) {
    if (tSlides.length === 0) return;

    if (index >= tSlides.length) index = 0;
    if (index < 0) index = tSlides.length - 1;

    currentTestimonial = index;

    tSlides.forEach(slide => slide.classList.remove('active'));
    tDots.forEach(dot => dot.classList.remove('active'));

    if (tSlides[currentTestimonial])
      tSlides[currentTestimonial].classList.add('active');
    if (tDots[currentTestimonial])
      tDots[currentTestimonial].classList.add('active');
  };

  window.nextTestimonial = function () {
    showTestimonial(currentTestimonial + 1);
  };

  window.prevTestimonial = function () {
    showTestimonial(currentTestimonial - 1);
  };

  // --- CONTACT MODAL LOGIC ---
  const modal = document.getElementById('contact-modal');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  let turnstileWidgetId = null; // Store the widget ID

  const specificTriggers = [
    ...document.querySelectorAll('.contact-btn'),
    ...document.querySelectorAll('.secondary-btn'),
    ...document.querySelectorAll('.primary-btn'),
    ...document.querySelectorAll('.banner-btn'),
    ...document.querySelectorAll('.about-partner-btn'),
    ...document.querySelectorAll('.cta-link'),
  ];

  window.toggleContactModal = function (show) {
    if (show) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Render Turnstile explicitly when modal opens
      if (typeof turnstile !== 'undefined' && turnstileWidgetId === null) {
        turnstileWidgetId = turnstile.render('#turnstile-widget', {
          sitekey: '0x4AAAAAACo-xX6DhXoPdKF_',
        });
      }
    } else {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (modal) {
    specificTriggers.forEach(btn => {
      btn.addEventListener('click', e => {
        const href = btn.getAttribute('href');
        if (!href || href === '#' || href === '#contact') {
          e.preventDefault();
          window.toggleContactModal(true);
        }
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        window.toggleContactModal(false);
      });
    }

    modal.addEventListener('click', e => {
      if (e.target === modal) {
        window.toggleContactModal(false);
      }
    });
  }

  // --- FORM SUBMISSION LOGIC ---
  window.handleFormSubmit = async function (e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.submit-btn');
    const originalText = btn.innerHTML;

    const turnstileResponse = form.querySelector(
      '[name="cf-turnstile-response"]',
    );
    if (!turnstileResponse || !turnstileResponse.value) {
      btn.innerHTML = 'Please complete the Captcha';
      setTimeout(() => {
        btn.innerHTML = originalText;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 3000);
      return;
    }

    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        btn.innerHTML = '<i data-lucide="check"></i> Message Sent!';
        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
          window.toggleContactModal(false);
          btn.innerHTML = originalText;
          btn.disabled = false;
          form.reset();
          // Reset the specific widget ID
          if (typeof turnstile !== 'undefined' && turnstileWidgetId !== null) {
            turnstile.reset(turnstileWidgetId);
          }
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 2000);
      } else {
        const data = await response.json();
        let errorMessage = 'Server error';
        if (data.errors && data.errors.length > 0)
          errorMessage = data.errors[0].message;
        throw new Error(errorMessage);
      }
    } catch (error) {
      btn.innerHTML = error.message;
      btn.disabled = false;

      // Reset the specific widget ID on error
      if (typeof turnstile !== 'undefined' && turnstileWidgetId !== null) {
        turnstile.reset(turnstileWidgetId);
      }

      setTimeout(() => {
        btn.innerHTML = originalText;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 4000);
    }
  };
});
