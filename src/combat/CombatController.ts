import { HTMLTemplateResult, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import { attributeBonus, d20 } from "../common/utils";
import Logger from "../common/Logger";
import { ICombatController } from "./types";
import { ICombatantController } from "../combatant/types";
import { ActionName, Combat, Combatant } from "../common/types";
import { CombatActionOptions, CombatantAction } from "../actions/types";
import CombatantFactory from "../combatant/factories/CombatantFactory";
import CombatFactory from "./factories/CombatFactory";

const combatantFactory = CombatantFactory.instance;
const logger = Logger.instance;

export default class CombatController implements ICombatController {
  private _combatantControllers: Map<string, ICombatantController>;
  public target?: Combatant;

  constructor() {
    this._combatantControllers = new Map();
  }

  get logs(): HTMLTemplateResult[] {
    return Logger.logs;
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
        return CombatFactory.instance.menu("order");

      case remainingGroups > 1:
        return CombatFactory.instance.menu("turn");

      default:
        return nothing;
    }
  }

  getCombatantActionWidget(
    action: ActionName,
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
    logger.info(`Begin turn ${combat.turn} round ${combat.round}`);
    logger.separator();
    const combatant = this.getActiveCombatant(combat);
    if (!combatant) {
      logger.info(`Unable to pick active combatant`);
      return combat;
    }

    logger.info(`Active combatant ${combatant.name}`);
    combatant.availableActions.value = combatant.availableActions.max;
    this.target = undefined;
    return combat;
  }

  endTurn(combat: Combat): Combat {
    logger.info(`End turn ${combat.turn} round ${combat.round}`);
    logger.separator();
    let turn = combat.turn;
    let round = combat.round;

    ++turn;
    if (turn >= combat.order.length) {
      turn = 0;
      logger.info(`End Round${combat.round}`);
      logger.separator();
      ++round;
      logger.info(`Begin round ${combat.turn} round ${combat.round}`);
      logger.separator();
    }

    return { ...combat, turn: turn, round: round };
  }

  attack({ source, target, combat }: CombatActionOptions): Combat {
    const controller = this.getCombatantController(source.id);
    if (!controller) {
      return combat;
    }

    logger.info(`${source.name} attack ${target.name}`);
    const attackRoll = controller.attackRoll(combat);
    --source.availableActions.value;

    logger.info(`${source.name} attack roll: ${attackRoll}`);
    if (attackRoll >= target.armorClass) {
      const dmg = controller.damageRoll(combat);
      logger.info(`${source.name} attack ${target.name}: Success`);

      target.hitPoints.value -= dmg;
      logger.info(
        `${source.name} attack ${target.name}: Applies ${dmg} Damage(s)`
      );
    } else {
      logger.info(`${source.name} attack ${target.name}: Failure`);
    }

    return combat;
  }

  heal({ source, target, combat }: CombatActionOptions): Combat {
    logger.info(`${source.name} cast 'Cure Wounds' on ${target.name}`);
    const value = Math.floor(
      Math.random() * 7 + 1 + attributeBonus(source.attributes.charisma)
    );
    logger.info(
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
    logger.info(`Rolling initiatives`);
    logger.separator();
    const order = combat.combatants
      .map((current, index): [number, Combatant, number] => {
        const roll: [number, Combatant, number] = [
          d20() + attributeBonus(current.attributes.dexterity),
          current,
          index,
        ];
        logger.info(`${roll[1].name} initiative score: ${roll[0]}`);

        return roll;
      })
      .sort((a, b) => {
        let valueA = a[0];
        let valueB = b[0];

        while (valueA === valueB) {
          logger.info(`${a[1].name} and ${b[1].name} initiative scores: ${a[0]}
  Reroll for ${a[1].name} and ${b[1].name}`);
          valueA = d20() + attributeBonus(a[1].attributes.dexterity);
          valueB = d20() + attributeBonus(b[1].attributes.dexterity);
          logger.info(`${a[1].name} rerolled score: ${valueA}`);
          logger.info(`${b[1].name} rerolled score: ${valueB}`);
        }

        return valueB - valueA;
      })
      .map((current) => current[2]);

    logger.info(`Initiative roll result: [${order.join(", ")}]`);
    logger.separator();
    console.log(
      combatantFactory.buildController("character", {
        combatant: combat.combatants[0],
      })
    );
    this._combatantControllers = new Map(
      combat.combatants.map((combatant: Combatant) => [
        combatant.id,
        combatantFactory.buildController(combatant.type, { combatant })!,
      ])
    );
    combat = { ...combat, order, round: 0, turn: 0 };

    return combat;
  }
}
