const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_pruebas'
})

db.connect(err => {
    if(err){
        console.error('Error de conexion'+err.stack)
        return
    }
    console.log('Conectado a la base de datos')
})

app.get('/pacientes',(req,res) => {
    db.query('SELECT * FROM pacientes', (err,results) => {
        if(err){
            res.status(500).send({
                error: 'Error al obtener los pacientes'
            })
        }else{
            res.json(results)
        }
    })
})

app.post('/pacientes/add', (req, res) => {
    const {nombre_mascota, raza, nombre_dueño} = req.body

    const query = 'INSERT INTO pacientes (nombre_mascota, raza, nombre_dueño) VALUES(?,?,?)'

    db.query(query, [nombre_mascota,raza,nombre_dueño], (err, results) => {
        if(err) {
            res.status(500).send({
                error: 'Error al crear el paciente'
            })
        }else{
            res.status(201).json({
                id: results.insertId,
                nombre_mascota,
                raza,
                nombre_dueño
            })
        }
    })
})

app.put('/pacientes/update/:id', (req, res) => {
    const { id } = req.params
    const { nombre_mascota, raza, nombre_dueño} = req.body

    const query = 'UPDATE pacientes SET nombre_mascota=?, raza=?, nombre_dueño=? WHERE id=?'

    db.query(query, [nombre_mascota, raza, nombre_dueño], (err, results) => {
        if(err){
            res.status(500).send({
                error: 'Error al actualizar el paciente'
            })
        }else{
            res.json({
                id,
                nombre_mascota,
                raza,
                nombre_dueño
            })
        }
    })
})


app.delete('/pacientes/delete/:id', (req, res) => {
    const { id } = req.params

    const query = 'DELETE FROM pacientes WHERE id=?'

    db.query(query, [id], (err, results) => {
        if(err){
            res.status(500).send({
                error: 'Error al eliminar el paciente'
            })
        }else{
            res.status(204).send()
        }
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto ${PORT}')
})