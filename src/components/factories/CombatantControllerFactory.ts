import { Combat, ICombatantController } from "../../types";
import { attributeBonus, d20, dn } from "../../utils";
import { getImage } from "./ImageFactory";

export function buildBaseController(
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
    image: getImage(fragment.combatant.type),
    ...fragment,
  };
}

export function buildCharacterController(
  fragment: Partial<ICombatantController> &
    Pick<ICombatantController, "combatant">
): ICombatantController {
  return buildBaseController({
    attackRoll: function (this: ICombatantController): number {
      return d20() + attributeBonus(fragment.combatant.attributes.strength);
    },
    damageRoll: function (this: ICombatantController): number {
      return dn(6)() + attributeBonus(fragment.combatant.attributes.strength);
    },
    ...fragment,
  });
}

export function buildGobelinController(
  fragment: Partial<ICombatantController> &
    Pick<ICombatantController, "combatant">
): ICombatantController {
  return buildBaseController({
    attackRoll: function (this: ICombatantController): number {
      return d20() + 4;
    },
    damageRoll: function (this: ICombatantController): number {
      return dn(6)() + 2;
    },
    image: getImage(fragment.combatant.type),
    ...fragment,
  });
}

export function getCombatantController(
  fragment: Partial<ICombatantController> &
    Pick<ICombatantController, "combatant">
) {
  console.log(fragment.combatant.type);
  switch (fragment.combatant.type) {
    case "gobelin":
      return buildGobelinController(fragment);

    default:
      return buildCharacterController(fragment);
  }
}
