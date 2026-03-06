// 3D Hover Animation System

class Hover3D {
    constructor() {
        this.elements = [];
        this.mousePosition = { x: 0, y: 0 };
        this.windowSize = { width: window.innerWidth, height: window.innerHeight };
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeElements();
        this.startAnimationLoop();
        this.isInitialized = true;
    }
    
    setupEventListeners() {
        // Mouse move events
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
        document.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        
        // Touch events
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        
        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Device orientation
        window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
    }
    
    initializeElements() {
        // Find all 3D hover elements
        const hoverElements = document.querySelectorAll('.hover-3d, .card-3d, .feature-card, .tool-card, .api-card, .post, .sdk-card, .metric-card, .experiment-card');
        
        hoverElements.forEach((element, index) => {
            this.elements.push({
                element: element,
                index: index,
                rect: element.getBoundingClientRect(),
                transform: {
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    scale: 1,
                    translateX: 0,
                    translateY: 0,
                    translateZ: 0
                },
                target: {
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    scale: 1,
                    translateX: 0,
                    translateY: 0,
                    translateZ: 0
                },
                velocity: {
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    scale: 0,
                    translateX: 0,
                    translateY: 0
                },
                isHovered: false,
                isAnimating: false,
                particles: [],
                glowIntensity: 0,
                shadowIntensity: 0
            });
            
            // Add 3D classes and data attributes
            element.classList.add('hover-3d-element');
            element.dataset.hoverIndex = index;
            
            // Create 3D structure
            this.create3DStructure(element);
            
            // Create particle container
            this.createParticleContainer(element);
            
            // Create glow effect
            this.createGlowEffect(element);
        });
    }
    
    create3DStructure(element) {
        // Wrap element in 3D container
        const container = document.createElement('div');
        container.className = 'hover-3d-container';
        
        const face = document.createElement('div');
        face.className = 'hover-3d-face';
        
        // Move element inside 3D structure
        while (element.firstChild) {
            face.appendChild(element.firstChild);
        }
        
        container.appendChild(face);
        element.appendChild(container);
        
        // Store references
        element.hover3DContainer = container;
        element.hover3DFace = face;
    }
    
    createParticleContainer(element) {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'hover-3d-particles';
        element.appendChild(particleContainer);
        element.particleContainer = particleContainer;
    }
    
    createGlowEffect(element) {
        const glowEffect = document.createElement('div');
        glowEffect.className = 'hover-3d-glow';
        element.appendChild(glowEffect);
        element.glowEffect = glowEffect;
    }
    
    handleMouseMove(e) {
        this.mousePosition = {
            x: e.clientX,
            y: e.clientY
        };
        
        // Update all elements
        this.elements.forEach(elementData => {
            this.updateElementTransform(elementData);
        });
    }
    
    handleTouchMove(e) {
        if (e.touches.length > 0) {
            this.mousePosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
            
            this.elements.forEach(elementData => {
                this.updateElementTransform(elementData);
            });
        }
    }
    
    handleMouseEnter(e) {
        const element = e.target.closest('.hover-3d-element');
        if (element) {
            const elementData = this.elements.find(el => el.element === element);
            if (elementData) {
                elementData.isHovered = true;
                this.createEnterAnimation(elementData);
            }
        }
    }
    
    handleMouseLeave(e) {
        const element = e.target.closest('.hover-3d-element');
        if (element) {
            const elementData = this.elements.find(el => el.element === element);
            if (elementData) {
                elementData.isHovered = false;
                this.createExitAnimation(elementData);
            }
        }
    }
    
    handleTouchStart(e) {
        if (e.touches.length > 0) {
            const element = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
            const hoverElement = element.closest('.hover-3d-element');
            
            if (hoverElement) {
                const elementData = this.elements.find(el => el.element === hoverElement);
                if (elementData) {
                    elementData.isHovered = true;
                    this.createEnterAnimation(elementData);
                }
            }
        }
    }
    
    handleTouchEnd(e) {
        this.elements.forEach(elementData => {
            if (elementData.isHovered) {
                elementData.isHovered = false;
                this.createExitAnimation(elementData);
            }
        });
    }
    
    handleResize() {
        this.windowSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        // Update element positions
        this.elements.forEach(elementData => {
            elementData.rect = elementData.element.getBoundingClientRect();
        });
    }
    
    handleOrientation(e) {
        // Handle device orientation for mobile 3D effects
        const tiltX = e.gamma ? e.gamma / 90 : 0;
        const tiltY = e.beta ? e.beta / 180 : 0;
        
        this.elements.forEach(elementData => {
            if (elementData.isHovered) {
                elementData.target.rotateX = tiltY * 15;
                elementData.target.rotateY = tiltX * 15;
            }
        });
    }
    
