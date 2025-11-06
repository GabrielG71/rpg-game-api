# ⚔️ Medieval RPG API

Uma API REST imersiva de RPG medieval construída com Node.js, Fastify e SQLite. Entre em um mundo de fantasia onde heróis lutam contra monstros, ganham experiência, compram equipamentos e escrevem suas próprias lendas!

## 🏰 Sobre o Projeto

Esta API simula um universo de RPG medieval completo, onde todas as respostas são narradas de forma imersiva, como se fossem contadas por um bardo. Cada ação é acompanhada de descrições épicas e dramáticas que transportam o usuário para o mundo de fantasia.

**Reino**: Eldoria  
**Era Atual**: Ano 412 da Era das Chamas

## 🚀 Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>

# Instale as dependências
npm install

# Inicie o servidor em modo desenvolvimento
npm run dev

# Ou em modo produção
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📚 Estrutura do Projeto

```
src/
├── server.js              # Inicialização do servidor
├── app.js                 # Configuração do Fastify e rotas
├── routes/                # Definição de rotas
│   ├── heroes.js
│   ├── battle.js
│   ├── shop.js
│   ├── inventory.js
│   ├── classes.js
│   └── cities.js
├── controllers/           # Lógica de negócio
│   ├── heroController.js
│   ├── battleController.js
│   ├── shopController.js
│   ├── inventoryController.js
│   ├── classController.js
│   └── cityController.js
├── db/                    # Banco de dados
│   ├── connection.js
│   └── init.js
└── utils/                 # Utilitários
    ├── enemyGenerator.js
    ├── narration.js
    └── random.js
```

## 🎮 Endpoints da API

### 👤 Heróis

#### Criar Herói

```http
POST /heroes
Content-Type: application/json

{
  "name": "Aragorn",
  "class": "Guerreiro"
}
```

#### Listar Todos os Heróis

```http
GET /heroes
```

#### Buscar Herói Específico

```http
GET /heroes/:id
```

#### Remover Herói

```http
DELETE /heroes/:id
```

#### Ranking de Heróis

```http
GET /ranking?by=level
GET /ranking?by=gold
```

#### Resetar Herói

```http
POST /reset/:id
```

### ⚔️ Batalhas

#### Iniciar Batalha

```http
POST /battle/:id
```

O herói enfrentará um inimigo aleatório baseado em seu nível. A batalha é simulada automaticamente e retorna:

- Narração épica do combate
- Log detalhado de cada rodada
- XP e ouro ganhos (em vitória)
- Possível subida de nível
- Penalidades (em derrota)

### 💰 Loja

#### Listar Itens

```http
GET /shop
```

#### Comprar Item

```http
POST /shop/buy/:heroId/:itemId
```

#### Adicionar Item à Loja

```http
POST /shop/items
Content-Type: application/json

{
  "name": "Machado de Guerra",
  "type": "weapon",
  "power": 25,
  "price": 200,
  "description": "Um machado mortal forjado nas chamas vulcânicas."
}
```

#### Remover Item da Loja

```http
DELETE /shop/items/:itemId
```

### 🎒 Inventário

#### Ver Inventário

```http
GET /inventory/:heroId
```

#### Adicionar Item ao Inventário

```http
POST /inventory/add/:heroId
Content-Type: application/json

{
  "itemId": 1
}
```

#### Remover Item do Inventário

```http
DELETE /inventory/:heroId/:itemId
```

### 🛡️ Classes

#### Listar Classes

```http
GET /classes
```

Classes padrão:

- **Guerreiro**: 150 HP, 25 Ataque
- **Mago**: 80 HP, 35 Ataque
- **Arqueiro**: 100 HP, 30 Ataque

#### Adicionar Classe

```http
POST /classes
Content-Type: application/json

{
  "name": "Paladino",
  "base_hp": 130,
  "base_attack": 28,
  "description": "Guerreiros sagrados que canalizam a luz divina."
}
```

#### Remover Classe

```http
DELETE /classes/:id
```

### 🏙️ Cidades

#### Listar Cidades

```http
GET /cities
```

Cidades padrão:

- **Eldoria**: Capital dourada (Perigo: 1)
- **Montvale**: Vila das montanhas (Perigo: 3)
- **Drakmor**: Cidade das ruínas (Perigo: 5)

