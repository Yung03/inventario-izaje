// js/form.js - Funciones del Formulario

// Variable global para almacenar la foto seleccionada
let selectedPhoto = null;

// Inicializar formulario
function initializeForm() {
    setupEventListeners();
    setDefaultDate();
}

// Configurar event listeners del formulario
function setupEventListeners() {
    // Cambio en fecha de inspección
    document.getElementById('fechaInspeccion').addEventListener('change', handleInspectionDateChange);
    
    // Cambio en tipo de accesorio
    document.getElementById('accesorio').addEventListener('change', handleAccessoryChange);
    
    // Selección de foto
    document.getElementById('photoInput').addEventListener('change', handlePhotoSelection);
    
    // Envío del formulario
    document.getElementById('inventoryForm').addEventListener('submit', handleFormSubmit);
}

// Establecer fecha por defecto
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fechaInspeccion').value = today;
    document.getElementById('proximaInspeccion').value = calculateNextInspection(today);
}

// Manejar cambio en fecha de inspección
function handleInspectionDateChange() {
    const inspectionDate = this.value;
    if (inspectionDate) {
        const nextDate = calculateNextInspection(inspectionDate);
        document.getElementById('proximaInspeccion').value = nextDate;
    }
}

// Calcular próxima inspección (1 mes después)
function calculateNextInspection(date) {
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth() + 1);
    return nextDate.toISOString().split('T')[0];
}

// Manejar cambio en tipo de accesorio
function handleAccessoryChange() {
    const accessoryType = this.value;
    
    // Ocultar todos los campos condicionales
    hideAllConditionalFields();
    
    // Mostrar campos según el accesorio seleccionado
    if (accessoryType === 'Eslinga') {
        showEslingaFields();
    } else if (accessoryType === 'Grillete' || accessoryType === 'Cadena') {
        showDiameterFields();
    }
}

// Ocultar todos los campos condicionales
function hideAllConditionalFields() {
    const eslingaFields = document.getElementById('eslingaFields');
    const diametroFields = document.getElementById('diametroFields');
    
    eslingaFields.classList.remove('active');
    diametroFields.classList.remove('active');
    eslingaFields.style.display = 'none';
    diametroFields.style.display = 'none';
    
    // Limpiar valores
    document.getElementById('numeroCapas').value = '';
    document.getElementById('longitud').value = '';
    document.getElementById('diametro').value = '';
}

// Mostrar campos específicos de eslinga
function showEslingaFields() {
    const eslingaFields = document.getElementById('eslingaFields');
    eslingaFields.classList.add('active');
    eslingaFields.style.display = 'block';
}

// Mostrar campos de diámetro
function showDiameterFields() {
    const diametroFields = document.getElementById('diametroFields');
    diametroFields.classList.add('active');
    diametroFields.style.display = 'block';
}

// Manejar selección de foto
function handlePhotoSelection(event) {
    const file = event.target.files[0];
    if (file) {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            showErrorMessage('Por favor seleccione un archivo de imagen válido');
            return;
        }
        
        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showErrorMessage('La imagen no puede ser mayor a 5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedPhoto = e.target.result;
            showPhotoPreview(selectedPhoto);
        };
        reader.readAsDataURL(file);
    }
}

// Mostrar vista previa de la foto
function showPhotoPreview(photoData) {
    const previewContainer = document.getElementById('photoPreview');
    const previewImage = document.getElementById('previewImage');
    
    previewImage.src = photoData;
    previewContainer.style.display = 'block';
}

// Manejar envío del formulario
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
        return;
    }
    
    // Mostrar loading
    showFormLoading(true);
    
    try {
        // Recolectar datos del formulario
        const formData = collectFormData();
        
        // Enviar datos a Google Sheets
        await saveToGoogleSheets(formData);
        
        // Limpiar formulario
        resetForm();
        
        // Mostrar mensaje de éxito
        showSuccessMessage('Accesorio agregado exitosamente al inventario');
        
        // Actualizar dashboard si está activo
        if (document.getElementById('dashboard-tab').classList.contains('active')) {
            loadDashboard();
        }
        
    } catch (error) {
        console.error('Error al guardar:', error);
        showErrorMessage('Error al guardar. Por favor intente nuevamente.');
    } finally {
        showFormLoading(false);
    }
}

