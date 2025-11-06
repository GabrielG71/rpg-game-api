import {
  getAllCities,
  addCity,
  deleteCity,
  getTodayQuests,
} from "../controllers/cityController.js";

export default async function citiesRoutes(app, options) {
  // Lista todas as cidades
  app.get("/cities", getAllCities);

  // Adiciona nova cidade
  app.post("/cities", addCity);

  // Remove uma cidade
  app.delete("/cities/:id", deleteCity);

  // Busca missões diárias
  app.get("/quests/today", getTodayQuests);
}
