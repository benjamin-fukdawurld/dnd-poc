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
  name: string;
  healthPoints: Range;
  armorClass: number;
  actions: string[];
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

export interface ICombatController {
  logs: string[];
  target?: Combatant;

  log(message: string): ICombatController;

  getMenu(combat: Combat): HTMLTemplateResult | typeof nothing;

  getActiveCombatant: (combat: Combat) => Combatant | undefined;

  rollInitiatives: (combat: Combat) => Combat;
  beginTurn: (combat: Combat) => Combat;
  endTurn: (combat: Combat) => Combat;
  attack: CombatAction;
  heal: CombatAction;
}

export type CombatantActionEventDetailBase = {
  source: Combatant;
};

export type CombatantActionEventDetail = CombatantActionEventDetailBase &
  (
    | {
        action: "attack";
        target: Combatant;
      }
    | {
        action: "cure wounds";
        target: Combatant;
      }
    | {
        action: "fireball";
        position: { x: number; y: number };
      }
  );

export type CombatantActionEvent = CustomEvent<CombatantActionEventDetail>;
