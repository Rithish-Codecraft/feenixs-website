// Google Authentication Integration for Feenixs

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual Google Client ID
const GOOGLE_REDIRECT_URI = window.location.origin + '/pages/callback.html';

// Google Auth API
class GoogleAuth {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
    }

    // Initialize Google Auth
    async init() {
        try {
            // Load Google Identity Services
            await this.loadGoogleScript();
            
            // Initialize Google Auth
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: this.handleGoogleSignIn.bind(this),
                auto_select: false,
                cancel_on_tap_outside: false
            });

            this.isInitialized = true;
            console.log('Google Auth initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Google Auth:', error);
        }
    }

    // Load Google Identity Services script
    loadGoogleScript() {
        return new Promise((resolve, reject) => {
            if (window.google) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Show Google Sign-In popup
    showGoogleSignIn() {
        if (!this.isInitialized) {
            console.error('Google Auth not initialized');
            return;
        }

        google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // Fallback to manual sign-in button
                this.renderGoogleSignInButton();
            }
        });
    }

    // Render Google Sign-In button
    renderGoogleSignInButton() {
        const buttonContainer = document.getElementById('google-signin-button');
        if (!buttonContainer) return;

        google.accounts.id.renderButton(buttonContainer, {
            theme: 'filled_blue',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 300
        });
    }

    // Handle Google Sign-In response
    async handleGoogleSignIn(response) {
        try {
            // Decode JWT token
            const payload = this.decodeJWT(response.credential);
            
            // Create user object
            const googleUser = {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                given_name: payload.given_name,
                family_name: payload.family_name,
                verified_email: payload.email_verified,
                provider: 'google',
                loginTime: new Date().toISOString()
            };

            // Save user to local storage
            await this.saveGoogleUser(googleUser);
            
            // Update UI
            this.updateAuthUI(googleUser);
            
            // Show success message
            this.showNotification('Successfully signed in with Google!', 'success');
            
            // Redirect if needed
            if (window.location.pathname.includes('login')) {
                window.location.href = '../index.html';
            }

        } catch (error) {
            console.error('Google sign-in error:', error);
            this.showNotification('Failed to sign in with Google', 'error');
        }
    }

    // Decode JWT token
    decodeJWT(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    // Save Google user to storage
    async saveGoogleUser(user) {
        try {
            // Get existing users
            const users = await this.getUsersFromStorage();
            
            // Check if user already exists
            const existingUser = users.find(u => u.email === user.email);
            
            if (!existingUser) {
                // Add new user
                users.push({
                    username: user.given_name.toLowerCase().replace(/\s/g, ''),
                    email: user.email,
                    password: 'google_oauth_' + user.id, // Placeholder password
                    provider: 'google',
                    googleId: user.id,
                    name: user.name,
                    picture: user.picture,
                    verified: true,
                    createdAt: new Date().toISOString()
                });
            } else {
                // Update existing user
                const userIndex = users.findIndex(u => u.email === user.email);
                users[userIndex].lastLogin = new Date().toISOString();
                users[userIndex].picture = user.picture;
            }

            // Save to storage
            await this.saveUsersToStorage(users);
            
            // Set current user session
            localStorage.setItem('currentUser', JSON.stringify({
                username: existingUser ? existingUser.username : user.given_name.toLowerCase().replace(/\s/g, ''),
                email: user.email,
                isLoggedIn: true,
                provider: 'google',
                name: user.name,
                picture: user.picture
            }));

        } catch (error) {
            console.error('Error saving Google user:', error);
            throw error;
        }
    }

    // Get users from storage
    async getUsersFromStorage() {
        try {
            // Try localStorage first
            const localUsers = localStorage.getItem('users');
            if (localUsers) {
                return JSON.parse(localUsers);
            }

            // Fallback to CSV (for GitHub Pages compatibility)
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
            console.error('Error getting users:', error);
            return [];
        }
    }

    // Save users to storage
    async saveUsersToStorage(users) {
        try {
            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // Create CSV content
            if (users.length === 0) return;
            
            const headers = Object.keys(users[0]);
            const csvContent = [
                headers.join(','),
                ...users.map(user => headers.map(header => `"${user[header]}"`).join(','))
            ].join('\n');
            
            console.log('Users CSV Content:', csvContent);
            
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }

    // Update authentication UI
    updateAuthUI(user) {
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const userMenu = document.getElementById('user-menu');
        
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        
        if (userMenu) {
            userMenu.innerHTML = `
                <div class="user-info">
                    <img src="${user.picture}" alt="${user.name}" class="user-avatar">
                    <span class="user-name">${user.name}</span>
                    <button id="logout-btn" class="logout-btn">Logout</button>
                </div>
            `;
            userMenu.style.display = 'block';
        }

        // Add logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    // Logout user
    logout() {
        localStorage.removeItem('currentUser');
        
        // Reset UI
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const userMenu = document.getElementById('user-menu');
        
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
        
        this.showNotification('Successfully logged out', 'info');
        
        // Redirect to home
        if (window.location.pathname !== '/index.html') {
            window.location.href = '../index.html';
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #AC8B53, #5374AC)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ff00ff, #ff4444)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #AC8B53, #5374AC)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Check if user is already logged in
    checkAuthStatus() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const user = JSON.parse(currentUser);
            this.updateAuthUI(user);
            return user;
        }
        return null;
    }
}

// Initialize Google Auth
const googleAuth = new GoogleAuth();

// Export for use in other scripts
window.GoogleAuth = googleAuth;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    googleAuth.init().then(() => {
        googleAuth.checkAuthStatus();
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .user-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 25px;
        backdrop-filter: blur(10px);
    }
    
    .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid var(--primary-color);
    }
    
    .user-name {
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .logout-btn {
        background: rgba(255, 0, 255, 0.2);
        border: 1px solid var(--secondary-color);
        color: var(--text-primary);
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.3s ease;
    }
    
    .logout-btn:hover {
        background: rgba(255, 0, 255, 0.3);
        transform: translateY(-1px);
    }
    
    #google-signin-button {
        margin: 1rem 0;
        display: flex;
        justify-content: center;
    }
    
    .google-signin-separator {
        text-align: center;
        margin: 1.5rem 0;
        position: relative;
    }
    
    .google-signin-separator::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: rgba(255, 255, 255, 0.2);
    }
    
    .google-signin-separator span {
        background: var(--dark-secondary);
        padding: 0 1rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
`;
document.head.appendChild(style);
