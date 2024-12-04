const request = require("supertest");
const { server, app } = require("../server");
const { io } = require("socket.io-client");

describe("Server tests", () => {
  afterAll((done) => {
    server.close(done);
  });

  it("GET /sensors should return all sensors", async () => {
    const res = await request(app).get("/sensors");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("0001");
    expect(res.body).toHaveProperty("0002");
  });

  it("GET /sensor/:id should return a specific sensor", async () => {
    const res = await request(app).get("/sensor/0001");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("timestamp");
    expect(res.body).toHaveProperty("value");
  });

  it("GET /sensor/:id should return 404 for an invalid sensor ID", async () => {
    const res = await request(app).get("/sensor/9999");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Sensor no encontrado");
  });

  it("WebSocket should emit sensor data", (done) => {
    const socket = io(`http://localhost:4000`);
    socket.on("sensorData", (data) => {
      expect(data).toHaveProperty("0001");
      expect(data).toHaveProperty("0002");
      socket.close();
      done();
    });
  });
});
