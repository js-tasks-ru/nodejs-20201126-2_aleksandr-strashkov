const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx) => {
  const token = uuid();

  const {
    email,
    displayName,
    password,
  } = ctx.request.body;


  try {
    const user = new User({
      email,
      displayName,
      verificationToken: token,
    });

    await user.setPassword(password);

    await user.save();

    await sendMail({
      template: 'confirmation',
      locals: {token},
      to: email,
      subject: 'Подтвердите почту',
    });

    ctx.body = {status: 'ok'};
  } catch (err) {
    ctx.status = 400;

    const errors = Object.entries(err.errors)
        .reduce((acc, [key, {message}]) => {
          return {
            ...acc,
            [key]: message,
          };
        }, {});

    ctx.body = {errors};
  }
};

module.exports.confirm = async (ctx) => {
  const {verificationToken} = ctx.request.body;

  try {
    const user = await User.findOne({verificationToken});
    user.verificationToken = undefined;
    await user.save();

    ctx.body = {
      token: verificationToken,
    };
  } catch (err) {
    ctx.body = {
      error: 'Ссылка подтверждения недействительна или устарела',
    };
  }
};
