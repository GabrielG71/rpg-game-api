import {
  createHero,
  getAllHeroes,
  getHeroById,
  deleteHero,
  getRanking,
  resetHero,
} from "../controllers/heroController.js";

export default async function heroesRoutes(app, options) {
  // Cria novo herói
  app.post("/heroes", createHero);

  // Lista todos os heróis
  app.get("/heroes", getAllHeroes);

  // Busca herói específico
  app.get("/heroes/:id", getHeroById);

  // Remove herói
  app.delete("/heroes/:id", deleteHero);

  // Ranking de heróis
  app.get("/ranking", getRanking);

  // Reseta progresso do herói
  app.post("/reset/:id", resetHero);
}
