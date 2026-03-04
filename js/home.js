// Home Page Specific JavaScript

// Initialize home page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize smooth scroll behavior
    initSmoothScroll();
});

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (!loadingScreen) return;
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
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
    
    // Hero animations
    gsap.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.5
    });
    
    gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.8
    });
    
    gsap.from('.hero-actions', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 1.1
    });
    
    // Quick preview cards animation
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.utils.toArray('.preview-card').forEach((card, index) => {
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
    } else {
        // Fallback without ScrollTrigger
        gsap.utils.toArray('.preview-card').forEach((card, index) => {
            gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: 1.5 + index * 0.1
            });
        });
    }
}

// Smooth Scroll Behavior
function initSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (hero && heroVisual) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            heroVisual.style.transform = `translateY(${parallax}px)`;
        });
    }
}

// Add interactive hover effects for preview cards
document.addEventListener('DOMContentLoaded', function() {
    const previewCards = document.querySelectorAll('.preview-card');
    
    previewCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add glow effect on hover
            this.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            // Remove glow effect
            this.style.boxShadow = '';
        });
    });
});

// Add typing effect to hero title (optional enhancement)
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title .highlight');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '3px solid #00d4ff';
    heroTitle.style.animation = 'blink 1s infinite';
    
    let index = 0;
    
    function type() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        } else {
            heroTitle.style.borderRight = 'none';
            heroTitle.style.animation = 'none';
        }
    }
    
    // Start typing after loading screen
    setTimeout(type, 2500);
}

// Add blinking cursor animation
const style = document.createElement('style');
style.textContent = `
    @keyframes blink {
        0%, 50% { border-color: transparent; }
        51%, 100% { border-color: #00d4ff; }
    }
`;
document.head.appendChild(style);

// Initialize typing effect if enabled
// initTypingEffect(); // Uncomment to enable typing effect

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

// Add mouse tracking effect for neural graphic
function initMouseTracking() {
    const neuralGraphic = document.querySelector('.neural-graphic');
    if (!neuralGraphic) return;
    
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = neuralGraphic.getBoundingClientRect();
        
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        
        const angleX = (clientY - centerY) / 30;
        const angleY = (clientX - centerX) / 30;
        
        neuralGraphic.style.transform = `perspective(1000px) rotateX(${-angleX}deg) rotateY(${angleY}deg)`;
    });
    
    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        neuralGraphic.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

// Initialize mouse tracking
initMouseTracking();

// Add particle explosion effect on button clicks
function initParticleExplosion() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createParticleExplosion(e.pageX, e.pageY);
        });
    });
}

function createParticleExplosion(x, y) {
    const colors = ['#00d4ff', '#ff00ff', '#00ff88'];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 5 + Math.random() * 5;
        const lifetime = 1000 + Math.random() * 1000;
        
        let opacity = 1;
        let currentX = 0;
        let currentY = 0;
        
        const animate = () => {
            currentX += Math.cos(angle) * velocity;
            currentY += Math.sin(angle) * velocity;
            opacity -= 0.02;
            
            particle.style.transform = `translate(${currentX}px, ${currentY}px)`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Initialize particle explosion
initParticleExplosion();

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
