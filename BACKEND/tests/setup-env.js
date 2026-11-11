// Variables de entorno para las pruebas. Jest ejecuta este archivo ANTES
// de cargar el código, así que estos valores ganan sobre BACKEND/.env
// (dotenv no reemplaza variables que ya existen).
// Apunta a la BD del docker-compose (puerto 15443), no a un Postgres local.
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:15443/cuidarteplus";

// Clave solo para pruebas: firma y verifica los tokens dentro del mismo proceso.
process.env.JWT_SECRET = "clave-solo-para-pruebas";
