import { Combat, Combatant, ICombatantController } from "./types";
import { attributeBonus, d20, dn } from "./utils";

/* export default class CombatantController implements ICombatantController {
  self: Combatant;
  target?: Combatant;

  attackRoll(_: Combat): number {
    if (!this.self) return Number.NaN;

    return d20() + attributeBonus(this.self.attributes.strength);
  }

  damageRoll(_: Combat): number {
    if (!this.self) return Number.NaN;

    return dn(6)() + attributeBonus(this.self.attributes.strength);
  }
}
 */
