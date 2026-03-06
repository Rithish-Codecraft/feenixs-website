// Developer Portal JavaScript

class DeveloperPortal {
    constructor() {
        this.apiBase = 'https://api.feenixs.com/v2';
        this.currentToken = localStorage.getItem('feenixs_api_token') || null;
        this.performanceChart = null;
        this.performanceData = {
            labels: [],
            responseTime: [],
            serverLoad: [],
            memoryUsage: [],
            connections: []
        };
        
        this.init();
    }
    
    init() {
        // Initialize loading screen
        this.initLoadingScreen();
        
        // Initialize animations
        this.initAnimations();
        
        // Initialize code display
        this.initCodeDisplay();
        
        // Initialize API tester
        this.initAPITester();
        
        // Initialize code generator
        this.initCodeGenerator();
        
        // Initialize database manager
        this.initDatabaseManager();
        
        // Initialize performance monitor
        this.initPerformanceMonitor();
        
        // Initialize scroll animations
        this.initScrollAnimations();
        
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
        
        gsap.from('.hero-actions .btn', {
            duration: 1.5,
            y: 20,
            opacity: 0,
            delay: 0.6,
            stagger: 0.2,
            ease: 'power3.out'
        });
        
        gsap.from('.code-visualization', {
            duration: 2,
            scale: 0.8,
            opacity: 0,
            delay: 0.8,
            ease: 'elastic.out(1, 0.5)'
        });
        
        // Animate code lines
        gsap.to('.code-lines .line', {
            duration: 2,
            opacity: 0.6,
            stagger: 0.1,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut'
        });
        
        // Floating code animation
        gsap.to('.floating-code', {
            duration: 4,
            y: -10,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut'
        });
    }
    
    initCodeDisplay() {
        const codeDisplay = document.getElementById('code-display');
        if (codeDisplay) {
            const codeSnippets = [
                'const feenixs = new DeveloperAPI();',
                'await feenixs.ai.generateText({prompt: "Hello World"});',
                'const response = await feenixs.auth.login(user);',
                'const data = await feenixs.data.query("SELECT * FROM users");',
                'const stats = await feenixs.analytics.getMetrics();'
            ];
            
            let currentIndex = 0;
            
            setInterval(() => {
                gsap.to(codeDisplay, {
                    duration: 0.5,
                    opacity: 0,
                    onComplete: () => {
                        codeDisplay.textContent = codeSnippets[currentIndex];
                        currentIndex = (currentIndex + 1) % codeSnippets.length;
                        gsap.to(codeDisplay, {
                            duration: 0.5,
                            opacity: 1
                        });
                    }
                });
            }, 3000);
        }
    }
    
    initAPITester() {
        const apiEndpointSelect = document.getElementById('api-endpoint-select');
        const apiMethodSelect = document.getElementById('api-method-select');
        const apiTokenInput = document.getElementById('api-token-input');
        const requestBody = document.getElementById('request-body');
        const apiResponse = document.getElementById('api-response');
        
        // Set default token if exists
        if (this.currentToken && apiTokenInput) {
            apiTokenInput.value = this.currentToken;
        }
        
        // Method change handler
        if (apiMethodSelect) {
            apiMethodSelect.addEventListener('change', (e) => {
                const method = e.target.value.toLowerCase();
                if (requestBody) {
                    requestBody.style.display = (method === 'get') ? 'none' : 'block';
                }
            });
        }
    }
    
