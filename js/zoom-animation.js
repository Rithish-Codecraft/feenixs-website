// Immersive Zoom Animation System

class ImmersiveZoom {
    constructor() {
        this.isZoomed = false;
        this.currentZoom = 1;
        this.targetZoom = 1;
        this.minZoom = 0.5;
        this.maxZoom = 5;
        this.zoomSpeed = 0.1;
        this.smoothing = 0.15;
        
        this.zoomElements = [];
        this.activeElement = null;
        this.originalPosition = { x: 0, y: 0 };
        this.currentPosition = { x: 0, y: 0 };
        this.targetPosition = { x: 0, y: 0 };
        
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        
        this.particles = [];
        this.glowEffects = [];
        this.zoomTrail = [];
        
        this.init();
    }
    
    init() {
        this.createZoomContainer();
        this.setupEventListeners();
        this.initializeZoomElements();
        this.startAnimationLoop();
    }
    
    createZoomContainer() {
        // Create zoom overlay container
        this.zoomOverlay = document.createElement('div');
        this.zoomOverlay.id = 'zoom-overlay';
        this.zoomOverlay.className = 'zoom-overlay';
        this.zoomOverlay.innerHTML = `
            <div class="zoom-content">
                <div class="zoom-lens"></div>
                <div class="zoom-particles"></div>
                <div class="zoom-glow"></div>
                <div class="zoom-trail"></div>
            </div>
            <div class="zoom-controls">
                <button class="zoom-btn zoom-in" data-action="zoom-in">
                    <i class="fas fa-search-plus"></i>
                </button>
                <button class="zoom-btn zoom-out" data-action="zoom-out">
                    <i class="fas fa-search-minus"></i>
                </button>
                <button class="zoom-btn zoom-reset" data-action="zoom-reset">
                    <i class="fas fa-compress"></i>
                </button>
                <button class="zoom-btn zoom-fullscreen" data-action="zoom-fullscreen">
                    <i class="fas fa-expand"></i>
                </button>
                <div class="zoom-indicator">
                    <span class="zoom-level">100%</span>
                </div>
            </div>
            <div class="zoom-minimap">
                <div class="minimap-viewport"></div>
            </div>
        `;
        
        document.body.appendChild(this.zoomOverlay);
        
        // Get references to elements
        this.zoomContent = this.zoomOverlay.querySelector('.zoom-content');
        this.zoomLens = this.zoomOverlay.querySelector('.zoom-lens');
        this.zoomParticles = this.zoomOverlay.querySelector('.zoom-particles');
        this.zoomGlow = this.zoomOverlay.querySelector('.zoom-glow');
        this.zoomTrail = this.zoomOverlay.querySelector('.zoom-trail');
        this.zoomIndicator = this.zoomOverlay.querySelector('.zoom-level');
        this.minimapViewport = this.zoomOverlay.querySelector('.minimap-viewport');
    }
    
