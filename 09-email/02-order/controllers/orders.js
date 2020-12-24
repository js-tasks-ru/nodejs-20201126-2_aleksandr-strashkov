const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx) {
  const {
    product,
    phone,
    address,
  } = ctx.request.body;

  const order = await Order.create({
    user: ctx.user.id,
    product,
    phone,
    address,
  });

  const productObj = await Product.findById(product);

  await sendMail({
    template: 'order-confirmation',
    locals: {
      id: order.id,
      product: {
        title: productObj.title,
      },
    },
    to: ctx.user.email,
    subject: 'Новый заказ',
  });

  ctx.response.body = {
    order: order.id,
  };
};

module.exports.getOrdersList = async function ordersList(ctx) {
  const orders = await Order.find({
    user: ctx.user.id,
  });

  ctx.response.body = {
    orders: orders.map(mapOrder),
  };
};
