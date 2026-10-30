// Pruebas de CAJA BLANCA: una prueba por cada camino de validarRut().
const { validarRut, normalizeRut } = require("../../src/utils/rut");

describe("validarRut - caminos", () => {
  test.each([
    ["vacío", ""],
    ["nulo", null],
  ])("C1: RUT %s → lanza error", (_caso, valor) => {
    expect(() => validarRut(valor)).toThrow("El RUT es requerido");
  });

  test.each([
    ["sin guion ni DV", "12345"],
    ["con letras en el cuerpo", "abc-1"],
  ])("C2: formato inválido (%s) → false", (_caso, valor) => {
    expect(validarRut(valor)).toBe(false);
  });

  test("C3: DV numérico correcto → true", () => {
    expect(validarRut("12.345.678-5")).toBe(true);
  });

  test.each([
    ["mayúscula", "10.000.013-K"],
    ["minúscula", "10000013-k"],
  ])("C4: DV K correcto (%s) → true", (_caso, valor) => {
    expect(validarRut(valor)).toBe(true);
  });

  test("C5: DV 0 (resto 11) → true", () => {
    expect(validarRut("10.000.004-0")).toBe(true);
  });

  test("C6: DV incorrecto → false", () => {
    expect(validarRut("12.345.678-9")).toBe(false);
  });
});

describe("normalizeRut (sin cambios)", () => {
  test("quita los puntos", () => {
    expect(normalizeRut("12.345.678-5")).toBe("12345678-5");
  });

  test("devuelve el mismo valor si viene vacío", () => {
    expect(normalizeRut("")).toBe("");
  });
});
