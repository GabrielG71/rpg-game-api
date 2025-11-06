import db from "./connection.js";

export function initializeDatabase() {
  console.log("🏰 Construindo as fundações do Reino de Eldoria...\n");

  // Tabela de classes
  db.exec(`
    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      base_hp INTEGER NOT NULL,
      base_attack INTEGER NOT NULL,
      description TEXT NOT NULL
    )
  `);

  // Tabela de heróis
  db.exec(`
    CREATE TABLE IF NOT EXISTS heroes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      class TEXT NOT NULL,
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      gold INTEGER DEFAULT 50,
      hp INTEGER NOT NULL,
      max_hp INTEGER NOT NULL,
      attack INTEGER NOT NULL,
      inventory TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (class) REFERENCES classes(name)
    )
  `);

  // Tabela de itens da loja
  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      power INTEGER DEFAULT 0,
      price INTEGER NOT NULL,
      description TEXT NOT NULL
    )
  `);

  // Tabela de cidades
  db.exec(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      danger_level INTEGER NOT NULL
    )
  `);

  // Tabela de missões
  db.exec(`
    CREATE TABLE IF NOT EXISTS quests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      reward_gold INTEGER NOT NULL,
      reward_xp INTEGER NOT NULL,
      difficulty TEXT NOT NULL,
      is_daily BOOLEAN DEFAULT 0
    )
  `);

  // Popula classes padrão
  const classesCount = db
    .prepare("SELECT COUNT(*) as count FROM classes")
    .get().count;

  if (classesCount === 0) {
    console.log("⚔️  Estabelecendo as Classes dos Heróis...");
    const insertClass = db.prepare(`
      INSERT INTO classes (name, base_hp, base_attack, description) 
      VALUES (?, ?, ?, ?)
    `);

    insertClass.run(
      "Guerreiro",
      150,
      25,
      "Mestres do combate corpo a corpo, os Guerreiros são conhecidos por sua força brutal e resistência lendária."
    );
    insertClass.run(
      "Mago",
      80,
      35,
      "Estudiosos das artes arcanas, os Magos manipulam as energias místicas para devastar seus inimigos à distância."
    );
    insertClass.run(
      "Arqueiro",
      100,
      30,
      "Caçadores silenciosos e precisos, os Arqueiros dominam o arco e flecha com habilidade incomparável."
    );
    console.log("   ✓ 3 classes estabelecidas");
  }

  // Popula cidades padrão
  const citiesCount = db
    .prepare("SELECT COUNT(*) as count FROM cities")
    .get().count;

  if (citiesCount === 0) {
    console.log("🏙️  Fundando as Cidades do Reino...");
    const insertCity = db.prepare(`
      INSERT INTO cities (name, description, danger_level) 
      VALUES (?, ?, ?)
    `);

    insertCity.run(
      "Eldoria",
      "A capital dourada do reino, onde reis e nobres governam sob a luz dos cristais eternos. Suas muralhas jamais foram quebradas.",
      1
    );
    insertCity.run(
      "Montvale",
      "Uma vila cercada por montanhas nevadas, conhecida por seus ferreiros lendários e pela guarda do Portal do Norte.",
      3
    );
    insertCity.run(
      "Drakmor",
      "Cidade sombria construída sobre ruínas antigas. Dizem que dragões ainda habitam as cavernas sob suas fundações.",
      5
    );
    console.log("   ✓ 3 cidades fundadas");
  }

  // Popula itens padrão
  const itemsCount = db
    .prepare("SELECT COUNT(*) as count FROM items")
    .get().count;

  if (itemsCount === 0) {
    console.log("💰 Abastecendo a Loja do Reino...");
    const insertItem = db.prepare(`
      INSERT INTO items (name, type, power, price, description) 
      VALUES (?, ?, ?, ?, ?)
    `);

    insertItem.run(
      "Poção de Cura",
      "consumable",
      50,
      25,
      "Um elixir carmesim que restaura 50 pontos de vida. Preparado pelos alquimistas de Eldoria."
    );
    insertItem.run(
      "Espada de Ferro",
      "weapon",
      15,
      100,
      "Uma lâmina forjada nas forjas de Montvale. Aumenta o ataque em 15 pontos."
    );
    insertItem.run(
      "Cajado Rúnico",
      "weapon",
      20,
      150,
      "Um bastão entalhado com runas antigas que amplifica o poder mágico em 20 pontos."
    );
    insertItem.run(
      "Armadura de Couro",
      "armor",
      30,
      80,
      "Proteção leve mas eficaz. Aumenta a vida máxima em 30 pontos."
    );
    insertItem.run(
      "Elmo do Cavaleiro",
      "armor",
      25,
      60,
      "Um capacete de aço polido. Concede 25 pontos adicionais de vida."
    );
    console.log("   ✓ 5 itens adicionados à loja");
  }

  // Popula missões diárias
  const questsCount = db
    .prepare("SELECT COUNT(*) as count FROM quests")
    .get().count;

  if (questsCount === 0) {
    console.log("📜 Criando Missões do Reino...");
    const insertQuest = db.prepare(`
      INSERT INTO quests (title, description, reward_gold, reward_xp, difficulty, is_daily) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertQuest.run(
      "Caçada aos Lobos",
      "Os lobos estão atacando as fazendas próximas a Eldoria. Elimine 5 lobos selvagens.",
      50,
      100,
      "Fácil",
      1
    );
    insertQuest.run(
      "O Tesouro Perdido",
      "Encontre o baú perdido nas Cavernas de Cristal e retorne com seu conteúdo.",
      120,
      200,
      "Médio",
      1
    );
    insertQuest.run(
      "O Dragão de Drakmor",
      "Um dragão jovem foi avistado nas montanhas. Derrote-o antes que ataque a cidade.",
      300,
      500,
      "Difícil",
      1
    );
    console.log("   ✓ 3 missões criadas");
  }

  console.log("\n✨ O Reino está pronto para receber aventureiros!\n");
}

export { db };
