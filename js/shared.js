// Shared JavaScript functionality for all pages

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load Google Auth script first
    loadGoogleAuth();
    
    // Initialize particle system
    initParticleSystem();
    
    // Initialize video background
    initVideoBackground();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize modals
    initModals();
    
    // Initialize authentication system
    initAuthSystem();
    
    // Initialize visitor tracking
    initVisitorTracking();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize user paths
    initUserPaths();
    
    // Initialize micro-interactions
    initMicroInteractions();
    
    // Initialize loading feedback
    initLoadingFeedback();
    
    // Check authentication status
    checkAuthStatus();
    
    // Create test user for demo purposes (only if no users exist)
    createTestUserIfNeeded();
    
    // Load page-specific scripts
    loadPageScripts();
});

// Load Google Auth script and Encryption system
function loadGoogleAuth() {
    const googleScript = document.createElement('script');
    googleScript.src = 'js/google-auth.js';
    googleScript.async = true;
    document.head.appendChild(googleScript);
    
    const encryptionScript = document.createElement('script');
    encryptionScript.src = 'js/encryption.js';
    encryptionScript.async = true;
    document.head.appendChild(encryptionScript);
    
    // Load 3D Neural Network for home page only
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        const neural3DScript = document.createElement('script');
        neural3DScript.src = 'js/3d-neural-network.js';
        neural3DScript.async = true;
        document.head.appendChild(neural3DScript);
        
        // Load Particle Engine
        const particleScript = document.createElement('script');
        particleScript.src = 'js/particle-engine.js';
        particleScript.async = true;
        document.head.appendChild(particleScript);
    }
}

// Particle System
function initParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 100;
    const connectionDistance = 150;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = (1 - distance / connectionDistance) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Video Background
