import db from "../db/connection.js";
import {
  narrateItemPurchase,
  narrateInsufficientGold,
  getKingdomTime,
} from "../utils/narration.js";

// Lista todos os itens da loja
export function getShopItems(request, reply) {
  try {
    const items = db.prepare("SELECT * FROM items ORDER BY price ASC").all();

    return reply.send({
      narration: `O mercador sorri e mostra sua coleção: ${items.length} itens magníficos aguardam novos donos.`,
      items: items,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao listar itens:", error);
    throw error;
  }
}

// Compra um item
export function buyItem(request, reply) {
  try {
    const { heroId, itemId } = request.params;

    // Busca herói
    const hero = db.prepare("SELECT * FROM heroes WHERE id = ?").get(heroId);

    if (!hero) {
      return reply.status(404).send({
        narration: "Este herói não é conhecido pelo mercador.",
        kingdom_time: getKingdomTime(),
      });
    }

    // Busca item
    const item = db.prepare("SELECT * FROM items WHERE id = ?").get(itemId);

    if (!item) {
      return reply.status(404).send({
        narration: "Este item não existe na loja do mercador.",
        kingdom_time: getKingdomTime(),
      });
    }

    // Verifica se tem ouro suficiente
    if (hero.gold < item.price) {
      return reply.status(400).send({
        narration: narrateInsufficientGold(hero, item),
        required: item.price,
        available: hero.gold,
        kingdom_time: getKingdomTime(),
      });
    }

    // Processa a compra
    const newGold = hero.gold - item.price;
    const inventory = JSON.parse(hero.inventory);
    inventory.push({
      id: item.id,
      name: item.name,
      type: item.type,
      power: item.power,
      description: item.description,
      acquired_at: new Date().toISOString(),
    });

    // Aplica bônus do item
    let hpBonus = 0;
    let attackBonus = 0;

    if (item.type === "armor") {
      hpBonus = item.power;
    } else if (item.type === "weapon") {
      attackBonus = item.power;
    } else if (item.type === "consumable") {
      // Poção de cura restaura HP imediatamente
      const hpRestored = Math.min(item.power, hero.max_hp - hero.hp);
      db.prepare("UPDATE heroes SET hp = hp + ? WHERE id = ?").run(
        hpRestored,
        heroId
      );
    }

    db.prepare(
      `
      UPDATE heroes 
      SET gold = ?, inventory = ?, max_hp = max_hp + ?, attack = attack + ?
      WHERE id = ?
    `
    ).run(newGold, JSON.stringify(inventory), hpBonus, attackBonus, heroId);

    const updatedHero = db
      .prepare("SELECT * FROM heroes WHERE id = ?")
      .get(heroId);
    updatedHero.inventory = JSON.parse(updatedHero.inventory);

    let effectNarration = "";
    if (item.type === "armor") {
      effectNarration = ` A vida máxima aumenta em ${item.power} pontos!`;
    } else if (item.type === "weapon") {
      effectNarration = ` O poder de ataque aumenta em ${item.power} pontos!`;
    } else if (item.type === "consumable") {
      effectNarration = ` O efeito é imediato, restaurando pontos de vida!`;
    }

    return reply.send({
      narration: narrateItemPurchase(hero, item) + effectNarration,
      item_purchased: item,
      hero_stats: {
        gold: updatedHero.gold,
        hp: updatedHero.hp,
        max_hp: updatedHero.max_hp,
        attack: updatedHero.attack,
      },
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao comprar item:", error);
    throw error;
  }
}

// Adiciona novo item à loja
export function addShopItem(request, reply) {
  try {
    const { name, type, power, price, description } = request.body;

    if (!name || !type || price === undefined || !description) {
      return reply.status(400).send({
        narration:
          "O mercador precisa de mais informações: nome, tipo, preço e descrição são obrigatórios.",
        kingdom_time: getKingdomTime(),
      });
    }

    const insert = db.prepare(`
      INSERT INTO items (name, type, power, price, description) 
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insert.run(name, type, power || 0, price, description);
    const item = db
      .prepare("SELECT * FROM items WHERE id = ?")
      .get(result.lastInsertRowid);

    return reply.status(201).send({
      narration: `O mercador adquiriu um novo item raro: ${name}! Está agora disponível na loja.`,
      item: item,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    if (error.message.includes("UNIQUE constraint failed")) {
      return reply.status(400).send({
        narration: "Este item já existe na loja do mercador.",
        kingdom_time: getKingdomTime(),
      });
    }
    console.error("Erro ao adicionar item:", error);
    throw error;
  }
}

// Remove item da loja
export function deleteShopItem(request, reply) {
  try {
    const { itemId } = request.params;

    const item = db.prepare("SELECT * FROM items WHERE id = ?").get(itemId);

    if (!item) {
      return reply.status(404).send({
        narration: "Este item não existe na loja.",
        kingdom_time: getKingdomTime(),
      });
    }

    db.prepare("DELETE FROM items WHERE id = ?").run(itemId);

    return reply.send({
      narration: `${item.name} foi removido da loja. O mercador vendeu seu último exemplar.`,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao remover item:", error);
    throw error;
  }
}
