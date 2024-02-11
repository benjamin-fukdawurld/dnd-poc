import { ActionName } from "../actions/types";

export type CappedValue = {
  value: number;
  max: number;
};

export type Range = CappedValue & {
  min: number;
};

export type Position = {
  x: number;
  y: number;
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

export interface Combatant {
  id: string;
  type: string;
  name: string;
  position: Position;
  hitPoints: Range;
  armorClass: number;
  actions: ActionName[];
  attributes: Attributes;
  availableActions: CappedValue;
  remainingMovement: CappedValue;

  imageId?: string;
}

export type Combat = {
  groups: string[][];
  order: number[];
  round: number;
  turn: number;
};
