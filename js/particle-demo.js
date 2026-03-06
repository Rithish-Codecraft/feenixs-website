// Particle Demo JavaScript

let particleSystem = null;
let currentPreset = 'neuralNetwork';
let animationId = null;
let fps = 60;
let lastTime = performance.now();
let frameCount = 0;

// Initialize demo when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initParticleDemo();
    initControls();
    startStatsUpdate();
});

function initParticleDemo() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    // Create particle system
    particleSystem = new ParticleEngine('particle-canvas-wrapper', ParticlePresets.neuralNetwork);
    
    // Start animation
    animate();
}

function initControls() {
    // Preset selector
    const presetSelect = document.getElementById('preset-select');
    presetSelect.value = currentPreset;
    
    // Initialize displays
    updateDisplays();
}

function changePreset() {
    const presetSelect = document.getElementById('preset-select');
    const newPreset = presetSelect.value;
    
    if (newPreset === currentPreset) return;
    
    currentPreset = newPreset;
    
    // Destroy current system and create new one
    if (particleSystem) {
        particleSystem.destroy();
    }
    
    particleSystem = new ParticleEngine('particle-canvas-wrapper', ParticlePresets[newPreset]);
    
    // Update displays
    updateDisplays();
}

function updateParticleCount() {
    const countSlider = document.getElementById('particle-count');
    const countDisplay = document.getElementById('count-display');
    const count = parseInt(countSlider.value);
    
    countDisplay.textContent = count;
    
    if (particleSystem) {
        particleSystem.setConfig({ particleCount: count });
    }
}

function updateSpeed() {
    const speedSlider = document.getElementById('speed-control');
    const speedDisplay = document.getElementById('speed-display');
    const speed = parseFloat(speedSlider.value);
    
    speedDisplay.textContent = speed.toFixed(1);
    
    if (particleSystem) {
        particleSystem.setConfig({ speed: speed });
    }
}

function updateMouseForce() {
    const forceSlider = document.getElementById('mouse-force');
    const forceDisplay = document.getElementById('force-display');
    const force = parseFloat(forceSlider.value);
    
    forceDisplay.textContent = force.toFixed(2);
    
    if (particleSystem) {
        particleSystem.setConfig({ mouseForce: force });
    }
}

function updateEffects() {
    const trailCheckbox = document.getElementById('trail-effect');
    const glowCheckbox = document.getElementById('glow-effect');
    const connectionCheckbox = document.getElementById('connection-effect');
    const gravityCheckbox = document.getElementById('gravity-effect');
    
    if (particleSystem) {
        particleSystem.setConfig({
            trail: trailCheckbox.checked,
            glow: glowCheckbox.checked,
            connectionDistance: connectionCheckbox.checked ? 100 : 0,
            connectionOpacity: connectionCheckbox.checked ? 0.2 : 0,
            gravity: gravityCheckbox.checked ? 0.05 : 0
        });
    }
}

function explodeParticles() {
    if (!particleSystem) return;
    
    const canvas = document.getElementById('particle-canvas');
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    particleSystem.explode(centerX, centerY, 30);
}

function addBurst() {
    if (!particleSystem) return;
    
    const canvas = document.getElementById('particle-canvas');
    const rect = canvas.getBoundingClientRect();
    
    // Add random burst at random position
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    
    particleSystem.explode(x, y, 15);
}

function resetParticles() {
    if (!particleSystem) return;
    
    particleSystem.destroy();
    particleSystem = new ParticleEngine('particle-canvas-wrapper', ParticlePresets[currentPreset]);
}

function updateDisplays() {
    const countSlider = document.getElementById('particle-count');
    const speedSlider = document.getElementById('speed-control');
    const forceSlider = document.getElementById('mouse-force');
    
    if (particleSystem) {
        countSlider.value = particleSystem.config.particleCount;
        speedSlider.value = particleSystem.config.speed;
        forceSlider.value = particleSystem.config.mouseForce;
    }
    
    updateDisplays();
}

