// Community Page Specific JavaScript

// Initialize community page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize community chat
    initCommunityChat();
    
    // Initialize newsletter form
    initNewsletterForm();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize member interactions
    initMemberInteractions();
    
    // Initialize online status simulation
    initOnlineStatusSimulation();
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
        
        gsap.from('.hero-stats', {
            scrollTrigger: {
                trigger: '.hero-stats',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        });
        
        gsap.from('.community-graphic', {
            scrollTrigger: {
                trigger: '.community-graphic',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.5,
            opacity: 0,
            duration: 1
        });
        
        // Feature cards animation
        gsap.utils.toArray('.feature-card').forEach((card, index) => {
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
        
        // Guidelines animation
        gsap.utils.toArray('.guideline-item').forEach((item, index) => {
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
    } else {
        // Fallback without ScrollTrigger
        gsap.from('.hero-text h2', {
            x: -50,
            opacity: 0,
            duration: 1,
            delay: 0.5
        });
        
        gsap.utils.toArray('.feature-card').forEach((card, index) => {
            gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: 1 + index * 0.1
            });
        });
    }
}

// Community Chat
function initCommunityChat() {
    const joinChatBtn = document.getElementById('join-chat');
    const chatInput = document.getElementById('chat-input');
    const sendMessageBtn = document.getElementById('send-message');
    const chatMessages = document.getElementById('chat-messages');
    
    // Load existing messages
    loadChatMessages();
    
    // Join chat button
    if (joinChatBtn) {
        joinChatBtn.addEventListener('click', () => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser || !currentUser.isLoggedIn) {
                alert('Please login to join the chat!');
                document.getElementById('login-btn').click();
            } else {
                enableChat();
                joinChatBtn.textContent = 'Chat Active';
                joinChatBtn.disabled = true;
                addSystemMessage(`${currentUser.username} joined the chat`);
            }
        });
    }
    
    // Send message function
    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (!message) return;
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser.isLoggedIn) {
            alert('Please login to send messages!');
            return;
        }
        
        const success = await sendChatMessage(currentUser.username, message);
        
        if (success) {
            chatInput.value = '';
            loadChatMessages(); // Refresh messages
        }
    };
    
    // Send message button
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
    }
    
    // Enter key to send
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// Load chat messages
async function loadChatMessages() {
    try {
        const messages = await getChatMessagesFromCSV();
        const chatMessagesContainer = document.getElementById('chat-messages');
        
        if (!chatMessagesContainer) return;
        
        // Clear existing messages (keep welcome messages)
        const existingMessages = chatMessagesContainer.querySelectorAll('.message');
        existingMessages.forEach(msg => {
            if (!msg.textContent.includes('AI_Enthusiast') && 
                !msg.textContent.includes('TechExplorer') && 
                !msg.textContent.includes('DataScientist')) {
                msg.remove();
            }
        });
        
        // Add messages from newest to oldest
        messages.reverse().forEach(msg => {
            const messageElement = createChatMessageElement(msg);
            chatMessagesContainer.appendChild(messageElement);
        });
        
        // Scroll to bottom
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    } catch (error) {
        console.error('Error loading chat messages:', error);
    }
}

// Create chat message element
function createChatMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = '<i class="fas fa-user-circle"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';
    
    const authorSpan = document.createElement('span');
    authorSpan.className = 'message-author';
    authorSpan.textContent = message.username;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = formatTime(message.timestamp);
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = message.message;
    
    headerDiv.appendChild(authorSpan);
    headerDiv.appendChild(timeSpan);
    contentDiv.appendChild(headerDiv);
    contentDiv.appendChild(textDiv);
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    return messageDiv;
}

