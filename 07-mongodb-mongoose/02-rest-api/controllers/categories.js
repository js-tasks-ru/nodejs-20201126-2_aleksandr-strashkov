const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx) {
  const categories = await Category.find({});

  ctx.body = {
    categories: categories.map((category) => category.toJSON()),
  };
};
