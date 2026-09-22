export function drawNumber() {
  return Math.floor(Math.random() * 11);
}

export function parseGuess(value) {
  if (!/^\d+$/.test(value.trim())) return null;
    
  const guess = Number(value);
  return guess >= 0 && guess <= 10 ? guess : null;
}
