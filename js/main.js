// Función para cambiar de pestaña
function switchTab(tabName, element) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Desactivar todos los botones de navegación
    document.querySelectorAll('.nav-tab').forEach(nav => {
        nav.classList.remove('active');
    });
    
    // Activar la pestaña seleccionada
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Activar el botón de navegación correspondiente
    element.classList.add('active');
    
    // Cargar datos según la pestaña
    if (tabName === 'dashboard') {
        loadDashboard();
    } else if (tabName === 'inventory') {
        loadInventory();
    }
}

// Función para calcular la próxima inspección
function calculateNextInspection(date) {
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth() + CONFIG.INSPECCION.MESES_PROXIMA);
    return nextDate.toISOString().split('T')[0];
}

// Función para formatear fecha
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Función para mostrar mensaje de éxito
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = '✓ ' + message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => document.body.removeChild(messageDiv), CONFIG.TIMEOUTS.ANIMACION);
    }, CONFIG.TIMEOUTS.MENSAJE_EXITO);
}

// Función para exportar a CSV
function exportToCSV() {
    if (inventory.length === 0) {
        alert(CONFIG.MENSAJES.SIN_DATOS_CSV);
        return;
    }
    
    // Preparar los headers
    const headers = [
        'Tipo de Grúa',
        'Accesorio',
        'Código',
        'Capacidad (Ton)',
        'Marca',
        'Cantidad',
        'Estado',
        'Fecha de Inspección',
        'Próxima Inspección',
        'N° Capas',
        'Longitud (m)',
        'Diámetro (pulg)',
        'Observaciones',
        'URL Foto'
    ];
    
    // Convertir datos a CSV
    const csvContent = [
        headers.join(','),
        ...inventory.map(item => [
            item.tipogrua || item.tipo_grua,
            item.accesorio,
            item.codigo,
            item.capacidadton || item.capacidad,
            item.marca,
            item.cantidad,
            item.estado,
            item.fechainspeccion || item.fecha_inspeccion,
            item.proximainspeccion || item.proxima_inspeccion,
            item.numerocapas || item.numero_capas || '',
            item.longitud || '',
            item.diametro || '',
            `"${item.observaciones || ''}"`,
            item.urlfoto || item.url_foto || ''
        ].join(','))
    ].join('\n');
    
    // Crear el archivo y descargarlo
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario_izaje_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Inicializar al cargar la página
window.onload = function() {
    // Cargar dashboard por defecto
    loadDashboard();
    
    // Configurar event listeners
    setupEventListeners();
};

// Configurar todos los event listeners
function setupEventListeners() {
    // Actualizar fecha de próxima inspección automáticamente
    document.getElementById('fechaInspeccion').addEventListener('change', function() {
        const nextDate = calculateNextInspection(this.value);
        document.getElementById('proximaInspeccion').value = nextDate;
    });
    
    // Mostrar/ocultar campos condicionales según el accesorio
    document.getElementById('accesorio').addEventListener('change', handleAccesorioChange);
    
    // Manejar la selección de foto
    document.getElementById('photoInput').addEventListener('change', handlePhotoSelection);
    
    // Manejar el envío del formulario
    document.getElementById('inventoryForm').addEventListener('submit', handleFormSubmit);
}
