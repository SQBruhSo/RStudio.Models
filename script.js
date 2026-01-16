// TUS MUNDOS - MODIFICA ESTO
const mundos = [
    {
        id: 1,
        titulo: "Mi Mundo 1",
        archivo: "mundo1.rbxl",
        descripcion: "Descripción de mi primer mundo. Explícalo aquí.",
        tamano: "10 MB",
        fecha: "2024-01-01",
        descargas: 0
    },
    {
        id: 2,
        titulo: "Mi Mundo 2",
        archivo: "mundo2.rbxl",
        descripcion: "Descripción del segundo mundo. Cuenta sus características.",
        tamano: "15 MB",
        fecha: "2024-01-02",
        descargas: 0
    }
    // Añade más mundos aquí
];

// Cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    // Navegación
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Quitar active de todos
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Añadir active al clickeado
            this.classList.add('active');
            
            // Mostrar sección
            const seccionId = this.getAttribute('href').substring(1);
            mostrarSeccion(seccionId);
        });
    });
    
    // Cargar mundos
    cargarMundos();
    
    // Modal
    const modal = document.getElementById('modal');
    const cerrarModal = document.getElementById('cerrar-modal');
    
    cerrarModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Mostrar sección
function mostrarSeccion(id) {
    // Ocultar todas
    document.querySelectorAll('.section').forEach(s => {
        s.classList.remove('active');
    });
    
    // Mostrar la seleccionada
    document.getElementById(id).classList.add('active');
}

// Cargar los mundos
function cargarMundos() {
    const container = document.getElementById('mundos-container');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    mundos.forEach(mundo => {
        const card = document.createElement('div');
        card.className = 'mundo-card';
        card.onclick = () => mostrarModal(mundo.id);
        
        card.innerHTML = `
            <h3>${mundo.titulo}</h3>
            <p>${mundo.descripcion.substring(0, 80)}...</p>
            <div class="mundo-info">
                <span>${mundo.tamano}</span>
                <span>${mundo.fecha}</span>
            </div>
            <a href="worlds/${mundo.archivo}" class="btn-descargar" download 
               onclick="event.stopPropagation(); descargarMundo(${mundo.id})">
                Descargar
            </a>
        `;
        
        container.appendChild(card);
    });
}

// Mostrar modal con detalles
function mostrarModal(id) {
    const mundo = mundos.find(m => m.id === id);
    
    if (!mundo) return;
    
    document.getElementById('modal-titulo').textContent = mundo.titulo;
    document.getElementById('modal-descripcion').textContent = mundo.descripcion;
    document.getElementById('modal-tamano').textContent = `Tamaño: ${mundo.tamano}`;
    document.getElementById('modal-fecha').textContent = `Fecha: ${mundo.fecha}`;
    
    const linkDescarga = document.getElementById('modal-descargar');
    linkDescarga.href = `worlds/${mundo.archivo}`;
    linkDescarga.download = mundo.archivo;
    
    document.getElementById('modal').style.display = 'flex';
}

// Función para descargar
function descargarMundo(id) {
    const mundo = mundos.find(m => m.id === id);
    
    if (mundo) {
        mundo.descargas++;
        
        // Mostrar mensaje
        alert(`Descargando: ${mundo.titulo}`);
        
        // En una web real, aquí iría el tracking de descargas
        console.log(`Descargado: ${mundo.titulo}, Total: ${mundo.descargas}`);
    }
}