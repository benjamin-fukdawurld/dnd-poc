import { ICombatController } from "./combat/types";
import { Combat } from "./common/types";

export interface CombatContextObject {
  combat: Combat;
  controller: ICombatController;
}
