import {
  getShopItems,
  buyItem,
  addShopItem,
  deleteShopItem,
} from "../controllers/shopController.js";

export default async function shopRoutes(app, options) {
  // Lista itens da loja
  app.get("/shop", getShopItems);

  // Compra um item
  app.post("/shop/buy/:heroId/:itemId", buyItem);

  // Adiciona novo item à loja
  app.post("/shop/items", addShopItem);

  // Remove item da loja
  app.delete("/shop/items/:itemId", deleteShopItem);
}
