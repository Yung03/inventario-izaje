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
        ? `