// Validar formulario
function validateForm() {
    const requiredFields = [
        { id: 'tipoGrua', name: 'Tipo de Grúa' },
        { id: 'accesorio', name: 'Accesorio' },
        { id: 'codigo', name: 'Código' },
        { id: 'capacidad', name: 'Capacidad' },
        { id: 'marca', name: 'Marca' },
        { id: 'cantidad', name: 'Cantidad' },
        { id: 'estado', name: 'Estado' },
        { id: 'fechaInspeccion', name: 'Fecha de Inspección' }
    ];
    
    // Verificar campos requeridos
    for (const field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            showErrorMessage(`El campo "${field.name}" es requerido`);
            element.focus();
            return false;
        }
    }
    
    // Validar código único
    if (!validateUniqueCode()) {
        return false;
    }
    
    // Validar valores numéricos
    if (!validateNumericFields()) {
        return false;
    }
    
    return true;
}

// Validar código único
function validateUniqueCode() {
    const codigo = document.getElementById('codigo').value.trim();
    const existingItem = inventory.find(item => 
        (item.codigo || '').toLowerCase() === codigo.toLowerCase()
    );
    
    if (existingItem) {
        showErrorMessage('Ya existe un accesorio con este código');
        document.getElementById('codigo').focus();
        return false;
    }
    
    return true;
}

// Validar campos numéricos
function validateNumericFields() {
    const capacidad = parseFloat(document.getElementById('capacidad').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    
    if (capacidad <= 0) {
        showErrorMessage('La capacidad debe ser mayor a 0');
        document.getElementById('capacidad').focus();
        return false;
    }
    
    if (cantidad <= 0) {
        showErrorMessage('La cantidad debe ser mayor a 0');
        document.getElementById('cantidad').focus();
        return false;
    }
    
    return true;
}

// Recolectar datos del formulario
function collectFormData() {
    const formData = {
        tipo_grua: document.getElementById('tipoGrua').value,
        accesorio: document.getElementById('accesorio').value,
        codigo: document.getElementById('codigo').value.trim(),
        capacidad: parseFloat(document.getElementById('capacidad').value),
        marca: document.getElementById('marca').value.trim(),
        cantidad: parseInt(document.getElementById('cantidad').value),
        estado: document.getElementById('estado').value,
        fecha_inspeccion: document.getElementById('fechaInspeccion').value,
        proxima_inspeccion: document.getElementById('proximaInspeccion').value,
        observaciones: document.getElementById('observaciones').value.trim(),
        url_foto: selectedPhoto || '',
        fecha_registro: new Date().toISOString()
    };
    
    // Agregar campos específicos según el accesorio
    const accessoryType = formData.accesorio;
    
    if (accessoryType === 'Eslinga') {
        formData.numero_capas = document.getElementById('numeroCapas').value || '';
        formData.longitud = document.getElementById('longitud').value || '';
        formData.diametro = '';
    } else if (accessoryType === 'Grillete' || accessoryType === 'Cadena') {
        formData.numero_capas = '';
        formData.longitud = '';
        formData.diametro = document.getElementById('diametro').value || '';
    } else {
        formData.numero_capas = '';
        formData.longitud = '';
        formData.diametro = '';
    }
    
    return formData;
}

// Guardar en Google Sheets
async function saveToGoogleSheets(formData) {
    const response = await fetch(API_CONFIG.url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });
    
    // Agregar al inventario local
    inventory.push(formData);
    
    return response;
}

// Resetear formulario
function resetForm() {
    // Limpiar formulario
    document.getElementById('inventoryForm').reset();
    
    // Resetear campos específicos
    document.getElementById('proximaInspeccion').value = '';
    selectedPhoto = null;
    
    // Ocultar vista previa de foto
    document.getElementById('photoPreview').style.display = 'none';
    
    // Ocultar campos condicionales
    hideAllConditionalFields();
    
    // Establecer fecha por defecto
    setDefaultDate();
}

