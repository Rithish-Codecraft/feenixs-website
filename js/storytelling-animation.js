// Storytelling Animation System

class StorytellingAnimation {
    constructor() {
        this.stories = [];
        this.currentStory = null;
        this.currentScene = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.animationSpeed = 1;
        this.autoPlay = false;
        this.loop = false;
        
        this.storyContainer = null;
        this.sceneContainer = null;
        this.controlsContainer = null;
        this.progressIndicator = null;
        
        this.init();
    }
    
    init() {
        this.createStoryContainer();
        this.setupEventListeners();
        this.loadDefaultStories();
        this.initializeAnimations();
    }
    
    createStoryContainer() {
        // Create main story container
        this.storyContainer = document.createElement('div');
        this.storyContainer.id = 'story-container';
        this.storyContainer.className = 'story-container';
        this.storyContainer.innerHTML = `
            <div class="story-stage">
                <div class="story-scene-container">
                    <div class="story-scene">
                        <div class="story-content">
                            <div class="story-text"></div>
                            <div class="story-visual"></div>
                        </div>
                        <div class="story-background"></div>
                    </div>
                </div>
                
                <div class="story-controls">
                    <div class="control-group">
                        <button class="story-btn play-pause" data-action="play-pause">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="story-btn previous" data-action="previous">
                            <i class="fas fa-step-backward"></i>
                        </button>
                        <button class="story-btn next" data-action="next">
                            <i class="fas fa-step-forward"></i>
                        </button>
                    </div>
                    
                    <div class="control-group">
                        <button class="story-btn rewind" data-action="rewind">
                            <i class="fas fa-fast-backward"></i>
                        </button>
                        <button class="story-btn forward" data-action="forward">
                            <i class="fas fa-fast-forward"></i>
                        </button>
                    </div>
                    
                    <div class="control-group">
                        <button class="story-btn speed" data-action="speed">
                            <span class="speed-indicator">1x</span>
                        </button>
                        <button class="story-btn loop" data-action="loop">
                            <i class="fas fa-redo"></i>
                        </button>
                        <button class="story-btn autoplay" data-action="autoplay">
                            <i class="fas fa-play-circle"></i>
                        </button>
                    </div>
                    
                    <div class="control-group">
                        <button class="story-btn fullscreen" data-action="fullscreen">
                            <i class="fas fa-expand"></i>
                        </button>
                        <button class="story-btn close" data-action="close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="story-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                        <div class="progress-marker"></div>
                    </div>
                    <div class="progress-text">
                        <span class="current-scene">1</span> / <span class="total-scenes">1</span>
                    </div>
                </div>
                
                <div class="story-timeline">
                    <div class="timeline-track">
                        <div class="timeline-scenes"></div>
                        <div class="timeline-playhead"></div>
                    </div>
                </div>
                
                <div class="story-info">
                    <div class="story-title"></div>
                    <div class="story-description"></div>
                    <div class="story-duration"></div>
                </div>
            </div>
            
            <div class="story-overlay"></div>
            <div class="story-curtain"></div>
        `;
        
        document.body.appendChild(this.storyContainer);
        
        // Get references to elements
        this.sceneContainer = this.storyContainer.querySelector('.story-scene');
        this.controlsContainer = this.storyContainer.querySelector('.story-controls');
        this.progressIndicator = this.storyContainer.querySelector('.progress-bar');
        this.timelineContainer = this.storyContainer.querySelector('.story-timeline');
        
        // Hide initially
        this.storyContainer.style.display = 'none';
    }
    
