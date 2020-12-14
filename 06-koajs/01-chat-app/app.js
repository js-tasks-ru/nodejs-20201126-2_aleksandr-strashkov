const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const wait = () => new Promise((resolve) => {
  setTimeout(resolve, 10);
});

let clientIdx = 0;

const messages = {};

router.get('/subscribe', async (ctx) => {
  const idx = clientIdx++;
  messages[idx] = '';

  while (!messages[idx]) {
    await wait();
  }
  ctx.response.body = messages[idx];
  delete messages[idx];
});

router.post('/publish', async (ctx) => {
  const {message} = ctx.request.body;

  if (message) {
    Object.keys(messages).forEach((index) => {
      messages[index] = message;
    });
  }
  ctx.response.body = '';
});

app.use(router.routes());

module.exports = app;
