import { HTMLTemplateResult, nothing } from "lit";
import { Combat, Combatant } from "../common/types";
import { ICombatantController } from "../combatant/types";
import { ActionName } from "../actions/types";

export interface ICombatController {
  logs: HTMLTemplateResult[];
  combatantControllers: ICombatantController[];

  isStarted(combat: Combat): boolean;
  isFinished(combat: Combat): boolean;

  start(combat: Combat): Combat;
  rollInitiatives: (combat: Combat) => Combat;
  beginTurn: (combat: Combat) => Combat;
  endTurn: (combat: Combat) => Combat;
  end(combat: Combat): Combat;

  getMenu(combat: Combat): HTMLTemplateResult | typeof nothing;
  getCombatantActionWidget(
    action: ActionName,
    combatant: Combatant,
    combat: Combat
  ): HTMLTemplateResult | typeof nothing;

  getActiveCombatant: (combat: Combat) => ICombatantController | undefined;
}
