// ===== MODELS DATA =====
const models = [
    {
        id: 1,
        name: "Custom Chat System",
        filename: "CustomChatSystem.rbxl",
        description: "Custom chat system for Roblox with advanced commands and configuration.",
        size: null
    }
];

// ===== APP STATE =====
let currentSection = 'home';
let downloads = JSON.parse(localStorage.getItem('rsm_downloads') || '{}');
let settings = JSON.parse(localStorage.getItem('rsm_settings') || '{}');

// Default settings
const defaultSettings = {
    theme: 'dark',
    primaryColor: '#4CAF50',
    fontSize: 16,
    autoSize: true
};

// ===== INITIALIZE APP =====
function initApp() {
    console.log('🚀 Initializing RSM...');
    
    // Merge with default settings
    settings = { ...defaultSettings, ...settings };
    
    // Apply saved settings IMMEDIATELY
    applySettings();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load models
    loadModels(true);
    
    // Update stats
    updateStats();
    
    // Check URL
    checkUrlHash();
    
    // Prevent scroll issues
    preventScrollJump();
    
    console.log('✅ RSM initialized');
}

// ===== APPLY SETTINGS =====
function applySettings() {
    console.log('🎨 Applying settings:', settings);
    
    // Apply theme
    if (settings.theme === 'light') {
        document.body.classList.add('light-mode');
        document.getElementById('theme-toggle').checked = true;
    }
    
    // Apply primary color - FIXED for light mode
    applyPrimaryColor(settings.primaryColor);
    
    // Apply font size
    applyFontSize(settings.fontSize);
    
    // Apply auto-size
    document.getElementById('auto-size').checked = settings.autoSize;
}

// ===== APPLY PRIMARY COLOR (FIXED) =====
function applyPrimaryColor(color) {
    console.log('🎨 Setting primary color:', color);
    
    // Save color
    settings.primaryColor = color;
    
    // Apply to CSS variables - WORKS IN BOTH MODES
    document.documentElement.style.setProperty('--primary-color', color);
    
    // Calculate hover color
    const hoverColor = darkenColor(color, 20);
    document.documentElement.style.setProperty('--primary-hover', hoverColor);
    
    // Update select
    document.getElementById('color-select').value = color;
    
    // Save settings
    saveSettings();
}

// ===== DARKEN COLOR =====
function darkenColor(color, percent) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const newR = Math.floor(r * (100 - percent) / 100);
    const newG = Math.floor(g * (100 - percent) / 100);
    const newB = Math.floor(b * (100 - percent) / 100);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// ===== APPLY FONT SIZE =====
function applyFontSize(size) {
    console.log('🔤 Setting font size:', size);
    
    // Validate size
    size = Math.max(12, Math.min(24, size));
    settings.fontSize = size;
    
    // Apply to CSS variable
    document.documentElement.style.setProperty('--font-size', `${size}px`);
    
    // Update display
    document.getElementById('font-size-value').textContent = `${size}px`;
    
    // Save settings
    saveSettings();
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Navigation
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Prevent scroll jump
            const scrollY = window.scrollY;
            
            // Update active
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show section
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update URL without scrolling
            window.location.hash = section;
            
            // Restore scroll position
            setTimeout(() => window.scrollTo(0, scrollY), 0);
        });
    });
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('light-mode');
            settings.theme = 'light';
        } else {
            document.body.classList.remove('light-mode');
            settings.theme = 'dark';
        }
        // Re-apply color for consistency
        applyPrimaryColor(settings.primaryColor);
        saveSettings();
    });
    
    // Color select
    document.getElementById('color-select').addEventListener('change', function() {
        applyPrimaryColor(this.value);
    });
    
    // Font size controls
    document.getElementById('font-decrease').addEventListener('click', function() {
        applyFontSize(settings.fontSize - 1);
    });
    
    document.getElementById('font-increase').addEventListener('click', function() {
        applyFontSize(settings.fontSize + 1);
    });
    
    // Reset button
    document.getElementById('reset-btn').addEventListener('click', function() {
        if (confirm('Reset all download counters?')) {
            downloads = {};
            localStorage.setItem('rsm_downloads', JSON.stringify(downloads));
            loadModels();
            updateStats();
            alert('Counters reset!');
        }
    });
    
    // Auto-size toggle
    document.getElementById('auto-size').addEventListener('change', function() {
        settings.autoSize = this.checked;
        saveSettings();
        if (this.checked) {
            loadModels(true);
        }
    });
    
    // Hash change listener
    window.addEventListener('hashchange', checkUrlHash);
    
    // Prevent scroll on hash change
    window.addEventListener('hashchange', function() {
        setTimeout(() => window.scrollTo(0, 0), 1);
    });
}

