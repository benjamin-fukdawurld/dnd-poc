import { describe, expect, test } from "@jest/globals";
import { attributeBonus, dn, formatBonus, ndn } from "./utils";

describe("utils", () => {
  test("attributeBonus", () => {
    expect(attributeBonus(0)).toBe(-5);
    expect(attributeBonus(1)).toBe(-5);

    expect(attributeBonus(6)).toBe(-2);
    expect(attributeBonus(8)).toBe(-1);

    expect(attributeBonus(10)).toBe(0);
    expect(attributeBonus(11)).toBe(0);

    expect(attributeBonus(14)).toBe(2);
    expect(attributeBonus(15)).toBe(2);

    expect(attributeBonus(19)).toBe(4);
    expect(attributeBonus(20)).toBe(5);

    expect(attributeBonus(30)).toBe(10);
    expect(attributeBonus(-30)).toBe(-20);
  });

  test("formatBonus", () => {
    expect(formatBonus(0)).toBe("");
    expect(formatBonus(1)).toBe("+1");
    expect(formatBonus(-1)).toBe("-1");
    expect(formatBonus(20)).toBe("+20");
    expect(formatBonus(-20)).toBe("-20");

    expect(formatBonus(Number.NaN)).toBe("");
  });

  test("ndn", () => {
    expect(ndn(1)(6).length).toBe(1);
    expect(ndn(3)(6).length).toBe(3);
    expect(ndn(5)(6).length).toBe(5);
    expect(ndn(10)(6).length).toBe(10);
    expect(ndn(12)(6).length).toBe(12);

    expect(() => ndn(Number.NaN)(6)).toThrow();
    expect(() => ndn(Number.POSITIVE_INFINITY)(6)).toThrow();
    expect(() => ndn(Number.NEGATIVE_INFINITY)(6)).toThrow();
    expect(() => ndn(0.5)(6)).toThrow();
    expect(() => ndn(-5)(6)).toThrow();
  });

  test("ndn", () => {
    const d1 = [...Array(100)].map(() => dn(6)());
    expect(d1.filter((val) => val < 1 || val > 6).length).toBe(0);
    expect(d1.includes(1)).toBeTruthy();
    expect(d1.includes(2)).toBeTruthy();
    expect(d1.includes(3)).toBeTruthy();
    expect(d1.includes(4)).toBeTruthy();
    expect(d1.includes(5)).toBeTruthy();
    expect(d1.includes(6)).toBeTruthy();

    expect(() => dn(Number.NaN)).toThrow();
    expect(() => dn(Number.POSITIVE_INFINITY)).toThrow();
    expect(() => dn(Number.NEGATIVE_INFINITY)).toThrow();
    expect(() => dn(0.5)).toThrow();
    expect(() => dn(-5)).toThrow();
  });
});
