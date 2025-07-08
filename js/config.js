// Configuración global del sistema
const CONFIG = {
    // URL de la API de Google Apps Script
    API_URL: 'https://script.google.com/macros/s/AKfycbyLOBu_ZpJGdLbwdK0UWvsd5-WiwIp2YB4_-GpkxZNDelgVtJaaGASunEbdOJ1w3x0pmA/exec',
    
    // Configuración de grúas disponibles
    GRUAS: ['DEMAG', 'PPM01', 'PPM02', 'ATF80-4', 'TEREX'],
    
    // Configuración de tipos de accesorios
    ACCESORIOS: ['Eslinga', 'Grillete', 'Cadena'],
    
    // Estados posibles
    ESTADOS: ['Operativo', 'Inoperativo'],
    
    // Configuración de inspecciones
    INSPECCION: {
        MESES_PROXIMA: 1,  // Próxima inspección en 1 mes
        DIAS_ALERTA: 7     // Alertar 7 días antes
    },
    
    // Configuración de mensajes
    MENSAJES: {
        EXITO_GUARDAR: 'Accesorio agregado exitosamente a Google Sheets',
        ERROR_GUARDAR: 'Error al guardar. Por favor intente nuevamente.',
        SIN_DATOS_CSV: 'No hay datos para exportar',
        CARGANDO_DASHBOARD: 'Cargando dashboard...',
        CARGANDO_INVENTARIO: 'Cargando inventario...',
        GUARDANDO: 'Guardando en Google Sheets...'
    },
    
    // Configuración de timeouts
    TIMEOUTS: {
        MENSAJE_EXITO: 3000,  // 3 segundos
        ANIMACION: 300        // 300ms
    }
};

// Variables globales compartidas
let inventory = [];
let selectedPhoto = null;
