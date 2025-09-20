document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const sidebarNav = document.querySelector(".sidebar nav");
  const navLinks = Array.from(document.querySelectorAll('.sidebar nav a[href^="#"]'));

  // Mobile menu toggle
  if (hamburger && sidebarNav) {
    hamburger.addEventListener("click", () => {
      sidebarNav.classList.toggle("show");
    });
  }

  // Collect sections matching nav anchors
  const sectionIds = navLinks.map(a => a.getAttribute('href')).filter(Boolean);
  const sections = sectionIds.map(id => document.querySelector(id)).filter(Boolean);

  function setActive(linkEl) {
    navLinks.forEach(l => l.classList.remove('active'));
    if (linkEl) linkEl.classList.add('active');
  }

  // Immediate feedback on click
  navLinks.forEach(link => link.addEventListener('click', () => setActive(link)));

  // IntersectionObserver for scroll position
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) {
        const target = visible[0].target;
        const match = navLinks.find(a => a.getAttribute('href') === '#' + target.id);
        setActive(match);
      } else {
        // Fallback: choose section nearest top
        let closest = null;
        let minDist = Infinity;
        sections.forEach(sec => {
          const rect = sec.getBoundingClientRect();
          const dist = Math.abs(rect.top);
          if (dist < minDist) { minDist = dist; closest = sec; }
        });
        if (closest) {
          const match = navLinks.find(a => a.getAttribute('href') === '#' + closest.id);
          setActive(match);
        }
      }
    }, { rootMargin: '0px 0px -60% 0px', threshold: [0.1, 0.25, 0.5, 0.75] });

    sections.forEach(sec => observer.observe(sec));
  } else {
    // Scroll fallback if IntersectionObserver unavailable
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          let current = null;
          sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            if (rect.top <= 120) current = sec;
          });
          if (current) {
            const match = navLinks.find(a => a.getAttribute('href') === '#' + current.id);
            setActive(match);
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // Initial state
  const hash = window.location.hash;
  if (hash) {
    const initial = navLinks.find(a => a.getAttribute('href') === hash);
    if (initial) setActive(initial);
  } else if (navLinks.length) {
    setActive(navLinks[0]);
  }
});