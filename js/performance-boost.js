// Performance Boost JavaScript for Fast Loading and Smooth Scrolling

// ===================================
// PERFORMANCE MONITORING
// ===================================

// Performance metrics
const performanceMetrics = {
    startTime: performance.now(),
    firstPaint: null,
    firstContentfulPaint: null,
    domContentLoaded: null,
    loadComplete: null
};

// Track performance metrics
function trackPerformance() {
    // Track DOM content loaded
    document.addEventListener('DOMContentLoaded', () => {
        performanceMetrics.domContentLoaded = performance.now() - performanceMetrics.startTime;
        console.log(`DOM Content Loaded: ${performanceMetrics.domContentLoaded.toFixed(2)}ms`);
    });

    // Track page load complete
    window.addEventListener('load', () => {
        performanceMetrics.loadComplete = performance.now() - performanceMetrics.startTime;
        console.log(`Page Load Complete: ${performanceMetrics.loadComplete.toFixed(2)}ms`);
    });

    // Track paint performance
    if ('PerformanceObserver' in window) {
        const paintObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name === 'first-paint') {
                    performanceMetrics.firstPaint = entry.startTime;
                    console.log(`First Paint: ${performanceMetrics.firstPaint.toFixed(2)}ms`);
                }
                if (entry.name === 'first-contentful-paint') {
                    performanceMetrics.firstContentfulPaint = entry.startTime;
                    console.log(`First Contentful Paint: ${performanceMetrics.firstContentfulPaint.toFixed(2)}ms`);
                }
            }
        });
        paintObserver.observe({ entryTypes: ['paint'] });
    }
}

// ===================================
// SMOOTH SCROLLING OPTIMIZATION
// ===================================

// Smooth scrolling with performance optimization
class SmoothScroller {
    constructor() {
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.init();
    }

    init() {
        // Enable smooth scrolling for anchor links
        this.setupAnchorLinks();
        
        // Optimize scroll performance
        this.setupScrollOptimization();
        
        // Setup scroll animations
        this.setupScrollAnimations();
    }

    setupAnchorLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target);
                }
            });
        });
    }

    smoothScrollTo(target) {
        const targetTop = target.offsetTop - 80; // Offset for navbar
        const startPosition = window.pageYOffset;
        const distance = targetTop - startPosition;
        const duration = Math.min(Math.abs(distance) / 2, 800); // Dynamic duration

        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeInOutQuad = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            window.scrollTo(0, startPosition + distance * easeInOutQuad);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    setupScrollOptimization() {
        let ticking = false;

        const updateScrollState = () => {
            // Update scroll progress
            this.updateScrollProgress();
            
            // Update scroll animations
            this.updateScrollAnimations();
            
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollState);
                ticking = true;
            }
        };

        // Use passive event listener for better performance
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    updateScrollProgress() {
        const scrollProgress = document.getElementById('scrollProgress');
        if (scrollProgress) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPosition = window.pageYOffset;
            const progress = (scrollPosition / scrollHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }
    }

    setupScrollAnimations() {
        // Setup Intersection Observer for scroll animations
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observe elements with scroll-animate class
            document.querySelectorAll('.scroll-animate').forEach(el => {
                observer.observe(el);
            });
        }
    }

    updateScrollAnimations() {
        // Add scroll-based animations
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');

        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ===================================
// LAZY LOADING OPTIMIZATION
// ===================================

class LazyLoader {
    constructor() {
        this.init();
    }

    init() {
        // Setup image lazy loading
        this.setupImageLazyLoading();
        
        // Setup content lazy loading
        this.setupContentLazyLoading();
    }

    setupImageLazyLoading() {
        // Use Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Load the image
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        // Add loaded class
                        img.classList.add('loaded');
                        
                        // Stop observing
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupContentLazyLoading() {
        // Lazy load non-critical content
        if ('IntersectionObserver' in window) {
            const contentObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const content = entry.target;
                        content.classList.add('loaded');
                        contentObserver.unobserve(content);
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.1
            });

            // Observe lazy-load elements
            document.querySelectorAll('.lazy-load').forEach(el => {
                contentObserver.observe(el);
            });
        }
    }
}

