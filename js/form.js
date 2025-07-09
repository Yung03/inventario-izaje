// Función para manejar el cambio de accesorio
function handleAccesorioChange(event) {
    const accesorio = event.target.value;
    const eslingaFields = document.getElementById('eslingaFields');
    const diametroFields = document.getElementById('diametroFields');
    
    // Ocultar todos los campos condicionales
    eslingaFields.classList.remove('active');
    diametroFields.classList.remove('active');
    eslingaFields.style.display = 'none';
    diametroFields.style.display = 'none';
    
    // Mostrar campos según el accesorio seleccionado
    if (accesorio === 'Eslinga') {
        eslingaFields.classList.add('active');
        eslingaFields.style.display = 'block';
    } else if (accesorio === 'Grillete' || accesorio === 'Cadena') {
        diametroFields.classList.add('active');
        diametroFields.style.display = 'block';
    }
}

// Función para manejar la selección de foto
function handlePhotoSelection(event) {
    const file = event.target.files[0];
    if (file) {
        // Verificar el tamaño del archivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen es muy grande. Por favor seleccione una imagen menor a 5MB.');
            event.target.value = '';
            return;
        }
        
        // Leer el archivo
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedPhoto = e.target.result;
            document.getElementById('previewImage').src = selectedPhoto;
            document.getElementById('photoPreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Función para manejar el envío del formulario
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const loadingElement = document.getElementById('form-loading');
    
    // Mostrar loading
    loadingElement.classList.add('active');
    
    // Recolectar datos del formulario
    const formData = collectFormData();
    
    try {
        // Enviar datos a Google Sheets
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // Agregar al inventario local
        inventory.push(formData);
        
        // Limpiar el formulario
        clearForm();
        
        // Ocultar loading
        loadingElement.classList.remove('active');
        
        // Mostrar mensaje de éxito
        showSuccessMessage(CONFIG.MENSAJES.EXITO_GUARDAR);
        
        // Recargar dashboard si está activo
        if (document.getElementById('dashboard-tab').classList.contains('active')) {
            loadDashboard();
        }
        
    } catch (error) {
        console.error('Error:', error);
        loadingElement.classList.remove('active');
        alert(CONFIG.MENSAJES.ERROR_GUARDAR);
    }
}

// Función para recolectar datos del formulario
function collectFormData() {
    const formData = {
        tipo_grua: document.getElementById('tipoGrua').value,
        accesorio: document.getElementById('accesorio').value,
        codigo: document.getElementById('codigo').value,
        capacidad: parseFloat(document.getElementById('capacidad').value),
        marca: document.getElementById('marca').value,
        cantidad: parseInt(document.getElementById('cantidad').value),
        estado: document.getElementById('estado').value,
        fecha_inspeccion: document.getElementById('fechaInspeccion').value,
        proxima_inspeccion: document.getElementById('proximaInspeccion').value,
        observaciones: document.getElementById('observaciones').value
    };
    
    // Agregar campos específicos según el accesorio
    if (formData.accesorio === 'Eslinga') {
        formData.numero_capas = document.getElementById('numeroCapas').value || '';
        formData.longitud = document.getElementById('longitud').value || '';
        formData.diametro = '';
    } else if (formData.accesorio === 'Grillete' || formData.accesorio === 'Cadena') {
        formData.numero_capas = '';
        formData.longitud = '';
        formData.diametro = document.getElementById('diametro').value || '';
    } else {
        formData.numero_capas = '';
        formData.longitud = '';
        formData.diametro = '';
    }
    
    // Agregar URL de foto si existe
    formData.url_foto = selectedPhoto || '';
    
    return formData;
}

// Función para limpiar el formulario
function clearForm() {
    // Resetear el formulario
    document.getElementById('inventoryForm').reset();
    
    // Limpiar campos calculados
    document.getElementById('proximaInspeccion').value = '';
    
    // Limpiar foto
    selectedPhoto = null;
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('previewImage').src = '';
    
    // Ocultar campos condicionales
    document.getElementById('eslingaFields').classList.remove('active');
    document.getElementById('diametroFields').classList.remove('active');
    document.getElementById('eslingaFields').style.display = 'none';
    document.getElementById('diametroFields').style.display = 'none';
}

// Función para validar el formulario
function validateForm() {
    // Esta función se puede expandir para agregar validaciones personalizadas
    const form = document.getElementById('inventoryForm');
    return form.checkValidity();
}

// Función para prellenar el formulario (para futuras ediciones)
function fillForm(data) {
    document.getElementById('tipoGrua').value = data.tipo_grua || '';
    document.getElementById('accesorio').value = data.accesorio || '';
    document.getElementById('codigo').value = data.codigo || '';
    document.getElementById('capacidad').value = data.capacidad || '';
    document.getElementById('marca').value = data.marca || '';
    document.getElementById('cantidad').value = data.cantidad || 1;
    document.getElementById('estado').value = data.estado || '';
    document.getElementById('fechaInspeccion').value = data.fecha_inspeccion || '';
    document.getElementById('proximaInspeccion').value = data.proxima_inspeccion || '';
    document.getElementById('observaciones').value = data.observaciones || '';
    
    // Campos específicos
    if (data.accesorio === 'Eslinga') {
        document.getElementById('numeroCapas').value = data.numero_capas || '';
        document.getElementById('longitud').value = data.longitud || '';
        // Mostrar campos de eslinga
        handleAccesorioChange({ target: { value: 'Eslinga' } });
    } else if (data.accesorio === 'Grillete' || data.accesorio === 'Cadena') {
        document.getElementById('diametro').value = data.diametro || '';
        // Mostrar campos de diámetro
        handleAccesorioChange({ target: { value: data.accesorio } });
    }
}
