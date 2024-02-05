import Logger from "../../common/Logger";
import { attributeBonus } from "../../common/utils";
import { CombatantAction } from "../types";

const logger = Logger.instance;

export function attack({ source, target, combat }: CombatantAction) {
  logger.info(`${source.combatant.name} attack ${target.combatant.name}`);
  const attackRoll = source.attackRoll(combat);
  --source.combatant.availableActions.value;

  logger.info(`${source.combatant.name} attack roll: ${attackRoll}`);
  if (attackRoll >= target.combatant.armorClass) {
    const dmg = source.damageRoll(combat);
    logger.info(
      `${source.combatant.name} attack ${target.combatant.name}: Success`
    );

    target.applyDamages(dmg, combat);
    logger.info(
      `${source.combatant.name} attack ${target.combatant.name}: Applies ${dmg} Damage(s)`
    );
  } else {
    logger.info(
      `${source.combatant.name} attack ${target.combatant.name}: Failure`
    );
  }

  logger.separator();

  return combat;
}

export function cureWounds({ source, target, combat }: CombatantAction) {
  logger.info(
    `${source.combatant.name} cast 'Cure Wounds' on ${target.combatant.name}`
  );
  const value = Math.floor(
    Math.random() * 7 + 1 + attributeBonus(source.combatant.attributes.charisma)
  );
  logger.info(
    `${source.combatant.name} heals ${target.combatant.name}: Restores ${value} Hit Points`
  );
  --source.combatant.availableActions.value;

  target.applyHealings(value, combat);

  logger.separator();

  return combat;
}
