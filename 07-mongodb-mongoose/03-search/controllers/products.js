const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx) {
  const {query} = ctx.request.query;

  const products = await Product
      .find(
          {
            $text: {$search: query},
          },
          {
            score: {$meta: 'textScore'},
          },
      ).sort( {score: {$meta: 'textScore'}} );

  ctx.body = {
    products: products.map((product) => product.toJSON()),
  };
};
