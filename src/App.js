import React, { useState } from 'react';

// ============================================
// VALIDACIONES DE ENTRADA (Programación Defensiva)
// ============================================

/**
 * Valida que el nombre de la mascota sea válido
 * SNIPPET 1: Validación de entrada - Nombre
 * @param {string} nombre - Nombre de la mascota
 * @returns {object} { esValido: boolean, error: string }
 */
const validarNombreMascota = (nombre) => {
  // Validación 1: Verificar que no sea nulo o undefined
  if (!nombre) {
    return {
      esValido: false,
      error: 'El nombre de la mascota es requerido',
    };
  }

  // Sanitización: Remover espacios al inicio y final
  const nombreLimpio = nombre.trim();

  // Validación 2: Verificar que no esté vacío después de sanitizar
  if (nombreLimpio.length === 0) {
    return {
      esValido: false,
      error: 'El nombre no puede contener solo espacios',
    };
  }

  // Validación 3: Verificar longitud (min 2, max 50 caracteres)
  if (nombreLimpio.length < 2 || nombreLimpio.length > 50) {
    return {
      esValido: false,
      error: 'El nombre debe tener entre 2 y 50 caracteres',
    };
  }

  // Validación 4: Solo letras, números y espacios (prevenir inyección)
  const patronNombreValido = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ0-9\s]+$/;
  if (!patronNombreValido.test(nombreLimpio)) {
    return {
      esValido: false,
      error: 'El nombre contiene caracteres inválidos',
    };
  }

  return { esValido: true, error: null };
};

/**
 * Valida que la edad de la mascota sea válida
 * SNIPPET 2: Validación de entrada - Edad y Rango
 * @param {string|number} edad - Edad de la mascota
 * @returns {object} { esValido: boolean, error: string }
 */
const validarEdadMascota = (edad) => {
  // Validación 1: Verificar que no sea nulo
  if (edad === null || edad === undefined || edad === '') {
    return {
      esValido: false,
      error: 'La edad es requerida',
    };
  }

  // Conversión a número
  const edadNumero = Number(edad);

  // Validación 2: Verificar que sea un número válido
  if (Number.isNaN(edadNumero)) {
    return {
      esValido: false,
      error: 'La edad debe ser un número válido',
    };
  }

  // Validación 3: Verificar rango válido (0-50 años)
  if (edadNumero < 0 || edadNumero > 50) {
    return {
      esValido: false,
      error: 'La edad debe estar entre 0 y 50 años',
    };
  }

  // Validación 4: Verificar que sea un entero
  if (!Number.isInteger(edadNumero)) {
    return {
      esValido: false,
      error: 'La edad debe ser un número entero',
    };
  }

  return { esValido: true, error: null };
};

/**
 * Valida que la especie sea válida
 * @param {string} especie - Especie de la mascota
 * @returns {object} { esValido: boolean, error: string }
 */
const validarEspecieMascota = (especie) => {
  const especiesValidas = ['perro', 'gato', 'conejo', 'pajaro', 'roedor', 'otro'];

  if (!especie) {
    return {
      esValido: false,
      error: 'La especie es requerida',
    };
  }

  if (!especiesValidas.includes(especie.toLowerCase())) {
    return {
      esValido: false,
      error: `La especie debe ser una de: ${especiesValidas.join(', ')}`,
    };
  }

  return { esValido: true, error: null };
};

/**
 * Valida todo el formulario
 * @param {object} datosFormulario - Datos del formulario
 * @returns {object} { esValido: boolean, errores: object }
 */
const validarFormulario = (datosFormulario) => {
  const errores = {};

  const validacionNombre = validarNombreMascota(datosFormulario.nombre);
  if (!validacionNombre.esValido) {
    errores.nombre = validacionNombre.error;
  }

  const validacionEdad = validarEdadMascota(datosFormulario.edad);
  if (!validacionEdad.esValido) {
    errores.edad = validacionEdad.error;
  }

  const validacionEspecie = validarEspecieMascota(datosFormulario.especie);
  if (!validacionEspecie.esValido) {
    errores.especie = validacionEspecie.error;
  }

  return {
    esValido: Object.keys(errores).length === 0,
    errores,
  };
};

// ============================================
// SERVICIO DE BASE DE DATOS (Manejo de Excepciones)
// ============================================