// ===================================
// PERFORMANCE MONITORING
// ===================================

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Monitor FPS
        this.monitorFPS();
        
        // Monitor memory usage
        this.monitorMemory();
        
        // Monitor scroll performance
        this.monitorScrollPerformance();
    }

    monitorFPS() {
        let fps = 0;
        let lastTime = performance.now();
        let frames = 0;

        const updateFPS = (currentTime) => {
            frames++;
            
            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
                
                // Update FPS display if available
                const fpsDisplay = document.getElementById('fps-display');
                if (fpsDisplay) {
                    fpsDisplay.textContent = `FPS: ${fps}`;
                }
                
                // Log low FPS warnings
                if (fps < 30) {
                    console.warn(`Low FPS detected: ${fps}`);
                }
            }
            
            requestAnimationFrame(updateFPS);
        };

        requestAnimationFrame(updateFPS);
    }

    monitorMemory() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMemory = (memory.usedJSHeapSize / 1048576).toFixed(2);
                const totalMemory = (memory.totalJSHeapSize / 1048576).toFixed(2);
                
                // Update memory display if available
                const memoryDisplay = document.getElementById('memory-display');
                if (memoryDisplay) {
                    memoryDisplay.textContent = `Memory: ${usedMemory}MB / ${totalMemory}MB`;
                }
                
                // Log memory warnings
                if (usedMemory / totalMemory > 0.8) {
                    console.warn(`High memory usage: ${usedMemory}MB / ${totalMemory}MB`);
                }
            }, 5000);
        }
    }

    monitorScrollPerformance() {
        let scrollStartTime = 0;
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            if (!scrollStartTime) {
                scrollStartTime = performance.now();
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollTime = performance.now() - scrollStartTime;
                if (scrollTime > 16) { // More than 60fps worth of time
                    console.warn(`Slow scroll detected: ${scrollTime.toFixed(2)}ms`);
                }
                scrollStartTime = 0;
            }, 100);
        }, { passive: true });
    }
}

// ===================================
// OPTIMIZED ANIMATIONS
// ===================================

class AnimationOptimizer {
    constructor() {
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        // Setup optimized animations
        this.setupOptimizedAnimations();
        
        // Setup reduced motion support
        this.setupReducedMotion();
    }

    setupOptimizedAnimations() {
        // Use requestAnimationFrame for smooth animations
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        
        const animate = (element) => {
            if (this.prefersReducedMotion) {
                element.style.opacity = '1';
                element.style.transform = 'none';
                return;
            }

            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        };

        // Setup Intersection Observer for animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animate(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animateElements.forEach(el => {
                // Set initial state
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                observer.observe(el);
            });
        }
    }

    setupReducedMotion() {
        if (this.prefersReducedMotion) {
            // Disable animations for users who prefer reduced motion
            document.body.classList.add('reduced-motion');
            
            // Remove or simplify animations
            const animatedElements = document.querySelectorAll('[data-animate]');
            animatedElements.forEach(el => {
                el.removeAttribute('data-animate');
            });
        }
    }
}

// ===================================
// PRELOADING OPTIMIZATION
// ===================================

class ResourcePreloader {
    constructor() {
        this.preloadedResources = new Set();
        this.init();
    }

    init() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Preload images on hover
        this.setupHoverPreloading();
    }

    preloadCriticalResources() {
        // Preload critical CSS
        const criticalCSS = [
            'css/light-theme.css',
            'css/performance-optimizations.css',
            'css/shared.css'
        ];

        criticalCSS.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });

        // Preload critical JavaScript
        const criticalJS = [
            'js/shared.js',
            'js/performance-boost.js'
        ];

        criticalJS.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    setupHoverPreloading() {
        // Preload images on hover
        document.querySelectorAll('[data-hover-src]').forEach(element => {
            element.addEventListener('mouseenter', () => {
                const src = element.dataset.hoverSrc;
                if (!this.preloadedResources.has(src)) {
                    const img = new Image();
                    img.src = src;
                    this.preloadedResources.add(src);
                }
            });
        });
    }
}

// ===================================
// INITIALIZATION
// ===================================

// Initialize all performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Start performance tracking
    trackPerformance();
    
    // Initialize smooth scrolling
    new SmoothScroller();
    
    // Initialize lazy loading
    new LazyLoader();
    
    // Initialize performance monitoring
    new PerformanceMonitor();
    
    // Initialize animation optimizer
    new AnimationOptimizer();
    
    // Initialize resource preloader
    new ResourcePreloader();
    
    // Add performance classes to body
    document.body.classList.add('performance-optimized');
    
    console.log('Performance optimizations initialized');
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize images
function optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading attribute for lazy loading
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add error handling
        img.addEventListener('error', () => {
            img.style.display = 'none';
            console.warn(`Failed to load image: ${img.src}`);
        });
    });
}

// Initialize image optimization
optimizeImages();

// Export for global access
window.PerformanceBoost = {
    SmoothScroller,
    LazyLoader,
    PerformanceMonitor,
    AnimationOptimizer,
    ResourcePreloader,
    debounce,
    throttle,
    optimizeImages
};
