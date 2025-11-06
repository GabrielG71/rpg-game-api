import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cria ou conecta ao banco de dados SQLite
const db = new Database(join(__dirname, "medieval_rpg.db"), {
  verbose: console.log,
});

// Habilita foreign keys
db.pragma("foreign_keys = ON");

export default db;
