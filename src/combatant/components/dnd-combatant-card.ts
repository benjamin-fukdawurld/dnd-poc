import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";

import { consume } from "@lit/context";

import { CombatContextObject, combatContext } from "../../context";
import { ICombatantController } from "../types";
import { Combatant } from "../../common/types";

import shield from "../../assets/images/shield.svg?raw";
import heart from "../../assets/images/heart.svg?raw";
import { getImage } from "../../common/ImageFactory";
import { combatantFactory } from "../factories/CombatantFactory";

@customElement("dnd-combatant-card")
export class DndCombatantCard extends LitElement {
  static styles = css`
    article {
      position: relative;
      border: outset 3px #9994;
      padding: 1rem 0.5rem;
      background-color: #bbba;
      backdrop-filter: blur(6px);
    }

    article.active {
      border: inset 3px blue;
    }

    article.target {
      border: inset 3px red;
    }

    h4,
    h5,
    ul {
      margin: 0;
    }

    img {
      width: 6rem;
      height: 6rem;
      object-fit: contain;
      object-position: center;
    }

    .order {
      position: absolute;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      margin: 0.125rem;
      top: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: blue;
      border: solid 2px white;
      color: white;
      font-weight: 700;
    }

    .info {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      margin-top: 0.5rem;
    }

    .class-armor,
    .hit-points {
      position: relative;
      width: 2.5rem;
      height: 2.5rem;
    }

    .class-armor-icon svg,
    .class-armor-value,
    .hit-points-icon svg,
    .hit-points-value {
      position: absolute;
      width: 2.5rem;
      height: 2.5rem;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }

    .class-armor-value,
    .hit-points-value {
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .class-armor svg {
      fill: gray;
    }

    .hit-points svg {
      fill: red;
    }

    .healthbar {
      height: 1rem;
      background-color: floralwhite;
      border-radius: 0.25rem;
      border: solid 1px lightgray;
      padding: 0.125rem;
    }

    .healthbar-fill {
      height: 100%;
      border-radius: 0.125rem;
    }
  `;

  @consume({ context: combatContext, subscribe: true })
  context!: CombatContextObject;

  @property({ type: String })
  combatantId!: string;

  @property({ type: Boolean })
  noinfo?: boolean;

  get combatant():
    | {
        controller?: ICombatantController;
        order?: number;
      }
    | undefined {
    const result = combatantFactory.get(this.combatantId);
    const order = this.context.combat.order.findIndex((index) => {
      return this.context.controller.combatantControllers[index] === result;
    });

    return result
      ? {
          controller: result,
          order: order < 0 ? undefined : order,
        }
      : undefined;
  }

  get combatantController(): ICombatantController | undefined {
    return combatantFactory.get(this.combatantId);
  }

  isActive(combatant: Combatant): boolean {
    const ctrl = this.context.controller.getActiveCombatant(
      this.context.combat
    );
    if (!ctrl) {
      return false;
    }

    return ctrl.combatant === combatant;
  }

  hasRemainingActions(combatant: Combatant): boolean {
    return combatant.availableActions.value > 0;
  }

  healthPercentage(combatant: Combatant): number {
    return Math.max(
      0,
      Math.min(
        100,
        Math.floor((combatant.hitPoints.value / combatant.hitPoints.max) * 100)
      )
    );
  }

  healthBarColor(val: number): string {
    switch (true) {
      case val < 10:
        return "red";

      case val < 25:
        return "orangered";

      case val < 50:
        return "gold";

      case val < 75:
        return "yellowgreen";

      default:
        return "green";
    }
  }

  render() {
    const controls = this.combatant;
    if (!controls) {
      return nothing;
    }
    const { controller, order } = controls;
    const combatant = controller!.combatant;

    const activeCombatant = this.context.controller.getActiveCombatant(
      this.context.combat
    );
    const isActive =
      activeCombatant !== undefined && activeCombatant === controls.controller;
    const isTarget =
      activeCombatant !== undefined && activeCombatant.target === combatant;

    const health = this.healthPercentage(combatant);

    let healthbarColor = this.healthBarColor(health);

    return html` <article
      class=${`${isActive ? "active" : ""} ${isTarget ? "target" : ""}`}
      @click=${(e: Event) => {
        e.stopPropagation();
        this.dispatchEvent(
          new CustomEvent<Combatant>("combatantselected", {
            bubbles: true,
            composed: true,
            detail: combatant,
          })
        );
      }}
    >
      ${order === undefined
        ? nothing
        : html`<div class="order">${order + 1}</div>`}
      ${combatant.imageId ? getImage(combatant.imageId) : nothing}
      <h4 class="name">${combatant.name}</h4>
      <div class="healthbar">
        <div
          class="healthbar-fill"
          style=${`width: ${
            combatant.hitPoints.value <= 0 ? 0 : health
          }%; background-color: ${healthbarColor};`}
        ></div>
      </div>
      ${this.noinfo
        ? nothing
        : html`<div class="info">
            <section class="class-armor">
              <div class="class-armor-icon">${unsafeSVG(shield)}</div>
              <div class="class-armor-value">${combatant.armorClass}</div>
            </section>

            <section class="hit-points">
              <div class="hit-points-icon">${unsafeSVG(heart)}</div>
              <div class="hit-points-value">${combatant.hitPoints.value}</div>
            </section>
          </div>`}
    </article>`;
  }
}
