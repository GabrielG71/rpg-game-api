import { getRandomInt } from "./random.js";

// Lista de inimigos possíveis
const enemyTemplates = [
  {
    name: "Goblin das Sombras",
    hpRange: [40, 80],
    attackRange: [10, 20],
    goldRange: [20, 40],
    xpRange: [30, 60],
  },
  {
    name: "Lobo Selvagem",
    hpRange: [50, 90],
    attackRange: [12, 22],
    goldRange: [15, 35],
    xpRange: [25, 55],
  },
  {
    name: "Esqueleto Guerreiro",
    hpRange: [60, 100],
    attackRange: [15, 25],
    goldRange: [25, 50],
    xpRange: [40, 70],
  },
  {
    name: "Orc Berserker",
    hpRange: [80, 120],
    attackRange: [18, 28],
    goldRange: [35, 65],
    xpRange: [50, 90],
  },
  {
    name: "Aranha Gigante",
    hpRange: [55, 95],
    attackRange: [14, 24],
    goldRange: [20, 45],
    xpRange: [35, 65],
  },
  {
    name: "Troll das Cavernas",
    hpRange: [100, 150],
    attackRange: [20, 35],
    goldRange: [50, 90],
    xpRange: [70, 120],
  },
  {
    name: "Bandit Renegado",
    hpRange: [45, 85],
    attackRange: [13, 23],
    goldRange: [30, 55],
    xpRange: [35, 65],
  },
  {
    name: "Ogro das Montanhas",
    hpRange: [120, 180],
    attackRange: [25, 40],
    goldRange: [60, 110],
    xpRange: [80, 140],
  },
  {
    name: "Espectro Sombrio",
    hpRange: [70, 110],
    attackRange: [16, 26],
    goldRange: [40, 70],
    xpRange: [55, 95],
  },
  {
    name: "Dragão Jovem",
    hpRange: [150, 250],
    attackRange: [30, 50],
    goldRange: [100, 200],
    xpRange: [150, 250],
  },
];

// Ajusta dificuldade baseado no nível do herói
export function generateEnemy(heroLevel) {
  // Seleciona um template aleatório
  const template = enemyTemplates[getRandomInt(0, enemyTemplates.length - 1)];

  // Ajusta os valores baseado no nível do herói
  const levelMultiplier = 1 + (heroLevel - 1) * 0.15;

  const hp = Math.floor(
    getRandomInt(template.hpRange[0], template.hpRange[1]) * levelMultiplier
  );
  const attack = Math.floor(
    getRandomInt(template.attackRange[0], template.attackRange[1]) *
      levelMultiplier
  );
  const gold = Math.floor(
    getRandomInt(template.goldRange[0], template.goldRange[1]) * levelMultiplier
  );
  const xp = Math.floor(
    getRandomInt(template.xpRange[0], template.xpRange[1]) * levelMultiplier
  );

  return {
    name: template.name,
    hp: hp,
    maxHp: hp,
    attack: attack,
    gold: gold,
    xp: xp,
  };
}

// Simula um combate entre herói e inimigo
export function simulateBattle(hero, enemy) {
  let heroHp = hero.hp;
  let enemyHp = enemy.hp;
  const battleLog = [];

  let round = 1;

  while (heroHp > 0 && enemyHp > 0) {
    // Herói ataca
    const heroDamage = getRandomInt(
      Math.floor(hero.attack * 0.8),
      Math.floor(hero.attack * 1.2)
    );
    enemyHp -= heroDamage;
    battleLog.push(
      `Rodada ${round}: ${hero.name} causa ${heroDamage} de dano em ${enemy.name}!`
    );

    if (enemyHp <= 0) break;

    // Inimigo ataca
    const enemyDamage = getRandomInt(
      Math.floor(enemy.attack * 0.8),
      Math.floor(enemy.attack * 1.2)
    );
    heroHp -= enemyDamage;
    battleLog.push(
      `Rodada ${round}: ${enemy.name} contra-ataca causando ${enemyDamage} de dano em ${hero.name}!`
    );

    round++;

    // Limita a 20 rodadas para evitar loops infinitos
    if (round > 20) {
      battleLog.push(
        "A batalha se estende por muito tempo... Ambos recuam, exaustos."
      );
      return {
        victory: false,
        heroHpRemaining: heroHp,
        battleLog: battleLog,
        draw: true,
      };
    }
  }

  return {
    victory: heroHp > 0,
    heroHpRemaining: Math.max(heroHp, 1), // Herói nunca morre, fica com 1 HP
    battleLog: battleLog,
    draw: false,
  };
}
