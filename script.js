// ===== MODELS DATA =====
const models = [
    {
        id: 1,
        name: "Custom Chat System",
        filename: "CustomChatSystem.rbxl",
        description: "Custom chat system for Roblox with advanced commands and configuration.",
        size: null // Will be detected automatically
    }
    // Add more models here:
    // {
    //     id: 2,
    //     name: "Another Model",
    //     filename: "another_model.rbxl",
    //     description: "Description here",
    //     size: null
    // }
];

// ===== TRANSLATIONS =====
const translations = {
    en: {
        home: "Home",
        models: "Models",
        configs: "Configs",
        welcome: "Welcome to RSM",
        welcomeText: "Portal to download models created in Roblox Studio.",
        selectModels: "Select 'Models' in the sidebar to view available models.",
        selectConfigs: "Select 'Configs' to customize your experience.",
        availableModels: "Available Models",
        clickDownload: "Click 'Download' to get the .rbxl file.",
        configuration: "Configuration",
        customize: "Customize your experience.",
        appearance: "Appearance",
        darkLight: "Dark/Light Mode",
        primaryColor: "Primary Color",
        language: "Language",
        interfaceLanguage: "Interface Language",
        data: "Data",
        resetCounters: "Reset Download Counters",
        autoDetect: "Auto-detect file sizes",
        download: "Download",
        downloads: "Downloads",
        format: "Format",
        size: "Size",
        totalModels: "Models",
        totalSize: "Total Size",
        reset: "Reset",
        noModels: "No models available.",
        detecting: "Detecting...",
        green: "Green",
        blue: "Blue",
        purple: "Purple",
        orange: "Orange",
        red: "Red"
    },
    es: {
        home: "Inicio",
        models: "Modelos",
        configs: "Configs",
        welcome: "Bienvenido a RSM",
        welcomeText: "Portal para descargar modelos creados en Roblox Studio.",
        selectModels: "Selecciona 'Modelos' en la barra lateral para ver los modelos disponibles.",
        selectConfigs: "Selecciona 'Configs' para personalizar tu experiencia.",
        availableModels: "Modelos Disponibles",
        clickDownload: "Haz clic en 'Descargar' para obtener el archivo .rbxl.",
        configuration: "Configuración",
        customize: "Personaliza tu experiencia.",
        appearance: "Apariencia",
        darkLight: "Modo Oscuro/Claro",
        primaryColor: "Color Principal",
        language: "Idioma",
        interfaceLanguage: "Idioma de Interfaz",
        data: "Datos",
        resetCounters: "Reiniciar Contadores de Descarga",
        autoDetect: "Detección automática de tamaños",
        download: "Descargar",
        downloads: "Descargas",
        format: "Formato",
        size: "Tamaño",
        totalModels: "Modelos",
        totalSize: "Tamaño Total",
        reset: "Reiniciar",
        noModels: "No hay modelos disponibles.",
        detecting: "Detectando...",
        green: "Verde",
        blue: "Azul",
        purple: "Púrpura",
        orange: "Naranja",
        red: "Rojo"
    },
    pt: {
        home: "Início",
        models: "Modelos",
        configs: "Configs",
        welcome: "Bem-vindo ao RSM",
        welcomeText: "Portal para baixar modelos criados no Roblox Studio.",
        selectModels: "Selecione 'Modelos' na barra lateral para ver os modelos disponíveis.",
        selectConfigs: "Selecione 'Configs' para personalizar sua experiência.",
        availableModels: "Modelos Disponíveis",
        clickDownload: "Clique em 'Baixar' para obter o arquivo .rbxl.",
        configuration: "Configuração",
        customize: "Personalize sua experiência.",
        appearance: "Aparência",
        darkLight: "Modo Escuro/Claro",
        primaryColor: "Cor Principal",
        language: "Idioma",
        interfaceLanguage: "Idioma da Interface",
        data: "Dados",
        resetCounters: "Redefinir Contadores de Download",
        autoDetect: "Detecção automática de tamanhos",
        download: "Baixar",
        downloads: "Downloads",
        format: "Formato",
        size: "Tamanho",
        totalModels: "Modelos",
        totalSize: "Tamanho Total",
        reset: "Redefinir",
        noModels: "Nenhum modelo disponível.",
        detecting: "Detectando...",
        green: "Verde",
        blue: "Azul",
        purple: "Roxo",
        orange: "Laranja",
        red: "Vermelho"
    }
};

