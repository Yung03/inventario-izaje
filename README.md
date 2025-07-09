# Sistema de Inventario de Accesorios de Izaje

Sistema web para el control y gestión de equipos de izaje con integración a Google Sheets.

## 🚀 Características

- **Dashboard en tiempo real** con estadísticas y alertas
- **Gestión de inventario** de eslingas, grilletes y cadenas
- **Integración con Google Sheets** para almacenamiento permanente
- **Carga de fotos** de los accesorios
- **Alertas de inspecciones** por grúa
- **Exportación a CSV**
- **Diseño responsive** para móviles

## 📋 Requisitos

- Cuenta de Google
- Navegador web moderno
- Conexión a internet

## 🛠️ Instalación

### 1. Configurar Google Sheets

1. Crear una hoja de cálculo en Google Sheets
2. Configurar las hojas:
   - **INVENTARIO**: Para los datos principales
   - **DASHBOARD**: Para estadísticas
   - **CONFIG**: Para configuración

### 2. Configurar Google Apps Script

1. En Google Sheets, ir a `Extensiones > Apps Script`
2. Copiar el código del archivo `google-apps-script.gs`
3. Guardar y desplegar como aplicación web
4. Copiar la URL de despliegue

### 3. Configurar el proyecto

1. Clonar o descargar este repositorio
2. Editar `js/config.js` y actualizar:
   ```javascript
   API_URL: 'TU_URL_DE_APPS_SCRIPT_AQUI'
   ```

### 4. Desplegar en GitHub Pages

1. Subir los archivos a tu repositorio
2. Activar GitHub Pages en Settings
3. Acceder a `https://tu-usuario.github.io/tu-repositorio/`

## 📱 Uso

### Dashboard
- Vista general del estado del inventario
- Distribución por tipo de accesorio
- Alertas de inspección por grúa

### Agregar Nuevo
- Formulario para registrar accesorios
- Campos específicos según el tipo
- Carga de fotografías
- Cálculo automático de próxima inspección

### Inventario
- Tabla completa de todos los accesorios
- Detalles específicos por tipo
- Enlaces a fotos
- Estado de inspecciones

## 🔧 Estructura del Proyecto

```
inventario-izaje/
├── index.html          # Estructura principal
├── css/
│   └── styles.css     # Estilos del sistema
├── js/
│   ├── config.js      # Configuración global
│   ├── main.js        # Funciones principales
│   ├── dashboard.js   # Lógica del dashboard
│   ├── inventory.js   # Gestión del inventario
│   └── form.js        # Manejo de formularios
└── README.md          # Este archivo
```

## 🎨 Personalización

### Modificar grúas disponibles
Editar en `js/config.js`:
```javascript
GRUAS: ['DEMAG', 'PPM01', 'PPM02', 'ATF80-4', 'TEREX']
```

### Cambiar período de inspección
Editar en `js/config.js`:
```javascript
INSPECCION: {
    MESES_PROXIMA: 1,  // Cambiar a los meses deseados
    DIAS_ALERTA: 7     // Días antes para alertar
}
```

## 📊 Campos del Inventario

### Campos generales
- Tipo de Grúa
- Accesorio
- Código
- Capacidad (Ton)
- Marca
- Cantidad
- Estado
- Fecha de Inspección
- Próxima Inspección
- Observaciones
- Foto

### Campos específicos

**Eslingas:**
- Número de Capas
- Longitud (metros)

**Grilletes y Cadenas:**
- Diámetro (pulgadas)

## 🐛 Solución de Problemas

### El formulario no envía datos
- Verificar que la URL de Apps Script esté correcta
- Comprobar permisos en Google Sheets
- Revisar la consola del navegador (F12)

### Las fotos no se cargan
- Verificar el tamaño (máximo 5MB)
- Comprobar permisos de la carpeta en Drive

### Dashboard no muestra datos
- Refrescar la página
- Verificar conexión a internet
- Comprobar que haya datos en Google Sheets

## 📄 Licencia

Este proyecto es de uso interno para gestión de inventario.

## 👥 Soporte

Para soporte o preguntas sobre el sistema, contactar al administrador.
