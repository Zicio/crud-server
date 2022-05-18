const http = require("http");
const Koa = require("koa");
const koaBody = require("koa-body");
const cors = require("@koa/cors");
const Router = require("@koa/router");
const router = new Router();
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

const app = new Koa();

const options = {
  origin: "*",
};
app.use(cors(options));

app.use(
  koaBody({
    urlencoded: true,
    multipart: true,
    json: true,
  })
);

const cards = [];
for (let i = 0; i < 2; i++) {
  const card = { id: uuidv4(), content: faker.lorem.paragraph() };
  cards.push(card);
}

router.get("/notes", async (ctx, next) => {
  ctx.response.body = cards;
});

router.post("/notes", async (ctx, next) => {
  const data = JSON.parse(ctx.request.body);
  cards.push({ ...data, id: uuidv4() });
  ctx.response.status = 204;
});

router.delete("/notes", async (ctx, next) => {
  const index = cards.findIndex((o) => o.id === ctx.request.query.id);
  if (index !== -1) {
    cards.splice(index, 1);
  }
  ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());

server.listen(port);
