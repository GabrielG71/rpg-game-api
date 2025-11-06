import db from "../db/connection.js";
import { narrateClassList, getKingdomTime } from "../utils/narration.js";

// Lista todas as classes
export function getAllClasses(request, reply) {
  try {
    const classes = db.prepare("SELECT * FROM classes ORDER BY name ASC").all();

    return reply.send({
      narration: narrateClassList(classes.length),
      classes: classes,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao listar classes:", error);
    throw error;
  }
}

// Adiciona nova classe
export function addClass(request, reply) {
  try {
    const { name, base_hp, base_attack, description } = request.body;

    if (!name || !base_hp || !base_attack || !description) {
      return reply.status(400).send({
        narration:
          "Para criar uma nova classe, são necessários: nome, vida base, ataque base e descrição.",
        kingdom_time: getKingdomTime(),
      });
    }

    const insert = db.prepare(`
      INSERT INTO classes (name, base_hp, base_attack, description) 
      VALUES (?, ?, ?, ?)
    `);

    const result = insert.run(name, base_hp, base_attack, description);
    const newClass = db
      .prepare("SELECT * FROM classes WHERE id = ?")
      .get(result.lastInsertRowid);

    return reply.status(201).send({
      narration: `Os sábios da guilda reconhecem uma nova classe de heróis: ${name}! ${description}`,
      class: newClass,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return reply.status(400).send({
        narration: "Esta classe já existe nos registros da guilda.",
        kingdom_time: getKingdomTime(),
      });
    }
    console.error("Erro ao adicionar classe:", error);
    throw error;
  }
}

// Remove uma classe
export function deleteClass(request, reply) {
  try {
    const { id } = request.params;

    const classInfo = db.prepare("SELECT * FROM classes WHERE id = ?").get(id);

    if (!classInfo) {
      return reply.status(404).send({
        narration: "Esta classe não existe nos registros.",
        kingdom_time: getKingdomTime(),
      });
    }

    // Verifica se existem heróis com esta classe
    const heroCount = db
      .prepare("SELECT COUNT(*) as count FROM heroes WHERE class = ?")
      .get(classInfo.name).count;

    if (heroCount > 0) {
      return reply.status(400).send({
        narration: `Não é possível remover a classe ${
          classInfo.name
        }. Ainda existem ${heroCount} ${
          heroCount === 1 ? "herói" : "heróis"
        } desta classe no reino.`,
        kingdom_time: getKingdomTime(),
      });
    }

    db.prepare("DELETE FROM classes WHERE id = ?").run(id);

    return reply.send({
      narration: `A classe ${classInfo.name} foi removida dos registros da guilda. Seus segredos se perderam no tempo.`,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao remover classe:", error);
    throw error;
  }
}
