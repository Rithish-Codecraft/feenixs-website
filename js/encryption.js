// Advanced Encryption System for Feenixs Website
// Provides end-to-end encryption for sensitive data

class EncryptionSystem {
    constructor() {
        this.algorithm = 'AES-GCM';
        this.keyLength = 256;
        this.ivLength = 12;
        this.saltLength = 32;
        this.iterations = 100000;
    }

    // Generate encryption key from password
    async generateKey(password, salt) {
        try {
            // Import crypto library
            const encoder = new TextEncoder();
            const passwordData = encoder.encode(password);
            const saltData = encoder.encode(salt);
            
            // Derive key using PBKDF2
            const keyMaterial = await crypto.subtle.deriveKey({
                name: 'PBKDF2',
                salt: saltData,
                iterations: this.iterations,
                hash: 'SHA-256',
            }, passwordData, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
            
            return keyMaterial;
        } catch (error) {
            console.error('Key generation failed:', error);
            throw new Error('Failed to generate encryption key');
        }
    }

    // Generate random salt
    generateSalt() {
        const array = new Uint8Array(this.saltLength);
        crypto.getRandomValues(array);
        return Array.from(array).map(b => String.fromCharCode(b)).join('');
    }

    // Generate random IV
    generateIV() {
        const array = new Uint8Array(this.ivLength);
        crypto.getRandomValues(array);
        return array;
    }

    // Convert data types
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // Encrypt data
    async encrypt(data, password) {
        try {
            const salt = this.generateSalt();
            const iv = this.generateIV();
            const key = await this.generateKey(password, salt);
            
            const encoder = new TextEncoder();
            const dataToEncrypt = encoder.encode(JSON.stringify(data));
            
            const encryptedData = await crypto.subtle.encrypt({
                name: this.algorithm,
                iv: iv,
            }, key, dataToEncrypt);
            
            // Combine salt, IV, and encrypted data
            const combined = new Uint8Array([
                ...new TextEncoder().encode(salt),
                ...iv,
                ...new Uint8Array(encryptedData)
            ]);
            
            return {
                encrypted: this.arrayBufferToBase64(combined),
                salt: salt,
                iv: Array.from(iv).map(b => String.fromCharCode(b)).join('')
            };
        } catch (error) {
            console.error('Encryption failed:', error);
            throw new Error('Encryption failed');
        }
    }

    // Decrypt data
    async decrypt(encryptedData, password) {
        try {
            const combined = this.base64ToArrayBuffer(encryptedData.encrypted);
            const saltLength = this.saltLength;
            const ivLength = this.ivLength;
            
            // Extract components
            const salt = new Uint8Array(combined.slice(0, saltLength));
            const iv = new Uint8Array(combined.slice(saltLength, saltLength + ivLength));
            const encrypted = new Uint8Array(combined.slice(saltLength + ivLength));
            
            const saltString = Array.from(salt).map(b => String.fromCharCode(b)).join('');
            const key = await this.generateKey(password, saltString);
            
            // Decrypt data
            const decryptedData = await crypto.subtle.decrypt({
                name: this.algorithm,
                iv: iv,
            }, key, encrypted);
            
            const decoder = new TextDecoder();
            const decryptedJSON = decoder.decode(decryptedData);
            
            return JSON.parse(decryptedJSON);
        } catch (error) {
            console.error('Decryption failed:', error);
            throw new Error('Decryption failed');
        }
    }

    // Encrypt user data for storage
    async encryptUserData(userData, password) {
        try {
            const encrypted = await this.encrypt(userData, password);
            
            // Add metadata
            const encryptedPackage = {
                data: encrypted.encrypted,
                salt: encrypted.salt,
                iv: encrypted.iv,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            
            return encryptedPackage;
        } catch (error) {
            console.error('User data encryption failed:', error);
            throw error;
        }
    }

    // Decrypt user data from storage
    async decryptUserData(encryptedPackage, password) {
        try {
            const decrypted = await this.decrypt(encryptedPackage, password);
            return decrypted;
        } catch (error) {
            console.error('User data decryption failed:', error);
            throw error;
        }
    }

    // Hash password for storage
    async hashPassword(password) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(password + 'feenixs_salt_2026');
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            console.error('Password hashing failed:', error);
            throw error;
        }
    }