// ===== PREVENT SCROLL JUMP =====
function preventScrollJump() {
    // Remove focus from any element that might cause scroll
    if (document.activeElement) {
        document.activeElement.blur();
    }
    
    // Ensure we start at top
    window.scrollTo(0, 0);
    
    // Listen for any hash changes
    if (window.location.hash) {
        setTimeout(() => window.scrollTo(0, 0), 100);
    }
}

// ===== CHECK URL HASH =====
function checkUrlHash() {
    const hash = window.location.hash.substring(1);
    
    if (hash && ['home', 'models', 'configs'].includes(hash)) {
        // Update menu
        document.querySelectorAll('.menu-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === hash) {
                link.classList.add('active');
            }
        });
        
        // Show section without scroll
        const scrollY = window.scrollY;
        showSection(hash);
        setTimeout(() => window.scrollTo(0, scrollY), 0);
    }
}

// ===== SHOW SECTION =====
function showSection(section) {
    console.log('📄 Showing section:', section);
    
    // Hide all
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Show selected
    const target = document.getElementById(section);
    if (target) {
        target.classList.add('active');
        currentSection = section;
        
        // Update title
        document.title = `RSM - ${section.charAt(0).toUpperCase() + section.slice(1)}`;
        
        // Load models if needed
        if (section === 'models') {
            setTimeout(() => loadModels(), 10);
        }
        
        // Update stats if needed
        if (section === 'home') {
            updateStats();
        }
    }
}

// ===== LOAD MODELS =====
async function loadModels(detectSize = false) {
    const container = document.getElementById('models-container');
    
    if (!container) {
        console.error('❌ No container found!');
        return;
    }
    
    console.log('📦 Loading models...');
    
    // Clear container
    container.innerHTML = '';
    
    // Check if we have models
    if (models.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">No models available.</p>';
        return;
    }
    
    // Create model cards
    for (let model of models) {
        // Detect size if needed
        if (detectSize && settings.autoSize !== false) {
            try {
                const size = await getFileSize(`worlds/${model.filename}`);
                model.size = size;
            } catch (error) {
                model.size = 'Unknown';
            }
        }
        
        // Create card
        const card = document.createElement('div');
        card.className = 'model-card';
        
        const downloadCount = downloads[model.id] || 0;
        
        card.innerHTML = `
            <h3>${model.name}</h3>
            <p>${model.description}</p>
            <div class="model-info">
                <span><strong>Size:</strong> ${model.size || 'Loading...'}</span>
                <span><strong>Downloads:</strong> ${downloadCount}</span>
                <span><strong>Format:</strong> .rbxl</span>
            </div>
            <a href="worlds/${model.filename}" class="download-btn" download 
               onclick="registerDownload(${model.id}); return true;">
                Download
            </a>
        `;
        
        container.appendChild(card);
    }
    
    console.log(`✅ Loaded ${models.length} models`);
}

// ===== GET FILE SIZE =====
async function getFileSize(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
            const size = response.headers.get('content-length');
            if (size) {
                return formatSize(parseInt(size));
            }
        }
        return 'Unknown';
    } catch (error) {
        return 'Unknown';
    }
}

// ===== FORMAT SIZE =====
function formatSize(bytes) {
    if (isNaN(bytes)) return 'Unknown';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// ===== REGISTER DOWNLOAD =====
function registerDownload(modelId) {
    console.log('⬇️ Downloading model:', modelId);
    
    // Count download
    if (!downloads[modelId]) downloads[modelId] = 0;
    downloads[modelId]++;
    
    // Save
    localStorage.setItem('rsm_downloads', JSON.stringify(downloads));
    
    // Update stats
    updateStats();
    
    // Update model display
    if (currentSection === 'models') {
        setTimeout(() => loadModels(), 100);
    }
}

// ===== UPDATE STATS =====
function updateStats() {
    // Total models
    document.getElementById('total-models').textContent = models.length;
    
    // Calculate total size
    let totalBytes = 0;
    models.forEach(model => {
        if (model.size && model.size !== 'Unknown') {
            const match = model.size.match(/(\d+\.?\d*)\s*(B|KB|MB|GB)/);
            if (match) {
                let bytes = parseFloat(match[1]);
                const unit = match[2];
                
                if (unit === 'MB') bytes *= 1024 * 1024;
                else if (unit === 'KB') bytes *= 1024;
                else if (unit === 'GB') bytes *= 1024 * 1024 * 1024;
                
                totalBytes += bytes;
            }
        }
    });
    
    document.getElementById('total-size').textContent = formatSize(totalBytes);
}

// ===== SAVE SETTINGS =====
function saveSettings() {
    localStorage.setItem('rsm_settings', JSON.stringify(settings));
}

// ===== EXPORT FUNCTIONS =====
window.registerDownload = registerDownload;

// ===== START APP =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
