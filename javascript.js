// Loading particle effects
window.onload = function () {
  Particles.init({
    selector: '.background',
    color: ['#FAFAFA', '#FF0011'],
    maxParticles: 250,
    connectParticles: true,
    responsive: [
      {
        breakpoint: 800,
        options: {
          color: '#FA00DD',
          maxParticles: 150,
          connectParticles: false,
        },
      },
    ],
  });

  // Initialize dynamic navigation highlighting
  initNavigationHighlighting();
};

// Dynamic Navigation Highlighting
function initNavigationHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navigation-item');

  // Options for the Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Trigger when section is 50% visible
    threshold: 0,
  };

  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentSection = entry.target.id;
        updateActiveNavigation(currentSection);
      }
    });
  }, observerOptions);

  // Observe all sections
  sections.forEach((section) => {
    observer.observe(section);
  });

  // Function to update active navigation
  function updateActiveNavigation(activeSection) {
    // Remove active class from all navigation items
    navLinks.forEach((navItem) => {
      navItem.classList.remove('navigation-item--active');
    });

    // Add active class to current section's navigation item
    const activeNavItem = document.getElementById(`nav-${activeSection}`);
    if (activeNavItem) {
      activeNavItem.classList.add('navigation-item--active');
    }
  }

  // Handle smooth scrolling and immediate highlighting for navigation clicks
  navLinks.forEach((navLink) => {
    const link = navLink.querySelector('a');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          // Immediately update navigation (for responsive feedback)
          updateActiveNavigation(targetId);

          // Smooth scroll to section
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    }
  });

  // Set initial active state based on current scroll position
  const currentScrollY = window.scrollY;
  let currentSection = 'home'; // Default to home

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (currentScrollY >= sectionTop && currentScrollY < sectionBottom) {
      currentSection = section.id;
    }
  });

  updateActiveNavigation(currentSection);
}
