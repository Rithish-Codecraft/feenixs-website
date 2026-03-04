// Vision Page Specific JavaScript

// Initialize vision page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize vision graphic animations
    initVisionGraphic();
    
    // Initialize timeline interactions
    initTimelineInteractions();
    
    // Initialize smooth scroll
    initSmoothScroll();
});

// Scroll Animations with GSAP
function initScrollAnimations() {
    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded, skipping animations');
        return;
    }
    
    // Register ScrollTrigger plugin if available
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Statement content animations
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.from('.statement-text h2', {
            scrollTrigger: {
                trigger: '.statement-text',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            x: -50,
            opacity: 0,
            duration: 1
        });
        
        gsap.from('.statement-text p', {
            scrollTrigger: {
                trigger: '.statement-text',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            x: -30,
            opacity: 0,
            duration: 1,
            stagger: 0.2
        });
        
        gsap.from('.vision-graphic', {
            scrollTrigger: {
                trigger: '.vision-graphic',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.5,
            opacity: 0,
            duration: 1
        });
        
        // Vision cards animation
        gsap.utils.toArray('.vision-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.1
            });
        });
        
        // Mission statement animation
        gsap.from('.mission-quote', {
            scrollTrigger: {
                trigger: '.mission-quote',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.9,
            opacity: 0,
            duration: 1
        });
        
        // Mission pillars animation
        gsap.utils.toArray('.pillar').forEach((pillar, index) => {
            gsap.from(pillar, {
                scrollTrigger: {
                    trigger: pillar,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.1
            });
        });
        
        // Timeline items animation
        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                x: index % 2 === 0 ? -50 : 50,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.1
            });
        });
    } else {
        // Fallback without ScrollTrigger
        gsap.from('.statement-text h2', {
            x: -50,
            opacity: 0,
            duration: 1,
            delay: 0.5
        });
        
        gsap.utils.toArray('.vision-card').forEach((card, index) => {
            gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: 1 + index * 0.1
            });
        });
    }
}

// Vision Graphic Animations
function initVisionGraphic() {
    const centralCore = document.querySelector('.central-core');
    const visionRings = document.querySelectorAll('.vision-ring');
    
    if (!centralCore) return;
    
    // Add interactive hover effect
    centralCore.addEventListener('mouseenter', () => {
        gsap.to(centralCore, {
            scale: 1.2,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        gsap.to(visionRings, {
            borderColor: '#00ff88',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    centralCore.addEventListener('mouseleave', () => {
        gsap.to(centralCore, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        gsap.to(visionRings, {
            borderColor: '',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    // Add pulse effect on click
    centralCore.addEventListener('click', () => {
        gsap.to(centralCore, {
            scale: 1.3,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
        
        // Create ripple effect
        createRippleEffect(centralCore);
    });
}

// Create ripple effect
function createRippleEffect(element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    
    ripple.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 255, 136, 0.3), transparent);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 1000;
    `;
    
    document.body.appendChild(ripple);
    
    gsap.to(ripple, {
        width: 200,
        height: 200,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
    });
}

// Timeline Interactions
function initTimelineInteractions() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        const content = item.querySelector('.timeline-content');
        
        if (!content) return;
        
        // Add hover effect
        item.addEventListener('mouseenter', () => {
            gsap.to(content, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(content, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        // Add click to expand functionality
        let isExpanded = false;
        
        content.addEventListener('click', () => {
            isExpanded = !isExpanded;
            
            if (isExpanded) {
                gsap.to(content, {
                    height: 'auto',
                    duration: 0.5,
                    ease: 'power2.out'
                });
            } else {
                gsap.to(content, {
                    height: '',
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    });
}

// Smooth Scroll Behavior
function initSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add parallax effect to vision sections
function initParallaxEffects() {
    const visionStatement = document.querySelector('.vision-statement');
    const missionStatement = document.querySelector('.mission-statement');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        if (visionStatement) {
            const parallax1 = scrolled * 0.3;
            const statementVisual = visionStatement.querySelector('.statement-visual');
            if (statementVisual) {
                statementVisual.style.transform = `translateY(${parallax1}px)`;
            }
        }
        
        if (missionStatement) {
            const parallax2 = scrolled * 0.2;
            missionStatement.style.transform = `translateY(${parallax2}px)`;
        }
    });
}

// Initialize parallax effects
initParallaxEffects();

// Add intersection observer for fade-in animations
function initIntersectionObserver() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Initialize intersection observer
initIntersectionObserver();

// Add CSS for fade-in animation
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    .fade-in {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeStyle);

// Add animated counter for metrics (if any)
function initCounters() {
    const counters = document.querySelectorAll('.metric-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        let current = 0;
        const increment = target / 100;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start counter when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Initialize counters
initCounters();

// Add interactive hover effects for vision cards
function initVisionCardInteractions() {
    const visionCards = document.querySelectorAll('.vision-card');
    
    visionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Animate card features
            const features = this.querySelectorAll('.feature');
            gsap.to(features, {
                y: -5,
                opacity: 1,
                duration: 0.3,
                stagger: 0.05,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            const features = this.querySelectorAll('.feature');
            gsap.to(features, {
                y: 0,
                opacity: 0.8,
                duration: 0.3,
                stagger: 0.05,
                ease: 'power2.out'
            });
        });
    });
}

// Initialize vision card interactions
initVisionCardInteractions();

// Add scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00d4ff, #00ff88);
        z-index: 9999;
        transition: width 0.2s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (window.scrollY / scrollHeight) * 100;
        progressBar.style.width = scrollProgress + '%';
    });
}

// Initialize scroll progress
initScrollProgress();
