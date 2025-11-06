import db from "../db/connection.js";
import { narrateCityList, getKingdomTime } from "../utils/narration.js";

// Lista todas as cidades
export function getAllCities(request, reply) {
  try {
    const cities = db
      .prepare("SELECT * FROM cities ORDER BY danger_level ASC")
      .all();

    return reply.send({
      narration: narrateCityList(cities.length),
      cities: cities,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao listar cidades:", error);
    throw error;
  }
}

// Adiciona nova cidade
export function addCity(request, reply) {
  try {
    const { name, description, danger_level } = request.body;

    if (!name || !description || danger_level === undefined) {
      return reply.status(400).send({
        narration:
          "Para fundar uma cidade, são necessários: nome, descrição e nível de perigo.",
        kingdom_time: getKingdomTime(),
      });
    }

    if (danger_level < 1 || danger_level > 10) {
      return reply.status(400).send({
        narration:
          "O nível de perigo deve estar entre 1 (seguro) e 10 (mortal).",
        kingdom_time: getKingdomTime(),
      });
    }

    const insert = db.prepare(`
      INSERT INTO cities (name, description, danger_level) 
      VALUES (?, ?, ?)
    `);

    const result = insert.run(name, description, danger_level);
    const city = db
      .prepare("SELECT * FROM cities WHERE id = ?")
      .get(result.lastInsertRowid);

    const dangerText =
      danger_level <= 3
        ? "relativamente segura"
        : danger_level <= 6
        ? "moderadamente perigosa"
        : "extremamente perigosa";

    return reply.status(201).send({
      narration: `Uma nova cidade surge no mapa do reino: ${name}! ${description} Os viajantes dizem que é ${dangerText}.`,
      city: city,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return reply.status(400).send({
        narration: "Uma cidade com este nome já existe no reino.",
        kingdom_time: getKingdomTime(),
      });
    }
    console.error("Erro ao adicionar cidade:", error);
    throw error;
  }
}

// Remove uma cidade
export function deleteCity(request, reply) {
  try {
    const { id } = request.params;

    const city = db.prepare("SELECT * FROM cities WHERE id = ?").get(id);

    if (!city) {
      return reply.status(404).send({
        narration: "Esta cidade não existe nos mapas do reino.",
        kingdom_time: getKingdomTime(),
      });
    }

    db.prepare("DELETE FROM cities WHERE id = ?").run(id);

    return reply.send({
      narration: `${city.name} foi abandonada e removida dos mapas. Suas ruínas se perdem na história.`,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao remover cidade:", error);
    throw error;
  }
}

// Busca missões diárias
export function getTodayQuests(request, reply) {
  try {
    const quests = db.prepare("SELECT * FROM quests WHERE is_daily = 1").all();

    return reply.send({
      narration: `O quadro de missões da taverna exibe ${quests.length} ${
        quests.length === 1 ? "missão urgente" : "missões urgentes"
      } para hoje.`,
      date: getKingdomTime(),
      quests: quests,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao buscar missões:", error);
    throw error;
  }
}