function initVideoBackground() {
    const video = document.getElementById('bg-video');
    const videoFallback = document.querySelector('.video-fallback');
    
    if (!video) return;
    
    // Check if video is supported and can play
    video.addEventListener('canplay', () => {
        video.style.display = 'block';
        if (videoFallback) {
            videoFallback.style.display = 'none';
        }
    });
    
    video.addEventListener('error', () => {
        video.style.display = 'none';
        if (videoFallback) {
            videoFallback.style.display = 'block';
        }
    });
    
    // Parallax effect on scroll
    let lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const speed = 0.5;
        const yPos = -(scrollY * speed);
        
        video.style.transform = `translateY(${yPos}px) scale(1.1)`;
        
        lastScrollY = scrollY;
    });
}

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navbar) return;
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Check if it's a same-page link
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Highlight active section (for single page)
    if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')) {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// Modals
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[id$="-link"], [id$="-btn"]');
    const modalCloses = document.querySelectorAll('.modal-close');
    
    // Open modals
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const id = trigger.id;
            let modalId = null;
            
            // Handle different trigger types
            if (id === 'privacy-link') modalId = 'privacy-modal';
            else if (id === 'terms-link') modalId = 'terms-modal';
            else if (id === 'data-policy-link') modalId = 'privacy-modal'; // Reuse privacy modal
            else if (id.endsWith('-link')) modalId = id.replace('-link', '-modal');
            else if (id.endsWith('-btn')) modalId = id.replace('-btn', '-modal');
            
            if (modalId) {
                e.preventDefault();
                const modal = document.getElementById(modalId);
                
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    });
    
    // Close modals
    modalCloses.forEach(close => {
        close.addEventListener('click', () => {
            const modal = close.closest('.modal');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close modal on background click
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}

// Authentication System
function initAuthSystem() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const authModal = document.getElementById('auth-modal');
    const authTitle = document.getElementById('auth-title');
    const authForm = document.getElementById('auth-form');
    const authSubmit = document.getElementById('auth-submit');
    const authSwitchLink = document.getElementById('auth-switch-link');
    const authSwitchText = document.getElementById('auth-switch-text');
    const loginFields = document.getElementById('login-fields');
    const registerFields = document.getElementById('register-fields');
    const modalClose = authModal ? authModal.querySelector('.modal-close') : null;
    
    if (!authModal || !authForm) return;
    
    let isLogin = true;
    
    // Open login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            isLogin = true;
            authTitle.textContent = 'Login';
            authSubmit.textContent = 'Login';
            authSwitchText.textContent = "Don't have an account?";
            authSwitchLink.textContent = 'Sign Up';
            loginFields.style.display = 'flex';
            registerFields.style.display = 'none';
            authModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Open register modal
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            isLogin = false;
            authTitle.textContent = 'Sign Up';
            authSubmit.textContent = 'Sign Up';
            authSwitchText.textContent = 'Already have an account?';
            authSwitchLink.textContent = 'Login';
            loginFields.style.display = 'none';
            registerFields.style.display = 'flex';
            authModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Switch between login and register
    if (authSwitchLink) {
        authSwitchLink.addEventListener('click', (e) => {
            e.preventDefault();
            isLogin = !isLogin;
            
            if (isLogin) {
                authTitle.textContent = 'Login';
                authSubmit.textContent = 'Login';
                authSwitchText.textContent = "Don't have an account?";
                authSwitchLink.textContent = 'Sign Up';
                loginFields.style.display = 'flex';
                registerFields.style.display = 'none';
            } else {
                authTitle.textContent = 'Sign Up';
                authSubmit.textContent = 'Sign Up';
                authSwitchText.textContent = 'Already have an account?';
                authSwitchLink.textContent = 'Login';
                loginFields.style.display = 'none';
                registerFields.style.display = 'flex';
            }
        });
    }
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            authModal.classList.remove('active');
            document.body.style.overflow = '';
            authForm.reset();
        });
    }
    
    // Close modal on outside click
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('active');
            document.body.style.overflow = '';
            authForm.reset();
        }
    });
    
    // Handle form submission
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (isLogin) {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (!email || !password) {
                alert('Please fill in all fields.');
                return;
            }
            
            const success = await loginUser(email, password);
            if (success) {
                authModal.classList.remove('active');
                document.body.style.overflow = '';
                authForm.reset();
                updateAuthUI(true);
                
                // Redirect to dashboard after successful login
                setTimeout(() => {
                    window.location.href = 'pages/user-dashboard.html';
                }, 500);
            }
        } else {
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            if (!username || !email || !password || !confirmPassword) {
                alert('Please fill in all fields.');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            const success = await registerUser(username, email, password);
            if (success) {
                authModal.classList.remove('active');
                document.body.style.overflow = '';
                authForm.reset();
                updateAuthUI(true);
                
                // Redirect to dashboard after successful registration
                setTimeout(() => {
                    window.location.href = 'pages/user-dashboard.html';
                }, 500);
            }
        }
    });
}

// User Registration with Encryption
async function registerUser(username, email, password) {
    try {
        // Validate input
        if (!username || !email || !password) {
            alert('Please fill in all fields.');
            return false;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return false;
        }
        
        // Get existing users
        const users = await getUsersFromCSV();
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            alert('An account with this email already exists. Please login instead.');
            return false;
        }
        
        // Create new user
        let userData;
        
        if (typeof window.EncryptionSystem !== 'undefined') {
            // Use encryption system if available
            userData = {
                username,
                email,
                password: await window.EncryptionSystem.hashPassword(password),
                created_at: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                encrypted: true
            };
        } else {
            // Fallback to simple hash
            const hashedPassword = await hashPassword(password);
            userData = {
                username,
                email,
                password: hashedPassword,
                created_at: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                encrypted: false
            };
        }
        
        // Add new user
        users.push(userData);
        
        // Save to storage
        await saveUsersToCSV(users);
        
        // Set current user session
        localStorage.setItem('currentUser', JSON.stringify({
            username,
            email,
            isLoggedIn: true,
            encrypted: userData.encrypted,
            lastLogin: userData.lastLogin
        }));
        
        return true;
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
        return false;
    }
}

