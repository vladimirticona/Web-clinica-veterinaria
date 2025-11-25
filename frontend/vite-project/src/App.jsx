import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:3000/pacientes/"

const App = () => {
  const [items, setItems] = useState([]);
  const [newNombrem, setNewNombrem] = useState("");
  const [newRaza, setNewRaza] = useState("");
  const [newNombred, setNewNombred] = useState("");

  useEffect(()=> {
    axios.get(`${BASE_URL}`)
    .then((response)=>{
      setItems(response.data)
      console.log(response.data)
    })
    .catch((error)=>{
      console.error("Error al obtener los items: ", error)
    })
  }, []);

  const  handleCreate = () => {
    if(newNombrem.trim() && newRaza.trim()){
      axios.post(`${BASE_URL}add`, {
        nombre_mascota: newNombrem,
        raza: newRaza,
        nombre_dueño: newNombred
      })
      .then((response) => {
        setItems((prevItems) => [...prevItems, response.data]);
        setNewNombrem("");
        setNewRaza("");
        setNewNombred("");
      })
      .catch((error) => {
        console.error("Error al crear el item", error);
      })
    }
  };
  const handleDelete = (id) => {
    axios.delete(`${BASE_URL}delete/${id}`)
    .then(() => {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    })
    .catch((error) => {
      console.error("Error al eliminar el item: ", error);
    })
  };

  const handleUpdate = (id, nombre_mascota, raza, nombre_dueño) => {
    const newNombrem = prompt("Nuevo nombre de mascota: ", nombre_mascota);
    const newRaza = prompt("Nueva raza: ", raza);
    const newNombred = prompt("Nuevo nombre de dueño: ", nombre_dueño);

    if(newNombrem !== nombre_mascota && newRaza !== raza && newNombred !== nombre_dueño){
      axios.put(`${BASE_URL}update/${id}`, {
        nombre_mascota: newNombrem,
        raza: newRaza,
        nombre_dueño: newNombred
      })
      .then(() => {
        setItems((prevItems)=>{
          prevItems.map((item)=>{
            item.id === id ? { ...item, nombre_mascota: newNombrem, raza: newRaza, nombre_dueño: newNombred } : item
          })
        });
      })
      .catch((error)=>{
        console.error("Error al actualizar el item: ", error);
      })
    }
    
  };

  return(
    <div>
      <h1>Clinica Veterinaria</h1>
      <input 
      type="text"
      value={newNombrem}
      onChange={(e) => setNewNombrem(e.target.value)}
      placeholder="Nombre_mascota"
      />

      <input 
      type="text"
      value={newRaza}
      onChange={(e) => setNewRaza(e.target.value)}
      placeholder="Raza"
      />

      <input 
      type="text"
      value={newNombred}
      onChange={(e) => setNewNombred(e.target.value)}
      placeholder="Nombre_dueño"
      />

      <button onClick={handleCreate}> Crear </button>

      <ul>
        {items.map((item)=>(
          <li key={item.id}>
            <span style={{marginRight: '10px'}}>{item.id}</span>
            <span style={{marginRight: '10px'}}>{item.nombre_mascota}</span>
            <span style={{marginRight: '10px'}}>{item.raza}</span>
            <span style={{marginRight: '10px'}}>{item.nombre_dueño}</span>
            <button onClick={()=> handleUpdate(item.id, item.nombre_mascota, item.raza,item.nombre_dueño)}> Actualizar</button>
            <button onClick={()=> handleDelete(item.id)}> Eliminar</button>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default App;