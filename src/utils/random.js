// Utilitários para geração de números aleatórios

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function rollDice(sides = 20) {
  return getRandomInt(1, sides);
}
