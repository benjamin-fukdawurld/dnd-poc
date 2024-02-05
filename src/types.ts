import { HTMLTemplateResult, nothing } from "lit";

export const AttributeNames = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
] as const;
export type AttributeName = (typeof AttributeNames)[number];

export type CreatureAttributes = Record<AttributeName, number>;

export type Range = {
  min: number;
  max: number;
  value: number;
};

export interface Combatant {
  id: string;
  type: string;
  name: string;
  hitPoints: Range;
  armorClass: number;
  actions: CombatantActionName[];
  attackRoll: (combatant: Combatant) => number;
  damageRoll: (combatant: Combatant) => number;
  attributes: CreatureAttributes;
  availableActions: Range;
}

export type Combat = {
  combatants: Combatant[];
  groups: number[][];
  order: number[];
  round: number;
  turn: number;
};

export type CombatActionOptions = {
  source: Combatant;
  target: Combatant;
  combat: Combat;
};

export type CombatAction = (options: CombatActionOptions) => Combat;

export interface ICombatantController {
  combatant: Combatant;
  target?: Combatant;

  image: HTMLTemplateResult | typeof nothing;

  beginTurn: (combat: Combat) => Combat;
  endTurn: (combat: Combat) => Combat;

  initiativeRoll: (combat: Combat) => number;
  attackRoll: (combat: Combat) => number;
  damageRoll: (combat: Combat) => number;
}

export interface ICombatController {
  logs: string[];
  target?: Combatant;

  log(message: string): ICombatController;

  getMenu(combat: Combat): HTMLTemplateResult | typeof nothing;
  getCombatantActionWidget(
    action: CombatantActionName,
    combatant: Combatant,
    combat: Combat
  ): HTMLTemplateResult | typeof nothing;

  getActiveCombatant: (combat: Combat) => Combatant | undefined;
  getCombatantController: (id: string) => ICombatantController | undefined;

  rollInitiatives: (combat: Combat) => Combat;
  beginTurn: (combat: Combat) => Combat;
  endTurn: (combat: Combat) => Combat;
  attack: CombatAction;
  heal: CombatAction;
}

export type CombatantActionBase = {
  source: Combatant;
  combat: Combat;
};

export type CombatantAction = CombatantActionBase & {
  action: "attack" | "cure wounds";
  target: Combatant;
};

export type CombatantActionName = CombatantAction["action"];
