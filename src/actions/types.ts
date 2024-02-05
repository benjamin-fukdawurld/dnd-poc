import { ActionName, Combat, Combatant } from "../common/types";

export type CombatActionOptions = {
  source: Combatant;
  target: Combatant;
  combat: Combat;
};

export type CombatAction = (options: CombatActionOptions) => Combat;

export type CombatantActionBase = {
  source: Combatant;
  combat: Combat;
};

export type CombatantAction = CombatantActionBase & {
  action: ActionName;
  target: Combatant;
};
