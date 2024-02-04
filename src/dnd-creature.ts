import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";

import { consume } from "@lit/context";
import { CombatContextObject, combatContext } from "./context";
import { Combatant } from "./types";

import goblin from "./assets/images/goblin.png";
import shield from "./assets/images/shield.svg?raw";

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

    .class-armor {
      position: relative;
      width: 2.5rem;
      height: 2.5rem;
    }

    .class-armor-icon svg,
    .class-armor-value {
      position: absolute;
      width: 2.5rem;
      height: 2.5rem;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }

    .class-armor-value {
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;

  @consume({ context: combatContext, subscribe: true })
  context!: CombatContextObject;

  @property({ type: String })
  creatureName!: string;

  get combatant(): Combatant | undefined {
    return this.context.combat.combatants.find(
      (current) => current.name === this.creatureName
    );
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
    if (!combatant) {
      return nothing;
    }

    const isActive = this.isActive(combatant);
    const isTarget = this.context.controller.target === this.combatant;

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
      <img src=${goblin} />
      <h4 class="name">${this.creatureName}</h4>
      <input
        type="range"
        value=${this.combatant.healthPoints.value}
        max=${this.combatant.healthPoints.max}
        min=${this.combatant.healthPoints.min}
        min="0"
      />
      <section class="class-armor">
        <div class="class-armor-icon">${unsafeSVG(shield)}</div>
        <div class="class-armor-value">${combatant.armorClass}</div>
      </section>
    </article>`;
  }
}