// Mostrar/ocultar loading del formulario
function showFormLoading(show) {
    const loading = document.getElementById('form-loading');
    if (show) {
        loading.classList.add('active');
    } else {
        loading.classList.remove('active');
    }
}

// Función para abrir selector de foto
function openPhotoSelector() {
    document.getElementById('photoInput').click();
}

// Función para eliminar foto seleccionada
function removePhoto() {
    selectedPhoto = null;
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('photoInput').value = '';
}

// Función para validar en tiempo real
function setupRealTimeValidation() {
    const inputs = document.querySelectorAll('#inventoryForm input, #inventoryForm select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validar campo individual
function validateField(field) {
    const value = field.value.trim();
    
    // Remover clases de error previas
    field.classList.remove('error');
    
    // Validar según el tipo de campo
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo es requerido');
        return false;
    }
    
    if (field.type === 'number' && value && parseFloat(value) <= 0) {
        showFieldError(field, 'Debe ser mayor a 0');
        return false;
    }
    
    if (field.id === 'codigo' && value) {
        const existingItem = inventory.find(item => 
            (item.codigo || '').toLowerCase() === value.toLowerCase()
        );
        
        if (existingItem) {
            showFieldError(field, 'Este código ya existe');
            return false;
        }
    }
    
    return true;
}

// Mostrar error en campo específico
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remover mensaje de error previo
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Agregar nuevo mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Limpiar error de campo
function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Función para autocompletar campos basado en código
function setupAutoComplete() {
    const codigoInput = document.getElementById('codigo');
    
    codigoInput.addEventListener('input', function() {
        const codigo = this.value.trim();
        
        if (codigo.length >= 3) {
            const suggestions = getSuggestions(codigo);
            showSuggestions(suggestions, this);
        } else {
            hideSuggestions();
        }
    });
}

// Obtener sugerencias basadas en código
function getSuggestions(codigo) {
    return inventory.filter(item => 
        (item.codigo || '').toLowerCase().includes(codigo.toLowerCase())
    ).slice(0, 5);
}

// Mostrar sugerencias
function showSuggestions(suggestions, inputElement) {
    hideSuggestions();
    
    if (suggestions.length === 0) return;
    
    const suggestionBox = document.createElement('div');
    suggestionBox.className = 'suggestions-box';
    suggestionBox.style.position = 'absolute';
    suggestionBox.style.top = inputElement.offsetHeight + 'px';
    suggestionBox.style.left = '0';
    suggestionBox.style.width = '100%';
    suggestionBox.style.backgroundColor = 'white';
    suggestionBox.style.border = '1px solid #ddd';
    suggestionBox.style.borderRadius = '5px';
    suggestionBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    suggestionBox.style.zIndex = '1000';
    
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.style.padding = '10px';
        item.style.borderBottom = '1px solid #eee';
        item.style.cursor = 'pointer';
        item.textContent = `${suggestion.codigo} - ${suggestion.accesorio} - ${suggestion.marca}`;
        
        item.addEventListener('click', function() {
            // Autocompletar formulario con datos existentes
            fillFormWithSuggestion(suggestion);
            hideSuggestions();
        });
        
        suggestionBox.appendChild(item);
    });
    
    inputElement.parentNode.style.position = 'relative';
    inputElement.parentNode.appendChild(suggestionBox);
}

// Ocultar sugerencias
function hideSuggestions() {
    const existingSuggestions = document.querySelector('.suggestions-box');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }
}

// Llenar formulario con sugerencia
function fillFormWithSuggestion(suggestion) {
    // No llenar automáticamente, solo mostrar aviso
    showInfoMessage(`Código similar encontrado: ${suggestion.codigo} - ${suggestion.accesorio}`);
}

// Inicializar cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupRealTimeValidation();
    setupAutoComplete();
});
