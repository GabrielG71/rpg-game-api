import db from "../db/connection.js";
import {
  narrateHeroCreation,
  narrateHeroList,
  narrateHeroDetails,
  narrateHeroDeath,
  getKingdomTime,
} from "../utils/narration.js";

// Cria um novo herói
export function createHero(request, reply) {
  try {
    const { name, class: className } = request.body;

    if (!name || !className) {
      return reply.status(400).send({
        narration:
          "Os sábios não conseguem invocar um herói sem nome e classe definidos.",
        kingdom_time: getKingdomTime(),
      });
    }

    // Busca informações da classe
    const classInfo = db
      .prepare("SELECT * FROM classes WHERE name = ?")
      .get(className);

    if (!classInfo) {
      return reply.status(404).send({
        narration: `A classe "${className}" não existe nos registros da guilda. Consulte as classes disponíveis.`,
        kingdom_time: getKingdomTime(),
      });
    }

    // Cria o herói
    const insert = db.prepare(`
      INSERT INTO heroes (name, class, hp, max_hp, attack) 
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      name,
      className,
      classInfo.base_hp,
      classInfo.base_hp,
      classInfo.base_attack
    );

    const hero = db
      .prepare("SELECT * FROM heroes WHERE id = ?")
      .get(result.lastInsertRowid);
    hero.inventory = JSON.parse(hero.inventory);

    return reply.status(201).send({
      narration: narrateHeroCreation(hero, className),
      hero: hero,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao criar herói:", error);
    throw error;
  }
}

// Lista todos os heróis
export function getAllHeroes(request, reply) {
  try {
    const heroes = db
      .prepare("SELECT * FROM heroes ORDER BY level DESC, xp DESC")
      .all();

    heroes.forEach((hero) => {
      hero.inventory = JSON.parse(hero.inventory);
    });

    return reply.send({
      narration: narrateHeroList(heroes.length),
      count: heroes.length,
      heroes: heroes,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao listar heróis:", error);
    throw error;
  }
}

// Busca um herói específico
export function getHeroById(request, reply) {
  try {
    const { id } = request.params;

    const hero = db.prepare("SELECT * FROM heroes WHERE id = ?").get(id);

    if (!hero) {
      return reply.status(404).send({
        narration: `Os pergaminhos não registram nenhum herói com este identificador.`,
        kingdom_time: getKingdomTime(),
      });
    }

    hero.inventory = JSON.parse(hero.inventory);

    return reply.send({
      narration: narrateHeroDetails(hero),
      hero: hero,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao buscar herói:", error);
    throw error;
  }
}

// Remove um herói
export function deleteHero(request, reply) {
  try {
    const { id } = request.params;

    const hero = db.prepare("SELECT * FROM heroes WHERE id = ?").get(id);

    if (!hero) {
      return reply.status(404).send({
        narration: "Este herói já partiu ou nunca existiu nos registros.",
        kingdom_time: getKingdomTime(),
      });
    }

    db.prepare("DELETE FROM heroes WHERE id = ?").run(id);

    return reply.send({
      narration: narrateHeroDeath(hero),
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao deletar herói:", error);
    throw error;
  }
}

// Ranking de heróis
export function getRanking(request, reply) {
  try {
    const { by = "level" } = request.query;

    let orderBy = "level DESC, xp DESC";
    let rankingType = "mais poderosos";

    if (by === "gold") {
      orderBy = "gold DESC";
      rankingType = "mais ricos";
    }

    const heroes = db
      .prepare(`SELECT * FROM heroes ORDER BY ${orderBy} LIMIT 10`)
      .all();

    heroes.forEach((hero) => {
      hero.inventory = JSON.parse(hero.inventory);
    });

    return reply.send({
      narration: `Os bardos cantam sobre os heróis ${rankingType} do reino. Aqui estão os 10 primeiros nas crônicas:`,
      ranking_type: by,
      heroes: heroes,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    throw error;
  }
}

// Reseta um herói
export function resetHero(request, reply) {
  try {
    const { id } = request.params;

    const hero = db.prepare("SELECT * FROM heroes WHERE id = ?").get(id);

    if (!hero) {
      return reply.status(404).send({
        narration: "Este herói não pode ser encontrado nos registros.",
        kingdom_time: getKingdomTime(),
      });
    }

    const classInfo = db
      .prepare("SELECT * FROM classes WHERE name = ?")
      .get(hero.class);

    db.prepare(
      `
      UPDATE heroes 
      SET level = 1, xp = 0, gold = 50, hp = ?, max_hp = ?, attack = ?, inventory = '[]'
      WHERE id = ?
    `
    ).run(classInfo.base_hp, classInfo.base_hp, classInfo.base_attack, id);

    const resetHero = db.prepare("SELECT * FROM heroes WHERE id = ?").get(id);
    resetHero.inventory = JSON.parse(resetHero.inventory);

    return reply.send({
      narration: `${hero.name} bebeu da Fonte do Recomeço. Toda memória e poder foram apagados, e a jornada começa novamente do início.`,
      hero: resetHero,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao resetar herói:", error);
    throw error;
  }
}
