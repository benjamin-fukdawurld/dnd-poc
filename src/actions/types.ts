import { ICombatantController } from "../combatant/types";
import { ActionName, Combat } from "../common/types";

export type CombatantActionBase = {
  source: ICombatantController;
  combat: Combat;
};

export type CombatantAction = CombatantActionBase & {
  action: ActionName;
  target: ICombatantController;
};