    // Generate secure session token
    generateSessionToken(user) {
        const sessionData = {
            userId: user.id || user.email,
            timestamp: Date.now(),
            random: Math.random().toString(36).substr(2, 9),
            userHash: this.hashString(user.email + user.id)
        };
        
        return btoa(JSON.stringify(sessionData));
    }

    // Hash string helper
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }

    // Validate session token
    validateSessionToken(token, user) {
        try {
            const decoded = atob(token);
            const sessionData = JSON.parse(decoded);
            
            // Check timestamp (24 hour expiry)
            const now = Date.now();
            const tokenAge = now - sessionData.timestamp;
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            
            if (tokenAge > maxAge) {
                return false;
            }
            
            // Validate user hash
            const expectedHash = this.hashString(user.email + user.id);
            if (sessionData.userHash !== expectedHash) {
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Session validation failed:', error);
            return false;
        }
    }

    // Encrypt messages for chat
    async encryptMessage(message, senderKey) {
        try {
            const encrypted = await this.encrypt({
                content: message,
                timestamp: new Date().toISOString(),
                messageId: this.generateMessageId()
            }, senderKey);
            
            return {
                encrypted: encrypted.encrypted,
                salt: encrypted.salt,
                iv: encrypted.iv,
                messageId: message.messageId
            };
        } catch (error) {
            console.error('Message encryption failed:', error);
            throw error;
        }
    }

    // Decrypt messages for chat
    async decryptMessage(encryptedMessage, recipientKey) {
        try {
            const decrypted = await this.decrypt(encryptedMessage, recipientKey);
            return decrypted;
        } catch (error) {
            console.error('Message decryption failed:', error);
            throw error;
        }
    }

    // Generate unique message ID
    generateMessageId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Create secure storage key
    createStorageKey(password) {
        const keyData = {
            password: password,
            salt: this.generateSalt(),
            created: new Date().toISOString(),
            version: '1.0'
        };
        
        // Store in secure location
        const encryptedKey = this.encrypt(keyData, password);
        localStorage.setItem('feenixs_storage_key', JSON.stringify(encryptedKey));
        
        return keyData;
    }

    // Get storage key
    getStorageKey() {
        try {
            const encryptedKey = localStorage.getItem('feenixs_storage_key');
            if (!encryptedKey) return null;
            
            const keyData = JSON.parse(encryptedKey);
            return keyData;
        } catch (error) {
            console.error('Failed to get storage key:', error);
            return null;
        }
    }

    // Clear storage key
    clearStorageKey() {
        localStorage.removeItem('feenixs_storage_key');
    }

    // Security utilities
    generateSecureId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 9);
        return timestamp + '_' + random;
    }

    // Validate password strength
    validatePasswordStrength(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*()_+=\\[\\]{}|:";'<>?,\./].test(password);
        
        let strength = 0;
        
        if (password.length >= minLength) strength += 1;
        if (hasUpperCase) strength += 1;
        if (hasLowerCase) strength += 1;
        if (hasNumbers) strength += 1;
        if (hasSpecialChars) strength += 1;
        
        const levels = {
            1: 'Very Weak',
            2: 'Weak',
            3: 'Fair',
            4: 'Good',
            5: 'Strong'
        };
        
        return {
            score: strength,
            level: levels[Math.min(strength, 5)],
            feedback: this.getPasswordFeedback(strength, minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars)
        };
    }

    // Get password feedback
    getPasswordFeedback(strength, minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars) {
        const feedback = [];
        
        if (password.length < minLength) {
            feedback.push(`Password must be at least ${minLength} characters`);
        }
        
        if (!hasUpperCase) {
            feedback.push('Add uppercase letters');
        }
        
        if (!hasLowerCase) {
            feedback.push('Add lowercase letters');
        }
        
        if (!hasNumbers) {
            feedback.push('Add numbers');
        }
        
        if (!hasSpecialChars) {
            feedback.push('Add special characters');
        }
        
        return feedback;
    }

    // Create secure random token
    generateSecureToken(length = 32) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    }
}

// Export encryption system
window.EncryptionSystem = new EncryptionSystem();

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Encryption system initialized');
    
    // Check for existing storage key
    const existingKey = window.EncryptionSystem.getStorageKey();
    if (existingKey) {
        console.log('Storage key found, encryption system ready');
    }
});
