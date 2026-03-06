// AI Playground JavaScript

// Initialize AI Playground when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize AI visualization
    initAIVisualization();
    
    // Initialize metrics dashboard
    initMetricsDashboard();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize intersection observer
    initIntersectionObserver();
    
    // Initialize scroll progress
    initScrollProgress();
});

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;
    
    setTimeout(() => {
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                loadingScreen.style.display = 'none';
            }
        });
    }, 2000);
}

// AI Visualization
function initAIVisualization() {
    const container = document.getElementById('ai-visualization');
    if (!container) return;
    
    // Create 3D scene for AI visualization
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create floating neural network nodes
    const nodes = [];
    const connections = [];
    
    for (let i = 0; i < 20; i++) {
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00d4ff,
            emissive: 0x00d4ff,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.8
        });
        
        const node = new THREE.Mesh(geometry, material);
        node.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
        
        scene.add(node);
        nodes.push(node);
    }
    
    // Create connections
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (Math.random() > 0.7) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    nodes[i].position,
                    nodes[j].position
                ]);
                
                const material = new THREE.LineBasicMaterial({
                    color: 0x00d4ff,
                    transparent: true,
                    opacity: 0.2
                });
                
                const connection = new THREE.Line(geometry, material);
                scene.add(connection);
                connections.push(connection);
            }
        }
    }
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00d4ff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    camera.position.z = 30;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Rotate nodes
        nodes.forEach((node, index) => {
            node.rotation.x += 0.01;
            node.rotation.y += 0.01;
            
            // Floating motion
            node.position.y += Math.sin(time + index * 0.5) * 0.01;
        });
        
        // Pulse connections
        connections.forEach((connection, index) => {
            const opacity = 0.1 + Math.sin(time * 2 + index * 0.1) * 0.1;
            connection.material.opacity = opacity;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Scroll Animations
function initScrollAnimations() {
    if (typeof gsap === 'undefined') return;
    
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Hero animations
    gsap.from('.hero-text h1', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1
    });
    
    gsap.from('.hero-text p', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 1
    });
    
    gsap.from('.hero-actions', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.8
    });
    
    // Tools grid animations
    gsap.from('.tool-card', {
        scrollTrigger: {
            trigger: '.ai-tools',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1
    });
    
    // Experiments animations
    gsap.from('.experiment-card', {
        scrollTrigger: {
            trigger: '.experiments',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1
    });
    
    // Metrics animations
    gsap.from('.metric-card', {
        scrollTrigger: {
            trigger: '.metrics-dashboard',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1
    });
}

// Metrics Dashboard
function initMetricsDashboard() {
    // Initialize accuracy chart
    const accuracyCtx = document.getElementById('accuracy-chart');
    if (accuracyCtx) {
        new Chart(accuracyCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Model Accuracy',
                    data: [92, 93, 94, 93.5, 94.2, 94.5],
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 90,
                        max: 100,
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }
    
    // Initialize speed chart
    const speedCtx = document.getElementById('speed-chart');
    if (speedCtx) {
        new Chart(speedCtx, {
            type: 'bar',
            data: {
                labels: ['CPU', 'GPU', 'Memory', 'Network'],
                datasets: [{
                    label: 'Processing Speed (ms)',
                    data: [1.2, 0.8, 2.1, 0.5],
                    backgroundColor: [
                        'rgba(0, 212, 255, 0.6)',
                        'rgba(255, 0, 255, 0.6)',
                        'rgba(0, 255, 0, 0.6)',
                        'rgba(255, 165, 0, 0.6)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }
    
    // Initialize models chart
    const modelsCtx = document.getElementById('models-chart');
    if (modelsCtx) {
        new Chart(modelsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Training', 'Idle'],
                datasets: [{
                    data: [12, 3, 5],
                    backgroundColor: [
                        'rgba(0, 255, 0, 0.6)',
                        'rgba(255, 165, 0, 0.6)',
                        'rgba(255, 255, 255, 0.2)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#ffffff' }
                    }
                }
            }
        });
    }
    
    // Initialize requests chart
    const requestsCtx = document.getElementById('requests-chart');
    if (requestsCtx) {
        new Chart(requestsCtx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'User Requests',
                    data: [120, 190, 300, 500, 200, 247],
                    borderColor: '#ff00ff',
                    backgroundColor: 'rgba(255, 0, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }
    
    // Animate metrics
    animateMetrics();
}

function animateMetrics() {
    // Update metrics with random variations
    setInterval(() => {
        // Update accuracy
        const accuracyElement = document.getElementById('accuracy-metric');
        if (accuracyElement) {
            const newAccuracy = (93 + Math.random() * 2).toFixed(1);
            accuracyElement.textContent = newAccuracy + '%';
        }
        
        // Update speed
        const speedElement = document.getElementById('speed-metric');
        if (speedElement) {
            const newSpeed = (0.8 + Math.random() * 0.8).toFixed(1);
            speedElement.textContent = newSpeed + 'ms';
        }
        
        // Update requests
        const requestsElement = document.getElementById('requests-metric');
        if (requestsElement) {
            const currentRequests = parseInt(requestsElement.textContent.replace(',', ''));
            const newRequests = currentRequests + Math.floor(Math.random() * 10);
            requestsElement.textContent = newRequests.toLocaleString();
        }
    }, 5000);
}

// Tool Functions
function openTool(toolName) {
    const modal = document.getElementById('tool-modal');
    const title = document.getElementById('tool-title');
    const content = document.getElementById('tool-content');
    
    // Set title
    const titles = {
        'text-generator': 'AI Text Generator',
        'image-recognition': 'Image Recognition',
        'voice-assistant': 'Voice Assistant',
        'data-visualizer': 'Data Visualizer',
        'code-assistant': 'AI Code Assistant',
        'neural-builder': 'Neural Network Builder'
    };
    
    title.textContent = titles[toolName] || 'AI Tool';
    
    // Load tool content
    loadToolContent(toolName, content);
    
    // Show modal
    modal.classList.add('active');
}

function closeToolModal() {
    const modal = document.getElementById('tool-modal');
    modal.classList.remove('active');
}

function loadToolContent(toolName, container) {
    const contents = {
        'text-generator': `
            <div class="tool-interface">
                <div class="input-section">
                    <label>Enter your prompt:</label>
                    <textarea id="text-prompt" placeholder="Describe what you want the AI to generate..." rows="4"></textarea>
                    <div class="options">
                        <select id="text-length">
                            <option value="short">Short (100 words)</option>
                            <option value="medium">Medium (300 words)</option>
                            <option value="long">Long (500 words)</option>
                        </select>
                        <select id="text-style">
                            <option value="formal">Formal</option>
                            <option value="casual">Casual</option>
                            <option value="creative">Creative</option>
                        </select>
                    </div>
                    <button onclick="generateText()" class="btn primary">Generate Text</button>
                </div>
                <div class="output-section">
                    <label>Generated Text:</label>
                    <div id="text-output" class="output-area">Your generated text will appear here...</div>
                </div>
            </div>
        `,
        'image-recognition': `
            <div class="tool-interface">
                <div class="input-section">
                    <label>Upload an image for analysis:</label>
                    <input type="file" id="image-upload" accept="image/*" onchange="analyzeImage(event)">
                    <div class="drop-zone" id="drop-zone" ondrop="handleDrop(event)" ondragover="handleDragOver(event)">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Drop image here or click to upload</p>
                    </div>
                </div>
                <div class="output-section">
                    <label>Analysis Results:</label>
                    <div id="image-results" class="output-area">Upload an image to see AI analysis...</div>
                </div>
            </div>
        `,
        'voice-assistant': `
            <div class="tool-interface">
                <div class="input-section">
                    <label>Voice Assistant</label>
                    <button id="voice-btn" onclick="toggleVoiceRecognition()" class="btn primary">
                        <i class="fas fa-microphone"></i> Start Listening
                    </button>
                    <div id="voice-status" class="voice-status">Click to start voice recognition...</div>
                </div>
                <div class="output-section">
                    <label>Assistant Response:</label>
                    <div id="voice-output" class="output-area">Voice assistant responses will appear here...</div>
                </div>
            </div>
        `,
        'data-visualizer': `
            <div class="tool-interface">
                <div class="input-section">
                    <label>Enter your data (CSV format):</label>
                    <textarea id="data-input" placeholder="Enter comma-separated values..." rows="4"></textarea>
                    <select id="chart-type">
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                        <option value="pie">Pie Chart</option>
                        <option value="scatter">Scatter Plot</option>
                    </select>
                    <button onclick="visualizeData()" class="btn primary">Visualize Data</button>
                </div>
                <div class="output-section">
                    <label>Data Visualization:</label>
                    <canvas id="data-chart" width="400" height="300"></canvas>
                </div>
            </div>
        `,
        'code-assistant': `
            <div class="tool-interface">
                <div class="input-section">
                    <label>Code Assistant</label>
                    <select id="code-language">
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                    </select>
                    <textarea id="code-input" placeholder="Enter your code or describe what you need help with..." rows="8"></textarea>
                    <button onclick="assistWithCode()" class="btn primary">Get Assistance</button>
                </div>
                <div class="output-section">
                    <label>AI Suggestions:</label>
                    <div id="code-output" class="output-area">AI code assistance will appear here...</div>
                </div>
            </div>
        `,
        'neural-builder': `
            <div class="tool-interface">
                <div class="input-section">
                    <label>Neural Network Builder</label>
                    <div class="network-controls">
                        <button onclick="addLayer()" class="btn secondary">Add Layer</button>
                        <button onclick="addConnection()" class="btn secondary">Add Connection</button>
                        <button onclick="trainNetwork()" class="btn primary">Train Network</button>
                    </div>
                </div>
                <div class="output-section">
                    <label>Network Visualization:</label>
                    <canvas id="network-canvas" width="400" height="300"></canvas>
                </div>
            </div>
        `
    };
    
    container.innerHTML = contents[toolName] || '<p>Tool content loading...</p>';
}

// Experiment Functions
function analyzeSentiment() {
    const input = document.getElementById('sentiment-input').value;
    const result = document.getElementById('sentiment-result');
    
    if (!input.trim()) {
        result.innerHTML = '<span style="color: #ffa500;">Please enter some text to analyze.</span>';
        return;
    }
    
    // Simulate sentiment analysis
    const sentiments = ['Positive', 'Negative', 'Neutral'];
    const scores = [0.8, 0.1, 0.5];
    const randomIndex = Math.floor(Math.random() * sentiments.length);
    
    const sentiment = sentiments[randomIndex];
    const score = scores[randomIndex];
    
    let color = '#00ff00';
    if (sentiment === 'Negative') color = '#ff0000';
    else if (sentiment === 'Neutral') color = '#ffa500';
    
    result.innerHTML = `
        <div class="sentiment-result">
            <div class="sentiment-label" style="color: ${color};">Sentiment: ${sentiment}</div>
            <div class="sentiment-score">Confidence: ${(score * 100).toFixed(1)}%</div>
            <div class="sentiment-bar">
                <div class="sentiment-fill" style="width: ${score * 100}%; background: ${color};"></div>
            </div>
        </div>
    `;
}

function detectObjects(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Simulate object detection
            const objects = [
                { name: 'Person', confidence: 0.95 },
                { name: 'Laptop', confidence: 0.87 },
                { name: 'Coffee Cup', confidence: 0.72 }
            ];
            
            const results = document.getElementById('detection-results');
            results.innerHTML = `
                <div class="detection-results">
                    <h4>Detected Objects:</h4>
                    ${objects.map(obj => `
                        <div class="detection-item">
                            <span class="object-name">${obj.name}</span>
                            <span class="confidence">${(obj.confidence * 100).toFixed(1)}%</span>
                        </div>
                    `).join('')}
                </div>
            `;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function transferStyle(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const style = document.getElementById('style-select').value;
    const result = document.getElementById('style-result');
    
    result.innerHTML = `
        <div class="style-transfer-result">
            <div class="processing-indicator">
                <i class="fas fa-spinner fa-spin"></i>
                Processing style transfer...
            </div>
            <p>Applying ${style} style to your image...</p>
        </div>
    `;
    
    // Simulate processing
    setTimeout(() => {
        result.innerHTML = `
            <div class="style-transfer-result">
                <h4>Style Transfer Complete!</h4>
                <div class="styled-image">
                    <img src="${URL.createObjectURL(file)}" alt="Original" style="filter: contrast(1.2) saturate(1.5);">
                    <div class="style-label">${style.toUpperCase()}</div>
                </div>
            </div>
        `;
    }, 3000);
}

function translateText() {
    const input = document.getElementById('translation-input').value;
    const sourceLang = document.getElementById('source-language').value;
    const targetLang = document.getElementById('target-language').value;
    const result = document.getElementById('translation-result');
    
    if (!input.trim()) {
        result.innerHTML = '<span style="color: #ffa500;">Please enter text to translate.</span>';
        return;
    }
    
    // Simulate translation
    const translations = {
        'en-es': 'Hola, ¿cómo estás? Esta es una traducción de ejemplo.',
        'en-fr': 'Bonjour, comment allez-vous? Ceci est une traduction d\'exemple.',
        'en-de': 'Hallo, wie geht es dir? Dies ist eine Beispielübersetzung.'
    };
    
    const key = `${sourceLang}-${targetLang}`;
    const translatedText = translations[key] || 'Translation processing...';
    
    result.innerHTML = `
        <div class="translation-result">
            <div class="translated-text">${translatedText}</div>
            <div class="translation-meta">
                <span>From: ${sourceLang.toUpperCase()}</span>
                <span>To: ${targetLang.toUpperCase()}</span>
            </div>
        </div>
    `;
}

// Tool Implementation Functions
function generateText() {
    const prompt = document.getElementById('text-prompt').value;
    const length = document.getElementById('text-length').value;
    const style = document.getElementById('text-style').value;
    const output = document.getElementById('text-output');
    
    if (!prompt.trim()) {
        output.innerHTML = '<span style="color: #ffa500;">Please enter a prompt.</span>';
        return;
    }
    
    output.innerHTML = `
        <div class="generating-indicator">
            <i class="fas fa-spinner fa-spin"></i>
            Generating text...
        </div>
    `;
    
    // Simulate text generation
    setTimeout(() => {
        const generatedTexts = {
            'short-formal': 'Based on your request, I can provide a concise and professional response that addresses your needs effectively.',
            'medium-casual': 'Hey there! I\'ve been thinking about what you asked, and here\'s a pretty cool response that should help you out. Let me break it down for you in a way that\'s easy to understand.',
            'long-creative': 'Imagine a world where your ideas flow like rivers of innovation, carving new pathways through the landscape of possibility. Your request opens doors to realms of creativity where boundaries dissolve and new horizons emerge. The synthesis of your concepts creates a tapestry of interconnected thoughts, each thread woven with precision and artistic vision.'
        };
        
        const key = `${length}-${style}`;
        const text = generatedTexts[key] || 'Generated text based on your prompt and preferences.';
        
        output.innerHTML = `
            <div class="generated-text">
                <div class="text-content">${text}</div>
                <div class="text-meta">
                    <span>Length: ${length}</span>
                    <span>Style: ${style}</span>
                    <span>Words: ${text.split(' ').length}</span>
                </div>
            </div>
        `;
    }, 2000);
}

function analyzeImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const result = document.getElementById('image-results');
    
    result.innerHTML = `
        <div class="analyzing-indicator">
            <i class="fas fa-spinner fa-spin"></i>
            Analyzing image...
        </div>
    `;
    
    // Simulate image analysis
    setTimeout(() => {
        result.innerHTML = `
            <div class="image-analysis">
                <div class="analysis-item">
                    <strong>Objects Detected:</strong> Person, Computer, Coffee Cup, Plant
                </div>
                <div class="analysis-item">
                    <strong>Scene:</strong> Office Environment
                </div>
                <div class="analysis-item">
                    <strong>Confidence:</strong> 94.2%
                </div>
                <div class="analysis-item">
                    <strong>Dominant Colors:</strong> Blue, Gray, Brown
                </div>
            </div>
        `;
    }, 2500);
}

function toggleVoiceRecognition() {
    const btn = document.getElementById('voice-btn');
    const status = document.getElementById('voice-status');
    const output = document.getElementById('voice-output');
    
    if (btn.textContent.includes('Start')) {
        btn.innerHTML = '<i class="fas fa-microphone-slash"></i> Stop Listening';
        btn.classList.remove('primary');
        btn.classList.add('secondary');
        status.textContent = 'Listening... Speak now!';
        status.style.color = '#00ff00';
        
        // Simulate voice recognition
        setTimeout(() => {
            output.innerHTML = `
                <div class="voice-response">
                    <strong>You said:</strong> "Hello AI assistant, can you help me?"
                    <br><br>
                    <strong>AI Response:</strong> "Hello! I'm here to help you with whatever you need. I can assist with information, creative tasks, problem-solving, and much more. What would you like to explore today?"
                </div>
            `;
            
            btn.innerHTML = '<i class="fas fa-microphone"></i> Start Listening';
            btn.classList.remove('secondary');
            btn.classList.add('primary');
            status.textContent = 'Click to start voice recognition...';
            status.style.color = '#ffffff';
        }, 3000);
    } else {
        btn.innerHTML = '<i class="fas fa-microphone"></i> Start Listening';
        btn.classList.remove('secondary');
        btn.classList.add('primary');
        status.textContent = 'Click to start voice recognition...';
        status.style.color = '#ffffff';
    }
}

function visualizeData() {
    const input = document.getElementById('data-input').value;
    const chartType = document.getElementById('chart-type').value;
    const canvas = document.getElementById('data-chart');
    
    if (!input.trim()) {
        alert('Please enter some data to visualize.');
        return;
    }
    
    // Parse CSV data
    const data = input.split(',').map(val => parseFloat(val.trim()));
    
    // Create chart
    new Chart(canvas, {
        type: chartType,
        data: {
            labels: data.map((_, i) => `Point ${i + 1}`),
            datasets: [{
                label: 'Your Data',
                data: data,
                backgroundColor: 'rgba(0, 212, 255, 0.6)',
                borderColor: '#00d4ff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

function assistWithCode() {
    const code = document.getElementById('code-input').value;
    const language = document.getElementById('code-language').value;
    const output = document.getElementById('code-output');
    
    if (!code.trim()) {
        output.innerHTML = '<span style="color: #ffa500;">Please enter some code or describe what you need help with.</span>';
        return;
    }
    
    output.innerHTML = `
        <div class="code-assistance">
            <div class="assistance-item">
                <strong>Suggestion:</strong> Consider adding error handling to your code for better robustness.
            </div>
            <div class="assistance-item">
                <strong>Optimization:</strong> You can improve performance by using async/await instead of callbacks.
            </div>
            <div class="assistance-item">
                <strong>Best Practice:</strong> Add comments to explain complex logic for better maintainability.
            </div>
        </div>
    `;
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initIntersectionObserver() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, options);
    
    document.querySelectorAll('.tool-card, .experiment-card, .metric-card').forEach(el => {
        observer.observe(el);
    });
}

function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Drag and Drop Functions
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        analyzeImage({ target: { files: [files[0]] } });
    }
}
