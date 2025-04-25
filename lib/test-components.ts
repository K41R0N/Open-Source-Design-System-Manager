// Test data for the dashboard display
export const testComponents = [
  {
    id: 'comp-1',
    name: 'Navigation Bar',
    html: `<nav class="navbar">
  <div class="logo">Brand</div>
  <ul class="nav-links">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
  <button class="mobile-toggle">≡</button>
</nav>`,
    css: `.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #333;
  color: white;
}
.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.nav-links a {
  color: white;
  text-decoration: none;
}
.mobile-toggle {
  display: none;
}
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .mobile-toggle {
    display: block;
  }
}`,
    js: '',
    tags: ['tag-1', 'tag-2'],
    project_id: 'project-1',
    user_id: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'comp-2',
    name: 'Hero Section',
    html: `<div class="hero">
  <div class="hero-content">
    <h1>Welcome to Our Site</h1>
    <p>The best place to find what you need</p>
    <button class="cta-button">Get Started</button>
  </div>
</div>`,
    css: `.hero {
  background-color: #4a6de5;
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.cta-button {
  background-color: white;
  color: #4a6de5;
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.cta-button:hover {
  background-color: #f0f0f0;
}`,
    js: '',
    tags: ['tag-3', 'tag-4'],
    project_id: 'project-1',
    user_id: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'comp-3',
    name: 'Interactive Counter',
    html: `<div class="counter-container">
  <h2>Counter: <span id="count">0</span></h2>
  <div class="buttons">
    <button id="decrement">-</button>
    <button id="increment">+</button>
  </div>
  <button id="reset">Reset</button>
</div>`,
    css: `.counter-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 300px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 2rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  min-width: 50px;
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

#reset {
  background-color: #ff6b6b;
  color: white;
  border: none;
}`,
    js: `document.getElementById('increment').addEventListener('click', function() {
  let count = parseInt(document.getElementById('count').innerText);
  document.getElementById('count').innerText = count + 1;
});

document.getElementById('decrement').addEventListener('click', function() {
  let count = parseInt(document.getElementById('count').innerText);
  document.getElementById('count').innerText = Math.max(0, count - 1);
});

document.getElementById('reset').addEventListener('click', function() {
  document.getElementById('count').innerText = 0;
});`,
    tags: ['tag-5', 'tag-6'],
    project_id: 'project-1',
    user_id: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const testProjects = [
  {
    id: 'project-1',
    name: 'Demo Project',
    description: 'A demo project for testing',
    user_id: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const testTags = [
  {
    id: 'tag-1',
    name: 'navigation',
    user_id: 'user-1',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tag-2',
    name: 'header',
    user_id: 'user-1',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tag-3',
    name: 'hero',
    user_id: 'user-1',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tag-4',
    name: 'banner',
    user_id: 'user-1',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tag-5',
    name: 'interactive',
    user_id: 'user-1',
    created_at: new Date().toISOString(),
  },
  {
    id: 'tag-6',
    name: 'counter',
    user_id: 'user-1',
    created_at: new Date().toISOString(),
  }
]; 