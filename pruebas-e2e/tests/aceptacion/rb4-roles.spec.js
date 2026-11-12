// PRUEBAS DE ACEPTACIÓN: reglas de negocio RB-4 y RB-5 (roles)
const { test, expect } = require("@playwright/test");
const { iniciarSesion } = require("../apoyo");
test("CA-RB5: el administrador ve la opción de eliminar usuarios", async ({ page }) => {
await iniciarSesion(page, "admin", "admin");
await expect(page).toHaveURL(/\/home/);
await page.goto("/usuarios");
await expect(page.getByTestId("button-usuario-eliminar-1")).toBeVisible();
});
test("CA-RB4: el medico NO ve la opción de eliminar ni editar a otros usuarios", async ({ page }) => {
  // 1. Iniciamos sesión con el usuario que SÍ existe en tu base de datos
  await iniciarSesion(page, "medico", "medico"); 
  
  await expect(page).toHaveURL(/\/home/);
  await page.goto("/usuarios");
  
  // 2. Evaluamos el botón del usuario 1 (que sabemos que es el 'admin')
  // Como el médico no es administrador ni editor, tu código de React ocultará este botón
  await expect(page.getByTestId("button-usuario-editar-1")).toHaveCount(0);
  
  // 3. Tampoco debe poder eliminar al usuario 1
  await expect(page.getByTestId("button-usuario-eliminar-1")).toHaveCount(0);

});