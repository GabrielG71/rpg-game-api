// Utilitários para criar narrativas imersivas

export function getKingdomTime() {
  return "Ano 412 da Era das Chamas";
}

export function narrateHeroCreation(hero, className) {
  const intros = {
    Guerreiro: `Um novo guerreiro se levanta! ${hero.name}, vestindo armadura pesada, empunha sua espada e jura proteger os fracos.`,
    Mago: `Das torres arcanas emerge ${hero.name}, um mago cujos olhos brilham com o poder das estrelas antigas.`,
    Arqueiro: `Silencioso como o vento, ${hero.name} surge das florestas, com arco nas costas e determinação no olhar.`,
  };

  return (
    intros[className] ||
    `${hero.name} inicia sua jornada como ${className}, pronto para escrever sua própria lenda.`
  );
}

export function narrateHeroList(count) {
  if (count === 0) {
    return "A taverna está vazia. Nenhum aventureiro ousou responder ao chamado ainda.";
  }
  if (count === 1) {
    return "Um solitário aventureiro aguarda na taverna, pronto para grandes feitos.";
  }
  return `${count} bravos aventureiros se reúnem na taverna, trocando histórias de batalhas e glória.`;
}

export function narrateHeroDetails(hero) {
  const descriptions = {
    Guerreiro: "um formidável guerreiro com cicatrizes de inúmeras batalhas",
    Mago: "um sábio conhecedor das artes místicas",
    Arqueiro: "um caçador habilidoso com olhar aguçado",
  };

  const desc = descriptions[hero.class] || "um aventureiro determinado";

  return `Diante de você está ${hero.name}, ${desc}. Nível ${hero.level}, com ${hero.gold} moedas de ouro tinindo na bolsa.`;
}

export function narrateHeroDeath(hero) {
  return `As crônicas registram com pesar: ${hero.name}, o ${hero.class} de nível ${hero.level}, partiu para os Salões Eternos. Sua lenda será lembrada.`;
}

export function narrateBattleIntro(hero, enemy) {
  const intros = [
    `${hero.name} encara ${enemy.name} no campo de batalha! O ar se enche de tensão...`,
    `Das sombras surge ${enemy.name}! ${hero.name} desembainha sua arma, pronto para o combate!`,
    `O destino guia ${hero.name} ao encontro de ${enemy.name}. Apenas um sairá vitorioso!`,
    `${enemy.name} bloqueia o caminho de ${hero.name}. A batalha é inevitável!`,
  ];

  return intros[Math.floor(Math.random() * intros.length)];
}

export function narrateBattleVictory(hero, enemy, goldGained, xpGained) {
  const victories = [
    `Após um combate épico, ${hero.name} triunfa sobre ${enemy.name}! O inimigo cai derrotado, deixando para trás ${goldGained} moedas de ouro e valiosos ${xpGained} pontos de experiência.`,
    `${enemy.name} foi derrotado pela bravura de ${hero.name}! Os céus celebram com ${goldGained} moedas douradas e ${xpGained} de experiência conquistada.`,
    `Vitória! ${hero.name} prevalece sobre ${enemy.name} em combate glorioso, saqueando ${goldGained} moedas e ganhando ${xpGained} de experiência!`,
  ];

  return victories[Math.floor(Math.random() * victories.length)];
}

export function narrateBattleDefeat(hero, enemy) {
  return `${hero.name} lutou bravamente, mas ${enemy.name} provou ser um adversário formidável. O herói recua, ferido mas vivo, para lutar outro dia.`;
}

export function narrateLevelUp(hero, newLevel) {
  return `🌟 Os céus se iluminam! ${hero.name} ascende ao nível ${newLevel}, ficando mais forte e sábio!`;
}

export function narrateItemPurchase(hero, item) {
  return `${hero.name} adquire ${item.name} na loja! ${item.description} ${item.price} moedas trocam de mãos.`;
}

export function narrateInsufficientGold(hero, item) {
  return `${hero.name} observa ${item.name} com desejo, mas a bolsa está leve... São necessárias ${item.price} moedas, mas apenas ${hero.gold} estão disponíveis.`;
}

export function narrateItemAdded(hero, item) {
  return `${item.name} foi adicionado ao inventário de ${hero.name}. ${item.description}`;
}

export function narrateItemRemoved(hero, item) {
  return `${hero.name} se desfaz de ${item.name}, deixando o item para trás em sua jornada.`;
}

export function narrateEmptyInventory(hero) {
  return `${hero.name} verifica sua mochila e encontra apenas poeira e esperança. O inventário está vazio.`;
}

export function narrateCityList(count) {
  if (count === 0)
    return "O mapa está em branco. Nenhuma cidade foi descoberta ainda.";
  return `O mapa revela ${count} cidades conhecidas no reino, cada uma com seus próprios segredos e perigos.`;
}

export function narrateClassList(count) {
  return `Os registros da guilda mostram ${count} caminhos disponíveis para os aspirantes a heróis.`;
}
