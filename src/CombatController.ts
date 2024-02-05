import { html, nothing } from "lit";

import {
  Combat,
  CombatActionOptions,
  Combatant,
  CombatantAction,
  CombatantActionName,
  ICombatController,
  ICombatantController,
} from "./types";
import { LogSeparator, attributeBonus, d20 } from "./common/utils";
import { ifDefined } from "lit/directives/if-defined.js";

import { getCombatantController } from "./components/factories/CombatantControllerFactory";
import { getMenu } from "./components/factories/MenuFactory";

export default class CombatController implements ICombatController {
  private _logs: string[] = [];
  private _combatantControllers: Map<string, ICombatantController>;

  public target?: Combatant;

  constructor() {
    this._combatantControllers = new Map();
  }

  get logs(): string[] {
    return this._logs;
  }

  log(message: string): this {
    this.logs.push(message);

    return this;
  }

  getMenu(combat: Combat) {
    const alivePerGroup = combat.groups.map(
      (group) =>
        group.filter((index) => combat.combatants[index].hitPoints.value > 0)
          .length
    );
    const remainingGroups = alivePerGroup.filter(
      (remainingCombatant) => remainingCombatant > 0
    ).length;

    switch (true) {
      case combat.order.length === 0:
        return getMenu("order");

      case remainingGroups > 1:
        return getMenu("turns");

      default:
        return nothing;
    }
  }

  getCombatantActionWidget(
    action: CombatantActionName,
    combatant: Combatant,
    combat: Combat
  ) {
    return html`<div>
      ${action}
      <input
        type="text"
        readonly
        placeholder="target"
        value=${ifDefined(this.target?.name)}
      />
      <button
        ?disabled=${!combatant.availableActions.value || !this.target}
        @click=${(e: Event) => {
          e.stopPropagation();
          e.target!.dispatchEvent(
            new CustomEvent<CombatantAction>("combatantaction", {
              bubbles: true,
              composed: true,
              detail: {
                action: action,
                source: combatant,
                combat: combat,
                target: this.target!,
              },
            })
          );
        }}
      >
        use
      </button>
    </div>`;
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

  getCombatantController(id: string): ICombatantController | undefined {
    return this._combatantControllers.get(id);
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
    const controller = this.getCombatantController(source.id);
    if (!controller) {
      return combat;
    }

    this.log(`${source.name} attack ${target.name}`);
    const attackRoll = controller.attackRoll(combat);
    --source.availableActions.value;

    this.log(`${source.name} attack roll: ${attackRoll}`);
    if (attackRoll >= target.armorClass) {
      const dmg = controller.damageRoll(combat);
      this.log(`${source.name} attack ${target.name}: Success`);

      target.hitPoints.value -= dmg;
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

    target.hitPoints.value = Math.min(
      target.hitPoints.value + value,
      target.hitPoints.max
    );
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
    this._combatantControllers = new Map(
      combat.combatants.map((combatant: Combatant) => [
        combatant.id,
        getCombatantController({ combatant }),
      ])
    );
    combat = { ...combat, order, round: 0, turn: 0 };

    return combat;
  }
}
