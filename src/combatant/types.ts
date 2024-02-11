import { HTMLTemplateResult, nothing } from "lit";
import { AttributeName, Combat, Combatant, Position } from "../common/types";
import { CombatantAction } from "../actions/types";

export interface ICombatantController {
  combatant: Combatant;
  target?: Combatant;

  image: HTMLTemplateResult | typeof nothing;

  handleAction: (action: CombatantAction) => Combat;

  applyDamages: (dmg: number, combat: Combat) => Combat;
  applyHealings: (heal: number, combat: Combat) => Combat;

  beginTurn: (combat: Combat) => Combat;
  endTurn: (combat: Combat) => Combat;

  initiativeRoll: (combat: Combat) => number;
  attackRoll: (combat: Combat) => number;
  damageRoll: (combat: Combat) => number;
  savingThrow: (attribute: AttributeName, combat: Combat) => number;

  squaredDistance: (position: Position) => number;
}

export type CombatantBuilder = (fragment: Partial<Combatant>) => Combatant;
export type CombatantControllerBuilder = (
  fragment: Partial<ICombatantController> &
    Pick<ICombatantController, "combatant">
) => ICombatantController;
