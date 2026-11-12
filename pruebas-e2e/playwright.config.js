// Configuración de Playwright para CuidatePlus
const { defineConfig, devices } = require("@playwright/test");
module.exports = defineConfig({
testDir: "./tests",
timeout: 30000,
retries: process.env.CI ? 1 : 0,
reporter: [["list"], ["html", { open: "never" }]],
use: {
baseURL: process.env.BASE_URL || "http://localhost:3334",
screenshot: "only-on-failure",
trace: "retain-on-failure",
},
projects: [
{ name: "computador", use: { ...devices["Desktop Chrome"] } },
{ name: "celular", use: { ...devices["Pixel 7"] } },
],
});