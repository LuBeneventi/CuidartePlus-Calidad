
/**
 * Normaliza un RUT removiendo los puntos, dejando solo números, guión y dígito verificador
 * Ejemplo: "12.345.678-9" -> "12345678-9"
 */
function normalizeRut(rut) {
  if (!rut) return rut;
  return rut.replace(/\./g, "");
}

/**
 * Valida un RUT chileno revisando su dígito verificador (módulo 11).
 * Acepta "12.345.678-5" o "12345678-5"; la K puede ser mayúscula o minúscula.
 * Lanza un error si el RUT viene vacío o nulo.
 */
function validarRut(rut) {
  if (!rut) {
    throw new Error("El RUT es requerido");
  }

  const limpio = normalizeRut(String(rut)).toUpperCase();
  if (!/^\d{1,8}-[\dK]$/.test(limpio)) {
    return false;
  }

  const [cuerpo, dv] = limpio.split("-");

  // Se multiplica cada dígito, de derecha a izquierda, por 2, 3, 4, 5, 6, 7, 2, 3...
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  let dvEsperado;
  if (resto === 11) {
    dvEsperado = "0";
  } else if (resto === 10) {
    dvEsperado = "K";
  } else {
    dvEsperado = String(resto);
  }

  return dv === dvEsperado;
}

module.exports = {
  normalizeRut,
  validarRut,
};