// ===== APP STATE =====
let currentSection = 'home';
let downloads = JSON.parse(localStorage.getItem('rsm_downloads') || '{}');
let settings = JSON.parse(localStorage.getItem('rsm_settings') || '{}');

// Default settings
const defaultSettings = {
    theme: 'dark',
    primaryColor: '#4CAF50',
    language: 'en',
    autoSize: true
};

// ===== INITIALIZE APP =====
function initApp() {
    // Merge default settings with saved settings
    settings = { ...defaultSettings, ...settings };
    
    // Apply saved settings to UI
    applySettings();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load models with auto size detection
    loadModels(true);
    
    // Update statistics
    updateStats();
    
    // Check URL hash for initial section
    checkUrlHash();
    
    console.log('RSM initialized successfully');
}

// ===== APPLY SETTINGS TO UI =====
function applySettings() {
    // Apply theme
    if (settings.theme === 'light') {
        document.body.classList.add('light-mode');
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) themeToggle.checked = true;
    }
    
    // Apply primary color - CORREGIDO: funciona en ambos modos
    if (settings.primaryColor) {
        updatePrimaryColor(settings.primaryColor);
        const colorSelect = document.getElementById('color-select');
        if (colorSelect) colorSelect.value = settings.primaryColor;
    }
    
    // Apply language
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = settings.language;
        // Actualizar textos inmediatamente
        updateLanguage(settings.language);
    }
    
    // Apply auto-size setting
    const autoSizeToggle = document.getElementById('auto-size');
    if (autoSizeToggle) autoSizeToggle.checked = settings.autoSize;
}

// ===== UPDATE PRIMARY COLOR (CORREGIDO) =====
function updatePrimaryColor(color) {
    // Guardar el color
    settings.primaryColor = color;
    
    // Aplicar a CSS variables - FUNCIONA EN AMBOS MODOS
    document.documentElement.style.setProperty('--primary-color', color);
    
    // Calcular color hover (más oscuro)
    const hoverColor = darkenColor(color, 20);
    document.documentElement.style.setProperty('--primary-hover', hoverColor);
    
    // Guardar configuración
    saveSettings();
}

// ===== DARKEN COLOR HELPER =====
function darkenColor(color, percent) {
    // Convierte color hex a RGB
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);
    
    // Oscurece cada componente
    r = Math.floor(r * (100 - percent) / 100);
    g = Math.floor(g * (100 - percent) / 100);
    b = Math.floor(b * (100 - percent) / 100);
    
    // Convierte de vuelta a hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ===== UPDATE LANGUAGE =====
