// UX Enhancements for Feenixs Website

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollProgress();
    initTechCards();
    initFeedbackForm();
    initSmoothScrolling();
    initRevealAnimations();
    initMobileMenu();
    initParticleEffects();
    initFormValidation();
});

// Ultra-Smooth Scroll Progress Indicator
function initScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    
    if (!scrollProgress) return;
    
    let lastScrollY = 0;
    let animationFrame;
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = Math.min((winScroll / height) * 100, 100);
        
        // Cancel previous animation frame
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        
        // Animate the width change
        animationFrame = requestAnimationFrame(() => {
            scrollProgress.style.width = scrolled + '%';
        });
        
        lastScrollY = winScroll;
    });
    
    // Add glow effect on scroll
    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;
        const scrollProgress = Math.min((scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100);
        
        // Enhanced glow effect
        if (scrollProgress > 10) {
            scrollProgress.style.boxShadow = '0 0 25px rgba(46, 125, 175, 0.8)';
        } else if (scrollProgress > 50) {
            scrollProgress.style.boxShadow = '0 0 20px rgba(46, 125, 175, 0.6)';
        } else {
            scrollProgress.style.boxShadow = '0 0 15px var(--primary-color)';
        }
    });
}

// Technology Cards Expand/Collapse
function initTechCards() {
    const techCards = document.querySelectorAll('.tech-card');
    
    techCards.forEach(card => {
        card.addEventListener('click', function() {
            const isExpanded = this.classList.contains('expanded');
            
            // Close other cards
            techCards.forEach(otherCard => {
                if (otherCard !== this) {
                    otherCard.classList.remove('expanded');
                    const otherIcon = otherCard.querySelector('.tech-expand i');
                    if (otherIcon) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Toggle current card
            this.classList.toggle('expanded');
            
            // Rotate expand icon
            const expandIcon = this.querySelector('.tech-expand i');
            if (expandIcon) {
                expandIcon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
            }
            
            // Add animation class
            this.classList.add('card-animating');
            setTimeout(() => {
                this.classList.remove('card-animating');
            }, 400);
        });
    });
}

// Feedback Form Handler
function initFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (!feedbackForm) return;
    
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const feedback = document.getElementById('feedback').value.trim();
        
        // Validate form
        if (!validateFeedbackForm(name, email, feedback)) {
            return;
        }
        
        // Create CSV entry
        const timestamp = new Date().toISOString();
        const escapedFeedback = feedback.replace(/"/g, '""');
        const csvEntry = `"${name}","${email}","${escapedFeedback}","${timestamp}"\n`;
        
        // Check if there's existing data
        let csvContent = 'name,email,feedback,timestamp\n';
        
        // Add new entry
        csvContent += csvEntry;
        
        // Create and download CSV
        downloadCSV(csvContent, 'feedback.csv');
        
        // Show success message
        showNotification('Success!', 'Your feedback has been submitted successfully.', 'success');
        
        // Reset form
        feedbackForm.reset();
    });
}

// Form Validation
function validateFeedbackForm(name, email, feedback) {
    // Clear previous errors
    clearFormErrors();
    
    let isValid = true;
    
    // Validate name
    if (!name || name.length < 2) {
        showFieldError('name', 'Please enter your name (at least 2 characters)');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate feedback
    if (!feedback || feedback.length < 10) {
        showFieldError('feedback', 'Please provide feedback (at least 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ff4444;
        font-size: 0.8rem;
        margin-top: 5px;
    `;
    
    field.parentNode.appendChild(errorDiv);
    
    // Remove error on input
    field.addEventListener('input', function() {
        clearFieldError(fieldId);
    });
}

// Clear field error
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Clear all form errors
function clearFormErrors() {
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(el => el.remove());
    
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
}

// Download CSV
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Enhanced Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Enhanced smooth scrolling with easing
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }
        });
    });
    
    // Add parallax effect to scrolling
    let ticking = false;
    let lastScrollY = 0;
    
    function updateParallax() {
        const scrollY = window.pageYOffset;
        const delta = scrollY - lastScrollY;
        lastScrollY = scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Parallax effect for background elements
                const parallaxElements = document.querySelectorAll('.parallax-element');
                parallaxElements.forEach(element => {
                    const speed = element.dataset.speed || 0.5;
                    const yPos = -(scrollY * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateParallax);
}

// Reveal Animations
function initRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });
    
    // Observe cards
    const cards = document.querySelectorAll('.onboarding-card, .tech-card, .feature-card, .resource-card');
    cards.forEach((card, index) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// Mobile Menu
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Update aria-expanded
        const isExpanded = this.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// Particle Effects
function initParticleEffects() {
    // Initialize background particles
    const backgroundParticles = document.getElementById('background-particles');
    if (backgroundParticles) {
        createParticleSystem(backgroundParticles, {
            particleCount: 50,
            particleSize: 2,
            particleColor: '#AC8B53',
            speed: 0.5
        });
    }
    
    // Initialize hero particles
    const heroParticles = document.getElementById('hero-particles');
    if (heroParticles) {
        createParticleSystem(heroParticles, {
            particleCount: 30,
            particleSize: 3,
            particleColor: '#5374AC',
            speed: 0.3
        });
    }
    
    // Initialize neural network 3D
    const neuralNetwork3D = document.getElementById('neural-network-3d');
    if (neuralNetwork3D) {
        createNeuralNetwork(neuralNetwork3D);
    }
}

// Simple Particle System
function createParticleSystem(container, options) {
    const {
        particleCount = 50,
        particleSize = 2,
        particleColor = '#AC8B53',
        speed = 0.5
    } = options;
    
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${particleSize}px;
            height: ${particleSize}px;
            background: ${particleColor};
            border-radius: 50%;
            opacity: 0.6;
            pointer-events: none;
        `;
        
        container.appendChild(particle);
        
        particles.push({
            element: particle,
            x: Math.random() * 100,
            y: Math.random() * 100,
            vx: (Math.random() - 0.5) * speed,
            vy: (Math.random() - 0.5) * speed
        });
    }
    
    // Animate particles
    function animateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around
            if (particle.x < 0) particle.x = 100;
            if (particle.x > 100) particle.x = 0;
            if (particle.y < 0) particle.y = 100;
            if (particle.y > 100) particle.y = 0;
            
            particle.element.style.left = particle.x + '%';
            particle.element.style.top = particle.y + '%';
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Neural Network Visualization
function createNeuralNetwork(container) {
    const nodes = [];
    const connections = [];
    
    // Create nodes
    for (let i = 0; i < 8; i++) {
        const node = document.createElement('div');
        node.className = 'neural-node';
        node.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: #5374AC;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(83, 116, 172, 0.8);
            pointer-events: none;
        `;
        
        const angle = (i / 8) * Math.PI * 2;
        const radius = 50 + Math.random() * 50;
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;
        
        node.style.left = x + '%';
        node.style.top = y + '%';
        
        container.appendChild(node);
        
        nodes.push({
            element: node,
            x: x,
            y: y
        });
    }
    
    // Create connections
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (Math.random() > 0.5) {
                const connection = document.createElement('div');
                connection.className = 'neural-connection';
                connection.style.cssText = `
                    position: absolute;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, #AC8B53, transparent);
                    opacity: 0.3;
                    pointer-events: none;
                    transform-origin: left center;
                `;
                
                container.appendChild(connection);
                
                connections.push({
                    element: connection,
                    from: nodes[i],
                    to: nodes[j]
                });
            }
        }
    }
    
    // Animate connections
    function animateConnections() {
        connections.forEach(connection => {
            const dx = connection.to.x - connection.from.x;
            const dy = connection.to.y - connection.from.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            connection.element.style.width = distance + '%';
            connection.element.style.left = connection.from.x + '%';
            connection.element.style.top = connection.from.y + '%';
            connection.element.style.transform = `rotate(${angle}deg)`;
        });
        
        requestAnimationFrame(animateConnections);
    }
    
    animateConnections();
}

// Show notification
function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 20px;
        background: linear-gradient(135deg, #AC8B53, #5374AC);
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 5px;">${title}</div>
        <div style="font-size: 0.9rem;">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .card-animating {
        animation: cardPulse 0.4s ease;
    }
    
    @keyframes cardPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .field-error {
        animation: shake 0.3s ease;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .error {
        border-color: #ff4444 !important;
        box-shadow: 0 0 10px rgba(255, 68, 68, 0.3);
    }
`;

document.head.appendChild(style);
