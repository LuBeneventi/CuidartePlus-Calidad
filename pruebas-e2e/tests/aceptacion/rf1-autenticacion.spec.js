// PRUEBAS DE ACEPTACIÓN: cada prueba corresponde a un criterio de aceptación
// escrito en la ERS de CuidartePlus. Formato: Dado / Cuando / Entonces.
const { test, expect } = require("@playwright/test");
const { iniciarSesion } = require("../apoyo");
test("CA-RF1: un login exitoso abre la sesión y muestra el panel", async ({ page }) => {
// Dado un usuario registrado (admin)
// Cuando ingresa sus credenciales correctas
await iniciarSesion(page, "admin", "admin");
// Entonces entra al panel principal y ve su nombre
await expect(page).toHaveURL(/\/home/);
await expect(page.getByText("Bienvenido")).toBeVisible();
});
test("CA-RF1: el cierre de sesión invalida el acceso", async ({ page, isMobile }) => {
test.skip(isMobile, "En celular el menú lateral está oculto");
// Dado un usuario con sesión iniciada
await iniciarSesion(page, "admin", "admin");
await expect(page).toHaveURL(/\/home/);
// 1. Buscamos específicamente el botón por su aria-label
await page.getByLabel("Menú de usuario").click();
// 2. SEGUNDO: Ahora que el menú está abierto, hacemos clic en Cerrar sesión
await page.getByLabel("Cerrar sesión").click();
// Entonces vuelve al login y ya no puede entrar a páginas protegidas
await expect(page).toHaveURL(/\/login/);
await page.goto("/usuarios");
await expect(page).toHaveURL(/\/login/);
});