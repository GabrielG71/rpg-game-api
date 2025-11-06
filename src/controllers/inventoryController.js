import db from "../db/connection.js";
import {
  narrateItemAdded,
  narrateItemRemoved,
  narrateEmptyInventory,
  getKingdomTime,
} from "../utils/narration.js";

// Mostra inventário do herói
export function getInventory(request, reply) {
  try {
    const { heroId } = request.params;

    const hero = db.prepare("SELECT * FROM heroes WHERE id = ?").get(heroId);

    if (!hero) {
      return reply.status(404).send({
        narration: "Este herói não é conhecido nos registros.",
        kingdom_time: getKingdomTime(),
      });
    }

    const inventory = JSON.parse(hero.inventory);

    if (inventory.length === 0) {
      return reply.send({
        narration: narrateEmptyInventory(hero),
        hero_name: hero.name,
        items: [],
        kingdom_time: getKingdomTime(),
      });
    }

    return reply.send({
      narration: `${hero.name} abre sua mochila e revela ${inventory.length} ${
        inventory.length === 1 ? "item precioso" : "itens preciosos"
      }.`,
      hero_name: hero.name,
      items: inventory,
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao buscar inventário:", error);
    throw error;
  }
}

// Adiciona item manualmente ao inventário
export function addToInventory(request, reply) {
  try {
    const { heroId } = request.params;
    const { itemId } = request.body;

    if (!itemId) {
      return reply.status(400).send({
        narration:
          "É necessário especificar qual item adicionar ao inventário.",
        kingdom_time: getKingdomTime(),
      });
    }

    const hero = db.prepare("SELECT * FROM heroes WHERE id = ?").get(heroId);

    if (!hero) {
      return reply.status(404).send({
        narration: "Este herói não existe nos registros.",
        kingdom_time: getKingdomTime(),
      });
    }

    const item = db.prepare("SELECT * FROM items WHERE id = ?").get(itemId);

    if (!item) {
      return reply.status(404).send({
        narration: "Este item não existe no reino.",
        kingdom_time: getKingdomTime(),
      });
    }

    const inventory = JSON.parse(hero.inventory);
    inventory.push({
      id: item.id,
      name: item.name,
      type: item.type,
      power: item.power,
      description: item.description,
      acquired_at: new Date().toISOString(),
    });

    // Aplica bônus se for equipamento
    let hpBonus = 0;
    let attackBonus = 0;

    if (item.type === "armor") {
      hpBonus = item.power;
    } else if (item.type === "weapon") {
      attackBonus = item.power;
    }

    db.prepare(
      `
      UPDATE heroes 
      SET inventory = ?, max_hp = max_hp + ?, attack = attack + ?
      WHERE id = ?
    `
    ).run(JSON.stringify(inventory), hpBonus, attackBonus, heroId);

    const updatedHero = db
      .prepare("SELECT * FROM heroes WHERE id = ?")
      .get(heroId);
    updatedHero.inventory = JSON.parse(updatedHero.inventory);

    return reply.send({
      narration: narrateItemAdded(hero, item),
      item_added: item,
      hero_stats: {
        max_hp: updatedHero.max_hp,
        attack: updatedHero.attack,
      },
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao adicionar item:", error);
    throw error;
  }
}

// Remove item do inventário
export function removeFromInventory(request, reply) {
  try {
    const { heroId, itemId } = request.params;

    const hero = db.prepare("SELECT * FROM heroes WHERE id = ?").get(heroId);

    if (!hero) {
      return reply.status(404).send({
        narration: "Este herói não é conhecido.",
        kingdom_time: getKingdomTime(),
      });
    }

    const inventory = JSON.parse(hero.inventory);
    const itemIndex = inventory.findIndex(
      (item) => item.id === parseInt(itemId)
    );

    if (itemIndex === -1) {
      return reply.status(404).send({
        narration: `${hero.name} procura na mochila mas não encontra este item.`,
        kingdom_time: getKingdomTime(),
      });
    }

    const removedItem = inventory[itemIndex];
    inventory.splice(itemIndex, 1);

    // Remove bônus se for equipamento
    let hpPenalty = 0;
    let attackPenalty = 0;

    if (removedItem.type === "armor") {
      hpPenalty = removedItem.power;
    } else if (removedItem.type === "weapon") {
      attackPenalty = removedItem.power;
    }

    db.prepare(
      `
      UPDATE heroes 
      SET inventory = ?, max_hp = max_hp - ?, attack = attack - ?
      WHERE id = ?
    `
    ).run(JSON.stringify(inventory), hpPenalty, attackPenalty, heroId);

    const updatedHero = db
      .prepare("SELECT * FROM heroes WHERE id = ?")
      .get(heroId);
    updatedHero.inventory = JSON.parse(updatedHero.inventory);

    return reply.send({
      narration: narrateItemRemoved(hero, removedItem),
      item_removed: removedItem,
      hero_stats: {
        max_hp: updatedHero.max_hp,
        attack: updatedHero.attack,
      },
      kingdom_time: getKingdomTime(),
    });
  } catch (error) {
    console.error("Erro ao remover item:", error);
    throw error;
  }
}
