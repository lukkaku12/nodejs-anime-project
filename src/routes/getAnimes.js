const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const router = express.Router();
const animesfilePath = path.join(__dirname, "../../data/animes.json");

// Leer animes desde el archivo
const readAnimes = async () => {
  try {
    const animeData = await fs.readFile(animesfilePath, 'utf8');
    return JSON.parse(animeData);
  } catch (e) {
    console.error(e);
  }
};

// Escribir animes en el archivo
const writeAnimes = async (animes) => {
  await fs.writeFile(animesfilePath, JSON.stringify(animes, null, 2));
};

// Crear un nuevo anime
router.post("/", async (req, res) => {
  const animes = await readAnimes();
  const newAnime = {
    id: animes.length + 1, // simulamos un id autoincrementable
    title: req.body.title,
    genre: req.body.genre,
    studioId: req.body.studioId
  };

  animes.push(newAnime);
  await writeAnimes(animes);
  res.status(201).json({ message: "Anime creado exitosamente" });
});

// Obtener todos los animes
router.get("/", async (req, res) => {
  const animes = await readAnimes();
  res.json(animes);
});

// Obtener un anime por ID
router.get("/:id", async (req, res) => {
  const animes = await readAnimes();
  const anime = animes.find((t) => t.id === parseInt(req.params.id));
  if (!anime) {
    return res.status(404).json({ message: "Anime no encontrado" });
  }
  res.json(anime);
});

// Actualizar un anime por ID
router.put("/:id", async (req, res) => {
  const animes = await readAnimes();
  const animeIndex = animes.findIndex((t) => t.id === parseInt(req.params.id));
  if (animeIndex === -1) {
    return res.status(404).json({ message: "Anime no encontrado" });
  }
  const updatedAnime = {
    ...animes[animeIndex],
    title: req.body.title,
    genre: req.body.genre,
    studioId: req.body.studioId
  };
  animes[animeIndex] = updatedAnime;
  await writeAnimes(animes);
  res.json({ message: "Anime actualizado exitosamente", anime: updatedAnime });
});

// Eliminar un anime por ID
router.delete("/:id", async (req, res) => {
  const animes = await readAnimes();
  const newAnimes = animes.filter((t) => t.id !== parseInt(req.params.id));
  if (animes.length === newAnimes.length) {
    return res.status(404).json({ message: "Anime no encontrado" });
  }
  await writeAnimes(newAnimes);
  res.json({ message: "Anime eliminado exitosamente" });
});

module.exports = router;