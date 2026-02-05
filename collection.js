	// ===================================
// COLLECTION GALLERY INTERACTIVE FEATURES
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initCollectionNavigation();
    initLightbox();
    initKeyboardNavigation();
    initFullscreenToggle();
});

// ===================================
// COLLECTION NAVIGATION
// ===================================

function initCollectionNavigation() {
    const navButtons = document.querySelectorAll('.collection-nav-btn');
    const sections = document.querySelectorAll('.collection-section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetCollection = button.dataset.collection;

            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetCollection) {
                    section.classList.add('active');
                    
                    // Scroll to section
                    setTimeout(() => {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            });
        });
    });

    // Handle hash navigation on page load
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetBtn = document.querySelector(`[data-collection="${hash}"]`);
        if (targetBtn) {
            targetBtn.click();
        }
    }
}

// ===================================
// LIGHTBOX FUNCTIONALITY
// ===================================

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let currentImages = [];
    let currentIndex = 0;

    // Open lightbox
    document.addEventListener('click', (e) => {
        const viewBtn = e.target.closest('.view-fullscreen');
        if (viewBtn) {
            const activeSection = document.querySelector('.collection-section.active');
            const galleryItems = activeSection.querySelectorAll('.gallery-item');
            
            // Build image array from active collection
            currentImages = Array.from(galleryItems).map(item => {
                return item.querySelector('.view-fullscreen').dataset.img;
            });
            
            // Find current index
            currentIndex = currentImages.indexOf(viewBtn.dataset.img);
            
            showLightboxImage(currentIndex);
            openLightbox();
        }
    });

    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        showLightboxImage(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % currentImages.length;
        showLightboxImage(currentIndex);
    });

    function showLightboxImage(index) {
        lightboxImage.src = currentImages[index];
        lightboxImage.alt = `Collection image ${index + 1} of ${currentImages.length}`;
        lightboxCounter.textContent = `${index + 1} / ${currentImages.length}`;
        
        // Preload next and previous images
        preloadImage(currentImages[(index + 1) % currentImages.length]);
        preloadImage(currentImages[(index - 1 + currentImages.length) % currentImages.length]);
    }

    function preloadImage(src) {
        const img = new Image();
        img.src = src;
    }

    function openLightbox() {
        lightbox.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

// ===================================
// KEYBOARD NAVIGATION
// ===================================

function initKeyboardNavigation() {
    const lightbox = document.getElementById('lightbox');
    
    document.addEventListener('keydown', (e) => {
        // Only handle keyboard when lightbox is active
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                lightbox.querySelector('.lightbox-close').click();
                break;
            case 'ArrowLeft':
                lightbox.querySelector('.lightbox-prev').click();
                break;
            case 'ArrowRight':
                lightbox.querySelector('.lightbox-next').click();
                break;
        }
    });

    // Collection switching with keyboard
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) return;

        if (e.key === '1') {
            document.querySelector('[data-collection="col1"]')?.click();
        } else if (e.key === '2') {
            document.querySelector('[data-collection="col2"]')?.click();
        }
    });
}

// ===================================
// FULLSCREEN TOGGLE
// ===================================

function initFullscreenToggle() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
            fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
            }
        }
    }

    // Update button on fullscreen change
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        }
    });
}

// ===================================
// IMAGE HOVER EFFECTS
// ===================================

const imageWrappers = document.querySelectorAll('.image-wrapper');

imageWrappers.forEach(wrapper => {
    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        const image = wrapper.querySelector('.gallery-image');
        image.style.transform = `scale(1.05) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    wrapper.addEventListener('mouseleave', () => {
        const image = wrapper.querySelector('.gallery-image');
        image.style.transform = '';
    });
});

// ===================================
// SCROLL ANIMATIONS
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe gallery items as they appear
const observeGalleryItems = () => {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => observer.observe(item));
};

// Initial observation
observeGalleryItems();

// Re-observe when switching collections
document.querySelectorAll('.collection-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setTimeout(observeGalleryItems, 100);
    });
});

// ===================================
// TOUCH SWIPE FOR LIGHTBOX (Mobile)
// ===================================

let touchStartX = 0;
let touchEndX = 0;

const lightbox = document.getElementById('lightbox');

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    
    if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left - next image
        lightbox.querySelector('.lightbox-next').click();
    } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right - previous image
        lightbox.querySelector('.lightbox-prev').click();
    }
}

// ===================================
// LAZY LOADING IMAGES
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
// SMOOTH SCROLL TO TOP
// ===================================

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top on back link
document.querySelector('.back-link')?.addEventListener('click', (e) => {
    if (e.target.getAttribute('href') === '#') {
        e.preventDefault();
        scrollToTop();
    }
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for performance
function debounce(func, wait = 10) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Throttle resize events
window.addEventListener('resize', debounce(() => {
    // Handle responsive adjustments
    console.log('Window resized');
}, 250));

// ===================================
// CONSOLE STYLING
// ===================================

console.log(
    '%cTAZII for SLTY',
    'font-family: "Cormorant Garamond", serif; font-size: 24px; font-weight: 600; color: #1a1a1a;'
);
console.log(
    '%cCollection Gallery',
    'font-family: "Montserrat", sans-serif; font-size: 14px; color: #666666;'
);

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

// Focus management for lightbox
lightbox.addEventListener('transitionend', () => {
    if (lightbox.classList.contains('active')) {
        lightbox.querySelector('.lightbox-close').focus();
    }
});

// Announce image changes for screen readers
function announceImageChange(current, total) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Image ${current} of ${total}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 1000);
}

// ===================================
// IMAGE DOWNLOAD (Optional Feature)
// ===================================

function downloadImage(imgSrc, fileName) {
    fetch(imgSrc)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || 'image.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        })
        .catch(err => console.error('Download failed:', err));
}