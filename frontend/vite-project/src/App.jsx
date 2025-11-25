import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const BASE_URL = "http://127.0.0.1:3000/pacientes/";

const App = () => {
  const [items, setItems] = useState([]);
  const [newNombrem, setNewNombrem] = useState("");
  const [newRaza, setNewRaza] = useState("");
  const [newNombred, setNewNombred] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar pacientes al montar el componente
  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = () => {
    setLoading(true);
    setError("");
    axios
      .get(BASE_URL)
      .then((response) => {
        setItems(response.data);
        console.log("Pacientes cargados:", response.data);
      })
      .catch((error) => {
        setError("Error al obtener los pacientes");
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCreate = () => {
    if (!newNombrem.trim() || !newRaza.trim() || !newNombred.trim()) {
      setError("Todos los campos son requeridos");
      return;
    }

    setLoading(true);
    setError("");
    axios
      .post(`${BASE_URL}add`, {
        nombre_mascota: newNombrem,
        raza: newRaza,
        nombre_dueño: newNombred,
      })
      .then((response) => {
        setItems((prevItems) => [...prevItems, response.data]);
        setNewNombrem("");
        setNewRaza("");
        setNewNombred("");
        console.log("Paciente creado:", response.data);
      })
      .catch((error) => {
        setError("Error al crear el paciente");
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este paciente?")) {
      return;
    }

    setLoading(true);
    setError("");
    axios
      .delete(`${BASE_URL}delete/${id}`)
      .then(() => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        console.log("Paciente eliminado:", id);
      })
      .catch((error) => {
        setError("Error al eliminar el paciente");
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
      .put(`${BASE_URL}update/${id}`, {
        nombre_mascota: newNombrem,
        raza: newRaza,
        nombre_dueño: newNombred,
      })
      .then(() => {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id
              ? { ...item, nombre_mascota: newNombrem, raza: newRaza, nombre_dueño: newNombred }
              : item
          )
        );
        console.log("Paciente actualizado:", id);
      })
      .catch((error) => {
        setError("Error al actualizar el paciente");
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container">
      <header>
        <h1>🏥 Clínica Veterinaria</h1>
        <p>Gestión de pacientes</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="form-section">
        <h2>Registrar nuevo paciente</h2>
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
          <button onClick={handleCreate} disabled={loading}>
            {loading ? "Cargando..." : "➕ Crear"}
          </button>
        </div>
      </div>

      <div className="list-section">
        <h2>Pacientes registrados ({items.length})</h2>
        {loading && items.length === 0 ? (
          <p className="loading">Cargando pacientes...</p>
        ) : items.length === 0 ? (
          <p className="no-data">No hay pacientes registrados</p>
        ) : (
          <ul className="pacientes-list">
            {items.map((item) => (
              <li key={item.id} className="paciente-card">
                <div className="paciente-info">
                  <div className="info-item">
                    <span className="label">ID:</span>
                    <span className="value">{item.id}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Mascota:</span>
                    <span className="value">{item.nombre_mascota}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Raza:</span>
                    <span className="value">{item.raza}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Dueño:</span>
                    <span className="value">{item.nombre_dueño}</span>
                  </div>
                </div>
                <div className="actions">
                  <button
                    onClick={() =>
                      handleUpdate(
                        item.id,
                        item.nombre_mascota,
                        item.raza,
                        item.nombre_dueño
                      )
                    }
                    className="btn-update"
                    disabled={loading}
                  >
                    ✏️ Actualizar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn-delete"
                    disabled={loading}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;