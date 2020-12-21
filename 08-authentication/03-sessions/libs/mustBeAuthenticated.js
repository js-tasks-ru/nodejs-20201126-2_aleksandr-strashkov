module.exports = function mustBeAuthenticated(ctx, next) {
  if (!ctx.user) {
    ctx.response.status = 401;
    ctx.body = {
      error: 'Пользователь не залогинен',
    };

    return;
  }
  return next();
};