// Dynamically load scripts based on page
    function loadPageScripts() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch(currentPage) {
            case 'index.html':
                loadScript('js/particle-engine.js');
                loadScript('js/3d-neural-network.js');
                loadScript('js/zoom-animation.js');
                loadScript('js/3d-hover-animation.js');
                loadScript('js/storytelling-animation.js');
                break;
            case 'ai-playground.html':
                loadScript('js/ai-playground.js');
                loadScript('js/zoom-animation.js');
                loadScript('js/3d-hover-animation.js');
                loadScript('js/storytelling-animation.js');
                break;
            case 'developer-portal.html':
                loadScript('js/developer-portal.js');
                loadScript('js/zoom-animation.js');
                loadScript('js/3d-hover-animation.js');
                loadScript('js/storytelling-animation.js');
                break;
            case 'community-feed.html':
                loadScript('js/community-feed.js');
                loadScript('js/zoom-animation.js');
                loadScript('js/3d-hover-animation.js');
                loadScript('js/storytelling-animation.js');
                break;
            case 'vision.html':
            case 'technologies.html':
            case 'founder.html':
            case 'contact.html':
                loadScript('js/zoom-animation.js');
                loadScript('js/3d-hover-animation.js');
                loadScript('js/storytelling-animation.js');
                break;
        }
    }

// User Login with Encryption
async function loginUser(email, password) {
    try {
        // Get users from storage
        const users = await getUsersFromCSV();
        
        // Find user by email
        const user = users.find(u => u.email === email);
        
        if (!user) {
            alert('User not found. Please check your email or register for a new account.');
            return false;
        }
        
        // Verify password
        let passwordMatch = false;
        
        if (user.encrypted && typeof window.EncryptionSystem !== 'undefined') {
            // For encrypted users, verify with encryption system
            passwordMatch = await window.EncryptionSystem.verifyPassword(password, user.password);
        } else {
            // For non-encrypted users, verify with simple hash
            const hashedPassword = await hashPassword(password);
            passwordMatch = user.password === hashedPassword;
        }
        
        if (!passwordMatch) {
            alert('Incorrect password. Please try again.');
            return false;
        }
        
        // Update last login
        user.lastLogin = new Date().toISOString();
        
        // Save updated user data
        await saveUsersToCSV(users);
        
        // Store current user session
        localStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            email: user.email,
            isLoggedIn: true,
            encrypted: user.encrypted || false,
            lastLogin: user.lastLogin
        }));
        
        return true;
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
        return false;
    }
}

// Password Hashing (simple implementation for demo)
async function hashPassword(password) {
    // In a real application, use a proper hashing library like bcrypt
    // This is a simple hash for demonstration purposes
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
}

// Get users from CSV or localStorage
async function getUsersFromCSV() {
    try {
        // Try to fetch from CSV first
        const response = await fetch('data/users.csv');
        if (response.ok) {
            const csvText = await response.text();
            const lines = csvText.split('\n').filter(line => line.trim());
            
            if (lines.length === 0) return [];
            
            const headers = lines[0].split(',').map(h => h.trim());
            const users = [];
            
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                const user = {};
                
                headers.forEach((header, index) => {
                    user[header] = values[index] || '';
                });
                
                users.push(user);
            }
            
            return users;
        }
    } catch (error) {
        console.log('CSV fetch failed, using localStorage fallback');
    }
    
    // Fallback to localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        try {
            return JSON.parse(storedUsers);
        } catch (parseError) {
            console.error('Error parsing stored users:', parseError);
        }
    }
    
    // Return empty array if no users found
    return [];
}

// Save users to CSV or localStorage
async function saveUsersToCSV(users) {
    try {
        // Create CSV content
        if (users.length === 0) {
            console.log('No users to save');
            return true;
        }
        
        const headers = Object.keys(users[0]);
        const csvContent = [
            headers.join(','),
            ...users.map(user => headers.map(header => `"${user[header] || ''}"`).join(','))
        ].join('\n');
        
        // Try to save to CSV (this would require a backend in a real application)
        console.log('CSV Content (would be saved to data/users.csv):');
        console.log(csvContent);
        
        // For now, store in localStorage as fallback
        localStorage.setItem('users', JSON.stringify(users));
        
        return true;
    } catch (error) {
        console.error('Error saving users:', error);
        
        // Fallback to localStorage
        try {
            localStorage.setItem('users', JSON.stringify(users));
            return true;
        } catch (localStorageError) {
            console.error('Error saving to localStorage:', localStorageError);
            return false;
        }
    }
}

