import { HTMLTemplateResult, html, nothing } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import { attributeBonus, d20 } from "../common/utils";
import Logger from "../common/Logger";
import { ICombatController } from "./types";
import { ICombatantController } from "../combatant/types";
import { ActionName, Combat, Combatant } from "../common/types";
import { CombatantAction } from "../actions/types";
import { combatantFactory } from "../combatant/factories/CombatantFactory";
import CombatFactory from "./factories/CombatFactory";

const logger = Logger.instance;

export default class CombatController implements ICombatController {
  private _combatantControllers: ICombatantController[] = [];

  isStarted(combat: Combat): boolean {
    return combat.order.length !== 0;
  }

  isFinished(combat: Combat): boolean {
    const alivePerGroup = combat.groups.map(
      (group) =>
        group.filter(
          (id) => combatantFactory.get(id)!.combatant.hitPoints.value > 0
        ).length
    );
    const remainingGroups = alivePerGroup.filter(
      (remainingCombatant) => remainingCombatant > 0
    ).length;

    return remainingGroups <= 1;
  }

  start(combat: Combat): Combat {
    logger.info("Begin combat");
    this._combatantControllers = combat.groups
      .flat()
      .map(
        (combatant: string): ICombatantController =>
          combatantFactory.get(combatant)!
      );

    logger.separator();

    return combat;
  }

  beginTurn(combat: Combat): Combat {
    logger.info(`Begin turn ${combat.turn} round ${combat.round}`);
    logger.separator();
    const controller = this.getActiveCombatant(combat);
    if (!controller) {
      logger.info(`Unable to pick active combatant`);
      return combat;
    }

    logger.info(`Active combatant ${controller.combatant.name}`);
    controller.combatant.availableActions.value =
      controller.combatant.availableActions.max;
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

  rollInitiatives(combat: Combat): Combat {
    logger.info(`Rolling initiatives`);
    logger.separator();

    const rolls = this._combatantControllers.map((controller, index) => {
      const roll = controller.initiativeRoll(combat);
      logger.info(`${controller.combatant.name} initiative score: ${roll}`);

      return {
        roll: controller.initiativeRoll(combat),
        controller,
        index,
      };
    });

    rolls.sort((a, b) => {
      let valueA = a.roll;
      let valueB = b.roll;

      while (valueA === valueB) {
        logger.info(`${a.controller.combatant.name} and ${b.controller.combatant.name} initiative scores: ${a.roll}
  Reroll for ${a.controller.combatant.name} and ${b.controller.combatant.name}`);
        valueA =
          d20() + attributeBonus(a.controller.combatant.attributes.dexterity);
        valueB =
          d20() + attributeBonus(b.controller.combatant.attributes.dexterity);
        logger.info(`${a.controller.combatant.name} rerolled score: ${valueA}`);
        logger.info(`${b.controller.combatant.name} rerolled score: ${valueB}`);
      }

      return valueB - valueA;
    });

    const order = rolls.map((roll) => roll.index);

    logger.info(`Initiative roll result: [${order.join(", ")}]`);
    logger.separator();
    combat = { ...combat, order, round: 0, turn: 0 };

    return combat;
  }

  end(combat: Combat): Combat {
    logger.info("End combat");
    logger.separator();
    return combat;
  }

  get logs(): HTMLTemplateResult[] {
    return Logger.logs;
  }

  get combatantControllers(): ICombatantController[] {
    return this._combatantControllers;
  }

  getMenu(combat: Combat) {
    if (!this.isStarted(combat)) {
      return CombatFactory.instance.menu("order");
    }

    if (!this.isFinished(combat)) {
      return CombatFactory.instance.menu("turn");
    }

    return nothing;
  }

  getCombatantActionWidget(
    action: ActionName,
    combatant: Combatant,
    combat: Combat
  ) {
    const controller = this.getActiveCombatant(combat);
    const target = controller?.target;

    return html`<div>
      ${action}
      <input
        type="text"
        readonly
        placeholder="target"
        value=${ifDefined(target?.name)}
      />
      <button
        ?disabled=${!combatant.availableActions.value || !target}
        @click=${(e: Event) => {
          e.stopPropagation();
          e.target!.dispatchEvent(
            new CustomEvent<CombatantAction>("combatantaction", {
              bubbles: true,
              composed: true,
              detail: {
                action: action,
                source: combatantFactory.get(combatant.id)!,
                combat: combat,
                target: combatantFactory.get(target!.id)!,
              },
            })
          );
        }}
      >
        use
      </button>
    </div>`;
  }

  getActiveCombatant(combat: Combat): ICombatantController | undefined {
    if (!this.isStarted(combat) || combat.turn >= combat.order.length) {
      return;
    }

    return this._combatantControllers[combat.order[combat.turn]];
  }
}
