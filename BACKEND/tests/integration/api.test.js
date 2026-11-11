// Pruebas de INTEGRACIÓN: la API real (Express + rutas) contra la BD real de Docker.
// Requiere: docker compose up -d cuidarteplus-postgres-et  (puerto 15443)
// Nunca se borran los usuarios seed (1 admin, 2 medico, 3 paciente): solo usuarios temporales.
const request = require("supertest");
const app = require("../../src/app");
const { pool } = require("../../src/db");

async function login(nombre_usuario, password) {
  const res = await request(app).post("/autenticacion/login").send({ nombre_usuario, password });
  return res.body.token;
}

// Crea un usuario temporal (rol paciente) como admin y devuelve su id
async function crearUsuarioTemporal(tokenAdmin) {
  const sufijo = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const res = await request(app)
    .post("/usuarios")
    .set("Authorization", `Bearer ${tokenAdmin}`)
    .send({
      nombre_usuario: `temp_${sufijo}`,
      contrasena_hash: "temporal123",
      correo: `temp_${sufijo}@prueba.cl`,
      rol_id: 3,
    });
  expect(res.status).toBe(201);
  return res.body.id;
}

async function usuarioExiste(id) {
  const result = await pool.query("SELECT 1 FROM usuarios WHERE id = $1", [id]);
  return result.rows.length > 0;
}

let tokenAdmin;
let tokenPaciente;
const usuariosTemporales = [];

beforeAll(async () => {
  tokenAdmin = await login("admin", "admin");
  tokenPaciente = await login("paciente", "paciente");
});

afterAll(async () => {
  // Limpieza: borra solo los usuarios temporales que hayan quedado
  if (usuariosTemporales.length > 0) {
    await pool.query("DELETE FROM usuarios WHERE id = ANY($1::bigint[]) AND id > 3", [usuariosTemporales]);
  }
  await pool.end();
});

describe("Autenticación", () => {
  test("admin/admin → 200 y entrega un token", async () => {
    const res = await request(app)
      .post("/autenticacion/login")
      .send({ nombre_usuario: "admin", password: "admin" });
    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
  });

  test("contraseña equivocada → 401", async () => {
    const res = await request(app)
      .post("/autenticacion/login")
      .send({ nombre_usuario: "admin", password: "incorrecta" });
    expect(res.status).toBe(401);
  });

  test("body vacío → 400 (validación)", async () => {
    const res = await request(app).post("/autenticacion/login").send({});
    expect(res.status).toBe(400);
    expect(res.body.detalles.length).toBeGreaterThan(0);
  });
});

describe("Pacientes", () => {
  test("GET /pacientes sin token → 401", async () => {
    const res = await request(app).get("/pacientes");
    expect(res.status).toBe(401);
  });

  test("GET /pacientes con token admin → 200 y un arreglo", async () => {
    const res = await request(app).get("/pacientes").set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("Control de acceso en rutas que SÍ usan requireRole (contraste)", () => {
  test("admin DELETE /pacientes/999999 (inexistente) → 404", async () => {
    const res = await request(app)
      .delete("/pacientes/999999")
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.status).toBe(404);
  });

  test("paciente DELETE /examenes/999999 → 403", async () => {
    const res = await request(app)
      .delete("/examenes/999999")
      .set("Authorization", `Bearer ${tokenPaciente}`);
    expect(res.status).toBe(403);
  });
});

describe("DEF-01 – Control de acceso al eliminar usuarios", () => {
  test("un paciente NO puede eliminar usuarios → 403 y el usuario sigue existiendo", async () => {
    const id = await crearUsuarioTemporal(tokenAdmin);
    usuariosTemporales.push(id);

    const res = await request(app)
      .delete(`/usuarios/${id}`)
      .set("Authorization", `Bearer ${tokenPaciente}`);

    expect(res.status).toBe(403);
    expect(await usuarioExiste(id)).toBe(true);
  });

  test("sin token NO se pueden eliminar usuarios → 401 y el usuario sigue existiendo", async () => {
    const id = await crearUsuarioTemporal(tokenAdmin);
    usuariosTemporales.push(id);

    const res = await request(app).delete(`/usuarios/${id}`);

    expect(res.status).toBe(401);
    expect(await usuarioExiste(id)).toBe(true);
  });
});
