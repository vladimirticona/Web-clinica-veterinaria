/**
 * @fileoverview Componente principal con Dashboard y React Icons
 * @description Incluye login, dashboard con sidebar y gestión de pacientes
 * @version 2.0.0
 * @author dev.ticma
 */

import { useState, useEffect } from "react";
import axios from "axios";
import { FaUsers, FaCalendar, FaShoppingBag, FaChartBar, FaCog, FaDoorOpen, FaUserMd, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import "./Dashboard.css";

const BASE_URL = "http://127.0.0.1:3000";

/**
 * Componente principal de la aplicación
 * @component
 * @returns {React.ReactElement} Aplicación con login y dashboard
 */
const App = () => {
  // ============================================
  // ESTADOS - AUTENTICACIÓN
  // ============================================
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  // ============================================
  // ESTADOS - REGISTRO
  // ============================================
  const [regNombre, setRegNombre] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");

  // ============================================
  // ESTADOS - DASHBOARD
  // ============================================
  const [seccionActual, setSeccionActual] = useState("pacientes");
  const [items, setItems] = useState([]);
  const [newNombrem, setNewNombrem] = useState("");
  const [newRaza, setNewRaza] = useState("");
  const [newNombred, setNewNombred] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================
  // EFECTOS
  // ============================================
  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("usuario");
      if (storedUser) {
        setUsuario(JSON.parse(storedUser));
        fetchPacientes();
      }
    }
  }, [token]);

  // ============================================
  // FUNCIONES - PACIENTES
  // ============================================

  /**
   * Obtiene la lista de pacientes
   * @async
   */
  const fetchPacientes = () => {
    setLoading(true);
    setError("");
    axios
      .get(`${BASE_URL}/pacientes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        setError("Error al obtener los pacientes");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Crea un nuevo paciente
   * @async
   */
  const handleCreate = () => {
    if (!newNombrem.trim() || !newRaza.trim() || !newNombred.trim()) {
      setError("Todos los campos son requeridos");
      return;
    }

    setLoading(true);
    setError("");
    axios
      .post(
        `${BASE_URL}/pacientes/add`,
        {
          nombre_mascota: newNombrem,
          raza: newRaza,
          nombre_dueño: newNombred
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then((response) => {
        setItems((prevItems) => [...prevItems, response.data]);
        setNewNombrem("");
        setNewRaza("");
        setNewNombred("");
      })
      .catch((error) => {
        setError("Error al crear el paciente");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Elimina un paciente
   * @async
   * @param {number} id - ID del paciente
   */
  const handleDelete = (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este paciente?")) {
      return;
    }

    setLoading(true);
    setError("");
    axios
      .delete(`${BASE_URL}/pacientes/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      })
      .catch((error) => {
        setError("Error al eliminar el paciente");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Actualiza un paciente
   * @async
   * @param {number} id - ID del paciente
   * @param {string} nombre_mascota - Nombre de la mascota
   * @param {string} raza - Raza
   * @param {string} nombre_dueño - Nombre del dueño
   */
  const handleUpdate = (id, nombre_mascota, raza, nombre_dueño) => {
    const newNombrem = prompt("Nuevo nombre de mascota:", nombre_mascota);
    if (newNombrem === null) return;

    const newRaza = prompt("Nueva raza:", raza);
    if (newRaza === null) return;

    const newNombred = prompt("Nuevo nombre de dueño:", nombre_dueño);
    if (newNombred === null) return;

    setLoading(true);
    setError("");
    axios
      .put(
        `${BASE_URL}/pacientes/update/${id}`,
        {
          nombre_mascota: newNombrem,
          raza: newRaza,
          nombre_dueño: newNombred
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(() => {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id
              ? {
                  ...item,
                  nombre_mascota: newNombrem,
                  raza: newRaza,
                  nombre_dueño: newNombred
                }
              : item
          )
        );
      })
      .catch((error) => {
        setError("Error al actualizar el paciente");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ============================================
  // FUNCIONES - AUTENTICACIÓN
  // ============================================

  /**
   * Realiza el login
   * @async
   */
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

  /**
   * Registra un nuevo usuario
   * @async
   */
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

  /**
   * Cierra la sesión
   */
  const handleLogout = () => {
    setToken(null);
    setUsuario(null);
    setItems([]);
    setSeccionActual("pacientes");
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  // ============================================
  // RENDERIZADO - LOGIN
  // ============================================

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

  // ============================================
  // RENDERIZADO - DASHBOARD
  // ============================================

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
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
            onClick={() => setSeccionActual("reportes")}
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

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* HEADER */}
        <header className="top-header">
          <h1>Bienvenido otra vez, {usuario?.nombre_completo}</h1>
          <div className="header-user">
            <span className="user-role">{usuario?.rol}</span>
            <span className="user-name"><FaUsers /> {usuario?.nombre_completo}</span>
          </div>
        </header>

        {/* CONTENIDO */}
        <div className="content">
          {error && <div className="error-message">{error}</div>}

          {/* SECCIÓN PACIENTES */}
          {seccionActual === "pacientes" && (
            <section className="section">
              <div className="section-header">
                <h2>Gestión de Pacientes</h2>
                <button className="btn-primary">+ Nuevo Paciente</button>
              </div>

              <div className="form-section">
                <h3>Registrar nuevo paciente</h3>
                <div className="input-group">
                  <input
                    type="text"
                    value={newNombrem}
                    onChange={(e) => setNewNombrem(e.target.value)}
                    placeholder="Nombre de la mascota"
                    disabled={loading}
                  />
                  <input
                    type="text"
                    value={newRaza}
                    onChange={(e) => setNewRaza(e.target.value)}
                    placeholder="Raza"
                    disabled={loading}
                  />
                  <input
                    type="text"
                    value={newNombred}
                    onChange={(e) => setNewNombred(e.target.value)}
                    placeholder="Nombre del dueño"
                    disabled={loading}
                  />
                  <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="btn-create"
                  >
                    {loading ? "Cargando..." : "➕ Crear"}
                  </button>
                </div>
              </div>

              <div className="table-section">
                <h3>Pacientes registrados ({items.length})</h3>
                {loading && items.length === 0 ? (
                  <p className="loading">Cargando pacientes...</p>
                ) : items.length === 0 ? (
                  <p className="no-data">No hay pacientes registrados</p>
                ) : (
                  <div className="table-responsive">
                    <table className="patients-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Mascota</th>
                          <th>Raza</th>
                          <th>Dueño</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.nombre_mascota}</td>
                            <td>{item.raza}</td>
                            <td>{item.nombre_dueño}</td>
                            <td className="actions">
                              <button
                                onClick={() =>
                                  handleUpdate(
                                    item.id,
                                    item.nombre_mascota,
                                    item.raza,
                                    item.nombre_dueño
                                  )
                                }
                                className="btn-edit"
                                disabled={loading}
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="btn-delete"
                                disabled={loading}
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

          {/* SECCIÓN CONFIGURACIÓN */}
          {seccionActual === "configuracion" && (
            <section className="section">
              <div className="section-header">
                <h2>Configuración</h2>
              </div>
              <div className="config-card">
                <h3>Perfil del Usuario</h3>
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
              </div>
            </section>
          )}

          {/* SECCIONES EN DESARROLLO */}
          {(seccionActual === "reservaciones" ||
            seccionActual === "petshop" ||
            seccionActual === "reportes") && (
            <section className="section">
              <div className="development-message">
                <h2>Sección en Desarrollo</h2>
                <p>
                  La sección de{" "}
                  <strong>
                    {seccionActual === "reservaciones" && "Reservaciones"}
                    {seccionActual === "petshop" && "Petshop"}
                    {seccionActual === "reportes" && "Reportes"}
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