document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Sticky Header Logic
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  // Mobile Menu Logic
  const mobileNav = document.getElementById('mobile-nav');
  const openBtn = document.getElementById('open-menu');
  const closeBtn = document.getElementById('close-menu');

  openBtn.addEventListener('click', () => {
    mobileNav.classList.add('open');
  });

  closeBtn.addEventListener('click', () => {
    mobileNav.classList.remove('open');
  });

  window.closeMobileNav = function () {
    mobileNav.classList.remove('open');
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

    slides[index].classList.add('active');
    dots[index].classList.add('active');
  }

  nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider(currentSlide);
  });

  prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider(currentSlide);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateSlider(currentSlide);
    });
  });

  // Auto-slide every 5 seconds
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider(currentSlide);
  }, 5000);

  // Services Tabs Logic
  window.openService = function (serviceId) {
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Hide all content wrappers
    const contents = document.querySelectorAll('.service-content-wrapper');
    contents.forEach(content => content.classList.remove('active'));

    // Show specific content
    const targetContent = document.getElementById(serviceId);
    if (targetContent) targetContent.classList.add('active');

    // Highlight the clicked tab
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

  // Filter Projects
  window.filterProjects = function (category) {
    // Update buttons
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    // Find the clicked button by text content or logic, simplified here by assuming the user clicks
    // For this specific implementation, we add 'active' class to the clicked element manually passed
    // But since 'onclick' is inline, we need to find the button that was clicked.
    // A simpler way:
    const allBtns = Array.from(document.querySelectorAll('.filter-btn'));
    const clickedBtn = allBtns.find(btn => {
      if (category === 'all') return btn.innerText.includes('All');
      if (category === 'renewable') return btn.innerText.includes('Renewable');
      if (category === 'waste') return btn.innerText.includes('Waste');
      if (category === 'drilling') return btn.innerText.includes('Drilling');
      if (category === 'vessel') return btn.innerText.includes('Vessel');
    });
    if (clickedBtn) clickedBtn.classList.add('active');

    // Filter cards
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      if (
        category === 'all' ||
        card.getAttribute('data-category') === category
      ) {
        card.style.display = 'block';
        // Optional: Add fade-in animation
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

    // Close all cards first (Accordion behavior)
    const allCards = document.querySelectorAll('.project-card');
    allCards.forEach(c => c.classList.remove('expanded'));

    // If it wasn't previously expanded, open it
    if (!isExpanded) {
      card.classList.add('expanded');
    }
  };

  // --- TESTIMONIAL SLIDER LOGIC ---
  let currentTestimonial = 0;
  const tSlides = document.querySelectorAll('.testimonial-slide');
  const tDots = document.querySelectorAll('.t-dot');

  window.showTestimonial = function (index) {
    // Wrap around logic
    if (index >= tSlides.length) index = 0;
    if (index < 0) index = tSlides.length - 1;

    currentTestimonial = index;

    tSlides.forEach(slide => slide.classList.remove('active'));
    tDots.forEach(dot => dot.classList.remove('active'));

    tSlides[currentTestimonial].classList.add('active');
    tDots[currentTestimonial].classList.add('active');
  };

  window.nextTestimonial = function () {
    showTestimonial(currentTestimonial + 1);
  };

  window.prevTestimonial = function () {
    showTestimonial(currentTestimonial - 1);
  };

  // Modal Logic
  const modal = document.getElementById('contact-modal');

  // FIXED: Attached to window to be accessible by inline onclick events
  window.toggleModal = function (show) {
    if (show) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scroll
    } else {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // FIXED: Attached to window
  window.closeOnOverlay = function (e) {
    if (e.target === modal) window.toggleModal(false);
  };

  // FIXED: Attached to window
  window.handleFormSubmit = async function (e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.submit-btn');
    const originalText = btn.innerHTML;

    // 1. Start UI loading state
    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    // 2. Actually send the data to Formspree
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        // 3. Trigger your success animation only if Formspree confirms receipt
        btn.innerHTML = '<i data-lucide="check"></i> Message Sent!';
        lucide.createIcons();

        setTimeout(() => {
          if (window.toggleModal) window.toggleModal(false);
          btn.innerHTML = originalText;
          btn.disabled = false;
          form.reset();
          lucide.createIcons();
        }, 2000);
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      // Handle errors (e.g., no internet)
      btn.innerHTML = 'Error. Try again.';
      btn.disabled = false;
      setTimeout(() => {
        btn.innerHTML = originalText;
        lucide.createIcons();
      }, 3000);
    }
  };
});
