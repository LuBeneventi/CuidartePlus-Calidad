# CuidartePlus - Backend

API REST en Node.js (Express) con PostgreSQL para el sistema de gestión de exámenes médicos CuidartePlus. Desarrollado intencionalmente con vulnerabilidades para fines académicos (asignatura ISY1102).

## Requisitos
- Node.js 18+
- PostgreSQL 13+

## Instalación
```bash
npm install
```

## Base de datos
1. Crear base de datos local (si no existe):
   ```sql
   CREATE DATABASE cuidarteplus;
   ```
2. Ejecutar script de tablas y datos iniciales:
   ```sql
   \c cuidarteplus
   \i sql/init.sql
   ```
3. Conexión por defecto: `postgres://postgres:postgres@localhost:5432/cuidarteplus`
   - Puedes cambiarla con la variable de entorno `DATABASE_URL` en el archivo `.env`.

## Ejecutar
```bash
npm run start
```
- API disponible en: `http://localhost:4445`
- Estado del servidor: `GET /`
- Swagger UI: `http://localhost:4445/docs`
- OpenAPI JSON: `http://localhost:4445/openapi.json`

## Autenticación
El sistema usa JWT (JSON Web Tokens) con expiración de 2 horas.

- **Login:** `POST /autenticacion/login`
  ```json
  { "nombre_usuario": "admin", "password": "admin" }
  ```
- **Respuesta:** `{ "token": "eyJhbGci..." }`
- El token incluye: `usuarioId`, `nombreUsuario`, `rolId`, `rolNombre`, `pacienteId`, `roles`
- Todos los endpoints protegidos requieren el header:
  ```
  Authorization: Bearer <token>
  ```

## Endpoints

### Autenticación — `/autenticacion`
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/autenticacion/login` | Iniciar sesión, obtener token JWT |
| POST | `/autenticacion/registro` | Registrar nuevo usuario con rol paciente |

### Usuarios — `/usuarios`
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/usuarios` | Crear usuario (requiere token) |
| GET | `/usuarios` | Listar todos los usuarios (requiere token) |
| GET | `/usuarios/:id` | Obtener usuario por ID (requiere token) |
| PUT | `/usuarios/:id` | Actualizar usuario (requiere token) |
| DELETE | `/usuarios/:id` | Eliminar usuario (requiere token) |

Campos: `nombre_usuario`, `contrasena_hash`, `correo`, `rol_id`

### Pacientes — `/pacientes`
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/pacientes` | Crear paciente (admin/médico) |
| GET | `/pacientes` | Listar pacientes (admin/médico) |
| GET | `/pacientes/:id` | Obtener paciente por ID |
| GET | `/pacientes/buscar/rut/:rut` | Buscar paciente por RUT |
| PUT | `/pacientes/:id` | Actualizar datos del paciente |
| DELETE | `/pacientes/:id` | Eliminar paciente (admin) |

### Exámenes Médicos — `/examenes`
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/examenes` | Crear examen médico |
| GET | `/examenes` | Listar exámenes (admin/médico) |
| GET | `/examenes/:id` | Obtener examen por ID |
| GET | `/examenes/paciente/:paciente_id` | Listar exámenes de un paciente |
| PUT | `/examenes/:id` | Actualizar examen |
| DELETE | `/examenes/:id` | Eliminar examen |

### Documentos — `/documentos`
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/documentos` | Subir documentos adjuntos a un examen (multipart, campo `documentos`) |
| GET | `/documentos/examen/:examen_id` | Listar documentos de un examen |
| GET | `/documentos/:id` | Obtener documento por ID |
| DELETE | `/documentos/:id` | Eliminar documento |

### Tipos de Examen — `/tipo-examen`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/tipo-examen` | Listar todos los tipos de examen disponibles |
| GET | `/tipo-examen/:id` | Obtener tipo de examen por ID |

### Auditoría — `/auditoria`
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auditoria` | Registrar evento de auditoría |
| GET | `/auditoria` | Listar eventos de auditoría (admin) |

### Roles — `/roles`
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/roles` | Crear rol |
| GET | `/roles` | Listar roles |
| GET | `/roles/:id` | Obtener rol por ID |
| PUT | `/roles/:id` | Actualizar rol |
| DELETE | `/roles/:id` | Eliminar rol |

Roles disponibles por defecto: `admin`, `medico`, `paciente`

## Notas
- Contraseñas almacenadas en texto plano a propósito (vulnerabilidad académica intencionada).
- Sin mitigaciones contra XSS, SQLi ni otros ataques (entorno académico).
- El sistema es **JWT stateless**: no existe endpoint de logout. El cierre de sesión ocurre en el cliente al descartar el token. Los tokens expiran automáticamente a las 2 horas.
- Todos los errores retornan el formato: `{ "error": "mensaje corto", "glosa": "detalle del error" }`.
- Los archivos de documentos se almacenan en el sistema de archivos local bajo `uploads/documentos/`.