    updateElementTransform(elementData) {
        const rect = elementData.rect;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from mouse to element center
        const deltaX = this.mousePosition.x - centerX;
        const deltaY = this.mousePosition.y - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Check if mouse is over element
        const isOverElement = this.isPointInElement(this.mousePosition, rect);
        
        if (isOverElement) {
            // Calculate 3D rotation based on mouse position
            const rotateY = (deltaX / rect.width) * 30; // Max 30 degrees rotation
            const rotateX = -(deltaY / rect.height) * 30; // Max 30 degrees rotation
            
            // Calculate scale based on distance
            const maxDistance = Math.max(rect.width, rect.height);
            const scale = 1 + (1 - Math.min(distance / maxDistance, 1)) * 0.2;
            
            // Calculate Z translation
            const translateZ = scale > 1 ? (scale - 1) * 50 : 0;
            
            // Update target transform
            elementData.target = {
                rotateX: rotateX,
                rotateY: rotateY,
                rotateZ: 0,
                scale: scale,
                translateX: 0,
                translateY: 0,
                translateZ: translateZ
            };
            
            // Update glow and shadow intensity
            elementData.glowIntensity = Math.min(1, (scale - 1) * 5);
            elementData.shadowIntensity = Math.min(1, (scale - 1) * 3);
            
            // Create particles on hover
            if (Math.random() < 0.1) {
                this.createHoverParticle(elementData);
            }
        } else {
            // Reset to neutral position
            elementData.target = {
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                translateX: 0,
                translateY: 0,
                translateZ: 0
            };
            
            elementData.glowIntensity = 0;
            elementData.shadowIntensity = 0;
        }
    }
    
    isPointInElement(point, rect) {
        return point.x >= rect.left && 
               point.x <= rect.right && 
               point.y >= rect.top && 
               point.y <= rect.bottom;
    }
    
    createEnterAnimation(elementData) {
        elementData.isAnimating = true;
        
        // Create entrance particles
        this.createParticleBurst(elementData, 'enter');
        
        // Add entrance animation class
        elementData.element.classList.add('hover-3d-enter');
        
        setTimeout(() => {
            elementData.element.classList.remove('hover-3d-enter');
            elementData.isAnimating = false;
        }, 600);
    }
    
    createExitAnimation(elementData) {
        elementData.isAnimating = true;
        
        // Create exit particles
        this.createParticleBurst(elementData, 'exit');
        
        // Add exit animation class
        elementData.element.classList.add('hover-3d-exit');
        
        setTimeout(() => {
            elementData.element.classList.remove('hover-3d-exit');
            elementData.isAnimating = false;
        }, 600);
    }
    
