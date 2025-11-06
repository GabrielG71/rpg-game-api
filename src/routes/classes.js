import {
  getAllClasses,
  addClass,
  deleteClass,
} from "../controllers/classController.js";

export default async function classesRoutes(app, options) {
  // Lista todas as classes
  app.get("/classes", getAllClasses);

  // Adiciona nova classe
  app.post("/classes", addClass);

  // Remove uma classe
  app.delete("/classes/:id", deleteClass);
}