// Add system message
function addSystemMessage(text) {
    const chatMessagesContainer = document.getElementById('chat-messages');
    if (!chatMessagesContainer) return;
    
    const systemMessage = document.createElement('div');
    systemMessage.className = 'system-message';
    systemMessage.style.cssText = `
        text-align: center;
        color: var(--text-secondary);
        font-style: italic;
        margin: 1rem 0;
        font-size: 0.9rem;
    `;
    systemMessage.textContent = text;
    
    chatMessagesContainer.appendChild(systemMessage);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// Get chat messages from CSV
async function getChatMessagesFromCSV() {
    try {
        const response = await fetch('../data/chat.csv');
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
        console.error('Error reading chat CSV:', error);
        return [];
    }
}

// Send chat message
async function sendChatMessage(username, message) {
    try {
        const chatMessage = {
            username,
            message,
            timestamp: new Date().toISOString()
        };
        
        // Get existing messages
        const messages = await getChatMessagesFromCSV();
        messages.push(chatMessage);
        
        // Save messages
        await saveChatMessagesToCSV(messages);
        
        return true;
    } catch (error) {
        console.error('Error sending chat message:', error);
        alert('Failed to send message. Please try again.');
        return false;
    }
}

// Save chat messages to CSV
async function saveChatMessagesToCSV(messages) {
    // Store in localStorage as fallback
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    
    // Create CSV content
    if (messages.length === 0) return;
    
    const headers = Object.keys(messages[0]);
    const csvContent = [
        headers.join(','),
        ...messages.map(message => headers.map(header => `"${message[header]}"`).join(','))
    ].join('\n');
    
    console.log('Chat CSV Content (would be saved to data/chat.csv):');
    console.log(csvContent);
    
    return true;
}

// Enable chat
function enableChat() {
    const chatInput = document.getElementById('chat-input');
    const sendMessageBtn = document.getElementById('send-message');
    
    if (chatInput) {
        chatInput.disabled = false;
        chatInput.placeholder = 'Type your message...';
        chatInput.focus();
    }
    
    if (sendMessageBtn) {
        sendMessageBtn.disabled = false;
    }
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            const success = await subscribeNewsletter(email);
            
            if (success) {
                alert('Successfully subscribed to newsletter!');
                newsletterForm.reset();
                
                // Add success animation
                const button = newsletterForm.querySelector('button[type="submit"]');
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                button.style.background = 'var(--gradient-accent)';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                }, 2000);
            }
        });
    }
}

// Subscribe to newsletter
async function subscribeNewsletter(email) {
    try {
        // In a real application, this would be handled by a backend service
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
        alert('Failed to subscribe. Please try again.');
        return false;
    }
}

// Member Interactions
function initMemberInteractions() {
    const memberItems = document.querySelectorAll('.member-item');
    
    memberItems.forEach(item => {
        item.addEventListener('click', () => {
            const memberName = item.querySelector('.member-name').textContent;
            const memberStatus = item.querySelector('.member-status').textContent;
            
            // Show member info
            showMemberInfo(memberName, memberStatus);
        });
        
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                x: 5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Show member info
function showMemberInfo(name, status) {
    // Create modal-like popup
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
    `;
    
    popup.innerHTML = `
        <h3 style="color: var(--text-primary); margin-bottom: 1rem;">${name}</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">Status: <span style="color: var(--accent-color);">${status}</span></p>
        <button id="close-popup" style="
            background: var(--gradient-primary);
            border: none;
            color: var(--dark-bg);
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
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

// Online Status Simulation
function initOnlineStatusSimulation() {
    const onlineCount = document.getElementById('online-count');
    const statusDots = document.querySelectorAll('.status-dot');
    
    if (!onlineCount) return;
    
    // Simulate changing online count
    setInterval(() => {
        const currentCount = parseInt(onlineCount.textContent);
        const change = Math.floor(Math.random() * 5) - 2; // Random change between -2 and 2
        const newCount = Math.max(40, Math.min(60, currentCount + change)); // Keep between 40-60
        
        onlineCount.textContent = `${newCount} members online`;
        
        // Animate the change
        gsap.to(onlineCount, {
            scale: 1.1,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
    }, 10000); // Change every 10 seconds
    
    // Animate status dots
    statusDots.forEach(dot => {
        gsap.to(dot, {
            opacity: 0.5,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut'
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

// Add parallax effect to community sections
function initParallaxEffects() {
    const communityHero = document.querySelector('.community-hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        if (communityHero) {
            const parallax = scrolled * 0.3;
            const heroVisual = communityHero.querySelector('.hero-visual');
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

// Add typing indicator for chat
function showTypingIndicator(username) {
    const chatMessagesContainer = document.getElementById('chat-messages');
    if (!chatMessagesContainer) return;
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 1rem 0;
        color: var(--text-secondary);
        font-style: italic;
    `;
    
    typingIndicator.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user-circle"></i>
        </div>
        <div class="message-content">
            <div class="message-author">${username}</div>
            <div class="typing-dots">
                <span>•</span>
                <span>•</span>
                <span>•</span>
            </div>
        </div>
    `;
    
    // Add typing animation
    const typingStyle = document.createElement('style');
    typingStyle.textContent = `
        .typing-dots span {
            display: inline-block;
            animation: typing 1.4s infinite;
        }
        .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }
        .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }
        @keyframes typing {
            0%, 60%, 100% {
                opacity: 0.3;
            }
            30% {
                opacity: 1;
            }
        }
    `;
    
    if (!document.querySelector('style[data-typing]')) {
        typingStyle.setAttribute('data-typing', 'true');
        document.head.appendChild(typingStyle);
    }
    
    chatMessagesContainer.appendChild(typingIndicator);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    
    return typingIndicator;
}

// Format time helper function
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return `${Math.floor(diff / 86400000)} days ago`;
}