    createHoverParticle(elementData) {
        const particle = document.createElement('div');
        particle.className = 'hover-3d-hover-particle';
        
        // Random position around element
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 20;
        const rect = elementData.rect;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        document.body.appendChild(particle);
        elementData.particles.push(particle);
        
        // Animate particle
        this.animateParticle(particle, elementData);
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
            const index = elementData.particles.indexOf(particle);
            if (index > -1) {
                elementData.particles.splice(index, 1);
            }
        }, 2000);
    }
    
    createParticleBurst(elementData, type) {
        const particleCount = type === 'enter' ? 12 : 8;
        const rect = elementData.rect;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `hover-3d-burst-particle ${type}`;
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = Math.random() * 100 + 50;
            
            const x = centerX + Math.cos(angle) * 20;
            const y = centerY + Math.sin(angle) * 20;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.setProperty('--tx', `${Math.cos(angle) * velocity}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle) * velocity}px`);
            
            document.body.appendChild(particle);
            elementData.particles.push(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
                const index = elementData.particles.indexOf(particle);
                if (index > -1) {
                    elementData.particles.splice(index, 1);
                }
            }, 1500);
        }
    }
    
    animateParticle(particle, elementData) {
        const animation = particle.animate([
            {
                transform: 'translate(0, 0) scale(0)',
                opacity: 0
            },
            {
                transform: 'translate(0, -20px) scale(1)',
                opacity: 1
            },
            {
                transform: 'translate(0, -40px) scale(0)',
                opacity: 0
            }
        ], {
            duration: 2000,
            easing: 'ease-out'
        });
        
        return animation;
    }
    
    startAnimationLoop() {
        const animate = () => {
            this.elements.forEach(elementData => {
                // Smooth interpolation
                const smoothing = elementData.isHovered ? 0.15 : 0.08;
                
                elementData.velocity.rotateX += (elementData.target.rotateX - elementData.transform.rotateX) * smoothing;
                elementData.velocity.rotateY += (elementData.target.rotateY - elementData.transform.rotateY) * smoothing;
                elementData.velocity.rotateZ += (elementData.target.rotateZ - elementData.transform.rotateZ) * smoothing;
                elementData.velocity.scale += (elementData.target.scale - elementData.transform.scale) * smoothing;
                elementData.velocity.translateX += (elementData.target.translateX - elementData.transform.translateX) * smoothing;
                elementData.velocity.translateY += (elementData.target.translateY - elementData.transform.translateY) * smoothing;
                elementData.velocity.translateZ += (elementData.target.translateZ - elementData.transform.translateZ) * smoothing;
                
                // Apply velocity with damping
                elementData.transform.rotateX += elementData.velocity.rotateX;
                elementData.transform.rotateY += elementData.velocity.rotateY;
                elementData.transform.rotateZ += elementData.velocity.rotateZ;
                elementData.transform.scale += elementData.velocity.scale;
                elementData.transform.translateX += elementData.velocity.translateX;
                elementData.transform.translateY += elementData.velocity.translateY;
                elementData.transform.translateZ += elementData.velocity.translateZ;
                
                // Apply damping
                elementData.velocity.rotateX *= 0.9;
                elementData.velocity.rotateY *= 0.9;
                elementData.velocity.rotateZ *= 0.9;
                elementData.velocity.scale *= 0.9;
                elementData.velocity.translateX *= 0.9;
                elementData.velocity.translateY *= 0.9;
                elementData.velocity.translateZ *= 0.9;
                
                // Apply transform to element
                this.applyTransform(elementData);
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    applyTransform(elementData) {
        if (!elementData.element.hover3DContainer) return;
        
        const { rotateX, rotateY, rotateZ, scale, translateX, translateY, translateZ } = elementData.transform;
        
        // Apply 3D transform
        elementData.element.hover3DContainer.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            rotateZ(${rotateZ}deg)
            scale3d(${scale}, ${scale}, ${scale})
            translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
        `;
        
        // Apply glow effect
        if (elementData.element.glowEffect) {
            elementData.element.glowEffect.style.opacity = elementData.glowIntensity;
            elementData.element.glowEffect.style.filter = `blur(${elementData.glowIntensity * 20}px)`;
        }
        
        // Apply shadow effect
        if (elementData.element.hover3DContainer) {
            const shadowIntensity = elementData.shadowIntensity * 30;
            elementData.element.hover3DContainer.style.boxShadow = `
                0 ${shadowIntensity}px ${shadowIntensity * 2}px rgba(0, 212, 255, ${elementData.shadowIntensity * 0.5}),
                0 ${shadowIntensity/2}px ${shadowIntensity}px rgba(255, 0, 255, ${elementData.shadowIntensity * 0.3}),
                inset 0 0 ${shadowIntensity}px rgba(0, 255, 255, ${elementData.shadowIntensity * 0.2})
            `;
        }
    }
    
    // Public methods
    addElement(element) {
        const index = this.elements.length;
        
        this.elements.push({
            element: element,
            index: index,
            rect: element.getBoundingClientRect(),
            transform: {
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                translateX: 0,
                translateY: 0,
                translateZ: 0
            },
            target: {
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                translateX: 0,
                translateY: 0,
                translateZ: 0
            },
            velocity: {
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 0,
                translateX: 0,
                translateY: 0
            },
            isHovered: false,
            isAnimating: false,
            particles: [],
            glowIntensity: 0,
            shadowIntensity: 0
        });
        
        element.classList.add('hover-3d-element');
        element.dataset.hoverIndex = index;
        
        this.create3DStructure(element);
        this.createParticleContainer(element);
        this.createGlowEffect(element);
    }
    
    removeElement(element) {
        const index = this.elements.findIndex(el => el.element === element);
        if (index > -1) {
            const elementData = this.elements[index];
            
            // Clean up particles
            elementData.particles.forEach(particle => particle.remove());
            
            // Remove 3D structure
            if (element.hover3DContainer) {
                element.hover3DContainer.remove();
            }
            
            // Remove classes
            element.classList.remove('hover-3d-element');
            delete element.dataset.hoverIndex;
            
            this.elements.splice(index, 1);
        }
    }
    
    updateElement(element, config) {
        const elementData = this.elements.find(el => el.element === element);
        if (elementData) {
            Object.assign(elementData, config);
        }
    }
    
    setGlobalConfig(config) {
        Object.assign(this, config);
    }
    
    // Utility methods
    getElementData(element) {
        return this.elements.find(el => el.element === element);
    }
    
    getAllElements() {
        return this.elements;
    }
    
    isInitialized() {
        return this.isInitialized;
    }
}

// Initialize 3D hover system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hover3D = new Hover3D();
    
    // Auto-initialize elements with hover-3d class
    const hoverElements = document.querySelectorAll('.hover-3d');
    hoverElements.forEach(element => {
        window.hover3D.addElement(element);
    });
});

// Global functions for external access
function add3DHover(element) {
    if (window.hover3D) {
        window.hover3D.addElement(element);
    }
}

function remove3DHover(element) {
    if (window.hover3D) {
        window.hover3D.removeElement(element);
    }
}

function update3DHover(element, config) {
    if (window.hover3D) {
        window.hover3D.updateElement(element, config);
    }
}

function set3DHoverConfig(config) {
    if (window.hover3D) {
        window.hover3D.setGlobalConfig(config);
    }
}
