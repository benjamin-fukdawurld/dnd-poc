import { ICombatantController } from "../types";
import { Combat } from "../../common/types";
import { attributeBonus, d20, dn } from "../../common/utils";
import { getImage } from "../../common/ImageFactory";
import { CombatantAction } from "../../actions/types";
import Logger from "../../common/Logger";
import { attack, cureWounds } from "../../actions/factories/actions";

export function base(
  fragment: Partial<ICombatantController> &
    Pick<ICombatantController, "combatant">
): ICombatantController {
  return {
    applyDamages: function (
      this: ICombatantController,
      dmg: number,
      combat
    ): Combat {
      this.combatant.hitPoints.value = Math.max(
        this.combatant.hitPoints.min,
        this.combatant.hitPoints.value - dmg
      );

      return combat;
    },
    applyHealings: function (
      this: ICombatantController,
      heal: number,
      combat
    ): Combat {
      this.combatant.hitPoints.value = Math.min(
        this.combatant.hitPoints.max,
        this.combatant.hitPoints.value + heal
      );

      return combat;
    },
    handleAction: function (
      this: ICombatantController,
      action: CombatantAction
    ): Combat {
      if (!this.combatant.actions.includes(action.action)) {
        Logger.instance.error(
          `${this.combatant.name} does not have action '${action.action}'`
        );
      }

      if (action.action === "attack") {
        attack(action);
      } else if (action.action === "cure wounds") {
        cureWounds(action);
      }

      return action.combat;
    },

    beginTurn: function (this: ICombatantController, combat: Combat): Combat {
      this.combatant.availableActions.value =
        this.combatant.availableActions.max;

      return combat;
    },
    endTurn: function (this: ICombatantController, combat: Combat): Combat {
      return combat;
    },
    initiativeRoll(this: ICombatantController): number {
      return d20();
    },
    attackRoll: function (this: ICombatantController): number {
      return d20();
    },
    damageRoll: function (this: ICombatantController): number {
      return 1;
    },
    image: getImage(fragment.combatant.imageId ?? fragment.combatant.type),
    ...fragment,
  };
}

export function character(
  fragment: Partial<ICombatantController> &
    Pick<ICombatantController, "combatant">
): ICombatantController {
  return base({
    attackRoll: function (this: ICombatantController): number {
      return d20() + attributeBonus(fragment.combatant.attributes.strength);
    },
    damageRoll: function (this: ICombatantController): number {
      return dn(6)() + attributeBonus(fragment.combatant.attributes.strength);
    },
    ...fragment,
  });
}

export function goblin(
  fragment: Partial<ICombatantController> &
    Pick<ICombatantController, "combatant">
): ICombatantController {
  return base({
    attackRoll: function (this: ICombatantController): number {
      return d20() + 4;
    },
    damageRoll: function (this: ICombatantController): number {
      return dn(6)() + 2;
    },
    ...fragment,
  });
}
