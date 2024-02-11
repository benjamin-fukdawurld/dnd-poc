export function attributeBonus(val: number) {
  return Math.floor((val - 10) / 2);
}

export function formatBonus(val: number): string {
  if (Number.isNaN(val)) {
    return "";
  }

  const plus = val > 0 ? "+" : "";
  return val === 0 ? "" : `${plus}${val}`;
}

export function dn(size: number) {
  if (
    Number.isNaN(size) ||
    !Number.isFinite(size) ||
    !Number.isInteger(size) ||
    size <= 0
  ) {
    throw new Error("dn: parameter must be a finite positive integer");
  }

  return () => Math.floor(Math.random() * size + 1);
}

export function ndn(n: number): (size: number) => number[] {
  if (
    Number.isNaN(n) ||
    !Number.isFinite(n) ||
    !Number.isInteger(n) ||
    n <= 0
  ) {
    throw new Error("ndn: parameter must be a finite positive integer");
  }

  return (size: number) => {
    const d = dn(size);
    return [...Array(n)].map(() => d());
  };
}

export const d20 = dn(20);
