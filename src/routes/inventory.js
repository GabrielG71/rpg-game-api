import {
  getInventory,
  addToInventory,
  removeFromInventory,
} from "../controllers/inventoryController.js";

export default async function inventoryRoutes(app, options) {
  // Mostra inventário do herói
  app.get("/inventory/:heroId", getInventory);

  // Adiciona item ao inventário
  app.post("/inventory/add/:heroId", addToInventory);

  // Remove item do inventário
  app.delete("/inventory/:heroId/:itemId", removeFromInventory);
}
