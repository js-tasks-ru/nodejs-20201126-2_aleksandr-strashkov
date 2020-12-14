const mongoose = require('mongoose');
const connection = require('../libs/connection');

const titleField = {
  title: {
    type: String,
    required: true,
  },
};

const subCategorySchema = new mongoose.Schema({
  ...titleField,
});

const categorySchema = new mongoose.Schema({
  ...titleField,
  subcategories: [subCategorySchema],
});

module.exports = connection.model('Category', categorySchema);
