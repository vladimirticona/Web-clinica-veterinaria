/**
 * @fileoverview Componente principal con Dashboard, Reportes y React Icons
 * @description Incluye login, dashboard con sidebar y gestión completa
 * @version 3.0.0
 * @author dev.ticma
 */

import { useState, useEffect } from "react";
import axios from "axios";
import { FaUsers, FaCalendar, FaShoppingBag, FaChartBar, FaCog, FaDoorOpen, FaUserMd, FaSignInAlt, FaUserPlus, FaPlus, FaBars, FaChartLine, FaPaw, FaUser, FaPhone, FaEnvelope, FaVenusMars, FaDog, FaCat } from 'react-icons/fa';
import "./Dashboard.css";

const BASE_URL = "http://127.0.0.1:3000";

const App = () => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const [regNombre, setRegNombre] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");

  const [seccionActual, setSeccionActual] = useState("pacientes");
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Nuevos estados para formulario de mascota
  const [nuevaMascota, setNuevaMascota] = useState({
    nombre: "",
    especie: "",
    edad: "",
    sexo: ""
  });
  const [nuevoDueño, setNuevoDueño] = useState({
    nombre_completo: "",
    telefono: "",
    email: ""
  });

  const [editNombre, setEditNombre] = useState(usuario?.nombre_completo || "");
  const [editEmail, setEditEmail] = useState(usuario?.email || "");
  const [editPassword, setEditPassword] = useState("");
  const [editPasswordNew, setEditPasswordNew] = useState("");
  const [editPasswordConfirm, setEditPasswordConfirm] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);

  // Estados para reportes
  const [estadisticas, setEstadisticas] = useState(null);

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("usuario");
      if (storedUser) {
        setUsuario(JSON.parse(storedUser));
        fetchMascotas();
        if (seccionActual === "reportes") {
          fetchEstadisticas();
        }
      }
    }
  }, [token, seccionActual]);

  const fetchMascotas = () => {
    setLoading(true);
    setError("");
    axios
      .get(`${BASE_URL}/mascotas`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setMascotas(response.data);
      })
      .catch((error) => {
        setError("Error al obtener las mascotas");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchEstadisticas = () => {
    axios
      .get(`${BASE_URL}/reportes/estadisticas`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setEstadisticas(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener estadísticas:", error);
      });
  };

  const handleCreateMascota = () => {
    const { nombre, especie, edad, sexo } = nuevaMascota;
    const { nombre_completo, telefono, email } = nuevoDueño;
    // PROGRAMACIÓN DEFENSIVA: Validar todos los campos requeridos
    if (!nombre || !especie || !edad || !sexo || !nombre_completo || !telefono || !email) {
      setError("Todos los campos son requeridos");
      return;
    }

    setLoading(true);
    setError("");
    axios
      .post(
        `${BASE_URL}/mascotas`,
        {
          nombre,
          especie,
          edad: parseInt(edad),
          sexo,
          nombre_dueño: nombre_completo,
          telefono,
          email
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then((response) => {
        fetchMascotas(); // Recargar la lista
        // Resetear formularios
        setNuevaMascota({ nombre: "", especie: "", edad: "", sexo: "" });
        setNuevoDueño({ nombre_completo: "", telefono: "", email: "" });
      })
      .catch((error) => {
        setError(error.response?.data?.error || "Error al crear la mascota");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteMascota = (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta mascota?")) { // PROGRAMACIÓN DEFENSIVA: Confirmación antes de acción destructiva
      return;
    }

    setLoading(true);
    setError("");
    axios
      .delete(`${BASE_URL}/mascotas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        fetchMascotas(); // Recargar la lista
      })
      .catch((error) => {
        setError("Error al eliminar la mascota");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdateMascota = (id, mascotaActual) => {
    const nombre = prompt("Nuevo nombre de mascota:", mascotaActual.nombre);
    if (nombre === null) return;

    const especie = prompt("Nueva especie:", mascotaActual.especie);
    if (especie === null) return;

    const edad = prompt("Nueva edad:", mascotaActual.edad);
    if (edad === null) return;

    const sexo = prompt("Nuevo sexo (Macho/Hembra):", mascotaActual.sexo);
    if (sexo === null) return;

    setLoading(true);
    setError("");
    axios
      .put(
        `${BASE_URL}/mascotas/${id}`,
        {
          nombre,
          especie,
          edad: parseInt(edad),
          sexo
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(() => {
        fetchMascotas(); // Recargar la lista
      })
      .catch((error) => {
        setError("Error al actualizar la mascota");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogin = () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError("Todos los campos son requeridos");
      return;
    }

    setLoading(true);
    setError("");
    axios
      .post(`${BASE_URL}/auth/login`, {
        email: loginEmail,
        contraseña: loginPassword
      })
      .then((response) => {
        const { token, usuario } = response.data;
        setToken(token);
        setUsuario(usuario);
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(usuario));
        setLoginEmail("");
        setLoginPassword("");
      })
      .catch((error) => {
        setError(error.response?.data?.error || "Error al iniciar sesión");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRegistro = () => {
    if (
      !regNombre.trim() ||
      !regEmail.trim() ||
      !regPassword.trim() ||
      !regPasswordConfirm.trim()
    ) {
      setError("Todos los campos son requeridos");
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setError("");
    axios
      .post(`${BASE_URL}/auth/registro`, {
        nombre_completo: regNombre,
        email: regEmail,
        contraseña: regPassword
      })
      .then((response) => {
        setError("");
        setMostrarRegistro(false);
        setRegNombre("");
        setRegEmail("");
        setRegPassword("");
        setRegPasswordConfirm("");
        alert("Usuario registrado exitosamente. Por favor, inicia sesión.");
      })
      .catch((error) => {
        setError(error.response?.data?.error || "Error al registrar usuario");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogout = () => {
    setToken(null);
    setUsuario(null);
    setMascotas([]);
    setSeccionActual("pacientes");
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  const handleActualizarPerfil = () => {
    if (!editNombre.trim() || !editEmail.trim()) {
      setError("Nombre y email son requeridos");
      return;
    }

    if (editPasswordNew || editPasswordConfirm) {
      if (!editPassword.trim()) {
        setError("Debes ingresar tu contraseña actual para cambiarla");
        return;
      }
      if (editPasswordNew !== editPasswordConfirm) {
        setError("Las nuevas contraseñas no coinciden");
        return;
      }
      if (editPasswordNew.length < 6) {
        setError("La nueva contraseña debe tener al menos 6 caracteres");
        return;
      }
    }

    setLoading(true);
    setError("");

    const datos = {
      nombre_completo: editNombre,
      email: editEmail
    };

    if (editPasswordNew) {
      datos.contraseña_actual = editPassword;
      datos.contraseña_nueva = editPasswordNew;
    }

    axios
      .put(`${BASE_URL}/perfil/actualizar`, datos, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        const usuarioActualizado = response.data.usuario;
        setUsuario(usuarioActualizado);
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
        setModoEdicion(false);
        setEditPassword("");
        setEditPasswordNew("");
        setEditPasswordConfirm("");
        setLoading(false);
        alert("Perfil actualizado exitosamente");
      })
      .catch((error) => {
        setError(error.response?.data?.error || "Error al actualizar el perfil");
        setLoading(false);
      });
  };

  // Funciones para reportes
  const calcularMascotasEsteMes = () => {
    const mesActual = new Date().getMonth();
    const añoActual = new Date().getFullYear();
    
    return mascotas.filter(mascota => {
      const fecha = new Date(mascota.fecha_creacion || new Date());
      return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
    }).length;
  };

  const obtenerEspeciesUnicas = () => {
    const especies = [...new Set(mascotas.map(mascota => mascota.especie))];
    return especies.filter(especie => especie); // Filtrar valores nulos o vacíos
  };

  const obtenerEspecieMasComun = () => {
    if (mascotas.length === 0) return "N/A";
    
    const especiesConteo = {};
    mascotas.forEach(mascota => {
      const especie = mascota.especie?.toLowerCase();
      if (especie) {
        especiesConteo[especie] = (especiesConteo[especie] || 0) + 1;
      }
    });
    
    if (Object.keys(especiesConteo).length === 0) return "N/A";
    
    const especieMasComun = Object.keys(especiesConteo).reduce((a, b) =>
      especiesConteo[a] > especiesConteo[b] ? a : b
    );
    
    return especieMasComun.charAt(0).toUpperCase() + especieMasComun.slice(1);
  };

  const obtenerEspeciesConConteo = () => {
    const especiesConteo = {};
    
    mascotas.forEach(mascota => {
      const especie = mascota.especie?.toLowerCase();
      if (especie) {
        especiesConteo[especie] = (especiesConteo[especie] || 0) + 1;
      }
    });
    
    return Object.entries(especiesConteo)
      .map(([nombre, cantidad]) => ({ 
        nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1), 
        cantidad 
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10);
  };

  const obtenerDistribucionSexo = () => {
    const distribucion = { Macho: 0, Hembra: 0 };
    mascotas.forEach(mascota => {
      if (mascota.sexo && distribucion.hasOwnProperty(mascota.sexo)) {
        distribucion[mascota.sexo]++;
      }
    });
    return distribucion;
  };

  if (!token) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <FaUserMd className="logo-icon" />
            </div>
            <h1>Clínica Veterinaria</h1>
            <p>Sistema de Gestión</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          {!mostrarRegistro ? (
            <div className="login-form">
              <h2>Iniciar Sesión</h2>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="tu@email.com"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="btn-login"
              >
                <FaSignInAlt /> {loading ? "Cargando..." : "Iniciar Sesión"}
              </button>
              <p className="toggle-form">
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setMostrarRegistro(true)}
                  className="link-button"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
          ) : (
            <div className="login-form">
              <h2>Crear Cuenta</h2>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  value={regNombre}
                  onChange={(e) => setRegNombre(e.target.value)}
                  placeholder="Tu Nombre"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="tu@email.com"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Confirmar Contraseña</label>
                <input
                  type="password"
                  value={regPasswordConfirm}
                  onChange={(e) => setRegPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleRegistro}
                disabled={loading}
                className="btn-register"
              >
                <FaUserPlus /> {loading ? "Cargando..." : "Registrarse"}
              </button>
              <p className="toggle-form">
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setMostrarRegistro(false)}
                  className="link-button"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          )}

          <div className="credentials-info">
            <p><strong>Credenciales de prueba:</strong></p>
            <p>Email: admin@clinica.com</p>
            <p>Contraseña: 123456</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <FaUserMd className="logo-icon" />
            <div>
              <h3>Clínica Veterinaria</h3>
              <p>Sistema de Gestión</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${seccionActual === "pacientes" ? "active" : ""}`}
            onClick={() => setSeccionActual("pacientes")}
          >
            <FaUsers /> Pacientes
          </button>
          <button
            className={`nav-item ${seccionActual === "reservaciones" ? "active" : ""}`}
            onClick={() => setSeccionActual("reservaciones")}
          >
            <FaCalendar /> Reservaciones
          </button>
          <button
            className={`nav-item ${seccionActual === "petshop" ? "active" : ""}`}
            onClick={() => setSeccionActual("petshop")}
          >
            <FaShoppingBag /> Petshop
          </button>
          <button
            className={`nav-item ${seccionActual === "reportes" ? "active" : ""}`}
            onClick={() => {
              setSeccionActual("reportes");
              fetchEstadisticas();
            }}
          >
            <FaChartBar /> Reportes
          </button>
          <button
            className={`nav-item ${seccionActual === "configuracion" ? "active" : ""}`}
            onClick={() => setSeccionActual("configuracion")}
          >
            <FaCog /> Configuración
          </button>
        </nav>

        <button onClick={handleLogout} className="btn-logout">
          <FaDoorOpen /> Cerrar Sesión
        </button>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <h1>Bienvenido otra vez, {usuario?.nombre_completo}</h1>
          <div className="header-user">
            <span className="user-role">{usuario?.rol}</span>
            <span className="user-name"><FaUsers /> {usuario?.nombre_completo}</span>
          </div>
        </header>

        <div className="content">
          {error && <div className="error-message">{error}</div>}

          {seccionActual === "pacientes" && (
            <section className="section">
              <div className="section-header">
                <h2>Gestión de Pacientes</h2>
              </div>

              <div className="form-section">
                <h3>Registrar nueva mascota</h3>
                <div className="form-two-columns">
                  <div className="form-column">
                    <h4><FaPaw /> Información de la Mascota</h4>
                    <div className="form-group">
                      <label>Nombre de la Mascota</label>
                      <input
                        type="text"
                        value={nuevaMascota.nombre}
                        onChange={(e) => setNuevaMascota({...nuevaMascota, nombre: e.target.value})}
                        placeholder="Ej: Max"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Especie</label>
                      <input
                        type="text"
                        value={nuevaMascota.especie}
                        onChange={(e) => setNuevaMascota({...nuevaMascota, especie: e.target.value})}
                        placeholder="Ej: Perro, Gato, etc."
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Edad (años)</label>
                      <input
                        type="number"
                        value={nuevaMascota.edad}
                        onChange={(e) => setNuevaMascota({...nuevaMascota, edad: e.target.value})}
                        placeholder="Ej: 3"
                        disabled={loading}
                        min="0"
                        max="30"
                      />
                    </div>
                    <div className="form-group">
                      <label>Sexo</label>
                      <select
                        value={nuevaMascota.sexo}
                        onChange={(e) => setNuevaMascota({...nuevaMascota, sexo: e.target.value})}
                        disabled={loading}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Macho">Macho</option>
                        <option value="Hembra">Hembra</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-column">
                    <h4><FaUser /> Información del Dueño</h4>
                    <div className="form-group">
                      <label>Nombre Completo</label>
                      <input
                        type="text"
                        value={nuevoDueño.nombre_completo}
                        onChange={(e) => setNuevoDueño({...nuevoDueño, nombre_completo: e.target.value})}
                        placeholder="Ej: Juan Pérez"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        value={nuevoDueño.telefono}
                        onChange={(e) => setNuevoDueño({...nuevoDueño, telefono: e.target.value})}
                        placeholder="Ej: +1234567890"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={nuevoDueño.email}
                        onChange={(e) => setNuevoDueño({...nuevoDueño, email: e.target.value})}
                        placeholder="Ej: juan@email.com"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCreateMascota}
                  disabled={loading}
                  className="btn-create"
                >
                  <FaPlus /> {loading ? "Registrando..." : "Registrar Mascota"}
                </button>
              </div>

              <div className="table-section">
                <h3>Mascotas registradas ({mascotas.length})</h3>
                {loading && mascotas.length === 0 ? (
                  <p className="loading">Cargando mascotas...</p>
                ) : mascotas.length === 0 ? (
                  <p className="no-data">No hay mascotas registradas</p>
                ) : (
                  <div className="table-responsive">
                    <table className="patients-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Mascota</th>
                          <th>Especie</th>
                          <th>Edad</th>
                          <th>Sexo</th>
                          <th>Dueño</th>
                          <th>Teléfono</th>
                          <th>Email</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mascotas.map((mascota) => (
                          <tr key={mascota.id}>
                            <td>{mascota.id}</td>
                            <td>
                              <div className="pet-info">
                                <span className="pet-name">{mascota.nombre}</span>
                              </div>
                            </td>
                            <td>
                              <span className={`especie-badge ${mascota.especie?.toLowerCase()}`}>
                                {mascota.especie}
                              </span>
                            </td>
                            <td>{mascota.edad} años</td>
                            <td>
                              <span className={`sexo-badge ${mascota.sexo?.toLowerCase()}`}>
                                <FaVenusMars /> {mascota.sexo}
                              </span>
                            </td>
                            <td>
                              <div className="owner-info">
                                <FaUser /> {mascota.nombre_dueño}
                              </div>
                            </td>
                            <td>
                              <div className="contact-info">
                                <FaPhone /> {mascota.telefono}
                              </div>
                            </td>
                            <td>
                              <div className="contact-info">
                                <FaEnvelope /> {mascota.email_dueño}
                              </div>
                            </td>
                            <td className="actions">
                              <button
                                onClick={() => handleUpdateMascota(mascota.id, mascota)}
                                className="btn-edit"
                                disabled={loading}
                                title="Editar mascota"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDeleteMascota(mascota.id)}
                                className="btn-delete"
                                disabled={loading}
                                title="Eliminar mascota"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}

          {seccionActual === "configuracion" && (
            <section className="section">
              <div className="section-header">
                <h2>Configuración</h2>
              </div>
              <div className="config-card">
                <h3>Perfil del Usuario</h3>
                
                {!modoEdicion ? (
                  <>
                    <div className="profile-info">
                      <div className="info-group">
                        <label>Nombre Completo</label>
                        <p>{usuario?.nombre_completo}</p>
                      </div>
                      <div className="info-group">
                        <label>Email</label>
                        <p>{usuario?.email}</p>
                      </div>
                      <div className="info-group">
                        <label>Rol</label>
                        <p>{usuario?.rol}</p>
                      </div>
                    </div>
                    <button 
                      className="btn-edit-profile"
                      onClick={() => {
                        setEditNombre(usuario?.nombre_completo);
                        setEditEmail(usuario?.email);
                        setModoEdicion(true);
                      }}
                    >
                      Editar Perfil
                    </button>
                  </>
                ) : (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Nombre Completo</label>
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        placeholder="Tu nombre completo"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="tu@email.com"
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="password-section">
                      <h4>Cambiar Contraseña (Opcional)</h4>
                      <div className="form-group">
                        <label>Contraseña Actual</label>
                        <input
                          type="password"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          placeholder="••••••••"
                          disabled={loading}
                        />
                      </div>
                      <div className="form-group">
                        <label>Nueva Contraseña</label>
                        <input
                          type="password"
                          value={editPasswordNew}
                          onChange={(e) => setEditPasswordNew(e.target.value)}
                          placeholder="••••••••"
                          disabled={loading}
                        />
                      </div>
                      <div className="form-group">
                        <label>Confirmar Nueva Contraseña</label>
                        <input
                          type="password"
                          value={editPasswordConfirm}
                          onChange={(e) => setEditPasswordConfirm(e.target.value)}
                          placeholder="••••••••"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="button-group">
                      <button 
                        className="btn-save"
                        onClick={handleActualizarPerfil}
                        disabled={loading}
                      >
                        {loading ? "Guardando..." : "Guardar Cambios"}
                      </button>
                      <button 
                        className="btn-cancel"
                        onClick={() => {
                          setModoEdicion(false);
                          setEditPassword("");
                          setEditPasswordNew("");
                          setEditPasswordConfirm("");
                        }}
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {seccionActual === "reportes" && (
            <section className="section">
              <div className="section-header">
                <h2>Reportes y Estadísticas</h2>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaPaw />
                  </div>
                  <div className="stat-content">
                    <h4>Total de Mascotas</h4>
                    <p className="stat-number">{mascotas.length}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaPlus />
                  </div>
                  <div className="stat-content">
                    <h4>Mascotas Este Mes</h4>
                    <p className="stat-number">{calcularMascotasEsteMes()}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaBars />
                  </div>
                  <div className="stat-content">
                    <h4>Especies Diferentes</h4>
                    <p className="stat-number">{obtenerEspeciesUnicas().length}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FaChartLine />
                  </div>
                  <div className="stat-content">
                    <h4>Especie Más Común</h4>
                    <p className="stat-number">{obtenerEspecieMasComun()}</p>
                  </div>
                </div>
              </div>

              {/* Estadísticas avanzadas */}
              {estadisticas && (
                <div className="advanced-stats">
                  <div className="stats-row">
                    <div className="stat-chart">
                      <h3>Distribución por Sexo</h3>
                      <div className="chart-container">
                        {estadisticas.distribucionSexo && estadisticas.distribucionSexo.length > 0 ? (
                          <div className="pie-chart">
                            {estadisticas.distribucionSexo.map((item, index) => (
                              <div key={index} className="pie-item">
                                <span className="pie-label">{item.sexo}</span>
                                <span className="pie-value">{item.cantidad}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bar-chart">
                            {Object.entries(obtenerDistribucionSexo()).map(([sexo, cantidad]) => (
                              <div key={sexo} className="bar-item">
                                <div className="bar-label">{sexo}</div>
                                <div className="bar-wrapper">
                                  <div
                                    className="bar"
                                    style={{
                                      width: `${(cantidad / Math.max(...Object.values(obtenerDistribucionSexo()))) * 100}%`
                                    }}
                                  >
                                    <span className="bar-value">{cantidad}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="stat-chart">
                      <h3>Distribución por Edad</h3>
                      <div className="chart-container">
                        {estadisticas.distribucionEdad && estadisticas.distribucionEdad.length > 0 ? (
                          <div className="bar-chart">
                            {estadisticas.distribucionEdad.map((grupo, index) => (
                              <div key={index} className="bar-item">
                                <div className="bar-label">{grupo.grupo_edad}</div>
                                <div className="bar-wrapper">
                                  <div
                                    className="bar"
                                    style={{
                                      width: `${(grupo.cantidad / Math.max(...estadisticas.distribucionEdad.map(g => g.cantidad))) * 100}%`
                                    }}
                                  >
                                    <span className="bar-value">{grupo.cantidad}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="no-data">No hay datos de edad</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="report-section">
                <h3>Especies Más Comunes</h3>
                <div className="chart-container">
                  {mascotas.length > 0 ? (
                    <div className="bar-chart">
                      {obtenerEspeciesConConteo().map((especie, index) => (
                        <div key={index} className="bar-item">
                          <div className="bar-label">{especie.nombre}</div>
                          <div className="bar-wrapper">
                            <div
                              className="bar"
                              style={{
                                width: `${(especie.cantidad / Math.max(...obtenerEspeciesConConteo().map(e => e.cantidad))) * 100}%`
                              }}
                            >
                              <span className="bar-value">{especie.cantidad}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No hay datos para mostrar</p>
                  )}
                </div>
              </div>

              <div className="report-section">
                <h3>Últimas Mascotas Registradas</h3>
                {mascotas.length > 0 ? (
                  <div className="table-responsive">
                    <table className="report-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Mascota</th>
                          <th>Especie</th>
                          <th>Edad</th>
                          <th>Sexo</th>
                          <th>Dueño</th>
                          <th>Fecha Registro</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mascotas.slice(-10).reverse().map((mascota) => (
                          <tr key={mascota.id}>
                            <td>#{mascota.id}</td>
                            <td>{mascota.nombre}</td>
                            <td>
                              <span className={`especie-badge ${mascota.especie?.toLowerCase()}`}>
                                {mascota.especie}
                              </span>
                            </td>
                            <td>{mascota.edad} años</td>
                            <td>
                              <span className={`sexo-badge ${mascota.sexo?.toLowerCase()}`}>
                                {mascota.sexo}
                              </span>
                            </td>
                            <td>{mascota.nombre_dueño}</td>
                            <td>
                              {mascota.fecha_creacion ? 
                                new Date(mascota.fecha_creacion).toLocaleDateString() : 
                                'N/A'
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="no-data">No hay mascotas registradas</p>
                )}
              </div>
            </section>
          )}

          {(seccionActual === "reservaciones" ||
            seccionActual === "petshop") && (
            <section className="section">
              <div className="development-message">
                <h2>Sección en Desarrollo</h2>
                <p>
                  La sección de{" "}
                  <strong>
                    {seccionActual === "reservaciones" && "Reservaciones"}
                    {seccionActual === "petshop" && "Petshop"}
                  </strong>{" "}
                  está siendo desarrollada.
                </p>
                <p>Vuelve pronto para ver nuevas funcionalidades.</p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;