const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const router = express.Router();
const charactersFilePath = path.join(__dirname, "../../data/characters.json");

const readCharacters = async () => {
  try {
    const result = await fs.readFile(charactersFilePath, "utf-8");
    return JSON.parse(result);
  } catch (error) {
    throw new Error({ message: `error ${error}` });
  }
};

const writecharacters = async (characters) => {
  await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2));
};

router.get('/', async (req, res) =>{
    const results = await readCharacters();
  res.json(results);
});

router.post("/", async (req, res) => {
    const results = await readCharacters();
    fetch() //habria que hacer una consulta a la otra base de datos donde sacariamos los datos asi y los guardariamos en el objeto
    const newObj = {
      animeId: results.length + 1,
      characterName: req.body.name,
    };
    results.push(newObj);
    await writeCharacters(results);
    res
      .status(201)
      .send({ response: "the director has been added successfully" });
  });

  router.get("/:id", async (req, res) => {
    const results = await readCharacters();
    const character = results.find(
      (character) => character.id == parseInt(req.params.id)
    );
    if (!character) {
      return res.status(404).json({ message: "character no encontrado" });
    }
    res.json(character);
  });

  router.put("/:id", async (req, res) => {
    const results = await readDirectors();
    const characterIndex = results.findIndex(
      (character) => character.id == parseInt(req.params.id)
    );
    if (characterIndex === -1 || 0) {
      return res.status(404).json({ message: "character no encontrado" });
    }
    const newObj = {
      ...results[characterIndex],
      directorName: req.body.name,
    };
    results[characterIndex] = newObj;
    writeDirectors(results);
    res.json({ response: "character successfully changed" });
  });

  router.delete('/:id', async (req, res) => {
    const results = await readCharacters();
    const newCharacters = results.filter((character) => character.id !== req.params.id);
    await writecharacters(newCharacters);
    res.json({message:"personaje eliminado exitosamente"})
  } );
  