function updateLanguage(lang) {
    if (!translations[lang]) {
        console.error(`Language ${lang} not supported`);
        return;
    }
    
    settings.language = lang;
    const t = translations[lang];
    
    // Actualizar textos de navegación
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            element.textContent = t[key];
        }
    });
    
    // Actualizar placeholders y otros atributos
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            element.placeholder = t[key];
        }
    });
    
    // Actualizar opciones de color en el select
    const colorSelect = document.getElementById('color-select');
    if (colorSelect) {
        const options = colorSelect.querySelectorAll('option');
        options[0].textContent = t.green || 'Green';
        options[1].textContent = t.blue || 'Blue';
        options[2].textContent = t.purple || 'Purple';
        options[3].textContent = t.orange || 'Orange';
        options[4].textContent = t.red || 'Red';
    }
    
    // Actualizar botón de reset
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.textContent = t.reset || 'Reset';
    }
    
    // Actualizar botones de descarga en modelos
    document.querySelectorAll('.download-btn').forEach(btn => {
        if (!btn.hasAttribute('data-i18n-ignore')) {
            btn.textContent = t.download || 'Download';
        }
    });
    
    // Guardar configuración
    saveSettings();
    
    // Recargar modelos para actualizar textos
    if (currentSection === 'models') {
        loadModels();
    }
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    // Navigation menu
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active link
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Get and show section
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update URL
            window.location.hash = section;
        });
    });
    
    // Theme toggle - CORREGIDO
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('light-mode');
                settings.theme = 'light';
            } else {
                document.body.classList.remove('light-mode');
                settings.theme = 'dark';
            }
            
            // Re-aplicar el color principal (importante para modo claro)
            if (settings.primaryColor) {
                updatePrimaryColor(settings.primaryColor);
            }
            
            saveSettings();
        });
    }
    
    // Color select - CORREGIDO
    const colorSelect = document.getElementById('color-select');
    if (colorSelect) {
        colorSelect.addEventListener('change', function() {
            updatePrimaryColor(this.value);
        });
    }
    
    // Language select - CORREGIDO
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            updateLanguage(this.value);
        });
    }
    
    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            const t = translations[settings.language] || translations.en;
            if (confirm(t.resetCounters ? t.resetCounters + '?' : 'Reset all download counters?')) {
                downloads = {};
                localStorage.setItem('rsm_downloads', JSON.stringify(downloads));
                loadModels();
                updateStats();
                alert(t.resetCounters ? '¡Contadores reiniciados!' : 'Counters reset!');
            }
        });
    }
    
    // Auto size toggle
    const autoSizeToggle = document.getElementById('auto-size');
    if (autoSizeToggle) {
        autoSizeToggle.addEventListener('change', function() {
            settings.autoSize = this.checked;
            saveSettings();
            if (this.checked) {
                loadModels(true);
            }
        });
    }
    
    // Listen for hash changes (back/forward buttons)
    window.addEventListener('hashchange', checkUrlHash);
}

// ===== CHECK URL HASH =====
function checkUrlHash() {
    const hash = window.location.hash.substring(1);
    const validSections = ['home', 'models', 'configs'];
    
    if (hash && validSections.includes(hash)) {
        // Update menu
        document.querySelectorAll('.menu-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === hash) {
                link.classList.add('active');
            }
        });
        
        // Show section
        showSection(hash);
    } else if (!hash) {
        // Default to home
        showSection('home');
    }
}

// ===== SHOW SECTION =====
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = section;
        
        // Update page title
        const t = translations[settings.language] || translations.en;
        document.title = `RSM - ${t[section] || capitalize(section)}`;
        
        // Load models if needed
        if (section === 'models') {
            loadModels();
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
        console.error('Models container not found');
        return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Get current translations
    const t = translations[settings.language] || translations.en;
    
    // Show message if no models
    if (models.length === 0) {
        container.innerHTML = `<p style="color: var(--text-secondary); padding: 20px; text-align: center;">${t.noModels}</p>`;
        return;
    }
    
    // Load each model
    const modelPromises = models.map(async (model) => {
        // Detect file size if enabled
        if (detectSize && settings.autoSize !== false) {
            try {
                const size = await getFileSize(`worlds/${model.filename}`);
                model.size = size;
            } catch (error) {
                model.size = t.detecting || 'Detecting...';
                console.warn(`Could not detect size for ${model.filename}:`, error);
            }
        }
        
        // Create model card
        return createModelCard(model, t);
    });
    
    // Wait for all models to load
    const modelCards = await Promise.all(modelPromises);
    
    // Add cards to container
    modelCards.forEach(card => {
        if (card) container.appendChild(card);
    });
    
    console.log(`Loaded ${models.length} models`);
}