    setupEventListeners() {
        // Control buttons
        this.storyContainer.querySelectorAll('.story-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleControlAction(e.target.closest('.story-btn').dataset.action);
            });
        });
        
        // Keyboard controls
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Touch gestures
        this.setupTouchGestures();
        
        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Visibility change
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }
    
    setupTouchGestures() {
        const sceneContainer = this.storyContainer.querySelector('.story-scene-container');
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        
        sceneContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        });
        
        sceneContainer.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const deltaTime = touchEndTime - touchStartTime;
            
            // Swipe detection
            if (Math.abs(deltaX) > 50 && deltaTime < 300) {
                if (deltaX > 0) {
                    this.previousScene();
                } else {
                    this.nextScene();
                }
            }
        });
    }
    
    loadDefaultStories() {
        // Default stories for Feenixs
        this.stories = [
            {
                id: 'feenixs-journey',
                title: 'The Feenixs Journey',
                description: 'A tale of innovation and technological advancement',
                duration: 60000,
                scenes: [
                    {
                        id: 'birth',
                        title: 'The Birth of an Idea',
                        duration: 8000,
                        type: 'text',
                        content: {
                            text: 'In the beginning, there was a vision...',
                            visual: 'birth',
                            animation: 'fade-in',
                            background: 'cosmic'
                        }
                    },
                    {
                        id: 'creation',
                        title: 'Creating the Future',
                        duration: 10000,
                        type: 'visual',
                        content: {
                            text: 'Building the foundation of tomorrow',
                            visual: 'creation',
                            animation: 'build-up',
                            background: 'digital'
                        }
                    },
                    {
                        id: 'innovation',
                        title: 'Innovation Unleashed',
                        duration: 12000,
                        type: 'mixed',
                        content: {
                            text: 'Pushing the boundaries of what\'s possible',
                            visual: 'innovation',
                            animation: 'particle-burst',
                            background: 'neural'
                        }
                    },
                    {
                        id: 'community',
                        title: 'Building Together',
                        duration: 10000,
                        type: 'community',
                        content: {
                            text: 'A community of creators and innovators',
                            visual: 'community',
                            animation: 'network-grow',
                            background: 'connected'
                        }
                    },
                    {
                        id: 'future',
                        title: 'The Future Awaits',
                        duration: 12000,
                        type: 'climax',
                        content: {
                            text: 'The journey continues...',
                            visual: 'future',
                            animation: 'grand-finale',
                            background: 'transcendent'
                        }
                    }
                ]
            },
            {
                id: 'ai-revolution',
                title: 'The AI Revolution',
                description: 'How artificial intelligence is transforming our world',
                duration: 45000,
                scenes: [
                    {
                        id: 'awakening',
                        title: 'The Awakening',
                        duration: 9000,
                        type: 'text',
                        content: {
                            text: 'Artificial intelligence begins to stir...',
                            visual: 'ai-awakening',
                            animation: 'pulse-glow',
                            background: 'dark-matter'
                        }
                    },
                    {
                        id: 'learning',
                        title: 'The Learning Process',
                        duration: 12000,
                        type: 'visual',
                        content: {
                            text: 'Machines that learn and adapt',
                            visual: 'neural-learning',
                            animation: 'network-flow',
                            background: 'circuit'
                        }
                    },
                    {
                        id: 'creation',
                        title: 'Creative AI',
                        duration: 10000,
                        type: 'creative',
                        content: {
                            text: 'When machines become artists',
                            visual: 'ai-creation',
                            animation: 'creative-burst',
                            background: 'artistic'
                        }
                    },
                    {
                        id: 'integration',
                        title: 'Human-AI Harmony',
                        duration: 14000,
                        type: 'harmony',
                        content: {
                            text: 'The perfect partnership',
                            visual: 'harmony',
                            animation: 'synchronized-dance',
                            background: 'harmonious'
                        }
                    }
                ]
            },
            {
                id: 'digital-transformation',
                title: 'Digital Transformation',
                description: 'The evolution of technology and society',
                duration: 50000,
                scenes: [
                    {
                        id: 'analog',
                        title: 'The Analog Era',
                        duration: 8000,
                        type: 'nostalgic',
                        content: {
                            text: 'Remember when everything was analog?',
                            visual: 'analog-world',
                            animation: 'sepia-fade',
                            background: 'vintage'
                        }
                    },
                    {
                        id: 'transition',
                        title: 'The Great Transition',
                        duration: 12000,
                        type: 'transition',
                        content: {
                            text: 'The world begins to change',
                            visual: 'digital-transition',
                            animation: 'morph-effect',
                            background: 'transforming'
                        }
                    },
                    {
                        id: 'digital',
                        title: 'The Digital Age',
                        duration: 15000,
                        type: 'modern',
                        content: {
                            text: 'Welcome to the digital revolution',
                            visual: 'digital-world',
                            animation: 'digital-rain',
                            background: 'cyber'
                        }
                    },
                    {
                        id: 'beyond',
                        title: 'Beyond Digital',
                        duration: 15000,
                        type: 'futuristic',
                        content: {
                            text: 'What comes next?',
                            visual: 'beyond-digital',
                            animation: 'quantum-leap',
                            background: 'quantum'
                        }
                    }
                ]
            }
        ];
    }
    
    initializeAnimations() {
        // Initialize GSAP for advanced animations
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(TextPlugin, ScrollTrigger);
        }
        
        // Create animation presets
        this.animationPresets = {
            'fade-in': {
                duration: 1,
                opacity: 0,
                scale: 0.8,
                ease: 'power2.out'
            },
            'slide-up': {
                duration: 1.2,
                y: 50,
                opacity: 0,
                ease: 'power3.out'
            },
            'zoom-in': {
                duration: 1.5,
                scale: 0,
                opacity: 0,
                ease: 'elastic.out(1, 0.5)'
            },
            'rotate-in': {
                duration: 1.5,
                rotation: 360,
                scale: 0,
                opacity: 0,
                ease: 'back.out(1.7)'
            },
            'typewriter': {
                duration: 2,
                opacity: 0,
                ease: 'none'
            },
            'particle-burst': {
                duration: 2,
                scale: 0,
                opacity: 0,
                ease: 'power2.out'
            },
            'glow-pulse': {
                duration: 1,
                opacity: 0,
                scale: 0.5,
                ease: 'power2.inOut'
            },
            'morph-effect': {
                duration: 2,
                opacity: 0,
                scale: 0.8,
                ease: 'power2.inOut'
            }
        };
    }
    
    // Story Management
    playStory(storyId) {
        const story = this.stories.find(s => s.id === storyId);
        if (!story) return;
        
        this.currentStory = story;
        this.currentScene = 0;
        this.isPlaying = true;
        this.isPaused = false;
        
        // Show story container
        this.storyContainer.style.display = 'flex';
        
        // Update UI
        this.updateStoryInfo();
        this.updateTimeline();
        this.updateProgress();
        
        // Play first scene
        setTimeout(() => {
            this.playScene(0);
        }, 500);
    }
    
    playScene(sceneIndex) {
        if (!this.currentStory || sceneIndex < 0 || sceneIndex >= this.currentStory.scenes.length) {
            return;
        }
        
        this.currentScene = sceneIndex;
        const scene = this.currentStory.scenes[sceneIndex];
        
        // Clear previous content
        this.clearScene();
        
        // Update progress
        this.updateProgress();
        this.updateTimeline();
        
        // Play scene animation
        this.animateScene(scene);
        
        // Set scene timer
        this.setSceneTimer(scene.duration);
        
        // Emit scene change event
        this.emitEvent('sceneChange', { scene, index: sceneIndex });
    }
    
    animateScene(scene) {
        const sceneElement = this.sceneContainer;
        const textElement = sceneElement.querySelector('.story-text');
        const visualElement = sceneElement.querySelector('.story-visual');
        const backgroundElement = sceneElement.querySelector('.story-background');
        
        // Set content
        textElement.textContent = scene.content.text;
        visualElement.className = `story-visual ${scene.content.visual}`;
        backgroundElement.className = `story-background ${scene.content.background}`;
        
        // Get animation preset
        const preset = this.animationPresets[scene.content.animation] || this.animationPresets['fade-in'];
        
        // Animate text
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(textElement, 
                { opacity: 0, y: 30, scale: 0.8 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    duration: preset.duration || 1,
                    ease: preset.ease || 'power2.out',
                    delay: 0.2
                }
            );
            
            // Animate visual
            gsap.fromTo(visualElement,
                { opacity: 0, scale: 0.5, rotation: -10 },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: preset.duration || 1,
                    ease: preset.ease || 'power2.out',
                    delay: 0.5
                }
            );
            
            // Animate background
            gsap.fromTo(backgroundElement,
                { opacity: 0, scale: 1.2 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: preset.duration || 1,
                    ease: preset.ease || 'power2.out'
                }
            );
            
            // Add special effects based on scene type
            this.addSceneEffects(scene, visualElement);
        } else {
            // Fallback animations
            this.animateWithCSS(scene, textElement, visualElement, backgroundElement);
        }
    }
    
    addSceneEffects(scene, visualElement) {
        switch (scene.type) {
            case 'particle-burst':
                this.createParticleBurst(visualElement);
                break;
            case 'neural-network':
                this.createNeuralNetwork(visualElement);
                break;
            case 'cosmic':
                this.createCosmicEffect(visualElement);
                break;
            case 'digital':
                this.createDigitalRain(visualElement);
                break;
            case 'creative':
                this.createCreativeBurst(visualElement);
                break;
            case 'harmony':
                this.createHarmonyEffect(visualElement);
                break;
            case 'quantum':
                this.createQuantumEffect(visualElement);
                break;
            default:
                this.createDefaultEffect(visualElement);
        }
    }
    
    createParticleBurst(element) {
        const particleCount = 50;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'story-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--primary-color);
                border-radius: 50%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            `;
            
            element.appendChild(particle);
            particles.push(particle);
            
            // Animate particle
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = Math.random() * 200 + 100;
            const duration = Math.random() * 2 + 1;
            
            if (typeof gsap !== 'undefined') {
                gsap.to(particle, {
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: 0,
                    duration: duration,
                    ease: 'power2.out',
                    onComplete: () => particle.remove()
                });
            }
        }
    }
    
    createNeuralNetwork(element) {
        const nodeCount = 20;
        const nodes = [];
        const connections = [];
        
        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'neural-node';
            node.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: var(--primary-color);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                box-shadow: 0 0 10px var(--primary-color);
            `;
            
            element.appendChild(node);
            nodes.push(node);
            
            // Animate node
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(node,
                    { scale: 0, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.5,
                        delay: Math.random() * 2,
                        ease: 'back.out(1.7)'
                    }
                );
            }
        }
        
        // Create connections
        for (let i = 0; i < nodeCount - 1; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                if (Math.random() < 0.3) {
                    const connection = document.createElement('div');
                    connection.className = 'neural-connection';
                    connection.style.cssText = `
                        position: absolute;
                        height: 1px;
                        background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
                        transform-origin: left center;
                        opacity: 0.3;
                    `;
                    
                    element.appendChild(connection);
                    connections.push(connection);
                    
                    // Animate connection
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(connection,
                            { scaleX: 0, opacity: 0 },
                            {
                                scaleX: 1,
                                opacity: 0.3,
                                duration: 1,
                                delay: Math.random() * 2,
                                ease: 'power2.out'
                            }
                        );
                    }
                }
            }
        }
    }
    
    createCosmicEffect(element) {
        const starCount = 100;
        const stars = [];
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'cosmic-star';
            star.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: white;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random()};
            `;
            
            element.appendChild(star);
            stars.push(star);
            
            // Animate star
            if (typeof gsap !== 'undefined') {
                gsap.to(star, {
                    opacity: Math.random(),
                    duration: Math.random() * 3 + 1,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power2.inOut'
                });
            }
        }
    }
    
    createDigitalRain(element) {
        const rainCount = 30;
        const drops = [];
        
        for (let i = 0; i < rainCount; i++) {
            const drop = document.createElement('div');
            drop.className = 'digital-drop';
            drop.textContent = Math.random() > 0.5 ? '1' : '0';
            drop.style.cssText = `
                position: absolute;
                color: var(--primary-color);
                font-family: monospace;
                font-size: 12px;
                left: ${Math.random() * 100}%;
                top: -20px;
                opacity: ${Math.random() * 0.8 + 0.2};
            `;
            
            element.appendChild(drop);
            drops.push(drop);
            
            // Animate drop
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;
            
            if (typeof gsap !== 'undefined') {
                gsap.to(drop, {
                    y: window.innerHeight + 20,
                    duration: duration,
                    delay: delay,
                    ease: 'none',
                    repeat: -1,
                    repeatDelay: Math.random() * 3
                });
            }
        }
    }
    
    createCreativeBurst(element) {
        const colors = ['#00d4ff', '#ff00ff', '#00ff88', '#ffaa00', '#ff0066'];
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'creative-particle';
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            `;
            
            element.appendChild(particle);
            
            // Animate particle
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = Math.random() * 150 + 50;
            const duration = Math.random() * 1.5 + 0.5;
            
            if (typeof gsap !== 'undefined') {
                gsap.to(particle, {
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    scale: 0,
                    opacity: 0,
                    duration: duration,
                    ease: 'power2.out',
                    onComplete: () => particle.remove()
                });
            }
        }
    }
    
    createHarmonyEffect(element) {
        const circleCount = 5;
        const circles = [];
        
        for (let i = 0; i < circleCount; i++) {
            const circle = document.createElement('div');
            circle.className = 'harmony-circle';
            circle.style.cssText = `
                position: absolute;
                border: 2px solid var(--primary-color);
                border-radius: 50%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                opacity: 0.3;
            `;
            
            element.appendChild(circle);
            circles.push(circle);
            
            // Animate circle
            const size = (i + 1) * 50;
            const duration = 3 + i * 0.5;
            
            if (typeof gsap !== 'undefined') {
                gsap.set(circle, { width: size, height: size });
                gsap.to(circle, {
                    scale: 2,
                    opacity: 0,
                    duration: duration,
                    repeat: -1,
                    ease: 'power2.out'
                });
            }
        }
    }
    
    createQuantumEffect(element) {
        const particleCount = 40;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'quantum-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: 0;
            `;
            
            element.appendChild(particle);
            particles.push(particle);
            
            // Animate particle with quantum behavior
            const duration = Math.random() * 2 + 1;
            const delay = Math.random() * 2;
            
            if (typeof gsap !== 'undefined') {
                gsap.to(particle, {
                    opacity: Math.random() * 0.8 + 0.2,
                    scale: Math.random() * 2 + 0.5,
                    x: (Math.random() - 0.5) * 100,
                    y: (Math.random() - 0.5) * 100,
                    duration: duration,
                    delay: delay,
                    repeat: -1,
                    repeatDelay: Math.random(),
                    ease: 'power2.inOut'
                });
            }
        }
    }
    
    createDefaultEffect(element) {
        // Simple fade and scale effect
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(element,
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: 'power2.out'
                }
            );
        }
    }
    
    animateWithCSS(scene, textElement, visualElement, backgroundElement) {
        // CSS fallback animations
        textElement.style.animation = 'fadeInUp 1s ease-out';
        visualElement.style.animation = 'fadeInScale 1.2s ease-out';
        backgroundElement.style.animation = 'fadeIn 1s ease-out';
    }
    
    setSceneTimer(duration) {
        // Clear existing timer
        if (this.sceneTimer) {
            clearTimeout(this.sceneTimer);
        }
        
        // Set new timer
        this.sceneTimer = setTimeout(() => {
            if (this.isPlaying && !this.isPaused) {
                this.nextScene();
            }
        }, duration / this.animationSpeed);
    }
    
    // Control Methods
    play() {
        if (!this.currentStory) return;
        
        this.isPlaying = true;
        this.isPaused = false;
        this.updatePlayButton();
        this.setSceneTimer(this.currentStory.scenes[this.currentScene].duration);
        
        this.emitEvent('play', { story: this.currentStory, scene: this.currentScene });
    }
    
    pause() {
        this.isPaused = true;
        this.updatePlayButton();
        
        if (this.sceneTimer) {
            clearTimeout(this.sceneTimer);
        }
        
        this.emitEvent('pause', { story: this.currentStory, scene: this.currentScene });
    }
    
    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentScene = 0;
        
        if (this.sceneTimer) {
            clearTimeout(this.sceneTimer);
        }
        
        this.updatePlayButton();
        this.clearScene();
        
        this.emitEvent('stop', { story: this.currentStory });
    }
    
    nextScene() {
        if (!this.currentStory) return;
        
        if (this.currentScene < this.currentStory.scenes.length - 1) {
            this.playScene(this.currentScene + 1);
        } else if (this.loop) {
            this.playScene(0);
        } else {
            this.stop();
        }
    }
    
    previousScene() {
        if (!this.currentStory) return;
        
        if (this.currentScene > 0) {
            this.playScene(this.currentScene - 1);
        }
    }
    
    // UI Updates
    updateStoryInfo() {
        if (!this.currentStory) return;
        
        const titleElement = this.storyContainer.querySelector('.story-title');
        const descriptionElement = this.storyContainer.querySelector('.story-description');
        const durationElement = this.storyContainer.querySelector('.story-duration');
        
        titleElement.textContent = this.currentStory.title;
        descriptionElement.textContent = this.currentStory.description;
        durationElement.textContent = this.formatDuration(this.currentStory.duration);
    }
    
    updateProgress() {
        if (!this.currentStory) return;
        
        const currentSceneElement = this.storyContainer.querySelector('.current-scene');
        const totalScenesElement = this.storyContainer.querySelector('.total-scenes');
        const progressFill = this.storyContainer.querySelector('.progress-fill');
        const progressMarker = this.storyContainer.querySelector('.progress-marker');
        
        currentSceneElement.textContent = this.currentScene + 1;
        totalScenesElement.textContent = this.currentStory.scenes.length;
        
        const progress = ((this.currentScene + 1) / this.currentStory.scenes.length) * 100;
        progressFill.style.width = `${progress}%`;
        progressMarker.style.left = `${progress}%`;
    }
    
    updateTimeline() {
        if (!this.currentStory) return;
        
        const timelineScenes = this.storyContainer.querySelector('.timeline-scenes');
        const playhead = this.storyContainer.querySelector('.timeline-playhead');
        
        // Clear existing timeline
        timelineScenes.innerHTML = '';
        
        // Create timeline scenes
        this.currentStory.scenes.forEach((scene, index) => {
            const sceneMarker = document.createElement('div');
            sceneMarker.className = 'timeline-scene-marker';
            sceneMarker.textContent = index + 1;
            sceneMarker.style.left = `${(index / this.currentStory.scenes.length) * 100}%`;
            
            sceneMarker.addEventListener('click', () => {
                this.playScene(index);
            });
            
            timelineScenes.appendChild(sceneMarker);
        });
        
        // Update playhead position
        const playheadPosition = (this.currentScene / this.currentStory.scenes.length) * 100;
        playhead.style.left = `${playheadPosition}%`;
    }
    
    updatePlayButton() {
        const playButton = this.storyContainer.querySelector('.play-pause i');
        
        if (this.isPlaying && !this.isPaused) {
            playButton.className = 'fas fa-pause';
        } else {
            playButton.className = 'fas fa-play';
        }
    }
    
    // Event Handlers
    handleControlAction(action) {
        switch (action) {
            case 'play-pause':
                if (this.isPlaying && !this.isPaused) {
                    this.pause();
                } else {
                    this.play();
                }
                break;
            case 'previous':
                this.previousScene();
                break;
            case 'next':
                this.nextScene();
                break;
            case 'rewind':
                this.rewind();
                break;
            case 'forward':
                this.forward();
                break;
            case 'speed':
                this.changeSpeed();
                break;
            case 'loop':
                this.toggleLoop();
                break;
            case 'autoplay':
                this.toggleAutoplay();
                break;
            case 'fullscreen':
                this.toggleFullscreen();
                break;
            case 'close':
                this.close();
                break;
        }
    }
    
    handleKeyboard(e) {
        if (!this.storyContainer.style.display || this.storyContainer.style.display === 'none') return;
        
        switch (e.key) {
            case ' ':
                e.preventDefault();
                this.handleControlAction('play-pause');
                break;
            case 'ArrowRight':
                this.handleControlAction('next');
                break;
            case 'ArrowLeft':
                this.handleControlAction('previous');
                break;
            case 'ArrowUp':
                this.handleControlAction('forward');
                break;
            case 'ArrowDown':
                this.handleControlAction('rewind');
                break;
            case 'f':
                this.handleControlAction('fullscreen');
                break;
            case 'Escape':
                this.handleControlAction('close');
                break;
        }
    }
    
    handleResize() {
        // Handle window resize
        if (this.currentStory) {
            this.updateTimeline();
        }
    }
    
    handleVisibilityChange() {
        // Pause when tab is not visible
        if (document.hidden && this.isPlaying && !this.isPaused) {
            this.pause();
        }
    }
    
    // Utility Methods
    clearScene() {
        const textElement = this.sceneContainer.querySelector('.story-text');
        const visualElement = this.sceneContainer.querySelector('.story-visual');
        const backgroundElement = this.sceneContainer.querySelector('.story-background');
        
        textElement.textContent = '';
        visualElement.className = 'story-visual';
        backgroundElement.className = 'story-background';
        
        // Clear any dynamic elements
        visualElement.innerHTML = '';
        backgroundElement.innerHTML = '';
    }
    
    rewind() {
        this.playScene(0);
    }
    
    forward() {
        if (this.currentStory) {
            this.playScene(this.currentStory.scenes.length - 1);
        }
    }
    
    changeSpeed() {
        const speeds = [0.5, 1, 1.5, 2];
        const currentIndex = speeds.indexOf(this.animationSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        this.animationSpeed = speeds[nextIndex];
        
        const speedIndicator = this.storyContainer.querySelector('.speed-indicator');
        speedIndicator.textContent = `${this.animationSpeed}x`;
        
        // Restart current scene with new speed
        if (this.isPlaying && !this.isPaused) {
            this.playScene(this.currentScene);
        }
    }
    
    toggleLoop() {
        this.loop = !this.loop;
        const loopButton = this.storyContainer.querySelector('.loop');
        loopButton.classList.toggle('active', this.loop);
    }
    
    toggleAutoplay() {
        this.autoPlay = !this.autoPlay;
        const autoplayButton = this.storyContainer.querySelector('.autoplay');
        autoplayButton.classList.toggle('active', this.autoPlay);
        
        if (this.autoPlay && !this.isPlaying) {
            this.playStory(this.stories[0].id);
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.storyContainer.requestFullscreen().catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    close() {
        this.stop();
        this.storyContainer.style.display = 'none';
        this.emitEvent('close', {});
    }
    
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    emitEvent(eventName, data) {
        const event = new CustomEvent(`storytelling:${eventName}`, { detail: data });
        document.dispatchEvent(event);
    }
    
    // Public API
    addStory(story) {
        this.stories.push(story);
    }
    
    removeStory(storyId) {
        this.stories = this.stories.filter(s => s.id !== storyId);
    }
    
    getStory(storyId) {
        return this.stories.find(s => s.id === storyId);
    }
    
    getAllStories() {
        return this.stories;
    }
    
    getCurrentStory() {
        return this.currentStory;
    }
    
    getCurrentScene() {
        return this.currentScene;
    }
    
    isPlaying() {
        return this.isPlaying;
    }
    
    isPaused() {
        return this.isPaused;
    }
}

// Initialize storytelling system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.storytellingAnimation = new StorytellingAnimation();
    
    // Auto-play first story if enabled
    if (window.storytellingAnimation.autoPlay) {
        setTimeout(() => {
            window.storytellingAnimation.playStory('feenixs-journey');
        }, 1000);
    }
});

// Global functions for external access
function playStory(storyId) {
    if (window.storytellingAnimation) {
        window.storytellingAnimation.playStory(storyId);
    }
}

function pauseStory() {
    if (window.storytellingAnimation) {
        window.storytellingAnimation.pause();
    }
}

function stopStory() {
    if (window.storytellingAnimation) {
        window.storytellingAnimation.stop();
    }
}

function addCustomStory(story) {
    if (window.storytellingAnimation) {
        window.storytellingAnimation.addStory(story);
    }
}

function closeStoryViewer() {
    if (window.storytellingAnimation) {
        window.storytellingAnimation.close();
    }
}
