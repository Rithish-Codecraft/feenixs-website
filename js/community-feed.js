// Community Feed JavaScript

class CommunityFeed {
    constructor() {
        this.socket = null;
        this.currentUser = null;
        this.posts = [];
        this.onlineUsers = [];
        this.notifications = [];
        this.currentPage = 1;
        this.postsPerPage = 10;
        this.isLoading = false;
        this.currentFilter = 'all';
        this.currentSort = 'latest';
        
        this.init();
    }
    
    init() {
        // Initialize loading screen
        this.initLoadingScreen();
        
        // Initialize socket connection
        this.initSocketConnection();
        
        // Initialize animations
        this.initAnimations();
        
        // Initialize feed controls
        this.initFeedControls();
        
        // Initialize create post modal
        this.initCreatePostModal();
        
        // Initialize notifications
        this.initNotifications();
        
        // Load initial data
        this.loadInitialData();
        
        // Hide loading screen
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);
    }
    
    initLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    initSocketConnection() {
        // Initialize Socket.io connection
        this.socket = io('https://api.feenixs.com', {
            transports: ['websocket', 'polling'],
            upgrade: true
        });
        
        this.socket.on('connect', () => {
            console.log('Connected to community server');
            this.joinCommunity();
        });
        
        this.socket.on('disconnect', () => {
            console.log('Disconnected from community server');
        });
        
        this.socket.on('new_post', (post) => {
            this.addNewPost(post);
        });
        
        this.socket.on('user_online', (user) => {
            this.addOnlineUser(user);
        });
        
        this.socket.on('user_offline', (user) => {
            this.removeOnlineUser(user);
        });
        
        this.socket.on('notification', (notification) => {
            this.addNotification(notification);
        });
        
        this.socket.on('community_stats', (stats) => {
            this.updateCommunityStats(stats);
        });
        
        this.socket.on('trending_topics', (topics) => {
            this.updateTrendingTopics(topics);
        });
        
        this.socket.on('upcoming_events', (events) => {
            this.updateUpcomingEvents(events);
        });
    }
    
    joinCommunity() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.isLoggedIn) {
            this.currentUser = currentUser;
            this.socket.emit('join_community', {
                user_id: currentUser.id,
                username: currentUser.username
            });
        }
    }
    
    initAnimations() {
        // GSAP animations for hero section
        gsap.from('.hero-text h1', {
            duration: 1.5,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-text p', {
            duration: 1.5,
            y: 30,
            opacity: 0,
            delay: 0.3,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-stats .stat-item', {
            duration: 1.5,
            y: 20,
            opacity: 0,
            delay: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        });
        
        gsap.from('.community-visualization', {
            duration: 2,
            scale: 0.8,
            opacity: 0,
            delay: 0.8,
            ease: 'elastic.out(1, 0.5)'
        });
        
        // Animate network nodes
        gsap.to('.node', {
            duration: 3,
            rotation: 360,
            repeat: -1,
            ease: 'none',
            stagger: 0.2
        });
        
        // Animate connection lines
        gsap.to('.line', {
            duration: 4,
            opacity: 0.3,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut',
            stagger: 0.5
        });
    }
    
    initFeedControls() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
        
        // Sort buttons
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setSort(e.target.dataset.sort);
            });
        });
    }
    
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        // Reload posts with new filter
        this.loadPosts(true);
    }
    
    setSort(sort) {
        this.currentSort = sort;
        
        // Update active state
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-sort="${sort}"]`).classList.add('active');
        
        // Reload posts with new sort
        this.loadPosts(true);
    }
    
    initCreatePostModal() {
        const form = document.getElementById('create-post-form');
        const postTypeSelect = document.getElementById('post-type');
        const tagsInput = document.getElementById('post-tags');
        
        // Post type change handler
        postTypeSelect.addEventListener('change', (e) => {
            this.updatePostTypeUI(e.target.value);
        });
        
        // Tags input handler
        tagsInput.addEventListener('input', (e) => {
            this.showTagSuggestions(e.target.value);
        });
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPost();
        });
    }
    
    updatePostTypeUI(postType) {
        const titleInput = document.getElementById('post-title');
        const contentInput = document.getElementById('post-content');
        
        // Update placeholders based on post type
        const placeholders = {
            discussion: {
                title: 'Start a discussion...',
                content: 'Share your thoughts and questions...'
            },
            question: {
                title: 'What\'s your question?',
                content: 'Provide details about your question...'
            },
            showcase: {
                title: 'Show your project!',
                content: 'Describe your project and share links...'
            },
            announcement: {
                title: 'Make an announcement',
                content: 'Share important news or updates...'
            },
            event: {
                title: 'Event title',
                content: 'Event details, date, time, location...'
            }
        };
        
        if (placeholders[postType]) {
            titleInput.placeholder = placeholders[postType].title;
            contentInput.placeholder = placeholders[postType].content;
        }
    }
    
    showTagSuggestions(query) {
        const suggestionsContainer = document.getElementById('tag-suggestions');
        const suggestions = this.getTagSuggestions(query);
        
        suggestionsContainer.innerHTML = '';
        suggestions.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag-suggestion';
            tagElement.textContent = tag;
            tagElement.addEventListener('click', () => {
                this.addTag(tag);
            });
            suggestionsContainer.appendChild(tagElement);
        });
    }
    
    getTagSuggestions(query) {
        const allTags = [
            'javascript', 'python', 'react', 'vue', 'nodejs',
            'machine-learning', 'ai', 'web-development',
            'frontend', 'backend', 'database', 'api',
            'tutorial', 'help', 'beginner', 'advanced',
            'css', 'html', 'typescript', 'docker'
        ];
        
        if (!query) return allTags.slice(0, 5);
        
        return allTags.filter(tag => 
            tag.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 8);
    }
    
    addTag(tag) {
        const tagsInput = document.getElementById('post-tags');
        const currentTags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
        
        if (!currentTags.includes(tag)) {
            currentTags.push(tag);
            tagsInput.value = currentTags.join(', ');
            this.showTagSuggestions('');
        }
    }
    
    initNotifications() {
        // Initialize notifications panel
        this.updateNotificationCount();
    }
    
    loadInitialData() {
        this.loadPosts();
        this.loadOnlineUsers();
        this.loadNotifications();
    }
    
    async loadPosts(reset = false) {
        if (reset) {
            this.currentPage = 1;
            this.posts = [];
            document.getElementById('feed-posts').innerHTML = '';
        }
        
        this.setLoadingState(true);
        
        try {
            const response = await fetch(`/api/community/posts?page=${this.currentPage}&filter=${this.currentFilter}&sort=${this.currentSort}`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.appendPosts(data.posts);
                this.currentPage++;
            }
        } catch (error) {
            console.error('Error loading posts:', error);
            this.showError('Failed to load posts');
        }
        
        this.setLoadingState(false);
    }
    
    appendPosts(newPosts) {
        const feedContainer = document.getElementById('feed-posts');
        
        newPosts.forEach(post => {
            this.posts.push(post);
            const postElement = this.createPostElement(post);
            feedContainer.appendChild(postElement);
            
            // Animate new post
            gsap.from(postElement, {
                duration: 1,
                y: 50,
                opacity: 0,
                ease: 'power3.out'
            });
        });
    }
    
    createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.dataset.postId = post.id;
        
        const postTypeClass = post.type || 'discussion';
        
        postDiv.innerHTML = `
            <div class="post-header">
                <div class="post-author">
                    <div class="author-avatar">${post.author.username.charAt(0).toUpperCase()}</div>
                    <div class="author-info">
                        <div class="author-name">${post.author.username}</div>
                        <div class="post-time">${this.formatTime(post.created_at)}</div>
                    </div>
                </div>
                <div class="post-type ${postTypeClass}">${post.type || 'discussion'}</div>
            </div>
            
            <div class="post-content">
                ${post.title ? `<h3 class="post-title">${post.title}</h3>` : ''}
                <div class="post-text">${post.content}</div>
                ${post.tags ? this.createPostTags(post.tags) : ''}
            </div>
            
            <div class="post-actions">
                <div class="action-buttons">
                    <button class="action-btn ${post.user_liked ? 'liked' : ''}" onclick="communityFeed.toggleLike('${post.id}')">
                        <i class="fas fa-heart"></i>
                        <span>${post.likes_count || 0}</span>
                    </button>
                    <button class="action-btn" onclick="communityFeed.toggleComment('${post.id}')">
                        <i class="fas fa-comment"></i>
                        <span>${post.comments_count || 0}</span>
                    </button>
                    <button class="action-btn" onclick="communityFeed.sharePost('${post.id}')">
                        <i class="fas fa-share"></i>
                        <span>Share</span>
                    </button>
                </div>
                <div class="post-stats">
                    <span>${post.views_count || 0} views</span>
                </div>
            </div>
        `;
        
        return postDiv;
    }
    
    createPostTags(tags) {
        const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
        return `
            <div class="post-tags">
                ${tagsArray.map(tag => `<span class="post-tag">#${tag}</span>`).join('')}
            </div>
        `;
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString();
    }
    
    async createPost() {
        const form = document.getElementById('create-post-form');
        const formData = new FormData(form);
        
        const postData = {
            type: formData.get('post-type'),
            title: formData.get('post-title'),
            content: formData.get('post-content'),
            tags: formData.get('post-tags'),
            visibility: formData.get('post-visibility')
        };
        
        try {
            const response = await fetch('/api/community/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify(postData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.closeCreatePostModal();
                this.showSuccess('Post created successfully!');
                this.loadPosts(true);
            } else {
                this.showError(result.message || 'Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            this.showError('Failed to create post');
        }
    }
    
    closeCreatePostModal() {
        document.getElementById('create-post-modal').classList.remove('active');
        document.getElementById('create-post-form').reset();
    }
    
    async loadOnlineUsers() {
        try {
            const response = await fetch('/api/community/online-users', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.updateOnlineUsersList(data.users);
                this.updateOnlineUsersCount(data.users.length);
            }
        } catch (error) {
            console.error('Error loading online users:', error);
        }
    }
    
    updateOnlineUsersList(users) {
        const usersList = document.getElementById('online-users-list');
        usersList.innerHTML = '';
        
        users.slice(0, 8).forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'online-user';
            userElement.innerHTML = `
                <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
                <div class="user-info">
                    <div class="user-name">${user.username}</div>
                    <div class="user-status online">Online</div>
                </div>
            `;
            usersList.appendChild(userElement);
        });
    }
    
    updateOnlineUsersCount(count) {
        const element = document.getElementById('online-users');
        if (element) {
            element.textContent = count;
        }
    }
    
    async loadNotifications() {
        try {
            const response = await fetch('/api/community/notifications', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.notifications = data.notifications;
                this.updateNotificationsList();
                this.updateNotificationCount();
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }
    
    updateNotificationsList() {
        const notificationsList = document.getElementById('notifications-list');
        notificationsList.innerHTML = '';
        
        this.notifications.slice(0, 10).forEach(notification => {
            const notificationElement = document.createElement('div');
            notificationElement.className = `notification-item ${notification.read ? '' : 'unread'}`;
            notificationElement.innerHTML = `
                <div class="notification-content">${notification.message}</div>
                <div class="notification-time">${this.formatTime(notification.created_at)}</div>
            `;
            notificationsList.appendChild(notificationElement);
        });
    }
    
    updateNotificationCount() {
        const count = this.notifications.filter(n => !n.read).length;
        const element = document.getElementById('notification-count');
        if (element) {
            element.textContent = count;
            element.style.display = count > 0 ? 'block' : 'none';
        }
    }
    
    addNotification(notification) {
        this.notifications.unshift(notification);
        this.updateNotificationsList();
        this.updateNotificationCount();
        
        // Show notification toast
        this.showNotificationToast(notification);
    }
    
    showNotificationToast(notification) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <div class="toast-content">${notification.message}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to page
        document.body.appendChild(toast);
        
        // Animate in
        gsap.from(toast, {
            duration: 0.5,
            y: -50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        // Remove after 5 seconds
        setTimeout(() => {
            gsap.to(toast, {
                duration: 0.5,
                y: -50,
                opacity: 0,
                ease: 'power3.in',
                onComplete: () => toast.remove()
            });
        }, 5000);
    }
    
    updateCommunityStats(stats) {
        document.getElementById('active-posts').textContent = stats.active_posts || 0;
        document.getElementById('total-members').textContent = stats.total_members || 0;
        document.getElementById('posts-today').textContent = stats.posts_today || 0;
        document.getElementById('new-members').textContent = stats.new_members || 0;
        document.getElementById('active-projects').textContent = stats.active_projects || 0;
    }
    
    updateTrendingTopics(topics) {
        const container = document.getElementById('trending-topics');
        container.innerHTML = '';
        
        topics.forEach(topic => {
            const topicElement = document.createElement('div');
            topicElement.className = 'trending-topic';
            topicElement.innerHTML = `
                <span class="topic-name">#${topic.name}</span>
                <span class="topic-count">${topic.count}</span>
            `;
            container.appendChild(topicElement);
        });
    }
    
    updateUpcomingEvents(events) {
        const container = document.getElementById('upcoming-events');
        container.innerHTML = '';
        
        events.slice(0, 3).forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            eventElement.innerHTML = `
                <div class="event-title">${event.title}</div>
                <div class="event-date">${new Date(event.date).toLocaleDateString()}</div>
            `;
            container.appendChild(eventElement);
        });
    }
    
    addOnlineUser(user) {
        this.onlineUsers.push(user);
        this.updateOnlineUsersList(this.onlineUsers);
        this.updateOnlineUsersCount(this.onlineUsers.length);
    }
    
    removeOnlineUser(user) {
        this.onlineUsers = this.onlineUsers.filter(u => u.id !== user.id);
        this.updateOnlineUsersList(this.onlineUsers);
        this.updateOnlineUsersCount(this.onlineUsers.length);
    }
    
    addNewPost(post) {
        this.posts.unshift(post);
        const feedContainer = document.getElementById('feed-posts');
        const postElement = this.createPostElement(post);
        
        // Add to top of feed
        feedContainer.insertBefore(postElement, feedContainer.firstChild);
        
        // Animate new post
        gsap.from(postElement, {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        // Update stats
        const activePostsElement = document.getElementById('active-posts');
        if (activePostsElement) {
            activePostsElement.textContent = parseInt(activePostsElement.textContent) + 1;
        }
    }
    
    async toggleLike(postId) {
        try {
            const response = await fetch(`/api/community/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.updatePostLike(postId, result.liked, result.likes_count);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    }
    
    updatePostLike(postId, liked, likesCount) {
        const postElement = document.querySelector(`[data-post-id="${postId}"]`);
        if (postElement) {
            const likeButton = postElement.querySelector('.action-btn');
            const likeCount = likeButton.querySelector('span');
            
            if (liked) {
                likeButton.classList.add('liked');
            } else {
                likeButton.classList.remove('liked');
            }
            
            likeCount.textContent = likesCount;
        }
    }
    
    toggleComment(postId) {
        // Open comment modal or scroll to comments
        console.log('Toggle comments for post:', postId);
    }
    
    sharePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            const shareUrl = `${window.location.origin}/community-feed.html#post-${postId}`;
            
            if (navigator.share) {
                navigator.share({
                    title: post.title,
                    text: post.content,
                    url: shareUrl
                });
            } else {
                navigator.clipboard.writeText(shareUrl);
                this.showSuccess('Post link copied to clipboard!');
            }
        }
    }
    
    loadMorePosts() {
        if (!this.isLoading) {
            this.loadPosts();
        }
    }
    
    refreshFeed() {
        this.loadPosts(true);
        this.showSuccess('Feed refreshed!');
    }
    
    toggleNotifications() {
        const panel = document.getElementById('notifications-panel');
        panel.classList.toggle('active');
    }
    
    createPost() {
        document.getElementById('create-post-modal').classList.add('active');
    }
    
    setLoadingState(loading) {
        this.isLoading = loading;
        const loadMoreBtn = document.getElementById('load-more-btn');
        const loadingSpinner = document.getElementById('loading-spinner');
        const loadMoreText = document.getElementById('load-more-text');
        
        if (loading) {
            loadMoreBtn.disabled = true;
            loadingSpinner.style.display = 'inline-block';
            loadMoreText.textContent = 'Loading...';
        } else {
            loadMoreBtn.disabled = false;
            loadingSpinner.style.display = 'none';
            loadMoreText.textContent = 'Load More Posts';
        }
    }
    
    getAuthToken() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        return currentUser.token || '';
    }
    
    showSuccess(message) {
        this.showToast(message, 'success');
    }
    
    showError(message) {
        this.showToast(message, 'error');
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">${message}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to page
        document.body.appendChild(toast);
        
        // Animate in
        gsap.from(toast, {
            duration: 0.5,
            y: -50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            gsap.to(toast, {
                duration: 0.5,
                y: -50,
                opacity: 0,
                ease: 'power3.in',
                onComplete: () => toast.remove()
            });
        }, 3000);
    }
    
    // Initialize scroll animations
    initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);
        
        // Animate posts on scroll
        gsap.utils.toArray('.post').forEach((post, index) => {
            gsap.from(post, {
                scrollTrigger: {
                    trigger: post,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                duration: 1,
                y: 50,
                opacity: 0,
                delay: index * 0.1,
                ease: 'power3.out'
            });
        });
        
        // Animate sidebar sections
        gsap.utils.toArray('.sidebar-section').forEach((section, index) => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                duration: 1,
                x: -50,
                opacity: 0,
                delay: index * 0.1,
                ease: 'power3.out'
            });
        });
    }
}

// Global functions for onclick handlers
function createPost() {
    communityFeed.createPost();
}

function closeCreatePostModal() {
    communityFeed.closeCreatePostModal();
}

function refreshFeed() {
    communityFeed.refreshFeed();
}

function toggleNotifications() {
    communityFeed.toggleNotifications();
}

function loadMorePosts() {
    communityFeed.loadMorePosts();
}

// Initialize community feed when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.communityFeed = new CommunityFeed();
    
    // Initialize scroll animations after a short delay
    setTimeout(() => {
        communityFeed.initScrollAnimations();
    }, 1000);
});
