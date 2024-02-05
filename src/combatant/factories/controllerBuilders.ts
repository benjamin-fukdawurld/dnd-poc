import { ICombatantController } from "../types";
import { Combat } from "../../common/types";
import { attributeBonus, d20, dn } from "../../common/utils";
import { getImage } from "../../common/ImageFactory";

export function base(
  fragment: Partial<ICombatantController> &
    Pick<ICombatantController, "combatant">
): ICombatantController {
  return {
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
