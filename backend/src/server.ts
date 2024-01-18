import * as http from "http";
import * as url from "url";
import routes from "./routes";

const server = http.createServer((req, res) => {
  const parseUrl = url.parse(req.url!, true);
  const pathname = parseUrl.pathname;
  const method = req.method;

  const routeHandler = routes[`${method} ${pathname}` as keyof typeof routes];

  if (routeHandler) {
    routeHandler(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Ruta no encontrada");
  }
});

const PORT = process.env.BACKEND_PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
