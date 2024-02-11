import { ICombatController } from "../../combat/types";
import { combatantFactory } from "../../combatant/factories/CombatantFactory";
import { ICombatantController } from "../../combatant/types";
import Logger from "../../common/Logger";
import { attributeBonus, d20, dn, ndn } from "../../common/utils";
import { CombatantAction } from "../types";

const logger = Logger.instance;

export function attack({
  action,
  source,
  target,
  combat,
}: CombatantAction & { action: "attack" }) {
  logger.info(`${source.combatant.name} attacks ${target.combatant.name}`);
  const attackRoll = source.attackRoll(combat);
  --source.combatant.availableActions.value;

  logger.info(`${source.combatant.name} attack roll: ${attackRoll}`);
  if (attackRoll >= target.combatant.armorClass) {
    const dmg = source.damageRoll(combat);
    logger.info(
      `${source.combatant.name} attacks ${target.combatant.name}: Success`
    );

    target.applyDamages(dmg, combat);
    logger.info(
      `${source.combatant.name} attacks ${target.combatant.name}: Applies ${dmg} Damage(s)`
    );
  } else {
    logger.info(
      `${source.combatant.name} attacks ${target.combatant.name}: Failure`
    );
  }

  logger.separator();

  return combat;
}

export function cureWounds({
  source,
  target,
  combat,
  level,
}: CombatantAction & { action: "cure wounds" }) {
  logger.info(
    `${source.combatant.name} casts 'Cure Wounds' on ${target.combatant.name}`
  );
  const dice = ndn(Math.max(1, level))(8);

  const value = dice.reduce(
    (total, value) => total + value,
    attributeBonus(source.combatant.attributes.charisma)
  );
  logger.info(
    `${source.combatant.name} heals ${target.combatant.name}: Restores ${value} Hit Points`
  );
  --source.combatant.availableActions.value;

  target.applyHealings(value, combat);

  logger.separator();

  return combat;
}

export function fireball({
  source,
  position,
  level,
  combat,
}: CombatantAction & { action: "fireball" }) {
  logger.info(
    `${source.combatant.name} casts 'fireball' at { x: ${position.x}, y: ${position.y} }`
  );
  const dice = ndn(8 + Math.max(0, level - 3))(6);

  let dmg = 0;
  for (const cur of dice) {
    dmg += cur;
  }
  const combatants = combat.groups
    .flat()
    .map((id) => combatantFactory.get(id))
    .filter((controller) => {
      if (!controller) {
        return false;
      }

      return controller.squaredDistance(position) <= 16;
    }) as ICombatantController[];

  for (const controller of combatants) {
    logger.info(
      `${source.combatant.name} casts fireball: touch ${controller.combatant.name}`
    );
    logger.separator();

    const dexSave = controller.savingThrow("dexterity", combat);
    logger.info(
      `${source.combatant.name} casts fireball: ${controller.combatant.name} dexterity saving throw: ${dexSave}`
    );

    let appliedDmg = dmg;

    if (dexSave >= 15) {
      appliedDmg = Math.floor(dmg / 2);
      logger.info(
        `${source.combatant.name} casts fireball: ${controller.combatant.name} dexterity saving succeed`
      );
    } else {
      logger.info(
        `${source.combatant.name} casts fireball: ${controller.combatant.name} dexterity saving throw failed`
      );
    }

    logger.info(
      `${source.combatant.name} casts fireball: Applies ${appliedDmg} Damage(s) on ${controller.combatant.name}`
    );
    controller.applyDamages(appliedDmg, combat);
    logger.separator();
  }
  --source.combatant.availableActions.value;

  return combat;
}
