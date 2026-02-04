/**
 * Side Navigation for Case Studies
 * Highlights the current section and enables smooth scrolling
 */

(function() {
    'use strict';

    const sideNav = document.getElementById('side-nav');
    const navItems = document.querySelectorAll('.side-nav-item');

    if (!sideNav || navItems.length === 0) return;

    // Get all sections that have IDs matching the nav items
    const sections = [];
    navItems.forEach(item => {
        const sectionId = item.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        if (section) {
            sections.push({ id: sectionId, element: section });
        }
    });

    // Show side nav when content is unlocked
    function showSideNav() {
        sideNav.style.display = 'flex';
    }

    // Check if protected content is visible
    const protectedContent = document.getElementById('protected-content');
    if (protectedContent) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (protectedContent.style.display !== 'none') {
                        showSideNav();
                    }
                }
            });
        });
        observer.observe(protectedContent, { attributes: true });

        // Also check initial state
        if (protectedContent.style.display !== 'none') {
            showSideNav();
        }
    }

    // Update active state based on scroll position
    function updateActiveSection() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        let currentSection = sections[0]?.id;

        sections.forEach(({ id, element }) => {
            const sectionTop = element.offsetTop;
            if (scrollPosition >= sectionTop) {
                currentSection = id;
            }
        });

        navItems.forEach(item => {
            const sectionId = item.getAttribute('data-section');
            if (sectionId === currentSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Smooth scroll to section on click
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Listen for scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial update
    updateActiveSection();
})();
