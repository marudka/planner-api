const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const helpers = require('../helpers');

const normalizeRecipes = (recipes) => {
  return recipes.map((item) => {
    if (Boolean(item.image)) {
      item.image = `${process.env.BASE_URL}static/${item.image}`;
    }
    if (item.ingredients) {
      item.ingredients = item.ingredients.length ? JSON.parse(item.ingredients) : [];
    }
    return item;
  })
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('file');

const Recipe = require('../models/recipes');

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    const normalizedRecipes = normalizeRecipes(recipes);
    res.json(normalizedRecipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one recipe
router.get('/:id', getRecipe, async (req, res) => {
  res.json(res.recipe);
});

// Create one recipe
router.post('/', upload, async (req, res) => {
  const recipe = new Recipe({
    name: req.body.name,
    description: req.body.description,
    ingredients: req.body.ingredients,
    image: req.file ? req.file.filename : ''
  });

  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one recipe
router.patch('/:id', getRecipe, async (req, res) => {
  if (req.body.name) {
    res.recipe.name = req.body.name
  }

  if (req.body.description) {
    res.recipe.description = req.body.description
  }

  if (req.body.ingredients) {
    res.recipe.ingredients = req.body.ingredients
  }

  if (req.body.days) {
    res.recipe.days = req.body.days
  }

  try {
    const updatedRecipe = await res.recipe.save();
    if (req.body.days) {
      await req.socket.emit('RECIPE_ADDED_TO_DAY', updatedRecipe);
    }
    await res.json(updatedRecipe)
  } catch {
    res.status(400).json({ message: 'patch error' })
  }
});

// Delete one recipe
router.delete('/:id', getRecipe, async (req, res) => {
  try {
    await res.recipe.remove();
    res.json({ message: 'Recipe removed' })
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
});

async function getRecipe(req, res, next) {
  try {
    recipe = await Recipe.findById(req.params.id);
    if (recipe == null) {
      return res.status(404).json({ message: 'Cant find recipe'})
    }
  } catch(err){
    return res.status(500).json({ message: err.message })
  }

  res.recipe = recipe;
  next()
}

module.exports = router;