// Contact Page Specific JavaScript

// Initialize contact page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize FAQ interactions
    initFAQInteractions();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize location interactions
    initLocationInteractions();
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
    
    // Hero content animations
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.from('.hero-text h2', {
            scrollTrigger: {
                trigger: '.hero-text',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            x: -50,
            opacity: 0,
            duration: 1
        });
        
        gsap.from('.hero-text p', {
            scrollTrigger: {
                trigger: '.hero-text',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            x: -30,
            opacity: 0,
            duration: 1,
            stagger: 0.2
        });
        
        gsap.from('.contact-metrics', {
            scrollTrigger: {
                trigger: '.contact-metrics',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        });
        
        gsap.from('.contact-graphic', {
            scrollTrigger: {
                trigger: '.contact-graphic',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.5,
            opacity: 0,
            duration: 1
        });
        
        // Contact items animation
        gsap.utils.toArray('.contact-item').forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                x: -50,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.1
            });
        });
        
        // Contact form animation
        gsap.from('.contact-form-section', {
            scrollTrigger: {
                trigger: '.contact-form-section',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            x: 50,
            opacity: 0,
            duration: 1
        });
        
        // FAQ items animation
        gsap.utils.toArray('.faq-item').forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.1
            });
        });
        
        // Location cards animation
        gsap.utils.toArray('.location-card').forEach((card, index) => {
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
        gsap.from('.hero-text h2', {
            x: -50,
            opacity: 0,
            duration: 1,
            delay: 0.5
        });
        
        gsap.utils.toArray('.contact-item').forEach((item, index) => {
            gsap.from(item, {
                x: -50,
                opacity: 0,
                duration: 0.8,
                delay: 1 + index * 0.1
            });
        });
    }
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;
            const newsletter = document.getElementById('contact-newsletter').checked;
            
            // Validate form
            if (!validateContactForm(name, email, subject, message)) {
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            const success = await submitContactForm(name, email, subject, message);
            
            if (success) {
                // Show success message
                showFormMessage('success', 'Message sent successfully! We\'ll get back to you soon.');
                contactForm.reset();
                
                // Subscribe to newsletter if checked
                if (newsletter) {
                    await subscribeNewsletter(email);
                }
                
                // Reset button
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                submitBtn.style.background = 'var(--gradient-accent)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                // Show error message
                showFormMessage('error', 'Failed to send message. Please try again.');
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Validate contact form
function validateContactForm(name, email, subject, message) {
    // Reset previous errors
    clearFormErrors();
    
    let isValid = true;
    
    // Validate name
    if (name.trim().length < 2) {
        showFieldError('contact-name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('contact-email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate subject
    if (!subject) {
        showFieldError('contact-subject', 'Please select a subject');
        isValid = false;
    }
    
    // Validate message
    if (message.trim().length < 10) {
        showFieldError('contact-message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.style.borderColor = '#ff00ff';
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #ff00ff;
        font-size: 0.8rem;
        margin-top: 0.5rem;
    `;
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear form errors
function clearFormErrors() {
    // Reset field borders
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(field => {
        field.style.borderColor = '';
    });
    
    // Remove error messages
    document.querySelectorAll('.field-error').forEach(error => {
        error.remove();
    });
}

// Show form message
function showFormMessage(type, message) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message';
    messageDiv.style.cssText = `
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 10px;
        text-align: center;
        font-weight: 500;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = 'rgba(0, 255, 136, 0.1)';
        messageDiv.style.border = '1px solid #00ff88';
        messageDiv.style.color = '#00ff88';
    } else {
        messageDiv.style.background = 'rgba(255, 0, 255, 0.1)';
        messageDiv.style.border = '1px solid #ff00ff';
        messageDiv.style.color = '#ff00ff';
    }
    
    messageDiv.textContent = message;
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.parentNode.insertBefore(messageDiv, contactForm);
    }
    
    // Animate message
    gsap.from(messageDiv, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        gsap.to(messageDiv, {
            y: -20,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => messageDiv.remove()
        });
    }, 5000);
}

// Submit contact form
async function submitContactForm(name, email, subject, message) {
    try {
        const contactMessage = {
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
        };
        
        // Get existing messages
        const messages = await getMessagesFromCSV();
        messages.push(contactMessage);
        
        // Save messages
        await saveMessagesToCSV(messages);
        
        return true;
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return false;
    }
}

// Get messages from CSV
async function getMessagesFromCSV() {
    try {
        const response = await fetch('../data/messages.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) return [];
        
        const headers = lines[0].split(',').map(h => h.trim());
        const messages = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const message = {};
            
            headers.forEach((header, index) => {
                message[header] = values[index] || '';
            });
            
            messages.push(message);
        }
        
        return messages;
    } catch (error) {
        console.error('Error reading messages CSV:', error);
        return [];
    }
}

// Save messages to CSV
async function saveMessagesToCSV(messages) {
    // Store in localStorage as fallback
    localStorage.setItem('messages', JSON.stringify(messages));
    
    // Create CSV content
    if (messages.length === 0) return;
    
    const headers = Object.keys(messages[0]);
    const csvContent = [
        headers.join(','),
        ...messages.map(message => headers.map(header => `"${message[header]}"`).join(','))
    ].join('\n');
    
    console.log('Messages CSV Content (would be saved to data/messages.csv):');
    console.log(csvContent);
    
    return true;
}

// Subscribe to newsletter
async function subscribeNewsletter(email) {
    try {
        console.log('Newsletter subscription:', email);
        
        // Store in localStorage as fallback
        const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        if (!subscriptions.includes(email)) {
            subscriptions.push(email);
            localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
        }
        
        return true;
    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        return false;
    }
}

// FAQ Interactions
function initFAQInteractions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    gsap.to(otherItem.querySelector('.faq-answer'), {
                        height: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                gsap.to(answer, {
                    height: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                item.classList.add('active');
                gsap.to(answer, {
                    height: answer.scrollHeight,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        // Add hover effect
        question.addEventListener('mouseenter', () => {
            gsap.to(question, {
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        question.addEventListener('mouseleave', () => {
            if (!item.classList.contains('active')) {
                gsap.to(question, {
                    backgroundColor: '',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    });
}

// Form Validation
function initFormValidation() {
    const formFields = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    
    formFields.forEach(field => {
        // Real-time validation
        field.addEventListener('blur', () => {
            validateField(field);
        });
        
        field.addEventListener('input', () => {
            // Clear error on input
            if (field.style.borderColor === '#ff00ff') {
                field.style.borderColor = '';
                const errorDiv = field.parentNode.querySelector('.field-error');
                if (errorDiv) {
                    errorDiv.remove();
                }
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    
    switch (fieldId) {
        case 'contact-name':
            if (value.length < 2) {
                showFieldError(fieldId, 'Name must be at least 2 characters long');
                return false;
            }
            break;
            
        case 'contact-email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(fieldId, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'contact-subject':
            if (!value) {
                showFieldError(fieldId, 'Please select a subject');
                return false;
            }
            break;
            
        case 'contact-message':
            if (value.length < 10) {
                showFieldError(fieldId, 'Message must be at least 10 characters long');
                return false;
            }
            break;
    }
    
    return true;
}

// Location Interactions
function initLocationInteractions() {
    const locationCards = document.querySelectorAll('.location-card');
    
    locationCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // Animate icon
            const icon = card.querySelector('.location-icon');
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
            
            const icon = card.querySelector('.location-icon');
            if (icon) {
                gsap.to(icon, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        card.addEventListener('click', () => {
            const locationName = card.querySelector('h3').textContent;
            showLocationDetails(locationName);
        });
    });
}

// Show location details
function showLocationDetails(locationName) {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--dark-secondary);
        border: 1px solid var(--glass-border);
        border-radius: 15px;
        padding: 2rem;
        z-index: 10000;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        max-width: 400px;
    `;
    
    const locationInfo = getLocationInfo(locationName);
    
    popup.innerHTML = `
        <h3 style="color: var(--text-primary); margin-bottom: 1rem;">${locationName}</h3>
        <div style="color: var(--text-secondary); line-height: 1.6;">
            ${locationInfo}
        </div>
        <button id="close-popup" style="
            background: var(--gradient-primary);
            border: none;
            color: var(--dark-bg);
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 1rem;
        ">Close</button>
    `;
    
    document.body.appendChild(popup);
    
    // Animate popup
    gsap.from(popup, {
        scale: 0.5,
        opacity: 0,
        duration: 0.3,
        ease: 'back.out(1.7)'
    });
    
    // Close popup
    document.getElementById('close-popup').addEventListener('click', () => {
        gsap.to(popup, {
            scale: 0.5,
            opacity: 0,
            duration: 0.3,
            ease: 'back.in(1.7)',
            onComplete: () => popup.remove()
        });
    });
    
    // Close on background click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            gsap.to(popup, {
                scale: 0.5,
                opacity: 0,
                duration: 0.3,
                ease: 'back.in(1.7)',
                onComplete: () => popup.remove()
            });
        }
    });
}

// Get location information
function getLocationInfo(locationName) {
    const locations = {
        'Headquarters': `
            <p><strong>Main Office</strong></p>
            <p>Natham, Dindigul</p>
            <p>Tamil Nadu, India</p>
            <p>Working Hours: Mon-Fri, 9AM-6PM</p>
            <p>Phone: +91 XXXXX XXXXX</p>
        `,
        'Virtual Office': `
            <p><strong>Remote Team</strong></p>
            <p>Global Presence</p>
            <p>Available 24/7</p>
            <p>Distributed across multiple timezones</p>
            <p>Collaboration tools enabled</p>
        `,
        'Research Lab': `
            <p><strong>Research Facility</strong></p>
            <p>NPR College of Engineering</p>
            <p>Technology Campus</p>
            <p>Status: Coming Soon</p>
            <p>Focus: AI Research & Development</p>
        `
    };
    
    return locations[locationName] || '<p>Location information not available.</p>';
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

// Add parallax effect to contact sections
function initParallaxEffects() {
    const contactHero = document.querySelector('.contact-hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        if (contactHero) {
            const parallax = scrolled * 0.3;
            const heroVisual = contactHero.querySelector('.hero-visual');
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${parallax}px)`;
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

// Add character counter for message field
function initCharacterCounter() {
    const messageField = document.getElementById('contact-message');
    if (!messageField) return;
    
    const counter = document.createElement('div');
    counter.style.cssText = `
        text-align: right;
        font-size: 0.8rem;
        color: var(--text-secondary);
        margin-top: 0.5rem;
    `;
    counter.textContent = '0 / 1000 characters';
    
    messageField.parentNode.appendChild(counter);
    
    messageField.addEventListener('input', () => {
        const length = messageField.value.length;
        counter.textContent = `${length} / 1000 characters`;
        
        if (length > 1000) {
            counter.style.color = '#ff00ff';
            messageField.value = messageField.value.substring(0, 1000);
            counter.textContent = '1000 / 1000 characters';
        } else {
            counter.style.color = 'var(--text-secondary)';
        }
    });
}

// Initialize character counter
initCharacterCounter();