function animate() {
    animationId = requestAnimationFrame(animate);
    
    if (particleSystem) {
        particleSystem.animate();
    }
    
    // Calculate FPS
    frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    
    if (deltaTime >= 1000) {
        fps = Math.round((frameCount * 1000) / deltaTime);
        frameCount = 0;
        lastTime = currentTime;
    }
}

function startStatsUpdate() {
    setInterval(updateStats, 100);
}

function updateStats() {
    if (!particleSystem) return;
    
    const particleStat = document.getElementById('particle-stat');
    const connectionStat = document.getElementById('connection-stat');
    const fpsStat = document.getElementById('fps-stat');
    const mouseStat = document.getElementById('mouse-stat');
    
    if (particleStat) {
        particleStat.textContent = particleSystem.getParticleCount();
    }
    
    if (connectionStat) {
        connectionStat.textContent = particleSystem.getConnectionCount();
    }
    
    if (fpsStat) {
        fpsStat.textContent = fps;
    }
    
    if (mouseStat && particleSystem.mouse) {
        mouseStat.textContent = `${Math.round(particleSystem.mouse.x)}, ${Math.round(particleSystem.mouse.y)}`;
    }
}

// Add keyboard controls
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case ' ':
            explodeParticles();
            break;
        case 'r':
        case 'R':
            resetParticles();
            break;
        case '1':
            changePreset('neuralNetwork');
            document.getElementById('preset-select').value = 'neuralNetwork';
            break;
        case '2':
            changePreset('fireworks');
            document.getElementById('preset-select').value = 'fireworks';
            break;
        case '3':
            changePreset('starfield');
            document.getElementById('preset-select').value = 'starfield';
            break;
        case '4':
            changePreset('matrix');
            document.getElementById('preset-select').value = 'matrix';
            break;
        case '5':
            changePreset('galaxy');
            document.getElementById('preset-select').value = 'galaxy';
            break;
        case 'ArrowUp':
            const currentSpeed = parseFloat(document.getElementById('speed-control').value);
            const newSpeed = Math.min(5, currentSpeed + 0.1);
            document.getElementById('speed-control').value = newSpeed;
            updateSpeed();
            break;
        case 'ArrowDown':
            const currentSpeedDown = parseFloat(document.getElementById('speed-control').value);
            const newSpeedDown = Math.max(0.1, currentSpeedDown - 0.1);
            document.getElementById('speed-control').value = newSpeedDown;
            updateSpeed();
            break;
    }
});

// Add touch support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.getElementById('particle-canvas').addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.getElementById('particle-canvas').addEventListener('touchmove', (e) => {
    if (!particleSystem) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    const rect = e.target.getBoundingClientRect();
    particleSystem.updateMousePosition(
        touchX - rect.left,
        touchY - rect.top
    );
});

document.getElementById('particle-canvas').addEventListener('touchend', () => {
    if (particleSystem) {
        particleSystem.updateMousePosition(-1000, -1000);
    }
});

// Performance monitoring
function monitorPerformance() {
    const memoryUsage = performance.memory ? performance.memory.usedJSHeapSize / 1048576 : 0;
    const totalMemory = performance.memory ? performance.memory.totalJSHeapSize / 1048576 : 0;
    
    console.log('Performance Stats:', {
        fps: fps,
        particles: particleSystem ? particleSystem.getParticleCount() : 0,
        connections: particleSystem ? particleSystem.getConnectionCount() : 0,
        memoryUsage: memoryUsage.toFixed(2) + ' MB',
        totalMemory: totalMemory.toFixed(2) + ' MB'
    });
}

// Add performance monitoring every 5 seconds
setInterval(monitorPerformance, 5000);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    if (particleSystem) {
        particleSystem.destroy();
    }
});

// Export functions for global access
window.particleDemo = {
    explode: explodeParticles,
    addBurst: addBurst,
    reset: resetParticles,
    changePreset: changePreset,
    getSystem: () => particleSystem,
    getFPS: () => fps
};
