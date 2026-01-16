// Lista de mundos - AÑADE MÁS SI TIENES
const mundos = [
    {
        id: 1,
        nombre: "Custom Chat System",
        archivo: "CustomChatSystem.rbxl",
        descripcion: "Sistema de chat personalizado para Roblox.",
        tamano: "5.7 MB" // Cambia al tamaño real
    }
    // Puedes añadir más mundos aquí:
    // {
    //     id: 2,
    //     nombre: "Otro Mundo",
    //     archivo: "otro_mundo.rbxl",
    //     descripcion: "Descripción del mundo.",
    //     tamano: "10 MB"
    // }
];

// Contador de descargas
let descargas = localStorage.getItem('descargas') ? JSON.parse(localStorage.getItem('descargas')) : {};

// Cuando cargue la página
window.onload = function() {
    cargarMundos();
    
    // Configurar menú
    const links = document.querySelectorAll('.menu a');
    links.forEach(link => {
        link.onclick = function(e) {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const id = this.textContent.toLowerCase();
            if (id.includes('inicio')) mostrarSeccion('inicio');
            else if (id.includes('descargas')) mostrarSeccion('descargas');
            else if (id.includes('config')) mostrarSeccion('config');
        };
    });
};

// Mostrar sección
function mostrarSeccion(id) {
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
}

// Cargar y mostrar mundos
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
    
    // Guardar en localStorage
    localStorage.setItem('descargas', JSON.stringify(descargas));
    
    // Actualizar vista
    cargarMundos();
}
