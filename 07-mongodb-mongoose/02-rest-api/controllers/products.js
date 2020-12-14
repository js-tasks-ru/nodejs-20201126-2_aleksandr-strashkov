const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productList = async function productList(ctx) {
  const filter = {};

  if (ctx.request.query.subcategory) {
    filter.subcategory = ctx.request.query.subcategory;
  }

  const products = await Product.find(filter);

  ctx.body = {
    products: products.map((product) => product.toJSON()),
  };
};

module.exports.productById = async function productById(ctx) {
  const {id} = ctx.params;
  if (!mongoose.isValidObjectId(id)) {
    ctx.response.status = 400;
    return;
  }
  const product = await Product.findById(id);

  if (!product) {
    ctx.response.status = 404;
    return;
  }

  ctx.body = {
    product: product.toJSON(),
  };
};

