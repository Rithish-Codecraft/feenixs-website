// Secure Chat System with End-to-End Encryption

class SecureChat {
    constructor() {
        this.encryptionEnabled = false;
        this.userEncryptionKey = null;
    }

    // Initialize secure chat
    async init(currentUser) {
        if (!currentUser) {
            console.log('No user logged in for secure chat');
            return;
        }

        // Check if user has encryption key
        if (currentUser.encrypted && typeof window.EncryptionSystem !== 'undefined') {
            this.encryptionEnabled = true;
            
            // Prompt for encryption password
            const password = prompt('Enter your encryption password to decrypt messages:');
            if (password) {
                try {
                    const keyData = window.EncryptionSystem.getStorageKey();
                    if (keyData && keyData.password === password) {
                        this.userEncryptionKey = keyData;
                        console.log('Secure chat initialized with encryption');
                        this.setupSecureChatInterface();
                    } else {
                        alert('Invalid encryption password');
                    }
                } catch (error) {
                    console.error('Failed to initialize encryption:', error);
                }
            }
        } else {
            this.encryptionEnabled = false;
            this.setupStandardChatInterface();
        }
    }

    // Setup secure chat interface
    setupSecureChatInterface() {
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-message');
        
        if (chatInput) {
            chatInput.placeholder = 'Type your encrypted message...';
            chatInput.style.borderColor = '#00ff88';
        }

        if (sendButton) {
            sendButton.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
            sendButton.innerHTML = '<i class="fas fa-lock"></i> Send Encrypted';
        }

        // Override send message function
        this.sendSecureMessage = this.createSecureMessageSender();
    }

    // Setup standard chat interface
    setupStandardChatInterface() {
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-message');
        
        if (chatInput) {
            chatInput.placeholder = 'Type your message...';
            chatInput.style.borderColor = '';
        }

        if (sendButton) {
            sendButton.style.background = '';
            sendButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
        }

        // Override send message function
        this.sendSecureMessage = this.createStandardMessageSender();
    }

    // Create secure message sender
    createSecureMessageSender() {
        return async (message) => {
            try {
                if (!this.encryptionEnabled || !this.userEncryptionKey) {
                    throw new Error('Encryption not enabled');
                }

                // Encrypt message
                const encrypted = await window.EncryptionSystem.encrypt(message, this.userEncryptionKey.password);
                
                // Send encrypted message
                await this.sendEncryptedMessage(encrypted);
                
                // Display encrypted preview
                this.displayEncryptedPreview(message);
                
                return true;
            } catch (error) {
                console.error('Failed to send secure message:', error);
                return false;
            }
        };
    }

    // Create standard message sender
    createStandardMessageSender() {
        return async (message) => {
            try {
                // Send standard message
                await this.sendStandardMessage(message);
                return true;
            } catch (error) {
                console.error('Failed to send message:', error);
                return false;
            }
        };
    }

