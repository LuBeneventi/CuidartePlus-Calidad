const { Pool } = require("pg");
require("dotenv").config();
// La conexión SIEMPRE viene de una variable de entorno.
// Nunca se escribe una contraseña dentro del código.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
throw new Error("Falta la variable de entorno DATABASE_URL");
}
const pool = new Pool({ connectionString });
module.exports = { pool };