// Update Auth UI
function updateAuthUI(isLoggedIn) {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const userMenu = document.getElementById('user-menu');
    
    if (isLoggedIn) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Hide login/register buttons
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        
        // Show user menu
        if (userMenu) {
            userMenu.innerHTML = `
                <div class="user-info">
                    ${currentUser.picture ? 
                        `<img src="${currentUser.picture}" alt="${currentUser.name || currentUser.username}" class="user-avatar">` : 
                        `<div class="user-avatar-placeholder">${(currentUser.name || currentUser.username).charAt(0).toUpperCase()}</div>`
                    }
                    <span class="user-name">${currentUser.name || currentUser.username}</span>
                    <button id="logout-btn" class="logout-btn">Logout</button>
                </div>
            `;
            userMenu.style.display = 'block';
            
            // Add logout functionality
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', logout);
            }
        }
    } else {
        // Show login/register buttons
        if (loginBtn) {
            loginBtn.style.display = 'inline-block';
            loginBtn.onclick = () => {
                document.getElementById('login-btn').click();
            };
        }
        if (registerBtn) {
            registerBtn.style.display = 'inline-block';
        }
        
        // Hide user menu
        if (userMenu) {
            userMenu.style.display = 'none';
        }
    }
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    updateAuthUI(false);
}

