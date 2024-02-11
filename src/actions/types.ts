import { ICombatantController } from "../combatant/types";
import { Combat, Position } from "../common/types";

export type CombatantActionBase = {
  source: ICombatantController;
  combat: Combat;
};

export type CombatantAction = CombatantActionBase &
  (
    | {
        action: "attack";
        target: ICombatantController;
      }
    | {
        action: "cure wounds";
        target: ICombatantController;
        level: number;
      }
    | {
        action: "fireball";
        position: Position;
        level: number;
      }
  );

export type ActionName = CombatantAction["action"];
