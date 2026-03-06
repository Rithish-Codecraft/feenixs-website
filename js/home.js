// Home Page Specific JavaScript with Advanced AI Aesthetic

// Initialize home page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize 3D neural network
    init3DNeuralNetwork();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize parallax effects
    initParallaxEffects();
    
    // Initialize intersection observer
    initIntersectionObserver();
    
    // Initialize mouse tracking
    initMouseTracking();
    
    // Initialize particle burst on buttons
    initParticleBurst();
    
    // Initialize AI grid animation
    initAIGridAnimation();
    
    // Initialize AI waveform
    initAIWaveform();
    
    // Initialize glow trails
    initGlowTrails();
    
    // Initialize scroll progress
    initScrollProgress();
});

// Enhanced Scroll Animations with GSAP
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
    
    // Hero content animations with stagger
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.from('.hero-text', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            x: -50,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-title', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
        
        gsap.from('.hero-actions', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top 60%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
        
        // Neural graphic animation
        gsap.from('.neural-graphic', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top 50%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.5,
            opacity: 0,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)'
        });
        
        // AI Grid Floor animation
        gsap.from('.ai-grid-floor', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top 30%',
                toggleActions: 'play none none reverse'
            },
            y: 100,
            opacity: 0,
            duration: 2,
            ease: 'power4.out'
        });
        
        // Particle field animation
        gsap.from('.particle-field', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top 20%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            duration: 1.5,
            ease: 'power2.out'
        });
        
        // AI Waveform animation
        gsap.from('.ai-waveform', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top 10%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
        
        // Glow trails animation
        gsap.from('.glow-trail', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top 5%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            duration: 1.8,
            ease: 'power4.out'
        });
    }
}

// Enhanced Smooth Scroll with Parallax
function initSmoothScroll() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Subtle parallax on scroll
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.neural-graphic, .ai-grid-floor, .particle-field');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Enhanced Parallax Effects
function initParallaxEffects() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Mouse parallax for neural graphic
    heroSection.addEventListener('mousemove', (e) => {
        const neuralGraphic = document.querySelector('.neural-graphic');
        if (!neuralGraphic) return;
        
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) * 0.02;
        const moveY = (y - centerY) * 0.02;
        
        gsap.to(neuralGraphic, {
            x: moveX,
            y: moveY,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
    
    // Reset position on mouse leave
    heroSection.addEventListener('mouseleave', () => {
        const neuralGraphic = document.querySelector('.neural-graphic');
        if (neuralGraphic) {
            gsap.to(neuralGraphic, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    });
}

// Enhanced Mouse Tracking
function initMouseTracking() {
    const neuralGraphic = document.querySelector('.neural-graphic');
    if (!neuralGraphic) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth follow animation
    function animateNeuralGraphic() {
        const dx = mouseX - currentX;
        const dy = mouseY - currentY;
        
        currentX += dx * 0.05;
        currentY += dy * 0.05;
        
        const coreNode = neuralGraphic.querySelector('.core-node');
        if (coreNode) {
            const moveX = dx * 0.02;
            const moveY = dy * 0.02;
            
            gsap.to(coreNode, {
                x: moveX,
                y: moveY,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
        
        requestAnimationFrame(animateNeuralGraphic);
    }
    
    animateNeuralGraphic();
}

// Enhanced Particle Burst on Button Hover
function initParticleBurst() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            createParticleBurst(e.target);
        });
    });
}

function createParticleBurst(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create burst particles
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'btn-particle';
        
        const angle = (Math.PI * 2 * i) / 12;
        const velocity = 2 + Math.random() * 3;
        const lifetime = 1000 + Math.random() * 1000;
        
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        
        document.body.appendChild(particle);
        
        // Animate particle
        gsap.fromTo(particle, {
            x: Math.cos(angle) * velocity,
            y: Math.sin(angle) * velocity,
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            duration: lifetime / 1000,
            ease: 'power2.out'
        });
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, lifetime);
    }
}

// AI Grid Animation
function initAIGridAnimation() {
    const gridLines = document.querySelectorAll('.grid-line');
    
    gridLines.forEach((line, index) => {
        // Animate grid lines with stagger
        gsap.fromTo(line, {
            opacity: [0.1, 0.3, 0.1],
            duration: 3 + Math.random() * 2,
            repeat: -1,
            ease: 'power2.inOut'
        });
    });
}

// AI Waveform Animation
function initAIWaveform() {
    const waveBars = document.querySelectorAll('.wave-bar');
    
    // Continuous waveform animation
    function animateWaveform() {
        waveBars.forEach((bar, index) => {
            const randomHeight = 20 + Math.random() * 25;
            gsap.to(bar, {
                height: randomHeight,
                duration: 0.5 + Math.random() * 0.5,
                ease: 'power2.inOut'
            });
        });
    }
    
    // Start continuous animation
    setInterval(animateWaveform, 2000);
}

// Glow Trails Animation
function initGlowTrails() {
    const trailParticles = document.querySelectorAll('.trail-particle');
    
    trailParticles.forEach((particle, index) => {
        // Animate trail particles with different timings
        gsap.to(particle, {
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            duration: 3,
            repeat: -1,
            delay: index * 0.3,
            ease: 'power2.inOut'
        });
    });
}

// Enhanced Intersection Observer
function initIntersectionObserver() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, options);
    
    // Observe all animated elements
    document.querySelectorAll('.hero-text, .hero-title, .hero-actions, .neural-graphic').forEach(el => {
        observer.observe(el);
    });
}

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;
    
    // Enhanced loading animation
    gsap.timeline()
        .to('.loading-text', {
            opacity: [0.5, 1, 0.5],
            duration: 1.5,
            repeat: -1,
            ease: 'power2.inOut'
        })
        .to('.neural-network .node', {
            scale: [1, 1.2, 1],
            rotation: '+=360',
            duration: 2,
            stagger: 0.1,
            repeat: -1,
            ease: 'power2.inOut'
        });
    
    // Hide loading screen after animation
    setTimeout(() => {
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                loadingScreen.style.display = 'none';
            }
        });
    }, 2000);
}
function initParticleExplosion() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createParticleExplosion(e.pageX, e.pageY);
        });
    });
}

function createParticleExplosion(x, y) {
    const colors = ['#AC8B53', '#5374AC', '#8B5374'];
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
        background: linear-gradient(90deg, #AC8B53, #5374AC);
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
