const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

let sensors = {
  "0001": { name: "Medidor de Caudal", value: 50 },
  "0002": { name: "Medidor de Nivel de Agua", value: 10 },
};

app.get("/sensors", (req, res) => {
  res.json(sensors);
});

app.get("/sensor/:id", (req, res) => {
  const sensor = sensors[req.params.id];
  if (sensor) {
    res.json({
      timestamp: new Date().toISOString(),
      value: sensor.value,
    });
  } else {
    res.status(404).json({ error: "Sensor no encontrado" });
  }
});

setInterval(() => {
  sensors["0001"].value = parseFloat((Math.random() * 100).toFixed(2)); // caudal
  sensors["0002"].value = parseFloat((Math.random() * 50).toFixed(2)); // nivel de agua

  io.emit("sensorData", sensors);
}, 2000);

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.emit("sensorData", sensors);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Exportar el servidor y la app para pruebas
const PORT = process.env.PORT || 4000;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

module.exports = { app, server }; // Para pruebas
