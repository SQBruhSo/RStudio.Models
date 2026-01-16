// Datos del archivo - CAMBIA EL TAMAÑO AL REAL
const archivo = {
    nombre: "CustomChatSystem.rbxl",
    tamano: "5.7 MB", // <-- CAMBIA ESTO AL TAMAÑO REAL
    descargas: localStorage.getItem('descargas') ? parseInt(localStorage.getItem('descargas')) : 0
};

// Cuando cargue la página
window.onload = function() {
    // Mostrar datos
    document.getElementById('tamano-real').textContent = archivo.tamano;
    document.getElementById('contador').textContent = archivo.descargas;
    
    // Configurar menú
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        item.onclick = function(e) {
            e.preventDefault();
            items.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const texto = this.textContent.toLowerCase();
            if (texto.includes('inicio')) mostrarSeccion('inicio');
            else if (texto.includes('descargar')) mostrarSeccion('descargar');
            else if (texto.includes('info')) mostrarSeccion('info');
        };
    });
};

// Mostrar sección
function mostrarSeccion(id) {
    document.querySelectorAll('.section').forEach(s => {
        s.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
}

// Contar descarga
function contarDescarga() {
    archivo.descargas++;
    document.getElementById('contador').textContent = archivo.descargas;
    localStorage.setItem('descargas', archivo.descargas);
}
