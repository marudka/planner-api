const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  ingredients: {
    type: Array,
  },
  added: {
    type: Date,
    required: true,
    default: Date.now
  },
  image: {
    type: String,
    nullable: true,
    required: false
  },
  days: {
    type: Object
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);