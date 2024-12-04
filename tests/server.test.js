const request = require("supertest");
const { app, server } = require("../server.js"); // Asegúrate de usar la ruta correcta

describe("API de sensores", () => {
  afterAll(() => {
    server.close(); // Cerramos el servidor después de las pruebas
  });

  test("GET /sensors debería devolver todos los sensores", async () => {
    const response = await request(app).get("/sensors");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      "0001": { name: "Medidor de Caudal", value: expect.any(Number) },
      "0002": { name: "Medidor de Nivel de Agua", value: expect.any(Number) },
    });
  });

  test("GET /sensor/:id debería devolver un sensor específico", async () => {
    const response = await request(app).get("/sensor/0001");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      timestamp: expect.any(String),
      value: expect.any(Number),
    });
  });

  test("GET /sensor/:id debería devolver 404 si el sensor no existe", async () => {
    const response = await request(app).get("/sensor/9999");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Sensor no encontrado" });
  });
});
