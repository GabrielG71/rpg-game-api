import db from "../db/connection.js";
import { generateEnemy, simulateBattle } from "../utils/enemyGenerator.js";
import {
  narrateBattleIntro,
  narrateBattleVictory,
  narrateBattleDefeat,
  narrateLevelUp,
  getKingdomTime,
} from "../utils/narration.js";

// Calcula XP necessário para próximo nível
function getXpForNextLevel(level) {
  return level * 100;
}

// Processa uma batalha
export function battle(request, reply) {
  try {
    const { id } = request.params;

    // Busca o herói
    const hero = db.prepare("SELECT * FROM heroes WHERE id = ?").get(id);

    if (!hero) {
      return reply.status(404).send({
        narration: "Este herói não foi encontrado nos registros da guilda.",
        kingdom_time: getKingdomTime(),
      });
    }

    if (hero.hp <= 0) {
      return reply.status(400).send({
        narration: `${hero.name} está ferido demais para batalhar. Descanse e recupere suas forças.`,
        kingdom_time: getKingdomTime(),
      });
    }

    // Gera inimigo baseado no nível do herói
    const enemy = generateEnemy(hero.level);

    // Simula a batalha
    const battleResult = simulateBattle(hero, enemy);

    let response = {
      battle_intro: narrateBattleIntro(hero, enemy),
      enemy: {
        name: enemy.name,
        hp: enemy.maxHp,
        attack: enemy.attack,
      },
      battle_log: battleResult.battleLog,
      kingdom_time: getKingdomTime(),
    };

    if (battleResult.draw) {
      response.narration = `A batalha entre ${hero.name} e ${enemy.name} termina em empate. Ambos recuam para lutar outro dia.`;
      response.result = "draw";

      // Atualiza HP do herói
      db.prepare("UPDATE heroes SET hp = ? WHERE id = ?").run(
        battleResult.heroHpRemaining,
        id
      );

      const updatedHero = db
        .prepare("SELECT * FROM heroes WHERE id = ?")
        .get(id);
      response.hero_stats = {
        hp: updatedHero.hp,
        max_hp: updatedHero.max_hp,
        level: updatedHero.level,
        xp: updatedHero.xp,
        gold: updatedHero.gold,
      };

      return reply.send(response);
    }

    if (battleResult.victory) {
      // Vitória!
      const xpGained = enemy.xp;
      const goldGained = enemy.gold;
      const newXp = hero.xp + xpGained;
      const newGold = hero.gold + goldGained;
      const newHp = battleResult.heroHpRemaining;

      // Verifica level up
      let newLevel = hero.level;
      let levelUpMessage = "";
      let bonusHp = 0;
      let bonusAttack = 0;

      const xpNeeded = getXpForNextLevel(hero.level);

      if (newXp >= xpNeeded) {
        newLevel = hero.level + 1;
        bonusHp = 20;
        bonusAttack = 5;
        levelUpMessage = narrateLevelUp(hero, newLevel);
      }

      // Atualiza herói no banco
      db.prepare(
        `
        UPDATE heroes 
        SET xp = ?, gold = ?, hp = ?, level = ?, max_hp = max_hp + ?, attack = attack + ?
        WHERE id = ?
      `
      ).run(newXp, newGold, newHp, newLevel, bonusHp, bonusAttack, id);

      const updatedHero = db
        .prepare("SELECT * FROM heroes WHERE id = ?")
        .get(id);

      response.narration = narrateBattleVictory(
        hero,
        enemy,
        goldGained,
        xpGained
      );
      response.result = "victory";
      response.rewards = {
        xp_gained: xpGained,
        gold_gained: goldGained,
      };
      response.hero_stats = {
        hp: updatedHero.hp,
        max_hp: updatedHero.max_hp,
        level: updatedHero.level,
        xp: updatedHero.xp,
        gold: updatedHero.gold,
        attack: updatedHero.attack,
      };

      if (levelUpMessage) {
        response.level_up = levelUpMessage;
        response.level_up_bonuses = {
          hp: bonusHp,
          attack: bonusAttack,
        };
      }
    } else {
      // Derrota
      response.narration = narrateBattleDefeat(hero, enemy);
      response.result = "defeat";

      // Herói perde metade do ouro e fica com 1 HP
      const goldLost = Math.floor(hero.gold * 0.5);
      const newGold = hero.gold - goldLost;

      db.prepare("UPDATE heroes SET hp = 1, gold = ? WHERE id = ?").run(
        newGold,
        id
      );

      const updatedHero = db
        .prepare("SELECT * FROM heroes WHERE id = ?")
        .get(id);

      response.penalty = {
        gold_lost: goldLost,
        narration: `Em sua fuga, ${hero.name} deixou cair ${goldLost} moedas de ouro.`,
      };
      response.hero_stats = {
        hp: updatedHero.hp,
        max_hp: updatedHero.max_hp,
        level: updatedHero.level,
        xp: updatedHero.xp,
        gold: updatedHero.gold,
      };
    }

    return reply.send(response);
  } catch (error) {
    console.error("Erro na batalha:", error);
    throw error;
  }
}