    async testAPI() {
        const endpoint = document.getElementById('api-endpoint-select').value;
        const method = document.getElementById('api-method-select').value;
        const token = document.getElementById('api-token-input').value;
        const body = document.getElementById('request-body').value;
        const responseDisplay = document.getElementById('api-response');
        
        if (!endpoint) {
            alert('Please select an API endpoint');
            return;
        }
        
        if (!token) {
            alert('Please enter an API token');
            return;
        }
        
        // Show loading state
        responseDisplay.textContent = 'Loading...';
        responseDisplay.style.color = '#ffa500';
        
        try {
            const startTime = performance.now();
            
            const response = await fetch(`${this.apiBase}${endpoint}`, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: method !== 'GET' ? body : undefined
            });
            
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            
            const data = await response.json();
            
            // Display response
            responseDisplay.textContent = JSON.stringify(data, null, 2);
            responseDisplay.style.color = '#00ff00';
            
            // Update performance stats
            this.updatePerformanceStats(responseTime);
            
        } catch (error) {
            responseDisplay.textContent = `Error: ${error.message}`;
            responseDisplay.style.color = '#ff0000';
        }
    }
    
    clearAPI() {
        document.getElementById('api-endpoint-select').value = '';
        document.getElementById('api-method-select').value = 'GET';
        document.getElementById('request-body').value = '';
        document.getElementById('api-response').textContent = '';
    }
    
    initCodeGenerator() {
        const languageSelect = document.getElementById('code-language-select');
        const templateSelect = document.getElementById('code-template-select');
        const descriptionInput = document.getElementById('code-description');
        
        // Generate sample templates
        if (templateSelect) {
            templateSelect.addEventListener('change', (e) => {
                this.updateCodeTemplate(e.target.value);
            });
        }
    }
    
    async generateCode() {
        const language = document.getElementById('code-language-select').value;
        const template = document.getElementById('code-template-select').value;
        const description = document.getElementById('code-description').value;
        const outputDisplay = document.getElementById('code-output');
        
        if (!description) {
            alert('Please describe the functionality you want to generate');
            return;
        }
        
        // Show loading state
        outputDisplay.textContent = 'Generating code...';
        
        // Simulate code generation (in real implementation, this would call AI service)
        setTimeout(() => {
            const generatedCode = this.generateSampleCode(language, template, description);
            outputDisplay.textContent = generatedCode;
            
            // Apply syntax highlighting if Prism is available
            if (window.Prism) {
                Prism.highlightElement(outputDisplay);
            }
        }, 1500);
    }
    
    generateSampleCode(language, template, description) {
        const templates = {
            javascript: {
                'api-client': `// Feenixs API Client
class FeenixsClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.feenixs.com/v2';
    }
    
    async ${description.toLowerCase().replace(/\s+/g, '_')}() {
        const response = await fetch(\`\${this.baseURL}/api/${description.toLowerCase().replace(/\s+/g, '_')}\`, {
            headers: {
                'Authorization': \`Bearer \${this.apiKey}\`,
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    }
}

const client = new FeenixsClient('your-api-key');`,
                'auth-middleware': `// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateToken;`,
                'data-model': `// Data Model for ${description}
const mongoose = require('mongoose');

const ${description.replace(/\s+/g, '')}Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('${description.replace(/\s+/g, '')}', ${description.replace(/\s+/g, '')}Schema);`,
                'error-handler': `// Error Handler for ${description}
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    
    console.error(error);
    
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;`
            },
            python: {
                'api-client': `# Feenixs API Client
import requests
import json

class FeenixsClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://api.feenixs.com/v2'
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def ${description.lower().replace(/\s+/g, '_')}(self):
        response = requests.get(
            f'{self.base_url}/api/{description.lower().replace(/\s+/g, "_")}',
            headers=self.headers
        )
        return response.json()

client = FeenixsClient('your-api-key')`,
                'auth-middleware': `# Authentication Middleware
from functools import wraps
import jwt
from flask import request, jsonify, current_app

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            token = token.split(' ')[1]
            data = jwt.decode(token, current_app.config['SECRET_KEY'])
            return f(*args, **kwargs)
        except:
            return jsonify({'error': 'Token is invalid'}), 401
    
    return decorated`,
                'data-model': `# Data Model for ${description}
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class ${description.replace(/\s+/g, '')}(Base):
    __tablename__ = '${description.lower().replace(/\s+/g, '_')}'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)`,
                'error-handler': `# Error Handler for ${description}
from flask import jsonify
from werkzeug.exceptions import HTTPException

def handle_${description.lower().replace(/\s+/g, '_')}_error(error):
    response = {
        'success': False,
        'error': str(error)
    }
    
    if isinstance(error, HTTPException):
        response['status_code'] = error.code
    else:
        response['status_code'] = 500
    
    return jsonify(response), response.get('status_code', 500)

# Register error handler
app.register_error_handler(Exception, handle_${description.lower().replace(/\s+/g, '_')}_error)`
            }
        };
        
        return templates[language]?.[template] || '// Code generation not available for this combination';
    }
    
    copyCode() {
        const codeOutput = document.getElementById('code-output');
        if (codeOutput) {
            navigator.clipboard.writeText(codeOutput.textContent).then(() => {
                // Show success message
                const originalText = codeOutput.textContent;
                codeOutput.textContent = 'Code copied to clipboard!';
                codeOutput.style.color = '#00ff00';
                
                setTimeout(() => {
                    codeOutput.textContent = originalText;
                    codeOutput.style.color = '';
                }, 2000);
            });
        }
    }
    
    initDatabaseManager() {
        const tableSelect = document.getElementById('db-table-select');
        
        if (tableSelect) {
            tableSelect.addEventListener('change', (e) => {
                this.queryDatabase(e.target.value);
            });
        }
        
        // Load initial data
        this.queryDatabase('users');
    }
    
    async queryDatabase(table = 'users') {
        const resultsBody = document.getElementById('db-results-body');
        
        if (!resultsBody) return;
        
        // Show loading state
        resultsBody.innerHTML = '<tr><td colspan="4">Loading data...</td></tr>';
        
        // Simulate database query (in real implementation, this would call API)
        setTimeout(() => {
            const mockData = this.generateMockData(table);
            this.displayDatabaseResults(mockData);
        }, 1000);
    }
    
    generateMockData(table) {
        const data = {
            users: [
                { id: 1, data: 'user@example.com', created: '2024-01-15' },
                { id: 2, data: 'dev@feenixs.com', created: '2024-01-20' },
                { id: 3, data: 'admin@feenixs.com', created: '2024-01-25' }
            ],
            api_keys: [
                { id: 1, data: 'pk_live_123456789', created: '2024-01-10' },
                { id: 2, data: 'pk_test_987654321', created: '2024-01-18' }
            ],
            analytics: [
                { id: 1, data: 'API calls: 1,234', created: '2024-01-01' },
                { id: 2, data: 'Active users: 456', created: '2024-01-02' }
            ],
            logs: [
                { id: 1, data: 'User login successful', created: '2024-01-20 10:30' },
                { id: 2, data: 'API rate limit exceeded', created: '2024-01-20 11:45' }
            ]
        };
        
        return data[table] || [];
    }
    
    displayDatabaseResults(data) {
        const resultsBody = document.getElementById('db-results-body');
        if (!resultsBody) return;
        
        resultsBody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.data}</td>
                <td>${item.created}</td>
                <td>
                    <button class="btn secondary" onclick="developerPortal.editRecord(${item.id})" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;">Edit</button>
                    <button class="btn primary" onclick="developerPortal.deleteRecord(${item.id})" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; margin-left: 0.5rem;">Delete</button>
                </td>
            `;
            resultsBody.appendChild(row);
        });
    }
    
    editRecord(id) {
        alert(`Edit record with ID: ${id}`);
    }
    
    deleteRecord(id) {
        if (confirm(`Are you sure you want to delete record with ID: ${id}?`)) {
            alert(`Record ${id} deleted successfully`);
            this.queryDatabase();
        }
    }
    
    exportData() {
        const table = document.getElementById('db-table-select').value;
        const data = this.generateMockData(table);
        
        // Convert to CSV
        const csv = this.convertToCSV(data);
        
        // Download file
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${table}_export.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
    
    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');
        const csvRows = data.map(row => headers.map(header => row[header]).join(','));
        
        return [csvHeaders, ...csvRows].join('\n');
    }
    
    initPerformanceMonitor() {
        this.initPerformanceChart();
        this.startPerformanceUpdates();
    }
    
    initPerformanceChart() {
        const ctx = document.getElementById('performance-chart');
        if (!ctx) return;
        
        this.performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Response Time (ms)',
                    data: [],
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }
    
    startPerformanceUpdates() {
        setInterval(() => {
            this.updatePerformanceMetrics();
        }, 2000);
    }
    
    updatePerformanceMetrics() {
        // Generate mock performance data
        const responseTime = Math.floor(Math.random() * 200) + 50;
        const serverLoad = Math.floor(Math.random() * 100);
        const memoryUsage = Math.floor(Math.random() * 1024) + 256;
        const connections = Math.floor(Math.random() * 1000) + 100;
        
        // Update display
        const responseTimeEl = document.getElementById('api-response-time');
        const serverLoadEl = document.getElementById('server-load');
        const memoryUsageEl = document.getElementById('memory-usage');
        const connectionsEl = document.getElementById('active-connections');
        
        if (responseTimeEl) responseTimeEl.textContent = `${responseTime}ms`;
        if (serverLoadEl) serverLoadEl.textContent = `${serverLoad}%`;
        if (memoryUsageEl) memoryUsageEl.textContent = `${memoryUsage}MB`;
        if (connectionsEl) connectionsEl.textContent = connections;
        
        // Update chart
        if (this.performanceChart) {
            const now = new Date().toLocaleTimeString();
            
            if (this.performanceChart.data.labels.length > 10) {
                this.performanceChart.data.labels.shift();
                this.performanceChart.data.datasets[0].data.shift();
            }
            
            this.performanceChart.data.labels.push(now);
            this.performanceChart.data.datasets[0].data.push(responseTime);
            this.performanceChart.update();
        }
    }
    
    updatePerformanceStats(responseTime) {
        // Update API response time in performance monitor
        const responseTimeEl = document.getElementById('api-response-time');
        if (responseTimeEl) {
            responseTimeEl.textContent = `${responseTime}ms`;
        }
    }
    
    initScrollAnimations() {
        // ScrollTrigger animations for sections
        gsap.registerPlugin(ScrollTrigger);
        
        // API Cards animation
        gsap.utils.toArray('.api-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
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
        
        // Tool Cards animation
        gsap.utils.toArray('.tool-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
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
        
        // SDK Cards animation
        gsap.utils.toArray('.sdk-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
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
    }
    
    downloadSDK(language) {
        const downloads = {
            js: 'https://github.com/feenixs/sdk-js/releases/latest',
            python: 'https://github.com/feenixs/sdk-python/releases/latest',
            rest: 'https://github.com/feenixs/api-postman-collection'
        };
        
        window.open(downloads[language] || '#', '_blank');
    }
    
    viewSDKDocs(language) {
        const docs = {
            js: '/docs/sdk/javascript',
            python: '/docs/sdk/python',
            rest: '/docs/api/rest'
        };
        
        window.open(docs[language] || '#', '_blank');
    }
}

// Global functions for onclick handlers
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function testAPI() {
    developerPortal.testAPI();
}

function clearAPI() {
    developerPortal.clearAPI();
}

function generateCode() {
    developerPortal.generateCode();
}

function copyCode() {
    developerPortal.copyCode();
}

function queryDatabase() {
    developerPortal.queryDatabase();
}

function exportData() {
    developerPortal.exportData();
}

function downloadSDK(language) {
    developerPortal.downloadSDK(language);
}

function viewSDKDocs(language) {
    developerPortal.viewSDKDocs(language);
}

// Initialize developer portal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.developerPortal = new DeveloperPortal();
});
