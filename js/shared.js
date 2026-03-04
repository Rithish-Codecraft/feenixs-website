// Shared JavaScript functionality for all pages

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Check authentication status
    checkAuthStatus();
});

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
    
    // Handle form submission
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (isLogin) {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const success = await loginUser(email, password);
            if (success) {
                authModal.classList.remove('active');
                document.body.style.overflow = '';
                updateAuthUI(true);
            }
        } else {
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            const success = await registerUser(username, email, password);
            if (success) {
                authModal.classList.remove('active');
                document.body.style.overflow = '';
                updateAuthUI(true);
            }
        }
    });
}

// User Registration
async function registerUser(username, email, password) {
    try {
        // Hash password
        const hashedPassword = await hashPassword(password);
        
        // Get existing users
        const users = await getUsersFromCSV();
        
        // Check if user already exists
        if (users.find(user => user.email === email)) {
            alert('User with this email already exists!');
            return false;
        }
        
        // Add new user
        const newUser = {
            username,
            email,
            password: hashedPassword,
            created_at: new Date().toISOString()
        };
        
        users.push(newUser);
        
        // Save to CSV
        await saveUsersToCSV(users);
        
        // Store current user session
        localStorage.setItem('currentUser', JSON.stringify({
            username,
            email,
            isLoggedIn: true
        }));
        
        return true;
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
        return false;
    }
}

// User Login
async function loginUser(email, password) {
    try {
        const users = await getUsersFromCSV();
        const hashedPassword = await hashPassword(password);
        
        const user = users.find(u => u.email === email && u.password === hashedPassword);
        
        if (user) {
            // Store current user session
            localStorage.setItem('currentUser', JSON.stringify({
                username: user.username,
                email: user.email,
                isLoggedIn: true
            }));
            return true;
        } else {
            alert('Invalid email or password!');
            return false;
        }
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

// Get users from CSV
async function getUsersFromCSV() {
    try {
        const response = await fetch('../data/users.csv');
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
    } catch (error) {
        console.error('Error reading users CSV:', error);
        return [];
    }
}

// Save users to CSV (this would require a backend in a real application)
async function saveUsersToCSV(users) {
    // In a real application, this would be handled by a backend server
    // For this demo, we'll store in localStorage as a fallback
    localStorage.setItem('users', JSON.stringify(users));
    
    // Create CSV content
    const headers = Object.keys(users[0]);
    const csvContent = [
        headers.join(','),
        ...users.map(user => headers.map(header => user[header]).join(','))
    ].join('\n');
    
    console.log('CSV Content (would be saved to data/users.csv):');
    console.log(csvContent);
    
    return true;
}

// Update Auth UI
function updateAuthUI(isLoggedIn) {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    
    if (isLoggedIn) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (loginBtn) {
            loginBtn.textContent = `Welcome, ${currentUser.username}`;
            loginBtn.onclick = () => logout();
        }
        if (registerBtn) {
            registerBtn.style.display = 'none';
        }
    } else {
        if (loginBtn) {
            loginBtn.textContent = 'Login';
            loginBtn.onclick = () => {
                document.getElementById('login-btn').click();
            };
        }
        if (registerBtn) {
            registerBtn.style.display = 'inline-block';
        }
    }
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    updateAuthUI(false);
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
