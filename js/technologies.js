// Technologies Page Specific JavaScript

// Initialize technologies page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize tech item interactions
    initTechItemInteractions();
    
    // Initialize project progress animations
    initProjectProgress();
    
    // Initialize stack item interactions
    initStackItemInteractions();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize tech animations
    initTechAnimations();
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
    
    // Overview content animations
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.from('.overview-text h2', {
            scrollTrigger: {
                trigger: '.overview-text',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            x: -50,
            opacity: 0,
            duration: 1
        });
        
        gsap.from('.overview-text p', {
            scrollTrigger: {
                trigger: '.overview-text',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            x: -30,
            opacity: 0,
            duration: 1,
            stagger: 0.2
        });
        
        gsap.from('.stat-item', {
            scrollTrigger: {
                trigger: '.overview-stats',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        });
        
        // Tech items animation
        gsap.utils.toArray('.tech-item').forEach((item, index) => {
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
        
        // Project cards animation
        gsap.utils.toArray('.project-card').forEach((card, index) => {
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
        
        // Stack categories animation
        gsap.utils.toArray('.stack-category').forEach((category, index) => {
            gsap.from(category, {
                scrollTrigger: {
                    trigger: category,
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
        gsap.from('.overview-text h2', {
            x: -50,
            opacity: 0,
            duration: 1,
            delay: 0.5
        });
        
        gsap.utils.toArray('.tech-item').forEach((item, index) => {
            gsap.from(item, {
                x: index % 2 === 0 ? -50 : 50,
                opacity: 0,
                duration: 0.8,
                delay: 1 + index * 0.1
            });
        });
    }
}

// Tech Item Interactions
function initTechItemInteractions() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        const techIcon = item.querySelector('.tech-icon');
        const techAnimation = item.querySelector('.tech-animation');
        
        // Enhanced hover effect
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                x: 20,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            if (techIcon) {
                gsap.to(techIcon, {
                    scale: 1.1,
                    rotation: 5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
            
            if (techAnimation) {
                gsap.to(techAnimation, {
                    scale: 1.2,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            if (techIcon) {
                gsap.to(techIcon, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
            
            if (techAnimation) {
                gsap.to(techAnimation, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        // Click to expand details
        const techDetails = item.querySelector('.tech-details');
        if (techDetails) {
            let isExpanded = false;
            
            item.addEventListener('click', (e) => {
                // Prevent click if clicking on a link
                if (e.target.tagName === 'A') return;
                
                isExpanded = !isExpanded;
                
                if (isExpanded) {
                    gsap.to(techDetails, {
                        height: 'auto',
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                } else {
                    gsap.to(techDetails, {
                        height: 0,
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            });
        }
    });
}

// Project Progress Animations
function initProjectProgress() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        
        // Set initial width to 0
        bar.style.width = '0%';
        
        // Animate to target width when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.to(bar, {
                        width: targetWidth,
                        duration: 1.5,
                        ease: 'power2.out',
                        delay: 0.3
                    });
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(bar);
    });
}

// Stack Item Interactions
function initStackItemInteractions() {
    const stackItems = document.querySelectorAll('.stack-item');
    
    stackItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.05,
                backgroundColor: '#00d4ff',
                color: '#0a0a0f',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                backgroundColor: '',
                color: '',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        // Add click to copy functionality
        item.addEventListener('click', () => {
            const text = item.textContent;
            navigator.clipboard.writeText(text).then(() => {
                // Show feedback
                const originalText = item.textContent;
                item.textContent = 'Copied!';
                item.style.backgroundColor = '#00ff88';
                
                setTimeout(() => {
                    item.textContent = originalText;
                    item.style.backgroundColor = '';
                }, 1000);
            });
        });
    });
}

// Tech Animations
function initTechAnimations() {
    // Neural Network Animation
    const neuralNetworks = document.querySelectorAll('.neural-network');
    neuralNetworks.forEach(network => {
        const neurons = network.querySelectorAll('.neuron');
        
        neurons.forEach((neuron, index) => {
            gsap.to(neuron, {
                scale: 1.5,
                opacity: 1,
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                delay: index * 0.3,
                ease: 'power2.inOut'
            });
        });
    });
    
    // Data Flow Animation
    const dataFlows = document.querySelectorAll('.data-flow');
    dataFlows.forEach(flow => {
        const dataPoints = flow.querySelectorAll('.data-point');
        
        dataPoints.forEach((point, index) => {
            gsap.to(point, {
                x: 100,
                opacity: 0,
                duration: 2,
                repeat: -1,
                delay: index * 0.7,
                ease: 'power2.out',
                onRepeat: () => {
                    gsap.set(point, { x: 0, opacity: 1 });
                }
            });
        });
    });
    
    // Quantum Circuit Animation
    const quantumCircuits = document.querySelectorAll('.quantum-circuit');
    quantumCircuits.forEach(circuit => {
        const qubits = circuit.querySelectorAll('.qubit');
        
        qubits.forEach((qubit, index) => {
            gsap.to(qubit, {
                rotation: 360,
                duration: 4,
                repeat: -1,
                delay: index * 1.3,
                ease: 'none'
            });
        });
    });
    
    // Human-AI Interface Animation
    const humanAiInterfaces = document.querySelectorAll('.human-ai-interface');
    humanAiInterfaces.forEach(interface => {
        const connection = interface.querySelector('.connection');
        
        if (connection) {
            gsap.to(connection, {
                opacity: 1,
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut'
            });
        }
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

// Add parallax effect to tech overview
function initParallaxEffects() {
    const techOverview = document.querySelector('.tech-overview');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        if (techOverview) {
            const parallax = scrolled * 0.3;
            const overviewVisual = techOverview.querySelector('.overview-stats');
            if (overviewVisual) {
                overviewVisual.style.transform = `translateY(${parallax}px)`;
            }
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

// Add interactive filter for tech items
function initTechFilter() {
    const filterButtons = document.querySelectorAll('.tech-filter-btn');
    const techItems = document.querySelectorAll('.tech-item');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter tech items
            techItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    gsap.to(item, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        display: 'block'
                    });
                } else {
                    gsap.to(item, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.5,
                        onComplete: () => {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// Initialize tech filter
initTechFilter();

// Add scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00d4ff, #ff00ff);
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

// Add keyboard navigation for tech items
function initKeyboardNavigation() {
    const techItems = document.querySelectorAll('.tech-item');
    let currentIndex = -1;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            currentIndex = Math.min(currentIndex + 1, techItems.length - 1);
            focusTechItem(currentIndex);
        } else if (e.key === 'ArrowLeft') {
            currentIndex = Math.max(currentIndex - 1, 0);
            focusTechItem(currentIndex);
        } else if (e.key === 'Enter' && currentIndex >= 0) {
            techItems[currentIndex].click();
        }
    });
    
    function focusTechItem(index) {
        techItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('keyboard-focus');
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                item.classList.remove('keyboard-focus');
            }
        });
    }
}

// Initialize keyboard navigation
initKeyboardNavigation();

// Add CSS for keyboard focus
const keyboardStyle = document.createElement('style');
keyboardStyle.textContent = `
    .keyboard-focus {
        outline: 3px solid #00d4ff;
        outline-offset: 3px;
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
    }
`;
document.head.appendChild(keyboardStyle);
