// Pruebas de CAJA BLANCA con MOCKS: los 3 caminos del middleware validate.js.
// req, res y next son objetos falsos (jest.fn), así no se necesita Express ni la BD.
const yup = require("yup");
const validate = require("../../src/middleware/validate");

function crearRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const esquema = yup.object({
  nombre_usuario: yup.string().required("El nombre de usuario es requerido"),
});

describe("middleware validate", () => {
  test("Camino 1: datos válidos → llama a next() y no responde", async () => {
    const req = { body: { nombre_usuario: "admin" } };
    const res = crearRes();
    const next = jest.fn();

    await validate(esquema)(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("Camino 2: datos inválidos → 400 con el campo en detalles", async () => {
    const req = { body: {} };
    const res = crearRes();
    const next = jest.fn();

    await validate(esquema)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    const cuerpo = res.json.mock.calls[0][0];
    expect(cuerpo.detalles[0].field).toBe("nombre_usuario");
    expect(cuerpo.detalles[0].message).toBe("El nombre de usuario es requerido");
  });

  test("Camino 3: error inesperado del esquema → 500", async () => {
    const esquemaRoto = { validate: jest.fn().mockRejectedValue(new Error("falla interna")) };
    const req = { body: {} };
    const res = crearRes();
    const next = jest.fn();

    await validate(esquemaRoto)(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json.mock.calls[0][0].glosa).toBe("falla interna");
  });

  test("Camino 3b: error sin message → 500 usando toString()", async () => {
    const esquemaRoto = { validate: jest.fn().mockRejectedValue("falla sin mensaje") };
    const req = { body: {} };
    const res = crearRes();
    const next = jest.fn();

    await validate(esquemaRoto)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json.mock.calls[0][0].glosa).toBe("falla sin mensaje");
  });
});
