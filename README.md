# Francis Amante - Portfolio Website

A modern, custom portfolio website showcasing expertise in Information Technology, Content Creation, and STEM education.

## 🌟 Features

- **Modern Design**: Premium aesthetics with glassmorphism effects and gradient backgrounds
- **Fully Responsive**: Optimized for all devices (desktop, tablet, mobile)
- **Smooth Animations**: Scroll-triggered animations and parallax effects
- **Interactive Navigation**: Smooth scrolling with active section highlighting
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Accessible**: Supports reduced motion preferences and keyboard navigation

## 🚀 Local Development

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No build tools required - this is a static website!

### Running Locally

1. Clone or download this repository
2. Open `index.html` in your web browser
3. That's it! The website will load with all styles and interactivity

Alternatively, you can use a simple HTTP server for a more production-like experience:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have npx installed)
npx serve
```

Then open `http://localhost:8000` in your browser.

## 📦 Project Structure

```
francis-portfolio/
├── index.html          # Main HTML file with semantic structure
├── styles.css          # All styling and design system
├── script.js           # Interactive features and animations
└── README.md           # This file
```

## 🌐 Deploying to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., `francisamante-portfolio`)
4. Make it public
5. Don't initialize with README (since we already have one)
6. Click "Create repository"

### Step 2: Push Your Code to GitHub

```bash
# Navigate to your project directory
cd /path/to/francis-portfolio

# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial portfolio website"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "main" branch
5. Click "Save"
6. GitHub will provide you with a URL (e.g., `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`)

Your site will be live in a few minutes!

## 🔗 Custom Domain Configuration

To use your custom domain `portfolio.francisamante.com`:

### Step 1: Configure GitHub Pages

1. In your repository settings, go to "Pages"
2. Under "Custom domain", enter `portfolio.francisamante.com`
3. Click "Save"
4. Check "Enforce HTTPS" (after DNS propagation)

### Step 2: Configure DNS Settings

In your domain registrar's DNS settings:

1. Add a CNAME record:
   - **Type**: CNAME
   - **Name**: portfolio (or the subdomain you want)
   - **Value**: YOUR_USERNAME.github.io

2. Alternatively, use A records pointing to GitHub's IP addresses:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153

### Step 3: Wait for DNS Propagation

DNS changes can take up to 24-48 hours to propagate, but usually happen within a few hours.

## 🎨 Customization

### Colors

Edit the CSS custom properties in `styles.css`:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --accent-purple: #667eea;
    /* ... other color variables */
}
```

### Content

Edit the text directly in `index.html`. The structure is semantic and easy to follow:

- Hero section: Lines 44-75
- About section: Lines 78-88
- Expertise sections: Lines 91-230
- Contact section: Lines 233-267

### Adding Images

1. Create an `images` folder in your project
2. Add your images to the folder
3. Reference them in `index.html`:

```html
<img src="images/your-image.jpg" alt="Description">
```

## 🛠️ Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Modern styling with Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No frameworks, pure JavaScript for interactivity
- **Google Fonts**: Inter font family

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is open source and available for personal use.

## 👤 Author

**Francis Amante**

- LinkedIn: [Francis Amante](https://www.linkedin.com/in/francis-amante)
- Website: [portfolio.francisamante.com](https://portfolio.francisamante.com)

---

Built with ❤️ using modern web technologies
