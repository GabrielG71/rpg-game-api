import Fastify from "fastify";
import { initializeDatabase } from "./db/init.js";
import heroesRoutes from "./routes/heroes.js";
import battleRoutes from "./routes/battle.js";
import shopRoutes from "./routes/shop.js";
import inventoryRoutes from "./routes/inventory.js";
import classesRoutes from "./routes/classes.js";
import citiesRoutes from "./routes/cities.js";
import { getKingdomTime } from "./utils/narration.js";

const app = Fastify({
  logger: false,
});

// Inicializa o banco de dados
initializeDatabase();

// Middleware de log narrativo
app.addHook("onRequest", async (request, reply) => {
  const actions = {
    GET: "observa",
    POST: "invoca",
    DELETE: "destrói",
    PUT: "transforma",
  };

  const action = actions[request.method] || "explora";
  console.log(
    `📜 [${getKingdomTime()}] Um viajante ${action} o caminho: ${
      request.method
    } ${request.url}`
  );
});

// Middleware de erro narrativo
app.setErrorHandler((error, request, reply) => {
  console.error("⚠️  Um feitiço falhou:", error);
  reply.status(error.statusCode || 500).send({
    narration:
      "As forças místicas falharam nesta jornada. Os sábios do reino trabalham para restaurar o equilíbrio.",
    error: error.message,
    kingdom_time: getKingdomTime(),
  });
});

// Rota raiz
app.get("/", async (request, reply) => {
  return {
    narration:
      "Bem-vindo à Taverna do Dragão Dourado! Aqui começam todas as grandes aventuras...",
    kingdom_time: getKingdomTime(),
    endpoints: {
      heroes: "/heroes",
      battle: "/battle/:id",
      shop: "/shop",
      inventory: "/inventory/:heroId",
      classes: "/classes",
      cities: "/cities",
      ranking: "/ranking",
    },
    message: "Que os ventos da sorte guiem sua jornada, bravo aventureiro!",
  };
});

// Registra as rotas
app.register(heroesRoutes);
app.register(battleRoutes);
app.register(shopRoutes);
app.register(inventoryRoutes);
app.register(classesRoutes);
app.register(citiesRoutes);

export default app;
