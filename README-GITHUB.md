# Feenixs AI Platform - Modular Website

A futuristic, multi-page AI platform website built with HTML5, CSS3, and JavaScript, featuring modular architecture and advanced user interactions.

## 🚀 Quick Start

### Option 1: Using Batch Files (Windows)

1. **Start Web Server:**
   ```bash
   start-web.bat
   ```
   This will start the server at http://localhost:8008

2. **Setup GitHub Repository:**
   ```bash
   setup-github.bat
   ```
   This will initialize Git and help you push to GitHub

### Option 2: Manual Setup

1. **Start Server:**
   ```bash
   python -m http.server 8008
   ```

2. **Setup Git:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/feenixs-website.git
   git push -u origin main
   ```

## 📁 Project Structure

```
feenixs/
├── css/                 # Stylesheets
│   ├── shared.css      # Common styles
│   ├── home.css        # Home page styles
│   ├── vision.css      # Vision page styles
│   ├── technologies.css # Technologies page styles
│   ├── founder.css     # Founder page styles
│   ├── community.css   # Community page styles
│   └── contact.css     # Contact page styles
├── data/               # CSV data files
│   ├── users.csv       # User registration data
│   ├── visitors.csv    # Visitor tracking
│   ├── messages.csv    # Contact form messages
│   └── chat.csv       # Community chat messages
├── js/                 # JavaScript files
│   ├── shared.js       # Common functionality
│   ├── home.js         # Home page scripts
│   ├── vision.js       # Vision page scripts
│   ├── technologies.js  # Technologies page scripts
│   ├── founder.js      # Founder page scripts
│   ├── community.js    # Community page scripts
│   └── contact.js      # Contact page scripts
├── pages/              # HTML pages
│   ├── index.html      # Home page
│   ├── vision.html      # Vision page
│   ├── technologies.html # Technologies page
│   ├── founder.html     # Founder page
│   ├── community.html   # Community page
│   └── contact.html     # Contact page
├── start-web.bat       # Windows batch file to start server
├── setup-github.bat    # Windows batch file for GitHub setup
└── README.md           # This file
```

## 🌐 Pages

1. **Home** (`/pages/index.html`) - Landing page with hero section and quick preview
2. **Vision** (`/pages/vision.html`) - Company vision, mission, and future goals
3. **Technologies** (`/pages/technologies.html`) - Technology showcase and research projects
4. **Founder** (`/pages/founder.html`) - Founder profile and journey
5. **Community** (`/pages/community.html`) - Community chat and features
6. **Contact** (`/pages/contact.html`) - Contact form and information

## ✨ Features

- **Modular Architecture** - Separate HTML, CSS, and JS files for each page
- **Responsive Design** - Mobile-first approach with glassmorphism effects
- **User Authentication** - Login/registration system with CSV storage
- **Community Chat** - Real-time messaging system
- **Contact Forms** - Message submission with data storage
- **Visitor Tracking** - Automatic visitor analytics
- **Interactive Animations** - GSAP-powered animations and effects
- **Particle Background** - Neural network particle animation
- **Mobile Navigation** - Responsive hamburger menu

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript ES6+** - Interactive functionality
- **GSAP** - Animation library
- **Font Awesome** - Icon library
- **CSV Storage** - Data persistence (simulated)

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔐 Data Storage

All user data is stored in CSV files in the `/data/` directory:
- `users.csv` - User registration and authentication
- `visitors.csv` - Visitor tracking analytics
- `messages.csv` - Contact form submissions
- `chat.csv` - Community chat messages

## 🚀 Deployment

### GitHub Pages

1. Push your code to GitHub repository
2. Go to repository Settings > Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/pages" folder
5. Save and wait for deployment

### Alternative Hosting

The website can be hosted on any static hosting service that supports:
- HTML5, CSS3, JavaScript
- Static file serving
- No server-side processing required

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For support or questions:
- Create an issue in the GitHub repository
- Use the contact form on the website
- Join the community chat

---

**Built with ❤️ for the future of AI**
