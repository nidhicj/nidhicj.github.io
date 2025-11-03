// Theme Management
function initTheme() {
    const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Load and render data
let feedData = null;

async function loadFeed() {
    try {
        const response = await fetch('data/feed.json');
        if (!response.ok) throw new Error('Failed to load feed data');
        feedData = await response.json();
        return feedData;
    } catch (error) {
        console.error('Error loading feed:', error);
        return null;
    }
}

function renderProfile(data) {
    if (!data || !data.profile) return;
    
    const profile = data.profile;
    document.getElementById('avatar').src = profile.avatar;
    document.getElementById('avatar').alt = `${profile.name} profile picture`;
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('posts-count').textContent = profile.posts.toLocaleString();
    document.getElementById('followers-count').textContent = profile.followers.toLocaleString();
    document.getElementById('following-count').textContent = profile.following.toLocaleString();
    document.getElementById('profile-bio').textContent = profile.bio;
}

function getTileUrl(tile, index) {
    if (index === 0) return 'home.html';
    if (index === 1) return 'contact.html';
    if (index === 2) return 'about.html';
    if (tile.type === 'project' && tile.slug) {
        return `project.html?id=${tile.slug}`;
    }
    return '#';
}

function renderTiles(data) {
    if (!data || !data.tiles) return;
    
    const grid = document.getElementById('tiles-grid');
    grid.innerHTML = '';
    
    data.tiles.forEach((tile, index) => {
        const tileElement = document.createElement('a');
        tileElement.href = getTileUrl(tile, index);
        tileElement.className = 'tile';
        tileElement.setAttribute('role', 'listitem');
        tileElement.setAttribute('aria-label', `Navigate to ${tile.caption}`);
        
        const img = document.createElement('img');
        img.src = tile.image;
        img.alt = tile.caption || 'Portfolio tile';
        img.className = 'tile-image';
        img.loading = index < 6 ? 'eager' : 'lazy';
        
        const overlay = document.createElement('div');
        overlay.className = 'tile-overlay';
        
        const caption = document.createElement('div');
        caption.className = 'tile-caption';
        caption.textContent = tile.caption;
        overlay.appendChild(caption);
        
        if (tile.tags && tile.tags.length > 0) {
            const tags = document.createElement('div');
            tags.className = 'tile-tags';
            tile.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag';
                tagSpan.textContent = tag;
                tags.appendChild(tagSpan);
            });
            overlay.appendChild(tags);
        }
        
        tileElement.appendChild(img);
        tileElement.appendChild(overlay);
        grid.appendChild(tileElement);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    const data = await loadFeed();
    if (data) {
        if (document.getElementById('avatar')) {
            renderProfile(data);
        }
        if (document.getElementById('tiles-grid')) {
            renderTiles(data);
        }
    }
});

