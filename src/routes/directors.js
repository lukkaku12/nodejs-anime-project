const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const router = express.Router();
const directorsFilePath = path.join(__dirname, "../../data/directors.json");

const readDirectors = async () => {
  try {
    const result = await fs.readFile(directorsFilePath, "utf-8");
    return JSON.parse(result);
  } catch (error) {
    throw new Error({ message: `error ${error}` });
  }
};

const writeDirectors = async (directors) => {
  await fs.writeFile(directorsFilePath, JSON.stringify(directors, null, 2));
};

router.get("/", async (req, res) => {
  const results = await readDirectors();
  res.json(results);
});

router.post("/", async (req, res) => {
  const results = await readDirectors();
  const newObj = {
    id: results.length + 1,
    directorName: req.body.name,
  };
  results.push(newObj);
  await writeDirectors(results);
  res
    .status(201)
    .send({ response: "the director has been added successfully" });
});

router.get("/:id", async (req, res) => {
  const results = await readDirectors();
  const director = results.find(
    (director) => director.id == parseInt(req.params.id)
  );
  if (!director) {
    return res.status(404).json({ message: "director no encontrado" });
  }
  res.json(director);
});

router.put("/:id", async (req, res) => {
  const results = await readDirectors();
  const directorIndex = results.findIndex(
    (director) => director.id == parseInt(req.params.id)
  );
  if (directorIndex === -1 || 0) {
    return res.status(404).json({ message: "director no encontrado" });
  }
  const newObj = {
    ...results[directorIndex],
    directorName: req.body.name,
  };
  results[directorIndex] = newObj;
  writeDirectors(results);
  res.json({ response: "director successfully changed" });
});

router.delete("/:id", async (req, res) => {
    const results = await readDirectors();
    
    const newDirectors = results.filter((director) => director.id !== parseInt(req.params.id));
    if (results.length === newDirectors.length) {
        return res.status(404).json({ message: "Anime no encontrado" });
      }
    
    writeDirectors(newDirectors);
    res.json({response:"the recordings have been done successfully"});
});

module.exports = router;