/**
 * SNIPPET 3: Manejo de Excepciones - Try/Catch para operación de BD
 * @param {object} datosMascota - Datos de la mascota
 * @returns {Promise<object>} Respuesta del servidor
 */
const registrarMascotaEnBaseDatos = async (datosMascota) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.05) {
        reject(new Error('ConnectionError: No se pudo conectar a la base de datos'));
      } else {
        resolve({
          exito: true,
          idMascota: Math.floor(Math.random() * 10000),
          mensaje: 'Mascota registrada exitosamente',
        });
      }
    }, 800);
  });
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function RegistroMascotas() {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    edad: '',
    especie: 'perro',
  });

  const [erroresFormulario, setErroresFormulario] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mascotasRegistradas, setMascotasRegistradas] = useState([]);

  /**
   * Maneja cambios en los campos del formulario
   */
  const manejarCambioEntrada = (evento) => {
    const { name, value } = evento.target;
    setDatosFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
    if (erroresFormulario[name]) {
      setErroresFormulario((anterior) => ({
        ...anterior,
        [name]: '',
      }));
    }
  };

  /**
   * SNIPPET 4: Manejo de Excepciones - Try/Catch/Finally
   * Maneja el envío del formulario con validación y manejo de excepciones
   */
  const manejarEnvioFormulario = async (evento) => {
    evento.preventDefault();
    setMensajeExito('');
    setErroresFormulario({});

    // PASO 1: Validación de entrada (Programación Defensiva)
    const validacion = validarFormulario(datosFormulario);
    if (!validacion.esValido) {
      setErroresFormulario(validacion.errores);
      return;
    }

    setCargando(true);

    try {
      // ASERCIÓN 1: Verificar que la validación pasó correctamente
      console.assert(
        validacion.esValido === true,
        'Error de lógica: Los datos deberían haber sido validados antes de llegar aquí'
      );

      // PASO 2: Intentar registrar en la base de datos
      const respuesta = await registrarMascotaEnBaseDatos(datosFormulario);

      // ASERCIÓN 2: Verificar que la respuesta tiene los campos esperados
      console.assert(
        respuesta.idMascota !== null && respuesta.idMascota !== undefined,
        'Error de lógica: La BD no retornó un ID después de insertar la mascota'
      );

      // Crear objeto de mascota registrada
      const mascotaNueva = {
        id: respuesta.idMascota,
        nombre: datosFormulario.nombre.trim(),
        edad: Number(datosFormulario.edad),
        especie: datosFormulario.especie,
        fechaRegistro: new Date().toLocaleString(),
      };

      setMascotasRegistradas((anterior) => [mascotaNueva, ...anterior]);

      // Mostrar mensaje de éxito
      setMensajeExito(`¡Mascota "${mascotaNueva.nombre}" registrada exitosamente! ID: ${mascotaNueva.id}`);

      // Limpiar formulario
      setDatosFormulario({ nombre: '', edad: '', especie: 'perro' });
    } catch (error) {
      // MANEJO DE EXCEPCIONES ESPECÍFICAS
      console.error('Error técnico:', error.message);

      if (error.message.includes('ConnectionError')) {
        setErroresFormulario({
          general: 'Error de conexión: No se pudo conectar a la base de datos. Intenta más tarde.',
        });
      } else if (error.message.includes('ValidationError')) {
        setErroresFormulario({
          general: 'Error de validación: Los datos no cumplieron las reglas de negocio.',
        });
      } else {
        setErroresFormulario({
          general: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
        });
      }
    } finally {
      // BLOQUE FINALLY: Se ejecuta siempre
      setCargando(false);
    }
  };

  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>Registro de Mascotas - Clínica Veterinaria</h1>

      <div style={estilos.contenedorFormulario}>
        <div style={estilos.grupoFormulario}>
          <label style={estilos.etiqueta}>Nombre de la Mascota *</label>
          <input
            type="text"
            name="nombre"
            value={datosFormulario.nombre}
            onChange={manejarCambioEntrada}
            placeholder="Ej: Fluffy, Max"
            disabled={cargando}
            style={estilos.entrada}
          />
          {erroresFormulario.nombre && <span style={estilos.textoError}>{erroresFormulario.nombre}</span>}
        </div>

        <div style={estilos.grupoFormulario}>
          <label style={estilos.etiqueta}>Edad (años) *</label>
          <input
            type="number"
            name="edad"
            value={datosFormulario.edad}
            onChange={manejarCambioEntrada}
            placeholder="Ej: 3"
            disabled={cargando}
            min="0"
            max="50"
            style={estilos.entrada}
          />
          {erroresFormulario.edad && <span style={estilos.textoError}>{erroresFormulario.edad}</span>}
        </div>

        <div style={estilos.grupoFormulario}>
          <label style={estilos.etiqueta}>Especie *</label>
          <select
            name="especie"
            value={datosFormulario.especie}
            onChange={manejarCambioEntrada}
            disabled={cargando}
            style={estilos.seleccion}
          >
            <option value="perro">Perro</option>
            <option value="gato">Gato</option>
            <option value="conejo">Conejo</option>
            <option value="pajaro">Pájaro</option>
            <option value="roedor">Roedor</option>
            <option value="otro">Otro</option>
          </select>
          {erroresFormulario.especie && <span style={estilos.textoError}>{erroresFormulario.especie}</span>}
        </div>

        {erroresFormulario.general && (
          <div style={estilos.alertaError}>{erroresFormulario.general}</div>
        )}

        {mensajeExito && (
          <div style={estilos.alertaExito}>{mensajeExito}</div>
        )}

        <button
          onClick={manejarEnvioFormulario}
          disabled={cargando}
          style={{
            ...estilos.boton,
            opacity: cargando ? 0.6 : 1,
          }}
        >
          {cargando ? 'Registrando...' : 'Registrar Mascota'}
        </button>
      </div>

      {mascotasRegistradas.length > 0 && (
        <div style={estilos.seccionMascotas}>
          <h2 style={estilos.subtitulo}>Mascotas Registradas ({mascotasRegistradas.length})</h2>
          <table style={estilos.tabla}>
            <thead>
              <tr style={estilos.filaEncabezado}>
                <th style={estilos.encabezado}>ID</th>
                <th style={estilos.encabezado}>Nombre</th>
                <th style={estilos.encabezado}>Edad (años)</th>
                <th style={estilos.encabezado}>Especie</th>
                <th style={estilos.encabezado}>Fecha de Registro</th>
              </tr>
            </thead>
            <tbody>
              {mascotasRegistradas.map((mascota) => (
                <tr key={mascota.id} style={estilos.filaTabla}>
                  <td style={estilos.celda}>{mascota.id}</td>
                  <td style={estilos.celda}>{mascota.nombre}</td>
                  <td style={estilos.celda}>{mascota.edad}</td>
                  <td style={estilos.celda}>{mascota.especie.charAt(0).toUpperCase() + mascota.especie.slice(1)}</td>
                  <td style={estilos.celda}>{mascota.fechaRegistro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================
// ESTILOS (Airbnb Style Guide)
// ============================================

const estilos = {
  contenedor: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  titulo: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#2c3e50',
    marginBottom: '30px',
    textAlign: 'center',
  },
  contenedorFormulario: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
  },
  grupoFormulario: {
    marginBottom: '20px',
  },
  etiqueta: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#2c3e50',
    marginBottom: '8px',
  },
  entrada: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  seleccion: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  textoError: {
    display: 'block',
    color: '#e74c3c',
    fontSize: '13px',
    marginTop: '5px',
  },
  alertaError: {
    backgroundColor: '#ffe6e6',
    color: '#c0392b',
    padding: '12px 15px',
    borderRadius: '4px',
    marginBottom: '15px',
    borderLeft: '4px solid #e74c3c',
  },
  alertaExito: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '12px 15px',
    borderRadius: '4px',
    marginBottom: '15px',
    borderLeft: '4px solid #27ae60',
  },
  boton: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    fontWeight: 600,
    color: 'white',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  seccionMascotas: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  subtitulo: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#2c3e50',
    marginBottom: '15px',
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  filaEncabezado: {
    backgroundColor: '#34495e',
  },
  encabezado: {
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 600,
    borderBottom: '2px solid #2c3e50',
  },
  filaTabla: {
    borderBottom: '1px solid #ecf0f1',
  },
  celda: {
    padding: '12px',
    color: '#2c3e50',
  },
};