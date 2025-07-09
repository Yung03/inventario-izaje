// Función para cargar el inventario
async function loadInventory() {
    const loadingElement = document.getElementById('inventory-loading');
    const tableSection = document.getElementById('inventoryTableSection');
    const emptyState = document.getElementById('emptyState');
    
    // Mostrar loading
    loadingElement.classList.add('active');
    tableSection.style.display = 'none';
    emptyState.style.display = 'none';
    
    try {
        // Llamar a la API para obtener el inventario
        const response = await fetch(CONFIG.API_URL);
        const data = await response.json();
        
        // Verificar si hay datos
        if (data && !data.error && data.length > 0) {
            inventory = data;
            updateInventoryTable();
            tableSection.style.display = 'block';
        } else {
            emptyState.style.display = 'block';
        }
        
        loadingElement.classList.remove('active');
        
    } catch (error) {
        console.error('Error cargando inventario:', error);
        loadingElement.classList.remove('active');
        emptyState.style.display = 'block';
    }
}

// Función para actualizar la tabla de inventario
function updateInventoryTable() {
    const tbody = document.getElementById('inventoryBody');
    const emptyState = document.getElementById('emptyState');
    const tableSection = document.getElementById('inventoryTableSection');
    
    // Verificar si hay datos
    if (inventory.length === 0) {
        emptyState.style.display = 'block';
        tableSection.style.display = 'none';
        return;
    }
    
    // Ocultar estado vacío y mostrar tabla
    emptyState.style.display = 'none';
    tableSection.style.display = 'block';
    
    // Generar filas de la tabla
    tbody.innerHTML = inventory.map((item, index) => {
        return createInventoryRow(item, index);
    }).join('');
}

// Función para crear una fila de inventario
function createInventoryRow(item, index) {
    // Preparar detalles específicos según el tipo de accesorio
    let detalles = '-';
    if (item.accesorio === 'Eslinga') {
        const capas = item.numerocapas || item.numero_capas || '-';
        const longitud = item.longitud || '-';
        detalles = `Capas: ${capas}, Long: ${longitud}m`;
    } else if (item.accesorio === 'Grillete' || item.accesorio === 'Cadena') {
        const diametro = item.diametropulg || item.diametro || '-';
        detalles = `Diám: ${diametro}"`;
    }
    
    // Preparar link de foto
    const fotoUrl = item.urlfoto || item.url_foto;
    const fotoLink = fotoUrl 
        ? `<a href="${fotoUrl}" target="_blank" style="color: #2a5298;">Ver foto</a>`
        : '-';
    
    // Determinar clase CSS para el estado
    const estadoClass = (item.estado || '').toLowerCase();
    
    // Formatear fechas
    const fechaInspeccion = formatDate(item.fechainspeccion || item.fecha_inspeccion);
    const proximaInspeccion = formatDate(item.proximainspeccion || item.proxima_inspeccion);
    
    // Generar HTML de la fila
    return `
        <tr>
            <td>${item.tipogrua || item.tipo_grua || '-'}</td>
            <td>${item.accesorio || '-'}</td>
            <td>${item.codigo || '-'}</td>
            <td>${item.capacidadton || item.capacidad || '-'}</td>
            <td>${item.marca || '-'}</td>
            <td>${item.cantidad || '-'}</td>
            <td>
                <span class="status-badge status-${estadoClass}">
                    ${item.estado || '-'}
                </span>
            </td>
            <td>${fechaInspeccion}</td>
            <td>${proximaInspeccion}</td>
            <td>${detalles}</td>
            <td>${item.observaciones || '-'}</td>
            <td>${fotoLink}</td>
        </tr>
    `;
}

// Función para filtrar inventario (futura implementación)
function filterInventory(filterCriteria) {
    // Esta función se puede expandir para agregar filtros
    // Por ahora retorna todo el inventario
    return inventory;
}

// Función para ordenar inventario (futura implementación)
function sortInventory(sortBy, order = 'asc') {
    // Esta función se puede expandir para agregar ordenamiento
    // Por ahora retorna el inventario sin ordenar
    return inventory;
}
