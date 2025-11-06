import app from "./app.js";

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(
      `\n⚔️  O Reino de Eldoria está aberto aos aventureiros na porta ${PORT}!`
    );
    console.log(`📜 As crônicas começaram no Ano 412 da Era das Chamas...\n`);
  } catch (err) {
    console.error("❌ O portal mágico falhou ao abrir:", err);
    process.exit(1);
  }
};

start();