#### Adicionar Cidade

```http
POST /cities
Content-Type: application/json

{
  "name": "Porto Cinzento",
  "description": "Um porto movimentado onde piratas e mercadores se encontram.",
  "danger_level": 4
}
```

#### Remover Cidade

```http
DELETE /cities/:id
```

#### Missões Diárias

```http
GET /quests/today
```

## 🎯 Mecânicas do Jogo

### Sistema de Combate

- Batalhas automáticas em turnos
- Dano variável (80% - 120% do ataque base)
- Herói nunca morre (fica com 1 HP)
- Vitória: Ganha XP e ouro
- Derrota: Perde 50% do ouro

### Sistema de Level

- Level inicial: 1
- XP necessário para subir: `nivel_atual * 100`
- Bônus por level:
  - +20 HP máximo
  - +5 Ataque

### Tipos de Itens

- **weapon**: Aumenta ataque permanentemente
- **armor**: Aumenta HP máximo permanentemente
- **consumable**: Efeito imediato (ex: poção de cura)

### Inimigos

Inimigos aleatórios que escalam com o nível do herói:

- Goblin das Sombras
- Lobo Selvagem
- Esqueleto Guerreiro
- Orc Berserker
- Aranha Gigante
- Troll das Cavernas
- Bandit Renegado
- Ogro das Montanhas
- Espectro Sombrio
- Dragão Jovem

## 📖 Exemplo de Resposta

```json
{
  "narration": "O bravo Mago Gandalf enfrentou o Goblin das Sombras e venceu após uma dura batalha.",
  "battle_intro": "Gandalf encara Goblin das Sombras no campo de batalha! O ar se enche de tensão...",
  "enemy": {
    "name": "Goblin das Sombras",
    "hp": 60,
    "attack": 15
  },
  "battle_log": [
    "Rodada 1: Gandalf causa 38 de dano em Goblin das Sombras!",
    "Rodada 1: Goblin das Sombras contra-ataca causando 14 de dano em Gandalf!",
    "Rodada 2: Gandalf causa 42 de dano em Goblin das Sombras!"
  ],
  "result": "victory",
  "rewards": {
    "xp_gained": 50,
    "gold_gained": 30
  },
  "hero_stats": {
    "hp": 66,
    "max_hp": 80,
    "level": 1,
    "xp": 50,
    "gold": 80,
    "attack": 35
  },
  "kingdom_time": "Ano 412 da Era das Chamas"
}
```

## 🌟 Recursos Especiais

- **Narrativas Imersivas**: Todas as respostas são narradas de forma épica
- **Sistema de Log**: Cada requisição é registrada com narrativa medieval
- **Tempo do Reino**: Todas as respostas incluem "Ano 412 da Era das Chamas"
- **Banco Auto-Inicializado**: Classes, cidades, itens e missões são criados automaticamente
- **Validações Narrativas**: Erros também são narrados de forma imersiva

## 🛠️ Tecnologias

- **Node.js**: Runtime JavaScript
- **Fastify**: Framework web rápido e eficiente
- **better-sqlite3**: Banco de dados SQLite
- **ESM**: Módulos ES6 nativos

## 📝 Notas de Desenvolvimento

- O banco de dados `medieval_rpg.db` é criado automaticamente na primeira execução
- Herói nunca morre completamente (HP mínimo: 1)
- Itens consumíveis têm efeito imediato ao serem comprados
- Classes não podem ser removidas se houverem heróis usando-as
- Inimigos escalam com o nível do herói (multiplicador: 1 + (nivel-1) \* 0.15)

## 🎭 Tom Narrativo

Todas as respostas seguem um estilo de narração medieval/fantasia:

- Bardos contam histórias
- Sábios registram eventos
- Mercadores negociam
- Heróis realizam feitos épicos

## 🤝 Contribuindo

Este é um projeto educacional. Sinta-se livre para expandir:

- Adicionar novos tipos de inimigos
- Criar sistema de quests mais complexo
- Implementar multiplayer
- Adicionar dungeons
- Sistema de guildas

**Que os ventos da sorte guiem sua jornada, bravo aventureiro! ⚔️**
