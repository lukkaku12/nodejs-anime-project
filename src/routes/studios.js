const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const router = express.Router();
const studiosFilePath = path.join(__dirname, "../../data/studios.json");
const directorsFilePath = path.join(__dirname, "../../data/directors.json");

const readStudios = async () => {
  try {
    const result = await fs.readFile(studiosFilePath, "utf-8");
    return JSON.parse(result);
  } catch (error) {
    throw new Error({ message: `error ${error}` });
  }
};

const readDirectors = async () => {
  try {
    const result = await fs.readFile(directorsFilePath, "utf-8");
    return JSON.parse(result);
  } catch (error) {
    throw new Error({ message: `error ${error}` });
  }
};

const writeStudios = async (studios) => {
  await fs.writeFile(studiosFilePath, JSON.stringify(studios, null, 2));
};

router.get('/', async (req, res) => {
  const results = await readStudios();
  res.json(results);
});

router.post("/", async (req, res) => {
  const studios = await readStudios();
  

  const newStudio = {
    studioId: studios.length + 1,
    studioName: req.body.studioName,
    
  };

  studios.push(newStudio);
  await writeStudios(studios);
  res.status(201).send({ response: "El estudio ha sido añadido exitosamente" });
});

router.get("/:id", async (req, res) => {
  const studios = await readStudios();
  const studio = studios.find(studio => studio.studioId == parseInt(req.params.id));
  if (!studio) {
    return res.status(404).json({ message: "Estudio no encontrado" });
  }
  res.json(studio);
});

router.put("/:id", async (req, res) => {
  const studios = await readStudios();
  const studioIndex = studios.findIndex(studio => studio.studioId == parseInt(req.params.id));

  if (studioIndex === -1) {
    return res.status(404).json({ message: "Estudio no encontrado" });
  }

  

  const updatedStudio = {
    ...studios[studioIndex],
    studioName: req.body.studioName,
    
  };

  studios[studioIndex] = updatedStudio;
  await writeStudios(studios);
  res.json({ response: "Estudio actualizado exitosamente" });
});

router.delete('/:id', async (req, res) => {
  const studios = await readStudios();
  const newStudios = studios.filter(studio => studio.studioId !== parseInt(req.params.id));
  if (studios.length === newStudios.length) {
    return res.status(404).json({ message: "Estudio no encontrado" });
  }
  await writeStudios(newStudios);
  res.json({ message: "Estudio eliminado exitosamente" });
});

module.exports = router;