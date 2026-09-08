/**
 * @fileoverview Controlador de eventos del frontend
 * Gestiona las interacciones del usuario: búsquedas y agregación de películas
 */

// Elementos del DOM
const buttonBuscar = document.getElementById('buttonBuscar')
const buttonAgregar = document.getElementById('buttonAgregar')
const inputBuscar = document.getElementById('inputBuscar')
const inputTitle = document.getElementById('inputTitle')
const inputPlot = document.getElementById('inputPlot')
const inputYear = document.getElementById('inputYear')
const divResultados = document.getElementById('resultados')
const divAgregar = document.getElementById('agregarPelicula')

/**
 * Muestra un mensaje de estado (carga, error, etc.)
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje: 'loading', 'success', 'error'
 */
const showStatus = (message, type = 'loading') => {
  const statusDiv = document.getElementById('status') || document.createElement('div')
  statusDiv.id = 'status'
  statusDiv.textContent = message
  statusDiv.className = `status status-${type}`
  
  if (!document.getElementById('status')) {
    divResultados.parentElement.insertBefore(statusDiv, divResultados)
  }
}

/**
 * Limpia el mensaje de estado
 */
const clearStatus = () => {
  const statusDiv = document.getElementById('status')
  if (statusDiv) {
    statusDiv.remove()
  }
}

/**
 * EVENTO: Búsqueda de películas
 * Se ejecuta cuando el usuario hace clic en "Buscar"
 * 
 * Lee el valor del input de búsqueda y lo envía al servidor
 * Nota: Actualmente el servidor IGNORA el parámetro de búsqueda
 * y siempre devuelve películas con "Toy" (ejercicio para estudiantes)
 */
if (buttonBuscar) {
  buttonBuscar.addEventListener('click', function(e) {
    e.preventDefault()
    
    const searchTerm = inputBuscar?.value?.trim() || ''
    
    // Validación básica (comentado, permitir búsquedas vacías)
    // if (!searchTerm) {
    //   showStatus('Por favor ingresa un término de búsqueda', 'error')
    //   return
    // }
    
    showStatus('Buscando películas...', 'loading')
    clearStatus()
    showStatus('Buscando películas...', 'loading')
    
    // Construir URL con parámetro de búsqueda
    const url = searchTerm 
      ? `/peliculas?title=${encodeURIComponent(searchTerm)}` 
      : '/peliculas'
    
    fetch(url, { method: 'GET' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        clearStatus()
        
        // Validar que datos sea un array
        if (!Array.isArray(data)) {
          console.error('Respuesta inválida del servidor:', data)
          showStatus('Error: Respuesta inválida del servidor', 'error')
          divResultados.innerHTML = ''
          return
        }
        
        // Mostrar resultados
        if (data.length === 0) {
          showStatus('No se encontraron películas', 'error')
          divResultados.innerHTML = '<p>No hay resultados</p>'
        } else {
          showStatus(`Se encontraron ${data.length} película(s)`, 'success')
          let html = '<ul class="movies-list">'
          data.forEach((pelicula) => {
            if (pelicula.title) {
              html += `<li>${escapeHtml(pelicula.title)}</li>`
            }
          })
          html += '</ul>'
          divResultados.innerHTML = html
        }
      })
      .catch((error) => {
        console.error('Error en búsqueda:', error)
        clearStatus()
        showStatus(`Error: ${error.message}`, 'error')
        divResultados.innerHTML = '<p style="color: red;">Error al buscar películas</p>'
      })
  })
}

/**
 * EVENTO: Agregación de película
 * Se ejecuta cuando el usuario hace clic en "Agregar Película"
 * 
 * Valida los datos en el frontend, envía al servidor, y espera confirmación
 */
if (buttonAgregar) {
  buttonAgregar.addEventListener('click', function(e) {
    e.preventDefault()
    
    // Obtener valores del formulario
    const title = inputTitle?.value?.trim()
    const plot = inputPlot?.value?.trim()
    const year = inputYear?.value?.trim()
    
    // Validaciones básicas
    if (!title || !plot || !year) {
      showStatus('Por favor completa todos los campos', 'error')
      return
    }
    
    // Validar que año sea un número
    const yearNum = parseInt(year, 10)
    if (isNaN(yearNum) || yearNum < 1) {
      showStatus('El año debe ser un número válido', 'error')
      return
    }
    
    showStatus('Agregando película...', 'loading')
    
    // Preparar datos
    const movieData = {
      title,
      plot,
      year: yearNum
    }
    
    // Enviar al servidor
    fetch('/peliculas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(movieData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        clearStatus()
        showStatus('¡Película agregada correctamente!', 'success')
        
        // Limpiar formulario
        inputTitle.value = ''
        inputPlot.value = ''
        inputYear.value = ''
        
        // Cerrar formulario después de 2 segundos (opcional)
        setTimeout(() => {
          if (divAgregar) {
            divAgregar.style.display = 'none'
          }
          clearStatus()
        }, 2000)
      })
      .catch((error) => {
        console.error('Error al agregar película:', error)
        clearStatus()
        showStatus(`Error: ${error.message}`, 'error')
      })
  })
}

/**
 * Escapa caracteres especiales HTML para prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}