// Función para cargar el dashboard
async function loadDashboard() {
    const loadingElement = document.getElementById('dashboard-loading');
    const contentElement = document.getElementById('dashboard-content');
    
    // Mostrar loading
    loadingElement.classList.add('active');
    contentElement.style.display = 'none';
    
    try {
        // Llamar a la API para obtener datos del dashboard
        const response = await fetch(CONFIG.API_URL + '?action=dashboard');
        const data = await response.json();
        
        // Actualizar el dashboard con los datos recibidos
        updateDashboardUI(data);
        
        // Ocultar loading y mostrar contenido
        loadingElement.classList.remove('active');
        contentElement.style.display = 'block';
        
    } catch (error) {
        console.error('Error cargando dashboard:', error);
        
        // Mostrar dashboard vacío en caso de error
        updateDashboardUI({
            total: 0,
            operativos: 0,
            inoperativos: 0,
            eslingas: 0,
            grilletes: 0,
            cadenas: 0,
            alertasPorGrua: {}
        });
        
        loadingElement.classList.remove('active');
        contentElement.style.display = 'block';
    }
}

// Función para actualizar la UI del dashboard
function updateDashboardUI(data) {
    // Actualizar estadísticas generales
    document.getElementById('stat-total').textContent = data.total || 0;
    document.getElementById('stat-operativos').textContent = data.operativos || 0;
    document.getElementById('stat-inoperativos').textContent = data.inoperativos || 0;
    
    // Actualizar barra de progreso
    const porcentajeOperativo = data.total > 0 
        ? (data.operativos / data.total * 100).toFixed(1) 
        : 0;
    
    const progressBar = document.getElementById('progress-operativo');
    progressBar.style.width = porcentajeOperativo + '%';
    progressBar.textContent = porcentajeOperativo + '% Operativo';
    
    // Actualizar distribución por tipo
    document.getElementById('stat-eslingas').textContent = data.eslingas || 0;
    document.getElementById('stat-grilletes').textContent = data.grilletes || 0;
    document.getElementById('stat-cadenas').textContent = data.cadenas || 0;
    
    // Actualizar alertas por grúa
    updateAlertasPorGrua(data.alertasPorGrua || {});
}

// Función para actualizar las alertas por grúa
function updateAlertasPorGrua(alertasPorGrua) {
    const alertasContainer = document.getElementById('alertas-container');
    alertasContainer.innerHTML = '';
    
    // Si no hay datos, mostrar mensaje
    if (Object.keys(alertasPorGrua).length === 0) {
        alertasContainer.innerHTML = '<p style="text-align: center; color: #6c757d;">No hay datos de alertas disponibles</p>';
        return;
    }
    
    // Crear elementos para cada grúa
    CONFIG.GRUAS.forEach(grua => {
        const alertas = alertasPorGrua[grua] || { vencidas: 0, porVencer: 0, alDia: 0 };
        
        const gruaDiv = document.createElement('div');
        gruaDiv.className = 'stat-row';
        gruaDiv.style.marginBottom = '10px';
        
        gruaDiv.innerHTML = `
            <strong style="min-width: 100px;">🏗️ ${grua}:</strong>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <span class="alert-badge alert-vencida">
                    🔴 ${alertas.vencidas} Vencidas
                </span>
                <span class="alert-badge alert-por-vencer">
                    🟡 ${alertas.porVencer} Por vencer
                </span>
                <span class="alert-badge alert-al-dia">
                    🟢 ${alertas.alDia} Al día
                </span>
            </div>
        `;
        
        alertasContainer.appendChild(gruaDiv);
    });
}

// Función para refrescar el dashboard
function refreshDashboard() {
    loadDashboard();
}
