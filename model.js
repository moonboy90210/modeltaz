// ===================================
// MODEL PORTFOLIO INTERACTIVE FEATURES
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initSmoothScroll();
    initNavbarScroll(); 
    initScrollAnimations();
    initFormValidation();
});

// ===================================
// HERO SLIDER
// ===================================

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto-advance slides
    if (slides.length > 1) {
        setInterval(nextSlide, slideInterval);
    }
}

// ===================================
// SMOOTH SCROLL
// ===================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }

                // Update active nav link
                updateActiveNavLink(this);
            }
        });
    });
}

function updateActiveNavLink(clickedLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    clickedLink.classList.add('active');
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active section based on scroll position
        updateActiveSection();

        lastScroll = currentScroll;
    });

    function updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.classList.add('scroll-reveal');
        observer.observe(item);
    });

    // Observe stats cards
    const statsCards = document.querySelectorAll('.stats-card');
    statsCards.forEach(card => {
        card.classList.add('scroll-reveal');
        observer.observe(card);
    });
}

// ===================================
// PORTFOLIO IMAGE HOVER EFFECT
// ===================================

const portfolioLinks = document.querySelectorAll('.portfolio-link');

portfolioLinks.forEach(link => {
    const imageWrapper = link.querySelector('.portfolio-image-wrapper');
    
    link.addEventListener('mousemove', (e) => {
        const rect = imageWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        const image = imageWrapper.querySelector('.portfolio-image');
        image.style.transform = `scale(1.05) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    link.addEventListener('mouseleave', () => {
        const image = imageWrapper.querySelector('.portfolio-image');
        image.style.transform = '';
    });
});

// ===================================
// FORM VALIDATION & SUBMISSION
// ===================================

function initFormValidation() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            
            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending...';
            
            // Simulate form submission
            setTimeout(() => {
                // Success feedback
                submitBtn.innerHTML = 'Message Sent! ✓';
                submitBtn.style.background = '#2ecc71';
                
                // Reset form
                form.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';
                    submitBtn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }
}

// ===================================
// GALLERY PARALLAX EFFECT
// ===================================

/* const galleryImages = document.querySelectorAll('.gallery-img');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    galleryImages.forEach((img, index) => {
        const speed = 0 + (index * 0.1);
        const yPos = -(scrolled * speed);
        
        if (img.getBoundingClientRect().top < window.innerHeight) {
            img.style.transform = `translateY(${yPos * 0.1}px) scale(1)`;
        }
    });
}); */

// ===================================
// LAZY LOAD IMAGES
// ===================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Debounce scroll events
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Apply debounce to scroll handlers
window.addEventListener('scroll', debounce(() => {
    // Scroll handlers here
}, 10));

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

// Keyboard navigation for portfolio items
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ===================================
// SOCIAL SHARE
// ===================================

function sharePortfolio() {
    if (navigator.share) {
        navigator.share({
            title: 'Timothy Adedotun - Model Portfolio',
            text: 'Check out my modeling portfolio',
            url: window.location.href
        }).catch(err => console.log('Share failed', err));
    }
}

// ===================================
// CONSOLE STYLING
// ===================================

console.log(
    '%cTimothy Adedotun',
    'font-family: "Cormorant Garamond", serif; font-size: 32px; font-weight: 600; color: #1a1a1a;'
);
console.log(
    '%cFashion · Streetwear · Commercial Model',
    'font-family: "Montserrat", sans-serif; font-size: 14px; color: #666666; letter-spacing: 0.1em;'
);
console.log(
    '%cLagos, Nigeria',
    'font-family: "Montserrat", sans-serif; font-size: 12px; color: #999999;'
);

// ===================================
// CURSOR CUSTOM EFFECT (Desktop Only)
// ===================================

if (window.innerWidth > 991) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .custom-cursor {
            position: fixed;
            width: 40px;
            height: 40px;
            border: 1px solid #1a1a1a;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.2s ease;
            mix-blend-mode: difference;
            opacity: 0;
        }
        
        body.cursor-active .custom-cursor {
            opacity: 1;
        }
        
        .custom-cursor.hover {
            transform: scale(1.5);
            background: rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(cursorStyle);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.body.classList.add('cursor-active');
    });

    document.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-active');
    });

    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.left = cursorX - 20 + 'px';
        cursor.style.top = cursorY - 20 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const hoverElements = document.querySelectorAll('a, button, .portfolio-link');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}