    // Send encrypted message
    async sendEncryptedMessage(encryptedData) {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            const messageData = {
                username: currentUser.username,
                message: encryptedData,
                timestamp: new Date().toISOString(),
                encrypted: true,
                messageId: window.EncryptionSystem.generateMessageId()
            };

            // Save to chat storage
            await this.saveSecureMessage(messageData);
            
            // Update chat display
            this.addSecureMessageToChat(messageData);
            
        } catch (error) {
            console.error('Failed to send encrypted message:', error);
        }
    }

    // Send standard message
    async sendStandardMessage(message) {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            const messageData = {
                username: currentUser.username,
                message: message,
                timestamp: new Date().toISOString(),
                encrypted: false,
                messageId: window.EncryptionSystem.generateMessageId()
            };

            // Save to chat storage
            await this.saveStandardMessage(messageData);
            
            // Update chat display
            this.addMessageToChat(messageData);
            
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }

    // Save encrypted message to storage
    async saveSecureMessage(messageData) {
        try {
            const messages = await this.getSecureMessagesFromStorage();
            messages.push(messageData);
            await this.saveSecureMessagesToStorage(messages);
        } catch (error) {
            console.error('Failed to save secure message:', error);
        }
    }

    // Save standard message to storage
    async saveStandardMessage(messageData) {
        try {
            const messages = await this.getStandardMessagesFromStorage();
            messages.push(messageData);
            await this.saveStandardMessagesToStorage(messages);
        } catch (error) {
            console.error('Failed to save message:', error);
        }
    }

    // Get secure messages from storage
    async getSecureMessagesFromStorage() {
        try {
            const encryptedMessages = localStorage.getItem('secureChatMessages');
            if (encryptedMessages) {
                const messages = JSON.parse(encryptedMessages);
                const decryptedMessages = [];
                
                for (const msg of messages) {
                    if (msg.encrypted) {
                        try {
                            const decrypted = await window.EncryptionSystem.decrypt(msg, this.userEncryptionKey.password);
                            decryptedMessages.push(decrypted);
                        } catch (error) {
                            console.error('Failed to decrypt message:', error);
                            // Add undecrypted message with error indicator
                            decryptedMessages.push({
                                ...msg,
                                decryptError: true,
                                error: 'Decryption failed'
                            });
                        }
                    } else {
                        decryptedMessages.push(msg);
                    }
                }
                
                return decryptedMessages;
            }
            
            return [];
        } catch (error) {
            console.error('Failed to get secure messages:', error);
            return [];
        }
    }

    // Get standard messages from storage
    async getStandardMessagesFromStorage() {
        try {
            const messages = localStorage.getItem('chatMessages');
            return messages ? JSON.parse(messages) : [];
        } catch (error) {
            console.error('Failed to get messages:', error);
            return [];
        }
    }

    // Save secure messages to storage
    async saveSecureMessagesToStorage(messages) {
        try {
            localStorage.setItem('secureChatMessages', JSON.stringify(messages));
        } catch (error) {
            console.error('Failed to save secure messages:', error);
        }
    }

    // Save standard messages to storage
    async saveStandardMessagesToStorage(messages) {
        try {
            localStorage.setItem('chatMessages', JSON.stringify(messages));
        } catch (error) {
            console.error('Failed to save messages:', error);
        }
    }

    // Add encrypted message to chat display
    addSecureMessageToChat(messageData) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageElement = this.createEncryptedMessageElement(messageData);
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add standard message to chat display
    addMessageToChat(messageData) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageElement = this.createMessageElement(messageData);
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Create encrypted message element
    createEncryptedMessageElement(messageData) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message encrypted';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = '<i class="fas fa-lock"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        
        const authorSpan = document.createElement('span');
        authorSpan.className = 'message-author';
        authorSpan.textContent = messageData.username;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = this.formatTime(messageData.timestamp);
        
        headerDiv.appendChild(authorSpan);
        headerDiv.appendChild(timeSpan);
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.innerHTML = `
            <div class="encryption-indicator">
                <i class="fas fa-lock"></i>
                <span>Encrypted Message</span>
            </div>
            <div class="message-preview">
                ${messageData.decryptError ? 
                    `<span class="error-text">Decryption failed: ${messageData.error}</span>` :
                    `<em>Encrypted content visible only to recipients with encryption key</em>`
                }
            </div>
        `;
        
        contentDiv.appendChild(headerDiv);
        contentDiv.appendChild(textDiv);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        return messageDiv;
    }

    // Create standard message element
    createMessageElement(messageData) {
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
        authorSpan.textContent = messageData.username;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = this.formatTime(messageData.timestamp);
        
        headerDiv.appendChild(authorSpan);
        headerDiv.appendChild(timeSpan);
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = messageData.message;
        
        contentDiv.appendChild(headerDiv);
        contentDiv.appendChild(textDiv);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        return messageDiv;
    }

    // Format time
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) {
            return 'Just now';
        } else if (diff < 3600000) {
            return `${Math.floor(diff / 60000)} minutes ago`;
        } else if (diff < 86400000) {
            return `${Math.floor(diff / 3600000)} hours ago`;
        } else {
            return `${Math.floor(diff / 86400000)} days ago`;
        }
    }

    // Toggle encryption
    toggleEncryption() {
        this.encryptionEnabled = !this.encryptionEnabled;
        
        if (this.encryptionEnabled) {
            this.setupSecureChatInterface();
        } else {
            this.setupStandardChatInterface();
        }
        
        console.log(`Encryption ${this.encryptionEnabled ? 'enabled' : 'disabled'}`);
    }
}

// Export secure chat system
window.SecureChat = new SecureChat();
