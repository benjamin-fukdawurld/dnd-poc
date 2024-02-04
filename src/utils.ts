export function attributeBonus(val: number) {
  return Math.floor((val - 10) / 2);
}

export function formatBonus(val: number): string {
  const plus = val > 0 ? "+" : "";
  return val === 0 ? "" : `${plus}${val}`;
}

export function d20(): number {
  return Math.floor(Math.random() * 19 + 1);
}

export const LogSeparator = `
---------------------------------------------` as const;