// ===== CREATE MODEL CARD =====
function createModelCard(model, t) {
    const card = document.createElement('div');
    card.className = 'model-card';
    
    const downloadCount = downloads[model.id] || 0;
    const sizeText = model.size || (t.detecting || 'Detecting...');
    
    card.innerHTML = `
        <h3>${model.name}</h3>
        <p>${model.description}</p>
        <div class="model-info">
            <span><strong>${t.size || 'Size'}:</strong> ${sizeText}</span>
            <span><strong>${t.downloads || 'Downloads'}:</strong> ${downloadCount}</span>
            <span><strong>${t.format || 'Format'}:</strong> .rbxl</span>
        </div>
        <a href="worlds/${model.filename}" class="download-btn" download 
           onclick="registerDownload(${model.id}); return true;"
           data-i18n-ignore="true">
            ${t.download || 'Download'}
        </a>
    `;
    
    return card;
}

// ===== GET FILE SIZE =====
async function getFileSize(url) {
    try {
        // Try to get file size via HEAD request
        const response = await fetch(url, { method: 'HEAD' });
        
        if (response.ok) {
            const sizeBytes = response.headers.get('content-length');
            
            if (sizeBytes) {
                return formatSize(parseInt(sizeBytes));
            }
        }
        
        // Fallback: try to get actual file
        const fallbackResponse = await fetch(url);
        if (fallbackResponse.ok) {
            const blob = await fallbackResponse.blob();
            return formatSize(blob.size);
        }
        
        return 'Unknown';
    } catch (error) {
        console.error('Error getting file size for', url, error);
        return 'Unknown';
    }
}

// ===== FORMAT SIZE =====
function formatSize(bytes) {
    if (isNaN(bytes) || bytes === 0) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    if (i === 0) return `${bytes} ${units[i]}`;
    
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

// ===== REGISTER DOWNLOAD =====
function registerDownload(modelId) {
    // Increment counter
    if (!downloads[modelId]) downloads[modelId] = 0;
    downloads[modelId]++;
    
    // Save to localStorage
    localStorage.setItem('rsm_downloads', JSON.stringify(downloads));
    
    // Update stats
    updateStats();
    
    // Recargar modelos para actualizar contador
    setTimeout(() => loadModels(), 100);
    
    console.log(`Download registered for model ${modelId}. Total: ${downloads[modelId]}`);
}

// ===== UPDATE STATISTICS =====
function updateStats() {
    const t = translations[settings.language] || translations.en;
    
    // Total models
    const totalModelsEl = document.getElementById('total-models');
    if (totalModelsEl) {
        totalModelsEl.textContent = models.length;
    }
    
    // Total size label
    const totalSizeLabel = document.querySelector('.stat-label');
    if (totalSizeLabel && !totalSizeLabel.hasAttribute('data-i18n')) {
        totalSizeLabel.textContent = t.totalSize || 'Total Size';
    }
    
    // Calculate total size
    calculateTotalSize().then(totalSize => {
        const totalSizeEl = document.getElementById('total-size');
        if (totalSizeEl) {
            totalSizeEl.textContent = totalSize;
        }
    });
}

// ===== CALCULATE TOTAL SIZE =====
async function calculateTotalSize() {
    let totalBytes = 0;
    
    for (const model of models) {
        if (model.size && model.size !== 'Unknown') {
            // Parse the size string (e.g., "4.2 MB")
            const match = model.size.match(/(\d+\.?\d*)\s*(B|KB|MB|GB)/i);
            
            if (match) {
                let bytes = parseFloat(match[1]);
                const unit = match[2].toUpperCase();
                
                // Convert to bytes
                switch(unit) {
                    case 'GB': bytes *= 1024 * 1024 * 1024; break;
                    case 'MB': bytes *= 1024 * 1024; break;
                    case 'KB': bytes *= 1024; break;
                    // 'B' already in bytes
                }
                
                totalBytes += bytes;
            }
        }
    }
    
    return formatSize(totalBytes);
}

// ===== SAVE SETTINGS =====
function saveSettings() {
    localStorage.setItem('rsm_settings', JSON.stringify(settings));
}

// ===== HELPER FUNCTIONS =====
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ===== PUBLIC API =====
window.RSM = {
    registerDownload,
    loadModels,
    updateStats,
    showSection,
    updateLanguage,
    updatePrimaryColor
};

// ===== INITIALIZE WHEN DOCUMENT IS READY =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
