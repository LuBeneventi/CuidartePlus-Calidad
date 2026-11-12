// PRUEBA DE ACCESIBILIDAD (NFR-USAB): revisa la página con las reglas WCAG
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;
test("La página de login no tiene problemas graves de accesibilidad", async ({ page }) => {
await page.goto("/login");
const resultado = await new AxeBuilder({ page })
.withTags(["wcag2a", "wcag2aa"])
.analyze();
// Mostramos en consola todo lo encontrado, para el informe
for (const v of resultado.violations) {
console.log(`[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} elementos)`);
}
const graves = resultado.violations.filter((v) => v.impact === "critical");
expect(graves).toEqual([]);
});