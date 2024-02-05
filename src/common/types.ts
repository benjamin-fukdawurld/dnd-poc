export type CappedValue = {
  value: number;
  max: number;
};

export type Range = CappedValue & {
  min: number;
};

export const LogLevelNames = ["debug", "info", "warn", "error"] as const;
export type LogLevelName = (typeof LogLevelNames)[number];

export const AttributeNames = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
] as const;
export type AttributeName = (typeof AttributeNames)[number];

export type Attributes = Record<AttributeName, number>;

export const ActionNames = ["attack", "cure wounds"] as const;
export type ActionName = (typeof ActionNames)[number];

export interface Combatant {
  id: string;
  type: string;
  name: string;
  hitPoints: Range;
  armorClass: number;
  actions: ActionName[];
  attributes: Attributes;
  availableActions: Range;
}

export type Combat = {
  combatants: Combatant[];
  groups: number[][];
  order: number[];
  round: number;
  turn: number;
};
