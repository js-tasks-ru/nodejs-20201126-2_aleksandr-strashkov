const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
}, {
  toJSON: {
    transform: function(doc, ret) {
      return {
        id: ret._id.toString(),
        title: ret.title,
        subcategories: ret.subcategories.map((subcategory) => {
          return {
            id: subcategory._id.toString(),
            title: subcategory.title,
          };
        }),
      };
    },
  },
});

module.exports = connection.model('Category', categorySchema);
