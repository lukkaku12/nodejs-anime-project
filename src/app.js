const express = require("express"); // Importamos Express
const getAnimes = require("./routes/getAnimes"); // Importamos las rutas de la API
const errorHandler = require("./middlewares/errorHandler"); // Importamos el middleware para manejo de errores
const directors = require("./routes/directors")

const app = express(); // Instanciamos Express
const PORT = 3000; // Puerto del servidor en donde se ejecutará la API

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes en formato JSON. Tambien conocido como middleware de aplicación.
app.use("/animes", getAnimes); // Middleware para manejar las rutas de la API. Tambien conocido como middleware de montaje o de enrutamiento.
app.use("/directors", directors);
app.use('/characters', characters)
app.use(errorHandler); // Middleware para manejar errores.

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});