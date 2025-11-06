import { battle } from "../controllers/battleController.js";

export default async function battleRoutes(app, options) {
  // Inicia uma batalha
  app.post("/battle/:id", battle);
}
