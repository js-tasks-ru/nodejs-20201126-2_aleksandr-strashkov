const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  images: [String],

}, {
  toJSON: {
    transform: function(doc, ret) {
      return {
        ...ret,
        __v: undefined,
        _id: undefined,
        id: ret._id.toString(),
        category: ret.category.toString(),
        subcategory: ret.subcategory.toString(),
      };
    },
  },
});

module.exports = connection.model('Product', productSchema);
