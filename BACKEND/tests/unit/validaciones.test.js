// Pruebas de CAJA NEGRA: particiones de equivalencia y valores límite.
// Solo se mira la entrada y la salida del esquema (válido / inválido).
const { loginSchema, registerSchema } = require("../../src/validations/auth");
const { examenMedicoSchema } = require("../../src/validations/examenes");

const texto = (n) => "a".repeat(n);

describe("loginSchema - nombre_usuario (3 a 50 caracteres)", () => {
  test.each([
    ["CN-01", "vacío", false, ""],
    ["CN-02", "bajo el mínimo (2)", false, texto(2)],
    ["CN-03", "en el mínimo (3)", true, texto(3)],
    ["CN-04", "en el máximo (50)", true, texto(50)],
    ["CN-05", "sobre el máximo (51)", false, texto(51)],
  ])("%s: nombre_usuario %s → válido = %s", async (_caso, _particion, esperado, valor) => {
    const datos = { nombre_usuario: valor, password: "admin" };
    await expect(loginSchema.isValid(datos)).resolves.toBe(esperado);
  });

  test("CN-06: sin password → inválido", async () => {
    await expect(loginSchema.isValid({ nombre_usuario: "admin" })).resolves.toBe(false);
  });
});

describe("examenMedicoSchema - exámenes médicos", () => {
  const examenValido = { tipo_examen_medico_id: 1, paciente_id: 1 };

  test("CN-07: datos correctos → válido", async () => {
    await expect(examenMedicoSchema.isValid(examenValido)).resolves.toBe(true);
  });

  test.each([
    ["CN-08", "texto", "abc"],
    ["CN-09", "cero (límite)", 0],
    ["CN-10", "negativo", -5],
  ])("%s: paciente_id %s → inválido", async (_caso, _particion, valor) => {
    const datos = { ...examenValido, paciente_id: valor };
    await expect(examenMedicoSchema.isValid(datos)).resolves.toBe(false);
  });

  test("CN-11: falta tipo_examen_medico_id → inválido", async () => {
    await expect(examenMedicoSchema.isValid({ paciente_id: 1 })).resolves.toBe(false);
  });

  test.each([
    ["CN-12", "en el máximo (2000)", true, texto(2000)],
    ["CN-13", "sobre el máximo (2001)", false, texto(2001)],
  ])("%s: diagnosis %s → válido = %s", async (_caso, _particion, esperado, valor) => {
    const datos = { ...examenValido, diagnosis: valor };
    await expect(examenMedicoSchema.isValid(datos)).resolves.toBe(esperado);
  });
});

describe("registerSchema - password (mínimo 6 caracteres)", () => {
  test.each([
    ["CN-14", "bajo el mínimo (5)", false, texto(5)],
    ["CN-15", "en el mínimo (6)", true, texto(6)],
  ])("%s: password %s → válido = %s", async (_caso, _particion, esperado, valor) => {
    const datos = { nombre_usuario: "diego", password: valor, correo: "diego@cuidarteplus.com" };
    await expect(registerSchema.isValid(datos)).resolves.toBe(esperado);
  });
});
