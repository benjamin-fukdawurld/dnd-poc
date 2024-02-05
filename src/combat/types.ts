import { HTMLTemplateResult, nothing } from "lit";
import { ActionName, Combat, Combatant } from "../common/types";
import { ICombatantController } from "../combatant/types";

export interface ICombatController {
  isStarted(combat: Combat): boolean;
  isFinished(combat: Combat): boolean;

  start(combat: Combat): Combat;
  rollInitiatives: (combat: Combat) => Combat;
  beginTurn: (combat: Combat) => Combat;
  endTurn: (combat: Combat) => Combat;
  end(combat: Combat): Combat;

  combatantControllers: ICombatantController[];

  logs: HTMLTemplateResult[];

  getMenu(combat: Combat): HTMLTemplateResult | typeof nothing;
  getCombatantActionWidget(
    action: ActionName,
    combatant: Combatant,
    combat: Combat
  ): HTMLTemplateResult | typeof nothing;

  getActiveCombatant: (combat: Combat) => ICombatantController | undefined;
}
