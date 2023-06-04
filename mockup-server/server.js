const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
router.render = (req, res) => {
  console.log(res.locals);
  res.jsonp({
    timestamp: Date.now(),
    status: 200,
    error: null,
    message: "Successful",
    path: "mockup-pạth",
    data: res.locals.data,
  });
};
// Use default router
server.use(router);
server.listen(8080, () => {
	console.log('JSON Server is running');
});
