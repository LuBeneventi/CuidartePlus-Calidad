// Funciones de apoyo que comparten todas las pruebas
async function iniciarSesion(page, usuario, clave) {
await page.goto("/login");
await page.getByTestId("input-nombre-usuario").fill(usuario);
await page.getByTestId("input-password").fill(clave);
await page.getByTestId("button-login").click();
}
module.exports = { iniciarSesion };