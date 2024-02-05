import { HTMLTemplateResult, nothing } from "lit";
import { Combat, Combatant } from "../common/types";

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

export type CombatantBuilder = (fragment: Partial<Combatant>) => Combatant;
export type CombatantControllerBuilder = (
  fragment: Partial<ICombatantController> &
    Pick<ICombatantController, "combatant">
) => ICombatantController;