    setupEventListeners() {
        // Mouse events
        document.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('dblclick', this.handleDoubleClick.bind(this));
        
        // Touch events
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Keyboard events
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        // Zoom control buttons
        this.zoomOverlay.querySelectorAll('.zoom-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleZoomControl(e.target.closest('.zoom-btn').dataset.action);
            });
        });
        
        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    initializeZoomElements() {
        // Find all elements that can be zoomed
        const zoomableElements = document.querySelectorAll('.zoomable, .hero, .feature-card, .tool-card, .api-card, .post');
        
        zoomableElements.forEach(element => {
            this.zoomElements.push({
                element: element,
                rect: element.getBoundingClientRect(),
                content: element.cloneNode(true)
            });
        });
    }
    
    handleWheel(e) {
        if (!this.isZoomed) return;
        
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.targetZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.targetZoom + delta));
        
        // Create zoom particles
        this.createZoomParticles(e.clientX, e.clientY, delta > 0 ? 'zoom-in' : 'zoom-out');
        
        // Update zoom indicator
        this.updateZoomIndicator();
    }
    
    handleMouseDown(e) {
        if (!this.isZoomed) return;
        
        this.isDragging = true;
        this.dragStart = { x: e.clientX, y: e.clientY };
        this.originalPosition = { ...this.currentPosition };
        
        // Create drag effect
        this.createDragEffect(e.clientX, e.clientY);
    }
    
    handleMouseMove(e) {
        if (!this.isZoomed) return;
        
        if (this.isDragging) {
            const deltaX = e.clientX - this.dragStart.x;
            const deltaY = e.clientY - this.dragStart.y;
            
            this.targetPosition = {
                x: this.originalPosition.x + deltaX,
                y: this.originalPosition.y + deltaY
            };
            
            // Calculate velocity for smooth deceleration
            this.velocity = {
                x: deltaX * 0.1,
                y: deltaY * 0.1
            };
            
            // Update zoom lens position
            this.updateZoomLens(e.clientX, e.clientY);
        } else {
            // Update zoom lens position on hover
            this.updateZoomLens(e.clientX, e.clientY);
        }
    }
    
    handleMouseUp() {
        if (!this.isZoomed) return;
        
        this.isDragging = false;
        
        // Apply momentum
        this.applyMomentum();
    }
    
    handleDoubleClick(e) {
        e.preventDefault();
        
        const zoomableElement = e.target.closest('.zoomable, .hero, .feature-card, .tool-card, .api-card, .post');
        
        if (zoomableElement) {
            if (this.isZoomed && this.activeElement === zoomableElement) {
                this.exitZoom();
            } else {
                this.enterZoom(zoomableElement);
            }
        }
    }
    
    handleTouchStart(e) {
        if (!this.isZoomed) return;
        
        if (e.touches.length === 2) {
            // Pinch to zoom
            this.handlePinchStart(e);
        } else if (e.touches.length === 1) {
            // Single touch drag
            this.isDragging = true;
            this.dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            this.originalPosition = { ...this.currentPosition };
        }
    }
    
    handleTouchMove(e) {
        if (!this.isZoomed) return;
        
        e.preventDefault();
        
        if (e.touches.length === 2) {
            this.handlePinchMove(e);
        } else if (e.touches.length === 1 && this.isDragging) {
            const deltaX = e.touches[0].clientX - this.dragStart.x;
            const deltaY = e.touches[0].clientY - this.dragStart.y;
            
            this.targetPosition = {
                x: this.originalPosition.x + deltaX,
                y: this.originalPosition.y + deltaY
            };
        }
    }
    
    handleTouchEnd(e) {
        if (!this.isZoomed) return;
        
        this.isDragging = false;
        this.applyMomentum();
    }
    
    handleKeyDown(e) {
        if (!this.isZoomed) return;
        
        switch(e.key) {
            case '+':
            case '=':
                this.handleZoomControl('zoom-in');
                break;
            case '-':
            case '_':
                this.handleZoomControl('zoom-out');
                break;
            case '0':
                this.handleZoomControl('zoom-reset');
                break;
            case 'Escape':
                this.exitZoom();
                break;
            case 'ArrowUp':
                this.targetPosition.y += 20;
                break;
            case 'ArrowDown':
                this.targetPosition.y -= 20;
                break;
            case 'ArrowLeft':
                this.targetPosition.x += 20;
                break;
            case 'ArrowRight':
                this.targetPosition.x -= 20;
                break;
        }
    }
    
    handleKeyUp(e) {
        // Handle key release for smooth movement
    }
    
    handleResize() {
        if (this.isZoomed) {
            this.updateZoomBounds();
        }
    }
    
    handleZoomControl(action) {
        switch(action) {
            case 'zoom-in':
                this.targetZoom = Math.min(this.maxZoom, this.targetZoom + 0.2);
                this.createZoomParticles(window.innerWidth / 2, window.innerHeight / 2, 'zoom-in');
                break;
            case 'zoom-out':
                this.targetZoom = Math.max(this.minZoom, this.targetZoom - 0.2);
                this.createZoomParticles(window.innerWidth / 2, window.innerHeight / 2, 'zoom-out');
                break;
            case 'zoom-reset':
                this.targetZoom = 1;
                this.targetPosition = { x: 0, y: 0 };
                break;
            case 'zoom-fullscreen':
                this.toggleFullscreen();
                break;
        }
        
        this.updateZoomIndicator();
    }
    
    enterZoom(element) {
        this.isZoomed = true;
        this.activeElement = element;
        
        // Clone element content for zoom
        const clonedContent = element.cloneNode(true);
        clonedContent.style.position = 'absolute';
        clonedContent.style.top = '0';
        clonedContent.style.left = '0';
        clonedContent.style.width = '100%';
        clonedContent.style.height = '100%';
        clonedContent.style.transform = 'scale(1)';
        clonedContent.style.transition = 'none';
        
        this.zoomContent.innerHTML = '';
        this.zoomContent.appendChild(clonedContent);
        
        // Show zoom overlay
        this.zoomOverlay.classList.add('active');
        
        // Create entrance animation
        this.createEntranceAnimation();
        
        // Update minimap
        this.updateMinimap();
        
        // Create zoom particles
        this.createZoomBurst();
    }
    
    exitZoom() {
        this.isZoomed = false;
        this.activeElement = null;
        
        // Create exit animation
        this.createExitAnimation();
        
        setTimeout(() => {
            this.zoomOverlay.classList.remove('active');
            this.zoomContent.innerHTML = '';
            this.currentZoom = 1;
            this.targetZoom = 1;
            this.currentPosition = { x: 0, y: 0 };
            this.targetPosition = { x: 0, y: 0 };
        }, 300);
    }
    
    updateZoomLens(x, y) {
        if (!this.zoomLens) return;
        
        const rect = this.zoomOverlay.getBoundingClientRect();
        const relativeX = x - rect.left;
        const relativeY = y - rect.top;
        
        this.zoomLens.style.left = `${relativeX - 50}px`;
        this.zoomLens.style.top = `${relativeY - 50}px`;
    }
    
    updateZoomIndicator() {
        const percentage = Math.round(this.targetZoom * 100);
        this.zoomIndicator.textContent = `${percentage}%`;
    }
    
    updateZoomBounds() {
        // Update zoom boundaries based on window size
        const maxX = (window.innerWidth * this.currentZoom - window.innerWidth) / 2;
        const maxY = (window.innerHeight * this.currentZoom - window.innerHeight) / 2;
        
        this.targetPosition.x = Math.max(-maxX, Math.min(maxX, this.targetPosition.x));
        this.targetPosition.y = Math.max(-maxY, Math.min(maxY, this.targetPosition.y));
    }
    
    updateMinimap() {
        if (!this.activeElement) return;
        
        const elementRect = this.activeElement.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const scaleX = 100 / windowWidth;
        const scaleY = 100 / windowHeight;
        
        const viewportX = (-this.currentPosition.x * scaleX) + 50;
        const viewportY = (-this.currentPosition.y * scaleY) + 50;
        const viewportWidth = (windowWidth / this.currentZoom) * scaleX;
        const viewportHeight = (windowHeight / this.currentZoom) * scaleY;
        
        this.minimapViewport.style.left = `${viewportX}%`;
        this.minimapViewport.style.top = `${viewportY}%`;
        this.minimapViewport.style.width = `${viewportWidth}%`;
        this.minimapViewport.style.height = `${viewportHeight}%`;
    }
    
    createZoomParticles(x, y, type) {
        const particleCount = type === 'zoom-burst' ? 20 : 8;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `zoom-particle ${type}`;
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = type === 'zoom-burst' ? Math.random() * 200 + 100 : Math.random() * 50 + 20;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.setProperty('--tx', `${Math.cos(angle) * velocity}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle) * velocity}px`);
            
            this.zoomParticles.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
    
    createZoomBurst() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        this.createZoomParticles(centerX, centerY, 'zoom-burst');
    }
    
    createDragEffect(x, y) {
        const effect = document.createElement('div');
        effect.className = 'drag-effect';
        effect.style.left = `${x}px`;
        effect.style.top = `${y}px`;
        
        this.zoomOverlay.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 500);
    }
    
    createEntranceAnimation() {
        const entrance = document.createElement('div');
        entrance.className = 'zoom-entrance';
        this.zoomOverlay.appendChild(entrance);
        
        setTimeout(() => {
            entrance.remove();
        }, 600);
    }
    
    createExitAnimation() {
        const exit = document.createElement('div');
        exit.className = 'zoom-exit';
        this.zoomOverlay.appendChild(exit);
        
        setTimeout(() => {
            exit.remove();
        }, 600);
    }
    
    applyMomentum() {
        if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
            this.targetPosition.x += this.velocity.x;
            this.targetPosition.y += this.velocity.y;
            
            this.velocity.x *= 0.9;
            this.velocity.y *= 0.9;
            
            requestAnimationFrame(() => this.applyMomentum());
        }
    }
    
    handlePinchStart(e) {
        this.pinchStart = {
            distance: this.getPinchDistance(e),
            scale: this.currentZoom
        };
    }
    
    handlePinchMove(e) {
        const currentDistance = this.getPinchDistance(e);
        const scale = currentDistance / this.pinchStart.distance;
        
        this.targetZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.pinchStart.scale * scale));
        this.updateZoomIndicator();
    }
    
    getPinchDistance(e) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.zoomOverlay.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    startAnimationLoop() {
        const animate = () => {
            // Smooth zoom interpolation
            this.currentZoom += (this.targetZoom - this.currentZoom) * this.smoothing;
            
            // Smooth position interpolation
            this.currentPosition.x += (this.targetPosition.x - this.currentPosition.x) * this.smoothing;
            this.currentPosition.y += (this.targetPosition.y - this.currentPosition.y) * this.smoothing;
            
            // Apply transformations
            if (this.isZoomed && this.zoomContent.firstChild) {
                this.zoomContent.firstChild.style.transform = `
                    scale(${this.currentZoom}) 
                    translate(${this.currentPosition.x}px, ${this.currentPosition.y}px)
                `;
                
                // Update glow effect
                this.updateGlowEffect();
                
                // Update minimap
                this.updateMinimap();
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    updateGlowEffect() {
        if (!this.zoomGlow) return;
        
        const intensity = Math.min(1, (this.currentZoom - 1) / 2);
        const glowSize = 50 + (this.currentZoom - 1) * 100;
        
        this.zoomGlow.style.width = `${glowSize}px`;
        this.zoomGlow.style.height = `${glowSize}px`;
        this.zoomGlow.style.opacity = intensity;
        this.zoomGlow.style.left = '50%';
        this.zoomGlow.style.top = '50%';
        this.zoomGlow.style.transform = 'translate(-50%, -50%)';
    }
    
    // Public methods
    zoomTo(element, scale = 2) {
        this.enterZoom(element);
        this.targetZoom = scale;
        this.updateZoomIndicator();
    }
    
    zoomToPosition(x, y, scale = 2) {
        this.targetZoom = scale;
        this.targetPosition = { x: -x * scale + window.innerWidth / 2, y: -y * scale + window.innerHeight / 2 };
        this.updateZoomIndicator();
    }
    
    resetZoom() {
        this.handleZoomControl('zoom-reset');
    }
    
    getCurrentZoom() {
        return this.currentZoom;
    }
    
    isZoomActive() {
        return this.isZoomed;
    }
}

// Initialize zoom system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.immersiveZoom = new ImmersiveZoom();
    
    // Add zoomable class to common elements
    const zoomableSelectors = [
        '.hero',
        '.feature-card',
        '.tool-card',
        '.api-card',
        '.post',
        '.sdk-card',
        '.metric-card',
        '.experiment-card'
    ];
    
    zoomableSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.classList.add('zoomable');
        });
    });
});

// Global functions for external access
function zoomToElement(element, scale = 2) {
    window.immersiveZoom.zoomTo(element, scale);
}

function resetZoom() {
    window.immersiveZoom.resetZoom();
}

function zoomToPosition(x, y, scale = 2) {
    window.immersiveZoom.zoomToPosition(x, y, scale);
}
