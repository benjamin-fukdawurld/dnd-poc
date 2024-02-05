import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";

import { consume } from "@lit/context";
import { CombatContextObject, combatContext } from "../context";
import { ICombatantController } from "../combatant/types";

import shield from "../assets/images/shield.svg?raw";
import heart from "../assets/images/heart.svg?raw";
import { Combatant } from "../common/types";

@customElement("dnd-creature")
export class DndCreature extends LitElement {
  static styles = css`
    article {
      border: outset 3px lightgray;
      padding: 1rem 0.5rem;
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
  creatureId!: string;

  @property({ type: Boolean })
  noinfo?: boolean;

  get combatant(): Combatant | undefined {
    return this.context.combat.combatants.find(
      (current) => current.id === this.creatureId
    );
  }

  get combatantController(): ICombatantController | undefined {
    return this.context.controller.getCombatantController(this.creatureId);
  }

  isActive(combatant: Combatant): boolean {
    return (
      this.context.controller.getActiveCombatant(this.context.combat) ===
      combatant
    );
  }

  hasRemainingActions(combatant: Combatant): boolean {
    return combatant.availableActions.value > 0;
  }

  render() {
    const combatant = this.combatant;
    const controller = this.combatantController;
    if (!combatant || !controller) {
      return nothing;
    }

    const isActive = this.isActive(combatant);
    const isTarget = this.context.controller.target === this.combatant;
    const health = Math.max(
      0,
      Math.min(
        100,
        Math.floor((combatant.hitPoints.value / combatant.hitPoints.max) * 100)
      )
    );

    let healthbarColor = "green";
    switch (true) {
      case health < 10:
        healthbarColor = "red";
        break;

      case health < 25:
        healthbarColor = "orangered";
        break;

      case health < 50:
        healthbarColor = "gold";
        break;

      case health < 75:
        healthbarColor = "yellowgreen";
        break;
    }

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
      ${controller.image}
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
