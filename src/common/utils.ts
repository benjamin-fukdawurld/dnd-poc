export function attributeBonus(val: number) {
  return Math.floor((val - 10) / 2);
}

export function formatBonus(val: number): string {
  const plus = val > 0 ? "+" : "";
  return val === 0 ? "" : `${plus}${val}`;
}

export function dn(val: number) {
  return () => Math.floor(Math.random() * (val - 1) + 1);
}

export const d20 = dn(20);
