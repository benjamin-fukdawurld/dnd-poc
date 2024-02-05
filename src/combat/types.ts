import { HTMLTemplateResult, nothing } from "lit";
import { ActionName, Combat, Combatant } from "../common/types";
import { ICombatantController } from "../combatant/types";
import { CombatAction } from "../actions/types";

export interface ICombatController {
  target?: Combatant;

  logs: HTMLTemplateResult[];

  getMenu(combat: Combat): HTMLTemplateResult | typeof nothing;
  getCombatantActionWidget(
    action: ActionName,
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
