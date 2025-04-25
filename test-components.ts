export const testComponents = [
  {
    id: 'test-component-1',
    name: 'Navigation Bar',
    html: `
<nav class="navbar">
  <div class="logo">Brand</div>
  <ul class="nav-links">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
  <button class="mobile-toggle">☰</button>
</nav>
    `,
    css: `
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 1rem;
  width: 100%;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links li {
  margin-left: 1rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
}

.nav-links a:hover {
  text-decoration: underline;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .mobile-toggle {
    display: block;
  }
  
  .nav-links.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background-color: #333;
  }
}
    `,
    js: `
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle && navLinks) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}
    `
  },
  {
    id: 'test-component-2',
    name: 'Hero Section',
    html: `
<div class="hero">
  <h1>Welcome to Our Website</h1>
  <p>This is a beautiful hero section component that you can reuse in your projects.</p>
  <button class="cta-button">Get Started</button>
</div>
    `,
    css: `
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border-radius: 8px;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  max-width: 600px;
  margin-bottom: 2rem;
}

.cta-button {
  padding: 0.8rem 2rem;
  background-color: white;
  color: #6e8efb;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
    `,
    js: `
const ctaButton = document.querySelector('.cta-button');

if (ctaButton) {
  ctaButton.addEventListener('click', () => {
    alert('Button clicked! In a real app, this would navigate to another page.');
  });
}
    `
  },
  {
    id: 'test-component-3',
    name: 'Interactive Counter',
    html: `
<div class="counter-container">
  <h2>Counter: <span id="count">0</span></h2>
  <div class="button-group">
    <button id="decrement">-</button>
    <button id="increment">+</button>
  </div>
  <button id="reset">Reset</button>
</div>
    `,
    css: `
.counter-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.counter-container h2 {
  color: #333;
  margin-bottom: 1.5rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

#increment, #decrement {
  background-color: #4caf50;
  color: white;
  width: 3rem;
}

#increment:hover, #decrement:hover {
  background-color: #388e3c;
}

#reset {
  background-color: #f44336;
  color: white;
}

#reset:hover {
  background-color: #d32f2f;
}
    `,
    js: `
let count = 0;
const countDisplay = document.getElementById('count');
const incrementBtn = document.getElementById('increment');
const decrementBtn = document.getElementById('decrement');
const resetBtn = document.getElementById('reset');

function updateDisplay() {
  if (countDisplay) {
    countDisplay.textContent = count.toString();
  }
}

if (incrementBtn) {
  incrementBtn.addEventListener('click', () => {
    count++;
    updateDisplay();
  });
}

if (decrementBtn) {
  decrementBtn.addEventListener('click', () => {
    count--;
    updateDisplay();
  });
}

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    count = 0;
    updateDisplay();
  });
}
    `
  }
];
