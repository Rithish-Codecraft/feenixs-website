// 3D Neural Network Visualization for Feenixs Hero Section

class NeuralNetwork3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.nodes = [];
        this.connections = [];
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.setupScene();
        this.createNeuralNetwork();
        this.createParticles();
        this.setupLighting();
        this.setupEventListeners();
        this.animate();
    }

    setupScene() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 1, 1000);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 30);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        // Add point light
        const pointLight = new THREE.PointLight(0x00d4ff, 1, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
    }

    createNeuralNetwork() {
        const layers = [4, 8, 6, 4]; // Neural network layers
        const layerSpacing = 8;
        const nodeRadius = 0.5;

        layers.forEach((nodeCount, layerIndex) => {
            const x = (layerIndex - layers.length / 2) * layerSpacing;
            
            for (let i = 0; i < nodeCount; i++) {
                const y = (i - nodeCount / 2) * 2;
                const z = (Math.random() - 0.5) * 4;
                
                // Create node geometry
                const geometry = new THREE.SphereGeometry(nodeRadius, 16, 16);
                const material = new THREE.MeshPhongMaterial({
                    color: 0x00d4ff,
                    emissive: 0x00d4ff,
                    emissiveIntensity: 0.2,
                    shininess: 100,
                    transparent: true,
                    opacity: 0.8
                });
                
                const node = new THREE.Mesh(geometry, material);
                node.position.set(x, y, z);
                node.userData = {
                    layer: layerIndex,
                    index: i,
                    originalPosition: { x, y, z },
                    pulsePhase: Math.random() * Math.PI * 2
                };
                
                this.scene.add(node);
                this.nodes.push(node);

                // Create connections to previous layer
                if (layerIndex > 0) {
                    const prevLayerStart = this.nodes.length - nodeCount - layers[layerIndex - 1];
                    const prevLayerEnd = this.nodes.length - nodeCount;
                    
                    for (let j = prevLayerStart; j < prevLayerEnd; j++) {
                        if (Math.random() > 0.3) { // 70% connection probability
                            this.createConnection(this.nodes[j], node);
                        }
                    }
                }
            }
        });

        // Create output connections
        this.createOutputConnections();
    }

    createConnection(node1, node2) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            node1.position,
            node2.position
        ]);
        
        const material = new THREE.LineBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.3,
            linewidth: 2
        });
        
        const connection = new THREE.Line(geometry, material);
        connection.userData = {
            node1,
            node2,
            signalPhase: Math.random() * Math.PI * 2
        };
        
        this.scene.add(connection);
        this.connections.push(connection);
    }

    createOutputConnections() {
        // Create output visualization
        const outputGeometry = new THREE.RingGeometry(2, 3, 32);
        const outputMaterial = new THREE.MeshPhongMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide
        });
        
        const output = new THREE.Mesh(outputGeometry, outputMaterial);
        output.position.set(20, 0, 0);
        output.rotation.x = Math.PI / 2;
        this.scene.add(output);

        // Connect last layer to output
        const lastLayerStart = this.nodes.length - 4;
        for (let i = lastLayerStart; i < this.nodes.length; i++) {
            this.createConnection(this.nodes[i], output);
        }
    }

    createParticles() {
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

            colors[i * 3] = 0.0;
            colors[i * 3 + 1] = 0.83;
            colors[i * 3 + 2] = 1.0;

            sizes[i] = Math.random() * 2 + 0.5;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particleSystem);
    }

    setupLighting() {
        // Add dynamic lights
        const light1 = new THREE.PointLight(0x00d4ff, 0.5, 50);
        light1.position.set(-20, 10, 10);
        this.scene.add(light1);

        const light2 = new THREE.PointLight(0xff00ff, 0.5, 50);
        light2.position.set(20, -10, 10);
        this.scene.add(light2);

        // Add spot light for dramatic effect
        const spotLight = new THREE.SpotLight(0xffffff, 0.5);
        spotLight.position.set(0, 20, 20);
        spotLight.castShadow = true;
        this.scene.add(spotLight);
    }

    setupEventListeners() {
        // Mouse movement
        this.container.addEventListener('mousemove', (event) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        });

        // Touch support
        this.container.addEventListener('touchmove', (event) => {
            if (event.touches.length > 0) {
                const rect = this.container.getBoundingClientRect();
                this.mouse.x = ((event.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
                this.mouse.y = -((event.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Animate nodes
        this.nodes.forEach((node, index) => {
            const userData = node.userData;
            
            // Pulsing effect
            const pulse = Math.sin(time * 2 + userData.pulsePhase) * 0.1 + 1;
            node.scale.setScalar(pulse);

            // Floating effect
            const floatY = Math.sin(time + userData.index * 0.5) * 0.2;
            const floatZ = Math.cos(time * 0.7 + userData.index * 0.3) * 0.1;
            
            node.position.y = userData.originalPosition.y + floatY;
            node.position.z = userData.originalPosition.z + floatZ;

            // Mouse interaction
            const mouseInfluence = 0.05;
            node.position.x += this.mouse.x * mouseInfluence;
            node.position.y += this.mouse.y * mouseInfluence;

            // Rotate nodes slightly
            node.rotation.x += 0.01;
            node.rotation.y += 0.01;
        });

        // Animate connections
        this.connections.forEach((connection, index) => {
            const userData = connection.userData;
            
            // Signal transmission effect
            const signal = Math.sin(time * 3 + userData.signalPhase) * 0.5 + 0.5;
            connection.material.opacity = 0.1 + signal * 0.4;
            
            // Color variation based on signal
            const hue = 0.55 + signal * 0.1; // Cyan to purple
            connection.material.color.setHSL(hue, 1.0, 0.5);
        });

        // Animate particles
        if (this.particleSystem) {
            this.particleSystem.rotation.y += 0.001;
            this.particleSystem.rotation.x += 0.0005;

            // Particle floating
            const positions = this.particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(time + i * 0.1) * 0.01;
            }
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }

        // Camera movement
        this.camera.position.x = Math.sin(time * 0.2) * 2;
        this.camera.position.y = Math.cos(time * 0.3) * 1;
        this.camera.lookAt(0, 0, 0);

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    // Public methods
    addDataFlow(fromNode, toNode) {
        // Create animated data flow between nodes
        const geometry = new THREE.SphereGeometry(0.2, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        const dataPacket = new THREE.Mesh(geometry, material);
        dataPacket.position.copy(fromNode.position);
        this.scene.add(dataPacket);

        // Animate data packet
        const startTime = Date.now();
        const duration = 2000; // 2 seconds

        const animateDataPacket = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            dataPacket.position.lerpVectors(fromNode.position, toNode.position, easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animateDataPacket);
            } else {
                this.scene.remove(dataPacket);
            }
        };

        animateDataPacket();
    }

    setNetworkActivity(level) {
        // Adjust network activity based on input level (0-1)
        this.nodes.forEach(node => {
            const intensity = 0.2 + level * 0.8;
            node.material.emissiveIntensity = intensity;
        });

        this.connections.forEach(connection => {
            const intensity = 0.1 + level * 0.4;
            connection.material.opacity = intensity;
        });
    }

    destroy() {
        // Clean up resources
        this.nodes.forEach(node => {
            node.geometry.dispose();
            node.material.dispose();
        });

        this.connections.forEach(connection => {
            connection.geometry.dispose();
            connection.material.dispose();
        });

        if (this.particleSystem) {
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
        }

        this.renderer.dispose();
        this.container.removeChild(this.renderer.domElement);
    }
}

// Initialize 3D Neural Network when Three.js is loaded
function init3DNeuralNetwork() {
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded, skipping 3D neural network');
        return;
    }

    // Create 3D neural network
    const neuralNetwork = new NeuralNetwork3D('neural-network-3d');
    
    // Store reference for global access
    window.neuralNetwork3D = neuralNetwork;
    
    // Add interaction controls
    setupNeuralNetworkControls();
}

function setupNeuralNetworkControls() {
    const neuralNetwork = window.neuralNetwork3D;
    if (!neuralNetwork) return;

    // Simulate network activity
    setInterval(() => {
        const activityLevel = Math.random();
        neuralNetwork.setNetworkActivity(activityLevel);
    }, 3000);

    // Random data flows
    setInterval(() => {
        const nodeCount = neuralNetwork.nodes.length;
        if (nodeCount > 1) {
            const fromNode = neuralNetwork.nodes[Math.floor(Math.random() * nodeCount)];
            const toNode = neuralNetwork.nodes[Math.floor(Math.random() * nodeCount)];
            
            if (fromNode !== toNode) {
                neuralNetwork.addDataFlow(fromNode, toNode);
            }
        }
    }, 2000);
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load Three.js if not already loaded
    if (typeof THREE === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = init3DNeuralNetwork;
        document.head.appendChild(script);
    } else {
        init3DNeuralNetwork();
    }
});
