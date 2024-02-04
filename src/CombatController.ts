import { html, nothing } from "lit";

import {
  Combat,
  CombatActionOptions,
  Combatant,
  ICombatController,
} from "./types";
import { LogSeparator, attributeBonus, d20 } from "./utils";

export default class CombatController implements ICombatController {
  private _logs: string[] = [];

  public target?: Combatant;

  get logs(): string[] {
    return this._logs;
  }

  log(message: string): this {
    this.logs.push(message);

    return this;
  }

  getMenu(combat: Combat) {
    if (combat.order.length === 0) {
      return html`<dnd-start-combat></dnd-start-combat>`;
    }

    return nothing;
  }

  getActiveCombatant(combat: Combat): Combatant | undefined {
    if (
      combat.combatants.length === 0 ||
      combat.order.length === 0 ||
      combat.turn < 0 ||
      combat.turn >= combat.order.length
    ) {
      return;
    }

    return combat.combatants[combat.order[combat.turn]];
  }

  beginTurn(combat: Combat): Combat {
    this.log(`Begin turn ${combat.turn} round ${combat.round} ${LogSeparator}`);
    const combatant = this.getActiveCombatant(combat);
    if (!combatant) {
      this.log(`Unable to pick active combatant`);
      return combat;
    }

    this.log(`Active combatant ${combatant.name}`);
    combatant.availableActions.value = combatant.availableActions.max;
    this.target = undefined;
    return combat;
  }

  endTurn(combat: Combat): Combat {
    this.log(`End turn ${combat.turn} round ${combat.round} ${LogSeparator}`);
    let turn = combat.turn;
    let round = combat.round;

    ++turn;
    if (turn >= combat.order.length) {
      turn = 0;
      this.log(`End Round${combat.round} ${LogSeparator}`);
      ++round;
      this.log(
        `Begin round ${combat.turn} round ${combat.round} ${LogSeparator}`
      );
    }

    return { ...combat, turn: turn, round: round };
  }

  attack({ source, target, combat }: CombatActionOptions): Combat {
    const attackRoll = source.attackRoll(source);
    --source.availableActions.value;

    this.log(`${source.name} attack roll: ${attackRoll}`);
    if (attackRoll >= target.armorClass) {
      const dmg = source.damageRoll(source);
      this.log(`${source.name} attack ${target.name}: Success`);

      target.healthPoints.value -= dmg;
      this.log(
        `${source.name} attack ${target.name}: Applies ${dmg} Damage(s)`
      );
    } else {
      this.log(`${source.name} attack ${target.name}: Failure`);
    }

    return combat;
  }

  heal({ source, target, combat }: CombatActionOptions): Combat {
    this.log(`${source.name} cast 'Cure Wounds' on ${target.name}`);
    const value = Math.floor(
      Math.random() * 7 + 1 + attributeBonus(source.attributes.charisma)
    );
    this.log(
      `${source.name} heals ${target.name}: Restores ${value} Hit Points`
    );

    target.healthPoints.value += value;
    --target.availableActions.value;
    return combat;
  }

  rollInitiatives(combat: Combat): Combat {
    this.log(`Rolling initiatives ${LogSeparator}`);
    const order = combat.combatants
      .map((current, index): [number, Combatant, number] => {
        const roll: [number, Combatant, number] = [
          d20() + attributeBonus(current.attributes.dexterity),
          current,
          index,
        ];
        this.log(`${roll[1].name} initiative score: ${roll[0]}`);

        return roll;
      })
      .sort((a, b) => {
        let valueA = a[0];
        let valueB = b[0];

        while (valueA === valueB) {
          this.log(`${a[1].name} and ${b[1].name} initiative scores: ${a[0]}
  Reroll for ${a[1].name} and ${b[1].name}`);
          valueA = d20() + attributeBonus(a[1].attributes.dexterity);
          valueB = d20() + attributeBonus(b[1].attributes.dexterity);
          this.log(`${a[1].name} rerolled score: ${valueA}`);
          this.log(`${b[1].name} rerolled score: ${valueB}`);
        }

        return valueB - valueA;
      })
      .map((current) => current[2]);

    this.log(`Initiative roll result: [${order.join(", ")}] ${LogSeparator}`);
    combat = { ...combat, order, round: 0, turn: 0 };

    return combat;
  }
}