// Initialize User Paths
function initUserPaths() {
    const pathCards = document.querySelectorAll('.path-card');
    
    if (pathCards.length === 0) return;
    
    // Add hover effects and interactions
    pathCards.forEach((card, index) => {
        // Add entrance animation
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(card,
                {
                    opacity: 0,
                    y: 50,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    delay: index * 0.2,
                    ease: 'power3.out'
                }
            );
        }
        
        // Add click tracking
        card.addEventListener('click', function(e) {
            const cardType = this.classList.contains('visitor') ? 'visitor' :
                           this.classList.contains('developer') ? 'developer' :
                           this.classList.contains('community') ? 'community' : 'unknown';
            
            // Track user path selection
            trackUserPathSelection(cardType);
            
            // Add ripple effect
            createRippleEffect(this, e);
        });
        
        // Add hover glow effect
        card.addEventListener('mouseenter', function() {
            const glow = this.querySelector('.path-glow');
            if (glow) {
                glow.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const glow = this.querySelector('.path-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    });
    
    // Animate quick actions bar
    const quickActionsBar = document.querySelector('.quick-actions-bar');
    if (quickActionsBar && typeof gsap !== 'undefined') {
        gsap.fromTo(quickActionsBar,
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.8,
                ease: 'power2.out'
            }
        );
    }
}

// Track user path selection
function trackUserPathSelection(pathType) {
    try {
        const selection = {
            timestamp: new Date().toISOString(),
            pathType: pathType,
            page: window.location.pathname,
            userAgent: navigator.userAgent
        };
        
        // Store in localStorage for analytics
        const selections = JSON.parse(localStorage.getItem('pathSelections') || '[]');
        selections.push(selection);
        localStorage.setItem('pathSelections', JSON.stringify(selections));
        
        // Keep only last 100 selections
        if (selections.length > 100) {
            localStorage.setItem('pathSelections', JSON.stringify(selections.slice(-100)));
        }
        
        console.log(`User selected ${pathType} path`);
    } catch (error) {
        console.error('Error tracking path selection:', error);
    }
}

// Create ripple effect on click
function createRippleEffect(element, event) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Get user path analytics
function getUserPathAnalytics() {
    try {
        const selections = JSON.parse(localStorage.getItem('pathSelections') || '[]');
        const analytics = {
            totalSelections: selections.length,
            pathCounts: {
                visitor: 0,
                developer: 0,
                community: 0,
                unknown: 0
            },
            recentSelections: selections.slice(-10)
        };
        
        selections.forEach(selection => {
            analytics.pathCounts[selection.pathType] = (analytics.pathCounts[selection.pathType] || 0) + 1;
        });
        
        return analytics;
    } catch (error) {
        console.error('Error getting path analytics:', error);
        return null;
    }
}

// Initialize Micro-Interactions
function initMicroInteractions() {
    // Scroll animations
    initScrollAnimations();
    
    // Magnetic effects
    initMagneticEffects();
    
    // Parallax effects
    initParallaxEffects();
    
    // Hover effects
    initHoverEffects();
    
    // Ripple effects
    initRippleEffects();
    
    // Stagger animations
    initStaggerAnimations();
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger stagger animation
                if (entry.target.classList.contains('stagger-container')) {
                    const items = entry.target.querySelectorAll('.stagger-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-item');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Observe stagger containers
    const staggerContainers = document.querySelectorAll('.stagger-container');
    staggerContainers.forEach(container => {
        observer.observe(container);
    });
}

// Magnetic Effects
function initMagneticEffects() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 100;
            
            if (distance < maxDistance) {
                const strength = (maxDistance - distance) / maxDistance;
                const moveX = x * strength * 0.3;
                const moveY = y * strength * 0.3;
                
                element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-medium, .parallax-fast');
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const speed = element.classList.contains('parallax-slow') ? 0.5 :
                          element.classList.contains('parallax-medium') ? 0.3 : 0.1;
            
            const yPos = -(rect.top * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Hover Effects
function initHoverEffects() {
    // Tilt effects
    const tiltElements = document.querySelectorAll('.tilt-effect');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// Ripple Effects
function initRippleEffects() {
    const rippleElements = document.querySelectorAll('.ripple-effect');
    
    rippleElements.forEach(element => {
        element.addEventListener('click', (e) => {
            const rect = element.getBoundingClientRect();
            const ripple = document.createElement('div');
            
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-actual');
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Stagger Animations
function initStaggerAnimations() {
    const staggerContainers = document.querySelectorAll('.stagger-container');
    
    staggerContainers.forEach(container => {
        const items = container.querySelectorAll('.stagger-item');
        
        // Add initial state
        items.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

// Initialize Loading Feedback
function initLoadingFeedback() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        createLoadingOverlay();
    }
    
    // Create page loading if it doesn't exist
    if (!document.getElementById('page-loading')) {
        createPageLoading();
    }
    
    // Initialize button loading states
    initButtonLoading();
    
    // Initialize form loading states
    initFormLoading();
}

// Create Loading Overlay
function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="spinner"></div>
        <div class="loading-text">Loading...</div>
        <div class="loading-subtext">Please wait a moment</div>
    `;
    document.body.appendChild(overlay);
}

// Create Page Loading
function createPageLoading() {
    const pageLoading = document.createElement('div');
    pageLoading.id = 'page-loading';
    pageLoading.className = 'page-loading';
    pageLoading.innerHTML = `
        <div class="logo">FEENIXS</div>
        <div class="spinner"></div>
        <div class="loading-text">Initializing...</div>
        <div class="loading-subtext">Preparing your experience</div>
    `;
    document.body.appendChild(pageLoading);
}

// Show Loading Overlay
function showLoadingOverlay(text = 'Loading...', subtext = 'Please wait a moment') {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        const loadingText = overlay.querySelector('.loading-text');
        const loadingSubtext = overlay.querySelector('.loading-subtext');
        
        if (loadingText) loadingText.textContent = text;
        if (loadingSubtext) loadingSubtext.textContent = subtext;
        
        overlay.classList.add('active');
    }
}

// Hide Loading Overlay
function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Show Page Loading
function showPageLoading(text = 'Initializing...', subtext = 'Preparing your experience') {
    const pageLoading = document.getElementById('page-loading');
    if (pageLoading) {
        const loadingText = pageLoading.querySelector('.loading-text');
        const loadingSubtext = pageLoading.querySelector('.loading-subtext');
        
        if (loadingText) loadingText.textContent = text;
        if (loadingSubtext) loadingSubtext.textContent = subtext;
        
        pageLoading.classList.add('active');
    }
}

// Hide Page Loading
function hidePageLoading() {
    const pageLoading = document.getElementById('page-loading');
    if (pageLoading) {
        pageLoading.classList.remove('active');
    }
}

// Initialize Button Loading
function initButtonLoading() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('async-action')) {
                setButtonLoading(this, true);
            }
        });
    });
}

// Set Button Loading State
function setButtonLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
        
        // Store original content
        const originalContent = button.innerHTML;
        button.dataset.originalContent = originalContent;
        
        // Add spinner
        const spinner = document.createElement('div');
        spinner.className = 'btn-spinner';
        button.appendChild(spinner);
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        
        // Restore original content
        if (button.dataset.originalContent) {
            button.innerHTML = button.dataset.originalContent;
            delete button.dataset.originalContent;
        }
    }
}

// Initialize Form Loading
function initFormLoading() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (this.classList.contains('async-form')) {
                e.preventDefault();
                setFormLoading(this, true);
                
                // Simulate async operation
                setTimeout(() => {
                    setFormLoading(this, false);
                    // Handle form submission
                    handleFormSubmission(this);
                }, 2000);
            }
        });
    });
}

// Set Form Loading State
function setFormLoading(form, loading) {
    if (loading) {
        form.classList.add('form-loading');
        
        // Add spinner to form
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        form.appendChild(spinner);
        
        // Disable all inputs
        const inputs = form.querySelectorAll('input, button, select, textarea');
        inputs.forEach(input => {
            input.disabled = true;
        });
    } else {
        form.classList.remove('form-loading');
        
        // Remove spinner
        const spinner = form.querySelector('.spinner');
        if (spinner) {
            spinner.remove();
        }
        
        // Re-enable all inputs
        const inputs = form.querySelectorAll('input, button, select, textarea');
        inputs.forEach(input => {
            input.disabled = false;
        });
    }
}

// Handle Form Submission
function handleFormSubmission(form) {
    // This would be replaced with actual form submission logic
    console.log('Form submitted:', form);
    
    // Show success message
    showNotification('Success!', 'Your form has been submitted successfully.', 'success');
}

// Create Progress Bar
function createProgressBar(container, options = {}) {
    const {
        value = 0,
        max = 100,
        showText = true,
        size = 'medium',
        indeterminate = false
    } = options;
    
    const progressBar = document.createElement('div');
    progressBar.className = `progress-bar ${size === 'large' ? 'progress-bar-large' : size === 'small' ? 'progress-bar-small' : ''}`;
    
    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    
    if (indeterminate) {
        progressFill.classList.add('progress-indeterminate');
    } else {
        progressFill.style.width = `${(value / max) * 100}%`;
    }
    
    progressBar.appendChild(progressFill);
    
    if (showText) {
        const progressText = document.createElement('div');
        progressText.className = 'progress-text';
        progressText.textContent = indeterminate ? 'Loading...' : `${Math.round((value / max) * 100)}%`;
        progressBar.appendChild(progressText);
    }
    
    if (container) {
        container.appendChild(progressBar);
    }
    
    return {
        element: progressBar,
        setValue: (newValue) => {
            if (!indeterminate) {
                progressFill.style.width = `${(newValue / max) * 100}%`;
                if (showText) {
                    const textElement = progressBar.querySelector('.progress-text');
                    if (textElement) {
                        textElement.textContent = `${Math.round((newValue / max) * 100)}%`;
                    }
                }
            }
        },
        setIndeterminate: (isIndeterminate) => {
            if (isIndeterminate) {
                progressFill.classList.add('progress-indeterminate');
                if (showText) {
                    const textElement = progressBar.querySelector('.progress-text');
                    if (textElement) {
                        textElement.textContent = 'Loading...';
                    }
                }
            } else {
                progressFill.classList.remove('progress-indeterminate');
            }
        }
    };
}

// Create Skeleton UI
function createSkeletonUI(container, type = 'card') {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton';
    
    switch (type) {
        case 'text':
            skeleton.className = 'skeleton skeleton-text';
            break;
        case 'text-large':
            skeleton.className = 'skeleton skeleton-text large';
            break;
        case 'text-small':
            skeleton.className = 'skeleton skeleton-text small';
            break;
        case 'avatar':
            skeleton.className = 'skeleton skeleton-avatar';
            break;
        case 'button':
            skeleton.className = 'skeleton skeleton-button';
            break;
        case 'card':
            skeleton.innerHTML = `
                <div class="skeleton-card">
                    <div class="skeleton-header">
                        <div class="skeleton skeleton-avatar"></div>
                        <div class="skeleton skeleton-text" style="width: 60%;"></div>
                    </div>
                    <div class="skeleton-content">
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text" style="width: 80%;"></div>
                        <div class="skeleton skeleton-text" style="width: 40%;"></div>
                    </div>
                </div>
            `;
            break;
    }
    
    if (container) {
        container.appendChild(skeleton);
    }
    
    return skeleton;
}

// Show Loading Steps
function showLoadingSteps(steps, container) {
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'loading-steps';
    
    steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'loading-step';
        stepElement.innerHTML = `
            <div class="loading-step-icon">${index + 1}</div>
            <div class="loading-step-content">
                <div class="loading-step-title">${step.title}</div>
                <div class="loading-step-description">${step.description}</div>
            </div>
        `;
        stepsContainer.appendChild(stepElement);
    });
    
    if (container) {
        container.appendChild(stepsContainer);
    }
    
    return {
        element: stepsContainer,
        setActiveStep: (stepIndex) => {
            const stepElements = stepsContainer.querySelectorAll('.loading-step');
            stepElements.forEach((step, index) => {
                step.classList.remove('active', 'completed');
                if (index < stepIndex) {
                    step.classList.add('completed');
                } else if (index === stepIndex) {
                    step.classList.add('active');
                }
            });
        }
    };
}

// Show Notification
function showNotification(title, message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <div class="notification-close">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    // Add notification styles if not already present
    if (!document.getElementById('notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notification-styles';
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--glass-bg);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid var(--glass-border);
                border-radius: 10px;
                padding: 15px;
                min-width: 300px;
                max-width: 400px;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 15px;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .notification-icon {
                font-size: 1.5rem;
                color: var(--primary-color);
            }
            
            .notification-success .notification-icon {
                color: #44ff44;
            }
            
            .notification-error .notification-icon {
                color: #ff4444;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-title {
                font-weight: 600;
                color: var(--glass-text);
                margin-bottom: 5px;
            }
            
            .notification-message {
                font-size: 0.9rem;
                color: var(--glass-text-secondary);
            }
            
            .notification-close {
                cursor: pointer;
                color: var(--glass-text-secondary);
                transition: color 0.3s ease;
            }
            
            .notification-close:hover {
                color: var(--glass-text);
            }
        `;
        document.head.appendChild(notificationStyles);
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
    
    // Close on click
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
}

// Loading Manager
const LoadingManager = {
    overlays: new Map(),
    
    show: (id, options = {}) => {
        const {
            text = 'Loading...',
            subtext = 'Please wait a moment',
            spinner = 'default'
        } = options;
        
        if (this.overlays.has(id)) {
            return this.overlays.get(id);
        }
        
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="spinner ${spinner}"></div>
            <div class="loading-text">${text}</div>
            <div class="loading-subtext">${subtext}</div>
        `;
        
        document.body.appendChild(overlay);
        overlay.classList.add('active');
        
        this.overlays.set(id, overlay);
        return overlay;
    },
    
    hide: (id) => {
        const overlay = this.overlays.get(id);
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
                this.overlays.delete(id);
            }, 300);
        }
    },
    
    updateText: (id, text, subtext) => {
        const overlay = this.overlays.get(id);
        if (overlay) {
            const textElement = overlay.querySelector('.loading-text');
            const subtextElement = overlay.querySelector('.loading-subtext');
            
            if (textElement) textElement.textContent = text;
            if (subtextElement) subtextElement.textContent = subtext;
        }
    }
};

// Export loading functions
window.LoadingFeedback = {
    showLoadingOverlay,
    hideLoadingOverlay,
    showPageLoading,
    hidePageLoading,
    setButtonLoading,
    setFormLoading,
    createProgressBar,
    createSkeletonUI,
    showLoadingSteps,
    showNotification,
    LoadingManager
};

// Create test user for demo purposes
async function createTestUserIfNeeded() {
    try {
        const users = await getUsersFromCSV();
        
        // Only create test user if no users exist
        if (users.length === 0) {
            const testUser = {
                username: 'Demo User',
                email: 'demo@feenixs.com',
                password: await hashPassword('demo123'),
                created_at: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                encrypted: false
            };
            
            users.push(testUser);
            await saveUsersToCSV(users);
            
            console.log('Test user created: demo@feenixs.com / demo123');
        }
    } catch (error) {
        console.error('Error creating test user:', error);
    }
}

// Check authentication status
function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.isLoggedIn) {
        updateAuthUI(true);
    }
}

// Visitor Tracking
function initVisitorTracking() {
    trackVisitor();
}

async function trackVisitor() {
    try {
        const visitor = {
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            referrer: document.referrer || 'direct',
            user_agent: navigator.userAgent,
            language: navigator.language,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`
        };
        
        // Get existing visitors
        const visitors = await getVisitorsFromCSV();
        visitors.push(visitor);
        
        // Save visitors
        await saveVisitorsToCSV(visitors);
    } catch (error) {
        console.error('Error tracking visitor:', error);
    }
}

// Get visitors from CSV
async function getVisitorsFromCSV() {
    try {
        const response = await fetch('../data/visitors.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) return [];
        
        const headers = lines[0].split(',').map(h => h.trim());
        const visitors = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const visitor = {};
            
            headers.forEach((header, index) => {
                visitor[header] = values[index] || '';
            });
            
            visitors.push(visitor);
        }
        
        return visitors;
    } catch (error) {
        console.error('Error reading visitors CSV:', error);
        return [];
    }
}

// Save visitors to CSV
async function saveVisitorsToCSV(visitors) {
    // Store in localStorage as fallback
    localStorage.setItem('visitors', JSON.stringify(visitors));
    
    // Create CSV content
    if (visitors.length === 0) return;
    
    const headers = Object.keys(visitors[0]);
    const csvContent = [
        headers.join(','),
        ...visitors.map(visitor => headers.map(header => `"${visitor[header]}"`).join(','))
    ].join('\n');
    
    console.log('Visitor CSV Content (would be saved to data/visitors.csv):');
    console.log(csvContent);
    
    return true;
}

// Mobile Menu
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navAuth = document.querySelector('.nav-auth');
    
    if (!hamburger) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        if (navMenu) navMenu.classList.toggle('active');
        if (navAuth) navAuth.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            if (navAuth) navAuth.classList.remove('active');
        });
    });
}

// Utility function to format time
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return `${Math.floor(diff / 86400000)} days ago`;
}

// Export functions for use in page-specific scripts
window.Feenixs = {
    formatTime,
    hashPassword,
    getUsersFromCSV,
    saveUsersToCSV,
    getVisitorsFromCSV,
    saveVisitorsToCSV
};

// Debug functions for testing
window.AuthDebug = {
    // Get current users
    getUsers: async () => {
        const users = await getUsersFromCSV();
        console.log('Current users:', users);
        return users;
    },
    
    // Clear all users (for testing)
    clearUsers: async () => {
        localStorage.removeItem('users');
        console.log('All users cleared from localStorage');
    },
    
    // Create test user
    createTestUser: async (email = 'test@feenixs.com', password = 'test123') => {
        const testUser = {
            username: 'Test User',
            email: email,
            password: await hashPassword(password),
            created_at: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            encrypted: false
        };
        
        const users = await getUsersFromCSV();
        users.push(testUser);
        await saveUsersToCSV(users);
        
        console.log(`Test user created: ${email} / ${password}`);
        return testUser;
    },
    
    // Test login
    testLogin: async (email, password) => {
        const result = await loginUser(email, password);
        console.log('Login result:', result);
        return result;
    },
    
    // Check current session
    getCurrentSession: () => {
        const session = localStorage.getItem('currentUser');
        console.log('Current session:', session ? JSON.parse(session) : null);
        return session ? JSON.parse(session) : null;
    },
    
    // Logout
    logout: () => {
        logout();
        console.log('Logged out');
    },
    
    // Get user path analytics
    getPathAnalytics: () => {
        const analytics = getUserPathAnalytics();
        console.log('User path analytics:', analytics);
        return analytics;
    },
    
    // Clear path analytics
    clearPathAnalytics: () => {
        localStorage.removeItem('pathSelections');
        console.log('Path analytics cleared');
    },
    
    // Get recent path selections
    getRecentPaths: (count = 10) => {
        const selections = JSON.parse(localStorage.getItem('pathSelections') || '[]');
        const recent = selections.slice(-count);
        console.log(`Recent ${count} path selections:`, recent);
        return recent;
    }
};
