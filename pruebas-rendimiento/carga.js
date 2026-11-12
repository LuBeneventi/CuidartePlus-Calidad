// PRUEBA DE RENDIMIENTO DE ATLAS (NFR-PERF)
// Perfil "humo": pocas personas, para el pipeline.
// Perfil "carga": hasta 200 personas a la vez, como pide la ERS (NFR-PERF-3).
import http from "k6/http";
import { check, sleep } from "k6";
const BASE_URL = __ENV.BASE_URL || "http://localhost:4451";
const PERFIL = __ENV.PERFIL || "humo";
const perfiles = {
humo: [
{ duration: "10s", target: 5 },
{ duration: "20s", target: 5 },
{ duration: "5s", target: 0 },
],
carga: [
{ duration: "30s", target: 50 },
{ duration: "1m", target: 200 },
{ duration: "1m", target: 200 },
{ duration: "30s", target: 0 },
],
};
export const options = {
stages: perfiles[PERFIL],
thresholds: {
// NFR-PERF-1: operaciones simples bajo 300 ms (95 % de las peticiones)
http_req_duration: ["p(95)<300"],
// Menos de 1 % de peticiones con error
http_req_failed: ["rate<0.01"],
},
};
// Se ejecuta una sola vez al inicio: inicia sesión y comparte el token
export function setup() {
const res = http.post(
`${BASE_URL}/autenticacion/login`,
JSON.stringify({ nombre_usuario: "admin", password: "admin" }),
{ headers: { "Content-Type": "application/json" } }
);check(res, { "login correcto": (r) => r.status === 200 });
return { token: res.json("token") };
}
// Lo que hace cada "persona virtual", una y otra vez
export default function (datos) {
const params = { headers: { Authorization: `Bearer ${datos.token}` } };
const clientes = http.get(`${BASE_URL}/pacientes`, params);
check(clientes, { "listar clientes responde 200": (r) => r.status === 200 });
const contratos = http.get(`${BASE_URL}/examenes`, params);
check(contratos, { "listar contratos responde 200": (r) => r.status === 200 });
sleep(1);
}