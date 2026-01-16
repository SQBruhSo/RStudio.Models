// Lista de mundos - MODIFICA ESTO
const mundos = [
    {
        id: 1,
        nombre: "Custom Chat System",
        archivo: "CustomChatSystem.rbxl",
        descripcion: "Sistema de chat personalizado para Roblox con comandos y configuración avanzada.",
        tamano: "138 KB" // CAMBIA AL TAMAÑO REAL
    },
    // Añade más mundos si quieres
];

// Contador de descargas
let descargas = localStorage.getItem('descargas') ? JSON.parse(localStorage.getItem('descargas')) : {};

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    // Configurar navegación
    configurarNavegacion();
    
    // Cargar mundos
    cargarMundos();
    
    // Mostrar estadísticas
    actualizarEstadisticas();
});

// Configurar navegación
function configurarNavegacion() {
    const links = document.querySelectorAll('.menu a');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Quitar activo de todos
            links.forEach(l => l.classList.remove('active'));
            
            // Marcar este como activo
            this.classList.add('active');
            
            // Obtener sección
            const seccionId = this.getAttribute('href').substring(1);
            
            // Mostrar sección
            mostrarSeccion(seccionId);
        });
    });
}

// Mostrar sección
function mostrarSeccion(id) {
    // Ocultar todas
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Mostrar seleccionada
    const seccion = document.getElementById(id);
    if (seccion) {
        seccion.classList.add('active');
    }
}

// Cargar mundos
function cargarMundos() {
    const contenedor = document.getElementById('lista-mundos');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    mundos.forEach(mundo => {
        const count = descargas[mundo.id] || 0;
        
        const div = document.createElement('div');
        div.className = 'mundo';
        div.innerHTML = `
            <h3>${mundo.nombre}</h3>
            <p>${mundo.descripcion}</p>
            <p><strong>Tamaño:</strong> ${mundo.tamano}</p>
            <p><strong>Descargas:</strong> ${count}</p>
            <a href="worlds/${mundo.archivo}" class="btn" download 
               onclick="registrarDescarga(${mundo.id})">
                Descargar
            </a>
        `;
        
        contenedor.appendChild(div);
    });
}

// Registrar descarga
function registrarDescarga(id) {
    // Incrementar contador
    if (!descargas[id]) descargas[id] = 0;
    descargas[id]++;
    
    // Guardar
    localStorage.setItem('descargas', JSON.stringify(descargas));
    
    // Actualizar
    cargarMundos();
    actualizarEstadisticas();
    
    // Mensaje
    alert('Descarga iniciada. Abre el archivo con Roblox Studio.');
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    // Total mundos
    document.getElementById('total-mundos').textContent = mundos.length;
    
    // Total descargas
    let total = 0;
    for (let id in descargas) {
        total += descargas[id];
    }
    document.getElementById('total-descargas').textContent = total;
}
