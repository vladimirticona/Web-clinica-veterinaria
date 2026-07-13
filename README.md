# 🐾 Sistema de Gestión Clínica Veterinaria - Mis Patitas

## 🎯 Resumen 

### El Problema

Actualmente, la clínica veterinaria "Mis Patitas" gestiona todos sus procesos en **papel**:
- 📄 Registros manuales de pacientes
- 📦 Inventario sin control digital
- 📅 Sistema de citas desorganizado
- 
Esto genera:
- ❌ Ineficiencias operativas
- ❌ Riesgo de pérdida de información
- ❌ Lentitud en la atención
- ❌ Dificultad para escalar

### La Solución
Una plataforma web moderna que **centraliza y automatiza** todos los procesos:
- ✅ Gestión integral de las mascotas y dueños
- ✅ Control digital de inventario
- ✅ Sistema de agendación de citas
- ✅ Panel de análisis y reportes

## 🚀 Características

### 👥 Gestión de Pacientes
- Registro completo de mascotas y dueños
- Edición y eliminación de registros
- Información de contacto del dueño
- Productos adicionales asociados

### 📅 Sistema de Citas
- Agendación de citas veterinarias
- Gestión de estado (pendiente, confirmada, cancelada, reprogramar)
- Opciones de cita presencial o domicilio
- Productos adicionales asociados

### 📦 Gestión de Petshop
- Inventario digital en tiempo real
- Alertas de stock bajo
- Control de precios y cantidades

### 📊 Panel de Estadísticas
- Gráficos de especies más comunes
- Distribución por sexo y edad
- Tendencias de reservaciones
- Estado de productos con stock bajo
- Reportes mensuales y anuales

### 🔐 Autenticación y Seguridad
- Login seguro con JWT
- Registro de nuevos usuarios
- Cambio de contraseña
- Tokens con expiración automática

## 💻 Tecnologías

### Frontend
```
React          - Librería UI moderna
HTML           - Estructura
CSS            - Estilos avanzados
JavaScript     - Lógica de cliente
React Icons    - Iconografía
Axios          - Cliente HTTP
```

### Backend
```
Node.js        - Runtime JavaScript
Express.js     - Framework web
JWT            - Autenticación segura
Bcryptjs       - Encriptación de contraseñas
Arquitectura Hexagonal (Ports & Adapters)
```

### Base de Datos
```
MySQL          - BD relacional

```

### DevOps & Control
```
Git/GitHub     - Control de versiones
XAMPP          - Servidor local (desarrollo)
Docker         - Contenedorización
Kubernetes/Minikube - Orquestación
GitHub Actions - CI/CD pipeline
ArgoCD         - GitOps y despliegue continuo
Prometheus/Grafana - Observabilidad
```

---

## 📦 Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- MySQL (v5.7 o superior)
- Git
- XAMPP (para desarrollo local)

### 1. Clonar Repositorio

```bash
git clone https://github.com/vladimirticona/Web-clinica-veterinaria.git
cd Web-clinica-veterinaria
git checkout feat/setup-ci
```

### 2. Configurar Base de Datos

- Abrir XAMPP e iniciar MySQL
- Ir a `http://localhost/phpmyadmin`
- Crear base de datos llamada `db_pruebas`
- Importar el archivo de nuestra carpeta `database/schema.sql`

### 3. Configurar Backend

```bash
cd backend
npm install
npm start
```

### 4. Configurar Frontend

```bash
cd frontend/vite-project
npm install
npm run dev
```

### 5. Acceder a la Aplicación

- **Aplicación**: http://localhost:5173/
- **Base de Datos**: http://localhost/phpmyadmin

---

## 🎮 Cómo Usar

### Primer Inicio

1. **Crear Cuenta**
   - Haz clic en "Regístrate aquí"
   - Completa: nombre, email, contraseña
   - ¡Listo! Tu cuenta fue creada

2. **Iniciar Sesión**
   - Email: tu@email.com
   - Contraseña: tu_contraseña
   - Acceso a todos los módulos

3. **Gestionar Pacientes**
   - Ve a "Pacientes" llena 
   - Completa datos de mascota y dueño
   - Opcionalmente, selecciona productos adicionales
   - Haz clic en "Registrar nueva mascota"
   - ¡Registro completado!

4. **Agendar Citas**
   - Ve a "Reservaciones"
   - Completa datos del cliente y mascota
   - Selecciona fecha y hora
   - Elige tipo de cita (presencial/domicilio)
   - Haz clic en "Nueva Reservación"
   - ¡Cita agendada!

5. **Gestionar Inventario**
   - Ve a "Petshop"
   - Ingresa: nombre, precio, cantidad
   - Haz clic en "Agregar Nuevo Producto"
   - ¡Producto agregado!

6. **Ver Reportes**
   - Ve a "Reportes"
   - Visualiza gráficos de estadísticas de los datos mas importantes en general
---

---

## 📊 Objetivos Alcanzados

| Objetivo | Estado | Resultado |
|----------|--------|-----------|
| Digitalizar 100% procesos | ✅ | Completado |
| Reducir 60% tiempo de gestión | ✅ | En validación |
| Minimizar errores humanos | ✅ | Validación de datos |
| Datos en tiempo real | ✅ | Dashboard actualizado |

---

## 📈 Métricas del Proyecto

- **Módulos Implementados**: 6
- **Endpoints de API**: +10
- **Tablas en BD**: 5
- **Usuarios Simultáneos**: ∞ (escalable)
- **Tiempo de Respuesta**: < 200ms


**Hecho con ❤️ para la clínica veterinaria "Mis Patitas"**

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
