// Advanced Particle Engine for Feenixs Website

class ParticleEngine {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Particle engine container not found:', containerId);
            return;
        }
        
        // Configuration
        this.config = {
            particleCount: options.particleCount || 150,
            particleSize: options.particleSize || 2,
            particleColor: options.particleColor || '#00d4ff',
            connectionDistance: options.connectionDistance || 100,
            connectionOpacity: options.connectionOpacity || 0.2,
            mouseRadius: options.mouseRadius || 150,
            mouseForce: options.mouseForce || 0.05,
            speed: options.speed || 0.5,
            gravity: options.gravity || 0,
            bounce: options.bounce !== false,
            trail: options.trail || false,
            glow: options.glow !== false,
            ...options
        };
        
        // Particle systems
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.time = 0;
        
        this.init();
    }
    
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.container.appendChild(this.canvas);
        
        // Get context
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        
        // Create particles
        this.createParticles();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start animation
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(this.createParticle(i));
        }
    }
    
    createParticle(index) {
        return {
            id: index,
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * this.config.speed,
            vy: (Math.random() - 0.5) * this.config.speed,
            size: Math.random() * this.config.particleSize + 1,
            color: this.getParticleColor(index),
            trail: [],
            maxTrailLength: 10,
            connections: [],
            mass: 1 + Math.random() * 2,
            charge: Math.random() > 0.5 ? 1 : -1
        };
    }
    
    getParticleColor(index) {
        if (Array.isArray(this.config.particleColor)) {
            return this.config.particleColor[index % this.config.particleColor.length];
        }
        return this.config.particleColor;
    }
    
    setupEventListeners() {
        // Mouse movement
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        // Mouse leave
        this.container.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
        
        // Touch support
        this.container.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const rect = this.container.getBoundingClientRect();
                this.mouse.x = e.touches[0].clientX - rect.left;
                this.mouse.y = e.touches[0].clientY - rect.top;
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
    
    updateParticles() {
        this.particles.forEach((particle, index) => {
            // Store trail position
            if (this.config.trail) {
                particle.trail.push({ x: particle.x, y: particle.y });
                if (particle.trail.length > particle.maxTrailLength) {
                    particle.trail.shift();
                }
            }
            
            // Apply gravity
            particle.vy += this.config.gravity;
            
            // Apply mouse force
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseRadius) {
                const force = (1 - distance / this.config.mouseRadius) * this.config.mouseForce;
                particle.vx += dx * force;
                particle.vy += dy * force;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Apply damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Bounce off walls
            if (this.config.bounce) {
                if (particle.x < 0 || particle.x > this.canvas.width) {
                    particle.vx *= -0.9;
                    particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
                }
                
                if (particle.y < 0 || particle.y > this.canvas.height) {
                    particle.vy *= -0.9;
                    particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
                }
            } else {
                // Wrap around edges
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;
            }
            
            // Add some random movement
            particle.vx += (Math.random() - 0.5) * 0.1;
            particle.vy += (Math.random() - 0.5) * 0.1;
        });
    }
    
    updateConnections() {
        this.connections = [];
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * this.config.connectionOpacity;
                    
                    this.connections.push({
                        p1: p1,
                        p2: p2,
                        opacity: opacity,
                        distance: distance
                    });
                }
            }
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.drawConnections();
        
        // Draw particles
        this.drawParticles();
    }
    
    drawConnections() {
        this.connections.forEach(connection => {
            this.ctx.beginPath();
            this.ctx.moveTo(connection.p1.x, connection.p1.y);
            this.ctx.lineTo(connection.p2.x, connection.p2.y);
            
            // Create gradient for connection
            const gradient = this.ctx.createLinearGradient(
                connection.p1.x, connection.p1.y,
                connection.p2.x, connection.p2.y
            );
            
            const color1 = this.hexToRgba(connection.p1.color, connection.opacity);
            const color2 = this.hexToRgba(connection.p2.color, connection.opacity);
            
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            // Draw trail
            if (this.config.trail && particle.trail.length > 1) {
                this.ctx.beginPath();
                particle.trail.forEach((point, index) => {
                    const opacity = index / particle.trail.length * 0.5;
                    this.ctx.strokeStyle = this.hexToRgba(particle.color, opacity);
                    this.ctx.lineWidth = particle.size * 0.5;
                    
                    if (index === 0) {
                        this.ctx.moveTo(point.x, point.y);
                    } else {
                        this.ctx.lineTo(point.x, point.y);
                    }
                });
                this.ctx.stroke();
            }
            
            // Draw glow effect
            if (this.config.glow) {
                const gradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 4
                );
                
                gradient.addColorStop(0, this.hexToRgba(particle.color, 0.8));
                gradient.addColorStop(0.5, this.hexToRgba(particle.color, 0.3));
                gradient.addColorStop(1, this.hexToRgba(particle.color, 0));
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // Draw particle
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add inner glow
            if (this.config.glow) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }
    
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.time += 0.01;
        
        // Update physics
        this.updateParticles();
        this.updateConnections();
        
        // Draw everything
        this.draw();
    }
    
    // Public methods
    addParticle(x, y, options = {}) {
        const particle = {
            id: this.particles.length,
            x: x || Math.random() * this.canvas.width,
            y: y || Math.random() * this.canvas.height,
            vx: options.vx || (Math.random() - 0.5) * this.config.speed,
            vy: options.vy || (Math.random() - 0.5) * this.config.speed,
            size: options.size || Math.random() * this.config.particleSize + 1,
            color: options.color || this.getParticleColor(this.particles.length),
            trail: [],
            maxTrailLength: 10,
            connections: [],
            mass: options.mass || 1 + Math.random() * 2,
            charge: options.charge !== undefined ? options.charge : (Math.random() > 0.5 ? 1 : -1)
        };
        
        this.particles.push(particle);
        return particle;
    }
    
    removeParticle(particleId) {
        this.particles = this.particles.filter(p => p.id !== particleId);
    }
    
    explode(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;
            
            this.addParticle(x, y, {
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 2 + 1,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`
            });
        }
    }
    
    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    
    updateMousePosition(x, y) {
        this.mouse.x = x;
        this.mouse.y = y;
    }
    
    getParticleCount() {
        return this.particles.length;
    }
    
    getConnectionCount() {
        return this.connections.length;
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        this.particles = [];
        this.connections = [];
    }
}

// Particle System Manager
class ParticleSystemManager {
    constructor() {
        this.systems = new Map();
        this.globalConfig = {
            enabled: true,
            performanceMode: 'high', // 'high', 'medium', 'low'
            maxParticles: 500
        };
    }
    
    createSystem(name, containerId, options = {}) {
        if (this.systems.has(name)) {
            console.warn('Particle system already exists:', name);
            return this.systems.get(name);
        }
        
        const system = new ParticleEngine(containerId, options);
        this.systems.set(name, system);
        
        return system;
    }
    
    getSystem(name) {
        return this.systems.get(name);
    }
    
    removeSystem(name) {
        const system = this.systems.get(name);
        if (system) {
            system.destroy();
            this.systems.delete(name);
        }
    }
    
    updateGlobalConfig(config) {
        this.globalConfig = { ...this.globalConfig, ...config };
        
        // Apply config to all systems
        this.systems.forEach(system => {
            if (config.performanceMode) {
                this.adjustPerformance(system, config.performanceMode);
            }
        });
    }
    
    adjustPerformance(system, mode) {
        switch (mode) {
            case 'low':
                system.setConfig({
                    particleCount: Math.min(system.config.particleCount, 50),
                    connectionDistance: 50,
                    trail: false,
                    glow: false
                });
                break;
                
            case 'medium':
                system.setConfig({
                    particleCount: Math.min(system.config.particleCount, 100),
                    connectionDistance: 75,
                    trail: true,
                    glow: false
                });
                break;
                
            case 'high':
                system.setConfig({
                    particleCount: Math.min(system.config.particleCount, 200),
                    connectionDistance: 100,
                    trail: true,
                    glow: true
                });
                break;
        }
    }
    
    getAllSystems() {
        return Array.from(this.systems.values());
    }
    
    getTotalParticleCount() {
        let total = 0;
        this.systems.forEach(system => {
            total += system.getParticleCount();
        });
        return total;
    }
    
    destroyAll() {
        this.systems.forEach(system => {
            system.destroy();
        });
        this.systems.clear();
    }
}

// Preset Particle Configurations
const ParticlePresets = {
    // Neural network style
    neuralNetwork: {
        particleCount: 100,
        particleSize: 2,
        particleColor: ['#00d4ff', '#ff00ff', '#00ff88'],
        connectionDistance: 80,
        connectionOpacity: 0.3,
        mouseRadius: 120,
        mouseForce: 0.03,
        speed: 0.3,
        gravity: 0,
        trail: true,
        glow: true
    },
    
    // Fireworks style
    fireworks: {
        particleCount: 150,
        particleSize: 1.5,
        particleColor: ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4ecdc4', '#45b7d1'],
        connectionDistance: 0,
        connectionOpacity: 0,
        mouseRadius: 100,
        mouseForce: 0.1,
        speed: 2,
        gravity: 0.1,
        trail: true,
        glow: true,
        bounce: false
    },
    
    // Starfield style
    starfield: {
        particleCount: 200,
        particleSize: 1,
        particleColor: '#ffffff',
        connectionDistance: 0,
        connectionOpacity: 0,
        mouseRadius: 0,
        mouseForce: 0,
        speed: 0.1,
        gravity: 0,
        trail: false,
        glow: true,
        bounce: false
    },
    
    // Matrix style
    matrix: {
        particleCount: 80,
        particleSize: 2,
        particleColor: '#00ff00',
        connectionDistance: 60,
        connectionOpacity: 0.4,
        mouseRadius: 150,
        mouseForce: 0.02,
        speed: 0.5,
        gravity: 0.05,
        trail: true,
        glow: true
    },
    
    // Galaxy style
    galaxy: {
        particleCount: 300,
        particleSize: 1,
        particleColor: ['#ff006e', '#fb5607', '#ffbe0b', '#fbf60c', '#a5ff00'],
        connectionDistance: 40,
        connectionOpacity: 0.2,
        mouseRadius: 200,
        mouseForce: 0.01,
        speed: 0.2,
        gravity: 0,
        trail: false,
        glow: true
    }
};

// Initialize particle systems when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create global particle manager
    window.particleManager = new ParticleSystemManager();
    
    // Auto-initialize common particle systems
    initializeParticleSystems();
});

function initializeParticleSystems() {
    // Hero background particles
    if (document.getElementById('hero-particles')) {
        window.particleManager.createSystem('hero', 'hero-particles', ParticlePresets.neuralNetwork);
    }
    
    // Background starfield
    if (document.getElementById('background-particles')) {
        window.particleManager.createSystem('background', 'background-particles', ParticlePresets.starfield);
    }
    
    // Interactive particles
    if (document.getElementById('interactive-particles')) {
        window.particleManager.createSystem('interactive', 'interactive-particles', ParticlePresets.matrix);
    }
}

// Export for global access
window.ParticleEngine = ParticleEngine;
window.ParticlePresets = ParticlePresets;
