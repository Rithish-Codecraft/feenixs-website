// Founder Page Specific JavaScript

// Initialize founder page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize founder image
    initFounderImage();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize profile interactions
    initProfileInteractions();
    
    // Initialize expertise level animations
    initExpertiseAnimations();
    
    // Initialize timeline interactions
    initTimelineInteractions();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize social links
    initSocialLinks();
});

// Initialize Founder Image
function initFounderImage() {
    const founderImage = document.querySelector('.founder-profile-image');
    const fallbackIcon = document.querySelector('.founder-fallback-icon');
    
    if (founderImage) {
        console.log('Initializing founder image...');
        
        // Check if image loads successfully
        founderImage.addEventListener('load', function() {
            console.log('Founder profile image loaded successfully');
            founderImage.style.opacity = '1';
            founderImage.style.visibility = 'visible';
        });
        
        // Handle image loading errors
        founderImage.addEventListener('error', function() {
            console.log('Founder profile image failed to load, showing fallback icon');
            founderImage.style.display = 'none';
            if (fallbackIcon) {
                fallbackIcon.style.display = 'block';
            }
        });
        
        // Force image reload if needed
        const imgSrc = founderImage.src;
        founderImage.src = ''; // Clear src
        setTimeout(() => {
            founderImage.src = imgSrc; // Reset src to force reload
        }, 100);
    }
}

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
    
    // Profile content animations
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.from('.founder-avatar', {
            scrollTrigger: {
                trigger: '.founder-avatar',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.5,
            opacity: 0,
            duration: 1
        });
        
        gsap.from('.founder-info h2', {
            scrollTrigger: {
                trigger: '.founder-info',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            x: 50,
            opacity: 0,
            duration: 1
        });
        
        gsap.from('.founder-bio', {
            scrollTrigger: {
                trigger: '.founder-bio',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            x: 30,
            opacity: 0,
            duration: 1
        });
        
        gsap.from('.detail-item', {
            scrollTrigger: {
                trigger: '.detail-grid',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        });
        
        // Expertise cards animation
        gsap.utils.toArray('.expertise-card').forEach((card, index) => {
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
        
        // Philosophy elements animation
        gsap.from('.philosophy-quote', {
            scrollTrigger: {
                trigger: '.philosophy-quote',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.9,
            opacity: 0,
            duration: 1
        });
        
        gsap.utils.toArray('.principle').forEach((principle, index) => {
            gsap.from(principle, {
                scrollTrigger: {
                    trigger: principle,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.1
            });
        });
    } else {
        // Fallback without ScrollTrigger
        gsap.from('.founder-avatar', {
            scale: 0.5,
            opacity: 0,
            duration: 1,
            delay: 0.5
        });
        
        gsap.from('.founder-info h2', {
            x: 50,
            opacity: 0,
            duration: 1,
            delay: 0.8
        });
        
        gsap.utils.toArray('.expertise-card').forEach((card, index) => {
            gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: 1.5 + index * 0.1
            });
        });
    }
}

// Profile Interactions
function initProfileInteractions() {
    const founderAvatar = document.querySelector('.founder-avatar');
    const socialLinks = document.querySelectorAll('.social-link');
    
    if (founderAvatar) {
        // Add interactive hover effect
        founderAvatar.addEventListener('mouseenter', () => {
            gsap.to(founderAvatar, {
                scale: 1.1,
                rotation: 5,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // Add glow effect
            gsap.to('.avatar-glow', {
                opacity: 0.6,
                scale: 1.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        founderAvatar.addEventListener('mouseleave', () => {
            gsap.to(founderAvatar, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to('.avatar-glow', {
                opacity: 0.3,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        // Add click effect
        founderAvatar.addEventListener('click', () => {
            gsap.to(founderAvatar, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
            
            // Create ripple effect
            createRippleEffect(founderAvatar);
        });
    }
    
    // Social links interactions
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                scale: 1.2,
                rotation: 360,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
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
        width: 300,
        height: 300,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
    });
}

// Expertise Level Animations
function initExpertiseAnimations() {
    const expertiseCards = document.querySelectorAll('.expertise-card');
    
    expertiseCards.forEach(card => {
        const levelBar = card.querySelector('.level-fill');
        const levelText = card.querySelector('.level-text');
        
        if (levelBar && levelText) {
            // Set initial width to 0
            const targetWidth = levelBar.style.width;
            levelBar.style.width = '0%';
            
            // Animate when card is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        gsap.to(levelBar, {
                            width: targetWidth,
                            duration: 1.5,
                            ease: 'power2.out',
                            delay: 0.3
                        });
                        
                        // Animate level text
                        const level = levelText.textContent;
                        let currentLevel = 0;
                        const targetLevel = parseInt(level);
                        
                        const animateLevel = () => {
                            if (currentLevel < targetLevel) {
                                currentLevel++;
                                levelText.textContent = currentLevel + '%';
                                requestAnimationFrame(animateLevel);
                            }
                        };
                        
                        setTimeout(animateLevel, 300);
                        
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(card);
        }
        
        // Add hover effect
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // Animate expertise icon
            const icon = card.querySelector('.expertise-icon');
            if (icon) {
                gsap.to(icon, {
                    scale: 1.1,
                    rotation: 5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            const icon = card.querySelector('.expertise-icon');
            if (icon) {
                gsap.to(icon, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
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
            
            // Animate marker dot
            const markerDot = item.querySelector('.marker-dot');
            if (markerDot) {
                gsap.to(markerDot, {
                    scale: 1.5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(content, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            const markerDot = item.querySelector('.marker-dot');
            if (markerDot) {
                gsap.to(markerDot, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
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
                
                // Highlight timeline line
                const markerLine = item.querySelector('.marker-line');
                if (markerLine) {
                    gsap.to(markerLine, {
                        backgroundColor: '#00ff88',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            } else {
                gsap.to(content, {
                    height: '',
                    duration: 0.5,
                    ease: 'power2.out'
                });
                
                const markerLine = item.querySelector('.marker-line');
                if (markerLine) {
                    gsap.to(markerLine, {
                        backgroundColor: '',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
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

// Social Links
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add subtle animation before navigation
            gsap.to(link, {
                scale: 0.9,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut',
                onComplete: () => {
                    // Navigate after animation
                    window.open(link.href, '_blank');
                }
            });
            
            e.preventDefault();
        });
    });
}

// Add parallax effect to founder sections
function initParallaxEffects() {
    const founderProfile = document.querySelector('.founder-profile');
    const philosophySection = document.querySelector('.founder-philosophy');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        if (founderProfile) {
            const parallax1 = scrolled * 0.3;
            const profileVisual = founderProfile.querySelector('.founder-visual');
            if (profileVisual) {
                profileVisual.style.transform = `translateY(${parallax1}px)`;
            }
        }
        
        if (philosophySection) {
            const parallax2 = scrolled * 0.2;
            philosophySection.style.transform = `translateY(${parallax2}px)`;
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

// Add interactive detail items
function initDetailItems() {
    const detailItems = document.querySelectorAll('.detail-item');
    
    detailItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                y: -5,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // Animate icon
            const icon = item.querySelector('.detail-icon');
            if (icon) {
                gsap.to(icon, {
                    scale: 1.1,
                    rotation: 5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            const icon = item.querySelector('.detail-icon');
            if (icon) {
                gsap.to(icon, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    });
}

// Initialize detail items
initDetailItems();

// Add scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00ff88, #ff00ff);
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

// Add typing effect for philosophy quote
function initTypingEffect() {
    const philosophyQuote = document.querySelector('.philosophy-quote');
    if (!philosophyQuote) return;
    
    const text = philosophyQuote.textContent;
    philosophyQuote.textContent = '';
    philosophyQuote.style.borderRight = '3px solid #ff00ff';
    philosophyQuote.style.animation = 'blink 1s infinite';
    
    let index = 0;
    
    function type() {
        if (index < text.length) {
            philosophyQuote.textContent += text.charAt(index);
            index++;
            setTimeout(type, 50);
        } else {
            philosophyQuote.style.borderRight = 'none';
            philosophyQuote.style.animation = 'none';
        }
    }
    
    // Start typing when quote is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                type();
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(philosophyQuote);
}

// Initialize typing effect
initTypingEffect();

// Add CSS for blinking cursor
const blinkStyle = document.createElement('style');
blinkStyle.textContent = `
    @keyframes blink {
        0%, 50% { border-color: transparent; }
        51%, 100% { border-color: #ff00ff; }
    }
`;
document.head.appendChild(blinkStyle);
