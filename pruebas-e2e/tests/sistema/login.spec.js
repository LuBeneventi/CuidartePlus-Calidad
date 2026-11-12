// frontend + backend + base de datos, usado como lo haría una persona.
const { test, expect } = require("@playwright/test");
const { iniciarSesion } = require("../apoyo");
test("La página de inicio de sesión carga correctamente", async ({ page }) => {
await page.goto("/login");
await expect(page.getByRole("heading", { name: "Iniciar Sesión" })).toBeVisible();
});
test("Credenciales incorrectas muestran un mensaje y no dan acceso", async ({ page }) => {
await iniciarSesion(page, "admin", "clave-equivocada");
await expect(page.getByText("Credenciales inválidas").first()).toBeVisible();
await expect(page).toHaveURL(/\/login/);
});
test("Una ruta protegida sin sesión redirige al login", async ({ page }) => {
await page.goto("/clientes");
await expect(page).toHaveURL(/\/login/);
});